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
var v = "data-ui-id", ie = "data-ui-context", ae = "data-ui-pc", y = "data-ui-key", oe = "data-ui-unselectable", se = "data-ui-undraggable", ce = "data-ui-unremovable", le = "data-ui-unrenamable", ue = "data-ui-no-context-menu", de = "data-ui-no-row-open", fe = "data-ui-no-row-drag", pe = "data-ui-drag-kind", me = "data-ui-drag-source", he = "data-ui-item-drop-over", ge = "data-ui-drop-boxed", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-none-removable", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-owner", we = "data-ui-context-menu-use", Te = "data-ui-action-bar", Ee = "data-ui-action-bar-key", De = "data-ui-action-bar-rest", Oe = "data-ui-menu-left-out", ke = "data-ui-in-action-bar", Ae = "ui-action-bar", je = "data-ui-row-focus", Me = "data-ui-row-cursor-waits", Ne = "data-ui-tab-out", Pe = "data-ui-cell-focus", Fe = "ui-cell-key", Ie = "data-ui-tooltip", Le = "data-ui-tooltip-placement", Re = "data-ui-tooltip-mark", ze = "data-ui-tooltip-severity", Be = "data-ui-tooltip-press", Ve = "data-ui-badge-text", He = "data-ui-badge-set", Ue = "data-ui-folds", We = "data-ui-name", Ge = "data-ui-bind-", Ke = "data-ui-into-", qe = "data-ui-bind-value", Je = (e) => `data-ui-no-${e}`, Ye = "data-ui-event-boundary", Xe = "data-ui-image-caption", Ze = "data-ui-image-crop", Qe = "data-ui-image-crop-size", $e = "ui-image", et = "data-ui-fallback-src", tt = "data-ui-image-failed", b = "data-ui-items-host", nt = "data-ui-collection-sink", rt = "data-ui-items-query", it = "data-ui-number-culture", at = "data-ui-page-culture", ot = "data-ui-pager-target", st = "data-ui-pager-page", ct = "data-ui-pager-size", lt = "data-ui-temporal-culture", ut = "data-ui-empty-template", dt = "data-ui-group-template", ft = "data-ui-empty-placeholder", pt = "data-ui-group-header", mt = "data-ui-group-anchor", ht = "data-ui-group", gt = "data-ui-value-holder", _t = "data-ui-value-end", vt = "data-ui-value-kind", yt = "items-query", bt = "data-ui-host-mode", xt = "data-ui-host-viewport", St = "data-ui-scroll-group", Ct = "data-ui-scroll-lines", wt = "data-ui-source-line", Tt = "data-ui-window-spacer", Et = "data-ui-window-pending", Dt = "data-ui-window-paged", Ot = "data-ui-window-size", kt = "data-ui-window-offset", At = "data-ui-window-total", jt = "data-ui-window-more-before", Mt = "data-ui-window-more-after", Nt = "data-ui-window-group-before", Pt = "data-ui-window-aggregates", Ft = "data-ui-form-id", It = "data-ui-forms", Lt = "data-ui-visibility", Rt = "data-ui-collapsed", zt = "data-ui-menu-group", Bt = "data-ui-menu-select", Vt = "data-ui-menu-open", Ht = "data-ui-menu-holds-current", Ut = "data-ui-menu-icons", Wt = "data-ui-menu-passive", Gt = "data-ui-menu-item-shortcut", Kt = "data-ui-menu-surface", qt = "data-ui-menu-search", Jt = "data-ui-menu-searching", Yt = "data-ui-menu-unmatched", Xt = "data-ui-drawer-toggle", Zt = "data-ui-drawer-open", Qt = "data-ui-bottom-bar", $t = "data-ui-rail-drawer", en = "data-ui-content-fills", tn = "data-ui-region", nn = "data-ui-menu-item-kind", rn = "ui-menu", x = "ui-menu-item", an = "ui-menu-item--checked", on = "ui-menu-item--selected", sn = "ui-menu--rail", cn = "ui-menu--nested", ln = `[${nn}="header"], [${nn}="separator"]`, un = `[${zt}] > .${x}`, dn = `.${x}:not(${ln})`, fn = `${un}, .${x}[${nn}="check"]`, pn = "data-ui-shortcut", mn = "data-ui-collapse-toggle", hn = "data-ui-folding", gn = "data-ui-column-limits", _n = "data-ui-row-limits", vn = "data-ui-splitter-step", yn = "data-ui-table-column", bn = "data-ui-table-hide-below", xn = "data-ui-table-starts-hidden", Sn = "data-ui-table-hidden", Cn = "ui-table__row", wn = "ui-table__scroll", Tn = "ui-table__header", En = "ui-table__resizer", Dn = "ui-tree", On = "ui-tree__row", kn = "ui-tree-node", An = "data-ui-tree-drop", jn = "ui-tree__row--filtered", Mn = "data-ui-table-last", Nn = "data-ui-table-reordering", Pn = "data-ui-table-dragging", Fn = "data-ui-table-drop", In = "data-ui-table-scrolled", Ln = "data-ui-table-scrollbar", Rn = "data-ui-no-row-select", zn = "data-ui-tree-parent", Bn = "data-ui-tree-children", Vn = "data-ui-tree-folder", Hn = "data-ui-tree-expanded", Un = "data-ui-tree-title", Wn = "data-ui-tree-loading", Gn = "data-ui-tree-drop-target", Kn = "data-ui-tree-boot", qn = "data-ui-tree-draggable", Jn = "data-ui-row-editing", Yn = "data-ui-boxed-editor", Xn = "data-ui-row-idle", Zn = "data-ui-step-collapsed", Qn = "data-ui-step-end", $n = "data-ui-row-bar", er = "data-ui-image-source", tr = "data-ui-file-max-size", nr = "data-ui-file-pick", rr = "data-ui-file-drop-target-id", ir = "data-ui-service-worker", ar = "data-ui-theme", or = "data-ui-theme-colors", sr = "data-ui-words", cr = "data-ui-language-switcher", lr = "data-ui-language", ur = "data-ui-splitting", dr = "data-ui-keyboard-up", fr = "data-ui-connection", pr = "data-ui-split-folded", mr = "data-ui-pointer-focus", hr = "data-ui-focus-within", gr = "data-ui-popup-hover", _r = "data-ui-inner-pointer", vr = "data-ui-selection", yr = "data-ui-selected", br = "data-ui-selected-key", xr = "data-ui-selected-keys", Sr = "data-ui-bind-selected-key", Cr = "data-ui-tabs-selected", wr = "data-ui-tab-caption", Tr = "data-ui-tab-pinned", Er = [
	Lt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Dr = "data-ui-submit-form-id", S = `[${v}]`, Or = "data-ui-href", kr = "ui-disabled", Ar = "ui-loading", jr = "ui-readonly", Mr = "ui-hidden", Nr = "ui-dialog__surface", Pr = "ui-flyout__content", Fr = `.ui-context-menu, .ui-split-button__menu, .${Pr}`, Ir = "data-ui-focus-holder", Lr = "data-ui-owns-keys", Rr = "[role='listbox'], [role='menu'], [role='dialog']", zr = "ui-select__trigger", Br = `.${zr}`, Vr = "ui-button", Hr = `${Vr} ui-button--ghost ui-button--small`, Ur = "ui-select", Wr = "data-ui-text-title", Gr = "data-ui-text-description", Kr = "data-ui-text-icon", qr = "data-ui-text-badge-icon", Jr = "data-ui-text-badge-text", Yr = "ui-card__header--empty", Xr = "ui-text-input", Zr = "ui-invalid", Qr = "data-ui-validation-message", $r = {
	componentId: v,
	key: y,
	selected: yr,
	selectedKey: br,
	selectedKeys: xr,
	unselectable: oe,
	rowFocus: je,
	cellFocus: Pe,
	cellKey: Fe,
	itemsHost: b,
	valueHolder: gt,
	bindValue: qe,
	noRowOpen: de,
	noRowDrag: fe,
	eventBoundary: Ye,
	focusHolder: Ir,
	ownsKeys: Lr,
	tooltip: Ie,
	tooltipPlacement: Le,
	contextMenu: Se,
	contextMenuUse: we,
	actionBar: Te,
	actionBarKey: Ee,
	actionBarRest: De,
	disabledClass: kr,
	loadingClass: Ar,
	readOnlyClass: jr,
	hiddenClass: Mr,
	buttonClass: Vr,
	selectClass: Ur,
	textInputClass: Xr,
	invalidClass: Zr,
	validationMessage: Qr,
	sourceLine: wt,
	textDescription: Gr,
	popupSelector: Rr,
	listTriggerSelector: Br,
	tableRowClass: Cn,
	tableScrollClass: wn,
	tableHeaderClass: Tn,
	tableResizerClass: En,
	tableHidden: Sn,
	hostMode: bt,
	windowOffset: kt,
	windowTotal: At,
	windowSize: Ot,
	windowMoreAfter: Mt,
	windowAggregates: Pt,
	itemsQuery: rt,
	valueKind: vt,
	itemsQueryKind: yt,
	menuItemClass: x,
	menuItemKind: nn,
	menuItemCheckedClass: an
};
function ei(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function ti(e) {
	return e.replace(/(\p{Ll})(\p{Lu})/gu, "$1-$2").replace(/([\p{L}\p{Nd}])(\p{Lu}\p{Ll})/gu, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var ni = 0;
function ri(e, t) {
	return e.id.length === 0 && (ni++, e.id = `${t}-${ni}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function ii(e, t, n) {
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
var ai = {
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
}, oi = class {
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
		return this.bindingsByComponentAndPropertyId.get(ki(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(ki(e, Oi(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Ai(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Di(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Di(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(ji(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(ki(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(ki(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Di(e.eventName), n = w(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Ai(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(ji(t, e.dynamicParameters ?? []), e);
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
function si(e) {
	return C(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function ci(e) {
	return e == null ? "OneWay" : C(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function li(e) {
	return C(e, ["Property", "Event"]);
}
function ui(e) {
	return e == null ? "SetProperty" : C(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function di(e) {
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
function fi(e) {
	return C(e, ["Ascending", "Descending"]);
}
function pi(e) {
	return C(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function mi(e) {
	return C(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function hi(e) {
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
function gi(e) {
	return C(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function _i(e) {
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
function vi(e) {
	return typeof e == "string" ? e : "";
}
function yi(e) {
	return C(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function bi(e) {
	return typeof e == "string" ? e.trim() : "";
}
function xi(e) {
	return C(e, ["Auto", "Smooth"]);
}
function Si(e) {
	return C(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Ci(e) {
	return C(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function wi(e) {
	return C(e, ["Light", "Dark"]);
}
function Ti(e) {
	return C(e, ["Horizontal", "Vertical"]);
}
function Ei(e) {
	return C(e, ["Polite", "Assertive"]);
}
function Di(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Oi(e) {
	return e?.trim() ?? "";
}
function ki(e, t) {
	return `${e}:${Oi(t)}`;
}
function Ai(e, t) {
	return `${e}:${Di(t)}`;
}
function ji(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Mi = class {
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
		let a = w(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Ge}${ti(r.propertyName)}="${ei(a)}"]` : null;
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
		return ii(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${ti(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Ni(e) {
	return Li(e, ae);
}
function Pi(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Ri(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function Fi(e, t) {
	let n = Ni(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Pi(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ii(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = Ri(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function Li(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Ri(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function zi(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Bi = class {
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
		let e = this.root.querySelectorAll(S), t = this.root.querySelector(`[${pt}]`) !== null;
		for (let n of e) {
			let e = T(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && Wi(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return ri(e, t);
	}
	findComponentParts(e, t, n) {
		return zi(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(Ui(t)) ?? [];
		if (n.length > 0 && n.every((e) => Fi(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => Fi(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Ni(n);
			if (e === 0) continue;
			let r = Pi(n, e);
			if (r.length !== e) continue;
			let i = Ui(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(S);
			if (e === null || !Gi(this.root, e)) return null;
			let r = T(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Pi(e, Ni(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function T(e) {
	return Li(e, v);
}
function Vi(e) {
	let t = e.closest(S), n = t === null ? 0 : T(t);
	return n > 0 ? n : null;
}
function Hi(e) {
	let t = e.closest(S), n = t === null ? 0 : T(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Pi(t, Ni(t))
	};
}
function Ui(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Wi(e) {
	return Ni(e) === 0;
}
function Gi(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Ki(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = qi(n);
	switch (Ji(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Yi(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Yi(r, i) ? "many" : "other";
		case "ru":
		case "uk": return Xi(r, i);
		case "pl": return Zi(r, i);
		default: return "other";
	}
}
function qi(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Ji(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Yi(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function Xi(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Zi(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Qi(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var $i = {
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
function ea(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return $i;
	try {
		return {
			...$i,
			...JSON.parse(t)
		};
	} catch {
		return $i;
	}
}
var ta = [
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
function na(e, t, n) {
	if (t == null || t.trim().length === 0) return `${la(e.getFullYear(), 4)}-${la(e.getMonth() + 1, 2)}-${la(e.getDate(), 2)} ${la(e.getHours(), 2)}:${la(e.getMinutes(), 2)}:${la(e.getSeconds(), 2)}`;
	let r = "", i = ra(t);
	for (let a = 0; a < t.length;) {
		let o = sa(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += ca(o, e, n, i), a += o.length;
	}
	return r;
}
function ra(e) {
	for (let t = 0; t < e.length;) {
		let n = sa(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var ia = /^[-./:,]$/, aa = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function oa(e) {
	for (let t = 0; t < e.length;) {
		let n = sa(e, t);
		if (n !== null && aa.has(n) || n === null && !ia.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function sa(e, t) {
	for (let n of ta) if (e.startsWith(n, t)) return n;
	return null;
}
function ca(e, t, n, r) {
	let i = t.getHours(), a = Oa(i);
	switch (e) {
		case "yyyy": return la(t.getFullYear(), 4);
		case "yy": return la(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return la(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return la(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return la(i, 2);
		case "H": return String(i);
		case "hh": return la(a, 2);
		case "h": return String(a);
		case "mm": return la(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return la(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function la(e, t) {
	return String(e).padStart(t, "0");
}
var ua = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function da(e) {
	let t = ua.exec(e.trim());
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
function fa(e) {
	return pa(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function pa(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var ma = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function ha(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = sa(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += ga(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function ga(e, t) {
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
function _a(e, t, n) {
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
		let a = sa(t, e);
		if (a === null) {
			if (!va(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!ya(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? Ea(i) : null;
}
function va(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return ia.test(n) ? t.position >= e.length || !ia.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function ya(e, t, n, r) {
	switch (n) {
		case "yyyy": return ba(t, "year", Ca(e, t, 4, 4));
		case "yy": return ba(t, "year", xa(Ca(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return ba(t, "month", Sa(wa(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return ba(t, "month", Ca(e, t, 1, 2));
		case "dddd":
		case "ddd": return wa(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return ba(t, "day", Ca(e, t, 1, 2));
		case "HH":
		case "H": return ba(t, "hour", Ca(e, t, 1, 2));
		case "hh":
		case "h": return ba(t, "hour12", Ca(e, t, 1, 2));
		case "mm":
		case "m": return ba(t, "minute", Ca(e, t, 1, 2));
		case "ss":
		case "s": return ba(t, "second", Ca(e, t, 1, 2));
		case "tt": return Ta(e, t, r);
		default: return !1;
	}
}
function ba(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function xa(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Sa(e) {
	return e === null ? null : e + 1;
}
function Ca(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function wa(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Ta(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ea(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > pa(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Da = {
	readCulture: ea,
	format: na,
	parse: da,
	toDate: fa
};
function Oa(e) {
	return e % 12 == 0 ? 12 : e % 12;
}
//#endregion
//#region src/rendering/timestamp-format.ts
var ka = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Aa = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function ja(e) {
	let t = e?.trim() ?? "";
	if (!Aa.test(t)) return null;
	let n = Date.parse(ka.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Ma(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Na(e) {
	return e === "relative" || e === "relative-date";
}
var Pa = {
	...$i,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Fa(e, t, n, r) {
	if (t === "relative") return Ga(e - r, n.language);
	if (t === "relative-date") {
		let t = Ia(e, r);
		if (t !== null) return za(n.language).format(t, "day");
	}
	let i = n.temporal ?? Pa, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : Qi(i, !1);
	return na(new Date(e), a, i);
}
function Ia(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Wa);
	return Math.abs(i) <= 1 ? i : null;
}
function La(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Ba(t)) + e.slice(1);
}
var Ra = /* @__PURE__ */ new Map();
function za(e) {
	let t = Ra.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Ba(e), { numeric: "auto" }), Ra.set(e, t)), t;
}
function Ba(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var Va = 1e3, Ha = 60 * Va, Ua = 60 * Ha, Wa = 24 * Ua;
function Ga(e, t) {
	let n = za(t), r = Math.abs(e);
	return r < 45 * Va ? n.format(0, "second") : r < 45 * Ha ? n.format(Math.round(e / Ha), "minute") : r < 22 * Ua ? n.format(Math.round(e / Ua), "hour") : r < 26 * Wa ? n.format(Math.round(e / Wa), "day") : r < 320 * Wa ? n.format(Math.round(e / (30.4375 * Wa)), "month") : n.format(Math.round(e / (365.25 * Wa)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Ka = "count";
function qa(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Ja(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Ya = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function Xa(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && ja(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Ya.has(t.format));
}
function Za(e) {
	if (typeof e != "object" || !e) return !1;
	if (Xa(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (Za(t)) return !0;
	return !1;
}
function Qa(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function $a(e, t, n) {
	return qa(e) ? no(n, e.key, e.args) : Ja(e) ? eo(n, e.text) : t && typeof e == "string" ? eo(n, e) : e;
}
function eo(e, t) {
	return t.trim().length === 0 || !to(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function to(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function no(e, t, n) {
	let r = n?.[Ka];
	return ro(typeof r == "number" ? e.lookup(`${t}.${Ki(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Ja(t) ? eo(e, t.text) : no(e, t.key, t.args), e.writeMoment);
}
function ro(e, t, n, r = Qa) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = io(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += oo(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function io(e, t) {
	let n = t + 1;
	for (; n < e.length && ao(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function ao(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function oo(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : qa(e) ? t === void 0 ? ro(e.key, e.args, void 0, n) : t(e) : Ja(e) ? t === void 0 ? e.text : t(e) : Xa(e) ? n(ja(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var so = 15e3, co = /* @__PURE__ */ new Set(), lo = null;
function uo(e) {
	co.add(e), lo === null && (lo = setInterval(fo, so));
}
function fo() {
	for (let e of [...co]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || co.delete(e);
	}
	co.size === 0 && lo !== null && (clearInterval(lo), lo = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var po = 256, mo = 512, ho = "script[type='application/json'][data-ui-strings]", go = "#text", _o = `[${sr}*='"moment"']`, vo = class {
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
		let t = e.querySelector(ho)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), no(this, e, t);
	}
	translate(e, t) {
		return no(this, e, t);
	}
	writeMoment = (e, t) => (Na(t) && this.noteRelative(), Fa(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && uo(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return $a(e, t, this);
	}
	resolveText(e) {
		return $a(e, !0, this);
	}
	write(e, t, n, r) {
		wo(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		wo(e, t, $a(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (qa(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Ja(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		wo(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		xo(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		To(e, (e) => {
			for (let n of e.querySelectorAll(t ? _o : `[${sr}]`)) for (let [e, r] of Object.entries(Co(n))) {
				if (t && !Za(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && wo(n, e === go ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return $a(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > mo || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && to(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += po) try {
			let a = await e(t, n.slice(r, r + po));
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
function yo(e) {
	let t = !1;
	return To(e, (e) => {
		t ||= e.querySelector(_o) !== null;
	}), t;
}
function bo(e, t) {
	e.hasAttribute("data-ui-words") && xo(e, t, null);
}
function xo(e, t, n) {
	let r = Co(e), i = t ?? go;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(sr) : e.getAttribute("data-ui-words") !== a && e.setAttribute(sr, a);
}
function So(e) {
	let t = Co(e)[go];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Co(e) {
	let t = e.getAttribute(sr);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function wo(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function To(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) To(n.content, t);
}
var E = new vo();
function Eo(e, t) {
	let n = Ja(e) ? e.text : e;
	return E.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/updates/row-idle.ts
var Do = "row-idle";
function Oo(e) {
	let t = e.parentElement;
	t !== null && (Mo(t) ? ko(t) : !t.hasAttribute("data-ui-id") && t.parentElement !== null && Mo(t.parentElement) && ko(t.parentElement));
}
function ko(e) {
	let t = Ao(e);
	e.hasAttribute("data-ui-row-idle") !== t && e.toggleAttribute(Xn, t);
}
function Ao(e) {
	for (let t of e.children) {
		if (t.hasAttribute("data-ui-id")) {
			if (jo(t)) return !0;
			continue;
		}
		for (let e of t.children) if (e.hasAttribute("data-ui-id") && jo(e)) return !0;
	}
	return !1;
}
function jo(e) {
	return e.classList.contains("ui-disabled") || e.classList.contains("ui-loading");
}
function Mo(e) {
	return e.hasAttribute("data-ui-key") && e.parentElement?.hasAttribute("data-ui-items-host") === !0;
}
//#endregion
//#region src/interactions/interactive-state.ts
var No = `.${kr}, .${Ar}, [inert]`;
function Po(e) {
	return `:scope > [${v}]:is(${e}), :scope > :not([${v}]) > [${v}]:is(${e})`;
}
var Fo = Po(No), Io = /* @__PURE__ */ new Map();
function D(e) {
	return e.closest(No) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function O(e) {
	return e.matches(No) || e.querySelector(Fo) !== null;
}
function Lo(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Io.get(t);
	return n === void 0 && (n = Po(`[${t}]`), Io.set(t, n)), e.querySelector(n) !== null;
}
function Ro(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var zo = `[${v}], .${jr}`;
function k(e) {
	return e.closest(zo)?.matches(`.${jr}`) === !0;
}
function Bo(e, t) {
	e.classList.contains("ui-disabled") !== t && (e.classList.toggle(kr, t), Oo(e)), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var Vo = {
	isInert: D,
	isReadOnly: k,
	setDisabled: Bo
};
//#endregion
//#region src/extensions/value-readers.ts
function Ho(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Uo(e) {
	return e == null;
}
var Wo = "data-ui-trim-input", Go = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of Yo) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(vt);
		if (t === null) return Ko(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Wo) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Jo(e);
		return t === null ? null : this.read(t);
	}
};
function Ko(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var qo = "input, textarea, select";
function Jo(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(qo) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${qo}`);
}
var Yo = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Cr)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(wr)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Tr)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Un)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(br)
	},
	{
		kind: "selected-keys",
		read: (e) => Xo(e, xr)
	},
	{
		kind: yt,
		read: (e) => Xo(e, rt)
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
function Xo(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function Zo(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Qo(e) {
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
		default: o = ds(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function $o(e, t, n = as()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function es(e, t = as()) {
	let n = ts(e.code, t);
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
function ts(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? rs[e] : void 0) ?? ns[e] ?? e;
}
var ns = {
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
}, rs = {
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
}, is = null;
function as() {
	return is === null && (is = os()), is;
}
function os() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var ss = {
	words(e) {
		let t = Qo(e);
		return t === null ? null : es(t);
	},
	matches(e, t) {
		let n = Qo(t);
		return n !== null && $o(n, e);
	},
	isComposing: A
}, cs = 229;
function A(e) {
	return e.isComposing || e.keyCode === cs;
}
function j(e, t = {}) {
	return !e.ctrlKey && !e.metaKey && (t.alt === !0 || !e.altKey) && (t.shift === !0 || !e.shiftKey) && !A(e);
}
var ls = class {
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
function us(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function ds(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : fs[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : fs[t] ?? null;
}
var fs = {
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
}, ps = "data-ui-rename-field";
function ms(e) {
	return e instanceof Element && e.closest(`[${ps}]`) !== null;
}
function hs(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(ps, ""), r.setAttribute(Ye, ""), r.value = e.value, gs(r, n, t);
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
function gs(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = _s(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = vs((r.left - i.left) / s - n.clientLeft), e.style.top = vs((r.top - i.top) / s - n.clientTop), e.style.width = vs(r.width / s), e.style.height = vs(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function _s(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function vs(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/field-escape.ts
var ys = "data-ui-runs-on-escape", bs = "ui-key-value-action__row", xs = "ui-key-value-action__value-input", Ss = "ui-key-value-action__edit-action";
function Cs(e) {
	return A(e) || ws(e.target) !== null;
}
function ws(e) {
	return e instanceof Element ? ms(e) || Ts(e) ? e : e.closest("[data-ui-owns-keys]") ?? Es(e)?.cell ?? null : null;
}
function Ts(e) {
	return e instanceof Element && e.hasAttribute(ys) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !D(e);
}
function Es(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${xs}, .${Ss}`), n = t?.closest(".ui-key-value-action__row") ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/caret-fields.ts
var Ds = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]), Os = /* @__PURE__ */ new Set([
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
]), ks = /* @__PURE__ */ new Set([
	"KeyA",
	"KeyC",
	"KeyV",
	"KeyX",
	"KeyZ",
	"KeyY",
	"Insert"
]), As = /^F\d{1,2}$/;
function js(e) {
	return e instanceof HTMLInputElement && Ds.has(e.type);
}
function Ms(e) {
	return js(e) || e instanceof HTMLTextAreaElement;
}
function Ns(e) {
	return Ms(e) || e instanceof HTMLElement && e.isContentEditable;
}
function Ps(e) {
	let t = e.target;
	if (!Ns(t)) return !1;
	if (A(e)) return !0;
	let n = e.key;
	return n === "Tab" || n === "Escape" || As.test(n) || e.altKey ? !1 : n === "Enter" ? !js(t) : e.ctrlKey || e.metaKey ? Os.has(n) || ks.has(e.code) : !0;
}
var Fs = {
	...ss,
	isFieldKey: Ps,
	isPlainKey: j,
	isEscapeClaimed: Cs
}, Is = "ui-draft-dropped";
function Ls(e) {
	e.dispatchEvent(new Event(Is, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/own-control.ts
var Rs = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${zr}, .ui-field-box`, zs = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Bs = `${zs}, ${Rs}, ${Rr}, .${_e}`, Vs = "button, a, summary, [role='button']";
function Hs(e) {
	let t = [];
	for (let n of e.querySelectorAll(Bs)) if (!(n.classList.contains("ui-row__grip") || !Gs(e, n) || Ws(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Vs) ? n : null;
}
function Us(e) {
	let t = [];
	for (let n of e.querySelectorAll(zs)) Ws(e, n) && Gs(e, n) && t.push(n);
	return t;
}
function Ws(e, t) {
	let n = t.closest(`[${de}]`);
	return n !== null && n !== e && e.contains(n);
}
function Gs(e, t) {
	let n = t.closest(Rr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function Ks(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Bs);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/roving-focus.ts
function qs(e) {
	let t = Zs(e.key), n = Qs(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(N);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Js(e, t) {
	return Zs(e) !== null || Qs(e, t) !== 0;
}
var Ys = {
	target: qs,
	applyTabIndex: M
};
function M(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Xs(e, t) {
	t !== null && (M(e, t), t.focus());
}
function N(e) {
	return e.getClientRects().length > 0 && !D(e);
}
function Zs(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Qs(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function $s(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function ec(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${b}][${xt}]`) : null;
}
function tc(e) {
	let t = $s(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - rc(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function nc(e, t) {
	let n = $s(e);
	n.scrollTop = n === e ? t : t + rc(e, n);
}
function rc(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
function ic(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function ac(e) {
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
function oc(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function sc(e, t) {
	return t !== null && e.length >= t;
}
function cc(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : sc(e, n) ? null : [...e, t];
}
function lc(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var uc = /[,\uFF0C\r\n]/;
function dc(e) {
	return uc.test(e);
}
function fc(e) {
	return e.split(uc).map((e) => e.trim()).filter((e) => e.length > 0);
}
function pc(e) {
	let t = e.split(uc), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function mc(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = sc(a, n) ? r : i(a, t);
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
function hc(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
function gc(e) {
	return hc(e, dn, `.${rn}`);
}
//#endregion
//#region src/interactions/selected-key.ts
function _c(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function vc(e, t, n) {
	return e.length === 0 ? null : e.some((e) => n(e) === t) ? t : n(e[0]);
}
//#endregion
//#region src/interactions/row-selection.ts
var yc = "data-ui-bind-selected-keys", P = `.ui-items-view, .ui-table, .${Dn}`, bc = `.ui-items-view__item, .${Cn}, .${On}`, xc = ".ui-items-view, .ui-table", Sc = {
	shift: !1,
	ctrl: !1
}, Cc = /* @__PURE__ */ new WeakMap();
function wc(e, t) {
	t !== null && !Cc.has(e) && Tc(e, t);
}
function Tc(e, t) {
	let n = I(t);
	n.length > 0 && Cc.set(e, n);
}
function Ec(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Dc(e, t) {
	let n = Ec(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Oc(e) {
	return !e.hasAttribute(Rn);
}
function F(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${v}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function kc(e) {
	switch (e.getAttribute(vr)) {
		case "one": {
			let t = e.getAttribute(br);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Rc(zc(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Ac(e, t) {
	let n = kc(e), r = e.getAttribute(vr), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(I(e));
		e.toggleAttribute(yr, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function jc(e) {
	return e.filter((e) => e.hasAttribute(yr));
}
function Mc(e, t, n, r, i) {
	let a = I(n);
	if (!Fc(n)) return !1;
	switch (e.getAttribute(vr)) {
		case "one": return _c(e, a, {
			attribute: br,
			bindingAttribute: Sr,
			apply: (e) => Ac(e, t)
		}), !0;
		case "many": return Nc(e, t, n, a, r, i), !0;
		default: return !1;
	}
}
function Nc(e, t, n, r, i, a) {
	let o = zc(e);
	if (o === null) return;
	let s = Rc(o), c;
	if (i.shift) {
		let o = Cc.get(e), l = o === void 0 ? null : a?.(o, r) ?? null, u = t.find((e) => I(e) === o) ?? n, d = l === null ? Lc(t, u, n).map(I) : Ic(l, t);
		c = i.ctrl ? [...s.filter((e) => !d.includes(e)), ...d] : d;
	} else i.ctrl ? (c = s.includes(r) ? s.filter((e) => e !== r) : [...s, r], Cc.set(e, r)) : (c = [r], Cc.set(e, r));
	Pc(e, t, c);
}
function Pc(e, t, n) {
	let r = zc(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(xr, i), Ac(e, t), r.hasAttribute(yc) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Fc(e) {
	return I(e).length > 0 && !Lo(e, "data-ui-unselectable") && !O(e);
}
function Ic(e, t) {
	let n = new Map(t.map((e) => [I(e), e]));
	return e.filter((e) => {
		let t = n.get(e);
		return t === void 0 || F(t) !== null && Fc(t);
	});
}
function Lc(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => F(e) !== null && Fc(e));
}
function Rc(e) {
	return ac(e?.getAttribute("data-ui-selected-keys") ?? null);
}
function zc(e) {
	let t = e.closest(S);
	for (let n of e.querySelectorAll(`[${b}]`)) if (n.closest(P) === e && n.closest(S) === t) return n;
	return null;
}
function I(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Bc = {
	isSelected: (e) => e.hasAttribute(yr),
	toggle: Vc,
	setSelected: Hc,
	setSelectedKeys: Uc
};
function Vc(e) {
	let t = e.closest(P);
	t !== null && e instanceof HTMLElement && Mc(t, Wc(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Hc(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(I(e));
	Uc(e, r, n);
}
function Uc(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Wc(e), i = new Set(r.filter((e) => !Fc(e)).map(I)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...kc(e)].filter((e) => !a.has(e));
	Pc(e, r, n ? [...o, ...a] : o);
}
function Wc(e) {
	return hc(e, bc, P);
}
//#endregion
//#region src/interactions/table-column-layout.ts
var Gc = "--ui-table-order-";
function Kc(e) {
	let t = new Set((e.getAttribute("data-ui-table-hidden") ?? "").split(" ").filter((e) => e.length > 0)), n = e instanceof HTMLElement ? e.style : null;
	return {
		place: (e) => {
			let t = n?.getPropertyValue(`--ui-table-order-${e}`).trim() ?? "";
			return t.length === 0 ? e : Number(t);
		},
		isHidden: (e) => t.has(String(e))
	};
}
var qc = "ui-table", Jc = `[${yn}]:not(.${En})`, Yc = `.${Cn} > [aria-colspan]:not([${yn}])`;
function Xc(e, t, n, r) {
	let i = /* @__PURE__ */ new Map();
	for (let e of t) n.has(e) || i.set(e, String(i.size + 1));
	let a = String(i.size), o = r ? ":not([aria-colindex])" : "";
	Zc(e, "aria-colcount", a);
	for (let t of e.querySelectorAll(`${Jc}${o}, ${Yc}${o}`)) {
		if (t.closest(`.${qc}`) !== e) continue;
		if (!t.hasAttribute("data-ui-table-column")) {
			Zc(t, "aria-colindex", "1"), Zc(t, "aria-colspan", a);
			continue;
		}
		let n = i.get(Number(t.getAttribute(yn)));
		n === void 0 ? t.removeAttribute("aria-colindex") : Zc(t, "aria-colindex", n);
	}
}
function Zc(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/row-cursor.ts
var Qc = ".ui-table[role='grid']", $c = "gridcell", el = "aria-colspan", tl = /* @__PURE__ */ new WeakMap();
function nl(e) {
	let t = e.closest(P);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(bc);
	return n !== null && n.closest(P) === t ? {
		root: t,
		row: n
	} : null;
}
function rl(e) {
	return e.target instanceof Element && !Ps(e) ? il(e.target) : null;
}
function il(e) {
	let t = nl(e);
	if (t === null || t.row !== null && Ks(e, t.row) !== null) return null;
	let n = e.closest(`[${Lr}]`);
	return n !== null && n !== t.root && t.root.contains(n) ? null : t;
}
function al(e) {
	return e.filter((e) => F(e) !== null && !O(e));
}
function ol(e) {
	return sl(e) ?? al(e)[0] ?? null;
}
function sl(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !O(e)) ?? null;
}
function cl(e) {
	return sl(Wc(e));
}
function ll(e, t) {
	if (e.hasAttribute("data-ui-row-cursor-waits") || t.some((e) => e.hasAttribute("data-ui-row-focus"))) return;
	let n = ol(t);
	n !== null && dl(e, t, n);
}
function ul(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", ri(t, "ui-row-name"));
}
function dl(e, t, n, r = null, i = !0) {
	for (let e of t) e !== n && e.hasAttribute("data-ui-row-focus") && e.removeAttribute(je);
	n.hasAttribute("data-ui-row-focus") || n.setAttribute(je, ""), e.removeAttribute(Me);
	let a = fl(e, n, r);
	i && ((F(n) ?? n).scrollIntoView({ block: "nearest" }), a !== null && vl(e, n, a));
}
function fl(e, t, n) {
	let r = pl(e) ? ml(e, t, n) : null;
	for (let t of e.querySelectorAll(`[${Pe}]`)) t !== r && t.closest(P) === e && t.removeAttribute(Pe);
	if (r === null) return e.setAttribute("aria-activedescendant", ri(t, "ui-row")), null;
	r.hasAttribute("data-ui-cell-focus") || r.setAttribute(Pe, "");
	let i = r.getAttribute(yn);
	return i !== null && tl.set(e, i), e.setAttribute("aria-activedescendant", ri(r, "ui-cell")), r;
}
function pl(e) {
	return e.matches(Qc);
}
function ml(e, t, n) {
	if (n instanceof HTMLElement && n.parentElement === t && n.getAttribute("role") === $c) {
		if (!n.hasAttribute("data-ui-owns-keys")) return n;
		let e = hl(t, n.getAttribute(yn));
		if (e !== null) return e;
	}
	let r = gl(e, t), i = tl.get(e);
	if (i === void 0) return r[0] ?? null;
	let a = r.find((e) => e.getAttribute(yn) === i);
	if (a !== void 0) return a;
	let o = Kc(e), s = o.place(Number(i)), c = (e) => Math.abs(o.place(Number(e.getAttribute(yn))) - s);
	return r.reduce((e, t) => e === null || c(t) < c(e) ? t : e, null);
}
function hl(e, t) {
	for (let n of e.children) if (t !== null && n instanceof HTMLElement && n.getAttribute("data-ui-table-column") === t && _l(n)) return n;
	return null;
}
function gl(e, t) {
	let n = Kc(e), r = [];
	for (let e of t.children) {
		let t = Number(e.getAttribute("data-ui-table-column") ?? NaN);
		e instanceof HTMLElement && Number.isInteger(t) && _l(e) && !n.isHidden(t) && r.push({
			cell: e,
			place: n.place(t)
		});
	}
	return r.sort((e, t) => e.place - t.place).map((e) => e.cell);
}
function _l(e) {
	return e.getAttribute("role") === $c && !e.hasAttribute("data-ui-owns-keys");
}
function vl(e, t, n) {
	let r = e.querySelector(`:scope > .${wn}`);
	if (r === null || !(r.scrollWidth > r.clientWidth) || !n.hasAttribute("data-ui-table-column")) return;
	let i = r.getBoundingClientRect(), a = i.left + i.width / 2, o = i.left + r.clientLeft, s = o + r.clientWidth;
	for (let e of t.children) {
		if (e === n || !(e instanceof HTMLElement) || getComputedStyle(e).position !== "sticky") continue;
		let t = e.getBoundingClientRect();
		t.left + t.width / 2 < a ? o = Math.max(o, t.right) : s = Math.min(s, t.left);
	}
	let c = n.getBoundingClientRect();
	r.scrollLeft += yl(c.left, c.right, o, s);
}
function yl(e, t, n, r) {
	return e < n ? e - n : t > r ? Math.min(t - r, e - n) : 0;
}
function bl(e) {
	for (let t of e.children) if (t instanceof HTMLElement && t.hasAttribute("data-ui-cell-focus")) return t;
	return null;
}
function xl(e) {
	return tl.get(e) ?? null;
}
function Sl(e, t, n, r) {
	if (n !== null && Tl(n)) return null;
	let i = gl(e, t), a = n?.getAttribute("data-ui-table-column") ?? null, o = i.findIndex((e) => e.getAttribute(yn) === a);
	switch (r) {
		case "Home": return i[0] ?? null;
		case "End": return i[i.length - 1] ?? null;
		case "ArrowLeft": return o > 0 ? i[o - 1] : null;
		case "ArrowRight": return o < 0 ? i[0] ?? null : i[o + 1] ?? null;
		default: return null;
	}
}
function Cl(e, t, n, r) {
	let i = wl(t), a = (n === null ? -1 : i.indexOf(n)) + (r ? 1 : -1);
	return i.length === 0 || a < -1 || a >= i.length ? null : a === -1 ? ml(e, t, null) : i[a];
}
function wl(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && Tl(e));
}
function Tl(e) {
	return _l(e) && e.hasAttribute(el) && !e.hasAttribute("data-ui-table-column");
}
function El(e) {
	let t = wl(e);
	return t[t.length - 1] ?? null;
}
function Dl(e, t) {
	let n = t;
	for (; n !== null && n.parentElement !== e;) n = n.parentElement;
	return n?.getAttribute("role") === $c ? n : null;
}
function Ol(e, t = null) {
	let n = e.closest(P);
	n !== null && e instanceof HTMLElement && dl(n, Wc(n), e, t);
}
function kl(e, t) {
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
function Al(e, t) {
	return Js(e, t === "grid" ? "both" : t) || t !== "horizontal" && jl(e);
}
function jl(e) {
	return e === "PageDown" || e === "PageUp";
}
function Ml(e, t, n, r) {
	if (!Al(e, r)) return null;
	let i = al(t);
	if (jl(e)) return Nl(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return Pl(i, n, e === "ArrowDown");
	let a = i.map((e) => F(e) ?? e), o = qs({
		key: e,
		items: a,
		current: n === null ? null : F(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function Nl(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (F(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(tc(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (F(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function Pl(e, t, n) {
	let r = t === null ? null : F(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = Fl(i), o = e.map((e) => ({
		row: e,
		rect: (F(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(Fl(t.rect) - a) < Math.abs(Fl(e.rect) - a) ? t : e).row;
}
function Fl(e) {
	return e.left + e.width / 2;
}
var Il = "ui-row-press";
function Ll(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Rl(e, t, n) {
	let r = n.hasAttribute(je), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = zl(t, o, a);
		n !== null && dl(e, o, n);
	};
}
function zl(e, t, n) {
	let r = al(t);
	return n < 0 || r.length === 0 ? null : r.find((t) => e.indexOf(t) > n) ?? r[r.length - 1];
}
function Bl(e, t) {
	let n = t.find((e) => e.hasAttribute(je));
	if (n === void 0 || F(n) !== null) return;
	let r = zl(t, t, t.indexOf(n));
	if (r !== null) {
		dl(e, t, r, null, !1);
		return;
	}
	n.removeAttribute(je), bl(n)?.removeAttribute(Pe), e.removeAttribute("aria-activedescendant");
}
function Vl(e) {
	let t = e.parentElement, n = t?.closest(P) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function Hl(e) {
	let t = e.hasAttribute(je), n = e.contains(document.activeElement);
	return t || n ? {
		cursor: t,
		focus: n,
		key: e.getAttribute(y)
	} : null;
}
function Ul(e, t, n) {
	let r = Vl(e);
	if (n !== null && r !== null && (n.focus && !r.contains(document.activeElement) && r.focus({ preventScroll: !0 }), n.cursor)) {
		if (t === null) {
			typeof n.key == "string" && r.setAttribute(Me, n.key);
			return;
		}
		[...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Kl(r, t);
	}
}
function Wl(e, t) {
	let n = Vl(e), r = n?.getAttribute("data-ui-row-cursor-waits") ?? null;
	n !== null && r !== null && r === t.getAttribute("data-ui-key") && (n.removeAttribute(Me), [...e.children].some((e) => e !== t && e.hasAttribute("data-ui-row-focus")) || Kl(n, t));
}
function Gl(e) {
	return e.getAttribute(Me);
}
function Kl(e, t) {
	t.setAttribute(je, ""), fl(e, t, null);
}
//#endregion
//#region src/interactions/popup-focus.ts
var ql = "data-ui-active", Jl = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), Yl = /* @__PURE__ */ new Set([
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
]), Xl = !1, Zl = !1, Ql = null, $l = /* @__PURE__ */ new Set(), eu = [], tu = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => nu(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => ru(e), !0), window.addEventListener("focus", (e) => iu(e.target), !0), window.addEventListener("focusin", (e) => iu(e.target), !0), window.addEventListener("focusout", (e) => au(e), !0));
function nu(e, t = "") {
	Xl = !0, Zl = t === "touch";
	let n = document.activeElement;
	Ql = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && uu(n, !ou(n)), du(n);
}
function ru(e) {
	if (!(e instanceof KeyboardEvent && Yl.has(e.key))) {
		Xl = !1;
		for (let e of [...$l]) uu(e, !1);
		du(document.activeElement);
	}
}
function iu(e) {
	Xl && !ou(e) && uu(e, !0), e === document.activeElement && du(document.activeElement);
}
function au(e) {
	e.target instanceof Element && e.target.hasAttribute(ql) || uu(e.target, !1), e.relatedTarget === null && queueMicrotask(() => du(document.activeElement));
}
function ou(e) {
	return Ms(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function su() {
	return Xl && Ql instanceof HTMLElement && Ql !== document.body ? Ql : null;
}
function cu() {
	return Xl;
}
function lu() {
	return Xl && Zl;
}
function uu(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of $l) e.isConnected || $l.delete(e);
			$l.add(e);
		} else $l.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(mr, t), e === document.activeElement && du(e);
	}
}
function du(e) {
	let t = e === null || e === document.body || ou(e) ? null : e.hasAttribute("data-ui-pointer-focus") ? "pointer" : "keyboard", n = e === null || t === null ? [] : fu(e);
	for (let e of eu) n.includes(e) || e.removeAttribute(hr);
	for (let e of n) t !== null && e.getAttribute("data-ui-focus-within") !== t && e.setAttribute(hr, t);
	eu = n;
}
function fu(e) {
	let t = [];
	for (let n = e.parentElement; n !== null && n !== document.body && !n.hasAttribute("data-ui-region") && (t.push(n), !(n.hasAttribute("data-ui-id") && !pu(n))); n = n.parentElement);
	return t;
}
function pu(e) {
	return e.classList.contains("ui-menu--nested") || (e.parentElement?.closest(Rs) ?? null) !== null;
}
function L(e) {
	iu(e), mu(e);
}
function mu(e) {
	du(e), e.focus({ preventScroll: !0 }), du(document.activeElement);
}
function hu(e) {
	uu(e, !0), mu(e);
}
function gu(e) {
	for (let t of e.querySelectorAll(Jl)) if (Ro(t)) return t;
	return null;
}
var _u = {
	first: gu,
	stops: (e) => vu(e, document.activeElement),
	giveBack: (e) => Eu(e),
	trapTab: xu
};
function vu(e, t) {
	let n = [...e.querySelectorAll(Jl)].filter((e) => e === t || e.tabIndex >= 0 && Ro(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = yu(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !bu(n) && bu(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = yu(e);
		return t === null || r.get(t) === e;
	});
}
function yu(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function bu(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function xu(e, t) {
	let n = vu(e, document.activeElement);
	if (n.length === 0) {
		t.preventDefault();
		return;
	}
	let r = Su(e, n, document.activeElement, t.shiftKey);
	r !== null && (t.preventDefault(), r.focus());
}
function Su(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Cu(n, a) ? i : r && Cu(n, i) ? a : null;
}
function Cu(e, t) {
	return e === t || yu(e) !== null && yu(e) === yu(t);
}
var wu = `.${Nr}, .${Pr}, [${Ir}]`;
function Tu(e) {
	let t = nl(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(wu)) && n.hasAttribute("tabindex") && Ro(n)) return n;
	return null;
}
function Eu(e, t = Tu(e)) {
	let n = document.activeElement;
	if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
	let r = nl(e);
	r?.root === t && r.row !== null && dl(t, Wc(t), r.row, Dl(r.row, e)), L(t);
}
function Du(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? gu(e);
	return Xl ? tu.add(e) : tu.delete(e), (r === null || r === e) && !e.hasAttribute("tabindex") && (e.tabIndex = -1), L(r ?? e), n;
}
function Ou(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? gu(e);
	return n !== null && ku(e, n), Du(e, n);
}
function ku(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Au(e, t, n = !1) {
	if (Xl) {
		M(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), L(e);
		return;
	}
	let r = t.filter(N), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (M(t, i), L(i));
}
function ju(e, t = null) {
	let n = e == null ? null : e.isConnected ? e : Mu(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Jl}, [tabindex]`) && Ro(e)) return e;
	return n === null ? null : Nu(n);
}
function Mu(e, t) {
	if (t === null) return null;
	for (let n = e.closest(S); n !== null; n = n.parentElement?.closest(S) ?? null) {
		let e = t.findEveryComponent(T(n)).filter((e) => e.isConnected);
		if (e.length === 1 && e[0] instanceof HTMLElement) return e[0];
	}
	return null;
}
function Nu(e) {
	for (let t = e.closest(S); t !== null; t = t.parentElement?.closest(S) ?? null) if (Ro(t)) return Pu(t), t;
	return null;
}
function Pu(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Fu(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Iu(n, t) && uu(e, !ou(e)), L(e));
}
function Iu(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (tu.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Lu = "data-ui-clear", Ru = ["change", "toggle"], zu = [
	...Ru,
	"expand",
	"collapse",
	"open",
	"close"
];
function Bu(e) {
	let t = ci(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Vu(e) {
	return ci(e) === "OnSubmit";
}
function Hu(e, t) {
	let n = e.getAttribute(qe);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Vu(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Bu(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Vu(i.mode)
		};
	}
	return null;
}
var Uu = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Ru) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Is, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Lu}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Hu(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Lu}]`);
		if (t === null) return;
		let n = t.closest(S), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Wu(r) || (Zo(r), r.dispatchEvent(new Event("input", { bubbles: !0 })), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ms(r) && document.activeElement !== r && L(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (k(e.target) || D(e.target))) return;
		let t = Hu(e.target, this.options.metadata);
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
			let r = Hu(n, this.options.metadata);
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
		if (i === void 0 || !Bu(i.mode) || Vu(i.mode)) return;
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
function Wu(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function Gu(e, t) {
	let n = e.closest(`[${Ye}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var Ku = class {
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
}, qu = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachments = /* @__PURE__ */ new Map();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Di(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Di(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Di(e));
	}
	isAttached(e) {
		return this.attachments.has(Di(e));
	}
	attach(e) {
		let t = {};
		return this.attachments.set(Di(e), t), t;
	}
	isCurrent(e, t) {
		return this.attachments.get(e) === t;
	}
}, Ju = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: w(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Yu = {
	dispatched: !1,
	success: !1
}, Xu = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Zu = class {
	options;
	root;
	registry;
	requestFactory = new Ju();
	turns = new Ku();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new qu(e.eventCatalog), this.addEvent("click");
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
		if (r === null || $u(t, r.element) || Gu(t.target, r.element)) return;
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
			let t = e instanceof Xu, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && D(r.domEvent.target)) return Yu;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Yu;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? ed(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), Yu;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Yu;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Xu(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !zu.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		Qu(e.preventDefault, t) && t.domEvent.preventDefault(), Qu(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Qu(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function $u(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function ed(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function td(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && nd(e, t) : rd(e, t);
}
function nd(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!td(e[n], t[n])) return !1;
	return !0;
}
function rd(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !td(e[n], t[n]) : !id(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !id(t[n])) return !1;
	return !0;
}
function id(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
function ad() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function od(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body) return null;
	if (sd(e)) return cd(e, () => od(e)), null;
	let n = e;
	for (; n.parentElement !== null && !sd(n.parentElement);) n = n.parentElement;
	let r = dd(n) ?? fd(n) ?? pd();
	return r !== null && L(r), r;
}
function sd(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function cd(e, t) {
	if (typeof document.getAnimations != "function") return;
	let n = document.getAnimations().filter((t) => ld(t) && ud(t)?.contains(e) === !0);
	n.length > 0 && Promise.all(n.map((e) => e.finished)).then(t, () => void 0);
}
function ld(e) {
	return e.transitionProperty === "visibility";
}
function ud(e) {
	return e.effect?.target ?? null;
}
function dd(e) {
	let t = (e.closest(".ui-key-value-action__value-input, .ui-key-value-action__edit-action")?.closest(".ui-key-value-action__row") ?? null)?.querySelector(".ui-key-value-action__action")?.querySelector(Jl) ?? null;
	return t !== null && sd(t) ? t : null;
}
function fd(e) {
	let t = vu(e.closest(wu) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function pd() {
	let e = document.querySelector(`[${tn}="content"]`);
	return e === null ? null : (Pu(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var md = class {
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
		for (let e of Ru) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = _d(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && td(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = Hu(e, this.options.metadata), r;
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
			for (let e of t.interactions) ui(e.actionKind) === "CopyValue" && vd(e.target) && this.writeTarget(e.target, t.dynamicParameters, hd(e, n), !0);
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
		let t = this.index.getPropertyInteractions(w(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? _d(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = ui(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!vd(a)) return;
		let o = i === "CopyValue" ? hd(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = ad();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && od(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: gd(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function hd(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function gd(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = w(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && Fi(s, o)) return a === 0 ? e : {
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
function _d(e, t) {
	return JSON.stringify([
		w(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function vd(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var yd = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return bd(t, e.operator, e.value);
	}
};
function bd(e, t, n) {
	let r = xd(e), i = xd(n);
	switch (di(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Sd(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Sd(r, i, (e) => e >= 0);
		case "Less": return Sd(r, i, (e) => e < 0);
		case "LessOrEqual": return Sd(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return wd(r, i);
		case "RegexEach": return Cd(r, i);
		default: return !1;
	}
}
function xd(e) {
	return qa(e) ? e.key : Ja(e) ? e.text : e;
}
function Sd(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Cd(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => wd(xd(e), t)) : wd(e, t);
}
function wd(e, t) {
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
var Td = "Value", Ed = "EndValue", Dd = class {
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
		return this.eventNames.has(Di(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Ad(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Di(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(jd(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Md(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Od(e)) {
			let t = w(e.sourceEvent?.componentId), n = Di(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(jd(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(jd(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (kd(e)) {
			let t = w(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Md(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Md(t, n), r)), r.push(e), ui(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Td ? this.valueInteractions : i === Ed ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Od(e) {
	return li(e.sourceKind) === "Event";
}
function kd(e) {
	return li(e.sourceKind) === "Property";
}
function Ad(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function jd(e, t) {
	return `${e}:${Di(t)}`;
}
function Md(e, t) {
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
function Nd() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Pd(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
function Fd(e, t, n) {
	let r = !1, i = () => {
		r || (r = !0, clearTimeout(a), n());
	}, a = setTimeout(i, t), o = typeof e.getAnimations == "function" ? e.getAnimations().filter((e) => typeof CSSTransition != "function" || e instanceof CSSTransition) : [];
	Promise.allSettled(o.map((e) => e.finished)).then(i);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Id = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Ld = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Rd(e) {
	return `(min-width: ${Ld[e]}px)`;
}
var zd = Rd("md"), Bd = Rd("sm");
function Vd(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Rd(t))) return t;
	return "base";
}
function Hd(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Ud(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Wd(e, t) {
	return Gd(t, (t) => Ud(e, t));
}
function Gd(e, t) {
	for (let n = Id.indexOf(e); n >= 0; n--) {
		let e = t(Id[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Kd = /* @__PURE__ */ new Set([
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
function qd(e) {
	return Kd.has(e);
}
var Jd = 4, Yd = 12, Xd = /* @__PURE__ */ new Map(), Zd = !1, Qd = null, $d = /* @__PURE__ */ new WeakMap(), ef = "data-ui-popup-stood-in";
function tf(e, t) {
	t === null ? $d.delete(e) : $d.set(e, t);
}
var nf = "--ui-popup-ground";
function rf(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(nf).trim() : "";
	n.length === 0 ? t.style.removeProperty(nf) : t.style.setProperty(nf, n);
}
function af(e, t, n) {
	Xd.set(t, {
		anchor: e,
		options: n
	}), vf(), Qd?.observe(t), df(e, t), bf(e, t, n);
}
var of = "data-ui-popup-lifted", sf = "data-ui-sheet";
function cf() {
	return typeof matchMedia == "function" && !matchMedia(Bd).matches;
}
function lf(e) {
	return e.hasAttribute(sf);
}
function uf(e) {
	if (e.hasAttribute(of)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	e.setAttribute("popover", "manual"), e.setAttribute(of, ""), ff(e);
}
function df(e, t) {
	(t.hasAttribute(of) || pf(t) || e.closest(`[${of}]`) !== null) && uf(t);
}
function ff(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function pf(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
var mf = R.normal * 5;
function hf(e, t) {
	e.hasAttribute(of) && (e.matches(":popover-open") && e.hidePopover(), Fd(e, mf, () => {
		e.matches(":popover-open") || Xd.has(e) || (e.removeAttribute("popover"), e.removeAttribute(of), t?.());
	}));
}
function gf(e) {
	let t = Xd.get(e);
	t !== void 0 && bf(t.anchor, e, t.options);
}
function _f(e) {
	e != null && (Xd.delete(e), Qd?.unobserve(e), hf(e));
}
function vf() {
	Zd || (Zd = !0, document.addEventListener("scroll", yf, !0), window.addEventListener("resize", yf), window.visualViewport?.addEventListener("resize", yf), window.visualViewport?.addEventListener("scroll", yf), Qd = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Xd.get(t.target);
			e !== void 0 && bf(e.anchor, t.target, e.options, !0);
		}
	}));
}
function yf() {
	for (let [e, t] of Xd) {
		if (!e.isConnected) {
			_f(e);
			continue;
		}
		bf(t.anchor, e, t.options);
	}
}
function bf(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = wf(e), a = i !== e;
	t.hasAttribute(ef) !== a && t.toggleAttribute(ef, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`), Cf(t);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = Df(n.boundary), f = Xd.get(t), p = r ? f?.side : void 0, m = p !== void 0 && kf(c, u, p, l, d) ? p : Of(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m), kf(c, u, m, l, d) || (Sf(t, m, Nf(c, m, d) - l - Jd), u = t.getBoundingClientRect());
	let h = n.alignEntries === !0 ? Lf(t, m) : If, g = zf(c, s, u, m, l, h), ee = Bf(c, s, u, m, l, h);
	n.arrow === !0 && (Mf(m) ? ee = Tf(ee, s.left + s.width / 2, u.width) : g = Tf(g, s.top + s.height / 2, u.height));
	let _ = Hf();
	g = _.top + Kf(g - _.top, u.height, _.bottom - _.top), ee = Kf(ee, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${ee}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), Ef(t, s, u, m, g, ee);
}
var xf = "data-ui-popup-capped";
function Sf(e, t, n) {
	let r = Mf(t);
	e.setAttribute(xf, ""), e.style.setProperty(r ? "max-height" : "max-width", `${Math.max(0, n)}px`), e.style.setProperty(r ? "overflow-y" : "overflow-x", "auto");
}
function Cf(e) {
	if (e.hasAttribute(xf)) {
		e.removeAttribute(xf);
		for (let t of [
			"max-height",
			"max-width",
			"overflow-y",
			"overflow-x"
		]) e.style.removeProperty(t);
	}
}
function wf(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(ef)) return e;
		let n = $d.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Tf(e, t, n) {
	let r = t - e;
	return r < Yd ? e - (Yd - r) : r > n - Yd ? e + (r - (n - Yd)) : e;
}
function Ef(e, t, n, r, i, a) {
	let o = Mf(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Yd, Math.min(s, c - Yd))}px`);
}
function Df(e) {
	let t = Hf(), n = {
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
function Of(e, t, n, r, i) {
	let a = Pf(n);
	if (kf(e, t, n, r, i)) return n;
	if (kf(e, t, a, r, i)) return a;
	for (let a of Af(n)) if (kf(e, t, a, r, i)) return a;
	return Nf(e, a, i) > Nf(e, n, i) ? a : n;
}
function kf(e, t, n, r, i) {
	return Nf(e, n, i) >= jf(t, n) + r;
}
function Af(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function jf(e, t) {
	return Mf(t) ? e.height : e.width;
}
function Mf(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Nf(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Pf(e) {
	return e.startsWith("top") ? `bottom${Ff(e)}` : e.startsWith("bottom") ? `top${Ff(e)}` : e.startsWith("left") ? `right${Ff(e)}` : `left${Ff(e)}`;
}
function Ff(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var If = {
	start: 0,
	end: 0
};
function Lf(e, t) {
	let n = getComputedStyle(e);
	return Mf(t) ? {
		start: Rf(n.paddingLeft) + Rf(n.borderLeftWidth),
		end: Rf(n.paddingRight) + Rf(n.borderRightWidth)
	} : {
		start: Rf(n.paddingTop) + Rf(n.borderTopWidth),
		end: Rf(n.paddingBottom) + Rf(n.borderBottomWidth)
	};
}
function Rf(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function zf(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Vf(t.top, t.height, n.height, r, a);
}
function Bf(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Vf(t.left, t.width, n.width, r, a);
}
function Vf(e, t, n, r, i) {
	let a = Ff(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Hf() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Uf(r))
	};
}
function Uf(e) {
	let t = document.querySelector(`[${Qt}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Wf(e, t, n) {
	if (lf(e)) return;
	let r = e.getBoundingClientRect(), i = Hf();
	e.style.left = `${Gf(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Gf(n, r.height, i.top, i.bottom)}px`;
}
function Gf(e, t, n, r) {
	return e + t <= r - Jd ? e : e - t >= n + Jd ? e - t : n + Kf(e - n, t, r - n);
}
function Kf(e, t, n) {
	return Math.max(Jd, Math.min(e, n - t - Jd));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var qf = 32;
function z(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Jf(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Jf(e, t, n) {
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
		if (r.size > qf) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Yf(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Xf = "data-ui-dialog", Zf = "data-ui-dialog-modal", Qf = "data-ui-dialog-backdrop", $f = "data-ui-dialog-close-backdrop", ep = "data-ui-dialog-close-escape", tp = `[${Xf}]:not([hidden]), dialog[open]`, np = "dialog:modal";
function rp(e) {
	let t = e.querySelectorAll(`[${Xf}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ip(e) {
	let t = e.querySelectorAll(np);
	if (t.length > 0) return t[t.length - 1];
	let n = rp(e);
	return n !== null && n.hasAttribute("data-ui-dialog-modal") ? n : null;
}
function ap(e) {
	let t = typeof document > "u" ? null : ip(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var op = /* @__PURE__ */ new Set(), sp = /* @__PURE__ */ new Map(), cp = 0, lp = !1;
function up() {
	lp || (lp = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || A(e) || pp(ws(e.target)) && e.preventDefault();
	}, !0));
}
function dp() {
	for (let e of op) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function fp(e) {
	for (let t of op) t.hearRefusedClick(e);
}
function pp(e) {
	let t = [];
	for (let e of op) for (let n of e.openPopups()) n.isConnected && t.push({
		instance: e,
		popup: n
	});
	let n = new Set(t.map((e) => e.popup));
	for (let e of [...sp.keys()]) n.has(e) || sp.delete(e);
	for (let { popup: e } of t) sp.has(e) || sp.set(e, ++cp);
	let r = mp(t, (e) => sp.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: t, popup: n } of r) if ((e === null || e.contains(n)) && t.dismiss(n, "escape")) return !0;
	return !1;
}
function mp(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var hp = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), op.add(this), up();
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
		return this.options.isBehind === void 0 ? ap(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
}, gp = /\p{M}/gu, _p = ".ui-text__title";
function vp(e, t) {
	return yp(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function yp(e, t) {
	return Sp(e, xp(t));
}
function bp(e, t) {
	return t.every((t) => e.includes(t));
}
function xp(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Sp(e, t) {
	let n = e.normalize("NFD").replace(gp, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
function Cp(e) {
	return e.querySelector(_p)?.textContent ?? e.textContent ?? "";
}
//#endregion
//#region src/interactions/pointer-drag.ts
var wp = class {
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
		t.setAttribute(ur, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Tp(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(ur), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || A(e) || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(ur);
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
function Tp(e, t, n, r) {
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
function Ep() {
	let e = (e) => {
		e.preventDefault(), e.stopImmediatePropagation(), t();
	}, t = () => {
		window.removeEventListener("click", e, !0), window.removeEventListener("pointerdown", t, !0), window.removeEventListener("keydown", t, !0);
	};
	window.addEventListener("click", e, !0), window.addEventListener("pointerdown", t, !0), window.addEventListener("keydown", t, !0);
}
//#endregion
//#region src/interactions/sheet-swipe.ts
var Dp = "data-ui-sheet-dragging", Op = "--ui-sheet-drag", kp = 6, Ap = 24, jp = 1 / 3, Mp = .5;
function Np(e, t, n) {
	return e > t * jp || n > Mp && e > kp;
}
function Pp(e, t, n) {
	let r = null;
	e.style.removeProperty(Op), e.removeAttribute(Dp);
	let i = (n) => {
		if (r = null, !n.isPrimary || n.button !== 0 || t.scrollTop > 0 || n.pointerType !== "touch" && n.clientY - e.getBoundingClientRect().top > Ap) return;
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
			if (i > kp && i > Math.abs(n) || n < -6) {
				r = null;
				return;
			}
			if (n <= kp) return;
			r.moving = !0, e.setAttribute(Dp, ""), Fp(e, t.pointerId);
		}
		r.previous = r.last, r.last = {
			y: t.clientY,
			time: t.timeStamp
		}, e.style.setProperty(Op, `${Math.max(0, n)}px`);
	}, o = (t) => {
		if (r === null || t.pointerId !== r.pointerId) return;
		let i = r;
		if (r = null, !i.moving) return;
		Ep(), e.removeAttribute(Dp);
		let a = Math.max(0, t.clientY - i.startY), o = i.last.time - i.previous.time, s = o > 0 ? (i.last.y - i.previous.y) / o : 0;
		t.type === "pointerup" && Np(a, e.getBoundingClientRect().height, s) ? n() : e.style.setProperty(Op, "0px");
	}, s = (e) => {
		let t = e.touches[0];
		r !== null && e.cancelable && t !== void 0 && (r.moving || t.clientY > r.startY) && e.preventDefault();
	};
	return e.addEventListener("pointerdown", i), e.addEventListener("pointermove", a), e.addEventListener("pointerup", o), e.addEventListener("pointercancel", o), e.addEventListener("touchmove", s, { passive: !1 }), () => {
		r = null, e.removeAttribute(Dp), e.removeEventListener("pointerdown", i), e.removeEventListener("pointermove", a), e.removeEventListener("pointerup", o), e.removeEventListener("pointercancel", o), e.removeEventListener("touchmove", s);
	};
}
function Fp(e, t) {
	try {
		e.setPointerCapture(t);
	} catch {}
}
//#endregion
//#region src/interactions/popup-sheet.ts
var Ip = "data-ui-sheet-covered", Lp = "ui-sheet-scrim", Rp = "data-ui-sheet-scrim-leaving", zp = 400, Bp = "ui-sheet__back", Vp = "ui.sheet.back", Hp = [], Up = null, Wp = !1, Gp = !1;
function Kp(e, t) {
	if (qp(e) !== null) return;
	let n = t.anchor?.closest("[data-ui-sheet]") ?? null, r = n === null ? null : qp(n);
	e.style.removeProperty("top"), e.style.removeProperty("left"), e.style.removeProperty("min-width");
	let i = lf(e);
	e.setAttribute(sf, r === null ? "root" : "nested"), i || (e.setAttribute("popover", "manual"), Pd(e));
	let a = null;
	e.querySelector(`:scope > .${Bp}`)?.remove(), r !== null && (e.style.minHeight = `${r.popup.getBoundingClientRect().height}px`, r.popup.setAttribute(Ip, ""), a = Jp(t), e.prepend(a)), Yp(), uf(e);
	let o = {
		popup: e,
		parent: r,
		opening: t,
		back: a,
		hidden: [],
		detachSwipe: Pp(e, e, () => Xp(e))
	};
	Hp.push(o), Zp(), queueMicrotask(() => $p(o));
}
function qp(e) {
	return Hp.find((t) => t.popup === e) ?? null;
}
function Jp(e) {
	let t = document.createElement("button"), n = e.anchor === void 0 ? "" : Cp(e.anchor).trim();
	return t.type = "button", t.className = Bp, t.tabIndex = -1, t.textContent = n, E.write(t, "aria-label", Vp, { entry: n }), t.addEventListener("click", (t) => {
		t.stopPropagation(), e.close();
	}), t;
}
function Yp() {
	Up === null && (Up = document.createElement("div"), Up.className = Lp, Up.setAttribute("aria-hidden", "true"), Up.addEventListener("mousedown", (e) => e.preventDefault())), Up.parentElement === null && document.body.appendChild(Up), Up.removeAttribute(Rp), uf(Up);
}
function Xp(e) {
	for (let t = qp(e); t !== null; t = t.parent) t.opening.close();
}
function Zp() {
	Wp || (Wp = !0, window.addEventListener("pointerdown", () => {
		Gp = !0;
	}, !0), window.addEventListener("pointerup", Qp, !0), window.addEventListener("pointercancel", Qp, !0), window.addEventListener("keydown", (e) => {
		let t = Hp.at(-1);
		e.key === "Tab" && !e.defaultPrevented && t !== void 0 && t.opening.trapsTab && e.target instanceof Node && t.popup.contains(e.target) && xu(t.popup, e);
	}, !0), matchMedia(Bd).addEventListener("change", () => {
		for (let e of Hp.filter((e) => e.parent === null)) e.opening.close();
	}));
}
function Qp() {
	if (Gp = !1, Up?.hasAttribute(Rp) !== !0) return;
	let e = () => {
		Up?.hasAttribute(Rp) === !0 && Hp.length === 0 && (Up.removeAttribute(Rp), Up.hidePopover());
	};
	window.addEventListener("click", () => window.setTimeout(e), { once: !0 }), window.setTimeout(e, zp);
}
function $p(e) {
	if (!Hp.includes(e)) return;
	let { popup: t } = e;
	t.contains(document.activeElement) || (t.hasAttribute("tabindex") || (t.tabIndex = -1), L(t)), e.hidden = em(t);
}
function em(e) {
	let t = [];
	for (let n = e; n.parentElement !== null && n !== document.body; n = n.parentElement) for (let e of n.parentElement.children) e === n || e === Up || !(e instanceof HTMLElement) || e.getAttribute("aria-hidden") === "true" || (e.setAttribute("aria-hidden", "true"), t.push(e));
	return t;
}
function tm(e) {
	let t = qp(e);
	if (t !== null) {
		for (let e of [...Hp].reverse()) if (e === t || nm(e, t)) {
			for (let t of e.hidden) t.removeAttribute("aria-hidden");
			e.hidden = [];
		}
	}
}
function nm(e, t) {
	for (let n = e.parent; n !== null; n = n.parent) if (n === t) return !0;
	return !1;
}
function rm(e) {
	let t = qp(e);
	if (t !== null) {
		for (let e of Hp.filter((e) => e.parent === t)) e.opening.close(), rm(e.popup);
		tm(e), Hp.splice(Hp.indexOf(t), 1), t.detachSwipe(), t.parent?.popup.removeAttribute(Ip), Hp.length === 0 && im(), hf(e, () => {
			qp(e) === null && (e.removeAttribute(sf), e.removeAttribute(Ip), e.style.removeProperty("min-height"), e.style.removeProperty("--ui-sheet-drag"), t.back?.remove());
		});
	}
}
function im() {
	Up?.matches(":popover-open") === !0 && (Gp ? Up.setAttribute(Rp, "") : Up.hidePopover());
}
//#endregion
//#region src/interactions/owned-popup.ts
function am(e, t) {
	return e.isConnected && !D(e) && !(t && k(e));
}
var om = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new hp({
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
			isBehind: (e) => ap(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0), e.closesOnTab !== void 0 && e.closesOnTab !== !1 && cm(this);
	}
	listsAround(e) {
		return [...this.entries.values()].filter(({ opening: t }) => t.popup.contains(e) && mm(this.options.closesOnTab, t)).map(({ opening: e }) => ({
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
		if (!(e.target instanceof Node) || cu() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus")) return;
		if (t instanceof Element) {
			this.leaveFocus(e.target, t);
			return;
		}
		let n = e.target;
		um(n) && queueMicrotask(() => this.letGo(n));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, pm(t)) && !ap(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		if (!um(e)) return;
		let t = Tu(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t) || n.popup.contains(document.activeElement);
			r && !i && am(n.owner, this.closesWhenReadOnly) && !ap(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !am(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), this.place(e), hm(e, !0), Tm(this), bm(e), e.focus !== void 0 && e.focus !== !1 && Du(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	place(e) {
		if (lf(e.popup) || mm(this.options.sheetOnPhone, e) && cf()) {
			Kp(e.popup, {
				anchor: e.anchor,
				close: () => this.close(e.owner, "escape"),
				trapsTab: !mm(this.options.closesOnTab, e)
			});
			return;
		}
		e.anchor !== void 0 && e.placement !== void 0 && af(e.anchor, e.popup, e.placement);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && this.place(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), xm(r.popup), tm(r.popup), r.popup.contains(document.activeElement) && Fu(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), hm(r, !1), lf(r.popup) ? rm(r.popup) : _f(r.popup), this.entries.size === 0 && Em(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (am(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !dm() && fm(e);
		}
	}
}, sm = /* @__PURE__ */ new Set();
function cm(e) {
	sm.size === 0 && window.addEventListener("keydown", (e) => {
		e instanceof KeyboardEvent && e.key === "Tab" && !e.defaultPrevented && !A(e) && e.target instanceof Node && lm(e.target);
	}, !0), sm.add(e);
}
function lm(e) {
	let t = [...sm].flatMap((t) => t.listsAround(e).map((e) => ({
		popups: t,
		...e
	})));
	for (let { popups: e, owner: n } of mp(t, () => 0, (e, t) => e.popup.contains(t.popup))) e.close(n, "focus");
}
function um(e) {
	return e instanceof Element && e.isConnected && Ro(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function dm() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Ro(e);
}
function fm(e) {
	Pu(e), L(e);
}
function pm(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function mm(e, t) {
	return e === !0 || typeof e == "function" && e(t);
}
function hm(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var gm = /* @__PURE__ */ new Map(), _m = /* @__PURE__ */ new Set(), vm = /* @__PURE__ */ new WeakSet(), ym = [];
function bm(e) {
	let { popup: t } = e;
	gm.set(t, e.owner), !vm.has(t) && (vm.add(t), t.addEventListener("pointerenter", () => {
		gm.has(t) && (_m.add(t), Sm());
	}), t.addEventListener("pointerleave", () => {
		_m.delete(t) && Sm();
	}));
}
function xm(e) {
	gm.delete(e), _m.delete(e) && Sm();
}
function Sm() {
	let e = /* @__PURE__ */ new Set();
	for (let t of _m) {
		let n = gm.get(t);
		if (!(n === void 0 || !n.contains(t))) for (let r = t.parentElement; r !== null && (e.add(r), r !== n); r = r.parentElement);
	}
	for (let t of ym) e.has(t) || t.removeAttribute(gr);
	for (let t of e) t.hasAttribute("data-ui-popup-hover") || t.setAttribute(gr, "");
	ym = [...e];
}
var Cm = /* @__PURE__ */ new Set(), wm = null;
function Tm(e) {
	Cm.add(e), wm === null && typeof MutationObserver == "function" && (wm = new MutationObserver(() => {
		for (let e of [...Cm]) e.closeStranded();
	}), wm.observe(document, {
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
function Em(e) {
	Cm.delete(e), !(Cm.size > 0 || wm === null) && (wm.disconnect(), wm = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Dm = "ui-flyout", Om = "ui-flyout--open", km = "ui-flyout__anchor", Am = "data-ui-flyout-no-backdrop-close", jm = "data-ui-flyout-no-escape-close", Mm = `${Dm}--`, Nm = "bottom-start", Pm = class {
	root;
	flyouts = new om({
		show: ({ owner: e }) => e.classList.add(Om),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? jm : Am)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Dm}`)) this.place(e);
		z(this.root, `.${Dm}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Pr}`), n = e.querySelector(`:scope > .${km}`);
		if (t === null) return;
		let r = Fm(n, t);
		if (!e.classList.contains(Om)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Lm(n) ?? e,
			placement: { placement: Rm(e) },
			openers: r === null ? [] : [r],
			focus: !cu() || t
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Om) && (e.classList.remove(Om), Im(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${km}`)?.closest(`.${Dm}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Om), this.place(t), this.flyouts.isOpen(t) && Im(t, !0);
		}
	}
};
function Fm(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Jl) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", ri(t, "ui-flyout-content")), n;
}
function Im(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Lm(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Rm(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Mm)) continue;
		let e = t.slice(Mm.length);
		if (qd(e)) return e;
	}
	return Nm;
}
//#endregion
//#region src/interactions/drag-marks.ts
var zm = `:scope > :is(${Rs}, .ui-image-input__surface)`;
function Bm(e, t, n, r, i, a = [], o = "move") {
	Vm(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	Hm(e, i, o);
}
function Vm(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function Hm(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function Um(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
function Wm(e, t) {
	let n = t && e.querySelector(zm) !== null;
	e.hasAttribute("data-ui-drop-boxed") !== n && e.toggleAttribute(ge, n);
}
//#endregion
//#region src/interactions/file-drop.ts
var Gm = "data-ui-file-drop-over", Km = 120, qm = "refused", Jm = !1;
function Ym(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	$m();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Xm(e, t, n), !0);
	e.root.addEventListener("dragend", () => ah(t.marked), !0), window.addEventListener("blur", () => ah(t.marked)), e.root.addEventListener("paste", (t) => Zm(e, t), !0);
}
function Xm(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && ah(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		eh(n), n.type !== "dragleave" && ah(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || ih(r, a) : t.leaving = window.setTimeout(() => ah(r), Km);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = th(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && ih(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Gm;
		r.set(a, o), a.setAttribute(o, t ? qm : ""), Wm(a, o === Gm);
		return;
	}
	ah(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => oh(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Zm(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => oh(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Qm(e, t, n) {
	for (let r = t.closest(`[${v}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${rr}="${ei(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function $m() {
	if (!Jm) {
		Jm = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && eh(e);
		});
	}
}
function eh(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function th(e, t) {
	let n = nh(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => rh(t, e)));
}
function nh(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function rh(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function ih(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n), Wm(t, !1);
}
function ah(e) {
	for (let t of [...e.keys()]) ih(e, t);
}
function oh(e, t) {
	let n = nh(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : rh(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var sh = "/_ne/files/upload", ch = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], lh = /* @__PURE__ */ new Map(), uh = !1;
function dh(e, t, n, r) {
	let i = Number(e.getAttribute(tr)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return lh.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of lh.keys()) e.isConnected || lh.delete(e);
	return lh.set(e, c), fh(e, c), mh(), a;
}
function fh(e, t) {
	let n = ph(t.limit, E.language);
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
function ph(e, t) {
	let n = e, r = "byte";
	for (let e of ch) {
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
function mh() {
	uh || (uh = !0, E.onChange(() => {
		for (let [e, t] of lh) e.isConnected ? fh(e, t) : lh.delete(e);
	}));
}
function hh(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", sh), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var gh = () => {};
function _h(e) {
	return {
		uploadAsync: (e, t) => hh(e, t ?? gh),
		accepts: oh,
		takeWithinSizeLimit: (t, n, r) => dh(t, n, r, e)
	};
}
function vh(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var yh = "ui-open-picker";
function bh(e) {
	return !e.dispatchEvent(new Event(yh, {
		bubbles: !0,
		cancelable: !0
	}));
}
function xh(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || k(n) || D(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Sh = "ui-file-input", Ch = "ui-file-input__row", wh = "ui-file-input__native", Th = "ui-file-input__field", Eh = "ui-file-input__selection", Dh = "data-ui-file-dragging", Oh = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, E.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(yh, (e) => xh(e, {
			rootSelector: `.${Sh}`,
			nativeSelector: `.${wh}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Ym({
			root: this.root,
			draggingAttribute: Dh,
			resolveTarget: (e) => {
				let t = e.closest(`.${Ch}`)?.closest(`.${Sh}`) ?? null, n = t === null ? Qm(this.root, e, `.${Sh}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${wh}`) ?? null;
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
		let t = e.target.closest(`[${nr}], .${Ch}`);
		if (t === null || D(t) || k(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Sh}`)?.querySelector(`.${wh}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(wh)) return;
		let t = e.target.closest(`.${Sh}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Th}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = dh(e, t, e.querySelector(`.${wh}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await hh(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => E.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, kh(r)), this.publishSelection(e, t.selectionId);
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
		vh(e.querySelector(`.${Eh}`), t);
	}
};
function kh(e) {
	return e.length === 1 ? e[0].name : () => E.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Ah = "ne-picture-as-pdf", jh = "ne-text-snippet", Mh = "ne-description", Nh = "ne-table-chart", Ph = "ne-slideshow", Fh = "ne-folder-zip", Ih = "ne-audio-file", Lh = "ne-video-file", Rh = "ne-image", zh = "ne-code", Bh = "ne-draft", Vh = new Map([
	...Gh(Ah, "pdf"),
	...Gh(jh, "txt", "md", "log"),
	...Gh(Mh, "doc", "docx", "odt", "rtf"),
	...Gh(Nh, "xls", "xlsx", "ods", "csv", "tsv"),
	...Gh(Ph, "ppt", "pptx", "odp", "key"),
	...Gh(Fh, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Gh(Ih, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Gh(Lh, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Gh(Rh, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Gh(zh, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Hh = /* @__PURE__ */ new Map([
	["application/pdf", Ah],
	["text/csv", Nh],
	["application/msword", Mh],
	["application/rtf", Mh],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Mh],
	["application/vnd.oasis.opendocument.text", Mh],
	["application/vnd.ms-excel", Nh],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Nh],
	["application/vnd.oasis.opendocument.spreadsheet", Nh],
	["application/vnd.ms-powerpoint", Ph],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Ph],
	["application/vnd.oasis.opendocument.presentation", Ph],
	["application/zip", Fh],
	["application/x-zip-compressed", Fh],
	["application/x-7z-compressed", Fh],
	["application/vnd.rar", Fh],
	["application/x-rar-compressed", Fh],
	["application/x-tar", Fh],
	["application/gzip", Fh],
	["application/json", zh],
	["application/xml", zh],
	["text/xml", zh],
	["text/html", zh]
]), Uh = /* @__PURE__ */ new Map([
	["image", Rh],
	["audio", Ih],
	["video", Lh],
	["text", jh]
]);
function Wh(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Vh.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Hh.get(i) ?? (a < 0 ? void 0 : Uh.get(i.slice(0, a))) ?? Bh;
}
function Gh(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Kh = [
	"http",
	"https",
	"mailto",
	"tel"
];
function qh(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Kh.includes(t.slice(0, n).toLowerCase());
}
function Jh(e) {
	return qh(e) ? String(e) : void 0;
}
var Yh = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Xh(e) {
	let t = eg(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Yh.some((e) => n.startsWith(e));
}
function Zh(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Qh(e);
}
function Qh(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function $h(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function eg(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function tg(e) {
	return ng(e) !== null;
}
function ng(e) {
	let t = eg(e), n = t.toLowerCase();
	return Qh(t) || $h(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function rg(e) {
	return ng(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var ig = "mask:", ag = "ui-icon--image", og = "ui-icon--mask";
function sg(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(ig) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? ng(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function cg(e) {
	let t = sg(e);
	return t === null ? "" : lg(t.source);
}
function lg(e) {
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
var ug = "ui-icon", dg = "data-ui-icon", fg = "--ui-icon-url";
function pg(e, t) {
	e.classList.add(ug);
	for (let t of Array.from(e.classList)) hg(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(fg);
	let n = gg(t);
	if (n.length === 0) {
		e.removeAttribute(dg);
		return;
	}
	e.setAttribute(dg, ""), e.classList.add(n);
	let r = sg(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(fg, lg(r.source));
}
var mg = "ui-icon-glyph--";
function hg(e) {
	return e === ag || e === og || e.startsWith(mg);
}
function gg(e) {
	let t = sg(e);
	return t === null ? _g(e) : t.tinted ? og : ag;
}
function _g(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = mg;
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
var vg = 1024, yg = 16777216;
function bg(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function xg(e, t) {
	let n = jg(t.zoom, 1, 4), r = Ag(e) / n / 2;
	return {
		x: jg(t.x, r, e.width - r),
		y: jg(t.y, r, e.height - r),
		zoom: n
	};
}
function Sg(e, t) {
	let n = Ag(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function Cg(e, t, n) {
	return t.zoom * n / Ag(e);
}
function wg(e, t, n, r, i) {
	let a = Cg(e, t, n);
	return a > 0 ? xg(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function Tg(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = jg(t.zoom * r, 1, 4), o = Cg(e, t, n), s = Cg(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? xg(e, {
		...t,
		zoom: a
	}) : xg(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function Eg(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function Dg(e, t) {
	return Math.min(1, t * 4 / Ag(e), Math.sqrt(yg / (e.width * e.height)));
}
function Og(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function kg(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Ag(e) {
	return Math.min(e.width, e.height);
}
function jg(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Mg(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Xf, e.key), t.setAttribute(Zf, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(ep, ""), t.setAttribute($f, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Qf, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? Nr : `${Nr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Ng = class {
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
}, Pg = 100 / 3, Fg = 1, Ig = 2;
function Lg(e, t = Pg) {
	let n = e.deltaMode === Fg ? Pg : e.deltaMode === Ig ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Rg(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var zg = {
	notch: 100,
	pixels: Lg
}, Bg = "ui-image-crop", Vg = "ui-image-crop-title", Hg = new Ng("data-ui-image-crop-part"), Ug = "data-ui-image-crop-frame", Wg = 10, Gg = 1.2, Kg = 380, qg = 100, Jg = .92, B = null, Yg = !1, Xg = null, Zg = !1;
async function Qg(e, t, n, r = u_) {
	if (B !== null || Yg) return "cancelled";
	Yg = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Yg = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Xg ??= $g();
		let o = Xg;
		o.dialog.isConnected || document.body.append(o.dialog), B = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: bg(a),
			finish: (t) => {
				B = null, e.close(Bg), a.release(), i(t);
			}
		}, E.write(o.title, null, "ui.crop.title"), E.write(o.stage, "aria-label", "ui.crop.frame"), E.write(o.zoom, "aria-label", "ui.crop.zoom"), E.write(o.cancel, null, "ui.crop.cancel"), E.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Ug, n.frame), e.open(Bg), c_(o);
	});
}
function $g() {
	let { dialog: e, surface: t } = Mg({
		key: Bg,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Vg,
		closesOnEscapeAndBackdrop: !1
	}), n = Hg.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Vg;
	let r = Hg.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Hg.element("canvas", "ui-image-crop__canvas"), a = Hg.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Hg.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Hg.button("ui-button--outline", "cancel"), c = Hg.button("ui-button--primary", "apply");
	t.append(n, r, o, Hg.actions(s, c));
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
		let t = Hg.pressed(e);
		t === "cancel" ? B?.finish("cancelled") : t === "apply" && e_();
	}), e.addEventListener("keydown", (e) => t_(l, e)), o.addEventListener("input", () => o_(l, Number(o.value))), r.addEventListener("wheel", (e) => n_(l, e), { passive: !1 }), window.addEventListener("resize", () => l_(l)), new wp({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => B === null ? null : {
			last: t,
			start: B.view
		},
		move: (e, t, n) => {
			e.last !== null && r_(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			B !== null && (B.view = t.start, c_(l));
		},
		pinch: (e, t) => {
			e.last = null, i_(l, t);
		}
	}), l;
}
async function e_() {
	let e = B;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = Sg(n, a), s = Og(t.type), c = i.encodeAsync(n, o, Eg(o, r.size), s);
	B = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], kg(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function t_(e, t) {
	if (t.defaultPrevented || A(t) || B === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), B.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Wg;
	switch (t.key) {
		case "ArrowLeft":
			r_(e, -n, 0);
			break;
		case "ArrowRight":
			r_(e, n, 0);
			break;
		case "ArrowUp":
			r_(e, 0, -n);
			break;
		case "ArrowDown":
			r_(e, 0, n);
			break;
		case "+":
		case "=":
			a_(e, Gg);
			break;
		case "-":
		case "_":
			a_(e, 1 / Gg);
			break;
		case "Enter":
			e_();
			break;
		default: return;
	}
	t.preventDefault();
}
function n_(e, t) {
	if (B === null) return;
	t.preventDefault();
	let n = Lg(t, e.stage.clientHeight), r = t.ctrlKey ? qg : Kg;
	a_(e, 2 ** (-n.y / r), s_(e, t.clientX, t.clientY));
}
function r_(e, t, n) {
	B !== null && (B.view = wg(B.source, B.view, e.frame.clientWidth, t, n), c_(e));
}
function i_(e, t) {
	if (B === null) return;
	let n = wg(B.source, B.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	B.view = Tg(B.source, n, e.frame.clientWidth, t.factor, s_(e, t.center.x, t.center.y)), c_(e);
}
function a_(e, t, n) {
	B !== null && (B.view = Tg(B.source, B.view, e.frame.clientWidth, t, n), c_(e));
}
function o_(e, t) {
	B !== null && Number.isFinite(t) && t > 0 && a_(e, t / B.view.zoom);
}
function s_(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function c_(e) {
	if (B === null) return;
	let t = B.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), l_(e);
}
function l_(e) {
	Zg || B === null || (Zg = !0, requestAnimationFrame(() => {
		if (Zg = !1, B === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = B.view, a = Cg(B.source, i, t);
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
var u_ = {
	decodeAsync: async (e, t) => {
		let n = await d_(e);
		if (n === null) return null;
		let r = n, i = Dg(r, t);
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
		}, r, Jg);
	})
};
async function d_(e) {
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
var f_ = "ui-image-input", p_ = "ui-image-input--multiple", m_ = "ui-image-input__surface", h_ = "ui-image-input__native", g_ = "ui-image-input__picture", __ = "ui-image-input__text", v_ = "ui-image-input__selection", y_ = "ui-image-input__selections", b_ = "ui-image-input__tiles", x_ = "ui-image-input__tile", S_ = "ui-image-input__remove", C_ = "ui-image-input__progress", w_ = "ui-image-input__tile--file", T_ = "ui-image-input__file-glyph", E_ = "ui-image-input__file-name", D_ = "SelectionId", O_ = "--ui-image-progress", k_ = "data-ui-image-preview", A_ = "data-ui-image-dragging", j_ = "data-ui-image-tiles", M_ = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${f_}`)), z(this.root, `.${f_}`, {
			childList: !0,
			attributeFilter: [
				er,
				Xe,
				xr
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === D_ && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(zi(e.components, `.${f_}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(yh, (e) => xh(e, {
			rootSelector: `.${f_}`,
			nativeSelector: `.${h_}`,
			pressed: (e) => e.querySelector(`.${m_}`)
		})), this.root.addEventListener(Is, (e) => this.handleDraftDropped(e)), Ym({
			root: this.root,
			draggingAttribute: A_,
			resolveTarget: (e) => {
				let t = e.closest(`.${m_}`), n = t?.closest(`.${f_}`) ?? null, r = n === null ? Qm(this.root, e, `.${f_}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${m_}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${h_}`)?.getAttribute("accept") ?? "",
					multiple: N_(i),
					refused: k(i) || D(a)
				};
			},
			onFiles: (e, t) => void (N_(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) N_(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${g_}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || z_(e, e.getAttribute("data-ui-image-caption") ?? H_(n)), V_(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(xr);
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
		for (let t of e) N_(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${nr}]`), n = t?.closest(`.${f_}`) ?? null;
		t === null || n === null || k(n) || D(t) || n.querySelector(`.${h_}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S_}`), n = t?.closest(`.${f_}`) ?? null;
		if (t === null || n === null || k(n) || D(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(h_)) return;
		let t = e.target.closest(`.${f_}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (N_(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${f_}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), vh(t.querySelector(`.${v_}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${m_}`), r = e.querySelector(`.${g_}`), i = e.querySelector(`.${v_}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || dh(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(k_, ""), r.setAttribute("src", o.url), z_(e, a.name), V_(e, !0), n.classList.add(Ar);
		try {
			let t = await hh([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, vh(i, t.selectionId));
		} catch (t) {
			s("picture upload failed.", t), this.previews.get(e) === o && (B_(e), vh(i, ""));
		} finally {
			(this.previews.get(e) === o || !this.previews.has(e)) && n.classList.remove(Ar);
		}
	}
	async cropAsync(e, t) {
		let n = F_(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Qg(this.dialogs, t, {
				frame: n,
				size: I_(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${b_}`), r = dh(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = L_(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await hh([t], (e) => r.element.style.setProperty(O_, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Ar), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		P_(e, i), await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), URL.revokeObjectURL(t.url), t.element.remove(), P_(e, n ?? []);
	}
	publishShelf(e) {
		let t = e.querySelector(`.${y_}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(xr, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(k_), t || z_(e, ""));
	}
};
function N_(e) {
	return e.classList.contains(p_);
}
function P_(e, t) {
	e.hasAttribute(j_) !== t.length > 0 && e.toggleAttribute(j_, t.length > 0);
}
function F_(e) {
	let t = e.getAttribute(Ze);
	return t === "square" || t === "circle" ? t : null;
}
function I_(e) {
	let t = Number(e.getAttribute(Qe));
	return Number.isInteger(t) && t > 0 ? t : vg;
}
function L_(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${x_} ${Ar}`, n.type = "button", n.className = S_, r.className = C_, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, E.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...R_(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...R_(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function R_(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(w_), e.setAttribute("title", n.name), r.className = T_, r.setAttribute("aria-hidden", "true"), pg(r, Wh(n.name, n.type)), i.className = E_, i.textContent = n.name, E.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function z_(e, t) {
	let n = e.querySelector(`.${__}`);
	n !== null && (bo(n, null), n.textContent !== t && (n.textContent = t));
}
function B_(e) {
	let t = e.querySelector(`.${__}`);
	t !== null && E.write(t, null, "ui.file.failed");
}
function V_(e, t) {
	let n = e.querySelector(`.${m_}`);
	n !== null && E.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function H_(e) {
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
var U_ = "ui-key-value-action__value", W_ = "ui-key-value-action--editable", G_ = "ui-text__title", K_ = "ui-row-form-", q_ = ":scope > :is(.ui-input--filled, .ui-input--tonal, .ui-input--outline, .ui-input--ghost, .ui-input--underline)", J_ = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${bs}`), !1), z(this.root, `.${bs}`, {
			childList: !0,
			attributeFilter: [Jn]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && $_(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Q_(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), Y_(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${Ss} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${K_}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${xs} [${qe}]:not([${Ft}])`)) t.setAttribute(Ft, n);
		t.setAttribute(Dr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Ft}="${t}"], [${Dr}="${t}"]`)) n.removeAttribute(Ft), n.removeAttribute(Dr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${xs} [${qe}]`)) {
			if (Ms(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Ls(e), this.judge(e);
	}
	judge(e) {
		let t = Z_(e);
		for (let n of e.querySelectorAll(`.${xs} [${qe}]`)) this.options.validation.judgeShown(n, Ms(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${xs} :is(input, textarea, select)`);
		if (n !== null) {
			if (Ms(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Z_(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), js(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.key === "F2" && !e.defaultPrevented && j(e)) {
			X_(e);
			return;
		}
		if (e.defaultPrevented || A(e) || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Es(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains("ui-key-value-action__edit-action")) return;
		let { cell: n, row: r } = t, i = e.target.closest(Rr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Ss} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !D(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Y_(e) {
	for (let t of e.querySelectorAll(`:scope > .${xs}`)) {
		let e = t.querySelector(q_) !== null;
		t.hasAttribute("data-ui-boxed-editor") !== e && t.toggleAttribute(Yn, e);
	}
}
function X_(e) {
	let t = e.target instanceof Element ? e.target.closest(`.${bs}`) : null, n = t === null || t.hasAttribute("data-ui-row-editing") || t.closest(`.${W_}`) === null ? null : t.querySelector(".ui-key-value-action__action")?.querySelector(Jl) ?? null;
	n === null || D(n) || (e.preventDefault(), n.click());
}
function Z_(e) {
	return e.querySelector(`.${U_} .${G_}`)?.textContent?.trim() ?? "";
}
function Q_(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(".ui-key-value-action__value-input")?.closest(".ui-key-value-action__row") ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function $_(e) {
	let t = e.closest(`.${Ss} button`), n = t?.closest(`.${Ss}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var ev = `.ui-button[${vt}="pressed"]`, tv = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ev);
		t === null || D(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, nv = `${zs}, [tabindex], [contenteditable], ${Rr}, [${Ye}]`, rv = ":scope > input.ui-field, :scope > textarea.ui-field", iv = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Rs);
		if (t === null || e.target !== t && e.target.closest(nv) !== null) return;
		let n = t.querySelector(rv);
		if (!Ms(n) || n.readOnly || D(n) || k(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, av = "data-ui-input-debounce", ov = `input[${av}], textarea[${av}]`;
function sv(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(ov);
}
var cv = /* @__PURE__ */ new Set();
function lv() {
	for (let e of cv) if (e.waiting) return !0;
	return !1;
}
function uv() {
	for (let e of cv) e.commitAll();
}
function dv(e) {
	for (let t of cv) t.drop(e);
}
var fv = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), cv.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	drop(e) {
		if (!sv(e)) return;
		let t = this.timers.get(e);
		t !== void 0 && (window.clearTimeout(t), this.timers.delete(e));
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!sv(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(av));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!sv(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, pv = "data-ui-submit-on-enter", mv = "data-ui-runs-on-enter", hv = "enter", gv = "escape", _v = {
	name: hv,
	registration: { settlesValue: !0 }
}, vv = "ui-commit-in-place", yv = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(vv, (e) => {
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
			e.key === "Escape" ? (e.preventDefault(), Ts(t) ? this.runEscape(t, e) : this.leave(t)) : bv(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : xv(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (js(t)) {
			if (e.preventDefault(), bv(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && Ts(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || D(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(hv, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		dv(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = Tu(e);
		e.blur(), Eu(e, n), e.dispatchEvent(new Event(gv, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(Ft);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Dr}="${ei(t)}"]`);
		n !== null && !D(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Tu(e);
		e.blur(), this.changes === t && this.commit(e), Eu(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
};
function bv(e, t) {
	return Sv(t) && e.hasAttribute(mv);
}
function xv(e, t) {
	return Sv(t) && e.hasAttribute(pv) && !e.readOnly && !D(e);
}
function Sv(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var Cv = `img.${$e}`, wv = "%238c8c8c", Tv = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${wv}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${wv}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${wv}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, Ev = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${wv}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${wv}'/%3E%3C/svg%3E`, Dv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Cv)) (Ov(e) || e.complete && e.naturalWidth === 0) && Av(e);
		z(this.root, Cv, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !kv(t) && t.removeAttribute(tt), Ov(t) && Av(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(Cv) && Av(t);
	}
};
function Ov(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function kv(e) {
	let t = e.getAttribute("src");
	return t === Tv || t === Ev;
}
function Av(e) {
	let t = e.getAttribute(et);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	kv(e) || (e.setAttribute(tt, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? Ev : Tv));
}
//#endregion
//#region src/items/radio-row-decorator.ts
var jv = "ui-radio-group__input", Mv = "ui-radio-group__dot", Nv = {
	kind: "radio",
	decorate: Pv
};
function Pv(e) {
	let t = document.createElement("input");
	t.className = jv, t.type = "radio", t.value = e.key;
	let n = document.createElement("span");
	n.className = Mv, e.row.prepend(t, n);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Fv = "data-ui-radio-value", Iv = "ui-radio-group", Lv = "ui-radio-group__item", Rv = "data-ui-radio-group-name", zv = "data-ui-radio-bind-value-id", Bv = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Iv}`)]);
		for (let e of this.root.querySelectorAll(`.${Iv}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Iv}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Vv));
			for (let e of new Set(t.map((e) => e.closest(`.${Iv}`)))) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Fv, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Iv}`)) {
			let n = e.getAttribute(Rv);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Rv), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Rv, a);
			for (let e of hc(r, `.${jv}`, `.${Iv}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Iv}`)) n.has(e.getAttribute(Rv) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Fv), n = e.getAttribute(Rv), r = e.getAttribute(zv);
		for (let i of hc(e, `.${jv}`, `.${Iv}`)) {
			n !== null && i.name !== n && (i.name = n), r !== null && i.getAttribute("data-ui-bind-value") !== r && i.setAttribute(qe, r), i.checked = i.value === t;
			let e = Hv(i);
			i.disabled !== e && (i.disabled = e);
		}
	}
};
function Vv(e) {
	return e.classList.contains(Iv) ? [e] : [...e.querySelectorAll(`.${Iv}`)];
}
function Hv(e) {
	let t = e.closest(`.${Lv}`);
	return t !== null && O(t);
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Uv = "data-ui-search-debounce", Wv = "data-ui-search-min-length", Gv = "data-ui-search-manual", Kv = "data-ui-search-answered", qv = "ui-search__input", Jv = "ui-select__list", Yv = "ui-select__option", Xv = 300, Zv = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qv) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		$v(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Uv), i = r === null ? Xv : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Xv));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || A(e) || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(qv)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		e.dispatchEvent(new Event("change", { bubbles: !0 })), !(!t && e.hasAttribute(Gv)) && Qv(e) && e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Qv(e) {
	let t = Number(e.getAttribute(Wv) ?? 0);
	return !Number.isFinite(t) || e.value.trim().length >= t;
}
function $v(e) {
	if (e.hasAttribute(Kv)) return;
	let t = e.closest(`.${Ur}`), n = t?.querySelector(`.${Jv}`);
	if (t == null || n == null) return;
	let r = Qv(e) ? vp(e.value, e) : [], i = ey(n, (e) => r.length === 0 || bp(yp(Cp(e), e), r));
	ry(t, n, r.length > 0 && i === 0);
}
function ey(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && ty(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Yv)) continue;
		let e = t(a);
		ty(a, e), r ||= e, e && i++;
	}
	return n !== null && ty(n, r), i;
}
function ty(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function ny(e) {
	let t = e.querySelector(`.${Jv}`);
	t !== null && ry(e, t, ey(t, (e) => e.style.display !== "none") === 0);
}
function ry(e, t, n) {
	let r = t.querySelector(`:scope > [${ft}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${ut}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(ft, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var iy = 500, ay = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > iy) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += yp(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (yp(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function oy(e) {
	return A(e) || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var sy = "data-ui-select-value", cy = "data-ui-select-placement", ly = "ui-select--open", uy = "ui-select__trigger-content", dy = "data-ui-select-content", fy = "ui-select__placeholder", py = "ui-input__affix-icon--prefix", my = "ui-select__popup", hy = "ui-select__list", gy = "ui-select__option", _y = "ui-select__value-input", vy = "data-ui-select-clear", yy = "ui-search", by = "ui-search__input", xy = "data-ui-active", Sy = "data-ui-list-keyboard", Cy = /* @__PURE__ */ new Set([
	"ArrowDown",
	"ArrowUp",
	"Home",
	"End",
	"PageDown",
	"PageUp"
]), wy = "ui-multi-select", Ty = "ui-multi-select__chips", Ey = "ui-multi-select__chip", Dy = "ui-multi-select__chip-label", Oy = "ui-multi-select__chip-remove", ky = "data-ui-select-chip", Ay = "data-ui-select-chips", jy = "data-ui-select-max", My = "data-ui-select-free-text", Ny = "ui-multi-select__entry", Py = "data-ui-select-tag-entry", Fy = [
	sy,
	xr,
	jy,
	"class",
	y
];
function Iy(e) {
	return e === null || k(e) || D(e);
}
function Ly(e) {
	return e.classList.contains(wy);
}
function Ry(e) {
	return e.classList.contains(yy);
}
function zy(e) {
	return Ry(e) ? e.querySelector(`.${by}`) : null;
}
function By(e) {
	return e.hasAttribute(My) ? e.querySelector(`:scope > .${zr} .${Ny}`) : null;
}
function Vy(e) {
	return zy(e) ?? By(e);
}
function Hy(e) {
	return By(e) ?? e.querySelector(".ui-select__trigger");
}
function Uy(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Ny) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function Wy(e) {
	return hc(e, `.${my} .${gy}`, `.${Ur}`);
}
function Gy(e) {
	let t = Wy(e).filter((e) => !O(e));
	return t.find((e) => e === document.activeElement) ?? t.find((e) => e.hasAttribute(xy)) ?? null;
}
function Ky(e) {
	for (let t of hc(e, `.${hy}`, `.${Ur}`)) {
		let e = t.querySelector(`:scope > .${gy}[${xy}]:not([${mr}])`) !== null;
		t.hasAttribute(Sy) !== e && t.toggleAttribute(Sy, e);
	}
}
function qy(e) {
	return e === null ? null : Cp(e);
}
function Jy(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(v), t.removeAttribute(y), t.removeAttribute(ae), t.removeAttribute(ie);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Yy = class {
	root;
	popups = new om({
		show: ({ owner: e }) => e.classList.add(ly),
		hide: ({ owner: e }) => {
			e.classList.remove(ly), this.markActive(e, null);
			let t = e.querySelector(`.${my}`);
			t !== null && (t.style.minHeight = "");
		},
		closesOnTab: !0,
		sheetOnPhone: ({ owner: e }) => Vy(e) === null
	});
	typeAhead = new ay();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${Ur}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) ob(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Fy,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${vy}], .${Oy}`) !== null || tb(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Iy(r)) return;
		this.releaseRefusal(r);
		let i = pc(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Uy(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && !A(e) ? Uy(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Py) !== "first-suggestion" || !Wy(t.select).some((e) => e.hasAttribute(xy)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Uy(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Iy(t.select) || !dc(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, fc(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = ac(e.getAttribute(xr)), a = oc(e.getAttribute(jy)), o = mc(i, n.map((t) => ({
			text: t,
			key: nb(e, t) ?? t
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
		$v(t);
		let n = t.value.trim().length > 0, r = n ? Zy(e) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Py) === "first-suggestion" && (this.markActive(e, i), i !== null && $y(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Ky(e), Ly(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(sy);
		this.decorateOptions(e);
		let n = t === null ? null : Wy(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${fy}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of Wy(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${_y}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), ny(e);
	}
	syncMultiple(e) {
		let t = ac(e.getAttribute(xr)), n = new Set(t), r = sc(t, oc(e.getAttribute(jy)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Wy(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = By(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		ib(e, s.map((e) => ({
			key: e,
			label: rb(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Iy(e) && (o.readOnly = Iy(e));
		let c = e.querySelector(`.${fy}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${_y}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(xr, u), ny(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${zr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${uy}`), a = i?.getAttribute(dy) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(dy), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Ry(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(y);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = uy;
			let e = r.querySelector(`:scope > .${py}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Jy(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Wy(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = O(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${gy}`);
		t === null || n === null || n.hasAttribute(xy) || O(n) || D(n) || n.closest(".ui-select") !== t || (Vy(t) === null && (M(Wy(t).filter((e) => !O(e)), n), hu(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Oy}`);
		if (t !== null) {
			let n = t.closest(`.${Ur}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Iy(n) || this.removeChosen(n, t.closest(`.${Ey}`)?.getAttribute(ky) ?? null));
			return;
		}
		let n = e.target.closest(`[${vy}]`);
		if (n !== null) {
			let t = n.closest(`.${Ur}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Iy(t) || (this.clearValue(t), Xy(t)));
			return;
		}
		let r = e.target.closest(`.${zr}`);
		if (r !== null) {
			let t = r.closest(`.${Ur}`);
			if (Iy(t)) return;
			e.preventDefault();
			let n = t === null ? null : By(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${gy}`);
		if (i === null) return;
		let a = i.closest(`.${Ur}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(Wy(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e) || (this.openSelect !== null && Ky(this.openSelect), this.handleEntryKey(e) || this.handleChipKey(e)) || this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target) && this.handleOpenListKey(e, this.openSelect) || (e.key === "ArrowDown" || e.key === "ArrowUp") && j(e, { alt: e.key === "ArrowDown" }) && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gy}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Ur}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleOpenListKey(e, t) {
		if (e.key === "ArrowUp" && e.altKey && j(e, { alt: !0 })) {
			e.preventDefault();
			let n = Gy(t);
			return n !== null && !Ly(t) ? this.choose(t, n) : this.close(), !0;
		}
		return !Cy.has(e.key) || !j(e) || (e.key === "Home" || e.key === "End") && Ms(e.target) ? !1 : (e.preventDefault(), this.moveCurrent(t, e.key), !0);
	}
	handleEntryKey(e) {
		let t = Uy(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Iy(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? Zy(r).find((e) => e.hasAttribute(xy)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, fc(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, fc(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Ty} > .${Ey}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(ky)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = eb(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Oy}`) ?? (n === 1 ? Hy(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		$v(t);
		let r = Zy(e), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Oy) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Ly(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Iy(n)) return !0;
				let r = eb(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(ky) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(ky) ?? null);
				let o = a === null ? null : eb(n).find((e) => e.getAttribute(ky) === a) ?? null;
				return o !== null && o.querySelector(`.${Oy}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Iy(t)) return !1;
		e.preventDefault();
		let n = zy(t);
		n !== null && $v(n);
		let r = Zy(t), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = oy(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(gy))) return !1;
		let r = n.closest(`.${Ur}`), i = r !== null && r === this.openSelect;
		if (r === null || Iy(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = zy(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = Zy(r), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(xy)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => qy(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (M(Wy(r).filter((e) => !O(e)), c), $y(r, c), L(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Ly(t) || Iy(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Ty} > .${Ey}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(ky)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(by) || !t.contains(e.target) ? null : Zy(t).find((e) => e.hasAttribute(xy)) ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Vy(e), i = By(e);
		r !== null && !t && $v(r), ny(e);
		let a = e.querySelector(`.${zr}`), o = e.querySelector(`.${my}`), s = e.querySelector(`.${hy}`) ?? o, c = e.getAttribute(cy);
		if (a === null || o === null || s === null) return;
		let l = ri(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && qd(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), sb(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = Zy(e);
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && cu()) {
			M(n, null), this.markActive(e, null), Xy(e);
			return;
		}
		let i = r ?? n[0];
		M(n, i), this.markActive(e, i, cu()), $y(e, i), L(i);
	}
	initializeSearch(e, t, n, r) {
		let i = Wy(e), a = Zy(e), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || cu() ? null : a[0] ?? null);
		M(i, null), this.markActive(e, o, cu()), o !== null && $y(e, o), !lu() && (L(t), t.select());
	}
	initializeEntry(e, t) {
		M(Wy(e), null), this.markActive(e, t), t !== null && $y(e, t);
	}
	moveCurrent(e, t) {
		let n = Wy(e).filter((e) => !O(e)), r = Ml(t, n, Gy(e), "vertical");
		r !== null && (Vy(e) === null ? Xs(n, r) : $y(e, r), this.markActive(e, r));
	}
	markActive(e, t, n = !1) {
		for (let r of Wy(e)) r === t ? r.setAttribute(xy, "") : r.hasAttribute(xy) && r.removeAttribute(xy), uu(r, r === t && n);
		Ky(e);
		let r = Vy(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", ri(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || O(t) || Iy(e)) return;
		if (Ly(e)) {
			let r = cc(ac(e.getAttribute(xr)), n, oc(e.getAttribute(jy)));
			this.markActive(e, t, cu()), r !== null && this.writeChosen(e, r);
			let i = By(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(sy) === n) {
			this.close();
			return;
		}
		e.setAttribute(sy, n), this.sync(e);
		let r = e.querySelector(`.${_y}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : lc(ac(e.getAttribute(xr)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Ey}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Hy(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(xr) : e.setAttribute(xr, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${_y}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Ly(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(sy)) return;
		e.removeAttribute(sy), this.sync(e);
		let t = e.querySelector(`.${_y}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Xy(e) {
	let t = e.querySelector(`.${zr}`), n = Hy(e);
	t !== null && n !== null && !t.contains(document.activeElement) && L(n);
}
function Zy(e) {
	return Wy(e).filter((e) => Qy(e) && !O(e) && !D(e));
}
function Qy(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function $y(e, t) {
	let n = e.querySelector(`.${hy}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function eb(e) {
	return [...e.querySelectorAll(`.${Ty} > .${Ey}`)];
}
function tb(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && By(t) !== null && !e.classList.contains(Ny);
}
function nb(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of Wy(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !O(t) && (e.toLocaleLowerCase() === n || qy(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function rb(e, t) {
	let n = qy(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function ib(e, t) {
	let n = e.querySelector(`.${Ty}`);
	if (n === null) return;
	n.hasAttribute(Ay) !== t.length > 0 && n.toggleAttribute(Ay, t.length > 0);
	let r = [...n.querySelectorAll(`:scope > .${Ey}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(ky) === t[n].key && e.querySelector(`.${Dy}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => ab(e.key, e.label)));
	}
}
function ab(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Ey, n.setAttribute(ky, e), r.className = Dy, r.textContent = t, i.className = Oy, i.type = "button", i.tabIndex = -1, E.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function ob(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Ur}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === sy || e.attributeName === "data-ui-selected-keys" || e.attributeName === jy)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${my}`)?.closest(`.${Ur}`);
	n != null && t.add(n);
}
function sb(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var cb = class {
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
		!Ms(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, lb = "textarea.ui-text-area__field", ub = "data-ui-text-area-grow";
function db() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var fb = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(lb) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(lb)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(zi(e.components, lb));
		}), z(this.root, lb, {
			childList: !0,
			attributeFilter: [ub]
		}, (e) => {
			this.fitAll(zi(e, lb));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(ub)) {
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
function pb(e) {
	let t = mb(e.getAttribute("min"), 0), n = mb(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, mb(r, 1))
	};
}
function mb(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function hb(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function gb(e, t) {
	return _b(t.min + e * (t.max - t.min), t);
}
function _b(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, vb(t.min + r * t.step, t);
}
function vb(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(yb(t.step), yb(t.min)))));
}
function yb(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function bb(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function xb(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return Sb(o, i);
	let s = (o - i.min) / i.step;
	return Sb(vb(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function Sb(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var Cb = "ui-slider__input", wb = "ui-slider__input--end", Tb = "ui-slider__input--held", Eb = "ui-slider__value", Db = "ui-slider__bubble", Ob = "ui-slider__track", kb = "ui-slider__thumb-anchor", Ab = "ui-slider", jb = "ui-slider--range", Mb = "ui-orientation--vertical", Nb = "--ui-slider-fraction", Pb = "--ui-slider-end-fraction", Fb = 6, Ib = "Value", Lb = "EndValue", Rb = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), zb = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new wp({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${jb} .${Ob}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (Rb.has(e.propertyName)) for (let t of zi(e.components, `.${Cb}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Vb(t) ? Lb : Ib) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Bb(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Bb(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Bb(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Wb(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Cb)) return;
		let t = e.target;
		if (this.cancelled.delete(t), Wb(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Hb(t);
		if (n !== null) {
			let e = Ub(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${Cb}:not(.${wb})`), r = e.querySelector(`.${wb}`);
		if (n === null || r === null) return null;
		let i = gb(hb(e.getBoundingClientRect(), t, Gb(e), Kb(e)), pb(n)), a = bb(i, Number(n.value), Number(r.value));
		if (Wb(n)) return L(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${Ob}`);
		if (n === null) return;
		let r = gb(hb(n.getBoundingClientRect(), t, Gb(n), Kb(n)), pb(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Tb), L(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Hb(e), r = n === null ? String(t) : Ub(e, t, n);
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
		e.held?.classList.remove(Tb), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = qb(e);
		t !== null && af(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Fb
		});
	}
	releaseBubble(e) {
		_f(qb(e)?.bubble);
	}
	writeReadings(e) {
		let t = Vb(e), n = e.closest(`.${Ob}`)?.parentElement ?? e.parentElement, r = t ? `.${Eb}--end, .${Db}--end` : `.${Eb}:not(.${Eb}--end), .${Db}:not(.${Db}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Ob}`)?.style.setProperty(t ? Pb : Nb, String(Jb(e))), e.matches(`:active, :focus-visible, .${Tb}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Bb(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Cb) ? e : null;
}
function Vb(e) {
	return e.classList.contains(wb);
}
function Hb(e) {
	return e.closest(`.${jb} .${Ob}`)?.querySelector(Vb(e) ? `.${Cb}:not(.${wb})` : `.${wb}`) ?? null;
}
function Ub(e, t, n) {
	let r = Number(e.closest(`.${Ab}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(xb(t, Vb(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, pb(e)));
}
function Wb(e) {
	return k(e) || D(e);
}
function Gb(e) {
	return e.closest(`.${Ab}`)?.classList.contains(Mb) === !0;
}
function Kb(e) {
	let t = e.querySelector(`.${kb}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : Gb(e) ? t.height : t.width;
}
function qb(e) {
	if (!(e instanceof Element) || !e.classList.contains(Cb)) return null;
	let t = e.closest(`.${Ob}`), n = Vb(e), r = t?.querySelector(n ? `.${Db}--end` : `.${Db}:not(.${Db}--end)`) ?? null, i = t?.querySelector(n ? `.${kb}--end` : `.${kb}:not(.${kb}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: Gb(e)
	};
}
function Jb(e) {
	let { min: t, max: n } = pb(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Yb = {
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
}, Xb = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Zb = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Qb = [
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
], $b = [
	"n %",
	"n%",
	"%n",
	"% n"
], ex = [
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
], tx = /[1-9]/;
function nx(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Yb;
	try {
		return {
			...Yb,
			...JSON.parse(t)
		};
	} catch {
		return Yb;
	}
}
function rx(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = ax(t);
	if (r === null) return ox(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = sx(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return ix(e, t) ? fx(Xb[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = sx(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return ix(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = cx(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return ix(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = sx(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return fx(ix(e, t) ? Qb[n.currencyNegativePattern] ?? "-$n" : Zb[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = sx(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return fx(ix(e, t) ? ex[n.percentNegativePattern] ?? "-n %" : $b[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return ox(e, n);
	}
}
function ix(e, t) {
	return e < 0 && tx.test(t);
}
function ax(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function ox(e, t) {
	let { integer: n, fraction: r } = lx(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function sx(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = cx(e, t, n);
	return n === 0 ? dx(o, r, i) : `${dx(o, r, i)}${a}${s}`;
}
function cx(e, t, n) {
	let { integer: r, fraction: i } = lx(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? ux(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function lx(e, t) {
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
function ux(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function dx(e, t, n) {
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
function fx(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var px = /^[\t\n\v\f\r ]*[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?[\t\n\v\f\r ]*$/;
function mx(e) {
	if (!px.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
var hx = {
	readCulture: nx,
	format: rx,
	parseInvariant: mx
}, gx = /^-?(\d+(\.\d*)?|\.\d+)$/;
function _x(e, t, n) {
	if (!gx.test(e)) return e;
	let r = n.thousands ? t : Cx(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return rx(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return rx(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function vx(e, t, n) {
	return gx.test(e) ? (Sx(n) ? wx(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function yx(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Sx(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!gx.test(d)) return null;
	let f = a ? wx(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function bx(e, t, n, r, i) {
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
function xx(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Sx(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function Cx(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function wx(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Tx = "ui-number-input", Ex = "ui-number-input__field", Dx = "data-ui-number-no-decimals", Ox = "data-ui-number-no-negative", kx = "data-ui-number-no-thousands", Ax = "data-ui-number-trim-zeros", jx = "data-ui-number-step", Mx = "data-ui-number-min", Nx = "data-ui-number-max", Px = "data-ui-number-step-direction", Fx = /* @__PURE__ */ new Map([
	["ArrowUp", 1],
	["ArrowDown", -1],
	["PageUp", 10],
	["PageDown", -10]
]), Ix = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Ex}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(zi(e.components, `.${Ex}`));
		}), E.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${Ex}`)));
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
		let t = Lx(e);
		if (t !== null) return this.keptValue(t) ?? Vx(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(Ax) ? xx(t) : t, r = nx(e), i = e === document.activeElement ? vx(n, r, Hx(e)) : Bx(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = Lx(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Dx), r = !t.hasAttribute(Ox), i = t.selectionStart ?? t.value.length, a = bx(t.value, i, nx(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Lx(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = Lx(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : Vx(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(Ax) && !k(t) && !D(t)) {
			let e = this.values.get(t) ?? "", n = xx(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = Lx(e.target);
		if (t === null) return;
		let n = Vx(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = Lx(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = vx(t, nx(e), Hx(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Px + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Ex}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(Px) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		let t = Fx.get(e.key);
		if (t === void 0 || !j(e, { shift: !0 }) || e.defaultPrevented) return;
		let n = Lx(e.target);
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t));
	}
	step(e, t) {
		let n = Number(e.getAttribute(jx) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : Vx(e) ?? "0") || 0) + n * t, i = e.getAttribute(Mx), a = e.getAttribute(Nx);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, Ux(r)), this.show(e);
	}
};
function Lx(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Ex) ? e : null;
}
function Rx(e, t) {
	let n = e.classList.contains(Tx) ? e.querySelector(`.${Ex}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = zx(n, Mx), a = zx(n, Nx);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: Bx(n, i, nx(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: Bx(n, a, nx(n)) }
	} : null;
}
function zx(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function Bx(e, t, n) {
	return _x(t, n, {
		format: Hx(e),
		thousands: !e.hasAttribute(kx)
	});
}
function Vx(e) {
	return yx(e.value, nx(e), Hx(e));
}
function Hx(e) {
	return e.closest(`.${Tx}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Ux(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function Wx(e, t) {
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
function Gx(e) {
	switch (e.getAttribute(bt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function Kx(e) {
	let t = Gx(e) === "windowed" ? qx(e, "data-ui-window-offset") ?? 0 : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function qx(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
function Jx(e, t) {
	return e.getAttribute(t)?.toLowerCase() === "true";
}
//#endregion
//#region src/interactions/item-drags.ts
var Yx = "application/x-ne-items", Xx = null, Zx = null;
function Qx(e, t, n) {
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
function $x(e, t) {
	let n = jc(t);
	return n.includes(e) ? n.filter((t) => t === e || tS(t)) : [e];
}
function eS(e) {
	return !Lo(e, "data-ui-undraggable") && !O(e);
}
function tS(e) {
	return eS(e) && F(e) !== null;
}
function nS(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function rS(e, t, n = null) {
	Xx = t, Zx = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(Yx, t.kind);
}
function iS(e) {
	return Xx !== null && e.dataTransfer?.types.includes(Yx) === !0 ? Xx : null;
}
function aS() {
	let e = Zx;
	Xx = null, Zx = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var oS = `:scope > [${ft}], :scope > [${pt}], :scope > [${Tt}]`;
function V(e) {
	let t = new Set(e.querySelectorAll(oS));
	return [...e.children].filter((e) => !t.has(e));
}
function sS(e) {
	return e === null ? [] : [e];
}
function cS(e) {
	return e.querySelector(`:scope > [${ft}]`);
}
function lS(e, t, n, r, i) {
	i ??= V(e).some((e) => !e.classList.contains(Mr));
	let a = cS(e);
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
	c.setAttribute(ft, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var uS = { ok: !1 }, dS = {
	ok: !0,
	value: null
}, fS = null;
function pS(e) {
	fS = e;
}
function mS(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => si(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) si(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return uS;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return uS;
			let t = a[u];
			if (u++, si(t.kind) === "Dynamic") {
				let n = vS(e, t.componentId);
				if (!n.ok) return uS;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return uS;
				let e = TS(s, t.value);
				if (!e.ok) return uS;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return uS;
		if (l) {
			let e = xS(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? uS : {
		ok: !0,
		value: s,
		scope: c
	};
}
function hS(e, t, n) {
	for (let r of t ?? []) {
		if (si(r.kind) !== "Dynamic") continue;
		let t = w(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function gS(e) {
	let t = bS(e, "IsContent");
	return t.ok && t.value === !0;
}
var _S = /* @__PURE__ */ new Set();
function vS(e, t) {
	let n = w(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return _S.has(n) || (_S.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), uS;
}
function yS(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = bS(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function bS(e, t) {
	return xS(e, t, !0);
}
function xS(e, t, n) {
	if (e == null) return uS;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return uS;
	let r = e, i = SS(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? uS : (n && fS?.(r, t), dS);
}
function SS(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = CS(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function CS(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function wS(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => si(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, si(e.kind) !== "Dynamic") {
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
function TS(e, t) {
	if (e == null || t == null) return uS;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : uS;
	if (typeof t != "string") return uS;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (DS(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return uS;
}
function ES(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (DS(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function DS(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function OS(e) {
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
function kS(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = OS(e);
	if (a === void 0 && o === null) {
		for (let t of V(e)) t.classList.remove(Mr);
		return;
	}
	for (let n of V(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Mr);
			continue;
		}
		n.classList.toggle(Mr, !AS(a, e, i, o));
	}
}
function AS(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => FS(e, t, n)) && (r?.filters ?? []).every((e) => bd(yS(t, e.itemProperty), e.operator, e.value));
}
function jS(e, t, n = null) {
	return (e?.filters ?? []).some((e) => IS(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function MS(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => IS(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function NS(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => PS(n.getItemValue(e), n.getItemValue(r), t));
}
function PS(e, t, n) {
	for (let r of n) {
		let n = LS(xd(yS(e, r.itemProperty)), xd(yS(t, r.itemProperty)));
		if (n !== 0) return fi(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function FS(e, t, n) {
	if (!IS(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return bd(yS(t, e.itemProperty), e.operator, r);
}
function IS(e, t, n, r) {
	return e == null || bd(r.get(e, []), t, n);
}
function LS(e, t) {
	if (e === t) return 0;
	let n = zS(e), r = zS(t);
	if (n !== r) return n - r;
	if (n === RS.Nothing) return 0;
	if (n === RS.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var RS = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function zS(e) {
	return e == null ? RS.Nothing : typeof e == "number" ? Number.isNaN(e) ? RS.Nothing : RS.Number : typeof e == "string" && e.trim().length === 0 ? RS.Nothing : Number.isNaN(Number(e)) ? RS.Text : RS.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var BS = /* @__PURE__ */ new WeakMap();
function VS(e, t) {
	let n = BS.get(e), r = n === void 0 ? [...t] : HS(n, t);
	return BS.set(e, r), r;
}
function HS(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function US(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function WS(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function GS(e, t, n) {
	return WS(e, t), US(e, t, n);
}
function KS(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function qS(e) {
	BS.delete(e);
}
//#endregion
//#region src/interactions/tab-rows.ts
var JS = "ui-tab-item";
function YS(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function XS(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? YS(e).parentElement : null;
}
function ZS(e, t) {
	return Lo(YS(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var QS = ".ui-items-view__item, .ui-table__row", $S = "ui-row--dragging", eC = "--ui-row-drop-offset", tC = "move", nC = ".ui-items-view--wrap", rC = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight"
]);
function iC(e, t) {
	Ll(e, tC, { index: t });
}
function aC(e) {
	return {
		name: tC,
		registration: {
			dynamicParameters: (e) => {
				let t = oC(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...Wx((t) => e === void 0 ? null : sC(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function oC(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function sC(e, t) {
	let n = oC(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = XS(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(QS), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, I(i), n);
	return o === null ? null : { pending: o };
}
var cC = class {
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
		let r = pC(t.root, t.row);
		if (r === null ? !mC(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (dl(t.root, bC(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(bc), n = t?.parentElement ?? null, r = n?.closest(P) ?? null;
		if (t === null || n === null || r === null || !t.matches(QS) || !n.hasAttribute("data-ui-items-host") || D(r) || !tS(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = Vi(e);
		return this.services === void 0 || n === null ? !1 : MS(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, OS(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : F(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = Qx(t.root, n, $x(t.row, bC(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => F(e) ?? e);
		Bm(e, t.root, r, $S, I(t.row), a, nS(i, t.moves)), rS(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = gC(t.root, t.host), r = bC(t.host), i = dC(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? xC(t.root, null) : xC(t.root, i, vC(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (hC(t) !== hC(e.row)) return null;
		let r = lC(fC(e.host, this.services?.keysOf), I(e.row), I(t), n);
		return r === null ? null : r + Kx(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && Um(e, t.host) && xC(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = dC(t.host, e.target, e, gC(t.root, t.host), bC(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && iC(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Vm(e.root, $S), xC(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || !j(e, { alt: !0 }) || !rC.has(e.key) || !(e.target instanceof Element)) return;
		let t = rl(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table")) return;
		let n = zc(t.root), r = n === null ? null : gC(t.root, n), i = e.key === "ArrowLeft" || e.key === "ArrowRight";
		if (n === null || r === null || i && !r.across) return;
		let a = bC(n), o = ol(a);
		if (o === null || this.liftableRow(o)?.moves !== !0) return;
		e.preventDefault();
		let s = e.key === "ArrowDown" || e.key === "ArrowRight", c = !i && t.root.matches(nC) ? Pl(a, o, s) : a[a.indexOf(o) + (s ? 1 : -1)] ?? null, l = c === null ? null : this.indexOf({
			host: n,
			row: o
		}, c, s ? "after" : "before");
		l !== null && iC(o, l);
	}
};
function lC(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = uC(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function uC(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function dC(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(bc);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(bc) ?? null;
	if (a ??= yC(i, n), a === null) return null;
	let o = (F(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && _C(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function fC(e, t) {
	switch (Gx(e)) {
		case "virtualized": return [...t?.(e) ?? V(e).map(I)];
		case "windowed": return V(e).map(I);
		default: return VS(e, V(e)).map(I);
	}
}
function pC(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function mC(e, t) {
	return Ks(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function hC(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function gC(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function _C(e, t, n) {
	if (hC(e) !== hC(t)) return !1;
	if (!n.across) return !0;
	let r = (F(e) ?? e).getBoundingClientRect(), i = (F(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function vC(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !_C(t.anchor, r, n)) return -1;
	let i = (F(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (F(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function yC(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (F(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function bC(e) {
	return V(e).filter((e) => e instanceof HTMLElement && e.matches(bc) && F(e) !== null);
}
function xC(e, t, n = 0) {
	let r = t === null ? null : F(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(eC));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(eC) !== i && r.style.setProperty(eC, i);
}
function SC(e) {
	e.classList.remove($S), e.querySelector(`:scope > [${v}]`)?.classList.remove($S);
}
//#endregion
//#region src/interactions/tree-drop.ts
var CC = "--ui-tree-drop-depth";
function wC(e) {
	return e.querySelector(`.${kn}`);
}
function TC(e, t) {
	if (O(e)) return !1;
	let n = t?.getAttribute(Vn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function EC(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || TC(n, wC(n));
}
function DC(e, t) {
	let n = wC(e);
	if (TC(e, n)) return I(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return EC(r, t) ? r : null;
}
function OC(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${An}]`)) n !== t && (n.removeAttribute(An), n.style.removeProperty(CC));
	t !== null && (t.setAttribute(An, n), r === void 0 ? t.style.removeProperty(CC) : t.style.setProperty(CC, String(r)));
}
function kC(e, t, n) {
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
function AC(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = jC(e, r, n);
	return i === null || !MC(e, i.parent) ? null : i;
}
function jC(e, t, n) {
	if (n === "in") {
		let n = kC(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = kC(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: PC(e, n, t.parent, !1)
		};
	}
	let r = NC(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function MC(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function NC(e, t) {
	return e.filter((e) => e.parent === t);
}
function PC(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = NC(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function FC(e, t, n) {
	let r = NC(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? PC(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var IC = "drop:", LC = "ui-row--cut", RC = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, zC = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, BC = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function VC(e) {
	return {
		dynamicParameters: (e) => {
			let t = HC(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...Wx((t) => UC(e, t), (t) => e?.settle(t))
	};
}
function HC(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function UC(e, t) {
	let n = HC(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var WC = class {
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
		let t = iS(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = GC(t, r, KC(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? zc(e) : null;
		if (r !== null) {
			let i = bC(r), a = gC(e, r), o = fC(r, this.options.keysOf), s = t !== null && n !== null ? dC(r, t, n, a, i) : qC(i);
			return {
				index: ((s === null ? null : uC(o, I(s.anchor), s.side)) ?? o.length) + Kx(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(he, "") : xC(e, s, vC(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = JC(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? zc(e) : YC(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => OC(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => {
				e.setAttribute(he, ""), Wm(e, !0);
			}
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(he), Wm(e, !1), e.matches(".ui-items-view, .ui-table") ? xC(e, null) : e.classList.contains("ui-tree") && OC(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && Um(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), aS(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && Gx(e.host) === "plain" && Gx(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(IC + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), aS();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.clipboard !== null && !A(e) && (e.preventDefault(), this.letGo());
				return;
			}
			Ns(e.target) || ($o(BC, e) ? this.paste(e, e.target) : $o(RC, e) ? this.take(e, e.target, !0) : $o(zC, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (F(e) ?? e).classList.remove(LC);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : GC(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = nl(t), a = i === null ? null : zc(i.root);
		if (i === null || a === null || D(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = bC(a), s = i.row ?? ol(o), c = s === null || !tS(s) ? null : Qx(i.root, a, $x(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (F(e) ?? e).classList.add(LC);
	}
};
function GC(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function KC(e) {
	return as() ? e.altKey : e.ctrlKey;
}
function qC(e) {
	let t = sl(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function JC(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : DC(n, (t) => YC(e, t));
}
function YC(e, t) {
	return e.querySelector(`.${On}[${y}="${ei(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-range.ts
function XC(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = ew(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < tw(e.start).getTime() ? {
		start: ew(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: ew(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function ZC(e, t, n) {
	if (t === null || n === null) return !1;
	let r = tw(e).getTime();
	return r > tw(t).getTime() && r < tw(n).getTime();
}
function QC(e, t, n) {
	return !n && ZC(e, t.start, t.end);
}
function $C(e) {
	return e.start !== null && e.end !== null && e.end.getTime() < e.start.getTime() ? {
		start: e.end,
		end: e.start
	} : e;
}
function ew(e, t) {
	return pa(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function tw(e) {
	return pa(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-dom.ts
var H = "ui-temporal-input", nw = "ui-calendar", rw = `.${H}, .${nw}`, iw = "ui-temporal-input__value-input", aw = "ui-temporal-input__end-value-input", ow = "data-ui-temporal-range", sw = "data-ui-temporal-end", cw = "data-ui-temporal-mode", lw = "data-ui-temporal-format", uw = "data-ui-temporal-default-format", dw = "data-ui-temporal-min", fw = "data-ui-temporal-max", pw = "data-ui-temporal-step", mw = "data-ui-temporal-step-unit", hw = "data-ui-temporal-marked-days", gw = "data-ui-temporal-marked-only", _w = "data-ui-temporal-page-culture", vw = "data-ui-temporal-months", yw = "data-ui-temporal-months-genitive", bw = "data-ui-temporal-months-short", xw = "data-ui-temporal-daynames", Sw = "data-ui-temporal-weekdays", Cw = "data-ui-temporal-first-day", ww = "data-ui-temporal-am", Tw = "data-ui-temporal-pm", Ew = /* @__PURE__ */ new Set([
	lw,
	uw,
	dw,
	fw,
	vw,
	ww,
	Tw,
	hw,
	gw
]), Dw = 2e3;
function Ow(e) {
	let t = e.getAttribute(cw);
	return t === "time" || t === "date-time" ? t : "date";
}
function kw(e) {
	let t = e.getAttribute(lw);
	return t === null || t.trim().length === 0 ? e.getAttribute(uw) ?? "" : t;
}
function Aw(e) {
	let t = e.getAttribute(mw), n = Math.max(1, Math.trunc(Number(e.getAttribute(pw))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function jw(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Mw(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Nw(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function Pw(e) {
	return {
		monthNames: Fw(e, vw),
		monthGenitiveNames: Fw(e, yw),
		abbreviatedMonthNames: Fw(e, bw),
		dayNames: Fw(e, xw),
		abbreviatedDayNames: Fw(e, Sw),
		amDesignator: e.getAttribute(ww) ?? "AM",
		pmDesignator: e.getAttribute(Tw) ?? "PM"
	};
}
function Fw(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Iw(e, t) {
	e.hasAttribute(_w) && (Bw(e, yw, t.monthGenitiveNames.join("|")), Bw(e, bw, t.abbreviatedMonthNames.join("|")), Bw(e, xw, t.dayNames.join("|")), Bw(e, Sw, t.abbreviatedDayNames.join("|")), Bw(e, vw, t.monthNames.join("|")), Bw(e, ww, t.amDesignator), Bw(e, Tw, t.pmDesignator), Bw(e, uw, zw(Ow(e), Aw(e), t)));
}
function Lw(e) {
	for (let t = 0; t < e.length;) {
		let n = sa(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Rw(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(Oa(e));
	return r.length === 0 ? i : `${i} ${r}`;
}
function zw(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Qi(n, r);
}
function Bw(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Vw(e) {
	return e.hasAttribute(ow);
}
function Hw(e) {
	return e !== null && e.hasAttribute(sw);
}
function Uw(e) {
	return U(e, !1);
}
function U(e, t) {
	let n = Ww(e, t);
	return n === null ? null : nT(n.value, Ow(e));
}
function Ww(e, t) {
	return e.querySelector(`.${t ? aw : iw}`);
}
function Gw(e, t) {
	return nT(e.getAttribute(t) ?? "", Ow(e));
}
function Kw(e) {
	let t = Gw(e, dw), n = Gw(e, fw), r = (e.getAttribute(hw) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : rT(t, "date"),
		max: n === null ? null : rT(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(gw)
	};
}
function qw(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function Jw(e, t, n) {
	let r = Ww(e, n);
	if (r === null) return;
	let i = t === null ? "" : rT(t, Ow(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Yw(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : _a(n, kw(e), Pw(e));
	return r === null ? n : rT(fa(r), Ow(e));
}
function Xw(e) {
	if (!Vw(e)) return;
	let t = {
		start: U(e, !1),
		end: U(e, !0)
	}, n = $C(t);
	n !== t && (Jw(e, n.start, !1), Jw(e, n.end, !0));
}
function Zw(e) {
	let t = Gw(e, dw), n = Gw(e, fw);
	if (t === null && n === null) return null;
	for (let r of Vw(e) ? [!1, !0] : [!1]) {
		let i = U(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: na(t, kw(e), Pw(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: na(n, kw(e), Pw(e)) }
		};
	}
	return null;
}
function Qw(e) {
	return eT(e, $w(e, /* @__PURE__ */ new Date()));
}
function $w(e, t) {
	let n = Gw(e, dw), r = Gw(e, fw);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function eT(e, t) {
	let n = Aw(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var tT = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function nT(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = tT.exec(n);
		return e === null ? null : new Date(Dw, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = da(n);
	return r === null ? null : fa(r);
}
function rT(e, t) {
	let n = `${iT(e.getHours())}:${iT(e.getMinutes())}:${iT(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${iT(e.getMonth() + 1)}-${iT(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function iT(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var aT = "ui-temporal-input__day", oT = "ui-temporal-input__month", sT = 3, cT = "data-ui-temporal-nav", lT = "data-ui-temporal-day", uT = 366;
function dT(e) {
	let t = Uw(e);
	return {
		view: FT(t ?? $w(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function fT(e, t, n, r) {
	let i = PT("div", `${H}__calendar`), a = PT("div", `${H}__calendar-header`), o = Kw(e), s = NT("previous", "‹", E.text("ui.picker.previous"));
	s.disabled = pT(o, t, -1) === null, a.append(s);
	let c = NT("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${H}__calendar-label`), a.append(c);
	let l = NT("next", "›", E.text("ui.picker.next"));
	return l.disabled = pT(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? _T(e, t, n, r, o) : vT(t, n, o)), i;
}
function pT(e, t, n) {
	let r = t.pane === "months", i = RT(t.view, n * (r ? 12 : 1));
	return hT(e, mT(i, r ? 4 : 7)) ? gT(e, i) : null;
}
function mT(e, t) {
	return rT(e, "date").slice(0, t);
}
function hT(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function gT(e, t) {
	let n = mT(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : nT(r, "date");
	return i === null ? t : FT(i);
}
function _T(e, t, n, r, i) {
	let a = AT(e), o = PT("div", `${H}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = PT("span", `${H}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = PT("div", `${H}__days`), c = tw(/* @__PURE__ */ new Date()), l = Vw(e), u = l ? U(e, !1) : r, d = l ? U(e, !0) : null, f = IT(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = LT(f, e), r = rT(n, "date"), a = PT("button", aT);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(lT, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${aT}--outside`), zT(n, c) && (a.classList.add(`${aT}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${aT}--marked`);
		let o = u !== null && zT(n, u), p = d !== null && zT(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${aT}--selected`), l && (o || p) && a.setAttribute("aria-description", E.text(o ? "ui.picker.start" : "ui.picker.end")), QC(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${aT}--within`), qw(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = PT("div", `${H}__calendar-pane`);
	return p.append(o, s), p;
}
function vT(e, t, n) {
	let r = PT("div", `${H}__months`);
	for (let i = 0; i < 12; i++) {
		let a = PT("button", oT);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(cT, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${oT}--selected`), a.setAttribute("aria-current", "true")), hT(n, mT(pa(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	let i = [...r.children];
	return M(i, i.find((e) => e.getAttribute("aria-current") === "true" && !e.disabled) ?? i.find((e) => !e.disabled) ?? null), r;
}
function yT(e, t) {
	let n = [...e.parentElement?.querySelectorAll(".ui-temporal-input__month") ?? []], r = n.indexOf(e), i = r === -1 ? null : bT(t, r % sT);
	if (i === null) return null;
	for (let e = r + i.offset; e >= 0 && e < n.length; e += i.step) if (!n[e].disabled) return n[e];
	return null;
}
function bT(e, t) {
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
			offset: sT,
			step: sT
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
function xT(e) {
	let t = PT("div", `${H}__period-caption`);
	return t.textContent = E.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function ST(e, t, n) {
	let r = Kw(e);
	if (n.startsWith("month:")) {
		let i = pa(t.view.getFullYear(), Number(n.slice(6)), 1);
		return hT(r, mT(i, 7)) && (t.view = i, t.pane = "days", t.focusedDay = DT(r, ET(i, t.focusedDay ?? Uw(e) ?? $w(e, /* @__PURE__ */ new Date())))), !0;
	}
	switch (n) {
		case "previous": return t.view = pT(r, t, -1) ?? t.view, !0;
		case "next": return t.view = pT(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function CT(e, t, n) {
	if (Vw(e)) {
		wT(e, t, n);
		return;
	}
	let r = ew(n, Uw(e) ?? Qw(e));
	t.focusedDay = r, t.view = FT(r), Jw(e, r, !1);
}
function wT(e, t, n) {
	let r = XC({
		start: U(e, !1),
		end: U(e, !0)
	}, t.activeEnd, ew(n, Qw(e)));
	t.focusedDay = r.end ?? r.start, t.view = FT(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, Jw(e, r.end, !0), Jw(e, r.start, !1);
}
function TT(e, t, n, r = !1) {
	let i = OT(n), a = kT(t, n, AT(e), r);
	if (a === null) return null;
	let o = Kw(e);
	if (i === 0) return DT(o, a);
	let s = a;
	for (let e = 0; e < uT; e++) {
		if (qw(o, rT(s, "date"))) return s;
		s = LT(s, i);
	}
	return t;
}
function ET(e, t) {
	let n = pa(e.getFullYear(), e.getMonth() + 1, 0).getDate();
	return pa(e.getFullYear(), e.getMonth(), Math.min(t.getDate(), n), t.getHours(), t.getMinutes(), t.getSeconds());
}
function DT(e, t) {
	let n = rT(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : nT(r, "date");
	return i === null ? t : ew(i, t);
}
function OT(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function kT(e, t, n, r) {
	let i = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return LT(e, -1);
		case "ArrowRight": return LT(e, 1);
		case "ArrowUp": return LT(e, -7);
		case "ArrowDown": return LT(e, 7);
		case "PageUp": return RT(e, r ? -12 : -1);
		case "PageDown": return RT(e, r ? 12 : 1);
		case "Home": return LT(e, -i);
		case "End": return LT(e, 6 - i);
		default: return null;
	}
}
function AT(e) {
	let t = Number(e.getAttribute(Cw));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function jT(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${aT}`)];
	if (i.length === 0) return;
	let a = rT(tw(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (M(i, o), r && L(o));
}
function MT(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? U(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${aT}`)) {
		let e = nT(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${aT}--preview`, e !== null && n !== null && r !== null && ZC(e, n, LT(r, 1)));
	}
}
function NT(e, t, n) {
	let r = PT("button", `${H}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(cT, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function PT(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function FT(e) {
	return pa(e.getFullYear(), e.getMonth(), 1);
}
function IT(e, t) {
	let n = FT(e);
	return LT(n, -((n.getDay() - t + 7) % 7));
}
function LT(e, t) {
	return pa(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function RT(e, t) {
	let n = pa(e.getFullYear(), e.getMonth() + t, 1), r = pa(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return pa(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function zT(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var BT = "ui-temporal-input__field", VT = "ui-temporal-input__popup", HT = "ui-temporal-input--open", UT = "ui-calendar__body", WT = "ui-temporal-input__time-cell", GT = "ui-temporal-input__time-column", KT = 140, qT = "data-ui-temporal-toggle", JT = "data-ui-temporal-unit", YT = "data-ui-temporal-cell", XT = "data-ui-temporal-centred", ZT = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new om({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(HT), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(HT);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(rw)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = zi(e.components, rw), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && QT(e) && this.states.set(e, dT(e)), this.isShowing(e) && this.renderSurface(e);
		}), z(this.root, rw, { attributeFilter: [...Ew] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), z(this.root, rw, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), E.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) QT(e) && $T(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(rw)], t = E.temporal;
		if (t !== null && E.language !== this.drawnLanguage) {
			this.drawnLanguage = E.language;
			for (let n of e) Iw(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || QT(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${UT}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && $T(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = ha(kw(t), fE()), n = oa(kw(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${BT}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = Ww(t, Hw(r))?.value ?? "", a = nT(i, Ow(t));
				if (a !== null) {
					r.value = na(a, kw(t), Pw(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(BT)) return;
		let t = e.target.closest(`.${H}`), n = t === null ? null : Ww(t, Hw(e.target));
		if (t === null || n === null) return;
		let r = Yw(t, e.target.value), i = nT(r, Ow(t)), a = i === null ? r : rT(i, Ow(t));
		if (eE(t, a)) {
			let n = U(t, Hw(e.target));
			e.target.value = n === null ? "" : na(n, kw(t), Pw(t));
			return;
		}
		Hw(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), Xw(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(BT)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && Vw(t) && (this.getState(t).activeEnd = Hw(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Vw(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${lT}]`) : null, r = this.getState(t), i = n === null ? null : nT(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, MT(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${lT}], .${WT}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(WT) ? hE(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = $T(e), r = nT(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, M([...n.querySelectorAll(`.${aT}`)], t), hu(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(BT)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${qT}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${H}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${cT}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${lT}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${YT}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${JT}]`)?.getAttribute(JT);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(YT)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (ST(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, Qw(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Vw(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = nT(t, "date");
		if (n === null || k(e) || D(e) || !qw(Kw(e), t)) return;
		let r = this.getState(e);
		QT(e) && Vw(e) && !r.choosingEnd && U(e, !1) !== null && U(e, !0) !== null && (r.activeEnd = "start");
		let i = Ww(e, !1), a = `${i?.value ?? ""}|${Ww(e, !0)?.value ?? ""}`;
		CT(e, r, n), QT(e) && `${i?.value ?? ""}|${Ww(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Vw(e) && this.getState(e).activeEnd === "end", i = Nw(U(e, r) ?? Qw(e), t, n);
		this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Jw(e, t, n), Xw(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e)) return;
		if (e.key === "ArrowDown" && j(e, { alt: !0 }) && e.target instanceof HTMLElement && e.target.classList.contains(BT)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${H}`), Hw(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(WT)) {
			j(e) && _E(e);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.classList.contains("ui-temporal-input__month")) {
			j(e) && gE(e, e.target);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day") || !j(e, { shift: e.key === "PageUp" || e.key === "PageDown" })) return;
		let n = nT(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, rT(n, "date"));
			return;
		}
		let r = TT(t, n, e.key, e.shiftKey);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = FT(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${GT}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, KT)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${GT}`), n = t?.getAttribute(JT) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Rg(this.wheelTurns.get(n) ?? 0, Lg(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${WT}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${WT}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${WT}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(YT)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(XT));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(JT), i = sE(e);
		if (!(r === null || i === null || i.classList.contains(`${WT}--selected`))) {
			if (i.matches(":disabled")) {
				aE(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(YT)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${VT}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Vw(e) ? t ?? (U(e, !1) === null ? "start" : U(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = U(e, r.activeEnd === "end") ?? Uw(e);
		r.pane = "days", r.view = FT(i ?? $w(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${qT}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => mE(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = dT(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = $T(e);
		if (n === null) return;
		let r = QT(e), i = Ow(e), a = this.getState(e), o = Pw(e), s = Vw(e), c = U(e, s && a.activeEnd === "end"), l = cE(n), u = lE(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(xT(a)), r) n.append(fT(e, a, o, c));
		else {
			let t = PT("div", `${H}__panes`);
			t.append(fT(e, a, o, c)), i === "date-time" && t.append(tE(e, c)), n.append(t, dE(i));
		}
		let f = u === null ? null : n.querySelector(`[${cT}="${ei(u)}"]:not(:disabled)`);
		jT(n, a, c, t || d && l === null && f === null), MT(e, a), r || (iE(n), aE(n), uE(n, l)), f !== null && L(f), r || this.popups.reposition(e);
	}
};
function QT(e) {
	return e.classList.contains(nw);
}
function $T(e) {
	return e.querySelector(`.${QT(e) ? UT : VT}`);
}
function eE(e, t) {
	let n = Kw(e), r = n.markedOnly ? nT(t, Ow(e)) : null;
	return r !== null && !n.marked.has(rT(r, "date"));
}
function tE(e, t) {
	let n = Aw(e), r = PT("div", `${H}__time`), i = PT("div", `${H}__time-columns`);
	for (let r of nE(n)) i.append(rE(e, r, jw(n, r), t));
	return r.append(i), r;
}
function nE(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function rE(e, t, n, r) {
	let i = PT("div", GT);
	i.setAttribute(JT, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", E.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = r === null ? null : Mw(r, t), s = t === "hour" && Lw(kw(e)), c = Pw(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = PT("button", WT);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Rw(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(YT, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${WT}--selected`), xE(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function iE(e) {
	let t = e.querySelector(`.${H}__calendar`), n = e.querySelector(`.${H}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function aE(e) {
	for (let t of e.querySelectorAll(`.${GT}`)) {
		let e = t.querySelector(`.${WT}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, oE(t, e), t.setAttribute(XT, String(t.scrollTop));
	}
}
function oE(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function sE(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${WT}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function cE(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(WT) ? null : t.closest(`.${GT}`)?.getAttribute(JT) ?? null;
}
function lE(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(cT) : null;
}
function uE(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${GT}[${JT}="${t}"]`)?.querySelector(`.${WT}--selected`) ?? null;
	n !== null && L(n);
}
function dE(e) {
	let t = PT("div", `${H}__popup-footer`);
	return t.append(NT("now", E.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(NT("clear", E.text("ui.picker.clear"))), t.append(NT("done", E.text("ui.picker.done"))), t;
}
function fE() {
	return {
		year: pE("ui.picker.letter.year", ma.year),
		month: pE("ui.picker.letter.month", ma.month),
		day: pE("ui.picker.letter.day", ma.day),
		hour: pE("ui.picker.letter.hour", ma.hour),
		minute: pE("ui.picker.letter.minute", ma.minute),
		second: pE("ui.picker.letter.second", ma.second)
	};
}
function pE(e, t) {
	let n = E.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function mE(e, t) {
	for (let n of e.querySelectorAll(`.${BT}`)) if (Hw(n) === t) return n;
	return e.querySelector(`.${BT}`);
}
function hE(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(WT) && hu(e);
}
function gE(e, t) {
	if (!Js(e.key, "both")) return;
	e.preventDefault();
	let n = yT(t, e.key);
	Xs([...n?.parentElement?.children ?? []], n);
}
function _E(e) {
	let t = e.target, n = t.closest(`.${GT}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? yE(n, e.key === "ArrowRight" ? 1 : -1) : vE(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), bE(r));
}
function vE(e, t, n) {
	let r = [...e.querySelectorAll(`.${WT}`)];
	return n === "PageUp" || n === "PageDown" ? Ml(n, r.filter(N), t, "vertical") ?? t : qs({
		key: n,
		items: r,
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function yE(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${GT}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${WT}--selected`) ?? r.querySelector(`.${WT}:not(:disabled)`);
}
function bE(e) {
	let t = e.closest(`.${GT}`);
	t !== null && oE(t, e);
}
function xE(e, t, n, r) {
	let i = Gw(e, dw), a = Gw(e, fw);
	if (i === null && a === null) return !1;
	let o = Nw(r ?? Qw(e), t, n), s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var SE = "[data-ui-theme-switcher]", CE = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(SE) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: ai.SetTheme,
				mode: wE() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function wE() {
	let e = document.documentElement.getAttribute(ar);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/popup-list.ts
var TE = new ay();
function EE(e, t, n, r, i = !1, a = !0) {
	let o = r ?? (a ? null : n.find(N) ?? null);
	o !== null && M(n, o);
	let s = e.open({
		...t,
		focus: a && r !== null ? r : !1
	});
	return s && a && r === null && Au(t.popup, n, i), s;
}
function DE(e, t) {
	let n = e.target instanceof HTMLElement && t.includes(e.target) ? e.target : null, r = oy(e);
	if (r !== null) return e.preventDefault(), Xs(t, kE(t, n, r)), !0;
	if (!Js(e.key, "vertical") || !j(e)) return !1;
	let i = qs({
		key: e.key,
		items: t,
		current: n,
		axis: "vertical"
	});
	return i !== null && e.preventDefault(), Xs(t, i), !0;
}
var OE = {
	character: oy,
	entry: kE
};
function kE(e, t, n) {
	let r = e.filter(N), i = r[0]?.parentElement;
	return i == null ? null : TE.next({
		owner: i,
		character: n,
		entries: r,
		current: t,
		words: Cp,
		context: i
	});
}
function AE(e, t) {
	e === document.activeElement || !N(e) || (M(t, e), hu(e));
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var jE = `[${cr}]`, ME = "ui-language-switcher__trigger", NE = "ui-language-switcher__label-text", PE = "ui-language-switcher__label-text--current", FE = "ui-language-switcher__label-text--page", IE = "ui-language-switcher__menu", LE = "ui-language-switcher__choice", RE = "ui-language-switcher--open", zE = "ui.language.switch", BE = "ui.language.current", VE = class {
	options;
	root;
	menus = new om({
		show: ({ owner: e }) => e.classList.add(RE),
		hide: ({ owner: e }) => e.classList.remove(RE),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), E.onChange(() => this.showLanguage(E.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LE}`), n = e.target.closest(jE);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(lr));
			return;
		}
		let r = e.target.closest(`.${ME}`);
		if (r === null || D(r)) return;
		e.preventDefault();
		let i = HE(n);
		if (i.length === 2) {
			let e = E.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(jE);
		if (t === null) return;
		let n = HE(t), r = e.target.closest(`.${ME}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && j(e)) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		this.menus.isOpen(t) && DE(e, n);
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LE}`), n = t?.closest(jE) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && AE(t, HE(n));
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${IE}`);
		if (r === null) return;
		let i = HE(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		EE(this.menus, {
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
				kind: ai.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(jE)) {
			let n = t.querySelector(`:scope > .${ME}`);
			if (n === null) continue;
			let r = HE(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${NE}`)) {
				let n = t.getAttribute(lr) === e;
				t.classList.toggle(PE, n), t.classList.contains(FE) && t.toggleAttribute("hidden", !n);
			}
			let i = t.getAttribute(Ie) === n.getAttribute("aria-label"), a = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "", [o, s] = r.length === 2 ? [zE, {
				language: UE(r, e),
				code: WE(e),
				other: UE(r, a),
				otherCode: WE(a)
			}] : [BE, {
				language: UE(r, e),
				code: WE(e)
			}];
			E.write(n, "aria-label", o, s), i && E.write(t, Ie, o, s);
		}
	}
};
function HE(e) {
	return [...e.querySelectorAll(`:scope > .${IE} > .${LE}`)];
}
function UE(e, t) {
	let n = e.find((e) => e.getAttribute(lr) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return WE(t);
	}
}
function WE(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var GE = `${Ae}__button`, KE = `${Ae}__more`, qE = `${GE}--icon`, JE = "ui-text__icon", YE = `.ui-button__content .${JE}`, XE = ".ui-button__content .ui-text__title", ZE = /* @__PURE__ */ new WeakMap();
function QE(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(dn)) $E(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(un) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function $E(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function eD(e, t) {
	let n = t.entries.map((e) => tD(e, t));
	return t.more && t.openMore !== void 0 && n.push(rD(t.openMore)), e.replaceChildren(...n), n;
}
function tD(e, t) {
	let n = iD(GE), r = oD(e), i = nD(e);
	return i === null ? n.textContent = r : (n.classList.add(qE), n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), D(e) && (n.classList.add(kr), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), ZE.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function nD(e) {
	let t = e.querySelector(YE);
	if (t === null || !t.className.split(" ").some(hg)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(JE), n.setAttribute(dg, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(fg);
	return r.length > 0 && n.style.setProperty(fg, r), n;
}
function rD(e) {
	let t = iD(`${GE} ${KE}`);
	return t.setAttribute("aria-haspopup", "menu"), E.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function iD(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${Hr}`, t.tabIndex = -1, t;
}
function aD(e) {
	return ZE.get(e) ?? null;
}
function oD(e) {
	return e.querySelector(XE)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var sD = 500, cD = 10, lD = /* @__PURE__ */ new WeakSet();
function uD(e) {
	return lD.has(e);
}
var dD = class {
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
			timer: setTimeout(() => this.fireHeld(), sD)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > cD && (this.slid = !0, (this.answered?.closest("[data-ui-splitting]") ?? null) !== null && this.leaveMenuToDrag()), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > cD && this.cancel();
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
		lD.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!lD.has(e)) {
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
		!this.dragging || n === null || t.clientX === void 0 || t.clientY === void 0 || Math.hypot(t.clientX - n.x, t.clientY - n.y) > cD && this.leaveMenuToDrag();
	}
	endDrag() {
		this.dragging = !1;
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, fD = "ne.ui", pD = "boot", mD = /* @__PURE__ */ new Set(), hD = class {
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
		let r = this.resolveKey(e, pD);
		if (r !== null) try {
			let e = gD(window.localStorage.getItem(r));
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
			return mD.has(n) || (mD.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${fD}:${n}:${t}`;
	}
};
function gD(e) {
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
var _D = "menu-current", vD = `[${zt}]`;
function yD(e) {
	for (let t = e.closest(vD); t !== null; t = t.parentElement?.closest(vD) ?? null) xD(t);
}
function bD(e) {
	for (let t of e.querySelectorAll(vD)) xD(t);
	yD(e);
}
function xD(e) {
	let t = e.querySelector(`.${on}`) !== null;
	e.hasAttribute("data-ui-menu-holds-current") !== t && e.toggleAttribute(Ht, t);
}
//#endregion
//#region src/updates/menu-icons.ts
var SD = "menu-icons", CD = "ui-menu__host", wD = `:scope > :not([${Wt}]) > .${x}[${Kr}]`;
function TD(e) {
	let t = e.closest(`.${CD}`);
	t !== null && DD(t);
}
function ED(e) {
	for (let t of e.querySelectorAll(`.${CD}`)) DD(t);
}
function DD(e) {
	let t = e.querySelector(wD) !== null;
	e.hasAttribute("data-ui-menu-icons") !== t && e.toggleAttribute(Ut, t);
}
//#endregion
//#region src/interactions/menu-group-engine.ts
var OD = "ui-menu__submenu", kD = zt, AD = Vt, jD = "data-ui-menu-flyout", MD = `[${jD}], ${Fr}`, ND = "data-ui-menu-unfolded", PD = Bt, FD = "data-ui-menu-rail-list", ID = "menu-open-group", LD = R.normal * 5, RD = Je("click"), zD = class {
	root;
	store = new hD();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new om({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(AD, ""), t.setAttribute(jD, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(AD), queueMicrotask(() => Fd(t, LD, () => {
				this.flyouts.isOpen(e) || t.removeAttribute(jD);
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
		let t = this.root.querySelectorAll(`.${rn}`);
		WD(t), this.reconcileEach(t);
		for (let e of t) bD(e), ED(e);
		z(this.root, `.${rn}`, {
			childList: !0,
			attributeFilter: [Rt]
		}, (e) => {
			WD(e), this.reconcileEach(e);
			for (let t of e) bD(t), ED(t);
		});
		for (let e of this.root.querySelectorAll(`[${kD}]`)) BD(e);
		z(this.root, `[${kD}]`, {
			childList: !0,
			attributeFilter: [AD]
		}, (e) => {
			for (let t of e) BD(t);
		}), typeof matchMedia == "function" && matchMedia(zd).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${$t}] .${rn}`);
		WD(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = XD(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), VD(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${kD}]`)) BD(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${on}`), e);
		if (t !== null && !t.hasAttribute(PD)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains("ui-menu--nested") ? null : this.store.read(e, ID), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			GD(t) && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${rn}`);
		a !== null && (YD(i) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(cn);
		if (e.setAttribute(ND, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(AD);
			return;
		}
		if (t.hasAttribute(AD)) {
			t.removeAttribute(AD), n || this.store.write(e, ID, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, ID, t.getAttribute(y));
	}
	openInline(e) {
		e.setAttribute(AD, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${kD}][${AD}]`)) t.hasAttribute(PD) || t.removeAttribute(AD);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		VD(e), this.closeGroups(e);
		let a = n.closest(MD) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${HD(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${rn}`);
		o !== null && !cu() && Au(o, KD(o));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${kD}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(un) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${kD}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${OD}`);
	}
};
function BD(e) {
	let t = e.querySelector(`:scope > .${x}`);
	t !== null && (t.setAttribute(RD, ""), t.setAttribute(Ye, ""), t.setAttribute("aria-expanded", e.hasAttribute(AD) ? "true" : "false"), YD(e) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function VD(e) {
	for (let t of e.querySelectorAll(`[${jD}]`)) t.removeAttribute(jD);
}
function HD(e) {
	return UD(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function UD(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(zd).matches;
}
function WD(e) {
	let t = typeof matchMedia == "function" && !matchMedia(zd).matches;
	for (let n of e) !n.classList.contains("ui-menu--rail") && !n.hasAttribute(FD) || n.closest("[data-ui-rail-drawer]") === null || (n.classList.toggle(sn, !t), n.toggleAttribute(FD, t));
}
function GD(e) {
	let t = e.closest(`.${x}`);
	return t !== null && t.matches(dn) && !t.matches(fn) && !D(t);
}
function KD(e) {
	let t = [];
	for (let n of gc(e)) {
		t.push(n);
		let e = n.matches(un) ? n.parentElement : null, r = e === null || !e.hasAttribute(AD) || YD(e) ? null : e.querySelector(`:scope > .${OD} > .${rn}`);
		r !== null && t.push(...KD(r));
	}
	return t;
}
function qD(e) {
	let t = JD(e), n = t?.closest(".ui-menu") ?? null;
	return t === null || n === null || YD(t) ? e : qD(n);
}
function JD(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(OD) && t.parentElement?.hasAttribute(kD) === !0 ? t.parentElement : null;
}
function YD(e) {
	let t = e.closest(`.${rn}`);
	return e.hasAttribute(PD) || t !== null && XD(t);
}
function XD(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
var ZD = "tabs:rename", QD = "tabs:pin", $D = "tabs:unpin", eO = "tabs:close", tO = "tabs:delete";
function nO(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function rO(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[ZD, e.rename && t.renamable],
		[QD, e.pin && !t.pinned],
		[$D, e.pin && t.pinned],
		[eO, e.close && !e.delete && n],
		[tO, e.delete && n]
	]);
}
function iO(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var aO = Se, oO = "ui-context-menu--open", sO = `${Ae}--strip`, cO = `.${Ae}:not(.${sO}) > .${KE}`, lO = "ui-context-menu-opening", uO = class {
	root;
	components;
	closed = null;
	menus = new om({
		show: ({ popup: e }) => e.classList.add(oO),
		hide: ({ popup: e }, t) => {
			e.classList.remove(oO), this.closed = e, t === "outside" && EO();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, new dD({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest("[data-ui-context-menu-owner]") !== null && !Ns(e),
			closeMenu: () => this.menus.close(this.menus.current, "outside")
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = !cu() && !uD(e), n = (t ? pO() : null) ?? e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let r = dO(n);
		r !== null && (e.preventDefault(), this.open(r.owner, r.menu, e.clientX, e.clientY, yO(e) ? n : null, n.closest(cO), t ? mO(n) : null));
	}
	open(e, t, n, r, i, a, o) {
		this.menus.close(), t.querySelector(`:scope > .${sO}`)?.remove(), bO(t), i !== null && xO(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && CO(t), this.closed !== null && (Pd(this.closed), this.closed = null);
		let s = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? su(), c = a ?? o, l = {
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
			returnFocus: () => (s === null ? null : ju(s, this.components)) ?? ju(e, this.components)
		}) && (c === null && Wf(t, n, r), TO(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && GD(e.target) && this.menus.close();
	}
};
function dO(e) {
	let t = e.closest(`[${ue}]`);
	for (let n = e.closest(`[${Ce}]`); n !== null; n = n.parentElement?.closest("[data-ui-context-menu-owner]") ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = gO(n, e);
		if (r.length === 0 || D(n)) continue;
		if (OO(n)) return null;
		let i = r.find((t) => _O(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var fO = `[${Ce}]`;
function pO() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = nl(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? cl(t.root);
	return n === null ? t.root : hO(n);
}
function mO(e) {
	let t = e.closest(bc);
	return t === null ? e : F(t) ?? t;
}
function hO(e) {
	if (e.matches(fO)) return e;
	for (let t of e.querySelectorAll(fO)) if (t.closest(bc) === e) return t;
	return e;
}
function gO(e, t) {
	let n = t.closest(`[${we}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? DO(e, r) : null, DO(e, "")].filter((e) => e !== null);
}
function _O(e, t, n) {
	let r = new CustomEvent(lO, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function vO(e, t) {
	let n = e.closest(`[${Ce}]`), r = e.closest(`[${ue}]`);
	return n === null || D(n) || OO(n) || r !== null && n.contains(r) ? null : gO(n, e).find((n) => _O(n, e, t)) ?? null;
}
function yO(e) {
	let t = e.pointerType;
	return uD(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : lu();
}
function bO(e) {
	for (let t of e.querySelectorAll(`[${Oe}]`)) t.removeAttribute(Oe);
}
function xO(e, t, n) {
	let r = n.closest(`[${Te}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !gO(e, r).includes(t)) return;
	let { entries: i } = QE(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Ae} ${sO}`, a.setAttribute("role", "group"), eD(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: SO
	}), t.insertBefore(a, t.firstElementChild);
}
function SO(e) {
	D(e) || e.click();
}
function CO(e) {
	let { entries: t } = QE(e), n = e.querySelector(`.${rn}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) wO(e);
	let r = hc(n, `.${x}`, `.${rn}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && $E(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(ln)) ? wO(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(nn);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	iO(a).forEach((e, t) => {
		a[t] === "rule" && !e && wO(i[t]);
	});
}
function wO(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Oe, "");
}
function TO(e) {
	let t = e.querySelector(`.${rn}`);
	t !== null && Au(e, KD(t));
}
function EO() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Jl}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function DO(e, t) {
	for (let n of e.querySelectorAll(`[${aO}]`)) if ((n.getAttribute(aO) ?? "") === t && n.closest("[data-ui-context-menu-owner]") === e) return n;
	return null;
}
function OO(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${b}]`);
	if (t === null) return !1;
	let n = e;
	for (; n.parentElement !== null && n.parentElement !== t;) n = n.parentElement;
	return Lo(n, "data-ui-no-context-menu") || t.closest(S)?.hasAttribute("data-ui-no-context-menu") === !0;
}
//#endregion
//#region src/interactions/element-visibility.ts
function kO(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function AO(e) {
	return getComputedStyle(e).display !== "none";
}
function jO(e) {
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
				if (e.overflowX !== "visible" && PO(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && PO(n, a, a + t.clientHeight, !1), FO(n)) return !0;
			}
			r = e.position;
		}
	}
	return PO(n, 0, window.innerWidth, !0), PO(n, 0, window.innerHeight, !1), FO(n);
}
function MO(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !kO(n, !1)) && (NO(e.overflowX) || NO(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function NO(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function PO(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function FO(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var IO = `[${Te}]`, LO = `.${Ae}`, RO = `${Ae}--out`, zO = `.ui-items-view__item, .${Cn}`, BO = "ui-tree__node", VO = 6, HO = "--ui-action-bar-gap", UO = 400, WO = /* @__PURE__ */ new WeakMap(), GO = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	ke,
	...Er
], KO = class {
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
		if (n === null || n.closest(`${LO}, [data-ui-context-menu]`) !== null) return;
		let r = qO(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : XO(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? ZO(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(LO) === null && yO(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(LO);
		if (n !== null) {
			this.isHostedBar(n) && M(ak(n), t);
			return;
		}
		cu() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(JO(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(LO) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(P) && this.choose(JO(t));
			return;
		}
		let n = t.closest(LO);
		if (n !== null && t.classList.contains(GE)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			if (Cs(e)) return;
			let n = t.closest(tp);
			(n === null || this.chosen !== null && n.contains(this.chosen)) && (this.chosen !== null && e.preventDefault(), this.choose(null));
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(P)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(P) && this.choose(JO(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && lk(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : ju(n, this.components);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = ak(t), i = qs({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), Xs(r, i));
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : XO(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = MO(e);
		if (t === void 0 || n === null || !kO(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + $O(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, gf(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		vO(e, !0) === null && this.hide(e, t);
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
				this.chosen = ZO(e), this.sync();
			}
			for (let e of this.shown.values()) gf(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = vO(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Ae, n.setAttribute("role", "toolbar"), E.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ye, ""), n.setAttribute(fe, ""), !tk(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, ik(e)), af(e, n, {
			placement: QO(e),
			gap: $O(e),
			boundary: MO(e) ?? void 0
		}), n.classList.toggle(RO, jO(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: GO
		});
		let i = ek(e);
		i?.setAttribute($n, ""), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r,
			row: i
		}), WO.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : aD(r);
		if (!tk(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = ak(t.bar);
		Xs(a, a.find((e) => aD(e) === i) ?? a.find(N) ?? null);
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || sk(t)) return;
		if (this.menuHost = e, ck(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		nk(n.bar, !0);
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
		nk(t.bar, !1);
		let n = document.activeElement;
		!cu() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && rk(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), _f(t.bar), t.bar.remove(), this.shown.delete(e), t.row !== null && ![...this.shown.values()].some((e) => e.row === t.row) && t.row.removeAttribute($n);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(RO, jO(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : ak(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function qO(e) {
	let t = e.closest(IO);
	if (t !== null) return t;
	let n = e.closest(`[${y}]`), r = e.closest(S);
	return n === null || r !== null && !r.contains(n) ? null : YO(n)[0] ?? null;
}
function JO(e) {
	if (e instanceof HTMLElement && e.matches(P)) {
		let t = cl(e), n = t === null ? void 0 : YO(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(IO);
}
function YO(e) {
	let t = [...e.querySelectorAll(IO)];
	return e.matches(IO) ? [e, ...t] : t;
}
function XO(e) {
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
		index: YO(n).indexOf(e)
	};
}
function ZO(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return YO(t)[e.index] ?? null;
	return null;
}
function QO(e) {
	let t = e.getAttribute(Te);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function $O(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(HO));
	return Number.isFinite(t) ? t : VO;
}
function ek(e) {
	if (e.classList.contains("ui-table__row")) return e;
	let t = e.parentElement;
	if (t === null) return null;
	if (t.matches(zO)) return t;
	let n = t.parentElement;
	return t.classList.contains(BO) && n !== null && n.classList.contains("ui-tree__row") ? n : null;
}
function tk(e, t, n, r) {
	let { entries: i, more: a } = QE(t);
	if (i.length === 0 && !a) return !1;
	let o = eD(e, {
		entries: i,
		more: a,
		role: "button",
		press: ok,
		openMore: n
	});
	return M(o, o.find((e) => !D(e)) ?? o[0] ?? null), nk(e, r), !0;
}
function nk(e, t) {
	rk(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function rk(e) {
	return ak(e).find((e) => aD(e) === null) ?? null;
}
function ik(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function ak(e) {
	return [...e.querySelectorAll(`:scope > .${GE}`)];
}
function ok(e, t) {
	if (D(t) || sk(t)) return;
	let n = vO(t, !1);
	n === null || !n.contains(e) || D(e) || !$E(e, n) || e.click();
}
function sk(e) {
	let t = e.closest(LO), n = t === null ? void 0 : WO.get(t);
	return n !== void 0 && lu() && Date.now() - n < UO;
}
function ck(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function lk(e) {
	return e.matches(Jl) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/inline-markup.ts
var uk = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, dk = "\\", fk = "`", pk = "!", mk = "{", hk = "}", gk = "ui-text__fold", _k = "ui-text__fold-toggle", vk = "ui-text__fold-content", yk = 8;
function bk(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Mk(new Vk(e), 0, e.length, uk.None, null, t, n), Nk(t, n, uk.None, null), t;
}
function xk(e) {
	return bk(e).map((e) => Ek(e) ? `${e.fold} ${xk(e.text)}` : e.text).join("");
}
function Sk(e) {
	let t = "";
	for (let n of e) t += Wk(n) ? dk + n : n;
	return t;
}
function Ck(e, t, n = {}) {
	let r = bk(t), i = r.some(Ek);
	if (e.hasAttribute("data-ui-folds") !== i && e.toggleAttribute(Ue, i), r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && wk(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Dk(r, n));
}
function wk(e) {
	return e.styles === uk.None && e.url === null && !Tk(e) && !Ek(e);
}
function Tk(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Ek(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Dk(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(Ok(r, t));
	return n;
}
function Ok(e, t) {
	if (Tk(e)) return Ak(e.icon);
	let n = Ek(e) ? kk(e, t) : document.createTextNode(e.text);
	if ((e.styles & uk.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & uk.Strikethrough) !== 0 && (n = jk("s", n)), (e.styles & uk.Underline) !== 0 && (n = jk("u", n)), (e.styles & uk.Italic) !== 0 && (n = jk("em", n)), (e.styles & uk.Bold) !== 0 && (n = jk("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Xh(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function kk(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${gk} ${gk}--static` : gk, r.className = _k, r.textContent = e.fold ?? "", i.className = vk, i.append(Dk(bk(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ye, ""), n.append(r, i), n);
}
function Ak(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", pg(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function jk(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Mk(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === dk && c + 1 < n && Wk(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = Pk(e, c, n);
		if (l !== null) {
			Nk(a, o, r, i), Fk(s, c + 1, l, o), Nk(a, o, r | uk.Code, i), c = l + 1;
			continue;
		}
		let u = Rk(e, c, n);
		if (u !== null) {
			Nk(a, o, r, i), Mk(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Nk(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = Ik(e, c, n);
		if (d !== null) {
			Nk(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? zk(e, c, n) : null;
		if (f !== null) {
			Nk(a, o, r, i), Mk(e, f.labelStart, f.labelEnd, r, f.url, a, o), Nk(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = Bk(e, c, n);
		if (p !== null) {
			Nk(a, o, r, i), a.push({
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
function Nk(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function Pk(e, t, n) {
	let r = e.text;
	if (r[t] !== fk) return null;
	let i = t + 1;
	if (i >= n || Gk(r[i])) return null;
	let a = e.findClosingMarker(i, n, fk, 1);
	return a > i ? a : null;
}
function Fk(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === dk && i + 1 < n && Wk(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function Ik(e, t, n) {
	let r = e.text;
	if (r[t] !== pk || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return Lk(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function Lk(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function Rk(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = uk.Bold, s = 2;
	else if (i === "*") o = uk.Italic, s = 1;
	else if (i === "_" && a) o = uk.Underline, s = 2;
	else if (i === "~" && a) o = uk.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Gk(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function zk(e, t, n) {
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
function Bk(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== mk || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > yk) return null;
	let c = { value: "" };
	return Fk(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var Vk = class {
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
		return this.closeBrackets ??= this.next("]", !0), Hk(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), Hk(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), Hk(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return Hk(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = Uk(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Gk(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = qh(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === dk && e[t - 1] === 0);
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
			if (this.text[r] === mk) n.push(r);
			else if (this.text[r] === hk && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Gk(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function Hk(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function Uk(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function Wk(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === mk || e === hk || e === fk || e === dk;
}
function Gk(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Kk = "ui-tooltip", qk = "ui-tooltip", Jk = "ui-tooltip--visible", Yk = "ui-tooltip--linked", Xk = "[aria-haspopup][aria-expanded=\"true\"]", Zk = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", Qk = "top", $k = 250, eA = 200, tA = 300, nA = 7, rA = null, W = null, iA = null, aA = null, oA = null, sA = 0, cA = null, lA = 0, uA = 0, dA = !1, fA = /* @__PURE__ */ new Set();
function pA(e) {
	fA.add(e);
}
function mA(e = document) {
	if (dA) return;
	dA = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", hA, !0), t.addEventListener("pointerout", vA, !0), t.addEventListener("focusin", bA, !0), t.addEventListener("focusout", xA, !0), t.addEventListener("scroll", _A, !0), t.addEventListener("pointerdown", CA, !0), t.addEventListener("pointermove", jA, !0), t.addEventListener("pointerup", AA, !0), t.addEventListener("pointercancel", AA, !0), t.addEventListener("contextmenu", NA, !0), t.addEventListener("click", FA, !0), window.addEventListener("click", PA, !0), window.addEventListener("keydown", SA, !0), window.addEventListener("blur", () => {
		aA = null, aj(!0);
	});
}
function hA(e) {
	if (gA(), LA(e.target)) {
		window.clearTimeout(lA);
		return;
	}
	let t = RA(e.target);
	t !== null && t !== W && UA(t);
}
function gA() {
	W === null || W.isConnected || (aA = null, aj(!0));
}
function _A(e) {
	if (gA(), W === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(W) || jO(W) && (aA = null, aj(!0));
}
function vA(e) {
	if (aA !== null || oA !== null) return;
	let t = e.relatedTarget, n = W ?? cA?.target ?? null, r = n === null ? null : yA(n);
	t instanceof Node && (r !== null && r.contains(t) || LA(t)) || (LA(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && aj(!1);
}
function yA(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && zA(t) === e ? t : e;
}
function bA(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = RA(e.target);
	t !== null && (aA = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, WA(t));
}
function xA(e) {
	RA(e.target) === W && (aA = null, aj(!0));
}
function SA(e) {
	e.key !== "Escape" || W === null || e.defaultPrevented || (Cs(e) || e.preventDefault(), aA = null, aj(!0));
}
function CA(e) {
	if (AA(), OA = null, LA(e.target)) return;
	kA(e);
	let t = IA(e.target);
	if (t !== null) {
		if (oA === t) {
			aj(!0);
			return;
		}
		aA = null, aj(!0), WA(t), oA = W;
		return;
	}
	aA === null && aj(!0);
}
var wA = 500, TA = 10, EA = `[${Ce}]`, DA = null, OA = null;
function kA(e) {
	let t = e;
	if (t.pointerType !== "touch" || !(e.target instanceof Element) || e.target.closest(EA) !== null || Ns(e.target)) return;
	let n = RA(e.target);
	n === null || n.hasAttribute("data-ui-tooltip-press") || (DA = {
		pointerId: t.pointerId ?? 0,
		x: t.clientX ?? 0,
		y: t.clientY ?? 0,
		target: n,
		timer: window.setTimeout(MA, wA)
	});
}
function AA() {
	DA !== null && (window.clearTimeout(DA.timer), DA = null);
}
function jA(e) {
	let t = e;
	DA !== null && t.pointerId === DA.pointerId && Math.hypot((t.clientX ?? DA.x) - DA.x, (t.clientY ?? DA.y) - DA.y) > TA && AA();
}
function MA() {
	let e = DA?.target ?? null;
	DA = null, e !== null && (aA = null, aj(!0), WA(e), oA = W, OA = W);
}
function NA(e) {
	if (DA !== null && e.target instanceof Node && DA.target.contains(e.target)) {
		e.preventDefault(), window.clearTimeout(DA.timer), MA();
		return;
	}
	OA !== null && e.target instanceof Node && OA.contains(e.target) && e.preventDefault();
}
function PA(e) {
	OA === null || !(e.target instanceof Node) || !OA.contains(e.target) || (OA = null, e.preventDefault(), e.stopImmediatePropagation());
}
function FA(e) {
	IA(e.target) !== null && e.preventDefault();
}
function IA(e) {
	let t = RA(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(Zk);
	return n === null || n.contains(t) ? t : null;
}
function LA(e) {
	return rA !== null && e instanceof Node && rA.contains(e);
}
function RA(e) {
	if (!(e instanceof Element)) return null;
	let t = zA(e);
	for (let n of fA) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && HA(r).length > 0) return r;
	}
	return t;
}
function zA(e) {
	let t = e.closest(`[${Ie}], [${Re}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function BA(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + VA(e) : HA(e);
}
function VA(e) {
	let t = "";
	for (let n of fA) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function HA(e) {
	for (let t of fA) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function UA(e, t) {
	if (aA === null && oA === null) {
		if (window.clearTimeout(lA), cA !== null && cA.target === e) {
			cA.words = t;
			return;
		}
		if (window.clearTimeout(sA), cA = null, W !== null) {
			aj(!0), WA(e, t);
			return;
		}
		if (Date.now() - uA < tA) {
			WA(e, t);
			return;
		}
		cA = {
			target: e,
			words: t
		}, sA = window.setTimeout(() => {
			let e = cA;
			cA = null, e !== null && WA(e.target, e.words);
		}, $k);
	}
}
function WA(e, t) {
	let n = (t ?? BA(e)).trim();
	if (n.length === 0 || !e.isConnected || !AO(e) || qA(e) || jO(e)) return;
	window.clearTimeout(sA), window.clearTimeout(lA), cA = null;
	let r = oj();
	Ck(r, n, { staticFolds: !0 }), r.classList.toggle(Yk, r.querySelector("a[href]") !== null), r.classList.add(Jk), W = e, YA(JA(e)), r.setAttribute("data-ui-tooltip-text", xk(n)), QA(r, e.getAttribute(ze)), rf(e, r), af(e, r, {
		placement: ij(e),
		gap: nA,
		arrow: !0
	}), KA();
}
var GA = null;
function KA() {
	typeof MutationObserver > "u" || (GA ??= new MutationObserver(gA), GA.observe(document.documentElement, {
		childList: !0,
		subtree: !0
	}));
}
function qA(e) {
	return e.matches(Xk) || e.querySelector(Xk) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function JA(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function YA(e) {
	iA !== null && iA !== e && XA();
	let t = ZA(e);
	t.includes(qk) || e.setAttribute("aria-describedby", [...t, qk].join(" ")), iA = e;
}
function XA() {
	if (iA === null) return;
	let e = ZA(iA).filter((e) => e !== qk);
	e.length === 0 ? iA.removeAttribute("aria-describedby") : iA.setAttribute("aria-describedby", e.join(" ")), iA = null;
}
function ZA(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function QA(e, t) {
	t === null ? e.removeAttribute(ze) : e.setAttribute(ze, t);
}
function $A(e, t, n) {
	let r = n?.plain === !0 ? Sk(t) : t;
	n?.delay === !0 && W !== e ? UA(e, r) : WA(e, r);
}
function ej() {
	aj(!0);
}
var tj = {
	show: $A,
	hide: ej,
	escape: Sk
};
function nj(e) {
	aA = e, WA(e);
}
function rj(e) {
	if (W === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			aA = null, aj(!0);
			return;
		}
		WA(e);
	}
}
function ij(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of fA) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Le);
	return t !== null && qd(t) ? t : Qk;
}
function aj(e) {
	window.clearTimeout(sA), window.clearTimeout(lA), cA = null;
	let t = () => {
		W !== null && (XA(), W = null, oA = null, GA?.disconnect(), rA !== null && (rA.classList.remove(Jk), _f(rA)), uA = Date.now());
	};
	e ? t() : lA = window.setTimeout(t, eA);
}
function oj() {
	return rA !== null && rA.isConnected ? rA : (rA = document.createElement("div"), rA.id = qk, rA.className = Kk, rA.setAttribute("role", "tooltip"), rA.setAttribute("aria-hidden", "true"), document.body.append(rA), rA);
}
//#endregion
//#region src/interactions/menu-engine.ts
var sj = "ui-orientation--horizontal", cj = `.${sn} > .ui-menu__host > .ui-menu__item > .${x}`, lj = `${cj}, ${`.ui-menu[${Rt}] > .ui-menu__host > .ui-menu__item > .${x}`}`, uj = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", dj = "[role='menuitem'], [role='menuitemcheckbox']", fj = class {
	root;
	tabStopsScheduled = !1;
	space = new ls();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keyup", (e) => this.space.release(e, N), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), pA(gj), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(_j) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Yt, Vt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${rn}`)) {
			if (qD(e) !== e) continue;
			let t = KD(e);
			if (t.length === 0) continue;
			let n = t.filter((e) => e.tabIndex === 0 && N(e));
			M(t, t.find((e) => e === document.activeElement) ?? t.find((e) => e.classList.contains("ui-menu-item--selected") && N(e)) ?? (n.length === 1 ? n[0] : void 0) ?? t.find(N) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || Ps(e) || A(e) || !(e.target instanceof Element)) return;
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
		let r = qD(n), i = KD(r), a = oy(e);
		if (a !== null) {
			e.preventDefault(), Xs(i, kE(i, t, a));
			return;
		}
		let o = r.classList.contains(sj) || UD(r) ? "horizontal" : "vertical";
		if (!j(e) || this.handleGroupKey(e, t, r, o)) return;
		let s = e.key === "ArrowUp" && t === i.find(N) ? hj(r) : null, c = s ?? qs({
			key: e.key,
			items: i,
			current: t,
			axis: o
		});
		c !== null && (e.preventDefault(), c !== s && M(i, c), c.focus());
	}
	handleGroupKey(e, t, n, r) {
		let i = r === "vertical" ? "ArrowRight" : HD(n) === "top" ? "ArrowUp" : "ArrowDown", a = t.matches(un) ? t.parentElement : null;
		if (e.key === i && a !== null) return e.preventDefault(), a.hasAttribute("data-ui-menu-open") ? Xs([], pj(a)) : t.click(), !0;
		if (e.key !== "ArrowLeft" || r !== "vertical") return !1;
		let o = a !== null && a.hasAttribute("data-ui-menu-open") && !YD(a) ? a : mj(t), s = o?.querySelector(":scope > .ui-menu-item") ?? null;
		return o === null || s === null ? !1 : (e.preventDefault(), YD(o) || s.focus(), s.click(), !0);
	}
	pressEntry(e, t) {
		e.target !== t || !j(e, { shift: !0 }) || t.matches(ln) || !N(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), !e.repeat && (e.key === " " ? this.space.hold(t) : t.click()));
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${rn}`);
		if (n === null) return;
		let r = KD(n), i = oy(e);
		if (i !== null) {
			e.preventDefault(), Xs(r, kE(r, null, i));
			return;
		}
		let a = j(e) ? qs({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(sj) ? "horizontal" : "vertical"
		}) : null;
		a !== null && (e.preventDefault(), Xs(r, a));
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${x}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && M(KD(qD(n)), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${x}`) : null;
		if (t === null || t === document.activeElement || !t.matches(dj) || t.matches(ln) || !N(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && hu(t);
	}
};
function pj(e) {
	let t = e.querySelector(`:scope > .ui-menu__submenu > .${rn}`);
	return t === null ? null : KD(t).find(N) ?? null;
}
function mj(e) {
	let t = e.closest(`.${rn}`), n = t === null ? null : JD(t);
	return n !== null && n.hasAttribute("data-ui-menu-open") ? n : null;
}
function hj(e) {
	return e.hasAttribute("data-ui-menu-search") ? e.querySelector(":scope > .ui-collapsible__bar input") : null;
}
var gj = {
	anchor: (e) => e.closest(lj),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(uj), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(cj) && t.scrollWidth <= t.clientWidth ? null : Sk(n);
	},
	placement: (e) => {
		let t = e.closest(`.${rn}`);
		return t === null ? null : HD(t);
	}
};
function _j(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var vj = "shortcut:", yj = ":scope > .ui-menu-item__shortcut", bj = `[${Se}]`, xj = `[${pn}]`, Sj = ".ui-text__title", Cj = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), pA(Aj), Dj(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) Ej(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [pn]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e) || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || Ps(e))) return;
		let t = ip(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !$o(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !N(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), Tj(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= $o(t, e);
		let r = n ? pO() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = dO(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(xj)].filter((t) => {
			let n = Qo(t.getAttribute(pn));
			return n !== null && $o(n, e) && !D(t) && $E(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), Tj(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(xj)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Qo(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(bj) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(us(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Qo(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = us(e.shortcut);
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
function wj(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(vj) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function Tj(e) {
	Ms(e.target) && e.target.dispatchEvent(new Event(vv, { bubbles: !0 }));
}
function Ej(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && Oj(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && Dj(t);
}
function Dj(e) {
	e instanceof HTMLElement && e.matches(xj) && Oj(e);
	for (let t of e.querySelectorAll(xj)) Oj(t);
}
function Oj(e) {
	let t = e.querySelector(yj);
	if (t === null) return;
	let n = kj(e) ?? "";
	t.textContent !== n && (t.textContent = n), e.hasAttribute("data-ui-menu-item-shortcut") !== n.length > 0 && e.toggleAttribute(Gt, n.length > 0);
}
function kj(e) {
	let t = e.getAttribute(pn), n = Qo(t);
	return n === null ? t?.trim() || null : es(n);
}
var Aj = {
	anchor: (e) => {
		let t = e.closest(xj);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(bj) !== null ? null : t;
	},
	words: (e) => {
		let t = kj(e), n = (e.getAttribute("aria-label") ?? e.querySelector(Sj)?.textContent ?? "").trim();
		return t === null ? null : Sk(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = kj(e);
		return t === null ? null : Sk(`(${t})`);
	}
}, jj = 50, Mj = 1, Nj = 7;
function Pj(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = qx(e, "data-ui-window-size") ?? 0;
	return {
		offset: qx(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : jj,
		total: qx(e, At),
		moreAfter: Jx(e, Mt)
	};
}
function Fj(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function Ij(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function Lj(e, t) {
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
			let n = Number(t), r = Ij(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === Fj(e) ? null : (n - 1) * e.size;
		}
	}
}
function Rj(e, t) {
	if (t <= Nj) return Bj(1, t);
	let n = Math.max(Math.min(e - Mj, t - 2 - 2), 3), r = Math.min(Math.max(e + Mj, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...Bj(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function zj(e, t) {
	let n = Rj(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function Bj(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
//#endregion
//#region src/interactions/pager-engine.ts
var Vj = ".ui-pager", Hj = "ui-pager__button", Uj = "ui-pager__number", Wj = "ui-pager__pages", Gj = "ui-pager__gap", Kj = "ui-pager__range", qj = "ui-pager__size", Jj = "ui-pager__size--open", Yj = "ui-pager__size-trigger", Xj = "ui-pager__size-label", Zj = "ui-pager__sizes", Qj = "ui-pager__size-choice", $j = [
	Hj,
	Uj,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], eM = "ui.pager.page", tM = "ui.pager.range", nM = "ui.pager.rows", rM = "ui.pager.size", iM = [
	kt,
	At,
	Mt,
	Ot,
	Dt
], aM = "page-size", oM = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new hD();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new om({
		show: ({ owner: e }) => e.classList.add(Jj),
		hide: ({ owner: e }) => e.classList.remove(Jj),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), z(this.root, `${Vj}, [${b}]`, {
			childList: !0,
			attributeFilter: iM,
			relevant: (e) => e.type === "attributes" || hM(e.target) || gM(e)
		}, (e) => this.syncFound(e)), E.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(Vj)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(Vj)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(S), n = t === null ? 0 : T(t);
		return n > 0 ? [...this.root.querySelectorAll(`${Vj}[${ot}="${ei(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(ot));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = mM(e);
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
		let i = Pj(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = nx(e), s = (e) => rx(e, "N0", o);
		this.drawNumbers(e, i, o), cM(e, i, s), lM(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${Hj}[${st}]`)) Vo.setDisabled(t, Lj(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		dM(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${Wj}`);
		if (r === null) return;
		let i = Fj(t), a = Ij(t), o = a === null ? zj(i, t.moreAfter) : Rj(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => sM(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Vj);
		if (t === null || D(e.target)) return;
		let n = e.target.closest(`.${Qj}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(ct)));
			return;
		}
		let r = e.target.closest(`.${Yj}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${st}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = Lj(Pj(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), tc(e).top > 0 && nc(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(Vj);
		if (t === null) return;
		let n = e.target.closest(`.${qj}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${Hj}, .${Yj}`), i = uM(t);
		if (r === null || !i.includes(r) || !j(e)) return;
		let a = qs({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal"
		});
		a !== null && (e.preventDefault(), Xs(i, a));
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${Yj}`) : null;
		return n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp") && j(e) ? (e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0) : this.menus.isOpen(t) && DE(e, pM(t));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Qj}`) : null, n = t?.closest(`.${qj}`) ?? null;
		t !== null && n !== null && this.menus.isOpen(n) && AE(t, pM(n));
	}
	toggleSizes(e) {
		let t = e.closest(`.${qj}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${Zj}`);
		if (r === null) return;
		let i = pM(e), a = i.find((e) => e.getAttribute("aria-checked") === "true") ?? null;
		EE(this.menus, {
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t]
		}, i, a, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, aM), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!fM(e, i)) {
			this.store.write(t, aM, null);
			return;
		}
		let a = Pj(n);
		i !== a.size && (n.setAttribute(Ot, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${qj}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = Pj(r.host);
		t !== i.size && (this.store.write(r.component, aM, String(t)), r.host.setAttribute(Ot, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || !j(e) || !(e.target instanceof Element)) return;
		let t = rl(e);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || D(t.root)) return;
		let n = mM(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = Lj(Pj(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = Wc(e), i = sl(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = Wc(e);
		o.length > 0 && dl(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function sM(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = Gj, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = rx(e, "N0", n);
	return r.className = $j.join(" "), r.setAttribute("type", "button"), r.setAttribute(st, String(e)), r.textContent = i, E.write(r, "aria-label", eM, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function cM(e, t, n) {
	let r = e.querySelector(`:scope > .${Kj}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? E.write(r, null, nM, {
		from: i,
		to: a
	}) : E.write(r, null, tM, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function lM(e, t, n) {
	let r = e.querySelector(`:scope > .${qj}`), i = r?.querySelector(`.${Xj}`) ?? null;
	if (r !== null && i !== null) {
		E.write(i, null, rM, { size: n(t.size) });
		for (let e of pM(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function uM(e) {
	return [...e.querySelectorAll(`.${Hj}, .${Yj}`)];
}
function dM(e) {
	let t = uM(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	M(t, n ?? r.find(N) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function fM(e, t) {
	let n = e.querySelector(`:scope > .${qj}`);
	return n !== null && pM(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function pM(e) {
	return [...e.querySelectorAll(`:scope > .${Zj} > .${Qj}`)];
}
function mM(e) {
	for (let t of e.querySelectorAll(`[${b}][${bt}="windowed"]`)) if (t.closest(S) === e) return t;
	return null;
}
function hM(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function gM(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(Vj) || t.querySelector(Vj) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var _M = `.${rn}[${qt}]`, vM = ":scope > .ui-collapsible__bar", yM = ":scope > .ui-menu__host", bM = "ui-menu__item", xM = `:scope > .${x}`, SM = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", CM = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), z(t, _M, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Rt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = wM(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(yM);
		if (n === null) return;
		let r = vp(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: TM(n)
		}), e.setAttribute(Jt, ""), ry(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of EM(e)) {
			let e = DM(a);
			if (e === "header") {
				n !== null && kM(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			kM(a, o), r ||= o, i ||= o;
		}
		return n !== null && kM(n, r), i;
	}
	match(e, t) {
		let n = bp(OM(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(SM) : null;
		if (r === null) return n;
		if (n) return AM(r), e.removeAttribute(Vt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Vt, i), i;
	}
	clear(e, t) {
		AM(t), e.removeAttribute(Jt), EM(t).length > 0 && ry(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Rt);
		for (let e of t.querySelectorAll(`[${zt}]:not([${Bt}])`)) e.toggleAttribute(Vt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !j(e) || !(e.target instanceof HTMLInputElement)) return;
		let t = wM(e.target), n = t === null ? void 0 : KD(t).find(N);
		n !== void 0 && (e.preventDefault(), n.focus());
	}
};
function wM(e) {
	let t = e.closest(_M), n = t?.querySelector(vM) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function TM(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${zt}][${Vt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function EM(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(bM));
}
function DM(e) {
	return e.querySelector(xM)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function OM(e) {
	let t = e.querySelector(xM);
	return t === null ? "" : yp(Cp(t), e);
}
function kM(e, t) {
	e.toggleAttribute(Yt, !t);
}
function AM(e) {
	for (let t of e.querySelectorAll(`[${Yt}]`)) t.removeAttribute(Yt);
}
//#endregion
//#region src/interactions/screen-keyboard.ts
var jM = 120;
function MM(e) {
	return e.typing && e.tallest - e.height > jM;
}
var NM = class {
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
		let t = MM({
			height: e.height,
			tallest: this.tallest,
			typing: Ns(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(dr, t);
	}
}, PM = "[data-ui-root]", FM = "a[href]", IM = "ui-collapsible", LM = "right-side", RM = "ui-side--left", zM = "ui-side--right", BM = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), typeof matchMedia == "function" && matchMedia(zd).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Xt}]`);
		if (t !== null) {
			let e = t.closest(PM), n = t.getAttribute(Xt);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${mn}]`);
		if (n !== null && !e.defaultPrevented && VM(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`${FM}, .${x}`), i = r?.closest(`[${tn}]`), a = i?.parentElement ?? null;
		r !== null && i != null && a?.getAttribute("data-ui-drawer-open") === i.getAttribute("data-ui-region") && HM(r) && this.close(a);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e)) return;
		if (e.key === "Tab") {
			this.trapTab(e);
			return;
		}
		if (e.key !== "Escape" || Cs(e) || dp()) return;
		let t = !1;
		for (let { shell: e } of this.openDrawers()) this.close(e), t = !0;
		t && e.preventDefault();
	}
	trapTab(e) {
		for (let { drawer: t } of this.openDrawers()) xu(t, e);
	}
	openDrawers() {
		let e = [];
		for (let t of document.querySelectorAll(`${PM}[${Zt}]`)) {
			let n = UM(t, t.getAttribute("data-ui-drawer-open") ?? "");
			n !== null && !ap(n) && e.push({
				shell: t,
				drawer: n
			});
		}
		return e;
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = UM(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || (e.setAttribute(Zt, t), this.openers.set(e, n), this.markToggles(e), this.hold(r), this.focusInto(e, t, r, document.activeElement, cu(), performance.now() + R.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex"), n = !e.hasAttribute("aria-label") && !e.hasAttribute("aria-labelledby");
		this.holders.set(e, {
			addsTabIndex: t,
			addsName: n,
			role: e.getAttribute("role")
		}), e.setAttribute(Ir, ""), e.setAttribute("role", "dialog"), e.setAttribute("aria-modal", "true"), n && e.setAttribute("aria-label", E.text("ui.side.panel")), t && (e.tabIndex = -1);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Du(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${PM}[${Zt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(Zt);
		if (e.removeAttribute(Zt), this.markToggles(e), t === null) return;
		let n = UM(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = this.returnTarget(e, t);
			i !== null && n !== null && n.contains(r) ? Fu(i, n) : i !== null && L(i);
		}
		this.release(n);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${Xt}="${ei(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Zt);
		for (let n of e.querySelectorAll(`[${Xt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Xt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(Ir), e.removeAttribute("aria-modal"), t.role === null ? e.removeAttribute("role") : e.setAttribute("role", t.role), t.addsTabIndex && e.removeAttribute("tabindex"), t.addsName && e.removeAttribute("aria-label"));
	}
};
function VM(e) {
	let t = e.closest(`.${IM}`), n = t?.closest(`[${tn}]`), r = n?.getAttribute(tn), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(PM) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === LM ? zM : RM);
}
function HM(e) {
	return !e.classList.contains("ui-menu-item") || GD(e) && e.closest(Fr) === null;
}
function UM(e, t) {
	return e.querySelector(`:scope > [${tn}="${ei(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var WM = "ui-collapsible", GM = "ui-collapsible__content", KM = "ui-collapsible__bar", qM = "collapsed", JM = class {
	root;
	store = new hD();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${WM}`)), z(this.root, `.${WM}`, {
			childList: !0,
			attributeFilter: [Rt]
		}, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) {
				this.apply(t, t.hasAttribute(Rt));
				continue;
			}
			this.restored.add(t), this.restore(t);
		}
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, qM);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mn}]`), n = t?.closest(`.${WM}`) ?? null;
		if (t === null || n === null || VM(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Rt), i = n.querySelector(`:scope > .${GM}`);
		this.cancelFold(n);
		let a = XM(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, qM, r ? "true" : "false", r ? { attributes: { [Rt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Rt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${mn}], :scope > .${KM} > [${mn}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Nd()) return;
		let i = QM(YM(e), n, XM(e, t), r);
		if (i === null) return;
		e.setAttribute(hn, "");
		let a = {
			duration: R.normal,
			easing: R.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(hn));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(hn);
			for (let e of t) e.cancel();
		}
	}
};
function YM(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function XM(e, t) {
	let n = YM(e), r = ZM(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function ZM(e) {
	return e === "width" ? "height" : "width";
}
function QM(e, t, n, r) {
	let i = ZM(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
	};
	return {
		component: [l(t), l(n)],
		content: [{
			...u,
			opacity: c && !r ? 0 : 1
		}, {
			...u,
			opacity: c && r ? 0 : 1
		}]
	};
}
//#endregion
//#region src/interactions/grid-tracks.ts
function $M(e, t) {
	return Math.max(e, Math.round(t / 10));
}
function eN(e) {
	let t = [];
	for (let n of rN(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = eN(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = tN(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function tN(e) {
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
	if (n !== null) return nN({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return nN(r[3] === "fr" ? {
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
function nN(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function rN(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function iN(e, t = "auto") {
	return e.map((e) => aN(e, t)).join(" ");
}
function aN(e, t) {
	switch (e.kind) {
		case "px": return `${oN(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${oN(e.min)}px`}, ${oN(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${oN(e.max)}px)` : `minmax(${oN(e.min)}px, auto)`;
	}
}
function oN(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function sN(e) {
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
function cN(e, t) {
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
function lN(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = uN(r, e), o = uN(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function uN(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function dN(e, t, n, r) {
	let i = mN(e, t, n.before), a = mN(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = pN(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = yN(n.before, e) + yN(n.after, e), r = i.total + a.total;
		hN(l, e, i, t * (i.total + c) / r), hN(l, e, a, t * (a.total - c) / r);
	} else u || gN(l, i, i.total + c), d || gN(l, a, a.total - c);
	return l;
}
var fN = 120;
function pN(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < fN ? o = t < 0 ? -n : fN - n : c > 0 && c < fN && (o = t > 0 ? r : r - fN), Math.min(Math.max(o, i), a);
}
function mN(e, t, n) {
	let r = vN(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function hN(e, t, n, r) {
	let i = yN(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function gN(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			..._N(e[i])
		};
	}
}
function _N(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function vN(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function yN(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function bN(e, t) {
	let n = vN(t.before, e), r = n + vN(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function xN(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function SN(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function CN(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var wN = "ui-grid-splitter", TN = "ui-container", EN = "ui-orientation--vertical", DN = 16, ON = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: gn,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, kN = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: _n,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, AN = class {
	root;
	store = new hD();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new wp({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${wN}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${wN}`)), z(this.root, `.${wN}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${wN}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = MN(t);
			e !== null && (this.restore(e, NN(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Id) {
			let i = r[n], a = Hd(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || !j(e)) return;
		let t = e.target.closest(`.${wN}`);
		if (t === null || this.drag.active || D(t)) return;
		if (e.key === "Enter") {
			e.preventDefault(), this.reset(t);
			return;
		}
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = zN(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
				break;
			case "PageUp":
			case "PageDown":
				a = $M(r, i) * RN(e.key, n.axis);
				break;
			case "Home":
				a = -i;
				break;
			case "End":
				a = i;
				break;
			default: return;
		}
		e.preventDefault(), this.apply(n, a) && (this.remember(n), this.reportPosition(t));
	}
	reset(e) {
		let t = MN(e);
		if (t === null) return;
		let n = NN(e);
		for (let e of Id) t.style.removeProperty(Hd(n.split, e));
		this.store.write(t, n.slot, null), this.reportPosition(e);
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${wN}`) : null;
		t !== null && this.reset(t);
	}
	apply(e, t) {
		let n = dN(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Hd(e.axis.split, e.tier), iN(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Id) {
			let a = Hd(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = MN(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = NN(e), r = Vd(), i = PN(t, n, r), a = i === null ? null : eN(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = cN(a, sN(t.getAttribute(n.limits))), s = FN(t, n), c = IN(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = lN(c, LN(t, n).map((e) => IN(e, n)).filter((e) => e !== null && e !== c), o.length);
		return l === null ? (this.warner.warn(e, "a grid splitter at the container's edge has nothing on one side to move."), null) : {
			container: t,
			axis: n,
			tracks: o,
			sizes: s,
			runs: l,
			tier: r
		};
	}
	reportPosition(e) {
		let t = MN(e);
		if (t === null) return;
		let n = NN(e), r = IN(e, n), i = FN(t, n), a = LN(t, n).map((e) => IN(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : lN(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(bN(i, o))), jN(t, n, i));
	}
};
function jN(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(wN)) continue;
		let e = getComputedStyle(r), i = CN(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(pr, i);
	}
}
function MN(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(TN) ? t : null;
}
function NN(e) {
	return e.classList.contains(EN) ? ON : kN;
}
function PN(e, t, n) {
	let r = Gd(n, (n) => e.style.getPropertyValue(Hd(t.split, n)).trim() || void 0);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function FN(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function IN(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function LN(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(wN) && NN(r) === t && n.push(r);
	return n;
}
function RN(e, t) {
	return t.increase === "ArrowDown" ? e === "PageDown" ? 1 : -1 : e === "PageUp" ? 1 : -1;
}
function zN(e) {
	let t = Number(e.getAttribute(vn));
	return Number.isFinite(t) && t > 0 ? t : DN;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var BN = "ui-split-button", VN = "ui-split-button__main", HN = "ui-split-button__toggle", UN = "ui-split-button__menu", WN = "ui-split-button--open", GN = class {
	root;
	menus = new om({
		show: ({ owner: e }) => e.classList.add(WN),
		hide: ({ owner: e }) => e.classList.remove(WN),
		closesWhenReadOnly: !1,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = KN(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${VN}`)?.closest(`.${BN}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp" || !j(e)) return;
		let t = KN(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = qN(t), r = e.target.closest(`.${x}`);
		n !== null && r !== null && n.contains(r) && GD(r) && this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = qN(e), r = n?.querySelector(".ui-menu") ?? null;
		if (n === null || r === null) return;
		let i = e.getAttribute("data-ui-split-placement") ?? "";
		this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: qd(i) ? i : "bottom-end" },
			openers: JN(e)
		}) && Au(r, KD(r), t);
	}
};
function KN(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${HN}, .${VN}`), n = t?.closest(`.${BN}`) ?? null;
	return t === null || n === null || t.classList.contains(VN) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function qN(e) {
	return e.querySelector(`:scope > .${UN}`);
}
function JN(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var YN = "ui-button-group", XN = "ui-button-group__item", ZN = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${YN}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), z(this.root, `.${YN}`, {
			childList: !0,
			attributeFilter: [br]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = QN(i);
			i.toggleAttribute(yr, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		M(n, r ?? n.find(N) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${XN}`), n = t?.closest(`.${YN}`) ?? null;
		if (t === null || n === null || t.closest(`.${YN}`) !== n || D(n)) return;
		let r = QN(t);
		r !== null && D(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${XN} > .${Vr}`), n = t?.closest(`.${YN}`) ?? null;
		if (t === null || n === null || !j(e)) return;
		let r = this.ownItems(n).map(QN).filter((e) => e !== null), i = qs({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${XN}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		_c(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: br,
			bindingAttribute: Sr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return hc(e, `.${XN}`, `.${YN}`);
	}
};
function QN(e) {
	return e.querySelector(`:scope > .${Vr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var $N = "ui-accordion", eP = "details", tP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${$N}`)), z(this.root, `.${$N}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains($N))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${eP}`)];
	}
}, nP = "ui-tab-overflow", rP = "ui-tab-overflow__menu", iP = "ui-tab-overflow__menu--open", aP = "ui-tab-overflow__entry", oP = "ui-tab-overflow__entry--current", sP = class {
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
		this.options = e, this.list = new uP(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : cP({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return lP(e, this.options.hiddenClass, t);
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
function cP(e) {
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
function lP(e, t, n) {
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
var uP = class {
	menu;
	button = null;
	list = new om({
		show: ({ popup: e }) => e.classList.add(iP),
		hide: ({ popup: e }) => {
			e.classList.remove(iP), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0,
		closesOnTab: !0,
		sheetOnPhone: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = rP, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(dP)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${oP}`);
		this.button = e, rf(e, this.menu);
		let i = {
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			returnFocus: () => e
		};
		EE(this.list, i, this.entries(), r) || (this.button = null);
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${aP}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || D(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		e.defaultPrevented || DE(e, this.entries());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${aP}`) : null;
		t !== null && AE(t, this.entries());
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${aP}`));
	}
};
function dP(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${aP} ${Hr}`, t.classList.toggle(oP, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(y, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(kr), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var fP = "data-ui-caption-text", pP = ".ui-text__title";
function mP(e) {
	for (let t of e.querySelectorAll(pP)) {
		let e = t.textContent ?? "";
		t.getAttribute(fP) !== e && t.setAttribute(fP, e);
	}
}
function hP(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Nd()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: R.normal,
		easing: R.ease,
		pseudoElement: "::after"
	});
}
function gP(e) {
	if (!(e === null || Nd())) for (let t of e.children) typeof t.animate == "function" && t.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: R.fast,
		easing: R.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var _P = "ui-tabs", vP = "ui-tab-header", yP = "ui-tab-header--selected", bP = "ui-tab-header--overflowed", xP = "ui-tabs--overflowing", SP = "ui-tabs--no-overflow", CP = "ui-tabs__strip", wP = "data-ui-tab-key", TP = "data-ui-tab-page", EP = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new sP({
			rootClass: _P,
			overflowingClass: xP,
			wraps: (e) => e.classList.contains(SP),
			hiddenClass: bP,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${_P}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), z(this.root, `.${_P}`, {
			childList: !0,
			attributeFilter: [Cr, ...Er],
			relevant: (e) => !Yf(e, `[${TP}]`, `.${_P}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.filter(DP), i = vc(r, t, (e) => e.getAttribute(wP) ?? "");
		if (i !== null && i !== t) {
			this.select(e, i);
			return;
		}
		let a = n.find((e) => e.classList.contains(yP)) ?? null, o = null;
		for (let e of n) {
			let n = (e.getAttribute(wP) ?? "") === t;
			e.classList.toggle(yP, n), e.setAttribute("aria-selected", n ? "true" : "false"), mP(e), n && (o = e);
		}
		this.fitHeaders(e, r, o), hP(a, o), M(n.filter((e) => !e.classList.contains(bP)), o);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(TP) ?? "") !== t, !n.hidden && a !== null && a !== o && gP(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${CP}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(wP) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(DP).map((e) => {
				let n = e.getAttribute(wP) ?? "";
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
		let t = e.target.closest(`.${nP}`), n = t?.closest(`.${_P}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${_P}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${vP}`);
		if (r === null || D(r)) return;
		let i = r.closest(`.${_P}`), a = r.getAttribute(wP);
		i !== null && a !== null && r.closest(`.${_P}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Ps(e) || !j(e)) return;
		let t = e.target.closest(`.${vP}`), n = t?.closest(`.${_P}`) ?? null;
		if (t === null || n === null) return;
		let r = qs({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(wP) ?? ""), r.focus());
	}
	select(e, t) {
		_c(e, t, {
			attribute: Cr,
			bindingAttribute: Sr,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return hc(e, `.${vP}`, `.${_P}`);
	}
	ownPages(e) {
		return hc(e, `[${TP}]`, `.${_P}`);
	}
};
function DP(e) {
	return e.classList.contains(bP) || AO(e);
}
//#endregion
//#region src/interactions/tab-out.ts
function OP(e) {
	e.hasAttribute("data-ui-tab-out") || (e.setAttribute(Ne, e.getAttribute("tabindex") ?? ""), e.setAttribute("tabindex", "-1"));
}
function kP(e) {
	let t = e.getAttribute(Ne);
	t !== null && (e.removeAttribute(Ne), t.length === 0 ? e.removeAttribute("tabindex") : e.setAttribute("tabindex", t));
}
function AP(e) {
	return e.tabIndex >= 0 || e.hasAttribute("data-ui-tab-out");
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var jP = "ui-command-bar", MP = "ui-command-bar__host", NP = "ui-command-bar__item", PP = "ui-command-bar__overflow", FP = "ui-command-bar--overflowing", IP = "ui-command-bar__overflowed", LP = "ui-orientation--vertical", RP = "ui-text__title", zP = `${Jl}, [${Ne}]`, BP = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new sP({
			rootClass: jP,
			overflowingClass: FP,
			wraps: (e) => !WP(e),
			hiddenClass: IP,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${jP}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), z(this.root, `.${jP}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = VP(e), n = e.querySelector(`:scope > .${PP}`);
		if (t === null || n === null) return;
		let r = GP(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(FP) && KP(r);
		for (let e of r) tf(e, e.classList.contains(IP) ? n : null);
		e.classList.contains(LP) ? e.setAttribute("aria-orientation", "vertical") : e.removeAttribute("aria-orientation"), HP(e, null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${PP}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(jP) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof HTMLElement) || !j(e) || Ps(e)) return;
		let t = e.target.closest(`.${jP}`), n = t === null ? [] : UP(t);
		if (t === null || !n.includes(e.target)) return;
		let r = qs({
			key: e.key,
			items: n,
			current: e.target,
			axis: t.classList.contains(LP) ? "vertical" : "horizontal"
		});
		r !== null && (e.preventDefault(), HP(t, r), r.focus());
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null, n = t?.closest(`.${jP}`) ?? null;
		t !== null && n !== null && UP(n).includes(t) && HP(n, t);
	}
	entriesOf(e) {
		let t = VP(e), n = t === null ? [] : GP(t).filter((e) => e.classList.contains(NP) && e.classList.contains(IP)).map((e) => e.querySelector(S) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: qP(e),
			current: !1,
			disabled: D(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !D(n) && JP(n).click();
	}
};
function VP(e) {
	return e.querySelector(`:scope > .${MP}`);
}
function HP(e, t) {
	let n = UP(e), r = n.find((e) => e.tabIndex >= 0 && N(e)), i = t ?? n.find((e) => e === document.activeElement) ?? r ?? n.find(N) ?? null;
	for (let e of n) e === i ? kP(e) : OP(e);
}
function UP(e) {
	let t = VP(e), n = [];
	for (let e of t === null ? [] : GP(t)) if (!(!e.classList.contains(NP) || e.classList.contains(IP))) for (let t of e.querySelectorAll(zP)) AP(t) && Gs(e, t) && n.push(t);
	let r = e.querySelector(`:scope > .${PP}`);
	return r !== null && e.classList.contains(FP) && n.push(r), n;
}
function WP(e) {
	let t = VP(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function GP(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(NP) ? n.querySelector(S) : null;
		e !== null && AO(e) && t.push(n);
	}
	return t;
}
function KP(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(NP) ? t ||= !r.classList.contains(IP) : t || r.classList.add(IP);
	}
}
function qP(e) {
	let t = JP(e), n = t.querySelector(`.${RP}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function JP(e) {
	return e.matches(Jl) ? e : e.querySelector(Jl) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var YP = "ui-breadcrumbs", XP = "ui-breadcrumbs__item", ZP = "ui-breadcrumb", QP = "ui-breadcrumb--current", $P = "ui-hidden", eF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), z(this.root, `.${YP}`, {
			childList: !0,
			attributeFilter: ["class", ...Er]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${YP}`)) this.apply(e);
	}
	apply(e) {
		let t = hc(e, `.${XP}`, `.${YP}`);
		tF(t);
		let n = t.filter((e) => !e.classList.contains($P)).map((e) => e.querySelector(`.${ZP}`)).filter((e) => e !== null && !e.classList.contains($P)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(QP, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function tF(e) {
	let t = Id.map(() => !1);
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n], i = Id.map((e, t) => nF(r, t));
		if (rF(r, Zn, Id.filter((e, t) => i[t])), rF(r, Qn, Id.filter((e, n) => !t[n])), !r.classList.contains($P)) for (let e = 0; e < Id.length; e++) t[e] ||= !i[e];
	}
}
function nF(e, t) {
	for (let n of e.children) if (n.getAttribute(Er[t]) === "collapsed") return !0;
	return !1;
}
function rF(e, t, n) {
	let r = n.join(" ");
	r.length === 0 ? e.removeAttribute(t) : e.getAttribute(t) !== r && e.setAttribute(t, r);
}
//#endregion
//#region src/rendering/color-bytes.ts
function G(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function iF(e) {
	return G(e).toString(16).padStart(2, "0").toUpperCase();
}
function aF(e, t, n, r) {
	let i = r / 255, a = (e) => Math.round(e * i + 255 * (1 - i));
	return (oF(a(e), a(t), a(n)) + .05) ** 2 > 1.05 * .05 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function oF(e, t, n) {
	return .2126 * sF(e) + .7152 * sF(t) + .0722 * sF(n);
}
function sF(e) {
	let t = e / 255;
	return t <= .04045 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var cF = "ui-color-input", lF = "ui-color-input--open", uF = "ui-color-input__popup", dF = "ui-color-input__text", fF = "ui-color-input__row", pF = "ui-color-input__swatch--button", mF = "ui-color-input__value-input", hF = "ui-color-input__square-thumb", gF = "ui-color-input__hue-thumb", _F = "data-ui-color-toggle", vF = "data-ui-color-tab", yF = "data-ui-color-tab-selected", bF = "data-ui-color-pane", xF = "data-ui-color-pane-selected", SF = "data-ui-color-square", CF = "data-ui-color-hue", wF = "data-ui-color-hex", TF = "data-ui-color-channel", EF = "data-ui-color-factor", DF = "data-ui-color-opacity", OF = "data-ui-color-name", kF = "data-ui-color-name-selected", AF = "data-ui-color-format", jF = "data-ui-color-variant", MF = "data-ui-color-no-picker", NF = "data-ui-color-no-palette", PF = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new om({
		show: ({ owner: e }) => e.classList.add(lF),
		hide: ({ owner: e }) => e.classList.remove(lF)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${cF}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(zi(e.components, `.${cF}`));
		}), z(this.root, `.${cF}`, {
			childList: !0,
			attributeFilter: [
				AF,
				jF,
				MF,
				NF
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new wp({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${SF}], [${CF}]`),
			begin: (e, t) => {
				let n = e.closest(`.${cF}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(SF) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${mF}`)?.value ?? null
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
		let t = zF(e), n = this.states.get(e), r = n?.paneChosen === !0 ? FF(e, n.pane) : IF(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? LF(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = qF(t);
			if (i === null) return n ?? LF(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && RF(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = XF(a, o, s);
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
			...n ?? LF(r),
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
			let [e, a, o] = XF(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), UF(e, "--ui-color-input-color", t.held ? YF(n, r, i, t.opacity) : "transparent"), UF(e, "--ui-color-input-solid", YF(n, r, i, 255)), UF(e, "--ui-color-input-on-color", t.held ? aF(n, r, i, t.opacity) : "inherit"), HF(e, t.held ? VF(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${SF}]`), o = e.querySelector(`[${CF}]`), [s, c, l] = ZF(t.hue, 1, 1);
		if (UF(e, "--ui-color-input-hue", YF(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${hF}`);
			e !== null && (UF(e, "left", `${t.saturation * 100}%`), UF(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${gF}`);
			e !== null && UF(e, "top", `${t.hue / 360 * 100}%`);
		}
		WF(e, `[${wF}]`, JF(n, r, i)), WF(e, `[${TF}="r"]`, String(n)), WF(e, `[${TF}="g"]`, String(r)), WF(e, `[${TF}="b"]`, String(i)), UF(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), GF(e, `[${DF}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${OF}]`)) n.getAttribute(OF) === t.name ? n.setAttribute(kF, "") : n.removeAttribute(kF);
		let n = t.name === null ? null : e.querySelector(`[${OF}="${t.name}"]`), r = n === null ? null : qF(n.style.getPropertyValue("--ui-color-input-chip").trim());
		UF(e, "--ui-color-input-base", r === null ? "transparent" : YF(r[0], r[1], r[2], 255)), GF(e, `[${EF}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${bF}]`)) n.getAttribute(bF) === t.pane ? n.setAttribute(xF, "") : n.removeAttribute(xF);
		for (let n of e.querySelectorAll(`[${vF}]`)) n.getAttribute(vF) === t.pane ? n.setAttribute(yF, "") : n.removeAttribute(yF);
	}
	resolveRgb(e, t) {
		if (t.name === null) return ZF(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${OF}="${t.name}"]`), r = n === null ? null : qF(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? ZF(t.hue, t.saturation, t.value) : KF([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${_F}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${cF}`));
			return;
		}
		let n = e.target.closest(`[${vF}]`), r = e.target.closest(`.${cF}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(vF), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${OF}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(OF)
			}));
			return;
		}
		let a = r.querySelector(`.${uF}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${cF}`);
		if (t !== null) {
			if (e.target.hasAttribute(EF)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(DF) && this.commit(t, (t) => ({
				...t,
				opacity: G(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${cF}`);
		if (n === null) return;
		if (t.hasAttribute(EF) || t.hasAttribute(DF)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(wF)) {
			let e = qF(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = XF(e[0], e[1], e[2]);
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
		let r = t.getAttribute(TF);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = G(Number(t.value));
		let [l, u, d] = XF(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${mF}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = QF((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = QF((t.x - a.left) / a.width), s = 1 - QF((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${mF}`);
		a !== null && (a.value = BF(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		k(e) || e.querySelector(`.${mF}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(MF) && e.hasAttribute(NF)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${uF}`);
		if (t === null) return;
		let n = e.getAttribute(jF) === "swatch", r = n ? e.querySelector(`.${pF}`) : e.querySelector(`.${fF}`), i = n ? r : r?.querySelector(`[${_F}]`) ?? null;
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: i === null ? [] : [i],
			focus: t.querySelector(`[${yF}]`) ?? !0
		});
	}
};
function FF(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? MF : NF))(t) ? t : t === "picker" ? "palette" : "picker";
}
function IF(e) {
	return FF(e, "picker");
}
function LF(e) {
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
function RF(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function zF(e) {
	return e.querySelector(`.${mF}`)?.value.trim() ?? "";
}
function BF(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = JF(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${iF(e.opacity)}`;
}
function VF(e, t, n, r, i) {
	if (e.getAttribute(AF) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = JF(t, n, r);
	return i === 255 ? a : `${a}${iF(i)}`;
}
function HF(e, t) {
	for (let n of e.querySelectorAll(`.${dF}`)) n.textContent !== t && (n.textContent = t);
}
function UF(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function WF(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function GF(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function KF(e, t) {
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
function qF(e) {
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
function JF(e, t, n) {
	return `#${iF(e)}${iF(t)}${iF(n)}`;
}
function YF(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function XF(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function ZF(e, t, n) {
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
function QF(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function $F(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var eI = `:is(.ui-surface, .ui-card)[${v}]`, tI = "ui-surface--clickable", nI = class {
	pressable = /* @__PURE__ */ new WeakSet();
	space = new ls();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.space.release(e)), sI(t, ["hover", "press"], (e) => oI(e.closest(Bs))), z(t, eI, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(eI));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(eI) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(tI)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), lI(e, "role", aI(e) ? "group" : "button"), lI(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : iI(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = rI(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.space.hold(t));
	}
};
function rI(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !j(e, { shift: !0 })) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(tI) && t.hasAttribute("tabindex") ? t : null;
}
function iI(e) {
	let t = e.closest(bc);
	return t !== null && t.closest(P)?.matches(".ui-items-view, .ui-table") === !0 && Hs(t) === e;
}
function aI(e) {
	for (let t of e.querySelectorAll(Bs)) if (Gs(e, t)) return !0;
	return !1;
}
function oI(e) {
	let t = [];
	for (let n = e?.parentElement?.closest(`.${tI}`) ?? null; n !== null; n = n.parentElement?.closest(`.${tI}`) ?? null) t.push(n);
	return t;
}
function sI(e, t, n) {
	let r = {
		hover: [],
		press: []
	}, i = !1, a = (e, t) => {
		let a = t instanceof Element ? n(t) : [];
		e === "press" && (i = !1);
		for (let t of r[e]) a.includes(t) || cI(t, e, !1);
		for (let t of a) cI(t, e, !0);
		r[e] = a;
	};
	t.includes("hover") && (e.addEventListener("pointerover", (e) => a("hover", e.target)), e.addEventListener("pointerout", (e) => a("hover", e.relatedTarget))), t.includes("press") && (e.addEventListener("pointerdown", (e) => a("press", e.button === 0 ? e.target : null), !0), e.addEventListener("pointerup", () => a("press", null), !0), e.addEventListener("dragend", () => a("press", null), !0), e.addEventListener("dragstart", () => {
		i = r.press.length > 0;
	}, !0), e.addEventListener("pointercancel", () => {
		i || a("press", null);
	}, !0));
}
function cI(e, t, n) {
	let r = (e.getAttribute("data-ui-inner-pointer") ?? "").split(" ").filter((e) => e !== "" && e !== t);
	n && r.push(t), lI(e, _r, r.length === 0 ? null : r.sort().join(" "));
}
function lI(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var uI = "ui-table", dI = "ui-table--reorderable", fI = "ui-scroll-x--auto", pI = "ui-scroll-x--always", mI = `:scope > .${wn}`, hI = `.${En}`, gI = "ui-table__header-cell", _I = `${gI}--pinned`, vI = `${mI} > .${Tn} > .${gI}`, yI = `${vI}--pinned`, bI = "ui-table__host", xI = `${mI} > .${bI}`, SI = `.${uI}, .${Cn}, [${yn}]`, CI = "--ui-table-columns", wI = "--ui-table-sticky-top", TI = "--ui-table-sticky-bottom", EI = "--ui-table-sized-columns", DI = "--ui-table-pin-", OI = 64, kI = "data-ui-table-cell-hidden", AI = "data-ui-table-cell-last", jI = "columns", MI = "hidden", NI = "order", PI = "layout", FI = 32, II = 16, LI = class {
	root;
	store = new hD();
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
		if (this.root = e.root ?? document, this.drag = new wp({
			root: this.root,
			resolveHandle: (e) => e.closest(hI),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new wp({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), sI(this.root, ["hover", "press"], (e) => {
			let t = e.closest(hI)?.parentElement ?? null;
			return t === null ? [] : [t];
		}), typeof matchMedia == "function") for (let e of Id) e !== "base" && matchMedia(Rd(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${uI}`)), z(this.root, `.${uI}`, {
			childList: !0,
			relevant: HI
		}, (e) => {
			for (let t of e) this.restored.has(t) && (this.stampUnstyledColumns(t, !0), this.indexColumns(t, !0));
			this.restoreEach(e);
		}), z(this.root, `.${uI}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(uI)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), z(this.root, `.${uI}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: UI
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(xI);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), $F(t, () => this.pin(t));
			let e = t.querySelector(mI);
			e !== null && $F(e, () => RI(t, e));
			let n = t.querySelector(xI);
			n !== null && (this.markScrollbar(t, n), $F(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, jI), r = n === null ? null : eN(n);
		r !== null && r.length !== t.length ? (this.store.write(e, jI, null), this.store.writeBoot(e, PI, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, NI);
		if (i !== null && !GI(i, t)) {
			this.store.write(e, NI, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Ln, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${uI}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = WI(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(fI) || e.classList.contains(pI);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(EI);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = SN(t, n);
				e.style.setProperty(EI, iN(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Gc}${t}`, String(r[t])) : e.style.removeProperty(`${Gc}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Sn) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Sn, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Mn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Mn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), this.indexColumns(e, !1), e.classList.contains(dI)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= OI) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${yn}]`)) {
				let r = Number(t.getAttribute(yn));
				!(r >= OI) || t.closest(`.${uI}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(kI, n.hidden.has(r)), t.toggleAttribute(AI, r === n.last));
			}
		}
	}
	indexColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}`, i = this.indexedStates.get(e) === r;
		i && !t || (this.indexedStates.set(e, r), Xc(e, WI(n.places), n.hidden, i));
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(vI)) {
			let e = Number(n.getAttribute(yn)), r = n.getAttribute(bn), i = n.classList.contains(_I) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: YI(r) ? r : null,
				startsHidden: n.hasAttribute(xn),
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
		for (let e of t) (n[e.key] ?? JI(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, MI) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(CI).trim(), n = t.length === 0 ? null : eN(t);
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
		n === null || i !== void 0 && n === JI(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, MI, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return WI(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(yI).length;
		if (t < 2) return;
		let n = xN(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${DI}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${uI}`)?.toggleAttribute(In, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(mI), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return BI(e) ? n.slice(1) : n;
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
		let t = e.target.closest(hI), n = t ?? (e.shiftKey ? zI(e.target) : null);
		if (n === null || this.drag.active || !j(e, { shift: t === null })) return;
		if (t !== null && e.key === "Enter" || t === null && e.key === "Backspace") {
			e.preventDefault(), this.reset(n);
			return;
		}
		let r = e.key === "PageUp" || e.key === "PageDown";
		if (!r && e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
		let i = this.resolveContext(n);
		if (i === null) return;
		let a = r ? $M(II, i.sizes.reduce((e, t) => e + t, 0)) : II;
		e.preventDefault(), this.apply(i, e.key === "ArrowRight" || e.key === "PageUp" ? a : -a) && this.remember(i.table);
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${uI}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(yn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || (e.preventDefault(), !(s < 0 || s >= i.length) && (this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 })));
	}
	handleDoubleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(hI) : null;
		t !== null && this.reset(t);
	}
	reset(e) {
		let t = e.closest(`.${uI}`);
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = dN(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(FI, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, VI(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, jI, t === null ? null : iN(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(EI).trim(), n = e.getAttribute(Sn), r = {};
		t.length > 0 && (r[EI] = t);
		for (let t of e.style) t.startsWith("--ui-table-order-") && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, PI, null);
			return;
		}
		this.store.writeBoot(e, PI, {
			styles: r,
			attributes: {
				[Sn]: n,
				[Mn]: e.getAttribute(Mn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${uI}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = sN(t.getAttribute(gn)), i = cN(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(yn)), u = this.hiddenOf(t, o), d = WI(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${gI}`), n = t?.closest(`.${uI}`) ?? null;
		return t === null || n === null || !n.classList.contains(dI) || e.closest(hI) !== null || t.classList.contains(_I) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${uI}`), r = Number(e.getAttribute(yn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Nn, ""), e.setAttribute(Pn, ""), {
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
		for (let a of WI(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > KI(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), qI(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Fn, "after") : a.cell.setAttribute(Fn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Pn), t.table.removeAttribute(Nn), qI(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		Ep(), this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = WI(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, NI, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
};
function RI(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${bI}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(wI, `${n}px`), e.style.setProperty(TI, `${r}px`);
}
function zI(e) {
	let t = e.matches(`.${gI}`) ? e.querySelector(`:scope > ${hI}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function BI(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function VI(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function HI(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(SI) || t.querySelector(SI) !== null)) return !0;
	return !1;
}
function UI(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(bI);
}
function WI(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function GI(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function KI(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function qI(e) {
	for (let t of e.querySelectorAll(`[${Fn}]`)) t.removeAttribute(Fn);
}
function JI(e) {
	return e.startsHidden || e.hideBelow !== null && Id.indexOf(Vd()) < Id.indexOf(e.hideBelow);
}
function YI(e) {
	return e !== null && Id.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var XI = /* @__PURE__ */ new WeakMap();
function ZI(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Nt);
	for (let i of V(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = QI(i, a) ?? $I(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${pt}]`)) n.has(t) || t.remove();
}
function QI(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : XI.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function $I(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (rL(i, t.getAttribute(y)), XI.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function eL(e, t, n) {
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
function tL(e) {
	return e.find((e) => !e.classList.contains(Mr));
}
function nL(e, t, n, r, i) {
	let a = t.renderFromTemplate(e, n, i);
	if (a === null) return null;
	let o = document.createElement("div");
	return rL(o, r), o.appendChild(a), o;
}
function rL(e, t) {
	e.setAttribute(pt, ""), t === null ? e.removeAttribute(mt) : e.setAttribute(mt, t);
}
var iL = "bottom", aL = "pending";
function oL(e, t, n) {
	let r = e.querySelector(`:scope > [${Tt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(Tt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function sL(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var cL = /* @__PURE__ */ new WeakMap();
function lL(e) {
	for (let t of e.querySelectorAll(`:scope > [${pt}]`)) t.remove();
}
function uL(e, t, n, r, i, a) {
	let o = VS(e, V(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = MS(i.getItemsFilterSortMetadata(t), a, OS(e));
	if (c && !l && lL(e), o.length === 0) {
		cL.set(e, []);
		return;
	}
	let d = cS(e);
	if (!l) {
		sL(e, [...NS(o, u, r), ...sS(d)]);
		return;
	}
	lL(e);
	let { buckets: f, order: p } = eL(o, (e) => e.getAttribute("data-ui-group") ?? "", cL.get(e) ?? []), m = r.getAncestorStack(e);
	cL.set(e, p);
	let h = [];
	for (let e of p) {
		let t = f.get(e);
		u.length > 0 && (t = NS(t, u, r));
		let n = e === "" ? void 0 : tL(t);
		if (n !== void 0) {
			let e = nL(s, r, r.getItemValue(n), n.getAttribute(y), m);
			e !== null && h.push(e);
		}
		h.push(...t);
	}
	sL(e, [...h, ...sS(d)]);
}
//#endregion
//#region src/items/items-host-sync.ts
var dL = "ui-tree-rules", fL = `:scope > .${On}:not(.${jn})`;
function pL(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(dL, { bubbles: !0 })), lS(e, t, n.templates, n.renderer, e.querySelector(fL) !== null);
		return;
	}
	switch (Gx(e)) {
		case "windowed":
			lS(e, t, n.templates, n.renderer), hL(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			kS(e, t, n.metadata, n.renderer, n.state), mL(e), lS(e, t, n.templates, n.renderer), uL(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function mL(e) {
	let t = Vl(e);
	t !== null && Bl(t, V(e).filter((e) => e instanceof HTMLElement));
}
function hL(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	if (r === void 0) return;
	let i = n.renderer.getAncestorStack(e);
	ZI(e, (e) => nL(r, n.renderer, n.renderer.getItemValue(e), e.getAttribute(y), i));
}
//#endregion
//#region src/interactions/table-header-group.ts
var gL = ".ui-table", _L = `:scope > .${wn} > .${Tn} > [role='columnheader']`, vL = `:scope > .${En}`, yL = "input:not([type='hidden']), button, select, textarea, a[href]", bL = /* @__PURE__ */ new WeakMap();
function xL(e) {
	for (let t of e.querySelectorAll(_L)) {
		let e = SL(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function SL(e) {
	let t = e.querySelector(yL);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(vL);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function CL(e, t = null) {
	let n = wL(e), r = bL.get(e), i = n.find((e) => t !== null && EL(e) === t) ?? (r !== void 0 && n.includes(r) ? r : n[0]);
	return i !== void 0 && (TL(e, i), !0);
}
function wL(e) {
	let t = Kc(e), n = [];
	for (let r of e.querySelectorAll(_L)) {
		let e = SL(r), i = Number(r.getAttribute("data-ui-table-column") ?? NaN);
		e !== null && Number.isInteger(i) && N(e) && n.push({
			stop: e,
			place: t.place(i)
		});
	}
	return n.sort((e, t) => e.place - t.place).map((e) => e.stop);
}
function TL(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), bL.set(e, t), t.focus();
}
function EL(e) {
	return e.closest("[role='columnheader']")?.getAttribute("data-ui-table-column") ?? null;
}
function DL(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(gL) && SL(t) === e ? n : null;
}
function OL(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(EL(e.target)), !0;
		case "ArrowUp": return !0;
	}
	if (!Js(e.key, "horizontal")) return !1;
	let r = qs({
		key: e.key,
		items: wL(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && TL(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var kL = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), AL = ".ui-table", jL = /* @__PURE__ */ new Set([
	"ArrowLeft",
	"ArrowRight",
	"ArrowUp",
	"ArrowDown",
	"Home",
	"End",
	"Enter",
	"F2",
	" "
]), ML = `:scope > [${b}], :scope > .${wn}, :scope > .${wn} > [${b}]`, NL = class {
	root;
	rows;
	pressedBoxes = [];
	windowEnds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.rows = e.rows, this.applyAll(this.root.querySelectorAll(P)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), z(this.root, P, {
			childList: !0,
			attributeFilter: [
				vr,
				br,
				xr,
				Et
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
		let t = Wc(e);
		Ac(e, t);
		for (let t of e.querySelectorAll(ML)) FL(t);
		if (!e.matches(".ui-items-view, .ui-table")) return;
		e.matches(AL) && xL(e);
		for (let n of t) {
			let t = Hs(n);
			t !== null && FL(t);
			for (let e of Us(n)) FL(e);
			PL(e, n, n.hasAttribute(je));
		}
		let n = this.windowEnds.get(e);
		n !== void 0 && this.settleWindowEnd(e, t, n);
	}
	settleWindowEnd(e, t, n) {
		let r = zc(e);
		if (r === null || r.hasAttribute("data-ui-window-pending")) return;
		let i = qx(r, At) !== null, a = n === "first" ? Kx(r) === 0 && !Jx(r, "data-ui-window-more-before") : !Jx(r, Mt);
		if (i && !a) return;
		this.windowEnds.delete(e);
		let o = Ml(n === "first" ? "Home" : "End", t, null, UL(e));
		o !== null && (dl(e, t, o), e.getAttribute("data-ui-selection") === "one" && Mc(e, t, o, Sc));
	}
	handleClick(e) {
		let t = this.resolveRow(e, P);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = Wc(n);
		if (dl(n, i, r, e.target instanceof Element ? Dl(r, e.target) : null), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Tc(n, r);
			return;
		}
		Mc(n, i, r, Ec(e), this.heldRange(n)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(bc), r = n?.closest(P) ?? null;
		return n === null || r === null || n.closest(P) !== r || !r.matches(t) || D(r) ? null : Ks(e.target, n) === null && !O(n) ? {
			root: r,
			item: n
		} : null;
	}
	heldRange(e) {
		let t = this.rows, n = zc(e);
		return t === void 0 || n === null ? void 0 : (e, r) => t.rangeKeysOf(n, e, r);
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, xc);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Ll(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element) || Ps(e)) return;
		let t = DL(e.target);
		if (t !== null && !D(t)) {
			OL(e, t, (e) => this.enterRows(t, e)) && e.preventDefault();
			return;
		}
		let n = rl(e);
		if (n === null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || D(r) || pl(r) && IL(e) && this.handleCellKey(r, e)) return;
		let i = UL(r);
		if (!kL.has(e.key) && !Al(e.key, i)) return;
		if (this.windowEnds.delete(r), this.reachWindowEnd(r, e)) {
			e.preventDefault();
			return;
		}
		this.bringRowsIn(r, e.key);
		let a = Wc(r), o = ol(a), s = Ml(e.key, a, sl(a), i);
		if (s !== null) {
			e.preventDefault(), dl(r, a, s, e.key === "ArrowUp" && !e.shiftKey && pl(r) ? El(s) : null), RL(r, a, o, s, Dc(r, e), this.heldRange(r));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(AL) && CL(r, xl(r))) {
			e.preventDefault();
			return;
		}
		if (o === null || O(o)) return;
		let c = Hs(o);
		switch (e.key) {
			case " ":
				zL(r, a, o, c);
				break;
			case "Enter":
				VL(r, a, o, c);
				break;
			case "Delete":
				if (!BL(r, a, o)) return;
				break;
			default: return;
		}
		e.preventDefault();
	}
	handleCellKey(e, t) {
		this.bringCursorRowIn(e);
		let n = Wc(e), r = sl(n);
		if (r === null || O(r)) return !1;
		let i = bl(r), a = !t.ctrlKey && !t.metaKey && !t.shiftKey;
		switch (t.key) {
			case "ArrowLeft":
			case "ArrowRight":
			case "Home":
			case "End": {
				if (!a) return !1;
				let o = Sl(e, r, i, t.key);
				return o !== null && dl(e, n, r, o), t.preventDefault(), !0;
			}
			case "ArrowDown":
			case "ArrowUp": {
				let o = a ? Cl(e, r, i, t.key === "ArrowDown") : null;
				return o !== null && (t.preventDefault(), dl(e, n, r, o), !0);
			}
			default: return i !== null && LL(i, t);
		}
	}
	reachWindowEnd(e, t) {
		let n = t.key === "Home" || t.key === "End" ? zc(e) : null;
		if (n === null || Gx(n) !== "windowed" || n.hasAttribute("data-ui-window-paged")) return !1;
		let r = t.key === "Home";
		return !(r ? Kx(n) === 0 && !Jx(n, "data-ui-window-more-before") : !Jx(n, "data-ui-window-more-after")) && (this.windowEnds.set(e, r ? "first" : "last"), nc(n, r ? 0 : tc(n).contentHeight), !0);
	}
	bringRowsIn(e, t) {
		let n = this.rows, r = n === void 0 ? null : zc(e);
		if (n === void 0 || r === null) return;
		let i = Gl(e);
		switch (t) {
			case "Home":
			case "End": {
				let e = n.shownKeysOf(r);
				e !== null && e.length > 0 && n.reveal(r, t === "Home" ? e[0] : e[e.length - 1], "nearest");
				return;
			}
			case "PageDown":
			case "PageUp": {
				let a = i === null ? sl(Wc(e)) : null, o = i ?? (a === null ? null : I(a));
				o !== null && n.reveal(r, o, t === "PageDown" ? "start" : "end");
				return;
			}
			default: this.bringCursorRowIn(e);
		}
	}
	bringCursorRowIn(e) {
		let t = this.rows === void 0 ? null : zc(e), n = Gl(e);
		t !== null && n !== null && this.rows?.reveal(t, n, "nearest");
	}
	enterRows(e, t) {
		let n = Wc(e), r = sl(n) ?? Ml("ArrowDown", n, null, "vertical");
		e.focus({ preventScroll: !0 }), r !== null && (dl(e, n, r, hl(r, t)), e.getAttribute("data-ui-selection") === "one" && Mc(e, n, r, Sc));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(P) ?? null;
		if (t !== null && n !== null && [...n.querySelectorAll(ML)].includes(t)) {
			L(n);
			return;
		}
		if (e.target instanceof HTMLElement && e.target.matches(P) && e.target.matches(".ui-items-view, .ui-table") && !D(e.target) && !cu()) {
			ll(e.target, Wc(e.target));
			return;
		}
		let r = e.target instanceof Element ? e.target.closest(bc) : null, i = r?.closest(P) ?? null;
		r === null || i === null || r.hasAttribute("data-ui-row-focus") || !i.matches(".ui-items-view, .ui-table") || Ks(e.target, r) === null || dl(i, Wc(i), r, e.target instanceof Element ? Dl(r, e.target) : null, !1);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(P) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && uu(n, !0);
			for (let e of n.querySelectorAll(ML)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) FL(e);
		this.pressedBoxes = [];
	}
	followCursor(e) {
		for (let t of e) {
			let e = t.target;
			if (!(e instanceof HTMLElement) || !e.matches(bc)) continue;
			let n = e.closest(P);
			n !== null && n.matches(".ui-items-view, .ui-table") && PL(n, e, e.hasAttribute(je));
		}
	}
};
function PL(e, t, n) {
	if (n) {
		for (let n of t.querySelectorAll(`[${Ne}]`)) n.parentElement?.closest(P) === e && kP(n);
		return;
	}
	for (let n of t.querySelectorAll(Jl)) n.tabIndex >= 0 && n.parentElement?.closest(P) === e && Gs(t, n) && OP(n);
}
function FL(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function IL(e) {
	return jL.has(e.key) || oy(e) !== null;
}
function LL(e, t) {
	let n = t.key, r = oy(t) !== null, i = !t.ctrlKey && !t.metaKey && !t.altKey;
	if (!r && (!i || n !== "Enter" && n !== "F2" && n !== " ")) return !1;
	if (n !== " " && kl(e, t)) return !0;
	let a = Hs(e);
	if (a !== null && (n === "Enter" || n === " ")) return t.preventDefault(), a.click(), !0;
	if (n !== "F2" && (n !== "Enter" || !Tl(e))) return !1;
	let o = gu(e);
	return o !== null && (t.preventDefault(), o.focus(), !0);
}
function RL(e, t, n, r, i, a) {
	e.getAttribute("data-ui-selection") !== "one" && !i.shift || (i.shift && wc(e, n), Mc(e, t, r, i, a));
}
function zL(e, t, n, r) {
	Mc(e, t, n, {
		shift: !1,
		ctrl: !0
	}) || HL(n, r);
}
function BL(e, t, n) {
	if (!e.hasAttribute("data-ui-rows-remove")) return !1;
	let r = WL(t, n);
	for (let e of r) Ll(e, "remove");
	return r.length > 0;
}
function VL(e, t, n, r) {
	Oc(e) && !jc(t).includes(n) && Mc(e, t, n, Sc), HL(n, r), r === null && Ll(n, "open");
}
function HL(e, t) {
	t === null ? Ll(e, Il) : t.click();
}
function UL(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function WL(e, t) {
	let n = jc(e);
	return (n.includes(t) ? n : [t]).filter((e) => !Lo(e, "data-ui-unremovable") && !O(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var GL = "ui-tree__row--folded", KL = "fold-hidden", qL = "fold-shown", JL = "ui-tree__row--dragging", YL = "ui-tree__loading", XL = "ui-tree__loading-ring", ZL = "ui-tree-node__text", QL = "ui-tree-node__toggle", $L = "ui-tree-node__rename", eR = ".ui-text__title", tR = An, nR = "--ui-tree-depth", rR = "expanded", iR = 600, aR = .25, oR = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, sR = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), cR = class {
	root;
	store = new hD();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(dL, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${Dn}`) : null;
			t !== null && (this.layout(t), Bl(t, this.rowsOf(t)));
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
		}), this.layoutAll(this.root.querySelectorAll(`.${Dn}`)), z(this.root, `.${Dn}`, {
			childList: !0,
			attributeFilter: [
				zn,
				Bn,
				Hn,
				qn
			],
			relevant: dR
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = wC(e)?.getAttribute(zn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = I(e), r = wC(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Bn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), ee = o !== null && !o.has(n);
			e.style.setProperty(nR, String(u)), e.setAttribute("aria-level", String(u + 1)), ul(e, r?.querySelector(`:scope > .${ZL}`) ?? null), e.classList.toggle(GL, !d), e.classList.toggle(jn, ee), e.removeAttribute(Kn), e.draggable = i && eS(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Wn), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Wn, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Wn), d && g && !ee), s.set(n, {
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
		return wC(e.row)?.hasAttribute(Hn) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${On}[${y}="${ei(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, KL, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, qL, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [Kn]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Vi(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = OS(t);
		if (r === void 0 && i === null) return null;
		let a = MS(r, this.rules.state, i), o = jS(r, this.rules.state, i);
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
			let t = wC(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => PS(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(I(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${YL}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = I(o), c = i.getItemValue(o);
			if (c === void 0 || AS(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = wC(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(YL) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? fR();
		o.style.setProperty(nR, String(t)), o.classList.toggle(GL, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${QL}`) === null && (!Lo(r, "data-ui-unselectable") || Ks(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Ks(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : Ll(r, "open");
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${On}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || O(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleFocusIn(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-tree") || D(t) || cu() || ll(t, this.rowsOf(t));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || A(e) || !(e.target instanceof Element)) return;
		let t = rl(e);
		if (t === null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || D(n)) return;
		let r = e.altKey && j(e, { alt: !0 }) ? oR[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!sR.has(e.key) && !Al(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = ol(i), o = Ml(e.key, i, sl(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, Dc(n, e));
			return;
		}
		if (!(a === null || O(a))) {
			switch (e.key) {
				case " ":
					zL(n, i, a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, Ml("ArrowDown", i, a, "vertical"), Sc);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Sc);
					break;
				case "Enter":
					VL(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete":
					if (n.hasAttribute("data-ui-tree-unremovable") || !BL(n, i, a)) return;
					break;
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = ol(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = AC(mR(n), I(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => I(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Lo(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = pR(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(qn) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (O(t)) {
			e.preventDefault();
			return;
		}
		let a = $x(t, this.rowsOf(n)), o = Qx(n, i, a);
		r ? Bm(e, n, t, JL, I(t), a.filter((e) => e !== t), nS(o, !0)) : Hm(e, I(t), nS(o, !1)), rS(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(JL));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${On}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = I(t), o = (e) => n.some((t) => I(t) === e || uR(i, e, I(t))), s = TC(t, wC(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? aR : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = mR(f), m = Number(t.style.getPropertyValue(nR)) || 0, h = new Set(n.map(I)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, ee = i.get(a) ?? "", _ = g === void 0 ? {
			parent: ee,
			before: d === "before" ? a : PC(p, ee, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !EC(_.parent, (e) => f.find((t) => I(t) === e) ?? null) || o(_.parent) ? null : {
			mark: d,
			place: _,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), iR)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dn}`);
		t !== null && Um(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${tR}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && uR(a, I(e), I(t)))), s = r.getAttribute(tR) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), Vm(t, JL), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = FC(mR(this.rowsOf(e)), t.map(I), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = wC(e)?.querySelector(`.${ZL}`) ?? null;
			r !== null && (r.setAttribute(Gn, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), iC(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = pR(e)?.closest(".ui-tree") ?? null;
		t !== null && (Vm(t, JL), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		OC(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(I(n), wC(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(GL)) : [];
		this.store.writeJson(e, rR, i), this.layout(e), lR(a.filter((e) => !e.classList.contains(GL)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, rR) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ol(r);
		dl(e, r, t), n !== null && RL(e, r, i, t, n);
	}
	parentOf(e, t) {
		let n = wC(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => I(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${Dn}`), n = wC(e), r = n?.querySelector(eR) ?? null;
		t === null || n === null || r === null || Lo(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), hs({
			container: n,
			title: r,
			className: $L,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Un, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function lR(e) {
	if (!(e.length === 0 || Nd())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: R.fast,
		easing: R.enter
	});
}
function uR(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function dR(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function fR() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = YL, e.setAttribute("aria-hidden", "true"), t.className = XL, e.append(t, E.text("ui.tree.loading")), e;
}
function pR(e) {
	return e.target instanceof Element ? e.target.closest(`.${On}`) : null;
}
function mR(e) {
	return e.map((e) => ({
		key: I(e),
		parent: wC(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: TC(e, wC(e)),
		shown: !e.classList.contains(jn)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var hR = {
	visibilityState: () => document.visibilityState,
	notificationPermission: _R
};
function gR(e) {
	return e !== "hidden";
}
function _R() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var vR = 200;
function yR(e = hR) {
	return {
		visible: gR(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var bR = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? hR, this.settleMilliseconds = e.settleMilliseconds ?? vR;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = yR(this.source), this.held;
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
		let t = yR(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function xR(e) {
	return {
		permission: _R,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function SR(e, t, n = xR()) {
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
function CR(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && wR(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function wR(e, t = window.location) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function TR(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var K = "ui-tabs-view", ER = "ui-tab-item__label", DR = "ui-tab-item__close", OR = "ui-tab-item__rename", kR = "ui-tab-item__caption", AR = "ui-tab-item__pin", jR = ".ui-text__title", MR = "ui-tab-item--dragging", NR = "ui-tab-item__caption--overflowed", PR = "ui-tabs-view--overflowing", FR = "ui-tabs-view--no-overflow", IR = "ui-tab-item__page", LR = "ui-tab-item--selected", RR = `.${x}`, zR = "tab-menu-entry", BR = {
	name: zR,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, VR = "tab-pin";
function HR(e) {
	return {
		name: VR,
		registration: Wx((e) => XS(e.target), e)
	};
}
var UR = "--ui-tabs-view-strip", WR = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	closed = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new sP({
			rootClass: K,
			overflowingClass: PR,
			wraps: (e) => e.classList.contains(FR),
			hiddenClass: NR,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(w(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => tz(e) === t.key))?.querySelector(`.${ER}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(lO, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), sI(this.root, ["press"], (e) => {
			let t = e.closest(`.${DR}`)?.closest(`.${kR}`) ?? null;
			return t === null ? [] : [t];
		}), z(this.root, `.${K}`, {
			childList: !0,
			attributeFilter: [
				Cr,
				be,
				ce,
				...Er
			],
			relevant: (e) => !Yf(e, `.${IR}`, `.${K}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${K}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e);
		KR(e, t);
		let n = t.filter(AO), r = e.getAttribute("data-ui-tabs-selected") ?? "", i = vc(n, r, tz);
		if (i === null) return;
		if (i !== r) {
			this.select(e, i);
			return;
		}
		let a = e.hasAttribute(be), o = t.find((e) => e.classList.contains(LR))?.querySelector(`.${kR}`) ?? null, s = [], c = null, l = null;
		for (let e of t) {
			let t = tz(e) === r;
			e.classList.toggle(LR, t);
			let i = e.querySelector(`.${kR}`);
			i !== null && (i.draggable = a, mP(i), n.includes(e) && (s.push(i), t && (c = i))), e.querySelector(`.${ER}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${IR}`)) n.hidden = !t;
			t && (l = e.querySelector(`.${IR}`));
		}
		this.fitCaptions(e, s, c), this.writeStripHeight(e, l), hP(o, c), o !== null && o !== c && gP(l);
		let u = [], d = null;
		for (let e of s) {
			let t = e.querySelector(`.${ER}`);
			t === null || e.classList.contains(NR) || (u.push(t), e === c && (d = t));
		}
		M(u, d), this.focusAfterClose(e, d);
	}
	focusAfterClose(e, t) {
		let n = this.closed;
		n === null || n.root !== e || n.item.isConnected || (this.closed = null, t !== null && (document.activeElement === null || document.activeElement === document.body) && L(t));
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !AO(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(UR, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${b}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${nP}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => tz(e) === t)?.querySelector(`.${ER}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(AO).map((e) => ({
				key: tz(e),
				title: e.querySelector(`.${ER}`)?.textContent?.trim() ?? tz(e),
				current: tz(e) === t,
				disabled: D(e.querySelector(`.${ER}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${JS}`);
		if (n === null || !n.classList.contains(K) || r === null || r.closest(`.${K}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = YR(n, r), a = ZR(t), o = a.map((e) => {
			if (XR(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? AO(e) ? "shown" : "hidden";
		});
		if (iO(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: tz(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(RR);
		if (t === null || n === null || !n.classList.contains(K) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => tz(e) === a.key);
		if (i.length === 0 || r.matches(`${un}, ${ln}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(zR, {
			bubbles: !0,
			detail: { keys: [i, tz(o)] }
		})), !0;
		if (YR(n, o).get(i) !== !0) return !0;
		switch (i) {
			case ZD: {
				let e = o.querySelector(`.${ER}`);
				e !== null && this.startRename(e);
				break;
			}
			case QD:
			case $D:
				this.setPinned(n, o, i === QD);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${kR} > .${AR}`);
		t.toggleAttribute(Tr, n), r !== null && (r.toggleAttribute(Tr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = TR(a.map(ez));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? YS(a[a.length - 1]).after(YS(t)) : YS(s).before(YS(t)), t.dispatchEvent(new Event(VR, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${nP}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(K)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = QR(e.target), i = r?.closest(`.${K}`) ?? null;
		if (r === null || i === null || D(r)) return;
		let a = r.closest(`.${JS}`);
		a !== null && a.closest(`.${K}`) === i && (e.preventDefault(), this.select(i, tz(a)), document.activeElement !== r && L(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${DR}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${K}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), qR(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = QR(e.target), n = t?.closest(`.${K}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(jR) ?? e, r = e.closest(`.${JS}`);
		t === null || r === null || ZS(r, "data-ui-unrenamable") || hs({
			container: t,
			title: n,
			className: OR,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(wr, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => L(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element) || Ps(e)) return;
		let t = e.target.closest(`.${ER}`), n = t?.closest(`.${K}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = t.closest(`.${JS}`);
		if (r === null || r.closest(`.${K}`) !== n) return;
		if (e.key === "Delete" && j(e)) {
			if (!JR(n, r)) return;
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
		let i = this.ownItems(n).map((e) => e.querySelector(`.${ER}`)).filter((e) => e !== null), a = qs({
			key: e.key,
			items: i,
			current: t,
			axis: "horizontal"
		});
		if (a === null) return;
		e.preventDefault();
		let o = a.closest(`.${JS}`);
		o !== null && this.select(n, tz(o)), a.focus();
	}
	moveByKey(e, t, n) {
		if (!e.hasAttribute("data-ui-tabs-draggable") || ZS(t, "data-ui-undraggable") || D(t) || t.hasAttribute("data-ui-tab-pinned")) return;
		n.preventDefault();
		let r = this.ownItems(e), i = r[r.indexOf(t) + (n.key === "ArrowLeft" ? -1 : 1)];
		i === void 0 || i.hasAttribute("data-ui-tab-pinned") || (n.key === "ArrowLeft" ? YS(t).after(YS(i)) : YS(t).before(YS(i)), iC(t, this.ownItems(e).indexOf(t)));
	}
	handleDragStart(e) {
		let t = $R(e);
		if (t === null) return;
		if (ZS(t, "data-ui-undraggable") || D(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Bm(e, t.closest(`.${K}`) ?? t, t, MR, tz(t));
		let n = YS(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${kR}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${K}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${MR}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${kR}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = YS(r), o = t.hasAttribute("data-ui-tab-pinned") ? GR(n, a) : null, s = o ?? YS(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${K}`);
		t !== null && t.querySelector(`.${MR}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = $R(e);
		if (t === null) return;
		t.classList.remove(MR);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(YS(t), n.next);
			return;
		}
		let r = YS(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${K}`);
		i !== null && iC(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		_c(e, t, {
			attribute: Cr,
			bindingAttribute: Sr,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return hc(e, `.${JS}`, `.${K}`);
	}
};
function GR(e, t) {
	let n = null;
	for (let r of hc(e, `.${JS}`, `.${K}`)) {
		let e = YS(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function KR(e, t) {
	let n = !t.some((e) => !ZS(e, ce));
	e.hasAttribute("data-ui-tabs-none-removable") !== n && e.toggleAttribute(ye, n);
}
function qR(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !ZS(t, "data-ui-unremovable");
}
function JR(e, t) {
	return e.hasAttribute("data-ui-tabs-removes") && qR(e, t) && !t.hasAttribute("data-ui-tab-pinned") && !D(t);
}
function YR(e, t) {
	return rO(nO(e.getAttribute(xe)), {
		pinned: t.hasAttribute(Tr),
		renamable: !ZS(t, le),
		removable: e.hasAttribute("data-ui-tabs-removes") && qR(e, t)
	});
}
function XR(e) {
	let t = e.getAttribute(y);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function ZR(e) {
	let t = e.querySelector(`[${b}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function QR(e) {
	return e.closest(`.${DR}`) !== null || ms(e) ? null : e.closest(`.${kR}`)?.querySelector(`:scope > .${ER}`) ?? null;
}
function $R(e) {
	return e.target instanceof Element ? e.target.closest(`.${kR}`)?.closest(".ui-tab-item") ?? null : null;
}
function ez(e) {
	return { pinned: e.hasAttribute(Tr) };
}
function tz(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var nz = "button.ui-text__fold-toggle", rz = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(nz);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, iz = "ui-temporal-input__segments", az = "ui-temporal-input__segment", oz = "ui-temporal-input__segment-literal", sz = "ui-temporal-input__segment--empty", cz = "data-ui-temporal-segment", lz = "data-ui-temporal-step-direction", uz = "data-ui-temporal-segments-of", dz = "--", fz = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${H}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(zi(e.components, `.${H}`));
		}), z(this.root, `.${H}`, { attributeFilter: [...Ew] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Ow(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${iz}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = kw(e), r = Pw(e), i = U(e, Hw(t));
		t.getAttribute(uz) !== n && (t.replaceChildren(...pz(n).map((e) => hz(e))), t.setAttribute(uz, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(cz);
			if (t === null) {
				n.textContent = _z(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = vz(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(sz, i === null), n.tabIndex = 0, yz(n, t, i, k(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !j(e, { shift: !0 })) return;
		let t = xz(e.target);
		if (t === null) return;
		let n = t.closest(`.${H}`), r = t.getAttribute(cz), i = bz(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), Cz(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), Jw(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = wz(e.key, Pw(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = xz(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = xz(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Rg(this.wheelTurn, Lg(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${H}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(cz), n < 0 ? 1 : -1, bz(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${lz}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${lz}]`);
		if (t === null) return;
		let n = t.closest(`.${H}`);
		if (n === null || k(n)) return;
		e.preventDefault();
		let r = Sz(n) ?? n.querySelector(`.${az}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(cz), t.getAttribute(lz) === "up" ? 1 : -1, bz(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${az}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${H}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = U(e, r), n = t !== null && t.getHours() >= 12 ? "am" : "pm";
			this.write(e, $w(e, Ez(this.baseValue(e, r), n)), r);
			return;
		}
		let i = this.baseValue(e, r), a = Tz(t), o = jw(Aw(e), a) * n, s = a === "hour" ? 24 : 60, c = ((Mw(i, a) + o) % s + s) % s;
		this.write(e, $w(e, Nw(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? Nw(t, "hour", Dz(l, t.getHours() >= 12)) : Nw(t, Tz(n), l), i);
		}
		u && Cz(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		this.write(e, Ez(this.baseValue(e, n), t), n);
	}
	baseValue(e, t) {
		return U(e, t) ?? Qw(e);
	}
	write(e, t, n) {
		Jw(e, t, n), Xw(e), this.applySegments(e);
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
function pz(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = sa(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(mz(r)), n += r.length;
	}
	return t;
}
function mz(e) {
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
function hz(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = oz, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = az, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(cz, e.unit), t.dataset.width = String(e.width), gz(t, e.unit), t;
}
function gz(e, t) {
	if (t === "meridiem") {
		E.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = Tz(t);
	E.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function _z(e, t, n, r) {
	return t && n !== null ? na(n, e, r) : e;
}
function vz(e, t, n, r) {
	if (n === null) return dz;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? Oa(n.getHours()) : Mw(n, Tz(e));
	return String(i).padStart(t, "0");
}
function yz(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	e.setAttribute("aria-valuenow", String(t === "hour12" ? Oa(n.getHours()) : Mw(n, Tz(t))));
}
function bz(e) {
	return Hw(e.closest(`.${iz}`));
}
function xz(e) {
	let t = e instanceof Element ? e.closest(`.${az}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${H}`);
	return n === null || k(n) ? null : t;
}
function Sz(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${az}`) : null;
}
function Cz(e, t, n) {
	qs({
		key: n,
		items: [...e.querySelectorAll(`.${az}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function wz(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function Tz(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function Ez(e, t) {
	return Nw(e, "hour", Dz(Oa(e.getHours()), t === "pm"));
}
function Dz(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var Oz = "ui-timestamp", kz = "ui-timestamp__text", Az = "data-ui-timestamp-format", jz = "datetime", Mz = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${Oz}`), E.temporal === null), E.onTable(() => this.apply(this.root.querySelectorAll(`.${Oz}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(zi(e.components, `.${Oz}`))), z(this.root, `.${Oz}`, {
			childList: !0,
			attributeFilter: [jz],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${Oz}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: E.temporal,
			language: E.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Ma(a.getAttribute(Az)), o = ja(a.getAttribute(jz)), s = a.querySelector(`.${kz}`);
			if (s === null || t && !Nz(e, o, r)) continue;
			let c = o === null ? "" : Fa(o, e, n, r), l = e === "relative-date" ? La(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= Na(e) && o !== null;
		}
		i && uo(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${Oz}:is([${Az}="relative"], [${Az}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function Nz(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Ia(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var Pz = /* @__PURE__ */ new Map();
function Fz(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${b}]`)) if (t.closest(S) === e) return t;
	return null;
}
function Iz(e, t, n, r) {
	let i = Lz(e, t);
	return i !== null && (Pz.set(e, {
		key: t,
		block: n
	}), Rz(e, i, n, r), !0);
}
function Lz(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function Rz(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = $s(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = zz(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function zz(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function Bz(e) {
	let t = Pz.get(e);
	if (t === void 0) return;
	let n = Lz(e, t.key);
	if (n === null) {
		Pz.delete(e);
		return;
	}
	Rz(e, n, t.block, "auto");
}
function Vz(e) {
	if (!(Pz.size === 0 || !(e instanceof Node))) for (let t of [...Pz.keys()]) (!t.isConnected || $s(t).contains(e)) && Pz.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var Hz = "data-ui-scroll-anchor", Uz = "End", Wz = `[${Hz}="${Uz}"]`, Gz = 4, Kz = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], qz = /* @__PURE__ */ new WeakSet();
function Jz(e) {
	qz.add(e);
}
function Yz(e) {
	Vz(e);
	for (let t = e.closest(Wz); t !== null; t = t.parentElement?.closest(Wz) ?? null) qz.delete(t);
}
var Xz = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of Kz) this.root.addEventListener(e, (e) => Zz(e), {
			capture: !0,
			passive: !0
		});
		z(this.root, `[${Hz}="${Uz}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Lt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !$z(t) || this.pinned.set(t, qz.has(t) || tB(t) && !eB(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${Hz}="${Uz}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), qz.has(t)) {
				this.pinned.set(t, !0), Qz(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (eB(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), Qz(t);
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
			if (!e.isConnected || r === null || !$z(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? Qz(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !$z(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && Qz(e);
	}
	followsEnd(e) {
		return qz.has(e) || this.pinned.get(e) !== !1 && !eB(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function Zz(e) {
	Vz(e.target);
	let t = e.target instanceof Element ? e.target.closest(Wz) : null;
	t !== null && qz.delete(t);
}
function Qz(e) {
	e.scrollTop = e.scrollHeight;
}
function $z(e) {
	return e.getAttribute(Hz) === Uz;
}
function eB(e) {
	return Jx(e, Mt);
}
function tB(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= Gz;
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var nB = `${zs}, [role='menu'], [role='tab']`, rB = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? iB, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(nB) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function iB(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function aB(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = sB(e, a, n), s = sB(e, a + 1, n);
	return cB(t, o.top, s.top, o.line, s.line);
}
function oB(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = sB(e, a, n), s = sB(e, a + 1, n);
	return cB(t, o.line, s.line, o.top, s.top);
}
function sB(e, t, n) {
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
function cB(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var lB = 250, uB = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(St);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < lB && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${St}="${ei(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${St}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = dB(e, "data-ui-scroll-viewport") ?? fB(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? mB(e) : null, a = i === null ? null : mB(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = oB(a, aB(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? pB(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function dB(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function fB(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : dB(e, b);
	return t === null ? null : $s(t);
}
function pB(e, t) {
	return t > 0 ? e / t : 0;
}
function mB(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Ct}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${wt}]`);
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
var hB = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", gB = `.${Vr}, .ui-action, .${x}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, .ui-color-input__swatch--button, .ui-expander__header, ${hB}`, _B = "ui-key-value-action__row", vB = `${gB}, ${`${bc}, .${_B}`}`, yB = "ui-pressing", bB = "ui-press-held", xB = "--ui-press-x", SB = "--ui-press-y", CB = "--ui-ripple-radius", wB = "--ui-ripple-opacity", TB = class {
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
		if (t === null || typeof t.animate != "function" || Nd()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(xB, `${r}px`), t.style.setProperty(SB, `${i}px`), t.classList.add(yB, bB);
		let o = t.animate([{ [CB]: "0px" }, { [CB]: `${a}px` }], {
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
		let t = e.closest(hB) ?? e.closest(vB);
		if (t === null || D(t)) return null;
		let n = e.closest(Rr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(gB) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Ks(t, e) !== null || O(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(P), r = n !== null && !e.classList.contains(_B) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Lo(e, "data-ui-unselectable");
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
		n.element.classList.remove(bB);
		let r = Math.max(0, R.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, R.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [wB]: 1 }, { [wB]: 0 }], {
			duration: R.normal,
			delay: i,
			easing: R.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(yB, bB), this.presses.get(e) === t && this.presses.delete(e);
	}
}, EB = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), DB = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], OB = `.${kr}, .${Ar}`, kB = RegExp(`(^|\\s)(${kr}|${Ar})(\\s|$)`), AB = RegExp(`(^|\\s)${jr}(\\s|$)`), jB = "[type='range']", MB = /* @__PURE__ */ new WeakSet(), NB = /* @__PURE__ */ new WeakSet();
function PB(e = document) {
	let t = e === document ? window : e;
	for (let e of DB) t.addEventListener(e, HB, !0);
	t.addEventListener("keydown", WB, !0), t.addEventListener("change", GB, !0), t.addEventListener("pointerdown", KB, !0), t.addEventListener("mousedown", KB, !0), zB(e.querySelectorAll(OB)), LB(e.querySelectorAll(`[${Or}]`)), IB(e.querySelectorAll(jB)), new MutationObserver((e) => {
		for (let t of e) FB(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Or],
		attributeOldValue: !0
	});
}
function FB(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			RB(t, e.oldValue !== null);
			return;
		}
		let n = kB.test(e.oldValue ?? ""), r = t.matches(OB);
		n !== r && (BB(t, r), RB(t)), AB.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && IB(t.querySelectorAll(jB));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(OB) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && VB(n), n.matches(OB) && BB(n, !0), zB(n.querySelectorAll(OB)), RB(n), LB(n.querySelectorAll(`[${Or}]`)), IB([n, ...n.querySelectorAll(jB)]));
}
function IB(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = k(t);
		e !== MB.has(t) && (e ? (MB.add(t), t.addEventListener("touchstart", KB, { passive: !1 })) : (MB.delete(t), t.removeEventListener("touchstart", KB)));
	}
}
function LB(e) {
	for (let t of e) RB(t);
}
function RB(e, t = !1) {
	let n = e.getAttribute(Or);
	n === null && !t || (e.matches(OB) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !qh(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function zB(e) {
	for (let t of e) BB(t, !0);
}
function BB(e, t) {
	for (let n of e.children) t ? VB(n) : NB.has(n) && (NB.delete(n), n.removeAttribute("inert"));
}
function VB(e) {
	e.hasAttribute("inert") || (NB.add(e), e.setAttribute("inert", ""));
}
function HB(e) {
	e.target instanceof Element && (D(e.target) ? (e.type === "click" && fp(e), qB(e)) : e.type === "click" && UB(e.target) && e.preventDefault());
}
function UB(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && k(e);
}
function WB(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && D(e.target)) {
			qB(e);
			return;
		}
		!EB.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && k(e.target) && e.preventDefault();
	}
}
function GB(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && k(e.target) && e.stopImmediatePropagation();
}
function KB(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !k(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function qB(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var JB = /* @__PURE__ */ new WeakMap(), YB = /* @__PURE__ */ new WeakSet(), XB = /* @__PURE__ */ new WeakSet(), ZB = new om({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = JB.get(e);
		JB.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0,
	closesOnTab: ({ popup: e }) => YB.has(e),
	sheetOnPhone: ({ popup: e }) => XB.has(e)
});
function QB(e) {
	return {
		open: (e, t, n) => $B(e, t, n, (e) => ZB.open(e)),
		openList: eV,
		listKey: DE,
		followPointer: AE,
		focusReturn: (t) => ju(t, e)
	};
}
function $B(e, t, n, r) {
	let i = n.owner ?? (e instanceof HTMLElement ? e : t), a = () => ZB.popupOf(i) === t;
	return JB.set(t, n.onDismiss), n.closesOnTab === !0 ? YB.add(t) : YB.delete(t), n.sheetOnPhone === !0 ? XB.add(t) : XB.delete(t), r({
		owner: i,
		popup: t,
		anchor: e,
		placement: n
	}) || (JB.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
		reposition: () => {
			a() && ZB.reposition(i);
		},
		close: () => {
			a() && ZB.close(i);
		}
	};
}
function eV(e, t, n) {
	return $B(e, t, {
		...n,
		closesOnTab: !0
	}, (e) => EE(ZB, e, n.entries, n.checked, n.fromEnd, n.focus));
}
//#endregion
//#region src/rendering/series-colors.ts
var tV = "--ui-color-series-count", nV = "--ui-color-series-", rV = 8;
function iV(e) {
	let t = Number(getComputedStyle(e).getPropertyValue(tV));
	return Number.isFinite(t) && t >= 1 ? Math.floor(t) : rV;
}
function aV(e, t) {
	return `var(${nV}${e % t + 1})`;
}
var oV = {
	count: iV,
	color: aV
};
//#endregion
//#region src/items/item-rows.ts
function sV(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: yS,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => il(e) !== null,
		cellsOf: (e) => {
			let t = e.closest(P);
			return t !== null && pl(t) ? gl(t, e) : [];
		},
		moveCursor: (e, t) => Ol(e, t ?? null)
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var cV = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? dV(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), fV(l, n, t);
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
		let i = uV(r.item, t, n);
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
			lV(n, e) && this.applyBoundAttribute(i, String(w(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = w(t.bindingId);
			e.push([t, `[${Ge}${ti(n.propertyName)}="${ei(r)}"]`]);
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
		let r = _V(t, n.templateKeyPropertyName);
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
		r !== void 0 && hS(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : mS(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Eo(u, () => this.metadata.isTranslatable(a) && !gS(l)), f = w(a.componentId), p = e.closest(`[${v}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = ii(p, t, () => [e])[0] ?? null;
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
function lV(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = w(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function uV(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? bS(r, i.name) : TS(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return ES(r, i.key, n), e;
	let a = r;
	return a[SS(a, i.name)] = n, e;
}
function dV(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function fV(e, t, n) {
	e.setAttribute(y, t), gV(e, n), mV(e, n);
}
var pV = [
	["CanSelect", oe],
	["CanDrag", se],
	["CanRemove", ce],
	["CanRename", le],
	["CanShowContextMenu", ue]
];
function mV(e, t) {
	for (let [n, r] of pV) {
		let i = bS(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function hV(e, t) {
	let n = e.getAttribute(y), r = e.closest(`[${b}]`);
	if (mV(e, t), n !== null) for (let i of e.querySelectorAll(`[${y}="${ei(n)}"]`)) i.closest("[data-ui-items-host]") === r && mV(i, t);
}
function gV(e, t) {
	let n = bS(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(ht, n.value) : e.removeAttribute(ht);
}
function _V(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = bS(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var vV = "Group", yV = class {
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
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), z(e.root, `[${vt}="${yt}"]`, { attributeFilter: [rt] }, (e) => {
			for (let t of e) {
				let e = Vi(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), z(e.root, `[${bt}="windowed"]`, { attributeFilter: [Nt] }, (e) => {
			for (let t of e) {
				let e = Vi(t);
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
			for (let [t, n] of e) t.isConnected && pL(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(w(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : wS(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${b}]`)) {
			if (Gx(r) !== "virtualized") continue;
			let i = r.closest(S);
			i === null || !this.drawsPatchedComponent(i, w(e.reference.componentId), t) || !bV(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(T(i), t) && this.sync(r, T(i));
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
		pL(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${y}="${ei(t)}"]`)].filter((t) => this.isItemRoot(t) && Fi(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${b}]`), i = r === null ? null : Vi(r);
		if (r !== null && i !== null && Gx(r) === "virtualized") {
			let a = e.getAttribute(y);
			if (a === null || !this.options.virtualization.updateValue(r, a, t.steps, n)) return;
			e.isConnected && this.restampAbilities(e, t), this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = xV(vV, t);
		a && gV(e, this.options.renderer.getItemValue(e)), this.restampAbilities(e, t), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
	}
	restampAbilities(e, t) {
		pV.some(([e]) => xV(e, t)) && hV(e, this.options.renderer.getItemValue(e));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && xV(vV, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => xV(e.itemProperty, t)) || n.sorts.some((e) => xV(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${b}]`)) {
			let n = Vi(t);
			n === e && this.sync(t, n);
		}
	}
};
function bV(e, t) {
	let n = Pi(e, Ni(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function xV(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var SV = "ui-table", CV = "ui-table--no-header";
function wV(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(SV)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(CV)) && (s ? o : a).push(t);
	a.forEach((e, t) => TV(e, t));
	for (let [e, n] of t) TV(e, a.length + n);
	n !== null && o.forEach((e, t) => TV(e, a.length + n + t)), EV(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function TV(e, t) {
	EV(e, "aria-rowindex", String(t + 1));
}
function EV(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var DV = 50, OV = 1, kV = .5, AV = 60, jV = "--ui-window-look", MV = "--ui-window-row", NV = "--ui-window-tile", PV = 3, FV = class {
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
			if (this.layout(t), BV(t) === 0) {
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
		let t = qx(e, kt);
		if (t !== null && $z(e) && Jx(e, "data-ui-window-more-after")) {
			nc(e, Math.max(0, this.windowBottom(e, t) - tc(e).height));
			return;
		}
		t !== null && t !== 0 && nc(e, Jx(e, "data-ui-window-more-after") ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = zV(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : ic(n[n.length - 1]).bottom - ic(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = qx(e, kt), n = zV(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = tc(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		Gx(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${b}][${bt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = ec(e.target);
		if (t === null || Gx(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, AV));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && BV(e) > 0) return;
		let n = zV(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = qx(e, kt), i = Jx(e, jt), a = Jx(e, Mt);
		if (r !== null) {
			let o = this.windowSize(e), s = tc(e), c = Math.max(1, Math.round(s.height * OV / t.itemSize), Math.floor(o * kV)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, VV(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, VV(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = tc(e), s = Math.max(1, o.height * OV), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, VV(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, VV(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = qx(e, At);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Vi(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		let c = e.closest(S);
		e.setAttribute(Et, t.toLowerCase()), c?.setAttribute(Et, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && qx(e, "data-ui-window-total") === null && LV(e) && oL(e, aL, PV * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: HV(e),
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
			o.pending = !1, e.removeAttribute(Et), c?.removeAttribute(Et), e.removeAttribute("aria-busy"), oL(e, aL, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = zV(e), r = qx(e, At), i = qx(e, kt);
		if (wV(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			oL(e, "top", 0), oL(e, iL, 0);
			return;
		}
		if (n.length > 0) {
			let r = ic(n[n.length - 1]).bottom - ic(n[0]).top;
			if (r > 0) {
				let i = IV(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), RV(e, a > 1 ? (ic(n[n.length - 1]).top - ic(n[0]).top) / (a - 1) : r, i > 1 ? ic(n[1]).left - ic(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		oL(e, "top", a), oL(e, iL, o), Bz(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(MV));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = qx(e, Ot);
		return t !== null && t > 0 ? t : DV;
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
function IV(e) {
	let t = ic(e[0]).top, n = 1;
	for (; n < e.length && ic(e[n]).top === t;) n++;
	return n;
}
function LV(e) {
	return getComputedStyle(e).getPropertyValue(jV).trim() === "skeleton";
}
function RV(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(MV) !== i && r.setProperty(MV, i), r.getPropertyValue(NV) !== a && (a.length === 0 ? r.removeProperty(NV) : r.setProperty(NV, a));
}
function zV(e) {
	return [...e.children].filter((e) => e.hasAttribute(y));
}
function BV(e) {
	return zV(e).length;
}
function VV(e) {
	return e.getAttribute(y);
}
function HV(e) {
	let t = e.closest(S);
	return t === null ? [] : Pi(t, Ni(t));
}
//#endregion
//#region src/items/items-composite-renderer.ts
var UV = [
	v,
	ie,
	ae
];
function WV(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, GV(c, e.itemRole);
	let l = qV(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = KV(l, t, n, a);
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
		d.className = l.wrapperClassName, GV(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), fV(d, r, n), c.appendChild(d);
	}
	return fV(c, r, n), o.registerItemScope(c, l, n), c;
}
function GV(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function KV(e, t, n, r) {
	let i = _V(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function qV(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of UV) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), T(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function JV(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return YV(i.renderer.renderItem(e, t, n, r), a);
	let s = WV(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), YV(s, a);
}
function YV(e, t) {
	return e === null ? null : (t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), ko(e), e);
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var XV = 6, ZV = 60, QV = class {
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
		return r === void 0 || i < 0 || a < 0 ? null : r.slice(Math.min(i, a), Math.max(i, a) + 1).filter((e) => nH(e.entry) === !1).map((e) => e.entry.key);
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
		if (!oH(e) && !iH(e)) return a.element;
		let o = getComputedStyle(e), s = lH(o), c = r.projected.map((e) => this.pitchOf(r, e) + s), l = oH(e) ? sH(r.projected, c, r.across) : null, u = l === null ? i : aH(l.starts, i), d = l?.pitches ?? c, f = uH(o.paddingTop) + dH(d, 0, u), p = f + d[u] - s, m = tc(e), h = n === "start" || n === "nearest" && f < m.top ? f : n === "end" || p > m.top + m.height ? p - m.height : null;
		return h !== null && nc(e, Math.max(0, h)), this.layout(e, r), a.element;
	}
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = $z(e) && tB(e), r = t.projected;
		this.project(e, t), this.keepCursorShown(e, t, r), this.layout(e, t), n && !tB(e) && (nc(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: n, item: o } of t) {
			let t = r.get(n);
			if (r.delete(n), t !== void 0 && td(t.item, o)) {
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
		let n = Hl(t);
		t.remove(), Ul(e, null, n);
	}
	keepCursorShown(e, t, n) {
		let r = Vl(e), i = t.entries.find((e) => e.element?.hasAttribute("data-ui-row-focus") === !0) ?? null, a = i?.key ?? (r === null ? null : Gl(r));
		if (r === null || a === null) return;
		let o = /* @__PURE__ */ new Set();
		for (let e of t.projected) e.header || o.add(e.entry.key);
		if (o.has(a)) return;
		let s = n.filter((e) => !e.header).map((e) => e.entry), c = s.findIndex((e) => e.key === a), l = c < 0 ? void 0 : s.slice(c + 1).find((e) => o.has(e.key)) ?? s.slice(0, c).reverse().find((e) => o.has(e.key));
		if (i?.element?.removeAttribute(je), l === void 0) {
			r.removeAttribute(Me), r.removeAttribute("aria-activedescendant");
			return;
		}
		l.element instanceof HTMLElement ? dl(r, V(e).filter((e) => e instanceof HTMLElement), l.element, null, !1) : r.setAttribute(Me, l.key);
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
		let i = n.entries[r].element, a = Vl(e), o = V(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Rl(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = uV(a.item, n, r), n.length === 0 && a.element !== null && (this.dropRow(e, a.element), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = OS(e), i = this.options.templates.getGroupTemplate(t.componentId), a = MS(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => AS(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => rH(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => PS(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let { buckets: s, order: c } = eL(o, rH, t.groupOrder);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => PS(e.item, t.item, a))), e !== "" && l.push({
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
		let t = ec(e.target);
		t !== null && Gx(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && Gx(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, ZV));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = lH(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = oH(e) ? sH(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || iH(e)) && u > 0) {
			let i = uH(r.paddingTop), a = tc(e), o = eH(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - XV), f = Math.min(u, f + XV);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], ee = [], _ = -1, te = !1;
		for (let r = 0; r < o; r++) {
			let i = n[r];
			i.header || _++;
			let a = r >= p && r < m, o = (i.header ? t.headers.get(rH(i.entry)) ?? null : i.entry)?.element ?? null;
			if (!a) {
				o !== null && (this.dropRow(e, o), tH(t, i, null), te = !0);
				continue;
			}
			if (o !== null) {
				i.header && rL(o, i.entry.key), g.push(o), i.header || ee.push([o, _]);
				continue;
			}
			let s = i.header ? this.renderHeader(t, i.entry, h) : this.renderRow(t, i.entry, h);
			s !== null && (i.header || Wl(e, s), tH(t, i, s), g.push(s), i.header || ee.push([s, _]), te = !0);
		}
		let ne = new Set(g);
		for (let n of t.entries) n.element !== null && !ne.has(n.element) && (this.dropRow(e, n.element), n.element = null, te = !0);
		for (let t of V(e)) ne.has(t) || (this.dropRow(e, t), te = !0);
		for (let t of e.querySelectorAll(`:scope > [${pt}]`)) ne.has(t) || (t.remove(), te = !0);
		for (let e of t.headers.values()) e.element !== null && !ne.has(e.element) && (e.element = null);
		let re = dH(l, 0, d), v = dH(l, f, u);
		sL(e, [...g, ...sS(cS(e))]), oL(e, "top", re > 0 ? re - i : 0), oL(e, iL, v > 0 ? v - i : 0), lS(e, t.componentId, this.options.templates, this.options.renderer, o > 0), wV(e, ee, _ + 1), (te || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = cH(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return JV(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t, n) {
		let r = this.options.templates.getGroupTemplate(e.componentId);
		return r === void 0 ? null : nL(r, this.options.renderer, t.item, t.key, n);
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(rH(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = ic(o);
			s.height <= 0 || ($V(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(rH(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Hi(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of V(e)) {
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
function $V(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function eH(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (nc(e, a + l + o), a + l);
}
function tH(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = rH(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function nH(e) {
	let t = bS(e.item, "CanSelect");
	return t.ok && t.value === !1;
}
function rH(e) {
	let t = bS(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function iH(e) {
	let t = e.parentElement;
	return t !== null && (t.classList.contains("ui-table__scroll") || t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical"));
}
function aH(e, t) {
	let n = 0;
	for (; n + 1 < e.length && e[n + 1] <= t;) n++;
	return n;
}
function oH(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function sH(e, t, n) {
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
function cH(e, t, n) {
	let r = e.clientWidth - uH(t.paddingLeft) - uH(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = uH(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function lH(e) {
	return uH(e.rowGap);
}
function uH(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function dH(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var fH = "data-ui-template", pH = "default", mH = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? pH, r = this.findTemplate(e, n);
		return r === void 0 ? n === pH ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${fH}]`);
		for (let e of r) if (e.getAttribute(fH) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= hH(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, ut);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, dt);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function hH(e) {
	let t = /* @__PURE__ */ new Set();
	return To(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(S)) {
			let n = T(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function gH(e, t) {
	let n = e.querySelector(`style[${or}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(or, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var _H = "script[type='application/json'][data-ui-metadata]";
function vH(e = document) {
	let t = e.querySelector(_H);
	if (t === null) return yH();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return yH();
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
function yH() {
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
var bH = "script[type='application/json'][data-ui-hydration]";
function xH(e) {
	return e !== null && (Za(e.title) || Za(e.changes));
}
function SH(e = document) {
	let t = e.querySelector(bH)?.textContent?.trim() ?? "";
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
var CH = "reconnecting";
async function wH(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), CH;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function TH(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function EH(e, t, n) {
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
var DH = "/_ne/", OH = 3e3;
function kH(e, t, n) {
	let r = e.getAttribute(ir);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (EH(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => jH(i.ready);
	let a = i.register(r, { scope: DH }).then(AH).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function AH(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function jH(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), OH))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var MH = "ne-standard-ui:reloaded-view";
function NH(e, t, n) {
	if (!t) return "no-cookie";
	if (IH(n) === e) return "asked-again";
	try {
		n?.setItem(MH, e);
	} catch {}
	return "reload";
}
function PH(e) {
	try {
		e?.removeItem(MH);
	} catch {}
}
function FH() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function IH(e) {
	try {
		return e?.getItem(MH) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var LH = 2e3, RH = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? LH, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(fr, "reconnecting"), this.notice = this.notifications.show({
			message: E.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(fr));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(fr, "lost");
	}
}, zH = "/_ne/values", BH = 32768;
BH / 4;
var VH = 3e4;
function HH(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function UH(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function WH(e, t = null, n = VH) {
	if (e === void 0 || !UH(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${zH}/${encodeURIComponent(r)}${i}`, {
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
async function GH(e) {
	let t = await fetch(zH, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(VH)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/command-dispatcher.ts
var KH = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	staging = null;
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(qH(JH(e)));
	}
	async dispatchAsync(e) {
		let t = JH(e), n = qH(t);
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
		let t = HH(e.dynamicParameters);
		if (t === null && this.staging === null) return this.transport.processEventAsync(e);
		let n = this.staging, r = t === null ? null : GH(t), i = () => {}, a = new Promise((e) => {
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
function qH(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function JH(e) {
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
var YH = class {
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
async function XH(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var ZH = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && td(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = QH(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced($H([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(QH(e, t));
		let n = this.unplaced.get($H(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = QH(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode($H([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = $H(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, $H(t.slice(0, e - 1)));
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
		return `${w(e.componentId)}:${e.propertyId}:${eU(t)}`;
	}
};
function QH(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function $H(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function eU(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var tU = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, nU = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, rU = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, iU = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, aU = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, oU = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, sU = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, cU = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, lU = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, uU = class {
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
var dU = class {
	constructor() {}
	log(e, t) {}
};
dU.instance = new dU();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var fU = "10.0.11", J = class {
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
function pU(e, t) {
	let n = "";
	return hU(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${mU(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function mU(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function hU(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function gU(e, t, n, r, i, a) {
	let o = {}, [s, c] = bU();
	o[s] = c, e.log(q.Trace, `(${t} transport) sending data. ${pU(i, a.logMessageContent)}.`);
	let l = hU(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function _U(e) {
	return e === void 0 ? new yU(q.Information) : e === null ? dU.instance : e.log === void 0 ? new yU(e) : e;
}
var vU = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, yU = class {
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
function bU() {
	let e = "X-SignalR-User-Agent";
	return Y.isNode && (e = "User-Agent"), [e, xU(fU, SU(), wU(), CU())];
}
function xU(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function SU() {
	if (Y.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function CU() {
	if (Y.isNode) return process.versions.node;
}
function wU() {
	return Y.isNode ? "NodeJS" : "Browser";
}
function TU(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function EU() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var DU = class extends uU {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || Y.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(EU());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new rU();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new rU();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(q.Warning, "Timeout from HTTP request."), n = new nU();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, hU(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new tU(await OU(i, "text") || i.statusText, i.status);
		let a = await OU(i, e.responseType);
		return new lU(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return Y.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function OU(e, t) {
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
var kU = class extends uU {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new rU()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (hU(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new rU());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new lU(r.status, r.statusText, r.response || r.responseText)) : n(new tU(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(q.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new tU(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(q.Warning, "Timeout from HTTP request."), n(new nU());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, AU = class extends uU {
	constructor(e) {
		if (super(), typeof fetch < "u" || Y.isNode) this._httpClient = new DU(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new kU(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new rU()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, jU = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
jU.RecordSeparatorCode = 30, jU.RecordSeparator = String.fromCharCode(jU.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var MU = class {
	writeHandshakeRequest(e) {
		return jU.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (hU(e)) {
			let r = new Uint8Array(e), i = r.indexOf(jU.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(jU.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = jU.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, X;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(X ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var NU = class {
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
		return this.observers.push(e), new vU(this, e);
	}
}, PU = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			hU(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new FU(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, hU(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, FU = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, IU = 3e4, LU = 15e3, RU = 1e5, Z;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Z ||= {});
var zU = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(q.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, J.isRequired(e, "connection"), J.isRequired(t, "logger"), J.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? IU, this.keepAliveIntervalInMilliseconds = a ?? LU, this._statefulReconnectBufferSize = o ?? RU, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new MU(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Z.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: X.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new PU(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Z.Disconnecting, this._logger.log(q.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(q.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Z.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new rU("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new NU();
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
						this._logger.log(q.Error, `Invoke client method threw error: ${TU(e)}`);
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
							this._logger.log(q.Error, `Stream callback threw error: ${TU(e)}`);
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
		this._logger.log(q.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new rU("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Z.Disconnecting ? this._completeClose(e) : this._connectionState === Z.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Z.Connected && this._completeClose(e);
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
				this._logger.log(q.Error, `Stream 'error' callback called with '${e}' threw error: ${TU(t)}`);
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
}, BU = [
	0,
	2e3,
	1e4,
	3e4,
	null
], VU = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? BU : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, HU = class {};
HU.Authorization = "Authorization", HU.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var UU = class extends uU {
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
		e.headers ||= {}, this._accessToken ? e.headers[HU.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[HU.Authorization] && delete e.headers[HU.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, WU;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(WU ||= {});
var GU;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(GU ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var KU = class {
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
}, qU = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new KU(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, GU, "transferFormat"), this._url = e, this._logger.log(q.Trace, "(LongPolling transport) Connecting."), t === GU.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = bU(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === GU.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(q.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(q.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new tU(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(q.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(q.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(q.Trace, `(LongPolling transport) data received. ${pU(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(q.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(q.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new tU(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof nU ? this._logger.log(q.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(q.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(q.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? gU(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(q.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(q.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = bU();
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
			i ? i instanceof tU && (i.statusCode === 404 ? this._logger.log(q.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(q.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(q.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, JU = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, GU, "transferFormat"), this._logger.log(q.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== GU.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (Y.isBrowser || Y.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = bU();
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
						this._logger.log(q.Trace, `(SSE transport) data received. ${pU(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? gU(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, YU = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		J.isRequired(e, "url"), J.isRequired(t, "transferFormat"), J.isIn(t, GU, "transferFormat"), this._logger.log(q.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (Y.isNode || Y.isReactNative) {
				let t = {}, [r, i] = bU();
				t[r] = i, n && (t[HU.Authorization] = `Bearer ${n}`), o && (t[HU.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === GU.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(q.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(q.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(q.Trace, `(WebSockets transport) data received. ${pU(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(q.Trace, `(WebSockets transport) sending data. ${pU(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, XU = 100, ZU = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, J.isRequired(t, "url"), this._logger = _U(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (Y.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!Y.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : Y.isNode && !n.WebSocket && r && (n.WebSocket = r), !Y.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : Y.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new UU(n.httpClient || new AU(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= GU.Binary, J.isIn(e, GU, "transferFormat"), this._logger.log(q.Debug, `Starting connection with transfer format '${GU[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(q.Error, e), await this._stopPromise, Promise.reject(new rU(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(q.Error, e), Promise.reject(new rU(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new $U(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
				if (this._options.transport === WU.WebSockets) this.transport = this._constructTransport(WU.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new rU("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < XU);
				if (r === XU && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof qU && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(q.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(q.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = bU();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new sU("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof tU && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(q.Error, t), Promise.reject(new sU(t));
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
					if (this._logger.log(q.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new oU(`${n.transport} failed: ${e}`, WU[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(q.Debug, e), Promise.reject(new rU(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new cU(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case WU.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new YU(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case WU.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new JU(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case WU.LongPolling: return new qU(this._httpClient, this._logger, this._options);
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
		let i = WU[e.transport];
		if (i == null) return this._logger.log(q.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (QU(t, i)) {
			if (e.transferFormats.map((e) => GU[e]).indexOf(n) >= 0) {
				if (i === WU.WebSockets && !this._options.WebSocket || i === WU.ServerSentEvents && !this._options.EventSource) return this._logger.log(q.Debug, `Skipping transport '${WU[i]}' because it is not supported in your environment.'`), new iU(`'${WU[i]}' is not supported in your environment.`, i);
				this._logger.log(q.Debug, `Selecting transport '${WU[i]}'.`);
				try {
					return this.features.reconnect = i === WU.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(q.Debug, `Skipping transport '${WU[i]}' because it does not support the requested transfer format '${GU[n]}'.`), /* @__PURE__ */ Error(`'${WU[i]}' does not support ${GU[n]}.`);
		}
		return this._logger.log(q.Debug, `Skipping transport '${WU[i]}' because it was disabled by the client.`), new aU(`'${WU[i]}' is disabled by the client.`, i);
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
function QU(e, t) {
	return !e || (t & e) !== 0;
}
var $U = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new eW(), this._transportResult = new eW(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new eW(), this._transportResult.promise;
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
			this._sendBufferedData = new eW();
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
}, eW = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, tW = "json", nW = class {
	constructor() {
		this.name = tW, this.version = 2, this.transferFormat = GU.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = dU.instance);
		let n = jU.parse(e), r = [];
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
		return jU.write(JSON.stringify(e));
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
}, rW = {
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
function iW(e) {
	let t = rW[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var aW = class {
	configureLogging(e) {
		if (J.isRequired(e, "logging"), oW(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = iW(e);
			this.logger = new yU(t);
		} else this.logger = new yU(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new VU(e) : e : new VU(), this;
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
		let t = new ZU(this.url, e);
		return zU.create(t, this.logger || dU.instance, this.protocol || new nW(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function oW(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var sW = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, cW = class {
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
}, lW = 500;
function uW(e) {
	let { changes: t, ...n } = e;
	return n;
}
function dW() {
	return {};
}
var fW = class {
	windowId;
	connection;
	started = !1;
	gate = new cW();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new YH(t), this.connection = new aW().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, uW));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, uW));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, uW));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, dW, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new sW(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, dW));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), lW);
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
}, pW = Promise.resolve(), mW = () => {}, hW = BH * 3 / 4, gW = 128, _W = class {
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
		if (this.handed >= this.given) return pW;
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
		for (; this.flight !== null;) await this.flight.catch(mW);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = HH(e.value), i = r === null ? null : GH(r);
		return i?.catch(mW), new Promise((a, o) => {
			let s = yW(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? vW(e) : vW({
				...e,
				value: void 0
			}) + gW;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, bW(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof sW) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= hW);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => GH(e));
		return t.catch(mW), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function vW(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function yW(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function bW(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var xW = "form-owner", SW = "ui-form-";
function CW(e) {
	return SW + e.replace(/[ \t\n\f\r]/g, "_");
}
function wW(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = CW(t);
	EW(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function TW(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(SW) && EW(e);
	}
}
function EW(e) {
	let t = DW();
	if (t.querySelector(`form[id="${ei(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function DW() {
	let e = document.body.querySelector(`[${It}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(It, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var OW = document;
function kW() {
	try {
		return OW.execCommand("copy");
	} catch {
		return !1;
	}
}
function AW(e) {
	try {
		return typeof OW.execCommand == "function" && OW.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var jW = /* @__PURE__ */ new Map([
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
]), MW = [
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
function NW(e) {
	return $(e, MW);
}
var PW = [
	"small",
	"medium",
	"large"
], FW = ["default", "circle"], IW = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], LW = [
	"start",
	"center",
	"end",
	"justify"
], RW = ["nowrap", "wrap"], zW = /* @__PURE__ */ new Map([
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
]), BW = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), VW = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), HW = ["inline", "trailing"], UW = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], WW = [
	"small",
	"medium",
	"large"
], GW = [
	"small",
	"medium",
	"large"
], KW = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], qW = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], JW = [
	"filled",
	"tinted",
	"outline"
], YW = ["light", "dark"], XW = [
	"start",
	"center",
	"end",
	"stretch"
], ZW = ["clip", "visible"], QW = [
	"visible",
	"hidden",
	"collapsed"
], $W = [
	"background",
	"raised",
	"tinted"
], eG = ["horizontal", "vertical"], tG = [
	"none",
	"gap",
	"rule"
], nG = [
	"none",
	"one",
	"many"
], rG = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], iG = ["stack", "wrap"], aG = ["end", "start"], oG = [
	"disabled",
	"auto",
	"always"
], sG = [
	"disabled",
	"proximity",
	"mandatory"
], cG = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], lG = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], uG = ["hex", "rgb"], dG = ["field", "swatch"], fG = [
	"fill",
	"contain",
	"cover",
	"none"
], pG = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], mG = ["default", "circle"], hG = ["uniform", "vignette"], gG = ["linear", "circular"], _G = [
	"none",
	"vertical",
	"horizontal",
	"both"
], vG = [
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
], yG = [
	"None",
	"Shade",
	"Tint"
], bG = /* @__PURE__ */ new Map();
function xG(e) {
	return bG.get(e);
}
function Q(e, t, n) {
	return wG(e, SG(t, n), (e) => `${t}${$(e, n)}`);
}
function SG(e, t) {
	return CG(t.map((t) => `${e}${t}`));
}
function CG(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function wG(e, t, n) {
	return bG.set(e, t), [e, n];
}
function TG(e, t, n) {
	return Id.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var EG = new Map([
	Q("colorClass", "ui-color--", MW),
	wG("themeColorClass", SG("ui-color--", MW), (e) => lK(e)),
	wG("iconClass", hg, (e) => gg(e)),
	["iconUrlCss", (e) => cg(e)],
	["safeUrl", (e) => Jh(e)],
	["safeImageSource", (e) => rg(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : xk(String(e))],
	["ariaBooleanAttribute", (e) => e === !0 ? "true" : "false"],
	["placeholderText", (e) => typeof e == "string" && e.length > 0 ? e : " "],
	Q("iconSizeClass", "ui-icon-size--", PW),
	wG("iconShapeClass", CG(["ui-icon--circle"]), (e) => $(e, FW) === "circle" ? "ui-icon--circle" : ""),
	Q("textTypeClass", "ui-text-type--", IW),
	wG("textAppearanceClass", SG("ui-text-type--", IW), (e) => vK(e, "ui-text-type--")),
	wG("textDescriptionTypeClass", SG("ui-text--description-", IW), (e) => vK(e, "ui-text--description-")),
	Q("textAlignmentClass", "ui-text--align-", LW),
	Q("textWrapClass", "ui-text--", RW),
	Q("buttonAlignmentClass", "ui-button--align-", LW),
	Q("textBadgePlacementHostClass", "ui-text--badge-", HW),
	Q("badgeStyleClass", "ui-badge-style--", qW),
	Q("badgeFillClass", "ui-badge-fill--", JW),
	wG("badgeColoredClass", CG(["ui-badge--colored"]), (e) => tK(e).length > 0 ? "ui-badge--colored" : ""),
	["badgeTextFit", (e) => uK(e)],
	Q("buttonClass", "ui-button--", KW),
	Q("surfaceStyleClass", "ui-surface--", $W),
	Q("orientationClass", "ui-orientation--", eG),
	Q("groupSeparatorClass", "ui-command-bar--separator-", tG),
	["selectionModeAttribute", (e) => $(e, nG)],
	["selectionBackgroundCss", (e) => tK(QG(e, "background"))],
	["selectionForegroundCss", (e) => tK(QG(e, "foreground"))],
	["selectionMarkColorCss", (e) => tK(QG(e, "markColor"))],
	["selectionMarkCss", (e) => eK(QG(e, "mark"))],
	["selectionFontWeightCss", (e) => $G(QG(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => tK(QG(e, "actionBarBackground"))],
	Q("itemsViewLayoutClass", "ui-items-view--", iG),
	Q("dragHandlePlacementClass", "ui-drag-handle--", aG),
	Q("scrollXClass", "ui-scroll-x--", oG),
	Q("scrollYClass", "ui-scroll-y--", oG),
	["hostViewport", (e) => VG(e)],
	Q("scrollSnapClass", "ui-scroll-snap--", sG),
	Q("inputAppearanceClass", "ui-input--", UW),
	Q("inputSizeClass", "ui-input--", GW),
	Q("buttonSizeClass", "ui-button--", WW),
	Q("buttonGroupSizeClass", "ui-button-group--", WW),
	["textInputTypeAttribute", (e) => $(e, cG)],
	["inputModeAttribute", (e) => $(e, lG)],
	["colorTextFormatAttribute", (e) => $(e, uG)],
	["colorInputVariantAttribute", (e) => $(e, dG)],
	["themeNameCss", (e) => $(e, YW)],
	["alignmentCss", (e) => $(e, XW)],
	["alignmentStretchFallbackCss", (e) => $(e, XW) === "stretch" ? "start" : ""],
	["overflowCss", (e) => $(e, ZW)],
	["layoutLengthCss", (e) => HG(e)],
	["thicknessCss", (e) => GG(e)],
	wG("borderNoneClass", CG(["ui-border--none"]), (e) => qG(e)),
	["radiusCss", (e) => JG(e)],
	["gridUnitCss", (e) => YG(e)],
	["pixelsCss", (e) => OK(e)],
	["gridTemplateCss", (e) => XG(e)],
	["colorVariantCss", (e) => SK(e)],
	["themeColorCss", (e) => tK(e)],
	["themeInkCss", (e) => rK(e)],
	["roleInkCss", (e) => iK(e)],
	["themeOnColorCss", (e) => oK(e)],
	["themeColorInlineCss", (e) => nK(e) ? "" : tK(e)],
	["themeColorCanonical", (e) => bK(e)],
	["textAppearanceFontSizeCss", (e) => yK(e, "size")],
	["textAppearanceFontWeightCss", (e) => yK(e, "weight")],
	["textAppearanceLineHeightCss", (e) => yK(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => yK(e, "letterSpacing")],
	...TG("responsiveLayoutLength", "Css", (e, t) => HG(Ud(e, t))),
	...TG("responsiveWidth", "Css", (e, t) => UG(Ud(e, t), "horizontal")),
	...TG("responsiveHeight", "Css", (e, t) => UG(Ud(e, t), "vertical")),
	...TG("responsiveThickness", "Css", (e, t) => GG(Ud(e, t))),
	...TG("responsiveThicknessHorizontal", "Css", (e, t) => KG(Ud(e, t), "horizontal")),
	...TG("responsiveThicknessVertical", "Css", (e, t) => KG(Ud(e, t), "vertical")),
	...TG("responsiveRadius", "Css", (e, t) => JG(Ud(e, t))),
	...TG("responsivePixels", "Css", (e, t) => kK(Ud(e, t))),
	...TG("visibility", "Attribute", (e, t) => AK(e, t)),
	...TG("gridPlacement", "ColumnCss", (e, t) => ZG(Ud(e, t), "column")),
	...TG("gridPlacement", "RowCss", (e, t) => ZG(Ud(e, t), "row")),
	...TG("gridPlacement", "ColumnSpanCss", (e, t) => ZG(Ud(e, t), "columnSpan")),
	...TG("gridPlacement", "RowSpanCss", (e, t) => ZG(Ud(e, t), "rowSpan")),
	Q("imageFitClass", "ui-image-fit--", fG),
	wG("imageShapeClass", CG(["ui-image--circle"]), (e) => $(e, mG) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => jG(e)],
	["backgroundImageAttribute", (e) => jG(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => $(e, pG)],
	["backgroundImageDimCss", (e) => MG(e)],
	["backgroundImageDimModeAttribute", (e) => $(e, hG) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => IG(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => IG(e) ? "" : void 0],
	["positiveCount", (e) => NG(e)?.toString()],
	["nonNegativeCount", (e) => PG(e, (e) => e >= 0)?.toString()],
	["nonZeroCount", (e) => PG(e, (e) => e !== 0)?.toString()],
	["positiveNumber", (e) => FG(e, (e) => e > 0)?.toString()],
	["nonNegativeNumber", (e) => FG(e, (e) => e >= 0)?.toString()],
	["positiveFlagAttribute", (e) => NG(e) === void 0 ? void 0 : ""],
	wG("maxLinesClass", CG(["ui-text--max-lines"]), (e) => NG(e) === void 0 ? "" : "ui-text--max-lines"),
	Q("progressVariantClass", "ui-progress--", gG),
	["progressValueText", (e) => DK(e)],
	["textAreaResizeCss", (e) => $(e, _G)],
	Q("flyoutPlacementClass", "ui-flyout--", vG),
	["popupPlacementAttribute", (e) => $(e, vG)],
	["tabMenuEntriesAttribute", (e) => kG(e)],
	["markedDaysAttribute", (e) => AG(e)]
]);
function DG(e) {
	let t = EG.get("surfaceStyleClass");
	return $W.find((n, r) => e.classList.contains(t?.(r) ?? "")) ?? null;
}
var OG = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function kG(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = OG.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function AG(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function jG(e) {
	return cg(e);
}
function MG(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function NG(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function PG(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(n) && t(n) ? n : void 0;
}
function FG(e, t) {
	let n = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(n) && t(n) ? n : void 0;
}
function IG(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var LG = [
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
], RG = new Map(LG.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), zG = new Map(LG.map(([e, t]) => [e, t])), BG = /* @__PURE__ */ new Map([[ZW, /* @__PURE__ */ new Map([["Hidden", "clip"]])], [pG, /* @__PURE__ */ new Map([["Fill", "100% 100%"], ["None", "auto"]])]]);
function $(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : BG.get(t)?.get(e)) ?? jW.get(e) ?? ti(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function VG(e) {
	return e == null || $(e, oG) === "disabled" ? void 0 : "parent";
}
function HG(e) {
	if (e == null) return "";
	if (typeof e == "number") return OK(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? OK(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function UG(e, t) {
	if (typeof e != "object" || !e) return HG(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? HG(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function WG(e) {
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
function GG(e) {
	if (e == null) return "";
	let t = WG(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function KG(e, t) {
	let n = WG(e);
	return n === void 0 ? "" : OK(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function qG(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return Id.map((t) => Ud(e, t)).filter((e) => e != null).every((e) => qG(e) !== "") ? "ui-border--none" : "";
	let t = WG(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function JG(e) {
	if (e == null) return "";
	if (typeof e == "number") return OK(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? OK(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function YG(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return OK(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function XG(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return YG(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return YG(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${YG(e[0])})` : e.map((e) => YG(e)).join(" ");
}
function ZG(e, t) {
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
function QG(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function $G(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function eK(e) {
	if (e == null) return "";
	switch ($(e, rG)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function tK(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (xK(e)) return SK(e);
	let t = e, n = SK(t.light), r = SK(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = zW.get($(o, MW));
	return s ? `var(${s})` : "";
}
function nK(e) {
	if (typeof e != "object" || !e || xK(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function rK(e) {
	if (nK(e)) {
		let t = BW.get($(e.style, MW));
		if (t !== void 0) return `var(${t})`;
	}
	return tK(e);
}
function iK(e) {
	if (typeof e != "object" || !e || xK(e)) return "";
	let t = e;
	return t.light == null && t.dark == null ? rK(e) : "";
}
var aK = /* @__PURE__ */ new Set(["background", "surface"]);
function oK(e) {
	if (typeof e != "object" || !e) return "";
	if (xK(e)) return sK(e) ? "initial" : cK(e);
	let t = e, n = cK(t.light ?? t.dark), r = cK(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && sK(t.light ?? t.dark) && sK(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = $(t.style, MW);
	if (aK.has(i)) return "initial";
	let a = VW.get(i);
	return a ? `var(${a})` : "";
}
function sK(e) {
	return CK(e)?.[3] === 0;
}
function cK(e) {
	let t = CK(e);
	return t === void 0 ? "" : aF(t[0], t[1], t[2], t[3]);
}
function lK(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${$(n, MW)}`;
}
function uK(e) {
	let t = mK(e == null ? "" : String(e).trim(), dK + 1);
	return t > 0 && t <= dK ? "compact" : "";
}
var dK = 2, fK = /[\u0300-\uFFFF]/, pK = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function mK(e, t) {
	if (!fK.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of pK.segment(e)) {
		if (n >= t) break;
		n += hK(r) ? 2 : 1;
	}
	return n;
}
function hK(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < gK.length; e += 2) if (t >= gK[e] && t <= gK[e + 1]) return !0;
	return !1;
}
var gK = [
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
function _K(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ve, uK(n)), e.setAttribute(He, "");
}
function vK(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size != null) return "";
	let r = n.role;
	return r == null ? "" : `${t}${$(r, IW)}`;
}
function yK(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return OK(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : OK(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : OK(e);
		}
		default: return "";
	}
}
function bK(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = wK(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${iF(r.rgb >> 16 & 255)}${iF(r.rgb >> 8 & 255)}${iF(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${iF(e)}`;
	}
	let i = TK(r.name);
	return i === null ? "" : `${i}/${EK(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function xK(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function SK(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = CK(e);
	return t === void 0 ? "" : `#${iF(t[0])}${iF(t[1])}${iF(t[2])}${iF(t[3])}`;
}
function CK(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = TK(t.name), i = n ?? (r === null ? void 0 : RG.get(r));
	if (!i) return;
	let a = EK(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = G(c * (1 - o)), l = G(l * (1 - o)), u = G(u * (1 - o))) : a === "Tint" && (c = G(c + (255 - c) * o), l = G(l + (255 - l) * o), u = G(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function wK(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = MW[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function TK(e) {
	if (typeof e == "number") return zG.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function EK(e) {
	if (typeof e == "number") return yG[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function DK(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function OK(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function kK(e) {
	return e == null ? "" : OK(e);
}
function AK(e, t) {
	let n = Wd(e, t);
	if (n == null) return;
	let r = $(n, QW);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var jK = "ui-announcer", MK = 7e3, NK = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : E.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), MK), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${jK}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = jK, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, PK = "ui-notification-host", FK = "ui-notification", IK = "ui-notification--leaving", LK = "ui-notification__message", RK = "ui-notification__title", zK = "ui-notification__action", BK = "ui-notification__close", VK = 5e3, HK = 8e3, UK = "ui-notification--connection", WK = "--ui-notification-lift", GK = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), KK = class {
	root;
	components;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.components = e.dom ?? null, this.durationMs = e.durationMs ?? VK, this.ensureHost(), this.announcer = new NK(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = NW(e.severity), n = document.createElement("div");
		n.className = GK.has(t) ? `${FK} ${FK}--${t}` : FK, n.classList.toggle(UK, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = LK, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = RK, E.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : E.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = BK, E.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(XK(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("keydown", (e) => {
			e.key !== "Escape" || e.defaultPrevented || A(e) || (e.preventDefault(), this.dismiss(n));
		}), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), qK(() => {
			if (n.classList.contains(IK)) return;
			let t = this.ensureHost();
			JK(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : HK, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(IK) && (e.classList.add(IK), e.isConnected)) {
			if (this.returnFocus(e), Nd() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => YK(e), R.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(IK));
		Fu(ju(this.focusOrigins.get(e), this.components) ?? t?.querySelector(`.${BK}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${PK}`), n = t ?? document.createElement("div");
		return n.classList.add(PK), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function qK(e) {
	if (gR(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		gR(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function JK(e) {
	let t = window.innerHeight - Uf(window.innerHeight);
	t > 0 ? e.style.setProperty(WK, `${Math.round(t)}px`) : e.style.removeProperty(WK);
}
function YK(e) {
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
function XK(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${zK} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : E.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function ZK(e, t) {
	let n = QK(e), r = e?.label;
	if (n !== void 0) {
		if (!qa(r) && !Ja(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function QK(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function $K(e, t, n) {
	let r = e.itemKey === !0 ? eq(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = tq(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	nq(i, r);
}
function eq(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function tq(e) {
	if (Ms(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Ms(t)) return t;
	return null;
}
function nq(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || D(e) || k(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && AW(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function rq(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : iq(t, e.request?.parameters ?? null);
}
function iq(e, t) {
	let n = aq(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function aq(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, oq(e));
	return t.toString();
}
function oq(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function sq(e, t) {
	let n = lq([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return lq(r, t) ?? cq(t);
}
function cq(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && uq(t, e) ? t : null;
}
function lq(e, t) {
	let n = null;
	for (let r of e) if (kO(r, t)) {
		if (uq(r, t)) return r;
		n ??= r;
	}
	return n;
}
function uq(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var dq = class {
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
		this.handlers.set(bi(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = bi(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = rq(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Zh(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = wi(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(ar, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = gq(e);
			t !== null && (Yz(t), vq(t));
		}), this.register("ScrollTo", (e) => {
			let t = gq(e);
			if (t === null) return;
			let n = e.effect, r = xi(n.behavior), i = Si(n.block);
			Yz(t), t.scrollIntoView({
				behavior: _q(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = gq(e);
			if (t === null) return;
			let n = e.effect, r = Fz(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Si(n.block);
			Yz($s(r)), Iz(r, n.key, i === "Unknown" ? "Start" : i, _q(xi(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = gq(e);
			if (t === null) return;
			let n = e.effect, r = Ti(n.axis) !== "Horizontal", i = sq(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Ci(n.position), u;
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
			let d = _q(xi(n.behavior));
			Yz(i), r && l === "End" && $z(i) && Jz(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			hq(gq(e), null);
		}), this.register("Hide", (e) => {
			hq(gq(e), "hidden");
		}), this.register("Collapse", (e) => {
			hq(gq(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = yq(e, this.valueReaders);
			t !== null && bq(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = gq(e);
			t !== null && $K(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = gq(e);
			t !== null && !bh(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!qh(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!qa(t.message) && !Ja(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : ZK(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			_R() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!qa(t.message) && !Ja(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Ei(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!qa(t) && !Ja(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = qa(e.body) || Ja(e.body) ? e.body : void 0, r = typeof e.address == "string" && Zh(e.address) ? e.address : void 0, i = () => {
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
		if (e.when !== "Always" && gR(document.visibilityState)) {
			i();
			return;
		}
		let a = QK(e.action);
		SR({
			title: fq(t),
			body: n === void 0 ? void 0 : fq(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Zh(e.icon) ? e.icon : pq(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: r ?? mq(),
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
		return t !== void 0 && n !== void 0 && wR(t) ? {
			label: qa(e.addressLabel) || Ja(e.addressLabel) ? e.addressLabel : { key: "ui.notification.open" },
			run: () => n(t)
		} : this.runAction === void 0 ? void 0 : ZK(e.action, this.runAction);
	}
};
function fq(e) {
	return qa(e) ? E.translate(e.key, e.args) : Ja(e) ? E.resolveText(e.text) : "";
}
function pq() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function mq() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function hq(e, t) {
	if (e === null) return;
	let n = ad();
	for (let n of Er) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
	n !== null && od(n);
}
function gq(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(w(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function _q(e) {
	return e === "Smooth" && !Nd() ? "smooth" : "auto";
}
function vq(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Jl))) {
		e.focus();
		return;
	}
	let t = gu(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function yq(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = gq(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Jo(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : Ho(t.readHeld(r));
}
async function bq(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!xq(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function xq(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return kW();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var Sq = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = gu(t), i = lu() && Ms(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Ou(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), Cq(t) && this.swipes.set(e, Pp(n, n, () => this.closeFromViewer(e))), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), this.swipes.get(e)?.(), this.swipes.delete(e), t.contains(document.activeElement) && Fu(ju(n, this.components), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Xf}="${ei(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Qf}]`);
		if (n === null) return;
		let r = n.closest(`[${Xf}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Xf);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || A(e)) return;
		let t = this.getTopmostOpen();
		if (!(t === null || ap(t))) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !dp() && !Cs(e)) {
				let n = t.getAttribute(Xf);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && xu(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(S)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return rp(this.root);
	}
};
function Cq(e) {
	return e.getAttribute("data-ui-dialog-placement") === "bottom" && (e.hasAttribute("data-ui-dialog-close-backdrop") || e.hasAttribute("data-ui-dialog-close-escape"));
}
//#endregion
//#region src/interactions/leave-dialog.ts
var wq = "ui-leave", Tq = new Ng("data-ui-leave-part"), Eq = "560px", Dq = null, Oq = null;
function kq(e, t) {
	Dq ??= Aq();
	let n = Dq;
	n.isConnected || document.body.append(n), jq(n, "title", E.text("ui.leave.title")), jq(n, "message", E.text("ui.leave.message")), jq(n, "stay", E.text("ui.leave.stay")), jq(n, "leave", E.text("ui.leave.confirm")), Oq = {
		dialogs: e,
		leave: t
	}, e.open(wq);
}
function Aq() {
	let { dialog: e, surface: t } = Mg({
		key: wq,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", Eq);
	let n = Tq.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = Tq.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, Tq.actions(Tq.button("ui-button--outline", "stay"), Tq.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = Tq.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = Oq;
		Oq = null, n?.dialogs.close(wq), t === "leave" && n?.leave();
	}), e;
}
function jq(e, t, n) {
	let r = Tq.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var Mq = class {
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
		let t = Nq(e, this.options.window.location.href);
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
function Nq(e, t) {
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
	return Zh(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var Pq = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(iq(this.route, e), !1);
	}
	push(e) {
		let t = iq(this.route, e), n = this.window.location;
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
		e.search !== this.search && (this.search = e.search, this.revisit(Fq(e.search)));
	}
};
function Fq(e) {
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
var Iq = class {
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
		!this.state.set(e, t, n, Rq(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Eo(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(qe), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, Rq(r[0]?.component)) ? {
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
			(typeof n == "string" || Ja(n) ? this.addressResolver.isTranslatable(t.reference) : qa(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = `[${Ke}${ti(r.propertyName)}]`;
		this.applyOperations(r, this.shownValue(t, n), (t) => ii(e, t, () => Lq(e, i)));
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
			Zo(e);
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
function Lq(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(S) === e) return [n];
	return [e];
}
function Rq(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(S) ?? null, r = e === null ? 0 : T(e), i = n.getAttribute(y);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Pi(e, Ni(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var zq = "EndValue", Bq = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	edits;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, this.edits = t, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Ru) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = w(e.componentId), r = Hq(n, e.propertyId), i = this.watchers.get(r);
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
		let t = this.edits?.root.querySelector(`[data-ui-id="${w(e.componentId)}"]`) ?? null, n = t === null ? null : Vq(e, this.edits?.metadata) ? t.querySelector(`[${_t}]`) : Jo(t);
		this.edits !== void 0 && n !== null && this.propertyPatchEngine.recordValue(e, [], this.edits.valueReaders.readBound(n));
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = Vi(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(_t);
		for (let e of r) {
			if (t.metadata !== void 0 && Vq(e, t.metadata) !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = Hq(w(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function Vq(e, t) {
	return t?.getPropertyDefinition(e.propertyId)?.propertyName === zq;
}
function Hq(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function Uq(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : T(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var Wq = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, Gq(t));
	}
	apply(e) {
		let t = w(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), _i(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) Kq(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) qq(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) Jq(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) Yq(n, t.key, t.newIndex);
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
function Gq(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function Kq(e, t) {
	typeof t.key == "string" && (qq(e, t.key), e.splice(Xq(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function qq(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function Jq(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		Kq(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function Yq(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(Xq(n, e.length), 0, i);
}
function Xq(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var Zq = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, Qq(e, "", t.map((e) => e.split("."))));
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
function Qq(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : Qq(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function $q(e) {
	let t = new Zq();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(w(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var eJ = class {
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
}, tJ = class {
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
function nJ(e, t) {
	let n = rJ(e[t], "Reset");
	if (n === null) return null;
	let r = w(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = rJ(e[s], "Insert");
		if (t === null || w(t.component?.id) !== r || !td(i, t.component?.dynamicParameters ?? [])) break;
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
function rJ(e, t) {
	if (e === void 0 || yi(e) !== "CollectionChange") return null;
	let n = e;
	return _i(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var iJ = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function aJ(e, t, n, r) {
	return {
		action: _i(e.action),
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
var oJ = [], sJ = class {
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
	held = new Wq();
	projections;
	moves = new eJ({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new tJ({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => pJ(V(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = $q(e), this.projections.isEmpty || pS((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${b}]`)) {
			let e = Vi(n);
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
			return n === void 0 && (n = mJ(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = Hi(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (yi(t) !== "CollectionChange") continue;
			let e = t;
			if (_i(e.action) !== "Insert") continue;
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
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, fJ(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of Uq(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${b}]`)) {
			let t = Vi(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = Vi(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		pL(e, t, {
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
		let n = u() ? performance.now() : -1, r = ad();
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = nJ(t, e);
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
		r !== null && od(r), n >= 0 && d(`applied ${t.length} server update(s)`, n);
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
		this.transfers.around(e, () => this.moves.around(e, oJ, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (Gx(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = mJ(e), i = [], a = [], o = null;
		for (let e of t.items) {
			let c = e.key ?? null;
			if (c === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let l = r.get(c) ?? null;
			if (r.delete(c), l !== null && td(this.readItemValue(l), e.item)) {
				i.push(l);
				continue;
			}
			let u = this.renderItemElement(t.componentId, e.item, c, n);
			if (l !== null) {
				let e = Hl(l);
				e !== null && u !== null && (o = {
					row: u,
					held: e
				}), l.remove(), a.push(c);
			}
			u !== null && i.push(u);
		}
		let c = Gx(e) === "windowed";
		for (let [t, n] of r) {
			let r = c ? Hl(n) : null;
			n.remove(), Ul(e, null, r), a.push(t);
		}
		if (this.state.forgetRows(t.componentId, t.dynamicParameters, a), dJ(e, i), o !== null && Ul(e, o.row, o.held), c) for (let t of i) Wl(e, t);
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
		switch (yi(e)) {
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
		let t = w(e.address?.component?.id), n = vi(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, aJ(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (_i(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = _i(e.action) === "Move" ? lJ(e.moves ?? []) : oJ;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (Gx(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (_i(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				cJ(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				uJ(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), qS(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = Vi(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = Gx(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : VS(e, V(e)).findIndex((e) => e.getAttribute(y) === t);
		return n < 0 ? null : n + Kx(e);
	}
	moveRow(e, t, n) {
		let r = Vi(e);
		if (r === null) return;
		let i = Math.max(0, n - Kx(e));
		Gx(e) === "virtualized" ? this.virtualization.move(e, t, i) : uJ(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = V(e), r = pJ(n, t);
		if (r === null) return null;
		let i = VS(e, n), a = i.indexOf(r);
		return WS(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = VS(e, V(e));
		SC(t.element), e.insertBefore(t.element, US(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = Vi(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, US(VS(e, V(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		WS(VS(e, V(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (_i(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (_i(t.action)) {
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
			let e = Fz(r);
			e !== null && n.push(e);
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = VS(e, V(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && (e.insertBefore(o, US(i, o, a.index ?? null)), Wl(e, o));
		}
	}
	renderItemElement(e, t, n, r) {
		return JV(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = V(e), a = VS(e, i), o = mJ(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			if (l !== null) {
				if (o.delete(i.oldKey ?? n), o.set(n, l), c !== null) {
					let t = Hl(c);
					KS(a, c, l), c.replaceWith(l), Ul(e, l, t);
				} else e.insertBefore(l, US(a, l, i.index ?? null));
			}
		}
	}
};
function cJ(e, t) {
	let n = V(e), r = VS(e, n), i = mJ(e, n), a = Vl(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? Rl(a, o, n) : null;
		i.delete(t), WS(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function lJ(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function uJ(e, t) {
	let n = V(e), r = VS(e, n), i = mJ(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = GS(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function dJ(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? V(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function fJ(e) {
	let t = T(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : T(n);
}
function pJ(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function mJ(e, t = V(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(y);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function hJ(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return qa(n) || Ja(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: _J(t.severity)
	} : void 0;
}
function gJ(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = E.resolve(qa(t) || Ja(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function _J(e) {
	let t = mi(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var vJ = "ui-validation--warning", yJ = "ui-validation--info", bJ = "ui-validation-message--marker", xJ = "top-end", SJ = "right", CJ = "--ui-validation-marker-host", wJ = "ui-validation-mark", TJ = "--ui-validation-presentation", EJ = "--ui-validation-color", DJ = "Validation", OJ = /* @__PURE__ */ new Set(["Value", "EndValue"]), kJ = /* @__PURE__ */ new Set(["Min", "Max"]), AJ = `input:not([type='hidden']), textarea, select, .${zr}[role='combobox'], [role='spinbutton']`, jJ = {
	Error: 0,
	Warning: 1,
	Info: 2
}, MJ = {
	Error: Zr,
	Warning: vJ,
	Info: yJ
}, NJ = `.${Zr}, .${vJ}, .${yJ}`, PJ = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, FJ = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, IJ = {
	Error: `${wJ}--error`,
	Warning: `${wJ}--warning`,
	Info: `${wJ}--info`
}, LJ = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, RJ = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(NJ)), z(this.root, NJ, { childList: !0 }, (e) => this.applyRenderedMessages(e)), E.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(NJ)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), E.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(NJ)) {
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
			UJ(t, VJ(t) === "Error");
			let e = t.querySelector(`:scope > [${Qr}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), WJ(this.markerMirrors, t, e, {
				message: n,
				severity: VJ(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(T(e), e) !== void 0)) return;
		let n = So(t), r = VJ(e);
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
		if (e.propertyName === DJ) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = OJ.has(e.propertyName), n = kJ.has(e.propertyName);
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
		let t = w(e.reference.componentId), n = hJ(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = w(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => pi(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = w(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = qa(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: _J(e.severity),
			content: e.content === !0,
			property: vi(e.address?.property)
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
		let n = k(t) || D(t) ? null : zJ(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return BJ(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
	}
	readRuleValue(e) {
		let t = Jo(e);
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
			severity: LJ[t]
		}), this.applyCurrentState(T(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(T(e))) if (_J(r.severity) === "Error" && bd(t, r.operator, r.value) && !bd(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !bd(t, r.operator, r.value) && (n === null || jJ[_J(r.severity)] < jJ[_J(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: FJ[_J(n.severity)],
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
		HJ(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(gJ).join("\n"), !0);
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
			severity: _J(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || jJ[e.severity] < jJ[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => pi(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.readRuleValue(n.element));
	}
	runSubmitValidation(e) {
		let t = !0, n = /* @__PURE__ */ new Set();
		for (let { component: r } of this.formFields(e)) {
			if (n.has(r.element)) continue;
			n.add(r.element);
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => pi(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.readRuleValue(r.element))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${Ft}="${ei(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(AJ)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Nd() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && _J(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) bd(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function zJ(e, t) {
	return Rx(e, t) ?? (e.matches(rw) ? Zw(e) : null);
}
function BJ(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : qa(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function VJ(e) {
	return e.classList.contains(vJ) ? "Warning" : e.classList.contains(yJ) ? "Info" : "Error";
}
function HJ(e, t, n) {
	for (let e of Object.values(MJ)) t.classList.toggle(e, n !== void 0 && MJ[n.severity] === e);
	UJ(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(EJ) : r.style.setProperty(EJ, `var(--ui-color-${PJ[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (bo(i, null), i.textContent = String(n.message ?? "")) : E.writeValue(i, null, n?.message ?? null), WJ(e, r, i, n));
}
function UJ(e, t) {
	for (let n of e.querySelectorAll(AJ)) {
		let r = n.closest(Rr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function WJ(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(TJ).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(bJ, o), GJ(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(CJ).trim()), r !== void 0 && o) {
		n.setAttribute(Ie, n.textContent ?? ""), n.setAttribute(Le, xJ), n.setAttribute(ze, FJ[r.severity]), t.setAttribute(Re, ""), t.contains(document.activeElement) ? nj(n) : rj(n);
		return;
	}
	n.removeAttribute(Ie), n.removeAttribute(Le), n.removeAttribute(ze), t.removeAttribute(Re), rj(n);
}
function GJ(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : qJ(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && KJ(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${wJ} ${IJ[n.severity]}`, s.textContent = r, s.setAttribute(Ie, r), s.setAttribute(Le, SJ), s.setAttribute(ze, FJ[n.severity]), s.setAttribute(Be, ""), s.parentElement !== o && (KJ(s), o.append(s)), o.setAttribute(Re, ""), e.set(t, s), rj(s);
}
function KJ(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${wJ}`) === null && t.removeAttribute(Re);
}
function qJ(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var JJ = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, YJ = "card-header-shown", XJ = `[${Wr}], [${Gr}], [${Kr}], [${qr}], [${Jr}]`;
function ZJ(e) {
	let t = e.parentElement?.parentElement;
	if (t == null || !t.classList.contains("ui-card__header")) return;
	let n = !e.matches(XJ);
	t.classList.contains("ui-card__header--empty") !== n && t.classList.toggle(Yr, n);
}
//#endregion
//#region src/updates/content-fills.ts
var QJ = "content-fills", $J = "content", eY = "data-ui-root", tY = "--ui-height", nY = "var(--ui-fill-height";
function rY(e) {
	let t = e.parentElement;
	if (t === null || t.getAttribute("data-ui-region") !== $J) return;
	let n = t.parentElement;
	if (n === null || !n.hasAttribute(eY)) return;
	let r = e.style.getPropertyValue(tY).trimStart().startsWith(nY);
	n.hasAttribute("data-ui-content-fills") !== r && n.toggleAttribute(en, r);
}
//#endregion
//#region src/updates/menu-surface.ts
var iY = "menu-surface";
function aY(e) {
	let t = e.parentElement;
	if (t === null || !t.matches(".ui-context-menu, .ui-split-button__menu")) return;
	let n = DG(e);
	n === null ? t.removeAttribute(Kt) : t.getAttribute("data-ui-menu-surface") !== n && t.setAttribute(Kt, n);
}
//#endregion
//#region src/updates/tooltip-name.ts
var oY = "tooltip-name";
function sY(e, t, n) {
	let r = xk(e.getAttribute(Ie));
	if (bo(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var cY = /* @__PURE__ */ new WeakMap(), lY = /* @__PURE__ */ new WeakMap(), uY = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(hi(e), t);
	}
	apply(e) {
		let t = hi(e.operation.kind), n = this.handlers.get(t);
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
			let t = Ho(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), bo(e.target, null);
		}), this.register("Markup", (e) => {
			Ck(e.target, Uo(e.convertedValue) ? "" : Ho(e.convertedValue)), bo(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = vY(e.operation);
			if (bo(e.target, t), e.operation.convertsNull !== !0 && Uo(e.value) || Uo(e.convertedValue)) {
				_Y(e.target, t);
				return;
			}
			gY(e.target, t, Ho(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = vY(e.operation);
			bo(e.target, t), _Y(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = vY(e.operation), n = e.operation.condition ?? "HasValue", r = !Uo(e.value) && dY(e.value, n), i = e.operation.value ?? (Uo(e.convertedValue) || fY(n) ? "" : Ho(e.convertedValue));
			pY(e.target, hY(e), t, r, i);
		}), this.register("Class", (e) => {
			let t = !Uo(e.value) && dY(e.value, e.operation.condition ?? "None") ? Ho(e.convertedValue).trim() : "";
			mY(e.target, hY(e), t, xG(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = vY(e.operation), n = !Uo(e.value) && dY(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? Ho(e.convertedValue).trim() : "";
				mY(e.target, hY(e), t, xG(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = vY(e.operation), n = e.target;
			if (Uo(e.value) || Uo(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = Ho(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(oY, (e) => sY(e.resolved.component, e.target, vY(e.operation))), this.register(xW, (e) => wW(e.target, e.value)), this.register(YJ, (e) => ZJ(e.resolved.component)), this.register(Do, (e) => Oo(e.target)), this.register(QJ, (e) => rY(e.target)), this.register(_D, (e) => yD(e.target)), this.register(SD, (e) => TD(e.resolved.component)), this.register(iY, (e) => aY(e.target)), this.register("Property", (e) => {
			let t = vY(e.operation), n = e.target, r = Uo(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function dY(e, t) {
	switch (gi(t)) {
		case "None": return !0;
		case "HasValue": return !Uo(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !Uo(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return gg(e).length > 0;
		default: return !Uo(e);
	}
}
function fY(e) {
	let t = gi(e);
	return t === "IsTrue" || t === "IsFalse";
}
function pY(e, t, n, r, i) {
	let a = lY.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), lY.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), gY(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && _Y(e, n);
}
function mY(e, t, n, r) {
	let i = cY.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), cY.set(e, i));
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
function hY(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function gY(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function _Y(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function vY(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var yY = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => EG.has(e.name),
			convert: (e) => EG.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = bY(e.name), n = {
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
function bY(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var xY = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Di(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Di(e.domEventName) || t;
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
		return this.definitions.get(Di(e));
	}
};
function SY(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function CY(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(Il, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => SY(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => SY(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var wY = class {
	converters = new yY();
	events = new xY();
	operations = new uY();
	valueReaders;
	collectionSinks = new iJ();
	rowDecorators = new JJ();
	constructor(e, t, n, r) {
		CY(this.events), this.valueReaders = new Go(r);
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
}, TY = "Submenu", EY = "ui-menu__submenu", DY = "Select", OY = ["Header", "Separator"], kY = {
	kind: "menu",
	decorate: AY
};
function AY(e) {
	if (OY.includes(MY(e.item, "Kind")) && e.row.setAttribute(Wt, ""), !jY(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, TY);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(zt, ""), MY(e.item, "Kind") === DY && e.row.setAttribute(Bt, ""), MY(e.item, "Expanded") === !0 && e.row.setAttribute(Vt, "");
	let r = document.createElement("div");
	r.className = EY, r.appendChild(n), fV(r, e.key, e.item), e.row.appendChild(r);
}
function jY(e) {
	let t = MY(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function MY(e, t) {
	let n = bS(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var NY = {
	kind: "grip",
	decorate: PY
};
function PY(e) {
	e.row.append(FY());
}
function FY() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), E.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function IY(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(RY(n));
	for (let t of e.querySelectorAll(`[${at}]`)) LY(t, it, r), LY(t, lt, i);
}
function LY(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function RY(e) {
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
var zY = 2;
function BY(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= zY && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function VY(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var HY = "ne.standard.ui.windowId", UY = [
	500,
	1e3,
	2e3
], WY = 3, GY = [
	["refusal", ({ root: e }) => PB(e)],
	["file input", ({ root: e, validation: t }) => new Oh({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new M_({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new J_({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e, propertyPatchEngine: t }) => new yv({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new iv({ root: e })],
	["image fallback", ({ root: e }) => new Dv({ root: e })],
	["radio group sync", ({ root: e }) => new Bv({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Yy({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new Zv({ root: e })],
	["debounced commit", ({ root: e }) => new fv({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new cb({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => db() ? void 0 : new fb({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e, heldRows: t }) => new NL({
		root: e,
		rows: t
	})],
	["range value", ({ root: e, propertyPatchEngine: t }) => new zb({
		root: e,
		propertyPatchEngine: t
	})],
	["color input", ({ root: e, propertyPatchEngine: t }) => new PF({
		root: e,
		propertyPatchEngine: t
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new ZT({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new CE({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new VE({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new fz({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new Mz({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e, dom: t }) => new uO({
		root: e,
		dom: t
	})],
	["split button", ({ root: e }) => new GN({ root: e })],
	["toggle button", ({ root: e }) => new tv({ root: e })],
	["button group", ({ root: e }) => new ZN({ root: e })],
	["menu", ({ root: e }) => new fj({ root: e })],
	["action bar", ({ root: e, dom: t }) => new KO({
		root: e,
		dom: t
	})],
	["collapsible", ({ root: e }) => new JM({ root: e })],
	["menu group", ({ root: e }) => new zD({ root: e })],
	["menu search", ({ root: e }) => new CM({ root: e })],
	["side drawer", ({ root: e }) => new BM({ root: e })],
	["screen keyboard", () => new NM()],
	["grid splitter", ({ root: e }) => new AN({ root: e })],
	["accordion", ({ root: e }) => new tP({ root: e })],
	["tabs", ({ root: e }) => new EP({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new WR({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new BP({ root: e })],
	["breadcrumbs", ({ root: e }) => new eF({ root: e })],
	["scroll anchor", ({ root: e }) => new Xz({ root: e })],
	["surface press", ({ root: e }) => new nI({ root: e })],
	["text selection", ({ root: e }) => new rB({ root: e })],
	["scroll group", ({ root: e }) => new uB({ root: e })],
	["flyout interaction", ({ root: e }) => new Pm({ root: e })],
	["text fold", ({ root: e }) => new rz({ root: e })],
	["tooltip", ({ root: e }) => mA(e)]
], KY = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new oi(vH());
	hydration = SH();
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
		this.options = e, this.root = e.root ?? document, this.windowId = XY(e.windowIdStorageKey ?? HY), this.dom = new Bi(this.root), E.load(this.root), E.setLanguage(document.documentElement.lang), e.strings !== void 0 && E.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : E.loadTableAsync(this.hydration.words.href)), this.extensions = new wY(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(kY), this.extensions.registerRowDecorator(NY), this.extensions.registerRowDecorator(Nv);
		let t = new Mi(this.dom, this.metadata), n = this.extensions.operations, r = new ZH(), i = new Iq(t, n, this.extensions, r);
		this.reactiveSources = new Bq(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new Sq({
			root: this.root,
			dom: this.dom
		}), this.notifications = new KK({
			root: this.root,
			dom: this.dom
		});
		let a = new Pq({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		}), o = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), u = (e) => CR(e, (e) => this.leaveGuard.navigate(e), (e) => void o(e)), d = kH(document.documentElement, this.windowId, u);
		this.effects = new dq({
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
			systemNotifications: xR(d)
		});
		let f = new Dd(this.metadata), p, m = new md(f, i, new yd(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				p?.syncPropertyAsync(w(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), h = new mH(this.dom), g = new cV(this.metadata, h, this.extensions, n, r);
		this.virtualization = new QV({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new sJ(this.metadata, i, r, g, h, this.dom, this.virtualization, this.extensions.collectionSinks), E.onChange(() => this.rewriteWords(i, g)), this.rewriteMoments = () => this.rewriteWords(i, g, !0), E.onMomentTick(this.rewriteMoments), new yV({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new fW(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.clientState = new bR({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new KH(this.transport), E.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(ai.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(ai.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				gH(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && gH(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let ee = new _W(this.transport);
		p = new Uu({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: ee,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => _.refusesBounds(e)
		}), i.setHeldTargets((e) => p?.isHeld(e) === !0), this.effects.register(ai.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of p?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				_.discardForm(t);
			}
		}), this.leaveGuard = new Mq({
			window,
			ask: async (e) => (await p?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => kq(this.dialogs, t),
			pending: () => lv() || ee.isBusy,
			settle: async () => {
				uv(), await ee.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(ai.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Zh(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let _ = new RJ({
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
		for (let [e, t] of GY) BY(e, t, this.engineContext);
		BY("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new Ix({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), BY("tree", ({ root: e, effects: t }) => new cR({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: g
			}
		}), this.engineContext), BY("items reorder", ({ root: e }) => new cC({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), BY("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new TB({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", T(e)) || m.hasEventForComponent("click", T(e))
		}) : void 0, this.engineContext), this.eventPipeline = new Zu({
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
		this.eventPipeline.addEvent(BR.name, BR.registration);
		let te = (e) => this.updateProcessor.resortHost(e), ne = aC({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: te
		});
		this.eventPipeline.addEvent(ne.name, ne.registration);
		let re = HR(te);
		this.eventPipeline.addEvent(re.name, re.registration);
		let v = VC(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, v);
		this.eventPipeline.addEvent(_v.name, _v.registration), BY("shortcuts", ({ root: e, dom: t }) => new Cj({
			root: e,
			viewShortcuts: wj(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), BY("item drag", ({ root: e, dom: t }) => new WC({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new LI({ root: this.root }), this.windows = new FV({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), BY("pager", ({ root: e, dom: t }) => new oM({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: E,
			observeComponents: z,
			observeSize: $F,
			store: new hD(),
			numbers: hx,
			temporal: Da,
			icons: { apply: pg },
			badges: { writeCount: _K },
			urls: {
				isImageSource: tg,
				asBrowserReads: eg,
				isSafeLink: qh,
				isExternalLink: Xh
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
				let r = e.closest(S), a = r === null ? void 0 : this.metadata.getExposedProperty(T(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: tj,
			renames: { open: hs },
			tables: this.tables,
			rows: sV(h, g, this.virtualization),
			uploads: _h(_),
			selection: Bc,
			popups: QB(this.dom),
			roving: Ys,
			typeAhead: OE,
			focus: _u,
			states: Vo,
			validation: _,
			wheel: zg,
			colors: oV,
			shortcuts: Fs,
			names: $r
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			XH(() => this.applyChanges(t), () => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new RH({
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
		let t = Jo(e);
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
		this.dom.invalidate(), E.language !== this.culturesLanguage && (this.culturesLanguage = E.language, To(this.root, (e) => IY(e, E.number, E.temporal)));
		let i = n ? Za : void 0;
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
		To(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = w(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${v}="${ei(n)}"]`)) Ii(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Ii(e, t));
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
		let t = NH(e, navigator.cookieEnabled, FH());
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
		if (NH(e, navigator.cookieEnabled, FH()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		_(this, this.options.handlerGlobalKey), TW(this.root), await YY();
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
		return yo(this.root) || xH(this.hydration) || this.metadata.getWords().some((e) => Za(e.key)) || Za(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) BY(VY(t), t, this.pluginContext);
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
		BY(VY(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !UH(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = this.transport.instanceId, r = (this.inbound ?? Promise.resolve()).then(() => (t?.(), WH(e, n))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= WY) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (PH(FH()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(UH(e) ? await WH(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = QY(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? Fq(window.location.search) : e.parameters,
			timeZone: TH(),
			clientState: this.clientState.forAttach()
		};
		return this.renderSequence = null, await wH(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, UY, JY);
	}
};
async function qY(e = {}) {
	let t = performance.now(), n = new KY(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function JY(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function YY() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function XY(e) {
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
	let n = ZY();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function ZY() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function QY() {
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
ee(), qY().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
