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
var g = 2;
function ee() {
	return ne();
}
function te(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ne();
	n.runtime = e, re(e, n);
}
function ne() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], s = e.__pendingValueReaders ?? [], c = e.__pendingCollectionSinks ?? [], l = e.__pendingStrings ?? [], u = e.__pendingEngines ?? [], d = {
		...e,
		contractVersion: g,
		__pendingEvents: t,
		__pendingConverters: n,
		__pendingDomOperations: r,
		__pendingEffects: i,
		__pendingValueReaders: s,
		__pendingCollectionSinks: c,
		__pendingStrings: l,
		__pendingEngines: u,
		registerEvent(e, n = {}) {
			let r = window.NEStandardUI?.runtime;
			if (r !== void 0) {
				r.addEvent(e, n);
				return;
			}
			t.push({
				name: e,
				registration: n
			});
		},
		registerConverter(e, t) {
			let r = ie(e, t), i = window.NEStandardUI?.runtime;
			if (i !== void 0) {
				i.addConverter(r);
				return;
			}
			n.push(r);
		},
		registerDomOperation(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addDomOperation(e);
				return;
			}
			r.push(e);
		},
		registerEffect(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addEffect(e);
				return;
			}
			i.push(e);
		},
		registerValueReader(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addValueReader(e);
				return;
			}
			s.push(e);
		},
		registerCollectionSink(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addCollectionSink(e);
				return;
			}
			c.push(e);
		},
		registerStrings(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addStrings(e);
				return;
			}
			l.push(e);
		},
		registerEngine(e) {
			let t = window.NEStandardUI?.runtime;
			if (t !== void 0) {
				t.addEngine(e);
				return;
			}
			u.push(e);
		},
		setLogLevel(e) {
			a(e);
		},
		getLogLevel() {
			return o();
		}
	};
	return window.NEStandardUI = d, d;
}
function re(e, t) {
	for (let n of t.__pendingEvents ?? []) e.addEvent(n.name, n.registration);
	for (let n of t.__pendingConverters ?? []) e.addConverter(n);
	for (let n of t.__pendingDomOperations ?? []) e.addDomOperation(n);
	for (let n of t.__pendingEffects ?? []) e.addEffect(n);
	for (let n of t.__pendingValueReaders ?? []) e.addValueReader(n);
	for (let n of t.__pendingCollectionSinks ?? []) e.addCollectionSink(n);
	for (let n of t.__pendingStrings ?? []) e.addStrings(n);
	for (let n of t.__pendingEngines ?? []) e.addEngine(n);
	t.__pendingEvents = [], t.__pendingConverters = [], t.__pendingDomOperations = [], t.__pendingEffects = [], t.__pendingValueReaders = [], t.__pendingCollectionSinks = [], t.__pendingStrings = [], t.__pendingEngines = [];
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
var _ = "data-ui-id", ae = "data-ui-context", oe = "data-ui-pc", v = "data-ui-key", se = "data-ui-unselectable", ce = "data-ui-undraggable", le = "data-ui-unremovable", ue = "data-ui-unrenamable", de = "data-ui-no-context-menu", fe = "data-ui-no-row-open", pe = "data-ui-no-row-drag", me = "data-ui-drag-kind", he = "data-ui-drag-source", ge = "data-ui-item-drop-over", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-draggable", be = "data-ui-tabs-menu", xe = "data-ui-context-menu", Se = "data-ui-context-menu-use", Ce = "data-ui-action-bar", we = "data-ui-action-bar-key", Te = "data-ui-action-bar-rest", Ee = "data-ui-menu-left-out", De = "data-ui-in-action-bar", Oe = "ui-action-bar", ke = "data-ui-row-focus", Ae = "data-ui-tooltip", je = "data-ui-tooltip-placement", Me = "data-ui-tooltip-mark", Ne = "data-ui-tooltip-severity", Pe = "data-ui-tooltip-press", Fe = "data-ui-badge-text", Ie = "data-ui-badge-set", Le = "data-ui-name", Re = "data-ui-bind-", ze = "data-ui-into-", Be = "data-ui-bind-value", Ve = (e) => `data-ui-no-${e}`, He = "data-ui-event-boundary", Ue = "data-ui-image-caption", We = "data-ui-image-crop", Ge = "data-ui-image-crop-size", Ke = "ui-image", qe = "data-ui-fallback-src", Je = "data-ui-image-failed", y = "data-ui-items-host", Ye = "data-ui-collection-sink", Xe = "data-ui-items-query", Ze = "data-ui-number-culture", Qe = "data-ui-page-culture", $e = "data-ui-pager-target", et = "data-ui-pager-page", tt = "data-ui-pager-size", nt = "data-ui-temporal-culture", rt = "data-ui-empty-template", it = "data-ui-group-template", at = "data-ui-empty-placeholder", ot = "data-ui-group-header", st = "data-ui-group-anchor", ct = "data-ui-group", lt = "data-ui-value-holder", ut = "data-ui-value-end", dt = "data-ui-value-kind", ft = "items-query", pt = "data-ui-host-mode", mt = "data-ui-host-viewport", ht = "data-ui-scroll-group", gt = "data-ui-scroll-lines", _t = "data-ui-source-line", vt = "data-ui-window-spacer", yt = "data-ui-window-pending", bt = "data-ui-window-paged", xt = "data-ui-window-size", St = "data-ui-window-offset", Ct = "data-ui-window-total", wt = "data-ui-window-more-before", Tt = "data-ui-window-more-after", Et = "data-ui-window-group-before", Dt = "data-ui-window-aggregates", Ot = "data-ui-form-id", kt = "data-ui-forms", At = "data-ui-visibility", jt = "data-ui-collapsed", Mt = "data-ui-menu-group", Nt = "data-ui-menu-select", Pt = "data-ui-menu-open", Ft = "data-ui-menu-search", It = "data-ui-menu-searching", Lt = "data-ui-menu-unmatched", Rt = "data-ui-drawer-toggle", zt = "data-ui-drawer-open", Bt = "data-ui-bottom-bar", Vt = "data-ui-region", Ht = "data-ui-menu-item-kind", Ut = "ui-menu", b = "ui-menu-item", Wt = "ui-menu-item--checked", Gt = "ui-menu-item--selected", Kt = "ui-menu--rail", qt = `[${Ht}="header"], [${Ht}="separator"]`, Jt = `[${Mt}] > .${b}`, Yt = `${Jt}, .${b}[${Ht}="check"]`, Xt = "data-ui-shortcut", Zt = "data-ui-collapse-toggle", Qt = "data-ui-folding", $t = "data-ui-column-limits", en = "data-ui-row-limits", tn = "data-ui-splitter-step", nn = "data-ui-table-column", rn = "data-ui-table-hide-below", an = "data-ui-table-starts-hidden", on = "data-ui-table-hidden", sn = "ui-table__row", cn = "ui-table__scroll", ln = "ui-table__header", un = "ui-table__resizer", dn = "ui-tree", fn = "ui-tree__row", pn = "ui-tree-node", mn = "data-ui-tree-drop", hn = "ui-tree__row--filtered", gn = "data-ui-table-last", _n = "data-ui-table-reordering", vn = "data-ui-table-dragging", yn = "data-ui-table-drop", bn = "data-ui-table-scrolled", xn = "data-ui-table-scrollbar", Sn = "data-ui-no-row-select", Cn = "data-ui-tree-parent", wn = "data-ui-tree-children", Tn = "data-ui-tree-folder", En = "data-ui-tree-expanded", Dn = "data-ui-tree-title", On = "data-ui-tree-loading", kn = "data-ui-tree-drop-target", An = "data-ui-tree-boot", jn = "data-ui-tree-draggable", Mn = "data-ui-row-editing", Nn = "data-ui-image-source", Pn = "data-ui-file-max-size", Fn = "data-ui-file-pick", In = "data-ui-file-drop-target-id", Ln = "data-ui-theme", Rn = "data-ui-theme-colors", zn = "data-ui-words", Bn = "data-ui-language-switcher", Vn = "data-ui-language", Hn = "data-ui-splitting", Un = "data-ui-keyboard-up", Wn = "data-ui-connection", Gn = "data-ui-split-folded", Kn = "data-ui-pointer-focus", qn = "data-ui-selection", Jn = "data-ui-selected", Yn = "data-ui-selected-key", Xn = "data-ui-selected-keys", Zn = "data-ui-bind-selected-key", Qn = "data-ui-tabs-selected", $n = "data-ui-tab-order", er = "data-ui-tab-caption", tr = "data-ui-tab-pinned", nr = [
	At,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], rr = "data-ui-submit-form-id", x = `[${_}]`, ir = "data-ui-href", ar = "ui-disabled", or = "ui-loading", sr = "ui-readonly", cr = "ui-hidden", lr = "ui-dialog__surface", ur = "ui-flyout__content", dr = "data-ui-focus-holder", fr = "[role='listbox'], [role='menu'], [role='dialog']", pr = "ui-select__trigger", mr = `.${pr}`, hr = "ui-button", gr = `${hr} ui-button--ghost ui-button--small`, _r = "ui-select", vr = "ui-text-input", yr = "ui-invalid", br = "data-ui-validation-message", xr = {
	componentId: _,
	key: v,
	selected: Jn,
	selectedKey: Yn,
	selectedKeys: Xn,
	unselectable: se,
	rowFocus: ke,
	itemsHost: y,
	valueHolder: lt,
	bindValue: Be,
	noRowOpen: fe,
	noRowDrag: pe,
	eventBoundary: He,
	focusHolder: dr,
	tooltip: Ae,
	tooltipPlacement: je,
	contextMenu: xe,
	contextMenuUse: Se,
	actionBar: Ce,
	actionBarKey: we,
	actionBarRest: Te,
	disabledClass: ar,
	loadingClass: or,
	readOnlyClass: sr,
	hiddenClass: cr,
	buttonClass: hr,
	selectClass: _r,
	textInputClass: vr,
	invalidClass: yr,
	validationMessage: br,
	sourceLine: _t,
	popupSelector: fr,
	listTriggerSelector: mr,
	tableRowClass: sn,
	tableScrollClass: cn,
	tableHeaderClass: ln,
	tableResizerClass: un,
	tableHidden: on,
	hostMode: pt,
	windowOffset: St,
	windowTotal: Ct,
	windowSize: xt,
	windowMoreAfter: Tt,
	windowAggregates: Dt,
	itemsQuery: Xe,
	valueKind: dt,
	itemsQueryKind: ft,
	menuItemClass: b,
	menuItemKind: Ht,
	menuItemCheckedClass: Wt
};
function Sr(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Cr(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var wr = 0;
function Tr(e, t) {
	return e.id.length === 0 && (wr++, e.id = `${t}-${wr}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Er(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(x) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Dr = {
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
	PushAddress: "PushAddress"
}, Or = class {
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
		return this.bindingsByComponentAndPropertyId.get(Zr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Zr(e, Xr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Qr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Yr(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Yr(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get($r(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Zr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Zr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Yr(e.eventName), n = C(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Qr(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set($r(t, e.dynamicParameters ?? []), e);
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
function kr(e) {
	return S(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Ar(e) {
	return e == null ? "OneWay" : S(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function jr(e) {
	return S(e, ["Property", "Event"]);
}
function Mr(e) {
	return e == null ? "SetProperty" : S(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Nr(e) {
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
function Pr(e) {
	return S(e, ["Ascending", "Descending"]);
}
function Fr(e) {
	return S(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Ir(e) {
	return S(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Lr(e) {
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
function Rr(e) {
	return S(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function zr(e) {
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
function Br(e) {
	return typeof e == "string" ? e : "";
}
function Vr(e) {
	return S(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Hr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Ur(e) {
	return S(e, ["Auto", "Smooth"]);
}
function Wr(e) {
	return S(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Gr(e) {
	return S(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Kr(e) {
	return S(e, ["Light", "Dark"]);
}
function qr(e) {
	return S(e, ["Horizontal", "Vertical"]);
}
function Jr(e) {
	return S(e, ["Polite", "Assertive"]);
}
function Yr(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Xr(e) {
	return e?.trim() ?? "";
}
function Zr(e, t) {
	return `${e}:${Xr(t)}`;
}
function Qr(e, t) {
	return `${e}:${Yr(t)}`;
}
function $r(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var ei = class {
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
		let a = C(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Re}${Cr(r.propertyName)}="${Sr(a)}"]` : null;
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
		return Er(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Cr(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ti(e) {
	return ai(e, oe);
}
function ni(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = oi(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function ri(e, t) {
	let n = ti(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = ni(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function ii(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = oi(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function ai(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function oi(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function si(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var ci = class {
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
		let e = this.root.querySelectorAll(x), t = this.root.querySelector(`[${ot}]`) !== null;
		for (let n of e) {
			let e = w(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && fi(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Tr(e, t);
	}
	findComponentParts(e, t, n) {
		return si(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(di(t)) ?? [];
		if (n.length > 0 && n.every((e) => ri(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => ri(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = ti(n);
			if (e === 0) continue;
			let r = ni(n, e);
			if (r.length !== e) continue;
			let i = di(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(x);
			if (e === null || !pi(this.root, e)) return null;
			let r = w(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: ni(e, ti(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function w(e) {
	return ai(e, _);
}
function li(e) {
	let t = e.closest(x), n = t === null ? 0 : w(t);
	return n > 0 ? n : null;
}
function ui(e) {
	let t = e.closest(x), n = t === null ? 0 : w(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: ni(t, ti(t))
	};
}
function di(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function fi(e) {
	return ti(e) === 0;
}
function pi(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function mi(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = hi(n);
	switch (gi(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : _i(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : _i(r, i) ? "many" : "other";
		case "ru":
		case "uk": return vi(r, i);
		case "pl": return yi(r, i);
		default: return "other";
	}
}
function hi(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function gi(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function _i(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function vi(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function yi(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function bi(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var xi = {
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
function Si(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return xi;
	try {
		return {
			...xi,
			...JSON.parse(t)
		};
	} catch {
		return xi;
	}
}
var Ci = [
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
function wi(e, t, n) {
	if (t == null || t.trim().length === 0) return `${ji(e.getFullYear(), 4)}-${ji(e.getMonth() + 1, 2)}-${ji(e.getDate(), 2)} ${ji(e.getHours(), 2)}:${ji(e.getMinutes(), 2)}:${ji(e.getSeconds(), 2)}`;
	let r = "", i = Ti(t);
	for (let a = 0; a < t.length;) {
		let o = ki(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += Ai(o, e, n, i), a += o.length;
	}
	return r;
}
function Ti(e) {
	for (let t = 0; t < e.length;) {
		let n = ki(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var Ei = /^[-./:,]$/, Di = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Oi(e) {
	for (let t = 0; t < e.length;) {
		let n = ki(e, t);
		if (n !== null && Di.has(n) || n === null && !Ei.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function ki(e, t) {
	for (let n of Ci) if (e.startsWith(n, t)) return n;
	return null;
}
function Ai(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return ji(t.getFullYear(), 4);
		case "yy": return ji(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return ji(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return ji(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return ji(i, 2);
		case "H": return String(i);
		case "hh": return ji(a, 2);
		case "h": return String(a);
		case "mm": return ji(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return ji(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function ji(e, t) {
	return String(e).padStart(t, "0");
}
var Mi = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Ni(e) {
	let t = Mi.exec(e.trim());
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
function Pi(e) {
	return Fi(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Fi(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Ii = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Li(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = ki(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += Ri(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function Ri(e, t) {
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
function zi(e, t, n) {
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
		let a = ki(t, e);
		if (a === null) {
			if (!Bi(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Vi(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? Ji(i) : null;
}
function Bi(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return Ei.test(n) ? t.position >= e.length || !Ei.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Vi(e, t, n, r) {
	switch (n) {
		case "yyyy": return Hi(t, "year", Gi(e, t, 4, 4));
		case "yy": return Hi(t, "year", Ui(Gi(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Hi(t, "month", Wi(Ki(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Hi(t, "month", Gi(e, t, 1, 2));
		case "dddd":
		case "ddd": return Ki(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Hi(t, "day", Gi(e, t, 1, 2));
		case "HH":
		case "H": return Hi(t, "hour", Gi(e, t, 1, 2));
		case "hh":
		case "h": return Hi(t, "hour12", Gi(e, t, 1, 2));
		case "mm":
		case "m": return Hi(t, "minute", Gi(e, t, 1, 2));
		case "ss":
		case "s": return Hi(t, "second", Gi(e, t, 1, 2));
		case "tt": return qi(e, t, r);
		default: return !1;
	}
}
function Hi(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Ui(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Wi(e) {
	return e === null ? null : e + 1;
}
function Gi(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Ki(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function qi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Ji(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Fi(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Yi = {
	readCulture: Si,
	format: wi,
	parse: Ni,
	toDate: Pi
}, Xi = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Zi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Qi(e) {
	let t = e?.trim() ?? "";
	if (!Zi.test(t)) return null;
	let n = Date.parse(Xi.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function $i(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function ea(e) {
	return e === "relative" || e === "relative-date";
}
var ta = {
	...xi,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function na(e, t, n, r) {
	if (t === "relative") return fa(e - r, n.language);
	if (t === "relative-date") {
		let t = ra(e, r);
		if (t !== null) return oa(n.language).format(t, "day");
	}
	let i = n.temporal ?? ta, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : bi(i, !1);
	return wi(new Date(e), a, i);
}
function ra(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / da);
	return Math.abs(i) <= 1 ? i : null;
}
function ia(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(sa(t)) + e.slice(1);
}
var aa = /* @__PURE__ */ new Map();
function oa(e) {
	let t = aa.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(sa(e), { numeric: "auto" }), aa.set(e, t)), t;
}
function sa(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var ca = 1e3, la = 60 * ca, ua = 60 * la, da = 24 * ua;
function fa(e, t) {
	let n = oa(t), r = Math.abs(e);
	return r < 45 * ca ? n.format(0, "second") : r < 45 * la ? n.format(Math.round(e / la), "minute") : r < 22 * ua ? n.format(Math.round(e / ua), "hour") : r < 26 * da ? n.format(Math.round(e / da), "day") : r < 320 * da ? n.format(Math.round(e / (30.4375 * da)), "month") : n.format(Math.round(e / (365.25 * da)), "year");
}
//#endregion
//#region src/runtime/words.ts
var pa = "count";
function ma(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function ha(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var ga = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function _a(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Qi(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && ga.has(t.format));
}
function va(e) {
	if (typeof e != "object" || !e) return !1;
	if (_a(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (va(t)) return !0;
	return !1;
}
function ya(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function ba(e, t, n) {
	return ma(e) ? Ca(n, e.key, e.args) : ha(e) ? xa(n, e.text) : t && typeof e == "string" ? xa(n, e) : e;
}
function xa(e, t) {
	return t.trim().length === 0 || !Sa(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Sa(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Ca(e, t, n) {
	let r = n?.[pa];
	return wa(typeof r == "number" ? e.lookup(`${t}.${mi(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => ha(t) ? xa(e, t.text) : Ca(e, t.key, t.args), e.writeMoment);
}
function wa(e, t, n, r = ya) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = Ta(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += Da(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function Ta(e, t) {
	let n = t + 1;
	for (; n < e.length && Ea(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Ea(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Da(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : ma(e) ? t === void 0 ? wa(e.key, e.args, void 0, n) : t(e) : ha(e) ? t === void 0 ? e.text : t(e) : _a(e) ? n(Qi(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var Oa = 15e3, ka = /* @__PURE__ */ new Set(), Aa = null;
function ja(e) {
	ka.add(e), Aa === null && (Aa = setInterval(Ma, Oa));
}
function Ma() {
	for (let e of [...ka]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || ka.delete(e);
	}
	ka.size === 0 && Aa !== null && (clearInterval(Aa), Aa = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Na = 256, Pa = 512, Fa = "script[type='application/json'][data-ui-strings]", Ia = "#text", La = `[${zn}*='"moment"']`, Ra = class {
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
		let t = e.querySelector(Fa)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Ca(this, e, t);
	}
	translate(e, t) {
		return Ca(this, e, t);
	}
	writeMoment = (e, t) => (ea(t) && this.noteRelative(), na(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && ja(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return ba(e, t, this);
	}
	resolveText(e) {
		return ba(e, !0, this);
	}
	write(e, t, n, r) {
		Wa(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Wa(e, t, ba(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (ma(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = ha(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Wa(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Va(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Ga(e, (e) => {
			for (let n of e.querySelectorAll(t ? La : `[${zn}]`)) for (let [e, r] of Object.entries(Ua(n))) {
				if (t && !va(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && Wa(n, e === Ia ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return ba(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Pa || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Sa(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Na) try {
			let a = await e(t, n.slice(r, r + Na));
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
function za(e) {
	let t = !1;
	return Ga(e, (e) => {
		t ||= e.querySelector(La) !== null;
	}), t;
}
function Ba(e, t) {
	e.hasAttribute("data-ui-words") && Va(e, t, null);
}
function Va(e, t, n) {
	let r = Ua(e), i = t ?? Ia;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(zn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(zn, a);
}
function Ha(e) {
	let t = Ua(e)[Ia];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Ua(e) {
	let t = e.getAttribute(zn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Wa(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Ga(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Ga(n.content, t);
}
var T = new Ra();
function Ka(e, t) {
	let n = ha(e) ? e.text : e;
	return T.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var qa = `.${ar}, .${or}, [inert]`;
function Ja(e) {
	return `:scope > [${_}]:is(${e}), :scope > :not([${_}]) > [${_}]:is(${e})`;
}
var Ya = Ja(qa), Xa = /* @__PURE__ */ new Map();
function E(e) {
	return e.closest(qa) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function D(e) {
	return e.matches(qa) || e.querySelector(Ya) !== null;
}
function Za(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Xa.get(t);
	return n === void 0 && (n = Ja(`[${t}]`), Xa.set(t, n)), e.querySelector(n) !== null;
}
function Qa(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var $a = `[${_}], .${sr}`;
function O(e) {
	return e.closest($a)?.matches(`.${sr}`) === !0;
}
function eo(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(ar, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var to = {
	isInert: E,
	isReadOnly: O,
	setDisabled: eo
};
//#endregion
//#region src/extensions/value-readers.ts
function no(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function ro(e) {
	return e == null;
}
var io = "data-ui-trim-input", ao = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of uo) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(dt);
		if (t === null) return oo(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(io) ? t.trim() : t;
	}
	readHeld(e) {
		let t = co(e);
		return t === null ? null : this.read(t);
	}
};
function oo(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var so = "input, textarea, select";
function co(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(so) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${so}`);
}
function lo(e) {
	return e === null ? null : Number(e);
}
var uo = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Qn)
	},
	{
		kind: "tab-order",
		read: (e) => lo(e.getAttribute($n))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(er)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(tr)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Dn)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Yn)
	},
	{
		kind: "selected-keys",
		read: (e) => fo(e, Xn)
	},
	{
		kind: ft,
		read: (e) => fo(e, Xe)
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
function fo(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function po(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var mo = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function ho(e) {
	return e instanceof HTMLInputElement && mo.has(e.type);
}
function go(e) {
	return ho(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var _o = "ui-draft-dropped";
function vo(e) {
	e.dispatchEvent(new Event(_o, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function yo(e) {
	let t = Co(e.key), n = wo(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(So);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function bo(e, t) {
	return Co(e) !== null || wo(e, t) !== 0;
}
var xo = {
	target: yo,
	applyTabIndex: k
};
function k(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function So(e) {
	return e.getClientRects().length > 0 && !E(e);
}
function Co(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function wo(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function To(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function Eo(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${y}][${mt}]`) : null;
}
function Do(e) {
	let t = To(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - ko(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Oo(e, t) {
	let n = To(e);
	n.scrollTop = n === e ? t : t + ko(e, n);
}
function ko(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/selected-key.ts
function Ao(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var jo = "data-ui-bind-selected-keys", A = `.ui-items-view, .ui-table, .${dn}`, Mo = `.ui-items-view__item, .${sn}, .${fn}`, No = ".ui-items-view, .ui-table", Po = {
	shift: !1,
	ctrl: !1
}, Fo = /* @__PURE__ */ new WeakMap();
function Io(e, t) {
	t !== null && !Fo.has(e) && Lo(e, t);
}
function Lo(e, t) {
	let n = M(t);
	n.length > 0 && Fo.set(e, n);
}
function Ro(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function zo(e, t) {
	let n = Ro(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Bo(e) {
	return !e.hasAttribute(Sn);
}
function j(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${_}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Vo(e) {
	switch (e.getAttribute(qn)) {
		case "one": {
			let t = e.getAttribute(Yn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Yo(Xo(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Ho(e, t) {
	let n = Vo(e), r = e.getAttribute(qn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(M(e));
		e.toggleAttribute(Jn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Uo(e) {
	return e.filter((e) => e.hasAttribute(Jn));
}
function Wo(e, t, n, r) {
	let i = M(n);
	if (!qo(n)) return !1;
	switch (e.getAttribute(qn)) {
		case "one": return Ao(e, i, {
			attribute: Yn,
			bindingAttribute: Zn,
			apply: (e) => Ho(e, t)
		}), !0;
		case "many": return Go(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Go(e, t, n, r, i) {
	let a = Xo(e);
	if (a === null) return;
	let o = Yo(a), s;
	if (i.shift) {
		let r = Jo(t, t.find((t) => M(t) === Fo.get(e)) ?? n, n).map(M);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Fo.set(e, r)) : (s = [r], Fo.set(e, r));
	Ko(e, t, s);
}
function Ko(e, t, n) {
	let r = Xo(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Xn, i), Ho(e, t), r.hasAttribute(jo) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function qo(e) {
	return M(e).length > 0 && !Za(e, "data-ui-unselectable") && !D(e);
}
function Jo(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => j(e) !== null && qo(e));
}
function Yo(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Xo(e) {
	let t = e.closest(x);
	for (let n of e.querySelectorAll(`[${y}]`)) if (n.closest(A) === e && n.closest(x) === t) return n;
	return null;
}
function M(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Zo = {
	isSelected: (e) => e.hasAttribute(Jn),
	toggle: Qo,
	setSelected: $o,
	setSelectedKeys: es
};
function Qo(e) {
	let t = e.closest(A);
	t !== null && e instanceof HTMLElement && Wo(t, ts(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function $o(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(M(e));
	es(e, r, n);
}
function es(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = ts(e), i = new Set(r.filter((e) => !qo(e)).map(M)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Vo(e)].filter((e) => !a.has(e));
	Ko(e, r, n ? [...o, ...a] : o);
}
function ts(e) {
	return [...e.querySelectorAll(Mo)].filter((t) => t.closest(A) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function ns(e) {
	let t = e.closest(A);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Mo);
	return n !== null && n.closest(A) === t ? {
		root: t,
		row: n
	} : null;
}
function rs(e) {
	return e.filter((e) => j(e) !== null && !D(e));
}
function is(e) {
	return as(e) ?? rs(e)[0] ?? null;
}
function as(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !D(e)) ?? null;
}
function os(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Tr(t, "ui-row-name"));
}
function ss(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(ke);
	n.setAttribute(ke, ""), e.setAttribute("aria-activedescendant", Tr(n, "ui-row")), (j(n) ?? n).scrollIntoView({ block: "nearest" });
}
function cs(e, t) {
	return bo(e, t === "grid" ? "both" : t) || t !== "horizontal" && ls(e);
}
function ls(e) {
	return e === "PageDown" || e === "PageUp";
}
function us(e, t, n, r) {
	if (!cs(e, r)) return null;
	let i = rs(t);
	if (ls(e)) return ds(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return fs(i, n, e === "ArrowDown");
	let a = i.map((e) => j(e) ?? e), o = yo({
		key: e,
		items: a,
		current: n === null ? null : j(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ds(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (j(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Do(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (j(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function fs(e, t, n) {
	let r = t === null ? null : j(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = ps(i), o = e.map((e) => ({
		row: e,
		rect: (j(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(ps(t.rect) - a) < Math.abs(ps(e.rect) - a) ? t : e).row;
}
function ps(e) {
	return e.left + e.width / 2;
}
var ms = "ui-row-press";
function hs(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function gs(e, t, n) {
	let r = n.hasAttribute(ke), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = rs(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && ss(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var _s = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), vs = /* @__PURE__ */ new Set([
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
]), ys = !1, bs = !1, xs = null, Ss = /* @__PURE__ */ new Set(), Cs = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => ws(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Ts(e), !0), window.addEventListener("focus", (e) => Es(e.target), !0), window.addEventListener("focusin", (e) => Es(e.target), !0), window.addEventListener("focusout", (e) => js(e.target, !1), !0));
function ws(e, t = "") {
	ys = !0, bs = t === "touch";
	let n = document.activeElement;
	xs = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && js(n, !Ds(n));
}
function Ts(e) {
	if (!(e instanceof KeyboardEvent && vs.has(e.key))) {
		ys = !1;
		for (let e of [...Ss]) js(e, !1);
	}
}
function Es(e) {
	ys && !Ds(e) && js(e, !0);
}
function Ds(e) {
	return go(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Os() {
	return ys && xs instanceof HTMLElement && xs !== document.body ? xs : null;
}
function ks() {
	return ys;
}
function As() {
	return ys && bs;
}
function js(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of Ss) e.isConnected || Ss.delete(e);
			Ss.add(e);
		} else Ss.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Kn, t);
	}
}
function N(e) {
	e.focus({ preventScroll: !0 });
}
function Ms(e) {
	js(e, !0), e.focus({ preventScroll: !0 });
}
function Ns(e) {
	for (let t of e.querySelectorAll(_s)) if (Qa(t)) return t;
	return null;
}
var Ps = {
	first: Ns,
	stops: (e) => Fs(e, document.activeElement)
};
function Fs(e, t) {
	let n = [...e.querySelectorAll(_s)].filter((e) => e === t || e.tabIndex >= 0 && Qa(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Is(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Ls(n) && Ls(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Is(e);
		return t === null || r.get(t) === e;
	});
}
function Is(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Ls(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Rs(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && zs(n, a) ? i : r && zs(n, i) ? a : null;
}
function zs(e, t) {
	return e === t || Is(e) !== null && Is(e) === Is(t);
}
var Bs = `.${lr}, .${ur}, [${dr}]`;
function Vs(e) {
	let t = ns(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Bs)) && n.hasAttribute("tabindex") && Qa(n)) return n;
	return null;
}
function Hs(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Ns(e);
	return ys ? Cs.add(e) : Cs.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), N(r ?? e), n;
}
function Us(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Ns(e);
	return n !== null && Ws(e, n), Hs(e, n);
}
function Ws(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Gs(e, t, n = !1) {
	if (ys) {
		k(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), N(e);
		return;
	}
	let r = t.filter(So), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (k(t, i), N(i));
}
function Ks(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : qs(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${_s}, [tabindex]`) && Qa(e)) return e;
	return n === null ? null : Js(n);
}
function qs(e, t) {
	for (let n = e.closest(x); n !== null; n = n.parentElement?.closest(x) ?? null) {
		let e = t.querySelectorAll(`[${_}="${n.getAttribute(_)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Js(e) {
	for (let t = e.closest(x); t !== null; t = t.parentElement?.closest(x) ?? null) if (Qa(t)) return Ys(t), t;
	return null;
}
function Ys(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Xs(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Zs(n, t) && js(e, !Ds(e)), N(e));
}
function Zs(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Cs.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Qs = "data-ui-clear", $s = ["change", "toggle"], ec = [
	...$s,
	"expand",
	"collapse",
	"open",
	"close"
];
function tc(e) {
	let t = Ar(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function nc(e) {
	return Ar(e) === "OnSubmit";
}
function rc(e, t) {
	let n = e.getAttribute(Be);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && nc(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && tc(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: nc(i.mode)
		};
	}
	return null;
}
var ic = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of $s) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(_o, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Qs}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || rc(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Qs}]`);
		if (t === null) return;
		let n = t.closest(x), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || ac(r) || (po(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), go(r) && document.activeElement !== r && N(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (O(e.target) || E(e.target))) return;
		let t = rc(e.target, this.options.metadata);
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
			let r = rc(n, this.options.metadata);
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
		if (i === void 0 || !tc(i.mode) || nc(i.mode)) return;
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
function ac(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function oc(e, t) {
	let n = e.closest(`[${He}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var sc = class {
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
}, cc = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Yr(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Yr(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Yr(e));
	}
	markAttached(e) {
		let t = Yr(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, lc = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: C(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, uc = {
	dispatched: !1,
	success: !1
}, dc = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, fc = class {
	options;
	root;
	registry;
	requestFactory = new lc();
	turns = new sc();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new cc(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t);
		this.shouldAttach(n) && this.attachEvent(n);
	}
	async dispatchCommandAsync(e) {
		if (this.options.dispatcher.isPending(e)) return;
		let t = this.turns.take();
		try {
			await t.ahead, await this.options.valueBinding?.whenSent();
			let n = this.options.dispatcher.dispatchAsync(e);
			t.done();
			let r = await n;
			this.options.effects.applyAll(r.command?.effects, this.options.dom), this.options.afterEffects?.();
		} finally {
			t.done();
		}
	}
	shouldAttach(e) {
		return this.options.metadata.hasServerEvent(e.name) || this.options.interactionEngine.hasEvent(e.name) || this.options.interactionEngine.hasEvent(`before-${e.name}`) || this.options.interactionEngine.hasEvent(`after-${e.name}`);
	}
	attachEvent(e) {
		if (!this.registry.markAttached(e.name)) return;
		let t = (t) => {
			this.handleDomEventAsync(e.name, t).catch((e) => {
				c("event pipeline failed.", e);
			});
		}, n = this.options.eventCatalog.get(e.name);
		n === void 0 ? this.root.addEventListener(e.domEventName, t, !0) : n.attach({
			root: this.root,
			dispatch: t
		});
	}
	async handleDomEventAsync(e, t) {
		if (!(t.target instanceof Element)) return;
		let n = this.registry.get(e);
		if (n === void 0) return;
		let r = this.options.dom.resolveNearestComponent(t.target, (t, n) => this.shouldHandleComponent(e, t, n));
		if (r === null || mc(t, r.element) || oc(t.target, r.element)) return;
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
			let t = e instanceof dc, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && E(r.domEvent.target)) return uc;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), uc;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? hc(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), uc;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return uc;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new dc(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !ec.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Ve(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		pc(e.preventDefault, t) && t.domEvent.preventDefault(), pc(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function pc(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function mc(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function hc(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function gc(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && _c(e, t) : vc(e, t);
}
function _c(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!gc(e[n], t[n])) return !1;
	return !0;
}
function vc(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !gc(e[n], t[n]) : !yc(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !yc(t[n])) return !1;
	return !0;
}
function yc(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
var bc = `.${lr}, .${ur}`;
function xc() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function Sc(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body || Cc(e)) return null;
	let n = e;
	for (; n.parentElement !== null && !Cc(n.parentElement);) n = n.parentElement;
	let r = wc(n) ?? Tc();
	return r !== null && N(r), r;
}
function Cc(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function wc(e) {
	let t = Fs(e.closest(bc) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function Tc() {
	let e = document.querySelector(`[${Vt}="content"]`);
	return e === null ? null : (Ys(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Ec = class {
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
		for (let e of $s) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = kc(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && gc(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = rc(e, this.options.metadata), r;
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
			for (let e of t.interactions) Mr(e.actionKind) === "CopyValue" && Ac(e.target) && this.writeTarget(e.target, t.dynamicParameters, Dc(e, n), !0);
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
		let t = this.index.getPropertyInteractions(C(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? kc(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Mr(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!Ac(a)) return;
		let o = i === "CopyValue" ? Dc(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = xc();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && Sc(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Oc(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Dc(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Oc(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = C(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && ri(s, o)) return a === 0 ? e : {
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
function kc(e, t) {
	return JSON.stringify([
		C(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function Ac(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var jc = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Mc(t, e.operator, e.value);
	}
};
function Mc(e, t, n) {
	let r = Nc(e), i = Nc(n);
	switch (Nr(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Pc(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Pc(r, i, (e) => e >= 0);
		case "Less": return Pc(r, i, (e) => e < 0);
		case "LessOrEqual": return Pc(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Ic(r, i);
		case "RegexEach": return Fc(r, i);
		default: return !1;
	}
}
function Nc(e) {
	return ma(e) ? e.key : ha(e) ? e.text : e;
}
function Pc(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Fc(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Ic(Nc(e), t)) : Ic(e, t);
}
function Ic(e, t) {
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
var Lc = "Value", Rc = "EndValue", zc = class {
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
		return this.eventNames.has(Yr(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Hc(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Yr(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Uc(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Wc(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Bc(e)) {
			let t = C(e.sourceEvent?.componentId), n = Yr(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Uc(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Uc(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (Vc(e)) {
			let t = C(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Wc(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Wc(t, n), r)), r.push(e), Mr(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Lc ? this.valueInteractions : i === Rc ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Bc(e) {
	return jr(e.sourceKind) === "Event";
}
function Vc(e) {
	return jr(e.sourceKind) === "Property";
}
function Hc(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Uc(e, t) {
	return `${e}:${Yr(t)}`;
}
function Wc(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var P = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function Gc() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Kc(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var qc = /* @__PURE__ */ new Set([
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
function Jc(e) {
	return qc.has(e);
}
var Yc = 4, Xc = 12, Zc = /* @__PURE__ */ new Map(), Qc = !1, $c = null, el = /* @__PURE__ */ new WeakMap(), tl = "data-ui-popup-stood-in";
function nl(e, t) {
	t === null ? el.delete(e) : el.set(e, t);
}
var rl = "--ui-popup-ground";
function il(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(rl).trim() : "";
	n.length === 0 ? t.style.removeProperty(rl) : t.style.setProperty(rl, n);
}
function al(e, t, n) {
	Zc.set(t, {
		anchor: e,
		options: n
	}), pl(), $c?.observe(t), sl(e, t), hl(e, t, n);
}
var ol = "data-ui-popup-lifted";
function sl(e, t) {
	if (t.hasAttribute(ol)) {
		t.matches(":popover-open") || t.showPopover();
		return;
	}
	!ll(t) && e.closest(`[${ol}]`) === null || (t.setAttribute("popover", "manual"), t.setAttribute(ol, ""), cl(t));
}
function cl(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function ll(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
function ul(e) {
	e.hasAttribute(ol) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Zc.has(e) || (e.removeAttribute("popover"), e.removeAttribute(ol));
	}, P.fast));
}
function dl(e) {
	let t = Zc.get(e);
	t !== void 0 && hl(t.anchor, e, t.options);
}
function fl(e) {
	e != null && (Zc.delete(e), $c?.unobserve(e), ul(e));
}
function pl() {
	Qc || (Qc = !0, document.addEventListener("scroll", ml, !0), window.addEventListener("resize", ml), window.visualViewport?.addEventListener("resize", ml), window.visualViewport?.addEventListener("scroll", ml), $c = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Zc.get(t.target);
			e !== void 0 && hl(e.anchor, t.target, e.options, !0);
		}
	}));
}
function ml() {
	for (let [e, t] of Zc) {
		if (!e.isConnected) {
			fl(e);
			continue;
		}
		hl(t.anchor, e, t.options);
	}
}
function hl(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = gl(e), a = i !== e;
	t.hasAttribute(tl) !== a && t.toggleAttribute(tl, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = yl(n.boundary), f = Zc.get(t), p = r ? f?.side : void 0, m = p !== void 0 && xl(c, u, p, l, d) ? p : bl(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m);
	let h = n.alignEntries === !0 ? kl(t, m) : Ol, g = jl(c, s, u, m, l, h), ee = Ml(c, s, u, m, l, h);
	n.arrow === !0 && (wl(m) ? ee = _l(ee, s.left + s.width / 2, u.width) : g = _l(g, s.top + s.height / 2, u.height));
	let te = Pl();
	g = te.top + Rl(g - te.top, u.height, te.bottom - te.top), ee = Rl(ee, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${ee}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), vl(t, s, u, m, g, ee);
}
function gl(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(tl)) return e;
		let n = el.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function _l(e, t, n) {
	let r = t - e;
	return r < Xc ? e - (Xc - r) : r > n - Xc ? e + (r - (n - Xc)) : e;
}
function vl(e, t, n, r, i, a) {
	let o = wl(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Xc, Math.min(s, c - Xc))}px`);
}
function yl(e) {
	let t = Pl(), n = {
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
function bl(e, t, n, r, i) {
	let a = El(n);
	if (xl(e, t, n, r, i)) return n;
	if (xl(e, t, a, r, i)) return a;
	for (let a of Sl(n)) if (xl(e, t, a, r, i)) return a;
	return Tl(e, a, i) > Tl(e, n, i) ? a : n;
}
function xl(e, t, n, r, i) {
	return Tl(e, n, i) >= Cl(t, n) + r;
}
function Sl(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Cl(e, t) {
	return wl(t) ? e.height : e.width;
}
function wl(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Tl(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function El(e) {
	return e.startsWith("top") ? `bottom${Dl(e)}` : e.startsWith("bottom") ? `top${Dl(e)}` : e.startsWith("left") ? `right${Dl(e)}` : `left${Dl(e)}`;
}
function Dl(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Ol = {
	start: 0,
	end: 0
};
function kl(e, t) {
	let n = getComputedStyle(e);
	return wl(t) ? {
		start: Al(n.paddingLeft) + Al(n.borderLeftWidth),
		end: Al(n.paddingRight) + Al(n.borderRightWidth)
	} : {
		start: Al(n.paddingTop) + Al(n.borderTopWidth),
		end: Al(n.paddingBottom) + Al(n.borderBottomWidth)
	};
}
function Al(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function jl(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Nl(t.top, t.height, n.height, r, a);
}
function Ml(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Nl(t.left, t.width, n.width, r, a);
}
function Nl(e, t, n, r, i) {
	let a = Dl(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Pl() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Fl(r))
	};
}
function Fl(e) {
	let t = document.querySelector(`[${Bt}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Il(e, t, n) {
	let r = e.getBoundingClientRect(), i = Pl();
	e.style.left = `${Ll(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Ll(n, r.height, i.top, i.bottom)}px`;
}
function Ll(e, t, n, r) {
	return e + t <= r - Yc ? e : e - t >= n + Yc ? e - t : n + Rl(e - n, t, r - n);
}
function Rl(e, t, n) {
	return Math.max(Yc, Math.min(e, n - t - Yc));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var zl = 32;
function F(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Bl(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Bl(e, t, n) {
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
		if (r.size > zl) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Vl(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Hl = "data-ui-dialog", Ul = "data-ui-dialog-modal", Wl = "data-ui-dialog-backdrop", Gl = "data-ui-dialog-close-backdrop", Kl = "data-ui-dialog-close-escape";
function ql(e) {
	let t = e.querySelectorAll(`[${Hl}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Jl(e) {
	let t = ql(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function Yl(e) {
	let t = typeof document > "u" ? null : Jl(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var Xl = "data-ui-rename-field";
function Zl(e) {
	return e instanceof Element && e.closest(`[${Xl}]`) !== null;
}
function Ql(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Xl, ""), r.setAttribute(He, ""), r.value = e.value, $l(r, n, t);
	let i = !1, a = (t, a) => {
		if (i) return;
		i = !0;
		let o = r.value.trim();
		r.remove(), n.style.visibility = "", t && (o.length > 0 || e.allowEmpty === !0) && o !== e.value && e.commit(o), e.done?.(), a && e.refocus?.();
	};
	return r.addEventListener("keydown", (e) => {
		if (!e.isComposing) {
			if (e.key === "Enter") a(!0, !0);
			else if (e.key === "Escape") a(!1, !0);
			else return;
			e.preventDefault(), e.stopPropagation();
		}
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.setSelectionRange(0, r.value.length, "backward"), r.scrollLeft = 0, !0;
}
function $l(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = eu(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = tu((r.left - i.left) / s - n.clientLeft), e.style.top = tu((r.top - i.top) / s - n.clientTop), e.style.width = tu(r.width / s), e.style.height = tu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function eu(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function tu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var nu = /* @__PURE__ */ new Set(), ru = /* @__PURE__ */ new Map(), iu = 0, au = !1;
function ou() {
	au || (au = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || Zl(e.target) || lu() && e.preventDefault();
	}, !0));
}
function su() {
	for (let e of nu) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function cu(e) {
	for (let t of nu) t.hearRefusedClick(e);
}
function lu() {
	let e = [];
	for (let t of nu) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...ru.keys()]) t.has(e) || ru.delete(e);
	for (let { popup: t } of e) ru.has(t) || ru.set(t, ++iu);
	let n = uu(e, (e) => ru.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function uu(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var du = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), nu.add(this), ou();
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
		return this.options.isBehind === void 0 ? Yl(e) : this.options.isBehind(e);
	}
	dismiss(e, t) {
		return this.isBehind(e) || this.options.canDismiss?.(e, t) === !1 ? !1 : (this.options.close(e, t), !0);
	}
	isInside(e, t) {
		return this.options.isInside === void 0 ? t.includes(e) : this.options.isInside(e, t);
	}
};
//#endregion
//#region src/interactions/owned-popup.ts
function fu(e, t) {
	return e.isConnected && !E(e) && !(t && O(e));
}
var pu = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new du({
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
			isBehind: (e) => Yl(this.entryOf(e)?.opening.owner ?? e),
			onPress: e.onPress,
			onWindowBlur: e.onWindowBlur
		}), (e.closesOnFocusLeave ?? !0) && document.addEventListener("focusout", (e) => this.handleFocusLeave(e), !0);
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
		!(e.target instanceof Node) || ks() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : mu(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, _u(t)) && !Yl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = Vs(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && fu(n.owner, this.closesWhenReadOnly) && !Yl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !fu(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), vu(e), yu(e, !0), Su(this), e.focus !== void 0 && e.focus !== !1 && Hs(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && vu(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Xs(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), yu(r, !1), fl(r.popup), this.entries.size === 0 && Cu(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (fu(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !hu() && gu(e);
		}
	}
};
function mu(e) {
	return e instanceof Element && e.isConnected && Qa(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function hu() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Qa(e);
}
function gu(e) {
	Ys(e), N(e);
}
function _u(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function vu(e) {
	e.anchor !== void 0 && e.placement !== void 0 && al(e.anchor, e.popup, e.placement);
}
function yu(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var bu = /* @__PURE__ */ new Set(), xu = null;
function Su(e) {
	bu.add(e), xu === null && typeof MutationObserver == "function" && (xu = new MutationObserver(() => {
		for (let e of [...bu]) e.closeStranded();
	}), xu.observe(document, {
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
function Cu(e) {
	bu.delete(e), !(bu.size > 0 || xu === null) && (xu.disconnect(), xu = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var wu = "ui-flyout", Tu = "ui-flyout--open", Eu = "ui-flyout__anchor", Du = "data-ui-flyout-no-backdrop-close", Ou = "data-ui-flyout-no-escape-close", ku = `${wu}--`, Au = "bottom-start", ju = class {
	root;
	flyouts = new pu({
		show: ({ owner: e }) => e.classList.add(Tu),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Ou : Du)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${wu}`)) this.place(e);
		F(this.root, `.${wu}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${ur}`), n = e.querySelector(`:scope > .${Eu}`);
		if (t === null) return;
		let r = Mu(n, t);
		if (!e.classList.contains(Tu)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Pu(n) ?? e,
			placement: { placement: Fu(e) },
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Tu) && (e.classList.remove(Tu), Nu(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Eu}`)?.closest(`.${wu}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Tu), this.place(t), this.flyouts.isOpen(t) && Nu(t, !0);
		}
	}
};
function Mu(e, t) {
	if (e === null) return null;
	let n = e.querySelector(_s) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Tr(t, "ui-flyout-content")), n;
}
function Nu(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Pu(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Fu(e) {
	for (let t of e.classList) {
		if (!t.startsWith(ku)) continue;
		let e = t.slice(ku.length);
		if (Jc(e)) return e;
	}
	return Au;
}
//#endregion
//#region src/interactions/file-drop.ts
var Iu = "data-ui-file-drop-over", Lu = 120, Ru = "refused", zu = !1;
function Bu(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Wu();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Vu(e, t, n), !0);
	e.root.addEventListener("dragend", () => Xu(t.marked), !0), window.addEventListener("blur", () => Xu(t.marked)), e.root.addEventListener("paste", (t) => Hu(e, t), !0);
}
function Vu(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Xu(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Gu(n), n.type !== "dragleave" && Xu(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Yu(r, a) : t.leaving = window.setTimeout(() => Xu(r), Lu);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Ku(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Yu(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Iu;
		r.set(a, o), a.setAttribute(o, t ? Ru : "");
		return;
	}
	Xu(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Zu(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Hu(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Zu(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Uu(e, t, n) {
	for (let r = t.closest(`[${_}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${In}="${Sr(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Wu() {
	if (!zu) {
		zu = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Gu(e);
		});
	}
}
function Gu(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Ku(e, t) {
	let n = qu(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Ju(t, e)));
}
function qu(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Ju(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Yu(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function Xu(e) {
	for (let t of [...e.keys()]) Yu(e, t);
}
function Zu(e, t) {
	let n = qu(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Ju(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var Qu = "/_ne/files/upload", $u = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], ed = /* @__PURE__ */ new Map(), td = !1;
function nd(e, t, n, r) {
	let i = Number(e.getAttribute(Pn)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return ed.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of ed.keys()) e.isConnected || ed.delete(e);
	return ed.set(e, c), rd(e, c), ad(), a;
}
function rd(e, t) {
	let n = id(t.limit, T.language);
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
function id(e, t) {
	let n = e, r = "byte";
	for (let e of $u) {
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
function ad() {
	td || (td = !0, T.onChange(() => {
		for (let [e, t] of ed) e.isConnected ? rd(e, t) : ed.delete(e);
	}));
}
function od(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Qu), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var sd = () => {};
function cd(e) {
	return {
		uploadAsync: (e, t) => od(e, t ?? sd),
		accepts: Zu,
		takeWithinSizeLimit: (t, n, r) => nd(t, n, r, e)
	};
}
function ld(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var ud = "ui-open-picker";
function dd(e) {
	return !e.dispatchEvent(new Event(ud, {
		bubbles: !0,
		cancelable: !0
	}));
}
function fd(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || O(n) || E(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var pd = "ui-file-input", md = "ui-file-input__row", hd = "ui-file-input__native", gd = "ui-file-input__field", _d = "ui-file-input__selection", vd = "data-ui-file-dragging", yd = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, T.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(ud, (e) => fd(e, {
			rootSelector: `.${pd}`,
			nativeSelector: `.${hd}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Bu({
			root: this.root,
			draggingAttribute: vd,
			resolveTarget: (e) => {
				let t = e.closest(`.${md}`)?.closest(`.${pd}`) ?? null, n = t === null ? Uu(this.root, e, `.${pd}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${hd}`) ?? null;
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
		let t = e.target.closest(`[${Fn}], .${md}`);
		if (t === null || E(t) || O(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${pd}`)?.querySelector(`.${hd}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(hd)) return;
		let t = e.target.closest(`.${pd}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${gd}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = nd(e, t, e.querySelector(`.${hd}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await od(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => T.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, bd(r)), this.publishSelection(e, t.selectionId);
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
		ld(e.querySelector(`.${_d}`), t);
	}
};
function bd(e) {
	return e.length === 1 ? e[0].name : () => T.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var xd = "ne-picture-as-pdf", Sd = "ne-text-snippet", Cd = "ne-description", wd = "ne-table-chart", Td = "ne-slideshow", Ed = "ne-folder-zip", Dd = "ne-audio-file", Od = "ne-video-file", kd = "ne-image", Ad = "ne-code", jd = "ne-draft", Md = new Map([
	...Id(xd, "pdf"),
	...Id(Sd, "txt", "md", "log"),
	...Id(Cd, "doc", "docx", "odt", "rtf"),
	...Id(wd, "xls", "xlsx", "ods", "csv", "tsv"),
	...Id(Td, "ppt", "pptx", "odp", "key"),
	...Id(Ed, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Id(Dd, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Id(Od, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Id(kd, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Id(Ad, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Nd = /* @__PURE__ */ new Map([
	["application/pdf", xd],
	["text/csv", wd],
	["application/msword", Cd],
	["application/rtf", Cd],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Cd],
	["application/vnd.oasis.opendocument.text", Cd],
	["application/vnd.ms-excel", wd],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", wd],
	["application/vnd.oasis.opendocument.spreadsheet", wd],
	["application/vnd.ms-powerpoint", Td],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Td],
	["application/vnd.oasis.opendocument.presentation", Td],
	["application/zip", Ed],
	["application/x-zip-compressed", Ed],
	["application/x-7z-compressed", Ed],
	["application/vnd.rar", Ed],
	["application/x-rar-compressed", Ed],
	["application/x-tar", Ed],
	["application/gzip", Ed],
	["application/json", Ad],
	["application/xml", Ad],
	["text/xml", Ad],
	["text/html", Ad]
]), Pd = /* @__PURE__ */ new Map([
	["image", kd],
	["audio", Dd],
	["video", Od],
	["text", Sd]
]);
function Fd(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Md.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Nd.get(i) ?? (a < 0 ? void 0 : Pd.get(i.slice(0, a))) ?? jd;
}
function Id(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Ld = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Rd(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Ld.includes(t.slice(0, n).toLowerCase());
}
function zd(e) {
	return Rd(e) ? String(e) : void 0;
}
var Bd = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Vd(e) {
	let t = Gd(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Bd.some((e) => n.startsWith(e));
}
function Hd(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Ud(e);
}
function Ud(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Wd(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Gd(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Kd(e) {
	return qd(e) !== null;
}
function qd(e) {
	let t = Gd(e), n = t.toLowerCase();
	return Ud(t) || Wd(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Jd(e) {
	return qd(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Yd = "mask:", Xd = "ui-icon--image", Zd = "ui-icon--mask";
function Qd(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Yd) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? qd(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function $d(e) {
	let t = Qd(e);
	return t === null ? "" : ef(t.source);
}
function ef(e) {
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
var tf = "ui-icon", nf = "data-ui-icon", rf = "--ui-icon-url";
function af(e, t) {
	e.classList.add(tf);
	for (let t of Array.from(e.classList)) sf(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(rf);
	let n = cf(t);
	if (n.length === 0) {
		e.removeAttribute(nf);
		return;
	}
	e.setAttribute(nf, ""), e.classList.add(n);
	let r = Qd(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(rf, ef(r.source));
}
var of = "ui-icon-glyph--";
function sf(e) {
	return e === Xd || e === Zd || e.startsWith(of);
}
function cf(e) {
	let t = Qd(e);
	return t === null ? lf(e) : t.tinted ? Zd : Xd;
}
function lf(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = of;
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
var uf = 1024, df = 16777216;
function ff(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function pf(e, t) {
	let n = Cf(t.zoom, 1, 4), r = Sf(e) / n / 2;
	return {
		x: Cf(t.x, r, e.width - r),
		y: Cf(t.y, r, e.height - r),
		zoom: n
	};
}
function mf(e, t) {
	let n = Sf(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function hf(e, t, n) {
	return t.zoom * n / Sf(e);
}
function gf(e, t, n, r, i) {
	let a = hf(e, t, n);
	return a > 0 ? pf(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function _f(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Cf(t.zoom * r, 1, 4), o = hf(e, t, n), s = hf(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? pf(e, {
		...t,
		zoom: a
	}) : pf(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function vf(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function yf(e, t) {
	return Math.min(1, t * 4 / Sf(e), Math.sqrt(df / (e.width * e.height)));
}
function bf(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function xf(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function Sf(e) {
	return Math.min(e.width, e.height);
}
function Cf(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function wf(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Hl, e.key), t.setAttribute(Ul, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Kl, ""), t.setAttribute(Gl, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Wl, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? lr : `${lr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Tf = class {
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
}, Ef = class {
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
		t.setAttribute(Hn, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Df(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Hn), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Hn);
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
function Df(e, t, n, r) {
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
var Of = 100 / 3, kf = 1, Af = 2;
function jf(e, t = Of) {
	let n = e.deltaMode === kf ? Of : e.deltaMode === Af ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Mf(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Nf = {
	notch: 100,
	pixels: jf
}, Pf = "ui-image-crop", Ff = "ui-image-crop-title", If = new Tf("data-ui-image-crop-part"), Lf = "data-ui-image-crop-frame", Rf = 10, zf = 1.2, Bf = 380, Vf = 100, Hf = .92, I = null, Uf = !1, Wf = null, Gf = !1;
async function Kf(e, t, n, r = ip) {
	if (I !== null || Uf) return "cancelled";
	Uf = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Uf = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Wf ??= qf();
		let o = Wf;
		o.dialog.isConnected || document.body.append(o.dialog), I = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: ff(a),
			finish: (t) => {
				I = null, e.close(Pf), a.release(), i(t);
			}
		}, T.write(o.title, null, "ui.crop.title"), T.write(o.stage, "aria-label", "ui.crop.frame"), T.write(o.zoom, "aria-label", "ui.crop.zoom"), T.write(o.cancel, null, "ui.crop.cancel"), T.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Lf, n.frame), e.open(Pf), np(o);
	});
}
function qf() {
	let { dialog: e, surface: t } = wf({
		key: Pf,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Ff,
		closesOnEscapeAndBackdrop: !1
	}), n = If.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Ff;
	let r = If.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = If.element("canvas", "ui-image-crop__canvas"), a = If.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = If.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = If.button("ui-button--outline", "cancel"), c = If.button("ui-button--primary", "apply");
	t.append(n, r, o, If.actions(s, c));
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
		let t = If.pressed(e);
		t === "cancel" ? I?.finish("cancelled") : t === "apply" && Jf();
	}), e.addEventListener("keydown", (e) => Yf(l, e)), o.addEventListener("input", () => ep(l, Number(o.value))), r.addEventListener("wheel", (e) => Xf(l, e), { passive: !1 }), window.addEventListener("resize", () => rp(l)), new Ef({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => I === null ? null : {
			last: t,
			start: I.view
		},
		move: (e, t, n) => {
			e.last !== null && Zf(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			I !== null && (I.view = t.start, np(l));
		},
		pinch: (e, t) => {
			e.last = null, Qf(l, t);
		}
	}), l;
}
async function Jf() {
	let e = I;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = mf(n, a), s = bf(t.type), c = i.encodeAsync(n, o, vf(o, r.size), s);
	I = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], xf(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function Yf(e, t) {
	if (t.defaultPrevented || t.isComposing || I === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), I.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Rf;
	switch (t.key) {
		case "ArrowLeft":
			Zf(e, -n, 0);
			break;
		case "ArrowRight":
			Zf(e, n, 0);
			break;
		case "ArrowUp":
			Zf(e, 0, -n);
			break;
		case "ArrowDown":
			Zf(e, 0, n);
			break;
		case "+":
		case "=":
			$f(e, zf);
			break;
		case "-":
		case "_":
			$f(e, 1 / zf);
			break;
		case "Enter":
			Jf();
			break;
		default: return;
	}
	t.preventDefault();
}
function Xf(e, t) {
	if (I === null) return;
	t.preventDefault();
	let n = jf(t, e.stage.clientHeight), r = t.ctrlKey ? Vf : Bf;
	$f(e, 2 ** (-n.y / r), tp(e, t.clientX, t.clientY));
}
function Zf(e, t, n) {
	I !== null && (I.view = gf(I.source, I.view, e.frame.clientWidth, t, n), np(e));
}
function Qf(e, t) {
	if (I === null) return;
	let n = gf(I.source, I.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	I.view = _f(I.source, n, e.frame.clientWidth, t.factor, tp(e, t.center.x, t.center.y)), np(e);
}
function $f(e, t, n) {
	I !== null && (I.view = _f(I.source, I.view, e.frame.clientWidth, t, n), np(e));
}
function ep(e, t) {
	I !== null && Number.isFinite(t) && t > 0 && $f(e, t / I.view.zoom);
}
function tp(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function np(e) {
	if (I === null) return;
	let t = I.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), rp(e);
}
function rp(e) {
	Gf || I === null || (Gf = !0, requestAnimationFrame(() => {
		if (Gf = !1, I === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = I.view, a = hf(I.source, i, t);
		I.imaging.paint(e.canvas, I.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: I.source.width * a,
			height: I.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var ip = {
	decodeAsync: async (e, t) => {
		let n = await ap(e);
		if (n === null) return null;
		let r = n, i = yf(r, t);
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
		}, r, Hf);
	})
};
async function ap(e) {
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
var op = "ui-image-input", sp = "ui-image-input--multiple", cp = "ui-image-input__surface", lp = "ui-image-input__native", up = "ui-image-input__picture", dp = "ui-image-input__text", fp = "ui-image-input__selection", pp = "ui-image-input__selections", mp = "ui-image-input__tiles", hp = "ui-image-input__tile", gp = "ui-image-input__remove", _p = "ui-image-input__progress", vp = "ui-image-input__tile--file", yp = "ui-image-input__file-glyph", bp = "ui-image-input__file-name", xp = "SelectionId", Sp = "--ui-image-progress", Cp = "data-ui-image-preview", wp = "data-ui-image-dragging", Tp = class {
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
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${op}`)), F(this.root, `.${op}`, {
			childList: !0,
			attributeFilter: [
				Nn,
				Ue,
				Xn
			]
		}, (e) => this.applyAll(e)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === xp && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(si(e.components, `.${op}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(ud, (e) => fd(e, {
			rootSelector: `.${op}`,
			nativeSelector: `.${lp}`,
			pressed: (e) => e.querySelector(`.${cp}`)
		})), this.root.addEventListener(_o, (e) => this.handleDraftDropped(e)), Bu({
			root: this.root,
			draggingAttribute: wp,
			resolveTarget: (e) => {
				let t = e.closest(`.${cp}`), n = t?.closest(`.${op}`) ?? null, r = n === null ? Uu(this.root, e, `.${op}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${cp}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${lp}`)?.getAttribute("accept") ?? "",
					multiple: Ep(i),
					refused: O(i) || E(a)
				};
			},
			onFiles: (e, t) => void (Ep(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Ep(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${up}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || jp(e, e.getAttribute("data-ui-image-caption") ?? Pp(n)), Np(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Xn);
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
	clearAll(e) {
		for (let t of e) Ep(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Fn}]`), n = t?.closest(`.${op}`) ?? null;
		t === null || n === null || O(n) || E(t) || n.querySelector(`.${lp}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gp}`), n = t?.closest(`.${op}`) ?? null;
		if (t === null || n === null || O(n) || E(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(lp)) return;
		let t = e.target.closest(`.${op}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Ep(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${op}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), ld(t.querySelector(`.${fp}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${cp}`), r = e.querySelector(`.${up}`), i = e.querySelector(`.${fp}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || nd(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Cp, ""), r.setAttribute("src", o.url), jp(e, a.name), Np(e, !0), n.classList.add(or);
		try {
			let t = await od([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, ld(i, t.selectionId));
		} catch (t) {
			Mp(e), ld(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(or);
		}
	}
	async cropAsync(e, t) {
		let n = Dp(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Kf(this.dialogs, t, {
				frame: n,
				size: Op(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${mp}`), r = nd(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = kp(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await od([t], (e) => r.element.style.setProperty(Sp, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(or), this.publishShelf(e);
			} catch (t) {
				this.dropTile(e, r), s("picture upload failed.", t);
			}
		});
		await Promise.all(a);
	}
	dropTile(e, t) {
		let n = this.shelves.get(e), r = n?.indexOf(t) ?? -1;
		n !== void 0 && r >= 0 && n.splice(r, 1), URL.revokeObjectURL(t.url), t.element.remove();
	}
	publishShelf(e) {
		let t = e.querySelector(`.${pp}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Xn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Cp), t || jp(e, ""));
	}
};
function Ep(e) {
	return e.classList.contains(sp);
}
function Dp(e) {
	let t = e.getAttribute(We);
	return t === "square" || t === "circle" ? t : null;
}
function Op(e) {
	let t = Number(e.getAttribute(Ge));
	return Number.isInteger(t) && t > 0 ? t : uf;
}
function kp(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${hp} ${or}`, n.type = "button", n.className = gp, r.className = _p, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, T.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Ap(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Ap(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Ap(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(vp), e.setAttribute("title", n.name), r.className = yp, r.setAttribute("aria-hidden", "true"), af(r, Fd(n.name, n.type)), i.className = bp, i.textContent = n.name, T.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function jp(e, t) {
	let n = e.querySelector(`.${dp}`);
	n !== null && (Ba(n, null), n.textContent !== t && (n.textContent = t));
}
function Mp(e) {
	let t = e.querySelector(`.${dp}`);
	t !== null && T.write(t, null, "ui.file.failed");
}
function Np(e, t) {
	let n = e.querySelector(`.${cp}`);
	n !== null && T.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Pp(e) {
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
var Fp = "ui-key-value-action__row", Ip = "ui-key-value-action__value", Lp = "ui-key-value-action__value-input", Rp = "ui-key-value-action__edit-action", zp = "ui-text__title", Bp = "ui-row-form-", Vp = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Fp}`), !1), F(this.root, `.${Fp}`, {
			childList: !0,
			attributeFilter: [Mn]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Wp(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Up(e), !0);
	}
	handleRows(e, t) {
		for (let n of e) {
			if (!n.hasAttribute("data-ui-row-editing")) {
				this.closedRows.has(n) || (this.openRows.delete(n), this.closedRows.add(n), this.close(n));
				continue;
			}
			this.closedRows.delete(n), this.joinForm(n), this.openRows.has(n) || (this.openRows.add(n), this.open(n, t), this.judge(n));
		}
	}
	joinForm(e) {
		let t = e.querySelector(`.${Rp} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Bp}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Lp} [${Be}]:not([${Ot}])`)) t.setAttribute(Ot, n);
		t.setAttribute(rr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Ot}="${t}"], [${rr}="${t}"]`)) n.removeAttribute(Ot), n.removeAttribute(rr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Lp} [${Be}]`)) {
			if (go(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		vo(e), this.judge(e);
	}
	judge(e) {
		let t = Hp(e);
		for (let n of e.querySelectorAll(`.${Lp} [${Be}]`)) this.options.validation.judgeShown(n, go(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Lp} :is(input, textarea, select)`);
		if (n !== null) {
			if (go(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Hp(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), ho(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Kp(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Rp)) return;
		let { cell: n, row: r } = t, i = e.target.closest(fr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Rp} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !E(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Hp(e) {
	return e.querySelector(`.${Ip} .${zp}`)?.textContent?.trim() ?? "";
}
function Up(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(`.${Lp}`)?.closest(`.${Fp}`) ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Wp(e) {
	let t = e.closest(`.${Rp} button`), n = t?.closest(`.${Rp}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
function Gp(e) {
	return Kp(e) !== null;
}
function Kp(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Lp}, .${Rp}`), n = t?.closest(`.${Fp}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var qp = `.ui-button[${dt}="pressed"]`, Jp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(qp);
		t === null || E(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Yp = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${pr}, .ui-field-box`, Xp = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Zp = `${Xp}, ${Yp}, ${fr}, .${_e}`, Qp = "button, a, summary, [role='button']";
function $p(e) {
	let t = [];
	for (let n of e.querySelectorAll(Zp)) if (!(n.classList.contains("ui-row__grip") || !nm(e, n) || tm(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Qp) ? n : null;
}
function em(e) {
	let t = [];
	for (let n of e.querySelectorAll(Xp)) tm(e, n) && nm(e, n) && t.push(n);
	return t;
}
function tm(e, t) {
	let n = t.closest(`[${fe}]`);
	return n !== null && n !== e && e.contains(n);
}
function nm(e, t) {
	let n = t.closest(fr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function rm(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Zp);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var im = `${Xp}, [tabindex], [contenteditable], ${fr}, [${He}]`, am = ":scope > input.ui-field, :scope > textarea.ui-field", om = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Yp);
		if (t === null || e.target !== t && e.target.closest(im) !== null) return;
		let n = t.querySelector(am);
		if (!go(n) || n.readOnly || E(n) || O(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function L(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var sm = "data-ui-submit-on-enter", cm = "data-ui-runs-on-enter", lm = "enter", um = 229, dm = {
	name: lm,
	registration: { settlesValue: !0 }
}, fm = "ui-commit-in-place", pm = class {
	root;
	committedValue = "";
	changes = 0;
	edited = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("focusin", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (this.committedValue = e.target.value);
		}), this.root.addEventListener("input", (e) => {
			e.target !== null && this.edited.add(e.target);
		}, !0), this.root.addEventListener("change", (e) => {
			this.changes++, e.target !== null && this.edited.delete(e.target), e.target instanceof HTMLTextAreaElement && (this.committedValue = e.target.value);
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(fm, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || mm(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : hm(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : gm(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (ho(t)) {
			if (e.preventDefault(), hm(t, e)) {
				this.runEnter(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || E(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(lm, { bubbles: !0 })));
	}
	submitForm(e) {
		let t = e.getAttribute(Ot);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${rr}="${Sr(t)}"]`);
		n !== null && !E(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Vs(e);
		e.blur(), this.changes === t && this.commit(e), this.keepKeyboard(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	commitInPlace(e) {
		this.edited.has(e) ? e.dispatchEvent(new Event("change", { bubbles: !0 })) : this.commit(e);
	}
	keepKeyboard(e, t) {
		let n = document.activeElement;
		if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
		let r = ns(e);
		r?.root === t && r.row !== null && ss(t, L(t, Mo, A), r.row), N(t);
	}
};
function mm(e) {
	return e.isComposing || e.keyCode === um;
}
function hm(e, t) {
	return _m(t) && e.hasAttribute(cm);
}
function gm(e, t) {
	return _m(t) && e.hasAttribute(sm) && !e.readOnly && !E(e);
}
function _m(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var vm = `img.${Ke}`, ym = "%238c8c8c", bm = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${ym}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${ym}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${ym}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, xm = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${ym}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${ym}'/%3E%3C/svg%3E`, Sm = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(vm)) (Cm(e) || e.complete && e.naturalWidth === 0) && Tm(e);
		F(this.root, vm, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !wm(t) && t.removeAttribute(Je), Cm(t) && Tm(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(vm) && Tm(t);
	}
};
function Cm(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function wm(e) {
	let t = e.getAttribute("src");
	return t === bm || t === xm;
}
function Tm(e) {
	let t = e.getAttribute(qe);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	wm(e) || (e.setAttribute(Je, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? xm : bm));
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Em = "data-ui-radio-value", Dm = "ui-radio-group__input", Om = "ui-radio-group__dot", km = "ui-radio-group", Am = "ui-radio-group__item", jm = "data-ui-radio-group-name", Mm = "data-ui-radio-bind-value-id", Nm = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${km}`)]);
		for (let e of this.root.querySelectorAll(`.${km}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${km}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Pm));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Em, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${km}`)) {
			let n = e.getAttribute(jm);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(jm), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(jm, a);
			for (let e of L(r, `.${Dm}`, `.${km}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${km}`)) n.has(e.getAttribute(jm) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Em);
		for (let n of L(e, `.${Dm}`, `.${km}`)) {
			n.checked = n.value === t;
			let e = Fm(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Am) ? [e] : [...e.querySelectorAll(`.${Am}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Dm}`) !== null) return;
		let t = e.closest(`.${km}`), n = t?.getAttribute(jm);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Dm, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Mm);
		a !== null && r.setAttribute(Be, a);
		let o = document.createElement("span");
		o.className = Om, e.prepend(r, o), this.sync(t);
	}
};
function Pm(e) {
	return e.classList.contains(km) ? [e] : [...e.querySelectorAll(`.${km}`)];
}
function Fm(e) {
	let t = e.closest(`.${Am}`);
	return t !== null && D(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Im(e) {
	if (e === null || e.length === 0) return [];
	let t;
	try {
		t = JSON.parse(e);
	} catch {
		return [];
	}
	if (!Array.isArray(t)) return [];
	let n = [];
	for (let e of t) typeof e == "string" && e.length > 0 && !n.includes(e) && n.push(e);
	return n;
}
function Lm(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Rm(e, t) {
	return t !== null && e.length >= t;
}
function zm(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Rm(e, n) ? null : [...e, t];
}
function Bm(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Vm = /[,\uFF0C\r\n]/;
function Hm(e) {
	return Vm.test(e);
}
function Um(e) {
	return e.split(Vm).map((e) => e.trim()).filter((e) => e.length > 0);
}
function Wm(e) {
	let t = e.split(Vm), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Gm(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Rm(a, n) ? r : i(a, t);
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
//#region src/interactions/search-terms.ts
var Km = /\p{M}/gu;
function qm(e, t) {
	return Jm(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Jm(e, t) {
	return Zm(e, Xm(t));
}
function Ym(e, t) {
	return t.every((t) => e.includes(t));
}
function Xm(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Zm(e, t) {
	let n = e.normalize("NFD").replace(Km, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Qm = "data-ui-search-debounce", $m = "data-ui-search-min-length", eh = "data-ui-search-manual", th = "data-ui-search-answered", nh = "ui-search__input", rh = "ui-select__list", ih = "ui-select__option", ah = "ui-text__title", oh = 300, sh = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(nh) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		ch(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Qm), i = r === null ? oh : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : oh));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(nh)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), !t && e.hasAttribute(eh)) return;
		let n = e.getAttribute($m), r = n === null ? 0 : Number(n);
		e.value.length < r || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function ch(e) {
	if (e.hasAttribute(th)) return;
	let t = e.closest(`.${_r}`), n = t?.querySelector(`.${rh}`);
	if (t == null || n == null) return;
	let r = e.getAttribute($m), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? qm(e.value, e) : [], o = uh(n, (e) => a.length === 0 || Ym(Jm(lh(e), e), a));
	ph(t, n, a.length > 0 && o === 0);
}
function lh(e) {
	return e.querySelector(`.${ah}`)?.textContent ?? e.textContent ?? "";
}
function uh(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && dh(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(ih)) continue;
		let e = t(a);
		dh(a, e), r ||= e, e && i++;
	}
	return n !== null && dh(n, r), i;
}
function dh(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function fh(e) {
	let t = e.querySelector(`.${rh}`);
	t !== null && ph(e, t, uh(t, (e) => e.style.display !== "none") === 0);
}
function ph(e, t, n) {
	let r = t.querySelector(`:scope > [${at}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${rt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(at, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var mh = 500, hh = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > mh) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Jm(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Jm(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function gh(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var _h = "data-ui-select-value", vh = "data-ui-select-placement", yh = "ui-select--open", bh = "ui-select__trigger-content", xh = "data-ui-select-content", Sh = "ui-select__placeholder", Ch = "ui-input__affix-icon--prefix", wh = "ui-select__popup", Th = "ui-select__list", Eh = "ui-select__option", Dh = "ui-select__value-input", Oh = "data-ui-select-clear", kh = "ui-search", Ah = "ui-search__input", jh = "ui-text__title", Mh = "data-ui-active", Nh = "ui-multi-select", Ph = "ui-multi-select__chips", Fh = "ui-multi-select__chip", Ih = "ui-multi-select__chip-label", Lh = "ui-multi-select__chip-remove", Rh = "data-ui-select-chip", zh = "data-ui-select-max", Bh = "data-ui-select-free-text", Vh = "ui-multi-select__entry", Hh = "data-ui-select-tag-entry", Uh = [
	_h,
	Xn,
	zh,
	"class",
	v
];
function Wh(e) {
	return e === null || O(e) || E(e);
}
function Gh(e) {
	return e.classList.contains(Nh);
}
function Kh(e) {
	return e.classList.contains(kh);
}
function qh(e) {
	return Kh(e) ? e.querySelector(`.${Ah}`) : null;
}
function Jh(e) {
	return e.hasAttribute(Bh) ? e.querySelector(`:scope > .${pr} .${Vh}`) : null;
}
function Yh(e) {
	return qh(e) ?? Jh(e);
}
function Xh(e) {
	return Jh(e) ?? e.querySelector(".ui-select__trigger");
}
function Zh(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Vh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function R(e) {
	return L(e, `.${wh} .${Eh}`, `.${_r}`);
}
function Qh(e) {
	return e === null ? null : e.querySelector(`.${jh}`)?.textContent ?? e.textContent;
}
function $h(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(_), t.removeAttribute(v), t.removeAttribute(oe), t.removeAttribute(ae);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var eg = class {
	root;
	popups = new pu({
		show: ({ owner: e }) => e.classList.add(yh),
		hide: ({ owner: e }) => {
			e.classList.remove(yh), this.markActive(e, null);
			let t = e.querySelector(`.${wh}`);
			t !== null && (t.style.minHeight = "");
		}
	});
	typeAhead = new hh();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${_r}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) ug(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Uh,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${Oh}], .${Lh}`) !== null || ag(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Wh(r)) return;
		this.releaseRefusal(r);
		let i = Wm(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Zh(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented ? Zh(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Hh) !== "first-suggestion" || !R(t.select).some((e) => e.hasAttribute(Mh)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Zh(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Wh(t.select) || !Hm(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Um(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Im(e.getAttribute(Xn)), a = Lm(e.getAttribute(zh)), o = Gm(i, n.map((t) => ({
			text: t,
			key: og(e, t) ?? t
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
		ch(t);
		let n = t.value.trim().length > 0, r = n ? R(e).filter((e) => ng(e) && !D(e)) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Hh) === "first-suggestion" && (this.markActive(e, i), i !== null && rg(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Gh(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(_h);
		this.decorateOptions(e);
		let n = t === null ? null : R(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${Sh}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of R(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${Dh}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), fh(e);
	}
	syncMultiple(e) {
		let t = Im(e.getAttribute(Xn)), n = new Set(t), r = Rm(t, Lm(e.getAttribute(zh)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = R(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Jh(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		cg(e, s.map((e) => ({
			key: e,
			label: sg(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Wh(e) && (o.readOnly = Wh(e));
		let c = e.querySelector(`.${Sh}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${Dh}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Xn, u), fh(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${pr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${bh}`), a = i?.getAttribute(xh) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(xh), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Kh(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(v);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = bh;
			let e = r.querySelector(`:scope > .${Ch}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return $h(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of R(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = D(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${Eh}`);
		t === null || n === null || n.hasAttribute(Mh) || D(n) || E(n) || n.closest(".ui-select") !== t || (Yh(t) === null && (k(R(t).filter((e) => !D(e)), n), Ms(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lh}`);
		if (t !== null) {
			let n = t.closest(`.${_r}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Wh(n) || this.removeChosen(n, t.closest(`.${Fh}`)?.getAttribute(Rh) ?? null));
			return;
		}
		let n = e.target.closest(`[${Oh}]`);
		if (n !== null) {
			let t = n.closest(`.${_r}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Wh(t) || (this.clearValue(t), tg(t)));
			return;
		}
		let r = e.target.closest(`.${pr}`);
		if (r !== null) {
			let t = r.closest(`.${_r}`);
			if (Wh(t)) return;
			e.preventDefault();
			let n = t === null ? null : Jh(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${Eh}`);
		if (i === null) return;
		let a = i.closest(`.${_r}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(R(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || this.handleEntryKey(e) || this.handleChipKey(e)) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveCurrent(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Eh}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${_r}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleEntryKey(e) {
		let t = Zh(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Wh(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key === "ArrowDown" ? 1 : -1) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? R(r).find((e) => e.hasAttribute(Mh) && ng(e) && !D(e)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Um(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Um(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Ph} > .${Fh}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Rh)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = ig(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Lh}`) ?? (n === 1 ? Xh(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		ch(t);
		let r = R(e).filter((e) => ng(e) && !D(e) && !E(e)), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Lh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Gh(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Wh(n)) return !0;
				let r = ig(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Rh) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Rh) ?? null);
				let o = a === null ? null : ig(n).find((e) => e.getAttribute(Rh) === a) ?? null;
				return o !== null && o.querySelector(`.${Lh}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Wh(t)) return !1;
		e.preventDefault();
		let n = qh(t);
		n !== null && ch(n);
		let r = R(t).filter((e) => ng(e) && !D(e) && !E(e)), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = gh(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(Eh))) return !1;
		let r = n.closest(`.${_r}`), i = r !== null && r === this.openSelect;
		if (r === null || Wh(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = qh(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = R(r).filter((e) => !D(e) && !E(e)), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(Mh)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => Qh(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (k(R(r).filter((e) => !D(e)), c), rg(r, c), N(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Gh(t) || Wh(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Ph} > .${Fh}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Rh)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ah) || !t.contains(e.target) ? null : R(t).find((e) => e.hasAttribute(Mh) && !D(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Yh(e), i = Jh(e);
		r !== null && !t && ch(r), fh(e);
		let a = e.querySelector(`.${pr}`), o = e.querySelector(`.${wh}`), s = e.querySelector(`.${Th}`) ?? o, c = e.getAttribute(vh);
		if (a === null || o === null || s === null) return;
		let l = Tr(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Jc(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), dg(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = R(e).filter((e) => !D(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && ks()) {
			k(n, null), this.markActive(e, null), tg(e);
			return;
		}
		let i = r ?? n[0];
		k(n, i), this.markActive(e, i, ks()), rg(e, i), N(i);
	}
	initializeSearch(e, t, n, r) {
		let i = R(e), a = i.filter((e) => ng(e) && !D(e)), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || ks() ? null : a[0] ?? null);
		k(i, null), this.markActive(e, o, ks()), o !== null && rg(e, o), !As() && (N(t), t.select());
	}
	initializeEntry(e, t) {
		k(R(e), null), this.markActive(e, t), t !== null && rg(e, t);
	}
	moveCurrent(e, t) {
		let n = R(e).filter((e) => !D(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(Mh)) ?? null, i = yo({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Yh(e) === null ? (k(n, i), i.focus()) : rg(e, i), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of R(e)) r === t ? r.setAttribute(Mh, "") : r.hasAttribute(Mh) && r.removeAttribute(Mh), js(r, r === t && n);
		let r = Yh(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Tr(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || D(t) || Wh(e)) return;
		if (Gh(e)) {
			let r = zm(Im(e.getAttribute(Xn)), n, Lm(e.getAttribute(zh)));
			this.markActive(e, t, ks()), r !== null && this.writeChosen(e, r);
			let i = Jh(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(_h) === n) {
			this.close();
			return;
		}
		e.setAttribute(_h, n), this.sync(e);
		let r = e.querySelector(`.${Dh}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Bm(Im(e.getAttribute(Xn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Fh}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Xh(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Xn) : e.setAttribute(Xn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Dh}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Gh(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(_h)) return;
		e.removeAttribute(_h), this.sync(e);
		let t = e.querySelector(`.${Dh}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function tg(e) {
	let t = e.querySelector(`.${pr}`), n = Xh(e);
	t !== null && n !== null && !t.contains(document.activeElement) && N(n);
}
function ng(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function rg(e, t) {
	let n = e.querySelector(`.${Th}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function ig(e) {
	return [...e.querySelectorAll(`.${Ph} > .${Fh}`)];
}
function ag(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Jh(t) !== null && !e.classList.contains(Vh);
}
function og(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of R(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !D(t) && (e.toLocaleLowerCase() === n || Qh(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function sg(e, t) {
	let n = Qh(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function cg(e, t) {
	let n = e.querySelector(`.${Ph}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Fh}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Rh) === t[n].key && e.querySelector(`.${Ih}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => lg(e.key, e.label)));
	}
}
function lg(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Fh, n.setAttribute(Rh, e), r.className = Ih, r.textContent = t, i.className = Lh, i.type = "button", i.tabIndex = -1, T.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function ug(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${_r}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === _h || e.attributeName === "data-ui-selected-keys" || e.attributeName === zh)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${wh}`)?.closest(`.${_r}`);
	n != null && t.add(n);
}
function dg(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var fg = class {
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
		!go(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, pg = "data-ui-input-debounce", mg = `input[${pg}], textarea[${pg}]`;
function hg(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(mg);
}
var gg = /* @__PURE__ */ new Set();
function _g() {
	for (let e of gg) if (e.waiting) return !0;
	return !1;
}
function vg() {
	for (let e of gg) e.commitAll();
}
var yg = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), gg.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!hg(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(pg));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!hg(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, bg = "textarea.ui-text-area__field", xg = "data-ui-text-area-grow";
function Sg() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var Cg = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(bg) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(bg)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(si(e.components, bg));
		}), F(this.root, bg, {
			childList: !0,
			attributeFilter: [xg]
		}, (e) => {
			this.fitAll(si(e, bg));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(xg)) {
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
function wg(e) {
	let t = Tg(e.getAttribute("min"), 0), n = Tg(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, Tg(r, 1))
	};
}
function Tg(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function Eg(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function Dg(e, t) {
	return Og(t.min + e * (t.max - t.min), t);
}
function Og(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, kg(t.min + r * t.step, t);
}
function kg(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(Ag(t.step), Ag(t.min)))));
}
function Ag(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function jg(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function Mg(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return Ng(o, i);
	let s = (o - i.min) / i.step;
	return Ng(kg(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function Ng(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var Pg = "ui-slider__input", Fg = "ui-slider__input--end", Ig = "ui-slider__input--held", Lg = "ui-slider__value", Rg = "ui-slider__bubble", zg = "ui-slider__track", Bg = "ui-slider__thumb-anchor", Vg = "ui-slider", Hg = "ui-slider--range", Ug = "ui-orientation--vertical", Wg = "--ui-slider-fraction", Gg = "--ui-slider-end-fraction", Kg = 6, qg = "Value", Jg = "EndValue", Yg = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Xg = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Ef({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Hg} .${zg}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Yg.has(e.propertyName)) return;
			let t = C(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) for (let t of n.querySelectorAll(`.${Pg}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Qg(t) ? Jg : qg) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Zg(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Zg(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Zg(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || t_(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Pg)) return;
		let t = e.target;
		if (this.cancelled.delete(t), t_(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = $g(t);
		if (n !== null) {
			let e = e_(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${Pg}:not(.${Fg})`), r = e.querySelector(`.${Fg}`);
		if (n === null || r === null) return null;
		let i = Dg(Eg(e.getBoundingClientRect(), t, n_(e), r_(e)), wg(n)), a = jg(i, Number(n.value), Number(r.value));
		if (t_(n)) return N(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? N(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${zg}`);
		if (n === null) return;
		let r = Dg(Eg(n.getBoundingClientRect(), t, n_(n), r_(n)), wg(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Ig), N(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = $g(e), r = n === null ? String(t) : e_(e, t, n);
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
		e.held?.classList.remove(Ig), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = i_(e);
		t !== null && al(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Kg
		});
	}
	releaseBubble(e) {
		fl(i_(e)?.bubble);
	}
	writeReadings(e) {
		let t = Qg(e), n = e.closest(`.${zg}`)?.parentElement ?? e.parentElement, r = t ? `.${Lg}--end, .${Rg}--end` : `.${Lg}:not(.${Lg}--end), .${Rg}:not(.${Rg}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${zg}`)?.style.setProperty(t ? Gg : Wg, String(a_(e))), e.matches(`:active, :focus-visible, .${Ig}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Zg(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Pg) ? e : null;
}
function Qg(e) {
	return e.classList.contains(Fg);
}
function $g(e) {
	return e.closest(`.${Hg} .${zg}`)?.querySelector(Qg(e) ? `.${Pg}:not(.${Fg})` : `.${Fg}`) ?? null;
}
function e_(e, t, n) {
	let r = Number(e.closest(`.${Vg}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(Mg(t, Qg(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, wg(e)));
}
function t_(e) {
	return O(e) || E(e);
}
function n_(e) {
	return e.closest(`.${Vg}`)?.classList.contains(Ug) === !0;
}
function r_(e) {
	let t = e.querySelector(`.${Bg}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : n_(e) ? t.height : t.width;
}
function i_(e) {
	if (!(e instanceof Element) || !e.classList.contains(Pg)) return null;
	let t = e.closest(`.${zg}`), n = Qg(e), r = t?.querySelector(n ? `.${Rg}--end` : `.${Rg}:not(.${Rg}--end)`) ?? null, i = t?.querySelector(n ? `.${Bg}--end` : `.${Bg}:not(.${Bg}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: n_(e)
	};
}
function a_(e) {
	let { min: t, max: n } = wg(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var o_ = {
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
}, s_ = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], c_ = [
	"$n",
	"n$",
	"$ n",
	"n $"
], l_ = [
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
], u_ = [
	"n %",
	"n%",
	"%n",
	"% n"
], d_ = [
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
], f_ = /[1-9]/;
function p_(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return o_;
	try {
		return {
			...o_,
			...JSON.parse(t)
		};
	} catch {
		return o_;
	}
}
function m_(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = g_(t);
	if (r === null) return __(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = v_(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return h_(e, t) ? C_(s_[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = v_(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return h_(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = y_(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return h_(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = v_(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return C_(h_(e, t) ? l_[n.currencyNegativePattern] ?? "-$n" : c_[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = v_(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return C_(h_(e, t) ? d_[n.percentNegativePattern] ?? "-n %" : u_[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return __(e, n);
	}
}
function h_(e, t) {
	return e < 0 && f_.test(t);
}
function g_(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function __(e, t) {
	let { integer: n, fraction: r } = b_(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function v_(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = y_(e, t, n);
	return n === 0 ? S_(o, r, i) : `${S_(o, r, i)}${a}${s}`;
}
function y_(e, t, n) {
	let { integer: r, fraction: i } = b_(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? x_(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function b_(e, t) {
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
function x_(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function S_(e, t, n) {
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
function C_(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var w_ = {
	readCulture: p_,
	format: m_
}, T_ = /^-?(\d+(\.\d*)?|\.\d+)$/;
function E_(e, t, n) {
	if (!T_.test(e)) return e;
	let r = n.thousands ? t : M_(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return m_(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return m_(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function D_(e, t, n) {
	return T_.test(e) ? (j_(n) ? N_(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function O_(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = j_(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!T_.test(d)) return null;
	let f = a ? N_(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function k_(e, t, n, r, i) {
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
function A_(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function j_(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function M_(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function N_(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var P_ = "ui-number-input", F_ = "ui-number-input__field", I_ = "data-ui-number-no-decimals", L_ = "data-ui-number-no-negative", R_ = "data-ui-number-no-thousands", z_ = "data-ui-number-trim-zeros", B_ = "data-ui-number-step", V_ = "data-ui-number-min", H_ = "data-ui-number-max", U_ = "data-ui-number-step-direction", W_ = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${F_}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(si(e.components, `.${F_}`));
		}), T.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${F_}`)));
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
		let t = G_(e);
		if (t !== null) return this.keptValue(t) ?? Y_(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(z_) ? A_(t) : t, r = p_(e), i = e === document.activeElement ? D_(n, r, X_(e)) : J_(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = G_(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(I_), r = !t.hasAttribute(L_), i = t.selectionStart ?? t.value.length, a = k_(t.value, i, p_(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = G_(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = G_(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : Y_(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(z_) && !O(t) && !E(t)) {
			let e = this.values.get(t) ?? "", n = A_(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = G_(e.target);
		if (t === null) return;
		let n = Y_(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = G_(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = D_(t, p_(e), X_(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + U_ + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${F_}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(U_) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = G_(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(B_) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : Y_(e) ?? "0") || 0) + n * t, i = e.getAttribute(V_), a = e.getAttribute(H_);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, Z_(r)), this.show(e);
	}
};
function G_(e) {
	return e instanceof HTMLInputElement && e.classList.contains(F_) ? e : null;
}
function K_(e, t) {
	let n = e.classList.contains(P_) ? e.querySelector(`.${F_}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = q_(n, V_), a = q_(n, H_);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: J_(n, i, p_(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: J_(n, a, p_(n)) }
	} : null;
}
function q_(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function J_(e, t, n) {
	return E_(t, n, {
		format: X_(e),
		thousands: !e.hasAttribute(R_)
	});
}
function Y_(e) {
	return O_(e.value, p_(e), X_(e));
}
function X_(e) {
	return e.closest(`.${P_}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Z_(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function Q_(e, t) {
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
function $_(e) {
	switch (e.getAttribute(pt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function ev(e) {
	let t = $_(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/interactions/drag-marks.ts
function tv(e, t, n, r, i, a = [], o = "move") {
	nv(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	rv(e, i, o);
}
function nv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function rv(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function iv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
//#endregion
//#region src/interactions/item-drags.ts
var av = "application/x-ne-items", ov = null, sv = null;
function cv(e, t, n) {
	let r = e.getAttribute(me), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(M),
		effects: i,
		source: e.getAttribute(he)
	};
}
function lv(e, t) {
	let n = Uo(t);
	return n.includes(e) ? n.filter((t) => t === e || uv(t)) : [e];
}
function uv(e) {
	return !Za(e, "data-ui-undraggable") && !D(e) && j(e) !== null;
}
function dv(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function fv(e, t, n = null) {
	ov = t, sv = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(av, t.kind);
}
function pv(e) {
	return ov !== null && e.dataTransfer?.types.includes(av) === !0 ? ov : null;
}
function mv() {
	let e = sv;
	ov = null, sv = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var hv = `:scope > [${at}], :scope > [${ot}], :scope > [${vt}]`;
function z(e) {
	let t = new Set(e.querySelectorAll(hv));
	return [...e.children].filter((e) => !t.has(e));
}
function gv(e) {
	return e === null ? [] : [e];
}
function _v(e) {
	return e.querySelector(`:scope > [${at}]`);
}
function vv(e, t, n, r, i) {
	i ??= z(e).some((e) => !e.classList.contains(cr));
	let a = _v(e);
	if (i) {
		a?.remove();
		return;
	}
	if (a !== null) return;
	let o = n.getEmptyTemplate(t);
	if (o === void 0) return;
	let s = r.renderFromTemplate(o, null);
	if (s === null) return;
	let c = document.createElement("div");
	c.setAttribute(at, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var yv = { ok: !1 }, bv = {
	ok: !0,
	value: null
}, xv = null;
function Sv(e) {
	xv = e;
}
function Cv(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => kr(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) kr(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return yv;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return yv;
			let t = a[u];
			if (u++, kr(t.kind) === "Dynamic") {
				let n = Dv(e, t.componentId);
				if (!n.ok) return yv;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return yv;
				let e = Pv(s, t.value);
				if (!e.ok) return yv;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return yv;
		if (l) {
			let e = Av(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? yv : {
		ok: !0,
		value: s,
		scope: c
	};
}
function wv(e, t, n) {
	for (let r of t ?? []) {
		if (kr(r.kind) !== "Dynamic") continue;
		let t = C(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Tv(e) {
	let t = kv(e, "IsContent");
	return t.ok && t.value === !0;
}
var Ev = /* @__PURE__ */ new Set();
function Dv(e, t) {
	let n = C(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Ev.has(n) || (Ev.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), yv;
}
function Ov(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = kv(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function kv(e, t) {
	return Av(e, t, !0);
}
function Av(e, t, n) {
	if (e == null) return yv;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return yv;
	let r = e, i = jv(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? yv : (n && xv?.(r, t), bv);
}
function jv(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Mv(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function Mv(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Nv(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => kr(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, kr(e.kind) !== "Dynamic") {
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
function Pv(e, t) {
	if (e == null || t == null) return yv;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : yv;
	if (typeof t != "string") return yv;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Iv(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return yv;
}
function Fv(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Iv(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Iv(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Lv(e) {
	let t = e.closest(x)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Rv(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Lv(e);
	if (a === void 0 && o === null) {
		for (let t of z(e)) t.classList.remove(cr);
		return;
	}
	for (let n of z(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(cr);
			continue;
		}
		n.classList.toggle(cr, !zv(a, e, i, o));
	}
}
function zv(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Wv(e, t, n)) && (r?.filters ?? []).every((e) => Mc(Ov(t, e.itemProperty), e.operator, e.value));
}
function Bv(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Gv(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Vv(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Gv(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function Hv(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Uv(n.getItemValue(e), n.getItemValue(r), t));
}
function Uv(e, t, n) {
	for (let r of n) {
		let n = Kv(Nc(Ov(e, r.itemProperty)), Nc(Ov(t, r.itemProperty)));
		if (n !== 0) return Pr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Wv(e, t, n) {
	if (!Gv(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Mc(Ov(t, e.itemProperty), e.operator, r);
}
function Gv(e, t, n, r) {
	return e == null || Mc(r.get(e, []), t, n);
}
function Kv(e, t) {
	if (e === t) return 0;
	let n = Jv(e), r = Jv(t);
	if (n !== r) return n - r;
	if (n === qv.Nothing) return 0;
	if (n === qv.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var qv = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Jv(e) {
	return e == null ? qv.Nothing : typeof e == "number" ? Number.isNaN(e) ? qv.Nothing : qv.Number : typeof e == "string" && e.trim().length === 0 ? qv.Nothing : Number.isNaN(Number(e)) ? qv.Text : qv.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var Yv = /* @__PURE__ */ new WeakMap();
function Xv(e, t) {
	let n = Yv.get(e), r = n === void 0 ? [...t] : Zv(n, t);
	return Yv.set(e, r), r;
}
function Zv(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function Qv(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function $v(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function ey(e, t, n) {
	return $v(e, t), Qv(e, t, n);
}
function ty(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function ny(e) {
	Yv.delete(e);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var ry = ".ui-items-view__item, .ui-table__row", iy = "ui-row--dragging", ay = "--ui-row-drop-offset", oy = "move";
function sy(e) {
	return {
		name: oy,
		registration: {
			dynamicParameters: (e) => {
				let t = cy(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...Q_((t) => e === void 0 ? null : ly(e, t), (t) => e?.settle(t))
		}
	};
}
function cy(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function ly(e, t) {
	let n = cy(t), r = n === null || !(t.target instanceof Element) ? null : t.target.closest(ry), i = r?.parentElement ?? null;
	return n === null || r === null || i === null || !i.hasAttribute("data-ui-items-host") ? null : e.ahead(i, M(r), n);
}
var uy = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : j(t.row);
		if (t === null || n === null) return;
		let r = hy(t.root, t.row);
		if (r === null ? !gy(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (ss(t.root, Sy(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(Mo), n = t?.parentElement ?? null, r = n?.closest(A) ?? null;
		if (t === null || n === null || r === null || !t.matches(ry) || !n.hasAttribute("data-ui-items-host") || E(r) || !uv(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = li(e);
		return this.services === void 0 || n === null ? !1 : Vv(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, Lv(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : j(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = cv(t.root, n, lv(t.row, Sy(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => j(e) ?? e);
		tv(e, t.root, r, iy, M(t.row), a, dv(i, t.moves)), fv(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = vy(t.root, t.host), r = Sy(t.host), i = py(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? Cy(t.root, null) : Cy(t.root, i, by(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (_y(t) !== _y(e.row)) return null;
		let r = dy(my(e.host, this.services?.keysOf), M(e.row), M(t), n);
		return r === null ? null : r + ev(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && iv(e, t.host) && Cy(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = py(t.host, e.target, e, vy(t.root, t.host), Sy(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && hs(t.row, oy, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (nv(e.root, iy), Cy(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = ns(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || t.row !== null && rm(e.target, t.row) !== null) return;
		let n = Xo(t.root), r = n === null ? [] : Sy(n), i = is(r);
		if (n === null || i === null || this.liftableRow(i)?.moves !== !0) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && hs(i, oy, { index: c });
	}
};
function dy(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = fy(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function fy(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function py(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(Mo);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(Mo) ?? null;
	if (a ??= xy(i, n), a === null) return null;
	let o = (j(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && yy(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function my(e, t) {
	switch ($_(e)) {
		case "virtualized": return [...t?.(e) ?? z(e).map(M)];
		case "windowed": return z(e).map(M);
		default: return Xv(e, z(e)).map(M);
	}
}
function hy(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function gy(e, t) {
	return rm(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function _y(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function vy(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function yy(e, t, n) {
	if (_y(e) !== _y(t)) return !1;
	if (!n.across) return !0;
	let r = (j(e) ?? e).getBoundingClientRect(), i = (j(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function by(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !yy(t.anchor, r, n)) return -1;
	let i = (j(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (j(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function xy(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (j(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function Sy(e) {
	return z(e).filter((e) => e instanceof HTMLElement && e.matches(ry) && j(e) !== null);
}
function Cy(e, t, n = 0) {
	let r = t === null ? null : j(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(ay));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(ay) !== i && r.style.setProperty(ay, i);
}
function wy(e) {
	e.classList.remove(iy), e.querySelector(`:scope > [${_}]`)?.classList.remove(iy);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Ty(e) {
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
		default: o = Iy(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Ey(e, t, n = My()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Dy(e, t = My()) {
	let n = Oy(e.code, t);
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
function Oy(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Ay[e] : void 0) ?? ky[e] ?? e;
}
var ky = {
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
}, Ay = {
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
}, jy = null;
function My() {
	return jy === null && (jy = Ny()), jy;
}
function Ny() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Py = { words(e) {
	let t = Ty(e);
	return t === null ? null : Dy(t);
} };
function Fy(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Iy(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Ly[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Ly[t] ?? null;
}
var Ly = {
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
}, Ry = 120;
function zy(e) {
	return e.typing && e.tallest - e.height > Ry;
}
function By(e) {
	return go(e) || e instanceof HTMLElement && e.isContentEditable;
}
var Vy = class {
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
		let t = zy({
			height: e.height,
			tallest: this.tallest,
			typing: By(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Un, t);
	}
}, Hy = "--ui-tree-drop-depth";
function Uy(e) {
	return e.querySelector(`.${pn}`);
}
function Wy(e, t) {
	if (D(e)) return !1;
	let n = t?.getAttribute(Tn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function Gy(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || Wy(n, Uy(n));
}
function Ky(e, t) {
	let n = Uy(e);
	if (Wy(e, n)) return M(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return Gy(r, t) ? r : null;
}
function qy(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${mn}]`)) n !== t && (n.removeAttribute(mn), n.style.removeProperty(Hy));
	t !== null && (t.setAttribute(mn, n), r === void 0 ? t.style.removeProperty(Hy) : t.style.setProperty(Hy, String(r)));
}
function Jy(e, t, n) {
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
function Yy(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = Xy(e, r, n);
	return i === null || !Zy(e, i.parent) ? null : i;
}
function Xy(e, t, n) {
	if (n === "in") {
		let n = Jy(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Jy(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: $y(e, n, t.parent, !1)
		};
	}
	let r = Qy(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function Zy(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function Qy(e, t) {
	return e.filter((e) => e.parent === t);
}
function $y(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = Qy(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function eb(e, t, n) {
	let r = Qy(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? $y(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var tb = "drop:", nb = "ui-row--cut", rb = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, ib = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, ab = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function ob(e) {
	return {
		dynamicParameters: (e) => {
			let t = sb(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...Q_((t) => cb(e, t), (t) => e?.settle(t))
	};
}
function sb(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function cb(e, t) {
	let n = sb(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var lb = class {
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
		let t = pv(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = ub(t, r, db(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? Xo(e) : null;
		if (r !== null) {
			let i = Sy(r), a = vy(e, r), o = my(r, this.options.keysOf), s = t !== null && n !== null ? py(r, t, n, a, i) : fb(i);
			return {
				index: ((s === null ? null : fy(o, M(s.anchor), s.side)) ?? o.length) + ev(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(ge, "") : Cy(e, s, by(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = pb(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Xo(e) : mb(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => qy(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => e.setAttribute(ge, "")
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(ge), e.matches(".ui-items-view, .ui-table") ? Cy(e, null) : e.classList.contains("ui-tree") && qy(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && iv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), mv(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && $_(e.host) === "plain" && $_(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(tb + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), mv();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.letGo();
				return;
			}
			By(e.target) || (Ey(ab, e) ? this.paste(e, e.target) : Ey(rb, e) ? this.take(e, e.target, !0) : Ey(ib, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (j(e) ?? e).classList.remove(nb);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : ub(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = ns(t), a = i === null ? null : Xo(i.root);
		if (i === null || a === null || E(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = [...a.children].filter((e) => e instanceof HTMLElement && e.matches(Mo) && j(e) !== null), s = i.row ?? is(o), c = s === null || !uv(s) ? null : cv(i.root, a, lv(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (j(e) ?? e).classList.add(nb);
	}
};
function ub(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function db(e) {
	return My() ? e.altKey : e.ctrlKey;
}
function fb(e) {
	let t = as(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function pb(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : Ky(n, (t) => mb(e, t));
}
function mb(e, t) {
	return e.querySelector(`.${fn}[${v}="${Sr(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var B = "ui-temporal-input", hb = "ui-calendar", gb = `.${B}, .${hb}`, _b = "ui-temporal-input__value-input", vb = "ui-temporal-input__end-value-input", yb = "data-ui-temporal-range", bb = "data-ui-temporal-end", xb = "data-ui-temporal-mode", Sb = "data-ui-temporal-format", Cb = "data-ui-temporal-default-format", wb = "data-ui-temporal-min", Tb = "data-ui-temporal-max", Eb = "data-ui-temporal-step", Db = "data-ui-temporal-step-unit", Ob = "data-ui-temporal-marked-days", kb = "data-ui-temporal-marked-only", Ab = "data-ui-temporal-page-culture", jb = "data-ui-temporal-months", Mb = "data-ui-temporal-months-genitive", Nb = "data-ui-temporal-months-short", Pb = "data-ui-temporal-daynames", Fb = "data-ui-temporal-weekdays", Ib = "data-ui-temporal-first-day", Lb = "data-ui-temporal-am", Rb = "data-ui-temporal-pm", zb = /* @__PURE__ */ new Set([
	Sb,
	Cb,
	wb,
	Tb,
	jb,
	Lb,
	Rb,
	Ob,
	kb
]), Bb = 2e3;
function Vb(e) {
	let t = e.getAttribute(xb);
	return t === "time" || t === "date-time" ? t : "date";
}
function Hb(e) {
	let t = e.getAttribute(Sb);
	return t === null || t.trim().length === 0 ? e.getAttribute(Cb) ?? "" : t;
}
function Ub(e) {
	let t = e.getAttribute(Db), n = Math.max(1, Math.trunc(Number(e.getAttribute(Eb))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Wb(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Gb(e) {
	return {
		monthNames: Kb(e, jb),
		monthGenitiveNames: Kb(e, Mb),
		abbreviatedMonthNames: Kb(e, Nb),
		dayNames: Kb(e, Pb),
		abbreviatedDayNames: Kb(e, Fb),
		amDesignator: e.getAttribute(Lb) ?? "AM",
		pmDesignator: e.getAttribute(Rb) ?? "PM"
	};
}
function Kb(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function qb(e, t) {
	e.hasAttribute(Ab) && (Zb(e, Mb, t.monthGenitiveNames.join("|")), Zb(e, Nb, t.abbreviatedMonthNames.join("|")), Zb(e, Pb, t.dayNames.join("|")), Zb(e, Fb, t.abbreviatedDayNames.join("|")), Zb(e, jb, t.monthNames.join("|")), Zb(e, Lb, t.amDesignator), Zb(e, Rb, t.pmDesignator), Zb(e, Cb, Xb(Vb(e), Ub(e), t)));
}
function Jb(e) {
	for (let t = 0; t < e.length;) {
		let n = ki(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Yb(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function Xb(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : bi(n, r);
}
function Zb(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Qb(e) {
	return e.hasAttribute(yb);
}
function $b(e) {
	return e !== null && e.hasAttribute(bb);
}
function ex(e) {
	return V(e, !1);
}
function V(e, t) {
	let n = tx(e, t);
	return n === null ? null : px(n.value, Vb(e));
}
function tx(e, t) {
	return e.querySelector(`.${t ? vb : _b}`);
}
function nx(e, t) {
	return px(e.getAttribute(t) ?? "", Vb(e));
}
function rx(e) {
	let t = nx(e, wb), n = nx(e, Tb), r = (e.getAttribute(Ob) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : mx(t, "date"),
		max: n === null ? null : mx(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(kb)
	};
}
function ix(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function ax(e, t, n) {
	let r = tx(e, n);
	if (r === null) return;
	let i = t === null ? "" : mx(t, Vb(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function ox(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : zi(n, Hb(e), Gb(e));
	return r === null ? n : mx(Pi(r), Vb(e));
}
function sx(e) {
	if (!Qb(e)) return;
	let t = V(e, !1), n = V(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (ax(e, n, !1), ax(e, t, !0));
}
function cx(e) {
	let t = nx(e, wb), n = nx(e, Tb);
	if (t === null && n === null) return null;
	for (let r of Qb(e) ? [!1, !0] : [!1]) {
		let i = V(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: wi(t, Hb(e), Gb(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: wi(n, Hb(e), Gb(e)) }
		};
	}
	return null;
}
function lx(e) {
	return dx(e, ux(e, /* @__PURE__ */ new Date()));
}
function ux(e, t) {
	let n = nx(e, wb), r = nx(e, Tb);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function dx(e, t) {
	let n = Ub(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var fx = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function px(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = fx.exec(n);
		return e === null ? null : new Date(Bb, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Ni(n);
	return r === null ? null : Pi(r);
}
function mx(e, t) {
	let n = `${hx(e.getHours())}:${hx(e.getMinutes())}:${hx(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${hx(e.getMonth() + 1)}-${hx(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function hx(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function gx(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = yx(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < bx(e.start).getTime() ? {
		start: yx(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: yx(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function _x(e, t, n) {
	if (t === null || n === null) return !1;
	let r = bx(e).getTime();
	return r > bx(t).getTime() && r < bx(n).getTime();
}
function vx(e, t, n) {
	return !n && _x(e, t.start, t.end);
}
function yx(e, t) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function bx(e) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var xx = "ui-temporal-input__day", Sx = "ui-temporal-input__month", Cx = "data-ui-temporal-nav", wx = "data-ui-temporal-day", Tx = 366;
function Ex(e) {
	let t = ex(e);
	return {
		view: Jx(t ?? ux(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function Dx(e, t, n, r) {
	let i = qx("div", `${B}__calendar`), a = qx("div", `${B}__calendar-header`), o = rx(e), s = Kx("previous", "‹", T.text("ui.picker.previous"));
	s.disabled = Ox(o, t, -1) === null, a.append(s);
	let c = Kx("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${B}__calendar-label`), a.append(c);
	let l = Kx("next", "›", T.text("ui.picker.next"));
	return l.disabled = Ox(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? Mx(e, t, n, r, o) : Nx(t, n, o)), i;
}
function Ox(e, t, n) {
	let r = t.pane === "months", i = Zx(t.view, n * (r ? 12 : 1));
	return Ax(e, kx(i, r ? 4 : 7)) ? jx(e, i) : null;
}
function kx(e, t) {
	return mx(e, "date").slice(0, t);
}
function Ax(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function jx(e, t) {
	let n = kx(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : px(r, "date");
	return i === null ? t : Jx(i);
}
function Mx(e, t, n, r, i) {
	let a = Ux(e), o = qx("div", `${B}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = qx("span", `${B}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = qx("div", `${B}__days`), c = bx(/* @__PURE__ */ new Date()), l = Qb(e), u = l ? V(e, !1) : r, d = l ? V(e, !0) : null, f = Yx(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = Xx(f, e), r = mx(n, "date"), a = qx("button", xx);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(wx, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${xx}--outside`), Qx(n, c) && (a.classList.add(`${xx}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${xx}--marked`);
		let o = u !== null && Qx(n, u), p = d !== null && Qx(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${xx}--selected`), l && (o || p) && a.setAttribute("aria-description", T.text(o ? "ui.picker.start" : "ui.picker.end")), vx(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${xx}--within`), ix(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = qx("div", `${B}__calendar-pane`);
	return p.append(o, s), p;
}
function Nx(e, t, n) {
	let r = qx("div", `${B}__months`);
	for (let i = 0; i < 12; i++) {
		let a = qx("button", Sx);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(Cx, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Sx}--selected`), a.setAttribute("aria-current", "true")), Ax(n, kx(Fi(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function Px(e) {
	let t = qx("div", `${B}__period-caption`);
	return t.textContent = T.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Fx(e, t, n) {
	let r = rx(e);
	if (n.startsWith("month:")) {
		let e = Fi(t.view.getFullYear(), Number(n.slice(6)), 1);
		return Ax(r, kx(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = Ox(r, t, -1) ?? t.view, !0;
		case "next": return t.view = Ox(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function Ix(e, t, n) {
	if (Qb(e)) {
		Lx(e, t, n);
		return;
	}
	let r = Rx(n, ex(e) ?? lx(e));
	t.focusedDay = r, t.view = Jx(r), ax(e, r, !1);
}
function Lx(e, t, n) {
	let r = gx({
		start: V(e, !1),
		end: V(e, !0)
	}, t.activeEnd, Rx(n, lx(e)));
	t.focusedDay = r.end ?? r.start, t.view = Jx(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, ax(e, r.end, !0), ax(e, r.start, !1);
}
function Rx(e, t) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function zx(e, t, n) {
	let r = Vx(n), i = Hx(t, n, Ux(e));
	if (i === null) return null;
	let a = rx(e);
	if (r === 0) return Bx(a, i);
	let o = i;
	for (let e = 0; e < Tx; e++) {
		if (ix(a, mx(o, "date"))) return o;
		o = Xx(o, r);
	}
	return t;
}
function Bx(e, t) {
	let n = mx(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : px(r, "date");
	return i === null ? t : Rx(i, t);
}
function Vx(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function Hx(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Xx(e, -1);
		case "ArrowRight": return Xx(e, 1);
		case "ArrowUp": return Xx(e, -7);
		case "ArrowDown": return Xx(e, 7);
		case "PageUp": return Zx(e, -1);
		case "PageDown": return Zx(e, 1);
		case "Home": return Xx(e, -r);
		case "End": return Xx(e, 6 - r);
		default: return null;
	}
}
function Ux(e) {
	let t = Number(e.getAttribute(Ib));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Wx(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${xx}`)];
	if (i.length === 0) return;
	let a = mx(bx(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (k(i, o), r && N(o));
}
function Gx(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? V(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${xx}`)) {
		let e = px(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${xx}--preview`, e !== null && n !== null && r !== null && _x(e, n, Xx(r, 1)));
	}
}
function Kx(e, t, n) {
	let r = qx("button", `${B}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Cx, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function qx(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Jx(e) {
	return Fi(e.getFullYear(), e.getMonth(), 1);
}
function Yx(e, t) {
	let n = Jx(e);
	return Xx(n, -((n.getDay() - t + 7) % 7));
}
function Xx(e, t) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Zx(e, t) {
	let n = Fi(e.getFullYear(), e.getMonth() + t, 1), r = Fi(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Fi(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Qx(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var $x = "ui-temporal-input__field", eS = "ui-temporal-input__popup", tS = "ui-temporal-input--open", nS = "ui-calendar__body", rS = "ui-temporal-input__time-cell", iS = "ui-temporal-input__time-column", aS = 140, oS = "data-ui-temporal-toggle", sS = "data-ui-temporal-unit", cS = "data-ui-temporal-cell", lS = "data-ui-temporal-centred", uS = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new pu({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(tS), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(tS);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(gb)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = si(e.components, gb), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && dS(e) && this.states.set(e, Ex(e)), this.isShowing(e) && this.renderSurface(e);
		}), F(this.root, gb, { attributeFilter: [...zb] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), F(this.root, gb, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), T.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) dS(e) && fS(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(gb)], t = T.temporal;
		if (t !== null && T.language !== this.drawnLanguage) {
			this.drawnLanguage = T.language;
			for (let n of e) qb(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || dS(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${nS}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && fS(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Li(Hb(t), DS()), n = Oi(Hb(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${$x}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = tx(t, $b(r))?.value ?? "", a = px(i, Vb(t));
				if (a !== null) {
					r.value = wi(a, Hb(t), Gb(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains($x)) return;
		let t = e.target.closest(`.${B}`), n = t === null ? null : tx(t, $b(e.target));
		if (t === null || n === null) return;
		let r = ox(t, e.target.value), i = px(r, Vb(t)), a = i === null ? r : mx(i, Vb(t));
		if (pS(t, a)) {
			let n = V(t, $b(e.target));
			e.target.value = n === null ? "" : wi(n, Hb(t), Gb(t));
			return;
		}
		$b(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), sx(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains($x)) return;
		let t = e.target.closest(`.${B}`);
		t !== null && Qb(t) && (this.getState(t).activeEnd = $b(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Qb(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${wx}]`) : null, r = this.getState(t), i = n === null ? null : px(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Gx(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${wx}], .${rS}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(rS) ? AS(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = fS(e), r = px(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, k([...n.querySelectorAll(`.${xx}`)], t), Ms(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains($x)) return;
		let t = e.target.closest(`.${B}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${oS}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${B}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${Cx}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${wx}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${cS}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${sS}]`)?.getAttribute(sS);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(cS)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (Fx(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, lx(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Qb(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = px(t, "date");
		if (n === null || O(e) || E(e) || !ix(rx(e), t)) return;
		let r = this.getState(e);
		dS(e) && Qb(e) && !r.choosingEnd && V(e, !1) !== null && V(e, !0) !== null && (r.activeEnd = "start");
		let i = tx(e, !1), a = `${i?.value ?? ""}|${tx(e, !0)?.value ?? ""}`;
		Ix(e, r, n), dS(e) && `${i?.value ?? ""}|${tx(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Qb(e) && this.getState(e).activeEnd === "end", i = new Date(V(e, r) ?? lx(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		ax(e, t, n), sx(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains($x)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${B}`), $b(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(rS)) {
			jS(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = px(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, mx(n, "date"));
			return;
		}
		let r = zx(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Jx(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${iS}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, aS)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${iS}`), n = t?.getAttribute(sS) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Mf(this.wheelTurns.get(n) ?? 0, jf(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${rS}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${rS}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${rS}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(cS)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(lS));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(sS), i = SS(e);
		if (!(r === null || i === null || i.classList.contains(`${rS}--selected`))) {
			if (i.matches(":disabled")) {
				bS(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(cS)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${eS}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Qb(e) ? t ?? (V(e, !1) === null ? "start" : V(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = V(e, r.activeEnd === "end") ?? ex(e);
		r.pane = "days", r.view = Jx(i ?? ux(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${oS}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => kS(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = Ex(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = fS(e);
		if (n === null) return;
		let r = dS(e), i = Vb(e), a = this.getState(e), o = Gb(e), s = Qb(e), c = V(e, s && a.activeEnd === "end"), l = CS(n), u = wS(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(Px(a)), r) n.append(Dx(e, a, o, c));
		else {
			let t = qx("div", `${B}__panes`);
			t.append(Dx(e, a, o, c)), i === "date-time" && t.append(mS(e, c)), n.append(t, ES(i));
		}
		let f = u === null ? null : n.querySelector(`[${Cx}="${Sr(u)}"]:not(:disabled)`);
		Wx(n, a, c, t || d && l === null && f === null), Gx(e, a), r || (yS(n), bS(n), TS(n, l)), f !== null && N(f), r || this.popups.reposition(e);
	}
};
function dS(e) {
	return e.classList.contains(hb);
}
function fS(e) {
	return e.querySelector(`.${dS(e) ? nS : eS}`);
}
function pS(e, t) {
	let n = rx(e), r = n.markedOnly ? px(t, Vb(e)) : null;
	return r !== null && !n.marked.has(mx(r, "date"));
}
function mS(e, t) {
	let n = Ub(e), r = qx("div", `${B}__time`), i = qx("div", `${B}__time-columns`);
	for (let r of hS(n)) i.append(vS(e, r, gS(n, r), t));
	return r.append(i), r;
}
function hS(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function gS(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function _S(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function vS(e, t, n, r) {
	let i = qx("div", iS);
	i.setAttribute(sS, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", T.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = _S(r, t), s = t === "hour" && Jb(Hb(e)), c = Gb(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = qx("button", rS);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Yb(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(cS, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${rS}--selected`), FS(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function yS(e) {
	let t = e.querySelector(`.${B}__calendar`), n = e.querySelector(`.${B}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function bS(e) {
	for (let t of e.querySelectorAll(`.${iS}`)) {
		let e = t.querySelector(`.${rS}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, xS(t, e), t.setAttribute(lS, String(t.scrollTop));
	}
}
function xS(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function SS(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${rS}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function CS(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(rS) ? null : t.closest(`.${iS}`)?.getAttribute(sS) ?? null;
}
function wS(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Cx) : null;
}
function TS(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${iS}[${sS}="${t}"]`)?.querySelector(`.${rS}--selected`) ?? null;
	n !== null && N(n);
}
function ES(e) {
	let t = qx("div", `${B}__popup-footer`);
	return t.append(Kx("now", T.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Kx("clear", T.text("ui.picker.clear"))), t.append(Kx("done", T.text("ui.picker.done"))), t;
}
function DS() {
	return {
		year: OS("ui.picker.letter.year", Ii.year),
		month: OS("ui.picker.letter.month", Ii.month),
		day: OS("ui.picker.letter.day", Ii.day),
		hour: OS("ui.picker.letter.hour", Ii.hour),
		minute: OS("ui.picker.letter.minute", Ii.minute),
		second: OS("ui.picker.letter.second", Ii.second)
	};
}
function OS(e, t) {
	let n = T.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function kS(e, t) {
	for (let n of e.querySelectorAll(`.${$x}`)) if ($b(n) === t) return n;
	return e.querySelector(`.${$x}`);
}
function AS(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(rS) && Ms(e);
}
function jS(e) {
	let t = e.target, n = t.closest(`.${iS}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? NS(n, e.key === "ArrowRight" ? 1 : -1) : MS(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), PS(r));
}
function MS(e, t, n) {
	return yo({
		key: n,
		items: [...e.querySelectorAll(`.${rS}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function NS(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${iS}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${rS}--selected`) ?? r.querySelector(`.${rS}:not(:disabled)`);
}
function PS(e) {
	let t = e.closest(`.${iS}`);
	t !== null && xS(t, e);
}
function FS(e, t, n, r) {
	let i = nx(e, wb), a = nx(e, Tb);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var IS = "[data-ui-theme-switcher]", LS = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(IS) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Dr.SetTheme,
				mode: RS() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function RS() {
	let e = document.documentElement.getAttribute(Ln);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var zS = `[${Bn}]`, BS = "ui-language-switcher__trigger", VS = "ui-language-switcher__label-text", HS = "ui-language-switcher__label-text--current", US = "ui-language-switcher__label-text--page", WS = "ui-language-switcher__menu", GS = "ui-language-switcher__choice", KS = "ui-language-switcher--open", qS = "ui.language.switch", JS = "ui.language.current", YS = class {
	options;
	root;
	menus = new pu({
		show: ({ owner: e }) => e.classList.add(KS),
		hide: ({ owner: e }) => e.classList.remove(KS),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), T.onChange(() => this.showLanguage(T.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${GS}`), n = e.target.closest(zS);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Vn));
			return;
		}
		let r = e.target.closest(`.${BS}`);
		if (r === null || E(r)) return;
		e.preventDefault();
		let i = XS(n);
		if (i.length === 2) {
			let e = T.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(zS);
		if (t === null) return;
		let n = XS(t), r = e.target.closest(`.${BS}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !bo(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = yo({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${GS}`);
		if (t === null || t === document.activeElement || E(t)) return;
		let n = t.closest(zS);
		n !== null && this.menus.isOpen(n) && Ms(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${WS}`);
		if (r === null) return;
		let i = XS(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Gs(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Dr.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(zS)) {
			let n = t.querySelector(`:scope > .${BS}`);
			if (n === null) continue;
			let r = XS(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${VS}`)) {
				let n = t.getAttribute(Vn) === e;
				t.classList.toggle(HS, n), t.classList.contains(US) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				T.write(n, "aria-label", qS, {
					language: ZS(r, e),
					code: QS(e),
					other: ZS(r, t),
					otherCode: QS(t)
				});
			} else T.write(n, "aria-label", JS, {
				language: ZS(r, e),
				code: QS(e)
			});
		}
	}
};
function XS(e) {
	return [...e.querySelectorAll(`:scope > .${WS} > .${GS}`)];
}
function ZS(e, t) {
	let n = e.find((e) => e.getAttribute(Vn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return QS(t);
	}
}
function QS(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var $S = `${Oe}__button`, eC = `${Oe}__more`, tC = `.${b}:not(${qt})`, nC = "ui-text__icon", rC = `.ui-button__content .${nC}`, iC = ".ui-button__content .ui-text__title", aC = /* @__PURE__ */ new WeakMap();
function oC(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(tC)) sC(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(Jt) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function sC(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function cC(e, t) {
	let n = t.entries.map((e) => lC(e, t));
	return t.more && t.openMore !== void 0 && n.push(dC(t.openMore)), e.replaceChildren(...n), n;
}
function lC(e, t) {
	let n = fC($S), r = mC(e), i = uC(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), E(e) && (n.classList.add(ar), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), aC.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function uC(e) {
	let t = e.querySelector(rC);
	if (t === null || !t.className.split(" ").some(sf)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(nC), n.setAttribute(nf, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(rf);
	return r.length > 0 && n.style.setProperty(rf, r), n;
}
function dC(e) {
	let t = fC(`${$S} ${eC}`);
	return t.setAttribute("aria-haspopup", "menu"), T.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function fC(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${gr}`, t.tabIndex = -1, t;
}
function pC(e) {
	return aC.get(e) ?? null;
}
function mC(e) {
	return e.querySelector(iC)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var hC = 500, gC = 10, _C = /* @__PURE__ */ new WeakSet();
function vC(e) {
	return _C.has(e);
}
var yC = class {
	opensMenu;
	press = null;
	answered = null;
	openedAt = null;
	slid = !1;
	constructor(e) {
		this.opensMenu = e.opensMenu, e.root.addEventListener("pointerdown", (e) => this.handleDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handleMove(e), !0), e.root.addEventListener("pointerup", () => this.cancel(), !0), e.root.addEventListener("pointercancel", () => this.cancel(), !0), e.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), (e.first ?? e.root).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleDown(e) {
		let t = e;
		if (this.answered = null, this.openedAt = null, this.slid = !1, this.press !== null) {
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
			timer: setTimeout(() => this.fire(), hC)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > gC && (this.slid = !0), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > gC && this.cancel();
	}
	cancel() {
		this.press !== null && (clearTimeout(this.press.timer), this.press = null);
	}
	fire() {
		let e = this.press;
		if (this.press = null, e === null || !e.target.isConnected) return;
		let t = new MouseEvent("contextmenu", {
			bubbles: !0,
			cancelable: !0,
			button: 2,
			clientX: e.x,
			clientY: e.y
		});
		_C.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!_C.has(e)) {
			if (this.answered !== null && e.target instanceof Node && this.answered.contains(e.target)) {
				e.preventDefault(), e.stopImmediatePropagation();
				return;
			}
			this.cancel();
		}
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target : null;
		this.answered === null || t === null || this.slid && t.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, bC = "tabs:rename", xC = "tabs:pin", SC = "tabs:unpin", CC = "tabs:close", wC = "tabs:delete";
function TC(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function EC(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[bC, e.rename && t.renamable],
		[xC, e.pin && !t.pinned],
		[SC, e.pin && t.pinned],
		[CC, e.close && !e.delete && n],
		[wC, e.delete && n]
	]);
}
function DC(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var OC = "data-ui-context-menu-owner", kC = xe, AC = "ui-context-menu--open", jC = `.${b}:not(${qt})`, MC = `${Oe}--strip`, NC = `.${Oe}:not(.${MC}) > .${eC}`, PC = "input, textarea, select, [contenteditable=''], [contenteditable='true']", FC = "ui-context-menu-opening", IC = Yt, LC = class {
	root;
	closed = null;
	menus = new pu({
		show: ({ popup: e }) => e.classList.add(AC),
		hide: ({ popup: e }, t) => {
			e.classList.remove(AC), this.closed = e, t === "outside" && XC();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new yC({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${OC}]`) !== null && e.closest(PC) === null
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
	}
	get openMenu() {
		let e = this.menus.current;
		return e === null ? null : this.menus.popupOf(e);
	}
	handleContextMenu(e) {
		if (!(e instanceof MouseEvent) || !(e.target instanceof Element)) return;
		let t = e.target;
		if (this.openMenu !== null && e.composedPath().includes(this.openMenu)) {
			e.preventDefault();
			return;
		}
		let n = RC(t);
		n !== null && (e.preventDefault(), this.open(n.owner, n.menu, e.clientX, e.clientY, UC(e) ? t : null, t.closest(NC)));
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${MC}`)?.remove(), WC(t), i !== null && GC(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && qC(t), this.closed !== null && (Kc(this.closed), this.closed = null);
		let o = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Os(), s = {
			placement: "bottom-start",
			surface: a?.closest(".ui-action-bar") ?? void 0
		}, c = a === null ? {} : {
			anchor: a,
			placement: s
		};
		this.menus.open({
			owner: e,
			popup: t,
			...c,
			returnFocus: () => (o === null ? null : Ks(o)) ?? Ks(e)
		}) && (a === null && Il(t, n, r), YC(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(IC) !== null || this.menus.close();
	}
};
function RC(e) {
	let t = e.closest(`[${de}]`);
	for (let n = e.closest(`[${OC}]`); n !== null; n = n.parentElement?.closest(`[${OC}]`) ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = BC(n, e);
		if (r.length === 0 || E(n)) continue;
		if (QC(n)) return null;
		let i = r.find((t) => VC(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var zC = `[${OC}]`;
function BC(e, t) {
	let n = t.closest(`[${Se}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? ZC(e, r) : null, ZC(e, "")].filter((e) => e !== null);
}
function VC(e, t, n) {
	let r = new CustomEvent(FC, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function HC(e, t) {
	let n = e.closest(`[${OC}]`), r = e.closest(`[${de}]`);
	return n === null || E(n) || QC(n) || r !== null && n.contains(r) ? null : BC(n, e).find((n) => VC(n, e, t)) ?? null;
}
function UC(e) {
	let t = e.pointerType;
	return vC(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : As();
}
function WC(e) {
	for (let t of e.querySelectorAll(`[${Ee}]`)) t.removeAttribute(Ee);
}
function GC(e, t, n) {
	let r = n.closest(`[${Ce}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !BC(e, r).includes(t)) return;
	let { entries: i } = oC(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Oe} ${MC}`, a.setAttribute("role", "group"), cC(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: KC
	}), t.insertBefore(a, t.firstElementChild);
}
function KC(e) {
	E(e) || e.click();
}
function qC(e) {
	let { entries: t } = oC(e), n = e.querySelector(`.${Ut}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) JC(e);
	let r = L(n, `.${b}`, `.${Ut}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && sC(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(qt)) ? JC(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Ht);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	DC(a).forEach((e, t) => {
		a[t] === "rule" && !e && JC(i[t]);
	});
}
function JC(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ee, "");
}
function YC(e) {
	let t = e.querySelector(`.${Ut}`);
	t !== null && Gs(e, L(t, jC, `.${Ut}`));
}
function XC() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${_s}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function ZC(e, t) {
	for (let n of e.querySelectorAll(`[${kC}]`)) if ((n.getAttribute(kC) ?? "") === t && n.closest(`[${OC}]`) === e) return n;
	return null;
}
function QC(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${v}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function $C(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function ew(e) {
	return getComputedStyle(e).display !== "none";
}
function tw(e) {
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
				if (e.overflowX !== "visible" && iw(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && iw(n, a, a + t.clientHeight, !1), aw(n)) return !0;
			}
			r = e.position;
		}
	}
	return iw(n, 0, window.innerWidth, !0), iw(n, 0, window.innerHeight, !1), aw(n);
}
function nw(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !$C(n, !1)) && (rw(e.overflowX) || rw(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function rw(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function iw(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function aw(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var ow = `[${Ce}]`, sw = `[${Hl}]:not([hidden]), dialog[open]`, cw = `.${Oe}`, lw = `${Oe}--out`, uw = 6, dw = "--ui-action-bar-gap", fw = 400, pw = /* @__PURE__ */ new WeakMap(), mw = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	De,
	...nr
], hw = class {
	root;
	shown = /* @__PURE__ */ new Map();
	chosen = null;
	identity = null;
	scopeObserver = null;
	pendingTap = null;
	cameFrom = null;
	menuHost = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e)), this.root.addEventListener("pointerup", (e) => this.handlePointerUp(e)), this.root.addEventListener("pointercancel", () => {
			this.pendingTap = null;
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0);
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${cw}, [data-ui-context-menu]`) !== null) return;
		let r = gw(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : yw(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? bw(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(cw) === null && UC(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(cw);
		if (n !== null) {
			this.isHostedBar(n) && k(Dw(n), t);
			return;
		}
		ks() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(_w(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(cw) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(A) && this.choose(_w(t));
			return;
		}
		let n = t.closest(cw);
		if (n !== null && t.classList.contains($S)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest(sw);
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(A)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(A) && this.choose(_w(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && jw(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Ks(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = Dw(t), i = yo({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), k(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : yw(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = nw(e);
		if (t === void 0 || n === null || !$C(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + Sw(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, dl(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		HC(e, !0) === null && this.hide(e, t);
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
				this.chosen = bw(e), this.sync();
			}
			for (let e of this.shown.values()) dl(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = HC(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Oe, n.setAttribute("role", "toolbar"), T.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(He, ""), n.setAttribute(pe, ""), !Cw(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, Ew(e)), al(e, n, {
			placement: xw(e),
			gap: Sw(e),
			boundary: nw(e) ?? void 0
		}), n.classList.toggle(lw, tw(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: mw
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		}), pw.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : pC(r);
		if (!Cw(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = Dw(t.bar), o = a.find((e) => pC(e) === i) ?? a.find(So) ?? null;
		o !== null && (k(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || kw(t)) return;
		if (this.menuHost = e, Aw(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		ww(n.bar, !0);
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
		ww(t.bar, !1);
		let n = document.activeElement;
		!ks() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && Tw(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), fl(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(lw, tw(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : Dw(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function gw(e) {
	let t = e.closest(ow);
	if (t !== null) return t;
	let n = e.closest(`[${v}]`), r = e.closest(x);
	return n === null || r !== null && !r.contains(n) ? null : vw(n)[0] ?? null;
}
function _w(e) {
	if (e.matches(A)) for (let t of e.querySelectorAll(`[${ke}]`)) {
		if (t.closest(A) !== e) continue;
		let n = vw(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(ow);
}
function vw(e) {
	let t = [...e.querySelectorAll(ow)];
	return e.matches(ow) ? [e, ...t] : t;
}
function yw(e) {
	let t = e.getAttribute(we);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: we,
		key: t,
		index: 0
	};
	let n = e.closest(`[${v}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: v,
		key: r,
		index: vw(n).indexOf(e)
	};
}
function bw(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return vw(t)[e.index] ?? null;
	return null;
}
function xw(e) {
	let t = e.getAttribute(Ce);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function Sw(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(dw));
	return Number.isFinite(t) ? t : uw;
}
function Cw(e, t, n, r) {
	let { entries: i, more: a } = oC(t);
	if (i.length === 0 && !a) return !1;
	let o = cC(e, {
		entries: i,
		more: a,
		role: "button",
		press: Ow,
		openMore: n
	});
	return k(o, o.find((e) => !E(e)) ?? o[0] ?? null), ww(e, r), !0;
}
function ww(e, t) {
	Tw(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function Tw(e) {
	return Dw(e).find((e) => pC(e) === null) ?? null;
}
function Ew(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function Dw(e) {
	return [...e.querySelectorAll(`:scope > .${$S}`)];
}
function Ow(e, t) {
	if (E(t) || kw(t)) return;
	let n = HC(t, !1);
	n === null || !n.contains(e) || E(e) || !sC(e, n) || e.click();
}
function kw(e) {
	let t = e.closest(cw), n = t === null ? void 0 : pw.get(t);
	return n !== void 0 && As() && Date.now() - n < fw;
}
function Aw(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function jw(e) {
	return e.matches(_s) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Mw = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Nw = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
}, Pw = `(min-width: ${Nw.md}px)`;
function Fw(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Nw[t]}px)`)) return t;
	return "base";
}
function Iw(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function H(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Lw(e, t) {
	let n;
	for (let r of Mw) {
		let i = H(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/state/client-store.ts
var Rw = "ne.ui", zw = "boot", Bw = /* @__PURE__ */ new Set(), Vw = class {
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
		let r = this.resolveKey(e, zw);
		if (r !== null) try {
			let e = window.localStorage.getItem(r), i = e === null ? {} : JSON.parse(e);
			n === null ? delete i[t] : i[t] = n, Object.keys(i).length === 0 ? window.localStorage.removeItem(r) : window.localStorage.setItem(r, JSON.stringify(i));
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
		let n = e.getAttribute(Le);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Bw.has(n) || (Bw.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Rw}:${n}:${t}`;
	}
}, Hw = "ui-menu--nested", Uw = "ui-menu__submenu", Ww = Mt, Gw = Pt, Kw = "data-ui-menu-flyout", qw = `[${Kw}], .ui-context-menu, .${ur}`, Jw = "data-ui-menu-unfolded", Yw = Nt, Xw = "menu-open-group", Zw = Ve("click"), Qw = class {
	root;
	store = new Vw();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new pu({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(Gw, ""), t.setAttribute(Kw, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(Gw), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(Kw);
			}, P.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${Ut}`)), F(this.root, `.${Ut}`, {
			childList: !0,
			attributeFilter: [jt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${Ww}]`)) $w(e);
		F(this.root, `[${Ww}]`, {
			childList: !0,
			attributeFilter: [Gw]
		}, (e) => {
			for (let t of e) $w(t);
		}), typeof matchMedia == "function" && matchMedia(Pw).addEventListener("change", () => this.closeBarFlyout());
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = rT(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), eT(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Ww}]`)) $w(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Gt}`), e);
		if (t !== null && !t.hasAttribute(Yw)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Hw) ? null : this.store.read(e, Xw), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${b}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
		if (t !== null && r !== null && r.contains(t)) {
			t.getAttribute("data-ui-menu-item-kind") !== "check" && this.flyouts.close();
			return;
		}
		let i = t === null ? null : this.ownGroupOf(t);
		if (t === null || i === null) {
			this.flyouts.close();
			return;
		}
		e.preventDefault();
		let a = i.closest(`.${Ut}`);
		a !== null && (rT(a) || i.hasAttribute(Yw) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Hw);
		if (e.setAttribute(Jw, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(Gw);
			return;
		}
		if (t.hasAttribute(Gw)) {
			t.removeAttribute(Gw), n || this.store.write(e, Xw, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Xw, t.getAttribute(v));
	}
	openInline(e) {
		e.setAttribute(Gw, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Ww}][${Gw}]`)) t.hasAttribute(Yw) || t.removeAttribute(Gw);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		eT(e), this.closeGroups(e);
		let a = n.closest(qw) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${tT(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Ut}`);
		o !== null && !ks() && Gs(o, L(o, `.${b}:not(${qt})`, `.${Ut}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Ww}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Jt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Ww}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Uw}`);
	}
};
function $w(e) {
	let t = e.querySelector(`:scope > .${b}`), n = e.closest(`.${Ut}`);
	t !== null && (t.setAttribute(Zw, ""), t.setAttribute(He, ""), t.setAttribute("aria-expanded", e.hasAttribute(Gw) ? "true" : "false"), e.hasAttribute(Yw) || n !== null && rT(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function eT(e) {
	for (let t of e.querySelectorAll(`[${Kw}]`)) t.removeAttribute(Kw);
}
function tT(e) {
	return nT(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function nT(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(Pw).matches;
}
function rT(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/rendering/inline-markup.ts
var iT = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, aT = "\\", oT = "`", sT = "!", cT = "{", lT = "}", uT = "ui-text__fold", dT = "ui-text__fold-toggle", fT = "ui-text__fold-content", pT = 8;
function mT(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return ET(new FT(e), 0, e.length, iT.None, null, t, n), DT(t, n, iT.None, null), t;
}
function hT(e) {
	return mT(e).map((e) => bT(e) ? `${e.fold} ${hT(e.text)}` : e.text).join("");
}
function gT(e) {
	let t = "";
	for (let n of e) t += RT(n) ? aT + n : n;
	return t;
}
function _T(e, t, n = {}) {
	let r = mT(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && vT(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(xT(r, n));
}
function vT(e) {
	return e.styles === iT.None && e.url === null && !yT(e) && !bT(e);
}
function yT(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function bT(e) {
	return e.fold !== null && e.fold !== void 0;
}
function xT(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(ST(r, t));
	return n;
}
function ST(e, t) {
	if (yT(e)) return wT(e.icon);
	let n = bT(e) ? CT(e, t) : document.createTextNode(e.text);
	if ((e.styles & iT.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & iT.Strikethrough) !== 0 && (n = TT("s", n)), (e.styles & iT.Underline) !== 0 && (n = TT("u", n)), (e.styles & iT.Italic) !== 0 && (n = TT("em", n)), (e.styles & iT.Bold) !== 0 && (n = TT("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Vd(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function CT(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${uT} ${uT}--static` : uT, r.className = dT, r.textContent = e.fold ?? "", i.className = fT, i.append(xT(mT(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(He, ""), n.append(r, i), n);
}
function wT(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", af(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function TT(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function ET(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === aT && c + 1 < n && RT(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = OT(e, c, n);
		if (l !== null) {
			DT(a, o, r, i), kT(s, c + 1, l, o), DT(a, o, r | iT.Code, i), c = l + 1;
			continue;
		}
		let u = MT(e, c, n);
		if (u !== null) {
			DT(a, o, r, i), ET(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), DT(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = AT(e, c, n);
		if (d !== null) {
			DT(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? NT(e, c, n) : null;
		if (f !== null) {
			DT(a, o, r, i), ET(e, f.labelStart, f.labelEnd, r, f.url, a, o), DT(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = PT(e, c, n);
		if (p !== null) {
			DT(a, o, r, i), a.push({
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
function DT(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function OT(e, t, n) {
	let r = e.text;
	if (r[t] !== oT) return null;
	let i = t + 1;
	if (i >= n || zT(r[i])) return null;
	let a = e.findClosingMarker(i, n, oT, 1);
	return a > i ? a : null;
}
function kT(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === aT && i + 1 < n && RT(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function AT(e, t, n) {
	let r = e.text;
	if (r[t] !== sT || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return jT(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function jT(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function MT(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = iT.Bold, s = 2;
	else if (i === "*") o = iT.Italic, s = 1;
	else if (i === "_" && a) o = iT.Underline, s = 2;
	else if (i === "~" && a) o = iT.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || zT(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function NT(e, t, n) {
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
function PT(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== cT || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > pT) return null;
	let c = { value: "" };
	return kT(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var FT = class {
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
		return this.closeBrackets ??= this.next("]", !0), IT(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), IT(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), IT(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return IT(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = LT(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !zT(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Rd(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === aT && e[t - 1] === 0);
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
			if (this.text[r] === cT) n.push(r);
			else if (this.text[r] === lT && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || zT(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function IT(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function LT(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function RT(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === cT || e === lT || e === oT || e === aT;
}
function zT(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var BT = "ui-tooltip", VT = "ui-tooltip", HT = "ui-tooltip--visible", UT = "[aria-haspopup][aria-expanded=\"true\"]", WT = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", GT = "top", KT = 250, qT = 200, JT = 300, YT = 7, XT = null, ZT = null, QT = null, $T = null, eE = null, tE = 0, nE = null, rE = 0, iE = 0, aE = !1, oE = /* @__PURE__ */ new Set();
function sE(e) {
	oE.add(e);
}
function cE(e = document) {
	if (aE) return;
	aE = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", lE, !0), t.addEventListener("pointerout", fE, !0), t.addEventListener("focusin", mE, !0), t.addEventListener("focusout", hE, !0), t.addEventListener("keydown", gE, !0), t.addEventListener("scroll", dE, !0), t.addEventListener("pointerdown", _E, !0), t.addEventListener("click", vE, !0), window.addEventListener("blur", () => {
		$T = null, BE(!0);
	});
}
function lE(e) {
	if (uE(), bE(e.target)) {
		window.clearTimeout(rE);
		return;
	}
	let t = xE(e.target);
	t !== null && t !== ZT && EE(t);
}
function uE() {
	ZT === null || ZT.isConnected || ($T = null, BE(!0));
}
function dE(e) {
	if (uE(), ZT === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(ZT) || tw(ZT) && ($T = null, BE(!0));
}
function fE(e) {
	if ($T !== null || eE !== null) return;
	let t = e.relatedTarget, n = ZT ?? nE?.target ?? null, r = n === null ? null : pE(n);
	t instanceof Node && (r !== null && r.contains(t) || bE(t)) || (bE(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && BE(!1);
}
function pE(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && SE(t) === e ? t : e;
}
function mE(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = xE(e.target);
	t !== null && ($T = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, DE(t));
}
function hE(e) {
	xE(e.target) === ZT && ($T = null, BE(!0));
}
function gE(e) {
	e.key === "Escape" && ZT !== null && ($T = null, BE(!0));
}
function _E(e) {
	if (bE(e.target)) return;
	let t = yE(e.target);
	if (t !== null) {
		if (eE === t) {
			BE(!0);
			return;
		}
		$T = null, BE(!0), DE(t), eE = ZT;
		return;
	}
	$T === null && BE(!0);
}
function vE(e) {
	yE(e.target) !== null && e.preventDefault();
}
function yE(e) {
	let t = xE(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(WT);
	return n === null || n.contains(t) ? t : null;
}
function bE(e) {
	return XT !== null && e instanceof Node && XT.contains(e);
}
function xE(e) {
	if (!(e instanceof Element)) return null;
	let t = SE(e);
	for (let n of oE) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && TE(r).length > 0) return r;
	}
	return t;
}
function SE(e) {
	let t = e.closest(`[${Ae}], [${Me}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function CE(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + wE(e) : TE(e);
}
function wE(e) {
	let t = "";
	for (let n of oE) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function TE(e) {
	for (let t of oE) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function EE(e, t) {
	if ($T === null && eE === null) {
		if (window.clearTimeout(rE), nE !== null && nE.target === e) {
			nE.words = t;
			return;
		}
		if (window.clearTimeout(tE), nE = null, ZT !== null) {
			BE(!0), DE(e, t);
			return;
		}
		if (Date.now() - iE < JT) {
			DE(e, t);
			return;
		}
		nE = {
			target: e,
			words: t
		}, tE = window.setTimeout(() => {
			let e = nE;
			nE = null, e !== null && DE(e.target, e.words);
		}, KT);
	}
}
function DE(e, t) {
	let n = (t ?? CE(e)).trim();
	if (n.length === 0 || !e.isConnected || OE(e) || tw(e)) return;
	window.clearTimeout(tE), window.clearTimeout(rE), nE = null;
	let r = VE();
	_T(r, n, { staticFolds: !0 }), r.classList.add(HT), ZT = e, AE(kE(e)), r.setAttribute("data-ui-tooltip-text", hT(n)), NE(r, e.getAttribute(Ne)), il(e, r), al(e, r, {
		placement: zE(e),
		gap: YT,
		arrow: !0
	});
}
function OE(e) {
	return e.matches(UT) || e.querySelector(UT) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function kE(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function AE(e) {
	QT !== null && QT !== e && jE();
	let t = ME(e);
	t.includes(VT) || e.setAttribute("aria-describedby", [...t, VT].join(" ")), QT = e;
}
function jE() {
	if (QT === null) return;
	let e = ME(QT).filter((e) => e !== VT);
	e.length === 0 ? QT.removeAttribute("aria-describedby") : QT.setAttribute("aria-describedby", e.join(" ")), QT = null;
}
function ME(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function NE(e, t) {
	t === null ? e.removeAttribute(Ne) : e.setAttribute(Ne, t);
}
function PE(e, t, n) {
	n?.delay === !0 && ZT !== e ? EE(e, t) : DE(e, t);
}
function FE() {
	BE(!0);
}
var IE = {
	show: PE,
	hide: FE
};
function LE(e) {
	$T = e, DE(e);
}
function RE(e) {
	if (ZT === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			$T = null, BE(!0);
			return;
		}
		DE(e);
	}
}
function zE(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of oE) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(je);
	return t !== null && Jc(t) ? t : GT;
}
function BE(e) {
	window.clearTimeout(tE), window.clearTimeout(rE), nE = null;
	let t = () => {
		ZT !== null && (jE(), ZT = null, eE = null, XT !== null && (XT.classList.remove(HT), fl(XT)), iE = Date.now());
	};
	e ? t() : rE = window.setTimeout(t, qT);
}
function VE() {
	return XT !== null && XT.isConnected ? XT : (XT = document.createElement("div"), XT.id = VT, XT.className = BT, XT.setAttribute("role", "tooltip"), XT.setAttribute("aria-hidden", "true"), document.body.append(XT), XT);
}
//#endregion
//#region src/interactions/menu-engine.ts
var HE = "ui-orientation--horizontal", UE = `.${Kt} > .ui-menu__host > .ui-menu__item > .${b}`, WE = `${UE}, ${`.ui-menu[${jt}] > .ui-menu__host > .ui-menu__item > .${b}`}`, GE = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", KE = "[role='menuitem'], [role='menuitemcheckbox']", qE = class {
	root;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), sE(JE), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(XE) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Lt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Ut}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && k(t, t.find((e) => e.classList.contains("ui-menu-item--selected") && So(e)) ?? t.find(So) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${b}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			YE(e, t);
			return;
		}
		let r = this.ownItems(n), i = yo({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(HE) || nT(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), k(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Ut}`);
		if (n === null) return;
		let r = this.ownItems(n), i = yo({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(HE) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), k(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${b}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && k(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${b}`) : null;
		if (t === null || t === document.activeElement || !t.matches(KE) || t.matches(qt) || !So(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && Ms(t);
	}
	ownItems(e) {
		return L(e, `.${b}:not(${qt})`, `.${Ut}`);
	}
}, JE = {
	anchor: (e) => e.closest(WE),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(GE), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(UE) && t.scrollWidth <= t.clientWidth ? null : gT(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Ut}`);
		return t === null ? null : tT(t);
	}
};
function YE(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(qt) || !So(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function XE(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var ZE = "shortcut:", QE = ":scope > .ui-menu-item__shortcut", $E = `[${xe}]`, eD = `[${Xt}]`, tD = ".ui-text__title", nD = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), sE(fD), lD(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) cD(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Xt]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || iD(e))) return;
		let t = Jl(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Ey(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !So(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), sD(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Ey(t, e);
		let r = n ? aD() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = RC(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(eD)].filter((t) => {
			let n = Ty(t.getAttribute(Xt));
			return n !== null && Ey(n, e) && !E(t) && sC(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), sD(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(eD)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Ty(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest($E) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(Fy(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Ty(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = Fy(e.shortcut);
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
function rD(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(ZE) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function iD(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return go(t) || t instanceof HTMLElement && t.isContentEditable;
}
function aD() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = ns(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? as(L(t.root, Mo, A));
	return n === null ? t.root : oD(n);
}
function oD(e) {
	if (e.matches(zC)) return e;
	for (let t of e.querySelectorAll(zC)) if (t.closest(Mo) === e) return t;
	return e;
}
function sD(e) {
	go(e.target) && e.target.dispatchEvent(new Event(fm, { bubbles: !0 }));
}
function cD(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && uD(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && lD(t);
}
function lD(e) {
	e instanceof HTMLElement && e.matches(eD) && uD(e);
	for (let t of e.querySelectorAll(eD)) uD(t);
}
function uD(e) {
	let t = e.querySelector(QE);
	if (t === null) return;
	let n = dD(e) ?? "";
	t.textContent !== n && (t.textContent = n);
}
function dD(e) {
	let t = e.getAttribute(Xt), n = Ty(t);
	return n === null ? t?.trim() || null : Dy(n);
}
var fD = {
	anchor: (e) => {
		let t = e.closest(eD);
		return t === null || t.classList.contains("ui-menu-item") || t.closest($E) !== null ? null : t;
	},
	words: (e) => {
		let t = dD(e), n = (e.getAttribute("aria-label") ?? e.querySelector(tD)?.textContent ?? "").trim();
		return t === null ? null : gT(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = dD(e);
		return t === null ? null : gT(`(${t})`);
	}
}, pD = 50, mD = 1, hD = 7;
function gD(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = CD(e, "data-ui-window-size") ?? 0;
	return {
		offset: CD(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : pD,
		total: CD(e, Ct),
		moreAfter: e.getAttribute(Tt) === "true"
	};
}
function _D(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function vD(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function yD(e, t) {
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
			let n = Number(t), r = vD(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === _D(e) ? null : (n - 1) * e.size;
		}
	}
}
function bD(e, t) {
	if (t <= hD) return SD(1, t);
	let n = Math.max(Math.min(e - mD, t - 2 - 2), 3), r = Math.min(Math.max(e + mD, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...SD(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function xD(e, t) {
	let n = bD(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function SD(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function CD(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/interactions/pager-engine.ts
var wD = ".ui-pager", TD = "ui-pager__button", ED = "ui-pager__number", DD = "ui-pager__pages", OD = "ui-pager__gap", kD = "ui-pager__range", AD = "ui-pager__size", jD = "ui-pager__size--open", MD = "ui-pager__size-trigger", ND = "ui-pager__size-label", PD = "ui-pager__sizes", FD = "ui-pager__size-choice", ID = [
	TD,
	ED,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], LD = "ui.pager.page", RD = "ui.pager.range", zD = "ui.pager.rows", BD = "ui.pager.size", VD = [
	St,
	Ct,
	Tt,
	xt,
	bt
], HD = "page-size", UD = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new Vw();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new pu({
		show: ({ owner: e }) => e.classList.add(jD),
		hide: ({ owner: e }) => e.classList.remove(jD),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), F(this.root, `${wD}, [${y}]`, {
			childList: !0,
			attributeFilter: VD,
			relevant: (e) => e.type === "attributes" || $D(e.target) || eO(e)
		}, (e) => this.syncFound(e)), T.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(wD)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(wD)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(x), n = t === null ? 0 : w(t);
		return n > 0 ? [...this.root.querySelectorAll(`${wD}[${$e}="${Sr(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute($e));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = ZD(e);
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
		let i = gD(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = p_(e), s = (e) => m_(e, "N0", o);
		this.drawNumbers(e, i, o), GD(e, i, s), KD(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${TD}[${et}]`)) to.setDisabled(t, yD(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		JD(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${DD}`);
		if (r === null) return;
		let i = _D(t), a = vD(t), o = a === null ? xD(i, t.moreAfter) : bD(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => WD(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(wD);
		if (t === null || E(e.target)) return;
		let n = e.target.closest(`.${FD}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(tt)));
			return;
		}
		let r = e.target.closest(`.${MD}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${et}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = yD(gD(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Do(e).top > 0 && Oo(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(wD);
		if (t === null) return;
		let n = e.target.closest(`.${AD}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${TD}, .${MD}`), i = qD(t);
		if (r === null || !i.includes(r)) return;
		let a = yo({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal",
			loop: !1
		});
		a !== null && (e.preventDefault(), k(i, a), a.focus());
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${MD}`) : null;
		if (n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) return e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0;
		if (!this.menus.isOpen(t) || !bo(e.key, "vertical")) return !1;
		let r = XD(t), i = e.target instanceof HTMLElement && r.includes(e.target) ? e.target : null, a = yo({
			key: e.key,
			items: r,
			current: i,
			axis: "vertical"
		});
		return a !== null && (e.preventDefault(), a.focus()), !0;
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${FD}`) : null;
		if (t === null || t === document.activeElement || E(t)) return;
		let n = t.closest(`.${AD}`);
		n !== null && this.menus.isOpen(n) && Ms(t);
	}
	toggleSizes(e) {
		let t = e.closest(`.${AD}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${PD}`);
		if (r === null) return;
		let i = XD(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Gs(r, i, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, HD), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!YD(e, i)) {
			this.store.write(t, HD, null);
			return;
		}
		let a = gD(n);
		i !== a.size && (n.setAttribute(xt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${AD}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = gD(r.host);
		t !== i.size && (this.store.write(r.component, HD, String(t)), r.host.setAttribute(xt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !(e.target instanceof Element)) return;
		let t = ns(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || E(t.root) || t.row !== null && rm(e.target, t.row) !== null) return;
		let n = ZD(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = yD(gD(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = QD(e), i = as(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = QD(e);
		o.length > 0 && ss(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function WD(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = OD, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = m_(e, "N0", n);
	return r.className = ID.join(" "), r.setAttribute("type", "button"), r.setAttribute(et, String(e)), r.textContent = i, T.write(r, "aria-label", LD, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function GD(e, t, n) {
	let r = e.querySelector(`:scope > .${kD}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? T.write(r, null, zD, {
		from: i,
		to: a
	}) : T.write(r, null, RD, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function KD(e, t, n) {
	let r = e.querySelector(`:scope > .${AD}`), i = r?.querySelector(`.${ND}`) ?? null;
	if (r !== null && i !== null) {
		T.write(i, null, BD, { size: n(t.size) });
		for (let e of XD(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function qD(e) {
	return [...e.querySelectorAll(`.${TD}, .${MD}`)];
}
function JD(e) {
	let t = qD(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	k(t, n ?? r.find(So) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function YD(e, t) {
	let n = e.querySelector(`:scope > .${AD}`);
	return n !== null && XD(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function XD(e) {
	return [...e.querySelectorAll(`:scope > .${PD} > .${FD}`)];
}
function ZD(e) {
	for (let t of e.querySelectorAll(`[${y}][${pt}="windowed"]`)) if (t.closest(x) === e) return t;
	return null;
}
function QD(e) {
	return L(e, Mo, A);
}
function $D(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function eO(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(wD) || t.querySelector(wD) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var tO = `.${Ut}[${Ft}]`, nO = ":scope > .ui-collapsible__bar", rO = ":scope > .ui-menu__host", iO = "ui-menu__item", aO = `:scope > .${b}`, oO = ".ui-text__title", sO = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", cO = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), F(t, tO, {
			childList: !0,
			characterData: !0,
			attributeFilter: [jt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = lO(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(rO);
		if (n === null) return;
		let r = qm(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: uO(n)
		}), e.setAttribute(It, ""), ph(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of dO(e)) {
			let e = fO(a);
			if (e === "header") {
				n !== null && mO(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			mO(a, o), r ||= o, i ||= o;
		}
		return n !== null && mO(n, r), i;
	}
	match(e, t) {
		let n = Ym(pO(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(sO) : null;
		if (r === null) return n;
		if (n) return hO(r), e.removeAttribute(Pt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Pt, i), i;
	}
	clear(e, t) {
		hO(t), e.removeAttribute(It), dO(t).length > 0 && ph(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(jt);
		for (let e of t.querySelectorAll(`[${Mt}]:not([${Nt}])`)) e.toggleAttribute(Pt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...lO(e.target)?.querySelector(rO)?.querySelectorAll(`.ui-menu-item:not(${qt})`) ?? []].find(So);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function lO(e) {
	let t = e.closest(tO), n = t?.querySelector(nO) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function uO(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Mt}][${Pt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function dO(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(iO));
}
function fO(e) {
	return e.querySelector(aO)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function pO(e) {
	return Jm(e.querySelector(aO)?.querySelector(oO)?.textContent ?? "", e);
}
function mO(e, t) {
	e.toggleAttribute(Lt, !t);
}
function hO(e) {
	for (let t of e.querySelectorAll(`[${Lt}]`)) t.removeAttribute(Lt);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var gO = "[data-ui-root]", _O = "a[href]", vO = "ui-collapsible", yO = "right-side", bO = "ui-side--left", xO = "ui-side--right", SO = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(Pw).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Rt}]`);
		if (t !== null) {
			let e = t.closest(gO), n = t.getAttribute(Rt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${Zt}]`);
		if (n !== null && !e.defaultPrevented && CO(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(_O)?.closest(`[${Vt}]`), i = r?.parentElement ?? null;
		r != null && i?.getAttribute("data-ui-drawer-open") === r.getAttribute("data-ui-region") && this.close(i);
	}
	handleKeydown(e) {
		e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && this.closeAll();
	}
	toggle(e, t) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		e.setAttribute(zt, t), this.markToggles(e);
		let n = wO(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, ks(), performance.now() + P.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(dr, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Hs(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${gO}[${zt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(zt);
		if (e.removeAttribute(zt), this.markToggles(e), t === null) return;
		let n = wO(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = e.querySelector(`[${Rt}="${Sr(t)}"]`);
			i !== null && n !== null && n.contains(r) ? Xs(i, n) : i !== null && N(i);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(zt);
		for (let n of e.querySelectorAll(`[${Rt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Rt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(dr), t && e.removeAttribute("tabindex"));
	}
};
function CO(e) {
	let t = e.closest(`.${vO}`), n = t?.closest(`[${Vt}]`), r = n?.getAttribute(Vt), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(gO) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === yO ? xO : bO);
}
function wO(e, t) {
	return e.querySelector(`:scope > [${Vt}="${Sr(t)}"]`);
}
//#endregion
//#region src/interactions/skip-link-engine.ts
var TO = "[data-ui-root]", EO = "content", DO = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-ui-skip-link]")?.closest(TO)?.querySelector(`:scope > [data-ui-region="${EO}"]`) ?? null;
		t !== null && (e.preventDefault(), OO(t));
	}
};
function OO(e) {
	e.hasAttribute("tabindex") || (e.setAttribute("tabindex", "-1"), e.addEventListener("blur", () => e.removeAttribute("tabindex"), { once: !0 })), e.focus();
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var kO = "ui-collapsible", AO = "ui-collapsible__content", jO = "ui-collapsible__bar", MO = "collapsed", NO = class {
	root;
	store = new Vw();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${kO}`)), F(this.root, `.${kO}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, MO);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Zt}]`), n = t?.closest(`.${kO}`) ?? null;
		if (t === null || n === null || CO(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(jt), i = n.querySelector(`:scope > .${AO}`);
		this.cancelFold(n);
		let a = FO(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, MO, r ? "true" : "false", r ? { attributes: { [jt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(jt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Zt}], :scope > .${jO} > [${Zt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Gc()) return;
		let i = LO(PO(e), n, FO(e, t), r);
		if (i === null) return;
		e.setAttribute(Qt, "");
		let a = {
			duration: P.normal,
			easing: P.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Qt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Qt);
			for (let e of t) e.cancel();
		}
	}
};
function PO(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function FO(e, t) {
	let n = PO(e), r = IO(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function IO(e) {
	return e === "width" ? "height" : "width";
}
function LO(e, t, n, r) {
	let i = IO(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function RO(e) {
	let t = [];
	for (let n of VO(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = RO(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = zO(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function zO(e) {
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
	if (n !== null) return BO({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return BO(r[3] === "fr" ? {
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
function BO(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function VO(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function HO(e, t = "auto") {
	return e.map((e) => UO(e, t)).join(" ");
}
function UO(e, t) {
	switch (e.kind) {
		case "px": return `${WO(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${WO(e.min)}px`}, ${WO(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${WO(e.max)}px)` : `minmax(${WO(e.min)}px, auto)`;
	}
}
function WO(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function GO(e) {
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
function KO(e, t) {
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
function qO(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = JO(r, e), o = JO(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function JO(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function YO(e, t, n, r) {
	let i = QO(e, t, n.before), a = QO(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = ZO(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = rk(n.before, e) + rk(n.after, e), r = i.total + a.total;
		$O(l, e, i, t * (i.total + c) / r), $O(l, e, a, t * (a.total - c) / r);
	} else u || ek(l, i, i.total + c), d || ek(l, a, a.total - c);
	return l;
}
var XO = 120;
function ZO(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < XO ? o = t < 0 ? -n : XO - n : c > 0 && c < XO && (o = t > 0 ? r : r - XO), Math.min(Math.max(o, i), a);
}
function QO(e, t, n) {
	let r = nk(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function $O(e, t, n, r) {
	let i = rk(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function ek(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...tk(e[i])
		};
	}
}
function tk(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function nk(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function rk(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function ik(e, t) {
	let n = nk(t.before, e), r = n + nk(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function ak(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function ok(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function sk(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var ck = "ui-grid-splitter", lk = "ui-container", uk = "ui-orientation--vertical", dk = 16, fk = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: $t,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, pk = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: en,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, mk = class {
	root;
	store = new Vw();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ef({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${ck}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${ck}`)), F(this.root, `.${ck}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${ck}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = gk(t);
			e !== null && (this.restore(e, _k(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Mw) {
			let i = r[n], a = Iw(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ck}`);
		if (t === null || this.drag.active || E(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Sk(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
		switch (e.key) {
			case n.axis.decrease:
				a = -r;
				break;
			case n.axis.increase:
				a = r;
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
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ck}`), n = t === null ? null : gk(t);
		if (t === null || n === null) return;
		let r = _k(t);
		for (let e of Mw) n.style.removeProperty(Iw(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = YO(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Iw(e.axis.split, e.tier), HO(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Mw) {
			let a = Iw(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = gk(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = _k(e), r = Fw(), i = vk(t, n, r), a = i === null ? null : RO(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = KO(a, GO(t.getAttribute(n.limits))), s = yk(t, n), c = bk(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = qO(c, xk(t, n).map((e) => bk(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = gk(e);
		if (t === null) return;
		let n = _k(e), r = bk(e, n), i = yk(t, n), a = xk(t, n).map((e) => bk(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : qO(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(ik(i, o))), hk(t, n, i));
	}
};
function hk(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(ck)) continue;
		let e = getComputedStyle(r), i = sk(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Gn, i);
	}
}
function gk(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(lk) ? t : null;
}
function _k(e) {
	return e.classList.contains(uk) ? fk : pk;
}
function vk(e, t, n) {
	for (let r = Mw.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(Iw(t.split, Mw[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function yk(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function bk(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function xk(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(ck) && _k(r) === t && n.push(r);
	return n;
}
function Sk(e) {
	let t = Number(e.getAttribute(tn));
	return Number.isFinite(t) && t > 0 ? t : dk;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Ck = "ui-split-button", wk = "ui-split-button__main", Tk = "ui-split-button__toggle", Ek = "ui-split-button__menu", Dk = "ui-split-button--open", Ok = class {
	root;
	menus = new pu({
		show: ({ owner: e }) => e.classList.add(Dk),
		hide: ({ owner: e }) => e.classList.remove(Dk),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = kk(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${wk}`)?.closest(`.${Ck}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = kk(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = Ak(t), r = e.target.closest(`.${b}`);
		n === null || r === null || !n.contains(r) || r.matches(`${qt}, ${Yt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = Ak(e), r = n?.querySelector(".ui-menu") ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: jk(e)
		}) && Gs(r, L(r, `.${b}:not(${qt})`, `.${Ut}`), t);
	}
};
function kk(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Tk}, .${wk}`), n = t?.closest(`.${Ck}`) ?? null;
	return t === null || n === null || t.classList.contains(wk) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Ak(e) {
	return e.querySelector(`:scope > .${Ek}`);
}
function jk(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Mk = "ui-button-group", Nk = "ui-button-group__item", Pk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Mk}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), F(this.root, `.${Mk}`, {
			childList: !0,
			attributeFilter: [Yn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Fk(i);
			i.toggleAttribute(Jn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		k(n, r ?? n.find(So) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Nk}`), n = t?.closest(`.${Mk}`) ?? null;
		if (t === null || n === null || t.closest(`.${Mk}`) !== n || E(n)) return;
		let r = Fk(t);
		r !== null && E(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Nk} > .${hr}`), n = t?.closest(`.${Mk}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Fk).filter((e) => e !== null), i = yo({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Nk}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Ao(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Yn,
			bindingAttribute: Zn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return L(e, `.${Nk}`, `.${Mk}`);
	}
};
function Fk(e) {
	return e.querySelector(`:scope > .${hr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Ik = "ui-accordion", Lk = "details", Rk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Ik}`)), F(this.root, `.${Ik}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Ik))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${Lk}`)];
	}
}, zk = "ui-tab-overflow", Bk = "ui-tab-overflow__menu", Vk = "ui-tab-overflow__menu--open", Hk = "ui-tab-overflow__entry", Uk = "ui-tab-overflow__entry--current", Wk = class {
	options;
	list;
	fittedWidths = /* @__PURE__ */ new WeakMap();
	wraps = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) {
			let e = n.target.closest(`.${this.options.rootClass}`);
			e !== null && this.fittedWidths.get(n.target) !== n.contentRect.width && (this.fittedWidths.set(n.target, n.contentRect.width), t.add(e));
		}
		for (let e of t) this.options.refit(e);
	}) : null;
	switches = typeof MutationObserver == "function" ? new MutationObserver((e) => {
		let t = /* @__PURE__ */ new Set();
		for (let n of e) n.target instanceof HTMLElement && this.wraps.get(n.target) !== this.options.wraps(n.target) && t.add(n.target);
		for (let e of t) this.options.refit(e);
	}) : null;
	constructor(e) {
		this.options = e, this.list = new qk(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : Gk({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return Kk(e, this.options.hiddenClass, t);
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
function Gk(e) {
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
function Kk(e, t, n) {
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
var qk = class {
	menu;
	button = null;
	list = new pu({
		show: ({ popup: e }) => e.classList.add(Vk),
		hide: ({ popup: e }) => {
			e.classList.remove(Vk), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Bk, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(Jk)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${Uk}`);
		r !== null && k(this.entries(), r), this.button = e, il(e, this.menu), this.list.open({
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			focus: r ?? !1,
			returnFocus: () => e
		}) ? r === null && Gs(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Hk}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || E(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = yo({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), k(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Hk}`) : null;
		t === null || t === document.activeElement || E(t) || (k(this.entries(), t), Ms(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${Hk}`));
	}
};
function Jk(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Hk} ${gr}`, t.classList.toggle(Uk, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(v, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(ar), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var Yk = "data-ui-caption-text", Xk = ".ui-text__title";
function Zk(e) {
	for (let t of e.querySelectorAll(Xk)) {
		let e = t.textContent ?? "";
		t.getAttribute(Yk) !== e && t.setAttribute(Yk, e);
	}
}
function Qk(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Gc()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: P.normal,
		easing: P.ease,
		pseudoElement: "::after"
	});
}
function $k(e) {
	e === null || typeof e.animate != "function" || Gc() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: P.fast,
		easing: P.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var eA = "ui-tabs", tA = "ui-tab-header", nA = "ui-tab-header--selected", rA = "ui-tab-header--overflowed", iA = "ui-tabs--overflowing", aA = "ui-tabs--no-overflow", oA = "ui-tabs__strip", sA = "data-ui-tab-key", cA = "data-ui-tab-page", lA = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Wk({
			rootClass: eA,
			overflowingClass: iA,
			wraps: (e) => e.classList.contains(aA),
			hiddenClass: rA,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${eA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), F(this.root, `.${eA}`, {
			childList: !0,
			attributeFilter: [Qn, ...nr],
			relevant: (e) => !Vl(e, `[${cA}]`, `.${eA}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(sA) ?? "") === t) ?? null;
		if (r !== null && !uA(r)) {
			let t = n.find(uA);
			if (t !== void 0) {
				this.select(e, t.getAttribute(sA) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(nA)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(sA) ?? "") === t;
			e.classList.toggle(nA, n), e.setAttribute("aria-selected", n ? "true" : "false"), Zk(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(uA), a), Qk(i, a), k(n.filter((e) => !e.classList.contains(rA)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(cA) ?? "") !== t, !n.hidden && i !== null && i !== a && $k(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${oA}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(sA) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(uA).map((e) => {
				let n = e.getAttribute(sA) ?? "";
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
		let t = e.target.closest(`.${zk}`), n = t?.closest(`.${eA}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${eA}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${tA}`);
		if (r === null || E(r)) return;
		let i = r.closest(`.${eA}`), a = r.getAttribute(sA);
		i !== null && a !== null && r.closest(`.${eA}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${tA}`), n = t?.closest(`.${eA}`) ?? null;
		if (t === null || n === null) return;
		let r = yo({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(sA) ?? ""), r.focus());
	}
	select(e, t) {
		Ao(e, t, {
			attribute: Qn,
			bindingAttribute: Zn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return L(e, `.${tA}`, `.${eA}`);
	}
	ownPages(e) {
		return L(e, `[${cA}]`, `.${eA}`);
	}
};
function uA(e) {
	return e.classList.contains(rA) || ew(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var dA = "ui-command-bar", fA = "ui-command-bar__host", pA = "ui-command-bar__item", mA = "ui-command-bar__overflow", hA = "ui-command-bar--overflowing", gA = "ui-command-bar__overflowed", _A = "ui-text__title", vA = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Wk({
			rootClass: dA,
			overflowingClass: hA,
			wraps: (e) => !bA(e),
			hiddenClass: gA,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${dA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), F(this.root, `.${dA}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = yA(e), n = e.querySelector(`:scope > .${mA}`);
		if (t === null || n === null) return;
		let r = xA(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(hA) && SA(r);
		for (let e of r) nl(e, e.classList.contains(gA) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mA}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(dA) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = yA(e), n = t === null ? [] : xA(t).filter((e) => e.classList.contains(pA) && e.classList.contains(gA)).map((e) => e.querySelector(x) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: CA(e),
			current: !1,
			disabled: E(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !E(n) && wA(n).click();
	}
};
function yA(e) {
	return e.querySelector(`:scope > .${fA}`);
}
function bA(e) {
	let t = yA(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function xA(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(pA) ? n.querySelector(x) : null;
		e !== null && ew(e) && t.push(n);
	}
	return t;
}
function SA(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(pA) ? t ||= !r.classList.contains(gA) : t || r.classList.add(gA);
	}
}
function CA(e) {
	let t = wA(e), n = t.querySelector(`.${_A}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function wA(e) {
	return e.matches(_s) ? e : e.querySelector(_s) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var TA = "ui-breadcrumbs", EA = "ui-breadcrumbs__item", DA = "ui-breadcrumb", OA = "ui-breadcrumb--current", kA = "ui-hidden", AA = "data-ui-step-collapsed", jA = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), F(this.root, `.${TA}`, {
			childList: !0,
			attributeFilter: ["class", ...nr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${TA}`)) this.apply(e);
	}
	apply(e) {
		let t = L(e, `.${EA}`, `.${TA}`);
		for (let e of t) MA(e);
		let n = t.filter((e) => !e.classList.contains(kA)).map((e) => e.querySelector(`.${DA}`)).filter((e) => e !== null && !e.classList.contains(kA)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(OA, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function MA(e) {
	let t = e.querySelector(`:scope > .${DA}`), n = t === null ? "" : nr.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === nr[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(AA) : e.getAttribute(AA) !== n && e.setAttribute(AA, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function U(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function NA(e) {
	return U(e).toString(16).padStart(2, "0").toUpperCase();
}
function PA(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return FA(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function FA(e, t, n) {
	return .2126 * IA(e) + .7152 * IA(t) + .0722 * IA(n);
}
function IA(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var LA = "ui-color-input", RA = "ui-color-input--open", zA = "ui-color-input__popup", BA = "ui-color-input__text", VA = "ui-color-input__row", HA = "ui-color-input__swatch--button", UA = "ui-color-input__value-input", WA = "ui-color-input__square-thumb", GA = "ui-color-input__hue-thumb", KA = "data-ui-color-toggle", qA = "data-ui-color-tab", JA = "data-ui-color-tab-selected", YA = "data-ui-color-pane", XA = "data-ui-color-pane-selected", ZA = "data-ui-color-square", QA = "data-ui-color-hue", $A = "data-ui-color-hex", ej = "data-ui-color-channel", tj = "data-ui-color-factor", nj = "data-ui-color-opacity", rj = "data-ui-color-name", ij = "data-ui-color-name-selected", aj = "data-ui-color-format", oj = "data-ui-color-variant", sj = "data-ui-color-no-picker", cj = "data-ui-color-no-palette", lj = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new pu({
		show: ({ owner: e }) => e.classList.add(RA),
		hide: ({ owner: e }) => e.classList.remove(RA)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${LA}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = C(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${LA}`) ?? []);
		}), F(this.root, `.${LA}`, {
			childList: !0,
			attributeFilter: [
				aj,
				oj,
				sj,
				cj
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Ef({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${ZA}], [${QA}]`),
			begin: (e, t) => {
				let n = e.closest(`.${LA}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(ZA) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${UA}`)?.value ?? null
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
		let t = mj(e), n = this.states.get(e), r = n?.paneChosen === !0 ? uj(e, n.pane) : dj(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? fj(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Sj(t);
			if (i === null) return n ?? fj(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && pj(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Tj(a, o, s);
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
			...n ?? fj(r),
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
			let [e, a, o] = Tj(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), vj(e, "--ui-color-input-color", t.held ? wj(n, r, i, t.opacity) : "transparent"), vj(e, "--ui-color-input-solid", wj(n, r, i, 255)), vj(e, "--ui-color-input-on-color", t.held ? PA(n, r, i, t.opacity) : "inherit"), _j(e, t.held ? gj(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${ZA}]`), o = e.querySelector(`[${QA}]`), [s, c, l] = Ej(t.hue, 1, 1);
		if (vj(e, "--ui-color-input-hue", wj(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${WA}`);
			e !== null && (vj(e, "left", `${t.saturation * 100}%`), vj(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${GA}`);
			e !== null && vj(e, "top", `${t.hue / 360 * 100}%`);
		}
		yj(e, `[${$A}]`, Cj(n, r, i)), yj(e, `[${ej}="r"]`, String(n)), yj(e, `[${ej}="g"]`, String(r)), yj(e, `[${ej}="b"]`, String(i)), vj(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), bj(e, `[${nj}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${rj}]`)) n.getAttribute(rj) === t.name ? n.setAttribute(ij, "") : n.removeAttribute(ij);
		let n = t.name === null ? null : e.querySelector(`[${rj}="${t.name}"]`), r = n === null ? null : Sj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		vj(e, "--ui-color-input-base", r === null ? "transparent" : wj(r[0], r[1], r[2], 255)), bj(e, `[${tj}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${YA}]`)) n.getAttribute(YA) === t.pane ? n.setAttribute(XA, "") : n.removeAttribute(XA);
		for (let n of e.querySelectorAll(`[${qA}]`)) n.getAttribute(qA) === t.pane ? n.setAttribute(JA, "") : n.removeAttribute(JA);
	}
	resolveRgb(e, t) {
		if (t.name === null) return Ej(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${rj}="${t.name}"]`), r = n === null ? null : Sj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? Ej(t.hue, t.saturation, t.value) : xj([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${KA}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${LA}`));
			return;
		}
		let n = e.target.closest(`[${qA}]`), r = e.target.closest(`.${LA}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(qA), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${rj}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(rj)
			}));
			return;
		}
		let a = r.querySelector(`.${zA}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${LA}`);
		if (t !== null) {
			if (e.target.hasAttribute(tj)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(nj) && this.commit(t, (t) => ({
				...t,
				opacity: U(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${LA}`);
		if (n === null) return;
		if (t.hasAttribute(tj) || t.hasAttribute(nj)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute($A)) {
			let e = Sj(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Tj(e[0], e[1], e[2]);
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
		let r = t.getAttribute(ej);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = U(Number(t.value));
		let [l, u, d] = Tj(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${UA}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = Dj((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = Dj((t.x - a.left) / a.width), s = 1 - Dj((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${UA}`);
		a !== null && (a.value = hj(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		O(e) || e.querySelector(`.${UA}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(sj) && e.hasAttribute(cj)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${zA}`), n = e.querySelector(`[${KA}]`);
		if (t === null) return;
		let r = e.getAttribute(oj) === "swatch" ? e.querySelector(`.${HA}`) : e.querySelector(`.${VA}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${JA}]`) ?? !0
		});
	}
};
function uj(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? sj : cj))(t) ? t : t === "picker" ? "palette" : "picker";
}
function dj(e) {
	return uj(e, "picker");
}
function fj(e) {
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
function pj(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function mj(e) {
	return e.querySelector(`.${UA}`)?.value.trim() ?? "";
}
function hj(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Cj(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${NA(e.opacity)}`;
}
function gj(e, t, n, r, i) {
	if (e.getAttribute(aj) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Cj(t, n, r);
	return i === 255 ? a : `${a}${NA(i)}`;
}
function _j(e, t) {
	for (let n of e.querySelectorAll(`.${BA}`)) n.textContent !== t && (n.textContent = t);
}
function vj(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function yj(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function bj(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function xj(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		U(e[0] * (1 - n)),
		U(e[1] * (1 - n)),
		U(e[2] * (1 - n))
	] : [
		U(e[0] + (255 - e[0]) * n),
		U(e[1] + (255 - e[1]) * n),
		U(e[2] + (255 - e[2]) * n)
	];
}
function Sj(e) {
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
function Cj(e, t, n) {
	return `#${NA(e)}${NA(t)}${NA(n)}`;
}
function wj(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Tj(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function Ej(e, t, n) {
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
		U((o + a) * 255),
		U((s + a) * 255),
		U((c + a) * 255)
	];
}
function Dj(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function Oj(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var kj = "ui-table", Aj = "ui-table--reorderable", jj = "ui-scroll-x--auto", Mj = "ui-scroll-x--always", Nj = `:scope > .${cn}`, Pj = `.${un}`, Fj = "ui-table__header-cell", Ij = `${Fj}--pinned`, Lj = `${Nj} > .${ln} > .${Fj}`, Rj = `${Lj}--pinned`, zj = "ui-table__host", Bj = `${Nj} > .${zj}`, Vj = `.${kj}, .${sn}, [${nn}]`, Hj = "--ui-table-columns", Uj = "--ui-table-sticky-top", Wj = "--ui-table-sticky-bottom", Gj = "--ui-table-sized-columns", Kj = "--ui-table-pin-", qj = "--ui-table-order-", Jj = 64, Yj = "data-ui-table-cell-hidden", Xj = "data-ui-table-cell-last", Zj = "columns", Qj = "hidden", $j = "order", eM = "layout", tM = 32, nM = 16, rM = class {
	root;
	store = new Vw();
	restored = /* @__PURE__ */ new WeakSet();
	widths = /* @__PURE__ */ new WeakMap();
	orders = /* @__PURE__ */ new WeakMap();
	hiddenChoices = /* @__PURE__ */ new WeakMap();
	columnStates = /* @__PURE__ */ new WeakMap();
	stampedStates = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	reorder;
	moved = !1;
	constructor(e = {}) {
		if (this.root = e.root ?? document, this.drag = new Ef({
			root: this.root,
			resolveHandle: (e) => e.closest(Pj),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new Ef({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Mw) e !== "base" && matchMedia(`(min-width: ${Nw[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${kj}`)), F(this.root, `.${kj}`, {
			childList: !0,
			relevant: cM
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), F(this.root, `.${kj}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(kj)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), F(this.root, `.${kj}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: lM
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(Bj);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), Oj(t, () => this.pin(t));
			let e = t.querySelector(Nj);
			e !== null && Oj(e, () => iM(t, e));
			let n = t.querySelector(Bj);
			n !== null && (this.markScrollbar(t, n), Oj(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, Zj), r = n === null ? null : RO(n);
		r !== null && r.length !== t.length ? (this.store.write(e, Zj, null), this.store.writeBoot(e, eM, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, $j);
		if (i !== null && !dM(i, t)) {
			this.store.write(e, $j, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(xn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${kj}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = uM(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(jj) || e.classList.contains(Mj);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(Gj);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = ok(t, n);
				e.style.setProperty(Gj, HO(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${qj}${t}`, String(r[t])) : e.style.removeProperty(`${qj}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(on) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(on, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(gn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(gn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(Aj)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= Jj) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${nn}]`)) {
				let r = Number(t.getAttribute(nn));
				!(r >= Jj) || t.closest(`.${kj}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(Yj, n.hidden.has(r)), t.toggleAttribute(Xj, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(Lj)) {
			let e = Number(n.getAttribute(nn)), r = n.getAttribute(rn), i = n.classList.contains(Ij) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: hM(r) ? r : null,
				startsHidden: n.hasAttribute(an),
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
		for (let e of t) (n[e.key] ?? mM(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, Qj) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(Hj).trim(), n = t.length === 0 ? null : RO(t);
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
		n === null || i !== void 0 && n === mM(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, Qj, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return uM(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(Rj).length;
		if (t < 2) return;
		let n = ak(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${Kj}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${kj}`)?.toggleAttribute(bn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(Nj), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return oM(e) ? n.slice(1) : n;
	}
	columnSizes(e, t) {
		let n = this.trackSizes(e);
		return t.map((e) => n[e]);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		if (e.ctrlKey && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
			this.stepColumn(e, e.key === "ArrowLeft" ? -1 : 1);
			return;
		}
		let t = e.target.closest(Pj) ?? (e.shiftKey ? aM(e.target) : null);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = nM;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${kj}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(nn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Pj)?.closest(`.${kj}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = YO(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(tM, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, sM(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, Zj, t === null ? null : HO(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(Gj).trim(), n = e.getAttribute(on), r = {};
		t.length > 0 && (r[Gj] = t);
		for (let t of e.style) t.startsWith(qj) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, eM, null);
			return;
		}
		this.store.writeBoot(e, eM, {
			styles: r,
			attributes: {
				[on]: n,
				[gn]: e.getAttribute(gn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${kj}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = GO(t.getAttribute($t)), i = KO(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(nn)), u = this.hiddenOf(t, o), d = uM(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${Fj}`), n = t?.closest(`.${kj}`) ?? null;
		return t === null || n === null || !n.classList.contains(Aj) || e.closest(Pj) !== null || t.classList.contains(Ij) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${kj}`), r = Number(e.getAttribute(nn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(_n, ""), e.setAttribute(vn, ""), {
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
		for (let a of uM(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > fM(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), pM(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(yn, "after") : a.cell.setAttribute(yn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(vn), t.table.removeAttribute(_n), pM(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = uM(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, $j, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function iM(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${zj}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(Uj, `${n}px`), e.style.setProperty(Wj, `${r}px`);
}
function aM(e) {
	let t = e.matches(`.${Fj}`) ? e.querySelector(`:scope > ${Pj}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function oM(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function sM(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function cM(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(Vj) || t.querySelector(Vj) !== null)) return !0;
	return !1;
}
function lM(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(zj);
}
function uM(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function dM(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function fM(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function pM(e) {
	for (let t of e.querySelectorAll(`[${yn}]`)) t.removeAttribute(yn);
}
function mM(e) {
	return e.startsHidden || e.hideBelow !== null && Mw.indexOf(Fw()) < Mw.indexOf(e.hideBelow);
}
function hM(e) {
	return e !== null && Mw.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var gM = /* @__PURE__ */ new WeakMap();
function _M(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Et);
	for (let i of z(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = vM(i, a) ?? yM(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${ot}]`)) n.has(t) || t.remove();
}
function vM(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : gM.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function yM(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (xM(i, t.getAttribute(v)), gM.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function bM(e) {
	return e.find((e) => !e.classList.contains(cr));
}
function xM(e, t) {
	e.setAttribute(ot, ""), t === null ? e.removeAttribute(st) : e.setAttribute(st, t);
}
var SM = "bottom", CM = "pending";
function wM(e, t, n) {
	let r = e.querySelector(`:scope > [${vt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(vt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function TM(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var EM = /* @__PURE__ */ new WeakMap();
function DM(e) {
	for (let t of e.querySelectorAll(`[${ot}]`)) t.remove();
}
function OM(e, t, n, r, i, a) {
	let o = Xv(e, z(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Vv(i.getItemsFilterSortMetadata(t), a, Lv(e));
	if (c && !l && DM(e), o.length === 0) {
		EM.set(e, []);
		return;
	}
	let d = _v(e);
	if (!l) {
		TM(e, [...Hv(o, u, r), ...gv(d)]);
		return;
	}
	DM(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (EM.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	EM.set(e, p);
	let m = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = Hv(t, u, r));
		let n = e === "" ? void 0 : bM(t);
		if (n !== void 0) {
			let e = kM(s, r, n);
			e !== null && m.push(e);
		}
		m.push(...t);
	}
	TM(e, [...m, ...gv(d)]);
}
function kM(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && xM(r, n.getAttribute(v)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var AM = "ui-tree-rules", jM = `:scope > .${fn}:not(.${hn})`;
function MM(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(AM, { bubbles: !0 })), vv(e, t, n.templates, n.renderer, e.querySelector(jM) !== null);
		return;
	}
	switch ($_(e)) {
		case "windowed":
			vv(e, t, n.templates, n.renderer), NM(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Rv(e, t, n.metadata, n.renderer, n.state), vv(e, t, n.templates, n.renderer), OM(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function NM(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && _M(e, (e) => kM(r, n.renderer, e));
}
//#endregion
//#region src/interactions/table-header-group.ts
var PM = ".ui-table", FM = `:scope > .${cn} > .${ln} > [role='columnheader']`, IM = `:scope > .${un}`, LM = "input:not([type='hidden']), button, select, textarea, a[href]", RM = /* @__PURE__ */ new WeakMap();
function zM(e) {
	for (let t of e.querySelectorAll(FM)) {
		let e = BM(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function BM(e) {
	let t = e.querySelector(LM);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(IM);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function VM(e) {
	let t = HM(e), n = RM.get(e), r = n !== void 0 && t.includes(n) ? n : t[0];
	return r !== void 0 && (UM(e, r), !0);
}
function HM(e) {
	let t = [];
	for (let n of e.querySelectorAll(FM)) {
		let e = BM(n);
		e !== null && So(e) && t.push({
			stop: e,
			left: n.getBoundingClientRect().left
		});
	}
	return t.sort((e, t) => e.left - t.left).map((e) => e.stop);
}
function UM(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), RM.set(e, t), t.focus();
}
function WM(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(PM) && BM(t) === e ? n : null;
}
function GM(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(), !0;
		case "ArrowUp": return !0;
	}
	if (!bo(e.key, "horizontal")) return !1;
	let r = yo({
		key: e.key,
		items: HM(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && UM(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var KM = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), qM = ".ui-table", JM = `:scope > [${y}], :scope > .${cn}, :scope > .${cn} > [${y}]`, YM = class {
	root;
	pressedBoxes = [];
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(A)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), F(this.root, A, {
			childList: !0,
			attributeFilter: [
				qn,
				Yn,
				Xn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.ownItems(e);
		Ho(e, t);
		for (let t of e.querySelectorAll(JM)) XM(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(qM) && zM(e);
			for (let e of t) {
				let t = $p(e);
				t !== null && XM(t);
				for (let t of em(e)) XM(t);
			}
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, A);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (e.detail > 0 && js(n, !0), ss(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Lo(n, r);
			return;
		}
		Wo(n, i, r, Ro(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Mo), r = n?.closest(A) ?? null;
		return n === null || r === null || n.closest(A) !== r || !r.matches(t) || E(r) ? null : rm(e.target, n) === null && !D(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, No);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), hs(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = WM(e.target);
		if (t !== null && !E(t)) {
			GM(e, t, () => this.enterRows(t)) && e.preventDefault();
			return;
		}
		let n = ns(e.target);
		if (n === null || n.row !== null && rm(e.target, n.row) !== null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || E(r)) return;
		let i = $M(r);
		if (!KM.has(e.key) && !cs(e.key, i)) return;
		let a = this.ownItems(r), o = is(a), s = us(e.key, a, as(a), i);
		if (s !== null) {
			e.preventDefault(), ss(r, a, s), (r.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Io(r, o), Wo(r, a, s, zo(r, e)));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(qM) && VM(r)) {
			e.preventDefault();
			return;
		}
		if (o === null || D(o)) return;
		let c = $p(o);
		switch (e.key) {
			case " ":
				Wo(r, a, o, {
					shift: !1,
					ctrl: !0
				}) || QM(o, c);
				break;
			case "Enter":
				ZM(r, a, o, c);
				break;
			case "Delete": {
				let e = eN(a, o);
				if (e.length === 0) return;
				for (let t of e) hs(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	enterRows(e) {
		let t = this.ownItems(e), n = as(t) ?? us("ArrowDown", t, null, "vertical");
		e.focus({ preventScroll: !0 }), n !== null && (ss(e, t, n), e.getAttribute("data-ui-selection") === "one" && Wo(e, t, n, Po));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(A) ?? null;
		t !== null && n !== null && [...n.querySelectorAll(JM)].includes(t) && n.focus({ preventScroll: !0 });
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(A) ?? null;
		if (t !== null && n !== null) for (let e of n.querySelectorAll(JM)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) XM(e);
		this.pressedBoxes = [];
	}
	ownItems(e) {
		return L(e, Mo, A);
	}
};
function XM(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function ZM(e, t, n, r) {
	Bo(e) && !Uo(t).includes(n) && Wo(e, t, n, Po), QM(n, r), r === null && hs(n, "open");
}
function QM(e, t) {
	t === null ? hs(e, ms) : t.click();
}
function $M(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function eN(e, t) {
	let n = Uo(e);
	return (n.includes(t) ? n : [t]).filter((e) => !Za(e, "data-ui-unremovable") && !D(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var tN = "ui-tree__row--folded", nN = "fold-hidden", rN = "fold-shown", iN = "ui-tree__row--dragging", aN = "ui-tree__loading", oN = "ui-tree__loading-ring", sN = "ui-tree-node__text", cN = "ui-tree-node__toggle", lN = "ui-tree-node__rename", uN = ".ui-text__title", dN = mn, fN = "--ui-tree-depth", pN = "expanded", mN = 600, hN = .25, gN = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, _N = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), vN = class {
	root;
	store = new Vw();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(AM, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${dn}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => M(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${dn}`)), F(this.root, `.${dn}`, {
			childList: !0,
			attributeFilter: [
				Cn,
				wn,
				En,
				jn
			],
			relevant: xN
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Uy(e)?.getAttribute(Cn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = M(e), r = Uy(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(wn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), ee = o !== null && !o.has(n);
			e.style.setProperty(fN, String(u)), e.setAttribute("aria-level", String(u + 1)), os(e, r?.querySelector(`:scope > .${sN}`) ?? null), e.classList.toggle(tN, !d), e.classList.toggle(hn, ee), e.removeAttribute(An), e.draggable = i && !Za(e, "data-ui-undraggable") && !D(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(On), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(On, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(On), d && g && !ee), s.set(n, {
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
		return Uy(e.row)?.hasAttribute(En) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${fn}[${v}="${Sr(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, nN, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, rN, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [An]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = li(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Lv(t);
		if (r === void 0 && i === null) return null;
		let a = Vv(r, this.rules.state, i), o = Bv(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(M)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = Uy(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Uv(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(M(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${aN}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = M(o), c = i.getItemValue(o);
			if (c === void 0 || zv(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Uy(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(aN) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? SN();
		o.style.setProperty(fN, String(t)), o.classList.toggle(tN, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${cN}`) === null && (!Za(r, "data-ui-unselectable") || rm(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || rm(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${fn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || D(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = ns(e.target);
		if (t === null || t.row !== null && rm(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || E(n)) return;
		let r = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey ? gN[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!_N.has(e.key) && !bo(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = is(i), o = us(e.key, i, as(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, zo(n, e));
			return;
		}
		if (!(a === null || D(a))) {
			switch (e.key) {
				case " ":
					Wo(n, i, a, {
						shift: !1,
						ctrl: !0
					}) || QM(a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, us("ArrowDown", i, a, "vertical"), Po);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Po);
					break;
				case "Enter":
					ZM(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = eN(i, a);
					if (e.length === 0) return;
					for (let t of e) t.dispatchEvent(new Event("remove", { bubbles: !0 }));
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	moveByKey(e, t) {
		let n = this.rowsOf(e), r = is(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = Yy(wN(n), M(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => M(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Za(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = CN(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(jn) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (D(t)) {
			e.preventDefault();
			return;
		}
		let a = lv(t, this.rowsOf(n)), o = cv(n, i, a);
		r ? tv(e, n, t, iN, M(t), a.filter((e) => e !== t), dv(o, !0)) : rv(e, M(t), dv(o, !1)), fv(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(iN));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${fn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = M(t), o = (e) => n.some((t) => M(t) === e || bN(i, e, M(t))), s = Wy(t, Uy(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? hN : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = wN(f), m = Number(t.style.getPropertyValue(fN)) || 0, h = new Set(n.map(M)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, ee = i.get(a) ?? "", te = g === void 0 ? {
			parent: ee,
			before: d === "before" ? a : $y(p, ee, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !Gy(te.parent, (e) => f.find((t) => M(t) === e) ?? null) || o(te.parent) ? null : {
			mark: d,
			place: te,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), mN)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dn}`);
		t !== null && iv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${dN}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && bN(a, M(e), M(t)))), s = r.getAttribute(dN) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), nv(t, iN), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = eb(wN(this.rowsOf(e)), t.map(M), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = Uy(e)?.querySelector(`.${sN}`) ?? null;
			r !== null && (r.setAttribute(kn, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent("move", {
				bubbles: !0,
				detail: { index: i[t] }
			})));
		});
	}
	handleDragEnd(e) {
		let t = CN(e)?.closest(".ui-tree") ?? null;
		t !== null && (nv(t, iN), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		qy(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(M(n), Uy(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = M(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(tN)) : [];
		this.store.writeJson(e, pN, i), this.layout(e), yN(a.filter((e) => !e.classList.contains(tN)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, pN) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = is(r);
		ss(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Io(e, i), Wo(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Uy(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => M(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${dn}`), n = Uy(e), r = n?.querySelector(uN) ?? null;
		t === null || n === null || r === null || Za(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Ql({
			container: n,
			title: r,
			className: lN,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Dn, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${y}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains("ui-tree__row") && n.push(e);
		return n;
	}
};
function yN(e) {
	if (!(e.length === 0 || Gc())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: P.fast,
		easing: P.enter
	});
}
function bN(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function xN(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function SN() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = aN, e.setAttribute("aria-hidden", "true"), t.className = oN, e.append(t, T.text("ui.tree.loading")), e;
}
function CN(e) {
	return e.target instanceof Element ? e.target.closest(`.${fn}`) : null;
}
function wN(e) {
	return e.map((e) => ({
		key: M(e),
		parent: Uy(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: Wy(e, Uy(e)),
		shown: !e.classList.contains(hn)
	}));
}
//#endregion
//#region src/interactions/tab-order.ts
function TN(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, EN(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function EN(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function DN(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var W = "ui-tabs-view", ON = "ui-tab-item", kN = "ui-tab-item__label", AN = "ui-tab-item__close", jN = "ui-tab-item__rename", MN = "ui-tab-item__caption", NN = "ui-tab-item__pin", PN = ".ui-text__title", FN = "ui-tab-item--dragging", IN = "ui-tab-item__caption--overflowed", LN = "ui-tabs-view--overflowing", RN = "ui-tabs-view--no-overflow", zN = "ui-tab-item__page", BN = "ui-tab-item--selected", VN = `.${b}`, HN = "tab-menu-entry", UN = {
	name: HN,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, WN = "--ui-tabs-view-strip", GN = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Wk({
			rootClass: W,
			overflowingClass: LN,
			wraps: (e) => e.classList.contains(RN),
			hiddenClass: IN,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => rP(e) === t.key))?.querySelector(`.${kN}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(FC, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), F(this.root, `.${W}`, {
			childList: !0,
			attributeFilter: [
				Qn,
				ye,
				...nr
			],
			relevant: (e) => !Vl(e, `.${zN}`, `.${W}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${W}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(ew);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => rP(e) === r)) {
			this.select(e, rP(n[0]));
			return;
		}
		let i = e.hasAttribute(ye), a = t.find((e) => e.classList.contains(BN))?.querySelector(`.${MN}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = rP(e) === r;
			e.classList.toggle(BN, t);
			let a = e.querySelector(`.${MN}`);
			a !== null && (a.draggable = i, Zk(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${kN}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${zN}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${zN}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), Qk(a, s), a !== null && a !== s && $k(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${kN}`);
			t === null || e.classList.contains(IN) || (l.push(t), e === s && (u = t));
		}
		k(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !ew(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(WN, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${y}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${zk}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => rP(e) === t)?.querySelector(`.${kN}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(ew).map((e) => ({
				key: rP(e),
				title: e.querySelector(`.${kN}`)?.textContent?.trim() ?? rP(e),
				current: rP(e) === t,
				disabled: E(e.querySelector(`.${kN}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${ON}`);
		if (n === null || !n.classList.contains(W) || r === null || r.closest(`.${W}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = JN(n, r), a = XN(t), o = a.map((e) => {
			if (YN(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? ew(e) ? "shown" : "hidden";
		});
		if (DC(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: rP(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${xe}="tab"]`), n = t?.parentElement ?? null, r = e.closest(VN);
		if (t === null || n === null || !n.classList.contains(W) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => rP(e) === a.key);
		if (i.length === 0 || r.matches(`${Jt}, ${qt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(HN, {
			bubbles: !0,
			detail: { keys: [i, rP(o)] }
		})), !0;
		if (JN(n, o).get(i) !== !0) return !0;
		switch (i) {
			case bC: {
				let e = o.querySelector(`.${kN}`);
				e !== null && this.startRename(e);
				break;
			}
			case xC:
			case SC:
				this.setPinned(n, o, i === xC);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${MN} > .${NN}`);
		t.toggleAttribute(tr, n), r !== null && (r.toggleAttribute(tr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = DN(a.map(tP));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? ZN(a[a.length - 1]).after(ZN(t)) : ZN(s).before(ZN(t)), eP([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${zk}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(W)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = QN(e.target), i = r?.closest(`.${W}`) ?? null;
		if (r === null || i === null || E(r)) return;
		let a = r.closest(`.${ON}`);
		a !== null && a.closest(`.${W}`) === i && (e.preventDefault(), this.select(i, rP(a)), document.activeElement !== r && N(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${AN}`), r = n?.closest(`.${ON}`) ?? null, i = r?.closest(`.${W}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), qN(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = QN(e.target), n = t?.closest(`.${W}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(PN) ?? e, r = e.closest(`.${ON}`);
		t === null || r === null || ZN(r).hasAttribute("data-ui-unrenamable") || Ql({
			container: t,
			title: n,
			className: jN,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(er, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => N(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${kN}`), n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${kN}`)).filter((e) => e !== null), i = yo({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${ON}`);
		a !== null && this.select(n, rP(a)), i.focus();
	}
	handleDragStart(e) {
		let t = $N(e);
		if (t === null) return;
		if (ZN(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		tv(e, t.closest(`.${W}`) ?? t, t, FN, rP(t));
		let n = ZN(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${MN}`)?.closest(`.${ON}`) ?? null, n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${FN}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${MN}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = ZN(r), o = t.hasAttribute("data-ui-tab-pinned") ? KN(n, a) : null, s = o ?? ZN(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${W}`);
		t !== null && t.querySelector(`.${FN}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = $N(e);
		if (t === null) return;
		t.classList.remove(FN);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(ZN(t), n.next);
			return;
		}
		let r = ZN(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${W}`);
		if (i === null) return;
		let a = this.ownItems(i);
		eP(a, a.indexOf(t));
	}
	select(e, t) {
		Ao(e, t, {
			attribute: Qn,
			bindingAttribute: Zn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return L(e, `.${ON}`, `.${W}`);
	}
};
function KN(e, t) {
	let n = null;
	for (let r of L(e, `.${ON}`, `.${W}`)) {
		let e = ZN(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function qN(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !ZN(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function JN(e, t) {
	return EC(TC(e.getAttribute(be)), {
		pinned: t.hasAttribute(tr),
		renamable: !ZN(t).hasAttribute(ue),
		removable: e.hasAttribute("data-ui-tabs-removes") && qN(e, t)
	});
}
function YN(e) {
	let t = e.getAttribute(v);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function XN(e) {
	let t = e.querySelector(`[${y}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function ZN(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function QN(e) {
	return e.closest(`.${AN}`) !== null || Zl(e) ? null : e.closest(`.${MN}`)?.querySelector(`:scope > .${kN}`) ?? null;
}
function $N(e) {
	return e.target instanceof Element ? e.target.closest(`.${MN}`)?.closest(`.${ON}`) ?? null : null;
}
function eP(e, t) {
	for (let [n, r] of TN(e.map(tP), t)) e[n].setAttribute($n, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function tP(e) {
	return {
		order: nP(e),
		pinned: e.hasAttribute(tr)
	};
}
function nP(e) {
	let t = e.getAttribute($n);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function rP(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var iP = "button.ui-text__fold-toggle", aP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(iP);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, oP = "ui-temporal-input__segments", sP = "ui-temporal-input__segment", cP = "ui-temporal-input__segment-literal", lP = "ui-temporal-input__segment--empty", uP = "data-ui-temporal-segment", dP = "data-ui-temporal-step-direction", fP = "data-ui-temporal-segments-of", pP = "--", mP = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${B}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(si(e.components, `.${B}`));
		}), F(this.root, `.${B}`, { attributeFilter: [...zb] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Vb(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${oP}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Hb(e), r = Gb(e), i = V(e, $b(t));
		t.getAttribute(fP) !== n && (t.replaceChildren(...hP(n).map((e) => _P(e))), t.setAttribute(fP, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(uP);
			if (t === null) {
				n.textContent = yP(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = bP(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(lP, i === null), n.tabIndex = 0, xP(n, t, i, O(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = CP(e.target);
		if (t === null) return;
		let n = t.closest(`.${B}`), r = t.getAttribute(uP), i = SP(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), TP(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), ax(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = EP(e.key, Gb(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = CP(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = CP(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Mf(this.wheelTurn, jf(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${B}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(uP), n < 0 ? 1 : -1, SP(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${dP}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${dP}]`);
		if (t === null) return;
		let n = t.closest(`.${B}`);
		if (n === null || O(n)) return;
		e.preventDefault();
		let r = wP(n) ?? n.querySelector(`.${sP}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(uP), t.getAttribute(dP) === "up" ? 1 : -1, SP(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${sP}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${B}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = V(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = DP(t), o = Wb(Ub(e), a) * n, s = a === "hour" ? 24 : 60, c = ((OP(i, a) + o) % s + s) % s;
		this.write(e, ux(e, kP(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? kP(t, "hour", AP(l, t.getHours() >= 12)) : kP(t, DP(n), l), i);
		}
		u && TP(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, kP(r, "hour", AP(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return V(e, t) ?? lx(e);
	}
	write(e, t, n) {
		ax(e, t, n), sx(e), this.applySegments(e);
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
function hP(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = ki(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(gP(r)), n += r.length;
	}
	return t;
}
function gP(e) {
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
function _P(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = cP, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = sP, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(uP, e.unit), t.dataset.width = String(e.width), vP(t, e.unit), t;
}
function vP(e, t) {
	if (t === "meridiem") {
		T.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = DP(t);
	T.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function yP(e, t, n, r) {
	return t && n !== null ? wi(n, e, r) : e;
}
function bP(e, t, n, r) {
	if (n === null) return pP;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : OP(n, DP(e));
	return String(i).padStart(t, "0");
}
function xP(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : OP(n, DP(t))));
}
function SP(e) {
	return $b(e.closest(`.${oP}`));
}
function CP(e) {
	let t = e instanceof Element ? e.closest(`.${sP}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${B}`);
	return n === null || O(n) ? null : t;
}
function wP(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${sP}`) : null;
}
function TP(e, t, n) {
	yo({
		key: n,
		items: [...e.querySelectorAll(`.${sP}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function EP(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function DP(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function OP(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function kP(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function AP(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var jP = "ui-timestamp", MP = "ui-timestamp__text", NP = "data-ui-timestamp-format", PP = "datetime", FP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${jP}`), T.temporal === null), T.onTable(() => this.apply(this.root.querySelectorAll(`.${jP}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(si(e.components, `.${jP}`))), F(this.root, `.${jP}`, {
			childList: !0,
			attributeFilter: [PP],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${jP}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: T.temporal,
			language: T.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = $i(a.getAttribute(NP)), o = Qi(a.getAttribute(PP)), s = a.querySelector(`.${MP}`);
			if (s === null || t && !IP(e, o, r)) continue;
			let c = o === null ? "" : na(o, e, n, r), l = e === "relative-date" ? ia(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= ea(e) && o !== null;
		}
		i && ja(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${jP}:is([${NP}="relative"], [${NP}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function IP(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && ra(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var LP = /* @__PURE__ */ new Map();
function RP(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${y}]`)) if (t.closest(x) === e) return t;
	return null;
}
function zP(e, t, n, r) {
	let i = BP(e, t);
	return i !== null && (LP.set(e, {
		key: t,
		block: n
	}), VP(e, i, n, r), !0);
}
function BP(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function VP(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = To(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = HP(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function HP(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function UP(e) {
	let t = LP.get(e);
	if (t === void 0) return;
	let n = BP(e, t.key);
	if (n === null) {
		LP.delete(e);
		return;
	}
	VP(e, n, t.block, "auto");
}
function WP(e) {
	LP.delete(e);
}
function GP(e) {
	if (!(LP.size === 0 || !(e instanceof Node))) for (let t of [...LP.keys()]) (!t.isConnected || To(t).contains(e)) && LP.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var KP = "data-ui-scroll-anchor", qP = "End", JP = 4, YP = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], XP = /* @__PURE__ */ new WeakSet();
function ZP(e) {
	XP.add(e);
}
function QP(e) {
	XP.delete(e);
}
var $P = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of YP) this.root.addEventListener(e, (e) => eF(e), {
			capture: !0,
			passive: !0
		});
		F(this.root, `[${KP}="${qP}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [At]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !nF(t) || this.pinned.set(t, XP.has(t) || iF(t) && !rF(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${KP}="${qP}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), XP.has(t)) {
				this.pinned.set(t, !0), tF(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (rF(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), tF(t);
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
			if (!e.isConnected || r === null || !nF(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? tF(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !nF(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && tF(e);
	}
	followsEnd(e) {
		return XP.has(e) || this.pinned.get(e) !== !1 && !rF(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function eF(e) {
	GP(e.target);
	let t = e.target instanceof Element ? e.target.closest(`[${KP}="${qP}"]`) : null;
	t !== null && XP.delete(t);
}
function tF(e) {
	e.scrollTop = e.scrollHeight;
}
function nF(e) {
	return e.getAttribute(KP) === qP;
}
function rF(e) {
	return e.getAttribute(Tt)?.toLowerCase() === "true";
}
function iF(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= JP;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var aF = `:is(.ui-surface, .ui-card)[${_}]`, oF = "ui-surface--clickable", sF = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), F(t, aF, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(aF));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(aF) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(oF)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), dF(e, "role", uF(e) ? "group" : "button"), dF(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : lF(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = cF(e);
		if (t === null) return;
		let n = e.key;
		n === "Enter" ? (e.preventDefault(), e.repeat || t.click()) : n === " " && (e.preventDefault(), this.spaceOn = t);
	}
	handleKeyUp(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== " " || this.spaceOn === null) return;
		let t = this.spaceOn;
		this.spaceOn = null, e.target === t && (e.preventDefault(), t.click());
	}
};
function cF(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(oF) && t.hasAttribute("tabindex") ? t : null;
}
function lF(e) {
	let t = e.closest(Mo);
	return t !== null && t.closest(A)?.matches(".ui-items-view, .ui-table") === !0 && $p(t) === e;
}
function uF(e) {
	for (let t of e.querySelectorAll(Zp)) if (nm(e, t)) return !0;
	return !1;
}
function dF(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var fF = `${Xp}, [role='menu'], [role='tab']`, pF = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? mF, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(fF) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function mF(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function hF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = _F(e, a, n), s = _F(e, a + 1, n);
	return vF(t, o.top, s.top, o.line, s.line);
}
function gF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = _F(e, a, n), s = _F(e, a + 1, n);
	return vF(t, o.line, s.line, o.top, s.top);
}
function _F(e, t, n) {
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
function vF(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var yF = 250, bF = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(ht);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < yF && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${ht}="${Sr(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${ht}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = xF(e, "data-ui-scroll-viewport") ?? SF(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? wF(e) : null, a = i === null ? null : wF(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = gF(a, hF(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? CF(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function xF(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function SF(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : xF(e, y);
	return t === null ? null : To(t);
}
function CF(e, t) {
	return t > 0 ? e / t : 0;
}
function wF(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${gt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${_t}]`);
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
var TF = `.${hr}, .ui-action, .${b}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice`, EF = "ui-key-value-action__row", DF = `${TF}, ${`${Mo}, .${EF}`}`, OF = "ui-pressing", kF = "ui-press-held", AF = "--ui-press-x", jF = "--ui-press-y", MF = "--ui-ripple-radius", NF = "--ui-ripple-opacity", PF = class {
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
		if (t === null || typeof t.animate != "function" || Gc()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(AF, `${r}px`), t.style.setProperty(jF, `${i}px`), t.classList.add(OF, kF);
		let o = t.animate([{ [MF]: "0px" }, { [MF]: `${a}px` }], {
			duration: P.ripple,
			easing: P.ease,
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
		let t = e.closest(DF);
		if (t === null || E(t)) return null;
		let n = e.closest(fr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(TF) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (rm(t, e) !== null || D(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(A), r = n !== null && !e.classList.contains(EF) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Za(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : j(e);
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
		n.element.classList.remove(kF);
		let r = Math.max(0, P.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, P.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [NF]: 1 }, { [NF]: 0 }], {
			duration: P.normal,
			delay: i,
			easing: P.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(OF, kF), this.presses.get(e) === t && this.presses.delete(e);
	}
}, FF = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), IF = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], LF = `.${ar}, .${or}`, RF = RegExp(`(^|\\s)(${ar}|${or})(\\s|$)`), zF = RegExp(`(^|\\s)${sr}(\\s|$)`), BF = "[type='range']", VF = /* @__PURE__ */ new WeakSet(), HF = /* @__PURE__ */ new WeakSet();
function UF(e = document) {
	let t = e === document ? window : e;
	for (let e of IF) t.addEventListener(e, ZF, !0);
	t.addEventListener("keydown", $F, !0), t.addEventListener("change", eI, !0), t.addEventListener("pointerdown", tI, !0), t.addEventListener("mousedown", tI, !0), JF(e.querySelectorAll(LF)), KF(e.querySelectorAll(`[${ir}]`)), GF(e.querySelectorAll(BF)), new MutationObserver((e) => {
		for (let t of e) WF(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", ir],
		attributeOldValue: !0
	});
}
function WF(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			qF(t, e.oldValue !== null);
			return;
		}
		let n = RF.test(e.oldValue ?? ""), r = t.matches(LF);
		n !== r && (YF(t, r), qF(t)), zF.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && GF(t.querySelectorAll(BF));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(LF) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && XF(n), n.matches(LF) && YF(n, !0), JF(n.querySelectorAll(LF)), qF(n), KF(n.querySelectorAll(`[${ir}]`)), GF([n, ...n.querySelectorAll(BF)]));
}
function GF(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = O(t);
		e !== VF.has(t) && (e ? (VF.add(t), t.addEventListener("touchstart", tI, { passive: !1 })) : (VF.delete(t), t.removeEventListener("touchstart", tI)));
	}
}
function KF(e) {
	for (let t of e) qF(t);
}
function qF(e, t = !1) {
	let n = e.getAttribute(ir);
	n === null && !t || (e.matches(LF) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Rd(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function JF(e) {
	for (let t of e) YF(t, !0);
}
function YF(e, t) {
	for (let n of e.children) t ? XF(n) : HF.has(n) && (HF.delete(n), n.removeAttribute("inert"));
}
function XF(e) {
	e.hasAttribute("inert") || (HF.add(e), e.setAttribute("inert", ""));
}
function ZF(e) {
	e.target instanceof Element && (E(e.target) ? (e.type === "click" && cu(e), nI(e)) : e.type === "click" && QF(e.target) && e.preventDefault());
}
function QF(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && O(e);
}
function $F(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && E(e.target)) {
			nI(e);
			return;
		}
		!FF.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && O(e.target) && e.preventDefault();
	}
}
function eI(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && O(e.target) && e.stopImmediatePropagation();
}
function tI(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !O(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function nI(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var rI = /* @__PURE__ */ new WeakMap(), iI = new pu({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = rI.get(e);
		rI.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), aI = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => iI.popupOf(r) === t;
		return rI.set(t, n.onDismiss), iI.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (rI.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && iI.reposition(r);
			},
			close: () => {
				i() && iI.close(r);
			}
		};
	},
	focusReturn: (e) => Ks(e)
};
//#endregion
//#region src/items/item-rows.ts
function oI(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Ov,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => ns(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var sI = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? uI(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), dI(l, n, t);
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
		let i = lI(r.item, t, n);
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
			cI(n, e) && this.applyBoundAttribute(i, String(C(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = C(t.bindingId);
			e.push([t, `[${Re}${Cr(n.propertyName)}="${Sr(r)}"]`]);
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
		let r = hI(t, n.templateKeyPropertyName);
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
		r !== void 0 && wv(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : Cv(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Ka(u, () => this.metadata.isTranslatable(a) && !Tv(l)), f = C(a.componentId), p = e.closest(`[${_}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = Er(p, t, () => [e])[0] ?? null;
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
function cI(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = C(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function lI(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? kv(r, i.name) : Pv(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Fv(r, i.key, n), e;
	let a = r;
	return a[jv(a, i.name)] = n, e;
}
function uI(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function dI(e, t, n) {
	e.setAttribute(v, t), mI(e, n), pI(e, n);
}
var fI = [
	["CanSelect", se],
	["CanDrag", ce],
	["CanRemove", le],
	["CanRename", ue],
	["CanShowContextMenu", de]
];
function pI(e, t) {
	for (let [n, r] of fI) {
		let i = kv(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function mI(e, t) {
	let n = kv(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(ct, n.value) : e.removeAttribute(ct);
}
function hI(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = kv(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var gI = "Group", _I = class {
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
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), F(e.root, `[${dt}="${ft}"]`, { attributeFilter: [Xe] }, (e) => {
			for (let t of e) {
				let e = li(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), F(e.root, `[${pt}="windowed"]`, { attributeFilter: [Et] }, (e) => {
			for (let t of e) {
				let e = li(t);
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
			for (let [t, n] of e) t.isConnected && MM(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(C(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Nv(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${y}]`)) {
			if ($_(r) !== "virtualized") continue;
			let i = r.closest(x);
			i === null || !this.drawsPatchedComponent(i, C(e.reference.componentId), t) || !vI(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(w(i), t) && this.sync(r, w(i));
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
		MM(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${v}="${Sr(t)}"]`)].filter((t) => this.isItemRoot(t) && ri(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${y}]`), i = r === null ? null : li(r);
		if (r !== null && i !== null && $_(r) === "virtualized") {
			let a = e.getAttribute(v);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = yI(gI, t);
		a && mI(e, this.options.renderer.getItemValue(e)), fI.some(([e]) => yI(e, t)) && pI(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && yI(gI, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => yI(e.itemProperty, t)) || n.sorts.some((e) => yI(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${y}]`)) {
			let n = li(t);
			n === e && this.sync(t, n);
		}
	}
};
function vI(e, t) {
	let n = ni(e, ti(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function yI(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var bI = "ui-table", xI = "ui-table--no-header";
function SI(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(bI)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(xI)) && (s ? o : a).push(t);
	a.forEach((e, t) => CI(e, t));
	for (let [e, n] of t) CI(e, a.length + n);
	n !== null && o.forEach((e, t) => CI(e, a.length + n + t)), wI(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function CI(e, t) {
	wI(e, "aria-rowindex", String(t + 1));
}
function wI(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var TI = 50, EI = 1, DI = .5, OI = 60, kI = "--ui-window-look", AI = "--ui-window-row", jI = "--ui-window-tile", MI = 3, NI = class {
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
			if (this.layout(t), BI(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = UI(e, St);
		if (t !== null && nF(e) && PI(e.getAttribute("data-ui-window-more-after"))) {
			Oo(e, Math.max(0, this.windowBottom(e, t) - Do(e).height));
			return;
		}
		t !== null && t !== 0 && Oo(e, PI(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = zI(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : RI(n[n.length - 1]).bottom - RI(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = UI(e, St), n = zI(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Do(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		$_(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${y}][${pt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = Eo(e.target);
		if (t === null || $_(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, OI));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && BI(e) > 0) return;
		let n = zI(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = UI(e, St), i = PI(e.getAttribute(wt)), a = PI(e.getAttribute(Tt));
		if (r !== null) {
			let o = this.windowSize(e), s = Do(e), c = Math.max(1, Math.round(s.height * EI / t.itemSize), Math.floor(o * DI)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, VI(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, VI(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Do(e), s = Math.max(1, o.height * EI), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, VI(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, VI(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = UI(e, Ct);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = li(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, e.setAttribute(yt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && UI(e, "data-ui-window-total") === null && II(e) && wM(e, CM, MI * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: HI(e),
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
			o.pending = !1, e.removeAttribute(yt), e.removeAttribute("aria-busy"), wM(e, CM, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = zI(e), r = UI(e, Ct), i = UI(e, St);
		if (SI(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			wM(e, "top", 0), wM(e, SM, 0);
			return;
		}
		if (n.length > 0) {
			let r = RI(n[n.length - 1]).bottom - RI(n[0]).top;
			if (r > 0) {
				let i = FI(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), LI(e, a > 1 ? (RI(n[n.length - 1]).top - RI(n[0]).top) / (a - 1) : r, i > 1 ? RI(n[1]).left - RI(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		wM(e, "top", a), wM(e, SM, o), UP(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(AI));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = UI(e, xt);
		return t !== null && t > 0 ? t : TI;
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
function PI(e) {
	return e !== null && e.toLowerCase() === "true";
}
function FI(e) {
	let t = RI(e[0]).top, n = 1;
	for (; n < e.length && RI(e[n]).top === t;) n++;
	return n;
}
function II(e) {
	return getComputedStyle(e).getPropertyValue(kI).trim() === "skeleton";
}
function LI(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(AI) !== i && r.setProperty(AI, i), r.getPropertyValue(jI) !== a && (a.length === 0 ? r.removeProperty(jI) : r.setProperty(jI, a));
}
function RI(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function zI(e) {
	return [...e.children].filter((e) => e.hasAttribute(v));
}
function BI(e) {
	return zI(e).length;
}
function VI(e) {
	return e.getAttribute(v);
}
function HI(e) {
	let t = e.closest(x);
	return t === null ? [] : ni(t, ti(t));
}
function UI(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var WI = [
	_,
	ae,
	oe
];
function GI(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, KI(c, e.itemRole);
	let l = JI(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = qI(l, t, n, a);
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
		d.className = l.wrapperClassName, KI(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), dI(d, r, n), c.appendChild(d);
	}
	return dI(c, r, n), o.registerItemScope(c, l, n), c;
}
function KI(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function qI(e, t, n, r) {
	let i = hI(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function JI(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of WI) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), w(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function YI(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return XI(i.renderer.renderItem(e, t, n, r), a);
	let s = GI(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), XI(s, a);
}
function XI(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var ZI = 6, QI = 60, $I = class {
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
	sync(e) {
		let t = this.getState(e);
		if (t === null) return;
		let n = nF(e) && iF(e);
		this.project(e, t), this.layout(e, t), n && !iF(e) && (Oo(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && gc(t.item, n)) {
				i.push(t);
				continue;
			}
			t !== void 0 && (t.element?.remove(), a.push(e)), i.push({
				key: e,
				item: n,
				element: null,
				height: t?.height ?? null
			});
		}
		for (let e of r.values()) e.element?.remove(), a.push(e.key);
		return n.entries = i, a;
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
		let i = n.entries[r].element, a = e.parentElement, o = z(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? gs(a, o, i) : null;
		i?.remove(), n.entries.splice(r, 1), s?.();
	}
	replace(e, t, n, r, i) {
		let a = this.getState(e), o = a === null ? -1 : a.entries.findIndex((e) => e.key === t);
		if (a !== null) {
			if (o < 0) {
				this.insert(e, n, r, i);
				return;
			}
			a.entries[o].element?.remove(), a.entries[o] = {
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
		return i === null || a === void 0 ? !1 : (a.item = lI(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Lv(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Vv(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => zv(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => rL(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Uv(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = rL(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Uv(e.item, t.item, a))), e !== "" && l.push({
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
		let t = Eo(e.target);
		t !== null && $_(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && $_(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, QI));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = lL(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = aL(e) ? oL(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || iL(e)) && u > 0) {
			let i = uL(r.paddingTop), a = Do(e), o = tL(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - ZI), f = Math.min(u, f + ZI);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], ee = [], te = !1;
		for (let e = 0; e < o; e++) {
			let r = n[e], i = e >= p && e < m, a = (r.header ? t.headers.get(rL(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), nL(t, r, null), te = !0);
				continue;
			}
			if (a !== null) {
				r.header && xM(a, r.entry.key), g.push(a), ee.push([a, e]);
				continue;
			}
			let o = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, h);
			o !== null && (nL(t, r, o), g.push(o), ee.push([o, e]), te = !0);
		}
		let ne = new Set(g);
		for (let e of t.entries) e.element !== null && !ne.has(e.element) && (e.element.remove(), e.element = null, te = !0);
		for (let t of z(e)) ne.has(t) || (t.remove(), te = !0);
		for (let t of e.querySelectorAll(`:scope > [${ot}]`)) ne.has(t) || (t.remove(), te = !0);
		for (let e of t.headers.values()) e.element !== null && !ne.has(e.element) && (e.element = null);
		let re = dL(l, 0, d), ie = dL(l, f, u);
		TM(e, [...g, ...gv(_v(e))]), wM(e, "top", re > 0 ? re - i : 0), wM(e, SM, ie > 0 ? ie - i : 0), vv(e, t.componentId, this.options.templates, this.options.renderer, o > 0), SI(e, ee, o), (te || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = sL(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return YI(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && xM(r, t.key), r;
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(rL(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = cL(o);
			s.height <= 0 || (eL(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(rL(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = ui(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of z(e)) {
			let e = t.getAttribute(v);
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
function eL(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function tL(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Oo(e, a + l + o), a + l);
}
function nL(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = rL(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function rL(e) {
	let t = kv(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function iL(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function aL(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function oL(e, t, n) {
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
function sL(e, t, n) {
	let r = e.clientWidth - uL(t.paddingLeft) - uL(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = uL(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function cL(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function lL(e) {
	return uL(e.rowGap);
}
function uL(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function dL(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var fL = "data-ui-template", pL = "default", mL = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? pL, r = this.findTemplate(e, n);
		return r === void 0 ? n === pL ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${fL}]`);
		for (let e of r) if (e.getAttribute(fL) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= hL(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, rt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, it);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function hL(e) {
	let t = /* @__PURE__ */ new Set();
	return Ga(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(x)) {
			let n = w(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function gL(e, t) {
	let n = e.querySelector(`style[${Rn}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(Rn, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var _L = "script[type='application/json'][data-ui-metadata]";
function vL(e = document) {
	let t = e.querySelector(_L);
	if (t === null) return yL();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return yL();
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
function yL() {
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
var bL = "script[type='application/json'][data-ui-hydration]";
function xL(e) {
	return e !== null && (va(e.title) || va(e.changes));
}
function SL(e = document) {
	let t = e.querySelector(bL)?.textContent?.trim() ?? "";
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
var CL = "reconnecting";
async function wL(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), CL;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function TL(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/reload-guard.ts
var EL = "ne-standard-ui:reloaded-view";
function DL(e, t, n) {
	if (!t) return "no-cookie";
	if (AL(n) === e) return "asked-again";
	try {
		n?.setItem(EL, e);
	} catch {}
	return "reload";
}
function OL(e) {
	try {
		e?.removeItem(EL);
	} catch {}
}
function kL() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function AL(e) {
	try {
		return e?.getItem(EL) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var jL = 2e3, ML = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? jL, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Wn, "reconnecting"), this.notice = this.notifications.show({
			message: T.text("ui.connection.reconnecting"),
			sticky: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Wn));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Wn, "lost");
	}
}, NL = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(PL(FL(e)));
	}
	async dispatchAsync(e) {
		let t = FL(e), n = PL(t);
		if (this.pendingKeys.has(n)) throw Error("Command is already pending.");
		this.pendingKeys.add(n);
		let r = this.nextRequestId++, i = this.expect(r);
		try {
			let e = await this.transport.processEventAsync({
				...t,
				requestId: r
			});
			return e.accepted === !0 ? await i : e;
		} finally {
			this.awaited.delete(r), this.pendingKeys.delete(n);
		}
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
function PL(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function FL(e) {
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
//#region src/state/property-state-store.ts
var IL = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && gc(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = LL(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(RL([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(LL(e, t));
		let n = this.unplaced.get(RL(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = LL(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(RL([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = RL(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, RL(t.slice(0, e - 1)));
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
		return `${C(e.componentId)}:${e.propertyId}:${zL(t)}`;
	}
};
function LL(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function RL(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function zL(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var BL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, VL = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, HL = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, UL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, WL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, GL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, KL = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, qL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, JL = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, YL = class {
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
}, G;
(function(e) {
	e[e.Trace = 0] = "Trace", e[e.Debug = 1] = "Debug", e[e.Information = 2] = "Information", e[e.Warning = 3] = "Warning", e[e.Error = 4] = "Error", e[e.Critical = 5] = "Critical", e[e.None = 6] = "None";
})(G ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Loggers.js
var XL = class {
	constructor() {}
	log(e, t) {}
};
XL.instance = new XL();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var ZL = "10.0.11", K = class {
	static isRequired(e, t) {
		if (e == null) throw Error(`The '${t}' argument is required.`);
	}
	static isNotEmpty(e, t) {
		if (!e || e.match(/^\s*$/)) throw Error(`The '${t}' argument should not be empty.`);
	}
	static isIn(e, t, n) {
		if (!(e in t)) throw Error(`Unknown ${n} value: ${e}.`);
	}
}, q = class e {
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
function QL(e, t) {
	let n = "";
	return eR(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${$L(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function $L(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function eR(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function tR(e, t, n, r, i, a) {
	let o = {}, [s, c] = aR();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${QL(i, a.logMessageContent)}.`);
	let l = eR(i) ? "arraybuffer" : "text", u = await n.post(r, {
		content: i,
		headers: {
			...o,
			...a.headers
		},
		responseType: l,
		timeout: a.timeout,
		withCredentials: a.withCredentials
	});
	e.log(G.Trace, `(${t} transport) request complete. Response status: ${u.statusCode}.`);
}
function nR(e) {
	return e === void 0 ? new iR(G.Information) : e === null ? XL.instance : e.log === void 0 ? new iR(e) : e;
}
var rR = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, iR = class {
	constructor(e) {
		this._minLevel = e, this.out = console;
	}
	log(e, t) {
		if (e >= this._minLevel) {
			let n = `[${(/* @__PURE__ */ new Date()).toISOString()}] ${G[e]}: ${t}`;
			switch (e) {
				case G.Critical:
				case G.Error:
					this.out.error(n);
					break;
				case G.Warning:
					this.out.warn(n);
					break;
				case G.Information:
					this.out.info(n);
					break;
				default: this.out.log(n);
			}
		}
	}
};
function aR() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, oR(ZL, sR(), lR(), cR())];
}
function oR(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function sR() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function cR() {
	if (q.isNode) return process.versions.node;
}
function lR() {
	return q.isNode ? "NodeJS" : "Browser";
}
function uR(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function dR() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var fR = class extends YL {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(dR());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new HL();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new HL();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new VL();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, eR(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
			throw n || (this._logger.log(G.Warning, `Error from HTTP request. ${e}.`), e);
		} finally {
			r && clearTimeout(r), e.abortSignal && (e.abortSignal.onabort = null);
		}
		if (!i.ok) throw new BL(await pR(i, "text") || i.statusText, i.status);
		let a = await pR(i, e.responseType);
		return new JL(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function pR(e, t) {
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
var mR = class extends YL {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new HL()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (eR(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new HL());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new JL(r.status, r.statusText, r.response || r.responseText)) : n(new BL(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new BL(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new VL());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, hR = class extends YL {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new fR(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new mR(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new HL()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, gR = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
gR.RecordSeparatorCode = 30, gR.RecordSeparator = String.fromCharCode(gR.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var _R = class {
	writeHandshakeRequest(e) {
		return gR.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (eR(e)) {
			let r = new Uint8Array(e), i = r.indexOf(gR.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(gR.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = gR.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var vR = class {
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
		return this.observers.push(e), new rR(this, e);
	}
}, yR = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			eR(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new bR(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, eR(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
			else if (this._bufferedByteCount < this._bufferSize) r._resolver();
			else break;
		}
		t !== -1 && (this._messages = this._messages.slice(t + 1));
	}
	_shouldProcessMessage(e) {
		if (this._waitForSequenceMessage) return e.type === J.Sequence && (this._waitForSequenceMessage = !1, !0);
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
			type: J.Sequence,
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
			case J.Invocation:
			case J.StreamItem:
			case J.Completion:
			case J.StreamInvocation:
			case J.CancelInvocation: return !0;
			case J.Close:
			case J.Sequence:
			case J.Ping:
			case J.Ack: return !1;
		}
	}
	_ackTimer() {
		this._ackTimerHandle === void 0 && (this._ackTimerHandle = setTimeout(async () => {
			try {
				this._reconnectInProgress || await this._connection.send(this._protocol.writeMessage({
					type: J.Ack,
					sequenceId: this._latestReceivedSequenceId
				}));
			} catch {}
			clearTimeout(this._ackTimerHandle), this._ackTimerHandle = void 0;
		}, 1e3));
	}
}, bR = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, xR = 3e4, SR = 15e3, CR = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var wR = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? xR, this.keepAliveIntervalInMilliseconds = a ?? SR, this._statefulReconnectBufferSize = o ?? CR, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new _R(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
		if (this._connectionState !== Y.Disconnected && this._connectionState !== Y.Reconnecting) throw Error("The HubConnection must be in the Disconnected or Reconnecting state to change the url.");
		if (!e) throw Error("The HubConnection url must be a valid url.");
		this.connection.baseUrl = e;
	}
	start() {
		return this._startPromise = this._startWithStateTransitions(), this._startPromise;
	}
	async _startWithStateTransitions() {
		if (this._connectionState !== Y.Disconnected) return Promise.reject(/* @__PURE__ */ Error("Cannot start a HubConnection that is not in the 'Disconnected' state."));
		this._connectionState = Y.Connecting, this._logger.log(G.Debug, "Starting HubConnection.");
		try {
			await this._startInternal(), q.isBrowser && window.document.addEventListener("freeze", this._freezeEventListener), this._connectionState = Y.Connected, this._connectionStarted = !0, this._logger.log(G.Debug, "HubConnection connected successfully.");
		} catch (e) {
			return this._connectionState = Y.Disconnected, this._logger.log(G.Debug, `HubConnection failed to start successfully because of error '${e}'.`), Promise.reject(e);
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
			if (this._logger.log(G.Debug, "Sending handshake request."), await this._sendMessage(this._handshakeProtocol.writeHandshakeRequest(n)), this._logger.log(G.Information, `Using HubProtocol '${this._protocol.name}'.`), this._cleanupTimeout(), this._resetTimeoutPeriod(), this._resetKeepAliveInterval(), await e, this._stopDuringStartError) throw this._stopDuringStartError;
			this.connection.features.reconnect && (this._messageBuffer = new yR(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
				if (this._messageBuffer) return this._messageBuffer._resend();
			}), this.connection.features.inherentKeepAlive || await this._sendMessage(this._cachedPingMessage);
		} catch (e) {
			throw this._logger.log(G.Debug, `Hub handshake failed with error '${e}' during start(). Stopping HubConnection.`), this._cleanupTimeout(), this._cleanupPingTimer(), await this.connection.stop(e), e;
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
		if (this._connectionState === Y.Disconnected) return this._logger.log(G.Debug, `Call to HubConnection.stop(${e}) ignored because it is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === Y.Disconnecting) return this._logger.log(G.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
		let t = this._connectionState;
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new HL("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new vR();
		return o.cancelCallback = () => {
			let e = this._createCancelInvocation(i.invocationId);
			return delete this._callbacks[i.invocationId], a.then(() => this._sendWithProtocol(e));
		}, this._callbacks[i.invocationId] = (e, t) => {
			if (t) {
				o.error(t);
				return;
			}
			e && (e.type === J.Completion ? e.error ? o.error(Error(e.error)) : o.complete() : o.next(e.item));
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
				n && (n.type === J.Completion ? n.error ? t(Error(n.error)) : e(n.result) : t(/* @__PURE__ */ Error(`Unexpected message type: ${n.type}`)));
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
				case J.Invocation:
					this._invokeClientMethod(e).catch((e) => {
						this._logger.log(G.Error, `Invoke client method threw error: ${uR(e)}`);
					});
					break;
				case J.StreamItem:
				case J.Completion: {
					let t = this._callbacks[e.invocationId];
					if (t) {
						e.type === J.Completion && delete this._callbacks[e.invocationId];
						try {
							t(e);
						} catch (e) {
							this._logger.log(G.Error, `Stream callback threw error: ${uR(e)}`);
						}
					}
					break;
				}
				case J.Ping: break;
				case J.Close: {
					this._logger.log(G.Information, "Close message received from server.");
					let t = e.error ? /* @__PURE__ */ Error("Server returned an error on close: " + e.error) : void 0;
					e.allowReconnect === !0 ? this.connection.stop(t) : this._stopPromise = this._stopInternal(t);
					break;
				}
				case J.Ack:
					this._messageBuffer && this._messageBuffer._ack(e);
					break;
				case J.Sequence:
					this._messageBuffer && this._messageBuffer._resetSequence(e);
					break;
				default: this._logger.log(G.Warning, `Invalid message type: ${e.type}.`);
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
			this._logger.log(G.Error, t);
			let n = Error(t);
			throw this._handshakeRejecter(n), n;
		}
		if (t.error) {
			let e = "Server returned handshake error: " + t.error;
			this._logger.log(G.Error, e);
			let n = Error(e);
			throw this._handshakeRejecter(n), n;
		}
		return this._logger.log(G.Debug, "Server handshake complete."), this._handshakeResolver(), n;
	}
	_resetKeepAliveInterval() {
		this.connection.features.inherentKeepAlive || (this._nextKeepAlive = (/* @__PURE__ */ new Date()).getTime() + this.keepAliveIntervalInMilliseconds, this._cleanupPingTimer());
	}
	_resetTimeoutPeriod() {
		if (!this.connection.features || !this.connection.features.inherentKeepAlive) {
			this._timeoutHandle = setTimeout(() => this.serverTimeout(), this.serverTimeoutInMilliseconds);
			let e = this._nextKeepAlive - (/* @__PURE__ */ new Date()).getTime();
			if (e < 0) {
				this._connectionState === Y.Connected && this._trySendPingMessage();
				return;
			}
			this._pingServerHandle === void 0 && (e < 0 && (e = 0), this._pingServerHandle = setTimeout(async () => {
				this._connectionState === Y.Connected && await this._trySendPingMessage();
			}, e));
		}
	}
	serverTimeout() {
		this.connection.stop(/* @__PURE__ */ Error("Server timeout elapsed without receiving a message from the server."));
	}
	async _invokeClientMethod(e) {
		let t = e.target.toLowerCase(), n = this._methods[t];
		if (!n) {
			this._logger.log(G.Warning, `No client method with the name '${t}' found.`), e.invocationId && (this._logger.log(G.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), await this._sendWithProtocol(this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)));
			return;
		}
		let r = n.slice(), i = !!e.invocationId, a, o, s;
		for (let n of r) try {
			let r = a;
			a = await n.apply(this, e.arguments), i && a && r && (this._logger.log(G.Error, `Multiple results provided for '${t}'. Sending error to server.`), s = this._createCompletionMessage(e.invocationId, "Client provided multiple results.", null)), o = void 0;
		} catch (e) {
			o = e, this._logger.log(G.Error, `A callback for the method '${t}' threw error '${e}'.`);
		}
		s ? await this._sendWithProtocol(s) : i ? (o ? s = this._createCompletionMessage(e.invocationId, `${o}`, null) : a === void 0 ? (this._logger.log(G.Warning, `No result given for '${t}' method and invocation ID '${e.invocationId}'.`), s = this._createCompletionMessage(e.invocationId, "Client didn't provide a result.", null)) : s = this._createCompletionMessage(e.invocationId, null, a), await this._sendWithProtocol(s)) : a && this._logger.log(G.Error, `Result given for '${t}' method but server is not expecting a result.`);
	}
	_connectionClosed(e) {
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new HL("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
	}
	_completeClose(e) {
		if (this._connectionStarted) {
			this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._messageBuffer &&= (this._messageBuffer._dispose(e ?? /* @__PURE__ */ Error("Connection closed.")), void 0), q.isBrowser && window.document.removeEventListener("freeze", this._freezeEventListener);
			try {
				this._closedCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(G.Error, `An onclose callback called with error '${e}' threw error '${t}'.`);
			}
		}
	}
	async _reconnect(e) {
		let t = Date.now(), n = 0, r = e === void 0 ? /* @__PURE__ */ Error("Attempting to reconnect due to a unknown error.") : e, i = this._getNextRetryDelay(n, 0, r);
		if (i === null) {
			this._logger.log(G.Debug, "Connection not reconnecting because the IRetryPolicy returned null on the first reconnect attempt."), this._completeClose(e);
			return;
		}
		if (this._connectionState = Y.Reconnecting, e ? this._logger.log(G.Information, `Connection reconnecting because of error '${e}'.`) : this._logger.log(G.Information, "Connection reconnecting."), this._reconnectingCallbacks.length !== 0) {
			try {
				this._reconnectingCallbacks.forEach((t) => t.apply(this, [e]));
			} catch (t) {
				this._logger.log(G.Error, `An onreconnecting callback called with error '${e}' threw error '${t}'.`);
			}
			if (this._connectionState !== Y.Reconnecting) {
				this._logger.log(G.Debug, "Connection left the reconnecting state in onreconnecting callback. Done reconnecting.");
				return;
			}
		}
		for (; i !== null;) {
			if (this._logger.log(G.Information, `Reconnect attempt number ${n + 1} will start in ${i} ms.`), await new Promise((e) => {
				this._reconnectDelayHandle = setTimeout(e, i);
			}), this._reconnectDelayHandle = void 0, this._connectionState !== Y.Reconnecting) {
				this._logger.log(G.Debug, "Connection left the reconnecting state during reconnect delay. Done reconnecting.");
				return;
			}
			try {
				if (await this._startInternal(), this._connectionState = Y.Connected, this._logger.log(G.Information, "HubConnection reconnected successfully."), this._reconnectedCallbacks.length !== 0) try {
					this._reconnectedCallbacks.forEach((e) => e.apply(this, [this.connection.connectionId]));
				} catch (e) {
					this._logger.log(G.Error, `An onreconnected callback called with connectionId '${this.connection.connectionId}; threw error '${e}'.`);
				}
				return;
			} catch (e) {
				if (this._logger.log(G.Information, `Reconnect attempt failed because of error '${e}'.`), this._connectionState !== Y.Reconnecting) {
					this._logger.log(G.Debug, `Connection moved to the '${this._connectionState}' from the reconnecting state during reconnect attempt. Done reconnecting.`), this._connectionState === Y.Disconnecting && this._completeClose();
					return;
				}
				n++, r = e instanceof Error ? e : Error(e.toString()), i = this._getNextRetryDelay(n, Date.now() - t, r);
			}
		}
		this._logger.log(G.Information, `Reconnect retries have been exhausted after ${Date.now() - t} ms and ${n} failed attempts. Connection disconnecting.`), this._completeClose();
	}
	_getNextRetryDelay(e, t, n) {
		try {
			return this._reconnectPolicy.nextRetryDelayInMilliseconds({
				elapsedMilliseconds: t,
				previousRetryCount: e,
				retryReason: n
			});
		} catch (n) {
			return this._logger.log(G.Error, `IRetryPolicy.nextRetryDelayInMilliseconds(${e}, ${t}) threw error '${n}'.`), null;
		}
	}
	_cancelCallbacksWithError(e) {
		let t = this._callbacks;
		this._callbacks = {}, Object.keys(t).forEach((n) => {
			let r = t[n];
			try {
				r(null, e);
			} catch (t) {
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${uR(t)}`);
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
			type: J.Invocation
		} : {
			target: e,
			arguments: t,
			streamIds: r,
			type: J.Invocation
		};
		{
			let n = this._invocationId;
			return this._invocationId++, r.length === 0 ? {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				type: J.Invocation
			} : {
				target: e,
				arguments: t,
				invocationId: n.toString(),
				streamIds: r,
				type: J.Invocation
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
			type: J.StreamInvocation
		} : {
			target: e,
			arguments: t,
			invocationId: r.toString(),
			streamIds: n,
			type: J.StreamInvocation
		};
	}
	_createCancelInvocation(e) {
		return {
			invocationId: e,
			type: J.CancelInvocation
		};
	}
	_createStreamItemMessage(e, t) {
		return {
			invocationId: e,
			item: t,
			type: J.StreamItem
		};
	}
	_createCompletionMessage(e, t, n) {
		return t ? {
			error: t,
			invocationId: e,
			type: J.Completion
		} : {
			invocationId: e,
			result: n,
			type: J.Completion
		};
	}
	_createCloseMessage() {
		return { type: J.Close };
	}
	async _trySendPingMessage() {
		try {
			await this._sendMessage(this._cachedPingMessage);
		} catch {
			this._cleanupPingTimer();
		}
	}
}, TR = [
	0,
	2e3,
	1e4,
	3e4,
	null
], ER = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? TR : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, DR = class {};
DR.Authorization = "Authorization", DR.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var OR = class extends YL {
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
		e.headers ||= {}, this._accessToken ? e.headers[DR.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[DR.Authorization] && delete e.headers[DR.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, X;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(X ||= {});
var kR;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(kR ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var AR = class {
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
}, jR = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new AR(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, kR, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === kR.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = aR(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === kR.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(G.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new BL(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${QL(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new BL(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof VL ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? tR(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = aR();
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
			i ? i instanceof BL && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Stop finished."), this._raiseOnClose();
		}
	}
	_raiseOnClose() {
		if (this.onclose) {
			let e = "(LongPolling transport) Firing onclose event.";
			this._closeError && (e += " Error: " + this._closeError), this._logger.log(G.Trace, e), this.onclose(this._closeError);
		}
	}
}, MR = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, kR, "transferFormat"), this._logger.log(G.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== kR.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (q.isBrowser || q.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = aR();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${QL(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
					} catch (e) {
						this._close(e);
						return;
					}
				}, a.onerror = (e) => {
					i ? this._close() : r(/* @__PURE__ */ Error("EventSource failed to connect. The connection could not be found on the server, either the connection ID is not present on the server, or a proxy is refusing/buffering the connection. If you have multiple servers check that sticky sessions are enabled."));
				}, a.onopen = () => {
					this._logger.log(G.Information, `SSE connected to ${this._url}`), this._eventSource = a, i = !0, n();
				};
			} catch (e) {
				r(e);
				return;
			}
		});
	}
	async send(e) {
		return this._eventSource ? tR(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, NR = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, kR, "transferFormat"), this._logger.log(G.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (q.isNode || q.isReactNative) {
				let t = {}, [r, i] = aR();
				t[r] = i, n && (t[DR.Authorization] = `Bearer ${n}`), o && (t[DR.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === kR.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(G.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(G.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${QL(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${QL(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
	}
	stop() {
		return this._webSocket && this._close(void 0), Promise.resolve();
	}
	_close(e) {
		this._webSocket &&= (this._webSocket.onclose = () => {}, this._webSocket.onmessage = () => {}, this._webSocket.onerror = () => {}, this._webSocket.close(), void 0), this._logger.log(G.Trace, "(WebSockets transport) socket closed."), this.onclose && (this._isCloseEvent(e) && (e.wasClean === !1 || e.code !== 1e3) ? this.onclose(/* @__PURE__ */ Error(`WebSocket closed with status code: ${e.code} (${e.reason || "no reason given"}).`)) : e instanceof Error ? this.onclose(e) : this.onclose());
	}
	_isCloseEvent(e) {
		return e && typeof e.wasClean == "boolean" && typeof e.code == "number";
	}
}, PR = 100, FR = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = nR(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new OR(n.httpClient || new hR(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= kR.Binary, K.isIn(e, kR, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${kR[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new HL(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new HL(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new LR(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
	}
	async stop(e) {
		if (this._connectionState === "Disconnected") return this._logger.log(G.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnected state.`), Promise.resolve();
		if (this._connectionState === "Disconnecting") return this._logger.log(G.Debug, `Call to HttpConnection.stop(${e}) ignored because the connection is already in the disconnecting state.`), this._stopPromise;
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
				this._logger.log(G.Error, `HttpConnection.transport.stop() threw error '${e}'.`), this._stopConnection();
			}
			this.transport = void 0;
		} else this._logger.log(G.Debug, "HttpConnection.transport is undefined in HttpConnection.stop() because start() failed.");
	}
	async _startInternal(e) {
		let t = this.baseUrl;
		this._accessTokenFactory = this._options.accessTokenFactory, this._httpClient._accessTokenFactory = this._accessTokenFactory;
		try {
			if (this._options.skipNegotiation) {
				if (this._options.transport === X.WebSockets) this.transport = this._constructTransport(X.WebSockets), await this._startTransport(t, e);
				else throw Error("Negotiation can only be skipped when using the WebSocket transport directly.");
			} else {
				let n = null, r = 0;
				do {
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new HL("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < PR);
				if (r === PR && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof jR && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = aR();
		t[n] = r;
		let i = this._resolveNegotiateUrl(e);
		this._logger.log(G.Debug, `Sending negotiation request: ${i}.`);
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new KL("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof BL && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new KL(t));
		}
	}
	_createConnectUrl(e, t) {
		return t ? e + (e.indexOf("?") === -1 ? "?" : "&") + `id=${t}` : e;
	}
	async _createTransport(e, t, n, r) {
		let i = this._createConnectUrl(e, n.connectionToken);
		if (this._isITransport(t)) {
			this._logger.log(G.Debug, "Connection was provided an instance of ITransport, using that directly."), this.transport = t, await this._startTransport(i, r), this.connectionId = n.connectionId;
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new GL(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new HL(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new qL(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new NR(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new MR(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new jR(this._httpClient, this._logger, this._options);
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
		let i = X[e.transport];
		if (i == null) return this._logger.log(G.Debug, `Skipping transport '${e.transport}' because it is not supported by this client.`), /* @__PURE__ */ Error(`Skipping transport '${e.transport}' because it is not supported by this client.`);
		if (IR(t, i)) {
			if (e.transferFormats.map((e) => kR[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new UL(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${kR[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${kR[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new WL(`'${X[i]}' is disabled by the client.`, i);
	}
	_isITransport(e) {
		return e && typeof e == "object" && "connect" in e;
	}
	_stopConnection(e) {
		if (this._logger.log(G.Debug, `HttpConnection.stopConnection(${e}) called while in state ${this._connectionState}.`), this.transport = void 0, e = this._stopError || e, this._stopError = void 0, this._connectionState === "Disconnected") {
			this._logger.log(G.Debug, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is already in the disconnected state.`);
			return;
		}
		if (this._connectionState === "Connecting") throw this._logger.log(G.Warning, `Call to HttpConnection.stopConnection(${e}) was ignored because the connection is still in the connecting state.`), Error(`HttpConnection.stopConnection(${e}) was called while the connection is still in the connecting state.`);
		if (this._connectionState === "Disconnecting" && this._stopPromiseResolver(), e ? this._logger.log(G.Error, `Connection disconnected with error '${e}'.`) : this._logger.log(G.Information, "Connection disconnected."), this._sendQueue &&= (this._sendQueue.stop().catch((e) => {
			this._logger.log(G.Error, `TransportSendQueue.stop() threw error '${e}'.`);
		}), void 0), this.connectionId = void 0, this._connectionState = "Disconnected", this._connectionStarted) {
			this._connectionStarted = !1;
			try {
				this.onclose && this.onclose(e);
			} catch (t) {
				this._logger.log(G.Error, `HttpConnection.onclose(${e}) threw error '${t}'.`);
			}
		}
	}
	_resolveUrl(e) {
		if (e.lastIndexOf("https://", 0) === 0 || e.lastIndexOf("http://", 0) === 0) return e;
		if (!q.isBrowser) throw Error(`Cannot resolve '${e}'.`);
		let t = window.document.createElement("a");
		return t.href = e, this._logger.log(G.Information, `Normalizing '${e}' to '${t.href}'.`), t.href;
	}
	_resolveNegotiateUrl(e) {
		let t = new URL(e);
		t.pathname.endsWith("/") ? t.pathname += "negotiate" : t.pathname += "/negotiate";
		let n = new URLSearchParams(t.searchParams);
		return n.has("negotiateVersion") || n.append("negotiateVersion", this._negotiateVersion.toString()), n.has("useStatefulReconnect") ? n.get("useStatefulReconnect") === "true" && (this._options._useStatefulReconnect = !0) : this._options._useStatefulReconnect === !0 && n.append("useStatefulReconnect", "true"), t.search = n.toString(), t.toString();
	}
};
function IR(e, t) {
	return !e || (t & e) !== 0;
}
var LR = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new RR(), this._transportResult = new RR(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new RR(), this._transportResult.promise;
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
			this._sendBufferedData = new RR();
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
}, RR = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, zR = "json", BR = class {
	constructor() {
		this.name = zR, this.version = 2, this.transferFormat = kR.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = XL.instance);
		let n = gR.parse(e), r = [];
		for (let e of n) {
			let n = JSON.parse(e);
			if (typeof n.type != "number") throw Error("Invalid payload.");
			switch (n.type) {
				case J.Invocation:
					this._isInvocationMessage(n);
					break;
				case J.StreamItem:
					this._isStreamItemMessage(n);
					break;
				case J.Completion:
					this._isCompletionMessage(n);
					break;
				case J.Ping: break;
				case J.Close: break;
				case J.Ack:
					this._isAckMessage(n);
					break;
				case J.Sequence:
					this._isSequenceMessage(n);
					break;
				default:
					t.log(G.Information, "Unknown message type '" + n.type + "' ignored.");
					continue;
			}
			r.push(n);
		}
		return r;
	}
	writeMessage(e) {
		return gR.write(JSON.stringify(e));
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
}, VR = {
	trace: G.Trace,
	debug: G.Debug,
	info: G.Information,
	information: G.Information,
	warn: G.Warning,
	warning: G.Warning,
	error: G.Error,
	critical: G.Critical,
	none: G.None
};
function HR(e) {
	let t = VR[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var UR = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), WR(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = HR(e);
			this.logger = new iR(t);
		} else this.logger = new iR(e);
		return this;
	}
	withUrl(e, t) {
		return K.isRequired(e, "url"), K.isNotEmpty(e, "url"), this.url = e, this.httpConnectionOptions = typeof t == "object" ? {
			...this.httpConnectionOptions,
			...t
		} : {
			...this.httpConnectionOptions,
			transport: t
		}, this;
	}
	withHubProtocol(e) {
		return K.isRequired(e, "protocol"), this.protocol = e, this;
	}
	withAutomaticReconnect(e) {
		if (this.reconnectPolicy) throw Error("A reconnectPolicy has already been set.");
		return this.reconnectPolicy = e ? Array.isArray(e) ? new ER(e) : e : new ER(), this;
	}
	withServerTimeout(e) {
		return K.isRequired(e, "milliseconds"), this._serverTimeoutInMilliseconds = e, this;
	}
	withKeepAliveInterval(e) {
		return K.isRequired(e, "milliseconds"), this._keepAliveIntervalInMilliseconds = e, this;
	}
	withStatefulReconnect(e) {
		return this.httpConnectionOptions === void 0 && (this.httpConnectionOptions = {}), this.httpConnectionOptions._useStatefulReconnect = !0, this._statefulReconnectBufferSize = e?.bufferSize, this;
	}
	build() {
		let e = this.httpConnectionOptions || {};
		if (e.logger === void 0 && (e.logger = this.logger), !this.url) throw Error("The 'HubConnectionBuilder.withUrl' method must be called before building the connection.");
		let t = new FR(this.url, e);
		return wR.create(t, this.logger || XL.instance, this.protocol || new BR(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function WR(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var GR = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, KR = class {
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
	failAttach(e) {
		this.closedBy === null && (this.pending = !1, this.fail(e), this.gate = this.arm());
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
}, qR = class {
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
}, JR = 500;
function YR(e) {
	let { changes: t, ...n } = e;
	return n;
}
function XR() {
	return {};
}
var ZR = class {
	windowId;
	connection;
	started = !1;
	gate = new KR();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new qR(t), this.connection = new UR().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
			0,
			1e3,
			3e3,
			1e4,
			3e4
		]]).configureLogging(G.Warning).build();
	}
	get instanceId() {
		return this.connection.connectionId ?? null;
	}
	get isReconnecting() {
		return this.connection.state === Y.Reconnecting;
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
		if (!(this.started || this.connection.state !== Y.Disconnected)) try {
			await this.connection.start(), this.started = !0, l("SignalR connected.", {
				connectionId: this.connection.connectionId,
				windowId: this.windowId
			});
		} catch (e) {
			throw this.started = !1, c("SignalR connection failed.", e), e;
		}
	}
	async stopAsync() {
		this.connection.state !== Y.Disconnected && (await this.connection.stop(), this.started = !1);
	}
	close(e) {
		this.gate.close(e), this.stopAsync().catch((e) => s("stopping the lost connection failed.", e));
	}
	async attachAsync(e) {
		try {
			let t = await this.invokeCoreAsync("AttachAsync", [e]);
			return t.fresh !== !0 && this.gate.markAttached(), t;
		} catch (e) {
			throw this.gate.failAttach(e), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, YR));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, YR));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, YR));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, XR, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new GR(e) : e;
		}
	}
	whenAttached() {
		return this.gate.wait();
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, XR));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), JR);
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
		if (this.connection.state !== Y.Connected) {
			if (this.connection.state === Y.Disconnected) {
				this.started = !1, await this.startAsync();
				return;
			}
			throw Error(`SignalR connection is not ready. State: ${this.connection.state}.`);
		}
	}
}, QR = "/_ne/values", $R = 3e4;
function ez(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function tz(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function nz(e, t = $R) {
	if (e === void 0 || !tz(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${QR}/${encodeURIComponent(n)}`, {
			credentials: "same-origin",
			signal: AbortSignal.timeout(t)
		});
		if (!r.ok) throw Error(`Fetching a staged value failed with status ${r.status}.`);
		let { valueToken: i, ...a } = e;
		return {
			...a,
			value: await r.json()
		};
	}));
	return {
		...e,
		updates: n
	};
}
async function rz(e) {
	let t = await fetch(QR, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout($R)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var iz = Promise.resolve(), az = () => {}, oz = class {
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
		if (this.handed >= this.given) return iz;
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
		for (; this.flight !== null;) await this.flight.catch(az);
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = ez(e.value), r = n === null ? null : rz(n);
		return r?.catch(az), new Promise((i, a) => {
			let o = sz(e), s = this.queue.findIndex((e) => e.field === o), c = [{
				resolve: i,
				reject: a
			}];
			s >= 0 && (c = [...this.queue[s].settles, ...c], this.queue.splice(s, 1)), this.queue.push({
				field: o,
				update: e,
				body: n,
				staged: r,
				before: t,
				settles: c
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
		let e = this.queue.splice(0), t = this.given, n = [], r = [];
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, cz(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof GR) {
				this.requeue(r);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	requeue(e) {
		let t = [];
		for (let n of e) {
			let e = this.queue.findIndex((e) => e.field === n.field);
			if (e >= 0) {
				let t = this.queue[e];
				this.queue[e] = {
					...t,
					settles: [...n.settles, ...t.settles]
				};
				continue;
			}
			t.push({
				...n,
				staged: this.restage(n.body)
			});
		}
		t.length !== 0 && (this.queue.unshift(...t), this.given++);
	}
	restage(e) {
		if (e === null) return null;
		let t = this.transport.whenAttached().then(() => rz(e));
		return t.catch(az), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function sz(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function cz(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var lz = "form-owner", uz = "ui-form-";
function dz(e) {
	return uz + e.replace(/[ \t\n\f\r]/g, "_");
}
function fz(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = dz(t);
	mz(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function pz(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(uz) && mz(e);
	}
}
function mz(e) {
	let t = hz();
	if (t.querySelector(`form[id="${Sr(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function hz() {
	let e = document.body.querySelector(`[${kt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(kt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var gz = document;
function _z() {
	try {
		return gz.execCommand("copy");
	} catch {
		return !1;
	}
}
function vz(e) {
	try {
		return typeof gz.execCommand == "function" && gz.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var yz = /* @__PURE__ */ new Map([
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
]), bz = [
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
function xz(e) {
	return Q(e, bz);
}
var Sz = [
	"small",
	"medium",
	"large"
], Cz = ["default", "circle"], wz = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], Tz = [
	"start",
	"center",
	"end",
	"justify"
], Ez = ["nowrap", "wrap"], Dz = /* @__PURE__ */ new Map([
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
]), Oz = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), kz = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), Az = ["inline", "trailing"], jz = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], Mz = [
	"small",
	"medium",
	"large"
], Nz = [
	"small",
	"medium",
	"large"
], Pz = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], Fz = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], Iz = ["light", "dark"], Lz = [
	"start",
	"center",
	"end",
	"stretch"
], Rz = ["clip", "visible"], zz = [
	"visible",
	"hidden",
	"collapsed"
], Bz = [
	"background",
	"raised",
	"tinted"
], Vz = ["horizontal", "vertical"], Hz = [
	"none",
	"gap",
	"rule"
], Uz = [
	"none",
	"one",
	"many"
], Wz = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], Gz = ["stack", "wrap"], Kz = ["end", "start"], qz = [
	"disabled",
	"auto",
	"always"
], Jz = [
	"disabled",
	"proximity",
	"mandatory"
], Yz = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Xz = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], Zz = ["hex", "rgb"], Qz = ["field", "swatch"], $z = [
	"fill",
	"contain",
	"cover",
	"none"
], eB = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], tB = ["default", "circle"], nB = ["uniform", "vignette"], rB = ["linear", "circular"], iB = [
	"none",
	"vertical",
	"horizontal",
	"both"
], aB = [
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
], oB = [
	"None",
	"Shade",
	"Tint"
], sB = /* @__PURE__ */ new Map();
function cB(e) {
	return sB.get(e);
}
function Z(e, t, n) {
	return dB(e, lB(t, n), (e) => `${t}${Q(e, n)}`);
}
function lB(e, t) {
	return uB(t.map((t) => `${e}${t}`));
}
function uB(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function dB(e, t, n) {
	return sB.set(e, t), [e, n];
}
var fB = new Map([
	Z("colorClass", "ui-color--", bz),
	dB("themeColorClass", lB("ui-color--", bz), (e) => WB(e)),
	dB("iconClass", sf, (e) => cf(e)),
	["iconUrlCss", (e) => $d(e)],
	["safeUrl", (e) => zd(e)],
	["safeImageSource", (e) => Jd(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : hT(String(e))],
	Z("iconSizeClass", "ui-icon-size--", Sz),
	dB("iconShapeClass", uB(["ui-icon--circle"]), (e) => Q(e, Cz) === "circle" ? "ui-icon--circle" : ""),
	Z("textTypeClass", "ui-text-type--", wz),
	dB("textAppearanceClass", lB("ui-text-type--", wz), (e) => $B(e)),
	Z("textAlignmentClass", "ui-text--align-", Tz),
	Z("textWrapClass", "ui-text--", Ez),
	Z("textBadgePlacementClass", "ui-text__badge--", Az),
	Z("badgeStyleClass", "ui-badge-style--", Fz),
	["badgeTextFit", (e) => GB(e)],
	Z("buttonClass", "ui-button--", Pz),
	Z("surfaceStyleClass", "ui-surface--", Bz),
	Z("orientationClass", "ui-orientation--", Vz),
	Z("groupSeparatorClass", "ui-command-bar--separator-", Hz),
	["selectionModeAttribute", (e) => Q(e, Uz)],
	["selectionBackgroundCss", (e) => LB(PB(e, "background"))],
	["selectionForegroundCss", (e) => LB(PB(e, "foreground"))],
	["selectionMarkColorCss", (e) => LB(PB(e, "markColor"))],
	["selectionMarkCss", (e) => IB(PB(e, "mark"))],
	["selectionFontWeightCss", (e) => FB(PB(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => LB(PB(e, "actionBarBackground"))],
	Z("itemsViewLayoutClass", "ui-items-view--", Gz),
	Z("dragHandlePlacementClass", "ui-drag-handle--", Kz),
	Z("scrollXClass", "ui-scroll-x--", qz),
	Z("scrollYClass", "ui-scroll-y--", qz),
	["hostViewport", (e) => wB(e)],
	Z("scrollSnapClass", "ui-scroll-snap--", Jz),
	Z("inputAppearanceClass", "ui-input--", jz),
	Z("searchFieldAppearanceClass", "ui-search__field--", jz),
	Z("inputSizeClass", "ui-input--", Nz),
	Z("buttonSizeClass", "ui-button--", Mz),
	Z("buttonGroupSizeClass", "ui-button-group--", Mz),
	["textInputTypeAttribute", (e) => Q(e, Yz)],
	["inputModeAttribute", (e) => Q(e, Xz)],
	["colorTextFormatAttribute", (e) => Q(e, Zz)],
	["colorInputVariantAttribute", (e) => Q(e, Qz)],
	["themeNameCss", (e) => Q(e, Iz)],
	["alignmentCss", (e) => Q(e, Lz)],
	["alignmentStretchFallbackCss", (e) => Q(e, Lz) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, Rz)],
	["layoutLengthCss", (e) => TB(e)],
	["thicknessCss", (e) => DB(e)],
	dB("borderNoneClass", uB(["ui-border--none"]), (e) => kB(e)),
	["radiusCss", (e) => AB(e)],
	["gridUnitCss", (e) => jB(e)],
	["pixelsCss", (e) => lV(e)],
	["gridTemplateCss", (e) => MB(e)],
	["colorVariantCss", (e) => rV(e)],
	["themeColorCss", (e) => LB(e)],
	["themeInkCss", (e) => zB(e)],
	["themeOnColorCss", (e) => VB(e)],
	["themeColorInlineCss", (e) => RB(e) ? "" : LB(e)],
	["themeColorCanonical", (e) => tV(e)],
	["textAppearanceFontSizeCss", (e) => eV(e, "size")],
	["textAppearanceFontWeightCss", (e) => eV(e, "weight")],
	["textAppearanceLineHeightCss", (e) => eV(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => eV(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => TB(H(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => TB(H(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => TB(H(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => TB(H(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => TB(H(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => EB(H(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => EB(H(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => EB(H(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => EB(H(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => EB(H(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => EB(H(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => EB(H(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => EB(H(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => EB(H(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => EB(H(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => DB(H(e, "base"))],
	["responsiveThicknessSmCss", (e) => DB(H(e, "sm"))],
	["responsiveThicknessMdCss", (e) => DB(H(e, "md"))],
	["responsiveThicknessXlCss", (e) => DB(H(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => DB(H(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => OB(H(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => OB(H(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => OB(H(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => OB(H(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => OB(H(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => OB(H(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => OB(H(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => OB(H(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => OB(H(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => OB(H(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => uV(H(e, "base"))],
	["responsivePixelsSmCss", (e) => uV(H(e, "sm"))],
	["responsivePixelsMdCss", (e) => uV(H(e, "md"))],
	["responsivePixelsXlCss", (e) => uV(H(e, "xl"))],
	["responsivePixelsXxlCss", (e) => uV(H(e, "xxl"))],
	["visibilityBaseAttribute", (e) => dV(e, "base")],
	["visibilitySmAttribute", (e) => dV(e, "sm")],
	["visibilityMdAttribute", (e) => dV(e, "md")],
	["visibilityXlAttribute", (e) => dV(e, "xl")],
	["visibilityXxlAttribute", (e) => dV(e, "xxl")],
	["gridPlacementBaseColumnCss", (e) => $(e, "base", "column")],
	["gridPlacementBaseRowCss", (e) => $(e, "base", "row")],
	["gridPlacementBaseColumnSpanCss", (e) => $(e, "base", "columnSpan")],
	["gridPlacementBaseRowSpanCss", (e) => $(e, "base", "rowSpan")],
	["gridPlacementSmColumnCss", (e) => $(e, "sm", "column")],
	["gridPlacementSmRowCss", (e) => $(e, "sm", "row")],
	["gridPlacementSmColumnSpanCss", (e) => $(e, "sm", "columnSpan")],
	["gridPlacementSmRowSpanCss", (e) => $(e, "sm", "rowSpan")],
	["gridPlacementMdColumnCss", (e) => $(e, "md", "column")],
	["gridPlacementMdRowCss", (e) => $(e, "md", "row")],
	["gridPlacementMdColumnSpanCss", (e) => $(e, "md", "columnSpan")],
	["gridPlacementMdRowSpanCss", (e) => $(e, "md", "rowSpan")],
	["gridPlacementXlColumnCss", (e) => $(e, "xl", "column")],
	["gridPlacementXlRowCss", (e) => $(e, "xl", "row")],
	["gridPlacementXlColumnSpanCss", (e) => $(e, "xl", "columnSpan")],
	["gridPlacementXlRowSpanCss", (e) => $(e, "xl", "rowSpan")],
	["gridPlacementXxlColumnCss", (e) => $(e, "xxl", "column")],
	["gridPlacementXxlRowCss", (e) => $(e, "xxl", "row")],
	["gridPlacementXxlColumnSpanCss", (e) => $(e, "xxl", "columnSpan")],
	["gridPlacementXxlRowSpanCss", (e) => $(e, "xxl", "rowSpan")],
	Z("imageFitClass", "ui-image-fit--", $z),
	dB("imageShapeClass", uB(["ui-image--circle"]), (e) => Q(e, tB) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => gB(e)],
	["backgroundImageAttribute", (e) => gB(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => Q(e, eB)],
	["backgroundImageDimCss", (e) => _B(e)],
	["backgroundImageDimModeAttribute", (e) => Q(e, nB) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => yB(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => yB(e) ? "" : void 0],
	["positiveCount", (e) => vB(e)?.toString()],
	["positiveFlagAttribute", (e) => vB(e) === void 0 ? void 0 : ""],
	dB("maxLinesClass", uB(["ui-text--max-lines"]), (e) => vB(e) === void 0 ? "" : "ui-text--max-lines"),
	Z("progressVariantClass", "ui-progress--", rB),
	["progressValueText", (e) => cV(e)],
	["textAreaResizeCss", (e) => Q(e, iB)],
	Z("flyoutPlacementClass", "ui-flyout--", aB),
	["popupPlacementAttribute", (e) => Q(e, aB)],
	["tabMenuEntriesAttribute", (e) => mB(e)],
	["markedDaysAttribute", (e) => hB(e)]
]), pB = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function mB(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = pB.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function hB(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function gB(e) {
	return $d(e);
}
function _B(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function vB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function yB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var bB = [
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
], xB = new Map(bB.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), SB = new Map(bB.map(([e, t]) => [e, t])), CB = /* @__PURE__ */ new Map([[Rz, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : CB.get(t)?.get(e)) ?? yz.get(e) ?? Cr(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function wB(e) {
	return e == null || Q(e, qz) === "disabled" ? void 0 : "parent";
}
function TB(e) {
	if (e == null) return "";
	if (typeof e == "number") return lV(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? lV(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function EB(e, t) {
	if (typeof e != "object" || !e) return TB(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? TB(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function DB(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function OB(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return lV(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return lV(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function kB(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function AB(e) {
	if (e == null) return "";
	if (typeof e == "number") return lV(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? lV(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function jB(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return lV(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function MB(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return jB(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return jB(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${jB(e[0])})` : e.map((e) => jB(e)).join(" ");
}
function $(e, t, n) {
	return NB(H(e, t), n);
}
function NB(e, t) {
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
function PB(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function FB(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function IB(e) {
	if (e == null) return "";
	switch (Q(e, Wz)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function LB(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (nV(e)) return rV(e);
	let t = e, n = rV(t.light), r = rV(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = Dz.get(Q(o, bz));
	return s ? `var(${s})` : "";
}
function RB(e) {
	if (typeof e != "object" || !e || nV(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function zB(e) {
	if (RB(e)) {
		let t = Oz.get(Q(e.style, bz));
		if (t !== void 0) return `var(${t})`;
	}
	return LB(e);
}
var BB = /* @__PURE__ */ new Set(["background", "surface"]);
function VB(e) {
	if (typeof e != "object" || !e) return "";
	if (nV(e)) return HB(e) ? "initial" : UB(e);
	let t = e, n = UB(t.light ?? t.dark), r = UB(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && HB(t.light ?? t.dark) && HB(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, bz);
	if (BB.has(i)) return "initial";
	let a = kz.get(i);
	return a ? `var(${a})` : "";
}
function HB(e) {
	return iV(e)?.[3] === 0;
}
function UB(e) {
	let t = iV(e);
	return t === void 0 ? "" : PA(t[0], t[1], t[2], t[3]);
}
function WB(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, bz)}`;
}
function GB(e) {
	let t = YB(e == null ? "" : String(e).trim(), KB + 1);
	return t > 0 && t <= KB ? "compact" : "";
}
var KB = 2, qB = /[\u0300-\uFFFF]/, JB = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function YB(e, t) {
	if (!qB.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of JB.segment(e)) {
		if (n >= t) break;
		n += XB(r) ? 2 : 1;
	}
	return n;
}
function XB(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < ZB.length; e += 2) if (t >= ZB[e] && t <= ZB[e + 1]) return !0;
	return !1;
}
var ZB = [
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
function QB(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Fe, GB(n)), e.setAttribute(Ie, "");
}
function $B(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, wz)}`;
}
function eV(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return lV(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : lV(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : lV(e);
		}
		default: return "";
	}
}
function tV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = aV(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${NA(r.rgb >> 16 & 255)}${NA(r.rgb >> 8 & 255)}${NA(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${NA(e)}`;
	}
	let i = oV(r.name);
	return i === null ? "" : `${i}/${sV(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function nV(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function rV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = iV(e);
	return t === void 0 ? "" : `#${NA(t[0])}${NA(t[1])}${NA(t[2])}${NA(t[3])}`;
}
function iV(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = oV(t.name), i = n ?? (r === null ? void 0 : xB.get(r));
	if (!i) return;
	let a = sV(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = U(c * (1 - o)), l = U(l * (1 - o)), u = U(u * (1 - o))) : a === "Tint" && (c = U(c + (255 - c) * o), l = U(l + (255 - l) * o), u = U(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function aV(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = bz[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function oV(e) {
	if (typeof e == "number") return SB.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function sV(e) {
	if (typeof e == "number") return oB[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function cV(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function lV(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function uV(e) {
	return e == null ? "" : lV(e);
}
function dV(e, t) {
	let n = Lw(e, t);
	if (n == null) return;
	let r = Q(n, zz);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var fV = "ui-announcer", pV = 7e3, mV = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : T.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), pV), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${fV}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = fV, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, hV = "ui-notification-host", gV = "ui-notification", _V = "ui-notification--leaving", vV = "ui-notification__message", yV = "ui-notification__action", bV = "ui-notification__close", xV = 5e3, SV = 8e3, CV = "--ui-notification-lift", wV = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), TV = class {
	root;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? xV, this.ensureHost(), this.announcer = new mV(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = xz(e.severity), n = document.createElement("div");
		n.className = wV.has(t) ? `${gV} ${gV}--${t}` : gV, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = vV, typeof e.message == "string" ? r.textContent = e.message : T.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		i.type = "button", i.className = bV, T.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(OV(e.action, e.sticky === !0 ? null : () => this.dismiss(n)));
		let a = this.ensureHost();
		if (EV(a), a.append(n), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), e.sticky === !0) return n;
		let o = e.durationMs !== void 0 && e.durationMs > 0 ? e.durationMs : e.action === void 0 ? this.durationMs : SV, s = !1, c = !1, l = window.setTimeout(() => this.dismiss(n), o), u = () => window.clearTimeout(l), d = () => {
			s || c || (window.clearTimeout(l), l = window.setTimeout(() => this.dismiss(n), o));
		};
		return n.addEventListener("mouseenter", () => {
			s = !0, u();
		}), n.addEventListener("mouseleave", () => {
			s = !1, d();
		}), n.addEventListener("focusin", () => {
			c = !0, u();
		}), n.addEventListener("focusout", (e) => {
			e.relatedTarget instanceof Node && n.contains(e.relatedTarget) || (c = !1, d());
		}), n;
	}
	dismiss(e) {
		if (!(!e.isConnected || e.classList.contains(_V))) {
			if (e.classList.add(_V), this.returnFocus(e), Gc() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => DV(e), P.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(_V));
		Xs(Ks(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${bV}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${hV}`), n = t ?? document.createElement("div");
		return n.classList.add(hV), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function EV(e) {
	let t = window.innerHeight - Fl(window.innerHeight);
	t > 0 ? e.style.setProperty(CV, `${Math.round(t)}px`) : e.style.removeProperty(CV);
}
function DV(e) {
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
		duration: P.fast,
		easing: P.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function OV(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${yV} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : T.writeValue(n, null, e.label), n.addEventListener("click", () => {
		r || (e.run(), t !== null && (r = !0, t()));
	}), n;
}
function kV(e, t) {
	if (e == null || typeof e.id != "string" || e.id.length === 0) return;
	if (!ma(e.label) && !ha(e.label)) {
		s("a notification's action carries no words.", e);
		return;
	}
	let n = e.id;
	return {
		label: e.label,
		run: () => t(n)
	};
}
//#endregion
//#region src/effects/insert-text.ts
function AV(e, t, n) {
	let r = e.itemKey === !0 ? jV(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = MV(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	NV(i, r);
}
function jV(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function MV(e) {
	if (go(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (go(t)) return t;
	return null;
}
function NV(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || E(e) || O(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && vz(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function PV(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : FV(t, e.request?.parameters ?? null);
}
function FV(e, t) {
	let n = IV(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function IV(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, LV(e));
	return t.toString();
}
function LV(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function RV(e, t) {
	let n = BV([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return BV(r, t) ?? zV(t);
}
function zV(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && VV(t, e) ? t : null;
}
function BV(e, t) {
	let n = null;
	for (let r of e) if ($C(r, t)) {
		if (VV(r, t)) return r;
		n ??= r;
	}
	return n;
}
function VV(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var HV = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	runAction;
	valueReaders;
	reportTheme;
	navigate;
	address;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.runAction = e.runAction, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.navigate = e.navigate, this.address = e.address, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Hr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Hr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = PV(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Hd(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = Kr(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Ln, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = WV(e);
			t !== null && KV(t);
		}), this.register("ScrollTo", (e) => {
			let t = WV(e);
			if (t === null) return;
			let n = e.effect, r = Ur(n.behavior), i = Wr(n.block);
			t.scrollIntoView({
				behavior: GV(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = WV(e);
			if (t === null) return;
			let n = e.effect, r = RP(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Wr(n.block);
			QP(To(r)), zP(r, n.key, i === "Unknown" ? "Start" : i, GV(Ur(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = WV(e);
			if (t === null) return;
			let n = e.effect, r = qr(n.axis) !== "Horizontal", i = RV(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Gr(n.position), u;
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
			let d = GV(Ur(n.behavior)), f = Eo(i);
			f !== null && WP(f), r && l === "End" && nF(i) && ZP(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			UV(WV(e), null);
		}), this.register("Hide", (e) => {
			UV(WV(e), "hidden");
		}), this.register("Collapse", (e) => {
			UV(WV(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = qV(e, this.valueReaders);
			t !== null && JV(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = WV(e);
			t !== null && AV(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = WV(e);
			t !== null && !dd(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!Rd(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!ma(t.message) && !ha(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : kV(t.action, this.runAction)
			});
		}), this.register("Announce", (e) => {
			let t = e.effect;
			if (!ma(t.message) && !ha(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Jr(t.politeness) === "Assertive" ? "assertive" : "polite");
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
};
function UV(e, t) {
	if (e !== null) for (let n of nr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function WV(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(C(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function GV(e) {
	return e === "Smooth" && !Gc() ? "smooth" : "auto";
}
function KV(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(_s))) {
		e.focus();
		return;
	}
	let t = Ns(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function qV(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = WV(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : co(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : no(t.readHeld(r));
}
async function JV(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!YV(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function YV(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return _z();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var XV = class {
	root;
	returnFocusByKey = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	open(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (!t.hasAttribute("hidden")) return !0;
		t.removeAttribute("hidden");
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Ns(t), i = As() && go(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Us(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Xs(Ks(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Hl}="${Sr(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Wl}]`);
		if (n === null) return;
		let r = n.closest(`[${Hl}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Hl);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !su() && !Zl(e.target) && !Gp(e.target)) {
				let n = t.getAttribute(Hl);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(x)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return ql(this.root);
	}
	trapTab(e, t) {
		let n = Fs(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = Rs(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, ZV = "ui-leave", QV = new Tf("data-ui-leave-part"), $V = "560px", eH = null, tH = null;
function nH(e, t) {
	eH ??= rH();
	let n = eH;
	n.isConnected || document.body.append(n), iH(n, "title", T.text("ui.leave.title")), iH(n, "message", T.text("ui.leave.message")), iH(n, "stay", T.text("ui.leave.stay")), iH(n, "leave", T.text("ui.leave.confirm")), tH = {
		dialogs: e,
		leave: t
	}, e.open(ZV);
}
function rH() {
	let { dialog: e, surface: t } = wf({
		key: ZV,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", $V);
	let n = QV.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = QV.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, QV.actions(QV.button("ui-button--outline", "stay"), QV.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = QV.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = tH;
		tH = null, n?.dialogs.close(ZV), t === "leave" && n?.leave();
	}), e;
}
function iH(e, t, n) {
	let r = QV.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var aH = class {
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
		let t = oH(e, this.options.window.location.href);
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
function oH(e, t) {
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
	return Hd(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var sH = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(FV(this.route, e), !1);
	}
	push(e) {
		let t = FV(this.route, e), n = this.window.location;
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
		e.search !== this.search && (this.search = e.search, this.revisit(cH(e.search)));
	}
};
function cH(e) {
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
var lH = class {
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
		!this.state.set(e, t, n, dH(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Ka(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Be), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, dH(r[0]?.component)) ? {
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
			(typeof n == "string" || ha(n) ? this.addressResolver.isTranslatable(t.reference) : ma(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${ze}${Cr(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of Er(e, t, () => uH(e, a))) this.operations.apply({
				resolved: r,
				operation: t,
				target: o,
				value: i,
				convertedValue: n,
				local: !0
			});
		}
	}
	applyToComponent(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return !1;
		let i = this.shownValue(t, n);
		for (let e of r.definition.operations) {
			let t = this.extensions.converters.convert(e.converter, i);
			for (let n of this.addressResolver.resolveOperationTargets(r, e)) this.operations.apply({
				resolved: r,
				operation: e,
				target: n,
				value: i,
				convertedValue: t,
				local: !0
			});
		}
		return this.notifyValueChanged({
			reference: t,
			propertyName: r.propertyName,
			dynamicParameters: [],
			value: i,
			local: !0,
			components: [e]
		}), !0;
	}
	writeBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Be))), r = e.closest(x);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Be)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			po(e);
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
function uH(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(x) === e) return [n];
	return [e];
}
function dH(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(x) ?? null, r = e === null ? 0 : w(e), i = n.getAttribute(v);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: ni(e, ti(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var fH = "EndValue", pH = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of $s) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = C(e.componentId), r = mH(n, e.propertyId), i = this.watchers.get(r);
		if (i === void 0) {
			i = /* @__PURE__ */ new Set(), this.watchers.set(r, i);
			let t = this.sourcesByComponent.get(n) ?? [];
			t.push(e), this.sourcesByComponent.set(n, t);
		}
		return i.add(t), () => {
			i?.delete(t);
		};
	}
	applyEditedValue(e, t) {
		if (!(e.target instanceof Element)) return;
		let n = li(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(ut);
		for (let e of r) {
			if (t.metadata !== void 0 && t.metadata.getPropertyDefinition(e.propertyId)?.propertyName === fH !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = mH(C(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function mH(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function hH(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : w(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var gH = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, _H(t));
	}
	apply(e) {
		let t = C(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), zr(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) vH(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) yH(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) bH(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) xH(n, t.key, t.newIndex);
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
function _H(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function vH(e, t) {
	typeof t.key == "string" && (yH(e, t.key), e.splice(SH(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function yH(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function bH(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		vH(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function xH(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(SH(n, e.length), 0, i);
}
function SH(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var CH = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, wH(e, "", t.map((e) => e.split("."))));
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
function wH(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : wH(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function TH(e) {
	let t = new CH();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(C(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var EH = class {
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
}, DH = class {
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
function OH(e, t) {
	let n = kH(e[t], "Reset");
	if (n === null) return null;
	let r = C(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = kH(e[s], "Insert");
		if (t === null || C(t.component?.id) !== r || !gc(i, t.component?.dynamicParameters ?? [])) break;
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
function kH(e, t) {
	if (e === void 0 || Vr(e) !== "CollectionChange") return null;
	let n = e;
	return zr(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var AH = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function jH(e, t, n, r) {
	return {
		action: zr(e.action),
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
var MH = [], NH = class {
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
	held = new gH();
	projections;
	moves = new EH({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new DH({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => BH(z(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = TH(e), this.projections.isEmpty || Sv((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${y}]`)) {
			let e = li(n);
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
			return n === void 0 && (n = VH(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${y}]`)) {
			let t = ui(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Vr(t) !== "CollectionChange") continue;
			let e = t;
			if (zr(e.action) !== "Insert") continue;
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
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, zH(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of hH(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${y}]`)) {
			let t = li(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		MM(e, t, {
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
		let n = u() ? performance.now() : -1;
		for (let e = 0; e < t.length; e++) {
			let n = t[e];
			try {
				let r = OH(t, e);
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
		n >= 0 && d(`applied ${t.length} server update(s)`, n);
	}
	namesSink(e) {
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Ye) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, MH, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if ($_(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = VH(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && gc(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), RH(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
		switch (Vr(e)) {
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
		let t = C(e.address?.component?.id), n = Br(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, jH(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (zr(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = zr(e.action) === "Move" ? IH(e.moves ?? []) : MH;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if ($_(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (zr(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				PH(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				LH(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), ny(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = li(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = $_(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : Xv(e, z(e)).findIndex((e) => e.getAttribute(v) === t);
		return n < 0 ? null : n + ev(e);
	}
	moveRow(e, t, n) {
		let r = li(e);
		if (r === null) return;
		let i = Math.max(0, n - ev(e));
		$_(e) === "virtualized" ? this.virtualization.move(e, t, i) : LH(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = z(e), r = BH(n, t);
		if (r === null) return null;
		let i = Xv(e, n), a = i.indexOf(r);
		return $v(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = Xv(e, z(e));
		wy(t.element), e.insertBefore(t.element, Qv(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = li(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, Qv(Xv(e, z(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		$v(Xv(e, z(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (zr(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (zr(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${y}]`)) if (li(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Xv(e, z(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, Qv(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return YI(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = z(e), a = Xv(e, i), o = VH(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, Qv(a, l, i.index ?? null)) : (ty(a, c, l), c.replaceWith(l)));
		}
	}
};
function PH(e, t) {
	let n = z(e), r = Xv(e, n), i = VH(e, n), a = FH(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? gs(a, o, n) : null;
		i.delete(t), $v(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function FH(e) {
	let t = e.parentElement, n = t?.closest(A) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function IH(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function LH(e, t) {
	let n = z(e), r = Xv(e, n), i = VH(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = ey(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function RH(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? z(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function zH(e) {
	let t = w(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : w(n);
}
function BH(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function VH(e, t = z(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(v);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function HH(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return ma(n) || ha(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: WH(t.severity)
	} : void 0;
}
function UH(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = T.resolve(ma(t) || ha(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function WH(e) {
	let t = Ir(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var GH = "ui-validation--warning", KH = "ui-validation--info", qH = "ui-validation-message--marker", JH = "top-end", YH = "right", XH = "--ui-validation-marker-host", ZH = "ui-validation-mark", QH = "--ui-validation-presentation", $H = "--ui-validation-color", eU = "Validation", tU = /* @__PURE__ */ new Set(["Value", "EndValue"]), nU = /* @__PURE__ */ new Set(["Min", "Max"]), rU = `input:not([type='hidden']), textarea, select, .${pr}[role='combobox'], [role='spinbutton']`, iU = {
	Error: 0,
	Warning: 1,
	Info: 2
}, aU = {
	Error: yr,
	Warning: GH,
	Info: KH
}, oU = `.${yr}, .${GH}, .${KH}`, sU = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, cU = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, lU = {
	Error: `${ZH}--error`,
	Warning: `${ZH}--warning`,
	Info: `${ZH}--info`
}, uU = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, dU = class {
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
			e.target instanceof Element && this.refusesBounds(e.target);
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(oU)), F(this.root, oU, { childList: !0 }, (e) => this.applyRenderedMessages(e)), T.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(oU)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), T.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(oU)) {
			let t = w(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.forgetJudgement(i), o = this.options.metadata.getValidationsForComponent(r), s = t ?? (mU(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(i));
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
			_U(t, hU(t) === "Error");
			let e = t.querySelector(`:scope > [${br}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), vU(this.markerMirrors, t, e, {
				message: n,
				severity: hU(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(w(e), e) !== void 0)) return;
		let n = Ha(t), r = hU(e);
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
		if (e.propertyName === eU) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = tU.has(e.propertyName), n = nU.has(e.propertyName);
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
		let t = C(e.reference.componentId), n = HH(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = C(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Fr(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = C(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = ma(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: WH(e.severity),
			content: e.content === !0,
			property: Br(e.address?.property)
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
		let n = O(t) || E(t) ? null : fU(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return pU(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
			message: n,
			severity: "Error"
		}), this.boundRefused.add(t), this.touchedElements.add(t), this.refusalByElement.delete(t)), this.applyCurrentState(e, t), n !== null);
	}
	readValue(e) {
		return this.options.readValue?.(e) ?? this.options.valueReaders.readBound(e);
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
			severity: uU[t]
		}), this.applyCurrentState(w(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(w(e))) if (WH(r.severity) === "Error" && Mc(t, r.operator, r.value) && !Mc(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !Mc(t, r.operator, r.value) && (n === null || iU[WH(r.severity)] < iU[WH(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: cU[WH(n.severity)],
			words: n.message
		};
	}
	refuses(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return !1;
		let { componentId: n, element: r } = t, i = this.options.metadata.getValidationsForComponent(n);
		return this.touchedElements.add(r), this.judgeBounds(n, r), i.length > 0 && this.evaluateAndApply(n, r, i, mU(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(r)), this.hasError(n, r);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		gU(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(UH).join("\n"), !0);
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
			severity: WH(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || iU[e.severity] < iU[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Fr(e.trigger) === t);
		if (r.length === 0) return;
		let i = mU(e.target) ? this.options.valueReaders.readBound(e.target) : this.options.valueReaders.readHeld(n.element);
		this.evaluateAndApply(n.componentId, n.element, r, i);
	}
	runSubmitValidation(e) {
		let t = !0;
		for (let { field: n, component: r } of this.formFields(e)) {
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Fr(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.options.valueReaders.readBound(n))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${Ot}="${Sr(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(rU)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Gc() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && WH(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Mc(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function fU(e, t) {
	return K_(e, t) ?? (e.matches(gb) ? cx(e) : null);
}
function pU(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : ma(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function mU(e) {
	return !e.hasAttribute("data-ui-draft") && (e.hasAttribute("data-ui-value-kind") || e.matches("input, textarea, select"));
}
function hU(e) {
	return e.classList.contains(GH) ? "Warning" : e.classList.contains(KH) ? "Info" : "Error";
}
function gU(e, t, n) {
	for (let e of Object.values(aU)) t.classList.toggle(e, n !== void 0 && aU[n.severity] === e);
	_U(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty($H) : r.style.setProperty($H, `var(--ui-color-${sU[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Ba(i, null), i.textContent = String(n.message ?? "")) : T.writeValue(i, null, n?.message ?? null), vU(e, r, i, n));
}
function _U(e, t) {
	for (let n of e.querySelectorAll(rU)) {
		let r = n.closest(fr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function vU(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(QH).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(qH, o), yU(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(XH).trim()), r !== void 0 && o) {
		n.setAttribute(Ae, n.textContent ?? ""), n.setAttribute(je, JH), n.setAttribute(Ne, cU[r.severity]), t.setAttribute(Me, ""), t.contains(document.activeElement) ? LE(n) : RE(n);
		return;
	}
	n.removeAttribute(Ae), n.removeAttribute(je), n.removeAttribute(Ne), t.removeAttribute(Me), RE(n);
}
function yU(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : xU(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && bU(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${ZH} ${lU[n.severity]}`, s.textContent = r, s.setAttribute(Ae, r), s.setAttribute(je, YH), s.setAttribute(Ne, cU[n.severity]), s.setAttribute(Pe, ""), s.parentElement !== o && (bU(s), o.append(s)), o.setAttribute(Me, ""), e.set(t, s), RE(s);
}
function bU(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${ZH}`) === null && t.removeAttribute(Me);
}
function xU(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var SU = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, CU = "tooltip-name";
function wU(e, t, n) {
	let r = hT(e.getAttribute(Ae));
	if (Ba(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var TU = /* @__PURE__ */ new WeakMap(), EU = /* @__PURE__ */ new WeakMap(), DU = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Lr(e), t);
	}
	apply(e) {
		let t = Lr(e.operation.kind), n = this.handlers.get(t);
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
			let t = no(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Ba(e.target, null);
		}), this.register("Markup", (e) => {
			_T(e.target, ro(e.convertedValue) ? "" : no(e.convertedValue)), Ba(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = PU(e.operation);
			if (Ba(e.target, t), ro(e.value) || ro(e.convertedValue)) {
				NU(e.target, t);
				return;
			}
			MU(e.target, t, no(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = PU(e.operation);
			Ba(e.target, t), NU(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = PU(e.operation), n = !ro(e.value) && OU(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (ro(e.convertedValue) ? "" : no(e.convertedValue));
			kU(e.target, jU(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !ro(e.value) && OU(e.value, e.operation.condition ?? "None") ? no(e.convertedValue).trim() : "";
			AU(e.target, jU(e), t, cB(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = PU(e.operation), n = !ro(e.value) && OU(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? no(e.convertedValue).trim() : "";
				AU(e.target, jU(e), t, cB(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = PU(e.operation), n = e.target;
			if (ro(e.value) || ro(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = no(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(CU, (e) => wU(e.resolved.component, e.target, PU(e.operation))), this.register(lz, (e) => fz(e.target, e.value)), this.register("Property", (e) => {
			let t = PU(e.operation), n = e.target, r = ro(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function OU(e, t) {
	switch (Rr(t)) {
		case "None": return !0;
		case "HasValue": return !ro(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !ro(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return cf(e).length > 0;
		default: return !ro(e);
	}
}
function kU(e, t, n, r, i) {
	let a = EU.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), EU.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), MU(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && NU(e, n);
}
function AU(e, t, n, r) {
	let i = TU.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), TU.set(e, i));
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
function jU(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function MU(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function NU(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function PU(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var FU = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => fB.has(e.name),
			convert: (e) => fB.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = IU(e.name), n = {
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
function IU(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var LU = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Yr(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Yr(e.domEventName) || t;
		this.definitions.set(t, {
			name: t,
			domEventName: n,
			attach: e.attach ?? ((e) => e.root.addEventListener(n, e.dispatch, !0))
		});
	}
	registerNative(e, t = e) {
		this.register({
			name: e,
			domEventName: t
		});
	}
	get(e) {
		return this.definitions.get(Yr(e));
	}
};
function RU(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function zU(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(ms, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => RU(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => RU(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var BU = class {
	converters = new FU();
	events = new LU();
	operations = new DU();
	valueReaders;
	collectionSinks = new AH();
	rowDecorators = new SU();
	constructor(e, t, n, r) {
		zU(this.events), this.valueReaders = new ao(r);
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
}, VU = "Submenu", HU = "ui-menu__submenu", UU = "Select", WU = {
	kind: "menu",
	decorate: GU
};
function GU(e) {
	if (!KU(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, VU);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Mt, ""), qU(e.item, "Kind") === UU && e.row.setAttribute(Nt, ""), qU(e.item, "Expanded") === !0 && e.row.setAttribute(Pt, "");
	let r = document.createElement("div");
	r.className = HU, r.appendChild(n), dI(r, e.key, e.item), e.row.appendChild(r);
}
function KU(e) {
	let t = qU(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function qU(e, t) {
	let n = kv(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var JU = {
	kind: "grip",
	decorate: YU
};
function YU(e) {
	e.row.append(XU());
}
function XU() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), T.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function ZU(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify($U(n));
	for (let t of e.querySelectorAll(`[${Qe}]`)) QU(t, Ze, r), QU(t, nt, i);
}
function QU(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function $U(e) {
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
var eW = 2;
function tW(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= eW && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function nW(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var rW = "ne.standard.ui.windowId", iW = [
	500,
	1e3,
	2e3
], aW = 3, oW = [
	["refusal", ({ root: e }) => UF(e)],
	["file input", ({ root: e, validation: t }) => new yd({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Tp({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new Vp({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e }) => new pm({ root: e })],
	["field box press", ({ root: e }) => new om({ root: e })],
	["image fallback", ({ root: e }) => new Sm({ root: e })],
	["radio group sync", ({ root: e }) => new Nm({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new eg({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new sh({ root: e })],
	["debounced commit", ({ root: e }) => new yg({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new fg({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => Sg() ? void 0 : new Cg({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new YM({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Xg({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new lj({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new uS({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new LS({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new YS({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new mP({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new FP({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new LC({ root: e })],
	["split button", ({ root: e }) => new Ok({ root: e })],
	["toggle button", ({ root: e }) => new Jp({ root: e })],
	["button group", ({ root: e }) => new Pk({ root: e })],
	["menu", ({ root: e }) => new qE({ root: e })],
	["action bar", ({ root: e }) => new hw({ root: e })],
	["collapsible", ({ root: e }) => new NO({ root: e })],
	["menu group", ({ root: e }) => new Qw({ root: e })],
	["menu search", ({ root: e }) => new cO({ root: e })],
	["side drawer", ({ root: e }) => new SO({ root: e })],
	["skip link", ({ root: e }) => new DO({ root: e })],
	["screen keyboard", () => new Vy()],
	["grid splitter", ({ root: e }) => new mk({ root: e })],
	["accordion", ({ root: e }) => new Rk({ root: e })],
	["tabs", ({ root: e }) => new lA({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new GN({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new vA({ root: e })],
	["breadcrumbs", ({ root: e }) => new jA({ root: e })],
	["scroll anchor", ({ root: e }) => new $P({ root: e })],
	["surface press", ({ root: e }) => new sF({ root: e })],
	["text selection", ({ root: e }) => new pF({ root: e })],
	["scroll group", ({ root: e }) => new bF({ root: e })],
	["flyout interaction", ({ root: e }) => new ju({ root: e })],
	["text fold", ({ root: e }) => new aP({ root: e })],
	["tooltip", ({ root: e }) => cE(e)]
], sW = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Or(vL());
	hydration = SL();
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
		this.options = e, this.root = e.root ?? document, this.windowId = dW(e.windowIdStorageKey ?? rW), this.dom = new ci(this.root), T.load(this.root), T.setLanguage(document.documentElement.lang), e.strings !== void 0 && T.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : T.loadTableAsync(this.hydration.words.href)), this.extensions = new BU(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(WU), this.extensions.registerRowDecorator(JU);
		let t = new ei(this.dom, this.metadata), n = this.extensions.operations, r = new IL(), i = new lH(t, n, this.extensions, r);
		this.reactiveSources = new pH(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new XV({ root: this.root }), this.notifications = new TV({ root: this.root });
		let a = new sH({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		});
		this.effects = new HV({
			address: a,
			dialogs: this.dialogs,
			notifications: this.notifications,
			runAction: (e) => void this.eventPipeline.dispatchCommandAsync({
				eventId: 0,
				action: e,
				dynamicParameters: []
			}).catch((e) => s("running a notification's action failed.", e)),
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e)
		});
		let o = new zc(this.metadata), u, d = new Ec(o, i, new jc(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				u?.syncPropertyAsync(C(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), f = new mL(this.dom), p = new sI(this.metadata, f, this.extensions, n, r);
		this.virtualization = new $I({
			root: this.root,
			metadata: this.metadata,
			templates: f,
			renderer: p,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new NH(this.metadata, i, r, p, f, this.dom, this.virtualization, this.extensions.collectionSinks), T.onChange(() => this.rewriteWords(i, p)), this.rewriteMoments = () => this.rewriteWords(i, p, !0), T.onMomentTick(this.rewriteMoments), new _I({
			root: this.root,
			metadata: this.metadata,
			templates: f,
			renderer: p,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new ZR(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new NL(this.transport), T.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Dr.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Dr.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				gL(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && gL(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let m = new oz(this.transport);
		u = new ic({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: m,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => h.refusesBounds(e)
		}), i.setHeldTargets((e) => u?.isHeld(e) === !0), this.effects.register(Dr.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of u?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				h.discardForm(t);
			}
		}), this.leaveGuard = new aH({
			window,
			ask: async (e) => (await u?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => nH(this.dialogs, t),
			pending: () => _g() || m.isBusy,
			settle: async () => {
				vg(), await m.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Dr.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Hd(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let h = new dU({
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
			validation: h,
			dialogs: this.dialogs
		};
		for (let [e, t] of oW) tW(e, t, this.engineContext);
		tW("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new W_({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), tW("tree", ({ root: e, effects: t }) => new vN({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: p
			}
		}), this.engineContext), tW("items reorder", ({ root: e }) => new uy({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), tW("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new PF({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", w(e)) || d.hasEventForComponent("click", w(e))
		}) : void 0, this.engineContext), this.eventPipeline = new fc({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: d,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: h,
			valueBinding: u
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...o.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(UN.name, UN.registration);
		let g = sy(this.updateProcessor.moves);
		this.eventPipeline.addEvent(g.name, g.registration);
		let ee = ob(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, ee);
		this.eventPipeline.addEvent(dm.name, dm.registration), tW("shortcuts", ({ root: e, dom: t }) => new nD({
			root: e,
			viewShortcuts: rD(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), tW("item drag", ({ root: e, dom: t }) => new lb({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new rM({ root: this.root }), this.windows = new NI({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), tW("pager", ({ root: e, dom: t }) => new UD({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: T,
			observeComponents: F,
			observeSize: Oj,
			store: new Vw(),
			numbers: w_,
			temporal: Yi,
			icons: { apply: af },
			badges: { writeCount: QB },
			urls: {
				isImageSource: Kd,
				asBrowserReads: Gd,
				isSafeLink: Rd,
				isExternalLink: Vd
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => u?.hold(e),
				release: (e) => {
					u?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(x), a = r === null ? void 0 : this.metadata.getExposedProperty(w(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: IE,
			renames: { open: Ql },
			tables: this.tables,
			rows: oI(f, p, this.virtualization),
			uploads: cd(h),
			selection: Zo,
			popups: aI,
			roving: xo,
			focus: Ps,
			states: to,
			validation: h,
			wheel: Nf,
			shortcuts: Py,
			names: xr
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			Promise.resolve(this.applyChanges(t)).then(() => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			});
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new ML({
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
		let t = co(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.read(t);
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
		this.dom.invalidate(), T.language !== this.culturesLanguage && (this.culturesLanguage = T.language, Ga(this.root, (e) => ZU(e, T.number, T.temporal)));
		let i = n ? va : void 0;
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
		Ga(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = C(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${_}="${Sr(n)}"]`)) ii(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => ii(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: T.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: T.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = DL(e, navigator.cookieEnabled, kL());
		if (t === "no-cookie") {
			c("the server asked for a reload, and this browser keeps no cookie the reload could write; giving up.", { view: e });
			return;
		}
		if (t === "asked-again") {
			c("the server asked for a reload again after one (another compile of the view, or a session cookie the browser does not keep); giving up.", { view: e });
			return;
		}
		s("the server asked for a reload (another compile of the view, or a session it no longer holds); reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	reloadForFreshRuntime(e) {
		if (DL(e, navigator.cookieEnabled, kL()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		te(this, this.options.handlerGlobalKey), pz(this.root), await uW();
		let e = this.connectAsync();
		await this.hydrateAsync(), this.startEnginesAwaitingHydration(), await e && (await this.attachAsync(), this.connectionLost || l(`page live ${f(performance.now())} after the navigation started.`));
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
		return za(this.root) || xL(this.hydration) || this.metadata.getWords().some((e) => va(e.key)) || va(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) tW(nW(t), t, this.pluginContext);
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
		tW(nW(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !tz(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), nz(e))).then((e) => this.applyNow(e)).catch((e) => {
			c("a staged value could not be fetched; the page attaches again.", e), this.attachAsync().catch((e) => c("re-attaching after a lost staged value failed.", e));
		});
		return this.inbound = n, n.then(() => {
			this.inbound === n && (this.inbound = null);
		}), n;
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
			if (e >= aW) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (OL(kL()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(tz(e) ? await nz(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = pW(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? cH(window.location.search) : e.parameters,
			timeZone: TL()
		};
		return this.renderSequence = null, await wL(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, iW, lW);
	}
};
async function cW(e = {}) {
	let t = performance.now(), n = new sW(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function lW(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function uW() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function dW(e) {
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
	let n = fW();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function fW() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function pW() {
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
ee(), cW().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
