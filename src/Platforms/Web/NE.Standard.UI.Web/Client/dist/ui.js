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
function _() {
	return te();
}
function ee(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = te();
	n.runtime = e, ne(e, n);
}
function te() {
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
			let r = re(e, t), i = window.NEStandardUI?.runtime;
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
function ne(e, t) {
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
var ie = "data-ui-id", ae = "data-ui-context", oe = "data-ui-pc", v = "data-ui-key", se = "data-ui-unselectable", ce = "data-ui-undraggable", le = "data-ui-unremovable", ue = "data-ui-unrenamable", de = "data-ui-no-context-menu", fe = "data-ui-no-row-open", pe = "data-ui-no-row-drag", me = "data-ui-drag-kind", he = "data-ui-drag-source", ge = "data-ui-item-drop-over", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-draggable", be = "data-ui-tabs-menu", xe = "data-ui-context-menu", Se = "data-ui-context-menu-use", Ce = "data-ui-action-bar", we = "data-ui-action-bar-key", Te = "data-ui-action-bar-rest", Ee = "data-ui-menu-left-out", De = "data-ui-in-action-bar", Oe = "ui-action-bar", ke = "data-ui-row-focus", Ae = "data-ui-tooltip", je = "data-ui-tooltip-placement", Me = "data-ui-tooltip-mark", Ne = "data-ui-tooltip-severity", Pe = "data-ui-tooltip-press", Fe = "data-ui-badge-text", Ie = "data-ui-badge-set", Le = "data-ui-name", Re = "data-ui-bind-", ze = "data-ui-into-", Be = "data-ui-bind-value", Ve = (e) => `data-ui-no-${e}`, He = "data-ui-event-boundary", Ue = "data-ui-image-caption", We = "data-ui-image-crop", Ge = "data-ui-image-crop-size", Ke = "ui-image", qe = "data-ui-fallback-src", Je = "data-ui-image-failed", y = "data-ui-items-host", Ye = "data-ui-collection-sink", Xe = "data-ui-items-query", Ze = "data-ui-number-culture", Qe = "data-ui-page-culture", $e = "data-ui-pager-target", et = "data-ui-pager-page", tt = "data-ui-pager-size", nt = "data-ui-temporal-culture", rt = "data-ui-empty-template", it = "data-ui-group-template", at = "data-ui-empty-placeholder", ot = "data-ui-group-header", st = "data-ui-group-anchor", ct = "data-ui-group", lt = "data-ui-value-holder", ut = "data-ui-value-end", dt = "data-ui-value-kind", ft = "items-query", pt = "data-ui-host-mode", mt = "data-ui-host-viewport", ht = "data-ui-scroll-group", gt = "data-ui-scroll-lines", _t = "data-ui-source-line", vt = "data-ui-window-spacer", yt = "data-ui-window-pending", bt = "data-ui-window-paged", xt = "data-ui-window-size", St = "data-ui-window-offset", Ct = "data-ui-window-total", wt = "data-ui-window-more-before", Tt = "data-ui-window-more-after", Et = "data-ui-window-group-before", Dt = "data-ui-window-aggregates", Ot = "data-ui-form-id", kt = "data-ui-forms", At = "data-ui-visibility", jt = "data-ui-collapsed", Mt = "data-ui-menu-group", Nt = "data-ui-menu-select", Pt = "data-ui-menu-open", Ft = "data-ui-menu-search", It = "data-ui-menu-searching", Lt = "data-ui-menu-unmatched", Rt = "data-ui-drawer-toggle", zt = "data-ui-drawer-open", Bt = "data-ui-bottom-bar", Vt = "data-ui-region", Ht = "data-ui-menu-item-kind", Ut = "ui-menu", b = "ui-menu-item", Wt = "ui-menu-item--checked", Gt = "ui-menu-item--selected", Kt = "ui-menu--rail", qt = `[${Ht}="header"], [${Ht}="separator"]`, Jt = `[${Mt}] > .${b}`, Yt = `${Jt}, .${b}[${Ht}="check"]`, Xt = "data-ui-shortcut", Zt = "data-ui-collapse-toggle", Qt = "data-ui-folding", $t = "data-ui-column-limits", en = "data-ui-row-limits", tn = "data-ui-splitter-step", nn = "data-ui-table-column", rn = "data-ui-table-hide-below", an = "data-ui-table-starts-hidden", on = "data-ui-table-hidden", sn = "ui-table__row", cn = "ui-table__scroll", ln = "ui-table__header", un = "ui-table__resizer", dn = "ui-tree", fn = "ui-tree__row", pn = "ui-tree-node", mn = "data-ui-tree-drop", hn = "ui-tree__row--filtered", gn = "data-ui-table-last", _n = "data-ui-table-reordering", vn = "data-ui-table-dragging", yn = "data-ui-table-drop", bn = "data-ui-table-scrolled", xn = "data-ui-table-scrollbar", Sn = "data-ui-no-row-select", Cn = "data-ui-tree-parent", wn = "data-ui-tree-children", Tn = "data-ui-tree-folder", En = "data-ui-tree-expanded", Dn = "data-ui-tree-title", On = "data-ui-tree-loading", kn = "data-ui-tree-drop-target", An = "data-ui-tree-boot", jn = "data-ui-tree-draggable", Mn = "data-ui-row-editing", Nn = "data-ui-image-source", Pn = "data-ui-file-max-size", Fn = "data-ui-file-pick", In = "data-ui-file-drop-target-id", Ln = "data-ui-service-worker", Rn = "data-ui-theme", zn = "data-ui-theme-colors", Bn = "data-ui-words", Vn = "data-ui-language-switcher", Hn = "data-ui-language", Un = "data-ui-splitting", Wn = "data-ui-keyboard-up", Gn = "data-ui-connection", Kn = "data-ui-split-folded", qn = "data-ui-pointer-focus", Jn = "data-ui-selection", Yn = "data-ui-selected", Xn = "data-ui-selected-key", Zn = "data-ui-selected-keys", Qn = "data-ui-bind-selected-key", $n = "data-ui-tabs-selected", er = "data-ui-tab-caption", tr = "data-ui-tab-pinned", nr = [
	At,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], rr = "data-ui-submit-form-id", x = `[${ie}]`, ir = "data-ui-href", ar = "ui-disabled", or = "ui-loading", sr = "ui-readonly", cr = "ui-hidden", lr = "ui-dialog__surface", ur = "ui-flyout__content", dr = "data-ui-focus-holder", fr = "[role='listbox'], [role='menu'], [role='dialog']", pr = "ui-select__trigger", mr = `.${pr}`, hr = "ui-button", gr = `${hr} ui-button--ghost ui-button--small`, _r = "ui-select", vr = "ui-text-input", yr = "ui-invalid", br = "data-ui-validation-message", xr = {
	componentId: ie,
	key: v,
	selected: Yn,
	selectedKey: Xn,
	selectedKeys: Zn,
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
	PushAddress: "PushAddress",
	RequestNotificationPermission: "RequestNotificationPermission",
	ShowSystemNotification: "ShowSystemNotification"
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
	return ai(e, ie);
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
var Na = 256, Pa = 512, Fa = "script[type='application/json'][data-ui-strings]", Ia = "#text", La = `[${Bn}*='"moment"']`, Ra = class {
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
			for (let n of e.querySelectorAll(t ? La : `[${Bn}]`)) for (let [e, r] of Object.entries(Ua(n))) {
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
	Object.keys(r).length === 0 ? e.removeAttribute(Bn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Bn, a);
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
	let t = e.getAttribute(Bn);
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
	return `:scope > [${ie}]:is(${e}), :scope > :not([${ie}]) > [${ie}]:is(${e})`;
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
var $a = `[${ie}], .${sr}`;
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
		for (let e of lo) this.register(e);
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
var lo = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute($n)
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
		read: (e) => e.getAttribute(Xn)
	},
	{
		kind: "selected-keys",
		read: (e) => uo(e, Zn)
	},
	{
		kind: ft,
		read: (e) => uo(e, Xe)
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
function uo(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function fo(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var po = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function mo(e) {
	return e instanceof HTMLInputElement && po.has(e.type);
}
function ho(e) {
	return mo(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var go = "ui-draft-dropped";
function _o(e) {
	e.dispatchEvent(new Event(go, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function vo(e) {
	let t = So(e.key), n = Co(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(xo);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function yo(e, t) {
	return So(e) !== null || Co(e, t) !== 0;
}
var bo = {
	target: vo,
	applyTabIndex: k
};
function k(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function xo(e) {
	return e.getClientRects().length > 0 && !E(e);
}
function So(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Co(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function wo(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function To(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${y}][${mt}]`) : null;
}
function Eo(e) {
	let t = wo(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Oo(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Do(e, t) {
	let n = wo(e);
	n.scrollTop = n === e ? t : t + Oo(e, n);
}
function Oo(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/selected-key.ts
function ko(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var Ao = "data-ui-bind-selected-keys", A = `.ui-items-view, .ui-table, .${dn}`, jo = `.ui-items-view__item, .${sn}, .${fn}`, Mo = ".ui-items-view, .ui-table", No = {
	shift: !1,
	ctrl: !1
}, Po = /* @__PURE__ */ new WeakMap();
function Fo(e, t) {
	t !== null && !Po.has(e) && Io(e, t);
}
function Io(e, t) {
	let n = M(t);
	n.length > 0 && Po.set(e, n);
}
function Lo(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Ro(e, t) {
	let n = Lo(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function zo(e) {
	return !e.hasAttribute(Sn);
}
function j(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ie}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Bo(e) {
	switch (e.getAttribute(Jn)) {
		case "one": {
			let t = e.getAttribute(Xn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Jo(Yo(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Vo(e, t) {
	let n = Bo(e), r = e.getAttribute(Jn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(M(e));
		e.toggleAttribute(Yn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Ho(e) {
	return e.filter((e) => e.hasAttribute(Yn));
}
function Uo(e, t, n, r) {
	let i = M(n);
	if (!Ko(n)) return !1;
	switch (e.getAttribute(Jn)) {
		case "one": return ko(e, i, {
			attribute: Xn,
			bindingAttribute: Qn,
			apply: (e) => Vo(e, t)
		}), !0;
		case "many": return Wo(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Wo(e, t, n, r, i) {
	let a = Yo(e);
	if (a === null) return;
	let o = Jo(a), s;
	if (i.shift) {
		let r = qo(t, t.find((t) => M(t) === Po.get(e)) ?? n, n).map(M);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Po.set(e, r)) : (s = [r], Po.set(e, r));
	Go(e, t, s);
}
function Go(e, t, n) {
	let r = Yo(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Zn, i), Vo(e, t), r.hasAttribute(Ao) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ko(e) {
	return M(e).length > 0 && !Za(e, "data-ui-unselectable") && !D(e);
}
function qo(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => j(e) !== null && Ko(e));
}
function Jo(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Yo(e) {
	let t = e.closest(x);
	for (let n of e.querySelectorAll(`[${y}]`)) if (n.closest(A) === e && n.closest(x) === t) return n;
	return null;
}
function M(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Xo = {
	isSelected: (e) => e.hasAttribute(Yn),
	toggle: Zo,
	setSelected: Qo,
	setSelectedKeys: $o
};
function Zo(e) {
	let t = e.closest(A);
	t !== null && e instanceof HTMLElement && Uo(t, es(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Qo(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(M(e));
	$o(e, r, n);
}
function $o(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = es(e), i = new Set(r.filter((e) => !Ko(e)).map(M)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Bo(e)].filter((e) => !a.has(e));
	Go(e, r, n ? [...o, ...a] : o);
}
function es(e) {
	return [...e.querySelectorAll(jo)].filter((t) => t.closest(A) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function ts(e) {
	let t = e.closest(A);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(jo);
	return n !== null && n.closest(A) === t ? {
		root: t,
		row: n
	} : null;
}
function ns(e) {
	return e.filter((e) => j(e) !== null && !D(e));
}
function rs(e) {
	return is(e) ?? ns(e)[0] ?? null;
}
function is(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !D(e)) ?? null;
}
function as(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Tr(t, "ui-row-name"));
}
function os(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(ke);
	n.setAttribute(ke, ""), e.setAttribute("aria-activedescendant", Tr(n, "ui-row")), (j(n) ?? n).scrollIntoView({ block: "nearest" });
}
function ss(e, t) {
	return yo(e, t === "grid" ? "both" : t) || t !== "horizontal" && cs(e);
}
function cs(e) {
	return e === "PageDown" || e === "PageUp";
}
function ls(e, t, n, r) {
	if (!ss(e, r)) return null;
	let i = ns(t);
	if (cs(e)) return us(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return ds(i, n, e === "ArrowDown");
	let a = i.map((e) => j(e) ?? e), o = vo({
		key: e,
		items: a,
		current: n === null ? null : j(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function us(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (j(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(Eo(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (j(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function ds(e, t, n) {
	let r = t === null ? null : j(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = fs(i), o = e.map((e) => ({
		row: e,
		rect: (j(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(fs(t.rect) - a) < Math.abs(fs(e.rect) - a) ? t : e).row;
}
function fs(e) {
	return e.left + e.width / 2;
}
var ps = "ui-row-press";
function ms(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function hs(e, t, n) {
	let r = n.hasAttribute(ke), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = ns(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && os(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var gs = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), _s = /* @__PURE__ */ new Set([
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
]), vs = !1, ys = !1, bs = null, xs = /* @__PURE__ */ new Set(), Ss = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Cs(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => ws(e), !0), window.addEventListener("focus", (e) => Ts(e.target), !0), window.addEventListener("focusin", (e) => Ts(e.target), !0), window.addEventListener("focusout", (e) => As(e.target, !1), !0));
function Cs(e, t = "") {
	vs = !0, ys = t === "touch";
	let n = document.activeElement;
	bs = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && As(n, !Es(n));
}
function ws(e) {
	if (!(e instanceof KeyboardEvent && _s.has(e.key))) {
		vs = !1;
		for (let e of [...xs]) As(e, !1);
	}
}
function Ts(e) {
	vs && !Es(e) && As(e, !0);
}
function Es(e) {
	return ho(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Ds() {
	return vs && bs instanceof HTMLElement && bs !== document.body ? bs : null;
}
function Os() {
	return vs;
}
function ks() {
	return vs && ys;
}
function As(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of xs) e.isConnected || xs.delete(e);
			xs.add(e);
		} else xs.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(qn, t);
	}
}
function N(e) {
	e.focus({ preventScroll: !0 });
}
function js(e) {
	As(e, !0), e.focus({ preventScroll: !0 });
}
function Ms(e) {
	for (let t of e.querySelectorAll(gs)) if (Qa(t)) return t;
	return null;
}
var Ns = {
	first: Ms,
	stops: (e) => Ps(e, document.activeElement)
};
function Ps(e, t) {
	let n = [...e.querySelectorAll(gs)].filter((e) => e === t || e.tabIndex >= 0 && Qa(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Fs(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Is(n) && Is(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Fs(e);
		return t === null || r.get(t) === e;
	});
}
function Fs(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Is(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Ls(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Rs(n, a) ? i : r && Rs(n, i) ? a : null;
}
function Rs(e, t) {
	return e === t || Fs(e) !== null && Fs(e) === Fs(t);
}
var zs = `.${lr}, .${ur}, [${dr}]`;
function Bs(e) {
	let t = ts(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(zs)) && n.hasAttribute("tabindex") && Qa(n)) return n;
	return null;
}
function Vs(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Ms(e);
	return vs ? Ss.add(e) : Ss.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), N(r ?? e), n;
}
function Hs(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Ms(e);
	return n !== null && Us(e, n), Vs(e, n);
}
function Us(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Ws(e, t, n = !1) {
	if (vs) {
		k(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), N(e);
		return;
	}
	let r = t.filter(xo), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (k(t, i), N(i));
}
function Gs(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Ks(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${gs}, [tabindex]`) && Qa(e)) return e;
	return n === null ? null : qs(n);
}
function Ks(e, t) {
	for (let n = e.closest(x); n !== null; n = n.parentElement?.closest(x) ?? null) {
		let e = t.querySelectorAll(`[${ie}="${n.getAttribute(ie)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function qs(e) {
	for (let t = e.closest(x); t !== null; t = t.parentElement?.closest(x) ?? null) if (Qa(t)) return Js(t), t;
	return null;
}
function Js(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Ys(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Xs(n, t) && As(e, !Es(e)), N(e));
}
function Xs(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Ss.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Zs = "data-ui-clear", Qs = ["change", "toggle"], $s = [
	...Qs,
	"expand",
	"collapse",
	"open",
	"close"
];
function ec(e) {
	let t = Ar(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function tc(e) {
	return Ar(e) === "OnSubmit";
}
function nc(e, t) {
	let n = e.getAttribute(Be);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && tc(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && ec(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: tc(i.mode)
		};
	}
	return null;
}
var rc = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Qs) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(go, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Zs}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || nc(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Zs}]`);
		if (t === null) return;
		let n = t.closest(x), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || ic(r) || (fo(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), ho(r) && document.activeElement !== r && N(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (O(e.target) || E(e.target))) return;
		let t = nc(e.target, this.options.metadata);
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
			let r = nc(n, this.options.metadata);
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
		if (i === void 0 || !ec(i.mode) || tc(i.mode)) return;
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
function ic(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function ac(e, t) {
	let n = e.closest(`[${He}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var oc = class {
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
}, sc = class {
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
}, cc = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: C(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, lc = {
	dispatched: !1,
	success: !1
}, uc = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, dc = class {
	options;
	root;
	registry;
	requestFactory = new cc();
	turns = new oc();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new sc(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t);
		this.shouldAttach(n) && this.attachEvent(n);
	}
	async dispatchCommandAsync(e) {
		if (this.options.dispatcher.isPending(e)) return !1;
		let t = this.turns.take();
		try {
			await t.ahead, await this.options.valueBinding?.whenSent();
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
		if (r === null || pc(t, r.element) || ac(t.target, r.element)) return;
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
			let t = e instanceof uc, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && E(r.domEvent.target)) return lc;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), lc;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? mc(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), lc;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return lc;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new uc(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !$s.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		fc(e.preventDefault, t) && t.domEvent.preventDefault(), fc(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function fc(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function pc(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function mc(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function hc(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && gc(e, t) : _c(e, t);
}
function gc(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!hc(e[n], t[n])) return !1;
	return !0;
}
function _c(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !hc(e[n], t[n]) : !vc(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !vc(t[n])) return !1;
	return !0;
}
function vc(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
var yc = `.${lr}, .${ur}`;
function bc() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function xc(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body || Sc(e)) return null;
	let n = e;
	for (; n.parentElement !== null && !Sc(n.parentElement);) n = n.parentElement;
	let r = Cc(n) ?? wc();
	return r !== null && N(r), r;
}
function Sc(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Cc(e) {
	let t = Ps(e.closest(yc) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function wc() {
	let e = document.querySelector(`[${Vt}="content"]`);
	return e === null ? null : (Js(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Tc = class {
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
		for (let e of Qs) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = Oc(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && hc(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = nc(e, this.options.metadata), r;
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
			for (let e of t.interactions) Mr(e.actionKind) === "CopyValue" && kc(e.target) && this.writeTarget(e.target, t.dynamicParameters, Ec(e, n), !0);
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
		let t = this.index.getPropertyInteractions(C(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Oc(e.reference, e.dynamicParameters) : null;
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
		if (!kc(a)) return;
		let o = i === "CopyValue" ? Ec(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = bc();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && xc(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Dc(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Ec(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Dc(e, t, n) {
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
function Oc(e, t) {
	return JSON.stringify([
		C(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function kc(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Ac = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return jc(t, e.operator, e.value);
	}
};
function jc(e, t, n) {
	let r = Mc(e), i = Mc(n);
	switch (Nr(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Nc(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Nc(r, i, (e) => e >= 0);
		case "Less": return Nc(r, i, (e) => e < 0);
		case "LessOrEqual": return Nc(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Fc(r, i);
		case "RegexEach": return Pc(r, i);
		default: return !1;
	}
}
function Mc(e) {
	return ma(e) ? e.key : ha(e) ? e.text : e;
}
function Nc(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Pc(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Fc(Mc(e), t)) : Fc(e, t);
}
function Fc(e, t) {
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
var Ic = "Value", Lc = "EndValue", Rc = class {
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
		for (let t of this.eventNames) Vc(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Yr(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Hc(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Uc(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (zc(e)) {
			let t = C(e.sourceEvent?.componentId), n = Yr(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Hc(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Hc(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (Bc(e)) {
			let t = C(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Uc(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Uc(t, n), r)), r.push(e), Mr(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Ic ? this.valueInteractions : i === Lc ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function zc(e) {
	return jr(e.sourceKind) === "Event";
}
function Bc(e) {
	return jr(e.sourceKind) === "Property";
}
function Vc(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Hc(e, t) {
	return `${e}:${Yr(t)}`;
}
function Uc(e, t) {
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
function Wc() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Gc(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Kc = /* @__PURE__ */ new Set([
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
function qc(e) {
	return Kc.has(e);
}
var Jc = 4, Yc = 12, Xc = /* @__PURE__ */ new Map(), Zc = !1, Qc = null, $c = /* @__PURE__ */ new WeakMap(), el = "data-ui-popup-stood-in";
function tl(e, t) {
	t === null ? $c.delete(e) : $c.set(e, t);
}
var nl = "--ui-popup-ground";
function rl(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(nl).trim() : "";
	n.length === 0 ? t.style.removeProperty(nl) : t.style.setProperty(nl, n);
}
function il(e, t, n) {
	Xc.set(t, {
		anchor: e,
		options: n
	}), fl(), Qc?.observe(t), ol(e, t), ml(e, t, n);
}
var al = "data-ui-popup-lifted";
function ol(e, t) {
	if (t.hasAttribute(al)) {
		t.matches(":popover-open") || t.showPopover();
		return;
	}
	!cl(t) && e.closest(`[${al}]`) === null || (t.setAttribute("popover", "manual"), t.setAttribute(al, ""), sl(t));
}
function sl(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function cl(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
function ll(e) {
	e.hasAttribute(al) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Xc.has(e) || (e.removeAttribute("popover"), e.removeAttribute(al));
	}, P.fast));
}
function ul(e) {
	let t = Xc.get(e);
	t !== void 0 && ml(t.anchor, e, t.options);
}
function dl(e) {
	e != null && (Xc.delete(e), Qc?.unobserve(e), ll(e));
}
function fl() {
	Zc || (Zc = !0, document.addEventListener("scroll", pl, !0), window.addEventListener("resize", pl), window.visualViewport?.addEventListener("resize", pl), window.visualViewport?.addEventListener("scroll", pl), Qc = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Xc.get(t.target);
			e !== void 0 && ml(e.anchor, t.target, e.options, !0);
		}
	}));
}
function pl() {
	for (let [e, t] of Xc) {
		if (!e.isConnected) {
			dl(e);
			continue;
		}
		ml(t.anchor, e, t.options);
	}
}
function ml(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = hl(e), a = i !== e;
	t.hasAttribute(el) !== a && t.toggleAttribute(el, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = vl(n.boundary), f = Xc.get(t), p = r ? f?.side : void 0, m = p !== void 0 && bl(c, u, p, l, d) ? p : yl(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m);
	let h = n.alignEntries === !0 ? Ol(t, m) : Dl, g = Al(c, s, u, m, l, h), _ = jl(c, s, u, m, l, h);
	n.arrow === !0 && (Cl(m) ? _ = gl(_, s.left + s.width / 2, u.width) : g = gl(g, s.top + s.height / 2, u.height));
	let ee = Nl();
	g = ee.top + Ll(g - ee.top, u.height, ee.bottom - ee.top), _ = Ll(_, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${_}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), _l(t, s, u, m, g, _);
}
function hl(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(el)) return e;
		let n = $c.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function gl(e, t, n) {
	let r = t - e;
	return r < Yc ? e - (Yc - r) : r > n - Yc ? e + (r - (n - Yc)) : e;
}
function _l(e, t, n, r, i, a) {
	let o = Cl(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Yc, Math.min(s, c - Yc))}px`);
}
function vl(e) {
	let t = Nl(), n = {
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
function yl(e, t, n, r, i) {
	let a = Tl(n);
	if (bl(e, t, n, r, i)) return n;
	if (bl(e, t, a, r, i)) return a;
	for (let a of xl(n)) if (bl(e, t, a, r, i)) return a;
	return wl(e, a, i) > wl(e, n, i) ? a : n;
}
function bl(e, t, n, r, i) {
	return wl(e, n, i) >= Sl(t, n) + r;
}
function xl(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Sl(e, t) {
	return Cl(t) ? e.height : e.width;
}
function Cl(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function wl(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Tl(e) {
	return e.startsWith("top") ? `bottom${El(e)}` : e.startsWith("bottom") ? `top${El(e)}` : e.startsWith("left") ? `right${El(e)}` : `left${El(e)}`;
}
function El(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var Dl = {
	start: 0,
	end: 0
};
function Ol(e, t) {
	let n = getComputedStyle(e);
	return Cl(t) ? {
		start: kl(n.paddingLeft) + kl(n.borderLeftWidth),
		end: kl(n.paddingRight) + kl(n.borderRightWidth)
	} : {
		start: kl(n.paddingTop) + kl(n.borderTopWidth),
		end: kl(n.paddingBottom) + kl(n.borderBottomWidth)
	};
}
function kl(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function Al(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : Ml(t.top, t.height, n.height, r, a);
}
function jl(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : Ml(t.left, t.width, n.width, r, a);
}
function Ml(e, t, n, r, i) {
	let a = El(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Nl() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Pl(r))
	};
}
function Pl(e) {
	let t = document.querySelector(`[${Bt}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Fl(e, t, n) {
	let r = e.getBoundingClientRect(), i = Nl();
	e.style.left = `${Il(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Il(n, r.height, i.top, i.bottom)}px`;
}
function Il(e, t, n, r) {
	return e + t <= r - Jc ? e : e - t >= n + Jc ? e - t : n + Ll(e - n, t, r - n);
}
function Ll(e, t, n) {
	return Math.max(Jc, Math.min(e, n - t - Jc));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Rl = 32;
function F(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = zl(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function zl(e, t, n) {
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
		if (r.size > Rl) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Bl(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Vl = "data-ui-dialog", Hl = "data-ui-dialog-modal", Ul = "data-ui-dialog-backdrop", Wl = "data-ui-dialog-close-backdrop", Gl = "data-ui-dialog-close-escape";
function Kl(e) {
	let t = e.querySelectorAll(`[${Vl}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function ql(e) {
	let t = Kl(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function Jl(e) {
	let t = typeof document > "u" ? null : ql(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var Yl = "data-ui-rename-field";
function Xl(e) {
	return e instanceof Element && e.closest(`[${Yl}]`) !== null;
}
function Zl(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Yl, ""), r.setAttribute(He, ""), r.value = e.value, Ql(r, n, t);
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
function Ql(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = $l(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = eu((r.left - i.left) / s - n.clientLeft), e.style.top = eu((r.top - i.top) / s - n.clientTop), e.style.width = eu(r.width / s), e.style.height = eu(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function $l(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function eu(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var tu = /* @__PURE__ */ new Set(), nu = /* @__PURE__ */ new Map(), ru = 0, iu = !1;
function au() {
	iu || (iu = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || Xl(e.target) || cu() && e.preventDefault();
	}, !0));
}
function ou() {
	for (let e of tu) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function su(e) {
	for (let t of tu) t.hearRefusedClick(e);
}
function cu() {
	let e = [];
	for (let t of tu) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...nu.keys()]) t.has(e) || nu.delete(e);
	for (let { popup: t } of e) nu.has(t) || nu.set(t, ++ru);
	let n = lu(e, (e) => nu.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function lu(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var uu = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), tu.add(this), au();
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
		return this.options.isBehind === void 0 ? Jl(e) : this.options.isBehind(e);
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
function du(e, t) {
	return e.isConnected && !E(e) && !(t && O(e));
}
var fu = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new uu({
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
			isBehind: (e) => Jl(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || Os() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : pu(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, gu(t)) && !Jl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = Bs(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && du(n.owner, this.closesWhenReadOnly) && !Jl(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !du(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), _u(e), vu(e, !0), xu(this), e.focus !== void 0 && e.focus !== !1 && Vs(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && _u(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Ys(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), vu(r, !1), dl(r.popup), this.entries.size === 0 && Su(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (du(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !mu() && hu(e);
		}
	}
};
function pu(e) {
	return e instanceof Element && e.isConnected && Qa(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function mu() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Qa(e);
}
function hu(e) {
	Js(e), N(e);
}
function gu(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function _u(e) {
	e.anchor !== void 0 && e.placement !== void 0 && il(e.anchor, e.popup, e.placement);
}
function vu(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var yu = /* @__PURE__ */ new Set(), bu = null;
function xu(e) {
	yu.add(e), bu === null && typeof MutationObserver == "function" && (bu = new MutationObserver(() => {
		for (let e of [...yu]) e.closeStranded();
	}), bu.observe(document, {
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
function Su(e) {
	yu.delete(e), !(yu.size > 0 || bu === null) && (bu.disconnect(), bu = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Cu = "ui-flyout", wu = "ui-flyout--open", Tu = "ui-flyout__anchor", Eu = "data-ui-flyout-no-backdrop-close", Du = "data-ui-flyout-no-escape-close", Ou = `${Cu}--`, ku = "bottom-start", Au = class {
	root;
	flyouts = new fu({
		show: ({ owner: e }) => e.classList.add(wu),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Du : Eu)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Cu}`)) this.place(e);
		F(this.root, `.${Cu}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${ur}`), n = e.querySelector(`:scope > .${Tu}`);
		if (t === null) return;
		let r = ju(n, t);
		if (!e.classList.contains(wu)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Nu(n) ?? e,
			placement: { placement: Pu(e) },
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(wu) && (e.classList.remove(wu), Mu(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Tu}`)?.closest(`.${Cu}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(wu), this.place(t), this.flyouts.isOpen(t) && Mu(t, !0);
		}
	}
};
function ju(e, t) {
	if (e === null) return null;
	let n = e.querySelector(gs) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Tr(t, "ui-flyout-content")), n;
}
function Mu(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Nu(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Pu(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Ou)) continue;
		let e = t.slice(Ou.length);
		if (qc(e)) return e;
	}
	return ku;
}
//#endregion
//#region src/interactions/file-drop.ts
var Fu = "data-ui-file-drop-over", Iu = 120, Lu = "refused", Ru = !1;
function zu(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Uu();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => Bu(e, t, n), !0);
	e.root.addEventListener("dragend", () => Yu(t.marked), !0), window.addEventListener("blur", () => Yu(t.marked)), e.root.addEventListener("paste", (t) => Vu(e, t), !0);
}
function Bu(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Yu(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Wu(n), n.type !== "dragleave" && Yu(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Ju(r, a) : t.leaving = window.setTimeout(() => Yu(r), Iu);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Gu(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Ju(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Fu;
		r.set(a, o), a.setAttribute(o, t ? Lu : "");
		return;
	}
	Yu(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Xu(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Vu(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Xu(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Hu(e, t, n) {
	for (let r = t.closest(`[${ie}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${In}="${Sr(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Uu() {
	if (!Ru) {
		Ru = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Wu(e);
		});
	}
}
function Wu(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Gu(e, t) {
	let n = Ku(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => qu(t, e)));
}
function Ku(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function qu(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function Ju(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function Yu(e) {
	for (let t of [...e.keys()]) Ju(e, t);
}
function Xu(e, t) {
	let n = Ku(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : qu(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var Zu = "/_ne/files/upload", Qu = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], $u = /* @__PURE__ */ new Map(), ed = !1;
function td(e, t, n, r) {
	let i = Number(e.getAttribute(Pn)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return $u.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of $u.keys()) e.isConnected || $u.delete(e);
	return $u.set(e, c), nd(e, c), id(), a;
}
function nd(e, t) {
	let n = rd(t.limit, T.language);
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
function rd(e, t) {
	let n = e, r = "byte";
	for (let e of Qu) {
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
function id() {
	ed || (ed = !0, T.onChange(() => {
		for (let [e, t] of $u) e.isConnected ? nd(e, t) : $u.delete(e);
	}));
}
function ad(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Zu), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var od = () => {};
function sd(e) {
	return {
		uploadAsync: (e, t) => ad(e, t ?? od),
		accepts: Xu,
		takeWithinSizeLimit: (t, n, r) => td(t, n, r, e)
	};
}
function cd(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var ld = "ui-open-picker";
function ud(e) {
	return !e.dispatchEvent(new Event(ld, {
		bubbles: !0,
		cancelable: !0
	}));
}
function dd(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || O(n) || E(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var fd = "ui-file-input", pd = "ui-file-input__row", md = "ui-file-input__native", hd = "ui-file-input__field", gd = "ui-file-input__selection", _d = "data-ui-file-dragging", vd = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, T.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(ld, (e) => dd(e, {
			rootSelector: `.${fd}`,
			nativeSelector: `.${md}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), zu({
			root: this.root,
			draggingAttribute: _d,
			resolveTarget: (e) => {
				let t = e.closest(`.${pd}`)?.closest(`.${fd}`) ?? null, n = t === null ? Hu(this.root, e, `.${fd}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${md}`) ?? null;
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
		let t = e.target.closest(`[${Fn}], .${pd}`);
		if (t === null || E(t) || O(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${fd}`)?.querySelector(`.${md}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(md)) return;
		let t = e.target.closest(`.${fd}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${hd}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = td(e, t, e.querySelector(`.${md}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await ad(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => T.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, yd(r)), this.publishSelection(e, t.selectionId);
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
		cd(e.querySelector(`.${gd}`), t);
	}
};
function yd(e) {
	return e.length === 1 ? e[0].name : () => T.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var bd = "ne-picture-as-pdf", xd = "ne-text-snippet", Sd = "ne-description", Cd = "ne-table-chart", wd = "ne-slideshow", Td = "ne-folder-zip", Ed = "ne-audio-file", Dd = "ne-video-file", Od = "ne-image", kd = "ne-code", Ad = "ne-draft", jd = new Map([
	...Fd(bd, "pdf"),
	...Fd(xd, "txt", "md", "log"),
	...Fd(Sd, "doc", "docx", "odt", "rtf"),
	...Fd(Cd, "xls", "xlsx", "ods", "csv", "tsv"),
	...Fd(wd, "ppt", "pptx", "odp", "key"),
	...Fd(Td, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Fd(Ed, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Fd(Dd, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Fd(Od, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Fd(kd, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), Md = /* @__PURE__ */ new Map([
	["application/pdf", bd],
	["text/csv", Cd],
	["application/msword", Sd],
	["application/rtf", Sd],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Sd],
	["application/vnd.oasis.opendocument.text", Sd],
	["application/vnd.ms-excel", Cd],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Cd],
	["application/vnd.oasis.opendocument.spreadsheet", Cd],
	["application/vnd.ms-powerpoint", wd],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", wd],
	["application/vnd.oasis.opendocument.presentation", wd],
	["application/zip", Td],
	["application/x-zip-compressed", Td],
	["application/x-7z-compressed", Td],
	["application/vnd.rar", Td],
	["application/x-rar-compressed", Td],
	["application/x-tar", Td],
	["application/gzip", Td],
	["application/json", kd],
	["application/xml", kd],
	["text/xml", kd],
	["text/html", kd]
]), Nd = /* @__PURE__ */ new Map([
	["image", Od],
	["audio", Ed],
	["video", Dd],
	["text", xd]
]);
function Pd(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : jd.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return Md.get(i) ?? (a < 0 ? void 0 : Nd.get(i.slice(0, a))) ?? Ad;
}
function Fd(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Id = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Ld(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Id.includes(t.slice(0, n).toLowerCase());
}
function Rd(e) {
	return Ld(e) ? String(e) : void 0;
}
var zd = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Bd(e) {
	let t = Wd(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || zd.some((e) => n.startsWith(e));
}
function Vd(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Hd(e);
}
function Hd(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Ud(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Wd(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Gd(e) {
	return Kd(e) !== null;
}
function Kd(e) {
	let t = Wd(e), n = t.toLowerCase();
	return Hd(t) || Ud(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function qd(e) {
	return Kd(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Jd = "mask:", Yd = "ui-icon--image", Xd = "ui-icon--mask";
function Zd(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Jd) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Kd(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Qd(e) {
	let t = Zd(e);
	return t === null ? "" : $d(t.source);
}
function $d(e) {
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
var ef = "ui-icon", tf = "data-ui-icon", nf = "--ui-icon-url";
function rf(e, t) {
	e.classList.add(ef);
	for (let t of Array.from(e.classList)) of(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(nf);
	let n = sf(t);
	if (n.length === 0) {
		e.removeAttribute(tf);
		return;
	}
	e.setAttribute(tf, ""), e.classList.add(n);
	let r = Zd(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(nf, $d(r.source));
}
var af = "ui-icon-glyph--";
function of(e) {
	return e === Yd || e === Xd || e.startsWith(af);
}
function sf(e) {
	let t = Zd(e);
	return t === null ? cf(e) : t.tinted ? Xd : Yd;
}
function cf(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = af;
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
var lf = 1024, uf = 16777216;
function df(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function ff(e, t) {
	let n = Sf(t.zoom, 1, 4), r = xf(e) / n / 2;
	return {
		x: Sf(t.x, r, e.width - r),
		y: Sf(t.y, r, e.height - r),
		zoom: n
	};
}
function pf(e, t) {
	let n = xf(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function mf(e, t, n) {
	return t.zoom * n / xf(e);
}
function hf(e, t, n, r, i) {
	let a = mf(e, t, n);
	return a > 0 ? ff(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function gf(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = Sf(t.zoom * r, 1, 4), o = mf(e, t, n), s = mf(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? ff(e, {
		...t,
		zoom: a
	}) : ff(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function _f(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function vf(e, t) {
	return Math.min(1, t * 4 / xf(e), Math.sqrt(uf / (e.width * e.height)));
}
function yf(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function bf(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function xf(e) {
	return Math.min(e.width, e.height);
}
function Sf(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Cf(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Vl, e.key), t.setAttribute(Hl, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Gl, ""), t.setAttribute(Wl, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Ul, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? lr : `${lr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var wf = class {
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
}, Tf = class {
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
		t.setAttribute(Un, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Ef(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(Un), e.type === "pointercancel" && this.options.takenBack !== void 0 ? this.options.takenBack(n, r) : this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, t.removeAttribute(Un);
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
function Ef(e, t, n, r) {
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
var Df = 100 / 3, Of = 1, kf = 2;
function Af(e, t = Df) {
	let n = e.deltaMode === Of ? Df : e.deltaMode === kf ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function jf(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var Mf = {
	notch: 100,
	pixels: Af
}, Nf = "ui-image-crop", Pf = "ui-image-crop-title", Ff = new wf("data-ui-image-crop-part"), If = "data-ui-image-crop-frame", Lf = 10, Rf = 1.2, zf = 380, Bf = 100, Vf = .92, I = null, Hf = !1, Uf = null, Wf = !1;
async function Gf(e, t, n, r = rp) {
	if (I !== null || Hf) return "cancelled";
	Hf = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Hf = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Uf ??= Kf();
		let o = Uf;
		o.dialog.isConnected || document.body.append(o.dialog), I = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: df(a),
			finish: (t) => {
				I = null, e.close(Nf), a.release(), i(t);
			}
		}, T.write(o.title, null, "ui.crop.title"), T.write(o.stage, "aria-label", "ui.crop.frame"), T.write(o.zoom, "aria-label", "ui.crop.zoom"), T.write(o.cancel, null, "ui.crop.cancel"), T.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(If, n.frame), e.open(Nf), tp(o);
	});
}
function Kf() {
	let { dialog: e, surface: t } = Cf({
		key: Nf,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Pf,
		closesOnEscapeAndBackdrop: !1
	}), n = Ff.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Pf;
	let r = Ff.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Ff.element("canvas", "ui-image-crop__canvas"), a = Ff.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Ff.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Ff.button("ui-button--outline", "cancel"), c = Ff.button("ui-button--primary", "apply");
	t.append(n, r, o, Ff.actions(s, c));
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
		let t = Ff.pressed(e);
		t === "cancel" ? I?.finish("cancelled") : t === "apply" && qf();
	}), e.addEventListener("keydown", (e) => Jf(l, e)), o.addEventListener("input", () => $f(l, Number(o.value))), r.addEventListener("wheel", (e) => Yf(l, e), { passive: !1 }), window.addEventListener("resize", () => np(l)), new Tf({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => I === null ? null : {
			last: t,
			start: I.view
		},
		move: (e, t, n) => {
			e.last !== null && Xf(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			I !== null && (I.view = t.start, tp(l));
		},
		pinch: (e, t) => {
			e.last = null, Zf(l, t);
		}
	}), l;
}
async function qf() {
	let e = I;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = pf(n, a), s = yf(t.type), c = i.encodeAsync(n, o, _f(o, r.size), s);
	I = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], bf(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function Jf(e, t) {
	if (t.defaultPrevented || t.isComposing || I === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), I.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : Lf;
	switch (t.key) {
		case "ArrowLeft":
			Xf(e, -n, 0);
			break;
		case "ArrowRight":
			Xf(e, n, 0);
			break;
		case "ArrowUp":
			Xf(e, 0, -n);
			break;
		case "ArrowDown":
			Xf(e, 0, n);
			break;
		case "+":
		case "=":
			Qf(e, Rf);
			break;
		case "-":
		case "_":
			Qf(e, 1 / Rf);
			break;
		case "Enter":
			qf();
			break;
		default: return;
	}
	t.preventDefault();
}
function Yf(e, t) {
	if (I === null) return;
	t.preventDefault();
	let n = Af(t, e.stage.clientHeight), r = t.ctrlKey ? Bf : zf;
	Qf(e, 2 ** (-n.y / r), ep(e, t.clientX, t.clientY));
}
function Xf(e, t, n) {
	I !== null && (I.view = hf(I.source, I.view, e.frame.clientWidth, t, n), tp(e));
}
function Zf(e, t) {
	if (I === null) return;
	let n = hf(I.source, I.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	I.view = gf(I.source, n, e.frame.clientWidth, t.factor, ep(e, t.center.x, t.center.y)), tp(e);
}
function Qf(e, t, n) {
	I !== null && (I.view = gf(I.source, I.view, e.frame.clientWidth, t, n), tp(e));
}
function $f(e, t) {
	I !== null && Number.isFinite(t) && t > 0 && Qf(e, t / I.view.zoom);
}
function ep(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function tp(e) {
	if (I === null) return;
	let t = I.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), np(e);
}
function np(e) {
	Wf || I === null || (Wf = !0, requestAnimationFrame(() => {
		if (Wf = !1, I === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = I.view, a = mf(I.source, i, t);
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
var rp = {
	decodeAsync: async (e, t) => {
		let n = await ip(e);
		if (n === null) return null;
		let r = n, i = vf(r, t);
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
		}, r, Vf);
	})
};
async function ip(e) {
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
var ap = "ui-image-input", op = "ui-image-input--multiple", sp = "ui-image-input__surface", cp = "ui-image-input__native", lp = "ui-image-input__picture", up = "ui-image-input__text", dp = "ui-image-input__selection", fp = "ui-image-input__selections", pp = "ui-image-input__tiles", mp = "ui-image-input__tile", hp = "ui-image-input__remove", gp = "ui-image-input__progress", _p = "ui-image-input__tile--file", vp = "ui-image-input__file-glyph", yp = "ui-image-input__file-name", bp = "SelectionId", xp = "--ui-image-progress", Sp = "data-ui-image-preview", Cp = "data-ui-image-dragging", wp = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${ap}`)), F(this.root, `.${ap}`, {
			childList: !0,
			attributeFilter: [
				Nn,
				Ue,
				Zn
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === bp && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(si(e.components, `.${ap}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(ld, (e) => dd(e, {
			rootSelector: `.${ap}`,
			nativeSelector: `.${cp}`,
			pressed: (e) => e.querySelector(`.${sp}`)
		})), this.root.addEventListener(go, (e) => this.handleDraftDropped(e)), zu({
			root: this.root,
			draggingAttribute: Cp,
			resolveTarget: (e) => {
				let t = e.closest(`.${sp}`), n = t?.closest(`.${ap}`) ?? null, r = n === null ? Hu(this.root, e, `.${ap}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${sp}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${cp}`)?.getAttribute("accept") ?? "",
					multiple: Tp(i),
					refused: O(i) || E(a)
				};
			},
			onFiles: (e, t) => void (Tp(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Tp(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${lp}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Ap(e, e.getAttribute("data-ui-image-caption") ?? Np(n)), Mp(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(Zn);
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
		for (let t of e) Tp(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Fn}]`), n = t?.closest(`.${ap}`) ?? null;
		t === null || n === null || O(n) || E(t) || n.querySelector(`.${cp}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hp}`), n = t?.closest(`.${ap}`) ?? null;
		if (t === null || n === null || O(n) || E(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cp)) return;
		let t = e.target.closest(`.${ap}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Tp(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${ap}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), cd(t.querySelector(`.${dp}`), ""));
	}
	async takeFileAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${sp}`), r = e.querySelector(`.${lp}`), i = e.querySelector(`.${dp}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || td(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Sp, ""), r.setAttribute("src", o.url), Ap(e, a.name), Mp(e, !0), n.classList.add(or);
		try {
			let t = await ad([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, cd(i, t.selectionId));
		} catch (t) {
			jp(e), cd(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(or);
		}
	}
	async cropAsync(e, t) {
		let n = Ep(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Gf(this.dialogs, t, {
				frame: n,
				size: Dp(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		this.releaseDetached();
		let n = e.querySelector(`.${pp}`), r = td(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = Op(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await ad([t], (e) => r.element.style.setProperty(xp, `${e}%`));
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
		let t = e.querySelector(`.${fp}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Zn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Sp), t || Ap(e, ""));
	}
};
function Tp(e) {
	return e.classList.contains(op);
}
function Ep(e) {
	let t = e.getAttribute(We);
	return t === "square" || t === "circle" ? t : null;
}
function Dp(e) {
	let t = Number(e.getAttribute(Ge));
	return Number.isInteger(t) && t > 0 ? t : lf;
}
function Op(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${mp} ${or}`, n.type = "button", n.className = hp, r.className = gp, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, T.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...kp(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...kp(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function kp(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(_p), e.setAttribute("title", n.name), r.className = vp, r.setAttribute("aria-hidden", "true"), rf(r, Pd(n.name, n.type)), i.className = yp, i.textContent = n.name, T.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function Ap(e, t) {
	let n = e.querySelector(`.${up}`);
	n !== null && (Ba(n, null), n.textContent !== t && (n.textContent = t));
}
function jp(e) {
	let t = e.querySelector(`.${up}`);
	t !== null && T.write(t, null, "ui.file.failed");
}
function Mp(e, t) {
	let n = e.querySelector(`.${sp}`);
	n !== null && T.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Np(e) {
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
var Pp = "ui-key-value-action__row", Fp = "ui-key-value-action__value", Ip = "ui-key-value-action__value-input", Lp = "ui-key-value-action__edit-action", Rp = "ui-text__title", zp = "ui-row-form-", Bp = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Pp}`), !1), F(this.root, `.${Pp}`, {
			childList: !0,
			attributeFilter: [Mn]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Up(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Hp(e), !0);
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
		let t = e.querySelector(`.${Lp} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${zp}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Ip} [${Be}]:not([${Ot}])`)) t.setAttribute(Ot, n);
		t.setAttribute(rr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Ot}="${t}"], [${rr}="${t}"]`)) n.removeAttribute(Ot), n.removeAttribute(rr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Ip} [${Be}]`)) {
			if (ho(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		_o(e), this.judge(e);
	}
	judge(e) {
		let t = Vp(e);
		for (let n of e.querySelectorAll(`.${Ip} [${Be}]`)) this.options.validation.judgeShown(n, ho(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Ip} :is(input, textarea, select)`);
		if (n !== null) {
			if (ho(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Vp(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), mo(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Gp(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Lp)) return;
		let { cell: n, row: r } = t, i = e.target.closest(fr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Lp} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !E(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Vp(e) {
	return e.querySelector(`.${Fp} .${Rp}`)?.textContent?.trim() ?? "";
}
function Hp(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(`.${Ip}`)?.closest(`.${Pp}`) ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Up(e) {
	let t = e.closest(`.${Lp} button`), n = t?.closest(`.${Lp}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
function Wp(e) {
	return Gp(e) !== null;
}
function Gp(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Ip}, .${Lp}`), n = t?.closest(`.${Pp}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Kp = `.ui-button[${dt}="pressed"]`, qp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Kp);
		t === null || E(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Jp = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${pr}, .ui-field-box`, Yp = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Xp = `${Yp}, ${Jp}, ${fr}, .${_e}`, Zp = "button, a, summary, [role='button']";
function Qp(e) {
	let t = [];
	for (let n of e.querySelectorAll(Xp)) if (!(n.classList.contains("ui-row__grip") || !tm(e, n) || em(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Zp) ? n : null;
}
function $p(e) {
	let t = [];
	for (let n of e.querySelectorAll(Yp)) em(e, n) && tm(e, n) && t.push(n);
	return t;
}
function em(e, t) {
	let n = t.closest(`[${fe}]`);
	return n !== null && n !== e && e.contains(n);
}
function tm(e, t) {
	let n = t.closest(fr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function nm(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Xp);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var rm = `${Yp}, [tabindex], [contenteditable], ${fr}, [${He}]`, im = ":scope > input.ui-field, :scope > textarea.ui-field", am = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Jp);
		if (t === null || e.target !== t && e.target.closest(rm) !== null) return;
		let n = t.querySelector(im);
		if (!ho(n) || n.readOnly || E(n) || O(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
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
var om = "data-ui-submit-on-enter", sm = "data-ui-runs-on-enter", cm = "enter", lm = 229, um = {
	name: cm,
	registration: { settlesValue: !0 }
}, dm = "ui-commit-in-place", fm = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(dm, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || pm(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : mm(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : hm(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (mo(t)) {
			if (e.preventDefault(), mm(t, e)) {
				this.runEnter(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || E(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(cm, { bubbles: !0 })));
	}
	submitForm(e) {
		let t = e.getAttribute(Ot);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${rr}="${Sr(t)}"]`);
		n !== null && !E(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Bs(e);
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
		let r = ts(e);
		r?.root === t && r.row !== null && os(t, L(t, jo, A), r.row), N(t);
	}
};
function pm(e) {
	return e.isComposing || e.keyCode === lm;
}
function mm(e, t) {
	return gm(t) && e.hasAttribute(sm);
}
function hm(e, t) {
	return gm(t) && e.hasAttribute(om) && !e.readOnly && !E(e);
}
function gm(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var _m = `img.${Ke}`, vm = "%238c8c8c", ym = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${vm}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${vm}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${vm}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, bm = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${vm}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${vm}'/%3E%3C/svg%3E`, xm = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(_m)) (Sm(e) || e.complete && e.naturalWidth === 0) && wm(e);
		F(this.root, _m, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !Cm(t) && t.removeAttribute(Je), Sm(t) && wm(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(_m) && wm(t);
	}
};
function Sm(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Cm(e) {
	let t = e.getAttribute("src");
	return t === ym || t === bm;
}
function wm(e) {
	let t = e.getAttribute(qe);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	Cm(e) || (e.setAttribute(Je, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? bm : ym));
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Tm = "data-ui-radio-value", Em = "ui-radio-group__input", Dm = "ui-radio-group__dot", Om = "ui-radio-group", km = "ui-radio-group__item", Am = "data-ui-radio-group-name", jm = "data-ui-radio-bind-value-id", Mm = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Om}`)]);
		for (let e of this.root.querySelectorAll(`.${Om}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Om}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Nm));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Tm, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Om}`)) {
			let n = e.getAttribute(Am);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Am), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Am, a);
			for (let e of L(r, `.${Em}`, `.${Om}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Om}`)) n.has(e.getAttribute(Am) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Tm);
		for (let n of L(e, `.${Em}`, `.${Om}`)) {
			n.checked = n.value === t;
			let e = Pm(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(km) ? [e] : [...e.querySelectorAll(`.${km}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Em}`) !== null) return;
		let t = e.closest(`.${Om}`), n = t?.getAttribute(Am);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Em, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(jm);
		a !== null && r.setAttribute(Be, a);
		let o = document.createElement("span");
		o.className = Dm, e.prepend(r, o), this.sync(t);
	}
};
function Nm(e) {
	return e.classList.contains(Om) ? [e] : [...e.querySelectorAll(`.${Om}`)];
}
function Pm(e) {
	let t = e.closest(`.${km}`);
	return t !== null && D(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Fm(e) {
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
function Im(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Lm(e, t) {
	return t !== null && e.length >= t;
}
function Rm(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Lm(e, n) ? null : [...e, t];
}
function zm(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Bm = /[,\uFF0C\r\n]/;
function Vm(e) {
	return Bm.test(e);
}
function Hm(e) {
	return e.split(Bm).map((e) => e.trim()).filter((e) => e.length > 0);
}
function Um(e) {
	let t = e.split(Bm), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Wm(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Lm(a, n) ? r : i(a, t);
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
var Gm = /\p{M}/gu;
function Km(e, t) {
	return qm(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function qm(e, t) {
	return Xm(e, Ym(t));
}
function Jm(e, t) {
	return t.every((t) => e.includes(t));
}
function Ym(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Xm(e, t) {
	let n = e.normalize("NFD").replace(Gm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Zm = "data-ui-search-debounce", Qm = "data-ui-search-min-length", $m = "data-ui-search-manual", eh = "data-ui-search-answered", th = "ui-search__input", nh = "ui-select__list", rh = "ui-select__option", ih = "ui-text__title", ah = 300, oh = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(th) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		sh(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Zm), i = r === null ? ah : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : ah));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(th)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), !t && e.hasAttribute($m)) return;
		let n = e.getAttribute(Qm), r = n === null ? 0 : Number(n);
		e.value.length < r || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function sh(e) {
	if (e.hasAttribute(eh)) return;
	let t = e.closest(`.${_r}`), n = t?.querySelector(`.${nh}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Qm), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? Km(e.value, e) : [], o = lh(n, (e) => a.length === 0 || Jm(qm(ch(e), e), a));
	fh(t, n, a.length > 0 && o === 0);
}
function ch(e) {
	return e.querySelector(`.${ih}`)?.textContent ?? e.textContent ?? "";
}
function lh(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && uh(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(rh)) continue;
		let e = t(a);
		uh(a, e), r ||= e, e && i++;
	}
	return n !== null && uh(n, r), i;
}
function uh(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function dh(e) {
	let t = e.querySelector(`.${nh}`);
	t !== null && fh(e, t, lh(t, (e) => e.style.display !== "none") === 0);
}
function fh(e, t, n) {
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
var ph = 500, mh = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > ph) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += qm(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (qm(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function hh(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var gh = "data-ui-select-value", _h = "data-ui-select-placement", vh = "ui-select--open", yh = "ui-select__trigger-content", bh = "data-ui-select-content", xh = "ui-select__placeholder", Sh = "ui-input__affix-icon--prefix", Ch = "ui-select__popup", wh = "ui-select__list", Th = "ui-select__option", Eh = "ui-select__value-input", Dh = "data-ui-select-clear", Oh = "ui-search", kh = "ui-search__input", Ah = "ui-text__title", jh = "data-ui-active", Mh = "ui-multi-select", Nh = "ui-multi-select__chips", Ph = "ui-multi-select__chip", Fh = "ui-multi-select__chip-label", Ih = "ui-multi-select__chip-remove", Lh = "data-ui-select-chip", Rh = "data-ui-select-max", zh = "data-ui-select-free-text", Bh = "ui-multi-select__entry", Vh = "data-ui-select-tag-entry", Hh = [
	gh,
	Zn,
	Rh,
	"class",
	v
];
function Uh(e) {
	return e === null || O(e) || E(e);
}
function Wh(e) {
	return e.classList.contains(Mh);
}
function Gh(e) {
	return e.classList.contains(Oh);
}
function Kh(e) {
	return Gh(e) ? e.querySelector(`.${kh}`) : null;
}
function qh(e) {
	return e.hasAttribute(zh) ? e.querySelector(`:scope > .${pr} .${Bh}`) : null;
}
function Jh(e) {
	return Kh(e) ?? qh(e);
}
function Yh(e) {
	return qh(e) ?? e.querySelector(".ui-select__trigger");
}
function Xh(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Bh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function R(e) {
	return L(e, `.${Ch} .${Th}`, `.${_r}`);
}
function Zh(e) {
	return e === null ? null : e.querySelector(`.${Ah}`)?.textContent ?? e.textContent;
}
function Qh(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ie), t.removeAttribute(v), t.removeAttribute(oe), t.removeAttribute(ae);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var $h = class {
	root;
	popups = new fu({
		show: ({ owner: e }) => e.classList.add(vh),
		hide: ({ owner: e }) => {
			e.classList.remove(vh), this.markActive(e, null);
			let t = e.querySelector(`.${Ch}`);
			t !== null && (t.style.minHeight = "");
		}
	});
	typeAhead = new mh();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${_r}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) lg(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Hh,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${Dh}], .${Ih}`) !== null || ig(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Uh(r)) return;
		this.releaseRefusal(r);
		let i = Um(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Xh(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented ? Xh(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Vh) !== "first-suggestion" || !R(t.select).some((e) => e.hasAttribute(jh)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Xh(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Uh(t.select) || !Vm(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Hm(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Fm(e.getAttribute(Zn)), a = Im(e.getAttribute(Rh)), o = Wm(i, n.map((t) => ({
			text: t,
			key: ag(e, t) ?? t
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
		sh(t);
		let n = t.value.trim().length > 0, r = n ? R(e).filter((e) => tg(e) && !D(e)) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Vh) === "first-suggestion" && (this.markActive(e, i), i !== null && ng(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Wh(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(gh);
		this.decorateOptions(e);
		let n = t === null ? null : R(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${xh}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of R(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${Eh}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), dh(e);
	}
	syncMultiple(e) {
		let t = Fm(e.getAttribute(Zn)), n = new Set(t), r = Lm(t, Im(e.getAttribute(Rh)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = R(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = qh(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		sg(e, s.map((e) => ({
			key: e,
			label: og(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Uh(e) && (o.readOnly = Uh(e));
		let c = e.querySelector(`.${xh}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${Eh}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Zn, u), dh(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${pr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${yh}`), a = i?.getAttribute(bh) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(bh), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Gh(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(v);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = yh;
			let e = r.querySelector(`:scope > .${Sh}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Qh(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of R(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = D(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${Th}`);
		t === null || n === null || n.hasAttribute(jh) || D(n) || E(n) || n.closest(".ui-select") !== t || (Jh(t) === null && (k(R(t).filter((e) => !D(e)), n), js(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ih}`);
		if (t !== null) {
			let n = t.closest(`.${_r}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Uh(n) || this.removeChosen(n, t.closest(`.${Ph}`)?.getAttribute(Lh) ?? null));
			return;
		}
		let n = e.target.closest(`[${Dh}]`);
		if (n !== null) {
			let t = n.closest(`.${_r}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Uh(t) || (this.clearValue(t), eg(t)));
			return;
		}
		let r = e.target.closest(`.${pr}`);
		if (r !== null) {
			let t = r.closest(`.${_r}`);
			if (Uh(t)) return;
			e.preventDefault();
			let n = t === null ? null : qh(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${Th}`);
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
		let t = e.target.closest(`.${Th}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${_r}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleEntryKey(e) {
		let t = Xh(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Uh(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key === "ArrowDown" ? 1 : -1) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? R(r).find((e) => e.hasAttribute(jh) && tg(e) && !D(e)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Hm(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Hm(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Nh} > .${Ph}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Lh)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = rg(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Ih}`) ?? (n === 1 ? Yh(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		sh(t);
		let r = R(e).filter((e) => tg(e) && !D(e) && !E(e)), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Ih) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Wh(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Uh(n)) return !0;
				let r = rg(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Lh) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Lh) ?? null);
				let o = a === null ? null : rg(n).find((e) => e.getAttribute(Lh) === a) ?? null;
				return o !== null && o.querySelector(`.${Ih}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Uh(t)) return !1;
		e.preventDefault();
		let n = Kh(t);
		n !== null && sh(n);
		let r = R(t).filter((e) => tg(e) && !D(e) && !E(e)), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = hh(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(Th))) return !1;
		let r = n.closest(`.${_r}`), i = r !== null && r === this.openSelect;
		if (r === null || Uh(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Kh(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = R(r).filter((e) => !D(e) && !E(e)), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(jh)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => Zh(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (k(R(r).filter((e) => !D(e)), c), ng(r, c), N(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Wh(t) || Uh(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Nh} > .${Ph}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Lh)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(kh) || !t.contains(e.target) ? null : R(t).find((e) => e.hasAttribute(jh) && !D(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = Jh(e), i = qh(e);
		r !== null && !t && sh(r), dh(e);
		let a = e.querySelector(`.${pr}`), o = e.querySelector(`.${Ch}`), s = e.querySelector(`.${wh}`) ?? o, c = e.getAttribute(_h);
		if (a === null || o === null || s === null) return;
		let l = Tr(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && qc(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), ug(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = R(e).filter((e) => !D(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Os()) {
			k(n, null), this.markActive(e, null), eg(e);
			return;
		}
		let i = r ?? n[0];
		k(n, i), this.markActive(e, i, Os()), ng(e, i), N(i);
	}
	initializeSearch(e, t, n, r) {
		let i = R(e), a = i.filter((e) => tg(e) && !D(e)), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Os() ? null : a[0] ?? null);
		k(i, null), this.markActive(e, o, Os()), o !== null && ng(e, o), !ks() && (N(t), t.select());
	}
	initializeEntry(e, t) {
		k(R(e), null), this.markActive(e, t), t !== null && ng(e, t);
	}
	moveCurrent(e, t) {
		let n = R(e).filter((e) => !D(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(jh)) ?? null, i = vo({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (Jh(e) === null ? (k(n, i), i.focus()) : ng(e, i), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of R(e)) r === t ? r.setAttribute(jh, "") : r.hasAttribute(jh) && r.removeAttribute(jh), As(r, r === t && n);
		let r = Jh(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Tr(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || D(t) || Uh(e)) return;
		if (Wh(e)) {
			let r = Rm(Fm(e.getAttribute(Zn)), n, Im(e.getAttribute(Rh)));
			this.markActive(e, t, Os()), r !== null && this.writeChosen(e, r);
			let i = qh(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(gh) === n) {
			this.close();
			return;
		}
		e.setAttribute(gh, n), this.sync(e);
		let r = e.querySelector(`.${Eh}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : zm(Fm(e.getAttribute(Zn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Ph}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Yh(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Zn) : e.setAttribute(Zn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Eh}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Wh(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(gh)) return;
		e.removeAttribute(gh), this.sync(e);
		let t = e.querySelector(`.${Eh}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function eg(e) {
	let t = e.querySelector(`.${pr}`), n = Yh(e);
	t !== null && n !== null && !t.contains(document.activeElement) && N(n);
}
function tg(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function ng(e, t) {
	let n = e.querySelector(`.${wh}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function rg(e) {
	return [...e.querySelectorAll(`.${Nh} > .${Ph}`)];
}
function ig(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && qh(t) !== null && !e.classList.contains(Bh);
}
function ag(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of R(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !D(t) && (e.toLocaleLowerCase() === n || Zh(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function og(e, t) {
	let n = Zh(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function sg(e, t) {
	let n = e.querySelector(`.${Nh}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Ph}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Lh) === t[n].key && e.querySelector(`.${Fh}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => cg(e.key, e.label)));
	}
}
function cg(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Ph, n.setAttribute(Lh, e), r.className = Fh, r.textContent = t, i.className = Ih, i.type = "button", i.tabIndex = -1, T.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function lg(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${_r}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === gh || e.attributeName === "data-ui-selected-keys" || e.attributeName === Rh)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${Ch}`)?.closest(`.${_r}`);
	n != null && t.add(n);
}
function ug(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var dg = class {
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
		!ho(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, fg = "data-ui-input-debounce", pg = `input[${fg}], textarea[${fg}]`;
function mg(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(pg);
}
var hg = /* @__PURE__ */ new Set();
function gg() {
	for (let e of hg) if (e.waiting) return !0;
	return !1;
}
function _g() {
	for (let e of hg) e.commitAll();
}
var vg = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), hg.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!mg(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(fg));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!mg(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, yg = "textarea.ui-text-area__field", bg = "data-ui-text-area-grow";
function xg() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var Sg = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(yg) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(yg)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(si(e.components, yg));
		}), F(this.root, yg, {
			childList: !0,
			attributeFilter: [bg]
		}, (e) => {
			this.fitAll(si(e, yg));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(bg)) {
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
function Cg(e) {
	let t = wg(e.getAttribute("min"), 0), n = wg(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, wg(r, 1))
	};
}
function wg(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function Tg(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function Eg(e, t) {
	return Dg(t.min + e * (t.max - t.min), t);
}
function Dg(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, Og(t.min + r * t.step, t);
}
function Og(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(kg(t.step), kg(t.min)))));
}
function kg(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function Ag(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function jg(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return Mg(o, i);
	let s = (o - i.min) / i.step;
	return Mg(Og(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function Mg(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var Ng = "ui-slider__input", Pg = "ui-slider__input--end", Fg = "ui-slider__input--held", Ig = "ui-slider__value", Lg = "ui-slider__bubble", Rg = "ui-slider__track", zg = "ui-slider__thumb-anchor", Bg = "ui-slider", Vg = "ui-slider--range", Hg = "ui-orientation--vertical", Ug = "--ui-slider-fraction", Wg = "--ui-slider-end-fraction", Gg = 6, Kg = "Value", qg = "EndValue", Jg = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Yg = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new Tf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Vg} .${Rg}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Jg.has(e.propertyName)) return;
			let t = C(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) for (let t of n.querySelectorAll(`.${Ng}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Zg(t) ? qg : Kg) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Xg(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Xg(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Xg(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || e_(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ng)) return;
		let t = e.target;
		if (this.cancelled.delete(t), e_(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Qg(t);
		if (n !== null) {
			let e = $g(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${Ng}:not(.${Pg})`), r = e.querySelector(`.${Pg}`);
		if (n === null || r === null) return null;
		let i = Eg(Tg(e.getBoundingClientRect(), t, t_(e), n_(e)), Cg(n)), a = Ag(i, Number(n.value), Number(r.value));
		if (e_(n)) return N(a === "end" ? r : n), null;
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
		let n = e.start.closest(`.${Rg}`);
		if (n === null) return;
		let r = Eg(Tg(n.getBoundingClientRect(), t, t_(n), n_(n)), Cg(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Fg), N(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Qg(e), r = n === null ? String(t) : $g(e, t, n);
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
		e.held?.classList.remove(Fg), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = r_(e);
		t !== null && il(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Gg
		});
	}
	releaseBubble(e) {
		dl(r_(e)?.bubble);
	}
	writeReadings(e) {
		let t = Zg(e), n = e.closest(`.${Rg}`)?.parentElement ?? e.parentElement, r = t ? `.${Ig}--end, .${Lg}--end` : `.${Ig}:not(.${Ig}--end), .${Lg}:not(.${Lg}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Rg}`)?.style.setProperty(t ? Wg : Ug, String(i_(e))), e.matches(`:active, :focus-visible, .${Fg}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Xg(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Ng) ? e : null;
}
function Zg(e) {
	return e.classList.contains(Pg);
}
function Qg(e) {
	return e.closest(`.${Vg} .${Rg}`)?.querySelector(Zg(e) ? `.${Ng}:not(.${Pg})` : `.${Pg}`) ?? null;
}
function $g(e, t, n) {
	let r = Number(e.closest(`.${Bg}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(jg(t, Zg(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, Cg(e)));
}
function e_(e) {
	return O(e) || E(e);
}
function t_(e) {
	return e.closest(`.${Bg}`)?.classList.contains(Hg) === !0;
}
function n_(e) {
	let t = e.querySelector(`.${zg}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : t_(e) ? t.height : t.width;
}
function r_(e) {
	if (!(e instanceof Element) || !e.classList.contains(Ng)) return null;
	let t = e.closest(`.${Rg}`), n = Zg(e), r = t?.querySelector(n ? `.${Lg}--end` : `.${Lg}:not(.${Lg}--end)`) ?? null, i = t?.querySelector(n ? `.${zg}--end` : `.${zg}:not(.${zg}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: t_(e)
	};
}
function i_(e) {
	let { min: t, max: n } = Cg(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var a_ = {
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
}, o_ = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], s_ = [
	"$n",
	"n$",
	"$ n",
	"n $"
], c_ = [
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
], l_ = [
	"n %",
	"n%",
	"%n",
	"% n"
], u_ = [
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
], d_ = /[1-9]/;
function f_(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return a_;
	try {
		return {
			...a_,
			...JSON.parse(t)
		};
	} catch {
		return a_;
	}
}
function p_(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = h_(t);
	if (r === null) return g_(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = __(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return m_(e, t) ? S_(o_[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = __(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return m_(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = v_(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return m_(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = __(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return S_(m_(e, t) ? c_[n.currencyNegativePattern] ?? "-$n" : s_[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = __(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return S_(m_(e, t) ? u_[n.percentNegativePattern] ?? "-n %" : l_[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return g_(e, n);
	}
}
function m_(e, t) {
	return e < 0 && d_.test(t);
}
function h_(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function g_(e, t) {
	let { integer: n, fraction: r } = y_(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function __(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = v_(e, t, n);
	return n === 0 ? x_(o, r, i) : `${x_(o, r, i)}${a}${s}`;
}
function v_(e, t, n) {
	let { integer: r, fraction: i } = y_(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? b_(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function y_(e, t) {
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
function b_(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function x_(e, t, n) {
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
function S_(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var C_ = {
	readCulture: f_,
	format: p_
}, w_ = /^-?(\d+(\.\d*)?|\.\d+)$/;
function T_(e, t, n) {
	if (!w_.test(e)) return e;
	let r = n.thousands ? t : j_(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return p_(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return p_(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function E_(e, t, n) {
	return w_.test(e) ? (A_(n) ? M_(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function D_(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = A_(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!w_.test(d)) return null;
	let f = a ? M_(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function O_(e, t, n, r, i) {
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
function k_(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function A_(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function j_(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function M_(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var N_ = "ui-number-input", P_ = "ui-number-input__field", F_ = "data-ui-number-no-decimals", I_ = "data-ui-number-no-negative", L_ = "data-ui-number-no-thousands", R_ = "data-ui-number-trim-zeros", z_ = "data-ui-number-step", B_ = "data-ui-number-min", V_ = "data-ui-number-max", H_ = "data-ui-number-step-direction", U_ = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${P_}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(si(e.components, `.${P_}`));
		}), T.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${P_}`)));
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
		let t = W_(e);
		if (t !== null) return this.keptValue(t) ?? J_(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(R_) ? k_(t) : t, r = f_(e), i = e === document.activeElement ? E_(n, r, Y_(e)) : q_(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = W_(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(F_), r = !t.hasAttribute(I_), i = t.selectionStart ?? t.value.length, a = O_(t.value, i, f_(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = W_(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = W_(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : J_(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(R_) && !O(t) && !E(t)) {
			let e = this.values.get(t) ?? "", n = k_(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = W_(e.target);
		if (t === null) return;
		let n = J_(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = W_(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = E_(t, f_(e), Y_(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + H_ + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${P_}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(H_) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = W_(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(z_) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : J_(e) ?? "0") || 0) + n * t, i = e.getAttribute(B_), a = e.getAttribute(V_);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, X_(r)), this.show(e);
	}
};
function W_(e) {
	return e instanceof HTMLInputElement && e.classList.contains(P_) ? e : null;
}
function G_(e, t) {
	let n = e.classList.contains(N_) ? e.querySelector(`.${P_}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = K_(n, B_), a = K_(n, V_);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: q_(n, i, f_(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: q_(n, a, f_(n)) }
	} : null;
}
function K_(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function q_(e, t, n) {
	return T_(t, n, {
		format: Y_(e),
		thousands: !e.hasAttribute(L_)
	});
}
function J_(e) {
	return D_(e.value, f_(e), Y_(e));
}
function Y_(e) {
	return e.closest(`.${N_}`)?.getAttribute("data-ui-number-format") ?? null;
}
function X_(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function Z_(e, t) {
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
function Q_(e) {
	switch (e.getAttribute(pt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function $_(e) {
	let t = Q_(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/interactions/drag-marks.ts
function ev(e, t, n, r, i, a = [], o = "move") {
	tv(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	nv(e, i, o);
}
function tv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function nv(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function rv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
//#endregion
//#region src/interactions/item-drags.ts
var iv = "application/x-ne-items", av = null, ov = null;
function sv(e, t, n) {
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
function cv(e, t) {
	let n = Ho(t);
	return n.includes(e) ? n.filter((t) => t === e || uv(t)) : [e];
}
function lv(e) {
	return !Za(e, "data-ui-undraggable") && !D(e);
}
function uv(e) {
	return lv(e) && j(e) !== null;
}
function dv(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function fv(e, t, n = null) {
	av = t, ov = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(iv, t.kind);
}
function pv(e) {
	return av !== null && e.dataTransfer?.types.includes(iv) === !0 ? av : null;
}
function mv() {
	let e = ov;
	av = null, ov = null, e?.();
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
	return (e?.filters ?? []).every((e) => Wv(e, t, n)) && (r?.filters ?? []).every((e) => jc(Ov(t, e.itemProperty), e.operator, e.value));
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
		let n = Kv(Mc(Ov(e, r.itemProperty)), Mc(Ov(t, r.itemProperty)));
		if (n !== 0) return Pr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Wv(e, t, n) {
	if (!Gv(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return jc(Ov(t, e.itemProperty), e.operator, r);
}
function Gv(e, t, n, r) {
	return e == null || jc(r.get(e, []), t, n);
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
//#region src/interactions/tab-rows.ts
var ry = "ui-tab-item";
function iy(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function ay(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? iy(e).parentElement : null;
}
function oy(e, t) {
	return Za(iy(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var sy = ".ui-items-view__item, .ui-table__row", cy = "ui-row--dragging", ly = "--ui-row-drop-offset", uy = "move";
function dy(e, t) {
	ms(e, uy, { index: t });
}
function fy(e) {
	return {
		name: uy,
		registration: {
			dynamicParameters: (e) => {
				let t = py(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...Z_((t) => e === void 0 ? null : my(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function py(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function my(e, t) {
	let n = py(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = ay(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(sy), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, M(i), n);
	return o === null ? null : { pending: o };
}
var hy = class {
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
		let r = by(t.root, t.row);
		if (r === null ? !xy(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (os(t.root, Dy(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(jo), n = t?.parentElement ?? null, r = n?.closest(A) ?? null;
		if (t === null || n === null || r === null || !t.matches(sy) || !n.hasAttribute("data-ui-items-host") || E(r) || !uv(t)) return null;
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
		let i = sv(t.root, n, cv(t.row, Dy(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => j(e) ?? e);
		ev(e, t.root, r, cy, M(t.row), a, dv(i, t.moves)), fv(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = Cy(t.root, t.host), r = Dy(t.host), i = vy(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? Oy(t.root, null) : Oy(t.root, i, Ty(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (Sy(t) !== Sy(e.row)) return null;
		let r = gy(yy(e.host, this.services?.keysOf), M(e.row), M(t), n);
		return r === null ? null : r + $_(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && rv(e, t.host) && Oy(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = vy(t.host, e.target, e, Cy(t.root, t.host), Dy(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && dy(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (tv(e.root, cy), Oy(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = ts(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || t.row !== null && nm(e.target, t.row) !== null) return;
		let n = Yo(t.root), r = n === null ? [] : Dy(n), i = rs(r);
		if (n === null || i === null || this.liftableRow(i)?.moves !== !0) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && dy(i, c);
	}
};
function gy(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = _y(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function _y(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function vy(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(jo);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(jo) ?? null;
	if (a ??= Ey(i, n), a === null) return null;
	let o = (j(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && wy(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function yy(e, t) {
	switch (Q_(e)) {
		case "virtualized": return [...t?.(e) ?? z(e).map(M)];
		case "windowed": return z(e).map(M);
		default: return Xv(e, z(e)).map(M);
	}
}
function by(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function xy(e, t) {
	return nm(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Sy(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Cy(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function wy(e, t, n) {
	if (Sy(e) !== Sy(t)) return !1;
	if (!n.across) return !0;
	let r = (j(e) ?? e).getBoundingClientRect(), i = (j(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Ty(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !wy(t.anchor, r, n)) return -1;
	let i = (j(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (j(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function Ey(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (j(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function Dy(e) {
	return z(e).filter((e) => e instanceof HTMLElement && e.matches(sy) && j(e) !== null);
}
function Oy(e, t, n = 0) {
	let r = t === null ? null : j(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(ly));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(ly) !== i && r.style.setProperty(ly, i);
}
function ky(e) {
	e.classList.remove(cy), e.querySelector(`:scope > [${ie}]`)?.classList.remove(cy);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Ay(e) {
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
		default: o = Vy(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function jy(e, t, n = Ly()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function My(e, t = Ly()) {
	let n = Ny(e.code, t);
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
function Ny(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Fy[e] : void 0) ?? Py[e] ?? e;
}
var Py = {
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
}, Fy = {
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
}, Iy = null;
function Ly() {
	return Iy === null && (Iy = Ry()), Iy;
}
function Ry() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var zy = { words(e) {
	let t = Ay(e);
	return t === null ? null : My(t);
} };
function By(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Vy(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Hy[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Hy[t] ?? null;
}
var Hy = {
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
}, Uy = 120;
function Wy(e) {
	return e.typing && e.tallest - e.height > Uy;
}
function Gy(e) {
	return ho(e) || e instanceof HTMLElement && e.isContentEditable;
}
var Ky = class {
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
		let t = Wy({
			height: e.height,
			tallest: this.tallest,
			typing: Gy(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Wn, t);
	}
}, qy = "--ui-tree-drop-depth";
function Jy(e) {
	return e.querySelector(`.${pn}`);
}
function Yy(e, t) {
	if (D(e)) return !1;
	let n = t?.getAttribute(Tn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function Xy(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || Yy(n, Jy(n));
}
function Zy(e, t) {
	let n = Jy(e);
	if (Yy(e, n)) return M(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return Xy(r, t) ? r : null;
}
function Qy(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${mn}]`)) n !== t && (n.removeAttribute(mn), n.style.removeProperty(qy));
	t !== null && (t.setAttribute(mn, n), r === void 0 ? t.style.removeProperty(qy) : t.style.setProperty(qy, String(r)));
}
function $y(e, t, n) {
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
function eb(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = tb(e, r, n);
	return i === null || !nb(e, i.parent) ? null : i;
}
function tb(e, t, n) {
	if (n === "in") {
		let n = $y(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = $y(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: ib(e, n, t.parent, !1)
		};
	}
	let r = rb(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function nb(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function rb(e, t) {
	return e.filter((e) => e.parent === t);
}
function ib(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = rb(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function ab(e, t, n) {
	let r = rb(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? ib(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var ob = "drop:", sb = "ui-row--cut", cb = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, lb = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, ub = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function db(e) {
	return {
		dynamicParameters: (e) => {
			let t = fb(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...Z_((t) => pb(e, t), (t) => e?.settle(t))
	};
}
function fb(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function pb(e, t) {
	let n = fb(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var mb = class {
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
		let i = hb(t, r, gb(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? Yo(e) : null;
		if (r !== null) {
			let i = Dy(r), a = Cy(e, r), o = yy(r, this.options.keysOf), s = t !== null && n !== null ? vy(r, t, n, a, i) : _b(i);
			return {
				index: ((s === null ? null : _y(o, M(s.anchor), s.side)) ?? o.length) + $_(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(ge, "") : Oy(e, s, Ty(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = vb(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Yo(e) : yb(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => Qy(e, r)
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
		this.marked = null, e !== null && (e.removeAttribute(ge), e.matches(".ui-items-view, .ui-table") ? Oy(e, null) : e.classList.contains("ui-tree") && Qy(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && rv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), mv(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && Q_(e.host) === "plain" && Q_(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(ob + e.kind, {
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
			Gy(e.target) || (jy(ub, e) ? this.paste(e, e.target) : jy(cb, e) ? this.take(e, e.target, !0) : jy(lb, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (j(e) ?? e).classList.remove(sb);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : hb(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = ts(t), a = i === null ? null : Yo(i.root);
		if (i === null || a === null || E(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = [...a.children].filter((e) => e instanceof HTMLElement && e.matches(jo) && j(e) !== null), s = i.row ?? rs(o), c = s === null || !uv(s) ? null : sv(i.root, a, cv(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (j(e) ?? e).classList.add(sb);
	}
};
function hb(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function gb(e) {
	return Ly() ? e.altKey : e.ctrlKey;
}
function _b(e) {
	let t = is(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function vb(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : Zy(n, (t) => yb(e, t));
}
function yb(e, t) {
	return e.querySelector(`.${fn}[${v}="${Sr(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var B = "ui-temporal-input", bb = "ui-calendar", xb = `.${B}, .${bb}`, Sb = "ui-temporal-input__value-input", Cb = "ui-temporal-input__end-value-input", wb = "data-ui-temporal-range", Tb = "data-ui-temporal-end", Eb = "data-ui-temporal-mode", Db = "data-ui-temporal-format", Ob = "data-ui-temporal-default-format", kb = "data-ui-temporal-min", Ab = "data-ui-temporal-max", jb = "data-ui-temporal-step", Mb = "data-ui-temporal-step-unit", Nb = "data-ui-temporal-marked-days", Pb = "data-ui-temporal-marked-only", Fb = "data-ui-temporal-page-culture", Ib = "data-ui-temporal-months", Lb = "data-ui-temporal-months-genitive", Rb = "data-ui-temporal-months-short", zb = "data-ui-temporal-daynames", Bb = "data-ui-temporal-weekdays", Vb = "data-ui-temporal-first-day", Hb = "data-ui-temporal-am", Ub = "data-ui-temporal-pm", Wb = /* @__PURE__ */ new Set([
	Db,
	Ob,
	kb,
	Ab,
	Ib,
	Hb,
	Ub,
	Nb,
	Pb
]), Gb = 2e3;
function Kb(e) {
	let t = e.getAttribute(Eb);
	return t === "time" || t === "date-time" ? t : "date";
}
function qb(e) {
	let t = e.getAttribute(Db);
	return t === null || t.trim().length === 0 ? e.getAttribute(Ob) ?? "" : t;
}
function Jb(e) {
	let t = e.getAttribute(Mb), n = Math.max(1, Math.trunc(Number(e.getAttribute(jb))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Yb(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Xb(e) {
	return {
		monthNames: Zb(e, Ib),
		monthGenitiveNames: Zb(e, Lb),
		abbreviatedMonthNames: Zb(e, Rb),
		dayNames: Zb(e, zb),
		abbreviatedDayNames: Zb(e, Bb),
		amDesignator: e.getAttribute(Hb) ?? "AM",
		pmDesignator: e.getAttribute(Ub) ?? "PM"
	};
}
function Zb(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Qb(e, t) {
	e.hasAttribute(Fb) && (nx(e, Lb, t.monthGenitiveNames.join("|")), nx(e, Rb, t.abbreviatedMonthNames.join("|")), nx(e, zb, t.dayNames.join("|")), nx(e, Bb, t.abbreviatedDayNames.join("|")), nx(e, Ib, t.monthNames.join("|")), nx(e, Hb, t.amDesignator), nx(e, Ub, t.pmDesignator), nx(e, Ob, tx(Kb(e), Jb(e), t)));
}
function $b(e) {
	for (let t = 0; t < e.length;) {
		let n = ki(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function ex(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function tx(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : bi(n, r);
}
function nx(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function rx(e) {
	return e.hasAttribute(wb);
}
function ix(e) {
	return e !== null && e.hasAttribute(Tb);
}
function ax(e) {
	return V(e, !1);
}
function V(e, t) {
	let n = ox(e, t);
	return n === null ? null : vx(n.value, Kb(e));
}
function ox(e, t) {
	return e.querySelector(`.${t ? Cb : Sb}`);
}
function sx(e, t) {
	return vx(e.getAttribute(t) ?? "", Kb(e));
}
function cx(e) {
	let t = sx(e, kb), n = sx(e, Ab), r = (e.getAttribute(Nb) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : yx(t, "date"),
		max: n === null ? null : yx(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(Pb)
	};
}
function lx(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function ux(e, t, n) {
	let r = ox(e, n);
	if (r === null) return;
	let i = t === null ? "" : yx(t, Kb(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function dx(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : zi(n, qb(e), Xb(e));
	return r === null ? n : yx(Pi(r), Kb(e));
}
function fx(e) {
	if (!rx(e)) return;
	let t = V(e, !1), n = V(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (ux(e, n, !1), ux(e, t, !0));
}
function px(e) {
	let t = sx(e, kb), n = sx(e, Ab);
	if (t === null && n === null) return null;
	for (let r of rx(e) ? [!1, !0] : [!1]) {
		let i = V(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: wi(t, qb(e), Xb(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: wi(n, qb(e), Xb(e)) }
		};
	}
	return null;
}
function mx(e) {
	return gx(e, hx(e, /* @__PURE__ */ new Date()));
}
function hx(e, t) {
	let n = sx(e, kb), r = sx(e, Ab);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function gx(e, t) {
	let n = Jb(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var _x = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function vx(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = _x.exec(n);
		return e === null ? null : new Date(Gb, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Ni(n);
	return r === null ? null : Pi(r);
}
function yx(e, t) {
	let n = `${bx(e.getHours())}:${bx(e.getMinutes())}:${bx(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${bx(e.getMonth() + 1)}-${bx(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function bx(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function xx(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = wx(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Tx(e.start).getTime() ? {
		start: wx(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: wx(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Sx(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Tx(e).getTime();
	return r > Tx(t).getTime() && r < Tx(n).getTime();
}
function Cx(e, t, n) {
	return !n && Sx(e, t.start, t.end);
}
function wx(e, t) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Tx(e) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var Ex = "ui-temporal-input__day", Dx = "ui-temporal-input__month", Ox = "data-ui-temporal-nav", kx = "data-ui-temporal-day", Ax = 366;
function jx(e) {
	let t = ax(e);
	return {
		view: $x(t ?? hx(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function Mx(e, t, n, r) {
	let i = Qx("div", `${B}__calendar`), a = Qx("div", `${B}__calendar-header`), o = cx(e), s = Zx("previous", "‹", T.text("ui.picker.previous"));
	s.disabled = Nx(o, t, -1) === null, a.append(s);
	let c = Zx("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${B}__calendar-label`), a.append(c);
	let l = Zx("next", "›", T.text("ui.picker.next"));
	return l.disabled = Nx(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? Lx(e, t, n, r, o) : Rx(t, n, o)), i;
}
function Nx(e, t, n) {
	let r = t.pane === "months", i = nS(t.view, n * (r ? 12 : 1));
	return Fx(e, Px(i, r ? 4 : 7)) ? Ix(e, i) : null;
}
function Px(e, t) {
	return yx(e, "date").slice(0, t);
}
function Fx(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function Ix(e, t) {
	let n = Px(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : vx(r, "date");
	return i === null ? t : $x(i);
}
function Lx(e, t, n, r, i) {
	let a = Jx(e), o = Qx("div", `${B}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = Qx("span", `${B}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = Qx("div", `${B}__days`), c = Tx(/* @__PURE__ */ new Date()), l = rx(e), u = l ? V(e, !1) : r, d = l ? V(e, !0) : null, f = eS(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = tS(f, e), r = yx(n, "date"), a = Qx("button", Ex);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(kx, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${Ex}--outside`), rS(n, c) && (a.classList.add(`${Ex}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${Ex}--marked`);
		let o = u !== null && rS(n, u), p = d !== null && rS(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${Ex}--selected`), l && (o || p) && a.setAttribute("aria-description", T.text(o ? "ui.picker.start" : "ui.picker.end")), Cx(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${Ex}--within`), lx(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = Qx("div", `${B}__calendar-pane`);
	return p.append(o, s), p;
}
function Rx(e, t, n) {
	let r = Qx("div", `${B}__months`);
	for (let i = 0; i < 12; i++) {
		let a = Qx("button", Dx);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(Ox, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Dx}--selected`), a.setAttribute("aria-current", "true")), Fx(n, Px(Fi(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function zx(e) {
	let t = Qx("div", `${B}__period-caption`);
	return t.textContent = T.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Bx(e, t, n) {
	let r = cx(e);
	if (n.startsWith("month:")) {
		let e = Fi(t.view.getFullYear(), Number(n.slice(6)), 1);
		return Fx(r, Px(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = Nx(r, t, -1) ?? t.view, !0;
		case "next": return t.view = Nx(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function Vx(e, t, n) {
	if (rx(e)) {
		Hx(e, t, n);
		return;
	}
	let r = Ux(n, ax(e) ?? mx(e));
	t.focusedDay = r, t.view = $x(r), ux(e, r, !1);
}
function Hx(e, t, n) {
	let r = xx({
		start: V(e, !1),
		end: V(e, !0)
	}, t.activeEnd, Ux(n, mx(e)));
	t.focusedDay = r.end ?? r.start, t.view = $x(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, ux(e, r.end, !0), ux(e, r.start, !1);
}
function Ux(e, t) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Wx(e, t, n) {
	let r = Kx(n), i = qx(t, n, Jx(e));
	if (i === null) return null;
	let a = cx(e);
	if (r === 0) return Gx(a, i);
	let o = i;
	for (let e = 0; e < Ax; e++) {
		if (lx(a, yx(o, "date"))) return o;
		o = tS(o, r);
	}
	return t;
}
function Gx(e, t) {
	let n = yx(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : vx(r, "date");
	return i === null ? t : Ux(i, t);
}
function Kx(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function qx(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return tS(e, -1);
		case "ArrowRight": return tS(e, 1);
		case "ArrowUp": return tS(e, -7);
		case "ArrowDown": return tS(e, 7);
		case "PageUp": return nS(e, -1);
		case "PageDown": return nS(e, 1);
		case "Home": return tS(e, -r);
		case "End": return tS(e, 6 - r);
		default: return null;
	}
}
function Jx(e) {
	let t = Number(e.getAttribute(Vb));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Yx(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${Ex}`)];
	if (i.length === 0) return;
	let a = yx(Tx(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (k(i, o), r && N(o));
}
function Xx(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? V(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${Ex}`)) {
		let e = vx(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${Ex}--preview`, e !== null && n !== null && r !== null && Sx(e, n, tS(r, 1)));
	}
}
function Zx(e, t, n) {
	let r = Qx("button", `${B}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Ox, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function Qx(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function $x(e) {
	return Fi(e.getFullYear(), e.getMonth(), 1);
}
function eS(e, t) {
	let n = $x(e);
	return tS(n, -((n.getDay() - t + 7) % 7));
}
function tS(e, t) {
	return Fi(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function nS(e, t) {
	let n = Fi(e.getFullYear(), e.getMonth() + t, 1), r = Fi(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Fi(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function rS(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var iS = "ui-temporal-input__field", aS = "ui-temporal-input__popup", oS = "ui-temporal-input--open", sS = "ui-calendar__body", cS = "ui-temporal-input__time-cell", lS = "ui-temporal-input__time-column", uS = 140, dS = "data-ui-temporal-toggle", fS = "data-ui-temporal-unit", pS = "data-ui-temporal-cell", mS = "data-ui-temporal-centred", hS = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new fu({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(oS), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(oS);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(xb)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = si(e.components, xb), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && gS(e) && this.states.set(e, jx(e)), this.isShowing(e) && this.renderSurface(e);
		}), F(this.root, xb, { attributeFilter: [...Wb] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), F(this.root, xb, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), T.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) gS(e) && _S(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(xb)], t = T.temporal;
		if (t !== null && T.language !== this.drawnLanguage) {
			this.drawnLanguage = T.language;
			for (let n of e) Qb(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || gS(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${sS}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && _S(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Li(qb(t), MS()), n = Oi(qb(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${iS}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = ox(t, ix(r))?.value ?? "", a = vx(i, Kb(t));
				if (a !== null) {
					r.value = wi(a, qb(t), Xb(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(iS)) return;
		let t = e.target.closest(`.${B}`), n = t === null ? null : ox(t, ix(e.target));
		if (t === null || n === null) return;
		let r = dx(t, e.target.value), i = vx(r, Kb(t)), a = i === null ? r : yx(i, Kb(t));
		if (vS(t, a)) {
			let n = V(t, ix(e.target));
			e.target.value = n === null ? "" : wi(n, qb(t), Xb(t));
			return;
		}
		ix(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), fx(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(iS)) return;
		let t = e.target.closest(`.${B}`);
		t !== null && rx(t) && (this.getState(t).activeEnd = ix(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !rx(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${kx}]`) : null, r = this.getState(t), i = n === null ? null : vx(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Xx(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${kx}], .${cS}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(cS) ? FS(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = _S(e), r = vx(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, k([...n.querySelectorAll(`.${Ex}`)], t), js(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(iS)) return;
		let t = e.target.closest(`.${B}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${dS}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${B}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${Ox}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${kx}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${pS}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${fS}]`)?.getAttribute(fS);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(pS)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (Bx(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, mx(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), rx(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = vx(t, "date");
		if (n === null || O(e) || E(e) || !lx(cx(e), t)) return;
		let r = this.getState(e);
		gS(e) && rx(e) && !r.choosingEnd && V(e, !1) !== null && V(e, !0) !== null && (r.activeEnd = "start");
		let i = ox(e, !1), a = `${i?.value ?? ""}|${ox(e, !0)?.value ?? ""}`;
		Vx(e, r, n), gS(e) && `${i?.value ?? ""}|${ox(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = rx(e) && this.getState(e).activeEnd === "end", i = new Date(V(e, r) ?? mx(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		ux(e, t, n), fx(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(iS)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${B}`), ix(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(cS)) {
			IS(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = vx(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, yx(n, "date"));
			return;
		}
		let r = Wx(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = $x(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lS}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, uS)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lS}`), n = t?.getAttribute(fS) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = jf(this.wheelTurns.get(n) ?? 0, Af(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${cS}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${cS}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${cS}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(pS)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(mS));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(fS), i = DS(e);
		if (!(r === null || i === null || i.classList.contains(`${cS}--selected`))) {
			if (i.matches(":disabled")) {
				TS(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(pS)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${aS}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = rx(e) ? t ?? (V(e, !1) === null ? "start" : V(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = V(e, r.activeEnd === "end") ?? ax(e);
		r.pane = "days", r.view = $x(i ?? hx(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${dS}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => PS(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = jx(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = _S(e);
		if (n === null) return;
		let r = gS(e), i = Kb(e), a = this.getState(e), o = Xb(e), s = rx(e), c = V(e, s && a.activeEnd === "end"), l = OS(n), u = kS(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(zx(a)), r) n.append(Mx(e, a, o, c));
		else {
			let t = Qx("div", `${B}__panes`);
			t.append(Mx(e, a, o, c)), i === "date-time" && t.append(yS(e, c)), n.append(t, jS(i));
		}
		let f = u === null ? null : n.querySelector(`[${Ox}="${Sr(u)}"]:not(:disabled)`);
		Yx(n, a, c, t || d && l === null && f === null), Xx(e, a), r || (wS(n), TS(n), AS(n, l)), f !== null && N(f), r || this.popups.reposition(e);
	}
};
function gS(e) {
	return e.classList.contains(bb);
}
function _S(e) {
	return e.querySelector(`.${gS(e) ? sS : aS}`);
}
function vS(e, t) {
	let n = cx(e), r = n.markedOnly ? vx(t, Kb(e)) : null;
	return r !== null && !n.marked.has(yx(r, "date"));
}
function yS(e, t) {
	let n = Jb(e), r = Qx("div", `${B}__time`), i = Qx("div", `${B}__time-columns`);
	for (let r of bS(n)) i.append(CS(e, r, xS(n, r), t));
	return r.append(i), r;
}
function bS(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function xS(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function SS(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function CS(e, t, n, r) {
	let i = Qx("div", lS);
	i.setAttribute(fS, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", T.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = SS(r, t), s = t === "hour" && $b(qb(e)), c = Xb(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = Qx("button", cS);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? ex(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(pS, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${cS}--selected`), BS(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function wS(e) {
	let t = e.querySelector(`.${B}__calendar`), n = e.querySelector(`.${B}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function TS(e) {
	for (let t of e.querySelectorAll(`.${lS}`)) {
		let e = t.querySelector(`.${cS}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, ES(t, e), t.setAttribute(mS, String(t.scrollTop));
	}
}
function ES(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function DS(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${cS}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function OS(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(cS) ? null : t.closest(`.${lS}`)?.getAttribute(fS) ?? null;
}
function kS(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Ox) : null;
}
function AS(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${lS}[${fS}="${t}"]`)?.querySelector(`.${cS}--selected`) ?? null;
	n !== null && N(n);
}
function jS(e) {
	let t = Qx("div", `${B}__popup-footer`);
	return t.append(Zx("now", T.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Zx("clear", T.text("ui.picker.clear"))), t.append(Zx("done", T.text("ui.picker.done"))), t;
}
function MS() {
	return {
		year: NS("ui.picker.letter.year", Ii.year),
		month: NS("ui.picker.letter.month", Ii.month),
		day: NS("ui.picker.letter.day", Ii.day),
		hour: NS("ui.picker.letter.hour", Ii.hour),
		minute: NS("ui.picker.letter.minute", Ii.minute),
		second: NS("ui.picker.letter.second", Ii.second)
	};
}
function NS(e, t) {
	let n = T.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function PS(e, t) {
	for (let n of e.querySelectorAll(`.${iS}`)) if (ix(n) === t) return n;
	return e.querySelector(`.${iS}`);
}
function FS(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(cS) && js(e);
}
function IS(e) {
	let t = e.target, n = t.closest(`.${lS}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? RS(n, e.key === "ArrowRight" ? 1 : -1) : LS(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), zS(r));
}
function LS(e, t, n) {
	return vo({
		key: n,
		items: [...e.querySelectorAll(`.${cS}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function RS(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${lS}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${cS}--selected`) ?? r.querySelector(`.${cS}:not(:disabled)`);
}
function zS(e) {
	let t = e.closest(`.${lS}`);
	t !== null && ES(t, e);
}
function BS(e, t, n, r) {
	let i = sx(e, kb), a = sx(e, Ab);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var VS = "[data-ui-theme-switcher]", HS = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(VS) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Dr.SetTheme,
				mode: US() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function US() {
	let e = document.documentElement.getAttribute(Rn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var WS = `[${Vn}]`, GS = "ui-language-switcher__trigger", KS = "ui-language-switcher__label-text", qS = "ui-language-switcher__label-text--current", JS = "ui-language-switcher__label-text--page", YS = "ui-language-switcher__menu", XS = "ui-language-switcher__choice", ZS = "ui-language-switcher--open", QS = "ui.language.switch", $S = "ui.language.current", eC = class {
	options;
	root;
	menus = new fu({
		show: ({ owner: e }) => e.classList.add(ZS),
		hide: ({ owner: e }) => e.classList.remove(ZS),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), T.onChange(() => this.showLanguage(T.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${XS}`), n = e.target.closest(WS);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Hn));
			return;
		}
		let r = e.target.closest(`.${GS}`);
		if (r === null || E(r)) return;
		e.preventDefault();
		let i = tC(n);
		if (i.length === 2) {
			let e = T.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(WS);
		if (t === null) return;
		let n = tC(t), r = e.target.closest(`.${GS}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !yo(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = vo({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${XS}`);
		if (t === null || t === document.activeElement || E(t)) return;
		let n = t.closest(WS);
		n !== null && this.menus.isOpen(n) && js(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${YS}`);
		if (r === null) return;
		let i = tC(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Ws(r, i, n);
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
		for (let t of this.root.querySelectorAll(WS)) {
			let n = t.querySelector(`:scope > .${GS}`);
			if (n === null) continue;
			let r = tC(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${KS}`)) {
				let n = t.getAttribute(Hn) === e;
				t.classList.toggle(qS, n), t.classList.contains(JS) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				T.write(n, "aria-label", QS, {
					language: nC(r, e),
					code: rC(e),
					other: nC(r, t),
					otherCode: rC(t)
				});
			} else T.write(n, "aria-label", $S, {
				language: nC(r, e),
				code: rC(e)
			});
		}
	}
};
function tC(e) {
	return [...e.querySelectorAll(`:scope > .${YS} > .${XS}`)];
}
function nC(e, t) {
	let n = e.find((e) => e.getAttribute(Hn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return rC(t);
	}
}
function rC(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var iC = `${Oe}__button`, aC = `${Oe}__more`, oC = `.${b}:not(${qt})`, sC = "ui-text__icon", cC = `.ui-button__content .${sC}`, lC = ".ui-button__content .ui-text__title", uC = /* @__PURE__ */ new WeakMap();
function dC(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(oC)) fC(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(Jt) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function fC(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function pC(e, t) {
	let n = t.entries.map((e) => mC(e, t));
	return t.more && t.openMore !== void 0 && n.push(gC(t.openMore)), e.replaceChildren(...n), n;
}
function mC(e, t) {
	let n = _C(iC), r = yC(e), i = hC(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), E(e) && (n.classList.add(ar), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), uC.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function hC(e) {
	let t = e.querySelector(cC);
	if (t === null || !t.className.split(" ").some(of)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(sC), n.setAttribute(tf, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(nf);
	return r.length > 0 && n.style.setProperty(nf, r), n;
}
function gC(e) {
	let t = _C(`${iC} ${aC}`);
	return t.setAttribute("aria-haspopup", "menu"), T.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function _C(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${gr}`, t.tabIndex = -1, t;
}
function vC(e) {
	return uC.get(e) ?? null;
}
function yC(e) {
	return e.querySelector(lC)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var bC = 500, xC = 10, SC = /* @__PURE__ */ new WeakSet();
function CC(e) {
	return SC.has(e);
}
var wC = class {
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
			timer: setTimeout(() => this.fire(), bC)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > xC && (this.slid = !0), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > xC && this.cancel();
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
		SC.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!SC.has(e)) {
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
}, TC = "tabs:rename", EC = "tabs:pin", DC = "tabs:unpin", OC = "tabs:close", kC = "tabs:delete";
function AC(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function jC(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[TC, e.rename && t.renamable],
		[EC, e.pin && !t.pinned],
		[DC, e.pin && t.pinned],
		[OC, e.close && !e.delete && n],
		[kC, e.delete && n]
	]);
}
function MC(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var NC = "data-ui-context-menu-owner", PC = xe, FC = "ui-context-menu--open", IC = `.${b}:not(${qt})`, LC = `${Oe}--strip`, RC = `.${Oe}:not(.${LC}) > .${aC}`, zC = "input, textarea, select, [contenteditable=''], [contenteditable='true']", BC = "ui-context-menu-opening", VC = Yt, HC = class {
	root;
	closed = null;
	menus = new fu({
		show: ({ popup: e }) => e.classList.add(FC),
		hide: ({ popup: e }, t) => {
			e.classList.remove(FC), this.closed = e, t === "outside" && tw();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new wC({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${NC}]`) !== null && e.closest(zC) === null
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
		let n = UC(t);
		n !== null && (e.preventDefault(), this.open(n.owner, n.menu, e.clientX, e.clientY, JC(e) ? t : null, t.closest(RC)));
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${LC}`)?.remove(), YC(t), i !== null && XC(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && QC(t), this.closed !== null && (Gc(this.closed), this.closed = null);
		let o = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Ds(), s = {
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
			returnFocus: () => (o === null ? null : Gs(o)) ?? Gs(e)
		}) && (a === null && Fl(t, n, r), ew(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(VC) !== null || this.menus.close();
	}
};
function UC(e) {
	let t = e.closest(`[${de}]`);
	for (let n = e.closest(`[${NC}]`); n !== null; n = n.parentElement?.closest(`[${NC}]`) ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = GC(n, e);
		if (r.length === 0 || E(n)) continue;
		if (rw(n)) return null;
		let i = r.find((t) => KC(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var WC = `[${NC}]`;
function GC(e, t) {
	let n = t.closest(`[${Se}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? nw(e, r) : null, nw(e, "")].filter((e) => e !== null);
}
function KC(e, t, n) {
	let r = new CustomEvent(BC, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function qC(e, t) {
	let n = e.closest(`[${NC}]`), r = e.closest(`[${de}]`);
	return n === null || E(n) || rw(n) || r !== null && n.contains(r) ? null : GC(n, e).find((n) => KC(n, e, t)) ?? null;
}
function JC(e) {
	let t = e.pointerType;
	return CC(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : ks();
}
function YC(e) {
	for (let t of e.querySelectorAll(`[${Ee}]`)) t.removeAttribute(Ee);
}
function XC(e, t, n) {
	let r = n.closest(`[${Ce}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !GC(e, r).includes(t)) return;
	let { entries: i } = dC(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Oe} ${LC}`, a.setAttribute("role", "group"), pC(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: ZC
	}), t.insertBefore(a, t.firstElementChild);
}
function ZC(e) {
	E(e) || e.click();
}
function QC(e) {
	let { entries: t } = dC(e), n = e.querySelector(`.${Ut}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) $C(e);
	let r = L(n, `.${b}`, `.${Ut}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && fC(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(qt)) ? $C(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Ht);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	MC(a).forEach((e, t) => {
		a[t] === "rule" && !e && $C(i[t]);
	});
}
function $C(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ee, "");
}
function ew(e) {
	let t = e.querySelector(`.${Ut}`);
	t !== null && Ws(e, L(t, IC, `.${Ut}`));
}
function tw() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${gs}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function nw(e, t) {
	for (let n of e.querySelectorAll(`[${PC}]`)) if ((n.getAttribute(PC) ?? "") === t && n.closest(`[${NC}]`) === e) return n;
	return null;
}
function rw(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${v}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function iw(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function aw(e) {
	return getComputedStyle(e).display !== "none";
}
function ow(e) {
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
				if (e.overflowX !== "visible" && lw(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && lw(n, a, a + t.clientHeight, !1), uw(n)) return !0;
			}
			r = e.position;
		}
	}
	return lw(n, 0, window.innerWidth, !0), lw(n, 0, window.innerHeight, !1), uw(n);
}
function sw(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !iw(n, !1)) && (cw(e.overflowX) || cw(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function cw(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function lw(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function uw(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var dw = `[${Ce}]`, fw = `[${Vl}]:not([hidden]), dialog[open]`, pw = `.${Oe}`, mw = `${Oe}--out`, hw = 6, gw = "--ui-action-bar-gap", _w = 400, vw = /* @__PURE__ */ new WeakMap(), yw = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	De,
	...nr
], bw = class {
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
		if (n === null || n.closest(`${pw}, [data-ui-context-menu]`) !== null) return;
		let r = xw(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : ww(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? Tw(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(pw) === null && JC(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(pw);
		if (n !== null) {
			this.isHostedBar(n) && k(Mw(n), t);
			return;
		}
		Os() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(Sw(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(pw) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(A) && this.choose(Sw(t));
			return;
		}
		let n = t.closest(pw);
		if (n !== null && t.classList.contains(iC)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest(fw);
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(A)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(A) && this.choose(Sw(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && Iw(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Gs(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = Mw(t), i = vo({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), k(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : ww(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = sw(e);
		if (t === void 0 || n === null || !iw(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + Dw(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, ul(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		qC(e, !0) === null && this.hide(e, t);
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
				this.chosen = Tw(e), this.sync();
			}
			for (let e of this.shown.values()) ul(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = qC(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Oe, n.setAttribute("role", "toolbar"), T.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(He, ""), n.setAttribute(pe, ""), !Ow(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, jw(e)), il(e, n, {
			placement: Ew(e),
			gap: Dw(e),
			boundary: sw(e) ?? void 0
		}), n.classList.toggle(mw, ow(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: yw
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		}), vw.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : vC(r);
		if (!Ow(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = Mw(t.bar), o = a.find((e) => vC(e) === i) ?? a.find(xo) ?? null;
		o !== null && (k(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || Pw(t)) return;
		if (this.menuHost = e, Fw(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		kw(n.bar, !0);
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
		kw(t.bar, !1);
		let n = document.activeElement;
		!Os() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && Aw(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), dl(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(mw, ow(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : Mw(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function xw(e) {
	let t = e.closest(dw);
	if (t !== null) return t;
	let n = e.closest(`[${v}]`), r = e.closest(x);
	return n === null || r !== null && !r.contains(n) ? null : Cw(n)[0] ?? null;
}
function Sw(e) {
	if (e.matches(A)) for (let t of e.querySelectorAll(`[${ke}]`)) {
		if (t.closest(A) !== e) continue;
		let n = Cw(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(dw);
}
function Cw(e) {
	let t = [...e.querySelectorAll(dw)];
	return e.matches(dw) ? [e, ...t] : t;
}
function ww(e) {
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
		index: Cw(n).indexOf(e)
	};
}
function Tw(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return Cw(t)[e.index] ?? null;
	return null;
}
function Ew(e) {
	let t = e.getAttribute(Ce);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function Dw(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(gw));
	return Number.isFinite(t) ? t : hw;
}
function Ow(e, t, n, r) {
	let { entries: i, more: a } = dC(t);
	if (i.length === 0 && !a) return !1;
	let o = pC(e, {
		entries: i,
		more: a,
		role: "button",
		press: Nw,
		openMore: n
	});
	return k(o, o.find((e) => !E(e)) ?? o[0] ?? null), kw(e, r), !0;
}
function kw(e, t) {
	Aw(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function Aw(e) {
	return Mw(e).find((e) => vC(e) === null) ?? null;
}
function jw(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function Mw(e) {
	return [...e.querySelectorAll(`:scope > .${iC}`)];
}
function Nw(e, t) {
	if (E(t) || Pw(t)) return;
	let n = qC(t, !1);
	n === null || !n.contains(e) || E(e) || !fC(e, n) || e.click();
}
function Pw(e) {
	let t = e.closest(pw), n = t === null ? void 0 : vw.get(t);
	return n !== void 0 && ks() && Date.now() - n < _w;
}
function Fw(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function Iw(e) {
	return e.matches(gs) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Lw = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Rw = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
}, zw = `(min-width: ${Rw.md}px)`;
function Bw(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Rw[t]}px)`)) return t;
	return "base";
}
function Vw(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function H(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function Hw(e, t) {
	let n;
	for (let r of Lw) {
		let i = H(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/state/client-store.ts
var Uw = "ne.ui", Ww = "boot", Gw = /* @__PURE__ */ new Set(), Kw = class {
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
		let r = this.resolveKey(e, Ww);
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
			return Gw.has(n) || (Gw.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Uw}:${n}:${t}`;
	}
}, qw = "ui-menu--nested", Jw = "ui-menu__submenu", Yw = Mt, Xw = Pt, Zw = "data-ui-menu-flyout", Qw = `[${Zw}], .ui-context-menu, .${ur}`, $w = "data-ui-menu-unfolded", eT = Nt, tT = "menu-open-group", nT = Ve("click"), rT = class {
	root;
	store = new Kw();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new fu({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(Xw, ""), t.setAttribute(Zw, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(Xw), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(Zw);
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
		for (let e of this.root.querySelectorAll(`[${Yw}]`)) iT(e);
		F(this.root, `[${Yw}]`, {
			childList: !0,
			attributeFilter: [Xw]
		}, (e) => {
			for (let t of e) iT(t);
		}), typeof matchMedia == "function" && matchMedia(zw).addEventListener("change", () => this.closeBarFlyout());
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = cT(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), aT(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Yw}]`)) iT(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Gt}`), e);
		if (t !== null && !t.hasAttribute(eT)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(qw) ? null : this.store.read(e, tT), r = n === null ? null : this.findGroup(e, n);
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
		a !== null && (cT(a) || i.hasAttribute(eT) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(qw);
		if (e.setAttribute($w, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(Xw);
			return;
		}
		if (t.hasAttribute(Xw)) {
			t.removeAttribute(Xw), n || this.store.write(e, tT, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, tT, t.getAttribute(v));
	}
	openInline(e) {
		e.setAttribute(Xw, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Yw}][${Xw}]`)) t.hasAttribute(eT) || t.removeAttribute(Xw);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		aT(e), this.closeGroups(e);
		let a = n.closest(Qw) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${oT(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Ut}`);
		o !== null && !Os() && Ws(o, L(o, `.${b}:not(${qt})`, `.${Ut}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Yw}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Jt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Yw}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Jw}`);
	}
};
function iT(e) {
	let t = e.querySelector(`:scope > .${b}`), n = e.closest(`.${Ut}`);
	t !== null && (t.setAttribute(nT, ""), t.setAttribute(He, ""), t.setAttribute("aria-expanded", e.hasAttribute(Xw) ? "true" : "false"), e.hasAttribute(eT) || n !== null && cT(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function aT(e) {
	for (let t of e.querySelectorAll(`[${Zw}]`)) t.removeAttribute(Zw);
}
function oT(e) {
	return sT(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function sT(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(zw).matches;
}
function cT(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/rendering/inline-markup.ts
var lT = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, uT = "\\", dT = "`", fT = "!", pT = "{", mT = "}", hT = "ui-text__fold", gT = "ui-text__fold-toggle", _T = "ui-text__fold-content", vT = 8;
function yT(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return jT(new BT(e), 0, e.length, lT.None, null, t, n), MT(t, n, lT.None, null), t;
}
function bT(e) {
	return yT(e).map((e) => TT(e) ? `${e.fold} ${bT(e.text)}` : e.text).join("");
}
function xT(e) {
	let t = "";
	for (let n of e) t += UT(n) ? uT + n : n;
	return t;
}
function ST(e, t, n = {}) {
	let r = yT(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && CT(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(ET(r, n));
}
function CT(e) {
	return e.styles === lT.None && e.url === null && !wT(e) && !TT(e);
}
function wT(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function TT(e) {
	return e.fold !== null && e.fold !== void 0;
}
function ET(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(DT(r, t));
	return n;
}
function DT(e, t) {
	if (wT(e)) return kT(e.icon);
	let n = TT(e) ? OT(e, t) : document.createTextNode(e.text);
	if ((e.styles & lT.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & lT.Strikethrough) !== 0 && (n = AT("s", n)), (e.styles & lT.Underline) !== 0 && (n = AT("u", n)), (e.styles & lT.Italic) !== 0 && (n = AT("em", n)), (e.styles & lT.Bold) !== 0 && (n = AT("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Bd(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function OT(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${hT} ${hT}--static` : hT, r.className = gT, r.textContent = e.fold ?? "", i.className = _T, i.append(ET(yT(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(He, ""), n.append(r, i), n);
}
function kT(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", rf(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function AT(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function jT(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === uT && c + 1 < n && UT(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = NT(e, c, n);
		if (l !== null) {
			MT(a, o, r, i), PT(s, c + 1, l, o), MT(a, o, r | lT.Code, i), c = l + 1;
			continue;
		}
		let u = LT(e, c, n);
		if (u !== null) {
			MT(a, o, r, i), jT(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), MT(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = FT(e, c, n);
		if (d !== null) {
			MT(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? RT(e, c, n) : null;
		if (f !== null) {
			MT(a, o, r, i), jT(e, f.labelStart, f.labelEnd, r, f.url, a, o), MT(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = zT(e, c, n);
		if (p !== null) {
			MT(a, o, r, i), a.push({
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
function MT(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function NT(e, t, n) {
	let r = e.text;
	if (r[t] !== dT) return null;
	let i = t + 1;
	if (i >= n || WT(r[i])) return null;
	let a = e.findClosingMarker(i, n, dT, 1);
	return a > i ? a : null;
}
function PT(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === uT && i + 1 < n && UT(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function FT(e, t, n) {
	let r = e.text;
	if (r[t] !== fT || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return IT(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function IT(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function LT(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = lT.Bold, s = 2;
	else if (i === "*") o = lT.Italic, s = 1;
	else if (i === "_" && a) o = lT.Underline, s = 2;
	else if (i === "~" && a) o = lT.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || WT(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function RT(e, t, n) {
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
function zT(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== pT || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > vT) return null;
	let c = { value: "" };
	return PT(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var BT = class {
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
		return this.closeBrackets ??= this.next("]", !0), VT(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), VT(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), VT(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return VT(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = HT(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !WT(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Ld(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === uT && e[t - 1] === 0);
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
			if (this.text[r] === pT) n.push(r);
			else if (this.text[r] === mT && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || WT(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function VT(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function HT(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function UT(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === pT || e === mT || e === dT || e === uT;
}
function WT(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var GT = "ui-tooltip", KT = "ui-tooltip", qT = "ui-tooltip--visible", JT = "[aria-haspopup][aria-expanded=\"true\"]", YT = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", XT = "top", ZT = 250, QT = 200, $T = 300, eE = 7, tE = null, nE = null, rE = null, iE = null, aE = null, oE = 0, sE = null, cE = 0, lE = 0, uE = !1, dE = /* @__PURE__ */ new Set();
function fE(e) {
	dE.add(e);
}
function pE(e = document) {
	if (uE) return;
	uE = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", mE, !0), t.addEventListener("pointerout", _E, !0), t.addEventListener("focusin", yE, !0), t.addEventListener("focusout", bE, !0), t.addEventListener("keydown", xE, !0), t.addEventListener("scroll", gE, !0), t.addEventListener("pointerdown", SE, !0), t.addEventListener("click", CE, !0), window.addEventListener("blur", () => {
		iE = null, GE(!0);
	});
}
function mE(e) {
	if (hE(), TE(e.target)) {
		window.clearTimeout(cE);
		return;
	}
	let t = EE(e.target);
	t !== null && t !== nE && jE(t);
}
function hE() {
	nE === null || nE.isConnected || (iE = null, GE(!0));
}
function gE(e) {
	if (hE(), nE === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(nE) || ow(nE) && (iE = null, GE(!0));
}
function _E(e) {
	if (iE !== null || aE !== null) return;
	let t = e.relatedTarget, n = nE ?? sE?.target ?? null, r = n === null ? null : vE(n);
	t instanceof Node && (r !== null && r.contains(t) || TE(t)) || (TE(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && GE(!1);
}
function vE(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && DE(t) === e ? t : e;
}
function yE(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = EE(e.target);
	t !== null && (iE = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, ME(t));
}
function bE(e) {
	EE(e.target) === nE && (iE = null, GE(!0));
}
function xE(e) {
	e.key === "Escape" && nE !== null && (iE = null, GE(!0));
}
function SE(e) {
	if (TE(e.target)) return;
	let t = wE(e.target);
	if (t !== null) {
		if (aE === t) {
			GE(!0);
			return;
		}
		iE = null, GE(!0), ME(t), aE = nE;
		return;
	}
	iE === null && GE(!0);
}
function CE(e) {
	wE(e.target) !== null && e.preventDefault();
}
function wE(e) {
	let t = EE(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(YT);
	return n === null || n.contains(t) ? t : null;
}
function TE(e) {
	return tE !== null && e instanceof Node && tE.contains(e);
}
function EE(e) {
	if (!(e instanceof Element)) return null;
	let t = DE(e);
	for (let n of dE) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && AE(r).length > 0) return r;
	}
	return t;
}
function DE(e) {
	let t = e.closest(`[${Ae}], [${Me}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function OE(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + kE(e) : AE(e);
}
function kE(e) {
	let t = "";
	for (let n of dE) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function AE(e) {
	for (let t of dE) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function jE(e, t) {
	if (iE === null && aE === null) {
		if (window.clearTimeout(cE), sE !== null && sE.target === e) {
			sE.words = t;
			return;
		}
		if (window.clearTimeout(oE), sE = null, nE !== null) {
			GE(!0), ME(e, t);
			return;
		}
		if (Date.now() - lE < $T) {
			ME(e, t);
			return;
		}
		sE = {
			target: e,
			words: t
		}, oE = window.setTimeout(() => {
			let e = sE;
			sE = null, e !== null && ME(e.target, e.words);
		}, ZT);
	}
}
function ME(e, t) {
	let n = (t ?? OE(e)).trim();
	if (n.length === 0 || !e.isConnected || NE(e) || ow(e)) return;
	window.clearTimeout(oE), window.clearTimeout(cE), sE = null;
	let r = KE();
	ST(r, n, { staticFolds: !0 }), r.classList.add(qT), nE = e, FE(PE(e)), r.setAttribute("data-ui-tooltip-text", bT(n)), RE(r, e.getAttribute(Ne)), rl(e, r), il(e, r, {
		placement: WE(e),
		gap: eE,
		arrow: !0
	});
}
function NE(e) {
	return e.matches(JT) || e.querySelector(JT) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function PE(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function FE(e) {
	rE !== null && rE !== e && IE();
	let t = LE(e);
	t.includes(KT) || e.setAttribute("aria-describedby", [...t, KT].join(" ")), rE = e;
}
function IE() {
	if (rE === null) return;
	let e = LE(rE).filter((e) => e !== KT);
	e.length === 0 ? rE.removeAttribute("aria-describedby") : rE.setAttribute("aria-describedby", e.join(" ")), rE = null;
}
function LE(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function RE(e, t) {
	t === null ? e.removeAttribute(Ne) : e.setAttribute(Ne, t);
}
function zE(e, t, n) {
	n?.delay === !0 && nE !== e ? jE(e, t) : ME(e, t);
}
function BE() {
	GE(!0);
}
var VE = {
	show: zE,
	hide: BE
};
function HE(e) {
	iE = e, ME(e);
}
function UE(e) {
	if (nE === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			iE = null, GE(!0);
			return;
		}
		ME(e);
	}
}
function WE(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of dE) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(je);
	return t !== null && qc(t) ? t : XT;
}
function GE(e) {
	window.clearTimeout(oE), window.clearTimeout(cE), sE = null;
	let t = () => {
		nE !== null && (IE(), nE = null, aE = null, tE !== null && (tE.classList.remove(qT), dl(tE)), lE = Date.now());
	};
	e ? t() : cE = window.setTimeout(t, QT);
}
function KE() {
	return tE !== null && tE.isConnected ? tE : (tE = document.createElement("div"), tE.id = KT, tE.className = GT, tE.setAttribute("role", "tooltip"), tE.setAttribute("aria-hidden", "true"), document.body.append(tE), tE);
}
//#endregion
//#region src/interactions/menu-engine.ts
var qE = "ui-orientation--horizontal", JE = `.${Kt} > .ui-menu__host > .ui-menu__item > .${b}`, YE = `${JE}, ${`.ui-menu[${jt}] > .ui-menu__host > .ui-menu__item > .${b}`}`, XE = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", ZE = "[role='menuitem'], [role='menuitemcheckbox']", QE = class {
	root;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), fE($E), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(tD) && this.scheduleTabStops();
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
			t.length !== 0 && k(t, t.find((e) => e.classList.contains("ui-menu-item--selected") && xo(e)) ?? t.find(xo) ?? t[0]);
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
			eD(e, t);
			return;
		}
		let r = this.ownItems(n), i = vo({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(qE) || sT(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), k(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Ut}`);
		if (n === null) return;
		let r = this.ownItems(n), i = vo({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(qE) ? "horizontal" : "vertical"
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
		if (t === null || t === document.activeElement || !t.matches(ZE) || t.matches(qt) || !xo(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && js(t);
	}
	ownItems(e) {
		return L(e, `.${b}:not(${qt})`, `.${Ut}`);
	}
}, $E = {
	anchor: (e) => e.closest(YE),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(XE), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(JE) && t.scrollWidth <= t.clientWidth ? null : xT(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Ut}`);
		return t === null ? null : oT(t);
	}
};
function eD(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(qt) || !xo(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function tD(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var nD = "shortcut:", rD = ":scope > .ui-menu-item__shortcut", iD = `[${xe}]`, aD = `[${Xt}]`, oD = ".ui-text__title", sD = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), fE(_D), mD(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) pD(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Xt]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || lD(e))) return;
		let t = ql(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !jy(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !xo(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), fD(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= jy(t, e);
		let r = n ? uD() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = UC(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(aD)].filter((t) => {
			let n = Ay(t.getAttribute(Xt));
			return n !== null && jy(n, e) && !E(t) && fC(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), fD(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(aD)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Ay(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(iD) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(By(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Ay(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = By(e.shortcut);
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
function cD(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(nD) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function lD(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return ho(t) || t instanceof HTMLElement && t.isContentEditable;
}
function uD() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = ts(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? is(L(t.root, jo, A));
	return n === null ? t.root : dD(n);
}
function dD(e) {
	if (e.matches(WC)) return e;
	for (let t of e.querySelectorAll(WC)) if (t.closest(jo) === e) return t;
	return e;
}
function fD(e) {
	ho(e.target) && e.target.dispatchEvent(new Event(dm, { bubbles: !0 }));
}
function pD(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && hD(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && mD(t);
}
function mD(e) {
	e instanceof HTMLElement && e.matches(aD) && hD(e);
	for (let t of e.querySelectorAll(aD)) hD(t);
}
function hD(e) {
	let t = e.querySelector(rD);
	if (t === null) return;
	let n = gD(e) ?? "";
	t.textContent !== n && (t.textContent = n);
}
function gD(e) {
	let t = e.getAttribute(Xt), n = Ay(t);
	return n === null ? t?.trim() || null : My(n);
}
var _D = {
	anchor: (e) => {
		let t = e.closest(aD);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(iD) !== null ? null : t;
	},
	words: (e) => {
		let t = gD(e), n = (e.getAttribute("aria-label") ?? e.querySelector(oD)?.textContent ?? "").trim();
		return t === null ? null : xT(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = gD(e);
		return t === null ? null : xT(`(${t})`);
	}
}, vD = 50, yD = 1, bD = 7;
function xD(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = OD(e, "data-ui-window-size") ?? 0;
	return {
		offset: OD(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : vD,
		total: OD(e, Ct),
		moreAfter: e.getAttribute(Tt) === "true"
	};
}
function SD(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function CD(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function wD(e, t) {
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
			let n = Number(t), r = CD(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === SD(e) ? null : (n - 1) * e.size;
		}
	}
}
function TD(e, t) {
	if (t <= bD) return DD(1, t);
	let n = Math.max(Math.min(e - yD, t - 2 - 2), 3), r = Math.min(Math.max(e + yD, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...DD(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function ED(e, t) {
	let n = TD(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function DD(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function OD(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/interactions/pager-engine.ts
var kD = ".ui-pager", AD = "ui-pager__button", jD = "ui-pager__number", MD = "ui-pager__pages", ND = "ui-pager__gap", PD = "ui-pager__range", FD = "ui-pager__size", ID = "ui-pager__size--open", LD = "ui-pager__size-trigger", RD = "ui-pager__size-label", zD = "ui-pager__sizes", BD = "ui-pager__size-choice", VD = [
	AD,
	jD,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], HD = "ui.pager.page", UD = "ui.pager.range", WD = "ui.pager.rows", GD = "ui.pager.size", KD = [
	St,
	Ct,
	Tt,
	xt,
	bt
], qD = "page-size", JD = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new Kw();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new fu({
		show: ({ owner: e }) => e.classList.add(ID),
		hide: ({ owner: e }) => e.classList.remove(ID),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), F(this.root, `${kD}, [${y}]`, {
			childList: !0,
			attributeFilter: KD,
			relevant: (e) => e.type === "attributes" || iO(e.target) || aO(e)
		}, (e) => this.syncFound(e)), T.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(kD)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(kD)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(x), n = t === null ? 0 : w(t);
		return n > 0 ? [...this.root.querySelectorAll(`${kD}[${$e}="${Sr(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute($e));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = nO(e);
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
		let i = xD(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = f_(e), s = (e) => p_(e, "N0", o);
		this.drawNumbers(e, i, o), XD(e, i, s), ZD(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${AD}[${et}]`)) to.setDisabled(t, wD(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		$D(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${MD}`);
		if (r === null) return;
		let i = SD(t), a = CD(t), o = a === null ? ED(i, t.moreAfter) : TD(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => YD(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(kD);
		if (t === null || E(e.target)) return;
		let n = e.target.closest(`.${BD}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(tt)));
			return;
		}
		let r = e.target.closest(`.${LD}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${et}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = wD(xD(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), Eo(e).top > 0 && Do(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(kD);
		if (t === null) return;
		let n = e.target.closest(`.${FD}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${AD}, .${LD}`), i = QD(t);
		if (r === null || !i.includes(r)) return;
		let a = vo({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal",
			loop: !1
		});
		a !== null && (e.preventDefault(), k(i, a), a.focus());
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${LD}`) : null;
		if (n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) return e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0;
		if (!this.menus.isOpen(t) || !yo(e.key, "vertical")) return !1;
		let r = tO(t), i = e.target instanceof HTMLElement && r.includes(e.target) ? e.target : null, a = vo({
			key: e.key,
			items: r,
			current: i,
			axis: "vertical"
		});
		return a !== null && (e.preventDefault(), a.focus()), !0;
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${BD}`) : null;
		if (t === null || t === document.activeElement || E(t)) return;
		let n = t.closest(`.${FD}`);
		n !== null && this.menus.isOpen(n) && js(t);
	}
	toggleSizes(e) {
		let t = e.closest(`.${FD}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${zD}`);
		if (r === null) return;
		let i = tO(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Ws(r, i, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, qD), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!eO(e, i)) {
			this.store.write(t, qD, null);
			return;
		}
		let a = xD(n);
		i !== a.size && (n.setAttribute(xt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${FD}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = xD(r.host);
		t !== i.size && (this.store.write(r.component, qD, String(t)), r.host.setAttribute(xt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !(e.target instanceof Element)) return;
		let t = ts(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || E(t.root) || t.row !== null && nm(e.target, t.row) !== null) return;
		let n = nO(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = wD(xD(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = rO(e), i = is(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = rO(e);
		o.length > 0 && os(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function YD(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = ND, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = p_(e, "N0", n);
	return r.className = VD.join(" "), r.setAttribute("type", "button"), r.setAttribute(et, String(e)), r.textContent = i, T.write(r, "aria-label", HD, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function XD(e, t, n) {
	let r = e.querySelector(`:scope > .${PD}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? T.write(r, null, WD, {
		from: i,
		to: a
	}) : T.write(r, null, UD, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function ZD(e, t, n) {
	let r = e.querySelector(`:scope > .${FD}`), i = r?.querySelector(`.${RD}`) ?? null;
	if (r !== null && i !== null) {
		T.write(i, null, GD, { size: n(t.size) });
		for (let e of tO(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function QD(e) {
	return [...e.querySelectorAll(`.${AD}, .${LD}`)];
}
function $D(e) {
	let t = QD(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	k(t, n ?? r.find(xo) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function eO(e, t) {
	let n = e.querySelector(`:scope > .${FD}`);
	return n !== null && tO(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function tO(e) {
	return [...e.querySelectorAll(`:scope > .${zD} > .${BD}`)];
}
function nO(e) {
	for (let t of e.querySelectorAll(`[${y}][${pt}="windowed"]`)) if (t.closest(x) === e) return t;
	return null;
}
function rO(e) {
	return L(e, jo, A);
}
function iO(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function aO(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(kD) || t.querySelector(kD) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var oO = `.${Ut}[${Ft}]`, sO = ":scope > .ui-collapsible__bar", cO = ":scope > .ui-menu__host", lO = "ui-menu__item", uO = `:scope > .${b}`, dO = ".ui-text__title", fO = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", pO = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), F(t, oO, {
			childList: !0,
			characterData: !0,
			attributeFilter: [jt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = mO(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(cO);
		if (n === null) return;
		let r = Km(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: hO(n)
		}), e.setAttribute(It, ""), fh(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of gO(e)) {
			let e = _O(a);
			if (e === "header") {
				n !== null && yO(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			yO(a, o), r ||= o, i ||= o;
		}
		return n !== null && yO(n, r), i;
	}
	match(e, t) {
		let n = Jm(vO(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(fO) : null;
		if (r === null) return n;
		if (n) return bO(r), e.removeAttribute(Pt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Pt, i), i;
	}
	clear(e, t) {
		bO(t), e.removeAttribute(It), gO(t).length > 0 && fh(e, t, !1);
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
		let t = [...mO(e.target)?.querySelector(cO)?.querySelectorAll(`.ui-menu-item:not(${qt})`) ?? []].find(xo);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function mO(e) {
	let t = e.closest(oO), n = t?.querySelector(sO) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function hO(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Mt}][${Pt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function gO(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(lO));
}
function _O(e) {
	return e.querySelector(uO)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function vO(e) {
	return qm(e.querySelector(uO)?.querySelector(dO)?.textContent ?? "", e);
}
function yO(e, t) {
	e.toggleAttribute(Lt, !t);
}
function bO(e) {
	for (let t of e.querySelectorAll(`[${Lt}]`)) t.removeAttribute(Lt);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var xO = "[data-ui-root]", SO = "a[href]", CO = "ui-collapsible", wO = "right-side", TO = "ui-side--left", EO = "ui-side--right", DO = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(zw).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Rt}]`);
		if (t !== null) {
			let e = t.closest(xO), n = t.getAttribute(Rt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${Zt}]`);
		if (n !== null && !e.defaultPrevented && OO(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(SO)?.closest(`[${Vt}]`), i = r?.parentElement ?? null;
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
		let n = kO(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, Os(), performance.now() + P.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(dr, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Vs(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${xO}[${zt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(zt);
		if (e.removeAttribute(zt), this.markToggles(e), t === null) return;
		let n = kO(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = e.querySelector(`[${Rt}="${Sr(t)}"]`);
			i !== null && n !== null && n.contains(r) ? Ys(i, n) : i !== null && N(i);
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
function OO(e) {
	let t = e.closest(`.${CO}`), n = t?.closest(`[${Vt}]`), r = n?.getAttribute(Vt), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(xO) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === wO ? EO : TO);
}
function kO(e, t) {
	return e.querySelector(`:scope > [${Vt}="${Sr(t)}"]`);
}
//#endregion
//#region src/interactions/skip-link-engine.ts
var AO = "[data-ui-root]", jO = "content", MO = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-ui-skip-link]")?.closest(AO)?.querySelector(`:scope > [data-ui-region="${jO}"]`) ?? null;
		t !== null && (e.preventDefault(), NO(t));
	}
};
function NO(e) {
	e.hasAttribute("tabindex") || (e.setAttribute("tabindex", "-1"), e.addEventListener("blur", () => e.removeAttribute("tabindex"), { once: !0 })), e.focus();
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var PO = "ui-collapsible", FO = "ui-collapsible__content", IO = "ui-collapsible__bar", LO = "collapsed", RO = class {
	root;
	store = new Kw();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${PO}`)), F(this.root, `.${PO}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, LO);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Zt}]`), n = t?.closest(`.${PO}`) ?? null;
		if (t === null || n === null || OO(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(jt), i = n.querySelector(`:scope > .${FO}`);
		this.cancelFold(n);
		let a = BO(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, LO, r ? "true" : "false", r ? { attributes: { [jt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(jt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Zt}], :scope > .${IO} > [${Zt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Wc()) return;
		let i = HO(zO(e), n, BO(e, t), r);
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
function zO(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function BO(e, t) {
	let n = zO(e), r = VO(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function VO(e) {
	return e === "width" ? "height" : "width";
}
function HO(e, t, n, r) {
	let i = VO(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function UO(e) {
	let t = [];
	for (let n of KO(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = UO(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = WO(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function WO(e) {
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
	if (n !== null) return GO({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return GO(r[3] === "fr" ? {
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
function GO(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function KO(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function qO(e, t = "auto") {
	return e.map((e) => JO(e, t)).join(" ");
}
function JO(e, t) {
	switch (e.kind) {
		case "px": return `${YO(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${YO(e.min)}px`}, ${YO(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${YO(e.max)}px)` : `minmax(${YO(e.min)}px, auto)`;
	}
}
function YO(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function XO(e) {
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
function ZO(e, t) {
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
function QO(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = $O(r, e), o = $O(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function $O(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function ek(e, t, n, r) {
	let i = rk(e, t, n.before), a = rk(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = nk(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = ck(n.before, e) + ck(n.after, e), r = i.total + a.total;
		ik(l, e, i, t * (i.total + c) / r), ik(l, e, a, t * (a.total - c) / r);
	} else u || ak(l, i, i.total + c), d || ak(l, a, a.total - c);
	return l;
}
var tk = 120;
function nk(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < tk ? o = t < 0 ? -n : tk - n : c > 0 && c < tk && (o = t > 0 ? r : r - tk), Math.min(Math.max(o, i), a);
}
function rk(e, t, n) {
	let r = sk(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function ik(e, t, n, r) {
	let i = ck(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function ak(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...ok(e[i])
		};
	}
}
function ok(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function sk(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function ck(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function lk(e, t) {
	let n = sk(t.before, e), r = n + sk(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function uk(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function dk(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function fk(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var pk = "ui-grid-splitter", mk = "ui-container", hk = "ui-orientation--vertical", gk = 16, _k = {
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
}, vk = {
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
}, yk = class {
	root;
	store = new Kw();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Tf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${pk}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${pk}`)), F(this.root, `.${pk}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${pk}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = xk(t);
			e !== null && (this.restore(e, Sk(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Lw) {
			let i = r[n], a = Vw(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${pk}`);
		if (t === null || this.drag.active || E(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Dk(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${pk}`), n = t === null ? null : xk(t);
		if (t === null || n === null) return;
		let r = Sk(t);
		for (let e of Lw) n.style.removeProperty(Vw(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = ek(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Vw(e.axis.split, e.tier), qO(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Lw) {
			let a = Vw(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = xk(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Sk(e), r = Bw(), i = Ck(t, n, r), a = i === null ? null : UO(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = ZO(a, XO(t.getAttribute(n.limits))), s = wk(t, n), c = Tk(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = QO(c, Ek(t, n).map((e) => Tk(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = xk(e);
		if (t === null) return;
		let n = Sk(e), r = Tk(e, n), i = wk(t, n), a = Ek(t, n).map((e) => Tk(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : QO(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(lk(i, o))), bk(t, n, i));
	}
};
function bk(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(pk)) continue;
		let e = getComputedStyle(r), i = fk(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Kn, i);
	}
}
function xk(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(mk) ? t : null;
}
function Sk(e) {
	return e.classList.contains(hk) ? _k : vk;
}
function Ck(e, t, n) {
	for (let r = Lw.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(Vw(t.split, Lw[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function wk(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Tk(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Ek(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(pk) && Sk(r) === t && n.push(r);
	return n;
}
function Dk(e) {
	let t = Number(e.getAttribute(tn));
	return Number.isFinite(t) && t > 0 ? t : gk;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Ok = "ui-split-button", kk = "ui-split-button__main", Ak = "ui-split-button__toggle", jk = "ui-split-button__menu", Mk = "ui-split-button--open", Nk = class {
	root;
	menus = new fu({
		show: ({ owner: e }) => e.classList.add(Mk),
		hide: ({ owner: e }) => e.classList.remove(Mk),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = Pk(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${kk}`)?.closest(`.${Ok}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Pk(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = Fk(t), r = e.target.closest(`.${b}`);
		n === null || r === null || !n.contains(r) || r.matches(`${qt}, ${Yt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = Fk(e), r = n?.querySelector(".ui-menu") ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: Ik(e)
		}) && Ws(r, L(r, `.${b}:not(${qt})`, `.${Ut}`), t);
	}
};
function Pk(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Ak}, .${kk}`), n = t?.closest(`.${Ok}`) ?? null;
	return t === null || n === null || t.classList.contains(kk) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Fk(e) {
	return e.querySelector(`:scope > .${jk}`);
}
function Ik(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Lk = "ui-button-group", Rk = "ui-button-group__item", zk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Lk}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), F(this.root, `.${Lk}`, {
			childList: !0,
			attributeFilter: [Xn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Bk(i);
			i.toggleAttribute(Yn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		k(n, r ?? n.find(xo) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rk}`), n = t?.closest(`.${Lk}`) ?? null;
		if (t === null || n === null || t.closest(`.${Lk}`) !== n || E(n)) return;
		let r = Bk(t);
		r !== null && E(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rk} > .${hr}`), n = t?.closest(`.${Lk}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Bk).filter((e) => e !== null), i = vo({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Rk}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		ko(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Xn,
			bindingAttribute: Qn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return L(e, `.${Rk}`, `.${Lk}`);
	}
};
function Bk(e) {
	return e.querySelector(`:scope > .${hr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Vk = "ui-accordion", Hk = "details", Uk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Vk}`)), F(this.root, `.${Vk}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Vk))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${Hk}`)];
	}
}, Wk = "ui-tab-overflow", Gk = "ui-tab-overflow__menu", Kk = "ui-tab-overflow__menu--open", qk = "ui-tab-overflow__entry", Jk = "ui-tab-overflow__entry--current", Yk = class {
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
		this.options = e, this.list = new Qk(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : Xk({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return Zk(e, this.options.hiddenClass, t);
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
function Xk(e) {
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
function Zk(e, t, n) {
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
var Qk = class {
	menu;
	button = null;
	list = new fu({
		show: ({ popup: e }) => e.classList.add(Kk),
		hide: ({ popup: e }) => {
			e.classList.remove(Kk), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Gk, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map($k)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${Jk}`);
		r !== null && k(this.entries(), r), this.button = e, rl(e, this.menu), this.list.open({
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			focus: r ?? !1,
			returnFocus: () => e
		}) ? r === null && Ws(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qk}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || E(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = vo({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), k(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${qk}`) : null;
		t === null || t === document.activeElement || E(t) || (k(this.entries(), t), js(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${qk}`));
	}
};
function $k(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${qk} ${gr}`, t.classList.toggle(Jk, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(v, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(ar), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var eA = "data-ui-caption-text", tA = ".ui-text__title";
function nA(e) {
	for (let t of e.querySelectorAll(tA)) {
		let e = t.textContent ?? "";
		t.getAttribute(eA) !== e && t.setAttribute(eA, e);
	}
}
function rA(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Wc()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: P.normal,
		easing: P.ease,
		pseudoElement: "::after"
	});
}
function iA(e) {
	e === null || typeof e.animate != "function" || Wc() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: P.fast,
		easing: P.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var aA = "ui-tabs", oA = "ui-tab-header", sA = "ui-tab-header--selected", cA = "ui-tab-header--overflowed", lA = "ui-tabs--overflowing", uA = "ui-tabs--no-overflow", dA = "ui-tabs__strip", fA = "data-ui-tab-key", pA = "data-ui-tab-page", mA = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Yk({
			rootClass: aA,
			overflowingClass: lA,
			wraps: (e) => e.classList.contains(uA),
			hiddenClass: cA,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${aA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), F(this.root, `.${aA}`, {
			childList: !0,
			attributeFilter: [$n, ...nr],
			relevant: (e) => !Bl(e, `[${pA}]`, `.${aA}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(fA) ?? "") === t) ?? null;
		if (r !== null && !hA(r)) {
			let t = n.find(hA);
			if (t !== void 0) {
				this.select(e, t.getAttribute(fA) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(sA)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(fA) ?? "") === t;
			e.classList.toggle(sA, n), e.setAttribute("aria-selected", n ? "true" : "false"), nA(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(hA), a), rA(i, a), k(n.filter((e) => !e.classList.contains(cA)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(pA) ?? "") !== t, !n.hidden && i !== null && i !== a && iA(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${dA}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(fA) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(hA).map((e) => {
				let n = e.getAttribute(fA) ?? "";
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
		let t = e.target.closest(`.${Wk}`), n = t?.closest(`.${aA}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${aA}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${oA}`);
		if (r === null || E(r)) return;
		let i = r.closest(`.${aA}`), a = r.getAttribute(fA);
		i !== null && a !== null && r.closest(`.${aA}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oA}`), n = t?.closest(`.${aA}`) ?? null;
		if (t === null || n === null) return;
		let r = vo({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(fA) ?? ""), r.focus());
	}
	select(e, t) {
		ko(e, t, {
			attribute: $n,
			bindingAttribute: Qn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return L(e, `.${oA}`, `.${aA}`);
	}
	ownPages(e) {
		return L(e, `[${pA}]`, `.${aA}`);
	}
};
function hA(e) {
	return e.classList.contains(cA) || aw(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var gA = "ui-command-bar", _A = "ui-command-bar__host", vA = "ui-command-bar__item", yA = "ui-command-bar__overflow", bA = "ui-command-bar--overflowing", xA = "ui-command-bar__overflowed", SA = "ui-text__title", CA = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Yk({
			rootClass: gA,
			overflowingClass: bA,
			wraps: (e) => !TA(e),
			hiddenClass: xA,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${gA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), F(this.root, `.${gA}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = wA(e), n = e.querySelector(`:scope > .${yA}`);
		if (t === null || n === null) return;
		let r = EA(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(bA) && DA(r);
		for (let e of r) tl(e, e.classList.contains(xA) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yA}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(gA) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = wA(e), n = t === null ? [] : EA(t).filter((e) => e.classList.contains(vA) && e.classList.contains(xA)).map((e) => e.querySelector(x) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: OA(e),
			current: !1,
			disabled: E(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !E(n) && kA(n).click();
	}
};
function wA(e) {
	return e.querySelector(`:scope > .${_A}`);
}
function TA(e) {
	let t = wA(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function EA(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(vA) ? n.querySelector(x) : null;
		e !== null && aw(e) && t.push(n);
	}
	return t;
}
function DA(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(vA) ? t ||= !r.classList.contains(xA) : t || r.classList.add(xA);
	}
}
function OA(e) {
	let t = kA(e), n = t.querySelector(`.${SA}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function kA(e) {
	return e.matches(gs) ? e : e.querySelector(gs) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var AA = "ui-breadcrumbs", jA = "ui-breadcrumbs__item", MA = "ui-breadcrumb", NA = "ui-breadcrumb--current", PA = "ui-hidden", FA = "data-ui-step-collapsed", IA = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), F(this.root, `.${AA}`, {
			childList: !0,
			attributeFilter: ["class", ...nr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${AA}`)) this.apply(e);
	}
	apply(e) {
		let t = L(e, `.${jA}`, `.${AA}`);
		for (let e of t) LA(e);
		let n = t.filter((e) => !e.classList.contains(PA)).map((e) => e.querySelector(`.${MA}`)).filter((e) => e !== null && !e.classList.contains(PA)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(NA, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function LA(e) {
	let t = e.querySelector(`:scope > .${MA}`), n = t === null ? "" : nr.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === nr[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(FA) : e.getAttribute(FA) !== n && e.setAttribute(FA, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function U(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function RA(e) {
	return U(e).toString(16).padStart(2, "0").toUpperCase();
}
function zA(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return BA(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function BA(e, t, n) {
	return .2126 * VA(e) + .7152 * VA(t) + .0722 * VA(n);
}
function VA(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var HA = "ui-color-input", UA = "ui-color-input--open", WA = "ui-color-input__popup", GA = "ui-color-input__text", KA = "ui-color-input__row", qA = "ui-color-input__swatch--button", JA = "ui-color-input__value-input", YA = "ui-color-input__square-thumb", XA = "ui-color-input__hue-thumb", ZA = "data-ui-color-toggle", QA = "data-ui-color-tab", $A = "data-ui-color-tab-selected", ej = "data-ui-color-pane", tj = "data-ui-color-pane-selected", nj = "data-ui-color-square", rj = "data-ui-color-hue", ij = "data-ui-color-hex", aj = "data-ui-color-channel", oj = "data-ui-color-factor", sj = "data-ui-color-opacity", cj = "data-ui-color-name", lj = "data-ui-color-name-selected", uj = "data-ui-color-format", dj = "data-ui-color-variant", fj = "data-ui-color-no-picker", pj = "data-ui-color-no-palette", mj = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new fu({
		show: ({ owner: e }) => e.classList.add(UA),
		hide: ({ owner: e }) => e.classList.remove(UA)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${HA}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = C(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${HA}`) ?? []);
		}), F(this.root, `.${HA}`, {
			childList: !0,
			attributeFilter: [
				uj,
				dj,
				fj,
				pj
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Tf({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${nj}], [${rj}]`),
			begin: (e, t) => {
				let n = e.closest(`.${HA}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(nj) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${JA}`)?.value ?? null
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
		let t = yj(e), n = this.states.get(e), r = n?.paneChosen === !0 ? hj(e, n.pane) : gj(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? _j(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Dj(t);
			if (i === null) return n ?? _j(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && vj(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Aj(a, o, s);
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
			...n ?? _j(r),
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
			let [e, a, o] = Aj(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Cj(e, "--ui-color-input-color", t.held ? kj(n, r, i, t.opacity) : "transparent"), Cj(e, "--ui-color-input-solid", kj(n, r, i, 255)), Cj(e, "--ui-color-input-on-color", t.held ? zA(n, r, i, t.opacity) : "inherit"), Sj(e, t.held ? xj(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${nj}]`), o = e.querySelector(`[${rj}]`), [s, c, l] = jj(t.hue, 1, 1);
		if (Cj(e, "--ui-color-input-hue", kj(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${YA}`);
			e !== null && (Cj(e, "left", `${t.saturation * 100}%`), Cj(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${XA}`);
			e !== null && Cj(e, "top", `${t.hue / 360 * 100}%`);
		}
		wj(e, `[${ij}]`, Oj(n, r, i)), wj(e, `[${aj}="r"]`, String(n)), wj(e, `[${aj}="g"]`, String(r)), wj(e, `[${aj}="b"]`, String(i)), Cj(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), Tj(e, `[${sj}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${cj}]`)) n.getAttribute(cj) === t.name ? n.setAttribute(lj, "") : n.removeAttribute(lj);
		let n = t.name === null ? null : e.querySelector(`[${cj}="${t.name}"]`), r = n === null ? null : Dj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Cj(e, "--ui-color-input-base", r === null ? "transparent" : kj(r[0], r[1], r[2], 255)), Tj(e, `[${oj}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${ej}]`)) n.getAttribute(ej) === t.pane ? n.setAttribute(tj, "") : n.removeAttribute(tj);
		for (let n of e.querySelectorAll(`[${QA}]`)) n.getAttribute(QA) === t.pane ? n.setAttribute($A, "") : n.removeAttribute($A);
	}
	resolveRgb(e, t) {
		if (t.name === null) return jj(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${cj}="${t.name}"]`), r = n === null ? null : Dj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? jj(t.hue, t.saturation, t.value) : Ej([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ZA}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${HA}`));
			return;
		}
		let n = e.target.closest(`[${QA}]`), r = e.target.closest(`.${HA}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(QA), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${cj}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(cj)
			}));
			return;
		}
		let a = r.querySelector(`.${WA}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${HA}`);
		if (t !== null) {
			if (e.target.hasAttribute(oj)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(sj) && this.commit(t, (t) => ({
				...t,
				opacity: U(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${HA}`);
		if (n === null) return;
		if (t.hasAttribute(oj) || t.hasAttribute(sj)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(ij)) {
			let e = Dj(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Aj(e[0], e[1], e[2]);
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
		let r = t.getAttribute(aj);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = U(Number(t.value));
		let [l, u, d] = Aj(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${JA}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = Mj((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = Mj((t.x - a.left) / a.width), s = 1 - Mj((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${JA}`);
		a !== null && (a.value = bj(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		O(e) || e.querySelector(`.${JA}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(fj) && e.hasAttribute(pj)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${WA}`), n = e.querySelector(`[${ZA}]`);
		if (t === null) return;
		let r = e.getAttribute(dj) === "swatch" ? e.querySelector(`.${qA}`) : e.querySelector(`.${KA}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${$A}]`) ?? !0
		});
	}
};
function hj(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? fj : pj))(t) ? t : t === "picker" ? "palette" : "picker";
}
function gj(e) {
	return hj(e, "picker");
}
function _j(e) {
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
function vj(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function yj(e) {
	return e.querySelector(`.${JA}`)?.value.trim() ?? "";
}
function bj(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Oj(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${RA(e.opacity)}`;
}
function xj(e, t, n, r, i) {
	if (e.getAttribute(uj) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Oj(t, n, r);
	return i === 255 ? a : `${a}${RA(i)}`;
}
function Sj(e, t) {
	for (let n of e.querySelectorAll(`.${GA}`)) n.textContent !== t && (n.textContent = t);
}
function Cj(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function wj(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function Tj(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function Ej(e, t) {
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
function Dj(e) {
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
function Oj(e, t, n) {
	return `#${RA(e)}${RA(t)}${RA(n)}`;
}
function kj(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Aj(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function jj(e, t, n) {
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
function Mj(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function Nj(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var Pj = "ui-table", Fj = "ui-table--reorderable", Ij = "ui-scroll-x--auto", Lj = "ui-scroll-x--always", Rj = `:scope > .${cn}`, zj = `.${un}`, Bj = "ui-table__header-cell", Vj = `${Bj}--pinned`, Hj = `${Rj} > .${ln} > .${Bj}`, Uj = `${Hj}--pinned`, Wj = "ui-table__host", Gj = `${Rj} > .${Wj}`, Kj = `.${Pj}, .${sn}, [${nn}]`, qj = "--ui-table-columns", Jj = "--ui-table-sticky-top", Yj = "--ui-table-sticky-bottom", Xj = "--ui-table-sized-columns", Zj = "--ui-table-pin-", Qj = "--ui-table-order-", $j = 64, eM = "data-ui-table-cell-hidden", tM = "data-ui-table-cell-last", nM = "columns", rM = "hidden", iM = "order", aM = "layout", oM = 32, sM = 16, cM = class {
	root;
	store = new Kw();
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
		if (this.root = e.root ?? document, this.drag = new Tf({
			root: this.root,
			resolveHandle: (e) => e.closest(zj),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new Tf({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Lw) e !== "base" && matchMedia(`(min-width: ${Rw[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${Pj}`)), F(this.root, `.${Pj}`, {
			childList: !0,
			relevant: pM
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), F(this.root, `.${Pj}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(Pj)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), F(this.root, `.${Pj}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: mM
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(Gj);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), Nj(t, () => this.pin(t));
			let e = t.querySelector(Rj);
			e !== null && Nj(e, () => lM(t, e));
			let n = t.querySelector(Gj);
			n !== null && (this.markScrollbar(t, n), Nj(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, nM), r = n === null ? null : UO(n);
		r !== null && r.length !== t.length ? (this.store.write(e, nM, null), this.store.writeBoot(e, aM, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, iM);
		if (i !== null && !gM(i, t)) {
			this.store.write(e, iM, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(xn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${Pj}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = hM(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(Ij) || e.classList.contains(Lj);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(Xj);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = dk(t, n);
				e.style.setProperty(Xj, qO(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Qj}${t}`, String(r[t])) : e.style.removeProperty(`${Qj}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(on) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(on, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(gn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(gn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(Fj)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= $j) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${nn}]`)) {
				let r = Number(t.getAttribute(nn));
				!(r >= $j) || t.closest(`.${Pj}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(eM, n.hidden.has(r)), t.toggleAttribute(tM, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(Hj)) {
			let e = Number(n.getAttribute(nn)), r = n.getAttribute(rn), i = n.classList.contains(Vj) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: bM(r) ? r : null,
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
		for (let e of t) (n[e.key] ?? yM(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, rM) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(qj).trim(), n = t.length === 0 ? null : UO(t);
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
		n === null || i !== void 0 && n === yM(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, rM, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return hM(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(Uj).length;
		if (t < 2) return;
		let n = uk(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${Zj}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${Pj}`)?.toggleAttribute(bn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(Rj), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return dM(e) ? n.slice(1) : n;
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
		let t = e.target.closest(zj) ?? (e.shiftKey ? uM(e.target) : null);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = sM;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${Pj}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(nn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(zj)?.closest(`.${Pj}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = ek(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(oM, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, fM(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, nM, t === null ? null : qO(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(Xj).trim(), n = e.getAttribute(on), r = {};
		t.length > 0 && (r[Xj] = t);
		for (let t of e.style) t.startsWith(Qj) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, aM, null);
			return;
		}
		this.store.writeBoot(e, aM, {
			styles: r,
			attributes: {
				[on]: n,
				[gn]: e.getAttribute(gn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${Pj}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = XO(t.getAttribute($t)), i = ZO(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(nn)), u = this.hiddenOf(t, o), d = hM(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${Bj}`), n = t?.closest(`.${Pj}`) ?? null;
		return t === null || n === null || !n.classList.contains(Fj) || e.closest(zj) !== null || t.classList.contains(Vj) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${Pj}`), r = Number(e.getAttribute(nn));
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
		for (let a of hM(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > _M(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), vM(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(yn, "after") : a.cell.setAttribute(yn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(vn), t.table.removeAttribute(_n), vM(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = hM(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, iM, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function lM(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${Wj}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(Jj, `${n}px`), e.style.setProperty(Yj, `${r}px`);
}
function uM(e) {
	let t = e.matches(`.${Bj}`) ? e.querySelector(`:scope > ${zj}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function dM(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function fM(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function pM(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(Kj) || t.querySelector(Kj) !== null)) return !0;
	return !1;
}
function mM(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(Wj);
}
function hM(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function gM(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function _M(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function vM(e) {
	for (let t of e.querySelectorAll(`[${yn}]`)) t.removeAttribute(yn);
}
function yM(e) {
	return e.startsHidden || e.hideBelow !== null && Lw.indexOf(Bw()) < Lw.indexOf(e.hideBelow);
}
function bM(e) {
	return e !== null && Lw.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var xM = /* @__PURE__ */ new WeakMap();
function SM(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Et);
	for (let i of z(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = CM(i, a) ?? wM(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${ot}]`)) n.has(t) || t.remove();
}
function CM(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : xM.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function wM(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (EM(i, t.getAttribute(v)), xM.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function TM(e) {
	return e.find((e) => !e.classList.contains(cr));
}
function EM(e, t) {
	e.setAttribute(ot, ""), t === null ? e.removeAttribute(st) : e.setAttribute(st, t);
}
var DM = "bottom", OM = "pending";
function kM(e, t, n) {
	let r = e.querySelector(`:scope > [${vt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(vt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function AM(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var jM = /* @__PURE__ */ new WeakMap();
function MM(e) {
	for (let t of e.querySelectorAll(`[${ot}]`)) t.remove();
}
function NM(e, t, n, r, i, a) {
	let o = Xv(e, z(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Vv(i.getItemsFilterSortMetadata(t), a, Lv(e));
	if (c && !l && MM(e), o.length === 0) {
		jM.set(e, []);
		return;
	}
	let d = _v(e);
	if (!l) {
		AM(e, [...Hv(o, u, r), ...gv(d)]);
		return;
	}
	MM(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (jM.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	jM.set(e, p);
	let m = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = Hv(t, u, r));
		let n = e === "" ? void 0 : TM(t);
		if (n !== void 0) {
			let e = PM(s, r, n);
			e !== null && m.push(e);
		}
		m.push(...t);
	}
	AM(e, [...m, ...gv(d)]);
}
function PM(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && EM(r, n.getAttribute(v)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var FM = "ui-tree-rules", IM = `:scope > .${fn}:not(.${hn})`;
function LM(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(FM, { bubbles: !0 })), vv(e, t, n.templates, n.renderer, e.querySelector(IM) !== null);
		return;
	}
	switch (Q_(e)) {
		case "windowed":
			vv(e, t, n.templates, n.renderer), RM(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Rv(e, t, n.metadata, n.renderer, n.state), vv(e, t, n.templates, n.renderer), NM(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function RM(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && SM(e, (e) => PM(r, n.renderer, e));
}
//#endregion
//#region src/interactions/table-header-group.ts
var zM = ".ui-table", BM = `:scope > .${cn} > .${ln} > [role='columnheader']`, VM = `:scope > .${un}`, HM = "input:not([type='hidden']), button, select, textarea, a[href]", UM = /* @__PURE__ */ new WeakMap();
function WM(e) {
	for (let t of e.querySelectorAll(BM)) {
		let e = GM(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function GM(e) {
	let t = e.querySelector(HM);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(VM);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function KM(e) {
	let t = qM(e), n = UM.get(e), r = n !== void 0 && t.includes(n) ? n : t[0];
	return r !== void 0 && (JM(e, r), !0);
}
function qM(e) {
	let t = [];
	for (let n of e.querySelectorAll(BM)) {
		let e = GM(n);
		e !== null && xo(e) && t.push({
			stop: e,
			left: n.getBoundingClientRect().left
		});
	}
	return t.sort((e, t) => e.left - t.left).map((e) => e.stop);
}
function JM(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), UM.set(e, t), t.focus();
}
function YM(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(zM) && GM(t) === e ? n : null;
}
function XM(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(), !0;
		case "ArrowUp": return !0;
	}
	if (!yo(e.key, "horizontal")) return !1;
	let r = vo({
		key: e.key,
		items: qM(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && JM(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var ZM = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), QM = ".ui-table", $M = `:scope > [${y}], :scope > .${cn}, :scope > .${cn} > [${y}]`, eN = class {
	root;
	pressedBoxes = [];
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(A)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), F(this.root, A, {
			childList: !0,
			attributeFilter: [
				Jn,
				Xn,
				Zn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.ownItems(e);
		Vo(e, t);
		for (let t of e.querySelectorAll($M)) tN(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(QM) && WM(e);
			for (let e of t) {
				let t = Qp(e);
				t !== null && tN(t);
				for (let t of $p(e)) tN(t);
			}
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, A);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (e.detail > 0 && As(n, !0), os(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Io(n, r);
			return;
		}
		Uo(n, i, r, Lo(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(jo), r = n?.closest(A) ?? null;
		return n === null || r === null || n.closest(A) !== r || !r.matches(t) || E(r) ? null : nm(e.target, n) === null && !D(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Mo);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), ms(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = YM(e.target);
		if (t !== null && !E(t)) {
			XM(e, t, () => this.enterRows(t)) && e.preventDefault();
			return;
		}
		let n = ts(e.target);
		if (n === null || n.row !== null && nm(e.target, n.row) !== null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || E(r)) return;
		let i = iN(r);
		if (!ZM.has(e.key) && !ss(e.key, i)) return;
		let a = this.ownItems(r), o = rs(a), s = ls(e.key, a, is(a), i);
		if (s !== null) {
			e.preventDefault(), os(r, a, s), (r.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Fo(r, o), Uo(r, a, s, Ro(r, e)));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(QM) && KM(r)) {
			e.preventDefault();
			return;
		}
		if (o === null || D(o)) return;
		let c = Qp(o);
		switch (e.key) {
			case " ":
				Uo(r, a, o, {
					shift: !1,
					ctrl: !0
				}) || rN(o, c);
				break;
			case "Enter":
				nN(r, a, o, c);
				break;
			case "Delete": {
				let e = aN(a, o);
				if (e.length === 0) return;
				for (let t of e) ms(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	enterRows(e) {
		let t = this.ownItems(e), n = is(t) ?? ls("ArrowDown", t, null, "vertical");
		e.focus({ preventScroll: !0 }), n !== null && (os(e, t, n), e.getAttribute("data-ui-selection") === "one" && Uo(e, t, n, No));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(A) ?? null;
		t !== null && n !== null && [...n.querySelectorAll($M)].includes(t) && n.focus({ preventScroll: !0 });
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(A) ?? null;
		if (t !== null && n !== null) for (let e of n.querySelectorAll($M)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) tN(e);
		this.pressedBoxes = [];
	}
	ownItems(e) {
		return L(e, jo, A);
	}
};
function tN(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function nN(e, t, n, r) {
	zo(e) && !Ho(t).includes(n) && Uo(e, t, n, No), rN(n, r), r === null && ms(n, "open");
}
function rN(e, t) {
	t === null ? ms(e, ps) : t.click();
}
function iN(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function aN(e, t) {
	let n = Ho(e);
	return (n.includes(t) ? n : [t]).filter((e) => !Za(e, "data-ui-unremovable") && !D(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var oN = "ui-tree__row--folded", sN = "fold-hidden", cN = "fold-shown", lN = "ui-tree__row--dragging", uN = "ui-tree__loading", dN = "ui-tree__loading-ring", fN = "ui-tree-node__text", pN = "ui-tree-node__toggle", mN = "ui-tree-node__rename", hN = ".ui-text__title", gN = mn, _N = "--ui-tree-depth", vN = "expanded", yN = 600, bN = .25, xN = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, SN = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), CN = class {
	root;
	store = new Kw();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(FM, (e) => {
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
			relevant: EN
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Jy(e)?.getAttribute(Cn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = M(e), r = Jy(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(wn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(_N, String(u)), e.setAttribute("aria-level", String(u + 1)), as(e, r?.querySelector(`:scope > .${fN}`) ?? null), e.classList.toggle(oN, !d), e.classList.toggle(hn, _), e.removeAttribute(An), e.draggable = i && lv(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(On), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(On, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(On), d && g && !_), s.set(n, {
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
		return Jy(e.row)?.hasAttribute(En) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${fn}[${v}="${Sr(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, sN, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, cN, i.length === 0 ? null : this.bootPatch(i, "shown")));
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
			let t = Jy(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
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
		for (let e of c.querySelectorAll(`:scope > .${uN}`)) e.remove();
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
				let e = Jy(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(uN) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? DN();
		o.style.setProperty(_N, String(t)), o.classList.toggle(oN, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${pN}`) === null && (!Za(r, "data-ui-unselectable") || nm(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || nm(t.target, t.row) !== null) return;
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
		let t = ts(e.target);
		if (t === null || t.row !== null && nm(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || E(n)) return;
		let r = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey ? xN[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!SN.has(e.key) && !yo(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = rs(i), o = ls(e.key, i, is(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, Ro(n, e));
			return;
		}
		if (!(a === null || D(a))) {
			switch (e.key) {
				case " ":
					Uo(n, i, a, {
						shift: !1,
						ctrl: !0
					}) || rN(a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, ls("ArrowDown", i, a, "vertical"), No);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), No);
					break;
				case "Enter":
					nN(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = aN(i, a);
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
		let n = this.rowsOf(e), r = rs(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = eb(kN(n), M(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => M(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Za(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = ON(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(jn) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (D(t)) {
			e.preventDefault();
			return;
		}
		let a = cv(t, this.rowsOf(n)), o = sv(n, i, a);
		r ? ev(e, n, t, lN, M(t), a.filter((e) => e !== t), dv(o, !0)) : nv(e, M(t), dv(o, !1)), fv(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(lN));
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
		let i = this.parentKeysOf(e), a = M(t), o = (e) => n.some((t) => M(t) === e || TN(i, e, M(t))), s = Yy(t, Jy(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? bN : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = kN(f), m = Number(t.style.getPropertyValue(_N)) || 0, h = new Set(n.map(M)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", ee = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : ib(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !Xy(ee.parent, (e) => f.find((t) => M(t) === e) ?? null) || o(ee.parent) ? null : {
			mark: d,
			place: ee,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), yN)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dn}`);
		t !== null && rv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${gN}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && TN(a, M(e), M(t)))), s = r.getAttribute(gN) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), tv(t, lN), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = ab(kN(this.rowsOf(e)), t.map(M), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = Jy(e)?.querySelector(`.${fN}`) ?? null;
			r !== null && (r.setAttribute(kn, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), dy(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = ON(e)?.closest(".ui-tree") ?? null;
		t !== null && (tv(t, lN), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		Qy(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(M(n), Jy(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(oN)) : [];
		this.store.writeJson(e, vN, i), this.layout(e), wN(a.filter((e) => !e.classList.contains(oN)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, vN) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = rs(r);
		os(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Fo(e, i), Uo(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Jy(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => M(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${dn}`), n = Jy(e), r = n?.querySelector(hN) ?? null;
		t === null || n === null || r === null || Za(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Zl({
			container: n,
			title: r,
			className: mN,
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
function wN(e) {
	if (!(e.length === 0 || Wc())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: P.fast,
		easing: P.enter
	});
}
function TN(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function EN(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function DN() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = uN, e.setAttribute("aria-hidden", "true"), t.className = dN, e.append(t, T.text("ui.tree.loading")), e;
}
function ON(e) {
	return e.target instanceof Element ? e.target.closest(`.${fn}`) : null;
}
function kN(e) {
	return e.map((e) => ({
		key: M(e),
		parent: Jy(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: Yy(e, Jy(e)),
		shown: !e.classList.contains(hn)
	}));
}
//#endregion
//#region src/interactions/system-notifications.ts
function AN(e) {
	return {
		permission: () => typeof Notification > "u" ? void 0 : Notification.permission,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function jN(e, t, n = AN()) {
	if (n.permission() !== "granted") return !1;
	let r = {
		address: e.address,
		windowId: e.windowId,
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
function MN(e, t = document) {
	if (t.visibilityState !== "hidden") {
		e();
		return;
	}
	let n = () => {
		t.visibilityState !== "hidden" && (t.removeEventListener("visibilitychange", n), e());
	};
	t.addEventListener("visibilitychange", n);
}
//#endregion
//#region src/interactions/tab-order.ts
function NN(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var W = "ui-tabs-view", PN = "ui-tab-item__label", FN = "ui-tab-item__close", IN = "ui-tab-item__rename", LN = "ui-tab-item__caption", RN = "ui-tab-item__pin", zN = ".ui-text__title", BN = "ui-tab-item--dragging", VN = "ui-tab-item__caption--overflowed", HN = "ui-tabs-view--overflowing", UN = "ui-tabs-view--no-overflow", WN = "ui-tab-item__page", GN = "ui-tab-item--selected", KN = `.${b}`, qN = "tab-menu-entry", JN = {
	name: qN,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, YN = "tab-pin";
function XN(e) {
	return {
		name: YN,
		registration: Z_((e) => ay(e.target), e)
	};
}
var ZN = "--ui-tabs-view-strip", QN = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Yk({
			rootClass: W,
			overflowingClass: HN,
			wraps: (e) => e.classList.contains(UN),
			hiddenClass: VN,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(C(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => sP(e) === t.key))?.querySelector(`.${PN}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(BC, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), F(this.root, `.${W}`, {
			childList: !0,
			attributeFilter: [
				$n,
				ye,
				...nr
			],
			relevant: (e) => !Bl(e, `.${WN}`, `.${W}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${W}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(aw);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => sP(e) === r)) {
			this.select(e, sP(n[0]));
			return;
		}
		let i = e.hasAttribute(ye), a = t.find((e) => e.classList.contains(GN))?.querySelector(`.${LN}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = sP(e) === r;
			e.classList.toggle(GN, t);
			let a = e.querySelector(`.${LN}`);
			a !== null && (a.draggable = i, nA(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${PN}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${WN}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${WN}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), rA(a, s), a !== null && a !== s && iA(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${PN}`);
			t === null || e.classList.contains(VN) || (l.push(t), e === s && (u = t));
		}
		k(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !aw(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(ZN, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${y}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Wk}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => sP(e) === t)?.querySelector(`.${PN}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(aw).map((e) => ({
				key: sP(e),
				title: e.querySelector(`.${PN}`)?.textContent?.trim() ?? sP(e),
				current: sP(e) === t,
				disabled: E(e.querySelector(`.${PN}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${ry}`);
		if (n === null || !n.classList.contains(W) || r === null || r.closest(`.${W}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = tP(n, r), a = rP(t), o = a.map((e) => {
			if (nP(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? aw(e) ? "shown" : "hidden";
		});
		if (MC(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: sP(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${xe}="tab"]`), n = t?.parentElement ?? null, r = e.closest(KN);
		if (t === null || n === null || !n.classList.contains(W) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => sP(e) === a.key);
		if (i.length === 0 || r.matches(`${Jt}, ${qt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(qN, {
			bubbles: !0,
			detail: { keys: [i, sP(o)] }
		})), !0;
		if (tP(n, o).get(i) !== !0) return !0;
		switch (i) {
			case TC: {
				let e = o.querySelector(`.${PN}`);
				e !== null && this.startRename(e);
				break;
			}
			case EC:
			case DC:
				this.setPinned(n, o, i === EC);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${LN} > .${RN}`);
		t.toggleAttribute(tr, n), r !== null && (r.toggleAttribute(tr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = NN(a.map(oP));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? iy(a[a.length - 1]).after(iy(t)) : iy(s).before(iy(t)), t.dispatchEvent(new Event(YN, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Wk}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(W)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = iP(e.target), i = r?.closest(`.${W}`) ?? null;
		if (r === null || i === null || E(r)) return;
		let a = r.closest(`.${ry}`);
		a !== null && a.closest(`.${W}`) === i && (e.preventDefault(), this.select(i, sP(a)), document.activeElement !== r && N(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${FN}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${W}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), eP(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = iP(e.target), n = t?.closest(`.${W}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(zN) ?? e, r = e.closest(`.${ry}`);
		t === null || r === null || oy(r, "data-ui-unrenamable") || Zl({
			container: t,
			title: n,
			className: IN,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(er, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => N(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${PN}`), n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${PN}`)).filter((e) => e !== null), i = vo({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${ry}`);
		a !== null && this.select(n, sP(a)), i.focus();
	}
	handleDragStart(e) {
		let t = aP(e);
		if (t === null) return;
		if (oy(t, "data-ui-undraggable") || E(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		ev(e, t.closest(`.${W}`) ?? t, t, BN, sP(t));
		let n = iy(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LN}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${BN}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${LN}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = iy(r), o = t.hasAttribute("data-ui-tab-pinned") ? $N(n, a) : null, s = o ?? iy(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${W}`);
		t !== null && t.querySelector(`.${BN}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = aP(e);
		if (t === null) return;
		t.classList.remove(BN);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(iy(t), n.next);
			return;
		}
		let r = iy(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${W}`);
		i !== null && dy(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		ko(e, t, {
			attribute: $n,
			bindingAttribute: Qn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return L(e, `.${ry}`, `.${W}`);
	}
};
function $N(e, t) {
	let n = null;
	for (let r of L(e, `.${ry}`, `.${W}`)) {
		let e = iy(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function eP(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !oy(t, "data-ui-unremovable");
}
function tP(e, t) {
	return jC(AC(e.getAttribute(be)), {
		pinned: t.hasAttribute(tr),
		renamable: !oy(t, ue),
		removable: e.hasAttribute("data-ui-tabs-removes") && eP(e, t)
	});
}
function nP(e) {
	let t = e.getAttribute(v);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function rP(e) {
	let t = e.querySelector(`[${y}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function iP(e) {
	return e.closest(`.${FN}`) !== null || Xl(e) ? null : e.closest(`.${LN}`)?.querySelector(`:scope > .${PN}`) ?? null;
}
function aP(e) {
	return e.target instanceof Element ? e.target.closest(`.${LN}`)?.closest(".ui-tab-item") ?? null : null;
}
function oP(e) {
	return { pinned: e.hasAttribute(tr) };
}
function sP(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var cP = "button.ui-text__fold-toggle", lP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(cP);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, uP = "ui-temporal-input__segments", dP = "ui-temporal-input__segment", fP = "ui-temporal-input__segment-literal", pP = "ui-temporal-input__segment--empty", mP = "data-ui-temporal-segment", hP = "data-ui-temporal-step-direction", gP = "data-ui-temporal-segments-of", _P = "--", vP = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${B}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(si(e.components, `.${B}`));
		}), F(this.root, `.${B}`, { attributeFilter: [...Wb] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Kb(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${uP}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = qb(e), r = Xb(e), i = V(e, ix(t));
		t.getAttribute(gP) !== n && (t.replaceChildren(...yP(n).map((e) => xP(e))), t.setAttribute(gP, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(mP);
			if (t === null) {
				n.textContent = CP(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = wP(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(pP, i === null), n.tabIndex = 0, TP(n, t, i, O(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = DP(e.target);
		if (t === null) return;
		let n = t.closest(`.${B}`), r = t.getAttribute(mP), i = EP(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), kP(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), ux(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = AP(e.key, Xb(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = DP(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = DP(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = jf(this.wheelTurn, Af(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${B}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(mP), n < 0 ? 1 : -1, EP(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${hP}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${hP}]`);
		if (t === null) return;
		let n = t.closest(`.${B}`);
		if (n === null || O(n)) return;
		e.preventDefault();
		let r = OP(n) ?? n.querySelector(`.${dP}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(mP), t.getAttribute(hP) === "up" ? 1 : -1, EP(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${dP}`) : null;
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
		let i = this.baseValue(e, r), a = jP(t), o = Yb(Jb(e), a) * n, s = a === "hour" ? 24 : 60, c = ((MP(i, a) + o) % s + s) % s;
		this.write(e, hx(e, NP(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? NP(t, "hour", PP(l, t.getHours() >= 12)) : NP(t, jP(n), l), i);
		}
		u && kP(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, NP(r, "hour", PP(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return V(e, t) ?? mx(e);
	}
	write(e, t, n) {
		ux(e, t, n), fx(e), this.applySegments(e);
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
function yP(e) {
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
		t.push(bP(r)), n += r.length;
	}
	return t;
}
function bP(e) {
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
function xP(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = fP, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = dP, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(mP, e.unit), t.dataset.width = String(e.width), SP(t, e.unit), t;
}
function SP(e, t) {
	if (t === "meridiem") {
		T.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = jP(t);
	T.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function CP(e, t, n, r) {
	return t && n !== null ? wi(n, e, r) : e;
}
function wP(e, t, n, r) {
	if (n === null) return _P;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : MP(n, jP(e));
	return String(i).padStart(t, "0");
}
function TP(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : MP(n, jP(t))));
}
function EP(e) {
	return ix(e.closest(`.${uP}`));
}
function DP(e) {
	let t = e instanceof Element ? e.closest(`.${dP}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${B}`);
	return n === null || O(n) ? null : t;
}
function OP(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${dP}`) : null;
}
function kP(e, t, n) {
	vo({
		key: n,
		items: [...e.querySelectorAll(`.${dP}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function AP(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function jP(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function MP(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function NP(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function PP(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var FP = "ui-timestamp", IP = "ui-timestamp__text", LP = "data-ui-timestamp-format", RP = "datetime", zP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${FP}`), T.temporal === null), T.onTable(() => this.apply(this.root.querySelectorAll(`.${FP}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(si(e.components, `.${FP}`))), F(this.root, `.${FP}`, {
			childList: !0,
			attributeFilter: [RP],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${FP}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: T.temporal,
			language: T.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = $i(a.getAttribute(LP)), o = Qi(a.getAttribute(RP)), s = a.querySelector(`.${IP}`);
			if (s === null || t && !BP(e, o, r)) continue;
			let c = o === null ? "" : na(o, e, n, r), l = e === "relative-date" ? ia(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= ea(e) && o !== null;
		}
		i && ja(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${FP}:is([${LP}="relative"], [${LP}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function BP(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && ra(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var VP = /* @__PURE__ */ new Map();
function HP(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${y}]`)) if (t.closest(x) === e) return t;
	return null;
}
function UP(e, t, n, r) {
	let i = WP(e, t);
	return i !== null && (VP.set(e, {
		key: t,
		block: n
	}), GP(e, i, n, r), !0);
}
function WP(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function GP(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = wo(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = KP(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function KP(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function qP(e) {
	let t = VP.get(e);
	if (t === void 0) return;
	let n = WP(e, t.key);
	if (n === null) {
		VP.delete(e);
		return;
	}
	GP(e, n, t.block, "auto");
}
function JP(e) {
	VP.delete(e);
}
function YP(e) {
	if (!(VP.size === 0 || !(e instanceof Node))) for (let t of [...VP.keys()]) (!t.isConnected || wo(t).contains(e)) && VP.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var XP = "data-ui-scroll-anchor", ZP = "End", QP = 4, $P = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], eF = /* @__PURE__ */ new WeakSet();
function tF(e) {
	eF.add(e);
}
function nF(e) {
	eF.delete(e);
}
var rF = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of $P) this.root.addEventListener(e, (e) => iF(e), {
			capture: !0,
			passive: !0
		});
		F(this.root, `[${XP}="${ZP}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [At]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !oF(t) || this.pinned.set(t, eF.has(t) || cF(t) && !sF(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${XP}="${ZP}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), eF.has(t)) {
				this.pinned.set(t, !0), aF(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (sF(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), aF(t);
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
			if (!e.isConnected || r === null || !oF(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? aF(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !oF(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && aF(e);
	}
	followsEnd(e) {
		return eF.has(e) || this.pinned.get(e) !== !1 && !sF(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function iF(e) {
	YP(e.target);
	let t = e.target instanceof Element ? e.target.closest(`[${XP}="${ZP}"]`) : null;
	t !== null && eF.delete(t);
}
function aF(e) {
	e.scrollTop = e.scrollHeight;
}
function oF(e) {
	return e.getAttribute(XP) === ZP;
}
function sF(e) {
	return e.getAttribute(Tt)?.toLowerCase() === "true";
}
function cF(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= QP;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var lF = `:is(.ui-surface, .ui-card)[${ie}]`, uF = "ui-surface--clickable", dF = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), F(t, lF, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(lF));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(lF) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(uF)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), hF(e, "role", mF(e) ? "group" : "button"), hF(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : pF(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = fF(e);
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
function fF(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(uF) && t.hasAttribute("tabindex") ? t : null;
}
function pF(e) {
	let t = e.closest(jo);
	return t !== null && t.closest(A)?.matches(".ui-items-view, .ui-table") === !0 && Qp(t) === e;
}
function mF(e) {
	for (let t of e.querySelectorAll(Xp)) if (tm(e, t)) return !0;
	return !1;
}
function hF(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var gF = `${Yp}, [role='menu'], [role='tab']`, _F = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? vF, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(gF) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function vF(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function yF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = xF(e, a, n), s = xF(e, a + 1, n);
	return SF(t, o.top, s.top, o.line, s.line);
}
function bF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = xF(e, a, n), s = xF(e, a + 1, n);
	return SF(t, o.line, s.line, o.top, s.top);
}
function xF(e, t, n) {
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
function SF(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var CF = 250, wF = class {
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
		if (n !== void 0 && t - n.at < CF && n.found.every((e) => e.isConnected)) return n.found;
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
		let n = TF(e, "data-ui-scroll-viewport") ?? EF(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? OF(e) : null, a = i === null ? null : OF(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = bF(a, yF(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? DF(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function TF(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function EF(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : TF(e, y);
	return t === null ? null : wo(t);
}
function DF(e, t) {
	return t > 0 ? e / t : 0;
}
function OF(e) {
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
var kF = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", AF = `.${hr}, .ui-action, .${b}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, ${kF}`, jF = "ui-key-value-action__row", MF = `${AF}, ${`${jo}, .${jF}`}`, NF = "ui-pressing", PF = "ui-press-held", FF = "--ui-press-x", IF = "--ui-press-y", LF = "--ui-ripple-radius", RF = "--ui-ripple-opacity", zF = class {
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
		if (t === null || typeof t.animate != "function" || Wc()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(FF, `${r}px`), t.style.setProperty(IF, `${i}px`), t.classList.add(NF, PF);
		let o = t.animate([{ [LF]: "0px" }, { [LF]: `${a}px` }], {
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
		if (e.closest(".ui-tab-item__close, .ui-tab-item__rename") !== null) return null;
		let t = e.closest(kF) ?? e.closest(MF);
		if (t === null || E(t)) return null;
		let n = e.closest(fr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(AF) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (nm(t, e) !== null || D(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(A), r = n !== null && !e.classList.contains(jF) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Za(e, "data-ui-unselectable");
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
		n.element.classList.remove(PF);
		let r = Math.max(0, P.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, P.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [RF]: 1 }, { [RF]: 0 }], {
			duration: P.normal,
			delay: i,
			easing: P.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(NF, PF), this.presses.get(e) === t && this.presses.delete(e);
	}
}, BF = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), VF = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], HF = `.${ar}, .${or}`, UF = RegExp(`(^|\\s)(${ar}|${or})(\\s|$)`), WF = RegExp(`(^|\\s)${sr}(\\s|$)`), GF = "[type='range']", KF = /* @__PURE__ */ new WeakSet(), qF = /* @__PURE__ */ new WeakSet();
function JF(e = document) {
	let t = e === document ? window : e;
	for (let e of VF) t.addEventListener(e, nI, !0);
	t.addEventListener("keydown", iI, !0), t.addEventListener("change", aI, !0), t.addEventListener("pointerdown", oI, !0), t.addEventListener("mousedown", oI, !0), $F(e.querySelectorAll(HF)), ZF(e.querySelectorAll(`[${ir}]`)), XF(e.querySelectorAll(GF)), new MutationObserver((e) => {
		for (let t of e) YF(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", ir],
		attributeOldValue: !0
	});
}
function YF(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			QF(t, e.oldValue !== null);
			return;
		}
		let n = UF.test(e.oldValue ?? ""), r = t.matches(HF);
		n !== r && (eI(t, r), QF(t)), WF.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && XF(t.querySelectorAll(GF));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(HF) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && tI(n), n.matches(HF) && eI(n, !0), $F(n.querySelectorAll(HF)), QF(n), ZF(n.querySelectorAll(`[${ir}]`)), XF([n, ...n.querySelectorAll(GF)]));
}
function XF(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = O(t);
		e !== KF.has(t) && (e ? (KF.add(t), t.addEventListener("touchstart", oI, { passive: !1 })) : (KF.delete(t), t.removeEventListener("touchstart", oI)));
	}
}
function ZF(e) {
	for (let t of e) QF(t);
}
function QF(e, t = !1) {
	let n = e.getAttribute(ir);
	n === null && !t || (e.matches(HF) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Ld(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function $F(e) {
	for (let t of e) eI(t, !0);
}
function eI(e, t) {
	for (let n of e.children) t ? tI(n) : qF.has(n) && (qF.delete(n), n.removeAttribute("inert"));
}
function tI(e) {
	e.hasAttribute("inert") || (qF.add(e), e.setAttribute("inert", ""));
}
function nI(e) {
	e.target instanceof Element && (E(e.target) ? (e.type === "click" && su(e), sI(e)) : e.type === "click" && rI(e.target) && e.preventDefault());
}
function rI(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && O(e);
}
function iI(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && E(e.target)) {
			sI(e);
			return;
		}
		!BF.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && O(e.target) && e.preventDefault();
	}
}
function aI(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && O(e.target) && e.stopImmediatePropagation();
}
function oI(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !O(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function sI(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var cI = /* @__PURE__ */ new WeakMap(), lI = new fu({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = cI.get(e);
		cI.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), uI = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => lI.popupOf(r) === t;
		return cI.set(t, n.onDismiss), lI.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (cI.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && lI.reposition(r);
			},
			close: () => {
				i() && lI.close(r);
			}
		};
	},
	focusReturn: (e) => Gs(e)
};
//#endregion
//#region src/items/item-rows.ts
function dI(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Ov,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => ts(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var fI = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? hI(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), gI(l, n, t);
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
		let i = mI(r.item, t, n);
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
			pI(n, e) && this.applyBoundAttribute(i, String(C(n.bindingId)), e, t);
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
		let r = bI(t, n.templateKeyPropertyName);
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
		let d = Ka(u, () => this.metadata.isTranslatable(a) && !Tv(l)), f = C(a.componentId), p = e.closest(`[${ie}="${f}"]`);
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
function pI(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = C(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function mI(e, t, n) {
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
function hI(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function gI(e, t, n) {
	e.setAttribute(v, t), yI(e, n), vI(e, n);
}
var _I = [
	["CanSelect", se],
	["CanDrag", ce],
	["CanRemove", le],
	["CanRename", ue],
	["CanShowContextMenu", de]
];
function vI(e, t) {
	for (let [n, r] of _I) {
		let i = kv(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function yI(e, t) {
	let n = kv(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(ct, n.value) : e.removeAttribute(ct);
}
function bI(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = kv(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var xI = "Group", SI = class {
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
			for (let [t, n] of e) t.isConnected && LM(t, n, this.options);
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
			if (Q_(r) !== "virtualized") continue;
			let i = r.closest(x);
			i === null || !this.drawsPatchedComponent(i, C(e.reference.componentId), t) || !CI(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(w(i), t) && this.sync(r, w(i));
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
		LM(e, t, this.options);
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
		if (r !== null && i !== null && Q_(r) === "virtualized") {
			let a = e.getAttribute(v);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = wI(xI, t);
		a && yI(e, this.options.renderer.getItemValue(e)), _I.some(([e]) => wI(e, t)) && vI(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && wI(xI, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => wI(e.itemProperty, t)) || n.sorts.some((e) => wI(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${y}]`)) {
			let n = li(t);
			n === e && this.sync(t, n);
		}
	}
};
function CI(e, t) {
	let n = ni(e, ti(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function wI(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var TI = "ui-table", EI = "ui-table--no-header";
function DI(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(TI)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(EI)) && (s ? o : a).push(t);
	a.forEach((e, t) => OI(e, t));
	for (let [e, n] of t) OI(e, a.length + n);
	n !== null && o.forEach((e, t) => OI(e, a.length + n + t)), kI(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function OI(e, t) {
	kI(e, "aria-rowindex", String(t + 1));
}
function kI(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var AI = 50, jI = 1, MI = .5, NI = 60, PI = "--ui-window-look", FI = "--ui-window-row", II = "--ui-window-tile", LI = 3, RI = class {
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
			if (this.layout(t), GI(t) === 0) {
				this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = JI(e, St);
		if (t !== null && oF(e) && zI(e.getAttribute("data-ui-window-more-after"))) {
			Do(e, Math.max(0, this.windowBottom(e, t) - Eo(e).height));
			return;
		}
		t !== null && t !== 0 && Do(e, zI(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = WI(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : UI(n[n.length - 1]).bottom - UI(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = JI(e, St), n = WI(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = Eo(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		Q_(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${y}][${pt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = To(e.target);
		if (t === null || Q_(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, NI));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && GI(e) > 0) return;
		let n = WI(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = JI(e, St), i = zI(e.getAttribute(wt)), a = zI(e.getAttribute(Tt));
		if (r !== null) {
			let o = this.windowSize(e), s = Eo(e), c = Math.max(1, Math.round(s.height * jI / t.itemSize), Math.floor(o * MI)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, KI(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, KI(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = Eo(e), s = Math.max(1, o.height * jI), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, KI(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, KI(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = JI(e, Ct);
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
		o.pending = !0, e.setAttribute(yt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && JI(e, "data-ui-window-total") === null && VI(e) && kM(e, OM, LI * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: qI(e),
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
			o.pending = !1, e.removeAttribute(yt), e.removeAttribute("aria-busy"), kM(e, OM, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = WI(e), r = JI(e, Ct), i = JI(e, St);
		if (DI(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			kM(e, "top", 0), kM(e, DM, 0);
			return;
		}
		if (n.length > 0) {
			let r = UI(n[n.length - 1]).bottom - UI(n[0]).top;
			if (r > 0) {
				let i = BI(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), HI(e, a > 1 ? (UI(n[n.length - 1]).top - UI(n[0]).top) / (a - 1) : r, i > 1 ? UI(n[1]).left - UI(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		kM(e, "top", a), kM(e, DM, o), qP(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(FI));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = JI(e, xt);
		return t !== null && t > 0 ? t : AI;
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
function zI(e) {
	return e !== null && e.toLowerCase() === "true";
}
function BI(e) {
	let t = UI(e[0]).top, n = 1;
	for (; n < e.length && UI(e[n]).top === t;) n++;
	return n;
}
function VI(e) {
	return getComputedStyle(e).getPropertyValue(PI).trim() === "skeleton";
}
function HI(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(FI) !== i && r.setProperty(FI, i), r.getPropertyValue(II) !== a && (a.length === 0 ? r.removeProperty(II) : r.setProperty(II, a));
}
function UI(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function WI(e) {
	return [...e.children].filter((e) => e.hasAttribute(v));
}
function GI(e) {
	return WI(e).length;
}
function KI(e) {
	return e.getAttribute(v);
}
function qI(e) {
	let t = e.closest(x);
	return t === null ? [] : ni(t, ti(t));
}
function JI(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var YI = [
	ie,
	ae,
	oe
];
function XI(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, ZI(c, e.itemRole);
	let l = $I(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = QI(l, t, n, a);
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
		d.className = l.wrapperClassName, ZI(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), gI(d, r, n), c.appendChild(d);
	}
	return gI(c, r, n), o.registerItemScope(c, l, n), c;
}
function ZI(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function QI(e, t, n, r) {
	let i = bI(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function $I(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of YI) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), w(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function eL(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return tL(i.renderer.renderItem(e, t, n, r), a);
	let s = XI(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), tL(s, a);
}
function tL(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var nL = 6, rL = 60, iL = class {
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
		let n = oF(e) && cF(e);
		this.project(e, t), this.layout(e, t), n && !cF(e) && (Do(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && hc(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = z(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? hs(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = mI(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Lv(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Vv(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => zv(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => cL(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Uv(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = cL(e), n = s.get(t);
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
		let t = To(e.target);
		t !== null && Q_(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && Q_(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, rL));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = mL(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = uL(e) ? dL(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || lL(e)) && u > 0) {
			let i = hL(r.paddingTop), a = Eo(e), o = oL(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - nL), f = Math.min(u, f + nL);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], ee = !1;
		for (let e = 0; e < o; e++) {
			let r = n[e], i = e >= p && e < m, a = (r.header ? t.headers.get(cL(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), sL(t, r, null), ee = !0);
				continue;
			}
			if (a !== null) {
				r.header && EM(a, r.entry.key), g.push(a), _.push([a, e]);
				continue;
			}
			let o = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, h);
			o !== null && (sL(t, r, o), g.push(o), _.push([o, e]), ee = !0);
		}
		let te = new Set(g);
		for (let e of t.entries) e.element !== null && !te.has(e.element) && (e.element.remove(), e.element = null, ee = !0);
		for (let t of z(e)) te.has(t) || (t.remove(), ee = !0);
		for (let t of e.querySelectorAll(`:scope > [${ot}]`)) te.has(t) || (t.remove(), ee = !0);
		for (let e of t.headers.values()) e.element !== null && !te.has(e.element) && (e.element = null);
		let ne = gL(l, 0, d), re = gL(l, f, u);
		AM(e, [...g, ...gv(_v(e))]), kM(e, "top", ne > 0 ? ne - i : 0), kM(e, DM, re > 0 ? re - i : 0), vv(e, t.componentId, this.options.templates, this.options.renderer, o > 0), DI(e, _, o), (ee || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = fL(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return eL(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && EM(r, t.key), r;
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(cL(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = pL(o);
			s.height <= 0 || (aL(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(cL(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
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
function aL(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function oL(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Do(e, a + l + o), a + l);
}
function sL(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = cL(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function cL(e) {
	let t = kv(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function lL(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function uL(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function dL(e, t, n) {
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
function fL(e, t, n) {
	let r = e.clientWidth - hL(t.paddingLeft) - hL(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = hL(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function pL(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function mL(e) {
	return hL(e.rowGap);
}
function hL(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function gL(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var _L = "data-ui-template", vL = "default", yL = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? vL, r = this.findTemplate(e, n);
		return r === void 0 ? n === vL ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${_L}]`);
		for (let e of r) if (e.getAttribute(_L) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= bL(this.dom.root), this.templateComponentIds.has(e);
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
function bL(e) {
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
function xL(e, t) {
	let n = e.querySelector(`style[${zn}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(zn, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var SL = "script[type='application/json'][data-ui-metadata]";
function CL(e = document) {
	let t = e.querySelector(SL);
	if (t === null) return wL();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return wL();
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
function wL() {
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
var TL = "script[type='application/json'][data-ui-hydration]";
function EL(e) {
	return e !== null && (va(e.title) || va(e.changes));
}
function DL(e = document) {
	let t = e.querySelector(TL)?.textContent?.trim() ?? "";
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
var OL = "reconnecting";
async function kL(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), OL;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function AL(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/client-state.ts
var jL = {
	visibilityState: () => document.visibilityState,
	notificationPermission: () => typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission
}, ML = 200;
function NL(e = jL) {
	return {
		visible: e.visibilityState() !== "hidden",
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var PL = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? jL, this.settleMilliseconds = e.settleMilliseconds ?? ML;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = NL(this.source), this.held;
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
		let t = NL(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
function FL(e, t, n) {
	e.addEventListener("message", (e) => {
		let r = e.data;
		r?.kind === "ne:which-window" ? e.ports[0]?.postMessage(t) : r?.kind === "ne:notification-click" && typeof r.action == "string" && n(r.action);
	}), e.startMessages();
}
//#endregion
//#region src/runtime/service-worker.ts
var IL = "/_ne/", LL = 3e3;
function RL(e, t, n) {
	let r = e.getAttribute(Ln);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (FL(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => BL(i.ready);
	let a = i.register(r, { scope: IL }).then(zL).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function zL(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function BL(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), LL))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var VL = "ne-standard-ui:reloaded-view";
function HL(e, t, n) {
	if (!t) return "no-cookie";
	if (GL(n) === e) return "asked-again";
	try {
		n?.setItem(VL, e);
	} catch {}
	return "reload";
}
function UL(e) {
	try {
		e?.removeItem(VL);
	} catch {}
}
function WL() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function GL(e) {
	try {
		return e?.getItem(VL) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var KL = 2e3, qL = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? KL, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Gn, "reconnecting"), this.notice = this.notifications.show({
			message: T.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
		});
	}
	reconnected() {
		this.given || (this.clear(), this.root.removeAttribute(Gn));
	}
	clear() {
		this.grace !== null && (window.clearTimeout(this.grace), this.grace = null), this.notice !== null && (this.notifications.dismiss(this.notice), this.notice = null);
	}
	lost() {
		this.given = !0, this.clear(), this.root.setAttribute(Gn, "lost");
	}
}, JL = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(YL(XL(e)));
	}
	async dispatchAsync(e) {
		let t = XL(e), n = YL(t);
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
function YL(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function XL(e) {
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
var ZL = class {
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
async function QL(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var $L = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && hc(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = eR(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(tR([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(eR(e, t));
		let n = this.unplaced.get(tR(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = eR(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(tR([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = tR(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, tR(t.slice(0, e - 1)));
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
		return `${C(e.componentId)}:${e.propertyId}:${nR(t)}`;
	}
};
function eR(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function tR(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function nR(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var rR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, iR = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, aR = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, oR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, sR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, cR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, lR = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, uR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, dR = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, fR = class {
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
var pR = class {
	constructor() {}
	log(e, t) {}
};
pR.instance = new pR();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var mR = "10.0.11", K = class {
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
function hR(e, t) {
	let n = "";
	return _R(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${gR(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function gR(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function _R(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function vR(e, t, n, r, i, a) {
	let o = {}, [s, c] = SR();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${hR(i, a.logMessageContent)}.`);
	let l = _R(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function yR(e) {
	return e === void 0 ? new xR(G.Information) : e === null ? pR.instance : e.log === void 0 ? new xR(e) : e;
}
var bR = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, xR = class {
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
function SR() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, CR(mR, wR(), ER(), TR())];
}
function CR(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function wR() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function TR() {
	if (q.isNode) return process.versions.node;
}
function ER() {
	return q.isNode ? "NodeJS" : "Browser";
}
function DR(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function OR() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var kR = class extends fR {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(OR());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new aR();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new aR();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new iR();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, _R(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new rR(await AR(i, "text") || i.statusText, i.status);
		let a = await AR(i, e.responseType);
		return new dR(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function AR(e, t) {
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
var jR = class extends fR {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new aR()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (_R(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new aR());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new dR(r.status, r.statusText, r.response || r.responseText)) : n(new rR(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new rR(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new iR());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, MR = class extends fR {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new kR(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new jR(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new aR()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, NR = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
NR.RecordSeparatorCode = 30, NR.RecordSeparator = String.fromCharCode(NR.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var PR = class {
	writeHandshakeRequest(e) {
		return NR.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (_R(e)) {
			let r = new Uint8Array(e), i = r.indexOf(NR.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(NR.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = NR.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var FR = class {
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
		return this.observers.push(e), new bR(this, e);
	}
}, IR = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			_R(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new LR(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, _R(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, LR = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, RR = 3e4, zR = 15e3, BR = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var VR = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? RR, this.keepAliveIntervalInMilliseconds = a ?? zR, this._statefulReconnectBufferSize = o ?? BR, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new PR(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new IR(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new aR("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new FR();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${DR(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${DR(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new aR("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${DR(t)}`);
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
}, HR = [
	0,
	2e3,
	1e4,
	3e4,
	null
], UR = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? HR : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, WR = class {};
WR.Authorization = "Authorization", WR.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var GR = class extends fR {
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
		e.headers ||= {}, this._accessToken ? e.headers[WR.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[WR.Authorization] && delete e.headers[WR.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, X;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(X ||= {});
var KR;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(KR ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var qR = class {
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
}, JR = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new qR(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, KR, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === KR.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = SR(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === KR.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(G.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new rR(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${hR(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new rR(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof iR ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? vR(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = SR();
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
			i ? i instanceof rR && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, YR = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, KR, "transferFormat"), this._logger.log(G.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== KR.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (q.isBrowser || q.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = SR();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${hR(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? vR(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, XR = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, KR, "transferFormat"), this._logger.log(G.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (q.isNode || q.isReactNative) {
				let t = {}, [r, i] = SR();
				t[r] = i, n && (t[WR.Authorization] = `Bearer ${n}`), o && (t[WR.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === KR.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(G.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(G.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${hR(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${hR(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, ZR = 100, QR = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = yR(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new GR(n.httpClient || new MR(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= KR.Binary, K.isIn(e, KR, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${KR[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new aR(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new aR(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new ez(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new aR("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < ZR);
				if (r === ZR && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof JR && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = SR();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new lR("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof rR && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new lR(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new cR(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new aR(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new uR(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new XR(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new YR(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new JR(this._httpClient, this._logger, this._options);
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
		if ($R(t, i)) {
			if (e.transferFormats.map((e) => KR[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new oR(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${KR[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${KR[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new sR(`'${X[i]}' is disabled by the client.`, i);
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
function $R(e, t) {
	return !e || (t & e) !== 0;
}
var ez = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new tz(), this._transportResult = new tz(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new tz(), this._transportResult.promise;
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
			this._sendBufferedData = new tz();
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
}, tz = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, nz = "json", rz = class {
	constructor() {
		this.name = nz, this.version = 2, this.transferFormat = KR.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = pR.instance);
		let n = NR.parse(e), r = [];
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
		return NR.write(JSON.stringify(e));
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
}, iz = {
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
function az(e) {
	let t = iz[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var oz = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), sz(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = az(e);
			this.logger = new xR(t);
		} else this.logger = new xR(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new UR(e) : e : new UR(), this;
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
		let t = new QR(this.url, e);
		return VR.create(t, this.logger || pR.instance, this.protocol || new rz(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function sz(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var cz = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, lz = class {
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
}, uz = 500;
function dz(e) {
	let { changes: t, ...n } = e;
	return n;
}
function fz() {
	return {};
}
var pz = class {
	windowId;
	connection;
	started = !1;
	gate = new lz();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new ZL(t), this.connection = new oz().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
			return this.gate.answered(t), t;
		} catch (e) {
			throw this.gate.rearm(), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, dz));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, dz));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, dz));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, fz, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new cz(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, fz));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), uz);
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
}, mz = "/_ne/values", hz = 32768;
hz / 4;
var gz = 3e4;
function _z(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function vz(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function yz(e, t = null, n = gz) {
	if (e === void 0 || !vz(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${mz}/${encodeURIComponent(r)}${i}`, {
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
async function bz(e) {
	let t = await fetch(mz, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(gz)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var xz = Promise.resolve(), Sz = () => {}, Cz = hz * 3 / 4, wz = 128, Tz = class {
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
		if (this.handed >= this.given) return xz;
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
		for (; this.flight !== null;) await this.flight.catch(Sz);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = _z(e.value), i = r === null ? null : bz(r);
		return i?.catch(Sz), new Promise((a, o) => {
			let s = Dz(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? Ez(e) : Ez({
				...e,
				value: void 0
			}) + wz;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, Oz(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof cz) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= Cz);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => bz(e));
		return t.catch(Sz), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function Ez(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function Dz(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function Oz(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var kz = "form-owner", Az = "ui-form-";
function jz(e) {
	return Az + e.replace(/[ \t\n\f\r]/g, "_");
}
function Mz(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = jz(t);
	Pz(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function Nz(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(Az) && Pz(e);
	}
}
function Pz(e) {
	let t = Fz();
	if (t.querySelector(`form[id="${Sr(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function Fz() {
	let e = document.body.querySelector(`[${kt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(kt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var Iz = document;
function Lz() {
	try {
		return Iz.execCommand("copy");
	} catch {
		return !1;
	}
}
function Rz(e) {
	try {
		return typeof Iz.execCommand == "function" && Iz.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var zz = /* @__PURE__ */ new Map([
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
]), Bz = [
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
function Vz(e) {
	return Q(e, Bz);
}
var Hz = [
	"small",
	"medium",
	"large"
], Uz = ["default", "circle"], Wz = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], Gz = [
	"start",
	"center",
	"end",
	"justify"
], Kz = ["nowrap", "wrap"], qz = /* @__PURE__ */ new Map([
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
]), Jz = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), Yz = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), Xz = ["inline", "trailing"], Zz = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], Qz = [
	"small",
	"medium",
	"large"
], $z = [
	"small",
	"medium",
	"large"
], eB = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], tB = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], nB = ["light", "dark"], rB = [
	"start",
	"center",
	"end",
	"stretch"
], iB = ["clip", "visible"], aB = [
	"visible",
	"hidden",
	"collapsed"
], oB = [
	"background",
	"raised",
	"tinted"
], sB = ["horizontal", "vertical"], cB = [
	"none",
	"gap",
	"rule"
], lB = [
	"none",
	"one",
	"many"
], uB = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], dB = ["stack", "wrap"], fB = ["end", "start"], pB = [
	"disabled",
	"auto",
	"always"
], mB = [
	"disabled",
	"proximity",
	"mandatory"
], hB = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], gB = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], _B = ["hex", "rgb"], vB = ["field", "swatch"], yB = [
	"fill",
	"contain",
	"cover",
	"none"
], bB = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], xB = ["default", "circle"], SB = ["uniform", "vignette"], CB = ["linear", "circular"], wB = [
	"none",
	"vertical",
	"horizontal",
	"both"
], TB = [
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
], EB = [
	"None",
	"Shade",
	"Tint"
], DB = /* @__PURE__ */ new Map();
function OB(e) {
	return DB.get(e);
}
function Z(e, t, n) {
	return jB(e, kB(t, n), (e) => `${t}${Q(e, n)}`);
}
function kB(e, t) {
	return AB(t.map((t) => `${e}${t}`));
}
function AB(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function jB(e, t, n) {
	return DB.set(e, t), [e, n];
}
var MB = new Map([
	Z("colorClass", "ui-color--", Bz),
	jB("themeColorClass", kB("ui-color--", Bz), (e) => uV(e)),
	jB("iconClass", of, (e) => sf(e)),
	["iconUrlCss", (e) => Qd(e)],
	["safeUrl", (e) => Rd(e)],
	["safeImageSource", (e) => qd(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : bT(String(e))],
	Z("iconSizeClass", "ui-icon-size--", Hz),
	jB("iconShapeClass", AB(["ui-icon--circle"]), (e) => Q(e, Uz) === "circle" ? "ui-icon--circle" : ""),
	Z("textTypeClass", "ui-text-type--", Wz),
	jB("textAppearanceClass", kB("ui-text-type--", Wz), (e) => yV(e)),
	Z("textAlignmentClass", "ui-text--align-", Gz),
	Z("textWrapClass", "ui-text--", Kz),
	Z("textBadgePlacementClass", "ui-text__badge--", Xz),
	Z("badgeStyleClass", "ui-badge-style--", tB),
	["badgeTextFit", (e) => dV(e)],
	Z("buttonClass", "ui-button--", eB),
	Z("surfaceStyleClass", "ui-surface--", oB),
	Z("orientationClass", "ui-orientation--", sB),
	Z("groupSeparatorClass", "ui-command-bar--separator-", cB),
	["selectionModeAttribute", (e) => Q(e, lB)],
	["selectionBackgroundCss", (e) => rV(eV(e, "background"))],
	["selectionForegroundCss", (e) => rV(eV(e, "foreground"))],
	["selectionMarkColorCss", (e) => rV(eV(e, "markColor"))],
	["selectionMarkCss", (e) => nV(eV(e, "mark"))],
	["selectionFontWeightCss", (e) => tV(eV(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => rV(eV(e, "actionBarBackground"))],
	Z("itemsViewLayoutClass", "ui-items-view--", dB),
	Z("dragHandlePlacementClass", "ui-drag-handle--", fB),
	Z("scrollXClass", "ui-scroll-x--", pB),
	Z("scrollYClass", "ui-scroll-y--", pB),
	["hostViewport", (e) => WB(e)],
	Z("scrollSnapClass", "ui-scroll-snap--", mB),
	Z("inputAppearanceClass", "ui-input--", Zz),
	Z("searchFieldAppearanceClass", "ui-search__field--", Zz),
	Z("inputSizeClass", "ui-input--", $z),
	Z("buttonSizeClass", "ui-button--", Qz),
	Z("buttonGroupSizeClass", "ui-button-group--", Qz),
	["textInputTypeAttribute", (e) => Q(e, hB)],
	["inputModeAttribute", (e) => Q(e, gB)],
	["colorTextFormatAttribute", (e) => Q(e, _B)],
	["colorInputVariantAttribute", (e) => Q(e, vB)],
	["themeNameCss", (e) => Q(e, nB)],
	["alignmentCss", (e) => Q(e, rB)],
	["alignmentStretchFallbackCss", (e) => Q(e, rB) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, iB)],
	["layoutLengthCss", (e) => GB(e)],
	["thicknessCss", (e) => qB(e)],
	jB("borderNoneClass", AB(["ui-border--none"]), (e) => YB(e)),
	["radiusCss", (e) => XB(e)],
	["gridUnitCss", (e) => ZB(e)],
	["pixelsCss", (e) => kV(e)],
	["gridTemplateCss", (e) => QB(e)],
	["colorVariantCss", (e) => CV(e)],
	["themeColorCss", (e) => rV(e)],
	["themeInkCss", (e) => aV(e)],
	["themeOnColorCss", (e) => sV(e)],
	["themeColorInlineCss", (e) => iV(e) ? "" : rV(e)],
	["themeColorCanonical", (e) => xV(e)],
	["textAppearanceFontSizeCss", (e) => bV(e, "size")],
	["textAppearanceFontWeightCss", (e) => bV(e, "weight")],
	["textAppearanceLineHeightCss", (e) => bV(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => bV(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => GB(H(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => GB(H(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => GB(H(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => GB(H(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => GB(H(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => KB(H(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => KB(H(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => KB(H(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => KB(H(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => KB(H(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => KB(H(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => KB(H(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => KB(H(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => KB(H(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => KB(H(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => qB(H(e, "base"))],
	["responsiveThicknessSmCss", (e) => qB(H(e, "sm"))],
	["responsiveThicknessMdCss", (e) => qB(H(e, "md"))],
	["responsiveThicknessXlCss", (e) => qB(H(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => qB(H(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => JB(H(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => JB(H(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => JB(H(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => JB(H(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => JB(H(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => JB(H(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => JB(H(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => JB(H(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => JB(H(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => JB(H(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => AV(H(e, "base"))],
	["responsivePixelsSmCss", (e) => AV(H(e, "sm"))],
	["responsivePixelsMdCss", (e) => AV(H(e, "md"))],
	["responsivePixelsXlCss", (e) => AV(H(e, "xl"))],
	["responsivePixelsXxlCss", (e) => AV(H(e, "xxl"))],
	["visibilityBaseAttribute", (e) => jV(e, "base")],
	["visibilitySmAttribute", (e) => jV(e, "sm")],
	["visibilityMdAttribute", (e) => jV(e, "md")],
	["visibilityXlAttribute", (e) => jV(e, "xl")],
	["visibilityXxlAttribute", (e) => jV(e, "xxl")],
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
	Z("imageFitClass", "ui-image-fit--", yB),
	jB("imageShapeClass", AB(["ui-image--circle"]), (e) => Q(e, xB) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => IB(e)],
	["backgroundImageAttribute", (e) => IB(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => Q(e, bB)],
	["backgroundImageDimCss", (e) => LB(e)],
	["backgroundImageDimModeAttribute", (e) => Q(e, SB) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => zB(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => zB(e) ? "" : void 0],
	["positiveCount", (e) => RB(e)?.toString()],
	["positiveFlagAttribute", (e) => RB(e) === void 0 ? void 0 : ""],
	jB("maxLinesClass", AB(["ui-text--max-lines"]), (e) => RB(e) === void 0 ? "" : "ui-text--max-lines"),
	Z("progressVariantClass", "ui-progress--", CB),
	["progressValueText", (e) => OV(e)],
	["textAreaResizeCss", (e) => Q(e, wB)],
	Z("flyoutPlacementClass", "ui-flyout--", TB),
	["popupPlacementAttribute", (e) => Q(e, TB)],
	["tabMenuEntriesAttribute", (e) => PB(e)],
	["markedDaysAttribute", (e) => FB(e)]
]), NB = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function PB(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = NB.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function FB(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function IB(e) {
	return Qd(e);
}
function LB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function RB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function zB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var BB = [
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
], VB = new Map(BB.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), HB = new Map(BB.map(([e, t]) => [e, t])), UB = /* @__PURE__ */ new Map([[iB, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : UB.get(t)?.get(e)) ?? zz.get(e) ?? Cr(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function WB(e) {
	return e == null || Q(e, pB) === "disabled" ? void 0 : "parent";
}
function GB(e) {
	if (e == null) return "";
	if (typeof e == "number") return kV(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? kV(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function KB(e, t) {
	if (typeof e != "object" || !e) return GB(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? GB(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function qB(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function JB(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return kV(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return kV(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function YB(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function XB(e) {
	if (e == null) return "";
	if (typeof e == "number") return kV(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? kV(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function ZB(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return kV(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function QB(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return ZB(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return ZB(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${ZB(e[0])})` : e.map((e) => ZB(e)).join(" ");
}
function $(e, t, n) {
	return $B(H(e, t), n);
}
function $B(e, t) {
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
function eV(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function tV(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function nV(e) {
	if (e == null) return "";
	switch (Q(e, uB)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function rV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (SV(e)) return CV(e);
	let t = e, n = CV(t.light), r = CV(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = qz.get(Q(o, Bz));
	return s ? `var(${s})` : "";
}
function iV(e) {
	if (typeof e != "object" || !e || SV(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function aV(e) {
	if (iV(e)) {
		let t = Jz.get(Q(e.style, Bz));
		if (t !== void 0) return `var(${t})`;
	}
	return rV(e);
}
var oV = /* @__PURE__ */ new Set(["background", "surface"]);
function sV(e) {
	if (typeof e != "object" || !e) return "";
	if (SV(e)) return cV(e) ? "initial" : lV(e);
	let t = e, n = lV(t.light ?? t.dark), r = lV(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && cV(t.light ?? t.dark) && cV(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, Bz);
	if (oV.has(i)) return "initial";
	let a = Yz.get(i);
	return a ? `var(${a})` : "";
}
function cV(e) {
	return wV(e)?.[3] === 0;
}
function lV(e) {
	let t = wV(e);
	return t === void 0 ? "" : zA(t[0], t[1], t[2], t[3]);
}
function uV(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, Bz)}`;
}
function dV(e) {
	let t = hV(e == null ? "" : String(e).trim(), fV + 1);
	return t > 0 && t <= fV ? "compact" : "";
}
var fV = 2, pV = /[\u0300-\uFFFF]/, mV = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function hV(e, t) {
	if (!pV.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of mV.segment(e)) {
		if (n >= t) break;
		n += gV(r) ? 2 : 1;
	}
	return n;
}
function gV(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < _V.length; e += 2) if (t >= _V[e] && t <= _V[e + 1]) return !0;
	return !1;
}
var _V = [
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
function vV(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Fe, dV(n)), e.setAttribute(Ie, "");
}
function yV(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, Wz)}`;
}
function bV(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return kV(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : kV(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : kV(e);
		}
		default: return "";
	}
}
function xV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = TV(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${RA(r.rgb >> 16 & 255)}${RA(r.rgb >> 8 & 255)}${RA(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${RA(e)}`;
	}
	let i = EV(r.name);
	return i === null ? "" : `${i}/${DV(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function SV(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function CV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = wV(e);
	return t === void 0 ? "" : `#${RA(t[0])}${RA(t[1])}${RA(t[2])}${RA(t[3])}`;
}
function wV(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = EV(t.name), i = n ?? (r === null ? void 0 : VB.get(r));
	if (!i) return;
	let a = DV(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = U(c * (1 - o)), l = U(l * (1 - o)), u = U(u * (1 - o))) : a === "Tint" && (c = U(c + (255 - c) * o), l = U(l + (255 - l) * o), u = U(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function TV(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = Bz[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function EV(e) {
	if (typeof e == "number") return HB.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function DV(e) {
	if (typeof e == "number") return EB[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function OV(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function kV(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function AV(e) {
	return e == null ? "" : kV(e);
}
function jV(e, t) {
	let n = Hw(e, t);
	if (n == null) return;
	let r = Q(n, aB);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var MV = "ui-announcer", NV = 7e3, PV = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : T.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), NV), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${MV}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = MV, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, FV = "ui-notification-host", IV = "ui-notification", LV = "ui-notification--leaving", RV = "ui-notification__message", zV = "ui-notification__title", BV = "ui-notification__action", VV = "ui-notification__close", HV = 5e3, UV = 8e3, WV = "ui-notification--connection", GV = "--ui-notification-lift", KV = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), qV = class {
	root;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? HV, this.ensureHost(), this.announcer = new PV(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = Vz(e.severity), n = document.createElement("div");
		n.className = KV.has(t) ? `${IV} ${IV}--${t}` : IV, n.classList.toggle(WV, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = RV, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = zV, T.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : T.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		i.type = "button", i.className = VV, T.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(XV(e.action, e.sticky === !0 ? null : () => this.dismiss(n)));
		let a = this.ensureHost();
		if (JV(a), a.append(n), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), e.sticky === !0) return n;
		let o = e.durationMs !== void 0 && e.durationMs > 0 ? e.durationMs : e.action === void 0 ? this.durationMs : UV, s = !1, c = !1, l = window.setTimeout(() => this.dismiss(n), o), u = () => window.clearTimeout(l), d = () => {
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
		if (!(!e.isConnected || e.classList.contains(LV))) {
			if (e.classList.add(LV), this.returnFocus(e), Wc() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => YV(e), P.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(LV));
		Ys(Gs(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${VV}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${FV}`), n = t ?? document.createElement("div");
		return n.classList.add(FV), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function JV(e) {
	let t = window.innerHeight - Pl(window.innerHeight);
	t > 0 ? e.style.setProperty(GV, `${Math.round(t)}px`) : e.style.removeProperty(GV);
}
function YV(e) {
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
function XV(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${BV} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : T.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function ZV(e, t) {
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
function QV(e, t, n) {
	let r = e.itemKey === !0 ? $V(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = eH(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	tH(i, r);
}
function $V(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function eH(e) {
	if (ho(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (ho(t)) return t;
	return null;
}
function tH(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || E(e) || O(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && Rz(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function nH(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : rH(t, e.request?.parameters ?? null);
}
function rH(e, t) {
	let n = iH(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function iH(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, aH(e));
	return t.toString();
}
function aH(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function oH(e, t) {
	let n = cH([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return cH(r, t) ?? sH(t);
}
function sH(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && lH(t, e) ? t : null;
}
function cH(e, t) {
	let n = null;
	for (let r of e) if (iw(r, t)) {
		if (lH(r, t)) return r;
		n ??= r;
	}
	return n;
}
function lH(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var uH = class {
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
	systemNotifications;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.runAction = e.runAction, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.navigate = e.navigate, this.address = e.address, this.clientStateChanged = e.clientStateChanged, this.windowId = e.windowId ?? "", this.systemNotifications = e.systemNotifications, this.registerDefaults();
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
			let t = nH(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Vd(t)) {
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
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Rn, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = hH(e);
			t !== null && _H(t);
		}), this.register("ScrollTo", (e) => {
			let t = hH(e);
			if (t === null) return;
			let n = e.effect, r = Ur(n.behavior), i = Wr(n.block);
			t.scrollIntoView({
				behavior: gH(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = hH(e);
			if (t === null) return;
			let n = e.effect, r = HP(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Wr(n.block);
			nF(wo(r)), UP(r, n.key, i === "Unknown" ? "Start" : i, gH(Ur(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = hH(e);
			if (t === null) return;
			let n = e.effect, r = qr(n.axis) !== "Horizontal", i = oH(t, r);
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
			let d = gH(Ur(n.behavior)), f = To(i);
			f !== null && JP(f), r && l === "End" && oF(i) && tF(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			mH(hH(e), null);
		}), this.register("Hide", (e) => {
			mH(hH(e), "hidden");
		}), this.register("Collapse", (e) => {
			mH(hH(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = vH(e, this.valueReaders);
			t !== null && yH(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = hH(e);
			t !== null && QV(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = hH(e);
			t !== null && !ud(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!Ld(t.requestPath)) {
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
				action: this.runAction === void 0 ? void 0 : ZV(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			typeof Notification > "u" || Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
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
	showSystemNotification(e) {
		let t = e.title;
		if (!ma(t) && !ha(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = ma(e.body) || ha(e.body) ? e.body : void 0, r = () => {
			if (e.fallback === "None" || this.notifications === void 0) return;
			let r = this.notifications, i = this.runAction === void 0 ? void 0 : ZV(e.action, this.runAction);
			MN(() => r.show(n === void 0 ? {
				message: t,
				action: i
			} : {
				title: t,
				message: n,
				action: i
			}));
		};
		if (e.when !== "Always" && document.visibilityState !== "hidden") {
			r();
			return;
		}
		let i = typeof e.action?.id == "string" ? e.action.id : void 0, a = this.runAction;
		jN({
			title: dH(t),
			body: n === void 0 ? void 0 : dH(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Vd(e.icon) ? e.icon : fH(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: typeof e.address == "string" && Vd(e.address) ? e.address : pH(),
			windowId: this.windowId,
			action: i
		}, () => {
			i !== void 0 && a !== void 0 && a(i);
		}, this.systemNotifications).then((e) => {
			e || r();
		});
	}
};
function dH(e) {
	return ma(e) ? T.translate(e.key, e.args) : ha(e) ? T.resolveText(e.text) : "";
}
function fH() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function pH() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function mH(e, t) {
	if (e !== null) for (let n of nr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function hH(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(C(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function gH(e) {
	return e === "Smooth" && !Wc() ? "smooth" : "auto";
}
function _H(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(gs))) {
		e.focus();
		return;
	}
	let t = Ms(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function vH(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = hH(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : co(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : no(t.readHeld(r));
}
async function yH(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!bH(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function bH(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return Lz();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var xH = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = Ms(t), i = ks() && ho(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Hs(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Ys(Gs(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Vl}="${Sr(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Ul}]`);
		if (n === null) return;
		let r = n.closest(`[${Vl}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Vl);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !ou() && !Xl(e.target) && !Wp(e.target)) {
				let n = t.getAttribute(Vl);
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
		return Kl(this.root);
	}
	trapTab(e, t) {
		let n = Ps(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = Ls(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, SH = "ui-leave", CH = new wf("data-ui-leave-part"), wH = "560px", TH = null, EH = null;
function DH(e, t) {
	TH ??= OH();
	let n = TH;
	n.isConnected || document.body.append(n), kH(n, "title", T.text("ui.leave.title")), kH(n, "message", T.text("ui.leave.message")), kH(n, "stay", T.text("ui.leave.stay")), kH(n, "leave", T.text("ui.leave.confirm")), EH = {
		dialogs: e,
		leave: t
	}, e.open(SH);
}
function OH() {
	let { dialog: e, surface: t } = Cf({
		key: SH,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", wH);
	let n = CH.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = CH.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, CH.actions(CH.button("ui-button--outline", "stay"), CH.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = CH.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = EH;
		EH = null, n?.dialogs.close(SH), t === "leave" && n?.leave();
	}), e;
}
function kH(e, t, n) {
	let r = CH.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var AH = class {
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
		let t = jH(e, this.options.window.location.href);
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
function jH(e, t) {
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
	return Vd(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var MH = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(rH(this.route, e), !1);
	}
	push(e) {
		let t = rH(this.route, e), n = this.window.location;
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
		e.search !== this.search && (this.search = e.search, this.revisit(NH(e.search)));
	}
};
function NH(e) {
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
var PH = class {
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
		!this.state.set(e, t, n, IH(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
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
		return this.state.set(e, t, n, IH(r[0]?.component)) ? {
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
			for (let o of Er(e, t, () => FH(e, a))) this.operations.apply({
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
			fo(e);
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
function FH(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(x) === e) return [n];
	return [e];
}
function IH(e) {
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
var LH = "EndValue", RH = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Qs) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = C(e.componentId), r = zH(n, e.propertyId), i = this.watchers.get(r);
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
			if (t.metadata !== void 0 && t.metadata.getPropertyDefinition(e.propertyId)?.propertyName === LH !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = zH(C(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function zH(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function BH(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : w(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var VH = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, HH(t));
	}
	apply(e) {
		let t = C(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), zr(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) UH(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) WH(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) GH(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) KH(n, t.key, t.newIndex);
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
function HH(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function UH(e, t) {
	typeof t.key == "string" && (WH(e, t.key), e.splice(qH(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function WH(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function GH(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		UH(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function KH(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(qH(n, e.length), 0, i);
}
function qH(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var JH = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, YH(e, "", t.map((e) => e.split("."))));
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
function YH(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : YH(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function XH(e) {
	let t = new JH();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(C(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var ZH = class {
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
}, QH = class {
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
function $H(e, t) {
	let n = eU(e[t], "Reset");
	if (n === null) return null;
	let r = C(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = eU(e[s], "Insert");
		if (t === null || C(t.component?.id) !== r || !hc(i, t.component?.dynamicParameters ?? [])) break;
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
function eU(e, t) {
	if (e === void 0 || Vr(e) !== "CollectionChange") return null;
	let n = e;
	return zr(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var tU = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function nU(e, t, n, r) {
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
var rU = [], iU = class {
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
	held = new VH();
	projections;
	moves = new ZH({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new QH({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => dU(z(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = XH(e), this.projections.isEmpty || Sv((e, t) => this.projections.check(e, t));
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
			return n === void 0 && (n = fU(e), t.set(e, n)), n;
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
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, uU(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of BH(i)) this.itemsRenderer.registerItemScope(e, t, r);
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
	resortHost(e) {
		let t = li(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		LM(e, t, {
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
				let r = $H(t, e);
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
		this.transfers.around(e, () => this.moves.around(e, rU, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (Q_(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = fU(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && hc(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), lU(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
			this.sinks.dispatch(i, nU(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
		let c = zr(e.action) === "Move" ? sU(e.moves ?? []) : rU;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (Q_(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (zr(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				aU(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				cU(e, n.moves ?? []);
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
		let n = Q_(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : Xv(e, z(e)).findIndex((e) => e.getAttribute(v) === t);
		return n < 0 ? null : n + $_(e);
	}
	moveRow(e, t, n) {
		let r = li(e);
		if (r === null) return;
		let i = Math.max(0, n - $_(e));
		Q_(e) === "virtualized" ? this.virtualization.move(e, t, i) : cU(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = z(e), r = dU(n, t);
		if (r === null) return null;
		let i = Xv(e, n), a = i.indexOf(r);
		return $v(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = Xv(e, z(e));
		ky(t.element), e.insertBefore(t.element, Qv(n, t.element, t.index)), this.afterRowsChanged(e);
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
		return eL(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = z(e), a = Xv(e, i), o = fU(e, i);
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
function aU(e, t) {
	let n = z(e), r = Xv(e, n), i = fU(e, n), a = oU(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? hs(a, o, n) : null;
		i.delete(t), $v(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function oU(e) {
	let t = e.parentElement, n = t?.closest(A) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function sU(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function cU(e, t) {
	let n = z(e), r = Xv(e, n), i = fU(e, n);
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
function lU(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? z(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function uU(e) {
	let t = w(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : w(n);
}
function dU(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function fU(e, t = z(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(v);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function pU(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return ma(n) || ha(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: hU(t.severity)
	} : void 0;
}
function mU(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = T.resolve(ma(t) || ha(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function hU(e) {
	let t = Ir(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var gU = "ui-validation--warning", _U = "ui-validation--info", vU = "ui-validation-message--marker", yU = "top-end", bU = "right", xU = "--ui-validation-marker-host", SU = "ui-validation-mark", CU = "--ui-validation-presentation", wU = "--ui-validation-color", TU = "Validation", EU = /* @__PURE__ */ new Set(["Value", "EndValue"]), DU = /* @__PURE__ */ new Set(["Min", "Max"]), OU = `input:not([type='hidden']), textarea, select, .${pr}[role='combobox'], [role='spinbutton']`, kU = {
	Error: 0,
	Warning: 1,
	Info: 2
}, AU = {
	Error: yr,
	Warning: gU,
	Info: _U
}, jU = `.${yr}, .${gU}, .${_U}`, MU = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, NU = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, PU = {
	Error: `${SU}--error`,
	Warning: `${SU}--warning`,
	Info: `${SU}--info`
}, FU = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, IU = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(jU)), F(this.root, jU, { childList: !0 }, (e) => this.applyRenderedMessages(e)), T.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(jU)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), T.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(jU)) {
			let t = w(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.forgetJudgement(i), o = this.options.metadata.getValidationsForComponent(r), s = t ?? (zU(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(i));
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
			HU(t, BU(t) === "Error");
			let e = t.querySelector(`:scope > [${br}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), UU(this.markerMirrors, t, e, {
				message: n,
				severity: BU(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(w(e), e) !== void 0)) return;
		let n = Ha(t), r = BU(e);
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
		if (e.propertyName === TU) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = EU.has(e.propertyName), n = DU.has(e.propertyName);
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
		let t = C(e.reference.componentId), n = pU(e.value);
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
			severity: hU(e.severity),
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
		let n = O(t) || E(t) ? null : LU(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return RU(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
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
			severity: FU[t]
		}), this.applyCurrentState(w(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(w(e))) if (hU(r.severity) === "Error" && jc(t, r.operator, r.value) && !jc(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !jc(t, r.operator, r.value) && (n === null || kU[hU(r.severity)] < kU[hU(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: NU[hU(n.severity)],
			words: n.message
		};
	}
	refuses(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return !1;
		let { componentId: n, element: r } = t, i = this.options.metadata.getValidationsForComponent(n);
		return this.touchedElements.add(r), this.judgeBounds(n, r), i.length > 0 && this.evaluateAndApply(n, r, i, zU(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(r)), this.hasError(n, r);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		VU(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(mU).join("\n"), !0);
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
			severity: hU(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || kU[e.severity] < kU[c.severity]) && (c = e);
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
		let i = zU(e.target) ? this.options.valueReaders.readBound(e.target) : this.options.valueReaders.readHeld(n.element);
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
			let e = [...t.element.querySelectorAll(OU)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Wc() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && hU(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) jc(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function LU(e, t) {
	return G_(e, t) ?? (e.matches(xb) ? px(e) : null);
}
function RU(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : ma(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function zU(e) {
	return !e.hasAttribute("data-ui-draft") && (e.hasAttribute("data-ui-value-kind") || e.matches("input, textarea, select"));
}
function BU(e) {
	return e.classList.contains(gU) ? "Warning" : e.classList.contains(_U) ? "Info" : "Error";
}
function VU(e, t, n) {
	for (let e of Object.values(AU)) t.classList.toggle(e, n !== void 0 && AU[n.severity] === e);
	HU(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(wU) : r.style.setProperty(wU, `var(--ui-color-${MU[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Ba(i, null), i.textContent = String(n.message ?? "")) : T.writeValue(i, null, n?.message ?? null), UU(e, r, i, n));
}
function HU(e, t) {
	for (let n of e.querySelectorAll(OU)) {
		let r = n.closest(fr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function UU(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(CU).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(vU, o), WU(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(xU).trim()), r !== void 0 && o) {
		n.setAttribute(Ae, n.textContent ?? ""), n.setAttribute(je, yU), n.setAttribute(Ne, NU[r.severity]), t.setAttribute(Me, ""), t.contains(document.activeElement) ? HE(n) : UE(n);
		return;
	}
	n.removeAttribute(Ae), n.removeAttribute(je), n.removeAttribute(Ne), t.removeAttribute(Me), UE(n);
}
function WU(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : KU(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && GU(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${SU} ${PU[n.severity]}`, s.textContent = r, s.setAttribute(Ae, r), s.setAttribute(je, bU), s.setAttribute(Ne, NU[n.severity]), s.setAttribute(Pe, ""), s.parentElement !== o && (GU(s), o.append(s)), o.setAttribute(Me, ""), e.set(t, s), UE(s);
}
function GU(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${SU}`) === null && t.removeAttribute(Me);
}
function KU(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var qU = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, JU = "tooltip-name";
function YU(e, t, n) {
	let r = bT(e.getAttribute(Ae));
	if (Ba(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var XU = /* @__PURE__ */ new WeakMap(), ZU = /* @__PURE__ */ new WeakMap(), QU = class {
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
			ST(e.target, ro(e.convertedValue) ? "" : no(e.convertedValue)), Ba(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = aW(e.operation);
			if (Ba(e.target, t), ro(e.value) || ro(e.convertedValue)) {
				iW(e.target, t);
				return;
			}
			rW(e.target, t, no(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = aW(e.operation);
			Ba(e.target, t), iW(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = aW(e.operation), n = !ro(e.value) && $U(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (ro(e.convertedValue) ? "" : no(e.convertedValue));
			eW(e.target, nW(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !ro(e.value) && $U(e.value, e.operation.condition ?? "None") ? no(e.convertedValue).trim() : "";
			tW(e.target, nW(e), t, OB(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = aW(e.operation), n = !ro(e.value) && $U(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? no(e.convertedValue).trim() : "";
				tW(e.target, nW(e), t, OB(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = aW(e.operation), n = e.target;
			if (ro(e.value) || ro(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = no(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(JU, (e) => YU(e.resolved.component, e.target, aW(e.operation))), this.register(kz, (e) => Mz(e.target, e.value)), this.register("Property", (e) => {
			let t = aW(e.operation), n = e.target, r = ro(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function $U(e, t) {
	switch (Rr(t)) {
		case "None": return !0;
		case "HasValue": return !ro(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !ro(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return sf(e).length > 0;
		default: return !ro(e);
	}
}
function eW(e, t, n, r, i) {
	let a = ZU.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), ZU.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), rW(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && iW(e, n);
}
function tW(e, t, n, r) {
	let i = XU.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), XU.set(e, i));
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
function nW(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function rW(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function iW(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function aW(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var oW = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => MB.has(e.name),
			convert: (e) => MB.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = sW(e.name), n = {
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
function sW(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var cW = class {
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
function lW(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function uW(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(ps, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => lW(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => lW(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var dW = class {
	converters = new oW();
	events = new cW();
	operations = new QU();
	valueReaders;
	collectionSinks = new tU();
	rowDecorators = new qU();
	constructor(e, t, n, r) {
		uW(this.events), this.valueReaders = new ao(r);
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
}, fW = "Submenu", pW = "ui-menu__submenu", mW = "Select", hW = {
	kind: "menu",
	decorate: gW
};
function gW(e) {
	if (!_W(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, fW);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Mt, ""), vW(e.item, "Kind") === mW && e.row.setAttribute(Nt, ""), vW(e.item, "Expanded") === !0 && e.row.setAttribute(Pt, "");
	let r = document.createElement("div");
	r.className = pW, r.appendChild(n), gI(r, e.key, e.item), e.row.appendChild(r);
}
function _W(e) {
	let t = vW(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function vW(e, t) {
	let n = kv(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var yW = {
	kind: "grip",
	decorate: bW
};
function bW(e) {
	e.row.append(xW());
}
function xW() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), T.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function SW(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(wW(n));
	for (let t of e.querySelectorAll(`[${Qe}]`)) CW(t, Ze, r), CW(t, nt, i);
}
function CW(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function wW(e) {
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
var TW = 2;
function EW(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= TW && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function DW(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var OW = "ne.standard.ui.windowId", kW = [
	500,
	1e3,
	2e3
], AW = 3, jW = [
	["refusal", ({ root: e }) => JF(e)],
	["file input", ({ root: e, validation: t }) => new vd({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new wp({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new Bp({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e }) => new fm({ root: e })],
	["field box press", ({ root: e }) => new am({ root: e })],
	["image fallback", ({ root: e }) => new xm({ root: e })],
	["radio group sync", ({ root: e }) => new Mm({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new $h({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new oh({ root: e })],
	["debounced commit", ({ root: e }) => new vg({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new dg({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => xg() ? void 0 : new Sg({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new eN({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Yg({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new mj({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new hS({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new HS({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new eC({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new vP({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new zP({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new HC({ root: e })],
	["split button", ({ root: e }) => new Nk({ root: e })],
	["toggle button", ({ root: e }) => new qp({ root: e })],
	["button group", ({ root: e }) => new zk({ root: e })],
	["menu", ({ root: e }) => new QE({ root: e })],
	["action bar", ({ root: e }) => new bw({ root: e })],
	["collapsible", ({ root: e }) => new RO({ root: e })],
	["menu group", ({ root: e }) => new rT({ root: e })],
	["menu search", ({ root: e }) => new pO({ root: e })],
	["side drawer", ({ root: e }) => new DO({ root: e })],
	["skip link", ({ root: e }) => new MO({ root: e })],
	["screen keyboard", () => new Ky()],
	["grid splitter", ({ root: e }) => new yk({ root: e })],
	["accordion", ({ root: e }) => new Uk({ root: e })],
	["tabs", ({ root: e }) => new mA({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new QN({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new CA({ root: e })],
	["breadcrumbs", ({ root: e }) => new IA({ root: e })],
	["scroll anchor", ({ root: e }) => new rF({ root: e })],
	["surface press", ({ root: e }) => new dF({ root: e })],
	["text selection", ({ root: e }) => new _F({ root: e })],
	["scroll group", ({ root: e }) => new wF({ root: e })],
	["flyout interaction", ({ root: e }) => new Au({ root: e })],
	["text fold", ({ root: e }) => new lP({ root: e })],
	["tooltip", ({ root: e }) => pE(e)]
], MW = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Or(CL());
	hydration = DL();
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
		this.options = e, this.root = e.root ?? document, this.windowId = IW(e.windowIdStorageKey ?? OW), this.dom = new ci(this.root), T.load(this.root), T.setLanguage(document.documentElement.lang), e.strings !== void 0 && T.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : T.loadTableAsync(this.hydration.words.href)), this.extensions = new dW(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(hW), this.extensions.registerRowDecorator(yW);
		let t = new ei(this.dom, this.metadata), n = this.extensions.operations, r = new $L(), i = new PH(t, n, this.extensions, r);
		this.reactiveSources = new RH(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new xH({ root: this.root }), this.notifications = new qV({ root: this.root });
		let a = new MH({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		}), o = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), u = RL(document.documentElement, this.windowId, (e) => void o(e));
		this.effects = new uH({
			address: a,
			dialogs: this.dialogs,
			notifications: this.notifications,
			runAction: o,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e),
			clientStateChanged: () => this.clientState.changed(),
			windowId: this.windowId,
			systemNotifications: AN(u)
		});
		let d = new Rc(this.metadata), f, p = new Tc(d, i, new Ac(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				f?.syncPropertyAsync(C(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), m = new yL(this.dom), h = new fI(this.metadata, m, this.extensions, n, r);
		this.virtualization = new iL({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new iU(this.metadata, i, r, h, m, this.dom, this.virtualization, this.extensions.collectionSinks), T.onChange(() => this.rewriteWords(i, h)), this.rewriteMoments = () => this.rewriteWords(i, h, !0), T.onMomentTick(this.rewriteMoments), new SI({
			root: this.root,
			metadata: this.metadata,
			templates: m,
			renderer: h,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new pz(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.clientState = new PL({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new JL(this.transport), T.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Dr.SetLanguage, (e) => {
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
				xL(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && xL(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let g = new Tz(this.transport);
		f = new rc({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: g,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => _.refusesBounds(e)
		}), i.setHeldTargets((e) => f?.isHeld(e) === !0), this.effects.register(Dr.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of f?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				_.discardForm(t);
			}
		}), this.leaveGuard = new AH({
			window,
			ask: async (e) => (await f?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => DH(this.dialogs, t),
			pending: () => gg() || g.isBusy,
			settle: async () => {
				_g(), await g.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Dr.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Vd(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let _ = new IU({
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
			dialogs: this.dialogs
		};
		for (let [e, t] of jW) EW(e, t, this.engineContext);
		EW("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new U_({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), EW("tree", ({ root: e, effects: t }) => new CN({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: h
			}
		}), this.engineContext), EW("items reorder", ({ root: e }) => new hy({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), EW("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new zF({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", w(e)) || p.hasEventForComponent("click", w(e))
		}) : void 0, this.engineContext), this.eventPipeline = new dc({
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
		this.eventPipeline.addEvent(JN.name, JN.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = fy({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = XN(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration);
		let re = db(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, re);
		this.eventPipeline.addEvent(um.name, um.registration), EW("shortcuts", ({ root: e, dom: t }) => new sD({
			root: e,
			viewShortcuts: cD(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), EW("item drag", ({ root: e, dom: t }) => new mb({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new cM({ root: this.root }), this.windows = new RI({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), EW("pager", ({ root: e, dom: t }) => new JD({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: T,
			observeComponents: F,
			observeSize: Nj,
			store: new Kw(),
			numbers: C_,
			temporal: Yi,
			icons: { apply: rf },
			badges: { writeCount: vV },
			urls: {
				isImageSource: Gd,
				asBrowserReads: Wd,
				isSafeLink: Ld,
				isExternalLink: Bd
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => f?.hold(e),
				release: (e) => {
					f?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(x), a = r === null ? void 0 : this.metadata.getExposedProperty(w(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: VE,
			renames: { open: Zl },
			tables: this.tables,
			rows: dI(m, h, this.virtualization),
			uploads: sd(_),
			selection: Xo,
			popups: uI,
			roving: bo,
			focus: Ns,
			states: to,
			validation: _,
			wheel: Mf,
			shortcuts: zy,
			names: xr
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			QL(() => this.applyChanges(t), () => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new qL({
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
		this.dom.invalidate(), T.language !== this.culturesLanguage && (this.culturesLanguage = T.language, Ga(this.root, (e) => SW(e, T.number, T.temporal)));
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
			for (let o of r) for (let r of o.querySelectorAll(`[${ie}="${Sr(n)}"]`)) ii(r, a) && e.rewriteStatic(r, i, t.key);
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
		let t = HL(e, navigator.cookieEnabled, WL());
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
		if (HL(e, navigator.cookieEnabled, WL()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ee(this, this.options.handlerGlobalKey), Nz(this.root), await FW();
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
		return za(this.root) || EL(this.hydration) || this.metadata.getWords().some((e) => va(e.key)) || va(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) EW(DW(t), t, this.pluginContext);
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
		EW(DW(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !vz(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = this.transport.instanceId, r = (this.inbound ?? Promise.resolve()).then(() => (t?.(), yz(e, n))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= AW) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (UL(WL()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(vz(e) ? await yz(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = RW(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? NH(window.location.search) : e.parameters,
			timeZone: AL(),
			clientState: this.clientState.forAttach()
		};
		return this.renderSequence = null, await kL(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, kW, PW);
	}
};
async function NW(e = {}) {
	let t = performance.now(), n = new MW(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function PW(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function FW() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function IW(e) {
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
	let n = LW();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function LW() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function RW() {
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
_(), NW().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
