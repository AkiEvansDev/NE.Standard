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
	return ee();
}
function v(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ee();
	n.runtime = e, te(e, n);
}
function ee() {
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
			let r = ne(e, t), i = window.NEStandardUI?.runtime;
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
function te(e, t) {
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
var y = "data-ui-id", re = "data-ui-context", ie = "data-ui-pc", b = "data-ui-key", ae = "data-ui-unselectable", oe = "data-ui-undraggable", se = "data-ui-unremovable", ce = "data-ui-unrenamable", le = "data-ui-no-context-menu", ue = "data-ui-no-row-open", de = "data-ui-no-row-drag", fe = "data-ui-drag-kind", pe = "data-ui-drag-source", me = "data-ui-item-drop-over", he = "ui-row__grip", ge = "data-ui-row-drop", _e = "data-ui-tabs-draggable", ve = "data-ui-tabs-menu", ye = "data-ui-context-menu", be = "data-ui-context-menu-use", xe = "data-ui-action-bar", Se = "data-ui-action-bar-key", Ce = "data-ui-action-bar-rest", we = "data-ui-menu-left-out", Te = "data-ui-in-action-bar", Ee = "ui-action-bar", De = "data-ui-row-focus", Oe = "data-ui-tooltip", ke = "data-ui-tooltip-placement", Ae = "data-ui-tooltip-mark", je = "data-ui-tooltip-severity", Me = "data-ui-tooltip-press", Ne = "data-ui-badge-text", Pe = "data-ui-badge-set", Fe = "data-ui-name", Ie = "data-ui-bind-", Le = "data-ui-into-", Re = "data-ui-bind-value", ze = (e) => `data-ui-no-${e}`, Be = "data-ui-event-boundary", Ve = "data-ui-image-caption", He = "data-ui-image-crop", Ue = "data-ui-image-crop-size", We = "ui-image", Ge = "data-ui-fallback-src", Ke = "data-ui-image-failed", x = "data-ui-items-host", qe = "data-ui-collection-sink", Je = "data-ui-items-query", Ye = "data-ui-number-culture", Xe = "data-ui-page-culture", Ze = "data-ui-pager-target", Qe = "data-ui-pager-page", $e = "data-ui-pager-size", et = "data-ui-temporal-culture", tt = "data-ui-empty-template", nt = "data-ui-group-template", rt = "data-ui-empty-placeholder", it = "data-ui-group-header", at = "data-ui-group-anchor", ot = "data-ui-group", st = "data-ui-value-holder", ct = "data-ui-value-end", lt = "data-ui-value-kind", ut = "items-query", dt = "data-ui-host-mode", ft = "data-ui-host-viewport", pt = "data-ui-scroll-group", mt = "data-ui-scroll-lines", ht = "data-ui-source-line", gt = "data-ui-window-spacer", _t = "data-ui-window-pending", vt = "data-ui-window-paged", yt = "data-ui-window-size", bt = "data-ui-window-offset", xt = "data-ui-window-total", St = "data-ui-window-more-before", Ct = "data-ui-window-more-after", wt = "data-ui-window-group-before", Tt = "data-ui-window-aggregates", Et = "data-ui-form-id", Dt = "data-ui-forms", Ot = "data-ui-visibility", kt = "data-ui-collapsed", At = "data-ui-menu-group", jt = "data-ui-menu-select", Mt = "data-ui-menu-open", Nt = "data-ui-menu-search", Pt = "data-ui-menu-searching", Ft = "data-ui-menu-unmatched", It = "data-ui-drawer-toggle", Lt = "data-ui-drawer-open", Rt = "data-ui-bottom-bar", zt = "data-ui-rail-drawer", Bt = "data-ui-region", Vt = "data-ui-menu-item-kind", Ht = "ui-menu", S = "ui-menu-item", Ut = "ui-menu-item--checked", Wt = "ui-menu-item--selected", Gt = "ui-menu--rail", Kt = `[${Vt}="header"], [${Vt}="separator"]`, qt = `[${At}] > .${S}`, Jt = `${qt}, .${S}[${Vt}="check"]`, Yt = "data-ui-shortcut", Xt = "data-ui-collapse-toggle", Zt = "data-ui-folding", Qt = "data-ui-column-limits", $t = "data-ui-row-limits", en = "data-ui-splitter-step", tn = "data-ui-table-column", nn = "data-ui-table-hide-below", rn = "data-ui-table-starts-hidden", an = "data-ui-table-hidden", on = "ui-table__row", sn = "ui-table__scroll", cn = "ui-table__header", ln = "ui-table__resizer", un = "ui-tree", dn = "ui-tree__row", fn = "ui-tree-node", pn = "data-ui-tree-drop", mn = "ui-tree__row--filtered", hn = "data-ui-table-last", gn = "data-ui-table-reordering", _n = "data-ui-table-dragging", vn = "data-ui-table-drop", yn = "data-ui-table-scrolled", bn = "data-ui-table-scrollbar", xn = "data-ui-no-row-select", Sn = "data-ui-tree-parent", Cn = "data-ui-tree-children", wn = "data-ui-tree-folder", Tn = "data-ui-tree-expanded", En = "data-ui-tree-title", Dn = "data-ui-tree-loading", On = "data-ui-tree-drop-target", kn = "data-ui-tree-boot", An = "data-ui-tree-draggable", jn = "data-ui-row-editing", Mn = "data-ui-image-source", Nn = "data-ui-file-max-size", Pn = "data-ui-file-pick", Fn = "data-ui-file-drop-target-id", In = "data-ui-service-worker", Ln = "data-ui-theme", Rn = "data-ui-theme-colors", zn = "data-ui-words", Bn = "data-ui-language-switcher", Vn = "data-ui-language", Hn = "data-ui-splitting", Un = "data-ui-keyboard-up", Wn = "data-ui-connection", Gn = "data-ui-split-folded", Kn = "data-ui-pointer-focus", qn = "data-ui-selection", Jn = "data-ui-selected", Yn = "data-ui-selected-key", Xn = "data-ui-selected-keys", Zn = "data-ui-bind-selected-key", Qn = "data-ui-tabs-selected", $n = "data-ui-tab-caption", er = "data-ui-tab-pinned", tr = [
	Ot,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], nr = "data-ui-submit-form-id", C = `[${y}]`, rr = "data-ui-href", ir = "ui-disabled", ar = "ui-loading", or = "ui-readonly", sr = "ui-hidden", cr = "ui-dialog__surface", lr = "ui-flyout__content", ur = "data-ui-focus-holder", dr = "[role='listbox'], [role='menu'], [role='dialog']", fr = "ui-select__trigger", pr = `.${fr}`, mr = "ui-button", hr = `${mr} ui-button--ghost ui-button--small`, gr = "ui-select", _r = "ui-text-input", vr = "ui-invalid", yr = "data-ui-validation-message", br = {
	componentId: y,
	key: b,
	selected: Jn,
	selectedKey: Yn,
	selectedKeys: Xn,
	unselectable: ae,
	rowFocus: De,
	itemsHost: x,
	valueHolder: st,
	bindValue: Re,
	noRowOpen: ue,
	noRowDrag: de,
	eventBoundary: Be,
	focusHolder: ur,
	tooltip: Oe,
	tooltipPlacement: ke,
	contextMenu: ye,
	contextMenuUse: be,
	actionBar: xe,
	actionBarKey: Se,
	actionBarRest: Ce,
	disabledClass: ir,
	loadingClass: ar,
	readOnlyClass: or,
	hiddenClass: sr,
	buttonClass: mr,
	selectClass: gr,
	textInputClass: _r,
	invalidClass: vr,
	validationMessage: yr,
	sourceLine: ht,
	popupSelector: dr,
	listTriggerSelector: pr,
	tableRowClass: on,
	tableScrollClass: sn,
	tableHeaderClass: cn,
	tableResizerClass: ln,
	tableHidden: an,
	hostMode: dt,
	windowOffset: bt,
	windowTotal: xt,
	windowSize: yt,
	windowMoreAfter: Ct,
	windowAggregates: Tt,
	itemsQuery: Je,
	valueKind: lt,
	itemsQueryKind: ut,
	menuItemClass: S,
	menuItemKind: Vt,
	menuItemCheckedClass: Ut
};
function xr(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Sr(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Cr = 0;
function wr(e, t) {
	return e.id.length === 0 && (Cr++, e.id = `${t}-${Cr}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Tr(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(C) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Er = {
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
}, Dr = class {
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
		return this.bindingsByComponentAndPropertyId.get(Xr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Xr(e, Yr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(Zr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Jr(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Jr(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Qr(e, t))?.items ?? [];
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
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Xr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Xr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Jr(e.eventName), n = T(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(Zr(n, t), e), this.eventNames.add(t);
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
		t > 0 && this.itemValuesByAddress.set(Qr(t, e.dynamicParameters ?? []), e);
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
function Or(e) {
	return w(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function kr(e) {
	return e == null ? "OneWay" : w(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Ar(e) {
	return w(e, ["Property", "Event"]);
}
function jr(e) {
	return e == null ? "SetProperty" : w(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Mr(e) {
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
function Nr(e) {
	return w(e, ["Ascending", "Descending"]);
}
function Pr(e) {
	return w(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Fr(e) {
	return w(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Ir(e) {
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
function Lr(e) {
	return w(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Rr(e) {
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
function zr(e) {
	return typeof e == "string" ? e : "";
}
function Br(e) {
	return w(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Vr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Hr(e) {
	return w(e, ["Auto", "Smooth"]);
}
function Ur(e) {
	return w(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Wr(e) {
	return w(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function Gr(e) {
	return w(e, ["Light", "Dark"]);
}
function Kr(e) {
	return w(e, ["Horizontal", "Vertical"]);
}
function qr(e) {
	return w(e, ["Polite", "Assertive"]);
}
function Jr(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Yr(e) {
	return e?.trim() ?? "";
}
function Xr(e, t) {
	return `${e}:${Yr(t)}`;
}
function Zr(e, t) {
	return `${e}:${Jr(t)}`;
}
function Qr(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var $r = class {
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
		let a = T(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Ie}${Sr(r.propertyName)}="${xr(a)}"]` : null;
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
		return Tr(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Sr(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ei(e) {
	return ii(e, ie);
}
function ti(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = ai(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function ni(e, t) {
	let n = ei(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = ti(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function ri(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = ai(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function ii(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function ai(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function oi(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var si = class {
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
		let e = this.root.querySelectorAll(C), t = this.root.querySelector(`[${it}]`) !== null;
		for (let n of e) {
			let e = E(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && di(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return wr(e, t);
	}
	findComponentParts(e, t, n) {
		return oi(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(ui(t)) ?? [];
		if (n.length > 0 && n.every((e) => ni(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => ni(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = ei(n);
			if (e === 0) continue;
			let r = ti(n, e);
			if (r.length !== e) continue;
			let i = ui(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(C);
			if (e === null || !fi(this.root, e)) return null;
			let r = E(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: ti(e, ei(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function E(e) {
	return ii(e, y);
}
function ci(e) {
	let t = e.closest(C), n = t === null ? 0 : E(t);
	return n > 0 ? n : null;
}
function li(e) {
	let t = e.closest(C), n = t === null ? 0 : E(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: ti(t, ei(t))
	};
}
function ui(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function di(e) {
	return ei(e) === 0;
}
function fi(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function pi(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = mi(n);
	switch (hi(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : gi(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : gi(r, i) ? "many" : "other";
		case "ru":
		case "uk": return _i(r, i);
		case "pl": return vi(r, i);
		default: return "other";
	}
}
function mi(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function hi(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function gi(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function _i(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function vi(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function yi(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var bi = {
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
function xi(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return bi;
	try {
		return {
			...bi,
			...JSON.parse(t)
		};
	} catch {
		return bi;
	}
}
var Si = [
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
function Ci(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Ai(e.getFullYear(), 4)}-${Ai(e.getMonth() + 1, 2)}-${Ai(e.getDate(), 2)} ${Ai(e.getHours(), 2)}:${Ai(e.getMinutes(), 2)}:${Ai(e.getSeconds(), 2)}`;
	let r = "", i = wi(t);
	for (let a = 0; a < t.length;) {
		let o = Oi(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += ki(o, e, n, i), a += o.length;
	}
	return r;
}
function wi(e) {
	for (let t = 0; t < e.length;) {
		let n = Oi(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var Ti = /^[-./:,]$/, Ei = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function Di(e) {
	for (let t = 0; t < e.length;) {
		let n = Oi(e, t);
		if (n !== null && Ei.has(n) || n === null && !Ti.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Oi(e, t) {
	for (let n of Si) if (e.startsWith(n, t)) return n;
	return null;
}
function ki(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return Ai(t.getFullYear(), 4);
		case "yy": return Ai(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Ai(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Ai(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Ai(i, 2);
		case "H": return String(i);
		case "hh": return Ai(a, 2);
		case "h": return String(a);
		case "mm": return Ai(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Ai(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Ai(e, t) {
	return String(e).padStart(t, "0");
}
var ji = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Mi(e) {
	let t = ji.exec(e.trim());
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
function Ni(e) {
	return Pi(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Pi(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Fi = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Ii(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Oi(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += Li(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function Li(e, t) {
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
function Ri(e, t, n) {
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
		let a = Oi(t, e);
		if (a === null) {
			if (!zi(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Bi(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? qi(i) : null;
}
function zi(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return Ti.test(n) ? t.position >= e.length || !Ti.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Bi(e, t, n, r) {
	switch (n) {
		case "yyyy": return Vi(t, "year", Wi(e, t, 4, 4));
		case "yy": return Vi(t, "year", Hi(Wi(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Vi(t, "month", Ui(Gi(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Vi(t, "month", Wi(e, t, 1, 2));
		case "dddd":
		case "ddd": return Gi(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Vi(t, "day", Wi(e, t, 1, 2));
		case "HH":
		case "H": return Vi(t, "hour", Wi(e, t, 1, 2));
		case "hh":
		case "h": return Vi(t, "hour12", Wi(e, t, 1, 2));
		case "mm":
		case "m": return Vi(t, "minute", Wi(e, t, 1, 2));
		case "ss":
		case "s": return Vi(t, "second", Wi(e, t, 1, 2));
		case "tt": return Ki(e, t, r);
		default: return !1;
	}
}
function Vi(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Hi(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Ui(e) {
	return e === null ? null : e + 1;
}
function Wi(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function Gi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Ki(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function qi(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Pi(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Ji = {
	readCulture: xi,
	format: Ci,
	parse: Mi,
	toDate: Ni
}, Yi = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Xi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Zi(e) {
	let t = e?.trim() ?? "";
	if (!Xi.test(t)) return null;
	let n = Date.parse(Yi.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Qi(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function $i(e) {
	return e === "relative" || e === "relative-date";
}
var ea = {
	...bi,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function ta(e, t, n, r) {
	if (t === "relative") return da(e - r, n.language);
	if (t === "relative-date") {
		let t = na(e, r);
		if (t !== null) return aa(n.language).format(t, "day");
	}
	let i = n.temporal ?? ea, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : yi(i, !1);
	return Ci(new Date(e), a, i);
}
function na(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / ua);
	return Math.abs(i) <= 1 ? i : null;
}
function ra(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(oa(t)) + e.slice(1);
}
var ia = /* @__PURE__ */ new Map();
function aa(e) {
	let t = ia.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(oa(e), { numeric: "auto" }), ia.set(e, t)), t;
}
function oa(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var sa = 1e3, ca = 60 * sa, la = 60 * ca, ua = 24 * la;
function da(e, t) {
	let n = aa(t), r = Math.abs(e);
	return r < 45 * sa ? n.format(0, "second") : r < 45 * ca ? n.format(Math.round(e / ca), "minute") : r < 22 * la ? n.format(Math.round(e / la), "hour") : r < 26 * ua ? n.format(Math.round(e / ua), "day") : r < 320 * ua ? n.format(Math.round(e / (30.4375 * ua)), "month") : n.format(Math.round(e / (365.25 * ua)), "year");
}
//#endregion
//#region src/runtime/words.ts
var fa = "count";
function pa(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function ma(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var ha = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function ga(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && Zi(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && ha.has(t.format));
}
function _a(e) {
	if (typeof e != "object" || !e) return !1;
	if (ga(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (_a(t)) return !0;
	return !1;
}
function va(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function ya(e, t, n) {
	return pa(e) ? Sa(n, e.key, e.args) : ma(e) ? ba(n, e.text) : t && typeof e == "string" ? ba(n, e) : e;
}
function ba(e, t) {
	return t.trim().length === 0 || !xa(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function xa(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Sa(e, t, n) {
	let r = n?.[fa];
	return Ca(typeof r == "number" ? e.lookup(`${t}.${pi(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => ma(t) ? ba(e, t.text) : Sa(e, t.key, t.args), e.writeMoment);
}
function Ca(e, t, n, r = va) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = wa(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += Ea(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function wa(e, t) {
	let n = t + 1;
	for (; n < e.length && Ta(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Ta(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Ea(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : pa(e) ? t === void 0 ? Ca(e.key, e.args, void 0, n) : t(e) : ma(e) ? t === void 0 ? e.text : t(e) : ga(e) ? n(Zi(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var Da = 15e3, Oa = /* @__PURE__ */ new Set(), ka = null;
function Aa(e) {
	Oa.add(e), ka === null && (ka = setInterval(ja, Da));
}
function ja() {
	for (let e of [...Oa]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Oa.delete(e);
	}
	Oa.size === 0 && ka !== null && (clearInterval(ka), ka = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Ma = 256, Na = 512, Pa = "script[type='application/json'][data-ui-strings]", Fa = "#text", Ia = `[${zn}*='"moment"']`, La = class {
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
		let t = e.querySelector(Pa)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Sa(this, e, t);
	}
	translate(e, t) {
		return Sa(this, e, t);
	}
	writeMoment = (e, t) => ($i(t) && this.noteRelative(), ta(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Aa(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return ya(e, t, this);
	}
	resolveText(e) {
		return ya(e, !0, this);
	}
	write(e, t, n, r) {
		Ua(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Ua(e, t, ya(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (pa(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = ma(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Ua(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Ba(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Wa(e, (e) => {
			for (let n of e.querySelectorAll(t ? Ia : `[${zn}]`)) for (let [e, r] of Object.entries(Ha(n))) {
				if (t && !_a(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && Ua(n, e === Fa ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return ya(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Na || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && xa(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Ma) try {
			let a = await e(t, n.slice(r, r + Ma));
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
function Ra(e) {
	let t = !1;
	return Wa(e, (e) => {
		t ||= e.querySelector(Ia) !== null;
	}), t;
}
function za(e, t) {
	e.hasAttribute("data-ui-words") && Ba(e, t, null);
}
function Ba(e, t, n) {
	let r = Ha(e), i = t ?? Fa;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(zn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(zn, a);
}
function Va(e) {
	let t = Ha(e)[Fa];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Ha(e) {
	let t = e.getAttribute(zn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Ua(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Wa(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Wa(n.content, t);
}
var D = new La();
function Ga(e, t) {
	let n = ma(e) ? e.text : e;
	return D.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var Ka = `.${ir}, .${ar}, [inert]`;
function qa(e) {
	return `:scope > [${y}]:is(${e}), :scope > :not([${y}]) > [${y}]:is(${e})`;
}
var Ja = qa(Ka), Ya = /* @__PURE__ */ new Map();
function O(e) {
	return e.closest(Ka) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function k(e) {
	return e.matches(Ka) || e.querySelector(Ja) !== null;
}
function Xa(e, t) {
	if (e.hasAttribute(t)) return !0;
	let n = Ya.get(t);
	return n === void 0 && (n = qa(`[${t}]`), Ya.set(t, n)), e.querySelector(n) !== null;
}
function Za(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Qa = `[${y}], .${or}`;
function A(e) {
	return e.closest(Qa)?.matches(`.${or}`) === !0;
}
function $a(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(ir, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var eo = {
	isInert: O,
	isReadOnly: A,
	setDisabled: $a
};
//#endregion
//#region src/extensions/value-readers.ts
function to(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function no(e) {
	return e == null;
}
var ro = "data-ui-trim-input", io = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of co) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(lt);
		if (t === null) return ao(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(ro) ? t.trim() : t;
	}
	readHeld(e) {
		let t = so(e);
		return t === null ? null : this.read(t);
	}
};
function ao(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var oo = "input, textarea, select";
function so(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(oo) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${oo}`);
}
var co = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(Qn)
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute($n)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(er)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(En)
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
		read: (e) => lo(e, Xn)
	},
	{
		kind: ut,
		read: (e) => lo(e, Je)
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
function lo(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function uo(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var fo = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function po(e) {
	return e instanceof HTMLInputElement && fo.has(e.type);
}
function mo(e) {
	return po(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var ho = "ui-draft-dropped";
function go(e) {
	e.dispatchEvent(new Event(ho, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function _o(e) {
	let t = xo(e.key), n = So(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(bo);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function vo(e, t) {
	return xo(e) !== null || So(e, t) !== 0;
}
var yo = {
	target: _o,
	applyTabIndex: j
};
function j(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function bo(e) {
	return e.getClientRects().length > 0 && !O(e);
}
function xo(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function So(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/items/items-viewport.ts
function Co(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function wo(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${x}][${ft}]`) : null;
}
function To(e) {
	let t = Co(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - Do(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function Eo(e, t) {
	let n = Co(e);
	n.scrollTop = n === e ? t : t + Do(e, n);
}
function Do(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/selected-key.ts
function Oo(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var ko = "data-ui-bind-selected-keys", M = `.ui-items-view, .ui-table, .${un}`, Ao = `.ui-items-view__item, .${on}, .${dn}`, jo = ".ui-items-view, .ui-table", Mo = {
	shift: !1,
	ctrl: !1
}, No = /* @__PURE__ */ new WeakMap();
function Po(e, t) {
	t !== null && !No.has(e) && Fo(e, t);
}
function Fo(e, t) {
	let n = P(t);
	n.length > 0 && No.set(e, n);
}
function Io(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Lo(e, t) {
	let n = Io(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Ro(e) {
	return !e.hasAttribute(xn);
}
function N(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${y}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function zo(e) {
	switch (e.getAttribute(qn)) {
		case "one": {
			let t = e.getAttribute(Yn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(qo(Jo(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Bo(e, t) {
	let n = zo(e), r = e.getAttribute(qn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(P(e));
		e.toggleAttribute(Jn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Vo(e) {
	return e.filter((e) => e.hasAttribute(Jn));
}
function Ho(e, t, n, r) {
	let i = P(n);
	if (!Go(n)) return !1;
	switch (e.getAttribute(qn)) {
		case "one": return Oo(e, i, {
			attribute: Yn,
			bindingAttribute: Zn,
			apply: (e) => Bo(e, t)
		}), !0;
		case "many": return Uo(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Uo(e, t, n, r, i) {
	let a = Jo(e);
	if (a === null) return;
	let o = qo(a), s;
	if (i.shift) {
		let r = Ko(t, t.find((t) => P(t) === No.get(e)) ?? n, n).map(P);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], No.set(e, r)) : (s = [r], No.set(e, r));
	Wo(e, t, s);
}
function Wo(e, t, n) {
	let r = Jo(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Xn, i), Bo(e, t), r.hasAttribute(ko) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Go(e) {
	return P(e).length > 0 && !Xa(e, "data-ui-unselectable") && !k(e);
}
function Ko(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => N(e) !== null && Go(e));
}
function qo(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Jo(e) {
	let t = e.closest(C);
	for (let n of e.querySelectorAll(`[${x}]`)) if (n.closest(M) === e && n.closest(C) === t) return n;
	return null;
}
function P(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Yo = {
	isSelected: (e) => e.hasAttribute(Jn),
	toggle: Xo,
	setSelected: Zo,
	setSelectedKeys: Qo
};
function Xo(e) {
	let t = e.closest(M);
	t !== null && e instanceof HTMLElement && Ho(t, $o(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Zo(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(P(e));
	Qo(e, r, n);
}
function Qo(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = $o(e), i = new Set(r.filter((e) => !Go(e)).map(P)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...zo(e)].filter((e) => !a.has(e));
	Wo(e, r, n ? [...o, ...a] : o);
}
function $o(e) {
	return [...e.querySelectorAll(Ao)].filter((t) => t.closest(M) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function es(e) {
	let t = e.closest(M);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Ao);
	return n !== null && n.closest(M) === t ? {
		root: t,
		row: n
	} : null;
}
function ts(e) {
	return e.filter((e) => N(e) !== null && !k(e));
}
function ns(e) {
	return rs(e) ?? ts(e)[0] ?? null;
}
function rs(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !k(e)) ?? null;
}
function is(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", wr(t, "ui-row-name"));
}
function as(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(De);
	n.setAttribute(De, ""), e.setAttribute("aria-activedescendant", wr(n, "ui-row")), (N(n) ?? n).scrollIntoView({ block: "nearest" });
}
function os(e, t) {
	return vo(e, t === "grid" ? "both" : t) || t !== "horizontal" && ss(e);
}
function ss(e) {
	return e === "PageDown" || e === "PageUp";
}
function cs(e, t, n, r) {
	if (!os(e, r)) return null;
	let i = ts(t);
	if (ss(e)) return ls(i, n, e === "PageDown");
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return us(i, n, e === "ArrowDown");
	let a = i.map((e) => N(e) ?? e), o = _o({
		key: e,
		items: a,
		current: n === null ? null : N(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ls(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (N(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(To(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (N(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function us(e, t, n) {
	let r = t === null ? null : N(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = ds(i), o = e.map((e) => ({
		row: e,
		rect: (N(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(ds(t.rect) - a) < Math.abs(ds(e.rect) - a) ? t : e).row;
}
function ds(e) {
	return e.left + e.width / 2;
}
var fs = "ui-row-press";
function ps(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function ms(e, t, n) {
	let r = n.hasAttribute(De), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = ts(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && as(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var hs = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), gs = /* @__PURE__ */ new Set([
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
]), _s = !1, vs = !1, ys = null, bs = /* @__PURE__ */ new Set(), xs = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Ss(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Cs(e), !0), window.addEventListener("focus", (e) => ws(e.target), !0), window.addEventListener("focusin", (e) => ws(e.target), !0), window.addEventListener("focusout", (e) => ks(e.target, !1), !0));
function Ss(e, t = "") {
	_s = !0, vs = t === "touch";
	let n = document.activeElement;
	ys = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && ks(n, !Ts(n));
}
function Cs(e) {
	if (!(e instanceof KeyboardEvent && gs.has(e.key))) {
		_s = !1;
		for (let e of [...bs]) ks(e, !1);
	}
}
function ws(e) {
	_s && !Ts(e) && ks(e, !0);
}
function Ts(e) {
	return mo(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function Es() {
	return _s && ys instanceof HTMLElement && ys !== document.body ? ys : null;
}
function Ds() {
	return _s;
}
function Os() {
	return _s && vs;
}
function ks(e, t) {
	if (e instanceof Element) {
		if (t) {
			for (let e of bs) e.isConnected || bs.delete(e);
			bs.add(e);
		} else bs.delete(e);
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Kn, t);
	}
}
function F(e) {
	ws(e), e.focus({ preventScroll: !0 });
}
function As(e) {
	ks(e, !0), e.focus({ preventScroll: !0 });
}
function js(e) {
	for (let t of e.querySelectorAll(hs)) if (Za(t)) return t;
	return null;
}
var Ms = {
	first: js,
	stops: (e) => Ns(e, document.activeElement)
};
function Ns(e, t) {
	let n = [...e.querySelectorAll(hs)].filter((e) => e === t || e.tabIndex >= 0 && Za(e)), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Ps(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Fs(n) && Fs(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Ps(e);
		return t === null || r.get(t) === e;
	});
}
function Ps(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Fs(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Is(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Ls(n, a) ? i : r && Ls(n, i) ? a : null;
}
function Ls(e, t) {
	return e === t || Ps(e) !== null && Ps(e) === Ps(t);
}
var Rs = `.${cr}, .${lr}, [${ur}]`;
function zs(e) {
	let t = es(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Rs)) && n.hasAttribute("tabindex") && Za(n)) return n;
	return null;
}
function Bs(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? js(e);
	return _s ? xs.add(e) : xs.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), F(r ?? e), n;
}
function Vs(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? js(e);
	return n !== null && Hs(e, n), Bs(e, n);
}
function Hs(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Us(e, t, n = !1) {
	if (_s) {
		j(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), F(e);
		return;
	}
	let r = t.filter(bo), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (j(t, i), F(i));
}
function Ws(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Gs(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${hs}, [tabindex]`) && Za(e)) return e;
	return n === null ? null : Ks(n);
}
function Gs(e, t) {
	for (let n = e.closest(C); n !== null; n = n.parentElement?.closest(C) ?? null) {
		let e = t.querySelectorAll(`[${y}="${n.getAttribute(y)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Ks(e) {
	for (let t = e.closest(C); t !== null; t = t.parentElement?.closest(C) ?? null) if (Za(t)) return qs(t), t;
	return null;
}
function qs(e) {
	if (e.hasAttribute("tabindex") || e.tabIndex >= 0) return;
	e.tabIndex = -1;
	let t = (n) => {
		n.target === e && (e.removeAttribute("tabindex"), e.removeEventListener("focusout", t));
	};
	e.addEventListener("focusout", t);
}
function Js(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Ys(n, t) && ks(e, !Ts(e)), F(e));
}
function Ys(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (xs.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Xs = "data-ui-clear", Zs = ["change", "toggle"], Qs = [
	...Zs,
	"expand",
	"collapse",
	"open",
	"close"
];
function $s(e) {
	let t = kr(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function ec(e) {
	return kr(e) === "OnSubmit";
}
function tc(e, t) {
	let n = e.getAttribute(Re);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && ec(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && $s(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: ec(i.mode)
		};
	}
	return null;
}
var nc = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Zs) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(ho, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Xs}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || tc(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Xs}]`);
		if (t === null) return;
		let n = t.closest(C), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || rc(r) || (uo(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), mo(r) && document.activeElement !== r && F(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (A(e.target) || O(e.target))) return;
		let t = tc(e.target, this.options.metadata);
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
			let r = tc(n, this.options.metadata);
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
		if (i === void 0 || !$s(i.mode) || ec(i.mode)) return;
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
function rc(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function ic(e, t) {
	let n = e.closest(`[${Be}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var ac = class {
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
}, oc = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = Jr(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Jr(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Jr(e));
	}
	markAttached(e) {
		let t = Jr(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, sc = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: T(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, cc = {
	dispatched: !1,
	success: !1
}, lc = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, uc = class {
	options;
	root;
	registry;
	requestFactory = new sc();
	turns = new ac();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new oc(e.eventCatalog), this.addEvent("click");
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
		if (r === null || fc(t, r.element) || ic(t.target, r.element)) return;
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
			let t = e instanceof lc, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && O(r.domEvent.target)) return cc;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), cc;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? pc(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), this.options.validationEngine.focusFirstInvalid(o), cc;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return cc;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new lc(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), o !== null && this.options.validationEngine?.focusFirstInvalid(o), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Qs.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(ze(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		dc(e.preventDefault, t) && t.domEvent.preventDefault(), dc(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function dc(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function fc(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function pc(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function mc(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && hc(e, t) : gc(e, t);
}
function hc(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!mc(e[n], t[n])) return !1;
	return !0;
}
function gc(e, t) {
	for (let n in e) if (Object.hasOwn(e, n) && (Object.hasOwn(t, n) ? !mc(e[n], t[n]) : !_c(e[n]))) return !1;
	for (let n in t) if (Object.hasOwn(t, n) && !Object.hasOwn(e, n) && !_c(t[n])) return !1;
	return !0;
}
function _c(e) {
	return e == null;
}
//#endregion
//#region src/interactions/focus-handoff.ts
var vc = `.${cr}, .${lr}`;
function yc() {
	let e = document.activeElement;
	return e === null || e === document.body ? null : e;
}
function bc(e) {
	let t = document.activeElement;
	if (!e.isConnected || t !== e && t !== document.body || xc(e)) return null;
	let n = e;
	for (; n.parentElement !== null && !xc(n.parentElement);) n = n.parentElement;
	let r = Sc(n) ?? Cc();
	return r !== null && F(r), r;
}
function xc(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Sc(e) {
	let t = Ns(e.closest(vc) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function Cc() {
	let e = document.querySelector(`[${Bt}="content"]`);
	return e === null ? null : (qs(e), e);
}
//#endregion
//#region src/interactions/interaction-engine.ts
var wc = class {
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
		for (let e of Zs) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = this.options.valueReaders.readBound(e.target), r = Dc(t.interactions[0].source, t.dynamicParameters);
		if (!(this.heard.has(r) && mc(this.heard.get(r), n))) {
			this.heard.set(r, n);
			for (let e of t.interactions) this.applyInteraction(e, t.dynamicParameters, !0, n);
		}
	}
	resolveEdited(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return null;
		let n = tc(e, this.options.metadata), r;
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
			for (let e of t.interactions) jr(e.actionKind) === "CopyValue" && Oc(e.target) && this.writeTarget(e.target, t.dynamicParameters, Tc(e, n), !0);
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
		let t = this.index.getPropertyInteractions(T(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Dc(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = jr(e.actionKind);
		if (i === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let a = e.target;
		if (!Oc(a)) return;
		let o = i === "CopyValue" ? Tc(e, r) : this.evaluator.evaluate(e, r);
		this.writeTarget(a, t, o, n), n && this.options.writeBack?.(a, t, o);
	}
	writeTarget(e, t, n, r) {
		let i = yc();
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(e, t, n, r);
		} finally {
			this.applyDepth--;
		}
		i !== null && bc(i);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: Ec(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function Tc(e, t) {
	return (t == null || typeof t == "string" && t.trim().length === 0) && e.falseValue !== void 0 ? e.falseValue : t;
}
function Ec(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = T(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && ni(s, o)) return a === 0 ? e : {
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
function Dc(e, t) {
	return JSON.stringify([
		T(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function Oc(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var kc = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Ac(t, e.operator, e.value);
	}
};
function Ac(e, t, n) {
	let r = jc(e), i = jc(n);
	switch (Mr(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Mc(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Mc(r, i, (e) => e >= 0);
		case "Less": return Mc(r, i, (e) => e < 0);
		case "LessOrEqual": return Mc(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Pc(r, i);
		case "RegexEach": return Nc(r, i);
		default: return !1;
	}
}
function jc(e) {
	return pa(e) ? e.key : ma(e) ? e.text : e;
}
function Mc(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Nc(e, t) {
	return e == null ? !0 : Array.isArray(e) ? e.every((e) => Pc(jc(e), t)) : Pc(e, t);
}
function Pc(e, t) {
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
var Fc = "Value", Ic = "EndValue", Lc = class {
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
		return this.eventNames.has(Jr(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Bc(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Jr(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Vc(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Hc(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	getEndValueInteractions(e) {
		return this.endValueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Rc(e)) {
			let t = T(e.sourceEvent?.componentId), n = Jr(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Vc(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Vc(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (zc(e)) {
			let t = T(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Hc(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Hc(t, n), r)), r.push(e), jr(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
				let i = this.metadata.getPropertyDefinition(n)?.propertyName, a = i === Fc ? this.valueInteractions : i === Ic ? this.endValueInteractions : null;
				if (a !== null) {
					let n = a.get(t) ?? [];
					n.push(e), a.set(t, n);
				}
			}
		}
	}
};
function Rc(e) {
	return Ar(e.sourceKind) === "Event";
}
function zc(e) {
	return Ar(e.sourceKind) === "Property";
}
function Bc(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Vc(e, t) {
	return `${e}:${Jr(t)}`;
}
function Hc(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var I = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function Uc() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Wc(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Gc = /* @__PURE__ */ new Set([
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
function Kc(e) {
	return Gc.has(e);
}
var qc = 4, Jc = 12, Yc = /* @__PURE__ */ new Map(), Xc = !1, Zc = null, Qc = /* @__PURE__ */ new WeakMap(), $c = "data-ui-popup-stood-in";
function el(e, t) {
	t === null ? Qc.delete(e) : Qc.set(e, t);
}
var tl = "--ui-popup-ground";
function nl(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(tl).trim() : "";
	n.length === 0 ? t.style.removeProperty(tl) : t.style.setProperty(tl, n);
}
function rl(e, t, n) {
	Yc.set(t, {
		anchor: e,
		options: n
	}), dl(), Zc?.observe(t), al(e, t), pl(e, t, n);
}
var il = "data-ui-popup-lifted";
function al(e, t) {
	if (t.hasAttribute(il)) {
		t.matches(":popover-open") || t.showPopover();
		return;
	}
	!sl(t) && e.closest(`[${il}]`) === null || (t.setAttribute("popover", "manual"), t.setAttribute(il, ""), ol(t));
}
function ol(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function sl(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none" || t.hasAttribute("data-ui-surface-image-blur") && e.isolation === "isolate") return !0;
	}
	return !1;
}
function cl(e) {
	e.hasAttribute(il) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Yc.has(e) || (e.removeAttribute("popover"), e.removeAttribute(il));
	}, I.fast));
}
function ll(e) {
	let t = Yc.get(e);
	t !== void 0 && pl(t.anchor, e, t.options);
}
function ul(e) {
	e != null && (Yc.delete(e), Zc?.unobserve(e), cl(e));
}
function dl() {
	Xc || (Xc = !0, document.addEventListener("scroll", fl, !0), window.addEventListener("resize", fl), window.visualViewport?.addEventListener("resize", fl), window.visualViewport?.addEventListener("scroll", fl), Zc = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Yc.get(t.target);
			e !== void 0 && pl(e.anchor, t.target, e.options, !0);
		}
	}));
}
function fl() {
	for (let [e, t] of Yc) {
		if (!e.isConnected) {
			ul(e);
			continue;
		}
		pl(t.anchor, e, t.options);
	}
}
function pl(e, t, n, r = !1) {
	if (!e.isConnected) return;
	let i = ml(e), a = i !== e;
	t.hasAttribute($c) !== a && t.toggleAttribute($c, a), n.minAnchorWidth === !0 && (t.style.minWidth = `${i.getBoundingClientRect().width}px`);
	let o = i.getBoundingClientRect(), s = (i === e ? n.crossAnchor ?? i : i).getBoundingClientRect(), c = i === e && n.surface !== void 0 ? n.surface.getBoundingClientRect() : o, l = n.gap ?? 4, u = t.getBoundingClientRect(), d = _l(n.boundary), f = Yc.get(t), p = r ? f?.side : void 0, m = p !== void 0 && yl(c, u, p, l, d) ? p : vl(c, u, n.placement, l, d);
	f !== void 0 && (f.side = m);
	let h = n.alignEntries === !0 ? Dl(t, m) : El, g = kl(c, s, u, m, l, h), _ = Al(c, s, u, m, l, h);
	n.arrow === !0 && (Sl(m) ? _ = hl(_, s.left + s.width / 2, u.width) : g = hl(g, s.top + s.height / 2, u.height));
	let v = Ml();
	g = v.top + Il(g - v.top, u.height, v.bottom - v.top), _ = Il(_, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${_}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), gl(t, s, u, m, g, _);
}
function ml(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute($c)) return e;
		let n = Qc.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function hl(e, t, n) {
	let r = t - e;
	return r < Jc ? e - (Jc - r) : r > n - Jc ? e + (r - (n - Jc)) : e;
}
function gl(e, t, n, r, i, a) {
	let o = Sl(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Jc, Math.min(s, c - Jc))}px`);
}
function _l(e) {
	let t = Ml(), n = {
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
function vl(e, t, n, r, i) {
	let a = wl(n);
	if (yl(e, t, n, r, i)) return n;
	if (yl(e, t, a, r, i)) return a;
	for (let a of bl(n)) if (yl(e, t, a, r, i)) return a;
	return Cl(e, a, i) > Cl(e, n, i) ? a : n;
}
function yl(e, t, n, r, i) {
	return Cl(e, n, i) >= xl(t, n) + r;
}
function bl(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function xl(e, t) {
	return Sl(t) ? e.height : e.width;
}
function Sl(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Cl(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function wl(e) {
	return e.startsWith("top") ? `bottom${Tl(e)}` : e.startsWith("bottom") ? `top${Tl(e)}` : e.startsWith("left") ? `right${Tl(e)}` : `left${Tl(e)}`;
}
function Tl(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
var El = {
	start: 0,
	end: 0
};
function Dl(e, t) {
	let n = getComputedStyle(e);
	return Sl(t) ? {
		start: Ol(n.paddingLeft) + Ol(n.borderLeftWidth),
		end: Ol(n.paddingRight) + Ol(n.borderRightWidth)
	} : {
		start: Ol(n.paddingTop) + Ol(n.borderTopWidth),
		end: Ol(n.paddingBottom) + Ol(n.borderBottomWidth)
	};
}
function Ol(e) {
	let t = Number.parseFloat(e ?? "");
	return Number.isFinite(t) ? t : 0;
}
function kl(e, t, n, r, i, a) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : jl(t.top, t.height, n.height, r, a);
}
function Al(e, t, n, r, i, a) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : jl(t.left, t.width, n.width, r, a);
}
function jl(e, t, n, r, i) {
	let a = Tl(r);
	return a === "-start" ? e - i.start : a === "-end" ? e + t - n + i.end : e + (t - n) / 2;
}
function Ml() {
	let e = window.visualViewport, t = e == null || Math.abs(e.scale - 1) > .01, n = t ? 0 : Math.max(0, e.offsetTop), r = t ? window.innerHeight : Math.min(window.innerHeight, e.offsetTop + e.height);
	return {
		top: n,
		bottom: Math.min(r, Nl(r))
	};
}
function Nl(e) {
	let t = document.querySelector(`[${Rt}]`);
	if (t === null) return e;
	let n = t.getBoundingClientRect();
	return n.height > 0 && n.width >= window.innerWidth - 1 && n.top > 0 ? n.top : e;
}
function Pl(e, t, n) {
	let r = e.getBoundingClientRect(), i = Ml();
	e.style.left = `${Fl(t, r.width, 0, window.innerWidth)}px`, e.style.top = `${Fl(n, r.height, i.top, i.bottom)}px`;
}
function Fl(e, t, n, r) {
	return e + t <= r - qc ? e : e - t >= n + qc ? e - t : n + Il(e - n, t, r - n);
}
function Il(e, t, n) {
	return Math.max(qc, Math.min(e, n - t - qc));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var Ll = 32;
function L(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Rl(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Rl(e, t, n) {
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
		if (r.size > Ll) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function zl(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Bl = "data-ui-dialog", Vl = "data-ui-dialog-modal", Hl = "data-ui-dialog-backdrop", Ul = "data-ui-dialog-close-backdrop", Wl = "data-ui-dialog-close-escape";
function Gl(e) {
	let t = e.querySelectorAll(`[${Bl}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Kl(e) {
	let t = Gl(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function ql(e) {
	let t = typeof document > "u" ? null : Kl(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/field-escape.ts
var Jl = "data-ui-runs-on-escape";
function Yl(e) {
	return e instanceof Element && e.hasAttribute(Jl) && (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && !e.readOnly && !O(e);
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
	r.type = "text", r.className = e.className, r.setAttribute(Xl, ""), r.setAttribute(Be, ""), r.value = e.value, $l(r, n, t);
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
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || Zl(e.target) || Yl(e.target) || lu() && e.preventDefault();
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
		return this.options.isBehind === void 0 ? ql(e) : this.options.isBehind(e);
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
	return e.isConnected && !O(e) && !(t && A(e));
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
			isBehind: (e) => ql(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || Ds() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : mu(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, _u(t)) && !ql(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = zs(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && fu(n.owner, this.closesWhenReadOnly) && !ql(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		}), this.options.show(e), vu(e), yu(e, !0), Su(this), e.focus !== void 0 && e.focus !== !1 && Bs(e.popup, e.focus === !0 ? null : e.focus), !0;
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
		this.entries.delete(e), r.popup.contains(document.activeElement) && Js(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), yu(r, !1), ul(r.popup), this.entries.size === 0 && Cu(this);
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
	return e instanceof Element && e.isConnected && Za(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function hu() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Za(e);
}
function gu(e) {
	qs(e), F(e);
}
function _u(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function vu(e) {
	e.anchor !== void 0 && e.placement !== void 0 && rl(e.anchor, e.popup, e.placement);
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
		L(this.root, `.${wu}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${lr}`), n = e.querySelector(`:scope > .${Eu}`);
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
	let n = e.querySelector(hs) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", wr(t, "ui-flyout-content")), n;
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
		if (Kc(e)) return e;
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
	for (let r = t.closest(`[${y}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Fn}="${xr(t)}"]`)];
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
	let i = Number(e.getAttribute(Nn)), a = [], o = [];
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
	let n = id(t.limit, D.language);
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
	td || (td = !0, D.onChange(() => {
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
	r === null || r.disabled || i === null || A(n) || O(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var pd = "ui-file-input", md = "ui-file-input__row", hd = "ui-file-input__native", gd = "ui-file-input__field", _d = "ui-file-input__selection", vd = "data-ui-file-dragging", yd = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, D.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(ud, (e) => fd(e, {
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
		let t = e.target.closest(`[${Pn}], .${md}`);
		if (t === null || O(t) || A(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
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
				this.picks.get(e) === i && this.show(n, () => D.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, bd(r)), this.publishSelection(e, t.selectionId);
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
		ld(e.querySelector(`.${_d}`), t);
	}
};
function bd(e) {
	return e.length === 1 ? e[0].name : () => D.format("ui.file.count", { count: e.length });
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
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Bl, e.key), t.setAttribute(Vl, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Wl, ""), t.setAttribute(Ul, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Hl, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? cr : `${cr} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
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
}, Pf = "ui-image-crop", Ff = "ui-image-crop-title", If = new Tf("data-ui-image-crop-part"), Lf = "data-ui-image-crop-frame", Rf = 10, zf = 1.2, Bf = 380, Vf = 100, Hf = .92, R = null, Uf = !1, Wf = null, Gf = !1;
async function Kf(e, t, n, r = ip) {
	if (R !== null || Uf) return "cancelled";
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
		o.dialog.isConnected || document.body.append(o.dialog), R = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: ff(a),
			finish: (t) => {
				R = null, e.close(Pf), a.release(), i(t);
			}
		}, D.write(o.title, null, "ui.crop.title"), D.write(o.stage, "aria-label", "ui.crop.frame"), D.write(o.zoom, "aria-label", "ui.crop.zoom"), D.write(o.cancel, null, "ui.crop.cancel"), D.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Lf, n.frame), e.open(Pf), np(o);
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
		t === "cancel" ? R?.finish("cancelled") : t === "apply" && Jf();
	}), e.addEventListener("keydown", (e) => Yf(l, e)), o.addEventListener("input", () => ep(l, Number(o.value))), r.addEventListener("wheel", (e) => Xf(l, e), { passive: !1 }), window.addEventListener("resize", () => rp(l)), new Ef({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => R === null ? null : {
			last: t,
			start: R.view
		},
		move: (e, t, n) => {
			e.last !== null && Zf(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			R !== null && (R.view = t.start, np(l));
		},
		pinch: (e, t) => {
			e.last = null, Qf(l, t);
		}
	}), l;
}
async function Jf() {
	let e = R;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = mf(n, a), s = bf(t.type), c = i.encodeAsync(n, o, vf(o, r.size), s);
	R = null;
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
	if (t.defaultPrevented || t.isComposing || R === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), R.finish("cancelled");
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
	if (R === null) return;
	t.preventDefault();
	let n = jf(t, e.stage.clientHeight), r = t.ctrlKey ? Vf : Bf;
	$f(e, 2 ** (-n.y / r), tp(e, t.clientX, t.clientY));
}
function Zf(e, t, n) {
	R !== null && (R.view = gf(R.source, R.view, e.frame.clientWidth, t, n), np(e));
}
function Qf(e, t) {
	if (R === null) return;
	let n = gf(R.source, R.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	R.view = _f(R.source, n, e.frame.clientWidth, t.factor, tp(e, t.center.x, t.center.y)), np(e);
}
function $f(e, t, n) {
	R !== null && (R.view = _f(R.source, R.view, e.frame.clientWidth, t, n), np(e));
}
function ep(e, t) {
	R !== null && Number.isFinite(t) && t > 0 && $f(e, t / R.view.zoom);
}
function tp(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function np(e) {
	if (R === null) return;
	let t = R.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), rp(e);
}
function rp(e) {
	Gf || R === null || (Gf = !0, requestAnimationFrame(() => {
		if (Gf = !1, R === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = R.view, a = hf(R.source, i, t);
		R.imaging.paint(e.canvas, R.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: R.source.width * a,
			height: R.source.height * a,
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
	holding = /* @__PURE__ */ new Set();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${op}`)), L(this.root, `.${op}`, {
			childList: !0,
			attributeFilter: [
				Mn,
				Ve,
				Xn
			]
		}, (e) => {
			this.applyAll(e), this.releaseDetached();
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === xp && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(oi(e.components, `.${op}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(ud, (e) => fd(e, {
			rootSelector: `.${op}`,
			nativeSelector: `.${lp}`,
			pressed: (e) => e.querySelector(`.${cp}`)
		})), this.root.addEventListener(ho, (e) => this.handleDraftDropped(e)), Bu({
			root: this.root,
			draggingAttribute: wp,
			resolveTarget: (e) => {
				let t = e.closest(`.${cp}`), n = t?.closest(`.${op}`) ?? null, r = n === null ? Uu(this.root, e, `.${op}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${cp}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${lp}`)?.getAttribute("accept") ?? "",
					multiple: Ep(i),
					refused: A(i) || O(a)
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
	releaseDetached() {
		for (let e of this.holding) if (!e.isConnected) {
			this.holding.delete(e), this.dropPreview(e);
			for (let t of [...this.shelves.get(e) ?? []]) this.dropTile(e, t);
		}
	}
	clearAll(e) {
		for (let t of e) Ep(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Pn}]`), n = t?.closest(`.${op}`) ?? null;
		t === null || n === null || A(n) || O(t) || n.querySelector(`.${lp}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gp}`), n = t?.closest(`.${op}`) ?? null;
		if (t === null || n === null || A(n) || O(n)) return;
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
		this.releaseDetached();
		let n = e.querySelector(`.${cp}`), r = e.querySelector(`.${up}`), i = e.querySelector(`.${fp}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || nd(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), this.holding.add(e), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Cp, ""), r.setAttribute("src", o.url), jp(e, a.name), Np(e, !0), n.classList.add(ar);
		try {
			let t = await od([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, ld(i, t.selectionId));
		} catch (t) {
			Mp(e), ld(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(ar);
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
		this.releaseDetached();
		let n = e.querySelector(`.${mp}`), r = nd(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i), this.holding.add(e);
		let a = r.map(async (t) => {
			let r = kp(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await od([t], (e) => r.element.style.setProperty(Sp, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(ar), this.publishShelf(e);
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
	let t = e.getAttribute(He);
	return t === "square" || t === "circle" ? t : null;
}
function Op(e) {
	let t = Number(e.getAttribute(Ue));
	return Number.isInteger(t) && t > 0 ? t : uf;
}
function kp(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${hp} ${ar}`, n.type = "button", n.className = gp, r.className = _p, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, D.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Ap(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Ap(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Ap(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(vp), e.setAttribute("title", n.name), r.className = yp, r.setAttribute("aria-hidden", "true"), af(r, Fd(n.name, n.type)), i.className = bp, i.textContent = n.name, D.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function jp(e, t) {
	let n = e.querySelector(`.${dp}`);
	n !== null && (za(n, null), n.textContent !== t && (n.textContent = t));
}
function Mp(e) {
	let t = e.querySelector(`.${dp}`);
	t !== null && D.write(t, null, "ui.file.failed");
}
function Np(e, t) {
	let n = e.querySelector(`.${cp}`);
	n !== null && D.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
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
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Fp}`), !1), L(this.root, `.${Fp}`, {
			childList: !0,
			attributeFilter: [jn]
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
		for (let t of e.querySelectorAll(`.${Lp} [${Re}]:not([${Et}])`)) t.setAttribute(Et, n);
		t.setAttribute(nr, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${Et}="${t}"], [${nr}="${t}"]`)) n.removeAttribute(Et), n.removeAttribute(nr);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Lp} [${Re}]`)) {
			if (mo(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		go(e), this.judge(e);
	}
	judge(e) {
		let t = Hp(e);
		for (let n of e.querySelectorAll(`.${Lp} [${Re}]`)) this.options.validation.judgeShown(n, mo(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Lp} :is(input, textarea, select)`);
		if (n !== null) {
			if (mo(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Hp(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), po(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Kp(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Rp)) return;
		let { cell: n, row: r } = t, i = e.target.closest(dr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Rp} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !O(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
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
var qp = `.ui-button[${lt}="pressed"]`, Jp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(qp);
		t === null || O(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Yp = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${fr}, .ui-field-box`, Xp = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Zp = `${Xp}, ${Yp}, ${dr}, .${he}`, Qp = "button, a, summary, [role='button']";
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
	let n = t.closest(`[${ue}]`);
	return n !== null && n !== e && e.contains(n);
}
function nm(e, t) {
	let n = t.closest(dr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function rm(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Zp);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var im = `${Xp}, [tabindex], [contenteditable], ${dr}, [${Be}]`, am = ":scope > input.ui-field, :scope > textarea.ui-field", om = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Yp);
		if (t === null || e.target !== t && e.target.closest(im) !== null) return;
		let n = t.querySelector(am);
		if (!mo(n) || n.readOnly || O(n) || A(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
}, sm = "data-ui-input-debounce", cm = `input[${sm}], textarea[${sm}]`;
function lm(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(cm);
}
var um = /* @__PURE__ */ new Set();
function dm() {
	for (let e of um) if (e.waiting) return !0;
	return !1;
}
function fm() {
	for (let e of um) e.commitAll();
}
function pm(e) {
	for (let t of um) t.drop(e);
}
var mm = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), um.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	drop(e) {
		if (!lm(e)) return;
		let t = this.timers.get(e);
		t !== void 0 && (window.clearTimeout(t), this.timers.delete(e));
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!lm(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(sm));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!lm(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function z(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var hm = "data-ui-submit-on-enter", gm = "data-ui-runs-on-enter", _m = "enter", vm = "escape", ym = 229, bm = {
	name: _m,
	registration: { settlesValue: !0 }
}, xm = "ui-commit-in-place", Sm = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(xm, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		}), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = this.focusedField;
			t !== null && !(e.local && this.edited.has(t)) && e.components.some((e) => e.contains(t)) && (this.lastCommitted = t.value);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || Cm(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), Yl(t) ? this.runEscape(t, e) : this.leave(t)) : wm(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Tm(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (po(t)) {
			if (e.preventDefault(), wm(t, e)) {
				this.runEnter(t, e);
				return;
			}
			if (e.key === "Escape" && Yl(t)) {
				this.runEscape(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || O(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(_m, { bubbles: !0 })));
	}
	runEscape(e, t) {
		if (t.repeat) return;
		pm(e), this.edited.delete(e), e === this.focusedField && e.value !== this.lastCommitted && this.putBack(e, this.lastCommitted);
		let n = zs(e);
		e.blur(), this.keepKeyboard(e, n), e.dispatchEvent(new Event(vm, { bubbles: !0 }));
	}
	putBack(e, t) {
		this.propertyPatchEngine?.writeBoundValue(e, t), e.value !== t && (e.value = t);
	}
	submitForm(e) {
		let t = e.getAttribute(Et);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${nr}="${xr(t)}"]`);
		n !== null && !O(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = zs(e);
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
		let r = es(e);
		r?.root === t && r.row !== null && as(t, z(t, Ao, M), r.row), F(t);
	}
};
function Cm(e) {
	return e.isComposing || e.keyCode === ym;
}
function wm(e, t) {
	return Em(t) && e.hasAttribute(gm);
}
function Tm(e, t) {
	return Em(t) && e.hasAttribute(hm) && !e.readOnly && !O(e);
}
function Em(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var Dm = `img.${We}`, Om = "%238c8c8c", km = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${Om}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${Om}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${Om}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, Am = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${Om}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${Om}'/%3E%3C/svg%3E`, jm = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Dm)) (Mm(e) || e.complete && e.naturalWidth === 0) && Pm(e);
		L(this.root, Dm, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !Nm(t) && t.removeAttribute(Ke), Mm(t) && Pm(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(Dm) && Pm(t);
	}
};
function Mm(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Nm(e) {
	let t = e.getAttribute("src");
	return t === km || t === Am;
}
function Pm(e) {
	let t = e.getAttribute(Ge);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	Nm(e) || (e.setAttribute(Ke, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? Am : km));
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Fm = "data-ui-radio-value", Im = "ui-radio-group__input", Lm = "ui-radio-group__dot", Rm = "ui-radio-group", zm = "ui-radio-group__item", Bm = "data-ui-radio-group-name", Vm = "data-ui-radio-bind-value-id", Hm = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Rm}`)]);
		for (let e of this.root.querySelectorAll(`.${Rm}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Rm}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Um));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Fm, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Rm}`)) {
			let n = e.getAttribute(Bm);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Bm), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Bm, a);
			for (let e of z(r, `.${Im}`, `.${Rm}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Rm}`)) n.has(e.getAttribute(Bm) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Fm);
		for (let n of z(e, `.${Im}`, `.${Rm}`)) {
			n.checked = n.value === t;
			let e = Wm(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(zm) ? [e] : [...e.querySelectorAll(`.${zm}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Im}`) !== null) return;
		let t = e.closest(`.${Rm}`), n = t?.getAttribute(Bm);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Im, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Vm);
		a !== null && r.setAttribute(Re, a);
		let o = document.createElement("span");
		o.className = Lm, e.prepend(r, o), this.sync(t);
	}
};
function Um(e) {
	return e.classList.contains(Rm) ? [e] : [...e.querySelectorAll(`.${Rm}`)];
}
function Wm(e) {
	let t = e.closest(`.${zm}`);
	return t !== null && k(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Gm(e) {
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
function Km(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function qm(e, t) {
	return t !== null && e.length >= t;
}
function Jm(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : qm(e, n) ? null : [...e, t];
}
function Ym(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var Xm = /[,\uFF0C\r\n]/;
function Zm(e) {
	return Xm.test(e);
}
function Qm(e) {
	return e.split(Xm).map((e) => e.trim()).filter((e) => e.length > 0);
}
function $m(e) {
	let t = e.split(Xm), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function eh(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = qm(a, n) ? r : i(a, t);
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
var th = /\p{M}/gu;
function nh(e, t) {
	return rh(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function rh(e, t) {
	return oh(e, ah(t));
}
function ih(e, t) {
	return t.every((t) => e.includes(t));
}
function ah(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function oh(e, t) {
	let n = e.normalize("NFD").replace(th, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var sh = "data-ui-search-debounce", ch = "data-ui-search-min-length", lh = "data-ui-search-manual", uh = "data-ui-search-answered", dh = "ui-search__input", fh = "ui-select__list", ph = "ui-select__option", mh = "ui-text__title", hh = 300, gh = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(dh) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		_h(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(sh), i = r === null ? hh : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : hh));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(dh)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), !t && e.hasAttribute(lh)) return;
		let n = e.getAttribute(ch), r = n === null ? 0 : Number(n);
		e.value.length < r || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function _h(e) {
	if (e.hasAttribute(uh)) return;
	let t = e.closest(`.${gr}`), n = t?.querySelector(`.${fh}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(ch), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? nh(e.value, e) : [], o = yh(n, (e) => a.length === 0 || ih(rh(vh(e), e), a));
	Sh(t, n, a.length > 0 && o === 0);
}
function vh(e) {
	return e.querySelector(`.${mh}`)?.textContent ?? e.textContent ?? "";
}
function yh(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && bh(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(ph)) continue;
		let e = t(a);
		bh(a, e), r ||= e, e && i++;
	}
	return n !== null && bh(n, r), i;
}
function bh(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function xh(e) {
	let t = e.querySelector(`.${fh}`);
	t !== null && Sh(e, t, yh(t, (e) => e.style.display !== "none") === 0);
}
function Sh(e, t, n) {
	let r = t.querySelector(`:scope > [${rt}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${tt}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(rt, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var Ch = 500, wh = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > Ch) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += rh(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (rh(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function Th(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var Eh = "data-ui-select-value", Dh = "data-ui-select-placement", Oh = "ui-select--open", kh = "ui-select__trigger-content", Ah = "data-ui-select-content", jh = "ui-select__placeholder", Mh = "ui-input__affix-icon--prefix", Nh = "ui-select__popup", Ph = "ui-select__list", Fh = "ui-select__option", Ih = "ui-select__value-input", Lh = "data-ui-select-clear", Rh = "ui-search", zh = "ui-search__input", Bh = "ui-text__title", Vh = "data-ui-active", Hh = "ui-multi-select", Uh = "ui-multi-select__chips", Wh = "ui-multi-select__chip", Gh = "ui-multi-select__chip-label", Kh = "ui-multi-select__chip-remove", qh = "data-ui-select-chip", Jh = "data-ui-select-max", Yh = "data-ui-select-free-text", Xh = "ui-multi-select__entry", Zh = "data-ui-select-tag-entry", Qh = [
	Eh,
	Xn,
	Jh,
	"class",
	b
];
function $h(e) {
	return e === null || A(e) || O(e);
}
function eg(e) {
	return e.classList.contains(Hh);
}
function tg(e) {
	return e.classList.contains(Rh);
}
function ng(e) {
	return tg(e) ? e.querySelector(`.${zh}`) : null;
}
function rg(e) {
	return e.hasAttribute(Yh) ? e.querySelector(`:scope > .${fr} .${Xh}`) : null;
}
function ig(e) {
	return ng(e) ?? rg(e);
}
function ag(e) {
	return rg(e) ?? e.querySelector(".ui-select__trigger");
}
function og(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(Xh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function B(e) {
	return z(e, `.${Nh} .${Fh}`, `.${gr}`);
}
function sg(e) {
	return e === null ? null : e.querySelector(`.${Bh}`)?.textContent ?? e.textContent;
}
function cg(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(y), t.removeAttribute(b), t.removeAttribute(ie), t.removeAttribute(re);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var lg = class {
	root;
	popups = new pu({
		show: ({ owner: e }) => e.classList.add(Oh),
		hide: ({ owner: e }) => {
			e.classList.remove(Oh), this.markActive(e, null);
			let t = e.querySelector(`.${Nh}`);
			t !== null && (t.style.minHeight = "");
		}
	});
	typeAhead = new wh();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${gr}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) yg(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Qh,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${Lh}], .${Kh}`) !== null || mg(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if ($h(r)) return;
		this.releaseRefusal(r);
		let i = $m(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = og(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented ? og(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Zh) !== "first-suggestion" || !B(t.select).some((e) => e.hasAttribute(Vh)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = og(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || $h(t.select) || !Zm(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Qm(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Gm(e.getAttribute(Xn)), a = Km(e.getAttribute(Jh)), o = eh(i, n.map((t) => ({
			text: t,
			key: hg(e, t) ?? t
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
		_h(t);
		let n = t.value.trim().length > 0, r = n ? B(e).filter((e) => dg(e) && !k(e)) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Zh) === "first-suggestion" && (this.markActive(e, i), i !== null && fg(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (eg(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(Eh);
		this.decorateOptions(e);
		let n = t === null ? null : B(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${jh}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of B(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${Ih}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), xh(e);
	}
	syncMultiple(e) {
		let t = Gm(e.getAttribute(Xn)), n = new Set(t), r = qm(t, Km(e.getAttribute(Jh)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = B(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = rg(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		_g(e, s.map((e) => ({
			key: e,
			label: gg(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== $h(e) && (o.readOnly = $h(e));
		let c = e.querySelector(`.${jh}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${Ih}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Xn, u), xh(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${fr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${kh}`), a = i?.getAttribute(Ah) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(Ah), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && tg(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(b);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = kh;
			let e = r.querySelector(`:scope > .${Mh}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return cg(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of B(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = k(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${Fh}`);
		t === null || n === null || n.hasAttribute(Vh) || k(n) || O(n) || n.closest(".ui-select") !== t || (ig(t) === null && (j(B(t).filter((e) => !k(e)), n), As(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Kh}`);
		if (t !== null) {
			let n = t.closest(`.${gr}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), $h(n) || this.removeChosen(n, t.closest(`.${Wh}`)?.getAttribute(qh) ?? null));
			return;
		}
		let n = e.target.closest(`[${Lh}]`);
		if (n !== null) {
			let t = n.closest(`.${gr}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), $h(t) || (this.clearValue(t), ug(t)));
			return;
		}
		let r = e.target.closest(`.${fr}`);
		if (r !== null) {
			let t = r.closest(`.${gr}`);
			if ($h(t)) return;
			e.preventDefault();
			let n = t === null ? null : rg(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${Fh}`);
		if (i === null) return;
		let a = i.closest(`.${gr}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(B(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || this.handleEntryKey(e) || this.handleChipKey(e)) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveCurrent(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fh}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${gr}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleEntryKey(e) {
		let t = og(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if ($h(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key === "ArrowDown" ? 1 : -1) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? B(r).find((e) => e.hasAttribute(Vh) && dg(e) && !k(e)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Qm(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Qm(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Uh} > .${Wh}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(qh)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = pg(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Kh}`) ?? (n === 1 ? ag(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		_h(t);
		let r = B(e).filter((e) => dg(e) && !k(e) && !O(e)), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Kh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !eg(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), $h(n)) return !0;
				let r = pg(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(qh) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(qh) ?? null);
				let o = a === null ? null : pg(n).find((e) => e.getAttribute(qh) === a) ?? null;
				return o !== null && o.querySelector(`.${Kh}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || $h(t)) return !1;
		e.preventDefault();
		let n = ng(t);
		n !== null && _h(n);
		let r = B(t).filter((e) => dg(e) && !k(e) && !O(e)), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = Th(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(Fh))) return !1;
		let r = n.closest(`.${gr}`), i = r !== null && r === this.openSelect;
		if (r === null || $h(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = ng(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = B(r).filter((e) => !k(e) && !O(e)), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(Vh)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => sg(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (j(B(r).filter((e) => !k(e)), c), fg(r, c), F(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !eg(t) || $h(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Uh} > .${Wh}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(qh)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(zh) || !t.contains(e.target) ? null : B(t).find((e) => e.hasAttribute(Vh) && !k(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = ig(e), i = rg(e);
		r !== null && !t && _h(r), xh(e);
		let a = e.querySelector(`.${fr}`), o = e.querySelector(`.${Nh}`), s = e.querySelector(`.${Ph}`) ?? o, c = e.getAttribute(Dh);
		if (a === null || o === null || s === null) return;
		let l = wr(s, "ui-select-list");
		if (i === null && a.setAttribute("aria-controls", l), r?.setAttribute("aria-controls", l), this.popups.open({
			owner: e,
			popup: o,
			anchor: a,
			placement: {
				placement: c !== null && Kc(c) ? c : "bottom-start",
				minAnchorWidth: !0
			},
			openers: i === null ? r === null ? [a] : [a, r] : [i],
			returnFocus: () => i ?? a
		})) {
			if (r === null) {
				this.initializeFocus(e, n);
				return;
			}
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), bg(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = B(e).filter((e) => !k(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Ds()) {
			j(n, null), this.markActive(e, null), ug(e);
			return;
		}
		let i = r ?? n[0];
		j(n, i), this.markActive(e, i, Ds()), fg(e, i), F(i);
	}
	initializeSearch(e, t, n, r) {
		let i = B(e), a = i.filter((e) => dg(e) && !k(e)), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Ds() ? null : a[0] ?? null);
		j(i, null), this.markActive(e, o, Ds()), o !== null && fg(e, o), !Os() && (F(t), t.select());
	}
	initializeEntry(e, t) {
		j(B(e), null), this.markActive(e, t), t !== null && fg(e, t);
	}
	moveCurrent(e, t) {
		let n = B(e).filter((e) => !k(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(Vh)) ?? null, i = _o({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (ig(e) === null ? (j(n, i), i.focus()) : fg(e, i), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of B(e)) r === t ? r.setAttribute(Vh, "") : r.hasAttribute(Vh) && r.removeAttribute(Vh), ks(r, r === t && n);
		let r = ig(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", wr(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || k(t) || $h(e)) return;
		if (eg(e)) {
			let r = Jm(Gm(e.getAttribute(Xn)), n, Km(e.getAttribute(Jh)));
			this.markActive(e, t, Ds()), r !== null && this.writeChosen(e, r);
			let i = rg(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(Eh) === n) {
			this.close();
			return;
		}
		e.setAttribute(Eh, n), this.sync(e);
		let r = e.querySelector(`.${Ih}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Ym(Gm(e.getAttribute(Xn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Wh}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && ag(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Xn) : e.setAttribute(Xn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Ih}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (eg(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(Eh)) return;
		e.removeAttribute(Eh), this.sync(e);
		let t = e.querySelector(`.${Ih}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function ug(e) {
	let t = e.querySelector(`.${fr}`), n = ag(e);
	t !== null && n !== null && !t.contains(document.activeElement) && F(n);
}
function dg(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function fg(e, t) {
	let n = e.querySelector(`.${Ph}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function pg(e) {
	return [...e.querySelectorAll(`.${Uh} > .${Wh}`)];
}
function mg(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && rg(t) !== null && !e.classList.contains(Xh);
}
function hg(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of B(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !k(t) && (e.toLocaleLowerCase() === n || sg(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function gg(e, t) {
	let n = sg(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function _g(e, t) {
	let n = e.querySelector(`.${Uh}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Wh}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(qh) === t[n].key && e.querySelector(`.${Gh}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => vg(e.key, e.label)));
	}
}
function vg(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Wh, n.setAttribute(qh, e), r.className = Gh, r.textContent = t, i.className = Kh, i.type = "button", i.tabIndex = -1, D.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function yg(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${gr}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === Eh || e.attributeName === "data-ui-selected-keys" || e.attributeName === Jh)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${Nh}`)?.closest(`.${gr}`);
	n != null && t.add(n);
}
function bg(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var xg = class {
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
		!mo(t) || !this.root.contains(t) || (this.field = t, this.committed = t.value);
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
}, Sg = "textarea.ui-text-area__field", Cg = "data-ui-text-area-grow";
function wg() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var Tg = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(Sg) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(Sg)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(oi(e.components, Sg));
		}), L(this.root, Sg, {
			childList: !0,
			attributeFilter: [Cg]
		}, (e) => {
			this.fitAll(oi(e, Sg));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(Cg)) {
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
function Eg(e) {
	let t = Dg(e.getAttribute("min"), 0), n = Dg(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, Dg(r, 1))
	};
}
function Dg(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function Og(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function kg(e, t) {
	return Ag(t.min + e * (t.max - t.min), t);
}
function Ag(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, jg(t.min + r * t.step, t);
}
function jg(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(Mg(t.step), Mg(t.min)))));
}
function Mg(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function Ng(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function Pg(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return Fg(o, i);
	let s = (o - i.min) / i.step;
	return Fg(jg(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function Fg(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var Ig = "ui-slider__input", Lg = "ui-slider__input--end", Rg = "ui-slider__input--held", zg = "ui-slider__value", Bg = "ui-slider__bubble", Vg = "ui-slider__track", Hg = "ui-slider__thumb-anchor", Ug = "ui-slider", Wg = "ui-slider--range", Gg = "ui-orientation--vertical", Kg = "--ui-slider-fraction", qg = "--ui-slider-end-fraction", Jg = 6, Yg = "Value", Xg = "EndValue", Zg = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Qg = class {
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
			resolveHandle: (e) => e.closest(`.${Wg} .${Vg}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Zg.has(e.propertyName)) return;
			let t = T(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) for (let t of n.querySelectorAll(`.${Ig}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (e_(t) ? Xg : Yg) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = $g(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = $g(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = $g(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || r_(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ig)) return;
		let t = e.target;
		if (this.cancelled.delete(t), r_(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = t_(t);
		if (n !== null) {
			let e = n_(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${Ig}:not(.${Lg})`), r = e.querySelector(`.${Lg}`);
		if (n === null || r === null) return null;
		let i = kg(Og(e.getBoundingClientRect(), t, i_(e), a_(e)), Eg(n)), a = Ng(i, Number(n.value), Number(r.value));
		if (r_(n)) return F(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? F(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${Vg}`);
		if (n === null) return;
		let r = kg(Og(n.getBoundingClientRect(), t, i_(n), a_(n)), Eg(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Rg), F(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = t_(e), r = n === null ? String(t) : n_(e, t, n);
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
		e.held?.classList.remove(Rg), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = o_(e);
		t !== null && rl(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Jg
		});
	}
	releaseBubble(e) {
		ul(o_(e)?.bubble);
	}
	writeReadings(e) {
		let t = e_(e), n = e.closest(`.${Vg}`)?.parentElement ?? e.parentElement, r = t ? `.${zg}--end, .${Bg}--end` : `.${zg}:not(.${zg}--end), .${Bg}:not(.${Bg}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Vg}`)?.style.setProperty(t ? qg : Kg, String(s_(e))), e.matches(`:active, :focus-visible, .${Rg}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function $g(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Ig) ? e : null;
}
function e_(e) {
	return e.classList.contains(Lg);
}
function t_(e) {
	return e.closest(`.${Wg} .${Vg}`)?.querySelector(e_(e) ? `.${Ig}:not(.${Lg})` : `.${Lg}`) ?? null;
}
function n_(e, t, n) {
	let r = Number(e.closest(`.${Ug}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(Pg(t, e_(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, Eg(e)));
}
function r_(e) {
	return A(e) || O(e);
}
function i_(e) {
	return e.closest(`.${Ug}`)?.classList.contains(Gg) === !0;
}
function a_(e) {
	let t = e.querySelector(`.${Hg}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : i_(e) ? t.height : t.width;
}
function o_(e) {
	if (!(e instanceof Element) || !e.classList.contains(Ig)) return null;
	let t = e.closest(`.${Vg}`), n = e_(e), r = t?.querySelector(n ? `.${Bg}--end` : `.${Bg}:not(.${Bg}--end)`) ?? null, i = t?.querySelector(n ? `.${Hg}--end` : `.${Hg}:not(.${Hg}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: i_(e)
	};
}
function s_(e) {
	let { min: t, max: n } = Eg(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var c_ = {
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
}, l_ = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], u_ = [
	"$n",
	"n$",
	"$ n",
	"n $"
], d_ = [
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
], f_ = [
	"n %",
	"n%",
	"%n",
	"% n"
], p_ = [
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
], m_ = /[1-9]/;
function h_(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return c_;
	try {
		return {
			...c_,
			...JSON.parse(t)
		};
	} catch {
		return c_;
	}
}
function g_(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = v_(t);
	if (r === null) return y_(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = b_(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return __(e, t) ? T_(l_[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = b_(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return __(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = x_(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return __(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = b_(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return T_(__(e, t) ? d_[n.currencyNegativePattern] ?? "-$n" : u_[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = b_(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return T_(__(e, t) ? p_[n.percentNegativePattern] ?? "-n %" : f_[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return y_(e, n);
	}
}
function __(e, t) {
	return e < 0 && m_.test(t);
}
function v_(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function y_(e, t) {
	let { integer: n, fraction: r } = S_(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function b_(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = x_(e, t, n);
	return n === 0 ? w_(o, r, i) : `${w_(o, r, i)}${a}${s}`;
}
function x_(e, t, n) {
	let { integer: r, fraction: i } = S_(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? C_(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function S_(e, t) {
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
function C_(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function w_(e, t, n) {
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
function T_(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var E_ = {
	readCulture: h_,
	format: g_
}, D_ = /^-?(\d+(\.\d*)?|\.\d+)$/;
function O_(e, t, n) {
	if (!D_.test(e)) return e;
	let r = n.thousands ? t : P_(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return g_(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return g_(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function k_(e, t, n) {
	return D_.test(e) ? (N_(n) ? F_(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function A_(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = N_(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!D_.test(d)) return null;
	let f = a ? F_(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function j_(e, t, n, r, i) {
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
function M_(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function N_(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function P_(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function F_(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var I_ = "ui-number-input", L_ = "ui-number-input__field", R_ = "data-ui-number-no-decimals", z_ = "data-ui-number-no-negative", B_ = "data-ui-number-no-thousands", V_ = "data-ui-number-trim-zeros", H_ = "data-ui-number-step", U_ = "data-ui-number-min", W_ = "data-ui-number-max", G_ = "data-ui-number-step-direction", K_ = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${L_}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(oi(e.components, `.${L_}`));
		}), D.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${L_}`)));
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
		let t = q_(e);
		if (t !== null) return this.keptValue(t) ?? Z_(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(V_) ? M_(t) : t, r = h_(e), i = e === document.activeElement ? k_(n, r, Q_(e)) : X_(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = q_(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(R_), r = !t.hasAttribute(z_), i = t.selectionStart ?? t.value.length, a = j_(t.value, i, h_(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = q_(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = q_(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : Z_(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(V_) && !A(t) && !O(t)) {
			let e = this.values.get(t) ?? "", n = M_(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = q_(e.target);
		if (t === null) return;
		let n = Z_(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = q_(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = k_(t, h_(e), Q_(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + G_ + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${L_}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(G_) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = q_(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(H_) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : Z_(e) ?? "0") || 0) + n * t, i = e.getAttribute(U_), a = e.getAttribute(W_);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, $_(r)), this.show(e);
	}
};
function q_(e) {
	return e instanceof HTMLInputElement && e.classList.contains(L_) ? e : null;
}
function J_(e, t) {
	let n = e.classList.contains(I_) ? e.querySelector(`.${L_}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = Y_(n, U_), a = Y_(n, W_);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: X_(n, i, h_(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: X_(n, a, h_(n)) }
	} : null;
}
function Y_(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function X_(e, t, n) {
	return O_(t, n, {
		format: Q_(e),
		thousands: !e.hasAttribute(B_)
	});
}
function Z_(e) {
	return A_(e.value, h_(e), Q_(e));
}
function Q_(e) {
	return e.closest(`.${I_}`)?.getAttribute("data-ui-number-format") ?? null;
}
function $_(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function ev(e, t) {
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
function tv(e) {
	switch (e.getAttribute(dt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function nv(e) {
	let t = tv(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/interactions/drag-marks.ts
function rv(e, t, n, r, i, a = [], o = "move") {
	iv(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	av(e, i, o);
}
function iv(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function av(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function ov(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
//#endregion
//#region src/interactions/item-drags.ts
var sv = "application/x-ne-items", cv = null, lv = null;
function uv(e, t, n) {
	let r = e.getAttribute(fe), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(P),
		effects: i,
		source: e.getAttribute(pe)
	};
}
function dv(e, t) {
	let n = Vo(t);
	return n.includes(e) ? n.filter((t) => t === e || pv(t)) : [e];
}
function fv(e) {
	return !Xa(e, "data-ui-undraggable") && !k(e);
}
function pv(e) {
	return fv(e) && N(e) !== null;
}
function mv(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function hv(e, t, n = null) {
	cv = t, lv = t === null ? null : n, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(sv, t.kind);
}
function gv(e) {
	return cv !== null && e.dataTransfer?.types.includes(sv) === !0 ? cv : null;
}
function _v() {
	let e = lv;
	cv = null, lv = null, e?.();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var vv = `:scope > [${rt}], :scope > [${it}], :scope > [${gt}]`;
function V(e) {
	let t = new Set(e.querySelectorAll(vv));
	return [...e.children].filter((e) => !t.has(e));
}
function yv(e) {
	return e === null ? [] : [e];
}
function bv(e) {
	return e.querySelector(`:scope > [${rt}]`);
}
function xv(e, t, n, r, i) {
	i ??= V(e).some((e) => !e.classList.contains(sr));
	let a = bv(e);
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
	c.setAttribute(rt, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var Sv = { ok: !1 }, Cv = {
	ok: !0,
	value: null
}, wv = null;
function Tv(e) {
	wv = e;
}
function Ev(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Or(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Or(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return Sv;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return Sv;
			let t = a[u];
			if (u++, Or(t.kind) === "Dynamic") {
				let n = Av(e, t.componentId);
				if (!n.ok) return Sv;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return Sv;
				let e = Lv(s, t.value);
				if (!e.ok) return Sv;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return Sv;
		if (l) {
			let e = Nv(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? Sv : {
		ok: !0,
		value: s,
		scope: c
	};
}
function Dv(e, t, n) {
	for (let r of t ?? []) {
		if (Or(r.kind) !== "Dynamic") continue;
		let t = T(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Ov(e) {
	let t = Mv(e, "IsContent");
	return t.ok && t.value === !0;
}
var kv = /* @__PURE__ */ new Set();
function Av(e, t) {
	let n = T(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return kv.has(n) || (kv.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), Sv;
}
function jv(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Mv(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Mv(e, t) {
	return Nv(e, t, !0);
}
function Nv(e, t, n) {
	if (e == null) return Sv;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return Sv;
	let r = e, i = Pv(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? Sv : (n && wv?.(r, t), Cv);
}
function Pv(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Fv(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function Fv(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Iv(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Or(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Or(e.kind) !== "Dynamic") {
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
function Lv(e, t) {
	if (e == null || t == null) return Sv;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : Sv;
	if (typeof t != "string") return Sv;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (zv(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return Sv;
}
function Rv(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (zv(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function zv(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Bv(e) {
	let t = e.closest(C)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function Vv(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Bv(e);
	if (a === void 0 && o === null) {
		for (let t of V(e)) t.classList.remove(sr);
		return;
	}
	for (let n of V(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(sr);
			continue;
		}
		n.classList.toggle(sr, !Hv(a, e, i, o));
	}
}
function Hv(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => qv(e, t, n)) && (r?.filters ?? []).every((e) => Ac(jv(t, e.itemProperty), e.operator, e.value));
}
function Uv(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Jv(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Wv(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Jv(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function Gv(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Kv(n.getItemValue(e), n.getItemValue(r), t));
}
function Kv(e, t, n) {
	for (let r of n) {
		let n = Yv(jc(jv(e, r.itemProperty)), jc(jv(t, r.itemProperty)));
		if (n !== 0) return Nr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function qv(e, t, n) {
	if (!Jv(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Ac(jv(t, e.itemProperty), e.operator, r);
}
function Jv(e, t, n, r) {
	return e == null || Ac(r.get(e, []), t, n);
}
function Yv(e, t) {
	if (e === t) return 0;
	let n = Zv(e), r = Zv(t);
	if (n !== r) return n - r;
	if (n === Xv.Nothing) return 0;
	if (n === Xv.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Xv = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Zv(e) {
	return e == null ? Xv.Nothing : typeof e == "number" ? Number.isNaN(e) ? Xv.Nothing : Xv.Number : typeof e == "string" && e.trim().length === 0 ? Xv.Nothing : Number.isNaN(Number(e)) ? Xv.Text : Xv.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var Qv = /* @__PURE__ */ new WeakMap();
function $v(e, t) {
	let n = Qv.get(e), r = n === void 0 ? [...t] : ey(n, t);
	return Qv.set(e, r), r;
}
function ey(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function ty(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function ny(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function ry(e, t, n) {
	return ny(e, t), ty(e, t, n);
}
function iy(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function ay(e) {
	Qv.delete(e);
}
//#endregion
//#region src/interactions/tab-rows.ts
var oy = "ui-tab-item";
function sy(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function cy(e) {
	return e instanceof HTMLElement && e.classList.contains("ui-tab-item") ? sy(e).parentElement : null;
}
function ly(e, t) {
	return Xa(sy(e), t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var uy = ".ui-items-view__item, .ui-table__row", dy = "ui-row--dragging", fy = "--ui-row-drop-offset", py = "move";
function my(e, t) {
	ps(e, py, { index: t });
}
function hy(e) {
	return {
		name: py,
		registration: {
			dynamicParameters: (e) => {
				let t = gy(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...ev((t) => e === void 0 ? null : _y(e, t), (t) => "pending" in t ? e?.settle(t.pending) : e?.resort(t.strip))
		}
	};
}
function gy(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function _y(e, t) {
	let n = gy(t);
	if (n === null || !(t.target instanceof Element)) return null;
	let r = cy(t.target);
	if (r !== null) return { strip: r };
	let i = t.target.closest(uy), a = i?.parentElement ?? null, o = i === null || a === null || !a.hasAttribute("data-ui-items-host") ? null : e.ahead(a, P(i), n);
	return o === null ? null : { pending: o };
}
var vy = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : N(t.row);
		if (t === null || n === null) return;
		let r = Cy(t.root, t.row);
		if (r === null ? !wy(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (as(t.root, Ay(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(Ao), n = t?.parentElement ?? null, r = n?.closest(M) ?? null;
		if (t === null || n === null || r === null || !t.matches(uy) || !n.hasAttribute("data-ui-items-host") || O(r) || !pv(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = ci(e);
		return this.services === void 0 || n === null ? !1 : Wv(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, Bv(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : N(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = uv(t.root, n, dv(t.row, Ay(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => N(e) ?? e);
		rv(e, t.root, r, dy, P(t.row), a, mv(i, t.moves)), hv(e, i, () => this.endDrag());
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = Ey(t.root, t.host), r = Ay(t.host), i = xy(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? jy(t.root, null) : jy(t.root, i, Oy(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (Ty(t) !== Ty(e.row)) return null;
		let r = yy(Sy(e.host, this.services?.keysOf), P(e.row), P(t), n);
		return r === null ? null : r + nv(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && ov(e, t.host) && jy(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = xy(t.host, e.target, e, Ey(t.root, t.host), Ay(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && my(t.row, r);
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (iv(e.root, dy), jy(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = es(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || t.row !== null && rm(e.target, t.row) !== null) return;
		let n = Jo(t.root), r = n === null ? [] : Ay(n), i = ns(r);
		if (n === null || i === null || this.liftableRow(i)?.moves !== !0) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && my(i, c);
	}
};
function yy(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = by(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function by(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function xy(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(Ao);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(Ao) ?? null;
	if (a ??= ky(i, n), a === null) return null;
	let o = (N(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && Dy(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function Sy(e, t) {
	switch (tv(e)) {
		case "virtualized": return [...t?.(e) ?? V(e).map(P)];
		case "windowed": return V(e).map(P);
		default: return $v(e, V(e)).map(P);
	}
}
function Cy(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${he}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function wy(e, t) {
	return rm(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Ty(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Ey(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function Dy(e, t, n) {
	if (Ty(e) !== Ty(t)) return !1;
	if (!n.across) return !0;
	let r = (N(e) ?? e).getBoundingClientRect(), i = (N(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Oy(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !Dy(t.anchor, r, n)) return -1;
	let i = (N(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (N(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function ky(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (N(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function Ay(e) {
	return V(e).filter((e) => e instanceof HTMLElement && e.matches(uy) && N(e) !== null);
}
function jy(e, t, n = 0) {
	let r = t === null ? null : N(t.anchor);
	for (let t of e.querySelectorAll(`[${ge}]`)) t !== r && (t.removeAttribute(ge), t.style.removeProperty(fy));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ge, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(fy) !== i && r.style.setProperty(fy, i);
}
function My(e) {
	e.classList.remove(dy), e.querySelector(`:scope > [${y}]`)?.classList.remove(dy);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function Ny(e) {
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
		default: o = Wy(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Py(e, t, n = By()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Fy(e, t = By()) {
	let n = Iy(e.code, t);
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
function Iy(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Ry[e] : void 0) ?? Ly[e] ?? e;
}
var Ly = {
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
}, Ry = {
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
}, zy = null;
function By() {
	return zy === null && (zy = Vy()), zy;
}
function Vy() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Hy = { words(e) {
	let t = Ny(e);
	return t === null ? null : Fy(t);
} };
function Uy(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Wy(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Gy[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Gy[t] ?? null;
}
var Gy = {
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
}, Ky = 120;
function qy(e) {
	return e.typing && e.tallest - e.height > Ky;
}
function Jy(e) {
	return mo(e) || e instanceof HTMLElement && e.isContentEditable;
}
var Yy = class {
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
		let t = qy({
			height: e.height,
			tallest: this.tallest,
			typing: Jy(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Un, t);
	}
}, Xy = "--ui-tree-drop-depth";
function Zy(e) {
	return e.querySelector(`.${fn}`);
}
function Qy(e, t) {
	if (k(e)) return !1;
	let n = t?.getAttribute(wn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function $y(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || Qy(n, Zy(n));
}
function eb(e, t) {
	let n = Zy(e);
	if (Qy(e, n)) return P(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return $y(r, t) ? r : null;
}
function tb(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${pn}]`)) n !== t && (n.removeAttribute(pn), n.style.removeProperty(Xy));
	t !== null && (t.setAttribute(pn, n), r === void 0 ? t.style.removeProperty(Xy) : t.style.setProperty(Xy, String(r)));
}
function nb(e, t, n) {
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
function rb(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = ib(e, r, n);
	return i === null || !ab(e, i.parent) ? null : i;
}
function ib(e, t, n) {
	if (n === "in") {
		let n = nb(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = nb(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: sb(e, n, t.parent, !1)
		};
	}
	let r = ob(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function ab(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function ob(e, t) {
	return e.filter((e) => e.parent === t);
}
function sb(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = ob(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function cb(e, t, n) {
	let r = ob(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? sb(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var lb = "drop:", ub = "ui-row--cut", db = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, fb = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, pb = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function mb(e) {
	return {
		dynamicParameters: (e) => {
			let t = hb(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...ev((t) => gb(e, t), (t) => e?.settle(t))
	};
}
function hb(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function gb(e, t) {
	let n = hb(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var _b = class {
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
		let t = gv(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = vb(t, r, yb(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		let r = e.matches(".ui-items-view, .ui-table") ? Jo(e) : null;
		if (r !== null) {
			let i = Ay(r), a = Ey(e, r), o = Sy(r, this.options.keysOf), s = t !== null && n !== null ? xy(r, t, n, a, i) : bb(i);
			return {
				index: ((s === null ? null : by(o, P(s.anchor), s.side)) ?? o.length) + nv(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(me, "") : jy(e, s, Oy(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = xb(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Jo(e) : Sb(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => tb(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => e.setAttribute(me, "")
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(me), e.matches(".ui-items-view, .ui-table") ? jy(e, null) : e.classList.contains("ui-tree") && tb(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && ov(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), _v(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && tv(e.host) === "plain" && tv(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(lb + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), _v();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.letGo();
				return;
			}
			Jy(e.target) || (Py(pb, e) ? this.paste(e, e.target) : Py(db, e) ? this.take(e, e.target, !0) : Py(fb, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (N(e) ?? e).classList.remove(ub);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : vb(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = es(t), a = i === null ? null : Jo(i.root);
		if (i === null || a === null || O(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = [...a.children].filter((e) => e instanceof HTMLElement && e.matches(Ao) && N(e) !== null), s = i.row ?? ns(o), c = s === null || !pv(s) ? null : uv(i.root, a, dv(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (N(e) ?? e).classList.add(ub);
	}
};
function vb(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function yb(e) {
	return By() ? e.altKey : e.ctrlKey;
}
function bb(e) {
	let t = rs(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function xb(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : eb(n, (t) => Sb(e, t));
}
function Sb(e, t) {
	return e.querySelector(`.${dn}[${b}="${xr(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var H = "ui-temporal-input", Cb = "ui-calendar", wb = `.${H}, .${Cb}`, Tb = "ui-temporal-input__value-input", Eb = "ui-temporal-input__end-value-input", Db = "data-ui-temporal-range", Ob = "data-ui-temporal-end", kb = "data-ui-temporal-mode", Ab = "data-ui-temporal-format", jb = "data-ui-temporal-default-format", Mb = "data-ui-temporal-min", Nb = "data-ui-temporal-max", Pb = "data-ui-temporal-step", Fb = "data-ui-temporal-step-unit", Ib = "data-ui-temporal-marked-days", Lb = "data-ui-temporal-marked-only", Rb = "data-ui-temporal-page-culture", zb = "data-ui-temporal-months", Bb = "data-ui-temporal-months-genitive", Vb = "data-ui-temporal-months-short", Hb = "data-ui-temporal-daynames", Ub = "data-ui-temporal-weekdays", Wb = "data-ui-temporal-first-day", Gb = "data-ui-temporal-am", Kb = "data-ui-temporal-pm", qb = /* @__PURE__ */ new Set([
	Ab,
	jb,
	Mb,
	Nb,
	zb,
	Gb,
	Kb,
	Ib,
	Lb
]), Jb = 2e3;
function Yb(e) {
	let t = e.getAttribute(kb);
	return t === "time" || t === "date-time" ? t : "date";
}
function Xb(e) {
	let t = e.getAttribute(Ab);
	return t === null || t.trim().length === 0 ? e.getAttribute(jb) ?? "" : t;
}
function Zb(e) {
	let t = e.getAttribute(Fb), n = Math.max(1, Math.trunc(Number(e.getAttribute(Pb))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Qb(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function $b(e) {
	return {
		monthNames: ex(e, zb),
		monthGenitiveNames: ex(e, Bb),
		abbreviatedMonthNames: ex(e, Vb),
		dayNames: ex(e, Hb),
		abbreviatedDayNames: ex(e, Ub),
		amDesignator: e.getAttribute(Gb) ?? "AM",
		pmDesignator: e.getAttribute(Kb) ?? "PM"
	};
}
function ex(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function tx(e, t) {
	e.hasAttribute(Rb) && (ax(e, Bb, t.monthGenitiveNames.join("|")), ax(e, Vb, t.abbreviatedMonthNames.join("|")), ax(e, Hb, t.dayNames.join("|")), ax(e, Ub, t.abbreviatedDayNames.join("|")), ax(e, zb, t.monthNames.join("|")), ax(e, Gb, t.amDesignator), ax(e, Kb, t.pmDesignator), ax(e, jb, ix(Yb(e), Zb(e), t)));
}
function nx(e) {
	for (let t = 0; t < e.length;) {
		let n = Oi(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function rx(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function ix(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : yi(n, r);
}
function ax(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function ox(e) {
	return e.hasAttribute(Db);
}
function sx(e) {
	return e !== null && e.hasAttribute(Ob);
}
function cx(e) {
	return U(e, !1);
}
function U(e, t) {
	let n = lx(e, t);
	return n === null ? null : xx(n.value, Yb(e));
}
function lx(e, t) {
	return e.querySelector(`.${t ? Eb : Tb}`);
}
function ux(e, t) {
	return xx(e.getAttribute(t) ?? "", Yb(e));
}
function dx(e) {
	let t = ux(e, Mb), n = ux(e, Nb), r = (e.getAttribute(Ib) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : Sx(t, "date"),
		max: n === null ? null : Sx(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(Lb)
	};
}
function fx(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function px(e, t, n) {
	let r = lx(e, n);
	if (r === null) return;
	let i = t === null ? "" : Sx(t, Yb(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function mx(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Ri(n, Xb(e), $b(e));
	return r === null ? n : Sx(Ni(r), Yb(e));
}
function hx(e) {
	if (!ox(e)) return;
	let t = U(e, !1), n = U(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (px(e, n, !1), px(e, t, !0));
}
function gx(e) {
	let t = ux(e, Mb), n = ux(e, Nb);
	if (t === null && n === null) return null;
	for (let r of ox(e) ? [!1, !0] : [!1]) {
		let i = U(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Ci(t, Xb(e), $b(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Ci(n, Xb(e), $b(e)) }
		};
	}
	return null;
}
function _x(e) {
	return yx(e, vx(e, /* @__PURE__ */ new Date()));
}
function vx(e, t) {
	let n = ux(e, Mb), r = ux(e, Nb);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function yx(e, t) {
	let n = Zb(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var bx = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function xx(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = bx.exec(n);
		return e === null ? null : new Date(Jb, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Mi(n);
	return r === null ? null : Ni(r);
}
function Sx(e, t) {
	let n = `${Cx(e.getHours())}:${Cx(e.getMinutes())}:${Cx(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Cx(e.getMonth() + 1)}-${Cx(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Cx(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function wx(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Dx(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Ox(e.start).getTime() ? {
		start: Dx(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Dx(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Tx(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Ox(e).getTime();
	return r > Ox(t).getTime() && r < Ox(n).getTime();
}
function Ex(e, t, n) {
	return !n && Tx(e, t.start, t.end);
}
function Dx(e, t) {
	return Pi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Ox(e) {
	return Pi(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var kx = "ui-temporal-input__day", Ax = "ui-temporal-input__month", jx = "data-ui-temporal-nav", Mx = "data-ui-temporal-day", Nx = 366;
function Px(e) {
	let t = cx(e);
	return {
		view: nS(t ?? vx(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function Fx(e, t, n, r) {
	let i = tS("div", `${H}__calendar`), a = tS("div", `${H}__calendar-header`), o = dx(e), s = eS("previous", "‹", D.text("ui.picker.previous"));
	s.disabled = Ix(o, t, -1) === null, a.append(s);
	let c = eS("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${H}__calendar-label`), a.append(c);
	let l = eS("next", "›", D.text("ui.picker.next"));
	return l.disabled = Ix(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? Bx(e, t, n, r, o) : Vx(t, n, o)), i;
}
function Ix(e, t, n) {
	let r = t.pane === "months", i = aS(t.view, n * (r ? 12 : 1));
	return Rx(e, Lx(i, r ? 4 : 7)) ? zx(e, i) : null;
}
function Lx(e, t) {
	return Sx(e, "date").slice(0, t);
}
function Rx(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function zx(e, t) {
	let n = Lx(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : xx(r, "date");
	return i === null ? t : nS(i);
}
function Bx(e, t, n, r, i) {
	let a = Zx(e), o = tS("div", `${H}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = tS("span", `${H}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = tS("div", `${H}__days`), c = Ox(/* @__PURE__ */ new Date()), l = ox(e), u = l ? U(e, !1) : r, d = l ? U(e, !0) : null, f = rS(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = iS(f, e), r = Sx(n, "date"), a = tS("button", kx);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(Mx, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${kx}--outside`), oS(n, c) && (a.classList.add(`${kx}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${kx}--marked`);
		let o = u !== null && oS(n, u), p = d !== null && oS(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${kx}--selected`), l && (o || p) && a.setAttribute("aria-description", D.text(o ? "ui.picker.start" : "ui.picker.end")), Ex(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${kx}--within`), fx(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = tS("div", `${H}__calendar-pane`);
	return p.append(o, s), p;
}
function Vx(e, t, n) {
	let r = tS("div", `${H}__months`);
	for (let i = 0; i < 12; i++) {
		let a = tS("button", Ax);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(jx, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Ax}--selected`), a.setAttribute("aria-current", "true")), Rx(n, Lx(Pi(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function Hx(e) {
	let t = tS("div", `${H}__period-caption`);
	return t.textContent = D.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Ux(e, t, n) {
	let r = dx(e);
	if (n.startsWith("month:")) {
		let e = Pi(t.view.getFullYear(), Number(n.slice(6)), 1);
		return Rx(r, Lx(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = Ix(r, t, -1) ?? t.view, !0;
		case "next": return t.view = Ix(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function Wx(e, t, n) {
	if (ox(e)) {
		Gx(e, t, n);
		return;
	}
	let r = Kx(n, cx(e) ?? _x(e));
	t.focusedDay = r, t.view = nS(r), px(e, r, !1);
}
function Gx(e, t, n) {
	let r = wx({
		start: U(e, !1),
		end: U(e, !0)
	}, t.activeEnd, Kx(n, _x(e)));
	t.focusedDay = r.end ?? r.start, t.view = nS(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, px(e, r.end, !0), px(e, r.start, !1);
}
function Kx(e, t) {
	return Pi(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function qx(e, t, n) {
	let r = Yx(n), i = Xx(t, n, Zx(e));
	if (i === null) return null;
	let a = dx(e);
	if (r === 0) return Jx(a, i);
	let o = i;
	for (let e = 0; e < Nx; e++) {
		if (fx(a, Sx(o, "date"))) return o;
		o = iS(o, r);
	}
	return t;
}
function Jx(e, t) {
	let n = Sx(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : xx(r, "date");
	return i === null ? t : Kx(i, t);
}
function Yx(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function Xx(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return iS(e, -1);
		case "ArrowRight": return iS(e, 1);
		case "ArrowUp": return iS(e, -7);
		case "ArrowDown": return iS(e, 7);
		case "PageUp": return aS(e, -1);
		case "PageDown": return aS(e, 1);
		case "Home": return iS(e, -r);
		case "End": return iS(e, 6 - r);
		default: return null;
	}
}
function Zx(e) {
	let t = Number(e.getAttribute(Wb));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Qx(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${kx}`)];
	if (i.length === 0) return;
	let a = Sx(Ox(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (j(i, o), r && F(o));
}
function $x(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? U(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${kx}`)) {
		let e = xx(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${kx}--preview`, e !== null && n !== null && r !== null && Tx(e, n, iS(r, 1)));
	}
}
function eS(e, t, n) {
	let r = tS("button", `${H}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(jx, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function tS(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function nS(e) {
	return Pi(e.getFullYear(), e.getMonth(), 1);
}
function rS(e, t) {
	let n = nS(e);
	return iS(n, -((n.getDay() - t + 7) % 7));
}
function iS(e, t) {
	return Pi(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function aS(e, t) {
	let n = Pi(e.getFullYear(), e.getMonth() + t, 1), r = Pi(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Pi(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function oS(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var sS = "ui-temporal-input__field", cS = "ui-temporal-input__popup", lS = "ui-temporal-input--open", uS = "ui-calendar__body", dS = "ui-temporal-input__time-cell", fS = "ui-temporal-input__time-column", pS = 140, mS = "data-ui-temporal-toggle", hS = "data-ui-temporal-unit", gS = "data-ui-temporal-cell", _S = "data-ui-temporal-centred", vS = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new pu({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(lS), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(lS);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(wb)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = oi(e.components, wb), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && yS(e) && this.states.set(e, Px(e)), this.isShowing(e) && this.renderSurface(e);
		}), L(this.root, wb, { attributeFilter: [...qb] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), L(this.root, wb, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), D.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) yS(e) && bS(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(wb)], t = D.temporal;
		if (t !== null && D.language !== this.drawnLanguage) {
			this.drawnLanguage = D.language;
			for (let n of e) tx(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || yS(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${uS}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && bS(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Ii(Xb(t), FS()), n = Di(Xb(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${sS}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = lx(t, sx(r))?.value ?? "", a = xx(i, Yb(t));
				if (a !== null) {
					r.value = Ci(a, Xb(t), $b(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(sS)) return;
		let t = e.target.closest(`.${H}`), n = t === null ? null : lx(t, sx(e.target));
		if (t === null || n === null) return;
		let r = mx(t, e.target.value), i = xx(r, Yb(t)), a = i === null ? r : Sx(i, Yb(t));
		if (xS(t, a)) {
			let n = U(t, sx(e.target));
			e.target.value = n === null ? "" : Ci(n, Xb(t), $b(t));
			return;
		}
		sx(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), hx(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(sS)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && ox(t) && (this.getState(t).activeEnd = sx(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !ox(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Mx}]`) : null, r = this.getState(t), i = n === null ? null : xx(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, $x(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${Mx}], .${dS}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(dS) ? RS(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = bS(e), r = xx(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, j([...n.querySelectorAll(`.${kx}`)], t), As(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(sS)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mS}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${H}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${jx}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${Mx}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${gS}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${hS}]`)?.getAttribute(hS);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(gS)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (Ux(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, _x(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), ox(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = xx(t, "date");
		if (n === null || A(e) || O(e) || !fx(dx(e), t)) return;
		let r = this.getState(e);
		yS(e) && ox(e) && !r.choosingEnd && U(e, !1) !== null && U(e, !0) !== null && (r.activeEnd = "start");
		let i = lx(e, !1), a = `${i?.value ?? ""}|${lx(e, !0)?.value ?? ""}`;
		Wx(e, r, n), yS(e) && `${i?.value ?? ""}|${lx(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = ox(e) && this.getState(e).activeEnd === "end", i = new Date(U(e, r) ?? _x(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		px(e, t, n), hx(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(sS)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${H}`), sx(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(dS)) {
			zS(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = xx(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Sx(n, "date"));
			return;
		}
		let r = qx(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = nS(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fS}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, pS)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fS}`), n = t?.getAttribute(hS) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Mf(this.wheelTurns.get(n) ?? 0, jf(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${dS}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${dS}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${dS}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(gS)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(_S));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(hS), i = AS(e);
		if (!(r === null || i === null || i.classList.contains(`${dS}--selected`))) {
			if (i.matches(":disabled")) {
				OS(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(gS)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${cS}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = ox(e) ? t ?? (U(e, !1) === null ? "start" : U(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = U(e, r.activeEnd === "end") ?? cx(e);
		r.pane = "days", r.view = nS(i ?? vx(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${mS}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => LS(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = Px(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = bS(e);
		if (n === null) return;
		let r = yS(e), i = Yb(e), a = this.getState(e), o = $b(e), s = ox(e), c = U(e, s && a.activeEnd === "end"), l = jS(n), u = MS(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(Hx(a)), r) n.append(Fx(e, a, o, c));
		else {
			let t = tS("div", `${H}__panes`);
			t.append(Fx(e, a, o, c)), i === "date-time" && t.append(SS(e, c)), n.append(t, PS(i));
		}
		let f = u === null ? null : n.querySelector(`[${jx}="${xr(u)}"]:not(:disabled)`);
		Qx(n, a, c, t || d && l === null && f === null), $x(e, a), r || (DS(n), OS(n), NS(n, l)), f !== null && F(f), r || this.popups.reposition(e);
	}
};
function yS(e) {
	return e.classList.contains(Cb);
}
function bS(e) {
	return e.querySelector(`.${yS(e) ? uS : cS}`);
}
function xS(e, t) {
	let n = dx(e), r = n.markedOnly ? xx(t, Yb(e)) : null;
	return r !== null && !n.marked.has(Sx(r, "date"));
}
function SS(e, t) {
	let n = Zb(e), r = tS("div", `${H}__time`), i = tS("div", `${H}__time-columns`);
	for (let r of CS(n)) i.append(ES(e, r, wS(n, r), t));
	return r.append(i), r;
}
function CS(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function wS(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function TS(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function ES(e, t, n, r) {
	let i = tS("div", fS);
	i.setAttribute(hS, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", D.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = TS(r, t), s = t === "hour" && nx(Xb(e)), c = $b(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = tS("button", dS);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? rx(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(gS, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${dS}--selected`), US(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function DS(e) {
	let t = e.querySelector(`.${H}__calendar`), n = e.querySelector(`.${H}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function OS(e) {
	for (let t of e.querySelectorAll(`.${fS}`)) {
		let e = t.querySelector(`.${dS}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, kS(t, e), t.setAttribute(_S, String(t.scrollTop));
	}
}
function kS(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function AS(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${dS}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function jS(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(dS) ? null : t.closest(`.${fS}`)?.getAttribute(hS) ?? null;
}
function MS(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(jx) : null;
}
function NS(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${fS}[${hS}="${t}"]`)?.querySelector(`.${dS}--selected`) ?? null;
	n !== null && F(n);
}
function PS(e) {
	let t = tS("div", `${H}__popup-footer`);
	return t.append(eS("now", D.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(eS("clear", D.text("ui.picker.clear"))), t.append(eS("done", D.text("ui.picker.done"))), t;
}
function FS() {
	return {
		year: IS("ui.picker.letter.year", Fi.year),
		month: IS("ui.picker.letter.month", Fi.month),
		day: IS("ui.picker.letter.day", Fi.day),
		hour: IS("ui.picker.letter.hour", Fi.hour),
		minute: IS("ui.picker.letter.minute", Fi.minute),
		second: IS("ui.picker.letter.second", Fi.second)
	};
}
function IS(e, t) {
	let n = D.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function LS(e, t) {
	for (let n of e.querySelectorAll(`.${sS}`)) if (sx(n) === t) return n;
	return e.querySelector(`.${sS}`);
}
function RS(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(dS) && As(e);
}
function zS(e) {
	let t = e.target, n = t.closest(`.${fS}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? VS(n, e.key === "ArrowRight" ? 1 : -1) : BS(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), HS(r));
}
function BS(e, t, n) {
	return _o({
		key: n,
		items: [...e.querySelectorAll(`.${dS}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function VS(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${fS}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${dS}--selected`) ?? r.querySelector(`.${dS}:not(:disabled)`);
}
function HS(e) {
	let t = e.closest(`.${fS}`);
	t !== null && kS(t, e);
}
function US(e, t, n, r) {
	let i = ux(e, Mb), a = ux(e, Nb);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var WS = "[data-ui-theme-switcher]", GS = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(WS) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Er.SetTheme,
				mode: KS() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function KS() {
	let e = document.documentElement.getAttribute(Ln);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var qS = `[${Bn}]`, JS = "ui-language-switcher__trigger", YS = "ui-language-switcher__label-text", XS = "ui-language-switcher__label-text--current", ZS = "ui-language-switcher__label-text--page", QS = "ui-language-switcher__menu", $S = "ui-language-switcher__choice", eC = "ui-language-switcher--open", tC = "ui.language.switch", nC = "ui.language.current", rC = class {
	options;
	root;
	menus = new pu({
		show: ({ owner: e }) => e.classList.add(eC),
		hide: ({ owner: e }) => e.classList.remove(eC),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), D.onChange(() => this.showLanguage(D.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$S}`), n = e.target.closest(qS);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Vn));
			return;
		}
		let r = e.target.closest(`.${JS}`);
		if (r === null || O(r)) return;
		e.preventDefault();
		let i = iC(n);
		if (i.length === 2) {
			let e = D.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(qS);
		if (t === null) return;
		let n = iC(t), r = e.target.closest(`.${JS}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !vo(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = _o({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$S}`);
		if (t === null || t === document.activeElement || O(t)) return;
		let n = t.closest(qS);
		n !== null && this.menus.isOpen(n) && As(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${QS}`);
		if (r === null) return;
		let i = iC(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Us(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Er.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(qS)) {
			let n = t.querySelector(`:scope > .${JS}`);
			if (n === null) continue;
			let r = iC(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${YS}`)) {
				let n = t.getAttribute(Vn) === e;
				t.classList.toggle(XS, n), t.classList.contains(ZS) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				D.write(n, "aria-label", tC, {
					language: aC(r, e),
					code: oC(e),
					other: aC(r, t),
					otherCode: oC(t)
				});
			} else D.write(n, "aria-label", nC, {
				language: aC(r, e),
				code: oC(e)
			});
		}
	}
};
function iC(e) {
	return [...e.querySelectorAll(`:scope > .${QS} > .${$S}`)];
}
function aC(e, t) {
	let n = e.find((e) => e.getAttribute(Vn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return oC(t);
	}
}
function oC(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var sC = `${Ee}__button`, cC = `${Ee}__more`, lC = `.${S}:not(${Kt})`, uC = "ui-text__icon", dC = `.ui-button__content .${uC}`, fC = ".ui-button__content .ui-text__title", pC = /* @__PURE__ */ new WeakMap();
function mC(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(lC)) hC(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(qt) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function hC(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function gC(e, t) {
	let n = t.entries.map((e) => _C(e, t));
	return t.more && t.openMore !== void 0 && n.push(yC(t.openMore)), e.replaceChildren(...n), n;
}
function _C(e, t) {
	let n = bC(sC), r = SC(e), i = vC(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), O(e) && (n.classList.add(ir), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), pC.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function vC(e) {
	let t = e.querySelector(dC);
	if (t === null || !t.className.split(" ").some(sf)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(uC), n.setAttribute(nf, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(rf);
	return r.length > 0 && n.style.setProperty(rf, r), n;
}
function yC(e) {
	let t = bC(`${sC} ${cC}`);
	return t.setAttribute("aria-haspopup", "menu"), D.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function bC(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${hr}`, t.tabIndex = -1, t;
}
function xC(e) {
	return pC.get(e) ?? null;
}
function SC(e) {
	return e.querySelector(fC)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var CC = 500, wC = 10, TC = /* @__PURE__ */ new WeakSet();
function EC(e) {
	return TC.has(e);
}
var DC = class {
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
			timer: setTimeout(() => this.fire(), CC)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > wC && (this.slid = !0), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > wC && this.cancel();
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
		TC.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!TC.has(e)) {
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
}, OC = "tabs:rename", kC = "tabs:pin", AC = "tabs:unpin", jC = "tabs:close", MC = "tabs:delete";
function NC(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function PC(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[OC, e.rename && t.renamable],
		[kC, e.pin && !t.pinned],
		[AC, e.pin && t.pinned],
		[jC, e.close && !e.delete && n],
		[MC, e.delete && n]
	]);
}
function FC(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var IC = "data-ui-context-menu-owner", LC = ye, RC = "ui-context-menu--open", zC = `.${S}:not(${Kt})`, BC = `${Ee}--strip`, VC = `.${Ee}:not(.${BC}) > .${cC}`, HC = "input, textarea, select, [contenteditable=''], [contenteditable='true']", UC = "ui-context-menu-opening", WC = Jt, GC = class {
	root;
	closed = null;
	menus = new pu({
		show: ({ popup: e }) => e.classList.add(RC),
		hide: ({ popup: e }, t) => {
			e.classList.remove(RC), this.closed = e, t === "outside" && iw();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new DC({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${IC}]`) !== null && e.closest(HC) === null
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
		let n = KC(t);
		n !== null && (e.preventDefault(), this.open(n.owner, n.menu, e.clientX, e.clientY, ZC(e) ? t : null, t.closest(VC)));
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${BC}`)?.remove(), QC(t), i !== null && $C(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && tw(t), this.closed !== null && (Wc(this.closed), this.closed = null);
		let o = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? Es(), s = {
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
			returnFocus: () => (o === null ? null : Ws(o)) ?? Ws(e)
		}) && (a === null && Pl(t, n, r), rw(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(WC) !== null || this.menus.close();
	}
};
function KC(e) {
	let t = e.closest(`[${le}]`);
	for (let n = e.closest(`[${IC}]`); n !== null; n = n.parentElement?.closest(`[${IC}]`) ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = JC(n, e);
		if (r.length === 0 || O(n)) continue;
		if (ow(n)) return null;
		let i = r.find((t) => YC(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var qC = `[${IC}]`;
function JC(e, t) {
	let n = t.closest(`[${be}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? aw(e, r) : null, aw(e, "")].filter((e) => e !== null);
}
function YC(e, t, n) {
	let r = new CustomEvent(UC, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function XC(e, t) {
	let n = e.closest(`[${IC}]`), r = e.closest(`[${le}]`);
	return n === null || O(n) || ow(n) || r !== null && n.contains(r) ? null : JC(n, e).find((n) => YC(n, e, t)) ?? null;
}
function ZC(e) {
	let t = e.pointerType;
	return EC(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Os();
}
function QC(e) {
	for (let t of e.querySelectorAll(`[${we}]`)) t.removeAttribute(we);
}
function $C(e, t, n) {
	let r = n.closest(`[${xe}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !JC(e, r).includes(t)) return;
	let { entries: i } = mC(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${Ee} ${BC}`, a.setAttribute("role", "group"), gC(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: ew
	}), t.insertBefore(a, t.firstElementChild);
}
function ew(e) {
	O(e) || e.click();
}
function tw(e) {
	let { entries: t } = mC(e), n = e.querySelector(`.${Ht}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) nw(e);
	let r = z(n, `.${S}`, `.${Ht}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && hC(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Kt)) ? nw(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Vt);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	FC(a).forEach((e, t) => {
		a[t] === "rule" && !e && nw(i[t]);
	});
}
function nw(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(we, "");
}
function rw(e) {
	let t = e.querySelector(`.${Ht}`);
	t !== null && Us(e, z(t, zC, `.${Ht}`));
}
function iw() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${hs}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function aw(e, t) {
	for (let n of e.querySelectorAll(`[${LC}]`)) if ((n.getAttribute(LC) ?? "") === t && n.closest(`[${IC}]`) === e) return n;
	return null;
}
function ow(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${b}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function sw(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function cw(e) {
	return getComputedStyle(e).display !== "none";
}
function lw(e) {
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
				if (e.overflowX !== "visible" && fw(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && fw(n, a, a + t.clientHeight, !1), pw(n)) return !0;
			}
			r = e.position;
		}
	}
	return fw(n, 0, window.innerWidth, !0), fw(n, 0, window.innerHeight, !1), pw(n);
}
function uw(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !sw(n, !1)) && (dw(e.overflowX) || dw(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function dw(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function fw(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function pw(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var mw = `[${xe}]`, hw = `[${Bl}]:not([hidden]), dialog[open]`, gw = `.${Ee}`, _w = `${Ee}--out`, vw = 6, yw = "--ui-action-bar-gap", bw = 400, xw = /* @__PURE__ */ new WeakMap(), Sw = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	Te,
	...tr
], Cw = class {
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
		if (n === null || n.closest(`${gw}, [data-ui-context-menu]`) !== null) return;
		let r = ww(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : Dw(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? Ow(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(gw) === null && ZC(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(gw);
		if (n !== null) {
			this.isHostedBar(n) && j(Fw(n), t);
			return;
		}
		Ds() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(Tw(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(gw) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(M) && this.choose(Tw(t));
			return;
		}
		let n = t.closest(gw);
		if (n !== null && t.classList.contains(sC)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest(hw);
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(M)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(M) && this.choose(Tw(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && zw(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Ws(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = Fw(t), i = _o({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), j(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : Dw(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = uw(e);
		if (t === void 0 || n === null || !sw(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + Aw(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, ll(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		XC(e, !0) === null && this.hide(e, t);
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
				this.chosen = Ow(e), this.sync();
			}
			for (let e of this.shown.values()) ll(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = XC(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = Ee, n.setAttribute("role", "toolbar"), D.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Be, ""), n.setAttribute(de, ""), !jw(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, Pw(e)), rl(e, n, {
			placement: kw(e),
			gap: Aw(e),
			boundary: uw(e) ?? void 0
		}), n.classList.toggle(_w, lw(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: Sw
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		}), xw.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : xC(r);
		if (!jw(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = Fw(t.bar), o = a.find((e) => xC(e) === i) ?? a.find(bo) ?? null;
		o !== null && (j(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || Lw(t)) return;
		if (this.menuHost = e, Rw(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		Mw(n.bar, !0);
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
		Mw(t.bar, !1);
		let n = document.activeElement;
		!Ds() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && Nw(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), ul(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(_w, lw(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : Fw(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function ww(e) {
	let t = e.closest(mw);
	if (t !== null) return t;
	let n = e.closest(`[${b}]`), r = e.closest(C);
	return n === null || r !== null && !r.contains(n) ? null : Ew(n)[0] ?? null;
}
function Tw(e) {
	if (e.matches(M)) for (let t of e.querySelectorAll(`[${De}]`)) {
		if (t.closest(M) !== e) continue;
		let n = Ew(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(mw);
}
function Ew(e) {
	let t = [...e.querySelectorAll(mw)];
	return e.matches(mw) ? [e, ...t] : t;
}
function Dw(e) {
	let t = e.getAttribute(Se);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Se,
		key: t,
		index: 0
	};
	let n = e.closest(`[${b}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: b,
		key: r,
		index: Ew(n).indexOf(e)
	};
}
function Ow(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return Ew(t)[e.index] ?? null;
	return null;
}
function kw(e) {
	let t = e.getAttribute(xe);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function Aw(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(yw));
	return Number.isFinite(t) ? t : vw;
}
function jw(e, t, n, r) {
	let { entries: i, more: a } = mC(t);
	if (i.length === 0 && !a) return !1;
	let o = gC(e, {
		entries: i,
		more: a,
		role: "button",
		press: Iw,
		openMore: n
	});
	return j(o, o.find((e) => !O(e)) ?? o[0] ?? null), Mw(e, r), !0;
}
function Mw(e, t) {
	Nw(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function Nw(e) {
	return Fw(e).find((e) => xC(e) === null) ?? null;
}
function Pw(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function Fw(e) {
	return [...e.querySelectorAll(`:scope > .${sC}`)];
}
function Iw(e, t) {
	if (O(t) || Lw(t)) return;
	let n = XC(t, !1);
	n === null || !n.contains(e) || O(e) || !hC(e, n) || e.click();
}
function Lw(e) {
	let t = e.closest(gw), n = t === null ? void 0 : xw.get(t);
	return n !== void 0 && Os() && Date.now() - n < bw;
}
function Rw(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function zw(e) {
	return e.matches(hs) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Bw = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Vw = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function Hw(e) {
	return `(min-width: ${Vw[e]}px)`;
}
var Uw = Hw("md");
function Ww(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(Hw(t))) return t;
	return "base";
}
function Gw(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function Kw(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function qw(e, t) {
	return Jw(t, (t) => Kw(e, t));
}
function Jw(e, t) {
	for (let n = Bw.indexOf(e); n >= 0; n--) {
		let e = t(Bw[n]);
		if (e != null) return e;
	}
}
//#endregion
//#region src/state/client-store.ts
var Yw = "ne.ui", Xw = "boot", Zw = /* @__PURE__ */ new Set(), Qw = class {
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
		let r = this.resolveKey(e, Xw);
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
		let n = e.getAttribute(Fe);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Zw.has(n) || (Zw.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Yw}:${n}:${t}`;
	}
}, $w = "ui-menu--nested", eT = "ui-menu__submenu", tT = At, nT = Mt, rT = "data-ui-menu-flyout", iT = `[${rT}], .ui-context-menu, .${lr}`, aT = "data-ui-menu-unfolded", oT = jt, sT = "data-ui-menu-rail-list", cT = "menu-open-group", lT = ze("click"), uT = class {
	root;
	store = new Qw();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new pu({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(nT, ""), t.setAttribute(rT, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(nT), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(rT);
			}, I.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
		let t = this.root.querySelectorAll(`.${Ht}`);
		hT(t), this.reconcileEach(t), L(this.root, `.${Ht}`, {
			childList: !0,
			attributeFilter: [kt]
		}, (e) => {
			hT(e), this.reconcileEach(e);
		});
		for (let e of this.root.querySelectorAll(`[${tT}]`)) dT(e);
		L(this.root, `[${tT}]`, {
			childList: !0,
			attributeFilter: [nT]
		}, (e) => {
			for (let t of e) dT(t);
		}), typeof matchMedia == "function" && matchMedia(Uw).addEventListener("change", () => {
			this.closeBarFlyout(), this.refitDrawerRails();
		});
	}
	refitDrawerRails() {
		let e = this.root.querySelectorAll(`[${zt}] .${Ht}`);
		hT(e), this.reconcileEach(e);
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = gT(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), fT(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${tT}]`)) dT(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Wt}`), e);
		if (t !== null && !t.hasAttribute(oT)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains($w) ? null : this.store.read(e, cT), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${Ht}`);
		a !== null && (gT(a) || i.hasAttribute(oT) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains($w);
		if (e.setAttribute(aT, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(nT);
			return;
		}
		if (t.hasAttribute(nT)) {
			t.removeAttribute(nT), n || this.store.write(e, cT, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, cT, t.getAttribute(b));
	}
	openInline(e) {
		e.setAttribute(nT, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${tT}][${nT}]`)) t.hasAttribute(oT) || t.removeAttribute(nT);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		fT(e), this.closeGroups(e);
		let a = n.closest(iT) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${pT(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Ht}`);
		o !== null && !Ds() && Us(o, z(o, `.${S}:not(${Kt})`, `.${Ht}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${tT}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(qt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${tT}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${eT}`);
	}
};
function dT(e) {
	let t = e.querySelector(`:scope > .${S}`), n = e.closest(`.${Ht}`);
	t !== null && (t.setAttribute(lT, ""), t.setAttribute(Be, ""), t.setAttribute("aria-expanded", e.hasAttribute(nT) ? "true" : "false"), e.hasAttribute(oT) || n !== null && gT(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function fT(e) {
	for (let t of e.querySelectorAll(`[${rT}]`)) t.removeAttribute(rT);
}
function pT(e) {
	return mT(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function mT(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(Uw).matches;
}
function hT(e) {
	let t = typeof matchMedia == "function" && !matchMedia(Uw).matches;
	for (let n of e) !n.classList.contains("ui-menu--rail") && !n.hasAttribute(sT) || n.closest("[data-ui-rail-drawer]") === null || (n.classList.toggle(Gt, !t), n.toggleAttribute(sT, t));
}
function gT(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/rendering/inline-markup.ts
var _T = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, vT = "\\", yT = "`", bT = "!", xT = "{", ST = "}", CT = "ui-text__fold", wT = "ui-text__fold-toggle", TT = "ui-text__fold-content", ET = 8;
function DT(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return zT(new JT(e), 0, e.length, _T.None, null, t, n), BT(t, n, _T.None, null), t;
}
function OT(e) {
	return DT(e).map((e) => NT(e) ? `${e.fold} ${OT(e.text)}` : e.text).join("");
}
function kT(e) {
	let t = "";
	for (let n of e) t += ZT(n) ? vT + n : n;
	return t;
}
function AT(e, t, n = {}) {
	let r = DT(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && jT(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(PT(r, n));
}
function jT(e) {
	return e.styles === _T.None && e.url === null && !MT(e) && !NT(e);
}
function MT(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function NT(e) {
	return e.fold !== null && e.fold !== void 0;
}
function PT(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(FT(r, t));
	return n;
}
function FT(e, t) {
	if (MT(e)) return LT(e.icon);
	let n = NT(e) ? IT(e, t) : document.createTextNode(e.text);
	if ((e.styles & _T.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & _T.Strikethrough) !== 0 && (n = RT("s", n)), (e.styles & _T.Underline) !== 0 && (n = RT("u", n)), (e.styles & _T.Italic) !== 0 && (n = RT("em", n)), (e.styles & _T.Bold) !== 0 && (n = RT("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Vd(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function IT(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${CT} ${CT}--static` : CT, r.className = wT, r.textContent = e.fold ?? "", i.className = TT, i.append(PT(DT(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Be, ""), n.append(r, i), n);
}
function LT(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", af(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function RT(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function zT(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === vT && c + 1 < n && ZT(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = VT(e, c, n);
		if (l !== null) {
			BT(a, o, r, i), HT(s, c + 1, l, o), BT(a, o, r | _T.Code, i), c = l + 1;
			continue;
		}
		let u = GT(e, c, n);
		if (u !== null) {
			BT(a, o, r, i), zT(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), BT(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = UT(e, c, n);
		if (d !== null) {
			BT(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? KT(e, c, n) : null;
		if (f !== null) {
			BT(a, o, r, i), zT(e, f.labelStart, f.labelEnd, r, f.url, a, o), BT(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = qT(e, c, n);
		if (p !== null) {
			BT(a, o, r, i), a.push({
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
function BT(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function VT(e, t, n) {
	let r = e.text;
	if (r[t] !== yT) return null;
	let i = t + 1;
	if (i >= n || QT(r[i])) return null;
	let a = e.findClosingMarker(i, n, yT, 1);
	return a > i ? a : null;
}
function HT(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === vT && i + 1 < n && ZT(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function UT(e, t, n) {
	let r = e.text;
	if (r[t] !== bT || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return WT(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function WT(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function GT(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = _T.Bold, s = 2;
	else if (i === "*") o = _T.Italic, s = 1;
	else if (i === "_" && a) o = _T.Underline, s = 2;
	else if (i === "~" && a) o = _T.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || QT(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function KT(e, t, n) {
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
function qT(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== xT || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > ET) return null;
	let c = { value: "" };
	return HT(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var JT = class {
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
		return this.closeBrackets ??= this.next("]", !0), YT(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), YT(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), YT(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return YT(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = XT(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !QT(this.text[s - 1]) ? s : -1;
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
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === vT && e[t - 1] === 0);
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
			if (this.text[r] === xT) n.push(r);
			else if (this.text[r] === ST && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || QT(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function YT(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function XT(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function ZT(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === xT || e === ST || e === yT || e === vT;
}
function QT(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var $T = "ui-tooltip", eE = "ui-tooltip", tE = "ui-tooltip--visible", nE = "[aria-haspopup][aria-expanded=\"true\"]", rE = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", iE = "top", aE = 250, oE = 200, sE = 300, cE = 7, lE = null, uE = null, dE = null, fE = null, pE = null, mE = 0, hE = null, gE = 0, _E = 0, vE = !1, yE = /* @__PURE__ */ new Set();
function bE(e) {
	yE.add(e);
}
function xE(e = document) {
	if (vE) return;
	vE = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", SE, !0), t.addEventListener("pointerout", TE, !0), t.addEventListener("focusin", DE, !0), t.addEventListener("focusout", OE, !0), t.addEventListener("keydown", kE, !0), t.addEventListener("scroll", wE, !0), t.addEventListener("pointerdown", AE, !0), t.addEventListener("click", jE, !0), window.addEventListener("blur", () => {
		fE = null, $E(!0);
	});
}
function SE(e) {
	if (CE(), NE(e.target)) {
		window.clearTimeout(gE);
		return;
	}
	let t = PE(e.target);
	t !== null && t !== uE && zE(t);
}
function CE() {
	uE === null || uE.isConnected || (fE = null, $E(!0));
}
function wE(e) {
	if (CE(), uE === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(uE) || lw(uE) && (fE = null, $E(!0));
}
function TE(e) {
	if (fE !== null || pE !== null) return;
	let t = e.relatedTarget, n = uE ?? hE?.target ?? null, r = n === null ? null : EE(n);
	t instanceof Node && (r !== null && r.contains(t) || NE(t)) || (NE(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && $E(!1);
}
function EE(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && FE(t) === e ? t : e;
}
function DE(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = PE(e.target);
	t !== null && (fE = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, BE(t));
}
function OE(e) {
	PE(e.target) === uE && (fE = null, $E(!0));
}
function kE(e) {
	e.key === "Escape" && uE !== null && (fE = null, $E(!0));
}
function AE(e) {
	if (NE(e.target)) return;
	let t = ME(e.target);
	if (t !== null) {
		if (pE === t) {
			$E(!0);
			return;
		}
		fE = null, $E(!0), BE(t), pE = uE;
		return;
	}
	fE === null && $E(!0);
}
function jE(e) {
	ME(e.target) !== null && e.preventDefault();
}
function ME(e) {
	let t = PE(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(rE);
	return n === null || n.contains(t) ? t : null;
}
function NE(e) {
	return lE !== null && e instanceof Node && lE.contains(e);
}
function PE(e) {
	if (!(e instanceof Element)) return null;
	let t = FE(e);
	for (let n of yE) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && RE(r).length > 0) return r;
	}
	return t;
}
function FE(e) {
	let t = e.closest(`[${Oe}], [${Ae}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function IE(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + LE(e) : RE(e);
}
function LE(e) {
	let t = "";
	for (let n of yE) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function RE(e) {
	for (let t of yE) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function zE(e, t) {
	if (fE === null && pE === null) {
		if (window.clearTimeout(gE), hE !== null && hE.target === e) {
			hE.words = t;
			return;
		}
		if (window.clearTimeout(mE), hE = null, uE !== null) {
			$E(!0), BE(e, t);
			return;
		}
		if (Date.now() - _E < sE) {
			BE(e, t);
			return;
		}
		hE = {
			target: e,
			words: t
		}, mE = window.setTimeout(() => {
			let e = hE;
			hE = null, e !== null && BE(e.target, e.words);
		}, aE);
	}
}
function BE(e, t) {
	let n = (t ?? IE(e)).trim();
	if (n.length === 0 || !e.isConnected || VE(e) || lw(e)) return;
	window.clearTimeout(mE), window.clearTimeout(gE), hE = null;
	let r = eD();
	AT(r, n, { staticFolds: !0 }), r.classList.add(tE), uE = e, UE(HE(e)), r.setAttribute("data-ui-tooltip-text", OT(n)), KE(r, e.getAttribute(je)), nl(e, r), rl(e, r, {
		placement: QE(e),
		gap: cE,
		arrow: !0
	});
}
function VE(e) {
	return e.matches(nE) || e.querySelector(nE) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function HE(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function UE(e) {
	dE !== null && dE !== e && WE();
	let t = GE(e);
	t.includes(eE) || e.setAttribute("aria-describedby", [...t, eE].join(" ")), dE = e;
}
function WE() {
	if (dE === null) return;
	let e = GE(dE).filter((e) => e !== eE);
	e.length === 0 ? dE.removeAttribute("aria-describedby") : dE.setAttribute("aria-describedby", e.join(" ")), dE = null;
}
function GE(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function KE(e, t) {
	t === null ? e.removeAttribute(je) : e.setAttribute(je, t);
}
function qE(e, t, n) {
	n?.delay === !0 && uE !== e ? zE(e, t) : BE(e, t);
}
function JE() {
	$E(!0);
}
var YE = {
	show: qE,
	hide: JE
};
function XE(e) {
	fE = e, BE(e);
}
function ZE(e) {
	if (uE === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			fE = null, $E(!0);
			return;
		}
		BE(e);
	}
}
function QE(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of yE) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(ke);
	return t !== null && Kc(t) ? t : iE;
}
function $E(e) {
	window.clearTimeout(mE), window.clearTimeout(gE), hE = null;
	let t = () => {
		uE !== null && (WE(), uE = null, pE = null, lE !== null && (lE.classList.remove(tE), ul(lE)), _E = Date.now());
	};
	e ? t() : gE = window.setTimeout(t, oE);
}
function eD() {
	return lE !== null && lE.isConnected ? lE : (lE = document.createElement("div"), lE.id = eE, lE.className = $T, lE.setAttribute("role", "tooltip"), lE.setAttribute("aria-hidden", "true"), document.body.append(lE), lE);
}
//#endregion
//#region src/interactions/menu-engine.ts
var tD = "ui-orientation--horizontal", nD = `.${Gt} > .ui-menu__host > .ui-menu__item > .${S}`, rD = `${nD}, ${`.ui-menu[${kt}] > .ui-menu__host > .ui-menu__item > .${S}`}`, iD = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", aD = "[role='menuitem'], [role='menuitemcheckbox']", oD = class {
	root;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), bE(sD), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(lD) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Ft]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Ht}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && j(t, t.find((e) => e.classList.contains("ui-menu-item--selected") && bo(e)) ?? t.find(bo) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			cD(e, t);
			return;
		}
		let r = this.ownItems(n), i = _o({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(tD) || mT(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), j(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Ht}`);
		if (n === null) return;
		let r = this.ownItems(n), i = _o({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(tD) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), j(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${S}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && j(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${S}`) : null;
		if (t === null || t === document.activeElement || !t.matches(aD) || t.matches(Kt) || !bo(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && As(t);
	}
	ownItems(e) {
		return z(e, `.${S}:not(${Kt})`, `.${Ht}`);
	}
}, sD = {
	anchor: (e) => e.closest(rD),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(iD), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(nD) && t.scrollWidth <= t.clientWidth ? null : kT(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Ht}`);
		return t === null ? null : pT(t);
	}
};
function cD(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(Kt) || !bo(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function lD(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var uD = "shortcut:", dD = ":scope > .ui-menu-item__shortcut", fD = `[${ye}]`, pD = `[${Yt}]`, mD = ".ui-text__title", hD = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), bE(TD), SD(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) xD(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Yt]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || _D(e))) return;
		let t = Kl(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Py(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !bo(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), bD(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Py(t, e);
		let r = n ? vD() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = KC(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(pD)].filter((t) => {
			let n = Ny(t.getAttribute(Yt));
			return n !== null && Py(n, e) && !O(t) && hC(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), bD(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(pD)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = Ny(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(fD) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(Uy(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = Ny(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = Uy(e.shortcut);
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
function gD(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(uD) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function _D(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return mo(t) || t instanceof HTMLElement && t.isContentEditable;
}
function vD() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = es(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? rs(z(t.root, Ao, M));
	return n === null ? t.root : yD(n);
}
function yD(e) {
	if (e.matches(qC)) return e;
	for (let t of e.querySelectorAll(qC)) if (t.closest(Ao) === e) return t;
	return e;
}
function bD(e) {
	mo(e.target) && e.target.dispatchEvent(new Event(xm, { bubbles: !0 }));
}
function xD(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && CD(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && SD(t);
}
function SD(e) {
	e instanceof HTMLElement && e.matches(pD) && CD(e);
	for (let t of e.querySelectorAll(pD)) CD(t);
}
function CD(e) {
	let t = e.querySelector(dD);
	if (t === null) return;
	let n = wD(e) ?? "";
	t.textContent !== n && (t.textContent = n);
}
function wD(e) {
	let t = e.getAttribute(Yt), n = Ny(t);
	return n === null ? t?.trim() || null : Fy(n);
}
var TD = {
	anchor: (e) => {
		let t = e.closest(pD);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(fD) !== null ? null : t;
	},
	words: (e) => {
		let t = wD(e), n = (e.getAttribute("aria-label") ?? e.querySelector(mD)?.textContent ?? "").trim();
		return t === null ? null : kT(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = wD(e);
		return t === null ? null : kT(`(${t})`);
	}
}, ED = 50, DD = 1, OD = 7;
function kD(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = ID(e, "data-ui-window-size") ?? 0;
	return {
		offset: ID(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : ED,
		total: ID(e, xt),
		moreAfter: e.getAttribute(Ct) === "true"
	};
}
function AD(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function jD(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function MD(e, t) {
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
			let n = Number(t), r = jD(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === AD(e) ? null : (n - 1) * e.size;
		}
	}
}
function ND(e, t) {
	if (t <= OD) return FD(1, t);
	let n = Math.max(Math.min(e - DD, t - 2 - 2), 3), r = Math.min(Math.max(e + DD, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...FD(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function PD(e, t) {
	let n = ND(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function FD(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function ID(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/interactions/pager-engine.ts
var LD = ".ui-pager", RD = "ui-pager__button", zD = "ui-pager__number", BD = "ui-pager__pages", VD = "ui-pager__gap", HD = "ui-pager__range", UD = "ui-pager__size", WD = "ui-pager__size--open", GD = "ui-pager__size-trigger", KD = "ui-pager__size-label", qD = "ui-pager__sizes", JD = "ui-pager__size-choice", YD = [
	RD,
	zD,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], XD = "ui.pager.page", ZD = "ui.pager.range", QD = "ui.pager.rows", $D = "ui.pager.size", eO = [
	bt,
	xt,
	Ct,
	yt,
	vt
], tO = "page-size", nO = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new Qw();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new pu({
		show: ({ owner: e }) => e.classList.add(WD),
		hide: ({ owner: e }) => e.classList.remove(WD),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), L(this.root, `${LD}, [${x}]`, {
			childList: !0,
			attributeFilter: eO,
			relevant: (e) => e.type === "attributes" || fO(e.target) || pO(e)
		}, (e) => this.syncFound(e)), D.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(LD)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(LD)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(C), n = t === null ? 0 : E(t);
		return n > 0 ? [...this.root.querySelectorAll(`${LD}[${Ze}="${xr(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(Ze));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = uO(e);
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
		let i = kD(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = h_(e), s = (e) => g_(e, "N0", o);
		this.drawNumbers(e, i, o), iO(e, i, s), aO(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${RD}[${Qe}]`)) eo.setDisabled(t, MD(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		sO(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${BD}`);
		if (r === null) return;
		let i = AD(t), a = jD(t), o = a === null ? PD(i, t.moreAfter) : ND(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => rO(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(LD);
		if (t === null || O(e.target)) return;
		let n = e.target.closest(`.${JD}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute($e)));
			return;
		}
		let r = e.target.closest(`.${GD}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${Qe}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = MD(kD(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), To(e).top > 0 && Eo(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(LD);
		if (t === null) return;
		let n = e.target.closest(`.${UD}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${RD}, .${GD}`), i = oO(t);
		if (r === null || !i.includes(r)) return;
		let a = _o({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal",
			loop: !1
		});
		a !== null && (e.preventDefault(), j(i, a), a.focus());
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${GD}`) : null;
		if (n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) return e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0;
		if (!this.menus.isOpen(t) || !vo(e.key, "vertical")) return !1;
		let r = lO(t), i = e.target instanceof HTMLElement && r.includes(e.target) ? e.target : null, a = _o({
			key: e.key,
			items: r,
			current: i,
			axis: "vertical"
		});
		return a !== null && (e.preventDefault(), a.focus()), !0;
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${JD}`) : null;
		if (t === null || t === document.activeElement || O(t)) return;
		let n = t.closest(`.${UD}`);
		n !== null && this.menus.isOpen(n) && As(t);
	}
	toggleSizes(e) {
		let t = e.closest(`.${UD}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${qD}`);
		if (r === null) return;
		let i = lO(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: t,
			placement: { placement: "bottom-end" },
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Us(r, i, n);
	}
	restoreSize(e, t, n) {
		let r = this.store.read(t, tO), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!cO(e, i)) {
			this.store.write(t, tO, null);
			return;
		}
		let a = kD(n);
		i !== a.size && (n.setAttribute(yt, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${UD}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = kD(r.host);
		t !== i.size && (this.store.write(r.component, tO, String(t)), r.host.setAttribute(yt, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !(e.target instanceof Element)) return;
		let t = es(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || O(t.root) || t.row !== null && rm(e.target, t.row) !== null) return;
		let n = uO(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = MD(kD(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = dO(e), i = rs(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = dO(e);
		o.length > 0 && as(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function rO(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = VD, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = g_(e, "N0", n);
	return r.className = YD.join(" "), r.setAttribute("type", "button"), r.setAttribute(Qe, String(e)), r.textContent = i, D.write(r, "aria-label", XD, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function iO(e, t, n) {
	let r = e.querySelector(`:scope > .${HD}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? D.write(r, null, QD, {
		from: i,
		to: a
	}) : D.write(r, null, ZD, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function aO(e, t, n) {
	let r = e.querySelector(`:scope > .${UD}`), i = r?.querySelector(`.${KD}`) ?? null;
	if (r !== null && i !== null) {
		D.write(i, null, $D, { size: n(t.size) });
		for (let e of lO(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function oO(e) {
	return [...e.querySelectorAll(`.${RD}, .${GD}`)];
}
function sO(e) {
	let t = oO(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	j(t, n ?? r.find(bo) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function cO(e, t) {
	let n = e.querySelector(`:scope > .${UD}`);
	return n !== null && lO(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function lO(e) {
	return [...e.querySelectorAll(`:scope > .${qD} > .${JD}`)];
}
function uO(e) {
	for (let t of e.querySelectorAll(`[${x}][${dt}="windowed"]`)) if (t.closest(C) === e) return t;
	return null;
}
function dO(e) {
	return z(e, Ao, M);
}
function fO(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function pO(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(LD) || t.querySelector(LD) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var mO = `.${Ht}[${Nt}]`, hO = ":scope > .ui-collapsible__bar", gO = ":scope > .ui-menu__host", _O = "ui-menu__item", vO = `:scope > .${S}`, yO = ".ui-text__title", bO = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", xO = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), L(t, mO, {
			childList: !0,
			characterData: !0,
			attributeFilter: [kt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = SO(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(gO);
		if (n === null) return;
		let r = nh(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: CO(n)
		}), e.setAttribute(Pt, ""), Sh(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of wO(e)) {
			let e = TO(a);
			if (e === "header") {
				n !== null && DO(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			DO(a, o), r ||= o, i ||= o;
		}
		return n !== null && DO(n, r), i;
	}
	match(e, t) {
		let n = ih(EO(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(bO) : null;
		if (r === null) return n;
		if (n) return OO(r), e.removeAttribute(Mt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Mt, i), i;
	}
	clear(e, t) {
		OO(t), e.removeAttribute(Pt), wO(t).length > 0 && Sh(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(kt);
		for (let e of t.querySelectorAll(`[${At}]:not([${jt}])`)) e.toggleAttribute(Mt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...SO(e.target)?.querySelector(gO)?.querySelectorAll(`.ui-menu-item:not(${Kt})`) ?? []].find(bo);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function SO(e) {
	let t = e.closest(mO), n = t?.querySelector(hO) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function CO(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${At}][${Mt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function wO(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(_O));
}
function TO(e) {
	return e.querySelector(vO)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function EO(e) {
	return rh(e.querySelector(vO)?.querySelector(yO)?.textContent ?? "", e);
}
function DO(e, t) {
	e.toggleAttribute(Ft, !t);
}
function OO(e) {
	for (let t of e.querySelectorAll(`[${Ft}]`)) t.removeAttribute(Ft);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var kO = "[data-ui-root]", AO = "a[href]", jO = `.ui-context-menu, .ui-split-button__menu, .${lr}`, MO = "ui-collapsible", NO = "right-side", PO = "ui-side--left", FO = "ui-side--right", IO = class {
	root;
	holders = /* @__PURE__ */ new Map();
	openers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(Uw).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${It}]`);
		if (t !== null) {
			let e = t.closest(kO), n = t.getAttribute(It);
			e !== null && n !== null && this.toggle(e, n, t);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${Xt}]`);
		if (n !== null && !e.defaultPrevented && LO(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(`${AO}, .${S}`), i = r?.closest(`[${Bt}]`), a = i?.parentElement ?? null;
		r !== null && i != null && a?.getAttribute("data-ui-drawer-open") === i.getAttribute("data-ui-region") && RO(r) && this.close(a);
	}
	handleKeydown(e) {
		e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && this.closeAll();
	}
	toggle(e, t, n) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		let r = zO(e, t);
		r === null || r.hasAttribute("data-ui-bottom-bar") || (e.setAttribute(Lt, t), this.openers.set(e, n), this.markToggles(e), this.hold(r), this.focusInto(e, t, r, document.activeElement, Ds(), performance.now() + I.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(ur, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Bs(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${kO}[${Lt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(Lt);
		if (e.removeAttribute(Lt), this.markToggles(e), t === null) return;
		let n = zO(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = this.returnTarget(e, t);
			i !== null && n !== null && n.contains(r) ? Js(i, n) : i !== null && F(i);
		}
		this.release(n);
	}
	returnTarget(e, t) {
		let n = this.openers.get(e);
		if (this.openers.delete(e), n?.isConnected === !0 && n.getAttribute("data-ui-drawer-toggle") === t && n.checkVisibility()) return n;
		let r = [...e.querySelectorAll(`[${It}="${xr(t)}"]`)];
		return r.find((e) => e.checkVisibility()) ?? r[0] ?? null;
	}
	markToggles(e) {
		let t = e.getAttribute(Lt);
		for (let n of e.querySelectorAll(`[${It}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(It) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(ur), t && e.removeAttribute("tabindex"));
	}
};
function LO(e) {
	let t = e.closest(`.${MO}`), n = t?.closest(`[${Bt}]`), r = n?.getAttribute(Bt), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(kO) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === NO ? FO : PO);
}
function RO(e) {
	return !e.classList.contains("ui-menu-item") || !e.matches(`${qt}, ${Kt}`) && e.getAttribute("data-ui-menu-item-kind") !== "check" && !O(e) && e.closest(jO) === null;
}
function zO(e, t) {
	return e.querySelector(`:scope > [${Bt}="${xr(t)}"]`);
}
//#endregion
//#region src/interactions/skip-link-engine.ts
var BO = "[data-ui-root]", VO = "content", HO = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-ui-skip-link]")?.closest(BO)?.querySelector(`:scope > [data-ui-region="${VO}"]`) ?? null;
		t !== null && (e.preventDefault(), UO(t));
	}
};
function UO(e) {
	e.hasAttribute("tabindex") || (e.setAttribute("tabindex", "-1"), e.addEventListener("blur", () => e.removeAttribute("tabindex"), { once: !0 })), e.focus();
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var WO = "ui-collapsible", GO = "ui-collapsible__content", KO = "ui-collapsible__bar", qO = "collapsed", JO = class {
	root;
	store = new Qw();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${WO}`)), L(this.root, `.${WO}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, qO);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Xt}]`), n = t?.closest(`.${WO}`) ?? null;
		if (t === null || n === null || LO(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(kt), i = n.querySelector(`:scope > .${GO}`);
		this.cancelFold(n);
		let a = XO(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, qO, r ? "true" : "false", r ? { attributes: { [kt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(kt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Xt}], :scope > .${KO} > [${Xt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Uc()) return;
		let i = QO(YO(e), n, XO(e, t), r);
		if (i === null) return;
		e.setAttribute(Zt, "");
		let a = {
			duration: I.normal,
			easing: I.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Zt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Zt);
			for (let e of t) e.cancel();
		}
	}
};
function YO(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function XO(e, t) {
	let n = YO(e), r = ZO(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function ZO(e) {
	return e === "width" ? "height" : "width";
}
function QO(e, t, n, r) {
	let i = ZO(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function $O(e) {
	let t = [];
	for (let n of nk(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = $O(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = ek(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function ek(e) {
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
	if (n !== null) return tk({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return tk(r[3] === "fr" ? {
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
function tk(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function nk(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function rk(e, t = "auto") {
	return e.map((e) => ik(e, t)).join(" ");
}
function ik(e, t) {
	switch (e.kind) {
		case "px": return `${ak(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${ak(e.min)}px`}, ${ak(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${ak(e.max)}px)` : `minmax(${ak(e.min)}px, auto)`;
	}
}
function ak(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function ok(e) {
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
function sk(e, t) {
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
function ck(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = lk(r, e), o = lk(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function lk(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function uk(e, t, n, r) {
	let i = pk(e, t, n.before), a = pk(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = fk(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = vk(n.before, e) + vk(n.after, e), r = i.total + a.total;
		mk(l, e, i, t * (i.total + c) / r), mk(l, e, a, t * (a.total - c) / r);
	} else u || hk(l, i, i.total + c), d || hk(l, a, a.total - c);
	return l;
}
var dk = 120;
function fk(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < dk ? o = t < 0 ? -n : dk - n : c > 0 && c < dk && (o = t > 0 ? r : r - dk), Math.min(Math.max(o, i), a);
}
function pk(e, t, n) {
	let r = _k(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function mk(e, t, n, r) {
	let i = vk(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function hk(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...gk(e[i])
		};
	}
}
function gk(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function _k(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function vk(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function yk(e, t) {
	let n = _k(t.before, e), r = n + _k(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function bk(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function xk(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function Sk(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var Ck = "ui-grid-splitter", wk = "ui-container", Tk = "ui-orientation--vertical", Ek = 16, Dk = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Qt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, Ok = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: $t,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, kk = class {
	root;
	store = new Qw();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new Ef({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Ck}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${Ck}`)), L(this.root, `.${Ck}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${Ck}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = jk(t);
			e !== null && (this.restore(e, Mk(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Bw) {
			let i = r[n], a = Gw(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ck}`);
		if (t === null || this.drag.active || O(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Lk(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${Ck}`), n = t === null ? null : jk(t);
		if (t === null || n === null) return;
		let r = Mk(t);
		for (let e of Bw) n.style.removeProperty(Gw(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = uk(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Gw(e.axis.split, e.tier), rk(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Bw) {
			let a = Gw(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = jk(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Mk(e), r = Ww(), i = Nk(t, n, r), a = i === null ? null : $O(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = sk(a, ok(t.getAttribute(n.limits))), s = Pk(t, n), c = Fk(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = ck(c, Ik(t, n).map((e) => Fk(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = jk(e);
		if (t === null) return;
		let n = Mk(e), r = Fk(e, n), i = Pk(t, n), a = Ik(t, n).map((e) => Fk(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : ck(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(yk(i, o))), Ak(t, n, i));
	}
};
function Ak(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(Ck)) continue;
		let e = getComputedStyle(r), i = Sk(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Gn, i);
	}
}
function jk(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(wk) ? t : null;
}
function Mk(e) {
	return e.classList.contains(Tk) ? Dk : Ok;
}
function Nk(e, t, n) {
	let r = Jw(n, (n) => e.style.getPropertyValue(Gw(t.split, n)).trim() || void 0);
	if (r !== void 0) return r;
	let i = e.style.getPropertyValue(t.authored).trim();
	return i.length > 0 ? i : null;
}
function Pk(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Fk(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Ik(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(Ck) && Mk(r) === t && n.push(r);
	return n;
}
function Lk(e) {
	let t = Number(e.getAttribute(en));
	return Number.isFinite(t) && t > 0 ? t : Ek;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Rk = "ui-split-button", zk = "ui-split-button__main", Bk = "ui-split-button__toggle", Vk = "ui-split-button__menu", Hk = "ui-split-button--open", Uk = class {
	root;
	menus = new pu({
		show: ({ owner: e }) => e.classList.add(Hk),
		hide: ({ owner: e }) => e.classList.remove(Hk),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = Wk(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${zk}`)?.closest(`.${Rk}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Wk(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = Gk(t), r = e.target.closest(`.${S}`);
		n === null || r === null || !n.contains(r) || r.matches(`${Kt}, ${Jt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = Gk(e), r = n?.querySelector(".ui-menu") ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: Kk(e)
		}) && Us(r, z(r, `.${S}:not(${Kt})`, `.${Ht}`), t);
	}
};
function Wk(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Bk}, .${zk}`), n = t?.closest(`.${Rk}`) ?? null;
	return t === null || n === null || t.classList.contains(zk) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Gk(e) {
	return e.querySelector(`:scope > .${Vk}`);
}
function Kk(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var qk = "ui-button-group", Jk = "ui-button-group__item", Yk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${qk}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), L(this.root, `.${qk}`, {
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
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Xk(i);
			i.toggleAttribute(Jn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		j(n, r ?? n.find(bo) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jk}`), n = t?.closest(`.${qk}`) ?? null;
		if (t === null || n === null || t.closest(`.${qk}`) !== n || O(n)) return;
		let r = Xk(t);
		r !== null && O(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jk} > .${mr}`), n = t?.closest(`.${qk}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Xk).filter((e) => e !== null), i = _o({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Jk}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Oo(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Yn,
			bindingAttribute: Zn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return z(e, `.${Jk}`, `.${qk}`);
	}
};
function Xk(e) {
	return e.querySelector(`:scope > .${mr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Zk = "ui-accordion", Qk = "details", $k = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Zk}`)), L(this.root, `.${Zk}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Zk))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${Qk}`)];
	}
}, eA = "ui-tab-overflow", tA = "ui-tab-overflow__menu", nA = "ui-tab-overflow__menu--open", rA = "ui-tab-overflow__entry", iA = "ui-tab-overflow__entry--current", aA = class {
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
		this.options = e, this.list = new cA(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : oA({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return sA(e, this.options.hiddenClass, t);
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
function oA(e) {
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
function sA(e, t, n) {
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
var cA = class {
	menu;
	button = null;
	list = new pu({
		show: ({ popup: e }) => e.classList.add(nA),
		hide: ({ popup: e }) => {
			e.classList.remove(nA), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = tA, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(lA)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${iA}`);
		r !== null && j(this.entries(), r), this.button = e, nl(e, this.menu), this.list.open({
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: [e],
			focus: r ?? !1,
			returnFocus: () => e
		}) ? r === null && Us(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${rA}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || O(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = _o({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), j(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${rA}`) : null;
		t === null || t === document.activeElement || O(t) || (j(this.entries(), t), As(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${rA}`));
	}
};
function lA(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${rA} ${hr}`, t.classList.toggle(iA, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(b, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(ir), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var uA = "data-ui-caption-text", dA = ".ui-text__title";
function fA(e) {
	for (let t of e.querySelectorAll(dA)) {
		let e = t.textContent ?? "";
		t.getAttribute(uA) !== e && t.setAttribute(uA, e);
	}
}
function pA(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Uc()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: I.normal,
		easing: I.ease,
		pseudoElement: "::after"
	});
}
function mA(e) {
	e === null || typeof e.animate != "function" || Uc() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: I.fast,
		easing: I.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var hA = "ui-tabs", gA = "ui-tab-header", _A = "ui-tab-header--selected", vA = "ui-tab-header--overflowed", yA = "ui-tabs--overflowing", bA = "ui-tabs--no-overflow", xA = "ui-tabs__strip", SA = "data-ui-tab-key", CA = "data-ui-tab-page", wA = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new aA({
			rootClass: hA,
			overflowingClass: yA,
			wraps: (e) => e.classList.contains(bA),
			hiddenClass: vA,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${hA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), L(this.root, `.${hA}`, {
			childList: !0,
			attributeFilter: [Qn, ...tr],
			relevant: (e) => !zl(e, `[${CA}]`, `.${hA}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(SA) ?? "") === t) ?? null;
		if (r !== null && !TA(r)) {
			let t = n.find(TA);
			if (t !== void 0) {
				this.select(e, t.getAttribute(SA) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(_A)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(SA) ?? "") === t;
			e.classList.toggle(_A, n), e.setAttribute("aria-selected", n ? "true" : "false"), fA(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(TA), a), pA(i, a), j(n.filter((e) => !e.classList.contains(vA)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(CA) ?? "") !== t, !n.hidden && i !== null && i !== a && mA(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${xA}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(SA) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(TA).map((e) => {
				let n = e.getAttribute(SA) ?? "";
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
		let t = e.target.closest(`.${eA}`), n = t?.closest(`.${hA}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${hA}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${gA}`);
		if (r === null || O(r)) return;
		let i = r.closest(`.${hA}`), a = r.getAttribute(SA);
		i !== null && a !== null && r.closest(`.${hA}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gA}`), n = t?.closest(`.${hA}`) ?? null;
		if (t === null || n === null) return;
		let r = _o({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(SA) ?? ""), r.focus());
	}
	select(e, t) {
		Oo(e, t, {
			attribute: Qn,
			bindingAttribute: Zn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return z(e, `.${gA}`, `.${hA}`);
	}
	ownPages(e) {
		return z(e, `[${CA}]`, `.${hA}`);
	}
};
function TA(e) {
	return e.classList.contains(vA) || cw(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var EA = "ui-command-bar", DA = "ui-command-bar__host", OA = "ui-command-bar__item", kA = "ui-command-bar__overflow", AA = "ui-command-bar--overflowing", jA = "ui-command-bar__overflowed", MA = "ui-text__title", NA = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new aA({
			rootClass: EA,
			overflowingClass: AA,
			wraps: (e) => !FA(e),
			hiddenClass: jA,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${EA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), L(this.root, `.${EA}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = PA(e), n = e.querySelector(`:scope > .${kA}`);
		if (t === null || n === null) return;
		let r = IA(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(AA) && LA(r);
		for (let e of r) el(e, e.classList.contains(jA) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${kA}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(EA) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = PA(e), n = t === null ? [] : IA(t).filter((e) => e.classList.contains(OA) && e.classList.contains(jA)).map((e) => e.querySelector(C) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: RA(e),
			current: !1,
			disabled: O(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !O(n) && zA(n).click();
	}
};
function PA(e) {
	return e.querySelector(`:scope > .${DA}`);
}
function FA(e) {
	let t = PA(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function IA(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(OA) ? n.querySelector(C) : null;
		e !== null && cw(e) && t.push(n);
	}
	return t;
}
function LA(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(OA) ? t ||= !r.classList.contains(jA) : t || r.classList.add(jA);
	}
}
function RA(e) {
	let t = zA(e), n = t.querySelector(`.${MA}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function zA(e) {
	return e.matches(hs) ? e : e.querySelector(hs) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var BA = "ui-breadcrumbs", VA = "ui-breadcrumbs__item", HA = "ui-breadcrumb", UA = "ui-breadcrumb--current", WA = "ui-hidden", GA = "data-ui-step-collapsed", KA = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), L(this.root, `.${BA}`, {
			childList: !0,
			attributeFilter: ["class", ...tr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${BA}`)) this.apply(e);
	}
	apply(e) {
		let t = z(e, `.${VA}`, `.${BA}`);
		for (let e of t) qA(e);
		let n = t.filter((e) => !e.classList.contains(WA)).map((e) => e.querySelector(`.${HA}`)).filter((e) => e !== null && !e.classList.contains(WA)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(UA, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function qA(e) {
	let t = e.querySelector(`:scope > .${HA}`), n = t === null ? "" : Bw.filter((e, n) => t.getAttribute(tr[n]) === "collapsed").join(" ");
	n.length === 0 ? e.removeAttribute(GA) : e.getAttribute(GA) !== n && e.setAttribute(GA, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function W(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function JA(e) {
	return W(e).toString(16).padStart(2, "0").toUpperCase();
}
function YA(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return XA(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function XA(e, t, n) {
	return .2126 * ZA(e) + .7152 * ZA(t) + .0722 * ZA(n);
}
function ZA(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var QA = "ui-color-input", $A = "ui-color-input--open", ej = "ui-color-input__popup", tj = "ui-color-input__text", nj = "ui-color-input__row", rj = "ui-color-input__swatch--button", ij = "ui-color-input__value-input", aj = "ui-color-input__square-thumb", oj = "ui-color-input__hue-thumb", sj = "data-ui-color-toggle", cj = "data-ui-color-tab", lj = "data-ui-color-tab-selected", uj = "data-ui-color-pane", dj = "data-ui-color-pane-selected", fj = "data-ui-color-square", pj = "data-ui-color-hue", mj = "data-ui-color-hex", hj = "data-ui-color-channel", gj = "data-ui-color-factor", _j = "data-ui-color-opacity", vj = "data-ui-color-name", yj = "data-ui-color-name-selected", bj = "data-ui-color-format", xj = "data-ui-color-variant", Sj = "data-ui-color-no-picker", Cj = "data-ui-color-no-palette", wj = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new pu({
		show: ({ owner: e }) => e.classList.add($A),
		hide: ({ owner: e }) => e.classList.remove($A)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${QA}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = T(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${QA}`) ?? []);
		}), L(this.root, `.${QA}`, {
			childList: !0,
			attributeFilter: [
				bj,
				xj,
				Sj,
				Cj
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new Ef({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${fj}], [${pj}]`),
			begin: (e, t) => {
				let n = e.closest(`.${QA}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(fj) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${ij}`)?.value ?? null
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
		let t = kj(e), n = this.states.get(e), r = n?.paneChosen === !0 ? Tj(e, n.pane) : Ej(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? Dj(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Lj(t);
			if (i === null) return n ?? Dj(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && Oj(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Bj(a, o, s);
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
			...n ?? Dj(r),
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
			let [e, a, o] = Bj(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Nj(e, "--ui-color-input-color", t.held ? zj(n, r, i, t.opacity) : "transparent"), Nj(e, "--ui-color-input-solid", zj(n, r, i, 255)), Nj(e, "--ui-color-input-on-color", t.held ? YA(n, r, i, t.opacity) : "inherit"), Mj(e, t.held ? jj(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${fj}]`), o = e.querySelector(`[${pj}]`), [s, c, l] = Vj(t.hue, 1, 1);
		if (Nj(e, "--ui-color-input-hue", zj(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${aj}`);
			e !== null && (Nj(e, "left", `${t.saturation * 100}%`), Nj(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${oj}`);
			e !== null && Nj(e, "top", `${t.hue / 360 * 100}%`);
		}
		Pj(e, `[${mj}]`, Rj(n, r, i)), Pj(e, `[${hj}="r"]`, String(n)), Pj(e, `[${hj}="g"]`, String(r)), Pj(e, `[${hj}="b"]`, String(i)), Nj(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), Fj(e, `[${_j}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${vj}]`)) n.getAttribute(vj) === t.name ? n.setAttribute(yj, "") : n.removeAttribute(yj);
		let n = t.name === null ? null : e.querySelector(`[${vj}="${t.name}"]`), r = n === null ? null : Lj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Nj(e, "--ui-color-input-base", r === null ? "transparent" : zj(r[0], r[1], r[2], 255)), Fj(e, `[${gj}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${uj}]`)) n.getAttribute(uj) === t.pane ? n.setAttribute(dj, "") : n.removeAttribute(dj);
		for (let n of e.querySelectorAll(`[${cj}]`)) n.getAttribute(cj) === t.pane ? n.setAttribute(lj, "") : n.removeAttribute(lj);
	}
	resolveRgb(e, t) {
		if (t.name === null) return Vj(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${vj}="${t.name}"]`), r = n === null ? null : Lj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? Vj(t.hue, t.saturation, t.value) : Ij([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${sj}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${QA}`));
			return;
		}
		let n = e.target.closest(`[${cj}]`), r = e.target.closest(`.${QA}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(cj), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${vj}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(vj)
			}));
			return;
		}
		let a = r.querySelector(`.${ej}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${QA}`);
		if (t !== null) {
			if (e.target.hasAttribute(gj)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(_j) && this.commit(t, (t) => ({
				...t,
				opacity: W(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${QA}`);
		if (n === null) return;
		if (t.hasAttribute(gj) || t.hasAttribute(_j)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(mj)) {
			let e = Lj(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Bj(e[0], e[1], e[2]);
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
		let r = t.getAttribute(hj);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = W(Number(t.value));
		let [l, u, d] = Bj(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${ij}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = Hj((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = Hj((t.x - a.left) / a.width), s = 1 - Hj((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${ij}`);
		a !== null && (a.value = Aj(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		A(e) || e.querySelector(`.${ij}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(Sj) && e.hasAttribute(Cj)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${ej}`), n = e.querySelector(`[${sj}]`);
		if (t === null) return;
		let r = e.getAttribute(xj) === "swatch" ? e.querySelector(`.${rj}`) : e.querySelector(`.${nj}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${lj}]`) ?? !0
		});
	}
};
function Tj(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? Sj : Cj))(t) ? t : t === "picker" ? "palette" : "picker";
}
function Ej(e) {
	return Tj(e, "picker");
}
function Dj(e) {
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
function Oj(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function kj(e) {
	return e.querySelector(`.${ij}`)?.value.trim() ?? "";
}
function Aj(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Rj(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${JA(e.opacity)}`;
}
function jj(e, t, n, r, i) {
	if (e.getAttribute(bj) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Rj(t, n, r);
	return i === 255 ? a : `${a}${JA(i)}`;
}
function Mj(e, t) {
	for (let n of e.querySelectorAll(`.${tj}`)) n.textContent !== t && (n.textContent = t);
}
function Nj(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function Pj(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function Fj(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function Ij(e, t) {
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
function Lj(e) {
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
function Rj(e, t, n) {
	return `#${JA(e)}${JA(t)}${JA(n)}`;
}
function zj(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Bj(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function Vj(e, t, n) {
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
function Hj(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function Uj(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var Wj = "ui-table", Gj = "ui-table--reorderable", Kj = "ui-scroll-x--auto", qj = "ui-scroll-x--always", Jj = `:scope > .${sn}`, Yj = `.${ln}`, Xj = "ui-table__header-cell", Zj = `${Xj}--pinned`, Qj = `${Jj} > .${cn} > .${Xj}`, $j = `${Qj}--pinned`, eM = "ui-table__host", tM = `${Jj} > .${eM}`, nM = `.${Wj}, .${on}, [${tn}]`, rM = "--ui-table-columns", iM = "--ui-table-sticky-top", aM = "--ui-table-sticky-bottom", oM = "--ui-table-sized-columns", sM = "--ui-table-pin-", cM = "--ui-table-order-", lM = 64, uM = "data-ui-table-cell-hidden", dM = "data-ui-table-cell-last", fM = "columns", pM = "hidden", mM = "order", hM = "layout", gM = 32, _M = 16, vM = class {
	root;
	store = new Qw();
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
			resolveHandle: (e) => e.closest(Yj),
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
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Bw) e !== "base" && matchMedia(Hw(e)).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${Wj}`)), L(this.root, `.${Wj}`, {
			childList: !0,
			relevant: CM
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), L(this.root, `.${Wj}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(Wj)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), L(this.root, `.${Wj}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: wM
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(tM);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), Uj(t, () => this.pin(t));
			let e = t.querySelector(Jj);
			e !== null && Uj(e, () => yM(t, e));
			let n = t.querySelector(tM);
			n !== null && (this.markScrollbar(t, n), Uj(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, fM), r = n === null ? null : $O(n);
		r !== null && r.length !== t.length ? (this.store.write(e, fM, null), this.store.writeBoot(e, hM, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, mM);
		if (i !== null && !EM(i, t)) {
			this.store.write(e, mM, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(bn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${Wj}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = TM(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(Kj) || e.classList.contains(qj);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(oM);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = xk(t, n);
				e.style.setProperty(oM, rk(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${cM}${t}`, String(r[t])) : e.style.removeProperty(`${cM}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(an) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(an, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(hn) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(hn, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(Gj)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= lM) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${tn}]`)) {
				let r = Number(t.getAttribute(tn));
				!(r >= lM) || t.closest(`.${Wj}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(uM, n.hidden.has(r)), t.toggleAttribute(dM, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(Qj)) {
			let e = Number(n.getAttribute(tn)), r = n.getAttribute(nn), i = n.classList.contains(Zj) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: AM(r) ? r : null,
				startsHidden: n.hasAttribute(rn),
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
		for (let e of t) (n[e.key] ?? kM(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, pM) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(rM).trim(), n = t.length === 0 ? null : $O(t);
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
		n === null || i !== void 0 && n === kM(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, pM, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return TM(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll($j).length;
		if (t < 2) return;
		let n = bk(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${sM}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${Wj}`)?.toggleAttribute(yn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(Jj), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return xM(e) ? n.slice(1) : n;
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
		let t = e.target.closest(Yj) ?? (e.shiftKey ? bM(e.target) : null);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = _M;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${Wj}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(tn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Yj)?.closest(`.${Wj}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = uk(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(gM, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, SM(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, fM, t === null ? null : rk(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(oM).trim(), n = e.getAttribute(an), r = {};
		t.length > 0 && (r[oM] = t);
		for (let t of e.style) t.startsWith(cM) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, hM, null);
			return;
		}
		this.store.writeBoot(e, hM, {
			styles: r,
			attributes: {
				[an]: n,
				[hn]: e.getAttribute(hn)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${Wj}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = ok(t.getAttribute(Qt)), i = sk(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(tn)), u = this.hiddenOf(t, o), d = TM(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${Xj}`), n = t?.closest(`.${Wj}`) ?? null;
		return t === null || n === null || !n.classList.contains(Gj) || e.closest(Yj) !== null || t.classList.contains(Zj) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${Wj}`), r = Number(e.getAttribute(tn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(gn, ""), e.setAttribute(_n, ""), {
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
		for (let a of TM(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > DM(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), OM(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(vn, "after") : a.cell.setAttribute(vn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(_n), t.table.removeAttribute(gn), OM(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = TM(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, mM, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function yM(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${eM}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(iM, `${n}px`), e.style.setProperty(aM, `${r}px`);
}
function bM(e) {
	let t = e.matches(`.${Xj}`) ? e.querySelector(`:scope > ${Yj}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function xM(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function SM(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function CM(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(nM) || t.querySelector(nM) !== null)) return !0;
	return !1;
}
function wM(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(eM);
}
function TM(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function EM(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function DM(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function OM(e) {
	for (let t of e.querySelectorAll(`[${vn}]`)) t.removeAttribute(vn);
}
function kM(e) {
	return e.startsHidden || e.hideBelow !== null && Bw.indexOf(Ww()) < Bw.indexOf(e.hideBelow);
}
function AM(e) {
	return e !== null && Bw.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var jM = /* @__PURE__ */ new WeakMap();
function MM(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(wt);
	for (let i of V(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = NM(i, a) ?? PM(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${it}]`)) n.has(t) || t.remove();
}
function NM(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : jM.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function PM(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (IM(i, t.getAttribute(b)), jM.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function FM(e) {
	return e.find((e) => !e.classList.contains(sr));
}
function IM(e, t) {
	e.setAttribute(it, ""), t === null ? e.removeAttribute(at) : e.setAttribute(at, t);
}
var LM = "bottom", RM = "pending";
function zM(e, t, n) {
	let r = e.querySelector(`:scope > [${gt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(gt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function BM(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var VM = /* @__PURE__ */ new WeakMap();
function HM(e) {
	for (let t of e.querySelectorAll(`[${it}]`)) t.remove();
}
function UM(e, t, n, r, i, a) {
	let o = $v(e, V(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Wv(i.getItemsFilterSortMetadata(t), a, Bv(e));
	if (c && !l && HM(e), o.length === 0) {
		VM.set(e, []);
		return;
	}
	let d = bv(e);
	if (!l) {
		BM(e, [...Gv(o, u, r), ...yv(d)]);
		return;
	}
	HM(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (VM.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	VM.set(e, p);
	let m = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = Gv(t, u, r));
		let n = e === "" ? void 0 : FM(t);
		if (n !== void 0) {
			let e = WM(s, r, n);
			e !== null && m.push(e);
		}
		m.push(...t);
	}
	BM(e, [...m, ...yv(d)]);
}
function WM(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && IM(r, n.getAttribute(b)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var GM = "ui-tree-rules", KM = `:scope > .${dn}:not(.${mn})`;
function qM(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(GM, { bubbles: !0 })), xv(e, t, n.templates, n.renderer, e.querySelector(KM) !== null);
		return;
	}
	switch (tv(e)) {
		case "windowed":
			xv(e, t, n.templates, n.renderer), JM(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Vv(e, t, n.metadata, n.renderer, n.state), xv(e, t, n.templates, n.renderer), UM(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function JM(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && MM(e, (e) => WM(r, n.renderer, e));
}
//#endregion
//#region src/interactions/table-header-group.ts
var YM = ".ui-table", XM = `:scope > .${sn} > .${cn} > [role='columnheader']`, ZM = `:scope > .${ln}`, QM = "input:not([type='hidden']), button, select, textarea, a[href]", $M = /* @__PURE__ */ new WeakMap();
function eN(e) {
	for (let t of e.querySelectorAll(XM)) {
		let e = tN(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function tN(e) {
	let t = e.querySelector(QM);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(ZM);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function nN(e) {
	let t = rN(e), n = $M.get(e), r = n !== void 0 && t.includes(n) ? n : t[0];
	return r !== void 0 && (iN(e, r), !0);
}
function rN(e) {
	let t = [];
	for (let n of e.querySelectorAll(XM)) {
		let e = tN(n);
		e !== null && bo(e) && t.push({
			stop: e,
			left: n.getBoundingClientRect().left
		});
	}
	return t.sort((e, t) => e.left - t.left).map((e) => e.stop);
}
function iN(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), $M.set(e, t), t.focus();
}
function aN(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(YM) && tN(t) === e ? n : null;
}
function oN(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(), !0;
		case "ArrowUp": return !0;
	}
	if (!vo(e.key, "horizontal")) return !1;
	let r = _o({
		key: e.key,
		items: rN(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && iN(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var sN = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), cN = ".ui-table", lN = `:scope > [${x}], :scope > .${sn}, :scope > .${sn} > [${x}]`, uN = class {
	root;
	pressedBoxes = [];
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(M)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), L(this.root, M, {
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
		Bo(e, t);
		for (let t of e.querySelectorAll(lN)) dN(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(cN) && eN(e);
			for (let e of t) {
				let t = $p(e);
				t !== null && dN(t);
				for (let t of em(e)) dN(t);
			}
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, M);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (e.detail > 0 && ks(n, !0), as(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Fo(n, r);
			return;
		}
		Ho(n, i, r, Io(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Ao), r = n?.closest(M) ?? null;
		return n === null || r === null || n.closest(M) !== r || !r.matches(t) || O(r) ? null : rm(e.target, n) === null && !k(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, jo);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), ps(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = aN(e.target);
		if (t !== null && !O(t)) {
			oN(e, t, () => this.enterRows(t)) && e.preventDefault();
			return;
		}
		let n = es(e.target);
		if (n === null || n.row !== null && rm(e.target, n.row) !== null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || O(r)) return;
		let i = mN(r);
		if (!sN.has(e.key) && !os(e.key, i)) return;
		let a = this.ownItems(r), o = ns(a), s = cs(e.key, a, rs(a), i);
		if (s !== null) {
			e.preventDefault(), as(r, a, s), (r.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Po(r, o), Ho(r, a, s, Lo(r, e)));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(cN) && nN(r)) {
			e.preventDefault();
			return;
		}
		if (o === null || k(o)) return;
		let c = $p(o);
		switch (e.key) {
			case " ":
				Ho(r, a, o, {
					shift: !1,
					ctrl: !0
				}) || pN(o, c);
				break;
			case "Enter":
				fN(r, a, o, c);
				break;
			case "Delete": {
				let e = hN(a, o);
				if (e.length === 0) return;
				for (let t of e) ps(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	enterRows(e) {
		let t = this.ownItems(e), n = rs(t) ?? cs("ArrowDown", t, null, "vertical");
		e.focus({ preventScroll: !0 }), n !== null && (as(e, t, n), e.getAttribute("data-ui-selection") === "one" && Ho(e, t, n, Mo));
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(M) ?? null;
		t !== null && n !== null && [...n.querySelectorAll(lN)].includes(t) && F(n);
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(M) ?? null;
		if (t !== null && n !== null) {
			document.activeElement !== n && ks(n, !0);
			for (let e of n.querySelectorAll(lN)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
		}
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) dN(e);
		this.pressedBoxes = [];
	}
	ownItems(e) {
		return z(e, Ao, M);
	}
};
function dN(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function fN(e, t, n, r) {
	Ro(e) && !Vo(t).includes(n) && Ho(e, t, n, Mo), pN(n, r), r === null && ps(n, "open");
}
function pN(e, t) {
	t === null ? ps(e, fs) : t.click();
}
function mN(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function hN(e, t) {
	let n = Vo(e);
	return (n.includes(t) ? n : [t]).filter((e) => !Xa(e, "data-ui-unremovable") && !k(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var gN = "ui-tree__row--folded", _N = "fold-hidden", vN = "fold-shown", yN = "ui-tree__row--dragging", bN = "ui-tree__loading", xN = "ui-tree__loading-ring", SN = "ui-tree-node__text", CN = "ui-tree-node__toggle", wN = "ui-tree-node__rename", TN = ".ui-text__title", EN = pn, DN = "--ui-tree-depth", ON = "expanded", kN = 600, AN = .25, jN = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, MN = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), NN = class {
	root;
	store = new Qw();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(GM, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${un}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => P(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${un}`)), L(this.root, `.${un}`, {
			childList: !0,
			attributeFilter: [
				Sn,
				Cn,
				Tn,
				An
			],
			relevant: IN
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = Zy(e)?.getAttribute(Sn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = P(e), r = Zy(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Cn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), _ = o !== null && !o.has(n);
			e.style.setProperty(DN, String(u)), e.setAttribute("aria-level", String(u + 1)), is(e, r?.querySelector(`:scope > .${SN}`) ?? null), e.classList.toggle(gN, !d), e.classList.toggle(mn, _), e.removeAttribute(kn), e.draggable = i && fv(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Dn), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Dn, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Dn), d && g && !_), s.set(n, {
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
		return Zy(e.row)?.hasAttribute(Tn) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${dn}[${b}="${xr(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, _N, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, vN, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [kn]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = ci(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Bv(t);
		if (r === void 0 && i === null) return null;
		let a = Wv(r, this.rules.state, i), o = Uv(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(P)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = Zy(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Kv(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(P(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${bN}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = P(o), c = i.getItemValue(o);
			if (c === void 0 || Hv(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = Zy(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(bN) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? LN();
		o.style.setProperty(DN, String(t)), o.classList.toggle(gN, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${CN}`) === null && (!Xa(r, "data-ui-unselectable") || rm(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || rm(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${dn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || k(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = es(e.target);
		if (t === null || t.row !== null && rm(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || O(n)) return;
		let r = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey ? jN[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!MN.has(e.key) && !vo(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = ns(i), o = cs(e.key, i, rs(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, Lo(n, e));
			return;
		}
		if (!(a === null || k(a))) {
			switch (e.key) {
				case " ":
					Ho(n, i, a, {
						shift: !1,
						ctrl: !0
					}) || pN(a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, cs("ArrowDown", i, a, "vertical"), Mo);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Mo);
					break;
				case "Enter":
					fN(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = hN(i, a);
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
		let n = this.rowsOf(e), r = ns(n);
		if (r === null || !r.draggable || (t === "up" || t === "down") && this.isSorted(e)) return;
		let i = rb(zN(n), P(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => P(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !Xa(t, "data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = RN(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(An) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (k(t)) {
			e.preventDefault();
			return;
		}
		let a = dv(t, this.rowsOf(n)), o = uv(n, i, a);
		r ? rv(e, n, t, yN, P(t), a.filter((e) => e !== t), mv(o, !0)) : av(e, P(t), mv(o, !1)), hv(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(yN));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${un}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${dn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = P(t), o = (e) => n.some((t) => P(t) === e || FN(i, e, P(t))), s = Qy(t, Zy(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? AN : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = zN(f), m = Number(t.style.getPropertyValue(DN)) || 0, h = new Set(n.map(P)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, _ = i.get(a) ?? "", v = g === void 0 ? {
			parent: _,
			before: d === "before" ? a : sb(p, _, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !$y(v.parent, (e) => f.find((t) => P(t) === e) ?? null) || o(v.parent) ? null : {
			mark: d,
			place: v,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), kN)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${un}`);
		t !== null && ov(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${un}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${EN}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && FN(a, P(e), P(t)))), s = r.getAttribute(EN) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), iv(t, yN), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = cb(zN(this.rowsOf(e)), t.map(P), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = Zy(e)?.querySelector(`.${SN}`) ?? null;
			r !== null && (r.setAttribute(On, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), my(e, i[t]));
		});
	}
	handleDragEnd(e) {
		let t = RN(e)?.closest(".ui-tree") ?? null;
		t !== null && (iv(t, yN), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		tb(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(P(n), Zy(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = P(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(gN)) : [];
		this.store.writeJson(e, ON, i), this.layout(e), PN(a.filter((e) => !e.classList.contains(gN)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, ON) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ns(r);
		as(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Po(e, i), Ho(e, r, t, n));
	}
	parentOf(e, t) {
		let n = Zy(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => P(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${un}`), n = Zy(e), r = n?.querySelector(TN) ?? null;
		t === null || n === null || r === null || Xa(e, "data-ui-unrenamable") || (this.setFocus(t, e, null), Ql({
			container: n,
			title: r,
			className: wN,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(En, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function PN(e) {
	if (!(e.length === 0 || Uc())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: I.fast,
		easing: I.enter
	});
}
function FN(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function IN(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function LN() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = bN, e.setAttribute("aria-hidden", "true"), t.className = xN, e.append(t, D.text("ui.tree.loading")), e;
}
function RN(e) {
	return e.target instanceof Element ? e.target.closest(`.${dn}`) : null;
}
function zN(e) {
	return e.map((e) => ({
		key: P(e),
		parent: Zy(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: Qy(e, Zy(e)),
		shown: !e.classList.contains(mn)
	}));
}
//#endregion
//#region src/runtime/client-state.ts
var BN = {
	visibilityState: () => document.visibilityState,
	notificationPermission: HN
};
function VN(e) {
	return e !== "hidden";
}
function HN() {
	return typeof Notification > "u" || !window.isSecureContext ? void 0 : Notification.permission;
}
var UN = 200;
function WN(e = BN) {
	return {
		visible: VN(e.visibilityState()),
		notificationPermission: e.notificationPermission() ?? "unsupported"
	};
}
var GN = class {
	report;
	source;
	settleMilliseconds;
	held = null;
	timer;
	constructor(e) {
		this.report = e.report, this.source = e.source ?? BN, this.settleMilliseconds = e.settleMilliseconds ?? UN;
	}
	forAttach() {
		return clearTimeout(this.timer), this.held = WN(this.source), this.held;
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
		let t = WN(this.source);
		(t.visible !== e.visible || t.notificationPermission !== e.notificationPermission) && (this.held = t, this.report(t).catch(() => void 0));
	}
};
//#endregion
//#region src/interactions/system-notifications.ts
function KN(e) {
	return {
		permission: HN,
		registration: e ?? (() => Promise.resolve(void 0)),
		create: (e, t) => new Notification(e, t),
		focus: () => window.focus()
	};
}
async function qN(e, t, n = KN()) {
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
function JN(e, t, n, r = window.location) {
	if (e.bringTo !== void 0 && YN(e.bringTo, r)) {
		t(e.bringTo);
		return;
	}
	e.action !== void 0 && n(e.action);
}
function YN(e, t) {
	let n = new URL(e, t.origin);
	return n.pathname !== t.pathname || n.search !== t.search || n.hash !== "" && n.hash !== t.hash;
}
//#endregion
//#region src/interactions/tab-order.ts
function XN(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var G = "ui-tabs-view", ZN = "ui-tab-item__label", QN = "ui-tab-item__close", $N = "ui-tab-item__rename", eP = "ui-tab-item__caption", tP = "ui-tab-item__pin", nP = ".ui-text__title", rP = "ui-tab-item--dragging", iP = "ui-tab-item__caption--overflowed", aP = "ui-tabs-view--overflowing", oP = "ui-tabs-view--no-overflow", sP = "ui-tab-item__page", cP = "ui-tab-item--selected", lP = `.${S}`, uP = "tab-menu-entry", dP = {
	name: uP,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, fP = "tab-pin";
function pP(e) {
	return {
		name: fP,
		registration: ev((e) => cy(e.target), e)
	};
}
var mP = "--ui-tabs-view-strip", hP = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new aA({
			rootClass: G,
			overflowingClass: aP,
			wraps: (e) => e.classList.contains(oP),
			hiddenClass: iP,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(T(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => wP(e) === t.key))?.querySelector(`.${ZN}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(UC, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), L(this.root, `.${G}`, {
			childList: !0,
			attributeFilter: [
				Qn,
				_e,
				...tr
			],
			relevant: (e) => !zl(e, `.${sP}`, `.${G}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${G}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(cw);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => wP(e) === r)) {
			this.select(e, wP(n[0]));
			return;
		}
		let i = e.hasAttribute(_e), a = t.find((e) => e.classList.contains(cP))?.querySelector(`.${eP}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = wP(e) === r;
			e.classList.toggle(cP, t);
			let a = e.querySelector(`.${eP}`);
			a !== null && (a.draggable = i, fA(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${ZN}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${sP}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${sP}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), pA(a, s), a !== null && a !== s && mA(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${ZN}`);
			t === null || e.classList.contains(iP) || (l.push(t), e === s && (u = t));
		}
		j(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !cw(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(mP, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${x}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${eA}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => wP(e) === t)?.querySelector(`.${ZN}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(cw).map((e) => ({
				key: wP(e),
				title: e.querySelector(`.${ZN}`)?.textContent?.trim() ?? wP(e),
				current: wP(e) === t,
				disabled: O(e.querySelector(`.${ZN}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${oy}`);
		if (n === null || !n.classList.contains(G) || r === null || r.closest(`.${G}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = vP(n, r), a = bP(t), o = a.map((e) => {
			if (yP(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? cw(e) ? "shown" : "hidden";
		});
		if (FC(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: wP(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${ye}="tab"]`), n = t?.parentElement ?? null, r = e.closest(lP);
		if (t === null || n === null || !n.classList.contains(G) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => wP(e) === a.key);
		if (i.length === 0 || r.matches(`${qt}, ${Kt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(uP, {
			bubbles: !0,
			detail: { keys: [i, wP(o)] }
		})), !0;
		if (vP(n, o).get(i) !== !0) return !0;
		switch (i) {
			case OC: {
				let e = o.querySelector(`.${ZN}`);
				e !== null && this.startRename(e);
				break;
			}
			case kC:
			case AC:
				this.setPinned(n, o, i === kC);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${eP} > .${tP}`);
		t.toggleAttribute(er, n), r !== null && (r.toggleAttribute(er, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = XN(a.map(CP));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? sy(a[a.length - 1]).after(sy(t)) : sy(s).before(sy(t)), t.dispatchEvent(new Event(fP, { bubbles: !0 }));
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${eA}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(G)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = xP(e.target), i = r?.closest(`.${G}`) ?? null;
		if (r === null || i === null || O(r)) return;
		let a = r.closest(`.${oy}`);
		a !== null && a.closest(`.${G}`) === i && (e.preventDefault(), this.select(i, wP(a)), document.activeElement !== r && F(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${QN}`), r = n?.closest(".ui-tab-item") ?? null, i = r?.closest(`.${G}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), _P(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = xP(e.target), n = t?.closest(`.${G}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(nP) ?? e, r = e.closest(`.${oy}`);
		t === null || r === null || ly(r, "data-ui-unrenamable") || Ql({
			container: t,
			title: n,
			className: $N,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute($n, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => F(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ZN}`), n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${ZN}`)).filter((e) => e !== null), i = _o({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${oy}`);
		a !== null && this.select(n, wP(a)), i.focus();
	}
	handleDragStart(e) {
		let t = SP(e);
		if (t === null) return;
		if (ly(t, "data-ui-undraggable") || O(t) || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		rv(e, t.closest(`.${G}`) ?? t, t, rP, wP(t));
		let n = sy(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${eP}`)?.closest(".ui-tab-item") ?? null, n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${rP}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${eP}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = sy(r), o = t.hasAttribute("data-ui-tab-pinned") ? gP(n, a) : null, s = o ?? sy(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${G}`);
		t !== null && t.querySelector(`.${rP}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = SP(e);
		if (t === null) return;
		t.classList.remove(rP);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(sy(t), n.next);
			return;
		}
		let r = sy(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${G}`);
		i !== null && my(t, this.ownItems(i).indexOf(t));
	}
	select(e, t) {
		Oo(e, t, {
			attribute: Qn,
			bindingAttribute: Zn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return z(e, `.${oy}`, `.${G}`);
	}
};
function gP(e, t) {
	let n = null;
	for (let r of z(e, `.${oy}`, `.${G}`)) {
		let e = sy(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function _P(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !ly(t, "data-ui-unremovable");
}
function vP(e, t) {
	return PC(NC(e.getAttribute(ve)), {
		pinned: t.hasAttribute(er),
		renamable: !ly(t, ce),
		removable: e.hasAttribute("data-ui-tabs-removes") && _P(e, t)
	});
}
function yP(e) {
	let t = e.getAttribute(b);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function bP(e) {
	let t = e.querySelector(`[${x}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function xP(e) {
	return e.closest(`.${QN}`) !== null || Zl(e) ? null : e.closest(`.${eP}`)?.querySelector(`:scope > .${ZN}`) ?? null;
}
function SP(e) {
	return e.target instanceof Element ? e.target.closest(`.${eP}`)?.closest(".ui-tab-item") ?? null : null;
}
function CP(e) {
	return { pinned: e.hasAttribute(er) };
}
function wP(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var TP = "button.ui-text__fold-toggle", EP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(TP);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, DP = "ui-temporal-input__segments", OP = "ui-temporal-input__segment", kP = "ui-temporal-input__segment-literal", AP = "ui-temporal-input__segment--empty", jP = "data-ui-temporal-segment", MP = "data-ui-temporal-step-direction", NP = "data-ui-temporal-segments-of", PP = "--", FP = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${H}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(oi(e.components, `.${H}`));
		}), L(this.root, `.${H}`, { attributeFilter: [...qb] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Yb(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${DP}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Xb(e), r = $b(e), i = U(e, sx(t));
		t.getAttribute(NP) !== n && (t.replaceChildren(...IP(n).map((e) => RP(e))), t.setAttribute(NP, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(jP);
			if (t === null) {
				n.textContent = BP(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = VP(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(AP, i === null), n.tabIndex = 0, HP(n, t, i, A(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = WP(e.target);
		if (t === null) return;
		let n = t.closest(`.${H}`), r = t.getAttribute(jP), i = UP(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), KP(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), px(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = qP(e.key, $b(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = WP(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = WP(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Mf(this.wheelTurn, jf(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${H}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(jP), n < 0 ? 1 : -1, UP(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${MP}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${MP}]`);
		if (t === null) return;
		let n = t.closest(`.${H}`);
		if (n === null || A(n)) return;
		e.preventDefault();
		let r = GP(n) ?? n.querySelector(`.${OP}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(jP), t.getAttribute(MP) === "up" ? 1 : -1, UP(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${OP}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${H}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = U(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = JP(t), o = Qb(Zb(e), a) * n, s = a === "hour" ? 24 : 60, c = ((YP(i, a) + o) % s + s) % s;
		this.write(e, vx(e, XP(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? XP(t, "hour", ZP(l, t.getHours() >= 12)) : XP(t, JP(n), l), i);
		}
		u && KP(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, XP(r, "hour", ZP(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return U(e, t) ?? _x(e);
	}
	write(e, t, n) {
		px(e, t, n), hx(e), this.applySegments(e);
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
function IP(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Oi(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(LP(r)), n += r.length;
	}
	return t;
}
function LP(e) {
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
function RP(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = kP, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = OP, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(jP, e.unit), t.dataset.width = String(e.width), zP(t, e.unit), t;
}
function zP(e, t) {
	if (t === "meridiem") {
		D.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = JP(t);
	D.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function BP(e, t, n, r) {
	return t && n !== null ? Ci(n, e, r) : e;
}
function VP(e, t, n, r) {
	if (n === null) return PP;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : YP(n, JP(e));
	return String(i).padStart(t, "0");
}
function HP(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : YP(n, JP(t))));
}
function UP(e) {
	return sx(e.closest(`.${DP}`));
}
function WP(e) {
	let t = e instanceof Element ? e.closest(`.${OP}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${H}`);
	return n === null || A(n) ? null : t;
}
function GP(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${OP}`) : null;
}
function KP(e, t, n) {
	_o({
		key: n,
		items: [...e.querySelectorAll(`.${OP}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function qP(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function JP(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function YP(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function XP(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function ZP(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var QP = "ui-timestamp", $P = "ui-timestamp__text", eF = "data-ui-timestamp-format", tF = "datetime", nF = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${QP}`), D.temporal === null), D.onTable(() => this.apply(this.root.querySelectorAll(`.${QP}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(oi(e.components, `.${QP}`))), L(this.root, `.${QP}`, {
			childList: !0,
			attributeFilter: [tF],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${QP}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: D.temporal,
			language: D.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Qi(a.getAttribute(eF)), o = Zi(a.getAttribute(tF)), s = a.querySelector(`.${$P}`);
			if (s === null || t && !rF(e, o, r)) continue;
			let c = o === null ? "" : ta(o, e, n, r), l = e === "relative-date" ? ra(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= $i(e) && o !== null;
		}
		i && Aa(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${QP}:is([${eF}="relative"], [${eF}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function rF(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && na(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var iF = /* @__PURE__ */ new Map();
function aF(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${x}]`)) if (t.closest(C) === e) return t;
	return null;
}
function oF(e, t, n, r) {
	let i = sF(e, t);
	return i !== null && (iF.set(e, {
		key: t,
		block: n
	}), cF(e, i, n, r), !0);
}
function sF(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function cF(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Co(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = lF(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function lF(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function uF(e) {
	let t = iF.get(e);
	if (t === void 0) return;
	let n = sF(e, t.key);
	if (n === null) {
		iF.delete(e);
		return;
	}
	cF(e, n, t.block, "auto");
}
function dF(e) {
	iF.delete(e);
}
function fF(e) {
	if (!(iF.size === 0 || !(e instanceof Node))) for (let t of [...iF.keys()]) (!t.isConnected || Co(t).contains(e)) && iF.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var pF = "data-ui-scroll-anchor", mF = "End", hF = 4, gF = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], _F = /* @__PURE__ */ new WeakSet();
function vF(e) {
	_F.add(e);
}
function yF(e) {
	_F.delete(e);
}
var bF = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of gF) this.root.addEventListener(e, (e) => xF(e), {
			capture: !0,
			passive: !0
		});
		L(this.root, `[${pF}="${mF}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Ot]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !CF(t) || this.pinned.set(t, _F.has(t) || TF(t) && !wF(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${pF}="${mF}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), _F.has(t)) {
				this.pinned.set(t, !0), SF(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (wF(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), SF(t);
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
			if (!e.isConnected || r === null || !CF(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? SF(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !CF(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && SF(e);
	}
	followsEnd(e) {
		return _F.has(e) || this.pinned.get(e) !== !1 && !wF(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function xF(e) {
	fF(e.target);
	let t = e.target instanceof Element ? e.target.closest(`[${pF}="${mF}"]`) : null;
	t !== null && _F.delete(t);
}
function SF(e) {
	e.scrollTop = e.scrollHeight;
}
function CF(e) {
	return e.getAttribute(pF) === mF;
}
function wF(e) {
	return e.getAttribute(Ct)?.toLowerCase() === "true";
}
function TF(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= hF;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var EF = `:is(.ui-surface, .ui-card)[${y}]`, DF = "ui-surface--clickable", OF = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), L(t, EF, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(EF));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(EF) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(DF)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), MF(e, "role", jF(e) ? "group" : "button"), MF(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : AF(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = kF(e);
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
function kF(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(DF) && t.hasAttribute("tabindex") ? t : null;
}
function AF(e) {
	let t = e.closest(Ao);
	return t !== null && t.closest(M)?.matches(".ui-items-view, .ui-table") === !0 && $p(t) === e;
}
function jF(e) {
	for (let t of e.querySelectorAll(Zp)) if (nm(e, t)) return !0;
	return !1;
}
function MF(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var NF = `${Xp}, [role='menu'], [role='tab']`, PF = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? FF, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(NF) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function FF(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function IF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = RF(e, a, n), s = RF(e, a + 1, n);
	return zF(t, o.top, s.top, o.line, s.line);
}
function LF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = RF(e, a, n), s = RF(e, a + 1, n);
	return zF(t, o.line, s.line, o.top, s.top);
}
function RF(e, t, n) {
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
function zF(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var BF = 250, VF = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(pt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < BF && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${pt}="${xr(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${pt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = HF(e, "data-ui-scroll-viewport") ?? UF(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? GF(e) : null, a = i === null ? null : GF(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = LF(a, IF(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? WF(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function HF(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function UF(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : HF(e, x);
	return t === null ? null : Co(t);
}
function WF(e, t) {
	return t > 0 ? e / t : 0;
}
function GF(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${mt}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${ht}]`);
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
var KF = ".ui-tab-item__caption, .ui-split-button:not([data-ui-split-mode='menu']) > :is(.ui-split-button__main, .ui-split-button__toggle)", qF = `.${mr}, .ui-action, .${S}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice, ${KF}`, JF = "ui-key-value-action__row", YF = `${qF}, ${`${Ao}, .${JF}`}`, XF = "ui-pressing", ZF = "ui-press-held", QF = "--ui-press-x", $F = "--ui-press-y", eI = "--ui-ripple-radius", tI = "--ui-ripple-opacity", nI = class {
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
		if (t === null || typeof t.animate != "function" || Uc()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(QF, `${r}px`), t.style.setProperty($F, `${i}px`), t.classList.add(XF, ZF);
		let o = t.animate([{ [eI]: "0px" }, { [eI]: `${a}px` }], {
			duration: I.ripple,
			easing: I.ease,
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
		let t = e.closest(KF) ?? e.closest(YF);
		if (t === null || O(t)) return null;
		let n = e.closest(dr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(qF) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (rm(t, e) !== null || k(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(M), r = n !== null && !e.classList.contains(JF) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && Xa(e, "data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : N(e);
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
		n.element.classList.remove(ZF);
		let r = Math.max(0, I.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, I.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [tI]: 1 }, { [tI]: 0 }], {
			duration: I.normal,
			delay: i,
			easing: I.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(XF, ZF), this.presses.get(e) === t && this.presses.delete(e);
	}
}, rI = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), iI = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], aI = `.${ir}, .${ar}`, oI = RegExp(`(^|\\s)(${ir}|${ar})(\\s|$)`), sI = RegExp(`(^|\\s)${or}(\\s|$)`), cI = "[type='range']", lI = /* @__PURE__ */ new WeakSet(), uI = /* @__PURE__ */ new WeakSet();
function dI(e = document) {
	let t = e === document ? window : e;
	for (let e of iI) t.addEventListener(e, yI, !0);
	t.addEventListener("keydown", xI, !0), t.addEventListener("change", SI, !0), t.addEventListener("pointerdown", CI, !0), t.addEventListener("mousedown", CI, !0), gI(e.querySelectorAll(aI)), mI(e.querySelectorAll(`[${rr}]`)), pI(e.querySelectorAll(cI)), new MutationObserver((e) => {
		for (let t of e) fI(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", rr],
		attributeOldValue: !0
	});
}
function fI(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			hI(t, e.oldValue !== null);
			return;
		}
		let n = oI.test(e.oldValue ?? ""), r = t.matches(aI);
		n !== r && (_I(t, r), hI(t)), sI.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && pI(t.querySelectorAll(cI));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(aI) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && vI(n), n.matches(aI) && _I(n, !0), gI(n.querySelectorAll(aI)), hI(n), mI(n.querySelectorAll(`[${rr}]`)), pI([n, ...n.querySelectorAll(cI)]));
}
function pI(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = A(t);
		e !== lI.has(t) && (e ? (lI.add(t), t.addEventListener("touchstart", CI, { passive: !1 })) : (lI.delete(t), t.removeEventListener("touchstart", CI)));
	}
}
function mI(e) {
	for (let t of e) hI(t);
}
function hI(e, t = !1) {
	let n = e.getAttribute(rr);
	n === null && !t || (e.matches(aI) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Rd(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function gI(e) {
	for (let t of e) _I(t, !0);
}
function _I(e, t) {
	for (let n of e.children) t ? vI(n) : uI.has(n) && (uI.delete(n), n.removeAttribute("inert"));
}
function vI(e) {
	e.hasAttribute("inert") || (uI.add(e), e.setAttribute("inert", ""));
}
function yI(e) {
	e.target instanceof Element && (O(e.target) ? (e.type === "click" && cu(e), wI(e)) : e.type === "click" && bI(e.target) && e.preventDefault());
}
function bI(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && A(e);
}
function xI(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && O(e.target)) {
			wI(e);
			return;
		}
		!rI.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && A(e.target) && e.preventDefault();
	}
}
function SI(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && A(e.target) && e.stopImmediatePropagation();
}
function CI(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !A(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function wI(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var TI = /* @__PURE__ */ new WeakMap(), EI = new pu({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = TI.get(e);
		TI.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), DI = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => EI.popupOf(r) === t;
		return TI.set(t, n.onDismiss), EI.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (TI.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && EI.reposition(r);
			},
			close: () => {
				i() && EI.close(r);
			}
		};
	},
	focusReturn: (e) => Ws(e)
};
//#endregion
//#region src/items/item-rows.ts
function OI(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: jv,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => es(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var kI = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? MI(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), NI(l, n, t);
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
		let i = jI(r.item, t, n);
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
			AI(n, e) && this.applyBoundAttribute(i, String(T(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = T(t.bindingId);
			e.push([t, `[${Ie}${Sr(n.propertyName)}="${xr(r)}"]`]);
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
		let r = LI(t, n.templateKeyPropertyName);
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
		r !== void 0 && Dv(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : Ev(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Ga(u, () => this.metadata.isTranslatable(a) && !Ov(l)), f = T(a.componentId), p = e.closest(`[${y}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = Tr(p, t, () => [e])[0] ?? null;
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
function AI(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = T(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function jI(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Mv(r, i.name) : Lv(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Rv(r, i.key, n), e;
	let a = r;
	return a[Pv(a, i.name)] = n, e;
}
function MI(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function NI(e, t, n) {
	e.setAttribute(b, t), II(e, n), FI(e, n);
}
var PI = [
	["CanSelect", ae],
	["CanDrag", oe],
	["CanRemove", se],
	["CanRename", ce],
	["CanShowContextMenu", le]
];
function FI(e, t) {
	for (let [n, r] of PI) {
		let i = Mv(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function II(e, t) {
	let n = Mv(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(ot, n.value) : e.removeAttribute(ot);
}
function LI(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Mv(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var RI = "Group", zI = class {
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
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), L(e.root, `[${lt}="${ut}"]`, { attributeFilter: [Je] }, (e) => {
			for (let t of e) {
				let e = ci(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), L(e.root, `[${dt}="windowed"]`, { attributeFilter: [wt] }, (e) => {
			for (let t of e) {
				let e = ci(t);
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
			for (let [t, n] of e) t.isConnected && qM(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(T(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Iv(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${x}]`)) {
			if (tv(r) !== "virtualized") continue;
			let i = r.closest(C);
			i === null || !this.drawsPatchedComponent(i, T(e.reference.componentId), t) || !BI(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(E(i), t) && this.sync(r, E(i));
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
		qM(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${b}="${xr(t)}"]`)].filter((t) => this.isItemRoot(t) && ni(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${x}]`), i = r === null ? null : ci(r);
		if (r !== null && i !== null && tv(r) === "virtualized") {
			let a = e.getAttribute(b);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = VI(RI, t);
		a && II(e, this.options.renderer.getItemValue(e)), PI.some(([e]) => VI(e, t)) && FI(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && VI(RI, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => VI(e.itemProperty, t)) || n.sorts.some((e) => VI(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${x}]`)) {
			let n = ci(t);
			n === e && this.sync(t, n);
		}
	}
};
function BI(e, t) {
	let n = ti(e, ei(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function VI(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var HI = "ui-table", UI = "ui-table--no-header";
function WI(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(HI)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(UI)) && (s ? o : a).push(t);
	a.forEach((e, t) => GI(e, t));
	for (let [e, n] of t) GI(e, a.length + n);
	n !== null && o.forEach((e, t) => GI(e, a.length + n + t)), KI(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function GI(e, t) {
	KI(e, "aria-rowindex", String(t + 1));
}
function KI(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var qI = 50, JI = 1, YI = .5, XI = 60, ZI = "--ui-window-look", QI = "--ui-window-row", $I = "--ui-window-tile", eL = 3, tL = class {
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
			if (this.layout(t), cL(t) === 0) {
				this.getState(t).pending || this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = dL(e, bt);
		if (t !== null && CF(e) && nL(e.getAttribute("data-ui-window-more-after"))) {
			Eo(e, Math.max(0, this.windowBottom(e, t) - To(e).height));
			return;
		}
		t !== null && t !== 0 && Eo(e, nL(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = sL(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : oL(n[n.length - 1]).bottom - oL(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = dL(e, bt), n = sL(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = To(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		tv(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${x}][${dt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = wo(e.target);
		if (t === null || tv(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, XI));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && cL(e) > 0) return;
		let n = sL(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = dL(e, bt), i = nL(e.getAttribute(St)), a = nL(e.getAttribute(Ct));
		if (r !== null) {
			let o = this.windowSize(e), s = To(e), c = Math.max(1, Math.round(s.height * JI / t.itemSize), Math.floor(o * YI)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, lL(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, lL(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = To(e), s = Math.max(1, o.height * JI), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, lL(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, lL(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = dL(e, xt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = ci(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, e.setAttribute(_t, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && dL(e, "data-ui-window-total") === null && iL(e) && zM(e, RM, eL * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: uL(e),
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
			o.pending = !1, e.removeAttribute(_t), e.removeAttribute("aria-busy"), zM(e, RM, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = sL(e), r = dL(e, xt), i = dL(e, bt);
		if (WI(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			zM(e, "top", 0), zM(e, LM, 0);
			return;
		}
		if (n.length > 0) {
			let r = oL(n[n.length - 1]).bottom - oL(n[0]).top;
			if (r > 0) {
				let i = rL(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), aL(e, a > 1 ? (oL(n[n.length - 1]).top - oL(n[0]).top) / (a - 1) : r, i > 1 ? oL(n[1]).left - oL(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		zM(e, "top", a), zM(e, LM, o), uF(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(QI));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = dL(e, yt);
		return t !== null && t > 0 ? t : qI;
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
function nL(e) {
	return e !== null && e.toLowerCase() === "true";
}
function rL(e) {
	let t = oL(e[0]).top, n = 1;
	for (; n < e.length && oL(e[n]).top === t;) n++;
	return n;
}
function iL(e) {
	return getComputedStyle(e).getPropertyValue(ZI).trim() === "skeleton";
}
function aL(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(QI) !== i && r.setProperty(QI, i), r.getPropertyValue($I) !== a && (a.length === 0 ? r.removeProperty($I) : r.setProperty($I, a));
}
function oL(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function sL(e) {
	return [...e.children].filter((e) => e.hasAttribute(b));
}
function cL(e) {
	return sL(e).length;
}
function lL(e) {
	return e.getAttribute(b);
}
function uL(e) {
	let t = e.closest(C);
	return t === null ? [] : ti(t, ei(t));
}
function dL(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var fL = [
	y,
	re,
	ie
];
function pL(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, mL(c, e.itemRole);
	let l = gL(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = hL(l, t, n, a);
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
		d.className = l.wrapperClassName, mL(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), NI(d, r, n), c.appendChild(d);
	}
	return NI(c, r, n), o.registerItemScope(c, l, n), c;
}
function mL(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function hL(e, t, n, r) {
	let i = LI(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function gL(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of fL) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), E(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function _L(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return vL(i.renderer.renderItem(e, t, n, r), a);
	let s = pL(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), vL(s, a);
}
function vL(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var yL = 6, bL = 60, xL = class {
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
		let n = CF(e) && TF(e);
		this.project(e, t), this.layout(e, t), n && !TF(e) && (Eo(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && mc(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = V(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? ms(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = jI(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Bv(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Wv(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Hv(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => TL(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Kv(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = TL(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Kv(e.item, t.item, a))), e !== "" && l.push({
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
		let t = wo(e.target);
		t !== null && tv(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && tv(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, bL));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = jL(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = DL(e) ? OL(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || EL(e)) && u > 0) {
			let i = ML(r.paddingTop), a = To(e), o = CL(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - yL), f = Math.min(u, f + yL);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], _ = [], v = !1;
		for (let e = 0; e < o; e++) {
			let r = n[e], i = e >= p && e < m, a = (r.header ? t.headers.get(TL(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), wL(t, r, null), v = !0);
				continue;
			}
			if (a !== null) {
				r.header && IM(a, r.entry.key), g.push(a), _.push([a, e]);
				continue;
			}
			let o = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, h);
			o !== null && (wL(t, r, o), g.push(o), _.push([o, e]), v = !0);
		}
		let ee = new Set(g);
		for (let e of t.entries) e.element !== null && !ee.has(e.element) && (e.element.remove(), e.element = null, v = !0);
		for (let t of V(e)) ee.has(t) || (t.remove(), v = !0);
		for (let t of e.querySelectorAll(`:scope > [${it}]`)) ee.has(t) || (t.remove(), v = !0);
		for (let e of t.headers.values()) e.element !== null && !ee.has(e.element) && (e.element = null);
		let te = NL(l, 0, d), ne = NL(l, f, u);
		BM(e, [...g, ...yv(bv(e))]), zM(e, "top", te > 0 ? te - i : 0), zM(e, LM, ne > 0 ? ne - i : 0), xv(e, t.componentId, this.options.templates, this.options.renderer, o > 0), WI(e, _, o), (v || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = kL(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return _L(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && IM(r, t.key), r;
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(TL(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = AL(o);
			s.height <= 0 || (SL(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(TL(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = li(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of V(e)) {
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
function SL(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function CL(e, t, n, r, i, a, o) {
	if (t.laidOut !== n || t.laidAcross !== i || t.pitches.length !== r.length || a <= 0) return a;
	let s = 0, c = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.firstLine && e < t.lastLine ? r[e] : t.pitches[e];
		if (s + n > a) break;
		s += n, c += r[e];
	}
	let l = c - s;
	return Math.abs(l) < .5 ? a : (Eo(e, a + l + o), a + l);
}
function wL(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = TL(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function TL(e) {
	let t = Mv(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function EL(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function DL(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function OL(e, t, n) {
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
function kL(e, t, n) {
	let r = e.clientWidth - ML(t.paddingLeft) - ML(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = ML(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function AL(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function jL(e) {
	return ML(e.rowGap);
}
function ML(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function NL(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var PL = "data-ui-template", FL = "default", IL = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? FL, r = this.findTemplate(e, n);
		return r === void 0 ? n === FL ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${PL}]`);
		for (let e of r) if (e.getAttribute(PL) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= LL(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, tt);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, nt);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function LL(e) {
	let t = /* @__PURE__ */ new Set();
	return Wa(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(C)) {
			let n = E(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function RL(e, t) {
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
var zL = "script[type='application/json'][data-ui-metadata]";
function BL(e = document) {
	let t = e.querySelector(zL);
	if (t === null) return VL();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return VL();
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
function VL() {
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
var HL = "script[type='application/json'][data-ui-hydration]";
function UL(e) {
	return e !== null && (_a(e.title) || _a(e.changes));
}
function WL(e = document) {
	let t = e.querySelector(HL)?.textContent?.trim() ?? "";
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
var GL = "reconnecting";
async function KL(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), GL;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function qL(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
function JL(e, t, n) {
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
var YL = "/_ne/", XL = 3e3;
function ZL(e, t, n) {
	let r = e.getAttribute(In);
	if (r === null || !("serviceWorker" in navigator)) return;
	let i = navigator.serviceWorker;
	if (JL(i, t, n), e.hasAttribute("data-ui-service-worker-imported")) return () => $L(i.ready);
	let a = i.register(r, { scope: YL }).then(QL).catch((e) => {
		s("registering the notification service worker failed; notifications are the page's own.", e);
	});
	return () => a;
}
function QL(e) {
	let t = e.installing ?? e.waiting;
	return e.active !== null || t === null ? Promise.resolve(e) : new Promise((n) => {
		t.addEventListener("statechange", () => {
			t.state === "activated" && n(e);
		});
	});
}
function $L(e) {
	return Promise.race([e, new Promise((e) => setTimeout(() => e(void 0), XL))]);
}
//#endregion
//#region src/runtime/reload-guard.ts
var eR = "ne-standard-ui:reloaded-view";
function tR(e, t, n) {
	if (!t) return "no-cookie";
	if (iR(n) === e) return "asked-again";
	try {
		n?.setItem(eR, e);
	} catch {}
	return "reload";
}
function nR(e) {
	try {
		e?.removeItem(eR);
	} catch {}
}
function rR() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function iR(e) {
	try {
		return e?.getItem(eR) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var aR = 2e3, oR = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? aR, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Wn, "reconnecting"), this.notice = this.notifications.show({
			message: D.text("ui.connection.reconnecting"),
			sticky: !0,
			connection: !0
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
}, sR = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(cR(lR(e)));
	}
	async dispatchAsync(e) {
		let t = lR(e), n = cR(t);
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
function cR(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function lR(e) {
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
var uR = class {
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
async function dR(e, t) {
	try {
		await e();
	} finally {
		t();
	}
}
//#endregion
//#region src/state/property-state-store.ts
var fR = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && mc(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = pR(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(mR([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(pR(e, t));
		let n = this.unplaced.get(mR(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = pR(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(mR([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = mR(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, mR(t.slice(0, e - 1)));
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
		return `${T(e.componentId)}:${e.propertyId}:${hR(t)}`;
	}
};
function pR(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function mR(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function hR(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var gR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, _R = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, vR = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, yR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, bR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, xR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, SR = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, CR = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, wR = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, TR = class {
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
var ER = class {
	constructor() {}
	log(e, t) {}
};
ER.instance = new ER();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var DR = "10.0.11", q = class {
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
function OR(e, t) {
	let n = "";
	return AR(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${kR(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function kR(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function AR(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function jR(e, t, n, r, i, a) {
	let o = {}, [s, c] = FR();
	o[s] = c, e.log(K.Trace, `(${t} transport) sending data. ${OR(i, a.logMessageContent)}.`);
	let l = AR(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function MR(e) {
	return e === void 0 ? new PR(K.Information) : e === null ? ER.instance : e.log === void 0 ? new PR(e) : e;
}
var NR = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, PR = class {
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
function FR() {
	let e = "X-SignalR-User-Agent";
	return J.isNode && (e = "User-Agent"), [e, IR(DR, LR(), zR(), RR())];
}
function IR(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function LR() {
	if (J.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function RR() {
	if (J.isNode) return process.versions.node;
}
function zR() {
	return J.isNode ? "NodeJS" : "Browser";
}
function BR(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function VR() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var HR = class extends TR {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || J.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(VR());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new vR();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new vR();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(K.Warning, "Timeout from HTTP request."), n = new _R();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, AR(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new gR(await UR(i, "text") || i.statusText, i.status);
		let a = await UR(i, e.responseType);
		return new wR(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return J.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function UR(e, t) {
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
var WR = class extends TR {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new vR()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (AR(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new vR());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new wR(r.status, r.statusText, r.response || r.responseText)) : n(new gR(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(K.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new gR(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(K.Warning, "Timeout from HTTP request."), n(new _R());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, GR = class extends TR {
	constructor(e) {
		if (super(), typeof fetch < "u" || J.isNode) this._httpClient = new HR(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new WR(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new vR()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, KR = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
KR.RecordSeparatorCode = 30, KR.RecordSeparator = String.fromCharCode(KR.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var qR = class {
	writeHandshakeRequest(e) {
		return KR.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (AR(e)) {
			let r = new Uint8Array(e), i = r.indexOf(KR.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(KR.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = KR.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Y;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var JR = class {
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
		return this.observers.push(e), new NR(this, e);
	}
}, YR = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			AR(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new XR(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, AR(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, XR = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, ZR = 3e4, QR = 15e3, $R = 1e5, X;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(X ||= {});
var ez = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(K.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, q.isRequired(e, "connection"), q.isRequired(t, "logger"), q.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? ZR, this.keepAliveIntervalInMilliseconds = a ?? QR, this._statefulReconnectBufferSize = o ?? $R, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new qR(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = X.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Y.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new YR(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = X.Disconnecting, this._logger.log(K.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(K.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === X.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new vR("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new JR();
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
						this._logger.log(K.Error, `Invoke client method threw error: ${BR(e)}`);
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
							this._logger.log(K.Error, `Stream callback threw error: ${BR(e)}`);
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
		this._logger.log(K.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new vR("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === X.Disconnecting ? this._completeClose(e) : this._connectionState === X.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === X.Connected && this._completeClose(e);
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
				this._logger.log(K.Error, `Stream 'error' callback called with '${e}' threw error: ${BR(t)}`);
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
}, tz = [
	0,
	2e3,
	1e4,
	3e4,
	null
], nz = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? tz : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, rz = class {};
rz.Authorization = "Authorization", rz.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var iz = class extends TR {
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
		e.headers ||= {}, this._accessToken ? e.headers[rz.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[rz.Authorization] && delete e.headers[rz.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Z;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Z ||= {});
var az;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(az ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var oz = class {
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
}, sz = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new oz(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, az, "transferFormat"), this._url = e, this._logger.log(K.Trace, "(LongPolling transport) Connecting."), t === az.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = FR(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === az.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(K.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new gR(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(K.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(K.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(K.Trace, `(LongPolling transport) data received. ${OR(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new gR(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof _R ? this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(K.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? jR(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(K.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(K.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = FR();
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
			i ? i instanceof gR && (i.statusCode === 404 ? this._logger.log(K.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(K.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(K.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, cz = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, az, "transferFormat"), this._logger.log(K.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== az.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (J.isBrowser || J.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = FR();
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
						this._logger.log(K.Trace, `(SSE transport) data received. ${OR(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? jR(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, lz = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, az, "transferFormat"), this._logger.log(K.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (J.isNode || J.isReactNative) {
				let t = {}, [r, i] = FR();
				t[r] = i, n && (t[rz.Authorization] = `Bearer ${n}`), o && (t[rz.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === az.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(K.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(K.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(K.Trace, `(WebSockets transport) data received. ${OR(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(K.Trace, `(WebSockets transport) sending data. ${OR(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, uz = 100, dz = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, q.isRequired(t, "url"), this._logger = MR(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (J.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!J.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : J.isNode && !n.WebSocket && r && (n.WebSocket = r), !J.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : J.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new iz(n.httpClient || new GR(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= az.Binary, q.isIn(e, az, "transferFormat"), this._logger.log(K.Debug, `Starting connection with transfer format '${az[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(K.Error, e), await this._stopPromise, Promise.reject(new vR(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(K.Error, e), Promise.reject(new vR(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new pz(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new vR("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < uz);
				if (r === uz && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof sz && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(K.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(K.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = FR();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new SR("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof gR && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(K.Error, t), Promise.reject(new SR(t));
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
					if (this._logger.log(K.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new xR(`${n.transport} failed: ${e}`, Z[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(K.Debug, e), Promise.reject(new vR(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new CR(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Z.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new lz(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Z.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new cz(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Z.LongPolling: return new sz(this._httpClient, this._logger, this._options);
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
		if (fz(t, i)) {
			if (e.transferFormats.map((e) => az[e]).indexOf(n) >= 0) {
				if (i === Z.WebSockets && !this._options.WebSocket || i === Z.ServerSentEvents && !this._options.EventSource) return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it is not supported in your environment.'`), new yR(`'${Z[i]}' is not supported in your environment.`, i);
				this._logger.log(K.Debug, `Selecting transport '${Z[i]}'.`);
				try {
					return this.features.reconnect = i === Z.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it does not support the requested transfer format '${az[n]}'.`), /* @__PURE__ */ Error(`'${Z[i]}' does not support ${az[n]}.`);
		}
		return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it was disabled by the client.`), new bR(`'${Z[i]}' is disabled by the client.`, i);
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
function fz(e, t) {
	return !e || (t & e) !== 0;
}
var pz = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new mz(), this._transportResult = new mz(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new mz(), this._transportResult.promise;
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
			this._sendBufferedData = new mz();
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
}, mz = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, hz = "json", gz = class {
	constructor() {
		this.name = hz, this.version = 2, this.transferFormat = az.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = ER.instance);
		let n = KR.parse(e), r = [];
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
		return KR.write(JSON.stringify(e));
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
}, _z = {
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
function vz(e) {
	let t = _z[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var yz = class {
	configureLogging(e) {
		if (q.isRequired(e, "logging"), bz(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = vz(e);
			this.logger = new PR(t);
		} else this.logger = new PR(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new nz(e) : e : new nz(), this;
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
		let t = new dz(this.url, e);
		return ez.create(t, this.logger || ER.instance, this.protocol || new gz(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function bz(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var xz = class extends Error {
	byServerError;
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped", this.byServerError = e instanceof Error && e.message.startsWith("Server returned an error on close");
	}
}, Sz = class {
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
}, Cz = 500;
function wz(e) {
	let { changes: t, ...n } = e;
	return n;
}
function Tz() {
	return {};
}
var Ez = class {
	windowId;
	connection;
	started = !1;
	gate = new Sz();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new uR(t), this.connection = new yz().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, wz));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, wz));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, wz));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, Tz, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new xz(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, Tz));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), Cz);
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
}, Dz = "/_ne/values", Oz = 32768;
Oz / 4;
var kz = 3e4;
function Az(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function jz(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function Mz(e, t = null, n = kz) {
	if (e === void 0 || !jz(e)) return e;
	let r = await Promise.all((e.updates ?? []).map(async (e) => {
		let r = e.valueToken;
		if (typeof r != "string") return e;
		let i = t === null ? "" : `?instance=${encodeURIComponent(t)}`, a = await fetch(`${Dz}/${encodeURIComponent(r)}${i}`, {
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
async function Nz(e) {
	let t = await fetch(Dz, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(kz)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var Pz = Promise.resolve(), Fz = () => {}, Iz = Oz * 3 / 4, Lz = 128, Rz = class {
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
		if (this.handed >= this.given) return Pz;
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
		for (; this.flight !== null;) await this.flight.catch(Fz);
	}
	dispatchAsync(e, t) {
		let n = ++this.given, r = Az(e.value), i = r === null ? null : Nz(r);
		return i?.catch(Fz), new Promise((a, o) => {
			let s = Bz(e), c = this.queue.findIndex((e) => e.field === s), l = [{
				resolve: a,
				reject: o
			}], u = n;
			c >= 0 && (l = [...this.queue[c].settles, ...l], u = this.queue[c].sequence, this.queue.splice(c, 1));
			let d = r === null ? zz(e) : zz({
				...e,
				value: void 0
			}) + Lz;
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, Vz(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof xz) {
				this.requeue(r, e);
				return;
			}
			for (let t of r) for (let n of t.settles) n.reject(e);
		}
	}
	takeBatch() {
		let e = 0, t = 0;
		for (; e < this.queue.length && (e === 0 || t + this.queue[e].bytes <= Iz);) t += this.queue[e].bytes, e++;
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
		let t = this.transport.whenAttached().then(() => Nz(e));
		return t.catch(Fz), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function zz(e) {
	return new TextEncoder().encode(JSON.stringify(e)).byteLength;
}
function Bz(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function Vz(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var Hz = "form-owner", Uz = "ui-form-";
function Wz(e) {
	return Uz + e.replace(/[ \t\n\f\r]/g, "_");
}
function Gz(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = Wz(t);
	qz(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function Kz(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(Uz) && qz(e);
	}
}
function qz(e) {
	let t = Jz();
	if (t.querySelector(`form[id="${xr(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function Jz() {
	let e = document.body.querySelector(`[${Dt}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(Dt, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var Yz = document;
function Xz() {
	try {
		return Yz.execCommand("copy");
	} catch {
		return !1;
	}
}
function Zz(e) {
	try {
		return typeof Yz.execCommand == "function" && Yz.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var Qz = /* @__PURE__ */ new Map([
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
]), $z = [
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
function eB(e) {
	return $(e, $z);
}
var tB = [
	"small",
	"medium",
	"large"
], nB = ["default", "circle"], rB = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], iB = [
	"start",
	"center",
	"end",
	"justify"
], aB = ["nowrap", "wrap"], oB = /* @__PURE__ */ new Map([
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
]), sB = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), cB = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), lB = ["inline", "trailing"], uB = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], dB = [
	"small",
	"medium",
	"large"
], fB = [
	"small",
	"medium",
	"large"
], pB = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], mB = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], hB = ["light", "dark"], gB = [
	"start",
	"center",
	"end",
	"stretch"
], _B = ["clip", "visible"], vB = [
	"visible",
	"hidden",
	"collapsed"
], yB = [
	"background",
	"raised",
	"tinted"
], bB = ["horizontal", "vertical"], xB = [
	"none",
	"gap",
	"rule"
], SB = [
	"none",
	"one",
	"many"
], CB = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], wB = ["stack", "wrap"], TB = ["end", "start"], EB = [
	"disabled",
	"auto",
	"always"
], DB = [
	"disabled",
	"proximity",
	"mandatory"
], OB = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], kB = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], AB = ["hex", "rgb"], jB = ["field", "swatch"], MB = [
	"fill",
	"contain",
	"cover",
	"none"
], NB = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], PB = ["default", "circle"], FB = ["uniform", "vignette"], IB = ["linear", "circular"], LB = [
	"none",
	"vertical",
	"horizontal",
	"both"
], RB = [
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
], zB = [
	"None",
	"Shade",
	"Tint"
], BB = /* @__PURE__ */ new Map();
function VB(e) {
	return BB.get(e);
}
function Q(e, t, n) {
	return WB(e, HB(t, n), (e) => `${t}${$(e, n)}`);
}
function HB(e, t) {
	return UB(t.map((t) => `${e}${t}`));
}
function UB(e) {
	let t = new Set(e);
	return (e) => t.has(e);
}
function WB(e, t, n) {
	return BB.set(e, t), [e, n];
}
function GB(e, t, n) {
	return Bw.map((r) => [`${e}${r[0].toUpperCase()}${r.slice(1)}${t}`, (e) => n(e, r)]);
}
var KB = new Map([
	Q("colorClass", "ui-color--", $z),
	WB("themeColorClass", HB("ui-color--", $z), (e) => TV(e)),
	WB("iconClass", sf, (e) => cf(e)),
	["iconUrlCss", (e) => $d(e)],
	["safeUrl", (e) => zd(e)],
	["safeImageSource", (e) => Jd(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : OT(String(e))],
	Q("iconSizeClass", "ui-icon-size--", tB),
	WB("iconShapeClass", UB(["ui-icon--circle"]), (e) => $(e, nB) === "circle" ? "ui-icon--circle" : ""),
	Q("textTypeClass", "ui-text-type--", rB),
	WB("textAppearanceClass", HB("ui-text-type--", rB), (e) => PV(e)),
	Q("textAlignmentClass", "ui-text--align-", iB),
	Q("textWrapClass", "ui-text--", aB),
	Q("textBadgePlacementClass", "ui-text__badge--", lB),
	Q("badgeStyleClass", "ui-badge-style--", mB),
	["badgeTextFit", (e) => EV(e)],
	Q("buttonClass", "ui-button--", pB),
	Q("surfaceStyleClass", "ui-surface--", yB),
	Q("orientationClass", "ui-orientation--", bB),
	Q("groupSeparatorClass", "ui-command-bar--separator-", xB),
	["selectionModeAttribute", (e) => $(e, SB)],
	["selectionBackgroundCss", (e) => vV(hV(e, "background"))],
	["selectionForegroundCss", (e) => vV(hV(e, "foreground"))],
	["selectionMarkColorCss", (e) => vV(hV(e, "markColor"))],
	["selectionMarkCss", (e) => _V(hV(e, "mark"))],
	["selectionFontWeightCss", (e) => gV(hV(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => vV(hV(e, "actionBarBackground"))],
	Q("itemsViewLayoutClass", "ui-items-view--", wB),
	Q("dragHandlePlacementClass", "ui-drag-handle--", TB),
	Q("scrollXClass", "ui-scroll-x--", EB),
	Q("scrollYClass", "ui-scroll-y--", EB),
	["hostViewport", (e) => iV(e)],
	Q("scrollSnapClass", "ui-scroll-snap--", DB),
	Q("inputAppearanceClass", "ui-input--", uB),
	Q("searchFieldAppearanceClass", "ui-search__field--", uB),
	Q("inputSizeClass", "ui-input--", fB),
	Q("buttonSizeClass", "ui-button--", dB),
	Q("buttonGroupSizeClass", "ui-button-group--", dB),
	["textInputTypeAttribute", (e) => $(e, OB)],
	["inputModeAttribute", (e) => $(e, kB)],
	["colorTextFormatAttribute", (e) => $(e, AB)],
	["colorInputVariantAttribute", (e) => $(e, jB)],
	["themeNameCss", (e) => $(e, hB)],
	["alignmentCss", (e) => $(e, gB)],
	["alignmentStretchFallbackCss", (e) => $(e, gB) === "stretch" ? "start" : ""],
	["overflowCss", (e) => $(e, _B)],
	["layoutLengthCss", (e) => aV(e)],
	["thicknessCss", (e) => cV(e)],
	WB("borderNoneClass", UB(["ui-border--none"]), (e) => uV(e)),
	["radiusCss", (e) => dV(e)],
	["gridUnitCss", (e) => fV(e)],
	["pixelsCss", (e) => WV(e)],
	["gridTemplateCss", (e) => pV(e)],
	["colorVariantCss", (e) => RV(e)],
	["themeColorCss", (e) => vV(e)],
	["themeInkCss", (e) => bV(e)],
	["themeOnColorCss", (e) => SV(e)],
	["themeColorInlineCss", (e) => yV(e) ? "" : vV(e)],
	["themeColorCanonical", (e) => IV(e)],
	["textAppearanceFontSizeCss", (e) => FV(e, "size")],
	["textAppearanceFontWeightCss", (e) => FV(e, "weight")],
	["textAppearanceLineHeightCss", (e) => FV(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => FV(e, "letterSpacing")],
	...GB("responsiveLayoutLength", "Css", (e, t) => aV(Kw(e, t))),
	...GB("responsiveWidth", "Css", (e, t) => oV(Kw(e, t), "horizontal")),
	...GB("responsiveHeight", "Css", (e, t) => oV(Kw(e, t), "vertical")),
	...GB("responsiveThickness", "Css", (e, t) => cV(Kw(e, t))),
	...GB("responsiveThicknessHorizontal", "Css", (e, t) => lV(Kw(e, t), "horizontal")),
	...GB("responsiveThicknessVertical", "Css", (e, t) => lV(Kw(e, t), "vertical")),
	...GB("responsiveRadius", "Css", (e, t) => dV(Kw(e, t))),
	...GB("responsivePixels", "Css", (e, t) => GV(Kw(e, t))),
	...GB("visibility", "Attribute", (e, t) => KV(e, t)),
	...GB("gridPlacement", "ColumnCss", (e, t) => mV(Kw(e, t), "column")),
	...GB("gridPlacement", "RowCss", (e, t) => mV(Kw(e, t), "row")),
	...GB("gridPlacement", "ColumnSpanCss", (e, t) => mV(Kw(e, t), "columnSpan")),
	...GB("gridPlacement", "RowSpanCss", (e, t) => mV(Kw(e, t), "rowSpan")),
	Q("imageFitClass", "ui-image-fit--", MB),
	WB("imageShapeClass", UB(["ui-image--circle"]), (e) => $(e, PB) === "circle" ? "ui-image--circle" : ""),
	["backgroundImageCss", (e) => XB(e)],
	["backgroundImageAttribute", (e) => XB(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => $(e, NB)],
	["backgroundImageDimCss", (e) => ZB(e)],
	["backgroundImageDimModeAttribute", (e) => $(e, FB) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => $B(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => $B(e) ? "" : void 0],
	["positiveCount", (e) => QB(e)?.toString()],
	["positiveFlagAttribute", (e) => QB(e) === void 0 ? void 0 : ""],
	WB("maxLinesClass", UB(["ui-text--max-lines"]), (e) => QB(e) === void 0 ? "" : "ui-text--max-lines"),
	Q("progressVariantClass", "ui-progress--", IB),
	["progressValueText", (e) => UV(e)],
	["textAreaResizeCss", (e) => $(e, LB)],
	Q("flyoutPlacementClass", "ui-flyout--", RB),
	["popupPlacementAttribute", (e) => $(e, RB)],
	["tabMenuEntriesAttribute", (e) => JB(e)],
	["markedDaysAttribute", (e) => YB(e)]
]), qB = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function JB(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = qB.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function YB(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function XB(e) {
	return $d(e);
}
function ZB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function QB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function $B(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var eV = [
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
], tV = new Map(eV.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), nV = new Map(eV.map(([e, t]) => [e, t])), rV = /* @__PURE__ */ new Map([[_B, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function $(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : rV.get(t)?.get(e)) ?? Qz.get(e) ?? Sr(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function iV(e) {
	return e == null || $(e, EB) === "disabled" ? void 0 : "parent";
}
function aV(e) {
	if (e == null) return "";
	if (typeof e == "number") return WV(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? WV(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function oV(e, t) {
	if (typeof e != "object" || !e) return aV(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? aV(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function sV(e) {
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
function cV(e) {
	if (e == null) return "";
	let t = sV(e);
	return t === void 0 ? String(e) : `${t.top}px ${t.right}px ${t.bottom}px ${t.left}px`;
}
function lV(e, t) {
	let n = sV(e);
	return n === void 0 ? "" : WV(t === "horizontal" ? n.left + n.right : n.top + n.bottom);
}
function uV(e) {
	if (e == null) return "";
	if (typeof e == "object" && "base" in e) return Bw.map((t) => Kw(e, t)).filter((e) => e != null).every((e) => uV(e) !== "") ? "ui-border--none" : "";
	let t = sV(e);
	return t !== void 0 && t.top === 0 && t.right === 0 && t.bottom === 0 && t.left === 0 ? "ui-border--none" : "";
}
function dV(e) {
	if (e == null) return "";
	if (typeof e == "number") return WV(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? WV(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function fV(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return WV(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function pV(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return fV(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return fV(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${fV(e[0])})` : e.map((e) => fV(e)).join(" ");
}
function mV(e, t) {
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
function hV(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function gV(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function _V(e) {
	if (e == null) return "";
	switch ($(e, CB)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function vV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (LV(e)) return RV(e);
	let t = e, n = RV(t.light), r = RV(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = oB.get($(o, $z));
	return s ? `var(${s})` : "";
}
function yV(e) {
	if (typeof e != "object" || !e || LV(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function bV(e) {
	if (yV(e)) {
		let t = sB.get($(e.style, $z));
		if (t !== void 0) return `var(${t})`;
	}
	return vV(e);
}
var xV = /* @__PURE__ */ new Set(["background", "surface"]);
function SV(e) {
	if (typeof e != "object" || !e) return "";
	if (LV(e)) return CV(e) ? "initial" : wV(e);
	let t = e, n = wV(t.light ?? t.dark), r = wV(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && CV(t.light ?? t.dark) && CV(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = $(t.style, $z);
	if (xV.has(i)) return "initial";
	let a = cB.get(i);
	return a ? `var(${a})` : "";
}
function CV(e) {
	return zV(e)?.[3] === 0;
}
function wV(e) {
	let t = zV(e);
	return t === void 0 ? "" : YA(t[0], t[1], t[2], t[3]);
}
function TV(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${$(n, $z)}`;
}
function EV(e) {
	let t = AV(e == null ? "" : String(e).trim(), DV + 1);
	return t > 0 && t <= DV ? "compact" : "";
}
var DV = 2, OV = /[\u0300-\uFFFF]/, kV = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function AV(e, t) {
	if (!OV.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of kV.segment(e)) {
		if (n >= t) break;
		n += jV(r) ? 2 : 1;
	}
	return n;
}
function jV(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < MV.length; e += 2) if (t >= MV[e] && t <= MV[e + 1]) return !0;
	return !1;
}
var MV = [
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
function NV(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ne, EV(n)), e.setAttribute(Pe, "");
}
function PV(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${$(n, rB)}`;
}
function FV(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return WV(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : WV(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : WV(e);
		}
		default: return "";
	}
}
function IV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = BV(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${JA(r.rgb >> 16 & 255)}${JA(r.rgb >> 8 & 255)}${JA(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${JA(e)}`;
	}
	let i = VV(r.name);
	return i === null ? "" : `${i}/${HV(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function LV(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function RV(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = zV(e);
	return t === void 0 ? "" : `#${JA(t[0])}${JA(t[1])}${JA(t[2])}${JA(t[3])}`;
}
function zV(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = VV(t.name), i = n ?? (r === null ? void 0 : tV.get(r));
	if (!i) return;
	let a = HV(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = W(c * (1 - o)), l = W(l * (1 - o)), u = W(u * (1 - o))) : a === "Tint" && (c = W(c + (255 - c) * o), l = W(l + (255 - l) * o), u = W(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function BV(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = $z[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function VV(e) {
	if (typeof e == "number") return nV.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function HV(e) {
	if (typeof e == "number") return zB[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function UV(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function WV(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function GV(e) {
	return e == null ? "" : WV(e);
}
function KV(e, t) {
	let n = qw(e, t);
	if (n == null) return;
	let r = $(n, vB);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var qV = "ui-announcer", JV = 7e3, YV = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : D.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), JV), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${qV}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = qV, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, XV = "ui-notification-host", ZV = "ui-notification", QV = "ui-notification--leaving", $V = "ui-notification__message", eH = "ui-notification__title", tH = "ui-notification__action", nH = "ui-notification__close", rH = 5e3, iH = 8e3, aH = "ui-notification--connection", oH = "--ui-notification-lift", sH = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), cH = class {
	root;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? rH, this.ensureHost(), this.announcer = new YV(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = eB(e.severity), n = document.createElement("div");
		n.className = sH.has(t) ? `${ZV} ${ZV}--${t}` : ZV, n.classList.toggle(aH, e.connection === !0), t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		if (r.className = $V, e.title !== void 0) {
			let t = document.createElement("span");
			t.className = eH, D.writeValue(t, null, e.title), n.append(t);
		}
		typeof e.message == "string" ? r.textContent = e.message : D.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		return i.type = "button", i.className = nH, D.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(fH(e.action, e.sticky === !0 ? null : () => this.dismiss(n))), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), lH(() => {
			if (n.classList.contains(QV)) return;
			let t = this.ensureHost();
			uH(t), t.append(n), e.sticky !== !0 && this.standFor(n, e);
		}), n;
	}
	standFor(e, t) {
		let n = t.durationMs !== void 0 && t.durationMs > 0 ? t.durationMs : t.action === void 0 ? this.durationMs : iH, r = !1, i = !1, a = window.setTimeout(() => this.dismiss(e), n), o = () => window.clearTimeout(a), s = () => {
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
		if (!e.classList.contains(QV) && (e.classList.add(QV), e.isConnected)) {
			if (this.returnFocus(e), Uc() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => dH(e), I.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(QV));
		Js(Ws(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${nH}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${XV}`), n = t ?? document.createElement("div");
		return n.classList.add(XV), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function lH(e) {
	if (VN(document.visibilityState)) {
		e();
		return;
	}
	let t = () => {
		VN(document.visibilityState) && (document.removeEventListener("visibilitychange", t), e());
	};
	document.addEventListener("visibilitychange", t);
}
function uH(e) {
	let t = window.innerHeight - Nl(window.innerHeight);
	t > 0 ? e.style.setProperty(oH, `${Math.round(t)}px`) : e.style.removeProperty(oH);
}
function dH(e) {
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
		duration: I.fast,
		easing: I.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function fH(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${tH} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : D.writeValue(n, null, e.label), n.addEventListener("click", () => {
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
function pH(e, t) {
	let n = mH(e), r = e?.label;
	if (n !== void 0) {
		if (!pa(r) && !ma(r)) {
			s("a notification's action carries no words.", e);
			return;
		}
		return {
			label: r,
			run: () => t(n)
		};
	}
}
function mH(e) {
	return e != null && typeof e.id == "string" && e.id.length > 0 ? e.id : void 0;
}
//#endregion
//#region src/effects/insert-text.ts
function hH(e, t, n) {
	let r = e.itemKey === !0 ? gH(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = _H(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	vH(i, r);
}
function gH(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function _H(e) {
	if (mo(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (mo(t)) return t;
	return null;
}
function vH(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || O(e) || A(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && Zz(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function yH(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : bH(t, e.request?.parameters ?? null);
}
function bH(e, t) {
	let n = xH(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function xH(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, SH(e));
	return t.toString();
}
function SH(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function CH(e, t) {
	let n = TH([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return TH(r, t) ?? wH(t);
}
function wH(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && EH(t, e) ? t : null;
}
function TH(e, t) {
	let n = null;
	for (let r of e) if (sw(r, t)) {
		if (EH(r, t)) return r;
		n ??= r;
	}
	return n;
}
function EH(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var DH = class {
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
		this.handlers.set(Vr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Vr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = yH(e.effect);
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
			let t = e.effect, n = Gr(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Ln, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = MH(e);
			t !== null && PH(t);
		}), this.register("ScrollTo", (e) => {
			let t = MH(e);
			if (t === null) return;
			let n = e.effect, r = Hr(n.behavior), i = Ur(n.block);
			t.scrollIntoView({
				behavior: NH(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = MH(e);
			if (t === null) return;
			let n = e.effect, r = aF(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Ur(n.block);
			yF(Co(r)), oF(r, n.key, i === "Unknown" ? "Start" : i, NH(Hr(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = MH(e);
			if (t === null) return;
			let n = e.effect, r = Kr(n.axis) !== "Horizontal", i = CH(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Wr(n.position), u;
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
			let d = NH(Hr(n.behavior)), f = wo(i);
			f !== null && dF(f), r && l === "End" && CF(i) && vF(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			jH(MH(e), null);
		}), this.register("Hide", (e) => {
			jH(MH(e), "hidden");
		}), this.register("Collapse", (e) => {
			jH(MH(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = FH(e, this.valueReaders);
			t !== null && IH(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = MH(e);
			t !== null && hH(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = MH(e);
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
			if (!pa(t.message) && !ma(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : pH(t.action, this.runAction)
			});
		}), this.register("RequestNotificationPermission", () => {
			HN() !== void 0 && Notification.requestPermission().then(() => this.clientStateChanged?.()).catch((e) => s("asking for the notification permission failed.", e));
		}), this.register("ShowSystemNotification", (e) => this.showSystemNotification(e.effect)), this.register("Announce", (e) => {
			let t = e.effect;
			if (!pa(t.message) && !ma(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, qr(t.politeness) === "Assertive" ? "assertive" : "polite");
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
		if (!pa(t) && !ma(t)) {
			s("system notification effect carries no title.", e);
			return;
		}
		let n = pa(e.body) || ma(e.body) ? e.body : void 0, r = () => {
			if (e.fallback === "None" || this.notifications === void 0) return;
			let r = this.runAction === void 0 ? void 0 : pH(e.action, this.runAction);
			this.notifications.show(n === void 0 ? {
				message: t,
				action: r
			} : {
				title: t,
				message: n,
				action: r
			});
		};
		if (e.when !== "Always" && VN(document.visibilityState)) {
			r();
			return;
		}
		let i = mH(e.action), a = typeof e.address == "string" && Hd(e.address) ? e.address : void 0;
		qN({
			title: OH(t),
			body: n === void 0 ? void 0 : OH(n),
			tag: e.tag ?? "",
			icon: typeof e.icon == "string" && Hd(e.icon) ? e.icon : kH(),
			silent: e.silent === !0,
			requireInteraction: e.requireInteraction === !0,
			address: a ?? AH(),
			windowId: this.windowId,
			bringTo: a,
			action: i
		}, () => this.followNotificationClick?.({
			bringTo: a,
			action: i
		}), this.systemNotifications).then((e) => {
			e || r();
		});
	}
};
function OH(e) {
	return pa(e) ? D.translate(e.key, e.args) : ma(e) ? D.resolveText(e.text) : "";
}
function kH() {
	let e = document.querySelector("link[rel~='icon']")?.href;
	return e === void 0 || e.startsWith("data:") ? void 0 : e;
}
function AH() {
	return window.location.pathname + window.location.search + window.location.hash;
}
function jH(e, t) {
	if (e !== null) for (let n of tr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function MH(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(T(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function NH(e) {
	return e === "Smooth" && !Uc() ? "smooth" : "auto";
}
function PH(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(hs))) {
		e.focus();
		return;
	}
	let t = js(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function FH(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = MH(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : so(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : to(t.readHeld(r));
}
async function IH(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!LH(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function LH(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return Xz();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var RH = class {
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
		let n = t.querySelector(".ui-dialog__surface") ?? t, r = js(t), i = Os() && mo(r);
		i && !n.hasAttribute("tabindex") && (n.tabIndex = -1);
		let a = Vs(n, i ? n : r);
		return a !== null && this.returnFocusByKey.set(e, a), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Js(Ws(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		return this.root.querySelector(`[${Bl}="${xr(e)}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${Hl}]`);
		if (n === null) return;
		let r = n.closest(`[${Bl}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute("data-ui-dialog-close-backdrop")) return;
		let i = r.getAttribute(Bl);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !su() && !Zl(e.target) && !Gp(e.target) && !Yl(e.target)) {
				let n = t.getAttribute(Bl);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(C)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Gl(this.root);
	}
	trapTab(e, t) {
		let n = Ns(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = Is(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, zH = "ui-leave", BH = new Tf("data-ui-leave-part"), VH = "560px", HH = null, UH = null;
function WH(e, t) {
	HH ??= GH();
	let n = HH;
	n.isConnected || document.body.append(n), KH(n, "title", D.text("ui.leave.title")), KH(n, "message", D.text("ui.leave.message")), KH(n, "stay", D.text("ui.leave.stay")), KH(n, "leave", D.text("ui.leave.confirm")), UH = {
		dialogs: e,
		leave: t
	}, e.open(zH);
}
function GH() {
	let { dialog: e, surface: t } = wf({
		key: zH,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", VH);
	let n = BH.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = BH.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, BH.actions(BH.button("ui-button--outline", "stay"), BH.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = BH.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = UH;
		UH = null, n?.dialogs.close(zH), t === "leave" && n?.leave();
	}), e;
}
function KH(e, t, n) {
	let r = BH.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var qH = class {
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
		let t = JH(e, this.options.window.location.href);
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
function JH(e, t) {
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
var YH = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(bH(this.route, e), !1);
	}
	push(e) {
		let t = bH(this.route, e), n = this.window.location;
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
		e.search !== this.search && (this.search = e.search, this.revisit(XH(e.search)));
	}
};
function XH(e) {
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
var ZH = class {
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
		!this.state.set(e, t, n, $H(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Ga(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Re), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, $H(r[0]?.component)) ? {
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
			(typeof n == "string" || ma(n) ? this.addressResolver.isTranslatable(t.reference) : pa(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${Le}${Sr(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of Tr(e, t, () => QH(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Re))), r = e.closest(C);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Re)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			uo(e);
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
function QH(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(C) === e) return [n];
	return [e];
}
function $H(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(C) ?? null, r = e === null ? 0 : E(e), i = n.getAttribute(b);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: ti(e, ei(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var eU = "EndValue", tU = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Zs) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = T(e.componentId), r = nU(n, e.propertyId), i = this.watchers.get(r);
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
		let n = ci(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(ct);
		for (let e of r) {
			if (t.metadata !== void 0 && t.metadata.getPropertyDefinition(e.propertyId)?.propertyName === eU !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = nU(T(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function nU(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function rU(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : E(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var iU = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, aU(t));
	}
	apply(e) {
		let t = T(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Rr(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) oU(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) sU(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) cU(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) lU(n, t.key, t.newIndex);
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
function aU(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function oU(e, t) {
	typeof t.key == "string" && (sU(e, t.key), e.splice(uU(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function sU(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function cU(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		oU(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function lU(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(uU(n, e.length), 0, i);
}
function uU(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var dU = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, fU(e, "", t.map((e) => e.split("."))));
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
function fU(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : fU(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function pU(e) {
	let t = new dU();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(T(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var mU = class {
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
}, hU = class {
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
function gU(e, t) {
	let n = _U(e[t], "Reset");
	if (n === null) return null;
	let r = T(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = _U(e[s], "Insert");
		if (t === null || T(t.component?.id) !== r || !mc(i, t.component?.dynamicParameters ?? [])) break;
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
function _U(e, t) {
	if (e === void 0 || Br(e) !== "CollectionChange") return null;
	let n = e;
	return Rr(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var vU = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function yU(e, t, n, r) {
	return {
		action: Rr(e.action),
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
var bU = [], xU = class {
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
	held = new iU();
	projections;
	moves = new mU({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new hU({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => OU(V(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = pU(e), this.projections.isEmpty || Tv((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${x}]`)) {
			let e = ci(n);
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
			return n === void 0 && (n = kU(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = li(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Br(t) !== "CollectionChange") continue;
			let e = t;
			if (Rr(e.action) !== "Insert") continue;
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
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, DU(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of rU(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${x}]`)) {
			let t = ci(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	resortHost(e) {
		let t = ci(e);
		t !== null && this.syncItemsHost(e, t);
	}
	syncItemsHost(e, t) {
		qM(e, t, {
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
				let r = gU(t, e);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(qe) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, bU, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (tv(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = kU(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && mc(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), EU(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
		switch (Br(e)) {
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
		let t = T(e.address?.component?.id), n = zr(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
			this.sinks.dispatch(i, yU(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Rr(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Rr(e.action) === "Move" ? wU(e.moves ?? []) : bU;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (tv(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (Rr(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				SU(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				TU(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), ay(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = ci(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = tv(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : $v(e, V(e)).findIndex((e) => e.getAttribute(b) === t);
		return n < 0 ? null : n + nv(e);
	}
	moveRow(e, t, n) {
		let r = ci(e);
		if (r === null) return;
		let i = Math.max(0, n - nv(e));
		tv(e) === "virtualized" ? this.virtualization.move(e, t, i) : TU(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = V(e), r = OU(n, t);
		if (r === null) return null;
		let i = $v(e, n), a = i.indexOf(r);
		return ny(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = $v(e, V(e));
		My(t.element), e.insertBefore(t.element, ty(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = ci(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, ty($v(e, V(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		ny($v(e, V(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (Rr(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Rr(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${x}]`)) if (ci(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = $v(e, V(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, ty(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return _L(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = V(e), a = $v(e, i), o = kU(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, ty(a, l, i.index ?? null)) : (iy(a, c, l), c.replaceWith(l)));
		}
	}
};
function SU(e, t) {
	let n = V(e), r = $v(e, n), i = kU(e, n), a = CU(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? ms(a, o, n) : null;
		i.delete(t), ny(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function CU(e) {
	let t = e.parentElement, n = t?.closest(M) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function wU(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function TU(e, t) {
	let n = V(e), r = $v(e, n), i = kU(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = ry(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function EU(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? V(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function DU(e) {
	let t = E(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : E(n);
}
function OU(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function kU(e, t = V(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(b);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function AU(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return pa(n) || ma(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: MU(t.severity)
	} : void 0;
}
function jU(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = D.resolve(pa(t) || ma(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function MU(e) {
	let t = Fr(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var NU = "ui-validation--warning", PU = "ui-validation--info", FU = "ui-validation-message--marker", IU = "top-end", LU = "right", RU = "--ui-validation-marker-host", zU = "ui-validation-mark", BU = "--ui-validation-presentation", VU = "--ui-validation-color", HU = "Validation", UU = /* @__PURE__ */ new Set(["Value", "EndValue"]), WU = /* @__PURE__ */ new Set(["Min", "Max"]), GU = `input:not([type='hidden']), textarea, select, .${fr}[role='combobox'], [role='spinbutton']`, KU = {
	Error: 0,
	Warning: 1,
	Info: 2
}, qU = {
	Error: vr,
	Warning: NU,
	Info: PU
}, JU = `.${vr}, .${NU}, .${PU}`, YU = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, XU = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, ZU = {
	Error: `${zU}--error`,
	Warning: `${zU}--warning`,
	Info: `${zU}--info`
}, QU = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, $U = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(JU)), L(this.root, JU, { childList: !0 }, (e) => this.applyRenderedMessages(e)), D.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(JU)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), D.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(JU)) {
			let t = E(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.forgetJudgement(i), o = this.options.metadata.getValidationsForComponent(r), s = t ?? (nW(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(i));
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
			aW(t, rW(t) === "Error");
			let e = t.querySelector(`:scope > [${yr}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), oW(this.markerMirrors, t, e, {
				message: n,
				severity: rW(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(E(e), e) !== void 0)) return;
		let n = Va(t), r = rW(e);
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
		if (e.propertyName === HU) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = UU.has(e.propertyName), n = WU.has(e.propertyName);
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
		let t = T(e.reference.componentId), n = AU(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = T(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Pr(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = T(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = pa(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: MU(e.severity),
			content: e.content === !0,
			property: zr(e.address?.property)
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
		let n = A(t) || O(t) ? null : eW(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return tW(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
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
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(E(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: QU[t]
		}), this.applyCurrentState(E(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(E(e))) if (MU(r.severity) === "Error" && Ac(t, r.operator, r.value) && !Ac(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !Ac(t, r.operator, r.value) && (n === null || KU[MU(r.severity)] < KU[MU(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: XU[MU(n.severity)],
			words: n.message
		};
	}
	refuses(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return !1;
		let { componentId: n, element: r } = t, i = this.options.metadata.getValidationsForComponent(n);
		return this.touchedElements.add(r), this.judgeBounds(n, r), i.length > 0 && this.evaluateAndApply(n, r, i, nW(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(r)), this.hasError(n, r);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		iW(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
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
		}, [], [...e.lines.values()].map(jU).join("\n"), !0);
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
			severity: MU(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || KU[e.severity] < KU[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Pr(e.trigger) === t);
		if (r.length === 0) return;
		let i = nW(e.target) ? this.options.valueReaders.readBound(e.target) : this.options.valueReaders.readHeld(n.element);
		this.evaluateAndApply(n.componentId, n.element, r, i);
	}
	runSubmitValidation(e) {
		let t = !0;
		for (let { field: n, component: r } of this.formFields(e)) {
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Pr(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.options.valueReaders.readBound(n))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${Et}="${xr(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(GU)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
			if (e !== null) return e.focus({ preventScroll: !0 }), e.scrollIntoView({
				block: "center",
				behavior: Uc() ? "auto" : "smooth"
			}), !0;
		}
		return !1;
	}
	hasError(e, t) {
		if (this.boundRefusalByElement.has(t) || this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && MU(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Ac(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function eW(e, t) {
	return J_(e, t) ?? (e.matches(wb) ? gx(e) : null);
}
function tW(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : pa(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function nW(e) {
	return !e.hasAttribute("data-ui-draft") && (e.hasAttribute("data-ui-value-kind") || e.matches("input, textarea, select"));
}
function rW(e) {
	return e.classList.contains(NU) ? "Warning" : e.classList.contains(PU) ? "Info" : "Error";
}
function iW(e, t, n) {
	for (let e of Object.values(qU)) t.classList.toggle(e, n !== void 0 && qU[n.severity] === e);
	aW(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(VU) : r.style.setProperty(VU, `var(--ui-color-${YU[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (za(i, null), i.textContent = String(n.message ?? "")) : D.writeValue(i, null, n?.message ?? null), oW(e, r, i, n));
}
function aW(e, t) {
	for (let n of e.querySelectorAll(GU)) {
		let r = n.closest(dr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function oW(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(BU).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(FU, o), sW(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(RU).trim()), r !== void 0 && o) {
		n.setAttribute(Oe, n.textContent ?? ""), n.setAttribute(ke, IU), n.setAttribute(je, XU[r.severity]), t.setAttribute(Ae, ""), t.contains(document.activeElement) ? XE(n) : ZE(n);
		return;
	}
	n.removeAttribute(Oe), n.removeAttribute(ke), n.removeAttribute(je), t.removeAttribute(Ae), ZE(n);
}
function sW(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : lW(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && cW(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${zU} ${ZU[n.severity]}`, s.textContent = r, s.setAttribute(Oe, r), s.setAttribute(ke, LU), s.setAttribute(je, XU[n.severity]), s.setAttribute(Me, ""), s.parentElement !== o && (cW(s), o.append(s)), o.setAttribute(Ae, ""), e.set(t, s), ZE(s);
}
function cW(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${zU}`) === null && t.removeAttribute(Ae);
}
function lW(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var uW = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, dW = "tooltip-name";
function fW(e, t, n) {
	let r = OT(e.getAttribute(Oe));
	if (za(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var pW = /* @__PURE__ */ new WeakMap(), mW = /* @__PURE__ */ new WeakMap(), hW = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Ir(e), t);
	}
	apply(e) {
		let t = Ir(e.operation.kind), n = this.handlers.get(t);
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
			let t = to(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), za(e.target, null);
		}), this.register("Markup", (e) => {
			AT(e.target, no(e.convertedValue) ? "" : to(e.convertedValue)), za(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = SW(e.operation);
			if (za(e.target, t), no(e.value) || no(e.convertedValue)) {
				xW(e.target, t);
				return;
			}
			bW(e.target, t, to(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = SW(e.operation);
			za(e.target, t), xW(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = SW(e.operation), n = !no(e.value) && gW(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (no(e.convertedValue) ? "" : to(e.convertedValue));
			_W(e.target, yW(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !no(e.value) && gW(e.value, e.operation.condition ?? "None") ? to(e.convertedValue).trim() : "";
			vW(e.target, yW(e), t, VB(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = SW(e.operation), n = !no(e.value) && gW(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? to(e.convertedValue).trim() : "";
				vW(e.target, yW(e), t, VB(e.operation.converter));
			}
		}), this.register("Style", (e) => {
			let t = SW(e.operation), n = e.target;
			if (no(e.value) || no(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = to(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(dW, (e) => fW(e.resolved.component, e.target, SW(e.operation))), this.register(Hz, (e) => Gz(e.target, e.value)), this.register("Property", (e) => {
			let t = SW(e.operation), n = e.target, r = no(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function gW(e, t) {
	switch (Lr(t)) {
		case "None": return !0;
		case "HasValue": return !no(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !no(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return cf(e).length > 0;
		default: return !no(e);
	}
}
function _W(e, t, n, r, i) {
	let a = mW.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), mW.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), bW(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && xW(e, n);
}
function vW(e, t, n, r) {
	let i = pW.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), pW.set(e, i));
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
function yW(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function bW(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function xW(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function SW(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var CW = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => KB.has(e.name),
			convert: (e) => KB.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = wW(e.name), n = {
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
function wW(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var TW = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Jr(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Jr(e.domEventName) || t;
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
		return this.definitions.get(Jr(e));
	}
};
function EW(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function DW(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(fs, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => EW(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => EW(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("escape"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var OW = class {
	converters = new CW();
	events = new TW();
	operations = new hW();
	valueReaders;
	collectionSinks = new vU();
	rowDecorators = new uW();
	constructor(e, t, n, r) {
		DW(this.events), this.valueReaders = new io(r);
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
}, kW = "Submenu", AW = "ui-menu__submenu", jW = "Select", MW = {
	kind: "menu",
	decorate: NW
};
function NW(e) {
	if (!PW(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, kW);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(At, ""), FW(e.item, "Kind") === jW && e.row.setAttribute(jt, ""), FW(e.item, "Expanded") === !0 && e.row.setAttribute(Mt, "");
	let r = document.createElement("div");
	r.className = AW, r.appendChild(n), NI(r, e.key, e.item), e.row.appendChild(r);
}
function PW(e) {
	let t = FW(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function FW(e, t) {
	let n = Mv(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var IW = {
	kind: "grip",
	decorate: LW
};
function LW(e) {
	e.row.append(RW());
}
function RW() {
	let e = document.createElement("span");
	return e.className = he, e.setAttribute("role", "button"), D.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function zW(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(VW(n));
	for (let t of e.querySelectorAll(`[${Xe}]`)) BW(t, Ye, r), BW(t, et, i);
}
function BW(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function VW(e) {
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
var HW = 2;
function UW(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= HW && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function WW(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var GW = "ne.standard.ui.windowId", KW = [
	500,
	1e3,
	2e3
], qW = 3, JW = [
	["refusal", ({ root: e }) => dI(e)],
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
	["field keys", ({ root: e, propertyPatchEngine: t }) => new Sm({
		root: e,
		propertyPatchEngine: t
	})],
	["field box press", ({ root: e }) => new om({ root: e })],
	["image fallback", ({ root: e }) => new jm({ root: e })],
	["radio group sync", ({ root: e }) => new Hm({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new lg({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new gh({ root: e })],
	["debounced commit", ({ root: e }) => new mm({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new xg({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => wg() ? void 0 : new Tg({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new uN({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Qg({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new wj({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new vS({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new GS({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new rC({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new FP({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new nF({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new GC({ root: e })],
	["split button", ({ root: e }) => new Uk({ root: e })],
	["toggle button", ({ root: e }) => new Jp({ root: e })],
	["button group", ({ root: e }) => new Yk({ root: e })],
	["menu", ({ root: e }) => new oD({ root: e })],
	["action bar", ({ root: e }) => new Cw({ root: e })],
	["collapsible", ({ root: e }) => new JO({ root: e })],
	["menu group", ({ root: e }) => new uT({ root: e })],
	["menu search", ({ root: e }) => new xO({ root: e })],
	["side drawer", ({ root: e }) => new IO({ root: e })],
	["skip link", ({ root: e }) => new HO({ root: e })],
	["screen keyboard", () => new Yy()],
	["grid splitter", ({ root: e }) => new kk({ root: e })],
	["accordion", ({ root: e }) => new $k({ root: e })],
	["tabs", ({ root: e }) => new wA({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new hP({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new NA({ root: e })],
	["breadcrumbs", ({ root: e }) => new KA({ root: e })],
	["scroll anchor", ({ root: e }) => new bF({ root: e })],
	["surface press", ({ root: e }) => new OF({ root: e })],
	["text selection", ({ root: e }) => new PF({ root: e })],
	["scroll group", ({ root: e }) => new VF({ root: e })],
	["flyout interaction", ({ root: e }) => new ju({ root: e })],
	["text fold", ({ root: e }) => new EP({ root: e })],
	["tooltip", ({ root: e }) => xE(e)]
], YW = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Dr(BL());
	hydration = WL();
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
		this.options = e, this.root = e.root ?? document, this.windowId = $W(e.windowIdStorageKey ?? GW), this.dom = new si(this.root), D.load(this.root), D.setLanguage(document.documentElement.lang), e.strings !== void 0 && D.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : D.loadTableAsync(this.hydration.words.href)), this.extensions = new OW(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(MW), this.extensions.registerRowDecorator(IW);
		let t = new $r(this.dom, this.metadata), n = this.extensions.operations, r = new fR(), i = new ZH(t, n, this.extensions, r);
		this.reactiveSources = new tU(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new RH({ root: this.root }), this.notifications = new cH({ root: this.root });
		let a = new YH({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		}), o = (e) => this.eventPipeline.dispatchCommandAsync({
			eventId: 0,
			action: e,
			dynamicParameters: []
		}).catch((e) => (s("running a notification's action failed.", e), !1)), u = (e) => JN(e, (e) => this.leaveGuard.navigate(e), (e) => void o(e)), d = ZL(document.documentElement, this.windowId, u);
		this.effects = new DH({
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
			systemNotifications: KN(d)
		});
		let f = new Lc(this.metadata), p, m = new wc(f, i, new kc(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				p?.syncPropertyAsync(T(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), h = new IL(this.dom), g = new kI(this.metadata, h, this.extensions, n, r);
		this.virtualization = new xL({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new xU(this.metadata, i, r, g, h, this.dom, this.virtualization, this.extensions.collectionSinks), D.onChange(() => this.rewriteWords(i, g)), this.rewriteMoments = () => this.rewriteWords(i, g, !0), D.onMomentTick(this.rewriteMoments), new zI({
			root: this.root,
			metadata: this.metadata,
			templates: h,
			renderer: g,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new Ez(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.clientState = new GN({ report: (e) => this.transport.reportClientStateAsync(e) }), this.dispatcher = new sR(this.transport), D.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Er.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Er.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				RL(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && RL(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let _ = new Rz(this.transport);
		p = new nc({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: _,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => v.refusesBounds(e)
		}), i.setHeldTargets((e) => p?.isHeld(e) === !0), this.effects.register(Er.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of p?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				v.discardForm(t);
			}
		}), this.leaveGuard = new qH({
			window,
			ask: async (e) => (await p?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => WH(this.dialogs, t),
			pending: () => dm() || _.isBusy,
			settle: async () => {
				fm(), await _.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Er.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Hd(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let v = new $U({
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
			dialogs: this.dialogs
		};
		for (let [e, t] of JW) UW(e, t, this.engineContext);
		UW("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new K_({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), UW("tree", ({ root: e, effects: t }) => new NN({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: g
			}
		}), this.engineContext), UW("items reorder", ({ root: e }) => new vy({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), UW("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new nI({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", E(e)) || m.hasEventForComponent("click", E(e))
		}) : void 0, this.engineContext), this.eventPipeline = new uc({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: m,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: v,
			valueBinding: p
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...f.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(dP.name, dP.registration);
		let ee = (e) => this.updateProcessor.resortHost(e), te = hy({
			ahead: (e, t, n) => this.updateProcessor.moves.ahead(e, t, n),
			settle: (e) => this.updateProcessor.moves.settle(e),
			resort: ee
		});
		this.eventPipeline.addEvent(te.name, te.registration);
		let ne = pP(ee);
		this.eventPipeline.addEvent(ne.name, ne.registration);
		let y = mb(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, y);
		this.eventPipeline.addEvent(bm.name, bm.registration), UW("shortcuts", ({ root: e, dom: t }) => new hD({
			root: e,
			viewShortcuts: gD(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), UW("item drag", ({ root: e, dom: t }) => new _b({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new vM({ root: this.root }), this.windows = new tL({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), UW("pager", ({ root: e, dom: t }) => new nO({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: D,
			observeComponents: L,
			observeSize: Uj,
			store: new Qw(),
			numbers: E_,
			temporal: Ji,
			icons: { apply: af },
			badges: { writeCount: NV },
			urls: {
				isImageSource: Kd,
				asBrowserReads: Gd,
				isSafeLink: Rd,
				isExternalLink: Vd
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => p?.hold(e),
				release: (e) => {
					p?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(C), a = r === null ? void 0 : this.metadata.getExposedProperty(E(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: YE,
			renames: { open: Ql },
			tables: this.tables,
			rows: OI(h, g, this.virtualization),
			uploads: cd(v),
			selection: Yo,
			popups: DI,
			roving: yo,
			focus: Ms,
			states: eo,
			validation: v,
			wheel: Nf,
			shortcuts: Hy,
			names: br
		}, this.transport.onChanges((e) => void this.applyChanges(e)), this.transport.onCommandResult((e) => {
			let { changes: t, ...n } = e;
			dR(() => this.applyChanges(t), () => {
				this.dispatcher.settle(n) || (this.effects.applyAll(e.command?.effects, this.dom), this.windows.reconsider());
			}).catch((e) => c("a pushed command result could not be applied.", e));
		}), this.updateProcessor.addFullResyncHandler(() => {
			this.attachAsync().catch((e) => c("re-attaching after a full resync failed.", e));
		}), this.transport.onReconnecting((e) => {
			s("SignalR reconnecting.", e), this.dispatcher.release(Error("the connection to the server dropped before the command answered.", { cause: e }));
		}), this.transport.onReconnected(async () => {
			l("SignalR reconnected. Reattaching runtime."), await this.attachAsync();
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new oR({
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
		let t = so(e);
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
		this.dom.invalidate(), D.language !== this.culturesLanguage && (this.culturesLanguage = D.language, Wa(this.root, (e) => zW(e, D.number, D.temporal)));
		let i = n ? _a : void 0;
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
		Wa(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = T(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${y}="${xr(n)}"]`)) ri(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => ri(e, t));
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
		let t = tR(e, navigator.cookieEnabled, rR());
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
		if (tR(e, navigator.cookieEnabled, rR()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		v(this, this.options.handlerGlobalKey), Kz(this.root), await QW();
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
		return Ra(this.root) || UL(this.hydration) || this.metadata.getWords().some((e) => _a(e.key)) || _a(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) UW(WW(t), t, this.pluginContext);
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
		UW(WW(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !jz(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = this.transport.instanceId, r = (this.inbound ?? Promise.resolve()).then(() => (t?.(), Mz(e, n))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= qW) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (nR(rR()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(jz(e) ? await Mz(e, this.transport.instanceId) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = tG(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? XH(window.location.search) : e.parameters,
			timeZone: qL(),
			clientState: this.clientState.forAttach()
		};
		return this.renderSequence = null, await KL(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, KW, ZW);
	}
};
async function XW(e = {}) {
	let t = performance.now(), n = new YW(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function ZW(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function QW() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function $W(e) {
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
	let n = eG();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function eG() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function tG() {
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
_(), XW().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
