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
var ae = "data-ui-id", oe = "data-ui-context", se = "data-ui-pc", _ = "data-ui-key", ce = "data-ui-unselectable", le = "data-ui-undraggable", ue = "data-ui-unremovable", de = "data-ui-unrenamable", fe = "data-ui-no-context-menu", pe = "data-ui-no-row-open", me = "data-ui-no-row-drag", he = "data-ui-drag-kind", ge = "data-ui-drag-source", _e = "data-ui-item-drop-over", ve = "ui-row__grip", ye = "data-ui-row-drop", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-use", we = "data-ui-action-bar", Te = "data-ui-action-bar-key", Ee = "data-ui-action-bar-rest", De = "data-ui-menu-left-out", Oe = "data-ui-in-action-bar", ke = "ui-action-bar", Ae = "data-ui-row-focus", je = "data-ui-tooltip", Me = "data-ui-tooltip-placement", Ne = "data-ui-tooltip-mark", Pe = "data-ui-tooltip-severity", Fe = "data-ui-tooltip-press", Ie = "data-ui-badge-text", Le = "data-ui-badge-set", Re = "data-ui-name", ze = "data-ui-bind-", Be = "data-ui-into-", Ve = "data-ui-bind-value", He = (e) => `data-ui-no-${e}`, Ue = "data-ui-event-boundary", We = "data-ui-image-caption", Ge = "data-ui-image-crop", Ke = "data-ui-image-crop-size", qe = "ui-image", Je = "data-ui-fallback-src", Ye = "data-ui-image-failed", v = "data-ui-items-host", Xe = "data-ui-collection-sink", Ze = "data-ui-items-query", Qe = "data-ui-number-culture", $e = "data-ui-page-culture", et = "data-ui-pager-target", tt = "data-ui-pager-page", nt = "data-ui-pager-size", rt = "data-ui-temporal-culture", it = "data-ui-empty-template", at = "data-ui-group-template", ot = "data-ui-empty-placeholder", st = "data-ui-group-header", ct = "data-ui-group-anchor", lt = "data-ui-group", ut = "data-ui-value-holder", dt = "data-ui-value-end", ft = "data-ui-value-kind", pt = "items-query", mt = "data-ui-host-mode", ht = "data-ui-host-viewport", gt = "data-ui-scroll-group", _t = "data-ui-scroll-lines", vt = "data-ui-source-line", yt = "data-ui-window-spacer", bt = "data-ui-window-pending", xt = "data-ui-window-paged", St = "data-ui-window-size", Ct = "data-ui-window-offset", wt = "data-ui-window-total", Tt = "data-ui-window-more-before", Et = "data-ui-window-more-after", Dt = "data-ui-window-group-before", Ot = "data-ui-window-aggregates", kt = "data-ui-form-id", At = "data-ui-forms", jt = "data-ui-visibility", Mt = "data-ui-collapsed", Nt = "data-ui-menu-group", Pt = "data-ui-menu-select", Ft = "data-ui-menu-open", It = "data-ui-menu-search", Lt = "data-ui-menu-searching", Rt = "data-ui-menu-unmatched", zt = "data-ui-drawer-toggle", Bt = "data-ui-drawer-open", Vt = "data-ui-bottom-bar", Ht = "data-ui-region", Ut = "data-ui-menu-item-kind", Wt = "ui-menu", y = "ui-menu-item", Gt = "ui-menu-item--checked", Kt = "ui-menu-item--selected", qt = "ui-menu--rail", Jt = `[${Ut}="header"], [${Ut}="separator"]`, Yt = `[${Nt}] > .${y}`, Xt = `${Yt}, .${y}[${Ut}="check"]`, Zt = "data-ui-shortcut", Qt = "data-ui-collapse-toggle", $t = "data-ui-folding", en = "data-ui-column-limits", tn = "data-ui-row-limits", nn = "data-ui-splitter-step", rn = "data-ui-table-column", an = "data-ui-table-hide-below", on = "data-ui-table-starts-hidden", sn = "data-ui-table-hidden", cn = "ui-table__row", ln = "ui-table__scroll", un = "ui-table__header", dn = "ui-table__resizer", fn = "ui-tree", pn = "ui-tree__row", mn = "ui-tree-node", hn = "data-ui-tree-drop", gn = "ui-tree__row--filtered", _n = "data-ui-table-last", vn = "data-ui-table-reordering", yn = "data-ui-table-dragging", bn = "data-ui-table-drop", xn = "data-ui-table-scrolled", Sn = "data-ui-table-scrollbar", Cn = "data-ui-no-row-select", wn = "data-ui-tree-parent", Tn = "data-ui-tree-children", En = "data-ui-tree-folder", Dn = "data-ui-tree-expanded", On = "data-ui-tree-title", kn = "data-ui-tree-loading", An = "data-ui-tree-drop-target", jn = "data-ui-tree-boot", Mn = "data-ui-tree-draggable", Nn = "data-ui-row-editing", Pn = "data-ui-image-source", Fn = "data-ui-file-max-size", In = "data-ui-file-pick", Ln = "data-ui-file-drop-target-id", Rn = "data-ui-theme", zn = "data-ui-theme-colors", Bn = "data-ui-words", Vn = "data-ui-language-switcher", Hn = "data-ui-language", Un = "data-ui-splitting", Wn = "data-ui-keyboard-up", Gn = "data-ui-connection", Kn = "data-ui-split-folded", qn = "data-ui-pointer-focus", Jn = "data-ui-selection", Yn = "data-ui-selected", Xn = "data-ui-selected-key", Zn = "data-ui-selected-keys", Qn = "data-ui-bind-selected-key", $n = "data-ui-tabs-selected", er = "data-ui-tab-order", tr = "data-ui-tab-caption", nr = "data-ui-tab-pinned", rr = [
	jt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], ir = "data-ui-submit-form-id", b = `[${ae}]`, ar = "data-ui-href", or = "ui-disabled", sr = "ui-loading", cr = "ui-readonly", lr = "ui-hidden", ur = "ui-dialog__surface", dr = "ui-flyout__content", fr = "data-ui-focus-holder", pr = "[role='listbox'], [role='menu'], [role='dialog']", mr = "ui-select__trigger", hr = `.${mr}`, gr = "ui-button", _r = `${gr} ui-button--ghost ui-button--small`, vr = "ui-select", yr = "ui-text-input", br = "ui-invalid", xr = "data-ui-validation-message", Sr = {
	componentId: ae,
	key: _,
	selected: Yn,
	selectedKey: Xn,
	selectedKeys: Zn,
	unselectable: ce,
	rowFocus: Ae,
	itemsHost: v,
	valueHolder: ut,
	bindValue: Ve,
	noRowOpen: pe,
	noRowDrag: me,
	eventBoundary: Ue,
	focusHolder: fr,
	tooltip: je,
	tooltipPlacement: Me,
	contextMenu: Se,
	contextMenuUse: Ce,
	actionBar: we,
	actionBarKey: Te,
	actionBarRest: Ee,
	disabledClass: or,
	loadingClass: sr,
	readOnlyClass: cr,
	hiddenClass: lr,
	buttonClass: gr,
	selectClass: vr,
	textInputClass: yr,
	invalidClass: br,
	validationMessage: xr,
	sourceLine: vt,
	popupSelector: pr,
	listTriggerSelector: hr,
	tableRowClass: cn,
	tableScrollClass: ln,
	tableHeaderClass: un,
	tableResizerClass: dn,
	tableHidden: sn,
	hostMode: mt,
	windowOffset: Ct,
	windowTotal: wt,
	windowSize: St,
	windowMoreAfter: Et,
	windowAggregates: Ot,
	itemsQuery: Ze,
	valueKind: ft,
	itemsQueryKind: pt,
	menuItemClass: y,
	menuItemKind: Ut,
	menuItemCheckedClass: Gt
};
function Cr(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function wr(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Tr = 0;
function Er(e, t) {
	return e.id.length === 0 && (Tr++, e.id = `${t}-${Tr}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Dr(e, t, n) {
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
var Or = {
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
}, kr = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(S(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${S(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(S(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (S(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(Qr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Qr(e, Zr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get($r(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(Xr(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Xr(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(ei(e, t))?.items ?? [];
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
		let t = S(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = S(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Qr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Qr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = Xr(e.eventName), n = S(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set($r(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = S(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = S(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = S(e.componentId);
		t > 0 && this.itemValuesByAddress.set(ei(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = S(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function x(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Ar(e) {
	return x(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function jr(e) {
	return e == null ? "OneWay" : x(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Mr(e) {
	return x(e, ["Property", "Event"]);
}
function Nr(e) {
	return e == null ? "SetProperty" : x(e, [
		"SetProperty",
		"Effect",
		"CopyValue"
	]);
}
function Pr(e) {
	return x(e, [
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
function Fr(e) {
	return x(e, ["Ascending", "Descending"]);
}
function Ir(e) {
	return x(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Lr(e) {
	return x(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Rr(e) {
	return typeof e == "string" ? e : x(e, [
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
function zr(e) {
	return x(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function Br(e) {
	return x(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function S(e) {
	return e ?? 0;
}
function Vr(e) {
	return typeof e == "string" ? e : "";
}
function Hr(e) {
	return x(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function Ur(e) {
	return typeof e == "string" ? e.trim() : "";
}
function Wr(e) {
	return x(e, ["Auto", "Smooth"]);
}
function Gr(e) {
	return x(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function Kr(e) {
	return x(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function qr(e) {
	return x(e, ["Light", "Dark"]);
}
function Jr(e) {
	return x(e, ["Horizontal", "Vertical"]);
}
function Yr(e) {
	return x(e, ["Polite", "Assertive"]);
}
function Xr(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Zr(e) {
	return e?.trim() ?? "";
}
function Qr(e, t) {
	return `${e}:${Zr(t)}`;
}
function $r(e, t) {
	return `${e}:${Xr(t)}`;
}
function ei(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var ti = class {
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
		return this.dom.findAllComponents(S(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = S(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = S(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${ze}${wr(r.propertyName)}="${Cr(a)}"]` : null;
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
		let n = S(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return Dr(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${wr(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function ni(e) {
	return oi(e, se);
}
function ri(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = si(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function ii(e, t) {
	let n = ni(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = ri(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function ai(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = si(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function oi(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function si(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function ci(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var li = class {
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
		let e = this.root.querySelectorAll(b), t = this.root.querySelector(`[${st}]`) !== null;
		for (let n of e) {
			let e = C(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && pi(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Er(e, t);
	}
	findComponentParts(e, t, n) {
		return ci(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(fi(t)) ?? [];
		if (n.length > 0 && n.every((e) => ii(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => ii(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = ni(n);
			if (e === 0) continue;
			let r = ri(n, e);
			if (r.length !== e) continue;
			let i = fi(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(b);
			if (e === null || !mi(this.root, e)) return null;
			let r = C(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: ri(e, ni(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function C(e) {
	return oi(e, ae);
}
function ui(e) {
	let t = e.closest(b), n = t === null ? 0 : C(t);
	return n > 0 ? n : null;
}
function di(e) {
	let t = e.closest(b), n = t === null ? 0 : C(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: ri(t, ni(t))
	};
}
function fi(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function pi(e) {
	return ni(e) === 0;
}
function mi(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function hi(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = gi(n);
	switch (_i(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : vi(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : vi(r, i) ? "many" : "other";
		case "ru":
		case "uk": return yi(r, i);
		case "pl": return bi(r, i);
		default: return "other";
	}
}
function gi(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function _i(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function vi(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function yi(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function bi(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function xi(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Si = {
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
function Ci(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Si;
	try {
		return {
			...Si,
			...JSON.parse(t)
		};
	} catch {
		return Si;
	}
}
var wi = [
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
function Ti(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Mi(e.getFullYear(), 4)}-${Mi(e.getMonth() + 1, 2)}-${Mi(e.getDate(), 2)} ${Mi(e.getHours(), 2)}:${Mi(e.getMinutes(), 2)}:${Mi(e.getSeconds(), 2)}`;
	let r = "", i = Ei(t);
	for (let a = 0; a < t.length;) {
		let o = Ai(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += ji(o, e, n, i), a += o.length;
	}
	return r;
}
function Ei(e) {
	for (let t = 0; t < e.length;) {
		let n = Ai(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
var Di = /^[-./:,]$/, Oi = /* @__PURE__ */ new Set([
	"MMMM",
	"MMM",
	"dddd",
	"ddd",
	"tt"
]);
function ki(e) {
	for (let t = 0; t < e.length;) {
		let n = Ai(e, t);
		if (n !== null && Oi.has(n) || n === null && !Di.test(e[t]) && !/\s/.test(e[t])) return !1;
		t += n?.length ?? 1;
	}
	return e.trim().length > 0;
}
function Ai(e, t) {
	for (let n of wi) if (e.startsWith(n, t)) return n;
	return null;
}
function ji(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return Mi(t.getFullYear(), 4);
		case "yy": return Mi(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Mi(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Mi(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Mi(i, 2);
		case "H": return String(i);
		case "hh": return Mi(a, 2);
		case "h": return String(a);
		case "mm": return Mi(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Mi(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Mi(e, t) {
	return String(e).padStart(t, "0");
}
var Ni = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Pi(e) {
	let t = Ni.exec(e.trim());
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
function Fi(e) {
	return Ii(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Ii(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Li = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Ri(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Ai(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += zi(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function zi(e, t) {
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
function Bi(e, t, n) {
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
		let a = Ai(t, e);
		if (a === null) {
			if (!Vi(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Hi(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? Yi(i) : null;
}
function Vi(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return Di.test(n) ? t.position >= e.length || !Di.test(e[t.position]) ? !1 : (t.position++, !0) : t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Hi(e, t, n, r) {
	switch (n) {
		case "yyyy": return Ui(t, "year", Ki(e, t, 4, 4));
		case "yy": return Ui(t, "year", Wi(Ki(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Ui(t, "month", Gi(qi(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Ui(t, "month", Ki(e, t, 1, 2));
		case "dddd":
		case "ddd": return qi(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Ui(t, "day", Ki(e, t, 1, 2));
		case "HH":
		case "H": return Ui(t, "hour", Ki(e, t, 1, 2));
		case "hh":
		case "h": return Ui(t, "hour12", Ki(e, t, 1, 2));
		case "mm":
		case "m": return Ui(t, "minute", Ki(e, t, 1, 2));
		case "ss":
		case "s": return Ui(t, "second", Ki(e, t, 1, 2));
		case "tt": return Ji(e, t, r);
		default: return !1;
	}
}
function Ui(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Wi(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function Gi(e) {
	return e === null ? null : e + 1;
}
function Ki(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function qi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function Ji(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function Yi(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Ii(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var Xi = {
	readCulture: Ci,
	format: Ti,
	parse: Pi,
	toDate: Fi
}, Zi = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, Qi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function $i(e) {
	let t = e?.trim() ?? "";
	if (!Qi.test(t)) return null;
	let n = Date.parse(Zi.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function ea(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function ta(e) {
	return e === "relative" || e === "relative-date";
}
var na = {
	...Si,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function ra(e, t, n, r) {
	if (t === "relative") return pa(e - r, n.language);
	if (t === "relative-date") {
		let t = ia(e, r);
		if (t !== null) return sa(n.language).format(t, "day");
	}
	let i = n.temporal ?? na, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : xi(i, !1);
	return Ti(new Date(e), a, i);
}
function ia(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / fa);
	return Math.abs(i) <= 1 ? i : null;
}
function aa(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(ca(t)) + e.slice(1);
}
var oa = /* @__PURE__ */ new Map();
function sa(e) {
	let t = oa.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(ca(e), { numeric: "auto" }), oa.set(e, t)), t;
}
function ca(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var la = 1e3, ua = 60 * la, da = 60 * ua, fa = 24 * da;
function pa(e, t) {
	let n = sa(t), r = Math.abs(e);
	return r < 45 * la ? n.format(0, "second") : r < 45 * ua ? n.format(Math.round(e / ua), "minute") : r < 22 * da ? n.format(Math.round(e / da), "hour") : r < 26 * fa ? n.format(Math.round(e / fa), "day") : r < 320 * fa ? n.format(Math.round(e / (30.4375 * fa)), "month") : n.format(Math.round(e / (365.25 * fa)), "year");
}
//#endregion
//#region src/runtime/words.ts
var ma = "count";
function ha(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function ga(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var _a = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function va(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && $i(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && _a.has(t.format));
}
function ya(e) {
	if (typeof e != "object" || !e) return !1;
	if (va(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (ya(t)) return !0;
	return !1;
}
function ba(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function xa(e, t, n) {
	return ha(e) ? wa(n, e.key, e.args) : ga(e) ? Sa(n, e.text) : t && typeof e == "string" ? Sa(n, e) : e;
}
function Sa(e, t) {
	return t.trim().length === 0 || !Ca(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Ca(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function wa(e, t, n) {
	let r = n?.[ma];
	return Ta(typeof r == "number" ? e.lookup(`${t}.${hi(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => ga(t) ? Sa(e, t.text) : wa(e, t.key, t.args), e.writeMoment);
}
function Ta(e, t, n, r = ba) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = Ea(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += Oa(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function Ea(e, t) {
	let n = t + 1;
	for (; n < e.length && Da(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Da(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Oa(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : ha(e) ? t === void 0 ? Ta(e.key, e.args, void 0, n) : t(e) : ga(e) ? t === void 0 ? e.text : t(e) : va(e) ? n($i(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var ka = 15e3, Aa = /* @__PURE__ */ new Set(), ja = null;
function Ma(e) {
	Aa.add(e), ja === null && (ja = setInterval(Na, ka));
}
function Na() {
	for (let e of [...Aa]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Aa.delete(e);
	}
	Aa.size === 0 && ja !== null && (clearInterval(ja), ja = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Pa = 256, Fa = 512, Ia = "script[type='application/json'][data-ui-strings]", La = "#text", Ra = `[${Bn}*='"moment"']`, za = class {
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
		let t = e.querySelector(Ia)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), wa(this, e, t);
	}
	translate(e, t) {
		return wa(this, e, t);
	}
	writeMoment = (e, t) => (ta(t) && this.noteRelative(), ra(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Ma(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return xa(e, t, this);
	}
	resolveText(e) {
		return xa(e, !0, this);
	}
	write(e, t, n, r) {
		Ga(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Ga(e, t, xa(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (ha(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = ga(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Ga(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		Ha(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Ka(e, (e) => {
			for (let n of e.querySelectorAll(t ? Ra : `[${Bn}]`)) for (let [e, r] of Object.entries(Wa(n))) {
				if (t && !ya(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && Ga(n, e === La ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return xa(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Fa || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Ca(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Pa) try {
			let a = await e(t, n.slice(r, r + Pa));
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
function Ba(e) {
	let t = !1;
	return Ka(e, (e) => {
		t ||= e.querySelector(Ra) !== null;
	}), t;
}
function Va(e, t) {
	e.hasAttribute("data-ui-words") && Ha(e, t, null);
}
function Ha(e, t, n) {
	let r = Wa(e), i = t ?? La;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(Bn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(Bn, a);
}
function Ua(e) {
	let t = Wa(e)[La];
	if (typeof t == "string") return t;
	if (!Array.isArray(t) || typeof t[0] != "string") return null;
	let n = t[1];
	return {
		key: t[0],
		args: typeof n == "object" && n ? n : null
	};
}
function Wa(e) {
	let t = e.getAttribute(Bn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Ga(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Ka(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Ka(n.content, t);
}
var w = new za();
function qa(e, t) {
	let n = ga(e) ? e.text : e;
	return w.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var Ja = `.${or}, .${sr}, [inert]`, Ya = `:scope > [${ae}]:is(${Ja}), :scope > :not([${ae}]) > [${ae}]:is(${Ja})`;
function T(e) {
	return e.closest(Ja) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function E(e) {
	return e.matches(Ja) || e.querySelector(Ya) !== null;
}
function Xa(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var Za = `[${ae}], .${cr}`;
function D(e) {
	return e.closest(Za)?.matches(`.${cr}`) === !0;
}
function Qa(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(or, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var $a = {
	isInert: T,
	isReadOnly: D,
	setDisabled: Qa
};
//#endregion
//#region src/extensions/value-readers.ts
function eo(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function to(e) {
	return e == null;
}
var no = "data-ui-trim-input", ro = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of co) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(ft);
		if (t === null) return io(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(no) ? t.trim() : t;
	}
	readHeld(e) {
		let t = oo(e);
		return t === null ? null : this.read(t);
	}
};
function io(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var ao = "input, textarea, select";
function oo(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(ao) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${ao}`);
}
function so(e) {
	return e === null ? null : Number(e);
}
var co = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute($n)
	},
	{
		kind: "tab-order",
		read: (e) => so(e.getAttribute(er))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(tr)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(nr)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(On)
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
		read: (e) => lo(e, Zn)
	},
	{
		kind: pt,
		read: (e) => lo(e, Ze)
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
	applyTabIndex: O
};
function O(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function bo(e) {
	return e.getClientRects().length > 0 && !T(e);
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
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${v}][${ht}]`) : null;
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
var ko = "data-ui-bind-selected-keys", k = `.ui-items-view, .ui-table, .${fn}`, Ao = `.ui-items-view__item, .${cn}, .${pn}`, jo = ".ui-items-view, .ui-table", Mo = {
	shift: !1,
	ctrl: !1
}, No = /* @__PURE__ */ new WeakMap();
function Po(e, t) {
	t !== null && !No.has(e) && Fo(e, t);
}
function Fo(e, t) {
	let n = j(t);
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
	return !e.hasAttribute(Cn);
}
function A(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ae}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function zo(e) {
	switch (e.getAttribute(Jn)) {
		case "one": {
			let t = e.getAttribute(Xn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(qo(Jo(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Bo(e, t) {
	let n = zo(e), r = e.getAttribute(Jn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(j(e));
		e.toggleAttribute(Yn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Vo(e) {
	return e.filter((e) => e.hasAttribute(Yn));
}
function Ho(e, t, n, r) {
	let i = j(n);
	if (!Go(n)) return !1;
	switch (e.getAttribute(Jn)) {
		case "one": return Oo(e, i, {
			attribute: Xn,
			bindingAttribute: Qn,
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
		let r = Ko(t, t.find((t) => j(t) === No.get(e)) ?? n, n).map(j);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], No.set(e, r)) : (s = [r], No.set(e, r));
	Wo(e, t, s);
}
function Wo(e, t, n) {
	let r = Jo(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(Zn, i), Bo(e, t), r.hasAttribute(ko) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Go(e) {
	return j(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !E(e);
}
function Ko(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => A(e) !== null && Go(e));
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
	let t = e.closest(b);
	for (let n of e.querySelectorAll(`[${v}]`)) if (n.closest(k) === e && n.closest(b) === t) return n;
	return null;
}
function j(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var Yo = {
	isSelected: (e) => e.hasAttribute(Yn),
	toggle: Xo,
	setSelected: Zo,
	setSelectedKeys: Qo
};
function Xo(e) {
	let t = e.closest(k);
	t !== null && e instanceof HTMLElement && Ho(t, $o(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Zo(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(j(e));
	Qo(e, r, n);
}
function Qo(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = $o(e), i = new Set(r.filter((e) => !Go(e)).map(j)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...zo(e)].filter((e) => !a.has(e));
	Wo(e, r, n ? [...o, ...a] : o);
}
function $o(e) {
	return [...e.querySelectorAll(Ao)].filter((t) => t.closest(k) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function es(e) {
	let t = e.closest(k);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Ao);
	return n !== null && n.closest(k) === t ? {
		root: t,
		row: n
	} : null;
}
function ts(e) {
	return e.filter((e) => A(e) !== null && !E(e));
}
function ns(e) {
	return rs(e) ?? ts(e)[0] ?? null;
}
function rs(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !E(e)) ?? null;
}
function is(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Er(t, "ui-row-name"));
}
function as(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Ae);
	n.setAttribute(Ae, ""), e.setAttribute("aria-activedescendant", Er(n, "ui-row")), (A(n) ?? n).scrollIntoView({ block: "nearest" });
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
	let a = i.map((e) => A(e) ?? e), o = _o({
		key: e,
		items: a,
		current: n === null ? null : A(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ls(e, t, n) {
	let r = t === null ? -1 : e.indexOf(t), i = r < 0 ? null : e[r].parentElement;
	if (i === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let a = (A(e[r]) ?? e[r]).getBoundingClientRect(), o = Math.min(To(i).height, window.innerHeight), s = n ? 1 : -1, c = null;
	for (let t = r + s; t >= 0 && t < e.length; t += s) {
		let r = (A(e[t]) ?? e[t]).getBoundingClientRect();
		if (c !== null && (n ? r.bottom > a.top + o + .5 : r.top < a.bottom - o - .5)) break;
		c = e[t];
	}
	return c;
}
function us(e, t, n) {
	let r = t === null ? null : A(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = ds(i), o = e.map((e) => ({
		row: e,
		rect: (A(e) ?? e).getBoundingClientRect()
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
	let r = n.hasAttribute(Ae), i = n.contains(document.activeElement);
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
		e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(qn, t);
	}
}
function M(e) {
	e.focus({ preventScroll: !0 });
}
function As(e) {
	ks(e, !0), e.focus({ preventScroll: !0 });
}
function js(e) {
	for (let t of e.querySelectorAll(hs)) if (Xa(t)) return t;
	return null;
}
var Ms = {
	first: js,
	stops: (e) => Ns(e, document.activeElement)
};
function Ns(e, t) {
	let n = [...e.querySelectorAll(hs)].filter((e) => e === t || e.tabIndex >= 0 && Xa(e)), r = /* @__PURE__ */ new Map();
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
var Rs = `.${ur}, .${dr}, [${fr}]`;
function zs(e) {
	let t = es(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Rs)) && n.hasAttribute("tabindex") && Xa(n)) return n;
	return null;
}
function Bs(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? js(e);
	return _s ? xs.add(e) : xs.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), M(r ?? e), n;
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
		O(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), M(e);
		return;
	}
	let r = t.filter(bo), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (O(t, i), M(i));
}
function Ws(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Gs(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${hs}, [tabindex]`) && Xa(e)) return e;
	return n === null ? null : Ks(n);
}
function Gs(e, t) {
	for (let n = e.closest(b); n !== null; n = n.parentElement?.closest(b) ?? null) {
		let e = t.querySelectorAll(`[${ae}="${n.getAttribute(ae)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Ks(e) {
	for (let t = e.closest(b); t !== null; t = t.parentElement?.closest(b) ?? null) if (Xa(t)) return qs(t), t;
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
	e == null || !t.contains(n) || (Ys(n, t) && ks(e, !Ts(e)), M(e));
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
	let t = jr(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function ec(e) {
	return jr(e) === "OnSubmit";
}
function tc(e, t) {
	let n = e.getAttribute(Ve);
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
		let n = t.closest(b), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || rc(r) || (uo(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), mo(r) && document.activeElement !== r && M(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (D(e.target) || T(e.target))) return;
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
	let n = e.closest(`[${Ue}]`);
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
		let n = Xr(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = Xr(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(Xr(e));
	}
	markAttached(e) {
		let t = Xr(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, sc = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: S(t.metadata.eventId),
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
		if (r.domEvent.target instanceof Element && T(r.domEvent.target)) return cc;
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
		return n.hasAttribute(He(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
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
var vc = `.${ur}, .${dr}`;
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
	return r !== null && M(r), r;
}
function xc(e) {
	return e.checkVisibility({ visibilityProperty: !0 });
}
function Sc(e) {
	let t = Ns(e.closest(vc) ?? document, null).filter((t) => !e.contains(t)), n = t.find((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0), r = t.filter((t) => (e.compareDocumentPosition(t) & Node.DOCUMENT_POSITION_PRECEDING) !== 0);
	return n ?? r[r.length - 1] ?? null;
}
function Cc() {
	let e = document.querySelector(`[${Ht}="content"]`);
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
		else r = this.index.getPropertyInteractions(S(n.binding.componentId), n.binding.propertyId);
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
			for (let e of t.interactions) Nr(e.actionKind) === "CopyValue" && Oc(e.target) && this.writeTarget(e.target, t.dynamicParameters, Tc(e, n), !0);
		}
		this.moved.clear();
	};
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: S(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(S(e.reference.componentId), e.reference.propertyId), n = t.length > 0 ? Dc(e.reference, e.dynamicParameters) : null;
		n !== null && this.heard.has(n) && this.heard.set(n, e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		let i = Nr(e.actionKind);
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
	let i = S(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && ii(s, o)) return a === 0 ? e : {
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
		S(e?.componentId),
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
	switch (Pr(t)) {
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
	return ha(e) ? e.key : ga(e) ? e.text : e;
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
		return this.eventNames.has(Xr(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Bc(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(Xr(e))?.has(t) === !0;
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
			let t = S(e.sourceEvent?.componentId), n = Xr(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Vc(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Vc(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (zc(e)) {
			let t = S(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Hc(t, n));
				r === void 0 && (r = [], this.propertyInteractions.set(Hc(t, n), r)), r.push(e), Nr(e.actionKind) === "CopyValue" && (this.copiesValues = !0);
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
	return Mr(e.sourceKind) === "Event";
}
function zc(e) {
	return Mr(e.sourceKind) === "Property";
}
function Bc(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Vc(e, t) {
	return `${e}:${Xr(t)}`;
}
function Hc(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var N = {
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
	}, N.fast));
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
	let h = n.alignEntries === !0 ? Dl(t, m) : El, g = kl(c, s, u, m, l, h), ee = Al(c, s, u, m, l, h);
	n.arrow === !0 && (Sl(m) ? ee = hl(ee, s.left + s.width / 2, u.width) : g = hl(g, s.top + s.height / 2, u.height));
	let te = Ml();
	g = te.top + Il(g - te.top, u.height, te.bottom - te.top), ee = Il(ee, u.width, window.innerWidth), t.style.top = `${g}px`, t.style.left = `${ee}px`, t.dataset.uiPlacement !== m && (t.dataset.uiPlacement = m), gl(t, s, u, m, g, ee);
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
	let t = document.querySelector(`[${Vt}]`);
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
function P(e, t, n, r) {
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
//#region src/interactions/inline-rename.ts
var Jl = "data-ui-rename-field";
function Yl(e) {
	return e instanceof Element && e.closest(`[${Jl}]`) !== null;
}
function Xl(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(Jl, ""), r.setAttribute(Ue, ""), r.value = e.value, Zl(r, n, t);
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
function Zl(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = Ql(n), s = o > 0 && i.width > 0 ? i.width / o : 1;
	e.style.left = $l((r.left - i.left) / s - n.clientLeft), e.style.top = $l((r.top - i.top) / s - n.clientTop), e.style.width = $l(r.width / s), e.style.height = $l(r.height / s), e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing, e.style.textAlign = a.textAlign;
}
function Ql(e) {
	let t = getComputedStyle(e), n = parseFloat(t.width);
	return Number.isFinite(n) ? t.boxSizing === "border-box" ? n : n + parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth) : e.offsetWidth;
}
function $l(e) {
	return `${Math.round(e * 64) / 64}px`;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var eu = /* @__PURE__ */ new Set(), tu = /* @__PURE__ */ new Map(), nu = 0, ru = !1;
function iu() {
	ru || (ru = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || Yl(e.target) || su() && e.preventDefault();
	}, !0));
}
function au() {
	for (let e of eu) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function ou(e) {
	for (let t of eu) t.hearRefusedClick(e);
}
function su() {
	let e = [];
	for (let t of eu) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...tu.keys()]) t.has(e) || tu.delete(e);
	for (let { popup: t } of e) tu.has(t) || tu.set(t, ++nu);
	let n = cu(e, (e) => tu.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function cu(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var lu = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), eu.add(this), iu();
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
function uu(e, t) {
	return e.isConnected && !T(e) && !(t && D(e));
}
var du = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new lu({
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
		!(e.target instanceof Node) || Ds() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : fu(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, hu(t)) && !ql(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = zs(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && uu(n.owner, this.closesWhenReadOnly) && !ql(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !uu(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), gu(e), _u(e, !0), bu(this), e.focus !== void 0 && e.focus !== !1 && Bs(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && gu(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Js(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), _u(r, !1), ul(r.popup), this.entries.size === 0 && xu(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (uu(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !pu() && mu(e);
		}
	}
};
function fu(e) {
	return e instanceof Element && e.isConnected && Xa(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function pu() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && Xa(e);
}
function mu(e) {
	qs(e), M(e);
}
function hu(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function gu(e) {
	e.anchor !== void 0 && e.placement !== void 0 && rl(e.anchor, e.popup, e.placement);
}
function _u(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var vu = /* @__PURE__ */ new Set(), yu = null;
function bu(e) {
	vu.add(e), yu === null && typeof MutationObserver == "function" && (yu = new MutationObserver(() => {
		for (let e of [...vu]) e.closeStranded();
	}), yu.observe(document, {
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
function xu(e) {
	vu.delete(e), !(vu.size > 0 || yu === null) && (yu.disconnect(), yu = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Su = "ui-flyout", Cu = "ui-flyout--open", wu = "ui-flyout__anchor", Tu = "data-ui-flyout-no-backdrop-close", Eu = "data-ui-flyout-no-escape-close", Du = `${Su}--`, Ou = "bottom-start", ku = class {
	root;
	flyouts = new du({
		show: ({ owner: e }) => e.classList.add(Cu),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Eu : Tu)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Su}`)) this.place(e);
		P(this.root, `.${Su}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${dr}`), n = e.querySelector(`:scope > .${wu}`);
		if (t === null) return;
		let r = Au(n, t);
		if (!e.classList.contains(Cu)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Mu(n) ?? e,
			placement: { placement: Nu(e) },
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Cu) && (e.classList.remove(Cu), ju(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wu}`)?.closest(`.${Su}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Cu), this.place(t), this.flyouts.isOpen(t) && ju(t, !0);
		}
	}
};
function Au(e, t) {
	if (e === null) return null;
	let n = e.querySelector(hs) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Er(t, "ui-flyout-content")), n;
}
function ju(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Mu(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Nu(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Du)) continue;
		let e = t.slice(Du.length);
		if (Kc(e)) return e;
	}
	return Ou;
}
//#endregion
//#region src/interactions/file-drop.ts
var Pu = "data-ui-file-drop-over", Fu = 120, Iu = "refused", Lu = !1;
function Ru(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Hu();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => zu(e, t, n), !0);
	e.root.addEventListener("dragend", () => Ju(t.marked), !0), window.addEventListener("blur", () => Ju(t.marked)), e.root.addEventListener("paste", (t) => Bu(e, t), !0);
}
function zu(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Ju(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Uu(n), n.type !== "dragleave" && Ju(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || qu(r, a) : t.leaving = window.setTimeout(() => Ju(r), Fu);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Wu(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && qu(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : Pu;
		r.set(a, o), a.setAttribute(o, t ? Iu : "");
		return;
	}
	Ju(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Yu(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Bu(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Yu(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function Vu(e, t, n) {
	for (let r = t.closest(`[${ae}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${Ln}="${Cr(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Hu() {
	if (!Lu) {
		Lu = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Uu(e);
		});
	}
}
function Uu(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Wu(e, t) {
	let n = Gu(e);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => Ku(t, e)));
}
function Gu(e) {
	return e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
}
function Ku(e, t) {
	return e.endsWith("/*") ? t.startsWith(e.slice(0, -1)) : t === e;
}
function qu(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function Ju(e) {
	for (let t of [...e.keys()]) qu(e, t);
}
function Yu(e, t) {
	let n = Gu(e);
	if (n.length === 0) return !0;
	let r = t.name.toLowerCase(), i = t.type.toLowerCase();
	return n.some((e) => e.startsWith(".") ? r.endsWith(e) : Ku(e, i));
}
//#endregion
//#region src/interactions/file-upload.ts
var Xu = "/_ne/files/upload", Zu = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], Qu = /* @__PURE__ */ new Map(), $u = !1;
function ed(e, t, n, r) {
	let i = Number(e.getAttribute(Fn)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return Qu.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	for (let e of Qu.keys()) e.isConnected || Qu.delete(e);
	return Qu.set(e, c), td(e, c), rd(), a;
}
function td(e, t) {
	let n = nd(t.limit, w.language);
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
function nd(e, t) {
	let n = e, r = "byte";
	for (let e of Zu) {
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
function rd() {
	$u || ($u = !0, w.onChange(() => {
		for (let [e, t] of Qu) e.isConnected ? td(e, t) : Qu.delete(e);
	}));
}
function id(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Xu), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var ad = () => {};
function od(e) {
	return {
		uploadAsync: (e, t) => id(e, t ?? ad),
		accepts: Yu,
		takeWithinSizeLimit: (t, n, r) => ed(t, n, r, e)
	};
}
function sd(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var cd = "ui-open-picker";
function ld(e) {
	return !e.dispatchEvent(new Event(cd, {
		bubbles: !0,
		cancelable: !0
	}));
}
function ud(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || D(n) || T(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var dd = "ui-file-input", fd = "ui-file-input__row", pd = "ui-file-input__native", md = "ui-file-input__field", hd = "ui-file-input__selection", gd = "data-ui-file-dragging", _d = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, w.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(cd, (e) => ud(e, {
			rootSelector: `.${dd}`,
			nativeSelector: `.${pd}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Ru({
			root: this.root,
			draggingAttribute: gd,
			resolveTarget: (e) => {
				let t = e.closest(`.${fd}`)?.closest(`.${dd}`) ?? null, n = t === null ? Vu(this.root, e, `.${dd}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${pd}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || D(r) || T(r)
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
		let t = e.target.closest(`[${In}], .${fd}`);
		if (t === null || T(t) || D(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${dd}`)?.querySelector(`.${pd}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(pd)) return;
		let t = e.target.closest(`.${dd}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${md}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = ed(e, t, e.querySelector(`.${pd}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await id(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => w.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, vd(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => w.text("ui.file.failed")), this.publishSelection(e, "");
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
		sd(e.querySelector(`.${hd}`), t);
	}
};
function vd(e) {
	return e.length === 1 ? e[0].name : () => w.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var yd = "ne-picture-as-pdf", bd = "ne-text-snippet", xd = "ne-description", Sd = "ne-table-chart", Cd = "ne-slideshow", wd = "ne-folder-zip", Td = "ne-audio-file", Ed = "ne-video-file", Dd = "ne-image", Od = "ne-code", kd = "ne-draft", Ad = new Map([
	...Pd(yd, "pdf"),
	...Pd(bd, "txt", "md", "log"),
	...Pd(xd, "doc", "docx", "odt", "rtf"),
	...Pd(Sd, "xls", "xlsx", "ods", "csv", "tsv"),
	...Pd(Cd, "ppt", "pptx", "odp", "key"),
	...Pd(wd, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Pd(Td, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Pd(Ed, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Pd(Dd, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Pd(Od, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), jd = /* @__PURE__ */ new Map([
	["application/pdf", yd],
	["text/csv", Sd],
	["application/msword", xd],
	["application/rtf", xd],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", xd],
	["application/vnd.oasis.opendocument.text", xd],
	["application/vnd.ms-excel", Sd],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Sd],
	["application/vnd.oasis.opendocument.spreadsheet", Sd],
	["application/vnd.ms-powerpoint", Cd],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Cd],
	["application/vnd.oasis.opendocument.presentation", Cd],
	["application/zip", wd],
	["application/x-zip-compressed", wd],
	["application/x-7z-compressed", wd],
	["application/vnd.rar", wd],
	["application/x-rar-compressed", wd],
	["application/x-tar", wd],
	["application/gzip", wd],
	["application/json", Od],
	["application/xml", Od],
	["text/xml", Od],
	["text/html", Od]
]), Md = /* @__PURE__ */ new Map([
	["image", Dd],
	["audio", Td],
	["video", Ed],
	["text", bd]
]);
function Nd(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : Ad.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return jd.get(i) ?? (a < 0 ? void 0 : Md.get(i.slice(0, a))) ?? kd;
}
function Pd(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Fd = [
	"http",
	"https",
	"mailto",
	"tel"
];
function Id(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Fd.includes(t.slice(0, n).toLowerCase());
}
function Ld(e) {
	return Id(e) ? String(e) : void 0;
}
var Rd = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function zd(e) {
	let t = Ud(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Rd.some((e) => n.startsWith(e));
}
function Bd(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f-\x9f]/.test(e) ? !1 : e === "/" || Vd(e);
}
function Vd(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Hd(e) {
	return e.length > 0 && e[0] !== "/" && e[0] !== "\\" && !/^[A-Za-z][A-Za-z\d+.-]*:/.test(e);
}
function Ud(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function Wd(e) {
	return Gd(e) !== null;
}
function Gd(e) {
	let t = Ud(e), n = t.toLowerCase();
	return Vd(t) || Hd(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Kd(e) {
	return Gd(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var qd = "mask:", Jd = "ui-icon--image", Yd = "ui-icon--mask";
function Xd(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(qd) && (n = !0, t = t.slice(5).trim());
	let r = t.includes("/") ? Gd(t) : null;
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Zd(e) {
	let t = Xd(e);
	return t === null ? "" : Qd(t.source);
}
function Qd(e) {
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
var $d = "ui-icon", ef = "data-ui-icon", tf = "--ui-icon-url";
function nf(e, t) {
	e.classList.add($d);
	for (let t of Array.from(e.classList)) af(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty(tf);
	let n = of(t);
	if (n.length === 0) {
		e.removeAttribute(ef);
		return;
	}
	e.setAttribute(ef, ""), e.classList.add(n);
	let r = Xd(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty(tf, Qd(r.source));
}
var rf = "ui-icon-glyph--";
function af(e) {
	return e === Jd || e === Yd || e.startsWith(rf);
}
function of(e) {
	let t = Xd(e);
	return t === null ? sf(e) : t.tinted ? Yd : Jd;
}
function sf(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = rf;
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
var cf = 1024, lf = 16777216;
function uf(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function df(e, t) {
	let n = xf(t.zoom, 1, 4), r = bf(e) / n / 2;
	return {
		x: xf(t.x, r, e.width - r),
		y: xf(t.y, r, e.height - r),
		zoom: n
	};
}
function ff(e, t) {
	let n = bf(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function pf(e, t, n) {
	return t.zoom * n / bf(e);
}
function mf(e, t, n, r, i) {
	let a = pf(e, t, n);
	return a > 0 ? df(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function hf(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = xf(t.zoom * r, 1, 4), o = pf(e, t, n), s = pf(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? df(e, {
		...t,
		zoom: a
	}) : df(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function gf(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function _f(e, t) {
	return Math.min(1, t * 4 / bf(e), Math.sqrt(lf / (e.width * e.height)));
}
function vf(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function yf(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function bf(e) {
	return Math.min(e.width, e.height);
}
function xf(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/page-dialog.ts
function Sf(e) {
	let t = document.createElement("div");
	t.className = `ui-dialog ${e.className}`, t.setAttribute(Bl, e.key), t.setAttribute(Vl, ""), e.closesOnEscapeAndBackdrop && (t.setAttribute(Wl, ""), t.setAttribute(Ul, "")), t.setAttribute("hidden", "");
	let n = document.createElement("div");
	n.className = "ui-dialog__backdrop", n.setAttribute(Hl, "");
	let r = document.createElement("div");
	return r.className = e.surfaceClassName === void 0 ? ur : `${ur} ${e.surfaceClassName}`, r.setAttribute("role", e.role), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", e.labelledBy), e.describedBy !== void 0 && r.setAttribute("aria-describedby", e.describedBy), t.append(n, r), {
		dialog: t,
		surface: r
	};
}
var Cf = class {
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
}, wf = class {
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
		if (t === null || T(t)) return;
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, Tf(r, i, t.point, t.second.point));
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
function Tf(e, t, n, r) {
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
var Ef = 100 / 3, Df = 1, Of = 2;
function kf(e, t = Ef) {
	let n = e.deltaMode === Df ? Ef : e.deltaMode === Of ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function Af(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var jf = {
	notch: 100,
	pixels: kf
}, Mf = "ui-image-crop", Nf = "ui-image-crop-title", Pf = new Cf("data-ui-image-crop-part"), Ff = "data-ui-image-crop-frame", If = 10, Lf = 1.2, Rf = 380, zf = 100, Bf = .92, F = null, Vf = !1, Hf = null, Uf = !1;
async function Wf(e, t, n, r = np) {
	if (F !== null || Vf) return "cancelled";
	Vf = !0;
	let i;
	try {
		i = await r.decodeAsync(t, n.size);
	} finally {
		Vf = !1;
	}
	if (i === null) return "unreadable";
	let a = i;
	return new Promise((i) => {
		Hf ??= Gf();
		let o = Hf;
		o.dialog.isConnected || document.body.append(o.dialog), F = {
			file: t,
			source: a,
			request: n,
			imaging: r,
			view: uf(a),
			finish: (t) => {
				F = null, e.close(Mf), a.release(), i(t);
			}
		}, w.write(o.title, null, "ui.crop.title"), w.write(o.stage, "aria-label", "ui.crop.frame"), w.write(o.zoom, "aria-label", "ui.crop.zoom"), w.write(o.cancel, null, "ui.crop.cancel"), w.write(o.apply, null, "ui.crop.apply"), o.stage.setAttribute(Ff, n.frame), e.open(Mf), ep(o);
	});
}
function Gf() {
	let { dialog: e, surface: t } = Sf({
		key: Mf,
		className: "ui-image-crop",
		surfaceClassName: "ui-image-crop__surface",
		role: "dialog",
		labelledBy: Nf,
		closesOnEscapeAndBackdrop: !1
	}), n = Pf.element("h2", "ui-image-crop__title ui-text-type--subtitle");
	n.id = Nf;
	let r = Pf.element("div", "ui-image-crop__stage", "stage");
	r.setAttribute("tabindex", "0"), r.setAttribute("role", "group");
	let i = Pf.element("canvas", "ui-image-crop__canvas"), a = Pf.element("span", "ui-image-crop__frame");
	i.setAttribute("aria-hidden", "true"), a.setAttribute("aria-hidden", "true"), r.append(i, a);
	let o = Pf.element("input", "ui-image-crop__zoom", "zoom");
	o.type = "range", o.min = "1", o.max = "4", o.step = "0.01";
	let s = Pf.button("ui-button--outline", "cancel"), c = Pf.button("ui-button--primary", "apply");
	t.append(n, r, o, Pf.actions(s, c));
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
		let t = Pf.pressed(e);
		t === "cancel" ? F?.finish("cancelled") : t === "apply" && Kf();
	}), e.addEventListener("keydown", (e) => qf(l, e)), o.addEventListener("input", () => Qf(l, Number(o.value))), r.addEventListener("wheel", (e) => Jf(l, e), { passive: !1 }), window.addEventListener("resize", () => tp(l)), new wf({
		root: e,
		resolveHandle: (e) => r.contains(e) ? r : null,
		begin: (e, t) => F === null ? null : {
			last: t,
			start: F.view
		},
		move: (e, t, n) => {
			e.last !== null && Yf(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		cancel: (e, t) => {
			F !== null && (F.view = t.start, ep(l));
		},
		pinch: (e, t) => {
			e.last = null, Xf(l, t);
		}
	}), l;
}
async function Kf() {
	let e = F;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = ff(n, a), s = vf(t.type), c = i.encodeAsync(n, o, gf(o, r.size), s);
	F = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], yf(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function qf(e, t) {
	if (t.defaultPrevented || t.isComposing || F === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), F.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : If;
	switch (t.key) {
		case "ArrowLeft":
			Yf(e, -n, 0);
			break;
		case "ArrowRight":
			Yf(e, n, 0);
			break;
		case "ArrowUp":
			Yf(e, 0, -n);
			break;
		case "ArrowDown":
			Yf(e, 0, n);
			break;
		case "+":
		case "=":
			Zf(e, Lf);
			break;
		case "-":
		case "_":
			Zf(e, 1 / Lf);
			break;
		case "Enter":
			Kf();
			break;
		default: return;
	}
	t.preventDefault();
}
function Jf(e, t) {
	if (F === null) return;
	t.preventDefault();
	let n = kf(t, e.stage.clientHeight), r = t.ctrlKey ? zf : Rf;
	Zf(e, 2 ** (-n.y / r), $f(e, t.clientX, t.clientY));
}
function Yf(e, t, n) {
	F !== null && (F.view = mf(F.source, F.view, e.frame.clientWidth, t, n), ep(e));
}
function Xf(e, t) {
	if (F === null) return;
	let n = mf(F.source, F.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	F.view = hf(F.source, n, e.frame.clientWidth, t.factor, $f(e, t.center.x, t.center.y)), ep(e);
}
function Zf(e, t, n) {
	F !== null && (F.view = hf(F.source, F.view, e.frame.clientWidth, t, n), ep(e));
}
function Qf(e, t) {
	F !== null && Number.isFinite(t) && t > 0 && Zf(e, t / F.view.zoom);
}
function $f(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function ep(e) {
	if (F === null) return;
	let t = F.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), tp(e);
}
function tp(e) {
	Uf || F === null || (Uf = !0, requestAnimationFrame(() => {
		if (Uf = !1, F === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = F.view, a = pf(F.source, i, t);
		F.imaging.paint(e.canvas, F.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: F.source.width * a,
			height: F.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
var np = {
	decodeAsync: async (e, t) => {
		let n = await rp(e);
		if (n === null) return null;
		let r = n, i = _f(r, t);
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
		}, r, Bf);
	})
};
async function rp(e) {
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
var ip = "ui-image-input", ap = "ui-image-input--multiple", op = "ui-image-input__surface", sp = "ui-image-input__native", cp = "ui-image-input__picture", lp = "ui-image-input__text", up = "ui-image-input__selection", dp = "ui-image-input__selections", fp = "ui-image-input__tiles", pp = "ui-image-input__tile", mp = "ui-image-input__remove", hp = "ui-image-input__progress", gp = "ui-image-input__tile--file", _p = "ui-image-input__file-glyph", vp = "ui-image-input__file-name", yp = "SelectionId", bp = "--ui-image-progress", xp = "data-ui-image-preview", Sp = "data-ui-image-dragging", Cp = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${ip}`)), P(this.root, `.${ip}`, {
			childList: !0,
			attributeFilter: [
				Pn,
				We,
				Zn
			]
		}, (e) => this.applyAll(e)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === yp && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(ci(e.components, `.${ip}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(cd, (e) => ud(e, {
			rootSelector: `.${ip}`,
			nativeSelector: `.${sp}`,
			pressed: (e) => e.querySelector(`.${op}`)
		})), this.root.addEventListener(ho, (e) => this.handleDraftDropped(e)), Ru({
			root: this.root,
			draggingAttribute: Sp,
			resolveTarget: (e) => {
				let t = e.closest(`.${op}`), n = t?.closest(`.${ip}`) ?? null, r = n === null ? Vu(this.root, e, `.${ip}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${op}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${sp}`)?.getAttribute("accept") ?? "",
					multiple: wp(i),
					refused: D(i) || T(a)
				};
			},
			onFiles: (e, t) => void (wp(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) wp(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${cp}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || kp(e, e.getAttribute("data-ui-image-caption") ?? Mp(n)), jp(e, n.length > 0);
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
	clearAll(e) {
		for (let t of e) wp(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${In}]`), n = t?.closest(`.${ip}`) ?? null;
		t === null || n === null || D(n) || T(t) || n.querySelector(`.${sp}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${mp}`), n = t?.closest(`.${ip}`) ?? null;
		if (t === null || n === null || D(n) || T(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(sp)) return;
		let t = e.target.closest(`.${ip}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (wp(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${ip}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), sd(t.querySelector(`.${up}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${op}`), r = e.querySelector(`.${cp}`), i = e.querySelector(`.${up}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || ed(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(xp, ""), r.setAttribute("src", o.url), kp(e, a.name), jp(e, !0), n.classList.add(sr);
		try {
			let t = await id([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, sd(i, t.selectionId));
		} catch (t) {
			Ap(e), sd(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(sr);
		}
	}
	async cropAsync(e, t) {
		let n = Tp(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Wf(this.dialogs, t, {
				frame: n,
				size: Ep(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${fp}`), r = ed(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = Dp(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await id([t], (e) => r.element.style.setProperty(bp, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(sr), this.publishShelf(e);
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
		let t = e.querySelector(`.${dp}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(Zn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(xp), t || kp(e, ""));
	}
};
function wp(e) {
	return e.classList.contains(ap);
}
function Tp(e) {
	let t = e.getAttribute(Ge);
	return t === "square" || t === "circle" ? t : null;
}
function Ep(e) {
	let t = Number(e.getAttribute(Ke));
	return Number.isInteger(t) && t > 0 ? t : cf;
}
function Dp(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${pp} ${sr}`, n.type = "button", n.className = mp, r.className = hp, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, w.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Op(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Op(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Op(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(gp), e.setAttribute("title", n.name), r.className = _p, r.setAttribute("aria-hidden", "true"), nf(r, Nd(n.name, n.type)), i.className = vp, i.textContent = n.name, w.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function kp(e, t) {
	let n = e.querySelector(`.${lp}`);
	n !== null && (Va(n, null), n.textContent !== t && (n.textContent = t));
}
function Ap(e) {
	let t = e.querySelector(`.${lp}`);
	t !== null && w.write(t, null, "ui.file.failed");
}
function jp(e, t) {
	let n = e.querySelector(`.${op}`);
	n !== null && w.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function Mp(e) {
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
var Np = "ui-key-value-action__row", Pp = "ui-key-value-action__value", Fp = "ui-key-value-action__value-input", Ip = "ui-key-value-action__edit-action", Lp = "ui-text__title", Rp = "ui-row-form-", zp = class {
	options;
	root;
	openRows = /* @__PURE__ */ new WeakSet();
	closedRows = /* @__PURE__ */ new WeakSet();
	rowForms = /* @__PURE__ */ new WeakMap();
	formCount = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Np}`), !1), P(this.root, `.${Np}`, {
			childList: !0,
			attributeFilter: [Nn]
		}, (e) => this.handleRows(e, !0)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && Hp(e.target) && e.preventDefault();
		}, !0), (this.root === document ? window : this.root).addEventListener("change", (e) => Vp(e), !0);
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
		let t = e.querySelector(`.${Ip} button`);
		if (t === null) return;
		let n = this.rowForms.get(e);
		n === void 0 && (n = `${Rp}${++this.formCount}`, this.rowForms.set(e, n));
		for (let t of e.querySelectorAll(`.${Fp} [${Ve}]:not([${kt}])`)) t.setAttribute(kt, n);
		t.setAttribute(ir, n);
	}
	leaveForm(e) {
		let t = this.rowForms.get(e);
		if (t !== void 0) for (let n of e.querySelectorAll(`[${kt}="${t}"], [${ir}="${t}"]`)) n.removeAttribute(kt), n.removeAttribute(ir);
	}
	close(e) {
		this.leaveForm(e);
		for (let t of e.querySelectorAll(`.${Fp} [${Ve}]`)) {
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
		let t = Bp(e);
		for (let n of e.querySelectorAll(`.${Fp} [${Ve}]`)) this.options.validation.judgeShown(n, mo(n) && n.value.length === 0 ? t : null);
	}
	open(e, t) {
		let n = e.querySelector(`.${Fp} :is(input, textarea, select)`);
		if (n !== null) {
			if (mo(n) && n.value.length === 0 && n.hasAttribute("data-ui-bind-value")) {
				let t = Bp(e);
				t.length > 0 && (n.value = t, n.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t && (n.focus({ preventScroll: !0 }), po(n) && n.select());
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Wp(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Ip)) return;
		let { cell: n, row: r } = t, i = e.target.closest(pr), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Ip} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !T(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && (e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.focus({ preventScroll: !0 })), s.click()));
	}
};
function Bp(e) {
	return e.querySelector(`.${Pp} .${Lp}`)?.textContent?.trim() ?? "";
}
function Vp(e) {
	if (!e.isTrusted || !(e.target instanceof Element)) return;
	let t = e.target.closest(`.${Fp}`)?.closest(`.${Np}`) ?? null;
	t !== null && !t.hasAttribute("data-ui-row-editing") && e.stopImmediatePropagation();
}
function Hp(e) {
	let t = e.closest(`.${Ip} button`), n = t?.closest(`.${Ip}`)?.querySelectorAll("button");
	return t !== null && n !== void 0 && n[n.length - 1] === t;
}
function Up(e) {
	return Wp(e) !== null;
}
function Wp(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Fp}, .${Ip}`), n = t?.closest(`.${Np}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Gp = `.ui-button[${ft}="pressed"]`, Kp = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Gp);
		t === null || T(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, qp = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${mr}, .ui-field-box`, Jp = "button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true']", Yp = `${Jp}, ${qp}, ${pr}, .${ve}`, Xp = "button, a, summary, [role='button']";
function Zp(e) {
	let t = [];
	for (let n of e.querySelectorAll(Yp)) if (!(n.classList.contains("ui-row__grip") || !em(e, n) || $p(e, n) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	let n = t[0];
	return n instanceof HTMLElement && n.matches(Xp) ? n : null;
}
function Qp(e) {
	let t = [];
	for (let n of e.querySelectorAll(Jp)) $p(e, n) && em(e, n) && t.push(n);
	return t;
}
function $p(e, t) {
	let n = t.closest(`[${pe}]`);
	return n !== null && n !== e && e.contains(n);
}
function em(e, t) {
	let n = t.closest(pr);
	return (n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null;
}
function tm(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Yp);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var nm = `${Jp}, [tabindex], [contenteditable], ${pr}, [${Ue}]`, rm = ":scope > input.ui-field, :scope > textarea.ui-field", im = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(qp);
		if (t === null || e.target !== t && e.target.closest(nm) !== null) return;
		let n = t.querySelector(rm);
		if (!mo(n) || n.readOnly || T(n) || D(n) || (e.preventDefault(), n.focus({ preventScroll: !0 }), n.selectionStart === null)) return;
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function I(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var am = "data-ui-submit-on-enter", om = "data-ui-runs-on-enter", sm = "enter", cm = 229, lm = {
	name: sm,
	registration: { settlesValue: !0 }
}, um = "ui-commit-in-place", dm = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), this.root.addEventListener(um, (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && this.commitInPlace(e.target);
		});
	}
	handleKeydown(e) {
		if (e.defaultPrevented || fm(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : pm(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : mm(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (po(t)) {
			if (e.preventDefault(), pm(t, e)) {
				this.runEnter(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || T(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(sm, { bubbles: !0 })));
	}
	submitForm(e) {
		let t = e.getAttribute(kt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${ir}="${Cr(t)}"]`);
		n !== null && !T(n) && n.click();
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
		r?.root === t && r.row !== null && as(t, I(t, Ao, k), r.row), M(t);
	}
};
function fm(e) {
	return e.isComposing || e.keyCode === cm;
}
function pm(e, t) {
	return hm(t) && e.hasAttribute(om);
}
function mm(e, t) {
	return hm(t) && e.hasAttribute(am) && !e.readOnly && !T(e);
}
function hm(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var gm = `img.${qe}`, _m = "%238c8c8c", vm = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Crect x='3' y='3' width='18' height='18' rx='3' fill='none' stroke='${_m}' stroke-width='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.75' fill='${_m}'/%3E%3Cpath d='M4 18l5-6 4 4.5 3-3 4 4.5' fill='none' stroke='${_m}' stroke-width='2' stroke-linejoin='round'/%3E%3C/svg%3E`, ym = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='-12 -12 48 48'%3E%3Ccircle cx='12' cy='8' r='4' fill='${_m}'/%3E%3Cpath d='M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z' fill='${_m}'/%3E%3C/svg%3E`, bm = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(gm)) (xm(e) || e.complete && e.naturalWidth === 0) && Cm(e);
		P(this.root, gm, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && (t.hasAttribute("data-ui-image-failed") && !Sm(t) && t.removeAttribute(Ye), xm(t) && Cm(t));
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && t.matches(gm) && Cm(t);
	}
};
function xm(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Sm(e) {
	let t = e.getAttribute("src");
	return t === vm || t === ym;
}
function Cm(e) {
	let t = e.getAttribute(Je);
	if (t !== null && t.length > 0 && e.getAttribute("src") !== t) {
		e.setAttribute("src", t);
		return;
	}
	Sm(e) || (e.setAttribute(Ye, ""), e.setAttribute("src", e.classList.contains("ui-image--circle") ? ym : vm));
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var wm = "data-ui-radio-value", Tm = "ui-radio-group__input", Em = "ui-radio-group__dot", Dm = "ui-radio-group", Om = "ui-radio-group__item", km = "data-ui-radio-group-name", Am = "data-ui-radio-bind-value-id", jm = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Dm}`)]);
		for (let e of this.root.querySelectorAll(`.${Dm}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Dm}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Mm));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [wm, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Dm}`)) {
			let n = e.getAttribute(km);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(km), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(km, a);
			for (let e of I(r, `.${Tm}`, `.${Dm}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Dm}`)) n.has(e.getAttribute(km) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(wm);
		for (let n of I(e, `.${Tm}`, `.${Dm}`)) {
			n.checked = n.value === t;
			let e = Nm(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Om) ? [e] : [...e.querySelectorAll(`.${Om}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Tm}`) !== null) return;
		let t = e.closest(`.${Dm}`), n = t?.getAttribute(km);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Tm, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Am);
		a !== null && r.setAttribute(Ve, a);
		let o = document.createElement("span");
		o.className = Em, e.prepend(r, o), this.sync(t);
	}
};
function Mm(e) {
	return e.classList.contains(Dm) ? [e] : [...e.querySelectorAll(`.${Dm}`)];
}
function Nm(e) {
	let t = e.closest(`.${Om}`);
	return t !== null && E(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Pm(e) {
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
function Fm(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Im(e, t) {
	return t !== null && e.length >= t;
}
function Lm(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Im(e, n) ? null : [...e, t];
}
function Rm(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
var zm = /[,\uFF0C\r\n]/;
function Bm(e) {
	return zm.test(e);
}
function Vm(e) {
	return e.split(zm).map((e) => e.trim()).filter((e) => e.length > 0);
}
function Hm(e) {
	let t = e.split(zm), n = t.pop() ?? "";
	return {
		tags: t.map((e) => e.trim()).filter((e) => e.length > 0),
		rest: n
	};
}
function Um(e, t, n, r, i) {
	let a = [...e], o = [], s = null;
	for (let e of t) {
		if (a.includes(e.key)) continue;
		let t = [...a, e.key], c = Im(a, n) ? r : i(a, t);
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
var Wm = /\p{M}/gu;
function Gm(e, t) {
	return Km(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Km(e, t) {
	return Ym(e, Jm(t));
}
function qm(e, t) {
	return t.every((t) => e.includes(t));
}
function Jm(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Ym(e, t) {
	let n = e.normalize("NFD").replace(Wm, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Xm = "data-ui-search-debounce", Zm = "data-ui-search-min-length", Qm = "data-ui-search-manual", $m = "data-ui-search-answered", eh = "ui-search__input", th = "ui-select__list", nh = "ui-select__option", rh = "ui-text__title", ih = 300, ah = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0), this.root.addEventListener("keydown", (e) => this.handleEnter(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(eh) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		oh(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Xm), i = r === null ? ih : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : ih));
	}
	handleEnter(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Enter" || e.defaultPrevented || e.isComposing || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(eh)) return;
		let t = e.target, n = this.timers.get(t);
		e.preventDefault(), n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.commit(t, !0);
	}
	commit(e, t = !1) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), !t && e.hasAttribute(Qm)) return;
		let n = e.getAttribute(Zm), r = n === null ? 0 : Number(n);
		e.value.length < r || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function oh(e) {
	if (e.hasAttribute($m)) return;
	let t = e.closest(`.${vr}`), n = t?.querySelector(`.${th}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Zm), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? Gm(e.value, e) : [], o = ch(n, (e) => a.length === 0 || qm(Km(sh(e), e), a));
	dh(t, n, a.length > 0 && o === 0);
}
function sh(e) {
	return e.querySelector(`.${rh}`)?.textContent ?? e.textContent ?? "";
}
function ch(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && lh(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(nh)) continue;
		let e = t(a);
		lh(a, e), r ||= e, e && i++;
	}
	return n !== null && lh(n, r), i;
}
function lh(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function uh(e) {
	let t = e.querySelector(`.${th}`);
	t !== null && dh(e, t, ch(t, (e) => e.style.display !== "none") === 0);
}
function dh(e, t, n) {
	let r = t.querySelector(`:scope > [${ot}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${it}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(ot, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var fh = 500, ph = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > fh) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += Km(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (Km(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function mh(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var hh = "data-ui-select-value", gh = "data-ui-select-placement", _h = "ui-select--open", vh = "ui-select__trigger-content", yh = "data-ui-select-content", bh = "ui-select__placeholder", xh = "ui-input__affix-icon--prefix", Sh = "ui-select__popup", Ch = "ui-select__list", wh = "ui-select__option", Th = "ui-select__value-input", Eh = "data-ui-select-clear", Dh = "ui-search", Oh = "ui-search__input", kh = "ui-text__title", Ah = "data-ui-active", jh = "ui-multi-select", Mh = "ui-multi-select__chips", Nh = "ui-multi-select__chip", Ph = "ui-multi-select__chip-label", Fh = "ui-multi-select__chip-remove", Ih = "data-ui-select-chip", Lh = "data-ui-select-max", Rh = "data-ui-select-free-text", zh = "ui-multi-select__entry", Bh = "data-ui-select-tag-entry", Vh = [
	hh,
	Zn,
	Lh,
	"class",
	_
];
function Hh(e) {
	return e === null || D(e) || T(e);
}
function Uh(e) {
	return e.classList.contains(jh);
}
function Wh(e) {
	return e.classList.contains(Dh);
}
function Gh(e) {
	return Wh(e) ? e.querySelector(`.${Oh}`) : null;
}
function Kh(e) {
	return e.hasAttribute(Rh) ? e.querySelector(`:scope > .${mr} .${zh}`) : null;
}
function qh(e) {
	return Gh(e) ?? Kh(e);
}
function Jh(e) {
	return Kh(e) ?? e.querySelector(".ui-select__trigger");
}
function Yh(e) {
	let t = e.target instanceof HTMLInputElement && e.target.classList.contains(zh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
	return t === null || n === null ? null : {
		entry: t,
		select: n
	};
}
function L(e) {
	return I(e, `.${Sh} .${wh}`, `.${vr}`);
}
function Xh(e) {
	return e === null ? null : e.querySelector(`.${kh}`)?.textContent ?? e.textContent;
}
function Zh(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ae), t.removeAttribute(_), t.removeAttribute(se), t.removeAttribute(oe);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Qh = class {
	root;
	popups = new du({
		show: ({ owner: e }) => e.classList.add(_h),
		hide: ({ owner: e }) => {
			e.classList.remove(_h), this.markActive(e, null);
			let t = e.querySelector(`.${Sh}`);
			t !== null && (t.style.minHeight = "");
		}
	});
	typeAhead = new ph();
	drawnKeys = /* @__PURE__ */ new WeakMap();
	validation;
	refusedEntries = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation;
		for (let e of this.root.querySelectorAll(`.${vr}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) cg(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Vh,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && (e.target.closest(`[${Eh}], .${Fh}`) !== null || rg(e.target)) && e.preventDefault();
		}, !0), window.addEventListener("input", (e) => this.handleEntryEdit(e), !0), window.addEventListener("compositionend", (e) => this.handleEntryEdit(e), !0), window.addEventListener("change", (e) => this.holdEntryDraft(e), !0), window.addEventListener("keydown", (e) => this.handleEntryEscape(e), !0), this.root.addEventListener("paste", (e) => this.handleEntryPaste(e), !0);
	}
	handleEntryEdit(e) {
		let t = this.holdEntryDraft(e);
		if (t === null || e.isComposing === !0) return;
		let { entry: n, select: r } = t;
		if (Hh(r)) return;
		this.releaseRefusal(r);
		let i = Hm(n.value);
		i.tags.length > 0 ? this.enterTyped(r, n, i.tags, i.rest) : this.suggest(r, n);
	}
	holdEntryDraft(e) {
		let t = Yh(e);
		return t === null || this.root instanceof Node && !this.root.contains(t.select) ? null : (e.stopImmediatePropagation(), t);
	}
	handleEntryEscape(e) {
		let t = e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented ? Yh(e) : null;
		t === null || this.openSelect !== t.select || t.select.getAttribute(Bh) !== "first-suggestion" || !L(t.select).some((e) => e.hasAttribute(Ah)) || (e.preventDefault(), this.markActive(t.select, null));
	}
	handleEntryPaste(e) {
		let t = Yh(e), n = e.clipboardData?.getData("text") ?? "";
		if (t === null || Hh(t.select) || !Bm(n)) return;
		let { entry: r, select: i } = t, a = r.selectionStart ?? r.value.length, o = r.selectionEnd ?? a;
		e.preventDefault(), this.releaseRefusal(i), this.enterTyped(i, r, Vm(r.value.slice(0, a) + n + r.value.slice(o)), "");
	}
	enterTyped(e, t, n, r) {
		let i = Pm(e.getAttribute(Zn)), a = Fm(e.getAttribute(Lh)), o = Um(i, n.map((t) => ({
			text: t,
			key: ig(e, t) ?? t
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
		oh(t);
		let n = t.value.trim().length > 0, r = n ? L(e).filter((e) => eg(e) && !E(e)) : [], i = r.find((e) => e.getAttribute("aria-selected") !== "true") ?? null;
		this.openSelect === e ? r.length > 0 || !n ? this.popups.reposition(e) : this.close() : r.length > 0 && this.toggle(e, !0), this.openSelect === e && e.getAttribute(Bh) === "first-suggestion" && (this.markActive(e, i), i !== null && tg(e, i));
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Uh(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(hh);
		this.decorateOptions(e);
		let n = t === null ? null : L(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = this.renderTriggerContent(e, n, t), i = e.querySelector(`.${bh}`);
		i !== null && (i.style.display = r ? "none" : "");
		for (let n of L(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let a = e.querySelector(`.${Th}`);
		a !== null && a.value !== (t ?? "") && (a.value = t ?? ""), uh(e);
	}
	syncMultiple(e) {
		let t = Pm(e.getAttribute(Zn)), n = new Set(t), r = Im(t, Fm(e.getAttribute(Lh)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = L(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = Kh(e), s = o === null ? t.filter((e) => a.has(e)) : t;
		og(e, s.map((e) => ({
			key: e,
			label: ag(a.get(e) ?? null, e)
		}))), o !== null && o.readOnly !== Hh(e) && (o.readOnly = Hh(e));
		let c = e.querySelector(`.${bh}`);
		c !== null && (c.style.display = s.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let l = e.querySelector(`.${Th}`), u = JSON.stringify(t);
		l !== null && l.getAttribute("data-ui-selected-keys") !== u && l.setAttribute(Zn, u), uh(e);
	}
	renderTriggerContent(e, t, n) {
		let r = e.querySelector(`.${mr}`);
		if (r === null) return t !== null;
		let i = r.querySelector(`:scope > .${vh}`), a = i?.getAttribute(yh) ?? null;
		if (i !== null && a !== null && (i.removeAttribute(yh), this.drawnKeys.set(e, a)), t === null) return i !== null && n !== null && Wh(e) && this.drawnKeys.get(e) === n ? !0 : (i?.remove(), this.drawnKeys.delete(e), !1);
		let o = t.getAttribute(_);
		if (o === null ? this.drawnKeys.delete(e) : this.drawnKeys.set(e, o), i !== null && o !== null && a === o) return !0;
		if (i === null) {
			i = document.createElement("span"), i.className = vh;
			let e = r.querySelector(`:scope > .${xh}`);
			e === null ? r.prepend(i) : e.after(i);
		}
		i.style.display = "inline-flex";
		let s = t.cloneNode(!0);
		return Zh(s), i.replaceChildren(...s.childNodes), !0;
	}
	decorateOptions(e, t = () => !1) {
		for (let n of L(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = E(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${wh}`);
		t === null || n === null || n.hasAttribute(Ah) || E(n) || T(n) || n.closest(".ui-select") !== t || (qh(t) === null && (O(L(t).filter((e) => !E(e)), n), As(n)), this.markActive(t, n, !0));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Fh}`);
		if (t !== null) {
			let n = t.closest(`.${vr}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), Hh(n) || this.removeChosen(n, t.closest(`.${Nh}`)?.getAttribute(Ih) ?? null));
			return;
		}
		let n = e.target.closest(`[${Eh}]`);
		if (n !== null) {
			let t = n.closest(`.${vr}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), Hh(t) || (this.clearValue(t), $h(t)));
			return;
		}
		let r = e.target.closest(`.${mr}`);
		if (r !== null) {
			let t = r.closest(`.${vr}`);
			if (Hh(t)) return;
			e.preventDefault();
			let n = t === null ? null : Kh(t);
			t !== null && n !== null ? this.pressEntryBox(t, n, e.target === n) : this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${wh}`);
		if (i === null) return;
		let a = i.closest(`.${vr}`);
		a !== null && this.choose(a, i);
	}
	pressEntryBox(e, t, n) {
		document.activeElement !== t && t.focus(), !(L(e).length === 0 || n && this.openSelect === e) && this.toggle(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || this.handleEntryKey(e) || this.handleChipKey(e)) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveCurrent(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.handleClosedArrow(e) || this.handleTypeAhead(e) || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${wh}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${vr}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleEntryKey(e) {
		let t = Yh(e);
		if (t === null) return !1;
		let { entry: n, select: r } = t;
		if (Hh(r)) return !1;
		switch (e.key) {
			case "ArrowLeft": return n.selectionStart === 0 && n.selectionEnd === 0 && this.focusChip(e, r, -1);
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect === r ? this.moveCurrent(r, e.key === "ArrowDown" ? 1 : -1) : this.openSuggestions(r, n, e.key === "ArrowDown"), !0;
			case "Enter": {
				let t = this.openSelect === r ? L(r).find((e) => e.hasAttribute(Ah) && eg(e) && !E(e)) : void 0;
				return t === void 0 ? (e.preventDefault(), n.value.trim().length === 0 ? (this.pressEntryBox(r, n, !1), !0) : (this.releaseRefusal(r), this.enterTyped(r, n, Vm(n.value), ""), !0)) : (e.preventDefault(), this.choose(r, t), !0);
			}
			case ",": return e.preventDefault(), this.releaseRefusal(r), this.enterTyped(r, n, Vm(n.value), ""), !0;
			case "Backspace": {
				if (n.value.length > 0) return !1;
				let t = r.querySelectorAll(`.${Mh} > .${Nh}`);
				return t.length !== 0 && (e.preventDefault(), this.removeChosen(r, t[t.length - 1].getAttribute(Ih)), !0);
			}
			default: return !1;
		}
	}
	focusChip(e, t, n, r = null) {
		let i = ng(t);
		if (i.length === 0) return !1;
		let a = i[(r === null ? i.length : i.findIndex((e) => e.contains(r))) + n]?.querySelector(`.${Fh}`) ?? (n === 1 ? Jh(t) : null);
		return e.preventDefault(), a === null || (a.focus(), a instanceof HTMLInputElement && a.setSelectionRange(0, 0), !0);
	}
	openSuggestions(e, t, n) {
		oh(t);
		let r = L(e).filter((e) => eg(e) && !E(e) && !T(e)), i = (n ? r[0] : r[r.length - 1]) ?? null;
		i !== null && this.toggle(e, !0, i);
	}
	handleChipKey(e) {
		let t = e.target instanceof HTMLElement && e.target.classList.contains(Fh) ? e.target : null, n = t?.closest(".ui-select") ?? null;
		if (t === null || n === null || !Uh(n)) return !1;
		switch (e.key) {
			case "ArrowLeft": return this.focusChip(e, n, -1, t);
			case "ArrowRight": return this.focusChip(e, n, 1, t);
			case "Backspace":
			case "Delete": {
				if (e.preventDefault(), Hh(n)) return !0;
				let r = ng(n), i = r.findIndex((e) => e.contains(t)), a = (r[i + 1] ?? r[i - 1])?.getAttribute(Ih) ?? null;
				this.removeChosen(n, r[i]?.getAttribute(Ih) ?? null);
				let o = a === null ? null : ng(n).find((e) => e.getAttribute(Ih) === a) ?? null;
				return o !== null && o.querySelector(`.${Fh}`)?.focus(), !0;
			}
			default: return !1;
		}
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || Hh(t)) return !1;
		e.preventDefault();
		let n = Gh(t);
		n !== null && oh(n);
		let r = L(t).filter((e) => eg(e) && !E(e) && !T(e)), i = r.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? r[0] : r[r.length - 1]) ?? null;
		return this.toggle(t, !1, i), !0;
	}
	handleTypeAhead(e) {
		let t = mh(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(wh))) return !1;
		let r = n.closest(`.${vr}`), i = r !== null && r === this.openSelect;
		if (r === null || Hh(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		let a = Gh(r);
		if (a !== null) return !i && (e.preventDefault(), this.typeIntoSearch(r, a, t), !0);
		e.preventDefault();
		let o = L(r).filter((e) => !E(e) && !T(e)), s = i ? o.find((e) => e === document.activeElement) ?? o.find((e) => e.hasAttribute(Ah)) ?? null : o.find((e) => e.getAttribute("aria-selected") === "true") ?? null, c = this.typeAhead.next({
			owner: r,
			character: t,
			entries: o,
			current: s,
			words: (e) => Xh(e) ?? "",
			context: r
		});
		return c === null ? !0 : i ? (O(L(r).filter((e) => !E(e)), c), tg(r, c), M(c), this.markActive(r, c), !0) : (this.toggle(r, !1, c), !0);
	}
	typeIntoSearch(e, t, n) {
		this.toggle(e, !0), this.openSelect === e && (t.value = n, t.setSelectionRange(n.length, n.length), t.dispatchEvent(new Event("input", { bubbles: !0 })));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Uh(t) || Hh(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowLeft": return this.focusChip(e, t, -1);
			case "Backspace": {
				let n = t.querySelectorAll(`.${Mh} > .${Nh}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Ih)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Oh) || !t.contains(e.target) ? null : L(t).find((e) => e.hasAttribute(Ah) && !E(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close();
		let r = qh(e), i = Kh(e);
		r !== null && !t && oh(r), uh(e);
		let a = e.querySelector(`.${mr}`), o = e.querySelector(`.${Sh}`), s = e.querySelector(`.${Ch}`) ?? o, c = e.getAttribute(gh);
		if (a === null || o === null || s === null) return;
		let l = Er(s, "ui-select-list");
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
			i === null ? this.initializeSearch(e, r, n, t) : this.initializeEntry(e, n), lg(o);
		}
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = L(e).filter((e) => !E(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Ds()) {
			O(n, null), this.markActive(e, null), $h(e);
			return;
		}
		let i = r ?? n[0];
		O(n, i), this.markActive(e, i, Ds()), tg(e, i), M(i);
	}
	initializeSearch(e, t, n, r) {
		let i = L(e), a = i.filter((e) => eg(e) && !E(e)), o = (r ? void 0 : n ?? a.find((e) => e.getAttribute("aria-selected") === "true")) ?? (r || Ds() ? null : a[0] ?? null);
		O(i, null), this.markActive(e, o, Ds()), o !== null && tg(e, o), !Os() && (M(t), t.select());
	}
	initializeEntry(e, t) {
		O(L(e), null), this.markActive(e, t), t !== null && tg(e, t);
	}
	moveCurrent(e, t) {
		let n = L(e).filter((e) => !E(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(Ah)) ?? null, i = _o({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (qh(e) === null ? (O(n, i), i.focus()) : tg(e, i), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of L(e)) r === t ? r.setAttribute(Ah, "") : r.hasAttribute(Ah) && r.removeAttribute(Ah), ks(r, r === t && n);
		let r = qh(e);
		r !== null && (t === null ? r.removeAttribute("aria-activedescendant") : r.setAttribute("aria-activedescendant", Er(t, "ui-select-option")));
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || E(t) || Hh(e)) return;
		if (Uh(e)) {
			let r = Lm(Pm(e.getAttribute(Zn)), n, Fm(e.getAttribute(Lh)));
			this.markActive(e, t, Ds()), r !== null && this.writeChosen(e, r);
			let i = Kh(e);
			i !== null && i.value.length > 0 && (i.value = "", this.releaseRefusal(e), this.suggest(e, i));
			return;
		}
		if (e.getAttribute(hh) === n) {
			this.close();
			return;
		}
		e.setAttribute(hh, n), this.sync(e);
		let r = e.querySelector(`.${Th}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Rm(Pm(e.getAttribute(Zn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Nh}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && Jh(e)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(Zn) : e.setAttribute(Zn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Th}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Uh(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(hh)) return;
		e.removeAttribute(hh), this.sync(e);
		let t = e.querySelector(`.${Th}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function $h(e) {
	let t = e.querySelector(`.${mr}`), n = Jh(e);
	t !== null && n !== null && !t.contains(document.activeElement) && M(n);
}
function eg(e) {
	return e.style.display !== "none" && !e.classList.contains("ui-hidden");
}
function tg(e, t) {
	let n = e.querySelector(`.${Ch}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function ng(e) {
	return [...e.querySelectorAll(`.${Mh} > .${Nh}`)];
}
function rg(e) {
	let t = e.closest(".ui-select__trigger")?.closest(".ui-select") ?? null;
	return t !== null && Kh(t) !== null && !e.classList.contains(zh);
}
function ig(e, t) {
	let n = t.trim().toLocaleLowerCase();
	for (let t of L(e)) {
		let e = t.dataset.uiKey;
		if (e !== void 0 && !E(t) && (e.toLocaleLowerCase() === n || Xh(t)?.trim().toLocaleLowerCase() === n)) return e;
	}
	return null;
}
function ag(e, t) {
	let n = Xh(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function og(e, t) {
	let n = e.querySelector(`.${Mh}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Nh}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Ih) === t[n].key && e.querySelector(`.${Ph}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => sg(e.key, e.label)));
	}
}
function sg(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Nh, n.setAttribute(Ih, e), r.className = Ph, r.textContent = t, i.className = Fh, i.type = "button", i.tabIndex = -1, w.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function cg(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${vr}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === hh || e.attributeName === "data-ui-selected-keys" || e.attributeName === Lh)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${Sh}`)?.closest(`.${vr}`);
	n != null && t.add(n);
}
function lg(e) {
	e.dataset.uiPlacement?.startsWith("top") === !0 && (e.style.minHeight = `${e.offsetHeight}px`);
}
//#endregion
//#region src/interactions/commit-gate.ts
var ug = class {
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
}, dg = "data-ui-input-debounce", fg = `input[${dg}], textarea[${dg}]`;
function pg(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(fg);
}
var mg = /* @__PURE__ */ new Set();
function hg() {
	for (let e of mg) if (e.waiting) return !0;
	return !1;
}
function gg() {
	for (let e of mg) e.commitAll();
}
var _g = class {
	root;
	timers = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), mg.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!pg(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(dg));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!pg(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t));
	}
	commit(e) {
		this.timers.delete(e), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
}, vg = "textarea.ui-text-area__field", yg = "data-ui-text-area-grow";
function bg() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var xg = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(vg) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(vg)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(ci(e.components, vg));
		}), P(this.root, vg, {
			childList: !0,
			attributeFilter: [yg]
		}, (e) => {
			this.fitAll(ci(e, vg));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(yg)) {
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
function Sg(e) {
	let t = Cg(e.getAttribute("min"), 0), n = Cg(e.getAttribute("max"), 100), r = e.getAttribute("step");
	return {
		min: t,
		max: Math.max(t, n),
		step: r === "any" ? 0 : Math.max(0, Cg(r, 1))
	};
}
function Cg(e, t) {
	let n = e === null || e.trim().length === 0 ? NaN : Number(e);
	return Number.isFinite(n) ? n : t;
}
function wg(e, t, n, r) {
	let i = (n ? e.height : e.width) - r;
	if (i <= 0) return 0;
	let a = n ? e.top + e.height - t.y : t.x - e.left;
	return Math.min(1, Math.max(0, (a - r / 2) / i));
}
function Tg(e, t) {
	return Eg(t.min + e * (t.max - t.min), t);
}
function Eg(e, t) {
	let n = Math.min(t.max, Math.max(t.min, e));
	if (t.step <= 0) return n;
	let r = Math.round((n - t.min) / t.step);
	return t.min + r * t.step > t.max && r--, Dg(t.min + r * t.step, t);
}
function Dg(e, t) {
	return Number(e.toFixed(Math.min(20, Math.max(Og(t.step), Og(t.min)))));
}
function Og(e) {
	let t = String(e), n = t.indexOf("e-");
	if (n >= 0) return Number(t.slice(n + 2));
	let r = t.indexOf(".");
	return r < 0 ? 0 : t.length - r - 1;
}
function kg(e, t, n) {
	return t === n ? e < t ? "start" : e > t ? "end" : null : Math.abs(e - t) < Math.abs(e - n) ? "start" : "end";
}
function Ag(e, t, n, r, i) {
	let a = Math.max(0, r);
	if (t === "start" ? e <= n - a : e >= n + a) return e;
	let o = t === "start" ? n - a : n + a;
	if (i.step <= 0) return jg(o, i);
	let s = (o - i.min) / i.step;
	return jg(Dg(i.min + (t === "start" ? Math.floor(s + 1e-9) : Math.ceil(s - 1e-9)) * i.step, i), i);
}
function jg(e, t) {
	return Math.min(t.max, Math.max(t.min, e));
}
//#endregion
//#region src/interactions/range-value-engine.ts
var Mg = "ui-slider__input", Ng = "ui-slider__input--end", Pg = "ui-slider__input--held", Fg = "ui-slider__value", Ig = "ui-slider__bubble", Lg = "ui-slider__track", Rg = "ui-slider__thumb-anchor", zg = "ui-slider", Bg = "ui-slider--range", Vg = "ui-orientation--vertical", Hg = "--ui-slider-fraction", Ug = "--ui-slider-end-fraction", Wg = 6, Gg = "Value", Kg = "EndValue", qg = /* @__PURE__ */ new Set([
	"Value",
	"EndValue",
	"Min",
	"Max"
]), Jg = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	pressedFrom = /* @__PURE__ */ new WeakMap();
	cancelled = /* @__PURE__ */ new WeakSet();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => {
			this.notePress(e.target), this.placeBubble(e.target);
		}, !0), this.root.addEventListener("pointercancel", (e) => this.takeBackPress(e.target), !0), (this.root === document ? window : this.root).addEventListener("change", (e) => this.refuseCancelledChange(e), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), new wf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Bg} .${Lg}`),
			begin: (e, t) => this.beginBandDrag(e, t),
			move: (e, t, n) => this.moveBandDrag(e, n),
			end: (e, t) => this.endBandDrag(t),
			cancel: (e, t) => this.putBandBack(t),
			takenBack: (e, t) => this.putBandBack(t)
		}), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!qg.has(e.propertyName)) return;
			let t = S(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) for (let t of n.querySelectorAll(`.${Mg}`)) this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === (Xg(t) ? Kg : Gg) && this.reportClamped(t, e.value);
		});
	}
	notePress(e) {
		let t = Yg(e);
		t !== null && (this.cancelled.delete(t), this.pressedFrom.set(t, t.value));
	}
	takeBackPress(e) {
		let t = Yg(e), n = t === null ? void 0 : this.pressedFrom.get(t);
		t !== null && n !== void 0 && (this.pressedFrom.delete(t), t.value !== n && (t.value = n, this.cancelled.add(t), this.settled.set(t, n), this.writeReadings(t)));
	}
	refuseCancelledChange(e) {
		let t = Yg(e.target);
		t === null || !this.cancelled.has(t) || (this.cancelled.delete(t), e.stopImmediatePropagation());
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || $g(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Mg)) return;
		let t = e.target;
		if (this.cancelled.delete(t), $g(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		let n = Zg(t);
		if (n !== null) {
			let e = Qg(t, Number(t.value), n);
			e !== t.value && (t.value = e, e === (this.settled.get(t) ?? t.defaultValue) && this.cancelled.add(t));
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	beginBandDrag(e, t) {
		let n = e.querySelector(`.${Mg}:not(.${Ng})`), r = e.querySelector(`.${Ng}`);
		if (n === null || r === null) return null;
		let i = Tg(wg(e.getBoundingClientRect(), t, e_(e), t_(e)), Sg(n)), a = kg(i, Number(n.value), Number(r.value));
		if ($g(n)) return M(a === "end" ? r : n), null;
		let o = {
			start: n,
			end: r,
			from: [n.value, r.value],
			pressed: i,
			held: null
		};
		return a === null ? M(n) : this.holdHandle(o, a, i), o;
	}
	moveBandDrag(e, t) {
		let n = e.start.closest(`.${Lg}`);
		if (n === null) return;
		let r = Tg(wg(n.getBoundingClientRect(), t, e_(n), t_(n)), Sg(e.start));
		if (e.held === null) {
			if (r === e.pressed) return;
			this.holdHandle(e, r < e.pressed ? "start" : "end", r);
			return;
		}
		this.moveHandle(e.held, r);
	}
	holdHandle(e, t, n) {
		let r = t === "start" ? e.start : e.end;
		e.held = r, r.classList.add(Pg), M(r), this.moveHandle(r, n), this.placeBubble(r);
	}
	moveHandle(e, t) {
		let n = Zg(e), r = n === null ? String(t) : Qg(e, t, n);
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
		e.held?.classList.remove(Pg), e.held !== null && this.writeReadings(e.held);
	}
	placeBubble(e) {
		let t = n_(e);
		t !== null && rl(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Wg
		});
	}
	releaseBubble(e) {
		ul(n_(e)?.bubble);
	}
	writeReadings(e) {
		let t = Xg(e), n = e.closest(`.${Lg}`)?.parentElement ?? e.parentElement, r = t ? `.${Fg}--end, .${Ig}--end` : `.${Fg}:not(.${Fg}--end), .${Ig}:not(.${Ig}--end)`;
		for (let t of n?.querySelectorAll(r) ?? []) t.textContent = e.value;
		e.closest(`.${Lg}`)?.style.setProperty(t ? Ug : Hg, String(r_(e))), e.matches(`:active, :focus-visible, .${Pg}`) ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Yg(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Mg) ? e : null;
}
function Xg(e) {
	return e.classList.contains(Ng);
}
function Zg(e) {
	return e.closest(`.${Bg} .${Lg}`)?.querySelector(Xg(e) ? `.${Mg}:not(.${Ng})` : `.${Ng}`) ?? null;
}
function Qg(e, t, n) {
	let r = Number(e.closest(`.${zg}`)?.getAttribute("data-ui-slider-min-distance") ?? 0);
	return String(Ag(t, Xg(e) ? "end" : "start", Number(n.value), Number.isFinite(r) ? r : 0, Sg(e)));
}
function $g(e) {
	return D(e) || T(e);
}
function e_(e) {
	return e.closest(`.${zg}`)?.classList.contains(Vg) === !0;
}
function t_(e) {
	let t = e.querySelector(`.${Rg}`)?.getBoundingClientRect();
	return t === void 0 ? 0 : e_(e) ? t.height : t.width;
}
function n_(e) {
	if (!(e instanceof Element) || !e.classList.contains(Mg)) return null;
	let t = e.closest(`.${Lg}`), n = Xg(e), r = t?.querySelector(n ? `.${Ig}--end` : `.${Ig}:not(.${Ig}--end)`) ?? null, i = t?.querySelector(n ? `.${Rg}--end` : `.${Rg}:not(.${Rg}--end)`) ?? null;
	return r === null || i === null ? null : {
		bubble: r,
		anchor: i,
		vertical: e_(e)
	};
}
function r_(e) {
	let { min: t, max: n } = Sg(e), r = Number(e.value);
	return !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var i_ = {
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
}, a_ = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], o_ = [
	"$n",
	"n$",
	"$ n",
	"n $"
], s_ = [
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
], c_ = [
	"n %",
	"n%",
	"%n",
	"% n"
], l_ = [
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
], u_ = /[1-9]/;
function d_(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return i_;
	try {
		return {
			...i_,
			...JSON.parse(t)
		};
	} catch {
		return i_;
	}
}
function f_(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = m_(t);
	if (r === null) return h_(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = g_(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return p_(e, t) ? x_(a_[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = g_(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return p_(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = __(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return p_(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = g_(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return x_(p_(e, t) ? s_[n.currencyNegativePattern] ?? "-$n" : o_[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = g_(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return x_(p_(e, t) ? l_[n.percentNegativePattern] ?? "-n %" : c_[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return h_(e, n);
	}
}
function p_(e, t) {
	return e < 0 && u_.test(t);
}
function m_(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function h_(e, t) {
	let { integer: n, fraction: r } = v_(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function g_(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = __(e, t, n);
	return n === 0 ? b_(o, r, i) : `${b_(o, r, i)}${a}${s}`;
}
function __(e, t, n) {
	let { integer: r, fraction: i } = v_(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? y_(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function v_(e, t) {
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
function y_(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function b_(e, t, n) {
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
function x_(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var S_ = {
	readCulture: d_,
	format: f_
}, C_ = /^-?(\d+(\.\d*)?|\.\d+)$/;
function w_(e, t, n) {
	if (!C_.test(e)) return e;
	let r = n.thousands ? t : A_(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return f_(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return f_(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function T_(e, t, n) {
	return C_.test(e) ? (k_(n) ? j_(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function E_(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = k_(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!C_.test(d)) return null;
	let f = a ? j_(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function D_(e, t, n, r, i) {
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
function O_(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function k_(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function A_(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function j_(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var M_ = "ui-number-input", N_ = "ui-number-input__field", P_ = "data-ui-number-no-decimals", F_ = "data-ui-number-no-negative", I_ = "data-ui-number-no-thousands", L_ = "data-ui-number-trim-zeros", R_ = "data-ui-number-step", z_ = "data-ui-number-min", B_ = "data-ui-number-max", V_ = "data-ui-number-step-direction", H_ = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${N_}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(ci(e.components, `.${N_}`));
		}), w.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${N_}`)));
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
		let t = U_(e);
		if (t !== null) return this.keptValue(t) ?? q_(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = e.hasAttribute(L_) ? O_(t) : t, r = d_(e), i = e === document.activeElement ? T_(n, r, J_(e)) : K_(e, n, r);
		e.value = i, this.shown.set(e, i);
	}
	handleInput(e) {
		let t = U_(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(P_), r = !t.hasAttribute(F_), i = t.selectionStart ?? t.value.length, a = D_(t.value, i, d_(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = U_(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = U_(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : q_(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(L_) && !D(t) && !T(t)) {
			let e = this.values.get(t) ?? "", n = O_(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = U_(e.target);
		if (t === null) return;
		let n = q_(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = U_(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = T_(t, d_(e), J_(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + V_ + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${N_}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(V_) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = U_(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(R_) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : q_(e) ?? "0") || 0) + n * t, i = e.getAttribute(z_), a = e.getAttribute(B_);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, Y_(r)), this.show(e);
	}
};
function U_(e) {
	return e instanceof HTMLInputElement && e.classList.contains(N_) ? e : null;
}
function W_(e, t) {
	let n = e.classList.contains(M_) ? e.querySelector(`.${N_}`) : null, r = n === null ? null : t(n);
	if (n === null || typeof r != "string" || r.trim().length === 0 || !Number.isFinite(Number(r))) return null;
	let i = G_(n, z_), a = G_(n, B_);
	return i !== null && Number(r) < Number(i) ? {
		key: "ui.value.min",
		args: { min: K_(n, i, d_(n)) }
	} : a !== null && Number(r) > Number(a) ? {
		key: "ui.value.max",
		args: { max: K_(n, a, d_(n)) }
	} : null;
}
function G_(e, t) {
	let n = e.getAttribute(t)?.trim() ?? "";
	return n.length > 0 && Number.isFinite(Number(n)) ? n : null;
}
function K_(e, t, n) {
	return w_(t, n, {
		format: J_(e),
		thousands: !e.hasAttribute(I_)
	});
}
function q_(e) {
	return E_(e.value, d_(e), J_(e));
}
function J_(e) {
	return e.closest(`.${M_}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Y_(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/events/ahead-of-answer.ts
function X_(e, t) {
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
function Z_(e) {
	switch (e.getAttribute(mt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function Q_(e) {
	let t = Z_(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/interactions/drag-marks.ts
function $_(e, t, n, r, i, a = [], o = "move") {
	ev(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	tv(e, i, o);
}
function ev(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
function tv(e, t, n) {
	!(e instanceof DragEvent) || e.dataTransfer === null || (e.dataTransfer.effectAllowed = n, e.dataTransfer.setData("text/plain", t));
}
function nv(e, t) {
	return !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget));
}
//#endregion
//#region src/interactions/item-drags.ts
var rv = "application/x-ne-items", iv = null;
function av(e, t, n) {
	let r = e.getAttribute(he), i = new Set((e.getAttribute("data-ui-drag-effects") ?? "").split(" ").filter((e) => e === "move" || e === "copy"));
	return r === null || r.length === 0 || i.size === 0 || n.length === 0 ? null : {
		kind: r,
		root: e,
		host: t,
		rows: n,
		keys: n.map(j),
		effects: i,
		source: e.getAttribute(ge)
	};
}
function ov(e, t) {
	let n = Vo(t);
	return n.includes(e) ? n.filter((t) => t === e || sv(t)) : [e];
}
function sv(e) {
	return !e.hasAttribute("data-ui-undraggable") && !E(e) && A(e) !== null;
}
function cv(e, t) {
	let n = e?.effects.has("copy") === !0, r = t || e?.effects.has("move") === !0;
	return n && r ? "copyMove" : n ? "copy" : "move";
}
function lv(e, t) {
	iv = t, t !== null && e instanceof DragEvent && e.dataTransfer !== null && e.dataTransfer.setData(rv, t.kind);
}
function uv(e) {
	return iv !== null && e.dataTransfer?.types.includes(rv) === !0 ? iv : null;
}
function dv() {
	iv = null;
}
//#endregion
//#region src/items/items-empty-renderer.ts
var fv = `:scope > [${ot}], :scope > [${st}], :scope > [${yt}]`;
function R(e) {
	let t = new Set(e.querySelectorAll(fv));
	return [...e.children].filter((e) => !t.has(e));
}
function pv(e) {
	return e === null ? [] : [e];
}
function mv(e) {
	return e.querySelector(`:scope > [${ot}]`);
}
function hv(e, t, n, r, i) {
	i ??= R(e).some((e) => !e.classList.contains(lr));
	let a = mv(e);
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
	c.setAttribute(ot, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var gv = { ok: !1 }, _v = {
	ok: !0,
	value: null
}, vv = null;
function yv(e) {
	vv = e;
}
function bv(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Ar(e.kind) !== "Scope"), o = -1;
	for (let e = 0; e < a.length; e++) Ar(a[e].kind) === "Dynamic" && (o = e);
	let s = r, c = r, l = !0, u = 0, d = 0, f = !0;
	for (; d < i.length;) {
		let t = i[d];
		if (t === ".") {
			if (f) return gv;
			f = !0, d++;
			continue;
		}
		if (t === "[") {
			if (d + 1 >= i.length || i[d + 1] !== "]" || u >= a.length) return gv;
			let t = a[u];
			if (u++, Ar(t.kind) === "Dynamic") {
				let n = wv(e, t.componentId);
				if (!n.ok) return gv;
				s = n.value, c = n.value, l = !0;
			} else {
				if (!l) return gv;
				let e = jv(s, t.value);
				if (!e.ok) return gv;
				s = e.value;
			}
			d += 2, f = !1;
			continue;
		}
		let n = d;
		for (; d < i.length && i[d] !== "." && i[d] !== "[";) d++;
		if (d === n) return gv;
		if (l) {
			let e = Dv(s, i.slice(n, d), u > o);
			e.ok ? s = e.value : l = !1;
		}
		f = !1;
	}
	return f || u !== a.length || !l ? gv : {
		ok: !0,
		value: s,
		scope: c
	};
}
function xv(e, t, n) {
	for (let r of t ?? []) {
		if (Ar(r.kind) !== "Dynamic") continue;
		let t = S(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Sv(e) {
	let t = Ev(e, "IsContent");
	return t.ok && t.value === !0;
}
var Cv = /* @__PURE__ */ new Set();
function wv(e, t) {
	let n = S(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Cv.has(n) || (Cv.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), gv;
}
function Tv(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Ev(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Ev(e, t) {
	return Dv(e, t, !0);
}
function Dv(e, t, n) {
	if (e == null) return gv;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return gv;
	let r = e, i = Ov(r, t);
	return Object.hasOwn(r, i) ? {
		ok: !0,
		value: r[i]
	} : Array.isArray(e) ? gv : (n && vv?.(r, t), _v);
}
function Ov(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = kv(t);
	if (Object.hasOwn(e, n)) return n;
	let r = null;
	for (let n in e) if (!(n.length !== t.length || !Object.hasOwn(e, n)) && (r ??= t.toLowerCase(), n.toLowerCase() === r)) return n;
	return n;
}
function kv(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Av(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Ar(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Ar(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = S(e.componentId);
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
function jv(e, t) {
	if (e == null || t == null) return gv;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : gv;
	if (typeof t != "string") return gv;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Nv(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return gv;
}
function Mv(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Nv(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Nv(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Pv(e) {
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
function Fv(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Pv(e);
	if (a === void 0 && o === null) {
		for (let t of R(e)) t.classList.remove(lr);
		return;
	}
	for (let n of R(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(lr);
			continue;
		}
		n.classList.toggle(lr, !Iv(a, e, i, o));
	}
}
function Iv(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Vv(e, t, n)) && (r?.filters ?? []).every((e) => Ac(Tv(t, e.itemProperty), e.operator, e.value));
}
function Lv(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Hv(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Rv(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Hv(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function zv(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Bv(n.getItemValue(e), n.getItemValue(r), t));
}
function Bv(e, t, n) {
	for (let r of n) {
		let n = Uv(jc(Tv(e, r.itemProperty)), jc(Tv(t, r.itemProperty)));
		if (n !== 0) return Fr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Vv(e, t, n) {
	if (!Hv(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Ac(Tv(t, e.itemProperty), e.operator, r);
}
function Hv(e, t, n, r) {
	return e == null || Ac(r.get(e, []), t, n);
}
function Uv(e, t) {
	if (e === t) return 0;
	let n = Gv(e), r = Gv(t);
	if (n !== r) return n - r;
	if (n === Wv.Nothing) return 0;
	if (n === Wv.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Wv = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Gv(e) {
	return e == null ? Wv.Nothing : typeof e == "number" ? Number.isNaN(e) ? Wv.Nothing : Wv.Number : typeof e == "string" && e.trim().length === 0 ? Wv.Nothing : Number.isNaN(Number(e)) ? Wv.Text : Wv.Number;
}
//#endregion
//#region src/items/items-source-order.ts
var Kv = /* @__PURE__ */ new WeakMap();
function qv(e, t) {
	let n = Kv.get(e), r = n === void 0 ? [...t] : Jv(n, t);
	return Kv.set(e, r), r;
}
function Jv(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function Yv(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Xv(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Zv(e, t, n) {
	return Xv(e, t), Yv(e, t, n);
}
function Qv(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function $v(e) {
	Kv.delete(e);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var ey = ".ui-items-view__item, .ui-table__row", ty = "ui-row--dragging", ny = "--ui-row-drop-offset", ry = "move";
function iy(e) {
	return {
		name: ry,
		registration: {
			dynamicParameters: (e) => {
				let t = ay(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			...X_((t) => e === void 0 ? null : oy(e, t), (t) => e?.settle(t))
		}
	};
}
function ay(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
function oy(e, t) {
	let n = ay(t), r = n === null || !(t.target instanceof Element) ? null : t.target.closest(ey), i = r?.parentElement ?? null;
	return n === null || r === null || i === null || !i.hasAttribute("data-ui-items-host") ? null : e.ahead(i, j(r), n);
}
var sy = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("pointercancel", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t === null ? null : A(t.row);
		if (t === null || n === null) return;
		let r = fy(t.root, t.row);
		if (r === null ? !py(e.target, t.row) : !r.contains(e.target)) return;
		r !== null && (as(t.root, yy(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 }));
		let i = document.getSelection();
		i !== null && !i.isCollapsed && i.removeAllRanges(), n.draggable || (n.draggable = !0, this.lifted = n);
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	liftableRow(e) {
		let t = e.closest(Ao), n = t?.parentElement ?? null, r = n?.closest(k) ?? null;
		if (t === null || n === null || r === null || !t.matches(ey) || !n.hasAttribute("data-ui-items-host") || T(r) || !sv(t)) return null;
		let i = r.hasAttribute("data-ui-rows-draggable") && !this.isSorted(r, n);
		return i || r.hasAttribute("data-ui-drag-kind") ? {
			root: r,
			row: t,
			moves: i
		} : null;
	}
	isSorted(e, t) {
		let n = ui(e);
		return this.services === void 0 || n === null ? !1 : Rv(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, Pv(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.liftableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : A(t.row);
		if (t === null || n === null || r === null || e.target !== r) return;
		this.drag = {
			...t,
			host: n
		};
		let i = av(t.root, n, ov(t.row, yy(n))), a = (i?.rows ?? []).filter((e) => e !== t.row).map((e) => A(e) ?? e);
		$_(e, t.root, r, ty, j(t.row), a, cv(i, t.moves)), lv(e, i);
	}
	handleDragOver(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let n = hy(t.root, t.host), r = yy(t.host), i = uy(t.host, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? by(t.root, null) : by(t.root, i, _y(r, i, n));
	}
	ownDrag(e) {
		let t = this.drag;
		return t !== null && t.moves && e.target instanceof Element && t.host.contains(e.target) ? t : null;
	}
	indexOf(e, t, n) {
		if (my(t) !== my(e.row)) return null;
		let r = cy(dy(e.host, this.services?.keysOf), j(e.row), j(t), n);
		return r === null ? null : r + Q_(e.host);
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && nv(e, t.host) && by(t.root, null);
	}
	handleDrop(e) {
		let t = this.ownDrag(e);
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		e.preventDefault();
		let n = uy(t.host, e.target, e, hy(t.root, t.host), yy(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && ps(t.row, ry, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (ev(e.root, ty), by(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = es(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || t.row !== null && tm(e.target, t.row) !== null) return;
		let n = Jo(t.root), r = n === null ? [] : yy(n), i = ns(r);
		if (n === null || i === null || this.liftableRow(i)?.moves !== !0) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && ps(i, ry, { index: c });
	}
};
function cy(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = ly(e.filter((e) => e !== t), n, r);
	return a === i ? null : a;
}
function ly(e, t, n) {
	let r = e.indexOf(t);
	return r < 0 ? null : n === "before" ? r : r + 1;
}
function uy(e, t, n, r, i) {
	if (t.closest("[data-ui-group-header]")?.parentElement === e) return null;
	let a = t.closest(Ao);
	for (; a !== null && a.parentElement !== e;) a = a.parentElement?.closest(Ao) ?? null;
	if (a ??= vy(i, n), a === null) return null;
	let o = (A(a) ?? a).getBoundingClientRect();
	if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
		anchor: a,
		side: "after"
	};
	let s = i[i.indexOf(a) - 1];
	return s !== void 0 && gy(s, a, r) ? {
		anchor: s,
		side: "after"
	} : {
		anchor: a,
		side: "before"
	};
}
function dy(e, t) {
	switch (Z_(e)) {
		case "virtualized": return [...t?.(e) ?? R(e).map(j)];
		case "windowed": return R(e).map(j);
		default: return qv(e, R(e)).map(j);
	}
}
function fy(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ve}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function py(e, t) {
	return tm(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function my(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function hy(e, t) {
	let n = e.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: n,
		rightToLeft: n && getComputedStyle(t).direction === "rtl"
	};
}
function gy(e, t, n) {
	if (my(e) !== my(t)) return !1;
	if (!n.across) return !0;
	let r = (A(e) ?? e).getBoundingClientRect(), i = (A(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function _y(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !gy(t.anchor, r, n)) return -1;
	let i = (A(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (A(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function vy(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (A(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function yy(e) {
	return R(e).filter((e) => e instanceof HTMLElement && e.matches(ey) && A(e) !== null);
}
function by(e, t, n = 0) {
	let r = t === null ? null : A(t.anchor);
	for (let t of e.querySelectorAll(`[${ye}]`)) t !== r && (t.removeAttribute(ye), t.style.removeProperty(ny));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ye, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(ny) !== i && r.style.setProperty(ny, i);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function xy(e) {
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
		default: o = My(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Sy(e, t, n = Oy()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
function Cy(e, t = Oy()) {
	let n = wy(e.code, t);
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
function wy(e, t) {
	return /^Key[A-Z]$/.test(e) ? e.slice(3) : /^Digit[0-9]$/.test(e) ? e.slice(5) : (t ? Ey[e] : void 0) ?? Ty[e] ?? e;
}
var Ty = {
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
}, Ey = {
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
}, Dy = null;
function Oy() {
	return Dy === null && (Dy = ky()), Dy;
}
function ky() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
var Ay = { words(e) {
	let t = xy(e);
	return t === null ? null : Cy(t);
} };
function jy(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function My(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Ny[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Ny[t] ?? null;
}
var Ny = {
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
}, Py = 120;
function Fy(e) {
	return e.typing && e.tallest - e.height > Py;
}
function Iy(e) {
	return mo(e) || e instanceof HTMLElement && e.isContentEditable;
}
var Ly = class {
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
		let t = Fy({
			height: e.height,
			tallest: this.tallest,
			typing: Iy(document.activeElement)
		});
		t !== document.documentElement.hasAttribute("data-ui-keyboard-up") && document.documentElement.toggleAttribute(Wn, t);
	}
}, Ry = "--ui-tree-drop-depth";
function zy(e) {
	return e.querySelector(`.${mn}`);
}
function By(e, t) {
	if (E(e)) return !1;
	let n = t?.getAttribute(En);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
function Vy(e, t) {
	let n = e.length === 0 ? null : t(e);
	return n === null || By(n, zy(n));
}
function Hy(e, t) {
	let n = zy(e);
	if (By(e, n)) return j(e);
	let r = n?.getAttribute("data-ui-tree-parent") ?? "";
	return Vy(r, t) ? r : null;
}
function Uy(e, t, n = "", r) {
	for (let n of e.querySelectorAll(`[${hn}]`)) n !== t && (n.removeAttribute(hn), n.style.removeProperty(Ry));
	t !== null && (t.setAttribute(hn, n), r === void 0 ? t.style.removeProperty(Ry) : t.style.setProperty(Ry, String(r)));
}
function Wy(e, t, n) {
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
function Gy(e, t, n) {
	let r = e.find((e) => e.key === t);
	if (r === void 0) return null;
	let i = Ky(e, r, n);
	return i === null || !qy(e, i.parent) ? null : i;
}
function Ky(e, t, n) {
	if (n === "in") {
		let n = Wy(e, t.key, !0);
		return n === null ? null : {
			parent: n,
			before: null
		};
	}
	if (n === "out") {
		let n = Wy(e, t.key, !1);
		return n === null ? null : {
			parent: n,
			before: Yy(e, n, t.parent, !1)
		};
	}
	let r = Jy(e, t.parent), i = r.findIndex((e) => e.key === t.key), a = n === "up" ? -1 : 1, o = i + a;
	for (; o >= 0 && o < r.length && r[o].shown === !1;) o += a;
	return o < 0 || o >= r.length ? null : {
		parent: t.parent,
		before: n === "up" ? r[o].key : r[o + 1]?.key ?? null
	};
}
function qy(e, t) {
	return t.length === 0 || e.find((e) => e.key === t)?.takesDrop === !0;
}
function Jy(e, t) {
	return e.filter((e) => e.parent === t);
}
function Yy(e, t, n, r, i = /* @__PURE__ */ new Set()) {
	let a = Jy(e, t);
	for (let e = a.findIndex((e) => e.key === n) + 1; e > 0 && e < a.length; e++) if (!i.has(a[e].key) && (!r || a[e].shown !== !1)) return a[e].key;
	return null;
}
function Xy(e, t, n) {
	let r = Jy(e, n.parent).map((e) => e.key), i = new Set(t), a = n.before !== null && i.has(n.before) ? Yy(e, n.parent, n.before, !1, i) : n.before, o = [], s = null;
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
var Zy = "drop:", Qy = "ui-row--cut", $y = {
	code: "KeyX",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, eb = {
	code: "KeyC",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
}, tb = {
	code: "KeyV",
	ctrl: !0,
	shift: !1,
	alt: !1,
	meta: !1
};
function nb(e) {
	return {
		dynamicParameters: (e) => {
			let t = rb(e.domEvent);
			return t === null ? null : [...e.dynamicParameters, JSON.stringify(t.drop)];
		},
		...X_((t) => ib(e, t), (t) => e?.settle(t))
	};
}
function rb(e) {
	let t = e instanceof CustomEvent ? e.detail : null;
	return t?.drop === void 0 ? null : t;
}
function ib(e, t) {
	let n = rb(t)?.transfer ?? null;
	return n === null || e === void 0 ? null : e.ahead(n.source, n.target, n.keys, n.index);
}
var ab = class {
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
		let t = uv(e), n = e.target instanceof Element ? e.target : null, r = t === null || n === null ? null : this.targetOf(t, n);
		if (t === null || n === null || r === null) return null;
		let i = ob(t, r, sb(e)), a = i === null ? null : this.landingOf(r, n, e);
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
		return n === null || T(n) ? null : n;
	}
	landingOf(e, t, n) {
		let r = e.matches(".ui-items-view, .ui-table") ? Jo(e) : null;
		if (r !== null) {
			let i = yy(r), a = hy(e, r), o = dy(r, this.options.keysOf), s = t !== null && n !== null ? uy(r, t, n, a, i) : cb(i);
			return {
				index: ((s === null ? null : ly(o, j(s.anchor), s.side)) ?? o.length) + Q_(r),
				folder: null,
				list: r,
				mark: () => s === null ? e.setAttribute(_e, "") : by(e, s, _y(i, s, a))
			};
		}
		if (e.classList.contains("ui-tree")) {
			let n = lb(e, t ?? document.activeElement);
			if (n === null) return null;
			let r = n.length === 0 ? Jo(e) : ub(e, n);
			return {
				index: null,
				folder: n,
				list: null,
				mark: () => Uy(e, r)
			};
		}
		return {
			index: null,
			folder: null,
			list: null,
			mark: () => e.setAttribute(_e, "")
		};
	}
	unmark() {
		let e = this.marked;
		this.marked = null, e !== null && (e.removeAttribute(_e), e.matches(".ui-items-view, .ui-table") ? by(e, null) : e.classList.contains("ui-tree") && Uy(e, null));
	}
	handleDragLeave(e) {
		this.marked !== null && e instanceof DragEvent && nv(e, this.marked) && this.unmark();
	}
	handleDrop(e) {
		let t = e instanceof DragEvent ? this.dropOf(e) : null;
		t !== null && (e.preventDefault(), this.unmark(), this.drop(t.drag, t.target, t.effect, t.landing));
	}
	drop(e, t, n, r) {
		let i = n === "move" && r.list !== null && r.index !== null && e.root.matches(".ui-items-view, .ui-table") && t.getAttribute("data-ui-drag-kind") === e.kind && Z_(e.host) === "plain" && Z_(r.list) === "plain", a = {
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
		t.dispatchEvent(new CustomEvent(Zy + e.kind, {
			bubbles: !0,
			detail: a
		}));
	}
	endDrag() {
		this.unmark(), dv();
	}
	handleKeyDown(e) {
		if (!(!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element))) {
			if (e.key === "Escape") {
				this.letGo();
				return;
			}
			Iy(e.target) || (Sy(tb, e) ? this.paste(e, e.target) : Sy($y, e) ? this.take(e, e.target, !0) : Sy(eb, e) && this.take(e, e.target, !1));
		}
	}
	letGo() {
		for (let e of this.clipboard?.items.rows ?? []) (A(e) ?? e).classList.remove(Qy);
		this.clipboard = null;
	}
	paste(e, t) {
		let n = this.clipboard, r = n === null ? null : this.targetOf(n.items, t), i = n === null || r === null ? null : ob(n.items, r, !n.cut), a = r === null || i === null ? null : this.landingOf(r, null, null);
		n !== null && r !== null && i !== null && a !== null && (e.preventDefault(), this.drop(n.items, r, i, a), n.cut && this.letGo());
	}
	take(e, t, n) {
		let r = document.getSelection();
		if (r !== null && !r.isCollapsed) return;
		let i = es(t), a = i === null ? null : Jo(i.root);
		if (i === null || a === null || T(i.root) || !i.root.hasAttribute("data-ui-drag-kind")) return;
		let o = [...a.children].filter((e) => e instanceof HTMLElement && e.matches(Ao) && A(e) !== null), s = i.row ?? ns(o), c = s === null || !sv(s) ? null : av(i.root, a, ov(s, o));
		if (!(c === null || !c.effects.has(n ? "move" : "copy")) && (e.preventDefault(), this.letGo(), this.clipboard = {
			items: c,
			cut: n
		}, n)) for (let e of c.rows) (A(e) ?? e).classList.add(Qy);
	}
};
function ob(e, t, n) {
	let r = n || t.getAttribute("data-ui-drag-kind") !== e.kind ? "copy" : "move";
	return e.effects.has(r) ? r : n ? null : r === "move" ? "copy" : "move";
}
function sb(e) {
	return Oy() ? e.altKey : e.ctrlKey;
}
function cb(e) {
	let t = rs(e);
	return t === null ? null : {
		anchor: t,
		side: "after"
	};
}
function lb(e, t) {
	let n = t?.closest(".ui-tree__row") ?? null;
	return n === null || n.closest(".ui-tree") !== e ? "" : Hy(n, (t) => ub(e, t));
}
function ub(e, t) {
	return e.querySelector(`.${pn}[${_}="${Cr(t)}"]`);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var z = "ui-temporal-input", db = "ui-calendar", fb = `.${z}, .${db}`, pb = "ui-temporal-input__value-input", mb = "ui-temporal-input__end-value-input", hb = "data-ui-temporal-range", gb = "data-ui-temporal-end", _b = "data-ui-temporal-mode", vb = "data-ui-temporal-format", yb = "data-ui-temporal-default-format", bb = "data-ui-temporal-min", xb = "data-ui-temporal-max", Sb = "data-ui-temporal-step", Cb = "data-ui-temporal-step-unit", wb = "data-ui-temporal-marked-days", Tb = "data-ui-temporal-marked-only", Eb = "data-ui-temporal-page-culture", Db = "data-ui-temporal-months", Ob = "data-ui-temporal-months-genitive", kb = "data-ui-temporal-months-short", Ab = "data-ui-temporal-daynames", jb = "data-ui-temporal-weekdays", Mb = "data-ui-temporal-first-day", Nb = "data-ui-temporal-am", Pb = "data-ui-temporal-pm", Fb = /* @__PURE__ */ new Set([
	vb,
	yb,
	bb,
	xb,
	Db,
	Nb,
	Pb,
	wb,
	Tb
]), Ib = 2e3;
function Lb(e) {
	let t = e.getAttribute(_b);
	return t === "time" || t === "date-time" ? t : "date";
}
function Rb(e) {
	let t = e.getAttribute(vb);
	return t === null || t.trim().length === 0 ? e.getAttribute(yb) ?? "" : t;
}
function zb(e) {
	let t = e.getAttribute(Cb), n = Math.max(1, Math.trunc(Number(e.getAttribute(Sb))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Bb(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Vb(e) {
	return {
		monthNames: Hb(e, Db),
		monthGenitiveNames: Hb(e, Ob),
		abbreviatedMonthNames: Hb(e, kb),
		dayNames: Hb(e, Ab),
		abbreviatedDayNames: Hb(e, jb),
		amDesignator: e.getAttribute(Nb) ?? "AM",
		pmDesignator: e.getAttribute(Pb) ?? "PM"
	};
}
function Hb(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Ub(e, t) {
	e.hasAttribute(Eb) && (qb(e, Ob, t.monthGenitiveNames.join("|")), qb(e, kb, t.abbreviatedMonthNames.join("|")), qb(e, Ab, t.dayNames.join("|")), qb(e, jb, t.abbreviatedDayNames.join("|")), qb(e, Db, t.monthNames.join("|")), qb(e, Nb, t.amDesignator), qb(e, Pb, t.pmDesignator), qb(e, yb, Kb(Lb(e), zb(e), t)));
}
function Wb(e) {
	for (let t = 0; t < e.length;) {
		let n = Ai(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Gb(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function Kb(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : xi(n, r);
}
function qb(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Jb(e) {
	return e.hasAttribute(hb);
}
function Yb(e) {
	return e !== null && e.hasAttribute(gb);
}
function Xb(e) {
	return B(e, !1);
}
function B(e, t) {
	let n = Zb(e, t);
	return n === null ? null : lx(n.value, Lb(e));
}
function Zb(e, t) {
	return e.querySelector(`.${t ? mb : pb}`);
}
function Qb(e, t) {
	return lx(e.getAttribute(t) ?? "", Lb(e));
}
function $b(e) {
	let t = Qb(e, bb), n = Qb(e, xb), r = (e.getAttribute(wb) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : ux(t, "date"),
		max: n === null ? null : ux(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(Tb)
	};
}
function ex(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function tx(e, t, n) {
	let r = Zb(e, n);
	if (r === null) return;
	let i = t === null ? "" : ux(t, Lb(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function nx(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Bi(n, Rb(e), Vb(e));
	return r === null ? n : ux(Fi(r), Lb(e));
}
function rx(e) {
	if (!Jb(e)) return;
	let t = B(e, !1), n = B(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (tx(e, n, !1), tx(e, t, !0));
}
function ix(e) {
	let t = Qb(e, bb), n = Qb(e, xb);
	if (t === null && n === null) return null;
	for (let r of Jb(e) ? [!1, !0] : [!1]) {
		let i = B(e, r);
		if (i !== null && t !== null && i.getTime() < t.getTime()) return {
			key: "ui.value.before",
			args: { min: Ti(t, Rb(e), Vb(e)) }
		};
		if (i !== null && n !== null && i.getTime() > n.getTime()) return {
			key: "ui.value.after",
			args: { max: Ti(n, Rb(e), Vb(e)) }
		};
	}
	return null;
}
function ax(e) {
	return sx(e, ox(e, /* @__PURE__ */ new Date()));
}
function ox(e, t) {
	let n = Qb(e, bb), r = Qb(e, xb);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function sx(e, t) {
	let n = zb(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var cx = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function lx(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = cx.exec(n);
		return e === null ? null : new Date(Ib, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Pi(n);
	return r === null ? null : Fi(r);
}
function ux(e, t) {
	let n = `${dx(e.getHours())}:${dx(e.getMinutes())}:${dx(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${dx(e.getMonth() + 1)}-${dx(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function dx(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function fx(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = hx(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < gx(e.start).getTime() ? {
		start: hx(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: hx(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function px(e, t, n) {
	if (t === null || n === null) return !1;
	let r = gx(e).getTime();
	return r > gx(t).getTime() && r < gx(n).getTime();
}
function mx(e, t, n) {
	return !n && px(e, t.start, t.end);
}
function hx(e, t) {
	return Ii(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function gx(e) {
	return Ii(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var _x = "ui-temporal-input__day", vx = "ui-temporal-input__month", yx = "data-ui-temporal-nav", bx = "data-ui-temporal-day", xx = 366;
function Sx(e) {
	let t = Xb(e);
	return {
		view: Ux(t ?? ox(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function Cx(e, t, n, r) {
	let i = V("div", `${z}__calendar`), a = V("div", `${z}__calendar-header`), o = $b(e), s = Hx("previous", "‹", w.text("ui.picker.previous"));
	s.disabled = wx(o, t, -1) === null, a.append(s);
	let c = Hx("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${z}__calendar-label`), a.append(c);
	let l = Hx("next", "›", w.text("ui.picker.next"));
	return l.disabled = wx(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? Ox(e, t, n, r, o) : kx(t, n, o)), i;
}
function wx(e, t, n) {
	let r = t.pane === "months", i = Kx(t.view, n * (r ? 12 : 1));
	return Ex(e, Tx(i, r ? 4 : 7)) ? Dx(e, i) : null;
}
function Tx(e, t) {
	return ux(e, "date").slice(0, t);
}
function Ex(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function Dx(e, t) {
	let n = Tx(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : lx(r, "date");
	return i === null ? t : Ux(i);
}
function Ox(e, t, n, r, i) {
	let a = zx(e), o = V("div", `${z}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = V("span", `${z}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = V("div", `${z}__days`), c = gx(/* @__PURE__ */ new Date()), l = Jb(e), u = l ? B(e, !1) : r, d = l ? B(e, !0) : null, f = Wx(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = Gx(f, e), r = ux(n, "date"), a = V("button", _x);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(bx, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${_x}--outside`), qx(n, c) && (a.classList.add(`${_x}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${_x}--marked`);
		let o = u !== null && qx(n, u), p = d !== null && qx(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${_x}--selected`), l && (o || p) && a.setAttribute("aria-description", w.text(o ? "ui.picker.start" : "ui.picker.end")), mx(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${_x}--within`), ex(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = V("div", `${z}__calendar-pane`);
	return p.append(o, s), p;
}
function kx(e, t, n) {
	let r = V("div", `${z}__months`);
	for (let i = 0; i < 12; i++) {
		let a = V("button", vx);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(yx, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${vx}--selected`), a.setAttribute("aria-current", "true")), Ex(n, Tx(Ii(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function Ax(e) {
	let t = V("div", `${z}__period-caption`);
	return t.textContent = w.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function jx(e, t, n) {
	let r = $b(e);
	if (n.startsWith("month:")) {
		let e = Ii(t.view.getFullYear(), Number(n.slice(6)), 1);
		return Ex(r, Tx(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = wx(r, t, -1) ?? t.view, !0;
		case "next": return t.view = wx(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function Mx(e, t, n) {
	if (Jb(e)) {
		Nx(e, t, n);
		return;
	}
	let r = Px(n, Xb(e) ?? ax(e));
	t.focusedDay = r, t.view = Ux(r), tx(e, r, !1);
}
function Nx(e, t, n) {
	let r = fx({
		start: B(e, !1),
		end: B(e, !0)
	}, t.activeEnd, Px(n, ax(e)));
	t.focusedDay = r.end ?? r.start, t.view = Ux(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, tx(e, r.end, !0), tx(e, r.start, !1);
}
function Px(e, t) {
	return Ii(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Fx(e, t, n) {
	let r = Lx(n), i = Rx(t, n, zx(e));
	if (i === null) return null;
	let a = $b(e);
	if (r === 0) return Ix(a, i);
	let o = i;
	for (let e = 0; e < xx; e++) {
		if (ex(a, ux(o, "date"))) return o;
		o = Gx(o, r);
	}
	return t;
}
function Ix(e, t) {
	let n = ux(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : lx(r, "date");
	return i === null ? t : Px(i, t);
}
function Lx(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function Rx(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Gx(e, -1);
		case "ArrowRight": return Gx(e, 1);
		case "ArrowUp": return Gx(e, -7);
		case "ArrowDown": return Gx(e, 7);
		case "PageUp": return Kx(e, -1);
		case "PageDown": return Kx(e, 1);
		case "Home": return Gx(e, -r);
		case "End": return Gx(e, 6 - r);
		default: return null;
	}
}
function zx(e) {
	let t = Number(e.getAttribute(Mb));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Bx(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${_x}`)];
	if (i.length === 0) return;
	let a = ux(gx(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (O(i, o), r && M(o));
}
function Vx(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? B(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${_x}`)) {
		let e = lx(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${_x}--preview`, e !== null && n !== null && r !== null && px(e, n, Gx(r, 1)));
	}
}
function Hx(e, t, n) {
	let r = V("button", `${z}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(yx, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function V(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Ux(e) {
	return Ii(e.getFullYear(), e.getMonth(), 1);
}
function Wx(e, t) {
	let n = Ux(e);
	return Gx(n, -((n.getDay() - t + 7) % 7));
}
function Gx(e, t) {
	return Ii(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Kx(e, t) {
	let n = Ii(e.getFullYear(), e.getMonth() + t, 1), r = Ii(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Ii(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function qx(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Jx = "ui-temporal-input__field", Yx = "ui-temporal-input__popup", Xx = "ui-temporal-input--open", Zx = "ui-calendar__body", H = "ui-temporal-input__time-cell", Qx = "ui-temporal-input__time-column", $x = 140, eS = "data-ui-temporal-toggle", tS = "data-ui-temporal-unit", nS = "data-ui-temporal-cell", rS = "data-ui-temporal-centred", iS = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new du({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(Xx), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(Xx);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(fb)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = ci(e.components, fb), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && aS(e) && this.states.set(e, Sx(e)), this.isShowing(e) && this.renderSurface(e);
		}), P(this.root, fb, { attributeFilter: [...Fb] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), P(this.root, fb, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), w.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) aS(e) && oS(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(fb)], t = w.temporal;
		if (t !== null && w.language !== this.drawnLanguage) {
			this.drawnLanguage = w.language;
			for (let n of e) Ub(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || aS(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${Zx}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && oS(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			let e = Ri(Rb(t), xS()), n = ki(Rb(t)) ? "numeric" : "text";
			for (let r of t.querySelectorAll(`.${Jx}`)) {
				if (r.placeholder !== e && (r.placeholder = e), r.inputMode !== n && (r.inputMode = n), r === document.activeElement && this.written.has(r)) continue;
				this.written.add(r);
				let i = Zb(t, Yb(r))?.value ?? "", a = lx(i, Lb(t));
				if (a !== null) {
					r.value = Ti(a, Rb(t), Vb(t));
					continue;
				}
				i.length === 0 && (r.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Jx)) return;
		let t = e.target.closest(`.${z}`), n = t === null ? null : Zb(t, Yb(e.target));
		if (t === null || n === null) return;
		let r = nx(t, e.target.value), i = lx(r, Lb(t)), a = i === null ? r : ux(i, Lb(t));
		if (sS(t, a)) {
			let n = B(t, Yb(e.target));
			e.target.value = n === null ? "" : Ti(n, Rb(t), Vb(t));
			return;
		}
		Yb(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), rx(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Jx)) return;
		let t = e.target.closest(`.${z}`);
		t !== null && Jb(t) && (this.getState(t).activeEnd = Yb(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Jb(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${bx}]`) : null, r = this.getState(t), i = n === null ? null : lx(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Vx(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${bx}], .${H}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(H) ? wS(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = oS(e), r = lx(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, O([...n.querySelectorAll(`.${_x}`)], t), As(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Jx)) return;
		let t = e.target.closest(`.${z}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${eS}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${z}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${yx}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${bx}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${nS}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${tS}]`)?.getAttribute(tS);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(nS)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (jx(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, ax(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Jb(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = lx(t, "date");
		if (n === null || D(e) || T(e) || !ex($b(e), t)) return;
		let r = this.getState(e);
		aS(e) && Jb(e) && !r.choosingEnd && B(e, !1) !== null && B(e, !0) !== null && (r.activeEnd = "start");
		let i = Zb(e, !1), a = `${i?.value ?? ""}|${Zb(e, !0)?.value ?? ""}`;
		Mx(e, r, n), aS(e) && `${i?.value ?? ""}|${Zb(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Jb(e) && this.getState(e).activeEnd === "end", i = new Date(B(e, r) ?? ax(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		tx(e, t, n), rx(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Jx)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${z}`), Yb(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(H)) {
			TS(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = lx(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, ux(n, "date"));
			return;
		}
		let r = Fx(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Ux(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Qx}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, $x)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Qx}`), n = t?.getAttribute(tS) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = Af(this.wheelTurns.get(n) ?? 0, kf(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${H}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${H}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${H}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(nS)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(rS));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(tS), i = gS(e);
		if (!(r === null || i === null || i.classList.contains(`${H}--selected`))) {
			if (i.matches(":disabled")) {
				mS(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(nS)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${Yx}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Jb(e) ? t ?? (B(e, !1) === null ? "start" : B(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = B(e, r.activeEnd === "end") ?? Xb(e);
		r.pane = "days", r.view = Ux(i ?? ox(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${eS}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: { placement: "bottom-end" },
			openers: a === null ? [] : [a],
			returnFocus: () => CS(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = Sx(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = oS(e);
		if (n === null) return;
		let r = aS(e), i = Lb(e), a = this.getState(e), o = Vb(e), s = Jb(e), c = B(e, s && a.activeEnd === "end"), l = _S(n), u = vS(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(Ax(a)), r) n.append(Cx(e, a, o, c));
		else {
			let t = V("div", `${z}__panes`);
			t.append(Cx(e, a, o, c)), i === "date-time" && t.append(cS(e, c)), n.append(t, bS(i));
		}
		let f = u === null ? null : n.querySelector(`[${yx}="${Cr(u)}"]:not(:disabled)`);
		Bx(n, a, c, t || d && l === null && f === null), Vx(e, a), r || (pS(n), mS(n), yS(n, l)), f !== null && M(f), r || this.popups.reposition(e);
	}
};
function aS(e) {
	return e.classList.contains(db);
}
function oS(e) {
	return e.querySelector(`.${aS(e) ? Zx : Yx}`);
}
function sS(e, t) {
	let n = $b(e), r = n.markedOnly ? lx(t, Lb(e)) : null;
	return r !== null && !n.marked.has(ux(r, "date"));
}
function cS(e, t) {
	let n = zb(e), r = V("div", `${z}__time`), i = V("div", `${z}__time-columns`);
	for (let r of lS(n)) i.append(fS(e, r, uS(n, r), t));
	return r.append(i), r;
}
function lS(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function uS(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function dS(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function fS(e, t, n, r) {
	let i = V("div", Qx);
	i.setAttribute(tS, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", w.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = dS(r, t), s = t === "hour" && Wb(Rb(e)), c = Vb(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = V("button", H);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Gb(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(nS, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${H}--selected`), kS(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function pS(e) {
	let t = e.querySelector(`.${z}__calendar`), n = e.querySelector(`.${z}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function mS(e) {
	for (let t of e.querySelectorAll(`.${Qx}`)) {
		let e = t.querySelector(`.${H}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, hS(t, e), t.setAttribute(rS, String(t.scrollTop));
	}
}
function hS(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function gS(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${H}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function _S(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(H) ? null : t.closest(`.${Qx}`)?.getAttribute(tS) ?? null;
}
function vS(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(yx) : null;
}
function yS(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${Qx}[${tS}="${t}"]`)?.querySelector(`.${H}--selected`) ?? null;
	n !== null && M(n);
}
function bS(e) {
	let t = V("div", `${z}__popup-footer`);
	return t.append(Hx("now", w.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Hx("clear", w.text("ui.picker.clear"))), t.append(Hx("done", w.text("ui.picker.done"))), t;
}
function xS() {
	return {
		year: SS("ui.picker.letter.year", Li.year),
		month: SS("ui.picker.letter.month", Li.month),
		day: SS("ui.picker.letter.day", Li.day),
		hour: SS("ui.picker.letter.hour", Li.hour),
		minute: SS("ui.picker.letter.minute", Li.minute),
		second: SS("ui.picker.letter.second", Li.second)
	};
}
function SS(e, t) {
	let n = w.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function CS(e, t) {
	for (let n of e.querySelectorAll(`.${Jx}`)) if (Yb(n) === t) return n;
	return e.querySelector(`.${Jx}`);
}
function wS(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(H) && As(e);
}
function TS(e) {
	let t = e.target, n = t.closest(`.${Qx}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? DS(n, e.key === "ArrowRight" ? 1 : -1) : ES(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), OS(r));
}
function ES(e, t, n) {
	return _o({
		key: n,
		items: [...e.querySelectorAll(`.${H}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function DS(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Qx}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${H}--selected`) ?? r.querySelector(`.${H}:not(:disabled)`);
}
function OS(e) {
	let t = e.closest(`.${Qx}`);
	t !== null && hS(t, e);
}
function kS(e, t, n, r) {
	let i = Qb(e, bb), a = Qb(e, xb);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var AS = "[data-ui-theme-switcher]", jS = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(AS) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Or.SetTheme,
				mode: MS() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function MS() {
	let e = document.documentElement.getAttribute(Rn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var NS = `[${Vn}]`, PS = "ui-language-switcher__trigger", FS = "ui-language-switcher__label-text", IS = "ui-language-switcher__label-text--current", LS = "ui-language-switcher__label-text--page", RS = "ui-language-switcher__menu", zS = "ui-language-switcher__choice", BS = "ui-language-switcher--open", VS = "ui.language.switch", HS = "ui.language.current", US = class {
	options;
	root;
	menus = new du({
		show: ({ owner: e }) => e.classList.add(BS),
		hide: ({ owner: e }) => e.classList.remove(BS),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), w.onChange(() => this.showLanguage(w.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zS}`), n = e.target.closest(NS);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(Hn));
			return;
		}
		let r = e.target.closest(`.${PS}`);
		if (r === null || T(r)) return;
		e.preventDefault();
		let i = WS(n);
		if (i.length === 2) {
			let e = w.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(NS);
		if (t === null) return;
		let n = WS(t), r = e.target.closest(`.${PS}`);
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
		let t = e.target.closest(`.${zS}`);
		if (t === null || t === document.activeElement || T(t)) return;
		let n = t.closest(NS);
		n !== null && this.menus.isOpen(n) && As(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${RS}`);
		if (r === null) return;
		let i = WS(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
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
				kind: Or.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(NS)) {
			let n = t.querySelector(`:scope > .${PS}`);
			if (n === null) continue;
			let r = WS(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${FS}`)) {
				let n = t.getAttribute(Hn) === e;
				t.classList.toggle(IS, n), t.classList.contains(LS) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				w.write(n, "aria-label", VS, {
					language: GS(r, e),
					code: KS(e),
					other: GS(r, t),
					otherCode: KS(t)
				});
			} else w.write(n, "aria-label", HS, {
				language: GS(r, e),
				code: KS(e)
			});
		}
	}
};
function WS(e) {
	return [...e.querySelectorAll(`:scope > .${RS} > .${zS}`)];
}
function GS(e, t) {
	let n = e.find((e) => e.getAttribute(Hn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return KS(t);
	}
}
function KS(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/interactions/action-bar.ts
var qS = `${ke}__button`, JS = `${ke}__more`, YS = `.${y}:not(${Jt})`, XS = "ui-text__icon", ZS = `.ui-button__content .${XS}`, QS = ".ui-button__content .ui-text__title", $S = /* @__PURE__ */ new WeakMap();
function eC(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(YS)) tC(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(Yt) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function tC(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function nC(e, t) {
	let n = t.entries.map((e) => rC(e, t));
	return t.more && t.openMore !== void 0 && n.push(aC(t.openMore)), e.replaceChildren(...n), n;
}
function rC(e, t) {
	let n = oC(qS), r = cC(e), i = iC(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), T(e) && (n.classList.add(or), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), $S.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function iC(e) {
	let t = e.querySelector(ZS);
	if (t === null || !t.className.split(" ").some(af)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(XS), n.setAttribute(ef, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(tf);
	return r.length > 0 && n.style.setProperty(tf, r), n;
}
function aC(e) {
	let t = oC(`${qS} ${JS}`);
	return t.setAttribute("aria-haspopup", "menu"), w.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function oC(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${_r}`, t.tabIndex = -1, t;
}
function sC(e) {
	return $S.get(e) ?? null;
}
function cC(e) {
	return e.querySelector(QS)?.textContent?.trim() ?? "";
}
//#endregion
//#region src/interactions/long-press.ts
var lC = 500, uC = 10, dC = /* @__PURE__ */ new WeakSet();
function fC(e) {
	return dC.has(e);
}
var pC = class {
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
			timer: setTimeout(() => this.fire(), lC)
		};
	}
	handleMove(e) {
		let t = e, n = this.press, r = this.openedAt;
		r !== null && t.pointerId === r.pointerId && Math.hypot((t.clientX ?? r.x) - r.x, (t.clientY ?? r.y) - r.y) > uC && (this.slid = !0), n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > uC && this.cancel();
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
		dC.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null, this.openedAt = this.answered === null ? null : {
			pointerId: e.pointerId,
			x: e.x,
			y: e.y
		};
	}
	handleContextMenu(e) {
		if (!dC.has(e)) {
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
}, mC = "tabs:rename", hC = "tabs:pin", gC = "tabs:unpin", _C = "tabs:close", vC = "tabs:delete";
function yC(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function bC(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[mC, e.rename && t.renamable],
		[hC, e.pin && !t.pinned],
		[gC, e.pin && t.pinned],
		[_C, e.close && !e.delete && n],
		[vC, e.delete && n]
	]);
}
function xC(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var SC = "data-ui-context-menu-owner", CC = Se, wC = "ui-context-menu--open", TC = `.${y}:not(${Jt})`, EC = `${ke}--strip`, DC = `.${ke}:not(.${EC}) > .${JS}`, OC = "input, textarea, select, [contenteditable=''], [contenteditable='true']", kC = "ui-context-menu-opening", AC = Xt, jC = class {
	root;
	closed = null;
	menus = new du({
		show: ({ popup: e }) => e.classList.add(wC),
		hide: ({ popup: e }, t) => {
			e.classList.remove(wC), this.closed = e, t === "outside" && WC();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new pC({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${SC}]`) !== null && e.closest(OC) === null
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
		let n = MC(t);
		n !== null && (e.preventDefault(), this.open(n.owner, n.menu, e.clientX, e.clientY, LC(e) ? t : null, t.closest(DC)));
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${EC}`)?.remove(), RC(t), i !== null && zC(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && VC(t), this.closed !== null && (Wc(this.closed), this.closed = null);
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
		}) && (a === null && Pl(t, n, r), UC(t));
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(AC) !== null || this.menus.close();
	}
};
function MC(e) {
	let t = e.closest(`[${fe}]`);
	for (let n = e.closest(`[${SC}]`); n !== null; n = n.parentElement?.closest(`[${SC}]`) ?? null) {
		if (t !== null && n.contains(t)) return null;
		let r = PC(n, e);
		if (r.length === 0 || T(n)) continue;
		if (KC(n)) return null;
		let i = r.find((t) => FC(t, e, !1));
		if (i !== void 0) return {
			owner: n,
			menu: i
		};
	}
	return null;
}
var NC = `[${SC}]`;
function PC(e, t) {
	let n = t.closest(`[${Ce}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? GC(e, r) : null, GC(e, "")].filter((e) => e !== null);
}
function FC(e, t, n) {
	let r = new CustomEvent(kC, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function IC(e, t) {
	let n = e.closest(`[${SC}]`), r = e.closest(`[${fe}]`);
	return n === null || T(n) || KC(n) || r !== null && n.contains(r) ? null : PC(n, e).find((n) => FC(n, e, t)) ?? null;
}
function LC(e) {
	let t = e.pointerType;
	return fC(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Os();
}
function RC(e) {
	for (let t of e.querySelectorAll(`[${De}]`)) t.removeAttribute(De);
}
function zC(e, t, n) {
	let r = n.closest(`[${we}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !PC(e, r).includes(t)) return;
	let { entries: i } = eC(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${ke} ${EC}`, a.setAttribute("role", "group"), nC(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: BC
	}), t.insertBefore(a, t.firstElementChild);
}
function BC(e) {
	T(e) || e.click();
}
function VC(e) {
	let { entries: t } = eC(e), n = e.querySelector(`.${Wt}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) HC(e);
	let r = I(n, `.${y}`, `.${Wt}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && tC(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Jt)) ? HC(t) : i.push(t);
	}
	let a = i.map((e) => {
		let t = e.getAttribute(Ut);
		return t === "separator" ? "rule" : t === "header" ? "hidden" : "shown";
	});
	xC(a).forEach((e, t) => {
		a[t] === "rule" && !e && HC(i[t]);
	});
}
function HC(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(De, "");
}
function UC(e) {
	let t = e.querySelector(`.${Wt}`);
	t !== null && Us(e, I(t, TC, `.${Wt}`));
}
function WC() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${hs}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function GC(e, t) {
	for (let n of e.querySelectorAll(`[${CC}]`)) if ((n.getAttribute(CC) ?? "") === t && n.closest(`[${SC}]`) === e) return n;
	return null;
}
function KC(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${_}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function qC(e, t) {
	let n = getComputedStyle(e), r = t ? n.overflowY : n.overflowX;
	return r === "auto" || r === "scroll";
}
function JC(e) {
	return getComputedStyle(e).display !== "none";
}
function YC(e) {
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
				if (e.overflowX !== "visible" && QC(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && QC(n, a, a + t.clientHeight, !1), $C(n)) return !0;
			}
			r = e.position;
		}
	}
	return QC(n, 0, window.innerWidth, !0), QC(n, 0, window.innerHeight, !1), $C(n);
}
function XC(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (!(n.classList.contains("ui-scroll-y--disabled") && !qC(n, !1)) && (ZC(e.overflowX) || ZC(e.overflowY))) return n;
			t = e.position;
		}
	}
	return null;
}
function ZC(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function QC(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function $C(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var ew = `[${we}]`, tw = `[${Bl}]:not([hidden]), dialog[open]`, nw = `.${ke}`, rw = `${ke}--out`, iw = 6, aw = "--ui-action-bar-gap", ow = 400, sw = /* @__PURE__ */ new WeakMap(), cw = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	Oe,
	...rr
], lw = class {
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
		if (n === null || n.closest(`${nw}, [data-ui-context-menu]`) !== null) return;
		let r = uw(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : pw(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? mw(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(nw) === null && LC(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(nw);
		if (n !== null) {
			this.isHostedBar(n) && O(xw(n), t);
			return;
		}
		Ds() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(dw(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(nw) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(k) && this.choose(dw(t));
			return;
		}
		let n = t.closest(nw);
		if (n !== null && t.classList.contains(qS)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest(tw);
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(k)) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(k) && this.choose(dw(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && Tw(this.cameFrom) && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : Ws(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = xw(t), i = _o({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : pw(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = XC(e);
		if (t === void 0 || n === null || !qC(n, !0)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + gw(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, ll(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		IC(e, !0) === null && this.hide(e, t);
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
				this.chosen = mw(e), this.sync();
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
		let t = IC(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = ke, n.setAttribute("role", "toolbar"), w.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(Ue, ""), n.setAttribute(me, ""), !_w(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, bw(e)), rl(e, n, {
			placement: hw(e),
			gap: gw(e),
			boundary: XC(e) ?? void 0
		}), n.classList.toggle(rw, YC(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: cw
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		}), sw.set(n, Date.now());
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : sC(r);
		if (!_w(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = xw(t.bar), o = a.find((e) => sC(e) === i) ?? a.find(bo) ?? null;
		o !== null && (O(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0 || Cw(t)) return;
		if (this.menuHost = e, ww(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		vw(n.bar, !0);
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
		vw(t.bar, !1);
		let n = document.activeElement;
		!Ds() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && yw(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), ul(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(rw, YC(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : xw(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function uw(e) {
	let t = e.closest(ew);
	if (t !== null) return t;
	let n = e.closest(`[${_}]`), r = e.closest(b);
	return n === null || r !== null && !r.contains(n) ? null : fw(n)[0] ?? null;
}
function dw(e) {
	if (e.matches(k)) for (let t of e.querySelectorAll(`[${Ae}]`)) {
		if (t.closest(k) !== e) continue;
		let n = fw(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(ew);
}
function fw(e) {
	let t = [...e.querySelectorAll(ew)];
	return e.matches(ew) ? [e, ...t] : t;
}
function pw(e) {
	let t = e.getAttribute(Te);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: Te,
		key: t,
		index: 0
	};
	let n = e.closest(`[${_}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: _,
		key: r,
		index: fw(n).indexOf(e)
	};
}
function mw(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return fw(t)[e.index] ?? null;
	return null;
}
function hw(e) {
	let t = e.getAttribute(we);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function gw(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(aw));
	return Number.isFinite(t) ? t : iw;
}
function _w(e, t, n, r) {
	let { entries: i, more: a } = eC(t);
	if (i.length === 0 && !a) return !1;
	let o = nC(e, {
		entries: i,
		more: a,
		role: "button",
		press: Sw,
		openMore: n
	});
	return O(o, o.find((e) => !T(e)) ?? o[0] ?? null), vw(e, r), !0;
}
function vw(e, t) {
	yw(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function yw(e) {
	return xw(e).find((e) => sC(e) === null) ?? null;
}
function bw(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function xw(e) {
	return [...e.querySelectorAll(`:scope > .${qS}`)];
}
function Sw(e, t) {
	if (T(t) || Cw(t)) return;
	let n = IC(t, !1);
	n === null || !n.contains(e) || T(e) || !tC(e, n) || e.click();
}
function Cw(e) {
	let t = e.closest(nw), n = t === null ? void 0 : sw.get(t);
	return n !== void 0 && Os() && Date.now() - n < ow;
}
function ww(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
function Tw(e) {
	return e.matches(hs) || e.hasAttribute("tabindex");
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Ew = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Dw = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
}, Ow = `(min-width: ${Dw.md}px)`;
function kw(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Dw[t]}px)`)) return t;
	return "base";
}
function Aw(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function U(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function jw(e, t) {
	let n;
	for (let r of Ew) {
		let i = U(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/state/client-store.ts
var Mw = "ne.ui", Nw = "boot", Pw = /* @__PURE__ */ new Set(), Fw = class {
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
		let r = this.resolveKey(e, Nw);
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
		let n = e.getAttribute(Re);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Pw.has(n) || (Pw.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${Mw}:${n}:${t}`;
	}
}, Iw = "ui-menu--nested", Lw = "ui-menu__submenu", Rw = Nt, zw = Ft, Bw = "data-ui-menu-flyout", Vw = `[${Bw}], .ui-context-menu, .${dr}`, Hw = "data-ui-menu-unfolded", Uw = Pt, Ww = "menu-open-group", Gw = He("click"), Kw = class {
	root;
	store = new Fw();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new du({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(zw, ""), t.setAttribute(Bw, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(zw), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(Bw);
			}, N.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${Wt}`)), P(this.root, `.${Wt}`, {
			childList: !0,
			attributeFilter: [Mt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${Rw}]`)) qw(e);
		P(this.root, `[${Rw}]`, {
			childList: !0,
			attributeFilter: [zw]
		}, (e) => {
			for (let t of e) qw(t);
		}), typeof matchMedia == "function" && matchMedia(Ow).addEventListener("change", () => this.closeBarFlyout());
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Zw(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), Jw(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${Rw}]`)) qw(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Kt}`), e);
		if (t !== null && !t.hasAttribute(Uw)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Iw) ? null : this.store.read(e, Ww), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${Wt}`);
		a !== null && (Zw(a) || i.hasAttribute(Uw) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Iw);
		if (e.setAttribute(Hw, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(zw);
			return;
		}
		if (t.hasAttribute(zw)) {
			t.removeAttribute(zw), n || this.store.write(e, Ww, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Ww, t.getAttribute(_));
	}
	openInline(e) {
		e.setAttribute(zw, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${Rw}][${zw}]`)) t.hasAttribute(Uw) || t.removeAttribute(zw);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i) return;
		Jw(e), this.closeGroups(e);
		let a = n.closest(Vw) ?? void 0;
		if (!this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${Yw(e)}-start`,
				surface: a,
				alignEntries: !0
			}
		})) return;
		let o = r.querySelector(`:scope > .${Wt}`);
		o !== null && !Ds() && Us(o, I(o, `.${y}:not(${Jt})`, `.${Wt}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${Rw}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Yt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${Rw}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Lw}`);
	}
};
function qw(e) {
	let t = e.querySelector(`:scope > .${y}`), n = e.closest(`.${Wt}`);
	t !== null && (t.setAttribute(Gw, ""), t.setAttribute(Ue, ""), t.setAttribute("aria-expanded", e.hasAttribute(zw) ? "true" : "false"), e.hasAttribute(Uw) || n !== null && Zw(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function Jw(e) {
	for (let t of e.querySelectorAll(`[${Bw}]`)) t.removeAttribute(Bw);
}
function Yw(e) {
	return Xw(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function Xw(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(Ow).matches;
}
function Zw(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/rendering/inline-markup.ts
var Qw = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, $w = "\\", eT = "`", tT = "!", nT = "{", rT = "}", iT = "ui-text__fold", aT = "ui-text__fold-toggle", oT = "ui-text__fold-content", sT = 8;
function cT(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return bT(new kT(e), 0, e.length, Qw.None, null, t, n), xT(t, n, Qw.None, null), t;
}
function lT(e) {
	return cT(e).map((e) => mT(e) ? `${e.fold} ${lT(e.text)}` : e.text).join("");
}
function uT(e) {
	let t = "";
	for (let n of e) t += MT(n) ? $w + n : n;
	return t;
}
function dT(e, t, n = {}) {
	let r = cT(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && fT(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(hT(r, n));
}
function fT(e) {
	return e.styles === Qw.None && e.url === null && !pT(e) && !mT(e);
}
function pT(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function mT(e) {
	return e.fold !== null && e.fold !== void 0;
}
function hT(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(gT(r, t));
	return n;
}
function gT(e, t) {
	if (pT(e)) return vT(e.icon);
	let n = mT(e) ? _T(e, t) : document.createTextNode(e.text);
	if ((e.styles & Qw.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & Qw.Strikethrough) !== 0 && (n = yT("s", n)), (e.styles & Qw.Underline) !== 0 && (n = yT("u", n)), (e.styles & Qw.Italic) !== 0 && (n = yT("em", n)), (e.styles & Qw.Bold) !== 0 && (n = yT("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", zd(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function _T(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${iT} ${iT}--static` : iT, r.className = aT, r.textContent = e.fold ?? "", i.className = oT, i.append(hT(cT(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ue, ""), n.append(r, i), n);
}
function vT(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", nf(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function yT(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function bT(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === $w && c + 1 < n && MT(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = ST(e, c, n);
		if (l !== null) {
			xT(a, o, r, i), CT(s, c + 1, l, o), xT(a, o, r | Qw.Code, i), c = l + 1;
			continue;
		}
		let u = ET(e, c, n);
		if (u !== null) {
			xT(a, o, r, i), bT(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), xT(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = wT(e, c, n);
		if (d !== null) {
			xT(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? DT(e, c, n) : null;
		if (f !== null) {
			xT(a, o, r, i), bT(e, f.labelStart, f.labelEnd, r, f.url, a, o), xT(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = OT(e, c, n);
		if (p !== null) {
			xT(a, o, r, i), a.push({
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
function xT(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function ST(e, t, n) {
	let r = e.text;
	if (r[t] !== eT) return null;
	let i = t + 1;
	if (i >= n || NT(r[i])) return null;
	let a = e.findClosingMarker(i, n, eT, 1);
	return a > i ? a : null;
}
function CT(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === $w && i + 1 < n && MT(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function wT(e, t, n) {
	let r = e.text;
	if (r[t] !== tT || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return TT(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function TT(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function ET(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = Qw.Bold, s = 2;
	else if (i === "*") o = Qw.Italic, s = 1;
	else if (i === "_" && a) o = Qw.Underline, s = 2;
	else if (i === "~" && a) o = Qw.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || NT(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function DT(e, t, n) {
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
function OT(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== nT || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > sT) return null;
	let c = { value: "" };
	return CT(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var kT = class {
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
		return this.closeBrackets ??= this.next("]", !0), AT(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), AT(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), AT(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return AT(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = jT(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !NT(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = Id(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === $w && e[t - 1] === 0);
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
			if (this.text[r] === nT) n.push(r);
			else if (this.text[r] === rT && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || NT(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function AT(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function jT(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function MT(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === nT || e === rT || e === eT || e === $w;
}
function NT(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var PT = "ui-tooltip", FT = "ui-tooltip", IT = "ui-tooltip--visible", LT = "[aria-haspopup][aria-expanded=\"true\"]", RT = "a[href], button, input, select, textarea, label, [role='button'], [role='link'], [tabindex]", zT = "top", BT = 250, VT = 200, HT = 300, UT = 7, WT = null, GT = null, KT = null, qT = null, JT = null, YT = 0, XT = null, ZT = 0, QT = 0, $T = !1, eE = /* @__PURE__ */ new Set();
function tE(e) {
	eE.add(e);
}
function nE(e = document) {
	if ($T) return;
	$T = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", rE, !0), t.addEventListener("pointerout", oE, !0), t.addEventListener("focusin", cE, !0), t.addEventListener("focusout", lE, !0), t.addEventListener("keydown", uE, !0), t.addEventListener("scroll", aE, !0), t.addEventListener("pointerdown", dE, !0), t.addEventListener("click", fE, !0), window.addEventListener("blur", () => {
		qT = null, PE(!0);
	});
}
function rE(e) {
	if (iE(), mE(e.target)) {
		window.clearTimeout(ZT);
		return;
	}
	let t = hE(e.target);
	t !== null && t !== GT && bE(t);
}
function iE() {
	GT === null || GT.isConnected || (qT = null, PE(!0));
}
function aE(e) {
	if (iE(), GT === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(GT) || YC(GT) && (qT = null, PE(!0));
}
function oE(e) {
	if (qT !== null || JT !== null) return;
	let t = e.relatedTarget, n = GT ?? XT?.target ?? null, r = n === null ? null : sE(n);
	t instanceof Node && (r !== null && r.contains(t) || mE(t)) || (mE(e.target) || r !== null && e.target instanceof Node && r.contains(e.target)) && PE(!1);
}
function sE(e) {
	let t = e.parentElement?.closest("[data-ui-tooltip-mark]") ?? null;
	return t !== null && gE(t) === e ? t : e;
}
function cE(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = hE(e.target);
	t !== null && (qT = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, xE(t));
}
function lE(e) {
	hE(e.target) === GT && (qT = null, PE(!0));
}
function uE(e) {
	e.key === "Escape" && GT !== null && (qT = null, PE(!0));
}
function dE(e) {
	if (mE(e.target)) return;
	let t = pE(e.target);
	if (t !== null) {
		if (JT === t) {
			PE(!0);
			return;
		}
		qT = null, PE(!0), xE(t), JT = GT;
		return;
	}
	qT === null && PE(!0);
}
function fE(e) {
	pE(e.target) !== null && e.preventDefault();
}
function pE(e) {
	let t = hE(e);
	if (t === null || !t.hasAttribute("data-ui-tooltip-press") || !(e instanceof Element)) return null;
	let n = e.closest(RT);
	return n === null || n.contains(t) ? t : null;
}
function mE(e) {
	return WT !== null && e instanceof Node && WT.contains(e);
}
function hE(e) {
	if (!(e instanceof Element)) return null;
	let t = gE(e);
	for (let n of eE) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && yE(r).length > 0) return r;
	}
	return t;
}
function gE(e) {
	let t = e.closest(`[${je}], [${Ne}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector("[data-ui-tooltip][data-ui-tooltip-severity]") ?? t.querySelector("[data-ui-tooltip]");
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function _E(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t + vE(e) : yE(e);
}
function vE(e) {
	let t = "";
	for (let n of eE) {
		let r = n.anchor(e) === e ? n.after?.(e)?.trim() ?? "" : "";
		r.length > 0 && (t += ` ${r}`);
	}
	return t;
}
function yE(e) {
	for (let t of eE) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function bE(e, t) {
	if (qT === null && JT === null) {
		if (window.clearTimeout(ZT), XT !== null && XT.target === e) {
			XT.words = t;
			return;
		}
		if (window.clearTimeout(YT), XT = null, GT !== null) {
			PE(!0), xE(e, t);
			return;
		}
		if (Date.now() - QT < HT) {
			xE(e, t);
			return;
		}
		XT = {
			target: e,
			words: t
		}, YT = window.setTimeout(() => {
			let e = XT;
			XT = null, e !== null && xE(e.target, e.words);
		}, BT);
	}
}
function xE(e, t) {
	let n = (t ?? _E(e)).trim();
	if (n.length === 0 || !e.isConnected || SE(e) || YC(e)) return;
	window.clearTimeout(YT), window.clearTimeout(ZT), XT = null;
	let r = FE();
	dT(r, n, { staticFolds: !0 }), r.classList.add(IT), GT = e, wE(CE(e)), r.setAttribute("data-ui-tooltip-text", lT(n)), DE(r, e.getAttribute(Pe)), nl(e, r), rl(e, r, {
		placement: NE(e),
		gap: UT,
		arrow: !0
	});
}
function SE(e) {
	return e.matches(LT) || e.querySelector(LT) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function CE(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function wE(e) {
	KT !== null && KT !== e && TE();
	let t = EE(e);
	t.includes(FT) || e.setAttribute("aria-describedby", [...t, FT].join(" ")), KT = e;
}
function TE() {
	if (KT === null) return;
	let e = EE(KT).filter((e) => e !== FT);
	e.length === 0 ? KT.removeAttribute("aria-describedby") : KT.setAttribute("aria-describedby", e.join(" ")), KT = null;
}
function EE(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function DE(e, t) {
	t === null ? e.removeAttribute(Pe) : e.setAttribute(Pe, t);
}
function OE(e, t, n) {
	n?.delay === !0 && GT !== e ? bE(e, t) : xE(e, t);
}
function kE() {
	PE(!0);
}
var AE = {
	show: OE,
	hide: kE
};
function jE(e) {
	qT = e, xE(e);
}
function ME(e) {
	if (GT === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			qT = null, PE(!0);
			return;
		}
		xE(e);
	}
}
function NE(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of eE) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Me);
	return t !== null && Kc(t) ? t : zT;
}
function PE(e) {
	window.clearTimeout(YT), window.clearTimeout(ZT), XT = null;
	let t = () => {
		GT !== null && (TE(), GT = null, JT = null, WT !== null && (WT.classList.remove(IT), ul(WT)), QT = Date.now());
	};
	e ? t() : ZT = window.setTimeout(t, VT);
}
function FE() {
	return WT !== null && WT.isConnected ? WT : (WT = document.createElement("div"), WT.id = FT, WT.className = PT, WT.setAttribute("role", "tooltip"), WT.setAttribute("aria-hidden", "true"), document.body.append(WT), WT);
}
//#endregion
//#region src/interactions/menu-engine.ts
var IE = "ui-orientation--horizontal", LE = `.${qt} > .ui-menu__host > .ui-menu__item > .${y}`, RE = `${LE}, ${`.ui-menu[${Mt}] > .ui-menu__host > .ui-menu__item > .${y}`}`, zE = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", BE = "[role='menuitem'], [role='menuitemcheckbox']", VE = class {
	root;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), tE(HE), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			e.some(WE) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Rt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Wt}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && O(t, t.find((e) => e.classList.contains("ui-menu-item--selected") && bo(e)) ?? t.find(bo) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			UE(e, t);
			return;
		}
		let r = this.ownItems(n), i = _o({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(IE) || Xw(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(".ui-menu") ? t : t.querySelector(`.${Wt}`);
		if (n === null) return;
		let r = this.ownItems(n), i = _o({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(IE) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), O(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${y}`), n = t?.closest(".ui-menu") ?? null;
		t !== null && n !== null && O(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${y}`) : null;
		if (t === null || t === document.activeElement || !t.matches(BE) || t.matches(Jt) || !bo(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(".ui-menu")?.contains(n) === !0) && As(t);
	}
	ownItems(e) {
		return I(e, `.${y}:not(${Jt})`, `.${Wt}`);
	}
}, HE = {
	anchor: (e) => e.closest(RE),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(zE), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(LE) && t.scrollWidth <= t.clientWidth ? null : uT(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Wt}`);
		return t === null ? null : Yw(t);
	}
};
function UE(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(Jt) || !bo(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function WE(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(".ui-menu") !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains("ui-menu") || t.querySelector(".ui-menu") !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/shortcut-engine.ts
var GE = "shortcut:", KE = ":scope > .ui-menu-item__shortcut", qE = `[${Se}]`, JE = `[${Zt}]`, YE = ".ui-text__title", XE = class {
	root;
	options;
	claims = /* @__PURE__ */ new Map();
	entryShortcuts = /* @__PURE__ */ new Map();
	stale = !0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.options = e, this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), tE(oD), rD(this.root), this.root instanceof Node && new MutationObserver((e) => {
			this.stale = !0;
			for (let t of e) nD(t);
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Zt]
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.stale && this.rebuild(), this.claims.size === 0 && this.entryShortcuts.size === 0 || QE(e))) return;
		let t = Kl(this.root);
		if (!this.pressContextEntry(e, t)) for (let n of this.claims.values()) {
			if (n === null || !Sy(n.shortcut, e)) continue;
			let r = n.element ?? this.contentOf(n.view);
			if (r === null || !bo(r) || t !== null && !t.contains(r)) return;
			e.preventDefault(), tD(e), n.view === null ? r.click() : r.dispatchEvent(new CustomEvent(n.view.name, { bubbles: !0 }));
			return;
		}
	}
	pressContextEntry(e, t) {
		let n = !1;
		for (let t of this.entryShortcuts.values()) n ||= Sy(t, e);
		let r = n ? $E() : null;
		if (r === null || t !== null && !t.contains(r)) return !1;
		let i = MC(r);
		if (i === null) return !1;
		let a = [...i.menu.querySelectorAll(JE)].filter((t) => {
			let n = xy(t.getAttribute(Zt));
			return n !== null && Sy(n, e) && !T(t) && tC(t, i.menu);
		});
		return a.length === 1 ? (e.preventDefault(), tD(e), a[0].click(), !0) : (a.length > 1 && s("context menu shortcut is claimed twice and will fire nothing.", { entries: a }), !1);
	}
	contentOf(e) {
		let t = e === null ? null : this.options.componentOf?.(e.componentId) ?? null;
		return t instanceof HTMLElement ? t : null;
	}
	rebuild() {
		this.claims.clear(), this.entryShortcuts.clear(), this.stale = !1;
		for (let e of this.root.querySelectorAll(JE)) {
			let t = e.getAttribute("data-ui-shortcut") ?? "", n = xy(t);
			if (n === null) {
				t.trim().length > 0 && s("shortcut could not be parsed.", {
					element: e,
					value: t
				});
				continue;
			}
			e.closest(qE) === null ? this.claim({
				shortcut: n,
				element: e,
				view: null
			}) : this.entryShortcuts.set(jy(n), n);
		}
		for (let e of this.options.viewShortcuts ?? []) {
			let t = xy(e.name.slice(9));
			t !== null && this.claim({
				shortcut: t,
				element: null,
				view: e
			});
		}
	}
	claim(e) {
		let t = jy(e.shortcut);
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
function ZE(e) {
	let t = /* @__PURE__ */ new Map(), n = [...e.events, ...e.interactions.map((e) => e.sourceEvent)];
	for (let e of n) e != null && e.eventName.startsWith(GE) && t.set(e.eventName, {
		name: e.eventName,
		componentId: e.componentId
	});
	return [...t.values()];
}
function QE(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return mo(t) || t instanceof HTMLElement && t.isContentEditable;
}
function $E() {
	let e = document.activeElement;
	if (e === null || e === document.body) return null;
	let t = es(e);
	if (t === null || t.row !== null && t.row !== e) return e;
	let n = t.row ?? rs(I(t.root, Ao, k));
	return n === null ? t.root : eD(n);
}
function eD(e) {
	if (e.matches(NC)) return e;
	for (let t of e.querySelectorAll(NC)) if (t.closest(Ao) === e) return t;
	return e;
}
function tD(e) {
	mo(e.target) && e.target.dispatchEvent(new Event(um, { bubbles: !0 }));
}
function nD(e) {
	if (e.type === "attributes") {
		e.target instanceof HTMLElement && iD(e.target);
		return;
	}
	for (let t of e.addedNodes) t instanceof HTMLElement && rD(t);
}
function rD(e) {
	e instanceof HTMLElement && e.matches(JE) && iD(e);
	for (let t of e.querySelectorAll(JE)) iD(t);
}
function iD(e) {
	let t = e.querySelector(KE);
	if (t === null) return;
	let n = aD(e) ?? "";
	t.textContent !== n && (t.textContent = n);
}
function aD(e) {
	let t = e.getAttribute(Zt), n = xy(t);
	return n === null ? t?.trim() || null : Cy(n);
}
var oD = {
	anchor: (e) => {
		let t = e.closest(JE);
		return t === null || t.classList.contains("ui-menu-item") || t.closest(qE) !== null ? null : t;
	},
	words: (e) => {
		let t = aD(e), n = (e.getAttribute("aria-label") ?? e.querySelector(YE)?.textContent ?? "").trim();
		return t === null ? null : uT(n.length > 0 ? `${n} (${t})` : t);
	},
	after: (e) => {
		let t = aD(e);
		return t === null ? null : uT(`(${t})`);
	}
}, sD = 50, cD = 1, lD = 7;
function uD(e) {
	let t = 0;
	for (let n of e.children) n.hasAttribute("data-ui-key") && t++;
	let n = _D(e, "data-ui-window-size") ?? 0;
	return {
		offset: _D(e, "data-ui-window-offset") ?? 0,
		count: t,
		size: n > 0 ? n : t > 0 ? t : sD,
		total: _D(e, wt),
		moreAfter: e.getAttribute(Et) === "true"
	};
}
function dD(e) {
	return Math.floor(e.offset / e.size) + 1;
}
function fD(e) {
	return e.total === null ? null : Math.max(1, Math.ceil(e.total / e.size));
}
function pD(e, t) {
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
			let n = Number(t), r = fD(e);
			return !Number.isInteger(n) || n < 1 || r !== null && n > r || n === dD(e) ? null : (n - 1) * e.size;
		}
	}
}
function mD(e, t) {
	if (t <= lD) return gD(1, t);
	let n = Math.max(Math.min(e - cD, t - 2 - 2), 3), r = Math.min(Math.max(e + cD, 5), t - 2);
	return [
		1,
		n > 3 ? "gap" : 2,
		...gD(n, r),
		r < t - 2 ? "gap" : t - 1,
		t
	];
}
function hD(e, t) {
	let n = mD(e, t ? e + 1 : e);
	return t ? [...n, "gap"] : n;
}
function gD(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(r);
	return n;
}
function _D(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/interactions/pager-engine.ts
var vD = ".ui-pager", yD = "ui-pager__button", bD = "ui-pager__number", xD = "ui-pager__pages", SD = "ui-pager__gap", CD = "ui-pager__range", wD = "ui-pager__size", TD = "ui-pager__size--open", ED = "ui-pager__size-trigger", DD = "ui-pager__size-label", OD = "ui-pager__sizes", kD = "ui-pager__size-choice", AD = [
	yD,
	bD,
	"ui-button",
	"ui-button--ghost",
	"ui-button--small"
], jD = "ui.pager.page", MD = "ui.pager.range", ND = "ui.pager.rows", PD = "ui.pager.size", FD = [
	Ct,
	wt,
	Et,
	St,
	xt
], ID = "page-size", LD = class {
	options;
	root;
	drawn = /* @__PURE__ */ new WeakMap();
	store = new Fw();
	restored = /* @__PURE__ */ new WeakSet();
	menus = new du({
		show: ({ owner: e }) => e.classList.add(TD),
		hide: ({ owner: e }) => e.classList.remove(TD),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.syncAll(), this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), (e.pageKeys ?? window).addEventListener("keydown", (e) => this.handlePageKey(e), !0), P(this.root, `${vD}, [${v}]`, {
			childList: !0,
			attributeFilter: FD,
			relevant: (e) => e.type === "attributes" || qD(e.target) || JD(e)
		}, (e) => this.syncFound(e)), w.onChange(() => {
			this.drawn = /* @__PURE__ */ new WeakMap(), this.syncAll();
		});
	}
	syncAll() {
		for (let e of this.root.querySelectorAll(vD)) this.sync(e);
	}
	syncFound(e) {
		for (let t of e) {
			if (t.matches(vD)) {
				this.sync(t);
				continue;
			}
			for (let e of this.pagersOf(t)) this.sync(e);
		}
	}
	pagersOf(e) {
		let t = e.closest(b), n = t === null ? 0 : C(t);
		return n > 0 ? [...this.root.querySelectorAll(`${vD}[${et}="${Cr(n)}"]`)] : [];
	}
	hostOf(e) {
		return this.targetOf(e)?.host ?? null;
	}
	targetOf(e) {
		let t = Number(e.getAttribute(et));
		if (!Number.isInteger(t) || t <= 0) return null;
		for (let e of this.options.dom.findEveryComponent(t)) {
			let t = GD(e);
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
		let i = uD(n), a = `${i.offset}|${i.count}|${i.size}|${i.total}|${i.moreAfter}`;
		if (this.drawn.get(e) === a) return;
		this.drawn.set(e, a);
		let o = d_(e), s = (e) => f_(e, "N0", o);
		this.drawNumbers(e, i, o), zD(e, i, s), BD(e, i, s);
		for (let t of e.querySelectorAll(`:scope > .${yD}[${tt}]`)) $a.setDisabled(t, pD(i, t.getAttribute("data-ui-pager-page") ?? "") === null);
		HD(e);
	}
	drawNumbers(e, t, n) {
		let r = e.querySelector(`:scope > .${xD}`);
		if (r === null) return;
		let i = dD(t), a = fD(t), o = a === null ? hD(i, t.moreAfter) : mD(i, a), s = r.contains(document.activeElement);
		r.replaceChildren(...o.map((e) => RD(e, i, n))), s && !e.contains(document.activeElement) && r.querySelector("[aria-current='page']")?.focus({ preventScroll: !0 });
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(vD);
		if (t === null || T(e.target)) return;
		let n = e.target.closest(`.${kD}`);
		if (n !== null) {
			e.preventDefault(), this.chooseSize(t, Number(n.getAttribute(nt)));
			return;
		}
		let r = e.target.closest(`.${ED}`);
		if (r !== null) {
			e.preventDefault(), this.toggleSizes(r);
			return;
		}
		let i = e.target.closest(`[${tt}]`), a = i === null ? null : this.hostOf(t);
		if (i === null || a === null) return;
		let o = pD(uD(a), i.getAttribute("data-ui-pager-page") ?? "");
		o !== null && (e.preventDefault(), this.turnAsync(a, o));
	}
	async turnAsync(e, t) {
		await this.options.windows.requestOffsetAsync(e, t), To(e).top > 0 && Eo(e, 0);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(vD);
		if (t === null) return;
		let n = e.target.closest(`.${wD}`);
		if (n !== null && this.handleSizeKey(e, n)) return;
		let r = e.target.closest(`.${yD}, .${ED}`), i = VD(t);
		if (r === null || !i.includes(r)) return;
		let a = _o({
			key: e.key,
			items: i,
			current: r,
			axis: "horizontal",
			loop: !1
		});
		a !== null && (e.preventDefault(), O(i, a), a.focus());
	}
	handleSizeKey(e, t) {
		let n = e.target instanceof Element ? e.target.closest(`.${ED}`) : null;
		if (n !== null && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) return e.preventDefault(), this.openSizes(t, n, e.key === "ArrowUp"), !0;
		if (!this.menus.isOpen(t) || !vo(e.key, "vertical")) return !1;
		let r = WD(t), i = e.target instanceof HTMLElement && r.includes(e.target) ? e.target : null, a = _o({
			key: e.key,
			items: r,
			current: i,
			axis: "vertical"
		});
		return a !== null && (e.preventDefault(), a.focus()), !0;
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${kD}`) : null;
		if (t === null || t === document.activeElement || T(t)) return;
		let n = t.closest(`.${wD}`);
		n !== null && this.menus.isOpen(n) && As(t);
	}
	toggleSizes(e) {
		let t = e.closest(`.${wD}`);
		t !== null && (this.menus.isOpen(t) ? this.menus.close(t) : this.openSizes(t, e, !1));
	}
	openSizes(e, t, n) {
		let r = e.querySelector(`:scope > .${OD}`);
		if (r === null) return;
		let i = WD(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
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
		let r = this.store.read(t, ID), i = r === null ? 0 : Number(r);
		if (!Number.isInteger(i) || i <= 0) return;
		if (!UD(e, i)) {
			this.store.write(t, ID, null);
			return;
		}
		let a = uD(n);
		i !== a.size && (n.setAttribute(St, String(i)), a.count > 0 && this.turnAsync(n, Math.floor(a.offset / i) * i));
	}
	chooseSize(e, t) {
		let n = e.querySelector(`.${wD}`);
		n !== null && this.menus.close(n);
		let r = this.targetOf(e);
		if (r === null || !Number.isInteger(t) || t <= 0) return;
		let i = uD(r.host);
		t !== i.size && (this.store.write(r.component, ID, String(t)), r.host.setAttribute(St, String(t)), this.turnAsync(r.host, Math.floor(i.offset / t) * t));
	}
	handlePageKey(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "PageDown" && e.key !== "PageUp" || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || !(e.target instanceof Element)) return;
		let t = es(e.target);
		if (t === null || !t.root.matches(".ui-items-view, .ui-table") || T(t.root) || t.row !== null && tm(e.target, t.row) !== null) return;
		let n = GD(t.root);
		if (n === null || !n.hasAttribute("data-ui-window-paged")) return;
		let r = pD(uD(n), e.key === "PageDown" ? "next" : "previous");
		r !== null && (e.preventDefault(), this.turnFromKeyAsync(t.root, n, r));
	}
	async turnFromKeyAsync(e, t, n) {
		let r = KD(e), i = rs(r), a = i === null ? 0 : Math.max(0, r.indexOf(i));
		await this.options.windows.requestOffsetAsync(t, n);
		let o = KD(e);
		o.length > 0 && as(e, o, o[Math.min(a, o.length - 1)]);
	}
};
function RD(e, t, n) {
	if (e === "gap") {
		let e = document.createElement("span");
		return e.className = SD, e.setAttribute("aria-hidden", "true"), e.textContent = "…", e;
	}
	let r = document.createElement("button"), i = f_(e, "N0", n);
	return r.className = AD.join(" "), r.setAttribute("type", "button"), r.setAttribute(tt, String(e)), r.textContent = i, w.write(r, "aria-label", jD, { page: i }), e === t && r.setAttribute("aria-current", "page"), r;
}
function zD(e, t, n) {
	let r = e.querySelector(`:scope > .${CD}`);
	if (r === null) return;
	let i = n(t.count === 0 ? 0 : t.offset + 1), a = n(t.offset + t.count);
	t.total === null ? w.write(r, null, ND, {
		from: i,
		to: a
	}) : w.write(r, null, MD, {
		from: i,
		to: a,
		total: n(t.total)
	});
}
function BD(e, t, n) {
	let r = e.querySelector(`:scope > .${wD}`), i = r?.querySelector(`.${DD}`) ?? null;
	if (r !== null && i !== null) {
		w.write(i, null, PD, { size: n(t.size) });
		for (let e of WD(r)) e.setAttribute("aria-checked", Number(e.getAttribute("data-ui-pager-size")) === t.size ? "true" : "false");
	}
}
function VD(e) {
	return [...e.querySelectorAll(`.${yD}, .${ED}`)];
}
function HD(e) {
	let t = VD(e), n = t.find((e) => e === document.activeElement), r = t.filter((e) => e.getAttribute("data-ui-pager-page") === "previous" || e.getAttribute("data-ui-pager-page") === "next");
	O(t, n ?? r.find(bo) ?? t.find((e) => e.getClientRects().length > 0) ?? null);
}
function UD(e, t) {
	let n = e.querySelector(`:scope > .${wD}`);
	return n !== null && WD(n).some((e) => Number(e.getAttribute("data-ui-pager-size")) === t);
}
function WD(e) {
	return [...e.querySelectorAll(`:scope > .${OD} > .${kD}`)];
}
function GD(e) {
	for (let t of e.querySelectorAll(`[${v}][${mt}="windowed"]`)) if (t.closest(b) === e) return t;
	return null;
}
function KD(e) {
	return I(e, Ao, k);
}
function qD(e) {
	return e instanceof Element && e.hasAttribute("data-ui-items-host");
}
function JD(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(vD) || t.querySelector(vD) !== null)) return !0;
	return !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var YD = `.${Wt}[${It}]`, XD = ":scope > .ui-collapsible__bar", ZD = ":scope > .ui-menu__host", QD = "ui-menu__item", $D = `:scope > .${y}`, eO = ".ui-text__title", tO = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", nO = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), P(t, YD, {
			childList: !0,
			characterData: !0,
			attributeFilter: [Mt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = rO(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(ZD);
		if (n === null) return;
		let r = Gm(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: iO(n)
		}), e.setAttribute(Lt, ""), dh(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of aO(e)) {
			let e = oO(a);
			if (e === "header") {
				n !== null && cO(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			cO(a, o), r ||= o, i ||= o;
		}
		return n !== null && cO(n, r), i;
	}
	match(e, t) {
		let n = qm(sO(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(tO) : null;
		if (r === null) return n;
		if (n) return lO(r), e.removeAttribute(Ft), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(Ft, i), i;
	}
	clear(e, t) {
		lO(t), e.removeAttribute(Lt), aO(t).length > 0 && dh(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(Mt);
		for (let e of t.querySelectorAll(`[${Nt}]:not([${Pt}])`)) e.toggleAttribute(Ft, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...rO(e.target)?.querySelector(ZD)?.querySelectorAll(`.ui-menu-item:not(${Jt})`) ?? []].find(bo);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function rO(e) {
	let t = e.closest(YD), n = t?.querySelector(XD) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function iO(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${Nt}][${Ft}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function aO(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(QD));
}
function oO(e) {
	return e.querySelector($D)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function sO(e) {
	return Km(e.querySelector($D)?.querySelector(eO)?.textContent ?? "", e);
}
function cO(e, t) {
	e.toggleAttribute(Rt, !t);
}
function lO(e) {
	for (let t of e.querySelectorAll(`[${Rt}]`)) t.removeAttribute(Rt);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var uO = "[data-ui-root]", dO = "a[href]", fO = "ui-collapsible", pO = "right-side", mO = "ui-side--left", hO = "ui-side--right", gO = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(Ow).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${zt}]`);
		if (t !== null) {
			let e = t.closest(uO), n = t.getAttribute(zt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${Qt}]`);
		if (n !== null && !e.defaultPrevented && _O(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(dO)?.closest(`[${Ht}]`), i = r?.parentElement ?? null;
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
		e.setAttribute(Bt, t), this.markToggles(e);
		let n = vO(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, Ds(), performance.now() + N.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(fr, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Bs(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${uO}[${Bt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(Bt);
		if (e.removeAttribute(Bt), this.markToggles(e), t === null) return;
		let n = vO(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let i = e.querySelector(`[${zt}="${Cr(t)}"]`);
			i !== null && n !== null && n.contains(r) ? Js(i, n) : i !== null && M(i);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(Bt);
		for (let n of e.querySelectorAll(`[${zt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(zt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(fr), t && e.removeAttribute("tabindex"));
	}
};
function _O(e) {
	let t = e.closest(`.${fO}`), n = t?.closest(`[${Ht}]`), r = n?.getAttribute(Ht), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(uO) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === pO ? hO : mO);
}
function vO(e, t) {
	return e.querySelector(`:scope > [${Ht}="${Cr(t)}"]`);
}
//#endregion
//#region src/interactions/skip-link-engine.ts
var yO = "[data-ui-root]", bO = "content", xO = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[data-ui-skip-link]")?.closest(yO)?.querySelector(`:scope > [data-ui-region="${bO}"]`) ?? null;
		t !== null && (e.preventDefault(), SO(t));
	}
};
function SO(e) {
	e.hasAttribute("tabindex") || (e.setAttribute("tabindex", "-1"), e.addEventListener("blur", () => e.removeAttribute("tabindex"), { once: !0 })), e.focus();
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var CO = "ui-collapsible", wO = "ui-collapsible__content", TO = "ui-collapsible__bar", EO = "collapsed", DO = class {
	root;
	store = new Fw();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${CO}`)), P(this.root, `.${CO}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, EO);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Qt}]`), n = t?.closest(`.${CO}`) ?? null;
		if (t === null || n === null || _O(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(Mt), i = n.querySelector(`:scope > .${wO}`);
		this.cancelFold(n);
		let a = kO(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, EO, r ? "true" : "false", r ? { attributes: { [Mt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(Mt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Qt}], :scope > .${TO} > [${Qt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Uc()) return;
		let i = jO(OO(e), n, kO(e, t), r);
		if (i === null) return;
		e.setAttribute($t, "");
		let a = {
			duration: N.normal,
			easing: N.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute($t));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute($t);
			for (let e of t) e.cancel();
		}
	}
};
function OO(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function kO(e, t) {
	let n = OO(e), r = AO(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function AO(e) {
	return e === "width" ? "height" : "width";
}
function jO(e, t, n, r) {
	let i = AO(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function MO(e) {
	let t = [];
	for (let n of FO(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = MO(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = NO(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function NO(e) {
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
	if (n !== null) return PO({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return PO(r[3] === "fr" ? {
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
function PO(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function FO(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function IO(e, t = "auto") {
	return e.map((e) => LO(e, t)).join(" ");
}
function LO(e, t) {
	switch (e.kind) {
		case "px": return `${RO(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${RO(e.min)}px`}, ${RO(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${RO(e.max)}px)` : `minmax(${RO(e.min)}px, auto)`;
	}
}
function RO(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function zO(e) {
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
function BO(e, t) {
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
function VO(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = HO(r, e), o = HO(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function HO(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function UO(e, t, n, r) {
	let i = KO(e, t, n.before), a = KO(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = GO(Math.min(Math.max(r, o), s), r, i.total, a.total, o, s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = ZO(n.before, e) + ZO(n.after, e), r = i.total + a.total;
		qO(l, e, i, t * (i.total + c) / r), qO(l, e, a, t * (a.total - c) / r);
	} else u || JO(l, i, i.total + c), d || JO(l, a, a.total - c);
	return l;
}
var WO = 120;
function GO(e, t, n, r, i, a) {
	let o = e, s = n + o, c = r - o;
	return s > 0 && s < WO ? o = t < 0 ? -n : WO - n : c > 0 && c < WO && (o = t > 0 ? r : r - WO), Math.min(Math.max(o, i), a);
}
function KO(e, t, n) {
	let r = XO(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function qO(e, t, n, r) {
	let i = ZO(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function JO(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...YO(e[i])
		};
	}
}
function YO(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function XO(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function ZO(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function QO(e, t) {
	let n = XO(t.before, e), r = n + XO(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function $O(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function ek(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
function tk(e, t, n) {
	let r = Number(e);
	if (!Number.isInteger(r) || r < 1) return !1;
	let i = /^span\s+(\d+)$/.exec(t.trim()), a = Number(t), o = i === null ? Number.isInteger(a) && a > r ? a : r + 1 : r + Number(i[1]);
	return o - 1 <= n.length && n.slice(r - 1, o - 1).every((e) => e < 1);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var nk = "ui-grid-splitter", rk = "ui-container", ik = "ui-orientation--vertical", ak = 16, ok = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: en,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	lineEnd: "gridColumnEnd",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, sk = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: tn,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	lineEnd: "gridRowEnd",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, ck = class {
	root;
	store = new Fw();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new wf({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${nk}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${nk}`)), P(this.root, `.${nk}`, { childList: !0 }, (e) => this.prepareEach(e)), window.addEventListener("resize", () => this.reportEach());
	}
	reportEach() {
		for (let e of this.root.querySelectorAll(`.${nk}`)) this.reportPosition(e);
	}
	prepareEach(e) {
		for (let t of e) {
			let e = uk(t);
			e !== null && (this.restore(e, dk(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Ew) {
			let i = r[n], a = Aw(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nk}`);
		if (t === null || this.drag.active || T(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = gk(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${nk}`), n = t === null ? null : uk(t);
		if (t === null || n === null) return;
		let r = dk(t);
		for (let e of Ew) n.style.removeProperty(Aw(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = UO(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(Aw(e.axis.split, e.tier), IO(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Ew) {
			let a = Aw(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = uk(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = dk(e), r = kw(), i = fk(t, n, r), a = i === null ? null : MO(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = BO(a, zO(t.getAttribute(n.limits))), s = pk(t, n), c = mk(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = VO(c, hk(t, n).map((e) => mk(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = uk(e);
		if (t === null) return;
		let n = dk(e), r = mk(e, n), i = pk(t, n), a = hk(t, n).map((e) => mk(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : VO(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(QO(i, o))), lk(t, n, i));
	}
};
function lk(e, t, n) {
	for (let r of e.children) {
		if (!(r instanceof HTMLElement) || r.classList.contains(nk)) continue;
		let e = getComputedStyle(r), i = tk(e[t.lineStart], e[t.lineEnd], n);
		i !== r.hasAttribute("data-ui-split-folded") && r.toggleAttribute(Kn, i);
	}
}
function uk(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(rk) ? t : null;
}
function dk(e) {
	return e.classList.contains(ik) ? ok : sk;
}
function fk(e, t, n) {
	for (let r = Ew.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(Aw(t.split, Ew[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function pk(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function mk(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function hk(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(nk) && dk(r) === t && n.push(r);
	return n;
}
function gk(e) {
	let t = Number(e.getAttribute(nn));
	return Number.isFinite(t) && t > 0 ? t : ak;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var _k = "ui-split-button", vk = "ui-split-button__main", yk = "ui-split-button__toggle", bk = "ui-split-button__menu", xk = "ui-split-button--open", Sk = class {
	root;
	menus = new du({
		show: ({ owner: e }) => e.classList.add(xk),
		hide: ({ owner: e }) => e.classList.remove(xk),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = Ck(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${vk}`)?.closest(`.${_k}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Ck(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = wk(t), r = e.target.closest(`.${y}`);
		n === null || r === null || !n.contains(r) || r.matches(`${Jt}, ${Xt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = wk(e), r = n?.querySelector(".ui-menu") ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: { placement: "bottom-end" },
			openers: Tk(e)
		}) && Us(r, I(r, `.${y}:not(${Jt})`, `.${Wt}`), t);
	}
};
function Ck(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${yk}, .${vk}`), n = t?.closest(`.${_k}`) ?? null;
	return t === null || n === null || t.classList.contains(vk) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function wk(e) {
	return e.querySelector(`:scope > .${bk}`);
}
function Tk(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Ek = "ui-button-group", Dk = "ui-button-group__item", Ok = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Ek}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), P(this.root, `.${Ek}`, {
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
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = kk(i);
			i.toggleAttribute(Yn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		O(n, r ?? n.find(bo) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dk}`), n = t?.closest(`.${Ek}`) ?? null;
		if (t === null || n === null || t.closest(`.${Ek}`) !== n || T(n)) return;
		let r = kk(t);
		r !== null && T(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Dk} > .${gr}`), n = t?.closest(`.${Ek}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(kk).filter((e) => e !== null), i = _o({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Dk}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Oo(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Xn,
			bindingAttribute: Qn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return I(e, `.${Dk}`, `.${Ek}`);
	}
};
function kk(e) {
	return e.querySelector(`:scope > .${gr}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Ak = "ui-accordion", jk = "details", Mk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Ak}`)), P(this.root, `.${Ak}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Ak))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${jk}`)];
	}
}, Nk = "ui-tab-overflow", Pk = "ui-tab-overflow__menu", Fk = "ui-tab-overflow__menu--open", Ik = "ui-tab-overflow__entry", Lk = "ui-tab-overflow__entry--current", Rk = class {
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
		this.options = e, this.list = new Vk(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : zk({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return Bk(e, this.options.hiddenClass, t);
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
function zk(e) {
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
function Bk(e, t, n) {
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
var Vk = class {
	menu;
	button = null;
	list = new du({
		show: ({ popup: e }) => e.classList.add(Fk),
		hide: ({ popup: e }) => {
			e.classList.remove(Fk), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Pk, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(Hk)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${Lk}`);
		r !== null && O(this.entries(), r), this.button = e, nl(e, this.menu), this.list.open({
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
		let t = e.target.closest(`.${Ik}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || T(t) || (this.close(), this.pick(r, n));
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
		n !== null && (e.preventDefault(), O(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Ik}`) : null;
		t === null || t === document.activeElement || T(t) || (O(this.entries(), t), As(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${Ik}`));
	}
};
function Hk(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Ik} ${_r}`, t.classList.toggle(Lk, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(_, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(or), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var Uk = "data-ui-caption-text", Wk = ".ui-text__title";
function Gk(e) {
	for (let t of e.querySelectorAll(Wk)) {
		let e = t.textContent ?? "";
		t.getAttribute(Uk) !== e && t.setAttribute(Uk, e);
	}
}
function Kk(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Uc()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: N.normal,
		easing: N.ease,
		pseudoElement: "::after"
	});
}
function qk(e) {
	e === null || typeof e.animate != "function" || Uc() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: N.fast,
		easing: N.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var Jk = "ui-tabs", Yk = "ui-tab-header", Xk = "ui-tab-header--selected", Zk = "ui-tab-header--overflowed", Qk = "ui-tabs--overflowing", $k = "ui-tabs--no-overflow", eA = "ui-tabs__strip", tA = "data-ui-tab-key", nA = "data-ui-tab-page", rA = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Rk({
			rootClass: Jk,
			overflowingClass: Qk,
			wraps: (e) => e.classList.contains($k),
			hiddenClass: Zk,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${Jk}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), P(this.root, `.${Jk}`, {
			childList: !0,
			attributeFilter: [$n, ...rr],
			relevant: (e) => !zl(e, `[${nA}]`, `.${Jk}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(tA) ?? "") === t) ?? null;
		if (r !== null && !iA(r)) {
			let t = n.find(iA);
			if (t !== void 0) {
				this.select(e, t.getAttribute(tA) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(Xk)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(tA) ?? "") === t;
			e.classList.toggle(Xk, n), e.setAttribute("aria-selected", n ? "true" : "false"), Gk(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(iA), a), Kk(i, a), O(n.filter((e) => !e.classList.contains(Zk)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(nA) ?? "") !== t, !n.hidden && i !== null && i !== a && qk(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${eA}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(tA) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(iA).map((e) => {
				let n = e.getAttribute(tA) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: T(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Nk}`), n = t?.closest(`.${Jk}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${Jk}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${Yk}`);
		if (r === null || T(r)) return;
		let i = r.closest(`.${Jk}`), a = r.getAttribute(tA);
		i !== null && a !== null && r.closest(`.${Jk}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Yk}`), n = t?.closest(`.${Jk}`) ?? null;
		if (t === null || n === null) return;
		let r = _o({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(tA) ?? ""), r.focus());
	}
	select(e, t) {
		Oo(e, t, {
			attribute: $n,
			bindingAttribute: Qn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return I(e, `.${Yk}`, `.${Jk}`);
	}
	ownPages(e) {
		return I(e, `[${nA}]`, `.${Jk}`);
	}
};
function iA(e) {
	return e.classList.contains(Zk) || JC(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var aA = "ui-command-bar", oA = "ui-command-bar__host", sA = "ui-command-bar__item", cA = "ui-command-bar__overflow", lA = "ui-command-bar--overflowing", uA = "ui-command-bar__overflowed", dA = "ui-text__title", fA = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Rk({
			rootClass: aA,
			overflowingClass: lA,
			wraps: (e) => !mA(e),
			hiddenClass: uA,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${aA}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), P(this.root, `.${aA}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = pA(e), n = e.querySelector(`:scope > .${cA}`);
		if (t === null || n === null) return;
		let r = hA(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(lA) && gA(r);
		for (let e of r) el(e, e.classList.contains(uA) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${cA}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(aA) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = pA(e), n = t === null ? [] : hA(t).filter((e) => e.classList.contains(sA) && e.classList.contains(uA)).map((e) => e.querySelector(b) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: _A(e),
			current: !1,
			disabled: T(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !T(n) && vA(n).click();
	}
};
function pA(e) {
	return e.querySelector(`:scope > .${oA}`);
}
function mA(e) {
	let t = pA(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function hA(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(sA) ? n.querySelector(b) : null;
		e !== null && JC(e) && t.push(n);
	}
	return t;
}
function gA(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(sA) ? t ||= !r.classList.contains(uA) : t || r.classList.add(uA);
	}
}
function _A(e) {
	let t = vA(e), n = t.querySelector(`.${dA}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function vA(e) {
	return e.matches(hs) ? e : e.querySelector(hs) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var yA = "ui-breadcrumbs", bA = "ui-breadcrumbs__item", xA = "ui-breadcrumb", SA = "ui-breadcrumb--current", CA = "ui-hidden", wA = "data-ui-step-collapsed", TA = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), P(this.root, `.${yA}`, {
			childList: !0,
			attributeFilter: ["class", ...rr]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${yA}`)) this.apply(e);
	}
	apply(e) {
		let t = I(e, `.${bA}`, `.${yA}`);
		for (let e of t) EA(e);
		let n = t.filter((e) => !e.classList.contains(CA)).map((e) => e.querySelector(`.${xA}`)).filter((e) => e !== null && !e.classList.contains(CA)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(SA, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function EA(e) {
	let t = e.querySelector(`:scope > .${xA}`), n = t === null ? "" : rr.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === rr[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(wA) : e.getAttribute(wA) !== n && e.setAttribute(wA, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function W(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function DA(e) {
	return W(e).toString(16).padStart(2, "0").toUpperCase();
}
function OA(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return kA(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function kA(e, t, n) {
	return .2126 * AA(e) + .7152 * AA(t) + .0722 * AA(n);
}
function AA(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var jA = "ui-color-input", MA = "ui-color-input--open", NA = "ui-color-input__popup", PA = "ui-color-input__text", FA = "ui-color-input__row", IA = "ui-color-input__swatch--button", LA = "ui-color-input__value-input", RA = "ui-color-input__square-thumb", zA = "ui-color-input__hue-thumb", BA = "data-ui-color-toggle", VA = "data-ui-color-tab", HA = "data-ui-color-tab-selected", UA = "data-ui-color-pane", WA = "data-ui-color-pane-selected", GA = "data-ui-color-square", KA = "data-ui-color-hue", qA = "data-ui-color-hex", JA = "data-ui-color-channel", YA = "data-ui-color-factor", XA = "data-ui-color-opacity", ZA = "data-ui-color-name", QA = "data-ui-color-name-selected", $A = "data-ui-color-format", ej = "data-ui-color-variant", tj = "data-ui-color-no-picker", nj = "data-ui-color-no-palette", rj = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new du({
		show: ({ owner: e }) => e.classList.add(MA),
		hide: ({ owner: e }) => e.classList.remove(MA)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${jA}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = S(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${jA}`) ?? []);
		}), P(this.root, `.${jA}`, {
			childList: !0,
			attributeFilter: [
				$A,
				ej,
				tj,
				nj
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new wf({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${GA}], [${KA}]`),
			begin: (e, t) => {
				let n = e.closest(`.${jA}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(GA) ? "square" : "hue",
					stateBefore: this.states.get(n),
					valueBefore: n.querySelector(`.${LA}`)?.value ?? null
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
		let t = cj(e), n = this.states.get(e), r = n?.paneChosen === !0 ? ij(e, n.pane) : aj(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? oj(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = gj(t);
			if (i === null) return n ?? oj(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && sj(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = yj(a, o, s);
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
			...n ?? oj(r),
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
			let [e, a, o] = yj(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), fj(e, "--ui-color-input-color", t.held ? vj(n, r, i, t.opacity) : "transparent"), fj(e, "--ui-color-input-solid", vj(n, r, i, 255)), fj(e, "--ui-color-input-on-color", t.held ? OA(n, r, i, t.opacity) : "inherit"), dj(e, t.held ? uj(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${GA}]`), o = e.querySelector(`[${KA}]`), [s, c, l] = bj(t.hue, 1, 1);
		if (fj(e, "--ui-color-input-hue", vj(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${RA}`);
			e !== null && (fj(e, "left", `${t.saturation * 100}%`), fj(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${zA}`);
			e !== null && fj(e, "top", `${t.hue / 360 * 100}%`);
		}
		pj(e, `[${qA}]`, _j(n, r, i)), pj(e, `[${JA}="r"]`, String(n)), pj(e, `[${JA}="g"]`, String(r)), pj(e, `[${JA}="b"]`, String(i)), fj(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), mj(e, `[${XA}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${ZA}]`)) n.getAttribute(ZA) === t.name ? n.setAttribute(QA, "") : n.removeAttribute(QA);
		let n = t.name === null ? null : e.querySelector(`[${ZA}="${t.name}"]`), r = n === null ? null : gj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		fj(e, "--ui-color-input-base", r === null ? "transparent" : vj(r[0], r[1], r[2], 255)), mj(e, `[${YA}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${UA}]`)) n.getAttribute(UA) === t.pane ? n.setAttribute(WA, "") : n.removeAttribute(WA);
		for (let n of e.querySelectorAll(`[${VA}]`)) n.getAttribute(VA) === t.pane ? n.setAttribute(HA, "") : n.removeAttribute(HA);
	}
	resolveRgb(e, t) {
		if (t.name === null) return bj(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${ZA}="${t.name}"]`), r = n === null ? null : gj(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? bj(t.hue, t.saturation, t.value) : hj([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${BA}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${jA}`));
			return;
		}
		let n = e.target.closest(`[${VA}]`), r = e.target.closest(`.${jA}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(VA), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${ZA}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(ZA)
			}));
			return;
		}
		let a = r.querySelector(`.${NA}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${jA}`);
		if (t !== null) {
			if (e.target.hasAttribute(YA)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(XA) && this.commit(t, (t) => ({
				...t,
				opacity: W(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${jA}`);
		if (n === null) return;
		if (t.hasAttribute(YA) || t.hasAttribute(XA)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(qA)) {
			let e = gj(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = yj(e[0], e[1], e[2]);
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
		let r = t.getAttribute(JA);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = W(Number(t.value));
		let [l, u, d] = yj(c.r, c.g, c.b);
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
		let t = e.input.querySelector(`.${LA}`);
		t !== null && e.valueBefore !== null && (t.value = e.valueBefore);
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = xj((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = xj((t.x - a.left) / a.width), s = 1 - xj((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || D(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${LA}`);
		a !== null && (a.value = lj(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		D(e) || e.querySelector(`.${LA}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(tj) && e.hasAttribute(nj)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${NA}`), n = e.querySelector(`[${BA}]`);
		if (t === null) return;
		let r = e.getAttribute(ej) === "swatch" ? e.querySelector(`.${IA}`) : e.querySelector(`.${FA}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: { placement: "bottom-end" },
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${HA}]`) ?? !0
		});
	}
};
function ij(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? tj : nj))(t) ? t : t === "picker" ? "palette" : "picker";
}
function aj(e) {
	return ij(e, "picker");
}
function oj(e) {
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
function sj(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function cj(e) {
	return e.querySelector(`.${LA}`)?.value.trim() ?? "";
}
function lj(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = _j(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${DA(e.opacity)}`;
}
function uj(e, t, n, r, i) {
	if (e.getAttribute($A) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = _j(t, n, r);
	return i === 255 ? a : `${a}${DA(i)}`;
}
function dj(e, t) {
	for (let n of e.querySelectorAll(`.${PA}`)) n.textContent !== t && (n.textContent = t);
}
function fj(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function pj(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function mj(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function hj(e, t) {
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
function gj(e) {
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
function _j(e, t, n) {
	return `#${DA(e)}${DA(t)}${DA(n)}`;
}
function vj(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function yj(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function bj(e, t, n) {
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
function xj(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function Sj(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var Cj = "ui-table", wj = "ui-table--reorderable", Tj = "ui-scroll-x--auto", Ej = "ui-scroll-x--always", Dj = `:scope > .${ln}`, Oj = `.${dn}`, kj = "ui-table__header-cell", Aj = `${kj}--pinned`, jj = `${Dj} > .${un} > .${kj}`, Mj = `${jj}--pinned`, Nj = "ui-table__host", Pj = `${Dj} > .${Nj}`, Fj = `.${Cj}, .${cn}, [${rn}]`, Ij = "--ui-table-columns", Lj = "--ui-table-sticky-top", Rj = "--ui-table-sticky-bottom", zj = "--ui-table-sized-columns", Bj = "--ui-table-pin-", Vj = "--ui-table-order-", Hj = 64, Uj = "data-ui-table-cell-hidden", Wj = "data-ui-table-cell-last", Gj = "columns", Kj = "hidden", qj = "order", Jj = "layout", Yj = 32, Xj = 16, Zj = class {
	root;
	store = new Fw();
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
		if (this.root = e.root ?? document, this.drag = new wf({
			root: this.root,
			resolveHandle: (e) => e.closest(Oj),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new wf({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Ew) e !== "base" && matchMedia(`(min-width: ${Dw[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${Cj}`)), P(this.root, `.${Cj}`, {
			childList: !0,
			relevant: nM
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), P(this.root, `.${Cj}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(Cj)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), P(this.root, `.${Cj}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: rM
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(Pj);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), Sj(t, () => this.pin(t));
			let e = t.querySelector(Dj);
			e !== null && Sj(e, () => Qj(t, e));
			let n = t.querySelector(Pj);
			n !== null && (this.markScrollbar(t, n), Sj(n, () => this.markScrollbar(t, n)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, Gj), r = n === null ? null : MO(n);
		r !== null && r.length !== t.length ? (this.store.write(e, Gj, null), this.store.writeBoot(e, Jj, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, qj);
		if (i !== null && !aM(i, t)) {
			this.store.write(e, qj, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Sn, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${Cj}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = iM(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(Tj) || e.classList.contains(Ej);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(zj);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = ek(t, n);
				e.style.setProperty(zj, IO(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Vj}${t}`, String(r[t])) : e.style.removeProperty(`${Vj}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(sn) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(sn, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(_n) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(_n, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(wj)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "-1");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= Hj) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${rn}]`)) {
				let r = Number(t.getAttribute(rn));
				!(r >= Hj) || t.closest(`.${Cj}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(Uj, n.hidden.has(r)), t.toggleAttribute(Wj, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(jj)) {
			let e = Number(n.getAttribute(rn)), r = n.getAttribute(an), i = n.classList.contains(Aj) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: lM(r) ? r : null,
				startsHidden: n.hasAttribute(on),
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
		for (let e of t) (n[e.key] ?? cM(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, Kj) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(Ij).trim(), n = t.length === 0 ? null : MO(t);
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
		n === null || i !== void 0 && n === cM(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, Kj, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return iM(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(Mj).length;
		if (t < 2) return;
		let n = $O(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${Bj}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${Cj}`)?.toggleAttribute(xn, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(Dj), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return eM(e) ? n.slice(1) : n;
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
		let t = e.target.closest(Oj) ?? (e.shiftKey ? $j(e.target) : null);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = Xj;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${Cj}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(rn)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Oj)?.closest(`.${Cj}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = UO(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(Yj, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, tM(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, Gj, t === null ? null : IO(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(zj).trim(), n = e.getAttribute(sn), r = {};
		t.length > 0 && (r[zj] = t);
		for (let t of e.style) t.startsWith(Vj) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, Jj, null);
			return;
		}
		this.store.writeBoot(e, Jj, {
			styles: r,
			attributes: {
				[sn]: n,
				[_n]: e.getAttribute(_n)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${Cj}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = zO(t.getAttribute(en)), i = BO(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(rn)), u = this.hiddenOf(t, o), d = iM(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${kj}`), n = t?.closest(`.${Cj}`) ?? null;
		return t === null || n === null || !n.classList.contains(wj) || e.closest(Oj) !== null || t.classList.contains(Aj) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${Cj}`), r = Number(e.getAttribute(rn));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(vn, ""), e.setAttribute(yn, ""), {
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
		for (let a of iM(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > oM(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), sM(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(bn, "after") : a.cell.setAttribute(bn, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(yn), t.table.removeAttribute(vn), sM(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = iM(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, qj, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function Qj(e, t) {
	let n = 0, r = 0, i = !1;
	for (let e of t.children) if (e.matches(`.${Nj}`)) i = !0;
	else if (!(e instanceof HTMLElement) || e.getAttribute("role") !== "row") continue;
	else i ? r += e.offsetHeight : n += e.offsetHeight;
	e.style.setProperty(Lj, `${n}px`), e.style.setProperty(Rj, `${r}px`);
}
function $j(e) {
	let t = e.matches(`.${kj}`) ? e.querySelector(`:scope > ${Oj}`) : null;
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function eM(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function tM(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function nM(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(Fj) || t.querySelector(Fj) !== null)) return !0;
	return !1;
}
function rM(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(Nj);
}
function iM(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function aM(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function oM(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function sM(e) {
	for (let t of e.querySelectorAll(`[${bn}]`)) t.removeAttribute(bn);
}
function cM(e) {
	return e.startsHidden || e.hideBelow !== null && Ew.indexOf(kw()) < Ew.indexOf(e.hideBelow);
}
function lM(e) {
	return e !== null && Ew.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var uM = /* @__PURE__ */ new WeakMap();
function dM(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(Dt);
	for (let i of R(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = fM(i, a) ?? pM(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${st}]`)) n.has(t) || t.remove();
}
function fM(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : uM.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function pM(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (hM(i, t.getAttribute(_)), uM.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function mM(e) {
	return e.find((e) => !e.classList.contains(lr));
}
function hM(e, t) {
	e.setAttribute(st, ""), t === null ? e.removeAttribute(ct) : e.setAttribute(ct, t);
}
var gM = "bottom", _M = "pending";
function vM(e, t, n) {
	let r = e.querySelector(`:scope > [${yt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(yt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function yM(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var bM = /* @__PURE__ */ new WeakMap();
function xM(e) {
	for (let t of e.querySelectorAll(`[${st}]`)) t.remove();
}
function SM(e, t, n, r, i, a) {
	let o = qv(e, R(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Rv(i.getItemsFilterSortMetadata(t), a, Pv(e));
	if (c && !l && xM(e), o.length === 0) {
		bM.set(e, []);
		return;
	}
	let d = mv(e);
	if (!l) {
		yM(e, [...zv(o, u, r), ...pv(d)]);
		return;
	}
	xM(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (bM.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	bM.set(e, p);
	let m = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = zv(t, u, r));
		let n = e === "" ? void 0 : mM(t);
		if (n !== void 0) {
			let e = CM(s, r, n);
			e !== null && m.push(e);
		}
		m.push(...t);
	}
	yM(e, [...m, ...pv(d)]);
}
function CM(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && hM(r, n.getAttribute(_)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var wM = "ui-tree-rules", TM = `:scope > .${pn}:not(.${gn})`;
function EM(e, t, n) {
	if (e.parentElement?.classList.contains("ui-tree") === !0) {
		e.dispatchEvent(new Event(wM, { bubbles: !0 })), hv(e, t, n.templates, n.renderer, e.querySelector(TM) !== null);
		return;
	}
	switch (Z_(e)) {
		case "windowed":
			hv(e, t, n.templates, n.renderer), DM(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Fv(e, t, n.metadata, n.renderer, n.state), hv(e, t, n.templates, n.renderer), SM(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function DM(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && dM(e, (e) => CM(r, n.renderer, e));
}
//#endregion
//#region src/interactions/table-header-group.ts
var OM = ".ui-table", kM = `:scope > .${ln} > .${un} > [role='columnheader']`, AM = `:scope > .${dn}`, jM = "input:not([type='hidden']), button, select, textarea, a[href]", MM = /* @__PURE__ */ new WeakMap();
function NM(e) {
	for (let t of e.querySelectorAll(kM)) {
		let e = PM(t);
		e !== null && e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
	}
}
function PM(e) {
	let t = e.querySelector(jM);
	if (t !== null) return t;
	if (e.hasAttribute("tabindex")) return e;
	let n = e.querySelector(AM);
	return n !== null && n.getClientRects().length > 0 ? e : null;
}
function FM(e) {
	let t = IM(e), n = MM.get(e), r = n !== void 0 && t.includes(n) ? n : t[0];
	return r !== void 0 && (LM(e, r), !0);
}
function IM(e) {
	let t = [];
	for (let n of e.querySelectorAll(kM)) {
		let e = PM(n);
		e !== null && bo(e) && t.push({
			stop: e,
			left: n.getBoundingClientRect().left
		});
	}
	return t.sort((e, t) => e.left - t.left).map((e) => e.stop);
}
function LM(e, t) {
	t.hasAttribute("tabindex") || t.setAttribute("tabindex", "-1"), MM.set(e, t), t.focus();
}
function RM(e) {
	let t = e.closest("[role='columnheader']"), n = t?.parentElement?.parentElement?.parentElement ?? null;
	return t !== null && n instanceof HTMLElement && n.matches(OM) && PM(t) === e ? n : null;
}
function zM(e, t, n) {
	if (e.ctrlKey || e.metaKey || e.altKey || e.shiftKey || !(e.target instanceof HTMLElement)) return !1;
	switch (e.key) {
		case "ArrowDown": return n(), !0;
		case "ArrowUp": return !0;
	}
	if (!vo(e.key, "horizontal")) return !1;
	let r = _o({
		key: e.key,
		items: IM(t),
		current: e.target,
		axis: "horizontal",
		loop: !1
	});
	return r !== null && r !== e.target && LM(t, r), !0;
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var BM = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), VM = ".ui-table", HM = `:scope > [${v}], :scope > .${ln}, :scope > .${ln} > [${v}]`, UM = class {
	root;
	pressedBoxes = [];
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(k)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("mouseup", () => this.restoreBoxes(), !0), this.root.addEventListener("pointercancel", () => this.restoreBoxes(), !0), this.root.addEventListener("contextmenu", () => this.restoreBoxes(), !0), P(this.root, k, {
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
		Bo(e, t);
		for (let t of e.querySelectorAll(HM)) WM(t);
		if (e.matches(".ui-items-view, .ui-table")) {
			e.matches(VM) && NM(e);
			for (let e of t) {
				let t = Zp(e);
				t !== null && WM(t);
				for (let t of Qp(e)) WM(t);
			}
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, k);
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
		let n = e.target.closest(Ao), r = n?.closest(k) ?? null;
		return n === null || r === null || n.closest(k) !== r || !r.matches(t) || T(r) ? null : tm(e.target, n) === null && !E(n) ? {
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
		let t = RM(e.target);
		if (t !== null && !T(t)) {
			zM(e, t, () => this.enterRows(t)) && e.preventDefault();
			return;
		}
		let n = es(e.target);
		if (n === null || n.row !== null && tm(e.target, n.row) !== null) return;
		let { root: r } = n;
		if (!r.matches(".ui-items-view, .ui-table") || T(r)) return;
		let i = qM(r);
		if (!BM.has(e.key) && !os(e.key, i)) return;
		let a = this.ownItems(r), o = ns(a), s = cs(e.key, a, rs(a), i);
		if (s !== null) {
			e.preventDefault(), as(r, a, s), (r.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Po(r, o), Ho(r, a, s, Lo(r, e)));
			return;
		}
		if (e.key === "ArrowUp" && !e.shiftKey && !e.ctrlKey && !e.metaKey && r.matches(VM) && FM(r)) {
			e.preventDefault();
			return;
		}
		if (o === null || E(o)) return;
		let c = Zp(o);
		switch (e.key) {
			case " ":
				Ho(r, a, o, {
					shift: !1,
					ctrl: !0
				}) || KM(o, c);
				break;
			case "Enter":
				GM(r, a, o, c);
				break;
			case "Delete": {
				let e = JM(a, o);
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
		let t = e.target instanceof HTMLElement && e.target.matches("[data-ui-items-host], .ui-table__scroll") ? e.target : null, n = t?.closest(k) ?? null;
		t !== null && n !== null && [...n.querySelectorAll(HM)].includes(t) && n.focus({ preventScroll: !0 });
	}
	handlePointerDown(e) {
		this.restoreBoxes();
		let t = e.target instanceof Element ? e.target : null, n = t?.closest(k) ?? null;
		if (t !== null && n !== null) for (let e of n.querySelectorAll(HM)) e.contains(t) && e.getAttribute("tabindex") === "-1" && (e.removeAttribute("tabindex"), this.pressedBoxes.push(e));
	}
	restoreBoxes() {
		for (let e of this.pressedBoxes) WM(e);
		this.pressedBoxes = [];
	}
	ownItems(e) {
		return I(e, Ao, k);
	}
};
function WM(e) {
	e.getAttribute("tabindex") !== "-1" && e.setAttribute("tabindex", "-1");
}
function GM(e, t, n, r) {
	Ro(e) && !Vo(t).includes(n) && Ho(e, t, n, Mo), KM(n, r), r === null && ps(n, "open");
}
function KM(e, t) {
	t === null ? ps(e, fs) : t.click();
}
function qM(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function JM(e, t) {
	let n = Vo(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !E(e));
}
//#endregion
//#region src/interactions/tree-engine.ts
var YM = "ui-tree__row--folded", XM = "fold-hidden", ZM = "fold-shown", QM = "ui-tree__row--dragging", $M = "ui-tree__loading", eN = "ui-tree__loading-ring", tN = "ui-tree-node__text", nN = "ui-tree-node__toggle", rN = "ui-tree-node__rename", iN = ".ui-text__title", aN = hn, oN = "--ui-tree-depth", sN = "expanded", cN = 600, lN = .25, uN = {
	ArrowUp: "up",
	ArrowDown: "down",
	ArrowLeft: "out",
	ArrowRight: "in"
}, dN = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), fN = class {
	root;
	store = new Fw();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	dropPlace = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(wM, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${fn}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(S(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => j(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${fn}`)), P(this.root, `.${fn}`, {
			childList: !0,
			attributeFilter: [
				wn,
				Tn,
				Dn,
				Mn
			],
			relevant: hN
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute("data-ui-tree-draggable") || e.hasAttribute("data-ui-drag-kind"), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = zy(e)?.getAttribute(wn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = j(e), r = zy(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Tn) === !0, p = f || a.has(n), m = p && r?.hasAttribute("data-ui-tree-expanded") === !0, h = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), g = p && (o === null ? t[n] ?? m : o.has(n)), ee = o !== null && !o.has(n);
			e.style.setProperty(oN, String(u)), e.setAttribute("aria-level", String(u + 1)), is(e, r?.querySelector(`:scope > .${tN}`) ?? null), e.classList.toggle(YM, !d), e.classList.toggle(gn, ee), e.removeAttribute(jn), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !E(e), p ? e.setAttribute("aria-expanded", g ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(kn), g && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(kn, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), g || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(kn), d && g && !ee), s.set(n, {
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
		return zy(e.row)?.hasAttribute(Dn) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${pn}[${_}="${Cr(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, XM, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, ZM, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [jn]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = ui(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Pv(t);
		if (r === void 0 && i === null) return null;
		let a = Rv(r, this.rules.state, i), o = Lv(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(j)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = zy(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Bv(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(j(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${$M}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = j(o), c = i.getItemValue(o);
			if (c === void 0 || Iv(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = zy(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains($M) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? gN();
		o.style.setProperty(oN, String(t)), o.classList.toggle(YM, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${nN}`) === null && (!r.hasAttribute("data-ui-unselectable") || tm(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || tm(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${pn}`), n = t?.closest(".ui-tree") ?? null;
		return t === null || n === null || t.closest(".ui-tree") !== n || E(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = es(e.target);
		if (t === null || t.row !== null && tm(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains("ui-tree") || T(n)) return;
		let r = e.altKey && !e.ctrlKey && !e.metaKey && !e.shiftKey ? uN[e.key] : void 0;
		if (r !== void 0 && n.hasAttribute("data-ui-tree-draggable")) {
			e.preventDefault(), this.moveByKey(n, r);
			return;
		}
		if (!dN.has(e.key) && !vo(e.key, "vertical")) return;
		let i = this.rowsOf(n), a = ns(i), o = cs(e.key, i, rs(i), "vertical");
		if (o !== null) {
			e.preventDefault(), this.setFocus(n, o, Lo(n, e));
			return;
		}
		if (!(a === null || E(a))) {
			switch (e.key) {
				case " ":
					Ho(n, i, a, {
						shift: !1,
						ctrl: !0
					}) || KM(a, null);
					break;
				case "ArrowRight":
					a.getAttribute("aria-expanded") === "false" ? this.toggle(n, a) : a.getAttribute("aria-expanded") === "true" && this.setFocus(n, cs("ArrowDown", i, a, "vertical"), Mo);
					break;
				case "ArrowLeft":
					a.getAttribute("aria-expanded") === "true" ? this.toggle(n, a) : this.setFocus(n, this.parentOf(n, a), Mo);
					break;
				case "Enter":
					GM(n, i, a, null);
					break;
				case "F2":
					if (!this.canRename(n, a)) return;
					this.startRename(a);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = JM(i, a);
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
		let i = Gy(vN(n), j(r), t);
		i !== null && this.moveRows(e, [r], i, t === "in" ? n.find((e) => j(e) === i.parent) ?? null : null);
	}
	isSorted(e) {
		return (this.resolveRules(e)?.sorts.length ?? 0) > 0;
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !t.hasAttribute("data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = _N(e), n = t?.closest(".ui-tree") ?? null, r = n?.hasAttribute(Mn) === !0, i = n === null ? null : this.hostOf(n);
		if (t === null || n === null || i === null || !r && !n.hasAttribute("data-ui-drag-kind")) return;
		if (E(t)) {
			e.preventDefault();
			return;
		}
		let a = ov(t, this.rowsOf(n)), o = av(n, i, a);
		r ? $_(e, n, t, QM, j(t), a.filter((e) => e !== t), cv(o, !0)) : tv(e, j(t), cv(o, !1)), lv(e, o);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(QM));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fn}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${pn}`), a = i !== null && i.closest(".ui-tree") === t ? i : null, o = a === null ? {
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
		let i = this.parentKeysOf(e), a = j(t), o = (e) => n.some((t) => j(t) === e || mN(i, e, j(t))), s = By(t, zy(t)), c = t.getBoundingClientRect(), l = c.height > 0 ? (r - c.top) / c.height : .5, u = s ? lN : .5, d = this.isSorted(e) ? null : l < u ? "before" : l >= 1 - u ? "after" : null;
		if (d === null) return s && !o(a) ? {
			mark: "",
			place: {
				parent: a,
				before: null
			}
		} : null;
		if (n.includes(t)) return null;
		let f = this.rowsOf(e), p = vN(f), m = Number(t.style.getPropertyValue(oN)) || 0, h = new Set(n.map(j)), g = d === "after" && t.getAttribute("aria-expanded") === "true" ? p.find((e) => e.parent === a && e.shown !== !1 && !h.has(e.key)) : void 0, ee = i.get(a) ?? "", te = g === void 0 ? {
			parent: ee,
			before: d === "before" ? a : Yy(p, ee, a, !1, h)
		} : {
			parent: a,
			before: g.key
		};
		return !Vy(te.parent, (e) => f.find((t) => j(t) === e) ?? null) || o(te.parent) ? null : {
			mark: d,
			place: te,
			depth: g === void 0 ? m : m + 1
		};
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), cN)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fn}`);
		t !== null && nv(e, t) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fn}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${aN}]`) ?? null, i = this.dropPlace;
		if (t === null || n.length === 0 || r === null || i === null) return;
		e.preventDefault();
		let a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && mN(a, j(e), j(t)))), s = r.getAttribute(aN) === "" && r.classList.contains("ui-tree__row") ? r : null;
		this.markDrop(t, null), this.springOpen(t, null), ev(t, QM), this.moveRows(t, o, i, s);
	}
	moveRows(e, t, n, r) {
		let i = Xy(vN(this.rowsOf(e)), t.map(j), n);
		r !== null && this.expand(e, r), t.forEach((e, t) => {
			let r = zy(e)?.querySelector(`.${tN}`) ?? null;
			r !== null && (r.setAttribute(An, n.parent), r.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new CustomEvent("move", {
				bubbles: !0,
				detail: { index: i[t] }
			})));
		});
	}
	handleDragEnd(e) {
		let t = _N(e)?.closest(".ui-tree") ?? null;
		t !== null && (ev(t, QM), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t, n = "", r) {
		Uy(e, t, n, r), t === null && (this.dropPlace = null);
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(j(n), zy(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = j(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(YM)) : [];
		this.store.writeJson(e, sN, i), this.layout(e), pN(a.filter((e) => !e.classList.contains(YM)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, sN) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = ns(r);
		as(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Po(e, i), Ho(e, r, t, n));
	}
	parentOf(e, t) {
		let n = zy(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => j(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${fn}`), n = zy(e), r = n?.querySelector(iN) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), Xl({
			container: n,
			title: r,
			className: rN,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(On, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
function pN(e) {
	if (!(e.length === 0 || Uc())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: N.fast,
		easing: N.enter
	});
}
function mN(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function hN(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains("ui-tree__row") || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains("ui-tree") === !0);
}
function gN() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = $M, e.setAttribute("aria-hidden", "true"), t.className = eN, e.append(t, w.text("ui.tree.loading")), e;
}
function _N(e) {
	return e.target instanceof Element ? e.target.closest(`.${pn}`) : null;
}
function vN(e) {
	return e.map((e) => ({
		key: j(e),
		parent: zy(e)?.getAttribute("data-ui-tree-parent") ?? "",
		takesDrop: By(e, zy(e)),
		shown: !e.classList.contains(gn)
	}));
}
//#endregion
//#region src/interactions/tab-order.ts
function yN(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, bN(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function bN(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function xN(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var G = "ui-tabs-view", SN = "ui-tab-item", CN = "ui-tab-item__label", wN = "ui-tab-item__close", TN = "ui-tab-item__rename", EN = "ui-tab-item__caption", DN = "ui-tab-item__pin", ON = ".ui-text__title", kN = "ui-tab-item--dragging", AN = "ui-tab-item__caption--overflowed", jN = "ui-tabs-view--overflowing", MN = "ui-tabs-view--no-overflow", NN = "ui-tab-item__page", PN = "ui-tab-item--selected", FN = `.${y}`, IN = "tab-menu-entry", LN = {
	name: IN,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, RN = "--ui-tabs-view-strip", zN = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new Rk({
			rootClass: G,
			overflowingClass: jN,
			wraps: (e) => e.classList.contains(MN),
			hiddenClass: AN,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(S(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => ZN(e) === t.key))?.querySelector(`.${CN}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(kC, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), P(this.root, `.${G}`, {
			childList: !0,
			attributeFilter: [
				$n,
				be,
				...rr
			],
			relevant: (e) => !zl(e, `.${NN}`, `.${G}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${G}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(JC);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => ZN(e) === r)) {
			this.select(e, ZN(n[0]));
			return;
		}
		let i = e.hasAttribute(be), a = t.find((e) => e.classList.contains(PN))?.querySelector(`.${EN}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = ZN(e) === r;
			e.classList.toggle(PN, t);
			let a = e.querySelector(`.${EN}`);
			a !== null && (a.draggable = i, Gk(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${CN}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${NN}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${NN}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), Kk(a, s), a !== null && a !== s && qk(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${CN}`);
			t === null || e.classList.contains(AN) || (l.push(t), e === s && (u = t));
		}
		O(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !JC(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(RN, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${v}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Nk}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => ZN(e) === t)?.querySelector(`.${CN}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(JC).map((e) => ({
				key: ZN(e),
				title: e.querySelector(`.${CN}`)?.textContent?.trim() ?? ZN(e),
				current: ZN(e) === t,
				disabled: T(e.querySelector(`.${CN}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${SN}`);
		if (n === null || !n.classList.contains(G) || r === null || r.closest(`.${G}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = HN(n, r), a = WN(t), o = a.map((e) => {
			if (UN(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? JC(e) ? "shown" : "hidden";
		});
		if (xC(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: ZN(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(FN);
		if (t === null || n === null || !n.classList.contains(G) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => ZN(e) === a.key);
		if (i.length === 0 || r.matches(`${Yt}, ${Jt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(IN, {
			bubbles: !0,
			detail: { keys: [i, ZN(o)] }
		})), !0;
		if (HN(n, o).get(i) !== !0) return !0;
		switch (i) {
			case mC: {
				let e = o.querySelector(`.${CN}`);
				e !== null && this.startRename(e);
				break;
			}
			case hC:
			case gC:
				this.setPinned(n, o, i === hC);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${EN} > .${DN}`);
		t.toggleAttribute(nr, n), r !== null && (r.toggleAttribute(nr, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = xN(a.map(YN));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? GN(a[a.length - 1]).after(GN(t)) : GN(s).before(GN(t)), JN([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Nk}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(G)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = KN(e.target), i = r?.closest(`.${G}`) ?? null;
		if (r === null || i === null || T(r)) return;
		let a = r.closest(`.${SN}`);
		a !== null && a.closest(`.${G}`) === i && (e.preventDefault(), this.select(i, ZN(a)), document.activeElement !== r && M(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${wN}`), r = n?.closest(`.${SN}`) ?? null, i = r?.closest(`.${G}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), VN(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = KN(e.target), n = t?.closest(`.${G}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(ON) ?? e, r = e.closest(`.${SN}`);
		t === null || r === null || GN(r).hasAttribute("data-ui-unrenamable") || Xl({
			container: t,
			title: n,
			className: TN,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(tr, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => M(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${CN}`), n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${CN}`)).filter((e) => e !== null), i = _o({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${SN}`);
		a !== null && this.select(n, ZN(a)), i.focus();
	}
	handleDragStart(e) {
		let t = qN(e);
		if (t === null) return;
		if (GN(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		$_(e, t.closest(`.${G}`) ?? t, t, kN, ZN(t));
		let n = GN(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${EN}`)?.closest(`.${SN}`) ?? null, n = t?.closest(`.${G}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${kN}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${EN}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = GN(r), o = t.hasAttribute("data-ui-tab-pinned") ? BN(n, a) : null, s = o ?? GN(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${G}`);
		t !== null && t.querySelector(`.${kN}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = qN(e);
		if (t === null) return;
		t.classList.remove(kN);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(GN(t), n.next);
			return;
		}
		let r = GN(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${G}`);
		if (i === null) return;
		let a = this.ownItems(i);
		JN(a, a.indexOf(t));
	}
	select(e, t) {
		Oo(e, t, {
			attribute: $n,
			bindingAttribute: Qn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return I(e, `.${SN}`, `.${G}`);
	}
};
function BN(e, t) {
	let n = null;
	for (let r of I(e, `.${SN}`, `.${G}`)) {
		let e = GN(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function VN(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !GN(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function HN(e, t) {
	return bC(yC(e.getAttribute(xe)), {
		pinned: t.hasAttribute(nr),
		renamable: !GN(t).hasAttribute(de),
		removable: e.hasAttribute("data-ui-tabs-removes") && VN(e, t)
	});
}
function UN(e) {
	let t = e.getAttribute(_);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function WN(e) {
	let t = e.querySelector(`[${v}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function GN(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function KN(e) {
	return e.closest(`.${wN}`) !== null || Yl(e) ? null : e.closest(`.${EN}`)?.querySelector(`:scope > .${CN}`) ?? null;
}
function qN(e) {
	return e.target instanceof Element ? e.target.closest(`.${EN}`)?.closest(`.${SN}`) ?? null : null;
}
function JN(e, t) {
	for (let [n, r] of yN(e.map(YN), t)) e[n].setAttribute(er, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function YN(e) {
	return {
		order: XN(e),
		pinned: e.hasAttribute(nr)
	};
}
function XN(e) {
	let t = e.getAttribute(er);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function ZN(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var QN = "button.ui-text__fold-toggle", $N = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(QN);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, eP = "ui-temporal-input__segments", tP = "ui-temporal-input__segment", nP = "ui-temporal-input__segment-literal", rP = "ui-temporal-input__segment--empty", iP = "data-ui-temporal-segment", aP = "data-ui-temporal-step-direction", oP = "data-ui-temporal-segments-of", sP = "--", cP = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${z}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(ci(e.components, `.${z}`));
		}), P(this.root, `.${z}`, { attributeFilter: [...Fb] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Lb(t) === "time" && this.applySegments(t);
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${eP}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = Rb(e), r = Vb(e), i = B(e, Yb(t));
		t.getAttribute(oP) !== n && (t.replaceChildren(...lP(n).map((e) => dP(e))), t.setAttribute(oP, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(iP);
			if (t === null) {
				n.textContent = pP(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = mP(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(rP, i === null), n.tabIndex = 0, hP(n, t, i, D(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = _P(e.target);
		if (t === null) return;
		let n = t.closest(`.${z}`), r = t.getAttribute(iP), i = gP(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), yP(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), tx(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = bP(e.key, Vb(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = _P(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = _P(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = Af(this.wheelTurn, kf(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${z}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(iP), n < 0 ? 1 : -1, gP(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${aP}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${aP}]`);
		if (t === null) return;
		let n = t.closest(`.${z}`);
		if (n === null || D(n)) return;
		e.preventDefault();
		let r = vP(n) ?? n.querySelector(`.${tP}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(iP), t.getAttribute(aP) === "up" ? 1 : -1, gP(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${tP}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${z}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = B(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = xP(t), o = Bb(zb(e), a) * n, s = a === "hour" ? 24 : 60, c = ((SP(i, a) + o) % s + s) % s;
		this.write(e, ox(e, CP(i, a, c)), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? CP(t, "hour", wP(l, t.getHours() >= 12)) : CP(t, xP(n), l), i);
		}
		u && yP(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, CP(r, "hour", wP(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return B(e, t) ?? ax(e);
	}
	write(e, t, n) {
		tx(e, t, n), rx(e), this.applySegments(e);
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
function lP(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Ai(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(uP(r)), n += r.length;
	}
	return t;
}
function uP(e) {
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
function dP(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = nP, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = tP, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(iP, e.unit), t.dataset.width = String(e.width), fP(t, e.unit), t;
}
function fP(e, t) {
	if (t === "meridiem") {
		w.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = xP(t);
	w.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function pP(e, t, n, r) {
	return t && n !== null ? Ti(n, e, r) : e;
}
function mP(e, t, n, r) {
	if (n === null) return sP;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : SP(n, xP(e));
	return String(i).padStart(t, "0");
}
function hP(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : SP(n, xP(t))));
}
function gP(e) {
	return Yb(e.closest(`.${eP}`));
}
function _P(e) {
	let t = e instanceof Element ? e.closest(`.${tP}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${z}`);
	return n === null || D(n) ? null : t;
}
function vP(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${tP}`) : null;
}
function yP(e, t, n) {
	_o({
		key: n,
		items: [...e.querySelectorAll(`.${tP}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function bP(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function xP(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function SP(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function CP(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function wP(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var TP = "ui-timestamp", EP = "ui-timestamp__text", DP = "data-ui-timestamp-format", OP = "datetime", kP = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${TP}`), w.temporal === null), w.onTable(() => this.apply(this.root.querySelectorAll(`.${TP}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(ci(e.components, `.${TP}`))), P(this.root, `.${TP}`, {
			childList: !0,
			attributeFilter: [OP],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${TP}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: w.temporal,
			language: w.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = ea(a.getAttribute(DP)), o = $i(a.getAttribute(OP)), s = a.querySelector(`.${EP}`);
			if (s === null || t && !AP(e, o, r)) continue;
			let c = o === null ? "" : ra(o, e, n, r), l = e === "relative-date" ? aa(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= ta(e) && o !== null;
		}
		i && Ma(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${TP}:is([${DP}="relative"], [${DP}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function AP(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && ia(t, n) !== null;
}
//#endregion
//#region src/items/item-reveal.ts
var jP = /* @__PURE__ */ new Map();
function MP(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${v}]`)) if (t.closest(b) === e) return t;
	return null;
}
function NP(e, t, n, r) {
	let i = PP(e, t);
	return i !== null && (jP.set(e, {
		key: t,
		block: n
	}), FP(e, i, n, r), !0);
}
function PP(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function FP(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = Co(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = IP(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function IP(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function LP(e) {
	let t = jP.get(e);
	if (t === void 0) return;
	let n = PP(e, t.key);
	if (n === null) {
		jP.delete(e);
		return;
	}
	FP(e, n, t.block, "auto");
}
function RP(e) {
	jP.delete(e);
}
function zP(e) {
	if (!(jP.size === 0 || !(e instanceof Node))) for (let t of [...jP.keys()]) (!t.isConnected || Co(t).contains(e)) && jP.delete(t);
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var BP = "data-ui-scroll-anchor", VP = "End", HP = 4, UP = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], WP = /* @__PURE__ */ new WeakSet();
function GP(e) {
	WP.add(e);
}
function KP(e) {
	WP.delete(e);
}
var qP = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	watchedContainers = /* @__PURE__ */ new WeakSet();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of UP) this.root.addEventListener(e, (e) => JP(e), {
			capture: !0,
			passive: !0
		});
		P(this.root, `[${BP}="${VP}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [jt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !XP(t) || this.pinned.set(t, WP.has(t) || QP(t) && !ZP(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${BP}="${VP}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), WP.has(t)) {
				this.pinned.set(t, !0), YP(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (ZP(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), YP(t);
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
			if (!e.isConnected || r === null || !XP(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) this.followsEnd(e) ? YP(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	followOwnBox(e) {
		if (!e.isConnected || !XP(e)) {
			this.watchedContainers.delete(e), this.resizes?.unobserve(e);
			return;
		}
		this.followsEnd(e) && YP(e);
	}
	followsEnd(e) {
		return WP.has(e) || this.pinned.get(e) !== !1 && !ZP(e);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function JP(e) {
	zP(e.target);
	let t = e.target instanceof Element ? e.target.closest(`[${BP}="${VP}"]`) : null;
	t !== null && WP.delete(t);
}
function YP(e) {
	e.scrollTop = e.scrollHeight;
}
function XP(e) {
	return e.getAttribute(BP) === VP;
}
function ZP(e) {
	return e.getAttribute(Et)?.toLowerCase() === "true";
}
function QP(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= HP;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var $P = `:is(.ui-surface, .ui-card)[${ae}]`, eF = "ui-surface--clickable", tF = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), P(t, $P, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll($P));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest($P) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(eF)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), aF(e, "role", iF(e) ? "group" : "button"), aF(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : rF(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = nF(e);
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
function nF(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(eF) && t.hasAttribute("tabindex") ? t : null;
}
function rF(e) {
	let t = e.closest(Ao);
	return t !== null && t.closest(k)?.matches(".ui-items-view, .ui-table") === !0 && Zp(t) === e;
}
function iF(e) {
	for (let t of e.querySelectorAll(Yp)) if (em(e, t)) return !0;
	return !1;
}
function aF(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var oF = `${Jp}, [role='menu'], [role='tab']`, sF = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? cF, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(oF) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function cF(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function lF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = dF(e, a, n), s = dF(e, a + 1, n);
	return fF(t, o.top, s.top, o.line, s.line);
}
function uF(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = dF(e, a, n), s = dF(e, a + 1, n);
	return fF(t, o.line, s.line, o.top, s.top);
}
function dF(e, t, n) {
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
function fF(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var pF = 250, mF = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(gt);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < pF && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${gt}="${Cr(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${gt}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = hF(e, "data-ui-scroll-viewport") ?? gF(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? vF(e) : null, a = i === null ? null : vF(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = uF(a, lF(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? _F(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function hF(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function gF(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : hF(e, v);
	return t === null ? null : Co(t);
}
function _F(e, t) {
	return t > 0 ? e / t : 0;
}
function vF(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${_t}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${vt}]`);
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
var yF = `.${gr}, .ui-action, .${y}, .ui-select__option, .ui-language-switcher__choice, .ui-pager__size-choice`, bF = "ui-key-value-action__row", xF = `${yF}, ${`${Ao}, .${bF}`}`, SF = "ui-pressing", CF = "ui-press-held", wF = "--ui-press-x", TF = "--ui-press-y", EF = "--ui-ripple-radius", DF = "--ui-ripple-opacity", OF = class {
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
		t.style.setProperty(wF, `${r}px`), t.style.setProperty(TF, `${i}px`), t.classList.add(SF, CF);
		let o = t.animate([{ [EF]: "0px" }, { [EF]: `${a}px` }], {
			duration: N.ripple,
			easing: N.ease,
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
		let t = e.closest(xF);
		if (t === null || T(t)) return null;
		let n = e.closest(pr);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(yF) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (tm(t, e) !== null || E(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(k), r = n !== null && !e.classList.contains(bF) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains("ui-tree__row") && e.hasAttribute("data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : A(e);
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
		n.element.classList.remove(CF);
		let r = Math.max(0, N.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, N.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [DF]: 1 }, { [DF]: 0 }], {
			duration: N.normal,
			delay: i,
			easing: N.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(SF, CF), this.presses.get(e) === t && this.presses.delete(e);
	}
}, kF = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), AF = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], jF = `.${or}, .${sr}`, MF = RegExp(`(^|\\s)(${or}|${sr})(\\s|$)`), NF = RegExp(`(^|\\s)${cr}(\\s|$)`), PF = "[type='range']", FF = /* @__PURE__ */ new WeakSet(), IF = /* @__PURE__ */ new WeakSet();
function LF(e = document) {
	let t = e === document ? window : e;
	for (let e of AF) t.addEventListener(e, GF, !0);
	t.addEventListener("keydown", qF, !0), t.addEventListener("change", JF, !0), t.addEventListener("pointerdown", YF, !0), t.addEventListener("mousedown", YF, !0), HF(e.querySelectorAll(jF)), BF(e.querySelectorAll(`[${ar}]`)), zF(e.querySelectorAll(PF)), new MutationObserver((e) => {
		for (let t of e) RF(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", ar],
		attributeOldValue: !0
	});
}
function RF(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			VF(t, e.oldValue !== null);
			return;
		}
		let n = MF.test(e.oldValue ?? ""), r = t.matches(jF);
		n !== r && (UF(t, r), VF(t)), NF.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && zF(t.querySelectorAll(PF));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(jF) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && WF(n), n.matches(jF) && UF(n, !0), HF(n.querySelectorAll(jF)), VF(n), BF(n.querySelectorAll(`[${ar}]`)), zF([n, ...n.querySelectorAll(PF)]));
}
function zF(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = D(t);
		e !== FF.has(t) && (e ? (FF.add(t), t.addEventListener("touchstart", YF, { passive: !1 })) : (FF.delete(t), t.removeEventListener("touchstart", YF)));
	}
}
function BF(e) {
	for (let t of e) VF(t);
}
function VF(e, t = !1) {
	let n = e.getAttribute(ar);
	n === null && !t || (e.matches(jF) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !Id(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function HF(e) {
	for (let t of e) UF(t, !0);
}
function UF(e, t) {
	for (let n of e.children) t ? WF(n) : IF.has(n) && (IF.delete(n), n.removeAttribute("inert"));
}
function WF(e) {
	e.hasAttribute("inert") || (IF.add(e), e.setAttribute("inert", ""));
}
function GF(e) {
	e.target instanceof Element && (T(e.target) ? (e.type === "click" && ou(e), XF(e)) : e.type === "click" && KF(e.target) && e.preventDefault());
}
function KF(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && D(e);
}
function qF(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && T(e.target)) {
			XF(e);
			return;
		}
		!kF.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && D(e.target) && e.preventDefault();
	}
}
function JF(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && D(e.target) && e.stopImmediatePropagation();
}
function YF(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !D(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function XF(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var ZF = /* @__PURE__ */ new WeakMap(), QF = new du({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = ZF.get(e);
		ZF.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), $F = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => QF.popupOf(r) === t;
		return ZF.set(t, n.onDismiss), QF.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (ZF.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && QF.reposition(r);
			},
			close: () => {
				i() && QF.close(r);
			}
		};
	},
	focusReturn: (e) => Ws(e)
};
//#endregion
//#region src/items/item-rows.ts
function eI(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Tv,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => es(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var tI = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? iI(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), aI(l, n, t);
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
		let i = rI(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: C(r),
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
			nI(n, e) && this.applyBoundAttribute(i, String(S(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = S(t.bindingId);
			e.push([t, `[${ze}${wr(n.propertyName)}="${Cr(r)}"]`]);
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
		let r = lI(t, n.templateKeyPropertyName);
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
		r !== void 0 && xv(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : bv(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item's path stops short of the property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = qa(u, () => this.metadata.isTranslatable(a) && !Sv(l)), f = S(a.componentId), p = e.closest(`[${ae}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = Dr(p, t, () => [e])[0] ?? null;
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
function nI(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = S(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function rI(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Ev(r, i.name) : jv(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return Mv(r, i.key, n), e;
	let a = r;
	return a[Ov(a, i.name)] = n, e;
}
function iI(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function aI(e, t, n) {
	e.setAttribute(_, t), cI(e, n), sI(e, n);
}
var oI = [
	["CanSelect", ce],
	["CanDrag", le],
	["CanRemove", ue],
	["CanRename", de],
	["CanShowContextMenu", fe]
];
function sI(e, t) {
	for (let [n, r] of oI) {
		let i = Ev(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function cI(e, t) {
	let n = Ev(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(lt, n.value) : e.removeAttribute(lt);
}
function lI(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Ev(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var uI = "Group", dI = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = S(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), P(e.root, `[${ft}="${pt}"]`, { attributeFilter: [Ze] }, (e) => {
			for (let t of e) {
				let e = ui(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), P(e.root, `[${mt}="windowed"]`, { attributeFilter: [Dt] }, (e) => {
			for (let t of e) {
				let e = ui(t);
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
			for (let [t, n] of e) t.isConnected && EM(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(S(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Av(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${v}]`)) {
			if (Z_(r) !== "virtualized") continue;
			let i = r.closest(b);
			i === null || !this.drawsPatchedComponent(i, S(e.reference.componentId), t) || !fI(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(C(i), t) && this.sync(r, C(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${C(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? C(e) === n.scopeComponentId : C(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		EM(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${_}="${Cr(t)}"]`)].filter((t) => this.isItemRoot(t) && ii(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${v}]`), i = r === null ? null : ui(r);
		if (r !== null && i !== null && Z_(r) === "virtualized") {
			let a = e.getAttribute(_);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = pI(uI, t);
		a && cI(e, this.options.renderer.getItemValue(e)), oI.some(([e]) => pI(e, t)) && sI(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && pI(uI, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => pI(e.itemProperty, t)) || n.sorts.some((e) => pI(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${v}]`)) {
			let n = ui(t);
			n === e && this.sync(t, n);
		}
	}
};
function fI(e, t) {
	let n = ri(e, ni(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function pI(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/table-row-indices.ts
var mI = "ui-table", hI = "ui-table--no-header";
function gI(e, t, n) {
	let r = e.parentElement, i = r?.parentElement ?? null;
	if (r === null || i === null || !r.classList.contains("ui-table__scroll") || !i.classList.contains(mI)) return;
	let a = [], o = [], s = !1;
	for (let t of r.children) t === e ? s = !0 : t.getAttribute("role") === "row" && !(t === r.firstElementChild && i.classList.contains(hI)) && (s ? o : a).push(t);
	a.forEach((e, t) => _I(e, t));
	for (let [e, n] of t) _I(e, a.length + n);
	n !== null && o.forEach((e, t) => _I(e, a.length + n + t)), vI(i, "aria-rowcount", n === null ? "-1" : String(a.length + n + o.length));
}
function _I(e, t) {
	vI(e, "aria-rowindex", String(t + 1));
}
function vI(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-window-engine.ts
var yI = 50, bI = 1, xI = .5, SI = 60, CI = "--ui-window-look", wI = "--ui-window-row", TI = "--ui-window-tile", EI = 3, DI = class {
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
			if (this.layout(t), PI(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		if (e.hasAttribute("data-ui-window-paged")) return;
		let t = LI(e, Ct);
		if (t !== null && XP(e) && OI(e.getAttribute("data-ui-window-more-after"))) {
			Eo(e, Math.max(0, this.windowBottom(e, t) - To(e).height));
			return;
		}
		t !== null && t !== 0 && Eo(e, OI(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = NI(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : MI(n[n.length - 1]).bottom - MI(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = LI(e, Ct), n = NI(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = To(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		Z_(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${v}][${mt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = wo(e.target);
		if (t === null || Z_(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, SI));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && PI(e) > 0) return;
		let n = NI(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = LI(e, Ct), i = OI(e.getAttribute(Tt)), a = OI(e.getAttribute(Et));
		if (r !== null) {
			let o = this.windowSize(e), s = To(e), c = Math.max(1, Math.round(s.height * bI / t.itemSize), Math.floor(o * xI)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, FI(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, FI(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = To(e), s = Math.max(1, o.height * bI), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, FI(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, FI(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = LI(e, wt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = ui(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0, e.setAttribute(bt, t.toLowerCase()), e.setAttribute("aria-busy", "true"), t === "After" && LI(e, "data-ui-window-total") === null && AI(e) && vM(e, _M, EI * this.rowSize(e));
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: II(e),
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
			o.pending = !1, e.removeAttribute(bt), e.removeAttribute("aria-busy"), vM(e, _M, 0), this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = NI(e), r = LI(e, wt), i = LI(e, Ct);
		if (gI(e, n.map((e, t) => [e, (i ?? 0) + t]), r), e.hasAttribute("data-ui-window-paged")) {
			vM(e, "top", 0), vM(e, gM, 0);
			return;
		}
		if (n.length > 0) {
			let r = MI(n[n.length - 1]).bottom - MI(n[0]).top;
			if (r > 0) {
				let i = kI(n), a = Math.ceil(n.length / i);
				t.itemSize = Math.max(1, Math.round(r / (a * i))), jI(e, a > 1 ? (MI(n[n.length - 1]).top - MI(n[0]).top) / (a - 1) : r, i > 1 ? MI(n[1]).left - MI(n[0]).left : null);
			}
		}
		let a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		vM(e, "top", a), vM(e, gM, o), LP(e);
	}
	rowSize(e) {
		let t = Number.parseFloat(e.style.getPropertyValue(wI));
		return Number.isFinite(t) && t > 0 ? t : this.getState(e).itemSize;
	}
	windowSize(e) {
		let t = LI(e, St);
		return t !== null && t > 0 ? t : yI;
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
function OI(e) {
	return e !== null && e.toLowerCase() === "true";
}
function kI(e) {
	let t = MI(e[0]).top, n = 1;
	for (; n < e.length && MI(e[n]).top === t;) n++;
	return n;
}
function AI(e) {
	return getComputedStyle(e).getPropertyValue(CI).trim() === "skeleton";
}
function jI(e, t, n) {
	let r = e.style, i = `${Math.round(t * 100) / 100}px`, a = n !== null && n > 0 ? `${Math.round(n * 100) / 100}px` : "";
	r.getPropertyValue(wI) !== i && r.setProperty(wI, i), r.getPropertyValue(TI) !== a && (a.length === 0 ? r.removeProperty(TI) : r.setProperty(TI, a));
}
function MI(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function NI(e) {
	return [...e.children].filter((e) => e.hasAttribute(_));
}
function PI(e) {
	return NI(e).length;
}
function FI(e) {
	return e.getAttribute(_);
}
function II(e) {
	let t = e.closest(b);
	return t === null ? [] : ri(t, ni(t));
}
function LI(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var RI = [
	ae,
	oe,
	se
];
function zI(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, BI(c, e.itemRole);
	let l = HI(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = VI(l, t, n, a);
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
		d.className = l.wrapperClassName, BI(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), aI(d, r, n), c.appendChild(d);
	}
	return aI(c, r, n), o.registerItemScope(c, l, n), c;
}
function BI(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function VI(e, t, n, r) {
	let i = lI(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function HI(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of RI) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), C(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function UI(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return WI(i.renderer.renderItem(e, t, n, r), a);
	let s = zI(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), WI(s, a);
}
function WI(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var GI = 6, KI = 60, qI = class {
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
		let n = XP(e) && QP(e);
		this.project(e, t), this.layout(e, t), n && !QP(e) && (Eo(e, e.scrollHeight), this.layout(e, t));
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
		let i = n.entries[r].element, a = e.parentElement, o = R(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? ms(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = rI(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Pv(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Rv(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Iv(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => ZI(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Bv(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = ZI(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Bv(e.item, t.item, a))), e !== "" && l.push({
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
		t !== null && Z_(t) === "virtualized" && this.relayout(t);
	}
	handleResize(e) {
		for (let t of e) {
			let e = t.target;
			e.isConnected && Z_(e) === "virtualized" ? window.requestAnimationFrame(() => this.relayout(e)) : this.resizes?.unobserve(e);
		}
	}
	relayout(e) {
		let t = this.getState(e);
		t !== null && t.scheduled === 0 && (this.layout(e, t), t.scheduled = window.setTimeout(() => {
			t.scheduled = 0, this.layout(e, t);
		}, KI));
	}
	layout(e, t) {
		let n = t.projected, r = getComputedStyle(e), i = rL(r), a = n.map((e) => this.pitchOf(t, e) + i), o = n.length, s = t.across, c = $I(e) ? eL(n, a, s) : null, l = c?.pitches ?? a, u = l.length, d = 0, f = u;
		if ((c !== null || QI(e)) && u > 0) {
			let i = iL(r.paddingTop), a = To(e), o = YI(e, t, n, l, s, a.top - i, i), c = o + a.height, p = 0;
			d = u;
			for (let e = 0; e < u; e++) {
				let t = p + l[e];
				if (d === u && t > o && (d = e), p >= c) {
					f = e;
					break;
				}
				p = t;
			}
			d === u && (d = Math.max(0, u - 1)), d = Math.max(0, d - GI), f = Math.min(u, f + GI);
		}
		let p = c === null ? d : c.starts[d] ?? o, m = c === null ? f : f < u ? c.starts[f] : o, h = this.options.renderer.getAncestorStack(e), g = [], ee = [], te = !1;
		for (let e = 0; e < o; e++) {
			let r = n[e], i = e >= p && e < m, a = (r.header ? t.headers.get(ZI(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), XI(t, r, null), te = !0);
				continue;
			}
			if (a !== null) {
				r.header && hM(a, r.entry.key), g.push(a), ee.push([a, e]);
				continue;
			}
			let o = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, h);
			o !== null && (XI(t, r, o), g.push(o), ee.push([o, e]), te = !0);
		}
		let ne = new Set(g);
		for (let e of t.entries) e.element !== null && !ne.has(e.element) && (e.element.remove(), e.element = null, te = !0);
		for (let t of R(e)) ne.has(t) || (t.remove(), te = !0);
		for (let t of e.querySelectorAll(`:scope > [${st}]`)) ne.has(t) || (t.remove(), te = !0);
		for (let e of t.headers.values()) e.element !== null && !ne.has(e.element) && (e.element = null);
		let re = aL(l, 0, d), ie = aL(l, f, u);
		yM(e, [...g, ...pv(mv(e))]), vM(e, "top", re > 0 ? re - i : 0), vM(e, gM, ie > 0 ? ie - i : 0), hv(e, t.componentId, this.options.templates, this.options.renderer, o > 0), gI(e, ee, o), (te || t.first !== p || t.last !== m) && (t.first = p, t.last = m, this.options.dom.invalidate()), t.laidOut = n, t.pitches = l, t.laidAcross = s, t.firstLine = d, t.lastLine = f, this.measure(t, n, p, m), c !== null && (t.across = tL(e, r, t.tileWidth) ?? t.across, t.across !== s && this.layout(e, t));
	}
	renderRow(e, t, n) {
		return UI(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && hM(r, t.key), r;
	}
	measure(e, t, n, r) {
		let i = 0;
		for (let a = n; a < r && a < t.length; a++) {
			let n = t[a], r = n.header ? e.headers.get(ZI(n.entry)) : n.entry, o = r?.element;
			if (r == null || o == null) continue;
			let s = nL(o);
			s.height <= 0 || (JI(n.header ? e.headerHeights : e.itemHeights, r.height, s.height), r.height = s.height, n.header || (i = Math.max(i, s.width)));
		}
		i > 0 && (e.tileWidth = i), e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(ZI(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = di(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of R(e)) {
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
function JI(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function YI(e, t, n, r, i, a, o) {
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
function XI(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = ZI(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function ZI(e) {
	let t = Ev(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function QI(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function $I(e) {
	return e.parentElement?.classList.contains("ui-items-view--wrap") === !0;
}
function eL(e, t, n) {
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
function tL(e, t, n) {
	let r = e.clientWidth - iL(t.paddingLeft) - iL(t.paddingRight);
	if (n === null || n <= 0 || r <= 0) return null;
	let i = iL(t.columnGap);
	return Math.max(1, Math.floor((r + i + .5) / (n + i)));
}
function nL(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function rL(e) {
	return iL(e.rowGap);
}
function iL(e) {
	let t = Number.parseFloat(e);
	return Number.isFinite(t) ? t : 0;
}
function aL(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var oL = "data-ui-template", sL = "default", cL = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? sL, r = this.findTemplate(e, n);
		return r === void 0 ? n === sL ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${oL}]`);
		for (let e of r) if (e.getAttribute(oL) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= lL(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, it);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, at);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function lL(e) {
	let t = /* @__PURE__ */ new Set();
	return Ka(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(b)) {
			let n = C(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function uL(e, t) {
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
var dL = "script[type='application/json'][data-ui-metadata]";
function fL(e = document) {
	let t = e.querySelector(dL);
	if (t === null) return pL();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return pL();
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
function pL() {
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
var mL = "script[type='application/json'][data-ui-hydration]";
function hL(e) {
	return e !== null && (ya(e.title) || ya(e.changes));
}
function gL(e = document) {
	let t = e.querySelector(mL)?.textContent?.trim() ?? "";
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
var _L = "reconnecting";
async function vL(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), _L;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function yL(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/reload-guard.ts
var bL = "ne-standard-ui:reloaded-view";
function xL(e, t, n) {
	if (!t) return "no-cookie";
	if (wL(n) === e) return "asked-again";
	try {
		n?.setItem(bL, e);
	} catch {}
	return "reload";
}
function SL(e) {
	try {
		e?.removeItem(bL);
	} catch {}
}
function CL() {
	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}
function wL(e) {
	try {
		return e?.getItem(bL) ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/runtime/connection-watch.ts
var TL = 2e3, EL = class {
	root;
	notifications;
	graceMilliseconds;
	grace = null;
	notice = null;
	given = !1;
	constructor(e) {
		this.root = e.root, this.notifications = e.notifications, this.graceMilliseconds = e.graceMilliseconds ?? TL, e.connection.onReconnecting(() => this.reconnecting()), e.connection.onReconnected(() => this.reconnected());
	}
	reconnecting() {
		this.given || this.grace !== null || this.notice !== null || (this.grace = window.setTimeout(() => this.showReconnecting(), this.graceMilliseconds));
	}
	showReconnecting() {
		this.grace = null, this.root.setAttribute(Gn, "reconnecting"), this.notice = this.notifications.show({
			message: w.text("ui.connection.reconnecting"),
			sticky: !0
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
}, DL = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(OL(kL(e)));
	}
	async dispatchAsync(e) {
		let t = kL(e), n = OL(t);
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
function OL(e) {
	return e.action === void 0 ? `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}` : `action:${e.action}`;
}
function kL(e) {
	return e.action === void 0 ? {
		eventId: S(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	} : {
		eventId: 0,
		action: e.action,
		dynamicParameters: []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var AL = class {
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
		let r = jL(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(ML([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(jL(e, t));
		let n = this.unplaced.get(ML(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = jL(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(ML([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = ML(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, ML(t.slice(0, e - 1)));
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
		return `${S(e.componentId)}:${e.propertyId}:${NL(t)}`;
	}
};
function jL(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function ML(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function NL(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var PL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, FL = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, IL = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, LL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, RL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, zL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, BL = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, VL = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, HL = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, UL = class {
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
var WL = class {
	constructor() {}
	log(e, t) {}
};
WL.instance = new WL();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var GL = "10.0.11", q = class {
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
function KL(e, t) {
	let n = "";
	return JL(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${qL(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function qL(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function JL(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function YL(e, t, n, r, i, a) {
	let o = {}, [s, c] = $L();
	o[s] = c, e.log(K.Trace, `(${t} transport) sending data. ${KL(i, a.logMessageContent)}.`);
	let l = JL(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function XL(e) {
	return e === void 0 ? new QL(K.Information) : e === null ? WL.instance : e.log === void 0 ? new QL(e) : e;
}
var ZL = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, QL = class {
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
function $L() {
	let e = "X-SignalR-User-Agent";
	return J.isNode && (e = "User-Agent"), [e, eR(GL, tR(), rR(), nR())];
}
function eR(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function tR() {
	if (J.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function nR() {
	if (J.isNode) return process.versions.node;
}
function rR() {
	return J.isNode ? "NodeJS" : "Browser";
}
function iR(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function aR() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var oR = class extends UL {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || J.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(aR());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new IL();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new IL();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(K.Warning, "Timeout from HTTP request."), n = new FL();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, JL(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new PL(await sR(i, "text") || i.statusText, i.status);
		let a = await sR(i, e.responseType);
		return new HL(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return J.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function sR(e, t) {
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
var cR = class extends UL {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new IL()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (JL(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new IL());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new HL(r.status, r.statusText, r.response || r.responseText)) : n(new PL(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(K.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new PL(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(K.Warning, "Timeout from HTTP request."), n(new FL());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, lR = class extends UL {
	constructor(e) {
		if (super(), typeof fetch < "u" || J.isNode) this._httpClient = new oR(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new cR(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new IL()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, uR = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
uR.RecordSeparatorCode = 30, uR.RecordSeparator = String.fromCharCode(uR.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var dR = class {
	writeHandshakeRequest(e) {
		return uR.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (JL(e)) {
			let r = new Uint8Array(e), i = r.indexOf(uR.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(uR.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = uR.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, Y;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(Y ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var fR = class {
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
		return this.observers.push(e), new ZL(this, e);
	}
}, pR = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			JL(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new mR(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, JL(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, mR = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, hR = 3e4, gR = 15e3, _R = 1e5, X;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(X ||= {});
var vR = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(K.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, q.isRequired(e, "connection"), q.isRequired(t, "logger"), q.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? hR, this.keepAliveIntervalInMilliseconds = a ?? gR, this._statefulReconnectBufferSize = o ?? _R, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new dR(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = X.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: Y.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new pR(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = X.Disconnecting, this._logger.log(K.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(K.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === X.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new IL("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new fR();
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
						this._logger.log(K.Error, `Invoke client method threw error: ${iR(e)}`);
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
							this._logger.log(K.Error, `Stream callback threw error: ${iR(e)}`);
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
		this._logger.log(K.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new IL("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === X.Disconnecting ? this._completeClose(e) : this._connectionState === X.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === X.Connected && this._completeClose(e);
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
				this._logger.log(K.Error, `Stream 'error' callback called with '${e}' threw error: ${iR(t)}`);
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
}, yR = [
	0,
	2e3,
	1e4,
	3e4,
	null
], bR = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? yR : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, xR = class {};
xR.Authorization = "Authorization", xR.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var SR = class extends UL {
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
		e.headers ||= {}, this._accessToken ? e.headers[xR.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[xR.Authorization] && delete e.headers[xR.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, Z;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(Z ||= {});
var CR;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(CR ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var wR = class {
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
}, TR = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new wR(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, CR, "transferFormat"), this._url = e, this._logger.log(K.Trace, "(LongPolling transport) Connecting."), t === CR.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = $L(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === CR.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(K.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new PL(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(K.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(K.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(K.Trace, `(LongPolling transport) data received. ${KL(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(K.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new PL(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof FL ? this._logger.log(K.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(K.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(K.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? YL(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(K.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(K.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = $L();
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
			i ? i instanceof PL && (i.statusCode === 404 ? this._logger.log(K.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(K.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(K.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, ER = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, CR, "transferFormat"), this._logger.log(K.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== CR.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (J.isBrowser || J.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = $L();
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
						this._logger.log(K.Trace, `(SSE transport) data received. ${KL(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? YL(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, DR = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		q.isRequired(e, "url"), q.isRequired(t, "transferFormat"), q.isIn(t, CR, "transferFormat"), this._logger.log(K.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (J.isNode || J.isReactNative) {
				let t = {}, [r, i] = $L();
				t[r] = i, n && (t[xR.Authorization] = `Bearer ${n}`), o && (t[xR.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === CR.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(K.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(K.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(K.Trace, `(WebSockets transport) data received. ${KL(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(K.Trace, `(WebSockets transport) sending data. ${KL(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, OR = 100, kR = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, q.isRequired(t, "url"), this._logger = XL(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (J.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!J.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : J.isNode && !n.WebSocket && r && (n.WebSocket = r), !J.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : J.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new SR(n.httpClient || new lR(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= CR.Binary, q.isIn(e, CR, "transferFormat"), this._logger.log(K.Debug, `Starting connection with transfer format '${CR[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(K.Error, e), await this._stopPromise, Promise.reject(new IL(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(K.Error, e), Promise.reject(new IL(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new jR(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new IL("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < OR);
				if (r === OR && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof TR && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(K.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(K.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = $L();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new BL("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof PL && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(K.Error, t), Promise.reject(new BL(t));
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
					if (this._logger.log(K.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new zL(`${n.transport} failed: ${e}`, Z[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(K.Debug, e), Promise.reject(new IL(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new VL(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case Z.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new DR(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case Z.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new ER(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case Z.LongPolling: return new TR(this._httpClient, this._logger, this._options);
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
		if (AR(t, i)) {
			if (e.transferFormats.map((e) => CR[e]).indexOf(n) >= 0) {
				if (i === Z.WebSockets && !this._options.WebSocket || i === Z.ServerSentEvents && !this._options.EventSource) return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it is not supported in your environment.'`), new LL(`'${Z[i]}' is not supported in your environment.`, i);
				this._logger.log(K.Debug, `Selecting transport '${Z[i]}'.`);
				try {
					return this.features.reconnect = i === Z.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it does not support the requested transfer format '${CR[n]}'.`), /* @__PURE__ */ Error(`'${Z[i]}' does not support ${CR[n]}.`);
		}
		return this._logger.log(K.Debug, `Skipping transport '${Z[i]}' because it was disabled by the client.`), new RL(`'${Z[i]}' is disabled by the client.`, i);
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
function AR(e, t) {
	return !e || (t & e) !== 0;
}
var jR = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new MR(), this._transportResult = new MR(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new MR(), this._transportResult.promise;
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
			this._sendBufferedData = new MR();
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
}, MR = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, NR = "json", PR = class {
	constructor() {
		this.name = NR, this.version = 2, this.transferFormat = CR.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = WL.instance);
		let n = uR.parse(e), r = [];
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
		return uR.write(JSON.stringify(e));
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
}, FR = {
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
function IR(e) {
	let t = FR[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var LR = class {
	configureLogging(e) {
		if (q.isRequired(e, "logging"), RR(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = IR(e);
			this.logger = new QL(t);
		} else this.logger = new QL(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new bR(e) : e : new bR(), this;
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
		let t = new kR(this.url, e);
		return vR.create(t, this.logger || WL.instance, this.protocol || new PR(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function RR(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var zR = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, BR = class {
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
}, VR = class {
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
}, HR = 500;
function UR(e) {
	let { changes: t, ...n } = e;
	return n;
}
function WR() {
	return {};
}
var GR = class {
	windowId;
	connection;
	started = !1;
	gate = new BR();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new VR(t), this.connection = new LR().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
			return t.fresh !== !0 && this.gate.markAttached(), t;
		} catch (e) {
			throw this.gate.failAttach(e), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, UR));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, UR));
	}
	async navigateInPlaceAsync(e) {
		return await this.invokeAsync("NavigateInPlaceAsync", [{ parameters: e }], (e) => this.inbound.answered(e, (e) => e.changes, UR));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, WR, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new zR(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, WR));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), HR);
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
}, KR = "/_ne/values", qR = 3e4;
function JR(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function YR(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function XR(e, t = qR) {
	if (e === void 0 || !YR(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${KR}/${encodeURIComponent(n)}`, {
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
async function ZR(e) {
	let t = await fetch(KR, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(qR)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var QR = Promise.resolve(), $R = () => {}, ez = class {
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
		if (this.handed >= this.given) return QR;
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
		for (; this.flight !== null;) await this.flight.catch($R);
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = JR(e.value), r = n === null ? null : ZR(n);
		return r?.catch($R), new Promise((i, a) => {
			let o = tz(e), s = this.queue.findIndex((e) => e.field === o), c = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, nz(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof zR) {
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
		let t = this.transport.whenAttached().then(() => ZR(e));
		return t.catch($R), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function tz(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function nz(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var rz = "form-owner", iz = "ui-form-";
function az(e) {
	return iz + e.replace(/[ \t\n\f\r]/g, "_");
}
function oz(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = az(t);
	cz(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function sz(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(iz) && cz(e);
	}
}
function cz(e) {
	let t = lz();
	if (t.querySelector(`form[id="${Cr(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function lz() {
	let e = document.body.querySelector(`[${At}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(At, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var uz = document;
function dz() {
	try {
		return uz.execCommand("copy");
	} catch {
		return !1;
	}
}
function fz(e) {
	try {
		return typeof uz.execCommand == "function" && uz.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var pz = /* @__PURE__ */ new Map([
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
]), mz = [
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
function hz(e) {
	return Q(e, mz);
}
var gz = [
	"small",
	"medium",
	"large"
], _z = ["default", "circle"], vz = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], yz = [
	"start",
	"center",
	"end",
	"justify"
], bz = ["nowrap", "wrap"], xz = /* @__PURE__ */ new Map([
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
]), Sz = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), Cz = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), wz = ["inline", "trailing"], Tz = [
	"filled",
	"outline",
	"underline",
	"ghost",
	"tonal"
], Ez = [
	"small",
	"medium",
	"large"
], Dz = [
	"small",
	"medium",
	"large"
], Oz = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], kz = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], Az = ["light", "dark"], jz = [
	"start",
	"center",
	"end",
	"stretch"
], Mz = ["clip", "visible"], Nz = [
	"visible",
	"hidden",
	"collapsed"
], Pz = [
	"background",
	"raised",
	"tinted"
], Fz = ["horizontal", "vertical"], Iz = [
	"none",
	"gap",
	"rule"
], Lz = [
	"none",
	"one",
	"many"
], Rz = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], zz = ["stack", "wrap"], Bz = ["end", "start"], Vz = [
	"disabled",
	"auto",
	"always"
], Hz = [
	"disabled",
	"proximity",
	"mandatory"
], Uz = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Wz = [
	"text",
	"numeric",
	"decimal",
	"tel",
	"email",
	"url",
	"search"
], Gz = ["hex", "rgb"], Kz = ["field", "swatch"], qz = [
	"fill",
	"contain",
	"cover",
	"none"
], Jz = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Yz = ["default", "circle"], Xz = ["uniform", "vignette"], Zz = ["linear", "circular"], Qz = [
	"none",
	"vertical",
	"horizontal",
	"both"
], $z = [
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
], eB = [
	"None",
	"Shade",
	"Tint"
], tB = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, mz)}`],
	["themeColorClass", (e) => NB(e)],
	["iconClass", (e) => of(e)],
	["iconUrlCss", (e) => Zd(e)],
	["safeUrl", (e) => Ld(e)],
	["safeImageSource", (e) => Kd(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : lT(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, gz)}`],
	["iconShapeClass", (e) => Q(e, _z) === "circle" ? "ui-icon--circle" : ""],
	["textTypeClass", (e) => `ui-text-type--${Q(e, vz)}`],
	["textAppearanceClass", (e) => HB(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, yz)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, bz)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, wz)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, kz)}`],
	["badgeTextFit", (e) => PB(e)],
	["buttonClass", (e) => `ui-button--${Q(e, Oz)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, Pz)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, Fz)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, Iz)}`],
	["selectionModeAttribute", (e) => Q(e, Lz)],
	["selectionBackgroundCss", (e) => EB(CB(e, "background"))],
	["selectionForegroundCss", (e) => EB(CB(e, "foreground"))],
	["selectionMarkColorCss", (e) => EB(CB(e, "markColor"))],
	["selectionMarkCss", (e) => TB(CB(e, "mark"))],
	["selectionFontWeightCss", (e) => wB(CB(e, "bold"))],
	["selectionActionBarBackgroundCss", (e) => EB(CB(e, "actionBarBackground"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, zz)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, Bz)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, Vz)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, Vz)}`],
	["hostViewport", (e) => pB(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, Hz)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, Tz)}`],
	["searchFieldAppearanceClass", (e) => `ui-search__field--${Q(e, Tz)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, Dz)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, Ez)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, Ez)}`],
	["textInputTypeAttribute", (e) => Q(e, Uz)],
	["inputModeAttribute", (e) => Q(e, Wz)],
	["colorTextFormatAttribute", (e) => Q(e, Gz)],
	["colorInputVariantAttribute", (e) => Q(e, Kz)],
	["themeNameCss", (e) => Q(e, Az)],
	["alignmentCss", (e) => Q(e, jz)],
	["alignmentStretchFallbackCss", (e) => Q(e, jz) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, Mz)],
	["layoutLengthCss", (e) => mB(e)],
	["thicknessCss", (e) => gB(e)],
	["borderNoneClass", (e) => vB(e)],
	["radiusCss", (e) => yB(e)],
	["gridUnitCss", (e) => bB(e)],
	["pixelsCss", (e) => QB(e)],
	["gridTemplateCss", (e) => xB(e)],
	["colorVariantCss", (e) => KB(e)],
	["themeColorCss", (e) => EB(e)],
	["themeInkCss", (e) => OB(e)],
	["themeOnColorCss", (e) => AB(e)],
	["themeColorInlineCss", (e) => DB(e) ? "" : EB(e)],
	["themeColorCanonical", (e) => WB(e)],
	["textAppearanceFontSizeCss", (e) => UB(e, "size")],
	["textAppearanceFontWeightCss", (e) => UB(e, "weight")],
	["textAppearanceLineHeightCss", (e) => UB(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => UB(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => mB(U(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => mB(U(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => mB(U(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => mB(U(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => mB(U(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => hB(U(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => hB(U(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => hB(U(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => hB(U(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => hB(U(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => hB(U(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => hB(U(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => hB(U(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => hB(U(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => hB(U(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => gB(U(e, "base"))],
	["responsiveThicknessSmCss", (e) => gB(U(e, "sm"))],
	["responsiveThicknessMdCss", (e) => gB(U(e, "md"))],
	["responsiveThicknessXlCss", (e) => gB(U(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => gB(U(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => _B(U(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => _B(U(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => _B(U(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => _B(U(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => _B(U(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => _B(U(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => _B(U(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => _B(U(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => _B(U(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => _B(U(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => $B(U(e, "base"))],
	["responsivePixelsSmCss", (e) => $B(U(e, "sm"))],
	["responsivePixelsMdCss", (e) => $B(U(e, "md"))],
	["responsivePixelsXlCss", (e) => $B(U(e, "xl"))],
	["responsivePixelsXxlCss", (e) => $B(U(e, "xxl"))],
	["visibilityBaseAttribute", (e) => eV(e, "base")],
	["visibilitySmAttribute", (e) => eV(e, "sm")],
	["visibilityMdAttribute", (e) => eV(e, "md")],
	["visibilityXlAttribute", (e) => eV(e, "xl")],
	["visibilityXxlAttribute", (e) => eV(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, qz)}`],
	["imageShapeClass", (e) => Q(e, Yz) === "circle" ? "ui-image--circle" : ""],
	["backgroundImageCss", (e) => aB(e)],
	["backgroundImageAttribute", (e) => aB(e).length === 0 ? void 0 : ""],
	["imageFitSizeCss", (e) => Q(e, Jz)],
	["backgroundImageDimCss", (e) => oB(e)],
	["backgroundImageDimModeAttribute", (e) => Q(e, Xz) === "vignette" ? "vignette" : void 0],
	["backgroundImageBlurCss", (e) => cB(e) ? `${Number(e)}px` : ""],
	["backgroundImageBlurAttribute", (e) => cB(e) ? "" : void 0],
	["positiveCount", (e) => sB(e)?.toString()],
	["positiveFlagAttribute", (e) => sB(e) === void 0 ? void 0 : ""],
	["maxLinesClass", (e) => sB(e) === void 0 ? "" : "ui-text--max-lines"],
	["progressVariantClass", (e) => `ui-progress--${Q(e, Zz)}`],
	["progressValueText", (e) => ZB(e)],
	["textAreaResizeCss", (e) => Q(e, Qz)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, $z)}`],
	["popupPlacementAttribute", (e) => Q(e, $z)],
	["tabMenuEntriesAttribute", (e) => rB(e)],
	["markedDaysAttribute", (e) => iB(e)]
]), nB = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function rB(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = nB.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function iB(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function aB(e) {
	return Zd(e);
}
function oB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isNaN(t) ? "" : String(Math.min(1, Math.max(0, t)));
}
function sB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isInteger(t) && t > 0 ? t : void 0;
}
function cB(e) {
	let t = typeof e == "number" ? e : Number(e ?? NaN);
	return Number.isFinite(t) && t > 0;
}
var lB = [
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
], uB = new Map(lB.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), dB = new Map(lB.map(([e, t]) => [e, t])), fB = /* @__PURE__ */ new Map([[Mz, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : fB.get(t)?.get(e)) ?? pz.get(e) ?? wr(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function pB(e) {
	return e == null || Q(e, Vz) === "disabled" ? void 0 : "parent";
}
function mB(e) {
	if (e == null) return "";
	if (typeof e == "number") return QB(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? QB(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function hB(e, t) {
	if (typeof e != "object" || !e) return mB(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? mB(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function gB(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function _B(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return QB(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return QB(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function vB(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function yB(e) {
	if (e == null) return "";
	if (typeof e == "number") return QB(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? QB(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function bB(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return QB(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function xB(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return bB(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return bB(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${bB(e[0])})` : e.map((e) => bB(e)).join(" ");
}
function $(e, t, n) {
	return SB(U(e, t), n);
}
function SB(e, t) {
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
function CB(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function wB(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function TB(e) {
	if (e == null) return "";
	switch (Q(e, Rz)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-mark-selected))";
		default: return "none";
	}
}
function EB(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (GB(e)) return KB(e);
	let t = e, n = KB(t.light), r = KB(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = xz.get(Q(o, mz));
	return s ? `var(${s})` : "";
}
function DB(e) {
	if (typeof e != "object" || !e || GB(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function OB(e) {
	if (DB(e)) {
		let t = Sz.get(Q(e.style, mz));
		if (t !== void 0) return `var(${t})`;
	}
	return EB(e);
}
var kB = /* @__PURE__ */ new Set(["background", "surface"]);
function AB(e) {
	if (typeof e != "object" || !e) return "";
	if (GB(e)) return jB(e) ? "initial" : MB(e);
	let t = e, n = MB(t.light ?? t.dark), r = MB(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && jB(t.light ?? t.dark) && jB(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, mz);
	if (kB.has(i)) return "initial";
	let a = Cz.get(i);
	return a ? `var(${a})` : "";
}
function jB(e) {
	return qB(e)?.[3] === 0;
}
function MB(e) {
	let t = qB(e);
	return t === void 0 ? "" : OA(t[0], t[1], t[2], t[3]);
}
function NB(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, mz)}`;
}
function PB(e) {
	let t = RB(e == null ? "" : String(e).trim(), FB + 1);
	return t > 0 && t <= FB ? "compact" : "";
}
var FB = 2, IB = /[\u0300-\uFFFF]/, LB = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function RB(e, t) {
	if (!IB.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of LB.segment(e)) {
		if (n >= t) break;
		n += zB(r) ? 2 : 1;
	}
	return n;
}
function zB(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < BB.length; e += 2) if (t >= BB[e] && t <= BB[e + 1]) return !0;
	return !1;
}
var BB = [
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
function VB(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Ie, PB(n)), e.setAttribute(Le, "");
}
function HB(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, vz)}`;
}
function UB(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return QB(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : QB(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : QB(e);
		}
		default: return "";
	}
}
function WB(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = JB(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${DA(r.rgb >> 16 & 255)}${DA(r.rgb >> 8 & 255)}${DA(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${DA(e)}`;
	}
	let i = YB(r.name);
	return i === null ? "" : `${i}/${XB(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function GB(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function KB(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = qB(e);
	return t === void 0 ? "" : `#${DA(t[0])}${DA(t[1])}${DA(t[2])}${DA(t[3])}`;
}
function qB(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = YB(t.name), i = n ?? (r === null ? void 0 : uB.get(r));
	if (!i) return;
	let a = XB(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = W(c * (1 - o)), l = W(l * (1 - o)), u = W(u * (1 - o))) : a === "Tint" && (c = W(c + (255 - c) * o), l = W(l + (255 - l) * o), u = W(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function JB(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = mz[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function YB(e) {
	if (typeof e == "number") return dB.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function XB(e) {
	if (typeof e == "number") return eB[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function ZB(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function QB(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function $B(e) {
	return e == null ? "" : QB(e);
}
function eV(e, t) {
	let n = jw(e, t);
	if (n == null) return;
	let r = Q(n, Nz);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/live-announcer.ts
var tV = "ui-announcer", nV = 7e3, rV = class {
	container;
	regions = /* @__PURE__ */ new Map();
	constructor(e) {
		this.container = e, this.ensureRegion("polite"), this.ensureRegion("assertive");
	}
	announce(e, t = "polite") {
		let n = document.createElement("div");
		return typeof e == "string" ? n.textContent = e : w.writeValue(n, null, e), this.ensureRegion(t).append(n), window.setTimeout(() => n.remove(), nV), n;
	}
	ensureRegion(e) {
		let t = this.regions.get(e);
		if (t !== void 0 && t.isConnected) return t;
		let n = `.${tV}[aria-live="${e}"]`, r = this.container.querySelector(n), i = r ?? document.createElement("div");
		return r === null && (i.className = tV, i.setAttribute("aria-live", e), this.container.append(i)), this.regions.set(e, i), i;
	}
}, iV = "ui-notification-host", aV = "ui-notification", oV = "ui-notification--leaving", sV = "ui-notification__message", cV = "ui-notification__action", lV = "ui-notification__close", uV = 5e3, dV = 8e3, fV = "--ui-notification-lift", pV = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), mV = class {
	root;
	durationMs;
	host = null;
	announcer;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? uV, this.ensureHost(), this.announcer = new rV(this.root instanceof Document ? this.root.body : this.root);
	}
	announce(e, t) {
		return this.announcer.announce(e, t);
	}
	show(e) {
		let t = hz(e.severity), n = document.createElement("div");
		n.className = pV.has(t) ? `${aV} ${aV}--${t}` : aV, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = sV, typeof e.message == "string" ? r.textContent = e.message : w.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		i.type = "button", i.className = lV, w.write(i, "aria-label", "ui.notification.close"), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(_V(e.action, e.sticky === !0 ? null : () => this.dismiss(n)));
		let a = this.ensureHost();
		if (hV(a), a.append(n), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), e.sticky === !0) return n;
		let o = e.durationMs !== void 0 && e.durationMs > 0 ? e.durationMs : e.action === void 0 ? this.durationMs : dV, s = !1, c = !1, l = window.setTimeout(() => this.dismiss(n), o), u = () => window.clearTimeout(l), d = () => {
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
		if (!(!e.isConnected || e.classList.contains(oV))) {
			if (e.classList.add(oV), this.returnFocus(e), Uc() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => gV(e), N.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(oV));
		Js(Ws(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${lV}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${iV}`), n = t ?? document.createElement("div");
		return n.classList.add(iV), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function hV(e) {
	let t = window.innerHeight - Nl(window.innerHeight);
	t > 0 ? e.style.setProperty(fV, `${Math.round(t)}px`) : e.style.removeProperty(fV);
}
function gV(e) {
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
		duration: N.fast,
		easing: N.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function _V(e, t) {
	let n = document.createElement("button"), r = !1;
	return n.type = "button", n.className = `${cV} ui-button ui-button--primary ui-button--small`, typeof e.label == "string" ? n.textContent = e.label : w.writeValue(n, null, e.label), n.addEventListener("click", () => {
		r || (e.run(), t !== null && (r = !0, t()));
	}), n;
}
function vV(e, t) {
	if (e == null || typeof e.id != "string" || e.id.length === 0) return;
	if (!ha(e.label) && !ga(e.label)) {
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
function yV(e, t, n) {
	let r = e.itemKey === !0 ? bV(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = xV(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	SV(i, r);
}
function bV(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function xV(e) {
	if (mo(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (mo(t)) return t;
	return null;
}
function SV(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || T(e) || D(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && fz(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function CV(e) {
	let t = e.request?.route;
	return t == null || t.length === 0 ? null : wV(t, e.request?.parameters ?? null);
}
function wV(e, t) {
	let n = TV(t);
	if (n.length === 0) return e;
	let r = e.indexOf("#"), i = r < 0 ? e : e.slice(0, r), a = r < 0 ? "" : e.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function TV(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, EV(e));
	return t.toString();
}
function EV(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function DV(e, t) {
	let n = kV([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return kV(r, t) ?? OV(t);
}
function OV(e) {
	let t = typeof document > "u" ? null : document.scrollingElement ?? null;
	return t !== null && AV(t, e) ? t : null;
}
function kV(e, t) {
	let n = null;
	for (let r of e) if (qC(r, t)) {
		if (AV(r, t)) return r;
		n ??= r;
	}
	return n;
}
function AV(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var jV = class {
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
		this.handlers.set(Ur(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = Ur(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = CV(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Bd(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("ReplaceAddress", (e) => {
			this.writeAddress(e, (e, t) => e.replace(t));
		}), this.register("PushAddress", (e) => {
			this.writeAddress(e, (e, t) => e.push(t));
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = qr(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(Rn, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = NV(e);
			t !== null && FV(t);
		}), this.register("ScrollTo", (e) => {
			let t = NV(e);
			if (t === null) return;
			let n = e.effect, r = Wr(n.behavior), i = Gr(n.block);
			t.scrollIntoView({
				behavior: PV(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = NV(e);
			if (t === null) return;
			let n = e.effect, r = MP(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = Gr(n.block);
			KP(Co(r)), NP(r, n.key, i === "Unknown" ? "Start" : i, PV(Wr(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = NV(e);
			if (t === null) return;
			let n = e.effect, r = Jr(n.axis) !== "Horizontal", i = DV(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = Kr(n.position), u;
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
			let d = PV(Wr(n.behavior)), f = wo(i);
			f !== null && RP(f), r && l === "End" && XP(i) && GP(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			MV(NV(e), null);
		}), this.register("Hide", (e) => {
			MV(NV(e), "hidden");
		}), this.register("Collapse", (e) => {
			MV(NV(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = IV(e, this.valueReaders);
			t !== null && LV(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = NV(e);
			t !== null && yV(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = NV(e);
			t !== null && !ld(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!Id(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!ha(t.message) && !ga(t.message)) {
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
				action: this.runAction === void 0 ? void 0 : vV(t.action, this.runAction)
			});
		}), this.register("Announce", (e) => {
			let t = e.effect;
			if (!ha(t.message) && !ga(t.message)) {
				s("announce effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("announce effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.announce(t.message, Yr(t.politeness) === "Assertive" ? "assertive" : "polite");
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
function MV(e, t) {
	if (e !== null) for (let n of rr) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function NV(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(S(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function PV(e) {
	return e === "Smooth" && !Uc() ? "smooth" : "auto";
}
function FV(e) {
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
function IV(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = NV(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : oo(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : eo(t.readHeld(r));
}
async function LV(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!RV(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function RV(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return dz();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var zV = class {
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
		return this.root.querySelector(`[${Bl}="${Cr(e)}"]`);
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
			if (e.key === "Escape" && t.hasAttribute("data-ui-dialog-close-escape") && !au() && !Yl(e.target) && !Up(e.target)) {
				let n = t.getAttribute(Bl);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(b)?.dispatchEvent(new Event("close", { bubbles: !0 }));
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
}, BV = "ui-leave", VV = new Cf("data-ui-leave-part"), HV = "560px", UV = null, WV = null;
function GV(e, t) {
	UV ??= KV();
	let n = UV;
	n.isConnected || document.body.append(n), qV(n, "title", w.text("ui.leave.title")), qV(n, "message", w.text("ui.leave.message")), qV(n, "stay", w.text("ui.leave.stay")), qV(n, "leave", w.text("ui.leave.confirm")), WV = {
		dialogs: e,
		leave: t
	}, e.open(BV);
}
function KV() {
	let { dialog: e, surface: t } = Sf({
		key: BV,
		className: "ui-leave-dialog",
		role: "alertdialog",
		labelledBy: "ui-leave-title",
		describedBy: "ui-leave-message",
		closesOnEscapeAndBackdrop: !0
	});
	t.style.setProperty("--ui-max-width-sm", HV);
	let n = VV.element("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), r = VV.element("p", "ui-leave-dialog__message ui-text-type--body", "message");
	return n.id = "ui-leave-title", r.id = "ui-leave-message", t.append(n, r, VV.actions(VV.button("ui-button--outline", "stay"), VV.button("ui-button--danger", "leave"))), e.addEventListener("click", (e) => {
		let t = VV.pressed(e);
		if (t !== "stay" && t !== "leave") return;
		let n = WV;
		WV = null, n?.dialogs.close(BV), t === "leave" && n?.leave();
	}), e;
}
function qV(e, t, n) {
	let r = VV.find(e, t);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var JV = class {
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
		let t = YV(e, this.options.window.location.href);
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
function YV(e, t) {
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
	return Bd(s) ? s : null;
}
//#endregion
//#region src/effects/address-history.ts
var XV = class {
	window;
	revisit;
	load;
	route;
	search;
	constructor(e) {
		this.window = e.window, this.revisit = e.revisit, this.load = e.load, this.route = e.window.location.pathname, this.search = e.window.location.search, e.window.addEventListener("popstate", () => this.onPopState());
	}
	replace(e) {
		this.write(wV(this.route, e), !1);
	}
	push(e) {
		let t = wV(this.route, e), n = this.window.location;
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
		e.search !== this.search && (this.search = e.search, this.revisit(ZV(e.search)));
	}
};
function ZV(e) {
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
var QV = class {
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
		!this.state.set(e, t, n, eH(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return qa(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Ve), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, eH(r[0]?.component)) ? {
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
			(typeof n == "string" || ga(n) ? this.addressResolver.isTranslatable(t.reference) : ha(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${Be}${wr(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of Dr(e, t, () => $V(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ve))), r = e.closest(b);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Ve)));
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
function $V(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(b) === e) return [n];
	return [e];
}
function eH(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(b) ?? null, r = e === null ? 0 : C(e), i = n.getAttribute(_);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: ri(e, ni(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var tH = "EndValue", nH = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Zs) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t), !0);
	}
	watch(e, t) {
		let n = S(e.componentId), r = rH(n, e.propertyId), i = this.watchers.get(r);
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
		let n = ui(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.valueReaders.readBound(e.target), a = e.target.hasAttribute(dt);
		for (let e of r) {
			if (t.metadata !== void 0 && t.metadata.getPropertyDefinition(e.propertyId)?.propertyName === tH !== a) continue;
			let n = this.propertyPatchEngine.recordValue(e, [], i);
			n !== null && this.notify(n);
		}
	}
	notify(e) {
		let t = rH(S(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function rH(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function iH(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : C(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var aH = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, oH(t));
	}
	apply(e) {
		let t = S(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), Br(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) sH(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) cH(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) lH(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) uH(n, t.key, t.newIndex);
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
function oH(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function sH(e, t) {
	typeof t.key == "string" && (cH(e, t.key), e.splice(dH(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function cH(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function lH(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		sH(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function uH(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(dH(n, e.length), 0, i);
}
function dH(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/item-projections.ts
var fH = class {
	byHost = /* @__PURE__ */ new Map();
	records = /* @__PURE__ */ new WeakMap();
	reported = /* @__PURE__ */ new Set();
	get isEmpty() {
		return this.byHost.size === 0;
	}
	describe(e, t) {
		this.byHost.set(e, pH(e, "", t.map((e) => e.split("."))));
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
function pH(e, t, n) {
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
	for (let [n, a] of r) i.set(n, a.whole || a.rest.length === 0 ? null : pH(e, `${t}${a.name}.`, a.rest));
	return {
		host: e,
		prefix: t,
		members: i
	};
}
function mH(e) {
	let t = new fH();
	for (let n of e.metadata.items) n.itemPaths !== null && n.itemPaths !== void 0 && t.describe(S(n.componentId), n.itemPaths);
	return t;
}
//#endregion
//#region src/items/pending-moves.ts
var hH = class {
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
}, gH = class {
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
function _H(e, t) {
	let n = vH(e[t], "Reset");
	if (n === null) return null;
	let r = S(n.component?.id), i = n.component?.dynamicParameters ?? [];
	if (r <= 0) return null;
	let a = null, o = null, s = t + 1;
	for (; s < e.length; s++) {
		let t = vH(e[s], "Insert");
		if (t === null || S(t.component?.id) !== r || !mc(i, t.component?.dynamicParameters ?? [])) break;
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
function vH(e, t) {
	if (e === void 0 || Hr(e) !== "CollectionChange") return null;
	let n = e;
	return Br(n.action) === t ? n : null;
}
//#endregion
//#region src/updates/collection-sinks.ts
var yH = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function bH(e, t, n, r) {
	return {
		action: Br(e.action),
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
var xH = [], SH = class {
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
	held = new aH();
	projections;
	moves = new hH({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	transfers = new gH({
		take: (e, t) => this.takeRow(e, t),
		restore: (e, t) => this.restoreRow(e, t),
		place: (e, t, n, r) => this.placeRow(e, t, n, r),
		remove: (e, t) => this.removeRow(e, t),
		holds: (e, t) => kH(R(e), t) !== null,
		itemOf: (e) => this.readItemValue(e)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e)), this.projections = mH(e), this.projections.isEmpty || yv((e, t) => this.projections.check(e, t));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${v}]`)) {
			let e = ui(n);
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
			return n === void 0 && (n = AH(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${v}]`)) {
			let t = di(e);
			if (t === null) continue;
			let r = this.metadata.getItemValues(t.componentId, t.dynamicParameters);
			this.projections.isEmpty || this.projections.mark(t.componentId, r);
			for (let i of r) this.registerItemValue(t.componentId, n(e), i.key, i.item);
		}
		for (let t of e?.updates ?? []) {
			if (Hr(t) !== "CollectionChange") continue;
			let e = t;
			if (Br(e.action) !== "Insert") continue;
			let r = S(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, OH(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of iH(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${v}]`)) {
			let t = ui(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		EM(e, t, {
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
				let r = _H(t, e);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Xe) === !0;
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
		this.transfers.around(e, () => this.moves.around(e, xH, () => this.refillHostRows(e, t)));
	}
	refillHostRows(e, t) {
		if (Z_(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = AH(e), i = [], a = [];
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
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), DH(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
		switch (Hr(e)) {
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
		let t = S(e.address?.component?.id), n = Vr(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (S(e.address?.component?.id) <= 0) {
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
		let t = S(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (this.projections.isEmpty || this.projections.mark(t, e.items ?? []), r !== null && i !== null) {
			this.sinks.dispatch(i, bH(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (Br(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = Br(e.action) === "Move" ? TH(e.moves ?? []) : xH;
		for (let n of o) a && this.held.isWaiting(n) || this.transfers.around(n, () => this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e)));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (Z_(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.afterRowsChanged(e, t);
			return;
		}
		switch (Br(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				CH(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				EH(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), $v(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.afterRowsChanged(e, t);
	}
	afterRowsChanged(e, t = ui(e)) {
		t !== null && this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = Z_(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : qv(e, R(e)).findIndex((e) => e.getAttribute(_) === t);
		return n < 0 ? null : n + Q_(e);
	}
	moveRow(e, t, n) {
		let r = ui(e);
		if (r === null) return;
		let i = Math.max(0, n - Q_(e));
		Z_(e) === "virtualized" ? this.virtualization.move(e, t, i) : EH(e, [{
			key: t,
			newIndex: i
		}]), this.afterRowsChanged(e, r);
	}
	takeRow(e, t) {
		let n = R(e), r = kH(n, t);
		if (r === null) return null;
		let i = qv(e, n), a = i.indexOf(r);
		return Xv(i, r), r.remove(), this.afterRowsChanged(e), {
			element: r,
			index: a
		};
	}
	restoreRow(e, t) {
		let n = qv(e, R(e));
		e.insertBefore(t.element, Yv(n, t.element, t.index)), this.afterRowsChanged(e);
	}
	placeRow(e, t, n, r) {
		let i = ui(e), a = i === null ? null : this.renderItemElement(i, n, t, this.itemsRenderer.getAncestorStack(e));
		return a === null ? null : (e.insertBefore(a, Yv(qv(e, R(e)), a, r)), this.afterRowsChanged(e), a);
	}
	removeRow(e, t) {
		Xv(qv(e, R(e)), t), t.remove(), this.afterRowsChanged(e);
	}
	forgetRowState(e, t, n) {
		switch (Br(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (Br(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${v}]`)) if (ui(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = qv(e, R(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, Yv(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return UI(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = R(e), a = qv(e, i), o = AH(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, Yv(a, l, i.index ?? null)) : (Qv(a, c, l), c.replaceWith(l)));
		}
	}
};
function CH(e, t) {
	let n = R(e), r = qv(e, n), i = AH(e, n), a = wH(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? ms(a, o, n) : null;
		i.delete(t), Xv(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function wH(e) {
	let t = e.parentElement, n = t?.closest(k) ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function TH(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function EH(e, t) {
	let n = R(e), r = qv(e, n), i = AH(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = Zv(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function DH(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? R(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function OH(e) {
	let t = C(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : C(n);
}
function kH(e, t) {
	return e.find((e) => e.getAttribute("data-ui-key") === t) ?? null;
}
function AH(e, t = R(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(_);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function jH(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return ha(n) || ga(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: NH(t.severity)
	} : void 0;
}
function MH(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = w.resolve(ha(t) || ga(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function NH(e) {
	let t = Lr(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var PH = "ui-validation--warning", FH = "ui-validation--info", IH = "ui-validation-message--marker", LH = "top-end", RH = "right", zH = "--ui-validation-marker-host", BH = "ui-validation-mark", VH = "--ui-validation-presentation", HH = "--ui-validation-color", UH = "Validation", WH = /* @__PURE__ */ new Set(["Value", "EndValue"]), GH = /* @__PURE__ */ new Set(["Min", "Max"]), KH = `input:not([type='hidden']), textarea, select, .${mr}[role='combobox'], [role='spinbutton']`, qH = {
	Error: 0,
	Warning: 1,
	Info: 2
}, JH = {
	Error: br,
	Warning: PH,
	Info: FH
}, YH = `.${br}, .${PH}, .${FH}`, XH = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, ZH = {
	Error: "error",
	Warning: "warning",
	Info: "info"
}, QH = {
	Error: `${BH}--error`,
	Warning: `${BH}--warning`,
	Info: `${BH}--info`
}, $H = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, eU = class {
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
		}, !0), this.applyRenderedMessages(this.root.querySelectorAll(YH)), P(this.root, YH, { childList: !0 }, (e) => this.applyRenderedMessages(e)), w.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(YH)), this.rewriteMessageLines(), this.rejudgeBounds();
		}), w.onTable(() => this.rewriteShownMessages());
	}
	rewriteShownMessages() {
		for (let e of this.root.querySelectorAll(YH)) {
			let t = C(e);
			this.resolveDisplay(t, e) !== void 0 && this.applyCurrentState(t, e);
		}
	}
	judgeShown(e, t) {
		let n = this.options.dom.resolveNearestComponent(e, () => !0);
		if (n === null) return;
		let { componentId: r, element: i } = n, a = this.forgetJudgement(i), o = this.options.metadata.getValidationsForComponent(r), s = t ?? (rU(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(i));
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
			oU(t, iU(t) === "Error");
			let e = t.querySelector(`:scope > [${xr}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && (this.recordRenderedMessage(t, e), sU(this.markerMirrors, t, e, {
				message: n,
				severity: iU(t)
			}));
		}
	}
	recordRenderedMessage(e, t) {
		if (this.renderedRead.has(e) || (this.renderedRead.add(e), this.resolveDisplay(C(e), e) !== void 0)) return;
		let n = Ua(t), r = iU(e);
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
		if (e.propertyName === UH) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyGivenValue(e), this.applyChangeTrigger(e);
	}
	applyGivenValue(e) {
		let t = WH.has(e.propertyName), n = GH.has(e.propertyName);
		for (let r of e.components) {
			let i = this.refusalByElement.get(r)?.property === e.propertyName, a = this.boundRefusalByElement.has(r);
			if (a && n) {
				this.judgeBounds(C(r), r);
				continue;
			}
			!i && !(a && t) || (i && this.refusalByElement.delete(r), t && this.forgetBoundRefusal(r), this.applyCurrentState(C(r), r));
		}
	}
	applyBoundMessage(e) {
		let t = S(e.reference.componentId), n = jH(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = S(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Ir(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = S(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = ha(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: NH(e.severity),
			content: e.content === !0,
			property: Vr(e.address?.property)
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
		let n = D(t) || T(t) ? null : tU(t, (e) => this.readValue(e)), r = this.boundRefusalByElement.get(t)?.message;
		return nU(r, n) ? n !== null : (n === null ? this.forgetBoundRefusal(t) : (this.boundRefusalByElement.set(t, {
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
		for (let e of [...this.boundRefused]) e.isConnected ? this.judgeBounds(C(e), e) : this.forgetBoundRefusal(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: $H[t]
		}), this.applyCurrentState(C(e), e);
	}
	entryRefusal(e, t, n) {
		for (let r of this.options.metadata.getValidationsForComponent(C(e))) if (NH(r.severity) === "Error" && Ac(t, r.operator, r.value) && !Ac(n, r.operator, r.value)) return r.message;
		return null;
	}
	judge(e, t) {
		let n = null;
		for (let r of this.options.metadata.getValidationsForComponent(e)) !Ac(t, r.operator, r.value) && (n === null || qH[NH(r.severity)] < qH[NH(n.severity)]) && (n = r);
		return n === null ? null : {
			severity: ZH[NH(n.severity)],
			words: n.message
		};
	}
	refuses(e) {
		let t = this.options.dom.resolveNearestComponent(e, () => !0);
		if (t === null) return !1;
		let { componentId: n, element: r } = t, i = this.options.metadata.getValidationsForComponent(n);
		return this.touchedElements.add(r), this.judgeBounds(n, r), i.length > 0 && this.evaluateAndApply(n, r, i, rU(e) ? this.options.valueReaders.readBound(e) : this.options.valueReaders.readHeld(r)), this.hasError(n, r);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		aU(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${S(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(MH).join("\n"), !0);
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
			severity: NH(t.severity)
		});
		let c;
		for (let e of n) (c === void 0 || qH[e.severity] < qH[c.severity]) && (c = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Ir(e.trigger) === t);
		if (r.length === 0) return;
		let i = rU(e.target) ? this.options.valueReaders.readBound(e.target) : this.options.valueReaders.readHeld(n.element);
		this.evaluateAndApply(n.componentId, n.element, r, i);
	}
	runSubmitValidation(e) {
		let t = !0;
		for (let { field: n, component: r } of this.formFields(e)) {
			let e = this.options.metadata.getValidationsForComponent(r.componentId).filter((e) => Ir(e.trigger) === "Submit");
			e.length > 0 && (this.touchedElements.add(r.element), this.evaluateAndApply(r.componentId, r.element, e, this.options.valueReaders.readBound(n))), this.hasError(r.componentId, r.element) && (t = !1, this.touchedElements.has(r.element) || (this.touchedElements.add(r.element), this.applyCurrentState(r.componentId, r.element)));
		}
		return t;
	}
	*formFields(e) {
		for (let t of this.root.querySelectorAll(`[${kt}="${Cr(e)}"]`)) {
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
			let e = [...t.element.querySelectorAll(KH)].find((e) => e.closest("[role='listbox'], [role='menu'], [role='dialog']") === null) ?? null;
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
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && NH(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Ac(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function tU(e, t) {
	return W_(e, t) ?? (e.matches(fb) ? ix(e) : null);
}
function nU(e, t) {
	return e === void 0 || t === null ? e === void 0 && t === null : ha(e) && e.key === t.key && JSON.stringify(e.args) === JSON.stringify(t.args);
}
function rU(e) {
	return !e.hasAttribute("data-ui-draft") && (e.hasAttribute("data-ui-value-kind") || e.matches("input, textarea, select"));
}
function iU(e) {
	return e.classList.contains(PH) ? "Warning" : e.classList.contains(FH) ? "Info" : "Error";
}
function aU(e, t, n) {
	for (let e of Object.values(JH)) t.classList.toggle(e, n !== void 0 && JH[n.severity] === e);
	oU(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(HH) : r.style.setProperty(HH, `var(--ui-color-${XH[n.severity]}-ink)`);
	let i = t.querySelector(":scope > [data-ui-validation-message]") ?? t.querySelector("[data-ui-validation-message]");
	i !== null && (n?.content === !0 ? (Va(i, null), i.textContent = String(n.message ?? "")) : w.writeValue(i, null, n?.message ?? null), sU(e, r, i, n));
}
function oU(e, t) {
	for (let n of e.querySelectorAll(KH)) {
		let r = n.closest(pr);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function sU(e, t, n, r) {
	let i = getComputedStyle(n), a = i.getPropertyValue(VH).trim(), o = r !== void 0 && a === "marker";
	if (n.classList.toggle(IH, o), cU(e, t, a === "elsewhere" ? void 0 : r, n.textContent ?? "", i.getPropertyValue(zH).trim()), r !== void 0 && o) {
		n.setAttribute(je, n.textContent ?? ""), n.setAttribute(Me, LH), n.setAttribute(Pe, ZH[r.severity]), t.setAttribute(Ne, ""), t.contains(document.activeElement) ? jE(n) : ME(n);
		return;
	}
	n.removeAttribute(je), n.removeAttribute(Me), n.removeAttribute(Pe), t.removeAttribute(Ne), ME(n);
}
function cU(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : uU(t, i);
	if (n === void 0 || o === null) {
		a !== void 0 && lU(a), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${BH} ${QH[n.severity]}`, s.textContent = r, s.setAttribute(je, r), s.setAttribute(Me, RH), s.setAttribute(Pe, ZH[n.severity]), s.setAttribute(Fe, ""), s.parentElement !== o && (lU(s), o.append(s)), o.setAttribute(Ne, ""), e.set(t, s), ME(s);
}
function lU(e) {
	let t = e.parentElement;
	e.remove(), t !== null && t.querySelector(`:scope > .${BH}`) === null && t.removeAttribute(Ne);
}
function uU(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var dU = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, fU = "tooltip-name";
function pU(e, t, n) {
	let r = lT(e.getAttribute(je));
	if (Va(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var mU = /* @__PURE__ */ new WeakMap(), hU = /* @__PURE__ */ new Map([["iconClass", af]]), gU = /* @__PURE__ */ new WeakMap(), _U = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Rr(e), t);
	}
	apply(e) {
		let t = Rr(e.operation.kind), n = this.handlers.get(t);
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
			let t = eo(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Va(e.target, null);
		}), this.register("Markup", (e) => {
			dT(e.target, to(e.convertedValue) ? "" : eo(e.convertedValue)), Va(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = wU(e.operation);
			if (Va(e.target, t), to(e.value) || to(e.convertedValue)) {
				CU(e.target, t);
				return;
			}
			SU(e.target, t, eo(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = wU(e.operation);
			Va(e.target, t), CU(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = wU(e.operation), n = !to(e.value) && vU(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (to(e.convertedValue) ? "" : eo(e.convertedValue));
			yU(e.target, xU(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !to(e.value) && vU(e.value, e.operation.condition ?? "None") ? eo(e.convertedValue).trim() : "";
			bU(e.target, xU(e), t, hU.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = wU(e.operation), n = !to(e.value) && vU(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? eo(e.convertedValue).trim() : "";
				bU(e.target, xU(e), t);
			}
		}), this.register("Style", (e) => {
			let t = wU(e.operation), n = e.target;
			if (to(e.value) || to(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = eo(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(fU, (e) => pU(e.resolved.component, e.target, wU(e.operation))), this.register(rz, (e) => oz(e.target, e.value)), this.register("Property", (e) => {
			let t = wU(e.operation), n = e.target, r = to(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function vU(e, t) {
	switch (zr(t)) {
		case "None": return !0;
		case "HasValue": return !to(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !to(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return of(e).length > 0;
		default: return !to(e);
	}
}
function yU(e, t, n, r, i) {
	let a = gU.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), gU.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), SU(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && CU(e, n);
}
function bU(e, t, n, r) {
	let i = mU.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), mU.set(e, i));
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
function xU(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function SU(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function CU(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function wU(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var TU = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => tB.has(e.name),
			convert: (e) => tB.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = EU(e.name), n = {
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
function EU(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var DU = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = Xr(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = Xr(e.domEventName) || t;
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
		return this.definitions.get(Xr(e));
	}
};
function OU(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function kU(e) {
	e.register({
		name: "click",
		attach: (e) => {
			e.root.addEventListener("click", e.dispatch, !0), e.root.addEventListener(fs, e.dispatch, !0);
		}
	}), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => OU(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => OU(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var AU = class {
	converters = new TU();
	events = new DU();
	operations = new _U();
	valueReaders;
	collectionSinks = new yH();
	rowDecorators = new dU();
	constructor(e, t, n, r) {
		kU(this.events), this.valueReaders = new ro(r);
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
}, jU = "Submenu", MU = "ui-menu__submenu", NU = "Select", PU = {
	kind: "menu",
	decorate: FU
};
function FU(e) {
	if (!IU(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, jU);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(Nt, ""), LU(e.item, "Kind") === NU && e.row.setAttribute(Pt, ""), LU(e.item, "Expanded") === !0 && e.row.setAttribute(Ft, "");
	let r = document.createElement("div");
	r.className = MU, r.appendChild(n), aI(r, e.key, e.item), e.row.appendChild(r);
}
function IU(e) {
	let t = LU(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function LU(e, t) {
	let n = Ev(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var RU = {
	kind: "grip",
	decorate: zU
};
function zU(e) {
	e.row.append(BU());
}
function BU() {
	let e = document.createElement("span");
	return e.className = ve, e.setAttribute("role", "button"), w.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function VU(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(UU(n));
	for (let t of e.querySelectorAll(`[${$e}]`)) HU(t, Qe, r), HU(t, rt, i);
}
function HU(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function UU(e) {
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
var WU = 2;
function GU(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= WU && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function KU(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var qU = "ne.standard.ui.windowId", JU = [
	500,
	1e3,
	2e3
], YU = 3, XU = [
	["refusal", ({ root: e }) => LF(e)],
	["file input", ({ root: e, validation: t }) => new _d({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new Cp({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n, validation: r }) => new zp({
		root: e,
		dom: t,
		propertyPatchEngine: n,
		validation: r
	})],
	["field keys", ({ root: e }) => new dm({ root: e })],
	["field box press", ({ root: e }) => new im({ root: e })],
	["image fallback", ({ root: e }) => new bm({ root: e })],
	["radio group sync", ({ root: e }) => new jm({ root: e })],
	["select interaction", ({ root: e, validation: t }) => new Qh({
		root: e,
		validation: t
	})],
	["search input", ({ root: e }) => new ah({ root: e })],
	["debounced commit", ({ root: e }) => new _g({ root: e })],
	["commit gate", ({ root: e, propertyPatchEngine: t }) => new ug({
		root: e,
		propertyPatchEngine: t
	})],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => bg() ? void 0 : new xg({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new UM({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Jg({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new rj({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new iS({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new jS({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new US({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new cP({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new kP({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new jC({ root: e })],
	["split button", ({ root: e }) => new Sk({ root: e })],
	["toggle button", ({ root: e }) => new Kp({ root: e })],
	["button group", ({ root: e }) => new Ok({ root: e })],
	["menu", ({ root: e }) => new VE({ root: e })],
	["action bar", ({ root: e }) => new lw({ root: e })],
	["collapsible", ({ root: e }) => new DO({ root: e })],
	["menu group", ({ root: e }) => new Kw({ root: e })],
	["menu search", ({ root: e }) => new nO({ root: e })],
	["side drawer", ({ root: e }) => new gO({ root: e })],
	["skip link", ({ root: e }) => new xO({ root: e })],
	["screen keyboard", () => new Ly()],
	["grid splitter", ({ root: e }) => new ck({ root: e })],
	["accordion", ({ root: e }) => new Mk({ root: e })],
	["tabs", ({ root: e }) => new rA({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new zN({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new fA({ root: e })],
	["breadcrumbs", ({ root: e }) => new TA({ root: e })],
	["scroll anchor", ({ root: e }) => new qP({ root: e })],
	["surface press", ({ root: e }) => new tF({ root: e })],
	["text selection", ({ root: e }) => new sF({ root: e })],
	["scroll group", ({ root: e }) => new mF({ root: e })],
	["flyout interaction", ({ root: e }) => new ku({ root: e })],
	["text fold", ({ root: e }) => new $N({ root: e })],
	["tooltip", ({ root: e }) => nE(e)]
], ZU = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new kr(fL());
	hydration = gL();
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
		this.options = e, this.root = e.root ?? document, this.windowId = tW(e.windowIdStorageKey ?? qU), this.dom = new li(this.root), w.load(this.root), w.setLanguage(document.documentElement.lang), e.strings !== void 0 && w.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : w.loadTableAsync(this.hydration.words.href)), this.extensions = new AU(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(PU), this.extensions.registerRowDecorator(RU);
		let t = new ti(this.dom, this.metadata), n = this.extensions.operations, r = new AL(), i = new QV(t, n, this.extensions, r);
		this.reactiveSources = new nH(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders,
			metadata: this.metadata
		}), this.dialogs = new zV({ root: this.root }), this.notifications = new mV({ root: this.root });
		let a = new XV({
			window,
			revisit: (e) => void this.navigateInPlaceAsync(e),
			load: () => window.location.reload()
		});
		this.effects = new jV({
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
		let o = new Lc(this.metadata), u, d = new wc(o, i, new kc(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				u?.syncPropertyAsync(S(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), f = new cL(this.dom), p = new tI(this.metadata, f, this.extensions, n, r);
		this.virtualization = new qI({
			root: this.root,
			metadata: this.metadata,
			templates: f,
			renderer: p,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new SH(this.metadata, i, r, p, f, this.dom, this.virtualization, this.extensions.collectionSinks), w.onChange(() => this.rewriteWords(i, p)), this.rewriteMoments = () => this.rewriteWords(i, p, !0), w.onMomentTick(this.rewriteMoments), new dI({
			root: this.root,
			metadata: this.metadata,
			templates: f,
			renderer: p,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new GR(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new DL(this.transport), w.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Or.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(Or.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				uL(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && uL(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let m = new ez(this.transport);
		u = new nc({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: m,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n),
			refuses: (e) => h.refusesBounds(e)
		}), i.setHeldTargets((e) => u?.isHeld(e) === !0), this.effects.register(Or.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) {
				for (let n of u?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
				h.discardForm(t);
			}
		}), this.leaveGuard = new JV({
			window,
			ask: async (e) => (await u?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => GV(this.dialogs, t),
			pending: () => hg() || m.isBusy,
			settle: async () => {
				gg(), await m.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(Or.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Bd(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let h = new eU({
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
		for (let [e, t] of XU) GU(e, t, this.engineContext);
		GU("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new H_({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), GU("tree", ({ root: e, effects: t }) => new fN({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: p
			}
		}), this.engineContext), GU("items reorder", ({ root: e }) => new sy({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), GU("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new OF({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", C(e)) || d.hasEventForComponent("click", C(e))
		}) : void 0, this.engineContext), this.eventPipeline = new uc({
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
		this.eventPipeline.addEvent(LN.name, LN.registration);
		let g = iy(this.updateProcessor.moves);
		this.eventPipeline.addEvent(g.name, g.registration);
		let ee = nb(this.updateProcessor.transfers);
		for (let e of this.metadata.getEventNames()) e.startsWith("drop:") && this.eventPipeline.addEvent(e, ee);
		this.eventPipeline.addEvent(lm.name, lm.registration), GU("shortcuts", ({ root: e, dom: t }) => new XE({
			root: e,
			viewShortcuts: ZE(this.metadata.metadata),
			componentOf: (e) => t.findComponent(e, [])
		}), this.engineContext), GU("item drag", ({ root: e, dom: t }) => new ab({
			root: e,
			targetOf: (e, n) => {
				let r = t.resolveNearestComponent(e, (e) => this.metadata.hasServerEventForComponent("drop:" + n, e))?.element ?? null;
				return r instanceof HTMLElement ? r : null;
			},
			keysOf: (e) => this.virtualization.keysOf(e)
		}), this.engineContext), this.tables = new Zj({ root: this.root }), this.windows = new DI({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), GU("pager", ({ root: e, dom: t }) => new LD({
			root: e,
			dom: t,
			windows: this.windows
		}), this.engineContext), this.pluginContext = {
			...this.engineContext,
			strings: w,
			observeComponents: P,
			observeSize: Sj,
			store: new Fw(),
			numbers: S_,
			temporal: Xi,
			icons: { apply: nf },
			badges: { writeCount: VB },
			urls: {
				isImageSource: Wd,
				asBrowserReads: Ud,
				isSafeLink: Id,
				isExternalLink: zd
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
				let r = e.closest(b), a = r === null ? void 0 : this.metadata.getExposedProperty(C(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: AE,
			renames: { open: Xl },
			tables: this.tables,
			rows: eI(f, p, this.virtualization),
			uploads: od(h),
			selection: Yo,
			popups: $F,
			roving: yo,
			focus: Ms,
			states: $a,
			validation: h,
			wheel: jf,
			shortcuts: Ay,
			names: Sr
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
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed."))), this.connection = new EL({
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
		let t = oo(e);
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
		if (e === w.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		w.setRequested(e);
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
			if (n !== this.languageSwitches || i === w.language || !await w.switchToAsync(i, r)) return;
			w.notifyChanged();
		} finally {
			n === this.languageSwitches && w.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), w.language !== this.culturesLanguage && (this.culturesLanguage = w.language, Ka(this.root, (e) => VU(e, w.number, w.temporal)));
		let i = n ? ya : void 0;
		w.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(w.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		w.language.length > 0 && document.documentElement.lang !== w.language && (document.documentElement.lang = w.language), d(n ? "page's moments written again" : "page's words written again", r, { language: w.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Ka(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = S(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${ae}="${Cr(n)}"]`)) ai(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => ai(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e), this.connection.lost();
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: w.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: w.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		let t = xL(e, navigator.cookieEnabled, CL());
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
		if (xL(e, navigator.cookieEnabled, CL()) !== "reload") {
			this.loseConnection(/* @__PURE__ */ Error("the server holds a new runtime for this page again after a reload for one."));
			return;
		}
		s("the page's runtime is gone and the server built a new one; reloading.", { view: e }), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		te(this, this.options.handlerGlobalKey), sz(this.root), await eW();
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
		return Ba(this.root) || hL(this.hydration) || this.metadata.getWords().some((e) => ya(e.key)) || ya(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) GU(KU(t), t, this.pluginContext);
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
		w.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		GU(KU(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !YR(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), XR(e))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= YU) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : n.fresh === !0 ? (this.reloadForFreshRuntime(this.hydration?.view ?? ""), !1) : (SL(CL()), this.heldRuntime = n.runtime ?? null, this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(YR(e) ? await XR(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = rW(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			since: this.renderSequence,
			runtime: this.heldRuntime,
			parameters: e === null ? ZV(window.location.search) : e.parameters,
			timeZone: yL()
		};
		return this.renderSequence = null, await vL(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, JU, $U);
	}
};
async function QU(e = {}) {
	let t = performance.now(), n = new ZU(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function $U(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function eW() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function tW(e) {
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
	let n = nW();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function nW() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function rW() {
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
ee(), QU().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
