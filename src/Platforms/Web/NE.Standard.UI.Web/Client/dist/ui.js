//#region \0rolldown/runtime.js
var e = /* @__PURE__ */ ((e) => typeof require < "u" ? require : typeof Proxy < "u" ? new Proxy(e, { get: (e, t) => (typeof require < "u" ? require : e)[t] }) : e)(function(e) {
	if (typeof require < "u") return require.apply(this, arguments);
	throw Error("Calling `require` for \"" + e + "\" in an environment that doesn't expose the `require` function. See https://rolldown.rs/in-depth/bundling-cjs#require-external-modules for more details.");
}), t = "NE.Standard.UI", n = "ne.ui:log", r = {
	debug: 0,
	warn: 1,
	error: 2,
	silent: 3
}, i = ee();
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
	r[i] <= r.warn && te(console.warn, e, t);
}
function c(e, t) {
	r[i] <= r.error && te(console.error, e, t);
}
function l(e, t) {
	r[i] <= r.debug && te(console.debug, e, t);
}
function u() {
	return r[i] <= r.debug;
}
function d(e, t, n) {
	r[i] <= r.debug && te(console.debug, `${e} in ${f(performance.now() - t)}.`, n);
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
function ee() {
	try {
		let e = localStorage.getItem(n);
		if (e !== null && e in r) return e;
	} catch {}
	return "warn";
}
function te(e, n, r) {
	r === void 0 ? e(`${t} ${n}`) : e(`${t} ${n}`, r);
}
//#endregion
//#region src/runtime/global-api.ts
var ne = 2;
function re() {
	return ae();
}
function ie(e, t = "__neStandardUIRuntime") {
	window[t] = e;
	let n = ae();
	n.runtime = e, oe(e, n);
}
function ae() {
	let e = window.NEStandardUI ?? {}, t = e.__pendingEvents ?? [], n = e.__pendingConverters ?? [], r = e.__pendingDomOperations ?? [], i = e.__pendingEffects ?? [], s = e.__pendingValueReaders ?? [], c = e.__pendingCollectionSinks ?? [], l = e.__pendingStrings ?? [], u = e.__pendingEngines ?? [], d = {
		...e,
		contractVersion: ne,
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
			let r = se(e, t), i = window.NEStandardUI?.runtime;
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
function oe(e, t) {
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
function se(e, t) {
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
var m = "data-ui-id", ce = "data-ui-context", le = "data-ui-pc", h = "data-ui-key", ue = "data-ui-unselectable", de = "data-ui-undraggable", fe = "data-ui-unremovable", pe = "data-ui-unrenamable", me = "data-ui-no-context-menu", he = "data-ui-no-row-open", ge = "data-ui-no-row-drag", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-draggable", be = "data-ui-tabs-menu", xe = "data-ui-context-menu", Se = "data-ui-context-menu-use", Ce = "data-ui-action-bar", we = "data-ui-action-bar-key", Te = "data-ui-action-bar-rest", Ee = "data-ui-menu-left-out", De = "ui-action-bar", Oe = "data-ui-row-focus", ke = "data-ui-tooltip", Ae = "data-ui-tooltip-placement", je = "data-ui-tooltip-mark", Me = "data-ui-badge-text", Ne = "data-ui-badge-set", Pe = "data-ui-name", Fe = "data-ui-bind-", Ie = "data-ui-into-", Le = "data-ui-bind-value", Re = (e) => `data-ui-no-${e}`, ze = "data-ui-event-boundary", Be = "data-ui-image-caption", Ve = "data-ui-image-crop", He = "data-ui-image-crop-size", g = "data-ui-items-host", Ue = "data-ui-collection-sink", We = "data-ui-items-query", Ge = "data-ui-number-culture", Ke = "data-ui-page-culture", qe = "data-ui-temporal-culture", Je = "data-ui-empty-template", Ye = "data-ui-group-template", Xe = "data-ui-empty-placeholder", Ze = "data-ui-group-header", Qe = "data-ui-group-anchor", $e = "data-ui-group", et = "data-ui-value-holder", tt = "data-ui-value-kind", nt = "items-query", rt = "data-ui-host-mode", it = "data-ui-host-viewport", at = "data-ui-scroll-group", ot = "data-ui-scroll-lines", st = "data-ui-source-line", ct = "data-ui-window-spacer", lt = "data-ui-window-size", ut = "data-ui-window-offset", dt = "data-ui-window-total", ft = "data-ui-window-more-before", pt = "data-ui-window-more-after", mt = "data-ui-window-group-before", ht = "data-ui-window-aggregates", gt = "data-ui-form-id", _t = "data-ui-forms", vt = "data-ui-visibility", yt = "data-ui-collapsed", bt = "data-ui-menu-group", xt = "data-ui-menu-select", St = "data-ui-menu-open", Ct = "data-ui-menu-search", wt = "data-ui-menu-searching", Tt = "data-ui-menu-unmatched", Et = "data-ui-drawer-toggle", Dt = "data-ui-drawer-open", Ot = "data-ui-region", kt = "data-ui-menu-item-kind", _ = "ui-menu-item", At = "ui-menu-item--checked", jt = "ui-menu--rail", Mt = `[${kt}="header"], [${kt}="separator"]`, Nt = `[${bt}] > .${_}`, Pt = `${Nt}, .${_}[${kt}="check"]`, Ft = "data-ui-collapse-toggle", It = "data-ui-folding", Lt = "data-ui-column-limits", Rt = "data-ui-row-limits", zt = "data-ui-splitter-step", Bt = "data-ui-table-column", Vt = "data-ui-table-hide-below", Ht = "data-ui-table-starts-hidden", Ut = "data-ui-table-hidden", Wt = "ui-table__row", Gt = "ui-table__scroll", Kt = "ui-table__header", qt = "ui-table__resizer", Jt = "data-ui-table-last", Yt = "data-ui-table-reordering", Xt = "data-ui-table-dragging", Zt = "data-ui-table-drop", Qt = "data-ui-table-scrolled", $t = "data-ui-table-scrollbar", en = "data-ui-no-row-select", tn = "data-ui-tree-parent", nn = "data-ui-tree-children", rn = "data-ui-tree-folder", an = "data-ui-tree-expanded", on = "data-ui-tree-title", sn = "data-ui-tree-loading", cn = "data-ui-tree-drop-target", ln = "data-ui-tree-boot", un = "data-ui-tree-draggable", dn = "data-ui-row-editing", fn = "data-ui-image-source", pn = "data-ui-file-max-size", mn = "data-ui-file-pick", hn = "data-ui-file-drop-target-id", gn = "data-ui-theme", _n = "data-ui-theme-colors", vn = "data-ui-words", yn = "data-ui-language-switcher", bn = "data-ui-language", xn = "data-ui-splitting", Sn = "data-ui-pointer-focus", Cn = "data-ui-selection", wn = "data-ui-selected", Tn = "data-ui-selected-key", En = "data-ui-selected-keys", Dn = "data-ui-bind-selected-key", On = "data-ui-tabs-selected", kn = "data-ui-tab-order", An = "data-ui-tab-caption", jn = "data-ui-tab-pinned", Mn = [
	vt,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Nn = "data-ui-submit-form-id", v = `[${m}]`, Pn = "data-ui-href", Fn = "ui-disabled", In = "ui-loading", Ln = "ui-readonly", Rn = "ui-hidden", zn = "ui-dialog__surface", Bn = "ui-flyout__content", Vn = "data-ui-focus-holder", Hn = "[role='listbox'], [role='menu'], [role='dialog']", Un = "ui-select__trigger", Wn = `.${Un}`, Gn = "ui-button", y = "ui-select", Kn = "ui-text-input", qn = "ui-invalid", Jn = {
	componentId: m,
	key: h,
	selected: wn,
	selectedKey: Tn,
	selectedKeys: En,
	unselectable: ue,
	rowFocus: Oe,
	itemsHost: g,
	valueHolder: et,
	bindValue: Le,
	noRowOpen: he,
	noRowDrag: ge,
	eventBoundary: ze,
	focusHolder: Vn,
	tooltip: ke,
	tooltipPlacement: Ae,
	contextMenu: xe,
	contextMenuUse: Se,
	actionBar: Ce,
	actionBarKey: we,
	actionBarRest: Te,
	disabledClass: Fn,
	loadingClass: In,
	readOnlyClass: Ln,
	hiddenClass: Rn,
	buttonClass: Gn,
	selectClass: y,
	textInputClass: Kn,
	invalidClass: qn,
	sourceLine: st,
	popupSelector: Hn,
	listTriggerSelector: Wn,
	tableRowClass: Wt,
	tableScrollClass: Gt,
	tableHeaderClass: Kt,
	tableResizerClass: qt,
	tableHidden: Ut,
	hostMode: rt,
	windowOffset: ut,
	windowTotal: dt,
	windowSize: lt,
	windowMoreAfter: pt,
	windowAggregates: ht,
	itemsQuery: We,
	valueKind: tt,
	itemsQueryKind: nt,
	menuItemClass: _,
	menuItemKind: kt,
	menuItemCheckedClass: At
};
function Yn(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Xn(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Zn = 0;
function Qn(e, t) {
	return e.id.length === 0 && (Zn++, e.id = `${t}-${Zn}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function $n(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(v) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var er = {
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
	ConfirmLeave: "ConfirmLeave"
}, tr = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(x(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${x(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(x(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (x(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(Cr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(Cr(e, Sr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(wr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(xr(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(xr(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(Tr(e, t))?.items ?? [];
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
		let t = x(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = x(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(Cr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(Cr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = xr(e.eventName), n = x(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(wr(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = x(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = x(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = x(e.componentId);
		t > 0 && this.itemValuesByAddress.set(Tr(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = x(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function b(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function nr(e) {
	return b(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function rr(e) {
	return e == null ? "OneWay" : b(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function ir(e) {
	return b(e, ["Property", "Event"]);
}
function ar(e) {
	return e == null ? "SetProperty" : b(e, ["SetProperty", "Effect"]);
}
function or(e) {
	return b(e, [
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
		"LikeIgnoreCase"
	]);
}
function sr(e) {
	return b(e, ["Ascending", "Descending"]);
}
function cr(e) {
	return b(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function lr(e) {
	return b(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function ur(e) {
	return typeof e == "string" ? e : b(e, [
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
function dr(e) {
	return b(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function fr(e) {
	return b(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function x(e) {
	return e ?? 0;
}
function pr(e) {
	return typeof e == "string" ? e : "";
}
function mr(e) {
	return b(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation",
		"Page"
	]);
}
function hr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function gr(e) {
	return b(e, ["Auto", "Smooth"]);
}
function _r(e) {
	return b(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function vr(e) {
	return b(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function yr(e) {
	return b(e, ["Light", "Dark"]);
}
function br(e) {
	return b(e, ["Horizontal", "Vertical"]);
}
function xr(e) {
	return e?.trim().toLowerCase() ?? "";
}
function Sr(e) {
	return e?.trim() ?? "";
}
function Cr(e, t) {
	return `${e}:${Sr(t)}`;
}
function wr(e, t) {
	return `${e}:${xr(t)}`;
}
function Tr(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var Er = class {
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
		return this.dom.findAllComponents(x(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = x(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = x(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Fe}${Xn(r.propertyName)}="${Yn(a)}"]` : null;
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
		let n = x(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return $n(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Xn(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function Dr(e) {
	return jr(e, le);
}
function Or(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = Mr(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function kr(e, t) {
	let n = Dr(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = Or(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Ar(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = Mr(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function jr(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function Mr(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function Nr(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Pr = class {
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
		let e = this.root.querySelectorAll(v), t = this.root.querySelector(`[${Ze}]`) !== null;
		for (let n of e) {
			let e = S(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && Rr(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Qn(e, t);
	}
	findComponentParts(e, t, n) {
		return Nr(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(Lr(t)) ?? [];
		if (n.length > 0 && n.every((e) => kr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => kr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = Dr(n);
			if (e === 0) continue;
			let r = Or(n, e);
			if (r.length !== e) continue;
			let i = Lr(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(v);
			if (e === null || !zr(this.root, e)) return null;
			let r = S(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: Or(e, Dr(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function S(e) {
	return jr(e, m);
}
function Fr(e) {
	let t = e.closest(v), n = t === null ? 0 : S(t);
	return n > 0 ? n : null;
}
function Ir(e) {
	let t = e.closest(v), n = t === null ? 0 : S(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: Or(t, Dr(t))
	};
}
function Lr(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Rr(e) {
	return Dr(e) === 0;
}
function zr(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Br(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Vr(n);
	switch (Hr(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Ur(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Ur(r, i) ? "many" : "other";
		case "ru":
		case "uk": return Wr(r, i);
		case "pl": return Gr(r, i);
		default: return "other";
	}
}
function Vr(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Hr(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Ur(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function Wr(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Gr(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Kr(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var qr = {
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
function Jr(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return qr;
	try {
		return {
			...qr,
			...JSON.parse(t)
		};
	} catch {
		return qr;
	}
}
var Yr = [
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
function Xr(e, t, n) {
	if (t == null || t.trim().length === 0) return `${ei(e.getFullYear(), 4)}-${ei(e.getMonth() + 1, 2)}-${ei(e.getDate(), 2)} ${ei(e.getHours(), 2)}:${ei(e.getMinutes(), 2)}:${ei(e.getSeconds(), 2)}`;
	let r = "", i = Zr(t);
	for (let a = 0; a < t.length;) {
		let o = Qr(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += $r(o, e, n, i), a += o.length;
	}
	return r;
}
function Zr(e) {
	for (let t = 0; t < e.length;) {
		let n = Qr(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function Qr(e, t) {
	for (let n of Yr) if (e.startsWith(n, t)) return n;
	return null;
}
function $r(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return ei(t.getFullYear(), 4);
		case "yy": return ei(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return ei(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return ei(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return ei(i, 2);
		case "H": return String(i);
		case "hh": return ei(a, 2);
		case "h": return String(a);
		case "mm": return ei(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return ei(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function ei(e, t) {
	return String(e).padStart(t, "0");
}
var ti = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function ni(e) {
	let t = ti.exec(e.trim());
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
function ri(e) {
	return ii(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function ii(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var ai = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function oi(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Qr(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += si(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function si(e, t) {
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
function ci(e, t, n) {
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
		let a = Qr(t, e);
		if (a === null) {
			if (!li(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!ui(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? _i(i) : null;
}
function li(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function ui(e, t, n, r) {
	switch (n) {
		case "yyyy": return di(t, "year", mi(e, t, 4, 4));
		case "yy": return di(t, "year", fi(mi(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return di(t, "month", pi(hi(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return di(t, "month", mi(e, t, 1, 2));
		case "dddd":
		case "ddd": return hi(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return di(t, "day", mi(e, t, 1, 2));
		case "HH":
		case "H": return di(t, "hour", mi(e, t, 1, 2));
		case "hh":
		case "h": return di(t, "hour12", mi(e, t, 1, 2));
		case "mm":
		case "m": return di(t, "minute", mi(e, t, 1, 2));
		case "ss":
		case "s": return di(t, "second", mi(e, t, 1, 2));
		case "tt": return gi(e, t, r);
		default: return !1;
	}
}
function di(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function fi(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function pi(e) {
	return e === null ? null : e + 1;
}
function mi(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function hi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function gi(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function _i(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > ii(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var vi = {
	readCulture: Jr,
	format: Xr,
	parse: ni,
	toDate: ri
}, yi = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, bi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function xi(e) {
	let t = e?.trim() ?? "";
	if (!bi.test(t)) return null;
	let n = Date.parse(yi.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function Si(e) {
	return e === "date" || e === "time" || e === "relative" || e === "relative-date" ? e : "date-time";
}
function Ci(e) {
	return e === "relative" || e === "relative-date";
}
var wi = {
	...qr,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function Ti(e, t, n, r) {
	if (t === "relative") return Fi(e - r, n.language);
	if (t === "relative-date") {
		let t = Ei(e, r);
		if (t !== null) return ki(n.language).format(t, "day");
	}
	let i = n.temporal ?? wi, a = t === "date" || t === "relative-date" ? i.date : t === "time" ? i.shortTime : Kr(i, !1);
	return Xr(new Date(e), a, i);
}
function Ei(e, t) {
	let n = new Date(e), r = new Date(t), i = Math.round((Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()) - Date.UTC(r.getFullYear(), r.getMonth(), r.getDate())) / Pi);
	return Math.abs(i) <= 1 ? i : null;
}
function Di(e, t) {
	return e.length === 0 ? e : e.charAt(0).toLocaleUpperCase(Ai(t)) + e.slice(1);
}
var Oi = /* @__PURE__ */ new Map();
function ki(e) {
	let t = Oi.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(Ai(e), { numeric: "auto" }), Oi.set(e, t)), t;
}
function Ai(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var ji = 1e3, Mi = 60 * ji, Ni = 60 * Mi, Pi = 24 * Ni;
function Fi(e, t) {
	let n = ki(t), r = Math.abs(e);
	return r < 45 * ji ? n.format(0, "second") : r < 45 * Mi ? n.format(Math.round(e / Mi), "minute") : r < 22 * Ni ? n.format(Math.round(e / Ni), "hour") : r < 26 * Pi ? n.format(Math.round(e / Pi), "day") : r < 320 * Pi ? n.format(Math.round(e / (30.4375 * Pi)), "month") : n.format(Math.round(e / (365.25 * Pi)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Ii = "count";
function Li(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Ri(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var zi = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative",
	"relative-date"
]);
function Bi(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && xi(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && zi.has(t.format));
}
function Vi(e) {
	if (typeof e != "object" || !e) return !1;
	if (Bi(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (Vi(t)) return !0;
	return !1;
}
function Hi(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" || t === "relative-date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Ui(e, t, n) {
	return Li(e) ? Ki(n, e.key, e.args) : Ri(e) ? Wi(n, e.text) : t && typeof e == "string" ? Wi(n, e) : e;
}
function Wi(e, t) {
	return t.trim().length === 0 || !Gi(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Gi(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Ki(e, t, n) {
	let r = n?.[Ii];
	return qi(typeof r == "number" ? e.lookup(`${t}.${Br(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Ri(t) ? Wi(e, t.text) : Ki(e, t.key, t.args), e.writeMoment);
}
function qi(e, t, n, r = Hi) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = Ji(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += Xi(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function Ji(e, t) {
	let n = t + 1;
	for (; n < e.length && Yi(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Yi(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Xi(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Li(e) ? t === void 0 ? qi(e.key, e.args, void 0, n) : t(e) : Ri(e) ? t === void 0 ? e.text : t(e) : Bi(e) ? n(xi(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var Zi = 15e3, Qi = /* @__PURE__ */ new Set(), $i = null;
function ea(e) {
	Qi.add(e), $i === null && ($i = setInterval(ta, Zi));
}
function ta() {
	for (let e of [...Qi]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Qi.delete(e);
	}
	Qi.size === 0 && $i !== null && (clearInterval($i), $i = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var na = 256, ra = 512, ia = "script[type='application/json'][data-ui-strings]", aa = "#text", oa = `[${vn}*='"moment"']`, sa = class {
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
		let t = e.querySelector(ia)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Ki(this, e, t);
	}
	translate(e, t) {
		return Ki(this, e, t);
	}
	writeMoment = (e, t) => (Ci(t) && this.noteRelative(), Ti(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && ea(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return Ui(e, t, this);
	}
	resolveText(e) {
		return Ui(e, !0, this);
	}
	write(e, t, n, r) {
		fa(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		fa(e, t, Ui(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Li(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Ri(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		fa(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		ua(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		pa(e, (e) => {
			for (let n of e.querySelectorAll(t ? oa : `[${vn}]`)) for (let [e, r] of Object.entries(da(n))) {
				if (t && !Vi(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && fa(n, e === aa ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Ui(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > ra || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Gi(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += na) try {
			let a = await e(t, n.slice(r, r + na));
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
function ca(e) {
	let t = !1;
	return pa(e, (e) => {
		t ||= e.querySelector(oa) !== null;
	}), t;
}
function la(e, t) {
	e.hasAttribute("data-ui-words") && ua(e, t, null);
}
function ua(e, t, n) {
	let r = da(e), i = t ?? aa;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(vn) : e.getAttribute("data-ui-words") !== a && e.setAttribute(vn, a);
}
function da(e) {
	let t = e.getAttribute(vn);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function fa(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function pa(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) pa(n.content, t);
}
var C = new sa();
function ma(e, t) {
	let n = Ri(e) ? e.text : e;
	return C.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var ha = `.${Fn}, .${In}, [inert]`, ga = `:scope > [${m}]:is(${ha}), :scope > :not([${m}]) > [${m}]:is(${ha})`;
function w(e) {
	return e.closest(ha) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function T(e) {
	return e.matches(ha) || e.querySelector(ga) !== null;
}
function _a(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var va = `[${m}], .${Ln}`;
function E(e) {
	return e.closest(va)?.matches(`.${Ln}`) === !0;
}
function ya(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(Fn, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var ba = {
	isInert: w,
	isReadOnly: E,
	setDisabled: ya
};
//#endregion
//#region src/extensions/value-readers.ts
function xa(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function Sa(e) {
	return e == null;
}
var Ca = "data-ui-trim-input", wa = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of ka) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(tt);
		if (t === null) return Ta(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(Ca) ? t.trim() : t;
	}
	readHeld(e) {
		let t = Da(e);
		return t === null ? null : this.read(t);
	}
};
function Ta(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var Ea = "input, textarea, select";
function Da(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(Ea) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${Ea}`);
}
function Oa(e) {
	return e === null ? null : Number(e);
}
var ka = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(On)
	},
	{
		kind: "tab-order",
		read: (e) => Oa(e.getAttribute(kn))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(An)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(jn)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(on)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(Tn)
	},
	{
		kind: "selected-keys",
		read: (e) => Aa(e, En)
	},
	{
		kind: nt,
		read: (e) => Aa(e, We)
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
function Aa(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function ja(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var Ma = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function Na(e) {
	return e instanceof HTMLInputElement && Ma.has(e.type);
}
function Pa(e) {
	return Na(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var Fa = "ui-draft-dropped";
function Ia(e) {
	e.dispatchEvent(new Event(Fa, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function La(e) {
	let t = Va(e.key), n = Ha(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(Ba);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Ra(e, t) {
	return Va(e) !== null || Ha(e, t) !== 0;
}
var za = {
	target: La,
	applyTabIndex: D
};
function D(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Ba(e) {
	return e.getClientRects().length > 0 && !w(e);
}
function Va(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ha(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/selected-key.ts
function Ua(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var Wa = "data-ui-bind-selected-keys", Ga = ".ui-items-view, .ui-table, .ui-tree", Ka = `.ui-items-view__item, .${Wt}, .ui-tree__row`, qa = ".ui-items-view, .ui-table", Ja = {
	shift: !1,
	ctrl: !1
}, Ya = /* @__PURE__ */ new WeakMap();
function Xa(e, t) {
	t !== null && !Ya.has(e) && Za(e, t);
}
function Za(e, t) {
	let n = k(t);
	n.length > 0 && Ya.set(e, n);
}
function Qa(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function $a(e, t) {
	let n = Qa(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function eo(e) {
	return !e.hasAttribute(en);
}
function O(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${m}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function to(e) {
	switch (e.getAttribute(Cn)) {
		case "one": {
			let t = e.getAttribute(Tn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(lo(uo(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function no(e, t) {
	let n = to(e), r = e.getAttribute(Cn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(k(e));
		e.toggleAttribute(wn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function ro(e) {
	return e.filter((e) => e.hasAttribute(wn));
}
function io(e, t, n, r) {
	let i = k(n);
	if (!so(n)) return !1;
	switch (e.getAttribute(Cn)) {
		case "one": return Ua(e, i, {
			attribute: Tn,
			bindingAttribute: Dn,
			apply: (e) => no(e, t)
		}), !0;
		case "many": return ao(e, t, n, i, r), !0;
		default: return !1;
	}
}
function ao(e, t, n, r, i) {
	let a = uo(e);
	if (a === null) return;
	let o = lo(a), s;
	if (i.shift) {
		let r = co(t, t.find((t) => k(t) === Ya.get(e)) ?? n, n).map(k);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], Ya.set(e, r)) : (s = [r], Ya.set(e, r));
	oo(e, t, s);
}
function oo(e, t, n) {
	let r = uo(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(En, i), no(e, t), r.hasAttribute(Wa) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function so(e) {
	return k(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !T(e);
}
function co(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => O(e) !== null && so(e));
}
function lo(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function uo(e) {
	for (let t of e.querySelectorAll(`[${g}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function k(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var fo = {
	isSelected: (e) => e.hasAttribute(wn),
	toggle: po,
	setSelected: mo,
	setSelectedKeys: ho
};
function po(e) {
	let t = e.closest(Ga);
	t !== null && e instanceof HTMLElement && io(t, go(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function mo(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(k(e));
	ho(e, r, n);
}
function ho(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = go(e), i = new Set(r.filter((e) => !so(e)).map(k)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...to(e)].filter((e) => !a.has(e));
	oo(e, r, n ? [...o, ...a] : o);
}
function go(e) {
	return [...e.querySelectorAll(Ka)].filter((t) => t.closest(Ga) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function _o(e) {
	let t = e.closest(Ga);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Ka);
	return n !== null && n.closest(".ui-items-view, .ui-table, .ui-tree") === t ? {
		root: t,
		row: n
	} : null;
}
function vo(e) {
	return e.filter((e) => O(e) !== null && !T(e));
}
function yo(e) {
	return bo(e) ?? vo(e)[0] ?? null;
}
function bo(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !T(e)) ?? null;
}
function xo(e, t) {
	t === null ? e.removeAttribute("aria-labelledby") : e.setAttribute("aria-labelledby", Qn(t, "ui-row-name"));
}
function So(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Oe);
	n.setAttribute(Oe, ""), e.setAttribute("aria-activedescendant", Qn(n, "ui-row")), (O(n) ?? n).scrollIntoView({ block: "nearest" });
}
function Co(e, t, n, r) {
	if (!Ra(e, r === "grid" ? "both" : r)) return null;
	let i = vo(t);
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return wo(i, n, e === "ArrowDown");
	let a = i.map((e) => O(e) ?? e), o = La({
		key: e,
		items: a,
		current: n === null ? null : O(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function wo(e, t, n) {
	let r = t === null ? null : O(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = To(i), o = e.map((e) => ({
		row: e,
		rect: (O(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(To(t.rect) - a) < Math.abs(To(e.rect) - a) ? t : e).row;
}
function To(e) {
	return e.left + e.width / 2;
}
function Eo(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function Do(e, t, n) {
	let r = n.hasAttribute(Oe), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = vo(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && So(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var Oo = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), ko = /* @__PURE__ */ new Set([
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
]), Ao = !1, jo = !1, Mo = null, No = /* @__PURE__ */ new Set(), Po = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => Fo(e.target, e.pointerType), !0), window.addEventListener("keydown", (e) => Io(e), !0), window.addEventListener("focusin", (e) => Lo(e.target), !0), window.addEventListener("focusout", (e) => Ho(e.target, !1), !0));
function Fo(e, t = "") {
	Ao = !0, jo = t === "touch";
	let n = document.activeElement;
	Mo = n, n instanceof Element && n !== document.body && e instanceof Node && n.contains(e) && Ho(n, !Ro(n));
}
function Io(e) {
	if (!(e instanceof KeyboardEvent && ko.has(e.key))) {
		Ao = !1;
		for (let e of [...No]) Ho(e, !1);
	}
}
function Lo(e) {
	Ao && !Ro(e) && Ho(e, !0);
}
function Ro(e) {
	return Pa(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function zo() {
	return Ao && Mo instanceof HTMLElement && Mo !== document.body ? Mo : null;
}
function Bo() {
	return Ao;
}
function Vo() {
	return Ao && jo;
}
function Ho(e, t) {
	e instanceof Element && (t ? No.add(e) : No.delete(e), e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(Sn, t));
}
function A(e) {
	e.focus({ preventScroll: !0 });
}
function Uo(e) {
	Ho(e, !0), e.focus({ preventScroll: !0 });
}
function Wo(e) {
	for (let t of e.querySelectorAll(Oo)) if (_a(t)) return t;
	return null;
}
function Go(e, t) {
	let n = [...e.querySelectorAll(Oo)].filter((e) => _a(e) || e === t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Ko(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !qo(n) && qo(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Ko(e);
		return t === null || r.get(t) === e;
	});
}
function Ko(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function qo(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function Jo(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Yo(n, a) ? i : r && Yo(n, i) ? a : null;
}
function Yo(e, t) {
	return e === t || Ko(e) !== null && Ko(e) === Ko(t);
}
var Xo = `.${zn}, .${Bn}, [${Vn}]`;
function Zo(e) {
	let t = _o(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Xo)) && n.hasAttribute("tabindex") && _a(n)) return n;
	return null;
}
function Qo(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? Wo(e);
	return Ao ? Po.add(e) : Po.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), A(r ?? e), n;
}
function $o(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? Wo(e);
	return n !== null && es(e, n), Qo(e, n);
}
function es(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function ts(e, t, n = !1) {
	if (Ao) {
		D(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), A(e);
		return;
	}
	let r = t.filter(Ba), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (D(t, i), A(i));
}
function ns(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : rs(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${Oo}, [tabindex]`) && _a(e)) return e;
	return n === null ? null : is(n);
}
function rs(e, t) {
	for (let n = e.closest(v); n !== null; n = n.parentElement?.closest(v) ?? null) {
		let e = t.querySelectorAll(`[${m}="${n.getAttribute(m)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function is(e) {
	for (let t = e.closest(v); t !== null; t = t.parentElement?.closest(v) ?? null) if (_a(t)) {
		if (!t.hasAttribute("tabindex")) {
			t.tabIndex = -1;
			let e = (n) => {
				n.target === t && (t.removeAttribute("tabindex"), t.removeEventListener("focusout", e));
			};
			t.addEventListener("focusout", e);
		}
		return t;
	}
	return null;
}
function as(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (os(n, t) && Ho(e, !Ro(e)), A(e));
}
function os(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (Po.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var ss = "data-ui-clear", cs = ["change", "toggle"], ls = [
	...cs,
	"expand",
	"collapse",
	"open",
	"close"
];
function us(e) {
	let t = rr(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function ds(e) {
	return rr(e) === "OnSubmit";
}
function fs(e, t) {
	let n = e.getAttribute(Le);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && ds(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && us(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: ds(i.mode)
		};
	}
	return null;
}
var ps = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of cs) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(Fa, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${ss}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || fs(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${ss}]`);
		if (t === null) return;
		let n = t.closest(v), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || ms(r) || (ja(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), Pa(r) && document.activeElement !== r && A(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (E(e.target) || w(e.target))) return;
		let t = fs(e.target, this.options.metadata);
		if (t !== null) {
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
			let r = fs(n, this.options.metadata);
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
		if (i === void 0 || !us(i.mode) || ds(i.mode)) return;
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
function ms(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/event-boundary.ts
function hs(e, t) {
	let n = e.closest(`[${ze}]`);
	return n !== null && n !== t && t.contains(n);
}
//#endregion
//#region src/events/command-turns.ts
var gs = class {
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
}, _s = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = xr(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = xr(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(xr(e));
	}
	markAttached(e) {
		let t = xr(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, vs = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: x(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, ys = {
	dispatched: !1,
	success: !1
}, bs = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, xs = class {
	options;
	root;
	registry;
	requestFactory = new vs();
	turns = new gs();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new _s(e.eventCatalog), this.addEvent("click");
		for (let t of e.events ?? []) this.addEvent(t.name, t);
	}
	addEvent(e, t = {}) {
		let n = this.registry.add(e, t);
		this.shouldAttach(n) && this.attachEvent(n);
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
		if (r === null || Cs(t, r.element) || hs(t.target, r.element)) return;
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
			let t = e instanceof bs, r = t ? e.reason : e;
			throw n.completed?.({
				...a,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && w(r.domEvent.target)) return ys;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), ys;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? ws(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), ys;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return ys;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new bs(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !ls.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Re(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Ss(e.preventDefault, t) && t.domEvent.preventDefault(), Ss(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Ss(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Cs(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function ws(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function Ts(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && Es(e, t) : Ds(e, t);
}
function Es(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!Ts(e[n], t[n])) return !1;
	return !0;
}
function Ds(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !Ts(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var Os = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	heard = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
		let i = r.root ?? document;
		for (let e of cs) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		if (t === null) return;
		let n = fs(e.target, this.options.metadata), r;
		if (n === null) r = this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return;
		else r = this.index.getPropertyInteractions(x(n.binding.componentId), n.binding.propertyId);
		if (r.length === 0) return;
		let i = this.options.valueReaders.readBound(e.target), a = As(r[0].source, t.dynamicParameters);
		if (!(this.heard.has(a) && Ts(this.heard.get(a), i))) {
			this.heard.set(a, i);
			for (let e of r) this.applyInteraction(e, t.dynamicParameters, !0, i);
		}
	}
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: x(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(x(e.reference.componentId), e.reference.propertyId);
		t.length > 0 && this.heard.set(As(e.reference, e.dynamicParameters), e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (ar(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!js(i)) return;
		let a = this.evaluator.evaluate(e, r);
		this.applyDepth++;
		try {
			this.propertyPatchEngine.applyPropertyValue(i, t, a, n);
		} finally {
			this.applyDepth--;
		}
		n && this.options.writeBack?.(i, t, a);
	}
	applyEffectInteraction(e, t, n) {
		let r = e.effect;
		if (r == null) {
			s("effect interaction carries no effect.", e);
			return;
		}
		this.evaluator.matches(e, n) && this.options.effects.apply({
			effect: ks(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function ks(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = x(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && kr(s, o)) return a === 0 ? e : {
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
function As(e, t) {
	return JSON.stringify([
		x(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function js(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var Ms = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return Ns(t, e.operator, e.value);
	}
};
function Ns(e, t, n) {
	let r = Ps(e), i = Ps(n);
	switch (or(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return Fs(r, i, (e) => e > 0);
		case "GreaterOrEqual": return Fs(r, i, (e) => e >= 0);
		case "Less": return Fs(r, i, (e) => e < 0);
		case "LessOrEqual": return Fs(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return Is(r, i);
		default: return !1;
	}
}
function Ps(e) {
	return Li(e) ? e.key : Ri(e) ? e.text : e;
}
function Fs(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function Is(e, t) {
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
var Ls = "Value", Rs = class {
	eventInteractions = /* @__PURE__ */ new Map();
	eventNames = /* @__PURE__ */ new Set();
	eventComponentIdsByName = /* @__PURE__ */ new Map();
	propertyInteractions = /* @__PURE__ */ new Map();
	valueInteractions = /* @__PURE__ */ new Map();
	metadata;
	constructor(e) {
		this.metadata = e;
		for (let t of e.metadata.interactions) this.addInteraction(t);
	}
	hasEvent(e) {
		return this.eventNames.has(xr(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Vs(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(xr(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Hs(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Us(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (zs(e)) {
			let t = x(e.sourceEvent?.componentId), n = xr(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Hs(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Hs(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (Bs(e)) {
			let t = x(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Us(t, n));
				if (r === void 0 && (r = [], this.propertyInteractions.set(Us(t, n), r)), r.push(e), this.metadata.getPropertyDefinition(n)?.propertyName === Ls) {
					let n = this.valueInteractions.get(t) ?? [];
					n.push(e), this.valueInteractions.set(t, n);
				}
			}
		}
	}
};
function zs(e) {
	return ir(e.sourceKind) === "Event";
}
function Bs(e) {
	return ir(e.sourceKind) === "Property";
}
function Vs(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Hs(e, t) {
	return `${e}:${xr(t)}`;
}
function Us(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var j = {
	fast: 120,
	normal: 200,
	ripple: 400,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)",
	spring: "cubic-bezier(0.34, 1.56, 0.64, 1)"
};
function Ws() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Gs(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var Ks = /* @__PURE__ */ new Set([
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
function qs(e) {
	return Ks.has(e);
}
var Js = 4, Ys = 12, Xs = /* @__PURE__ */ new Map(), Zs = !1, Qs = null, $s = /* @__PURE__ */ new WeakMap(), ec = "data-ui-popup-stood-in";
function tc(e, t) {
	t === null ? $s.delete(e) : $s.set(e, t);
}
var nc = "--ui-popup-ground";
function rc(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(nc).trim() : "";
	n.length === 0 ? t.style.removeProperty(nc) : t.style.setProperty(nc, n);
}
function ic(e, t, n) {
	Xs.set(t, {
		anchor: e,
		options: n
	}), fc(), Qs?.observe(t), oc(e, t), mc(e, t, n);
}
var ac = "data-ui-popup-lifted";
function oc(e, t) {
	if (t.hasAttribute(ac)) {
		t.matches(":popover-open") || t.showPopover();
		return;
	}
	!cc(t) && e.closest(`[${ac}]`) === null || (t.setAttribute("popover", "manual"), t.setAttribute(ac, ""), sc(t));
}
function sc(e) {
	let t = getComputedStyle(e), n = t.transitionProperty.split(",").map((e) => e.trim()), r = n.indexOf("overlay");
	if (r === -1) {
		e.showPopover();
		return;
	}
	let i = t.transitionDuration.split(",").map((e) => e.trim());
	e.style.setProperty("transition-duration", n.map((e, t) => t === r ? "0s" : i[t % i.length]).join(", ")), e.showPopover(), getComputedStyle(e).getPropertyValue("overlay"), e.style.removeProperty("transition-duration");
}
function cc(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function lc(e) {
	e.hasAttribute(ac) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Xs.has(e) || (e.removeAttribute("popover"), e.removeAttribute(ac));
	}, j.fast));
}
function uc(e) {
	let t = Xs.get(e);
	t !== void 0 && mc(t.anchor, e, t.options);
}
function dc(e) {
	e != null && (Xs.delete(e), Qs?.unobserve(e), lc(e));
}
function fc() {
	Zs || (Zs = !0, document.addEventListener("scroll", pc, !0), window.addEventListener("resize", pc), Qs = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Xs.get(t.target);
			e !== void 0 && mc(e.anchor, t.target, e.options);
		}
	}));
}
function pc() {
	for (let [e, t] of Xs) {
		if (!e.isConnected) {
			dc(e);
			continue;
		}
		mc(t.anchor, e, t.options);
	}
}
function mc(e, t, n) {
	if (!e.isConnected) return;
	let r = hc(e), i = r !== e;
	t.hasAttribute(ec) !== i && t.toggleAttribute(ec, i), n.minAnchorWidth === !0 && (t.style.minWidth = `${r.getBoundingClientRect().width}px`);
	let a = r.getBoundingClientRect(), o = (r === e ? n.crossAnchor ?? r : r).getBoundingClientRect(), s = t.getBoundingClientRect(), c = yc(a, s, n, vc(n.boundary)), l = Dc(a, o, s, c, n.gap), u = Oc(a, o, s, c, n.gap);
	n.arrow === !0 && (Cc(c) ? u = gc(u, o.left + o.width / 2, s.width) : l = gc(l, o.top + o.height / 2, s.height)), l = Ac(l, s.height, window.innerHeight), u = Ac(u, s.width, window.innerWidth), t.style.top = `${l}px`, t.style.left = `${u}px`, t.dataset.uiPlacement !== c && (t.dataset.uiPlacement = c), _c(t, o, s, c, l, u);
}
function hc(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(ec)) return e;
		let n = $s.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function gc(e, t, n) {
	let r = t - e;
	return r < Ys ? e - (Ys - r) : r > n - Ys ? e + (r - (n - Ys)) : e;
}
function _c(e, t, n, r, i, a) {
	let o = Cc(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Ys, Math.min(s, c - Ys))}px`);
}
function vc(e) {
	let t = {
		left: 0,
		top: 0,
		right: window.innerWidth,
		bottom: window.innerHeight
	};
	if (e === void 0 || !e.isConnected) return t;
	let n = e.getBoundingClientRect(), r = n.left + e.clientLeft, i = n.top + e.clientTop;
	return {
		left: Math.max(t.left, r),
		top: Math.max(t.top, i),
		right: Math.min(t.right, r + e.clientWidth),
		bottom: Math.min(t.bottom, i + e.clientHeight)
	};
}
function yc(e, t, n, r) {
	let i = n.placement, a = Tc(i);
	if (bc(e, t, i, n.gap, r)) return i;
	if (bc(e, t, a, n.gap, r)) return a;
	for (let a of xc(i)) if (bc(e, t, a, n.gap, r)) return a;
	return wc(e, a, r) > wc(e, i, r) ? a : i;
}
function bc(e, t, n, r, i) {
	return wc(e, n, i) >= Sc(t, n) + r;
}
function xc(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Sc(e, t) {
	return Cc(t) ? e.height : e.width;
}
function Cc(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function wc(e, t, n) {
	return t.startsWith("top") ? e.top - n.top : t.startsWith("bottom") ? n.bottom - e.bottom : t.startsWith("left") ? e.left - n.left : n.right - e.right;
}
function Tc(e) {
	return e.startsWith("top") ? `bottom${Ec(e)}` : e.startsWith("bottom") ? `top${Ec(e)}` : e.startsWith("left") ? `right${Ec(e)}` : `left${Ec(e)}`;
}
function Ec(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function Dc(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : kc(t.top, t.height, n.height, r);
}
function Oc(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : kc(t.left, t.width, n.width, r);
}
function kc(e, t, n, r) {
	let i = Ec(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function Ac(e, t, n) {
	return Math.max(Js, Math.min(e, n - t - Js));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var jc = 32;
function M(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = Mc(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function Mc(e, t, n) {
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
		if (r.size > jc) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function Nc(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var Pc = "data-ui-dialog", Fc = "data-ui-dialog-modal";
function Ic(e) {
	let t = e.querySelectorAll(`[${Pc}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function Lc(e) {
	let t = Ic(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function Rc(e) {
	let t = typeof document > "u" ? null : Lc(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var zc = "data-ui-rename-field";
function Bc(e) {
	return e instanceof Element && e.closest(`[${zc}]`) !== null;
}
function Vc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(zc, ""), r.setAttribute(ze, ""), r.value = e.value, Hc(r, n, t);
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
	}), r.addEventListener("blur", () => a(!0, !1)), n.style.visibility = "hidden", t.appendChild(r), r.focus(), r.select(), !0;
}
function Hc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var Uc = /* @__PURE__ */ new Set(), Wc = /* @__PURE__ */ new Map(), Gc = 0, Kc = !1;
function qc() {
	Kc || (Kc = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || Bc(e.target) || Xc() && e.preventDefault();
	}, !0));
}
function Jc() {
	for (let e of Uc) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Yc(e) {
	for (let t of Uc) t.hearRefusedClick(e);
}
function Xc() {
	let e = [];
	for (let t of Uc) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...Wc.keys()]) t.has(e) || Wc.delete(e);
	for (let { popup: t } of e) Wc.has(t) || Wc.set(t, ++Gc);
	let n = Zc(e, (e) => Wc.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function Zc(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Qc = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), Uc.add(this), qc();
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
		return this.options.isBehind === void 0 ? Rc(e) : this.options.isBehind(e);
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
function $c(e, t) {
	return e.isConnected && !w(e) && !(t && E(e));
}
var el = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Qc({
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
			isBehind: (e) => Rc(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || Bo() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : tl(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, il(t)) && !Rc(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = Zo(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && $c(n.owner, this.closesWhenReadOnly) && !Rc(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !$c(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), al(e), ol(e, !0), ll(this), e.focus !== void 0 && e.focus !== !1 && Qo(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && al(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && as(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), ol(r, !1), dc(r.popup), this.entries.size === 0 && ul(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if ($c(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !nl() && rl(e);
		}
	}
};
function tl(e) {
	return e instanceof Element && e.isConnected && _a(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function nl() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && _a(e);
}
function rl(e) {
	!e.hasAttribute("tabindex") && e.tabIndex < 0 && (e.tabIndex = -1), A(e);
}
function il(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function al(e) {
	e.anchor !== void 0 && e.placement !== void 0 && ic(e.anchor, e.popup, e.placement);
}
function ol(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var sl = /* @__PURE__ */ new Set(), cl = null;
function ll(e) {
	sl.add(e), cl === null && typeof MutationObserver == "function" && (cl = new MutationObserver(() => {
		for (let e of [...sl]) e.closeStranded();
	}), cl.observe(document, {
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
function ul(e) {
	sl.delete(e), !(sl.size > 0 || cl === null) && (cl.disconnect(), cl = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var dl = "ui-flyout", fl = "ui-flyout--open", pl = "ui-flyout__anchor", ml = "data-ui-flyout-no-backdrop-close", hl = "data-ui-flyout-no-escape-close", gl = 4, _l = `${dl}--`, vl = "bottom-start", yl = class {
	root;
	flyouts = new el({
		show: ({ owner: e }) => e.classList.add(fl),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? hl : ml)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${dl}`)) this.place(e);
		M(this.root, `.${dl}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Bn}`), n = e.querySelector(`:scope > .${pl}`);
		if (t === null) return;
		let r = bl(n, t);
		if (!e.classList.contains(fl)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: Sl(n) ?? e,
			placement: {
				placement: Cl(e),
				gap: gl
			},
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(fl) && (e.classList.remove(fl), xl(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${pl}`)?.closest(`.${dl}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(fl), this.place(t), this.flyouts.isOpen(t) && xl(t, !0);
		}
	}
};
function bl(e, t) {
	if (e === null) return null;
	let n = e.querySelector(Oo) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Qn(t, "ui-flyout-content")), n;
}
function xl(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function Sl(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Cl(e) {
	for (let t of e.classList) {
		if (!t.startsWith(_l)) continue;
		let e = t.slice(_l.length);
		if (qs(e)) return e;
	}
	return vl;
}
//#endregion
//#region src/interactions/file-drop.ts
var wl = "data-ui-file-drop-over", Tl = 120, El = "refused", Dl = !1;
function Ol(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	Ml();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => kl(e, t, n), !0);
	e.root.addEventListener("dragend", () => Il(t.marked), !0), window.addEventListener("blur", () => Il(t.marked)), e.root.addEventListener("paste", (t) => Al(e, t), !0);
}
function kl(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && Il(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		Nl(n), n.type !== "dragleave" && Il(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || Fl(r, a) : t.leaving = window.setTimeout(() => Il(r), Tl);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = Pl(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && Fl(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : wl;
		r.set(a, o), a.setAttribute(o, t ? El : "");
		return;
	}
	Il(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => Ll(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function Al(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => Ll(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function jl(e, t, n) {
	for (let r = t.closest(`[${m}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${hn}="${Yn(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function Ml() {
	if (!Dl) {
		Dl = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && Nl(e);
		});
	}
}
function Nl(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function Pl(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function Fl(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function Il(e) {
	for (let t of [...e.keys()]) Fl(e, t);
}
function Ll(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var Rl = "/_ne/files/upload", zl = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], Bl = /* @__PURE__ */ new Map(), Vl = !1;
function Hl(e, t, n, r) {
	let i = Number(e.getAttribute(pn)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return Bl.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	return Bl.set(e, c), Ul(e, c), Gl(), a;
}
function Ul(e, t) {
	let n = Wl(t.limit, C.language);
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
function Wl(e, t) {
	let n = e, r = "byte";
	for (let e of zl) {
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
function Gl() {
	Vl || (Vl = !0, C.onChange(() => {
		for (let [e, t] of Bl) e.isConnected ? Ul(e, t) : Bl.delete(e);
	}));
}
function Kl(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", Rl), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var ql = () => {}, Jl = { uploadAsync: (e, t) => Kl(e, t ?? ql) };
function Yl(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var Xl = "ui-open-picker";
function Zl(e) {
	return !e.dispatchEvent(new Event(Xl, {
		bubbles: !0,
		cancelable: !0
	}));
}
function Ql(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || E(n) || w(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var $l = "ui-file-input", eu = "ui-file-input__row", tu = "ui-file-input__native", nu = "ui-file-input__field", ru = "ui-file-input__selection", iu = "data-ui-file-dragging", au = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, C.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(Xl, (e) => Ql(e, {
			rootSelector: `.${$l}`,
			nativeSelector: `.${tu}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Ol({
			root: this.root,
			draggingAttribute: iu,
			resolveTarget: (e) => {
				let t = e.closest(`.${eu}`)?.closest(`.${$l}`) ?? null, n = t === null ? jl(this.root, e, `.${$l}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${tu}`) ?? null;
				return r === null || i === null ? null : {
					host: r,
					mark: n?.component,
					accept: i.getAttribute("accept") ?? "",
					multiple: i.multiple,
					refused: i.disabled || E(r) || w(r)
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
		let t = e.target.closest(`[${mn}], .${eu}`);
		if (t === null || w(t) || E(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${$l}`)?.querySelector(`.${tu}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(tu)) return;
		let t = e.target.closest(`.${$l}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${nu}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Hl(e, t, e.querySelector(`.${tu}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await Kl(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => C.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, ou(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => C.text("ui.file.failed")), this.publishSelection(e, "");
		}
	}
	show(e, t) {
		typeof t == "string" ? this.shownWords.delete(e) : this.shownWords.set(e, t), e.value = typeof t == "string" ? t : t();
	}
	publishSelection(e, t) {
		Yl(e.querySelector(`.${ru}`), t);
	}
};
function ou(e) {
	return e.length === 1 ? e[0].name : () => C.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var su = "ne-picture-as-pdf", cu = "ne-text-snippet", lu = "ne-description", uu = "ne-table-chart", du = "ne-slideshow", fu = "ne-folder-zip", pu = "ne-audio-file", mu = "ne-video-file", hu = "ne-image", gu = "ne-code", _u = "ne-draft", vu = new Map([
	...Su(su, "pdf"),
	...Su(cu, "txt", "md", "log"),
	...Su(lu, "doc", "docx", "odt", "rtf"),
	...Su(uu, "xls", "xlsx", "ods", "csv", "tsv"),
	...Su(du, "ppt", "pptx", "odp", "key"),
	...Su(fu, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...Su(pu, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...Su(mu, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...Su(hu, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...Su(gu, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), yu = /* @__PURE__ */ new Map([
	["application/pdf", su],
	["text/csv", uu],
	["application/msword", lu],
	["application/rtf", lu],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", lu],
	["application/vnd.oasis.opendocument.text", lu],
	["application/vnd.ms-excel", uu],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", uu],
	["application/vnd.oasis.opendocument.spreadsheet", uu],
	["application/vnd.ms-powerpoint", du],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", du],
	["application/vnd.oasis.opendocument.presentation", du],
	["application/zip", fu],
	["application/x-zip-compressed", fu],
	["application/x-7z-compressed", fu],
	["application/vnd.rar", fu],
	["application/x-rar-compressed", fu],
	["application/x-tar", fu],
	["application/gzip", fu],
	["application/json", gu],
	["application/xml", gu],
	["text/xml", gu],
	["text/html", gu]
]), bu = /* @__PURE__ */ new Map([
	["image", hu],
	["audio", pu],
	["video", mu],
	["text", cu]
]);
function xu(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : vu.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return yu.get(i) ?? (a < 0 ? void 0 : bu.get(i.slice(0, a))) ?? _u;
}
function Su(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var Cu = [
	"http",
	"https",
	"mailto",
	"tel"
];
function wu(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || Cu.includes(t.slice(0, n).toLowerCase());
}
function Tu(e) {
	return wu(e) ? String(e) : void 0;
}
var Eu = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function Du(e) {
	let t = Au(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || Eu.some((e) => n.startsWith(e));
}
function Ou(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f]/.test(e) ? !1 : e === "/" || ku(e);
}
function ku(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function Au(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function ju(e) {
	return Mu(e) !== null;
}
function Mu(e) {
	let t = Au(e), n = t.toLowerCase();
	return ku(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function Nu(e) {
	return Mu(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var Pu = "mask:", Fu = "ui-icon--image", Iu = "ui-icon--mask";
function Lu(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(Pu) && (n = !0, t = t.slice(5).trim());
	let r = Mu(t);
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Ru(e) {
	let t = Lu(e);
	return t === null ? "" : zu(t.source);
}
function zu(e) {
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
var Bu = "ui-icon", Vu = "data-ui-icon";
function Hu(e, t) {
	e.classList.add(Bu);
	for (let t of Array.from(e.classList)) Wu(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url");
	let n = Gu(t);
	if (n.length === 0) {
		e.removeAttribute(Vu);
		return;
	}
	e.setAttribute(Vu, ""), e.classList.add(n);
	let r = Lu(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", zu(r.source));
}
var Uu = "ui-icon-glyph--";
function Wu(e) {
	return e === Fu || e === Iu || e.startsWith(Uu);
}
function Gu(e) {
	let t = Lu(e);
	return t === null ? Ku(e) : t.tinted ? Iu : Fu;
}
function Ku(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Uu;
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
var qu = 1024, Ju = 16777216;
function Yu(e) {
	return {
		x: e.width / 2,
		y: e.height / 2,
		zoom: 1
	};
}
function Xu(e, t) {
	let n = od(t.zoom, 1, 4), r = ad(e) / n / 2;
	return {
		x: od(t.x, r, e.width - r),
		y: od(t.y, r, e.height - r),
		zoom: n
	};
}
function Zu(e, t) {
	let n = ad(e) / t.zoom;
	return {
		x: t.x - n / 2,
		y: t.y - n / 2,
		side: n
	};
}
function Qu(e, t, n) {
	return t.zoom * n / ad(e);
}
function $u(e, t, n, r, i) {
	let a = Qu(e, t, n);
	return a > 0 ? Xu(e, {
		x: t.x - r / a,
		y: t.y - i / a,
		zoom: t.zoom
	}) : t;
}
function ed(e, t, n, r, i = {
	x: 0,
	y: 0
}) {
	let a = od(t.zoom * r, 1, 4), o = Qu(e, t, n), s = Qu(e, {
		...t,
		zoom: a
	}, n);
	return !(o > 0) || !(s > 0) ? Xu(e, {
		...t,
		zoom: a
	}) : Xu(e, {
		x: t.x + i.x / o - i.x / s,
		y: t.y + i.y / o - i.y / s,
		zoom: a
	});
}
function td(e, t) {
	return Math.max(1, Math.min(t, Math.round(e.side)));
}
function nd(e, t) {
	return Math.min(1, t * 4 / ad(e), Math.sqrt(Ju / (e.width * e.height)));
}
function rd(e) {
	return e === "image/jpeg" || e === "image/png" || e === "image/webp" ? e : "image/png";
}
function id(e, t, n) {
	if (n === t) return e;
	let r = e.lastIndexOf(".");
	return `${r > 0 ? e.slice(0, r) : e}.${n === "image/jpeg" ? "jpg" : n.slice(n.indexOf("/") + 1)}`;
}
function ad(e) {
	return Math.min(e.width, e.height);
}
function od(e, t, n) {
	return Math.min(Math.max(e, t), n);
}
//#endregion
//#region src/interactions/pointer-drag.ts
var sd = class {
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
		if (t === null || w(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n === null) return;
		e.preventDefault();
		try {
			t.setPointerCapture(e.pointerId);
		} catch {}
		t.setAttribute(xn, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 });
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
			e.pointerId === t.pointerId ? t.point = n : t.second.point = n, this.options.pinch?.(t.context, cd(r, i, t.point, t.second.point));
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
		this.drag = null, n.removeAttribute(xn), this.options.end(n, r);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i, second: a } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(xn);
		for (let e of a === null ? [r] : [r, a.pointerId]) try {
			t.releasePointerCapture(e);
		} catch {}
		this.options.end(t, n);
	}
};
function cd(e, t, n, r) {
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
var ld = 100 / 3, ud = 1, dd = 2;
function fd(e, t = ld) {
	let n = e.deltaMode === ud ? ld : e.deltaMode === dd ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function pd(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var md = {
	notch: 100,
	pixels: fd
}, hd = "ui-image-crop", gd = "ui-image-crop-title", _d = "data-ui-image-crop-part", vd = "data-ui-image-crop-frame", yd = 10, bd = 1.2, xd = 380, Sd = 100, Cd = .92, N = null, wd = null, Td = !1;
async function Ed(e, t, n, r = Vd) {
	if (N !== null) return "cancelled";
	let i = await r.decodeAsync(t, n.size);
	return i === null ? "unreadable" : new Promise((a) => {
		let o = wd !== null && wd.dialog.isConnected ? wd : Dd();
		wd = o, N = {
			file: t,
			source: i,
			request: n,
			imaging: r,
			view: Yu(i),
			finish: (t) => {
				N = null, e.close(hd), i.release(), a(t);
			}
		}, C.write(o.title, null, "ui.crop.title"), C.write(o.stage, "aria-label", "ui.crop.frame"), C.write(o.zoom, "aria-label", "ui.crop.zoom"), C.write(Rd(o.dialog, "cancel"), null, "ui.crop.cancel"), C.write(Rd(o.dialog, "apply"), null, "ui.crop.apply"), o.stage.setAttribute(vd, n.frame), e.open(hd), Id(o);
	});
}
function Dd() {
	let e = Bd("div", "ui-dialog ui-image-crop");
	e.setAttribute(Pc, hd), e.setAttribute(Fc, ""), e.setAttribute("hidden", "");
	let t = Bd("div", "ui-dialog__backdrop");
	t.setAttribute("data-ui-dialog-backdrop", "");
	let n = Bd("div", "ui-dialog__surface ui-image-crop__surface");
	n.setAttribute("role", "dialog"), n.setAttribute("tabindex", "-1"), n.setAttribute("aria-modal", "true"), n.setAttribute("aria-labelledby", gd);
	let r = Bd("h2", "ui-image-crop__title ui-text-type--subtitle");
	r.id = gd;
	let i = Bd("div", "ui-image-crop__stage", "stage");
	i.setAttribute("tabindex", "0"), i.setAttribute("role", "group");
	let a = Bd("canvas", "ui-image-crop__canvas"), o = Bd("span", "ui-image-crop__frame");
	a.setAttribute("aria-hidden", "true"), o.setAttribute("aria-hidden", "true"), i.append(a, o);
	let s = Bd("input", "ui-image-crop__zoom", "zoom");
	s.type = "range", s.min = "1", s.max = "4", s.step = "0.01";
	let c = Bd("div", "ui-image-crop__actions");
	c.append(zd("ui-button--outline", "cancel"), zd("ui-button--primary", "apply")), n.append(r, i, s, c), e.append(t, n);
	let l = {
		dialog: e,
		title: r,
		stage: i,
		canvas: a,
		frame: o,
		zoom: s
	};
	return e.addEventListener("click", (e) => {
		let t = e.target instanceof Element ? e.target.closest(`[${_d}]`)?.getAttribute(_d) : null;
		t === "cancel" ? N?.finish("cancelled") : t === "apply" && Od();
	}), e.addEventListener("keydown", (e) => kd(l, e)), s.addEventListener("input", () => Pd(l, Number(s.value))), i.addEventListener("wheel", (e) => Ad(l, e), { passive: !1 }), window.addEventListener("resize", () => Ld(l)), new sd({
		root: e,
		resolveHandle: (e) => i.contains(e) ? i : null,
		begin: (e, t) => N === null ? null : { last: t },
		move: (e, t, n) => {
			e.last !== null && jd(l, n.x - e.last.x, n.y - e.last.y), e.last = n;
		},
		end: () => void 0,
		pinch: (e, t) => {
			e.last = null, Md(l, t);
		}
	}), document.body.append(e), l;
}
async function Od() {
	let e = N;
	if (e === null) return;
	let { file: t, source: n, request: r, imaging: i, view: a } = e, o = Zu(n, a), s = rd(t.type), c = i.encodeAsync(n, o, td(o, r.size), s);
	N = null;
	let l;
	try {
		l = await c;
	} catch {
		l = null;
	}
	e.finish(l === null ? "unreadable" : new File([l], id(t.name, t.type, l.type), {
		type: l.type,
		lastModified: t.lastModified
	}));
}
function kd(e, t) {
	if (t.defaultPrevented || t.isComposing || N === null) return;
	if (t.key === "Escape") {
		t.preventDefault(), N.finish("cancelled");
		return;
	}
	if (t.target !== e.stage || t.ctrlKey || t.altKey || t.metaKey) return;
	let n = t.shiftKey ? 50 : yd;
	switch (t.key) {
		case "ArrowLeft":
			jd(e, -n, 0);
			break;
		case "ArrowRight":
			jd(e, n, 0);
			break;
		case "ArrowUp":
			jd(e, 0, -n);
			break;
		case "ArrowDown":
			jd(e, 0, n);
			break;
		case "+":
		case "=":
			Nd(e, bd);
			break;
		case "-":
		case "_":
			Nd(e, 1 / bd);
			break;
		case "Enter":
			Od();
			break;
		default: return;
	}
	t.preventDefault();
}
function Ad(e, t) {
	if (N === null) return;
	t.preventDefault();
	let n = fd(t, e.stage.clientHeight), r = t.ctrlKey ? Sd : xd;
	Nd(e, 2 ** (-n.y / r), Fd(e, t.clientX, t.clientY));
}
function jd(e, t, n) {
	N !== null && (N.view = $u(N.source, N.view, e.frame.clientWidth, t, n), Id(e));
}
function Md(e, t) {
	if (N === null) return;
	let n = $u(N.source, N.view, e.frame.clientWidth, t.shift.x, t.shift.y);
	N.view = ed(N.source, n, e.frame.clientWidth, t.factor, Fd(e, t.center.x, t.center.y)), Id(e);
}
function Nd(e, t, n) {
	N !== null && (N.view = ed(N.source, N.view, e.frame.clientWidth, t, n), Id(e));
}
function Pd(e, t) {
	N !== null && Number.isFinite(t) && t > 0 && Nd(e, t / N.view.zoom);
}
function Fd(e, t, n) {
	let r = e.stage.getBoundingClientRect();
	return {
		x: t - (r.left + r.width / 2),
		y: n - (r.top + r.height / 2)
	};
}
function Id(e) {
	if (N === null) return;
	let t = N.view.zoom;
	e.zoom.value = String(t), e.zoom.setAttribute("aria-valuetext", `${Math.round(t * 100)}%`), e.zoom.style.setProperty("--ui-slider-fraction", String((t - 1) / 3)), Ld(e);
}
function Ld(e) {
	Td || N === null || (Td = !0, requestAnimationFrame(() => {
		if (Td = !1, N === null) return;
		let t = e.frame.clientWidth, n = e.stage.clientWidth, r = e.stage.clientHeight, i = N.view, a = Qu(N.source, i, t);
		N.imaging.paint(e.canvas, N.source, {
			left: n / 2 - i.x * a,
			top: r / 2 - i.y * a,
			width: N.source.width * a,
			height: N.source.height * a,
			stageWidth: n,
			stageHeight: r
		});
	}));
}
function Rd(e, t) {
	return e.querySelector(`[${_d}="${t}"]`) ?? e;
}
function zd(e, t) {
	let n = Bd("button", `ui-button ${e}`, t);
	return n.type = "button", n;
}
function Bd(e, t, n) {
	let r = document.createElement(e);
	return r.className = t, n !== void 0 && r.setAttribute(_d, n), r;
}
var Vd = {
	decodeAsync: async (e, t) => {
		let n = await Hd(e);
		if (n === null) return null;
		let r = n, i = nd(r, t);
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
		}, r, Cd);
	})
};
async function Hd(e) {
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
var Ud = "ui-image-input", Wd = "ui-image-input--multiple", Gd = "ui-image-input__surface", Kd = "ui-image-input__native", qd = "ui-image-input__picture", Jd = "ui-image-input__text", Yd = "ui-image-input__selection", Xd = "ui-image-input__selections", Zd = "ui-image-input__tiles", Qd = "ui-image-input__tile", $d = "ui-image-input__remove", ef = "ui-image-input__progress", tf = "ui-image-input__tile--file", nf = "ui-image-input__file-glyph", rf = "ui-image-input__file-name", af = "SelectionId", of = "--ui-image-progress", sf = "data-ui-image-preview", cf = "data-ui-image-dragging", lf = class {
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
		this.root = e.root ?? document, this.validation = e.validation, this.dialogs = e.dialogs, this.cropImaging = e.cropImaging, this.applyAll(this.root.querySelectorAll(`.${Ud}`)), M(this.root, `.${Ud}`, {
			childList: !0,
			attributeFilter: [
				fn,
				Be,
				En
			]
		}, (e) => this.applyAll(e)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === af && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Nr(e.components, `.${Ud}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(Xl, (e) => Ql(e, {
			rootSelector: `.${Ud}`,
			nativeSelector: `.${Kd}`,
			pressed: (e) => e.querySelector(`.${Gd}`)
		})), this.root.addEventListener(Fa, (e) => this.handleDraftDropped(e)), Ol({
			root: this.root,
			draggingAttribute: cf,
			resolveTarget: (e) => {
				let t = e.closest(`.${Gd}`), n = t?.closest(`.${Ud}`) ?? null, r = n === null ? jl(this.root, e, `.${Ud}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Gd}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${Kd}`)?.getAttribute("accept") ?? "",
					multiple: uf(i),
					refused: E(i) || w(a)
				};
			},
			onFiles: (e, t) => void (uf(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) uf(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${qd}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || hf(e, e.getAttribute("data-ui-image-caption") ?? vf(n)), _f(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(En);
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
		for (let t of e) uf(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${mn}]`), n = t?.closest(`.${Ud}`) ?? null;
		t === null || n === null || E(n) || w(t) || n.querySelector(`.${Kd}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$d}`), n = t?.closest(`.${Ud}`) ?? null;
		if (t === null || n === null || E(n) || w(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Kd)) return;
		let t = e.target.closest(`.${Ud}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (uf(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Ud}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Yl(t.querySelector(`.${Yd}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Gd}`), r = e.querySelector(`.${qd}`), i = e.querySelector(`.${Yd}`);
		if (n === null || r === null) return;
		let a = await this.cropAsync(e, t);
		if (a === null || Hl(e, [a], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let o = {
			url: URL.createObjectURL(a),
			landed: !1
		};
		this.previews.set(e, o), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(sf, ""), r.setAttribute("src", o.url), hf(e, a.name), _f(e, !0), n.classList.add(In);
		try {
			let t = await Kl([a], () => void 0);
			this.previews.get(e) === o && (o.landed = !0, Yl(i, t.selectionId));
		} catch (t) {
			gf(e), Yl(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(In);
		}
	}
	async cropAsync(e, t) {
		let n = df(e);
		if (n === null || this.dialogs === void 0) return t;
		if (this.cropping.has(e)) return null;
		this.cropping.add(e);
		try {
			let r = await Ed(this.dialogs, t, {
				frame: n,
				size: ff(e)
			}, this.cropImaging);
			return r === "cancelled" || !e.isConnected ? null : r === "unreadable" ? (this.unreadable.add(e), this.validation?.mark(e, "error", { key: "ui.image.unreadable" }), null) : (this.unreadable.delete(e) && this.validation?.mark(e, null), r);
		} finally {
			this.cropping.delete(e);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Zd}`), r = Hl(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = pf(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Kl([t], (e) => r.element.style.setProperty(of, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(In), this.publishShelf(e);
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
		let t = e.querySelector(`.${Xd}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(En, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(sf), t || hf(e, ""));
	}
};
function uf(e) {
	return e.classList.contains(Wd);
}
function df(e) {
	let t = e.getAttribute(Ve);
	return t === "square" || t === "circle" ? t : null;
}
function ff(e) {
	let t = Number(e.getAttribute(He));
	return Number.isInteger(t) && t > 0 ? t : qu;
}
function pf(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${Qd} ${In}`, n.type = "button", n.className = $d, r.className = ef, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, C.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...mf(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...mf(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function mf(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(tf), e.setAttribute("title", n.name), r.className = nf, r.setAttribute("aria-hidden", "true"), Hu(r, xu(n.name, n.type)), i.className = rf, i.textContent = n.name, C.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function hf(e, t) {
	let n = e.querySelector(`.${Jd}`);
	n !== null && (la(n, null), n.textContent !== t && (n.textContent = t));
}
function gf(e) {
	let t = e.querySelector(`.${Jd}`);
	t !== null && C.write(t, null, "ui.file.failed");
}
function _f(e, t) {
	let n = e.querySelector(`.${Gd}`);
	n !== null && C.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function vf(e) {
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
var yf = "ui-key-value-action__row", bf = "ui-key-value-action__value", xf = "ui-key-value-action__value-input", Sf = "ui-key-value-action__edit-action", Cf = "ui-text__title", wf = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${yf}`)), M(this.root, `.${yf}`, {
			childList: !0,
			attributeFilter: [dn]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${xf} [${Le}]`)) {
			if (Pa(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Ia(e);
	}
	open(e) {
		let t = e.querySelector(`.${xf} :is(input, textarea, select)`);
		if (t !== null) {
			if (Pa(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${bf} .${Cf}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), Na(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = Ef(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Sf)) return;
		let { cell: n, row: r } = t, i = e.target.closest(Hn), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Sf} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !w(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click()));
	}
};
function Tf(e) {
	return Ef(e) !== null;
}
function Ef(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${xf}, .${Sf}`), n = t?.closest(`.${yf}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Df = `.ui-button[${tt}="pressed"]`, Of = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Df);
		t === null || w(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, kf = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Un}, .ui-field-box`, Af = `button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true'], ${kf}, ${Hn}, .${_e}`, jf = "button, a, summary, [role='button']";
function Mf(e) {
	let t = [];
	for (let n of e.querySelectorAll(Af)) {
		let r = n.closest(Hn);
		if (!(n.classList.contains("ui-row__grip") || r !== null && e.contains(r) || n.closest(".ui-action-bar") !== null || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	}
	let n = t[0];
	return n instanceof HTMLElement && n.matches(jf) ? n : null;
}
function Nf(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Af);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var Pf = `button, a, input, select, textarea, label, [tabindex], [contenteditable], ${Hn}, [${ze}]`, Ff = ":scope > input.ui-field, :scope > textarea.ui-field", If = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(kf);
		if (t === null || e.target !== t && e.target.closest(Pf) !== null) return;
		let n = t.querySelector(Ff);
		if (!Pa(n) || n.readOnly || w(n) || E(n)) return;
		e.preventDefault(), n.focus({ preventScroll: !0 });
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function P(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var Lf = "data-ui-submit-on-enter", Rf = "data-ui-runs-on-enter", zf = "enter", Bf = 229, Vf = {
	name: zf,
	registration: { settlesValue: !0 }
}, Hf = class {
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
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || Uf(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : Wf(t, e) ? (e.preventDefault(), this.runEnter(t, e)) : Gf(t, e) && (e.preventDefault(), this.commitInPlace(t), this.submitForm(t));
			return;
		}
		if (Na(t)) {
			if (e.preventDefault(), Wf(t, e)) {
				this.runEnter(t, e);
				return;
			}
			this.leave(t), e.key === "Enter" && this.submitForm(t);
		}
	}
	runEnter(e, t) {
		t.repeat || e.readOnly || w(e) || (this.commitInPlace(e), e.dispatchEvent(new Event(zf, { bubbles: !0 })));
	}
	submitForm(e) {
		let t = e.getAttribute(gt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Nn}="${CSS.escape(t)}"]`);
		n !== null && !w(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Zo(e);
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
		let r = _o(e);
		r?.root === t && r.row !== null && So(t, P(t, Ka, Ga), r.row), A(t);
	}
};
function Uf(e) {
	return e.isComposing || e.keyCode === Bf;
}
function Wf(e, t) {
	return Kf(t) && e.hasAttribute(Rf);
}
function Gf(e, t) {
	return Kf(t) && e.hasAttribute(Lf) && !e.readOnly && !w(e);
}
function Kf(e) {
	return e.key === "Enter" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey;
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var qf = "data-ui-fallback-src", Jf = `img[${qf}]`, Yf = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Jf)) (Xf(e) || e.complete && e.naturalWidth === 0) && Zf(e);
		M(this.root, Jf, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && Xf(t) && Zf(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Zf(t);
	}
};
function Xf(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Zf(e) {
	let t = e.getAttribute(qf);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var Qf = "data-ui-radio-value", $f = "ui-radio-group__input", ep = "ui-radio-group__dot", tp = "ui-radio-group", np = "ui-radio-group__item", rp = "data-ui-radio-group-name", ip = "data-ui-radio-bind-value-id", ap = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${tp}`)]);
		for (let e of this.root.querySelectorAll(`.${tp}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${tp}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(op));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [Qf, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${tp}`)) {
			let n = e.getAttribute(rp);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(rp), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(rp, a);
			for (let e of P(r, `.${$f}`, `.${tp}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${tp}`)) n.has(e.getAttribute(rp) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(Qf);
		for (let n of P(e, `.${$f}`, `.${tp}`)) {
			n.checked = n.value === t;
			let e = sp(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(np) ? [e] : [...e.querySelectorAll(`.${np}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${$f}`) !== null) return;
		let t = e.closest(`.${tp}`), n = t?.getAttribute(rp);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = $f, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(ip);
		a !== null && r.setAttribute(Le, a);
		let o = document.createElement("span");
		o.className = ep, e.prepend(r, o), this.sync(t);
	}
};
function op(e) {
	return e.classList.contains(tp) ? [e] : [...e.querySelectorAll(`.${tp}`)];
}
function sp(e) {
	let t = e.closest(`.${np}`);
	return t !== null && T(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function cp(e) {
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
function lp(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function up(e, t) {
	return t !== null && e.length >= t;
}
function dp(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : up(e, n) ? null : [...e, t];
}
function fp(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-terms.ts
var pp = /\p{M}/gu;
function mp(e, t) {
	return hp(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function hp(e, t) {
	return vp(e, _p(t));
}
function gp(e, t) {
	return t.every((t) => e.includes(t));
}
function _p(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function vp(e, t) {
	let n = e.normalize("NFD").replace(pp, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var yp = "data-ui-search-debounce", bp = "data-ui-search-min-length", xp = "data-ui-search-manual", Sp = "data-ui-search-answered", Cp = "ui-search__input", wp = "ui-select__popup", Tp = "ui-select__option", Ep = "ui-text__title", Dp = 300, Op = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Cp) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		kp(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(yp), i = r === null ? Dp : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Dp));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(xp)) return;
		let t = e.getAttribute(bp), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function kp(e) {
	if (e.hasAttribute(Sp)) return;
	let t = e.closest(`.${y}`), n = t?.querySelector(`.${wp}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(bp), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? mp(e.value, e) : [], o = jp(n, (e) => a.length === 0 || gp(hp(Ap(e), e), a));
	Fp(t, n, a.length > 0 && o === 0);
}
function Ap(e) {
	return e.querySelector(`.${Ep}`)?.textContent ?? e.textContent ?? "";
}
function jp(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Mp(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(Tp)) continue;
		let e = t(a);
		Mp(a, e), r ||= e, e && i++;
	}
	return n !== null && Mp(n, r), i;
}
function Mp(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function Np(e) {
	let t = e.querySelector(`.${wp}`);
	t !== null && Fp(e, t, jp(t, (e) => e.style.display !== "none") === 0);
}
function Pp(e) {
	let t = e.querySelector(`.${wp}`);
	t !== null && jp(t, () => !0);
}
function Fp(e, t, n) {
	let r = t.querySelector(`:scope > [${Xe}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Je}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Xe, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/type-ahead.ts
var Ip = 500, Lp = class {
	owner = null;
	typed = "";
	last = -Infinity;
	now;
	constructor(e = () => performance.now()) {
		this.now = e;
	}
	next(e) {
		let t = this.now();
		(e.owner !== this.owner || t - this.last > Ip) && (this.typed = ""), this.owner = e.owner, this.last = t, this.typed += hp(e.character, e.context);
		let n = Array.from(this.typed), r = n.every((e) => e === n[0]), i = r ? n[0] : this.typed, a = e.entries.length, o = e.current === null ? -1 : e.entries.indexOf(e.current), s = r ? o + 1 : Math.max(o, 0);
		for (let t = 0; t < a; t++) {
			let n = e.entries[(s + t) % a];
			if (hp(e.words(n), e.context).trimStart().startsWith(i)) return n;
		}
		return null;
	}
};
function Rp(e) {
	return e.isComposing || e.metaKey || Array.from(e.key).length !== 1 || !/\S/u.test(e.key) || (e.ctrlKey || e.altKey) && !e.getModifierState("AltGraph") ? null : e.key;
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var zp = "data-ui-select-value", Bp = "data-ui-select-placement", Vp = "ui-select--open", Hp = "ui-select__trigger-content", Up = "data-ui-select-content", Wp = "ui-select__placeholder", Gp = "ui-input__affix-icon--prefix", Kp = "ui-select__popup", qp = "ui-select__option", Jp = "ui-select__value-input", Yp = "data-ui-select-clear", Xp = "data-ui-select-trigger-mode", Zp = "ui-search__input", Qp = "ui-search-mode--replace", $p = "ui-text__title", em = "data-ui-active", tm = "ui-multi-select", nm = "ui-multi-select__chips", rm = "ui-multi-select__chip", im = "ui-multi-select__chip-label", am = "ui-multi-select__chip-remove", om = "data-ui-select-chip", sm = "data-ui-select-max", cm = 4, lm = [
	zp,
	En,
	sm,
	"class",
	h,
	"placeholder"
];
function um(e) {
	return e === null || E(e) || w(e);
}
function dm(e) {
	return e.classList.contains(tm);
}
function fm(e) {
	return e.querySelector(`.${Un}`)?.getAttribute(Xp) === "input";
}
function pm(e) {
	return P(e, `.${Kp} .${qp}`, `.${y}`);
}
function mm(e) {
	return e === null ? null : e.querySelector(`.${$p}`)?.textContent ?? e.textContent;
}
function hm(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(m), t.removeAttribute(h), t.removeAttribute(le), t.removeAttribute(ce);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var gm = class {
	root;
	popups = new el({
		show: ({ owner: e }) => e.classList.add(Vp),
		hide: ({ owner: e }) => {
			e.classList.remove(Vp), this.markActive(e, null);
		}
	});
	syncedValues = /* @__PURE__ */ new WeakMap();
	typeAhead = new Lp();
	pressFocusedSearch = null;
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${y}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Sm(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: lm,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Yp}], .${am}`) !== null && e.preventDefault();
		}, !0);
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (dm(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(zp);
		this.decorateOptions(e);
		let n = t === null ? null : pm(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = mm(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${Zp}`);
		if (a !== null) {
			let n = document.activeElement === a;
			a.hasAttribute("placeholder") || a.setAttribute("placeholder", ""), e.classList.contains(Qp) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && Pp(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${Wp}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of pm(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${Jp}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), Np(e);
	}
	syncMultiple(e) {
		let t = cp(e.getAttribute(En)), n = new Set(t), r = up(t, lp(e.getAttribute(sm)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = pm(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		bm(e, o.map((e) => ({
			key: e,
			label: ym(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${Wp}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${Jp}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(En, l), Np(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${Un}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${Hp}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(h);
		if (r !== null && i !== null && r.getAttribute(Up) === i) {
			r.removeAttribute(Up);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = Hp;
			let e = n.querySelector(`:scope > .${Gp}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		hm(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of pm(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = T(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Zp)) return;
		let t = e.target.closest(`.${y}`);
		t !== null && t !== this.openSelect && this.toggle(t, !0);
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${qp}`);
		t === null || n === null || n.hasAttribute(em) || T(n) || w(n) || n.closest(".ui-select") !== t || (D(pm(t).filter((e) => !T(e)), n), fm(t) || Uo(n), this.markActive(t, n, !0));
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Zp)) return;
		let t = e.target, n = t.closest(`.${y}`);
		if (this.pressFocusedSearch = null, n === null || n === this.openSelect || t.readOnly || !n.classList.contains(Qp)) return;
		let r = n.getAttribute(zp);
		r !== null && (t.value = mm(pm(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select(), Bo() && (this.pressFocusedSearch = t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${am}`);
		if (t !== null) {
			let n = t.closest(`.${y}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), um(n) || this.removeChosen(n, t.closest(`.${rm}`)?.getAttribute(om) ?? null));
			return;
		}
		let n = e.target.closest(`[${Yp}]`);
		if (n !== null) {
			let t = n.closest(`.${y}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), um(t) || (this.clearValue(t), _m(t)));
			return;
		}
		let r = e.target.closest(`.${Un}`);
		if (r !== null) {
			let t = r.closest(`.${y}`);
			if (um(t) || r.getAttribute(Xp) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			let n = t?.classList.contains(Qp) === !0 ? r.querySelector(`.${Zp}`) : null, i = n !== null && (n === this.pressFocusedSearch || document.activeElement !== n);
			this.pressFocusedSearch = null, e.preventDefault(), this.toggle(t), i && t === this.openSelect && document.activeElement === n && n.selectionStart === n.selectionEnd && n.select();
			return;
		}
		let i = e.target.closest(`.${qp}`);
		if (i === null) return;
		let a = i.closest(`.${y}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.handleClosedArrow(e) || this.handleTypeAhead(e) || e.isComposing || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qp}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${y}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleClosedArrow(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || t === this.openSelect || um(t) || fm(t)) return !1;
		e.preventDefault();
		let n = pm(t).filter((e) => !T(e) && !w(e)), r = n.find((e) => e.getAttribute("aria-selected") === "true") ?? (e.key === "ArrowDown" ? n[0] : n[n.length - 1]) ?? null;
		return this.toggle(t, !1, r), !0;
	}
	handleTypeAhead(e) {
		let t = Rp(e), n = e.target instanceof HTMLElement ? e.target : null;
		if (t === null || n === null || !(n.classList.contains("ui-select__trigger") || n.classList.contains(qp))) return !1;
		let r = n.closest(`.${y}`), i = r !== null && r === this.openSelect;
		if (r === null || um(r) || fm(r) || !i && !n.classList.contains("ui-select__trigger")) return !1;
		e.preventDefault();
		let a = pm(r).filter((e) => !T(e) && !w(e)), o = i ? a.find((e) => e === document.activeElement) ?? a.find((e) => e.hasAttribute(em)) ?? null : a.find((e) => e.getAttribute("aria-selected") === "true") ?? null, s = this.typeAhead.next({
			owner: r,
			character: t,
			entries: a,
			current: o,
			words: (e) => mm(e) ?? "",
			context: r
		});
		return s === null ? !0 : i ? (D(pm(r).filter((e) => !T(e)), s), vm(r, s), A(s), this.markActive(r, s), !0) : (this.toggle(r, !1, s), !0);
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !dm(t) || um(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${nm} > .${rm}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(om)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Zp) || !t.contains(e.target) ? null : pm(t).find((e) => e.hasAttribute(em) && !T(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1, n = null) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close(), t || (Pp(e), Np(e));
		let r = e.querySelector(`.${Un}`), i = e.querySelector(`.${Kp}`), a = e.getAttribute(Bp);
		if (r === null || i === null) return;
		r.setAttribute("aria-controls", Qn(i, "ui-select-popup"));
		let o = fm(e) ? e.querySelector(`.${Zp}`) ?? r : r;
		this.popups.open({
			owner: e,
			popup: i,
			anchor: r,
			placement: {
				placement: a !== null && qs(a) ? a : "bottom-start",
				gap: cm,
				minAnchorWidth: !0
			},
			openers: [r],
			returnFocus: () => o
		}) && this.initializeFocus(e, n);
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e, t) {
		let n = pm(e).filter((e) => !T(e));
		if (n.length === 0) return;
		let r = t ?? n.find((e) => e.getAttribute("aria-selected") === "true");
		if (r === void 0 && Bo()) {
			D(n, null), this.markActive(e, null), _m(e);
			return;
		}
		let i = r ?? n[0];
		if (D(n, i), this.markActive(e, i, Bo()), vm(e, i), fm(e)) {
			let t = e.querySelector(`.${Zp}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		A(i);
	}
	moveFocus(e, t) {
		let n = pm(e).filter((e) => !T(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(em)) ?? null, i = La({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (D(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of pm(e)) r === t ? r.setAttribute(em, "") : r.hasAttribute(em) && r.removeAttribute(em), Ho(r, r === t && n);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || T(t) || um(e)) return;
		if (dm(e)) {
			let r = dp(cp(e.getAttribute(En)), n, lp(e.getAttribute(sm)));
			this.markActive(e, t, Bo()), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(zp) === n) {
			this.close();
			return;
		}
		e.setAttribute(zp, n), this.sync(e);
		let r = e.querySelector(`.${Jp}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : fp(cp(e.getAttribute(En)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${rm}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${Un}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(En) : e.setAttribute(En, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Jp}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (dm(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(zp)) return;
		e.removeAttribute(zp), this.sync(e);
		let t = e.querySelector(`.${Jp}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function _m(e) {
	let t = e.querySelector(fm(e) ? `.${Zp}` : `.${Un}`);
	t !== null && !t.contains(document.activeElement) && A(t);
}
function vm(e, t) {
	let n = e.querySelector(`.${Kp}`);
	if (n === null) return;
	let r = n.getBoundingClientRect(), i = t.getBoundingClientRect(), a = getComputedStyle(n), o = r.top + (Number.parseFloat(a.borderTopWidth) || 0), s = o + (Number.parseFloat(a.paddingTop) || 0), c = o + n.clientHeight - (Number.parseFloat(a.paddingBottom) || 0);
	i.top < s ? n.scrollTop -= s - i.top : i.bottom > c && (n.scrollTop += i.bottom - c);
}
function ym(e, t) {
	let n = mm(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function bm(e, t) {
	let n = e.querySelector(`.${nm}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${rm}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(om) === t[n].key && e.querySelector(`.${im}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => xm(e.key, e.label)));
	}
}
function xm(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = rm, n.setAttribute(om, e), r.className = im, r.textContent = t, i.className = am, i.type = "button", i.tabIndex = -1, C.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function Sm(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${y}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && e.attributeName === "placeholder") {
		let n = e.target instanceof HTMLElement && e.target.classList.contains(Zp) ? e.target.closest(`.${y}`) : null;
		n !== null && t.add(n);
		return;
	}
	if (e.type === "attributes" && (e.attributeName === zp || e.attributeName === "data-ui-selected-keys" || e.attributeName === sm)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${Kp}`)?.closest(`.${y}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Cm = "data-ui-input-debounce", wm = `input[${Cm}], textarea[${Cm}]`;
function Tm(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(wm);
}
var Em = /* @__PURE__ */ new Set();
function Dm() {
	for (let e of Em) if (e.waiting) return !0;
	return !1;
}
function Om() {
	for (let e of Em) e.commitAll();
}
var km = class {
	root;
	timers = /* @__PURE__ */ new Map();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0), Em.add(this);
	}
	get waiting() {
		return this.timers.size > 0;
	}
	commitAll() {
		for (let [e, t] of [...this.timers]) window.clearTimeout(t), this.commit(e);
	}
	handleInput(e) {
		let t = e.target;
		if (!Tm(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Cm));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Tm(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Am = "textarea.ui-text-area__field", jm = "data-ui-text-area-grow";
function Mm() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var Nm = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(Am) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(Am)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Nr(e.components, Am));
		}), M(this.root, Am, {
			childList: !0,
			attributeFilter: [jm]
		}, (e) => {
			this.fitAll(Nr(e, Am));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(jm)) {
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
}, Pm = "ui-slider__input", Fm = "ui-slider__value", Im = "ui-slider__bubble", Lm = "ui-slider__track", Rm = "ui-slider__thumb-anchor", zm = "ui-slider", Bm = "ui-orientation--vertical", Vm = "--ui-slider-fraction", Hm = 6, Um = "Value", Wm = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), Gm = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Wm.has(e.propertyName)) return;
			let t = x(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Pm}`);
				t !== null && (this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === Um && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || Km(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Pm)) return;
		let t = e.target;
		if (Km(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	placeBubble(e) {
		let t = qm(e);
		t !== null && ic(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Hm
		});
	}
	releaseBubble(e) {
		dc(qm(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Lm}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Fm}, .${Im}`) ?? []) n.textContent = e.value;
		e.closest(`.${Lm}`)?.style.setProperty(Vm, String(Jm(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function Km(e) {
	return E(e) || w(e);
}
function qm(e) {
	if (!(e instanceof Element) || !e.classList.contains(Pm)) return null;
	let t = e.closest(`.${Lm}`), n = t?.querySelector(`.${Im}`) ?? null, r = t?.querySelector(`.${Rm}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${zm}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(Bm)
	};
}
function Jm(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var Ym = {
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
}, Xm = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Zm = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Qm = [
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
], $m = [
	"n %",
	"n%",
	"%n",
	"% n"
], eh = [
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
], th = /[1-9]/;
function nh(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return Ym;
	try {
		return {
			...Ym,
			...JSON.parse(t)
		};
	} catch {
		return Ym;
	}
}
function rh(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = ah(t);
	if (r === null) return oh(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = sh(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return ih(e, t) ? fh(Xm[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = sh(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return ih(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = ch(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return ih(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = sh(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return fh(ih(e, t) ? Qm[n.currencyNegativePattern] ?? "-$n" : Zm[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = sh(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return fh(ih(e, t) ? eh[n.percentNegativePattern] ?? "-n %" : $m[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return oh(e, n);
	}
}
function ih(e, t) {
	return e < 0 && th.test(t);
}
function ah(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function oh(e, t) {
	let { integer: n, fraction: r } = lh(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function sh(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = ch(e, t, n);
	return n === 0 ? dh(o, r, i) : `${dh(o, r, i)}${a}${s}`;
}
function ch(e, t, n) {
	let { integer: r, fraction: i } = lh(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? uh(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function lh(e, t) {
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
function uh(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function dh(e, t, n) {
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
function fh(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var ph = {
	readCulture: nh,
	format: rh
}, mh = /^-?(\d+(\.\d*)?|\.\d+)$/;
function hh(e, t, n) {
	if (!mh.test(e)) return e;
	let r = n.thousands ? t : xh(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return rh(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return rh(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function gh(e, t, n) {
	return mh.test(e) ? (bh(n) ? Sh(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function _h(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = bh(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!mh.test(d)) return null;
	let f = a ? Sh(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function vh(e, t, n, r, i) {
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
function yh(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function bh(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function xh(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Sh(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Ch = "ui-number-input", wh = "ui-number-input__field", Th = "data-ui-number-no-decimals", Eh = "data-ui-number-no-negative", Dh = "data-ui-number-no-thousands", Oh = "data-ui-number-trim-zeros", kh = "data-ui-number-step", Ah = "data-ui-number-min", jh = "data-ui-number-max", Mh = "data-ui-number-step-direction", Nh = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${wh}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Nr(e.components, `.${wh}`));
		}), C.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${wh}`)));
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
		let t = Ph(e);
		if (t !== null) return this.keptValue(t) ?? Fh(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = nh(e), r = e === document.activeElement ? gh(t, n, Ih(e)) : hh(t, n, {
			format: Ih(e),
			thousands: !e.hasAttribute(Dh)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = Ph(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Th), r = !t.hasAttribute(Eh), i = t.selectionStart ?? t.value.length, a = vh(t.value, i, nh(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Ph(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = Ph(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : Fh(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(Oh) && !E(t) && !w(t)) {
			let e = this.values.get(t) ?? "", n = yh(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = Ph(e.target);
		if (t === null) return;
		let n = Fh(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = Ph(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = gh(t, nh(e), Ih(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Mh + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${wh}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(Mh) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = Ph(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(kh) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : Fh(e) ?? "0") || 0) + n * t, i = e.getAttribute(Ah), a = e.getAttribute(jh);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, Lh(r)), this.show(e);
	}
};
function Ph(e) {
	return e instanceof HTMLInputElement && e.classList.contains(wh) ? e : null;
}
function Fh(e) {
	return _h(e.value, nh(e), Ih(e));
}
function Ih(e) {
	return e.closest(`.${Ch}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Lh(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Rh = `:scope > [${Xe}], :scope > [${Ze}], :scope > [${ct}]`;
function F(e) {
	let t = new Set(e.querySelectorAll(Rh));
	return [...e.children].filter((e) => !t.has(e));
}
function zh(e) {
	return e === null ? [] : [e];
}
function Bh(e) {
	return e.querySelector(`:scope > [${Xe}]`);
}
function Vh(e, t, n, r, i) {
	i ??= F(e).some((e) => !e.classList.contains(Rn));
	let a = Bh(e);
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
	c.setAttribute(Xe, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var Hh = { ok: !1 };
function Uh(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => nr(e.kind) !== "Scope"), o = r, s = r, c = !0, l = 0, u = 0, d = !0;
	for (; u < i.length;) {
		let t = i[u];
		if (t === ".") {
			if (d) return Hh;
			d = !0, u++;
			continue;
		}
		if (t === "[") {
			if (u + 1 >= i.length || i[u + 1] !== "]" || l >= a.length) return Hh;
			let t = a[l];
			if (l++, nr(t.kind) === "Dynamic") {
				let n = qh(e, t.componentId);
				if (!n.ok) return Hh;
				o = n.value, s = n.value, c = !0;
			} else {
				if (!c) return Hh;
				let e = $h(o, t.value);
				if (!e.ok) return Hh;
				o = e.value;
			}
			u += 2, d = !1;
			continue;
		}
		let n = u;
		for (; u < i.length && i[u] !== "." && i[u] !== "[";) u++;
		if (u === n) return Hh;
		if (c) {
			let e = Yh(o, i.slice(n, u));
			e.ok ? o = e.value : c = !1;
		}
		d = !1;
	}
	return d || l !== a.length || !c ? Hh : {
		ok: !0,
		value: o,
		scope: s
	};
}
function Wh(e, t, n) {
	for (let r of t ?? []) {
		if (nr(r.kind) !== "Dynamic") continue;
		let t = x(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Gh(e) {
	let t = Yh(e, "IsContent");
	return t.ok && t.value === !0;
}
var Kh = /* @__PURE__ */ new Set();
function qh(e, t) {
	let n = x(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return Kh.has(n) || (Kh.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), Hh;
}
function Jh(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = Yh(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function Yh(e, t) {
	if (e == null) return Hh;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return Hh;
	let n = e, r = Xh(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : Hh;
}
function Xh(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = Zh(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function Zh(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Qh(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => nr(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, nr(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = x(e.componentId);
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
function $h(e, t) {
	if (e == null || t == null) return Hh;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : Hh;
	if (typeof t != "string") return Hh;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (tg(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return Hh;
}
function eg(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (tg(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function tg(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function ng(e) {
	let t = e.closest(v)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function rg(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = ng(e);
	if (a === void 0 && o === null) {
		for (let t of F(e)) t.classList.remove(Rn);
		return;
	}
	for (let n of F(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Rn);
			continue;
		}
		n.classList.toggle(Rn, !ig(a, e, i, o));
	}
}
function ig(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => lg(e, t, n)) && (r?.filters ?? []).every((e) => Ns(Jh(t, e.itemProperty), e.operator, e.value));
}
function ag(e, t, n = null) {
	return (e?.filters ?? []).some((e) => ug(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function og(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => ug(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function sg(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => cg(n.getItemValue(e), n.getItemValue(r), t));
}
function cg(e, t, n) {
	for (let r of n) {
		let n = dg(Ps(Jh(e, r.itemProperty)), Ps(Jh(t, r.itemProperty)));
		if (n !== 0) return sr(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function lg(e, t, n) {
	if (!ug(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return Ns(Jh(t, e.itemProperty), e.operator, r);
}
function ug(e, t, n, r) {
	return e == null || Ns(r.get(e, []), t, n);
}
function dg(e, t) {
	if (e === t) return 0;
	let n = pg(e), r = pg(t);
	if (n !== r) return n - r;
	if (n === fg.Nothing) return 0;
	if (n === fg.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var fg = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function pg(e) {
	return e == null ? fg.Nothing : typeof e == "number" ? Number.isNaN(e) ? fg.Nothing : fg.Number : typeof e == "string" && e.trim().length === 0 ? fg.Nothing : Number.isNaN(Number(e)) ? fg.Text : fg.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function mg(e) {
	switch (e.getAttribute(rt)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
function hg(e) {
	let t = mg(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
//#endregion
//#region src/items/items-source-order.ts
var gg = /* @__PURE__ */ new WeakMap();
function _g(e, t) {
	let n = gg.get(e), r = n === void 0 ? [...t] : vg(n, t);
	return gg.set(e, r), r;
}
function vg(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function yg(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function bg(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function xg(e, t, n) {
	return bg(e, t), yg(e, t, n);
}
function Sg(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Cg(e) {
	gg.delete(e);
}
//#endregion
//#region src/interactions/drag-marks.ts
function wg(e, t, n, r, i, a = []) {
	Tg(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Tg(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Eg = ".ui-items-view, .ui-table", Dg = ".ui-items-view__item, .ui-table__row", Og = "ui-row--dragging", kg = "--ui-row-drop-offset", Ag = "move";
function jg(e) {
	let t = /* @__PURE__ */ new WeakMap();
	return {
		name: Ag,
		registration: {
			dynamicParameters: (e) => {
				let t = Mg(e.domEvent);
				return t === null ? null : [...e.dynamicParameters, t];
			},
			started: (n) => {
				let r = Mg(n.domEvent), i = r === null || !(n.domEvent.target instanceof Element) ? null : n.domEvent.target.closest(Dg), a = i?.parentElement ?? null;
				if (e === void 0 || r === null || i === null || a === null || !a.hasAttribute("data-ui-items-host")) return;
				let o = e.ahead(a, k(i), r);
				o !== null && t.set(n.domEvent, o);
			},
			completed: (n) => {
				let r = t.get(n.domEvent);
				r !== void 0 && e?.settle(r);
			}
		}
	};
}
function Mg(e) {
	let t = e instanceof CustomEvent ? e.detail?.index : void 0;
	return typeof t == "number" ? t : null;
}
var Ng = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t === null ? null : O(t.row);
		if (t === null || n === null) return;
		let r = Fg(t.root, t.row);
		(r === null ? !Ig(e.target, t.row) : !r.contains(e.target)) || (r !== null && (So(t.root, Hg(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 })), n.draggable || (n.draggable = !0, this.lifted = n));
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	movableRow(e) {
		let t = e.closest(Ka), n = t?.parentElement ?? null, r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return t === null || n === null || r === null || !t.matches(Dg) || !n.hasAttribute("data-ui-items-host") || !r.hasAttribute("data-ui-rows-draggable") || w(r) || t.hasAttribute("data-ui-undraggable") || T(t) || this.isSorted(r, n) ? null : {
			root: r,
			row: t
		};
	}
	isSorted(e, t) {
		let n = Fr(e);
		return this.services === void 0 || n === null ? !1 : og(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, ng(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : O(t.row);
		t !== null && n !== null && r !== null && e.target === r && (this.drag = {
			root: t.root,
			host: n,
			row: t.row
		}, wg(e, t.root, r, Og, k(t.row)));
	}
	handleDragOver(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		let n = Rg(t), r = Hg(t.host), i = this.placeOf(t, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? Ug(t.root, null) : Ug(t.root, i, Bg(r, i, n));
	}
	placeOf(e, t, n, r, i) {
		if (t.closest("[data-ui-group-header]")?.parentElement === e.host) return null;
		let a = t.closest(Ka);
		for (; a !== null && a.parentElement !== e.host;) a = a.parentElement?.closest(Ka) ?? null;
		if (a ??= Vg(i, n), a === null) return null;
		let o = (O(a) ?? a).getBoundingClientRect();
		if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
			anchor: a,
			side: "after"
		};
		let s = i[i.indexOf(a) - 1];
		return s !== void 0 && zg(s, a, r) ? {
			anchor: s,
			side: "after"
		} : {
			anchor: a,
			side: "before"
		};
	}
	indexOf(e, t, n) {
		if (Lg(t) !== Lg(e.row)) return null;
		let r = Pg(this.orderOf(e.host), k(e.row), k(t), n);
		return r === null ? null : r + hg(e.host);
	}
	orderOf(e) {
		switch (mg(e)) {
			case "virtualized": return [...this.services?.keysOf(e) ?? F(e).map(k)];
			case "windowed": return F(e).map(k);
			default: return _g(e, F(e)).map(k);
		}
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && !(e.relatedTarget instanceof Node && t.host.contains(e.relatedTarget)) && Ug(t.root, null);
	}
	handleDrop(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		e.preventDefault();
		let n = this.placeOf(t, e.target, e, Rg(t), Hg(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && Eo(t.row, Ag, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Tg(e.root, Og), Ug(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = _o(e.target);
		if (t === null || !t.root.matches(Eg) || t.row !== null && Nf(e.target, t.row) !== null) return;
		let n = uo(t.root), r = n === null ? [] : Hg(n), i = yo(r);
		if (n === null || i === null || this.movableRow(i) === null) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			root: t.root,
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && Eo(i, Ag, { index: c });
	}
};
function Pg(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = e.filter((e) => e !== t).indexOf(n);
	if (a < 0) return null;
	let o = r === "before" ? a : a + 1;
	return o === i ? null : o;
}
function Fg(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Ig(e, t) {
	return Nf(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Lg(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Rg(e) {
	let t = e.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: t,
		rightToLeft: t && getComputedStyle(e.host).direction === "rtl"
	};
}
function zg(e, t, n) {
	if (Lg(e) !== Lg(t)) return !1;
	if (!n.across) return !0;
	let r = (O(e) ?? e).getBoundingClientRect(), i = (O(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Bg(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !zg(t.anchor, r, n)) return -1;
	let i = (O(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (O(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function Vg(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (O(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function Hg(e) {
	return F(e).filter((e) => e instanceof HTMLElement && e.matches(Dg) && O(e) !== null);
}
function Ug(e, t, n = 0) {
	let r = t === null ? null : O(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(kg));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(kg) !== i && r.style.setProperty(kg, i);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var I = "ui-temporal-input", Wg = "ui-calendar", Gg = `.${I}, .${Wg}`, Kg = "ui-temporal-input__value-input", qg = "ui-temporal-input__end-value-input", Jg = "data-ui-temporal-range", Yg = "data-ui-temporal-end", Xg = "data-ui-temporal-mode", Zg = "data-ui-temporal-format", Qg = "data-ui-temporal-default-format", $g = "data-ui-temporal-min", e_ = "data-ui-temporal-max", t_ = "data-ui-temporal-step", n_ = "data-ui-temporal-step-unit", r_ = "data-ui-temporal-marked-days", i_ = "data-ui-temporal-marked-only", a_ = "data-ui-temporal-page-culture", o_ = "data-ui-temporal-months", s_ = "data-ui-temporal-months-genitive", c_ = "data-ui-temporal-months-short", l_ = "data-ui-temporal-daynames", u_ = "data-ui-temporal-weekdays", d_ = "data-ui-temporal-am", f_ = "data-ui-temporal-pm", p_ = /* @__PURE__ */ new Set([
	Zg,
	Qg,
	$g,
	e_,
	o_,
	d_,
	f_,
	r_,
	i_
]), m_ = 2e3;
function h_(e) {
	let t = e.getAttribute(Xg);
	return t === "time" || t === "date-time" ? t : "date";
}
function g_(e) {
	let t = e.getAttribute(Zg);
	return t === null || t.trim().length === 0 ? e.getAttribute(Qg) ?? "" : t;
}
function __(e) {
	let t = e.getAttribute(n_), n = Math.max(1, Math.trunc(Number(e.getAttribute(t_))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function v_(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function y_(e) {
	return {
		monthNames: b_(e, o_),
		monthGenitiveNames: b_(e, s_),
		abbreviatedMonthNames: b_(e, c_),
		dayNames: b_(e, l_),
		abbreviatedDayNames: b_(e, u_),
		amDesignator: e.getAttribute(d_) ?? "AM",
		pmDesignator: e.getAttribute(f_) ?? "PM"
	};
}
function b_(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function x_(e, t) {
	e.hasAttribute(a_) && (T_(e, s_, t.monthGenitiveNames.join("|")), T_(e, c_, t.abbreviatedMonthNames.join("|")), T_(e, l_, t.dayNames.join("|")), T_(e, u_, t.abbreviatedDayNames.join("|")), T_(e, o_, t.monthNames.join("|")), T_(e, d_, t.amDesignator), T_(e, f_, t.pmDesignator), T_(e, Qg, w_(h_(e), __(e), t)));
}
function S_(e) {
	for (let t = 0; t < e.length;) {
		let n = Qr(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function C_(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function w_(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Kr(n, r);
}
function T_(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function E_(e) {
	return e.hasAttribute(Jg);
}
function D_(e) {
	return e !== null && e.hasAttribute(Yg);
}
function O_(e) {
	return L(e, !1);
}
function L(e, t) {
	let n = k_(e, t);
	return n === null ? null : H_(n.value, h_(e));
}
function k_(e, t) {
	return e.querySelector(`.${t ? qg : Kg}`);
}
function A_(e, t) {
	return H_(e.getAttribute(t) ?? "", h_(e));
}
function j_(e) {
	let t = A_(e, $g), n = A_(e, e_), r = (e.getAttribute(r_) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : U_(t, "date"),
		max: n === null ? null : U_(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(i_)
	};
}
function M_(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function N_(e, t, n) {
	let r = k_(e, n);
	if (r === null) return;
	let i = t === null ? "" : U_(t, h_(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function P_(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : ci(n, g_(e), y_(e));
	return r === null ? n : U_(ri(r), h_(e));
}
function F_(e) {
	if (!E_(e)) return;
	let t = L(e, !1), n = L(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (N_(e, n, !1), N_(e, t, !0));
}
function I_(e) {
	E(e) || w(e) || (L_(e, !1), E_(e) && L_(e, !0));
}
function L_(e, t) {
	let n = L(e, t);
	if (n === null) return;
	let r = z_(e, n);
	r.getTime() !== n.getTime() && N_(e, r, t);
}
function R_(e) {
	return B_(e, z_(e, /* @__PURE__ */ new Date()));
}
function z_(e, t) {
	let n = A_(e, $g), r = A_(e, e_);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function B_(e, t) {
	let n = __(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var V_ = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function H_(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = V_.exec(n);
		return e === null ? null : new Date(m_, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = ni(n);
	return r === null ? null : ri(r);
}
function U_(e, t) {
	let n = `${W_(e.getHours())}:${W_(e.getMinutes())}:${W_(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${W_(e.getMonth() + 1)}-${W_(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function W_(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function G_(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = J_(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Y_(e.start).getTime() ? {
		start: J_(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: J_(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function K_(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Y_(e).getTime();
	return r > Y_(t).getTime() && r < Y_(n).getTime();
}
function q_(e, t, n) {
	return !n && K_(e, t.start, t.end);
}
function J_(e, t) {
	return ii(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Y_(e) {
	return ii(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var X_ = "ui-temporal-input__day", Z_ = "ui-temporal-input__month", Q_ = "data-ui-temporal-first-day", $_ = "data-ui-temporal-nav", ev = "data-ui-temporal-day", tv = 366;
function nv(e) {
	let t = O_(e);
	return {
		view: Cv(t ?? z_(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function rv(e, t, n, r) {
	let i = R("div", `${I}__calendar`), a = R("div", `${I}__calendar-header`), o = j_(e), s = Sv("previous", "‹", C.text("ui.picker.previous"));
	s.disabled = iv(o, t, -1) === null, a.append(s);
	let c = Sv("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${I}__calendar-label`), a.append(c);
	let l = Sv("next", "›", C.text("ui.picker.next"));
	return l.disabled = iv(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? cv(e, t, n, r, o) : lv(t, n, o)), i;
}
function iv(e, t, n) {
	let r = t.pane === "months", i = Ev(t.view, n * (r ? 12 : 1));
	return ov(e, av(i, r ? 4 : 7)) ? sv(e, i) : null;
}
function av(e, t) {
	return U_(e, "date").slice(0, t);
}
function ov(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function sv(e, t) {
	let n = av(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : H_(r, "date");
	return i === null ? t : Cv(i);
}
function cv(e, t, n, r, i) {
	let a = yv(e), o = R("div", `${I}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = R("span", `${I}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = R("div", `${I}__days`), c = Y_(/* @__PURE__ */ new Date()), l = E_(e), u = l ? L(e, !1) : r, d = l ? L(e, !0) : null, f = wv(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = Tv(f, e), r = U_(n, "date"), a = R("button", X_);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(ev, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${X_}--outside`), Dv(n, c) && (a.classList.add(`${X_}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${X_}--marked`);
		let o = u !== null && Dv(n, u), p = d !== null && Dv(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${X_}--selected`), l && (o || p) && a.setAttribute("aria-description", C.text(o ? "ui.picker.start" : "ui.picker.end")), q_(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${X_}--within`), M_(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = R("div", `${I}__calendar-pane`);
	return p.append(o, s), p;
}
function lv(e, t, n) {
	let r = R("div", `${I}__months`);
	for (let i = 0; i < 12; i++) {
		let a = R("button", Z_);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute($_, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${Z_}--selected`), a.setAttribute("aria-current", "true")), ov(n, av(ii(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function uv(e) {
	let t = R("div", `${I}__period-caption`);
	return t.textContent = C.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function dv(e, t, n) {
	let r = j_(e);
	if (n.startsWith("month:")) {
		let e = ii(t.view.getFullYear(), Number(n.slice(6)), 1);
		return ov(r, av(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = iv(r, t, -1) ?? t.view, !0;
		case "next": return t.view = iv(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function fv(e, t, n) {
	if (E_(e)) {
		pv(e, t, n);
		return;
	}
	let r = mv(n, O_(e) ?? R_(e));
	t.focusedDay = r, t.view = Cv(r), N_(e, r, !1);
}
function pv(e, t, n) {
	let r = G_({
		start: L(e, !1),
		end: L(e, !0)
	}, t.activeEnd, mv(n, R_(e)));
	t.focusedDay = r.end ?? r.start, t.view = Cv(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, N_(e, r.end, !0), N_(e, r.start, !1);
}
function mv(e, t) {
	return ii(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function hv(e, t, n) {
	let r = _v(n), i = vv(t, n, yv(e));
	if (i === null) return null;
	let a = j_(e);
	if (r === 0) return gv(a, i);
	let o = i;
	for (let e = 0; e < tv; e++) {
		if (M_(a, U_(o, "date"))) return o;
		o = Tv(o, r);
	}
	return t;
}
function gv(e, t) {
	let n = U_(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : H_(r, "date");
	return i === null ? t : mv(i, t);
}
function _v(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function vv(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Tv(e, -1);
		case "ArrowRight": return Tv(e, 1);
		case "ArrowUp": return Tv(e, -7);
		case "ArrowDown": return Tv(e, 7);
		case "PageUp": return Ev(e, -1);
		case "PageDown": return Ev(e, 1);
		case "Home": return Tv(e, -r);
		case "End": return Tv(e, 6 - r);
		default: return null;
	}
}
function yv(e) {
	let t = Number(e.getAttribute(Q_));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function bv(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${X_}`)];
	if (i.length === 0) return;
	let a = U_(Y_(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (D(i, o), r && A(o));
}
function xv(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? L(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${X_}`)) {
		let e = H_(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${X_}--preview`, e !== null && n !== null && r !== null && K_(e, n, Tv(r, 1)));
	}
}
function Sv(e, t, n) {
	let r = R("button", `${I}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute($_, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function R(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Cv(e) {
	return ii(e.getFullYear(), e.getMonth(), 1);
}
function wv(e, t) {
	let n = Cv(e);
	return Tv(n, -((n.getDay() - t + 7) % 7));
}
function Tv(e, t) {
	return ii(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Ev(e, t) {
	let n = ii(e.getFullYear(), e.getMonth() + t, 1), r = ii(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return ii(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Dv(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/temporal-picker-engine.ts
var Ov = "ui-temporal-input__field", kv = "ui-temporal-input__popup", Av = "ui-temporal-input--open", jv = "ui-calendar__body", z = "ui-temporal-input__time-cell", Mv = "ui-temporal-input__time-column", Nv = 4, Pv = 140, Fv = "data-ui-temporal-toggle", Iv = "data-ui-temporal-unit", Lv = "data-ui-temporal-cell", Rv = "data-ui-temporal-centred", zv = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new el({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(Av), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(Av);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(Gg)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Nr(e.components, Gg), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && Bv(e) && this.states.set(e, nv(e)), this.isShowing(e) && this.renderSurface(e);
		}), M(this.root, Gg, { attributeFilter: [...p_] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), M(this.root, Gg, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), C.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) Bv(e) && Vv(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(Gg)], t = C.temporal;
		if (t !== null && C.language !== this.drawnLanguage) {
			this.drawnLanguage = C.language;
			for (let n of e) x_(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || Bv(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${jv}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && Vv(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			I_(t);
			let e = oi(g_(t), ny());
			for (let n of t.querySelectorAll(`.${Ov}`)) {
				if (n.placeholder !== e && (n.placeholder = e), n === document.activeElement && this.written.has(n)) continue;
				this.written.add(n);
				let r = k_(t, D_(n))?.value ?? "", i = H_(r, h_(t));
				if (i !== null) {
					n.value = Xr(i, g_(t), y_(t));
					continue;
				}
				r.length === 0 && (n.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ov)) return;
		let t = e.target.closest(`.${I}`), n = t === null ? null : k_(t, D_(e.target));
		if (t === null || n === null) return;
		let r = P_(t, e.target.value), i = H_(r, h_(t)), a = i === null ? r : U_(z_(t, i), h_(t));
		if (Hv(t, a)) {
			let n = L(t, D_(e.target));
			e.target.value = n === null ? "" : Xr(n, g_(t), y_(t));
			return;
		}
		D_(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), F_(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Ov)) return;
		let t = e.target.closest(`.${I}`);
		t !== null && E_(t) && (this.getState(t).activeEnd = D_(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !E_(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${ev}]`) : null, r = this.getState(t), i = n === null ? null : H_(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, xv(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${ev}], .${z}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(z) ? ay(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = Vv(e), r = H_(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, D([...n.querySelectorAll(`.${X_}`)], t), Uo(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Ov)) return;
		let t = e.target.closest(`.${I}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Fv}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${I}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${$_}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${ev}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${Lv}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${Iv}]`)?.getAttribute(Iv);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(Lv)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (dv(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, R_(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), E_(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = H_(t, "date");
		if (n === null || E(e) || w(e) || !M_(j_(e), t)) return;
		let r = this.getState(e);
		Bv(e) && E_(e) && !r.choosingEnd && L(e, !1) !== null && L(e, !0) !== null && (r.activeEnd = "start");
		let i = k_(e, !1), a = `${i?.value ?? ""}|${k_(e, !0)?.value ?? ""}`;
		fv(e, r, n), Bv(e) && `${i?.value ?? ""}|${k_(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = E_(e) && this.getState(e).activeEnd === "end", i = new Date(L(e, r) ?? R_(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		N_(e, t, n), F_(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(Ov)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${I}`), D_(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(z)) {
			oy(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = H_(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, U_(n, "date"));
			return;
		}
		let r = hv(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Cv(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Mv}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, Pv)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Mv}`), n = t?.getAttribute(Iv) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = pd(this.wheelTurns.get(n) ?? 0, fd(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${z}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${z}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${z}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(Lv)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(Rv));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(Iv), i = Zv(e);
		if (!(r === null || i === null || i.classList.contains(`${z}--selected`))) {
			if (i.matches(":disabled")) {
				Yv(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(Lv)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${kv}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = E_(e) ? t ?? (L(e, !1) === null ? "start" : L(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = L(e, r.activeEnd === "end") ?? O_(e);
		r.pane = "days", r.view = Cv(i ?? z_(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${Fv}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: {
				placement: "bottom-end",
				gap: Nv
			},
			openers: a === null ? [] : [a],
			returnFocus: () => iy(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = nv(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = Vv(e);
		if (n === null) return;
		let r = Bv(e), i = h_(e), a = this.getState(e), o = y_(e), s = E_(e), c = L(e, s && a.activeEnd === "end"), l = Qv(n), u = $v(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(uv(a)), r) n.append(rv(e, a, o, c));
		else {
			let t = R("div", `${I}__panes`);
			t.append(rv(e, a, o, c)), i === "date-time" && t.append(Uv(e, c)), n.append(t, ty(i));
		}
		let f = u === null ? null : n.querySelector(`[${$_}="${CSS.escape(u)}"]:not(:disabled)`);
		bv(n, a, c, t || d && l === null && f === null), xv(e, a), r || (Jv(n), Yv(n), ey(n, l)), f !== null && A(f), r || this.popups.reposition(e);
	}
};
function Bv(e) {
	return e.classList.contains(Wg);
}
function Vv(e) {
	return e.querySelector(`.${Bv(e) ? jv : kv}`);
}
function Hv(e, t) {
	let n = j_(e), r = n.markedOnly ? H_(t, h_(e)) : null;
	return r !== null && !n.marked.has(U_(r, "date"));
}
function Uv(e, t) {
	let n = __(e), r = R("div", `${I}__time`), i = R("div", `${I}__time-columns`);
	for (let r of Wv(n)) i.append(qv(e, r, Gv(n, r), t));
	return r.append(i), r;
}
function Wv(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function Gv(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Kv(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function qv(e, t, n, r) {
	let i = R("div", Mv);
	i.setAttribute(Iv, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", C.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = Kv(r, t), s = t === "hour" && S_(g_(e)), c = y_(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = R("button", z);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? C_(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(Lv, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${z}--selected`), uy(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function Jv(e) {
	let t = e.querySelector(`.${I}__calendar`), n = e.querySelector(`.${I}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Yv(e) {
	for (let t of e.querySelectorAll(`.${Mv}`)) {
		let e = t.querySelector(`.${z}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, Xv(t, e), t.setAttribute(Rv, String(t.scrollTop));
	}
}
function Xv(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function Zv(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${z}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Qv(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(z) ? null : t.closest(`.${Mv}`)?.getAttribute(Iv) ?? null;
}
function $v(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute($_) : null;
}
function ey(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${Mv}[${Iv}="${t}"]`)?.querySelector(`.${z}--selected`) ?? null;
	n !== null && A(n);
}
function ty(e) {
	let t = R("div", `${I}__popup-footer`);
	return t.append(Sv("now", C.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Sv("clear", C.text("ui.picker.clear"))), t.append(Sv("done", C.text("ui.picker.done"))), t;
}
function ny() {
	return {
		year: ry("ui.picker.letter.year", ai.year),
		month: ry("ui.picker.letter.month", ai.month),
		day: ry("ui.picker.letter.day", ai.day),
		hour: ry("ui.picker.letter.hour", ai.hour),
		minute: ry("ui.picker.letter.minute", ai.minute),
		second: ry("ui.picker.letter.second", ai.second)
	};
}
function ry(e, t) {
	let n = C.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function iy(e, t) {
	for (let n of e.querySelectorAll(`.${Ov}`)) if (D_(n) === t) return n;
	return e.querySelector(`.${Ov}`);
}
function ay(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(z) && Uo(e);
}
function oy(e) {
	let t = e.target, n = t.closest(`.${Mv}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? cy(n, e.key === "ArrowRight" ? 1 : -1) : sy(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), ly(r));
}
function sy(e, t, n) {
	return La({
		key: n,
		items: [...e.querySelectorAll(`.${z}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function cy(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${Mv}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${z}--selected`) ?? r.querySelector(`.${z}:not(:disabled)`);
}
function ly(e) {
	let t = e.closest(`.${Mv}`);
	t !== null && Xv(t, e);
}
function uy(e, t, n, r) {
	let i = A_(e, $g), a = A_(e, e_);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var dy = "[data-ui-theme-switcher]", fy = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(dy) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: er.SetTheme,
				mode: py() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function py() {
	let e = document.documentElement.getAttribute(gn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var my = `[${yn}]`, hy = "ui-language-switcher__trigger", gy = "ui-language-switcher__label-text", _y = "ui-language-switcher__label-text--current", vy = "ui-language-switcher__label-text--page", yy = "ui-language-switcher__menu", by = "ui-language-switcher__choice", xy = "ui-language-switcher--open", Sy = 4, Cy = "ui.language.switch", wy = "ui.language.current", Ty = class {
	options;
	root;
	menus = new el({
		show: ({ owner: e }) => e.classList.add(xy),
		hide: ({ owner: e }) => e.classList.remove(xy),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), C.onChange(() => this.showLanguage(C.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${by}`), n = e.target.closest(my);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(bn));
			return;
		}
		let r = e.target.closest(`.${hy}`);
		if (r === null || w(r)) return;
		e.preventDefault();
		let i = Ey(n);
		if (i.length === 2) {
			let e = C.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(my);
		if (t === null) return;
		let n = Ey(t), r = e.target.closest(`.${hy}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !Ra(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = La({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${by}`);
		if (t === null || t === document.activeElement || w(t)) return;
		let n = t.closest(my);
		n !== null && this.menus.isOpen(n) && Uo(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${yy}`);
		if (r === null) return;
		let i = Ey(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Sy
			},
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && ts(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: er.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(my)) {
			let n = t.querySelector(`:scope > .${hy}`);
			if (n === null) continue;
			let r = Ey(t);
			for (let t of r) t.setAttribute("aria-checked", t.getAttribute("data-ui-language") === e ? "true" : "false");
			for (let t of n.querySelectorAll(`.${gy}`)) {
				let n = t.getAttribute(bn) === e;
				t.classList.toggle(_y, n), t.classList.contains(vy) && t.toggleAttribute("hidden", !n);
			}
			if (r.length === 2) {
				let t = (r.find((t) => t.getAttribute("data-ui-language") !== e) ?? r[0]).getAttribute("data-ui-language") ?? "";
				C.write(n, "aria-label", Cy, {
					language: Dy(r, e),
					code: Oy(e),
					other: Dy(r, t),
					otherCode: Oy(t)
				});
			} else C.write(n, "aria-label", wy, {
				language: Dy(r, e),
				code: Oy(e)
			});
		}
	}
};
function Ey(e) {
	return [...e.querySelectorAll(`:scope > .${yy} > .${by}`)];
}
function Dy(e, t) {
	let n = e.find((e) => e.getAttribute(bn) === t)?.textContent;
	if (n != null && n.length > 0) return n;
	try {
		let e = new Intl.DisplayNames([t], { type: "language" }).of(t) ?? t;
		return e.charAt(0).toLocaleUpperCase(t) + e.slice(1);
	} catch {
		return Oy(t);
	}
}
function Oy(e) {
	return e.split("-")[0].toUpperCase();
}
//#endregion
//#region src/rendering/inline-markup.ts
var ky = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Ay = "\\", jy = "`", My = "!", Ny = "{", Py = "}", Fy = "ui-text__fold", Iy = "ui-text__fold-toggle", Ly = "ui-text__fold-content", Ry = 8;
function zy(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return Zy(new ob(e), 0, e.length, ky.None, null, t, n), Qy(t, n, ky.None, null), t;
}
function By(e) {
	return zy(e).map((e) => Gy(e) ? `${e.fold} ${By(e.text)}` : e.text).join("");
}
function Vy(e) {
	let t = "";
	for (let n of e) t += lb(n) ? Ay + n : n;
	return t;
}
function Hy(e, t, n = {}) {
	let r = zy(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && Uy(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(Ky(r, n));
}
function Uy(e) {
	return e.styles === ky.None && e.url === null && !Wy(e) && !Gy(e);
}
function Wy(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function Gy(e) {
	return e.fold !== null && e.fold !== void 0;
}
function Ky(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(qy(r, t));
	return n;
}
function qy(e, t) {
	if (Wy(e)) return Yy(e.icon);
	let n = Gy(e) ? Jy(e, t) : document.createTextNode(e.text);
	if ((e.styles & ky.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & ky.Strikethrough) !== 0 && (n = Xy("s", n)), (e.styles & ky.Underline) !== 0 && (n = Xy("u", n)), (e.styles & ky.Italic) !== 0 && (n = Xy("em", n)), (e.styles & ky.Bold) !== 0 && (n = Xy("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", Du(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function Jy(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Fy} ${Fy}--static` : Fy, r.className = Iy, r.textContent = e.fold ?? "", i.className = Ly, i.append(Ky(zy(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(ze, ""), n.append(r, i), n);
}
function Yy(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", Hu(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function Xy(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function Zy(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Ay && c + 1 < n && lb(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = $y(e, c, n);
		if (l !== null) {
			Qy(a, o, r, i), eb(s, c + 1, l, o), Qy(a, o, r | ky.Code, i), c = l + 1;
			continue;
		}
		let u = rb(e, c, n);
		if (u !== null) {
			Qy(a, o, r, i), Zy(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), Qy(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = tb(e, c, n);
		if (d !== null) {
			Qy(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? ib(e, c, n) : null;
		if (f !== null) {
			Qy(a, o, r, i), Zy(e, f.labelStart, f.labelEnd, r, f.url, a, o), Qy(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = ab(e, c, n);
		if (p !== null) {
			Qy(a, o, r, i), a.push({
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
function Qy(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function $y(e, t, n) {
	let r = e.text;
	if (r[t] !== jy) return null;
	let i = t + 1;
	if (i >= n || ub(r[i])) return null;
	let a = e.findClosingMarker(i, n, jy, 1);
	return a > i ? a : null;
}
function eb(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === Ay && i + 1 < n && lb(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function tb(e, t, n) {
	let r = e.text;
	if (r[t] !== My || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return nb(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function nb(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function rb(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = ky.Bold, s = 2;
	else if (i === "*") o = ky.Italic, s = 1;
	else if (i === "_" && a) o = ky.Underline, s = 2;
	else if (i === "~" && a) o = ky.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || ub(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function ib(e, t, n) {
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
function ab(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Ny || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Ry) return null;
	let c = { value: "" };
	return eb(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var ob = class {
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
		return this.closeBrackets ??= this.next("]", !0), sb(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), sb(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), sb(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return sb(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = cb(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !ub(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = wu(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Ay && e[t - 1] === 0);
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
			if (this.text[r] === Ny) n.push(r);
			else if (this.text[r] === Py && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || ub(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function sb(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function cb(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function lb(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Ny || e === Py || e === jy || e === Ay;
}
function ub(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/action-bar.ts
var db = `${De}__button`, fb = `${De}__more`, pb = "ui-button ui-button--ghost ui-button--small", mb = `.${_}:not(${Mt})`, hb = "ui-text__icon", gb = `.ui-button__content .${hb}`, _b = ".ui-button__content .ui-text__title", vb = "data-ui-icon", yb = "--ui-icon-url", bb = /* @__PURE__ */ new WeakMap();
function xb(e) {
	let t = [], n = !1;
	for (let r of e.querySelectorAll(mb)) Sb(r, e) && (r.hasAttribute("data-ui-in-action-bar") && !r.matches(Nt) ? t.push(r) : n = !0);
	return {
		entries: t,
		more: n
	};
}
function Sb(e, t) {
	for (let n = e; n !== null && n !== t; n = n.parentElement) if (!n.hasAttribute("data-ui-menu-left-out") && getComputedStyle(n).display === "none") return !1;
	return getComputedStyle(e).visibility !== "hidden";
}
function Cb(e, t) {
	let n = t.entries.map((e) => wb(e, t));
	return t.more && t.openMore !== void 0 && n.push(Eb(t.openMore)), e.replaceChildren(...n), n;
}
function wb(e, t) {
	let n = Db(db), r = kb(e), i = Tb(e);
	return i === null ? n.textContent = r : (n.append(i), n.setAttribute("aria-label", r)), t.role === "menuitem" && n.setAttribute("role", "menuitem"), w(e) && (n.classList.add(Fn), n.setAttribute("aria-disabled", "true")), e.getAttribute("data-ui-menu-item-kind") === "check" && n.setAttribute("aria-pressed", e.getAttribute("aria-checked") === "true" ? "true" : "false"), bb.set(n, e), n.addEventListener("click", () => t.press(e, n)), n;
}
function Tb(e) {
	let t = e.querySelector(gb);
	if (t === null || !t.className.split(" ").some(Wu)) return null;
	let n = document.createElement("span");
	n.className = t.className, n.classList.remove(hb), n.setAttribute(vb, ""), n.setAttribute("aria-hidden", "true");
	let r = t.style.getPropertyValue(yb);
	return r.length > 0 && n.style.setProperty(yb, r), n;
}
function Eb(e) {
	let t = Db(`${db} ${fb}`);
	return t.setAttribute("aria-haspopup", "menu"), C.write(t, "aria-label", "ui.actionbar.more"), t.addEventListener("click", () => e(t)), t;
}
function Db(e) {
	let t = document.createElement("button");
	return t.setAttribute("type", "button"), t.className = `${e} ${pb}`, t.tabIndex = -1, t;
}
function Ob(e) {
	return bb.get(e) ?? null;
}
function kb(e) {
	return e.querySelector(_b)?.textContent?.trim() ?? "";
}
var Ab = {
	anchor: (e) => e.closest(`.${db}`),
	words: (e) => {
		let t = Ob(e), n = t === null ? C.text("ui.actionbar.more") : kb(t);
		return n.length === 0 ? null : Vy(n);
	}
}, jb = 500, Mb = 10, Nb = /* @__PURE__ */ new WeakSet();
function Pb(e) {
	return Nb.has(e);
}
var Fb = class {
	opensMenu;
	press = null;
	answered = null;
	constructor(e) {
		this.opensMenu = e.opensMenu, e.root.addEventListener("pointerdown", (e) => this.handleDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handleMove(e), !0), e.root.addEventListener("pointerup", () => this.cancel(), !0), e.root.addEventListener("pointercancel", () => this.cancel(), !0), e.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), (e.first ?? e.root).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleDown(e) {
		let t = e;
		if (this.answered = null, this.press !== null) {
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
			timer: setTimeout(() => this.fire(), jb)
		};
	}
	handleMove(e) {
		let t = e, n = this.press;
		n !== null && t.pointerId === n.pointerId && Math.hypot((t.clientX ?? n.x) - n.x, (t.clientY ?? n.y) - n.y) > Mb && this.cancel();
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
		Nb.add(t), e.target.dispatchEvent(t), this.answered = t.defaultPrevented ? e.target : null;
	}
	handleContextMenu(e) {
		if (!Nb.has(e)) {
			if (this.answered !== null) {
				e.preventDefault(), e.stopImmediatePropagation();
				return;
			}
			this.cancel();
		}
	}
	handleClick(e) {
		let t = this.answered, n = e.target instanceof Element ? e.target : null;
		t === null || n === null || !t.contains(n) || n.closest("[data-ui-context-menu]") !== null || (this.answered = null, e.preventDefault(), e.stopImmediatePropagation());
	}
}, Ib = "data-ui-context-menu-owner", Lb = xe, Rb = "ui-context-menu--open", zb = "ui-menu", Bb = `.ui-menu-item:not(${Mt})`, Vb = `${De}--strip`, Hb = `.${De}:not(.${Vb}) > .${fb}`, Ub = {
	placement: "bottom-start",
	gap: 4
}, Wb = "input, textarea, select, [contenteditable=''], [contenteditable='true']", Gb = "ui-context-menu-opening", Kb = Pt, qb = class {
	root;
	closed = null;
	menus = new el({
		show: ({ popup: e }) => e.classList.add(Rb),
		hide: ({ popup: e }, t) => {
			e.classList.remove(Rb), this.closed = e, t === "outside" && ix();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, new Fb({
			root: this.root,
			first: typeof window > "u" ? void 0 : window,
			opensMenu: (e) => e.closest(`[${Ib}]`) !== null && e.closest(Wb) === null
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
		let n = t.closest(`[${me}]`);
		for (let r = t.closest(`[${Ib}]`); r !== null; r = r.parentElement?.closest(`[${Ib}]`) ?? null) {
			if (n !== null && r.contains(n)) return;
			let i = Jb(r, t);
			if (i.length === 0 || w(r)) continue;
			if (ox(r)) return;
			let a = i.find((e) => Yb(e, t, !1));
			if (a !== void 0) {
				e.preventDefault(), this.open(r, a, e.clientX, e.clientY, Zb(e) ? t : null, t.closest(Hb));
				return;
			}
		}
	}
	open(e, t, n, r, i, a) {
		this.menus.close(), t.querySelector(`:scope > .${Vb}`)?.remove(), Qb(t), i !== null && $b(e, t, i), a?.closest("[data-ui-action-bar]")?.hasAttribute("data-ui-action-bar-rest") === !0 && tx(t), this.closed !== null && (Gs(this.closed), this.closed = null);
		let o = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? zo(), s = a === null ? {} : {
			anchor: a,
			placement: Ub
		};
		if (this.menus.open({
			owner: e,
			popup: t,
			...s,
			returnFocus: () => (o === null ? null : ns(o)) ?? ns(e)
		})) {
			if (a === null) {
				let e = t.getBoundingClientRect();
				t.style.left = `${Ac(n, e.width, window.innerWidth)}px`, t.style.top = `${Ac(r, e.height, window.innerHeight)}px`;
			}
			rx(t);
		}
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(Kb) !== null || this.menus.close();
	}
};
function Jb(e, t) {
	let n = t.closest(`[${Se}]`), r = n !== null && e.contains(n) ? n.getAttribute("data-ui-context-menu-use") ?? "" : "";
	return [r.length > 0 ? ax(e, r) : null, ax(e, "")].filter((e) => e !== null);
}
function Yb(e, t, n) {
	let r = new CustomEvent(Gb, {
		bubbles: !0,
		cancelable: !0,
		detail: {
			target: t,
			actionBar: n
		}
	});
	return e.dispatchEvent(r);
}
function Xb(e, t) {
	let n = e.closest(`[${Ib}]`), r = e.closest(`[${me}]`);
	return n === null || w(n) || ox(n) || r !== null && n.contains(r) ? null : Jb(n, e).find((n) => Yb(n, e, t)) ?? null;
}
function Zb(e) {
	let t = e.pointerType;
	return Pb(e) ? !0 : typeof t == "string" && t.length > 0 ? t === "touch" : Vo();
}
function Qb(e) {
	for (let t of e.querySelectorAll(`[${Ee}]`)) t.removeAttribute(Ee);
}
function $b(e, t, n) {
	let r = n.closest(`[${Ce}]`);
	if (r === null || n.closest(".ui-action-bar") !== null || !e.contains(r) || !Jb(e, r).includes(t)) return;
	let { entries: i } = xb(t);
	if (i.length === 0) return;
	let a = document.createElement("div");
	a.className = `${De} ${Vb}`, a.setAttribute("role", "group"), Cb(a, {
		entries: i,
		more: !1,
		role: "menuitem",
		press: ex
	}), t.insertBefore(a, t.firstElementChild);
}
function ex(e) {
	w(e) || e.click();
}
function tx(e) {
	let { entries: t } = xb(e), n = e.querySelector(`.${zb}`);
	if (t.length === 0 || n === null) return;
	for (let e of t) nx(e);
	let r = P(n, `.${_}`, `.${zb}`).filter((t) => t.closest("[data-ui-menu-left-out]") === null && Sb(t, e)), i = [];
	for (let [e, t] of r.entries()) {
		let n = r[e + 1];
		t.getAttribute("data-ui-menu-item-kind") === "header" && (n === void 0 || n.matches(Mt)) ? nx(t) : i.push(t);
	}
	let a = !1, o = null;
	for (let e of i) {
		let t = e.getAttribute(kt);
		t === "separator" ? !a || o !== null ? nx(e) : o = e : t !== "header" && (a = !0, o = null);
	}
	o !== null && nx(o);
}
function nx(e) {
	let t = e.parentElement;
	(t !== null && t.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t : e).setAttribute(Ee, "");
}
function rx(e) {
	let t = e.querySelector(`.${zb}`);
	t !== null && ts(e, P(t, Bb, `.${zb}`));
}
function ix() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${Oo}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function ax(e, t) {
	for (let n of e.querySelectorAll(`[${Lb}]`)) if ((n.getAttribute(Lb) ?? "") === t && n.closest(`[${Ib}]`) === e) return n;
	return null;
}
function ox(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${h}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/element-visibility.ts
function sx(e) {
	return getComputedStyle(e).display !== "none";
}
function cx(e) {
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
				if (e.overflowX !== "visible" && dx(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && dx(n, a, a + t.clientHeight, !1), fx(n)) return !0;
			}
			r = e.position;
		}
	}
	return dx(n, 0, window.innerWidth, !0), dx(n, 0, window.innerHeight, !1), fx(n);
}
function lx(e) {
	let t = getComputedStyle(e).position;
	for (let n = e.parentElement; n !== null && t !== "fixed"; n = n.parentElement) {
		let e = getComputedStyle(n);
		if (t !== "absolute" || e.position !== "static" || e.transform !== "none") {
			if (ux(e.overflowX) || ux(e.overflowY)) return n;
			t = e.position;
		}
	}
	return null;
}
function ux(e) {
	return e === "hidden" || e === "auto" || e === "scroll";
}
function dx(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function fx(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var px = "ui-tooltip", mx = "ui-tooltip", hx = "ui-tooltip--visible", gx = "[aria-haspopup][aria-expanded=\"true\"]", _x = "top", vx = 250, yx = 200, bx = 300, xx = 7, B = null, V = null, Sx = null, Cx = null, wx = null, Tx = 0, Ex = null, Dx = 0, Ox = 0, kx = !1, Ax = /* @__PURE__ */ new Set();
function jx(e) {
	Ax.add(e);
}
function Mx(e = document) {
	if (kx) return;
	kx = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", Nx, !0), t.addEventListener("pointerout", Ix, !0), t.addEventListener("focusin", Lx, !0), t.addEventListener("focusout", Rx, !0), t.addEventListener("keydown", zx, !0), t.addEventListener("scroll", Fx, !0), t.addEventListener("pointerdown", Bx, !0), t.addEventListener("click", Vx, !0), window.addEventListener("blur", () => {
		Cx = null, oS(!0);
	});
}
function Nx(e) {
	if (Px(), Hx(e.target)) {
		window.clearTimeout(Dx);
		return;
	}
	let t = Ux(e.target);
	t !== null && t !== V && qx(t);
}
function Px() {
	V === null || V.isConnected || (Cx = null, oS(!0));
}
function Fx(e) {
	if (Px(), V === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(V) || cx(V) && (Cx = null, oS(!0));
}
function Ix(e) {
	if (Cx !== null || wx !== null) return;
	let t = e.relatedTarget, n = V ?? Ex?.target ?? null;
	t instanceof Node && (n !== null && n.contains(t) || Hx(t)) || (Hx(e.target) || n !== null && e.target instanceof Node && n.contains(e.target)) && oS(!1);
}
function Lx(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = Ux(e.target);
	t !== null && (Cx = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, Jx(t));
}
function Rx(e) {
	Ux(e.target) === V && (Cx = null, oS(!0));
}
function zx(e) {
	e.key === "Escape" && V !== null && (Cx = null, oS(!0));
}
function Bx(e) {
	if (Hx(e.target)) return;
	let t = Ux(e.target);
	if (t !== null && t.hasAttribute("data-ui-tooltip-press")) {
		if (wx === t) {
			oS(!0);
			return;
		}
		Cx = null, oS(!0), Jx(t), wx = V;
		return;
	}
	Cx === null && oS(!0);
}
function Vx(e) {
	Ux(e.target)?.hasAttribute("data-ui-tooltip-press") === !0 && e.preventDefault();
}
function Hx(e) {
	return B !== null && e instanceof Node && B.contains(e);
}
function Ux(e) {
	if (!(e instanceof Element)) return null;
	let t = Wx(e);
	for (let n of Ax) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && Kx(r).length > 0) return r;
	}
	return t;
}
function Wx(e) {
	let t = e.closest(`[${ke}], [${je}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector(`[${ke}]`);
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function Gx(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t : Kx(e);
}
function Kx(e) {
	for (let t of Ax) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function qx(e, t) {
	if (Cx === null && wx === null) {
		if (window.clearTimeout(Dx), Ex !== null && Ex.target === e) {
			Ex.words = t;
			return;
		}
		if (window.clearTimeout(Tx), Ex = null, V !== null) {
			oS(!0), Jx(e, t);
			return;
		}
		if (Date.now() - Ox < bx) {
			Jx(e, t);
			return;
		}
		Ex = {
			target: e,
			words: t
		}, Tx = window.setTimeout(() => {
			let e = Ex;
			Ex = null, e !== null && Jx(e.target, e.words);
		}, vx);
	}
}
function Jx(e, t) {
	let n = (t ?? Gx(e)).trim();
	if (n.length === 0 || !e.isConnected || Yx(e) || cx(e)) return;
	window.clearTimeout(Tx), window.clearTimeout(Dx), Ex = null;
	let r = sS();
	Hy(r, n, { staticFolds: !0 }), r.classList.add(hx), V = e, Zx(Xx(e)), r.setAttribute("data-ui-tooltip-text", By(n)), rc(e, r), ic(e, r, {
		placement: aS(e),
		gap: xx,
		arrow: !0
	});
}
function Yx(e) {
	return e.matches(gx) || e.querySelector(gx) !== null || e.querySelector(":scope > .ui-action-bar") !== null;
}
function Xx(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function Zx(e) {
	Sx !== null && Sx !== e && Qx();
	let t = $x(e);
	t.includes(mx) || e.setAttribute("aria-describedby", [...t, mx].join(" ")), Sx = e;
}
function Qx() {
	if (Sx === null) return;
	let e = $x(Sx).filter((e) => e !== mx);
	e.length === 0 ? Sx.removeAttribute("aria-describedby") : Sx.setAttribute("aria-describedby", e.join(" ")), Sx = null;
}
function $x(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function eS(e, t, n) {
	n?.delay === !0 && V !== e ? qx(e, t) : Jx(e, t);
}
function tS() {
	oS(!0);
}
var nS = {
	show: eS,
	hide: tS
};
function rS(e) {
	Cx = e, Jx(e);
}
function iS(e) {
	if (V === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			Cx = null, oS(!0);
			return;
		}
		Jx(e);
	}
}
function aS(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of Ax) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Ae);
	return t !== null && qs(t) ? t : _x;
}
function oS(e) {
	window.clearTimeout(Tx), window.clearTimeout(Dx), Ex = null;
	let t = () => {
		V !== null && (Qx(), V = null, wx = null, B !== null && (B.classList.remove(hx), dc(B)), Ox = Date.now());
	};
	e ? t() : Dx = window.setTimeout(t, yx);
}
function sS() {
	return B !== null && B.isConnected ? B : (B = document.createElement("div"), B.id = mx, B.className = px, B.setAttribute("role", "tooltip"), B.setAttribute("aria-hidden", "true"), document.body.append(B), B);
}
//#endregion
//#region src/interactions/action-bar-engine.ts
var cS = `[${Ce}]`, lS = `.${De}`, uS = `${De}--out`, dS = 6, fS = "--ui-action-bar-gap", pS = [
	"class",
	"style",
	"hidden",
	"aria-disabled",
	"aria-checked",
	"data-ui-in-action-bar",
	"data-ui-visibility",
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], mS = class {
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
		}), this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e)), this.root.addEventListener("dragstart", () => this.choose(null)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("scroll", () => this.markOut(), !0), jx(Ab);
	}
	handlePointerDown(e) {
		let t = e, n = e.target instanceof Element ? e.target : null;
		if (n === null || n.closest(`${lS}, [data-ui-context-menu]`) !== null) return;
		let r = hS(n);
		if (t.pointerType === "touch") {
			this.pendingTap = {
				pointerId: t.pointerId ?? 0,
				host: r,
				identity: r === null ? null : vS(r)
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
			let e = t.host !== null && !t.host.isConnected && t.identity !== null ? yS(t.identity) : t.host;
			e !== null && e === this.chosen ? this.askAgain(e) : this.choose(e);
		}
		this.chosen !== null && this.chosen.isConnected && !this.shown.has(this.chosen) && this.sync();
	}
	handleContextMenu(e) {
		this.pendingTap = null, e instanceof MouseEvent && e.target instanceof Element && e.target.closest(lS) === null && Zb(e) && this.choose(null);
	}
	handleFocusIn(e) {
		let t = e.target instanceof HTMLElement ? e.target : null;
		if (t === null) return;
		let n = t.closest(lS);
		if (n !== null) {
			this.isHostedBar(n) && D(DS(n), t);
			return;
		}
		Bo() || this.isInOpenMenu(t) || this.menuHost !== null && t.contains(this.menuHost) || this.choose(gS(t));
	}
	handleFocusOut(e) {
		let t = e.relatedTarget, n = t instanceof Element ? t.closest(lS) : null;
		n !== null && this.isHostedBar(n) && e.target instanceof HTMLElement && !n.contains(e.target) && (this.cameFrom = e.target);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || !(e.target instanceof HTMLElement)) return;
		let t = e.target;
		if (e.defaultPrevented) {
			t.matches(".ui-items-view, .ui-table, .ui-tree") && this.choose(gS(t));
			return;
		}
		let n = t.closest(lS);
		if (n !== null && t.classList.contains(db)) {
			this.handleBarKey(e, n, t);
			return;
		}
		if (e.key === "Escape") {
			let e = t.closest("dialog[open]");
			(e === null || this.chosen !== null && e.contains(this.chosen)) && this.choose(null);
			return;
		}
		if (e.key === "Tab" && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && t.matches(".ui-items-view, .ui-table, .ui-tree")) {
			let n = this.chosen === null ? null : this.tabStopOf(this.chosen);
			n !== null && t.contains(n) && (e.preventDefault(), n.focus());
			return;
		}
		t.matches(".ui-items-view, .ui-table, .ui-tree") && this.choose(gS(t));
	}
	handleBarKey(e, t, n) {
		if (e.ctrlKey || e.altKey || e.metaKey) return;
		if (e.key === "Escape") {
			if (!this.isHostedBar(t)) return;
			let n = this.hostOfBar(t), r = this.cameFrom !== null && this.cameFrom.isConnected && n !== null && (n.contains(this.cameFrom) || this.cameFrom.contains(n)) ? this.cameFrom : ns(n);
			e.preventDefault(), r?.focus();
			return;
		}
		let r = DS(t), i = La({
			key: e.key,
			items: r,
			current: n,
			axis: "horizontal"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	choose(e) {
		(e === null ? this.chosen === null && this.identity === null : e === this.chosen) || (this.chosen = e, this.identity = e === null ? null : vS(e), this.watchScope(), this.sync(), e !== null && this.makeRoomAbove(e));
	}
	makeRoomAbove(e) {
		let t = this.shown.get(e), n = lx(e);
		if (t === void 0 || n === null || !bS(n)) return;
		let r = Math.max(0, n.getBoundingClientRect().top + n.clientTop), i = Math.ceil(t.bar.getBoundingClientRect().height + SS(e) - (e.getBoundingClientRect().top - r));
		i <= 0 || i > n.scrollTop || (n.scrollTop -= i, uc(t.bar), this.markOut());
	}
	askAgain(e) {
		let t = this.shown.get(e);
		if (t === void 0) {
			this.sync();
			return;
		}
		Xb(e, !0) === null && this.hide(e, t);
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
				this.chosen = yS(e), this.sync();
			}
			for (let e of this.shown.values()) uc(e.bar);
			this.markOut();
		}
	}
	sync() {
		for (let [e, t] of this.shown) (e !== this.chosen && e !== this.menuHost || !e.isConnected) && this.hide(e, t);
		for (let e of [this.chosen, this.menuHost]) e !== null && e.isConnected && !this.shown.has(e) && this.show(e);
	}
	show(e) {
		let t = Xb(e, !0);
		if (t === null) return;
		let n = document.createElement("div");
		if (n.className = De, n.setAttribute("role", "toolbar"), C.write(n, "aria-label", "ui.actionbar.label"), n.setAttribute(ze, ""), n.setAttribute(ge, ""), !CS(n, t, (t) => this.openMore(e, t), !1)) return;
		e.insertBefore(n, ES(e)), ic(e, n, {
			placement: xS(e),
			gap: SS(e),
			boundary: lx(e) ?? void 0
		}), n.classList.toggle(uS, cx(e));
		let r = new MutationObserver(() => this.redraw(e));
		r.observe(t, {
			subtree: !0,
			childList: !0,
			characterData: !0,
			attributes: !0,
			attributeFilter: pS
		}), this.shown.set(e, {
			bar: n,
			menu: t,
			observer: r
		});
	}
	redraw(e) {
		let t = this.shown.get(e);
		if (t === void 0) return;
		let n = document.activeElement, r = n instanceof HTMLElement && t.bar.contains(n) ? n : null, i = r === null ? null : Ob(r);
		if (!CS(t.bar, t.menu, (t) => this.openMore(e, t), e === this.menuHost)) {
			this.hide(e, t);
			return;
		}
		if (r === null) return;
		let a = DS(t.bar), o = a.find((e) => Ob(e) === i) ?? a.find(Ba) ?? null;
		o !== null && (D(a, o), o.focus());
	}
	openMore(e, t) {
		let n = this.shown.get(e);
		if (n === void 0) return;
		if (this.menuHost = e, kS(t), !n.menu.classList.contains("ui-context-menu--open")) {
			this.menuHost = null;
			return;
		}
		wS(n.bar, !0);
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
		wS(t.bar, !1);
		let n = document.activeElement;
		!Bo() && (n === null || n === document.body || e.contains(n) || n.contains(e)) && TS(t.bar)?.focus();
	}
	hide(e, t) {
		t.observer.disconnect(), dc(t.bar), t.bar.remove(), this.shown.delete(e);
	}
	markOut() {
		for (let [e, t] of this.shown) t.bar.classList.toggle(uS, cx(e));
	}
	isInOpenMenu(e) {
		for (let t of this.shown.values()) if (t.menu.classList.contains("ui-context-menu--open") && t.menu.contains(e)) return !0;
		return !1;
	}
	tabStopOf(e) {
		let t = this.shown.get(e);
		return t === void 0 ? null : DS(t.bar).find((e) => e.tabIndex === 0) ?? null;
	}
	isHostedBar(e) {
		return this.hostOfBar(e) !== null;
	}
	hostOfBar(e) {
		for (let [t, n] of this.shown) if (n.bar === e) return t;
		return null;
	}
};
function hS(e) {
	let t = e.closest(cS);
	if (t !== null) return t;
	let n = e.closest(`[${h}]`), r = e.closest(v);
	return n === null || r !== null && !r.contains(n) ? null : _S(n)[0] ?? null;
}
function gS(e) {
	if (e.matches(".ui-items-view, .ui-table, .ui-tree")) for (let t of e.querySelectorAll(`[${Oe}]`)) {
		if (t.closest(".ui-items-view, .ui-table, .ui-tree") !== e) continue;
		let n = _S(t)[0];
		if (n !== void 0) return n;
	}
	return e.closest(cS);
}
function _S(e) {
	let t = [...e.querySelectorAll(cS)];
	return e.matches(cS) ? [e, ...t] : t;
}
function vS(e) {
	let t = e.getAttribute(we);
	if (t !== null && e.parentElement !== null) return {
		scope: e.parentElement,
		attribute: we,
		key: t,
		index: 0
	};
	let n = e.closest(`[${h}]`), r = n?.getAttribute("data-ui-key") ?? null;
	return n === null || r === null || n.parentElement === null ? null : {
		scope: n.parentElement,
		attribute: h,
		key: r,
		index: _S(n).indexOf(e)
	};
}
function yS(e) {
	for (let t of e.scope.children) if (t.getAttribute(e.attribute) === e.key) return _S(t)[e.index] ?? null;
	return null;
}
function bS(e) {
	let t = getComputedStyle(e).overflowY;
	return t === "auto" || t === "scroll";
}
function xS(e) {
	let t = e.getAttribute(Ce);
	if (t === "center") return "top";
	let n = getComputedStyle(e).direction === "rtl";
	return t === "start" === n ? "top-end" : "top-start";
}
function SS(e) {
	let t = Number.parseFloat(getComputedStyle(e).getPropertyValue(fS));
	return Number.isFinite(t) ? t : dS;
}
function CS(e, t, n, r) {
	let { entries: i, more: a } = xb(t);
	if (i.length === 0 && !a) return !1;
	let o = Cb(e, {
		entries: i,
		more: a,
		role: "button",
		press: OS,
		openMore: n
	});
	return D(o, o.find((e) => !w(e)) ?? o[0] ?? null), wS(e, r), !0;
}
function wS(e, t) {
	TS(e)?.setAttribute("aria-expanded", t ? "true" : "false");
}
function TS(e) {
	return DS(e).find((e) => Ob(e) === null) ?? null;
}
function ES(e) {
	for (let t of e.children) if (t.hasAttribute("data-ui-context-menu")) return t;
	return null;
}
function DS(e) {
	return [...e.querySelectorAll(`:scope > .${db}`)];
}
function OS(e, t) {
	if (w(t)) return;
	let n = Xb(t, !1);
	n === null || !n.contains(e) || w(e) || !Sb(e, n) || e.click();
}
function kS(e) {
	let t = e.getBoundingClientRect();
	e.dispatchEvent(new MouseEvent("contextmenu", {
		bubbles: !0,
		cancelable: !0,
		button: 2,
		clientX: t.left,
		clientY: t.bottom
	}));
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function AS(e) {
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
		default: o = IS(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function jS(e, t, n = NS()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var MS = null;
function NS() {
	return MS === null && (MS = PS()), MS;
}
function PS() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function FS(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function IS(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : LS[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : LS[t] ?? null;
}
var LS = {
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
}, RS = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], zS = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function BS(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${zS[t]}px)`)) return t;
	return "base";
}
function VS(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function H(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function HS(e, t) {
	let n;
	for (let r of RS) {
		let i = H(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/state/client-store.ts
var US = "ne.ui", WS = "boot", GS = /* @__PURE__ */ new Set(), KS = class {
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
		let r = this.resolveKey(e, WS);
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
		let n = e.getAttribute(Pe);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return GS.has(n) || (GS.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${US}:${n}:${t}`;
	}
}, qS = "ui-menu", JS = "ui-menu--nested", YS = "ui-menu-item--selected", XS = "ui-menu__submenu", ZS = bt, QS = St, $S = "data-ui-menu-flyout", eC = "data-ui-menu-unfolded", tC = xt, nC = "menu-open-group", rC = Re("click"), iC = class {
	root;
	store = new KS();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new el({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(QS, ""), t.setAttribute($S, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(QS), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute($S);
			}, j.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${qS}`)), M(this.root, `.${qS}`, {
			childList: !0,
			attributeFilter: [yt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${ZS}]`)) aC(e);
		M(this.root, `[${ZS}]`, {
			childList: !0,
			attributeFilter: [QS]
		}, (e) => {
			for (let t of e) aC(t);
		}), typeof matchMedia == "function" && matchMedia(`(min-width: ${zS.md}px)`).addEventListener("change", () => this.closeBarFlyout());
	}
	closeBarFlyout() {
		let e = this.flyouts.current;
		e !== null && e.closest("[data-ui-bottom-bar]") !== null && this.flyouts.close(e);
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = lC(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), oC(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${ZS}]`)) aC(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${YS}`), e);
		if (t !== null && !t.hasAttribute(tC)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(JS) ? null : this.store.read(e, nC), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${qS}`);
		a !== null && (lC(a) || i.hasAttribute(tC) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(JS);
		if (e.setAttribute(eC, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(QS);
			return;
		}
		if (t.hasAttribute(QS)) {
			t.removeAttribute(QS), n || this.store.write(e, nC, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, nC, t.getAttribute(h));
	}
	openInline(e) {
		e.setAttribute(QS, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${ZS}][${QS}]`)) t.hasAttribute(tC) || t.removeAttribute(QS);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i || (oC(e), this.closeGroups(e), !this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${sC(e)}-start`,
				gap: 4
			}
		}))) return;
		let a = r.querySelector(`:scope > .${qS}`);
		a !== null && !Bo() && ts(a, P(a, `.${_}:not(${Mt})`, `.${qS}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${ZS}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Nt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${ZS}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${XS}`);
	}
};
function aC(e) {
	let t = e.querySelector(`:scope > .${_}`), n = e.closest(`.${qS}`);
	t !== null && (t.setAttribute(rC, ""), t.setAttribute(ze, ""), t.setAttribute("aria-expanded", e.hasAttribute(QS) ? "true" : "false"), e.hasAttribute(tC) || n !== null && lC(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function oC(e) {
	for (let t of e.querySelectorAll(`[${$S}]`)) t.removeAttribute($S);
}
function sC(e) {
	return cC(e) ? "top" : e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function cC(e) {
	return e.classList.contains("ui-menu--rail") && e.closest("[data-ui-bottom-bar]") !== null && typeof matchMedia == "function" && !matchMedia(`(min-width: ${zS.md}px)`).matches;
}
function lC(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/interactions/menu-engine.ts
var uC = "ui-menu", dC = "ui-menu-item--selected", fC = "ui-context-menu", pC = "ui-orientation--horizontal", mC = `.${jt} > .ui-menu__host > .ui-menu__item > .${_}`, hC = `${mC}, ${`.ui-menu[${yt}] > .ui-menu__host > .ui-menu__item > .${_}`}`, gC = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", _C = "data-ui-menu-shortcut", vC = "[role='menuitem'], [role='menuitemcheckbox']", yC = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), jx(bC), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(SC) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [_C, Tt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${uC}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && D(t, t.find((e) => e.classList.contains(dC) && Ba(e)) ?? t.find(Ba) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_}`), n = t?.closest(`.${uC}`) ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			xC(e, t);
			return;
		}
		let r = this.ownItems(n), i = La({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(pC) || cC(n) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(`.${uC}`) ? t : t.querySelector(`.${uC}`);
		if (n === null) return;
		let r = this.ownItems(n), i = La({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(pC) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_}`), n = t?.closest(`.${uC}`) ?? null;
		t !== null && n !== null && D(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${_}`) : null;
		if (t === null || t === document.activeElement || !t.matches(vC) || t.matches(Mt) || !Ba(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(`.${uC}`)?.contains(n) === !0) && Uo(t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || CC(e))) return;
		let t = Lc(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !jS(n.shortcut, e))) {
			if (!Ba(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${_C}]`)) {
			if (e.closest(`.${fC}`) !== null) continue;
			let t = AS(e.getAttribute(_C));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(_C)
				});
				continue;
			}
			let n = FS(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(_C),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return P(e, `.${_}:not(${Mt})`, `.${uC}`);
	}
}, bC = {
	anchor: (e) => e.closest(hC),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(gC), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(mC) && t.scrollWidth <= t.clientWidth ? null : Vy(n);
	},
	placement: (e) => {
		let t = e.closest(`.${uC}`);
		return t === null ? null : sC(t);
	}
};
function xC(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(Mt) || !Ba(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function SC(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${uC}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(uC) || t.querySelector(`.${uC}`) !== null)) return !0;
	return !1;
}
function CC(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var wC = `.ui-menu[${Ct}]`, TC = ":scope > .ui-collapsible__bar", EC = ":scope > .ui-menu__host", DC = "ui-menu__item", OC = `:scope > .${_}`, kC = ".ui-text__title", AC = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", jC = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), M(t, wC, {
			childList: !0,
			characterData: !0,
			attributeFilter: [yt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = MC(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(EC);
		if (n === null) return;
		let r = mp(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: NC(n)
		}), e.setAttribute(wt, ""), Fp(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of PC(e)) {
			let e = FC(a);
			if (e === "header") {
				n !== null && LC(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			LC(a, o), r ||= o, i ||= o;
		}
		return n !== null && LC(n, r), i;
	}
	match(e, t) {
		let n = gp(IC(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(AC) : null;
		if (r === null) return n;
		if (n) return RC(r), e.removeAttribute(St), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(St, i), i;
	}
	clear(e, t) {
		RC(t), e.removeAttribute(wt), PC(t).length > 0 && Fp(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(yt);
		for (let e of t.querySelectorAll(`[${bt}]:not([${xt}])`)) e.toggleAttribute(St, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...MC(e.target)?.querySelector(EC)?.querySelectorAll(`.ui-menu-item:not(${Mt})`) ?? []].find(Ba);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function MC(e) {
	let t = e.closest(wC), n = t?.querySelector(TC) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function NC(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${bt}][${St}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function PC(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(DC));
}
function FC(e) {
	return e.querySelector(OC)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function IC(e) {
	return hp(e.querySelector(OC)?.querySelector(kC)?.textContent ?? "", e);
}
function LC(e, t) {
	e.toggleAttribute(Tt, !t);
}
function RC(e) {
	for (let t of e.querySelectorAll(`[${Tt}]`)) t.removeAttribute(Tt);
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var zC = "[data-ui-root]", BC = "a[href]", VC = "ui-collapsible", HC = "right-side", UC = "ui-side--left", WC = "ui-side--right", GC = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${zS.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Et}]`);
		if (t !== null) {
			let e = t.closest(zC), n = t.getAttribute(Et);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(`[${Ft}]`);
		if (n !== null && !e.defaultPrevented && KC(n)) {
			this.closeAll();
			return;
		}
		let r = e.target.closest(BC)?.closest(`[${Ot}]`), i = r?.parentElement ?? null;
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
		e.setAttribute(Dt, t), this.markToggles(e);
		let n = qC(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, Bo(), performance.now() + j.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(Vn, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Qo(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${zC}[${Dt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(Dt);
		if (e.removeAttribute(Dt), this.markToggles(e), t === null) return;
		let n = qC(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let n = e.querySelector(`[${Et}="${CSS.escape(t)}"]`);
			n !== null && A(n);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(Dt);
		for (let n of e.querySelectorAll(`[${Et}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(Et) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(Vn), t && e.removeAttribute("tabindex"));
	}
};
function KC(e) {
	let t = e.closest(`.${VC}`), n = t?.closest(`[${Ot}]`), r = n?.getAttribute(Ot), i = n?.parentElement;
	return t == null || t.hasAttribute("data-ui-collapsed") || r == null || i == null ? !1 : i.matches(zC) && i.getAttribute("data-ui-drawer-open") === r && t.classList.contains(r === HC ? WC : UC);
}
function qC(e, t) {
	return e.querySelector(`:scope > [${Ot}="${CSS.escape(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var JC = "ui-collapsible", YC = "ui-collapsible__content", XC = "ui-collapsible__bar", ZC = "collapsed", QC = class {
	root;
	store = new KS();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${JC}`)), M(this.root, `.${JC}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, ZC);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Ft}]`), n = t?.closest(`.${JC}`) ?? null;
		if (t === null || n === null || KC(t)) return;
		e.preventDefault();
		let r = !n.hasAttribute(yt), i = n.querySelector(`:scope > .${YC}`);
		this.cancelFold(n);
		let a = ew(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, ZC, r ? "true" : "false", r ? { attributes: { [yt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(yt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Ft}], :scope > .${XC} > [${Ft}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || Ws()) return;
		let i = nw($C(e), n, ew(e, t), r);
		if (i === null) return;
		e.setAttribute(It, "");
		let a = {
			duration: j.normal,
			easing: j.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(It));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(It);
			for (let e of t) e.cancel();
		}
	}
};
function $C(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function ew(e, t) {
	let n = $C(e), r = tw(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function tw(e) {
	return e === "width" ? "height" : "width";
}
function nw(e, t, n, r) {
	let i = tw(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
function rw(e) {
	let t = [];
	for (let n of ow(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = rw(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = iw(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function iw(e) {
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
	if (n !== null) return aw({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return aw(r[3] === "fr" ? {
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
function aw(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function ow(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function sw(e, t = "auto") {
	return e.map((e) => cw(e, t)).join(" ");
}
function cw(e, t) {
	switch (e.kind) {
		case "px": return `${lw(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${lw(e.min)}px`}, ${lw(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${lw(e.max)}px)` : `minmax(${lw(e.min)}px, auto)`;
	}
}
function lw(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function uw(e) {
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
function dw(e, t) {
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
function fw(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = pw(r, e), o = pw(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function pw(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function mw(e, t, n, r) {
	let i = hw(e, t, n.before), a = hw(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = bw(n.before, e) + bw(n.after, e), r = i.total + a.total;
		gw(l, e, i, t * (i.total + c) / r), gw(l, e, a, t * (a.total - c) / r);
	} else u || _w(l, i, i.total + c), d || _w(l, a, a.total - c);
	return l;
}
function hw(e, t, n) {
	let r = yw(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function gw(e, t, n, r) {
	let i = bw(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function _w(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...vw(e[i])
		};
	}
}
function vw(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function yw(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function bw(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function xw(e, t) {
	let n = yw(t.before, e), r = n + yw(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function Sw(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function Cw(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var ww = "ui-grid-splitter", Tw = "ui-container", Ew = "ui-orientation--vertical", Dw = 16, Ow = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Lt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, kw = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Rt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, Aw = class {
	root;
	store = new KS();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new sd({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${ww}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${ww}`)), M(this.root, `.${ww}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = jw(t);
			e !== null && (this.restore(e, Mw(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of RS) {
			let i = r[n], a = VS(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ww}`);
		if (t === null || this.drag.active || w(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Lw(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${ww}`), n = t === null ? null : jw(t);
		if (t === null || n === null) return;
		let r = Mw(t);
		for (let e of RS) n.style.removeProperty(VS(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = mw(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(VS(e.axis.split, e.tier), sw(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of RS) {
			let a = VS(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = jw(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Mw(e), r = BS(), i = Nw(t, n, r), a = i === null ? null : rw(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = dw(a, uw(t.getAttribute(n.limits))), s = Pw(t, n), c = Fw(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = fw(c, Iw(t, n).map((e) => Fw(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = jw(e);
		if (t === null) return;
		let n = Mw(e), r = Fw(e, n), i = Pw(t, n), a = Iw(t, n).map((e) => Fw(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : fw(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(xw(i, o))));
	}
};
function jw(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(Tw) ? t : null;
}
function Mw(e) {
	return e.classList.contains(Ew) ? Ow : kw;
}
function Nw(e, t, n) {
	for (let r = RS.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(VS(t.split, RS[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function Pw(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Fw(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Iw(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(ww) && Mw(r) === t && n.push(r);
	return n;
}
function Lw(e) {
	let t = Number(e.getAttribute(zt));
	return Number.isFinite(t) && t > 0 ? t : Dw;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Rw = "ui-split-button", zw = "ui-split-button__main", Bw = "ui-split-button__toggle", Vw = "ui-split-button__menu", Hw = "ui-split-button--open", Uw = "ui-menu", Ww = 4, Gw = class {
	root;
	menus = new el({
		show: ({ owner: e }) => e.classList.add(Hw),
		hide: ({ owner: e }) => e.classList.remove(Hw),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = Kw(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${zw}`)?.closest(`.${Rw}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Kw(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = qw(t), r = e.target.closest(`.${_}`);
		n === null || r === null || !n.contains(r) || r.matches(`${Mt}, ${Pt}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = qw(e), r = n?.querySelector(`.${Uw}`) ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Ww
			},
			openers: Jw(e)
		}) && ts(r, P(r, `.${_}:not(${Mt})`, `.${Uw}`), t);
	}
};
function Kw(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Bw}, .${zw}`), n = t?.closest(`.${Rw}`) ?? null;
	return t === null || n === null || t.classList.contains(zw) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function qw(e) {
	return e.querySelector(`:scope > .${Vw}`);
}
function Jw(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Yw = "ui-button-group", Xw = "ui-button-group__item", Zw = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Yw}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), M(this.root, `.${Yw}`, {
			childList: !0,
			attributeFilter: [Tn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Qw(i);
			i.toggleAttribute(wn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		D(n, r ?? n.find(Ba) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xw}`), n = t?.closest(`.${Yw}`) ?? null;
		if (t === null || n === null || t.closest(`.${Yw}`) !== n || w(n)) return;
		let r = Qw(t);
		r !== null && w(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Xw} > .${Gn}`), n = t?.closest(`.${Yw}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Qw).filter((e) => e !== null), i = La({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Xw}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Ua(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: Tn,
			bindingAttribute: Dn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return P(e, `.${Xw}`, `.${Yw}`);
	}
};
function Qw(e) {
	return e.querySelector(`:scope > .${Gn}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var $w = "ui-accordion", eT = "details", tT = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${$w}`)), M(this.root, `.${$w}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains($w))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${eT}`)];
	}
}, nT = "ui-tab-overflow", rT = "ui-tab-overflow__menu", iT = "ui-tab-overflow__menu--open", aT = "ui-tab-overflow__entry", oT = "ui-tab-overflow__entry--current", sT = class {
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
		this.options = e, this.list = new uT(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : cT({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return lT(e, this.options.hiddenClass, t);
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
function cT(e) {
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
function lT(e, t, n) {
	for (let n of e.captions) n.classList.remove(t);
	let r = getComputedStyle(e.room), i = r.direction === "rtl", a = Number.parseFloat(r.paddingLeft) || 0, o = Number.parseFloat(r.paddingRight) || 0, s = e.room.getBoundingClientRect(), c = i ? s.right - e.room.clientLeft - o : s.left + e.room.clientLeft + a, l = e.room.clientWidth - a - o, u = e.captions.map((e) => {
		let t = e.getBoundingClientRect();
		return i ? c - t.left : t.right - c;
	});
	if (u.every((e) => e <= l)) return !1;
	n();
	let d = e.button.getBoundingClientRect(), f = getComputedStyle(e.button), p = Number.parseFloat(i ? f.marginRight : f.marginLeft) || 0, ee = (i ? c - d.right : d.left - c) - p, te = !1;
	for (let n = 0; n < e.captions.length; n++) te ||= u[n] > ee, te && e.captions[n].classList.add(t);
	return !0;
}
var uT = class {
	menu;
	button = null;
	list = new el({
		show: ({ popup: e }) => e.classList.add(iT),
		hide: ({ popup: e }) => {
			e.classList.remove(iT), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = rT, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(dT)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${oT}`);
		r !== null && D(this.entries(), r), this.button = e, rc(e, this.menu), this.list.open({
			owner: t,
			popup: this.menu,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: 4
			},
			openers: [e],
			focus: r ?? !1,
			returnFocus: () => e
		}) ? r === null && ts(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${aT}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || w(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = La({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), D(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${aT}`) : null;
		t === null || t === document.activeElement || w(t) || (D(this.entries(), t), Uo(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${aT}`));
	}
};
function dT(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${aT} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(oT, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(h, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Fn), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tab-switch.ts
var fT = "data-ui-caption-text", pT = ".ui-text__title";
function mT(e) {
	for (let t of e.querySelectorAll(pT)) {
		let e = t.textContent ?? "";
		t.getAttribute(fT) !== e && t.setAttribute(fT, e);
	}
}
function hT(e, t) {
	if (e === null || t === null || e === t || typeof t.animate != "function" || Ws()) return;
	let n = e.getBoundingClientRect(), r = t.getBoundingClientRect();
	n.width !== 0 && r.width !== 0 && t.animate([{ transform: `translateX(${n.left - r.left}px) scaleX(${n.width / r.width})` }, { transform: "none" }], {
		duration: j.normal,
		easing: j.ease,
		pseudoElement: "::after"
	});
}
function gT(e) {
	e === null || typeof e.animate != "function" || Ws() || e.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: j.fast,
		easing: j.enter
	});
}
//#endregion
//#region src/interactions/tabs-engine.ts
var _T = "ui-tabs", vT = "ui-tab-header", yT = "ui-tab-header--selected", bT = "ui-tab-header--overflowed", xT = "ui-tabs--overflowing", ST = "ui-tabs--no-overflow", CT = "ui-tabs__strip", wT = "data-ui-tab-key", TT = "data-ui-tab-page", ET = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new sT({
			rootClass: _T,
			overflowingClass: xT,
			wraps: (e) => e.classList.contains(ST),
			hiddenClass: bT,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${_T}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), M(this.root, `.${_T}`, {
			childList: !0,
			attributeFilter: [On, ...Mn],
			relevant: (e) => !Nc(e, `[${TT}]`, `.${_T}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(wT) ?? "") === t) ?? null;
		if (r !== null && !DT(r)) {
			let t = n.find(DT);
			if (t !== void 0) {
				this.select(e, t.getAttribute(wT) ?? "");
				return;
			}
		}
		let i = n.find((e) => e.classList.contains(yT)) ?? null, a = null;
		for (let e of n) {
			let n = (e.getAttribute(wT) ?? "") === t;
			e.classList.toggle(yT, n), e.setAttribute("aria-selected", n ? "true" : "false"), mT(e), n && (a = e);
		}
		this.fitHeaders(e, n.filter(DT), a), hT(i, a), D(n.filter((e) => !e.classList.contains(bT)), a);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(TT) ?? "") !== t, !n.hidden && i !== null && i !== a && gT(n);
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${CT}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(wT) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(DT).map((e) => {
				let n = e.getAttribute(wT) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: w(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${nT}`), n = t?.closest(`.${_T}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${_T}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${vT}`);
		if (r === null || w(r)) return;
		let i = r.closest(`.${_T}`), a = r.getAttribute(wT);
		i !== null && a !== null && r.closest(`.${_T}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vT}`), n = t?.closest(`.${_T}`) ?? null;
		if (t === null || n === null) return;
		let r = La({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(wT) ?? ""), r.focus());
	}
	select(e, t) {
		Ua(e, t, {
			attribute: On,
			bindingAttribute: Dn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return P(e, `.${vT}`, `.${_T}`);
	}
	ownPages(e) {
		return P(e, `[${TT}]`, `.${_T}`);
	}
};
function DT(e) {
	return e.classList.contains(bT) || sx(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var OT = "ui-command-bar", kT = "ui-command-bar__host", AT = "ui-command-bar__item", jT = "ui-command-bar__overflow", MT = "ui-command-bar--overflowing", NT = "ui-command-bar__overflowed", PT = "ui-text__title", FT = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new sT({
			rootClass: OT,
			overflowingClass: MT,
			wraps: (e) => !LT(e),
			hiddenClass: NT,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${OT}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), M(this.root, `.${OT}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = IT(e), n = e.querySelector(`:scope > .${jT}`);
		if (t === null || n === null) return;
		let r = RT(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(MT) && zT(r);
		for (let e of r) tc(e, e.classList.contains(NT) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${jT}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(OT) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = IT(e), n = t === null ? [] : RT(t).filter((e) => e.classList.contains(AT) && e.classList.contains(NT)).map((e) => e.querySelector(v) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: BT(e),
			current: !1,
			disabled: w(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !w(n) && VT(n).click();
	}
};
function IT(e) {
	return e.querySelector(`:scope > .${kT}`);
}
function LT(e) {
	let t = IT(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function RT(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(AT) ? n.querySelector(v) : null;
		e !== null && sx(e) && t.push(n);
	}
	return t;
}
function zT(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(AT) ? t ||= !r.classList.contains(NT) : t || r.classList.add(NT);
	}
}
function BT(e) {
	let t = VT(e), n = t.querySelector(`.${PT}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function VT(e) {
	return e.matches(Oo) ? e : e.querySelector(Oo) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var HT = "ui-breadcrumbs", UT = "ui-breadcrumbs__item", WT = "ui-breadcrumb", GT = "ui-breadcrumb--current", KT = "ui-hidden", qT = "data-ui-step-collapsed", JT = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), M(this.root, `.${HT}`, {
			childList: !0,
			attributeFilter: ["class", ...Mn]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${HT}`)) this.apply(e);
	}
	apply(e) {
		let t = P(e, `.${UT}`, `.${HT}`);
		for (let e of t) YT(e);
		let n = t.filter((e) => !e.classList.contains(KT)).map((e) => e.querySelector(`.${WT}`)).filter((e) => e !== null && !e.classList.contains(KT)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(GT, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function YT(e) {
	let t = e.querySelector(`:scope > .${WT}`), n = t === null ? "" : Mn.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === Mn[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(qT) : e.getAttribute(qT) !== n && e.setAttribute(qT, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function U(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function XT(e) {
	return U(e).toString(16).padStart(2, "0").toUpperCase();
}
function ZT(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return QT(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function QT(e, t, n) {
	return .2126 * $T(e) + .7152 * $T(t) + .0722 * $T(n);
}
function $T(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var eE = "ui-color-input", tE = "ui-color-input--open", nE = "ui-color-input__popup", rE = "ui-color-input__text", iE = "ui-color-input__row", aE = "ui-color-input__swatch--button", oE = "ui-color-input__value-input", sE = "ui-color-input__square-thumb", cE = "ui-color-input__hue-thumb", lE = "data-ui-color-toggle", uE = "data-ui-color-tab", dE = "data-ui-color-tab-selected", fE = "data-ui-color-pane", pE = "data-ui-color-pane-selected", mE = "data-ui-color-square", hE = "data-ui-color-hue", gE = "data-ui-color-hex", _E = "data-ui-color-channel", vE = "data-ui-color-factor", yE = "data-ui-color-opacity", bE = "data-ui-color-name", xE = "data-ui-color-name-selected", SE = "data-ui-color-format", CE = "data-ui-color-variant", wE = "data-ui-color-no-picker", TE = "data-ui-color-no-palette", EE = 4, DE = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new el({
		show: ({ owner: e }) => e.classList.add(tE),
		hide: ({ owner: e }) => e.classList.remove(tE)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${eE}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = x(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${eE}`) ?? []);
		}), M(this.root, `.${eE}`, {
			childList: !0,
			attributeFilter: [
				SE,
				CE,
				wE,
				TE
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new sd({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${mE}], [${hE}]`),
			begin: (e, t) => {
				let n = e.closest(`.${eE}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(mE) ? "square" : "hue"
				};
				return this.applyPoint(r, t), r;
			},
			move: (e, t, n) => this.applyPoint(e, n),
			end: (e, t) => this.send(t.input)
		});
	}
	applyAll(e) {
		for (let t of e) this.applyState(t, this.readState(t));
	}
	readState(e) {
		let t = ME(e), n = this.states.get(e), r = n?.paneChosen === !0 ? OE(e, n.pane) : kE(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? AE(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = BE(t);
			if (i === null) return n ?? AE(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && jE(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = UE(a, o, s);
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
			...n ?? AE(r),
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
			let [e, a, o] = UE(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), IE(e, "--ui-color-input-color", t.held ? HE(n, r, i, t.opacity) : "transparent"), IE(e, "--ui-color-input-solid", HE(n, r, i, 255)), IE(e, "--ui-color-input-on-color", t.held ? ZT(n, r, i, t.opacity) : "inherit"), FE(e, t.held ? PE(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${mE}]`), o = e.querySelector(`[${hE}]`), [s, c, l] = WE(t.hue, 1, 1);
		if (IE(e, "--ui-color-input-hue", HE(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${sE}`);
			e !== null && (IE(e, "left", `${t.saturation * 100}%`), IE(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${cE}`);
			e !== null && IE(e, "top", `${t.hue / 360 * 100}%`);
		}
		LE(e, `[${gE}]`, VE(n, r, i)), LE(e, `[${_E}="r"]`, String(n)), LE(e, `[${_E}="g"]`, String(r)), LE(e, `[${_E}="b"]`, String(i)), IE(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), RE(e, `[${yE}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${bE}]`)) n.getAttribute(bE) === t.name ? n.setAttribute(xE, "") : n.removeAttribute(xE);
		let n = t.name === null ? null : e.querySelector(`[${bE}="${t.name}"]`), r = n === null ? null : BE(n.style.getPropertyValue("--ui-color-input-chip").trim());
		IE(e, "--ui-color-input-base", r === null ? "transparent" : HE(r[0], r[1], r[2], 255)), RE(e, `[${vE}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${fE}]`)) n.getAttribute(fE) === t.pane ? n.setAttribute(pE, "") : n.removeAttribute(pE);
		for (let n of e.querySelectorAll(`[${uE}]`)) n.getAttribute(uE) === t.pane ? n.setAttribute(dE, "") : n.removeAttribute(dE);
	}
	resolveRgb(e, t) {
		if (t.name === null) return WE(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${bE}="${t.name}"]`), r = n === null ? null : BE(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? WE(t.hue, t.saturation, t.value) : zE([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${lE}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${eE}`));
			return;
		}
		let n = e.target.closest(`[${uE}]`), r = e.target.closest(`.${eE}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(uE), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${bE}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(bE)
			}));
			return;
		}
		let a = r.querySelector(`.${nE}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${eE}`);
		if (t !== null) {
			if (e.target.hasAttribute(vE)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(yE) && this.commit(t, (t) => ({
				...t,
				opacity: U(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${eE}`);
		if (n === null) return;
		if (t.hasAttribute(vE) || t.hasAttribute(yE)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(gE)) {
			let e = BE(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = UE(e[0], e[1], e[2]);
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
		let r = t.getAttribute(_E);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = U(Number(t.value));
		let [l, u, d] = UE(c.r, c.g, c.b);
		this.commit(n, (e) => ({
			...e,
			hue: l,
			saturation: u,
			value: d,
			name: null
		}));
	}
	applyPoint(e, t) {
		let { input: n, element: r, surface: i } = e, a = r.getBoundingClientRect();
		if (i === "hue") {
			let e = GE((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = GE((t.x - a.left) / a.width), s = 1 - GE((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || E(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${oE}`);
		a !== null && (a.value = NE(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		E(e) || e.querySelector(`.${oE}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(wE) && e.hasAttribute(TE)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${nE}`), n = e.querySelector(`[${lE}]`);
		if (t === null) return;
		let r = e.getAttribute(CE) === "swatch" ? e.querySelector(`.${aE}`) : e.querySelector(`.${iE}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: {
				placement: "bottom-end",
				gap: EE
			},
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${dE}]`) ?? !0
		});
	}
};
function OE(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? wE : TE))(t) ? t : t === "picker" ? "palette" : "picker";
}
function kE(e) {
	return OE(e, "picker");
}
function AE(e) {
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
function jE(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function ME(e) {
	return e.querySelector(`.${oE}`)?.value.trim() ?? "";
}
function NE(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = VE(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${XT(e.opacity)}`;
}
function PE(e, t, n, r, i) {
	if (e.getAttribute(SE) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = VE(t, n, r);
	return i === 255 ? a : `${a}${XT(i)}`;
}
function FE(e, t) {
	for (let n of e.querySelectorAll(`.${rE}`)) n.textContent !== t && (n.textContent = t);
}
function IE(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function LE(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function RE(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function zE(e, t) {
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
function BE(e) {
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
function VE(e, t, n) {
	return `#${XT(e)}${XT(t)}${XT(n)}`;
}
function HE(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function UE(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function WE(e, t, n) {
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
function GE(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function KE(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var qE = "ui-table", JE = "ui-table--reorderable", YE = "ui-scroll-x--auto", XE = "ui-scroll-x--always", ZE = `:scope > .${Gt}`, QE = `.${qt}`, $E = "ui-table__header-cell", eD = `${$E}--pinned`, tD = `${ZE} > .${Kt} > .${$E}`, nD = `${tD}--pinned`, rD = "ui-table__host", iD = `${ZE} > .${rD}`, aD = `.${qE}, .${Wt}, [${Bt}]`, oD = "--ui-table-columns", sD = "--ui-table-sized-columns", cD = "--ui-table-pin-", lD = "--ui-table-order-", uD = 64, dD = "data-ui-table-cell-hidden", fD = "data-ui-table-cell-last", pD = "columns", mD = "hidden", hD = "order", gD = "layout", _D = 32, vD = 16, yD = class {
	root;
	store = new KS();
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
		if (this.root = e.root ?? document, this.drag = new sd({
			root: this.root,
			resolveHandle: (e) => e.closest(QE),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new sd({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of RS) e !== "base" && matchMedia(`(min-width: ${zS[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${qE}`)), M(this.root, `.${qE}`, {
			childList: !0,
			relevant: SD
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), M(this.root, `.${qE}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(qE)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), M(this.root, `.${qE}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: CD
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(iD);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), KE(t, () => this.pin(t));
			let e = t.querySelector(iD);
			e !== null && (this.markScrollbar(t, e), KE(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, pD), r = n === null ? null : rw(n);
		r !== null && r.length !== t.length ? (this.store.write(e, pD, null), this.store.writeBoot(e, gD, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, hD);
		if (i !== null && !TD(i, t)) {
			this.store.write(e, hD, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute($t, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${qE}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = wD(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(YE) || e.classList.contains(XE);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(sD);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Cw(t, n);
				e.style.setProperty(sD, sw(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${lD}${t}`, String(r[t])) : e.style.removeProperty(`${lD}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Ut) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Ut, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Jt) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Jt, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(JE)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= uD) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Bt}]`)) {
				let r = Number(t.getAttribute(Bt));
				!(r >= uD) || t.closest(`.${qE}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(dD, n.hidden.has(r)), t.toggleAttribute(fD, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(tD)) {
			let e = Number(n.getAttribute(Bt)), r = n.getAttribute(Vt), i = n.classList.contains(eD) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: kD(r) ? r : null,
				startsHidden: n.hasAttribute(Ht),
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
		for (let e of t) (n[e.key] ?? OD(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, mD) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(oD).trim(), n = t.length === 0 ? null : rw(t);
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
		n === null || i !== void 0 && n === OD(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, mD, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return wD(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(nD).length;
		if (t < 2) return;
		let n = Sw(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${cD}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${qE}`)?.toggleAttribute(Qt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(ZE), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return bD(e) ? n.slice(1) : n;
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
		let t = e.target.closest(QE);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = vD;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${qE}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Bt)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(QE)?.closest(`.${qE}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = mw(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(_D, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, xD(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, pD, t === null ? null : sw(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(sD).trim(), n = e.getAttribute(Ut), r = {};
		t.length > 0 && (r[sD] = t);
		for (let t of e.style) t.startsWith(lD) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, gD, null);
			return;
		}
		this.store.writeBoot(e, gD, {
			styles: r,
			attributes: {
				[Ut]: n,
				[Jt]: e.getAttribute(Jt)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${qE}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = uw(t.getAttribute(Lt)), i = dw(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Bt)), u = this.hiddenOf(t, o), d = wD(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${$E}`), n = t?.closest(`.${qE}`) ?? null;
		return t === null || n === null || !n.classList.contains(JE) || e.closest(QE) !== null || t.classList.contains(eD) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${qE}`), r = Number(e.getAttribute(Bt));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Yt, ""), e.setAttribute(Xt, ""), {
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
		for (let a of wD(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > ED(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), DD(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Zt, "after") : a.cell.setAttribute(Zt, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Xt), t.table.removeAttribute(Yt), DD(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = wD(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, hD, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function bD(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function xD(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function SD(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(aD) || t.querySelector(aD) !== null)) return !0;
	return !1;
}
function CD(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(rD);
}
function wD(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function TD(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function ED(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function DD(e) {
	for (let t of e.querySelectorAll(`[${Zt}]`)) t.removeAttribute(Zt);
}
function OD(e) {
	return e.startsHidden || e.hideBelow !== null && RS.indexOf(BS()) < RS.indexOf(e.hideBelow);
}
function kD(e) {
	return e !== null && RS.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var AD = /* @__PURE__ */ new WeakMap();
function jD(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(mt);
	for (let i of F(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = MD(i, a) ?? ND(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${Ze}]`)) n.has(t) || t.remove();
}
function MD(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : AD.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function ND(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (FD(i, t.getAttribute(h)), AD.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function PD(e) {
	return e.find((e) => !e.classList.contains(Rn));
}
function FD(e, t) {
	e.setAttribute(Ze, ""), t === null ? e.removeAttribute(Qe) : e.setAttribute(Qe, t);
}
var ID = "bottom";
function LD(e, t, n) {
	let r = e.querySelector(`:scope > [${ct}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(ct, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function RD(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var zD = /* @__PURE__ */ new WeakMap();
function BD(e) {
	for (let t of e.querySelectorAll(`[${Ze}]`)) t.remove();
}
function VD(e, t, n, r, i, a) {
	let o = _g(e, F(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = og(i.getItemsFilterSortMetadata(t), a, ng(e));
	if (c && !l && BD(e), o.length === 0) {
		zD.set(e, []);
		return;
	}
	let d = Bh(e);
	if (!l) {
		RD(e, [...sg(o, u, r), ...zh(d)]);
		return;
	}
	BD(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (zD.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	zD.set(e, p);
	let ee = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = sg(t, u, r));
		let n = e === "" ? void 0 : PD(t);
		if (n !== void 0) {
			let e = HD(s, r, n);
			e !== null && ee.push(e);
		}
		ee.push(...t);
	}
	RD(e, [...ee, ...zh(d)]);
}
function HD(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && FD(r, n.getAttribute(h)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var UD = "ui-tree-rules", WD = "ui-tree", GD = ":scope > .ui-tree__row:not(.ui-tree__row--filtered)";
function KD(e, t, n) {
	if (e.parentElement?.classList.contains(WD) === !0) {
		e.dispatchEvent(new Event(UD, { bubbles: !0 })), Vh(e, t, n.templates, n.renderer, e.querySelector(GD) !== null);
		return;
	}
	switch (mg(e)) {
		case "windowed":
			Vh(e, t, n.templates, n.renderer), qD(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			rg(e, t, n.metadata, n.renderer, n.state), Vh(e, t, n.templates, n.renderer), VD(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function qD(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && jD(e, (e) => HD(r, n.renderer, e));
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var JD = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), YD = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(Ga)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), M(this.root, Ga, {
			childList: !0,
			attributeFilter: [
				Cn,
				Tn,
				En
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.ownItems(e);
		if (no(e, t), e.matches(".ui-items-view, .ui-table")) for (let e of t) {
			let t = Mf(e);
			t !== null && t.getAttribute("tabindex") !== "-1" && t.setAttribute("tabindex", "-1");
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, Ga);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (So(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Za(n, r);
			return;
		}
		io(n, i, r, Qa(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Ka), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || w(r) ? null : Nf(e.target, n) === null && !T(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, qa);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), Eo(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = _o(e.target);
		if (t === null || t.row !== null && Nf(e.target, t.row) !== null) return;
		let { root: n } = t;
		if (!n.matches(".ui-items-view, .ui-table") || w(n)) return;
		let r = XD(n);
		if (!JD.has(e.key) && !Ra(e.key, r === "grid" ? "both" : r)) return;
		let i = this.ownItems(n), a = yo(i), o = Co(e.key, i, bo(i), r);
		if (o !== null) {
			e.preventDefault(), So(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Xa(n, a), io(n, i, o, $a(n, e)));
			return;
		}
		if (a === null || T(a)) return;
		let s = Mf(a);
		switch (e.key) {
			case " ":
				if (!io(n, i, a, {
					shift: !1,
					ctrl: !0
				})) {
					if (s === null) return;
					s.click();
				}
				break;
			case "Enter":
				eo(n) && !ro(i).includes(a) && io(n, i, a, Ja), s === null ? Eo(a, "open") : s.click();
				break;
			case "Delete": {
				let e = ZD(i, a);
				if (e.length === 0) return;
				for (let t of e) Eo(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	ownItems(e) {
		return P(e, Ka, Ga);
	}
};
function XD(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function ZD(e, t) {
	let n = ro(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !T(e));
}
//#endregion
//#region src/interactions/tree-drop.ts
function QD(e, t) {
	if (T(e)) return !1;
	let n = t?.getAttribute(rn);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
//#endregion
//#region src/interactions/tree-engine.ts
var $D = "ui-tree", eO = "ui-tree__row", tO = "ui-tree__row--folded", nO = "ui-tree__row--filtered", rO = "fold-hidden", iO = "fold-shown", aO = "ui-tree__row--dragging", oO = "ui-tree__loading", sO = "ui-tree__loading-ring", cO = "ui-tree-node", lO = "ui-tree-node__text", uO = "ui-tree-node__toggle", dO = "ui-tree-node__rename", fO = ".ui-text__title", pO = "data-ui-tree-drop", mO = "--ui-tree-depth", hO = "expanded", gO = 600, _O = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), vO = class {
	root;
	store = new KS();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(UD, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${$D}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(x(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => k(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${$D}`)), M(this.root, `.${$D}`, {
			childList: !0,
			attributeFilter: [
				tn,
				nn,
				an,
				un
			],
			relevant: xO
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(un), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = wO(e)?.getAttribute(tn);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = k(e), r = wO(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(nn) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(mO, String(u)), e.setAttribute("aria-level", String(u + 1)), xo(e, r?.querySelector(`:scope > .${lO}`) ?? null), e.classList.toggle(tO, !d), e.classList.toggle(nO, re), e.removeAttribute(ln), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !T(e), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(sn), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(sn, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(sn), d && ne && !re), s.set(n, {
				row: e,
				depth: u,
				shown: d,
				expanded: ne,
				authoredShown: te
			});
		}
		o === null && this.writeBootFold(e, t, s);
	}
	authoredExpandedOf(e) {
		return wO(e.row)?.hasAttribute(an) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${eO}[${h}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, rO, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, iO, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [ln]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Fr(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = ng(t);
		if (r === void 0 && i === null) return null;
		let a = og(r, this.rules.state, i), o = ag(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(k)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = wO(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => cg(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(k(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${oO}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = k(o), c = i.getItemValue(o);
			if (c === void 0 || ig(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = wO(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(oO) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? SO();
		o.style.setProperty(mO, String(t)), o.classList.toggle(tO, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${uO}`) === null && (!r.hasAttribute("data-ui-unselectable") || Nf(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Nf(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${eO}`), n = t?.closest(`.${$D}`) ?? null;
		return t === null || n === null || t.closest(`.${$D}`) !== n || T(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = _o(e.target);
		if (t === null || t.row !== null && Nf(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains($D) || w(n) || !_O.has(e.key) && !Ra(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = yo(r), a = Co(e.key, r, bo(r), "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, $a(n, e));
			return;
		}
		if (!(i === null || T(i))) {
			switch (e.key) {
				case " ":
					if (!io(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, Co("ArrowDown", r, i, "vertical"), Ja);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), Ja);
					break;
				case "Enter":
					eo(n) && !ro(r).includes(i) && io(n, r, i, Ja), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = ZD(r, i);
					if (e.length === 0) return;
					for (let t of e) t.dispatchEvent(new Event("remove", { bubbles: !0 }));
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	canRename(e, t) {
		return e.hasAttribute("data-ui-tree-renamable") && !t.hasAttribute("data-ui-unrenamable");
	}
	handleDragStart(e) {
		let t = CO(e), n = t?.closest(`.${$D}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (T(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? ro(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !T(e) && e.getClientRects().length > 0) : [];
		wg(e, n, t, aO, k(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(aO));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$D}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${eO}`), a = i !== null && i.closest(`.${$D}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (!QD(a, wO(a)) || n.some((t) => t === a || bO(e, k(a), k(t)))) {
				this.markDrop(t, null), this.springOpen(t, null);
				return;
			}
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), gO)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$D}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${$D}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${pO}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(eO) ? k(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && bO(a, k(e), k(t))));
		this.markDrop(t, null), this.springOpen(t, null), Tg(t, aO), r.classList.contains(eO) && this.expand(t, r);
		for (let e of o) {
			let t = wO(e)?.querySelector(`.${lO}`) ?? null;
			t !== null && (t.setAttribute(cn, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = CO(e)?.closest(`.${$D}`) ?? null;
		t !== null && (Tg(t, aO), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${pO}]`)) n !== t && n.removeAttribute(pO);
		t?.setAttribute(pO, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(k(n), wO(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = k(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(tO)) : [];
		this.store.writeJson(e, hO, i), this.layout(e), yO(a.filter((e) => !e.classList.contains(tO)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, hO) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = yo(r);
		So(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Xa(e, i), io(e, r, t, n));
	}
	parentOf(e, t) {
		let n = wO(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => k(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${$D}`), n = wO(e), r = n?.querySelector(fO) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), Vc({
			container: n,
			title: r,
			className: dO,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(on, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${g}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(eO) && n.push(e);
		return n;
	}
};
function yO(e) {
	if (!(e.length === 0 || Ws())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: j.fast,
		easing: j.enter
	});
}
function bO(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function xO(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(eO) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains($D) === !0);
}
function SO() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = oO, e.setAttribute("aria-hidden", "true"), t.className = sO, e.append(t, C.text("ui.tree.loading")), e;
}
function CO(e) {
	return e.target instanceof Element ? e.target.closest(`.${eO}`) : null;
}
function wO(e) {
	return e.querySelector(`.${cO}`);
}
var TO = "tabs:rename", EO = "tabs:pin", DO = "tabs:unpin", OO = "tabs:close", kO = "tabs:delete";
function AO(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function jO(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[TO, e.rename && t.renamable],
		[EO, e.pin && !t.pinned],
		[DO, e.pin && t.pinned],
		[OO, e.close && !e.delete && n],
		[kO, e.delete && n]
	]);
}
function MO(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function NO(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, PO(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function PO(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function FO(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var W = "ui-tabs-view", IO = "ui-tab-item", LO = "ui-tab-item__label", RO = "ui-tab-item__close", zO = "ui-tab-item__rename", BO = "ui-tab-item__caption", VO = "ui-tab-item__pin", HO = ".ui-text__title", UO = "ui-tab-item--dragging", WO = "ui-tab-item__caption--overflowed", GO = "ui-tabs-view--overflowing", KO = "ui-tabs-view--no-overflow", qO = "ui-tab-item__page", JO = "ui-tab-item--selected", YO = ".ui-menu-item", XO = "tab-menu-entry", ZO = {
	name: XO,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, QO = "--ui-tabs-view-strip", $O = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new sT({
			rootClass: W,
			overflowingClass: GO,
			wraps: (e) => e.classList.contains(KO),
			hiddenClass: WO,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(x(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => dk(e) === t.key))?.querySelector(`.${LO}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(Gb, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), M(this.root, `.${W}`, {
			childList: !0,
			attributeFilter: [
				On,
				ye,
				...Mn
			],
			relevant: (e) => !Nc(e, `.${qO}`, `.${W}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${W}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(sx);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => dk(e) === r)) {
			this.select(e, dk(n[0]));
			return;
		}
		let i = e.hasAttribute(ye), a = t.find((e) => e.classList.contains(JO))?.querySelector(`.${BO}`) ?? null, o = [], s = null, c = null;
		for (let e of t) {
			let t = dk(e) === r;
			e.classList.toggle(JO, t);
			let a = e.querySelector(`.${BO}`);
			a !== null && (a.draggable = i, mT(a), n.includes(e) && (o.push(a), t && (s = a))), e.querySelector(`.${LO}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${qO}`)) n.hidden = !t;
			t && (c = e.querySelector(`.${qO}`));
		}
		this.fitCaptions(e, o, s), this.writeStripHeight(e, c), hT(a, s), a !== null && a !== s && gT(c);
		let l = [], u = null;
		for (let e of o) {
			let t = e.querySelector(`.${LO}`);
			t === null || e.classList.contains(WO) || (l.push(t), e === s && (u = t));
		}
		D(l, u);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !sx(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(QO, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${g}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${nT}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => dk(e) === t)?.querySelector(`.${LO}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(sx).map((e) => ({
				key: dk(e),
				title: e.querySelector(`.${LO}`)?.textContent?.trim() ?? dk(e),
				current: dk(e) === t,
				disabled: w(e.querySelector(`.${LO}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${IO}`);
		if (n === null || !n.classList.contains(W) || r === null || r.closest(`.${W}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = nk(n, r), a = ik(t), o = a.map((e) => {
			if (rk(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? sx(e) ? "shown" : "hidden";
		});
		if (MO(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: dk(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${xe}="tab"]`), n = t?.parentElement ?? null, r = e.closest(YO);
		if (t === null || n === null || !n.classList.contains(W) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => dk(e) === a.key);
		if (i.length === 0 || r.matches(`${Nt}, ${Mt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(XO, {
			bubbles: !0,
			detail: { keys: [i, dk(o)] }
		})), !0;
		if (nk(n, o).get(i) !== !0) return !0;
		switch (i) {
			case TO: {
				let e = o.querySelector(`.${LO}`);
				e !== null && this.startRename(e);
				break;
			}
			case EO:
			case DO:
				this.setPinned(n, o, i === EO);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${BO} > .${VO}`);
		t.toggleAttribute(jn, n), r !== null && (r.toggleAttribute(jn, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = FO(a.map(lk));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? ak(a[a.length - 1]).after(ak(t)) : ak(s).before(ak(t)), ck([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${nT}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(W)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = ok(e.target), i = r?.closest(`.${W}`) ?? null;
		if (r === null || i === null || w(r)) return;
		let a = r.closest(`.${IO}`);
		a !== null && a.closest(`.${W}`) === i && (e.preventDefault(), this.select(i, dk(a)), document.activeElement !== r && A(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${RO}`), r = n?.closest(`.${IO}`) ?? null, i = r?.closest(`.${W}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), tk(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = ok(e.target), n = t?.closest(`.${W}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(HO) ?? e, r = e.closest(`.${IO}`);
		t === null || r === null || ak(r).hasAttribute("data-ui-unrenamable") || Vc({
			container: t,
			title: n,
			className: zO,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(An, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => A(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${LO}`), n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${LO}`)).filter((e) => e !== null), i = La({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${IO}`);
		a !== null && this.select(n, dk(a)), i.focus();
	}
	handleDragStart(e) {
		let t = sk(e);
		if (t === null) return;
		if (ak(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		wg(e, t.closest(`.${W}`) ?? t, t, UO, dk(t));
		let n = ak(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${BO}`)?.closest(`.${IO}`) ?? null, n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${UO}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${BO}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = ak(r), o = t.hasAttribute("data-ui-tab-pinned") ? ek(n, a) : null, s = o ?? ak(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${W}`);
		t !== null && t.querySelector(`.${UO}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = sk(e);
		if (t === null) return;
		t.classList.remove(UO);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(ak(t), n.next);
			return;
		}
		let r = ak(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${W}`);
		if (i === null) return;
		let a = this.ownItems(i);
		ck(a, a.indexOf(t));
	}
	select(e, t) {
		Ua(e, t, {
			attribute: On,
			bindingAttribute: Dn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return P(e, `.${IO}`, `.${W}`);
	}
};
function ek(e, t) {
	let n = null;
	for (let r of P(e, `.${IO}`, `.${W}`)) {
		let e = ak(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function tk(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !ak(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function nk(e, t) {
	return jO(AO(e.getAttribute(be)), {
		pinned: t.hasAttribute(jn),
		renamable: !ak(t).hasAttribute(pe),
		removable: e.hasAttribute("data-ui-tabs-removes") && tk(e, t)
	});
}
function rk(e) {
	let t = e.getAttribute(h);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function ik(e) {
	let t = e.querySelector(`[${g}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function ak(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function ok(e) {
	return e.closest(`.${RO}`) !== null || Bc(e) ? null : e.closest(`.${BO}`)?.querySelector(`:scope > .${LO}`) ?? null;
}
function sk(e) {
	return e.target instanceof Element ? e.target.closest(`.${BO}`)?.closest(`.${IO}`) ?? null : null;
}
function ck(e, t) {
	for (let [n, r] of NO(e.map(lk), t)) e[n].setAttribute(kn, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function lk(e) {
	return {
		order: uk(e),
		pinned: e.hasAttribute(jn)
	};
}
function uk(e) {
	let t = e.getAttribute(kn);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function dk(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var fk = "button.ui-text__fold-toggle", pk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(fk);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, mk = "ui-temporal-input__segments", hk = "ui-temporal-input__segment", gk = "ui-temporal-input__segment-literal", _k = "ui-temporal-input__segment--empty", vk = "data-ui-temporal-segment", yk = "data-ui-temporal-step-direction", bk = "data-ui-temporal-segments-of", xk = "--", Sk = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${I}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Nr(e.components, `.${I}`));
		}), M(this.root, `.${I}`, { attributeFilter: [...p_] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) h_(t) === "time" && (I_(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${mk}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = g_(e), r = y_(e), i = L(e, D_(t));
		t.getAttribute(bk) !== n && (t.replaceChildren(...Ck(n).map((e) => Tk(e))), t.setAttribute(bk, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(vk);
			if (t === null) {
				n.textContent = Dk(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = Ok(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(_k, i === null), n.tabIndex = 0, kk(n, t, i, E(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = jk(e.target);
		if (t === null) return;
		let n = t.closest(`.${I}`), r = t.getAttribute(vk), i = Ak(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), Nk(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), N_(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = Pk(e.key, y_(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = jk(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = jk(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = pd(this.wheelTurn, fd(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${I}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(vk), n < 0 ? 1 : -1, Ak(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${yk}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${yk}]`);
		if (t === null) return;
		let n = t.closest(`.${I}`);
		if (n === null || E(n)) return;
		e.preventDefault();
		let r = Mk(n) ?? n.querySelector(`.${hk}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(vk), t.getAttribute(yk) === "up" ? 1 : -1, Ak(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${hk}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${I}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = L(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = Fk(t), o = v_(__(e), a) * n, s = a === "hour" ? 24 : 60, c = ((Ik(i, a) + o) % s + s) % s;
		this.write(e, Lk(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? Lk(t, "hour", Rk(l, t.getHours() >= 12)) : Lk(t, Fk(n), l), i);
		}
		u && Nk(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, Lk(r, "hour", Rk(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return L(e, t) ?? R_(e);
	}
	write(e, t, n) {
		N_(e, z_(e, t), n), F_(e), this.applySegments(e);
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
function Ck(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Qr(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(wk(r)), n += r.length;
	}
	return t;
}
function wk(e) {
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
function Tk(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = gk, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = hk, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(vk, e.unit), t.dataset.width = String(e.width), Ek(t, e.unit), t;
}
function Ek(e, t) {
	if (t === "meridiem") {
		C.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = Fk(t);
	C.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function Dk(e, t, n, r) {
	return t && n !== null ? Xr(n, e, r) : e;
}
function Ok(e, t, n, r) {
	if (n === null) return xk;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : Ik(n, Fk(e));
	return String(i).padStart(t, "0");
}
function kk(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : Ik(n, Fk(t))));
}
function Ak(e) {
	return D_(e.closest(`.${mk}`));
}
function jk(e) {
	let t = e instanceof Element ? e.closest(`.${hk}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${I}`);
	return n === null || E(n) ? null : t;
}
function Mk(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${hk}`) : null;
}
function Nk(e, t, n) {
	La({
		key: n,
		items: [...e.querySelectorAll(`.${hk}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function Pk(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function Fk(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function Ik(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Lk(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function Rk(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var zk = "ui-timestamp", Bk = "ui-timestamp__text", Vk = "data-ui-timestamp-format", Hk = "datetime", Uk = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${zk}`), C.temporal === null), C.onTable(() => this.apply(this.root.querySelectorAll(`.${zk}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Nr(e.components, `.${zk}`))), M(this.root, `.${zk}`, {
			childList: !0,
			attributeFilter: [Hk],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${zk}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: C.temporal,
			language: C.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = Si(a.getAttribute(Vk)), o = xi(a.getAttribute(Hk)), s = a.querySelector(`.${Bk}`);
			if (s === null || t && !Wk(e, o, r)) continue;
			let c = o === null ? "" : Ti(o, e, n, r), l = e === "relative-date" ? Di(c, n.language) : c;
			s.textContent !== l && (s.textContent = l), i ||= Ci(e) && o !== null;
		}
		i && ea(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${zk}:is([${Vk}="relative"], [${Vk}="relative-date"])`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
};
function Wk(e, t, n) {
	return e === "relative" || e === "relative-date" && t !== null && Ei(t, n) !== null;
}
//#endregion
//#region src/interactions/scroll-anchor-engine.ts
var Gk = "data-ui-scroll-anchor", Kk = "End", qk = 4, Jk = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], Yk = /* @__PURE__ */ new WeakSet();
function Xk(e) {
	Yk.add(e);
}
function Zk(e) {
	Yk.delete(e);
}
var Qk = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of Jk) this.root.addEventListener(e, (e) => $k(e), {
			capture: !0,
			passive: !0
		});
		M(this.root, `[${Gk}="${Kk}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [vt]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !tA(t) || this.pinned.set(t, Yk.has(t) || rA(t) && !nA(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${Gk}="${Kk}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), Yk.has(t)) {
				this.pinned.set(t, !0), eA(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (nA(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), eA(t);
			}
		}
	}
	watchRows(e) {
		if (this.resizes === null) return;
		let t = this.watched.get(e), n = /* @__PURE__ */ new Set();
		for (let r of e.children) r.hasAttribute("data-ui-window-spacer") || (n.add(r), t?.has(r) !== !0 && this.resizes.observe(r));
		for (let e of t ?? []) n.has(e) || this.forget(e);
		this.watched.set(e, n);
	}
	handleResize(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) {
			let e = n.target, r = e.parentElement;
			if (!e.isConnected || r === null || !tA(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === i.height) continue;
			let o = a !== void 0 && i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) Yk.has(e) || this.pinned.get(e) !== !1 && !nA(e) ? eA(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function $k(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${Gk}="${Kk}"]`) : null;
	t !== null && Yk.delete(t);
}
function eA(e) {
	e.scrollTop = e.scrollHeight;
}
function tA(e) {
	return e.getAttribute(Gk) === Kk;
}
function nA(e) {
	return e.getAttribute(pt)?.toLowerCase() === "true";
}
function rA(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= qk;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var iA = `:is(.ui-surface, .ui-card)[${m}]`, aA = "ui-surface--clickable", oA = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), M(t, iA, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(iA));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(iA) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(aA)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), uA(e, "role", lA(e) ? "group" : "button"), uA(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : cA(e) ? "-1" : "0");
	}
	handleKeyDown(e) {
		let t = sA(e);
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
function sA(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(aA) && t.hasAttribute("tabindex") ? t : null;
}
function cA(e) {
	let t = e.closest(Ka);
	return t !== null && t.closest(".ui-items-view, .ui-table, .ui-tree")?.matches(".ui-items-view, .ui-table") === !0 && Mf(t) === e;
}
function lA(e) {
	for (let t of e.querySelectorAll(Af)) {
		let n = t.closest(Hn);
		if ((n === null || !e.contains(n)) && t.closest(".ui-action-bar") === null) return !0;
	}
	return !1;
}
function uA(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/interactions/text-selection-engine.ts
var dA = "button, a, input, select, textarea, label, summary, [role='button'], [role='menu'], [role='tab'], [contenteditable=''], [contenteditable='true']", fA = class {
	selection;
	selects;
	constructor(e = {}) {
		let t = e.root ?? document;
		this.selection = e.selection ?? (() => document.getSelection()), this.selects = e.selects ?? pA, t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), { capture: !0 });
	}
	handlePointerDown(e) {
		if (e.button !== 0 || e.pointerType === "touch" || !(e.target instanceof Element)) return;
		let t = this.selection();
		t === null || t.isCollapsed || e.target.closest(dA) !== null || this.selects(e.target) || t.removeAllRanges();
	}
};
function pA(e) {
	let t = getComputedStyle(e);
	return (t.getPropertyValue("user-select") || t.getPropertyValue("-webkit-user-select")) !== "none";
}
//#endregion
//#region src/items/items-viewport.ts
function mA(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function hA(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${g}][${it}]`) : null;
}
function gA(e) {
	let t = mA(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - vA(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function _A(e, t) {
	let n = mA(e);
	n.scrollTop = n === e ? t : t + vA(e, n);
}
function vA(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function yA(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = xA(e, a, n), s = xA(e, a + 1, n);
	return SA(t, o.top, s.top, o.line, s.line);
}
function bA(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = xA(e, a, n), s = xA(e, a + 1, n);
	return SA(t, o.line, s.line, o.top, s.top);
}
function xA(e, t, n) {
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
function SA(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var CA = 250, wA = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(at);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < CA && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${at}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${at}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = TA(e, "data-ui-scroll-viewport") ?? EA(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? OA(e) : null, a = i === null ? null : OA(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = bA(a, yA(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? DA(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function TA(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function EA(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : TA(e, g);
	return t === null ? null : mA(t);
}
function DA(e, t) {
	return t > 0 ? e / t : 0;
}
function OA(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${ot}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${st}]`);
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
var kA = `.${Gn}, .ui-action, .${_}, .ui-select__option, .ui-language-switcher__choice`, AA = "ui-key-value-action__row", jA = "ui-tree__row", MA = `${kA}, ${`${Ka}, .${AA}`}`, NA = "ui-pressing", PA = "ui-press-held", FA = "--ui-press-x", IA = "--ui-press-y", LA = "--ui-ripple-radius", RA = "--ui-ripple-opacity", zA = class {
	clicks;
	presses = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		let t = e.root ?? document;
		this.clicks = e.clicks ?? (() => !1), t.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), t.addEventListener("pointerup", (e) => this.release(e, !1), !0), t.addEventListener("pointercancel", (e) => this.release(e, !0), !0), t.addEventListener("dragstart", () => this.cancelAll(), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		this.end(e.pointerId, !0);
		let t = this.pressedElement(e.target);
		if (t === null || typeof t.animate != "function" || Ws()) return;
		for (let [e, n] of this.presses) n.element === t && this.finish(e, n);
		let n = t.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = Math.hypot(Math.max(r, n.width - r), Math.max(i, n.height - i));
		t.style.setProperty(FA, `${r}px`), t.style.setProperty(IA, `${i}px`), t.classList.add(NA, PA);
		let o = t.animate([{ [LA]: "0px" }, { [LA]: `${a}px` }], {
			duration: j.ripple,
			easing: j.ease,
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
		let t = e.closest(MA);
		if (t === null || w(t)) return null;
		let n = e.closest(Hn);
		return n !== null && n !== t && t.contains(n) ? null : t.matches(kA) ? t : this.pressedRow(t, e);
	}
	pressedRow(e, t) {
		if (Nf(t, e) !== null || T(e) || e.hasAttribute("data-ui-row-editing")) return null;
		let n = e.closest(Ga), r = n !== null && !e.classList.contains(AA) && !n.hasAttribute("data-ui-no-row-select") && (n.getAttribute("data-ui-selection") === "one" || n.getAttribute("data-ui-selection") === "many"), i = e.classList.contains(jA) && e.hasAttribute("data-ui-unselectable");
		return !r && !i && !this.raisesClick(e, t) ? null : O(e);
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
	cancelAll() {
		for (let e of [...this.presses.keys()]) this.end(e, !0);
	}
	end(e, t) {
		let n = this.presses.get(e);
		if (n === void 0 || n.fade !== null) return;
		n.element.classList.remove(PA);
		let r = Math.max(0, j.ripple - (performance.now() - n.started)), i = 0;
		!t && r > 0 && (i = Math.min(r, j.fast), n.grow.updatePlaybackRate(r / i)), n.fade = n.element.animate([{ [RA]: 1 }, { [RA]: 0 }], {
			duration: j.normal,
			delay: i,
			easing: j.exit,
			fill: "forwards"
		}), n.fade.addEventListener("finish", () => this.finish(e, n));
	}
	finish(e, t) {
		t.grow.cancel(), t.fade?.cancel(), t.element.classList.remove(NA, PA), this.presses.get(e) === t && this.presses.delete(e);
	}
}, BA = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), VA = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], HA = `.${Fn}, .${In}`, UA = RegExp(`(^|\\s)(${Fn}|${In})(\\s|$)`), WA = RegExp(`(^|\\s)${Ln}(\\s|$)`), GA = "[type='range']", KA = /* @__PURE__ */ new WeakSet(), qA = /* @__PURE__ */ new WeakSet();
function JA(e = document) {
	let t = e === document ? window : e;
	for (let e of VA) t.addEventListener(e, nj, !0);
	t.addEventListener("keydown", ij, !0), t.addEventListener("change", aj, !0), t.addEventListener("pointerdown", oj, !0), t.addEventListener("mousedown", oj, !0), $A(e.querySelectorAll(HA)), ZA(e.querySelectorAll(`[${Pn}]`)), XA(e.querySelectorAll(GA)), new MutationObserver((e) => {
		for (let t of e) YA(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", Pn],
		attributeOldValue: !0
	});
}
function YA(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			QA(t, e.oldValue !== null);
			return;
		}
		let n = UA.test(e.oldValue ?? ""), r = t.matches(HA);
		n !== r && (ej(t, r), QA(t)), WA.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && XA(t.querySelectorAll(GA));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(HA) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && tj(n), n.matches(HA) && ej(n, !0), $A(n.querySelectorAll(HA)), QA(n), ZA(n.querySelectorAll(`[${Pn}]`)), XA([n, ...n.querySelectorAll(GA)]));
}
function XA(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = E(t);
		e !== KA.has(t) && (e ? (KA.add(t), t.addEventListener("touchstart", oj, { passive: !1 })) : (KA.delete(t), t.removeEventListener("touchstart", oj)));
	}
}
function ZA(e) {
	for (let t of e) QA(t);
}
function QA(e, t = !1) {
	let n = e.getAttribute(Pn);
	n === null && !t || (e.matches(HA) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !wu(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function $A(e) {
	for (let t of e) ej(t, !0);
}
function ej(e, t) {
	for (let n of e.children) t ? tj(n) : qA.has(n) && (qA.delete(n), n.removeAttribute("inert"));
}
function tj(e) {
	e.hasAttribute("inert") || (qA.add(e), e.setAttribute("inert", ""));
}
function nj(e) {
	e.target instanceof Element && (w(e.target) ? (e.type === "click" && Yc(e), sj(e)) : e.type === "click" && rj(e.target) && e.preventDefault());
}
function rj(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && E(e);
}
function ij(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && w(e.target)) {
			sj(e);
			return;
		}
		!BA.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && E(e.target) && e.preventDefault();
	}
}
function aj(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && E(e.target) && e.stopImmediatePropagation();
}
function oj(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !E(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function sj(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var cj = /* @__PURE__ */ new WeakMap(), lj = new el({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = cj.get(e);
		cj.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), uj = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => lj.popupOf(r) === t;
		return cj.set(t, n.onDismiss), lj.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (cj.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && lj.reposition(r);
			},
			close: () => {
				i() && lj.close(r);
			}
		};
	},
	focusReturn: (e) => ns(e)
};
//#endregion
//#region src/items/item-rows.ts
function dj(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: Jh,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => _o(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var fj = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? hj(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), gj(l, n, t);
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
		let i = mj(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: S(r),
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
			pj(n, e) && this.applyBoundAttribute(i, String(x(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = x(t.bindingId);
			e.push([t, `[${Fe}${Xn(n.propertyName)}="${Yn(r)}"]`]);
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
		let r = bj(t, n.templateKeyPropertyName);
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
		r !== void 0 && Wh(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : Uh(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item has no such property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = ma(u, () => this.metadata.isTranslatable(a) && !Gh(l)), f = x(a.componentId), p = e.closest(`[${m}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = $n(p, t, () => [e])[0] ?? null;
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
function pj(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = x(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function mj(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? Yh(r, i.name) : $h(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return eg(r, i.key, n), e;
	let a = r;
	return a[Xh(a, i.name)] = n, e;
}
function hj(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function gj(e, t, n) {
	e.setAttribute(h, t), yj(e, n), vj(e, n);
}
var _j = [
	["CanSelect", ue],
	["CanDrag", de],
	["CanRemove", fe],
	["CanRename", pe],
	["CanShowContextMenu", me]
];
function vj(e, t) {
	for (let [n, r] of _j) {
		let i = Yh(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function yj(e, t) {
	let n = Yh(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute($e, n.value) : e.removeAttribute($e);
}
function bj(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = Yh(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var xj = "Group", Sj = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = x(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), M(e.root, `[${tt}="${nt}"]`, { attributeFilter: [We] }, (e) => {
			for (let t of e) {
				let e = Fr(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), M(e.root, `[${rt}="windowed"]`, { attributeFilter: [mt] }, (e) => {
			for (let t of e) {
				let e = Fr(t);
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
			for (let [t, n] of e) t.isConnected && KD(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(x(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Qh(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${g}]`)) {
			if (mg(r) !== "virtualized") continue;
			let i = r.closest(v);
			i === null || !this.drawsPatchedComponent(i, x(e.reference.componentId), t) || !Cj(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(S(i), t) && this.sync(r, S(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${S(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? S(e) === n.scopeComponentId : S(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		KD(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${h}="${Yn(t)}"]`)].filter((t) => this.isItemRoot(t) && kr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${g}]`), i = r === null ? null : Fr(r);
		if (r !== null && i !== null && mg(r) === "virtualized") {
			let a = e.getAttribute(h);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = wj(xj, t);
		a && yj(e, this.options.renderer.getItemValue(e)), _j.some(([e]) => wj(e, t)) && vj(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && wj(xj, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => wj(e.itemProperty, t)) || n.sorts.some((e) => wj(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${g}]`)) {
			let n = Fr(t);
			n === e && this.sync(t, n);
		}
	}
};
function Cj(e, t) {
	let n = Or(e, Dr(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function wj(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/item-reveal.ts
var Tj = /* @__PURE__ */ new WeakMap(), Ej = /* @__PURE__ */ new WeakSet();
function Dj(e) {
	if (e.hasAttribute("data-ui-items-host")) return e;
	for (let t of e.querySelectorAll(`[${g}]`)) if (t.closest(v) === e) return t;
	return null;
}
function Oj(e, t, n, r) {
	let i = kj(e, t);
	return i !== null && (Tj.set(e, {
		key: t,
		block: n
	}), Aj(e, i, n, r), Mj(e), !0);
}
function kj(e, t) {
	for (let n of e.children) if (n.getAttribute("data-ui-key") === t) return n;
	return null;
}
function Aj(e, t, n, r) {
	let i = t.previousElementSibling, a = i !== null && i.hasAttribute("data-ui-group-header") && i.getAttribute("data-ui-group-anchor") === t.getAttribute("data-ui-key") ? i : null, o = mA(e);
	if (o.scrollHeight <= o.clientHeight) {
		(a ?? t).scrollIntoView({
			behavior: r,
			block: n === "Start" ? "start" : n === "End" ? "end" : n === "Center" ? "center" : "nearest"
		});
		return;
	}
	let s = o.getBoundingClientRect().top + o.clientTop, c = o.clientHeight, l = (a ?? t).getBoundingClientRect().top, u = t.getBoundingClientRect().bottom, d = jj(n, l - s, u - s, c);
	d !== 0 && (r === "smooth" ? o.scrollTo({
		top: o.scrollTop + d,
		behavior: r
	}) : o.scrollTop += d);
}
function jj(e, t, n, r) {
	switch (e) {
		case "Center": return (t + n - r) / 2;
		case "End": return n - r;
		case "Nearest": return t >= 0 && n <= r ? 0 : t < 0 || n - t > r ? t : n - r;
		default: return t;
	}
}
function Mj(e) {
	if (!Ej.has(e)) {
		Ej.add(e);
		for (let t of Jk) mA(e).addEventListener(t, () => Tj.delete(e), {
			capture: !0,
			passive: !0
		});
	}
}
function Nj(e) {
	let t = Tj.get(e);
	if (t === void 0) return;
	let n = kj(e, t.key);
	if (n === null) {
		Tj.delete(e);
		return;
	}
	Aj(e, n, t.block, "auto");
}
function Pj(e) {
	Tj.delete(e);
}
//#endregion
//#region src/items/items-window-engine.ts
var Fj = 50, Ij = 1, Lj = .5, Rj = 60, zj = class {
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
			if (this.layout(t), Wj(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = qj(e, ut);
		if (t !== null && tA(e) && Bj(e.getAttribute("data-ui-window-more-after"))) {
			_A(e, Math.max(0, this.windowBottom(e, t) - gA(e).height));
			return;
		}
		t !== null && t !== 0 && _A(e, Bj(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = Uj(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : Hj(n[n.length - 1]).bottom - Hj(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = qj(e, ut), n = Uj(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = gA(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		mg(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${g}][${rt}="windowed"]`)];
	}
	handleScroll(e) {
		let t = hA(e.target);
		if (t === null || mg(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, Rj));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && Wj(e) > 0) return;
		let n = Uj(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = qj(e, ut), i = Bj(e.getAttribute(ft)), a = Bj(e.getAttribute(pt));
		if (r !== null) {
			let o = this.windowSize(e), s = gA(e), c = Math.max(1, Math.round(s.height * Ij / t.itemSize), Math.floor(o * Lj)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, Gj(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, Gj(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = gA(e), s = Math.max(1, o.height * Ij), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, Gj(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, Gj(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = qj(e, dt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Fr(e);
		if (a === null) {
			s("a windowed items host is not inside an addressable component.", e);
			return;
		}
		if (r === null && (t === "Before" || t === "After")) return;
		let o = this.getState(e);
		o.pending = !0;
		try {
			await this.options.requestWindow({
				componentId: a,
				dynamicParameters: Kj(e),
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
			o.pending = !1, this.layout(e), o.restless ? (o.restless = !1, this.considerRequest(e)) : this.realign(e);
		}
	}
	layout(e) {
		let t = this.getState(e), n = Uj(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			LD(e, "top", 0), LD(e, ID, 0);
			return;
		}
		if (n.length > 0) {
			let e = Hj(n[n.length - 1]).bottom - Hj(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / Vj(n))));
		}
		let r = qj(e, dt), i = qj(e, ut), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		LD(e, "top", a), LD(e, ID, o), Nj(e);
	}
	windowSize(e) {
		let t = qj(e, lt);
		return t !== null && t > 0 ? t : Fj;
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
function Bj(e) {
	return e !== null && e.toLowerCase() === "true";
}
function Vj(e) {
	let t = Hj(e[0]).top, n = 1;
	for (; n < e.length && Hj(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function Hj(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function Uj(e) {
	return [...e.children].filter((e) => e.hasAttribute(h));
}
function Wj(e) {
	return Uj(e).length;
}
function Gj(e) {
	return e.getAttribute(h);
}
function Kj(e) {
	let t = e.closest(v);
	return t === null ? [] : Or(t, Dr(t));
}
function qj(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var Jj = [
	m,
	ce,
	le
];
function Yj(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, Xj(c, e.itemRole);
	let l = Qj(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = Zj(l, t, n, a);
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
		d.className = l.wrapperClassName, Xj(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), gj(d, r, n), c.appendChild(d);
	}
	return gj(c, r, n), o.registerItemScope(c, l, n), c;
}
function Xj(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function Zj(e, t, n, r) {
	let i = bj(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function Qj(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of Jj) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), S(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function $j(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return eM(i.renderer.renderItem(e, t, n, r), a);
	let s = Yj(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), eM(s, a);
}
function eM(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var tM = 6, nM = 60, rM = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
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
		let n = tA(e) && rA(e);
		this.project(e, t), this.layout(e, t), n && !rA(e) && (_A(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && Ts(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = F(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? Do(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = mj(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = ng(e), i = this.options.templates.getGroupTemplate(t.componentId), a = og(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => ig(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => sM(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => cg(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = sM(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => cg(e.item, t.item, a))), e !== "" && l.push({
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
		let t = hA(e.target);
		if (t === null || mg(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, nM));
	}
	layout(e, t) {
		let n = t.projected, r = lM(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (cM(e) && a > 0) {
			let r = gA(e), c = aM(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - tM), s = Math.min(a, s + tM);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(sM(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), oM(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				r.header && FD(a, r.entry.key), l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (oM(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of F(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ze}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = uM(i, 0, o), p = uM(i, s, a);
		RD(e, [...l, ...zh(Bh(e))]), LD(e, "top", f > 0 ? f - r : 0), LD(e, ID, p > 0 ? p - r : 0), Vh(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return $j(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && FD(r, t.key), r;
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(sM(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (iM(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(sM(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Ir(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of F(e)) {
			let e = t.getAttribute(h);
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
			scheduled: 0,
			first: -1,
			last: -1
		};
		return this.states.set(e, c), c;
	}
};
function iM(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function aM(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (_A(e, i + s), i + s);
}
function oM(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = sM(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function sM(e) {
	let t = Yh(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function cM(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function lM(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function uM(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var dM = "data-ui-template", fM = "default", pM = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? fM, r = this.findTemplate(e, n);
		return r === void 0 ? n === fM ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${dM}]`);
		for (let e of r) if (e.getAttribute(dM) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= mM(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Je);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Ye);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function mM(e) {
	let t = /* @__PURE__ */ new Set();
	return pa(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(v)) {
			let n = S(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function hM(e, t) {
	let n = e.querySelector(`style[${_n}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(_n, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var gM = "script[type='application/json'][data-ui-metadata]";
function _M(e = document) {
	let t = e.querySelector(gM);
	if (t === null) return vM();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return vM();
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
function vM() {
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
var yM = "script[type='application/json'][data-ui-hydration]";
function bM(e) {
	return e !== null && (Vi(e.title) || Vi(e.changes));
}
function xM(e = document) {
	let t = e.querySelector(yM)?.textContent?.trim() ?? "";
	if (t.length === 0) return null;
	try {
		let e = JSON.parse(t), n = e.words;
		return {
			pageId: e.pageId ?? null,
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
var SM = "reconnecting";
async function CM(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), SM;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function wM(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var TM = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(EM(DM(e)));
	}
	async dispatchAsync(e) {
		let t = DM(e), n = EM(t);
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
function EM(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function DM(e) {
	return {
		eventId: x(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var OM = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && Ts(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = kM(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(AM([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(kM(e, t));
		let n = this.unplaced.get(AM(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = kM(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(AM([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = AM(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, AM(t.slice(0, e - 1)));
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
		return `${x(e.componentId)}:${e.propertyId}:${jM(t)}`;
	}
};
function kM(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function AM(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function jM(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var MM = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, NM = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, PM = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, FM = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, IM = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, LM = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, RM = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, zM = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, BM = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, VM = class {
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
var HM = class {
	constructor() {}
	log(e, t) {}
};
HM.instance = new HM();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var UM = "10.0.11", K = class {
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
function WM(e, t) {
	let n = "";
	return KM(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${GM(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function GM(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function KM(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function qM(e, t, n, r, i, a) {
	let o = {}, [s, c] = ZM();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${WM(i, a.logMessageContent)}.`);
	let l = KM(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function JM(e) {
	return e === void 0 ? new XM(G.Information) : e === null ? HM.instance : e.log === void 0 ? new XM(e) : e;
}
var YM = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, XM = class {
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
function ZM() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, QM(UM, $M(), tN(), eN())];
}
function QM(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function $M() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function eN() {
	if (q.isNode) return process.versions.node;
}
function tN() {
	return q.isNode ? "NodeJS" : "Browser";
}
function nN(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function rN() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var iN = class extends VM {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(rN());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new PM();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new PM();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new NM();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, KM(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new MM(await aN(i, "text") || i.statusText, i.status);
		let a = await aN(i, e.responseType);
		return new BM(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function aN(e, t) {
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
var oN = class extends VM {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new PM()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (KM(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new PM());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new BM(r.status, r.statusText, r.response || r.responseText)) : n(new MM(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new MM(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new NM());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, sN = class extends VM {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new iN(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new oN(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new PM()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, cN = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
cN.RecordSeparatorCode = 30, cN.RecordSeparator = String.fromCharCode(cN.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var lN = class {
	writeHandshakeRequest(e) {
		return cN.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (KM(e)) {
			let r = new Uint8Array(e), i = r.indexOf(cN.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(cN.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = cN.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var uN = class {
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
		return this.observers.push(e), new YM(this, e);
	}
}, dN = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			KM(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new fN(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, KM(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, fN = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, pN = 3e4, mN = 15e3, hN = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var gN = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? pN, this.keepAliveIntervalInMilliseconds = a ?? mN, this._statefulReconnectBufferSize = o ?? hN, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new lN(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new dN(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new PM("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new uN();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${nN(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${nN(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new PM("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${nN(t)}`);
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
}, _N = [
	0,
	2e3,
	1e4,
	3e4,
	null
], vN = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? _N : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, yN = class {};
yN.Authorization = "Authorization", yN.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var bN = class extends VM {
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
		e.headers ||= {}, this._accessToken ? e.headers[yN.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[yN.Authorization] && delete e.headers[yN.Authorization];
	}
	getCookieString(e) {
		return this._innerClient.getCookieString(e);
	}
}, X;
(function(e) {
	e[e.None = 0] = "None", e[e.WebSockets = 1] = "WebSockets", e[e.ServerSentEvents = 2] = "ServerSentEvents", e[e.LongPolling = 4] = "LongPolling";
})(X ||= {});
var Z;
(function(e) {
	e[e.Text = 1] = "Text", e[e.Binary = 2] = "Binary";
})(Z ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AbortController.js
var xN = class {
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
}, SN = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new xN(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = ZM(), i = {
			[n]: r,
			...this._options.headers
		}, a = {
			abortSignal: this._pollAbort.signal,
			headers: i,
			timeout: 1e5,
			withCredentials: this._options.withCredentials
		};
		t === Z.Binary && (a.responseType = "arraybuffer");
		let o = `${e}&_=${Date.now()}`;
		this._logger.log(G.Trace, `(LongPolling transport) polling: ${o}.`);
		let s = await this._httpClient.get(o, a);
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new MM(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${WM(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new MM(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof NM ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? qM(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = ZM();
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
			i ? i instanceof MM && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, CN = class {
	constructor(e, t, n, r) {
		this._httpClient = e, this._accessToken = t, this._logger = n, this._options = r, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		return K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._logger.log(G.Trace, "(SSE transport) Connecting."), this._url = e, this._accessToken && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(this._accessToken)}`), new Promise((n, r) => {
			let i = !1;
			if (t !== Z.Text) {
				r(/* @__PURE__ */ Error("The Server-Sent Events transport only supports the 'Text' transfer format"));
				return;
			}
			let a;
			if (q.isBrowser || q.isWebWorker) a = new this._options.EventSource(e, { withCredentials: this._options.withCredentials });
			else {
				let t = this._httpClient.getCookieString(e), n = {};
				n.Cookie = t;
				let [r, i] = ZM();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${WM(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? qM(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, wN = class {
	constructor(e, t, n, r, i, a) {
		this._logger = n, this._accessTokenFactory = t, this._logMessageContent = r, this._webSocketConstructor = i, this._httpClient = e, this.onreceive = null, this.onclose = null, this._headers = a;
	}
	async connect(e, t) {
		K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._logger.log(G.Trace, "(WebSockets transport) Connecting.");
		let n;
		return this._accessTokenFactory && (n = await this._accessTokenFactory()), new Promise((r, i) => {
			e = e.replace(/^http/, "ws");
			let a, o = this._httpClient.getCookieString(e), s = !1;
			if (q.isNode || q.isReactNative) {
				let t = {}, [r, i] = ZM();
				t[r] = i, n && (t[yN.Authorization] = `Bearer ${n}`), o && (t[yN.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
					...t,
					...this._headers
				} });
			} else n && (e += (e.indexOf("?") < 0 ? "?" : "&") + `access_token=${encodeURIComponent(n)}`);
			a ||= new this._webSocketConstructor(e), t === Z.Binary && (a.binaryType = "arraybuffer"), a.onopen = (t) => {
				this._logger.log(G.Information, `WebSocket connected to ${e}.`), this._webSocket = a, s = !0, r();
			}, a.onerror = (e) => {
				let t = null;
				t = typeof ErrorEvent < "u" && e instanceof ErrorEvent ? e.error : "There was an error with the transport", this._logger.log(G.Information, `(WebSockets transport) ${t}.`);
			}, a.onmessage = (e) => {
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${WM(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${WM(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, TN = 100, EN = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = JM(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new bN(n.httpClient || new sN(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new PM(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new PM(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new ON(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new PM("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < TN);
				if (r === TN && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof SN && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = ZM();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new RM("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof MM && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new RM(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new LM(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new PM(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new zM(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new wN(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new CN(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new SN(this._httpClient, this._logger, this._options);
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
		if (DN(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new FM(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new IM(`'${X[i]}' is disabled by the client.`, i);
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
function DN(e, t) {
	return !e || (t & e) !== 0;
}
var ON = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new kN(), this._transportResult = new kN(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new kN(), this._transportResult.promise;
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
			this._sendBufferedData = new kN();
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
}, kN = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, AN = "json", jN = class {
	constructor() {
		this.name = AN, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = HM.instance);
		let n = cN.parse(e), r = [];
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
		return cN.write(JSON.stringify(e));
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
}, MN = {
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
function NN(e) {
	let t = MN[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var PN = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), FN(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = NN(e);
			this.logger = new XM(t);
		} else this.logger = new XM(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new vN(e) : e : new vN(), this;
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
		let t = new EN(this.url, e);
		return gN.create(t, this.logger || HM.instance, this.protocol || new jN(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function FN(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var IN = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, LN = class {
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
}, RN = class {
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
}, zN = 500;
function BN(e) {
	let { changes: t, ...n } = e;
	return n;
}
function VN() {
	return {};
}
var HN = class {
	windowId;
	connection;
	started = !1;
	gate = new LN();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new RN(t), this.connection = new PN().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
			return this.gate.markAttached(), t;
		} catch (e) {
			throw this.gate.failAttach(e), e;
		}
	}
	async processEventAsync(e) {
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, BN));
	}
	async requestLeaveAsync(e) {
		return await this.invokeAsync("RequestLeaveAsync", [{ target: e }], (e) => this.inbound.answered(e, (e) => e.changes, BN));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, VN, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new IN(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, VN));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), zN);
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
}, UN = "/_ne/values", WN = 3e4;
function GN(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function KN(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function qN(e, t = WN) {
	if (e === void 0 || !KN(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${UN}/${encodeURIComponent(n)}`, {
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
async function JN(e) {
	let t = await fetch(UN, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(WN)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var YN = Promise.resolve(), XN = () => {}, ZN = class {
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
		if (this.handed >= this.given) return YN;
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
		for (; this.flight !== null;) await this.flight.catch(XN);
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = GN(e.value), r = n === null ? null : JN(n);
		return r?.catch(XN), new Promise((i, a) => {
			let o = QN(e), s = this.queue.findIndex((e) => e.field === o), c = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, $N(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof IN) {
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
		let t = this.transport.whenAttached().then(() => JN(e));
		return t.catch(XN), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function QN(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function $N(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/updates/form-owner.ts
var eP = "form-owner", tP = "ui-form-";
function nP(e) {
	return tP + e.replace(/[ \t\n\f\r]/g, "_");
}
function rP(e, t) {
	if (typeof t != "string" || t.trim().length === 0) {
		e.hasAttribute("form") && e.removeAttribute("form");
		return;
	}
	let n = nP(t);
	aP(n), e.getAttribute("form") !== n && e.setAttribute("form", n);
}
function iP(e) {
	for (let t of e.querySelectorAll("[form]")) {
		let e = t.getAttribute("form");
		e !== null && e.startsWith(tP) && aP(e);
	}
}
function aP(e) {
	let t = oP();
	if (t.querySelector(`form[id="${Yn(e)}"]`) !== null) return;
	let n = document.createElement("form");
	n.setAttribute("id", e), n.setAttribute("method", "dialog"), n.setAttribute("novalidate", ""), t.appendChild(n);
}
function oP() {
	let e = document.body.querySelector(`[${_t}]`);
	if (e !== null) return e;
	let t = document.createElement("div");
	return t.setAttribute(_t, ""), t.setAttribute("hidden", ""), document.body.appendChild(t);
}
//#endregion
//#region src/interactions/legacy-commands.ts
var sP = document;
function cP() {
	try {
		return sP.execCommand("copy");
	} catch {
		return !1;
	}
}
function lP(e) {
	try {
		return typeof sP.execCommand == "function" && sP.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/insert-text.ts
function uP(e, t, n) {
	let r = e.itemKey === !0 ? dP(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = fP(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	pP(i, r);
}
function dP(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function fP(e) {
	if (Pa(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Pa(t)) return t;
	return null;
}
function pP(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || w(e) || E(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && lP(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function mP(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = hP(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function hP(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, gP(e));
	return t.toString();
}
function gP(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function _P(e, t) {
	let n = vP([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return vP(r, t);
}
function vP(e, t) {
	let n = null;
	for (let r of e) if (yP(r, t)) {
		if (bP(r, t)) return r;
		n ??= r;
	}
	return n;
}
function yP(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n === "auto" || n === "scroll";
}
function bP(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var xP = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	navigate;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.navigate = e.navigate, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(hr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = hr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = mP(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!Ou(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			this.navigate === void 0 ? window.location.assign(t) : this.navigate(t);
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = yr(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(gn, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = CP(e);
			t !== null && TP(t);
		}), this.register("ScrollTo", (e) => {
			let t = CP(e);
			if (t === null) return;
			let n = e.effect, r = gr(n.behavior), i = _r(n.block);
			t.scrollIntoView({
				behavior: wP(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("ScrollToItem", (e) => {
			let t = CP(e);
			if (t === null) return;
			let n = e.effect, r = Dj(t);
			if (r === null || typeof n.key != "string" || n.key.length === 0) {
				s("scroll to item effect names no items host or no key.", e.effect);
				return;
			}
			let i = _r(n.block);
			Zk(mA(r)), Oj(r, n.key, i === "Unknown" ? "Start" : i, wP(gr(n.behavior))) || s("scroll to item effect names a row the host has not drawn.", e.effect);
		}), this.register("Scroll", (e) => {
			let t = CP(e);
			if (t === null) return;
			let n = e.effect, r = br(n.axis) !== "Horizontal", i = _P(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = vr(n.position), u;
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
			let d = wP(gr(n.behavior)), f = hA(i);
			f !== null && Pj(f), r && l === "End" && tA(i) && Xk(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			SP(CP(e), null);
		}), this.register("Hide", (e) => {
			SP(CP(e), "hidden");
		}), this.register("Collapse", (e) => {
			SP(CP(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = EP(e, this.valueReaders);
			t !== null && DP(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = CP(e);
			t !== null && uP(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = CP(e);
			t !== null && !Zl(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!wu(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!Li(t.message) && !Ri(t.message)) {
				s("show notification effect carries no message.", e.effect);
				return;
			}
			if (this.notifications === void 0) {
				s("show notification effect arrived but no notification engine is wired up.", t.message);
				return;
			}
			this.notifications.show({
				message: t.message,
				severity: t.severity
			});
		});
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
function SP(e, t) {
	if (e !== null) for (let n of Mn) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function CP(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(x(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function wP(e) {
	return e === "Smooth" && !Ws() ? "smooth" : "auto";
}
function TP(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(Oo))) {
		e.focus();
		return;
	}
	let t = Wo(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function EP(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = CP(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : Da(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : xa(t.readHeld(r));
}
async function DP(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!OP(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function OP(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return cP();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var kP = "data-ui-dialog-close-backdrop", AP = "data-ui-dialog-close-escape", jP = "data-ui-dialog-backdrop", MP = class {
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
		let n = $o(t.querySelector(".ui-dialog__surface") ?? t, Wo(t));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && as(ns(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${Pc}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${jP}]`);
		if (n === null) return;
		let r = n.closest(`[${Pc}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(kP)) return;
		let i = r.getAttribute(Pc);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(AP) && !Jc() && !Bc(e.target) && !Tf(e.target)) {
				let n = t.getAttribute(Pc);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(v)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return Ic(this.root);
	}
	trapTab(e, t) {
		let n = Go(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = Jo(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, NP = "ui-leave", PP = "data-ui-leave-part", FP = "560px", IP = null;
function LP(e, t) {
	let n = document.querySelector(`[data-ui-dialog="${NP}"]`) ?? RP(e);
	VP(n, "title", C.text("ui.leave.title")), VP(n, "message", C.text("ui.leave.message")), VP(n, "stay", C.text("ui.leave.stay")), VP(n, "leave", C.text("ui.leave.confirm")), IP = t, e.open(NP);
}
function RP(e) {
	let t = BP("div", "ui-dialog ui-leave-dialog");
	t.setAttribute(Pc, NP), t.setAttribute(Fc, ""), t.setAttribute("data-ui-dialog-close-escape", ""), t.setAttribute("data-ui-dialog-close-backdrop", ""), t.setAttribute("hidden", "");
	let n = BP("div", "ui-dialog__backdrop");
	n.setAttribute("data-ui-dialog-backdrop", "");
	let r = BP("div", "ui-dialog__surface");
	r.setAttribute("role", "alertdialog"), r.setAttribute("tabindex", "-1"), r.setAttribute("aria-modal", "true"), r.setAttribute("aria-labelledby", "ui-leave-title"), r.setAttribute("aria-describedby", "ui-leave-message"), r.style.setProperty("--ui-max-width-sm", FP);
	let i = BP("h2", "ui-leave-dialog__title ui-text-type--subtitle", "title"), a = BP("p", "ui-leave-dialog__message ui-text-type--body", "message");
	i.id = "ui-leave-title", a.id = "ui-leave-message";
	let o = BP("div", "ui-leave-dialog__actions");
	return o.append(zP("ui-button--outline", "stay"), zP("ui-button--danger", "leave")), r.append(i, a, o), t.append(n, r), t.addEventListener("click", (t) => {
		let n = t.target instanceof Element ? t.target.closest(`[${PP}]`)?.getAttribute(PP) : null;
		if (n !== "stay" && n !== "leave") return;
		let r = IP;
		IP = null, e.close(NP), n === "leave" && r?.();
	}), document.body.append(t), t;
}
function zP(e, t) {
	let n = BP("button", `ui-button ${e}`, t);
	return n.type = "button", n;
}
function BP(e, t, n) {
	let r = document.createElement(e);
	return r.className = t, n !== void 0 && r.setAttribute(PP, n), r;
}
function VP(e, t, n) {
	let r = e.querySelector(`[${PP}="${t}"]`);
	r !== null && r.textContent !== n && (r.textContent = n);
}
//#endregion
//#region src/interactions/leave-guard.ts
var HP = class {
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
		let t = UP(e, this.options.window.location.href);
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
function UP(e, t) {
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
	return Ou(s) ? s : null;
}
//#endregion
//#region src/rendering/web-dom-converters.ts
var WP = /* @__PURE__ */ new Map([
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
	["KeepSearchInput", "keep"],
	["ReplaceWithSelectedItem", "replace"],
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
]), GP = [
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
	"overlay"
];
function KP(e) {
	return Q(e, GP);
}
var qP = [
	"small",
	"medium",
	"large"
], JP = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], YP = [
	"start",
	"center",
	"end",
	"justify"
], XP = ["nowrap", "wrap"], ZP = /* @__PURE__ */ new Map([
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
	["overlay", "--ui-color-overlay"]
]), QP = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), $P = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), eF = ["inline", "trailing"], tF = [
	"filled",
	"outline",
	"underline",
	"ghost"
], nF = [
	"small",
	"medium",
	"large"
], rF = [
	"small",
	"medium",
	"large"
], iF = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], aF = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], oF = ["light", "dark"], sF = [
	"start",
	"center",
	"end",
	"stretch"
], cF = ["clip", "visible"], lF = [
	"visible",
	"hidden",
	"collapsed"
], uF = [
	"background",
	"raised",
	"tinted"
], dF = ["horizontal", "vertical"], fF = [
	"none",
	"gap",
	"rule"
], pF = [
	"none",
	"one",
	"many"
], mF = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], hF = ["stack", "wrap"], gF = ["end", "start"], _F = [
	"disabled",
	"auto",
	"always"
], vF = [
	"disabled",
	"proximity",
	"mandatory"
], yF = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], bF = ["hex", "rgb"], xF = ["field", "swatch"], SF = [
	"fill",
	"contain",
	"cover",
	"none"
], CF = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], wF = ["linear", "circular"], TF = ["keep", "replace"], EF = [
	"none",
	"vertical",
	"horizontal",
	"both"
], DF = [
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
], OF = [
	"None",
	"Shade",
	"Tint"
], kF = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, GP)}`],
	["themeColorClass", (e) => iI(e)],
	["iconClass", (e) => Gu(e)],
	["iconUrlCss", (e) => Ru(e)],
	["safeUrl", (e) => Tu(e)],
	["safeImageSource", (e) => Nu(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : By(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, qP)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, JP)}`],
	["textAppearanceClass", (e) => pI(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, YP)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, XP)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, eF)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, aF)}`],
	["badgeTextFit", (e) => aI(e)],
	["buttonClass", (e) => `ui-button--${Q(e, iF)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, uF)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, dF)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, fF)}`],
	["selectionModeAttribute", (e) => Q(e, pF)],
	["selectionBackgroundCss", (e) => ZF(JF(e, "background"))],
	["selectionForegroundCss", (e) => ZF(JF(e, "foreground"))],
	["selectionMarkColorCss", (e) => ZF(JF(e, "markColor"))],
	["selectionMarkCss", (e) => XF(JF(e, "mark"))],
	["selectionFontWeightCss", (e) => YF(JF(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, hF)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, gF)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, _F)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, _F)}`],
	["hostViewport", (e) => RF(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, vF)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, tF)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, rF)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, nF)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, nF)}`],
	["textInputTypeAttribute", (e) => Q(e, yF)],
	["colorTextFormatAttribute", (e) => Q(e, bF)],
	["colorInputVariantAttribute", (e) => Q(e, xF)],
	["themeNameCss", (e) => Q(e, oF)],
	["alignmentCss", (e) => Q(e, sF)],
	["alignmentStretchFallbackCss", (e) => Q(e, sF) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, cF)],
	["layoutLengthCss", (e) => zF(e)],
	["thicknessCss", (e) => VF(e)],
	["borderNoneClass", (e) => UF(e)],
	["radiusCss", (e) => WF(e)],
	["gridUnitCss", (e) => GF(e)],
	["pixelsCss", (e) => CI(e)],
	["gridTemplateCss", (e) => KF(e)],
	["colorVariantCss", (e) => _I(e)],
	["themeColorCss", (e) => ZF(e)],
	["themeInkCss", (e) => $F(e)],
	["themeOnColorCss", (e) => tI(e)],
	["themeColorInlineCss", (e) => QF(e) ? "" : ZF(e)],
	["themeColorCanonical", (e) => hI(e)],
	["textAppearanceFontSizeCss", (e) => mI(e, "size")],
	["textAppearanceFontWeightCss", (e) => mI(e, "weight")],
	["textAppearanceLineHeightCss", (e) => mI(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => mI(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => zF(H(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => zF(H(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => zF(H(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => zF(H(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => zF(H(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => BF(H(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => BF(H(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => BF(H(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => BF(H(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => BF(H(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => BF(H(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => BF(H(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => BF(H(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => BF(H(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => BF(H(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => VF(H(e, "base"))],
	["responsiveThicknessSmCss", (e) => VF(H(e, "sm"))],
	["responsiveThicknessMdCss", (e) => VF(H(e, "md"))],
	["responsiveThicknessXlCss", (e) => VF(H(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => VF(H(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => HF(H(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => HF(H(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => HF(H(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => HF(H(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => HF(H(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => HF(H(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => HF(H(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => HF(H(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => HF(H(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => HF(H(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => wI(H(e, "base"))],
	["responsivePixelsSmCss", (e) => wI(H(e, "sm"))],
	["responsivePixelsMdCss", (e) => wI(H(e, "md"))],
	["responsivePixelsXlCss", (e) => wI(H(e, "xl"))],
	["responsivePixelsXxlCss", (e) => wI(H(e, "xxl"))],
	["visibilityBaseAttribute", (e) => TI(e, "base")],
	["visibilitySmAttribute", (e) => TI(e, "sm")],
	["visibilityMdAttribute", (e) => TI(e, "md")],
	["visibilityXlAttribute", (e) => TI(e, "xl")],
	["visibilityXxlAttribute", (e) => TI(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, SF)}`],
	["backgroundImageCss", (e) => NF(e)],
	["imageFitSizeCss", (e) => Q(e, CF)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, wF)}`],
	["progressValueText", (e) => SI(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, TF)}`],
	["textAreaResizeCss", (e) => Q(e, EF)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, DF)}`],
	["popupPlacementAttribute", (e) => Q(e, DF)],
	["tabMenuEntriesAttribute", (e) => jF(e)],
	["markedDaysAttribute", (e) => MF(e)]
]), AF = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function jF(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = AF.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function MF(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function NF(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : zu(t);
}
var PF = [
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
		20,
		"SolarAmber",
		200,
		100,
		40
	],
	[
		21,
		"NebulaGold",
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
], FF = new Map(PF.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), IF = new Map(PF.map(([e, t]) => [e, t])), LF = /* @__PURE__ */ new Map([[cF, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : LF.get(t)?.get(e)) ?? WP.get(e) ?? Xn(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function RF(e) {
	return e == null || Q(e, _F) === "disabled" ? void 0 : "parent";
}
function zF(e) {
	if (e == null) return "";
	if (typeof e == "number") return CI(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? CI(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function BF(e, t) {
	if (typeof e != "object" || !e) return zF(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? zF(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function VF(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function HF(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return CI(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return CI(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function UF(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function WF(e) {
	if (e == null) return "";
	if (typeof e == "number") return CI(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? CI(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function GF(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return CI(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function KF(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return GF(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return GF(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${GF(e[0])})` : e.map((e) => GF(e)).join(" ");
}
function $(e, t, n) {
	return qF(H(e, t), n);
}
function qF(e, t) {
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
function JF(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function YF(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function XF(e) {
	if (e == null) return "";
	switch (Q(e, mF)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function ZF(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (gI(e)) return _I(e);
	let t = e, n = _I(t.light), r = _I(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = ZP.get(Q(o, GP));
	return s ? `var(${s})` : "";
}
function QF(e) {
	if (typeof e != "object" || !e || gI(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function $F(e) {
	if (QF(e)) {
		let t = QP.get(Q(e.style, GP));
		if (t !== void 0) return `var(${t})`;
	}
	return ZF(e);
}
var eI = /* @__PURE__ */ new Set(["background", "surface"]);
function tI(e) {
	if (typeof e != "object" || !e) return "";
	if (gI(e)) return nI(e) ? "initial" : rI(e);
	let t = e, n = rI(t.light ?? t.dark), r = rI(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && nI(t.light ?? t.dark) && nI(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, GP);
	if (eI.has(i)) return "initial";
	let a = $P.get(i);
	return a ? `var(${a})` : "";
}
function nI(e) {
	return vI(e)?.[3] === 0;
}
function rI(e) {
	let t = vI(e);
	return t === void 0 ? "" : ZT(t[0], t[1], t[2], t[3]);
}
function iI(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, GP)}`;
}
function aI(e) {
	let t = lI(e == null ? "" : String(e).trim(), oI + 1);
	return t > 0 && t <= oI ? "compact" : "";
}
var oI = 2, sI = /[\u0300-\uFFFF]/, cI = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function lI(e, t) {
	if (!sI.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of cI.segment(e)) {
		if (n >= t) break;
		n += uI(r) ? 2 : 1;
	}
	return n;
}
function uI(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < dI.length; e += 2) if (t >= dI[e] && t <= dI[e + 1]) return !0;
	return !1;
}
var dI = [
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
function fI(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(Me, aI(n)), e.setAttribute(Ne, "");
}
function pI(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, JP)}`;
}
function mI(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return CI(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : CI(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : CI(e);
		}
		default: return "";
	}
}
function hI(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = yI(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${XT(r.rgb >> 16 & 255)}${XT(r.rgb >> 8 & 255)}${XT(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${XT(e)}`;
	}
	let i = bI(r.name);
	return i === null ? "" : `${i}/${xI(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function gI(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function _I(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = vI(e);
	return t === void 0 ? "" : `#${XT(t[0])}${XT(t[1])}${XT(t[2])}${XT(t[3])}`;
}
function vI(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = bI(t.name), i = n ?? (r === null ? void 0 : FF.get(r));
	if (!i) return;
	let a = xI(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = U(c * (1 - o)), l = U(l * (1 - o)), u = U(u * (1 - o))) : a === "Tint" && (c = U(c + (255 - c) * o), l = U(l + (255 - l) * o), u = U(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function yI(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = GP[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function bI(e) {
	if (typeof e == "number") return IF.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function xI(e) {
	if (typeof e == "number") return OF[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function SI(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function CI(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function wI(e) {
	return e == null ? "" : CI(e);
}
function TI(e, t) {
	let n = HS(e, t);
	if (n == null) return;
	let r = Q(n, lF);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var EI = "ui-notification-host", DI = "ui-notification", OI = "ui-notification--leaving", kI = "ui-notification__message", AI = "ui-notification__action", jI = "ui-notification__close", MI = 5e3, NI = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), PI = class {
	root;
	durationMs;
	host = null;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? MI, this.ensureHost();
	}
	show(e) {
		let t = KP(e.severity), n = document.createElement("div");
		n.className = NI.has(t) ? `${DI} ${DI}--${t}` : DI, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = kI, typeof e.message == "string" ? r.textContent = e.message : C.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		if (i.type = "button", i.className = jI, i.setAttribute("aria-label", C.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(II(e.action)), this.ensureHost().append(n), n.addEventListener("focusin", (e) => {
			let t = e.relatedTarget;
			t instanceof HTMLElement && !n.contains(t) && this.focusOrigins.set(n, t);
		}), e.sticky === !0) return n;
		let a = !1, o = !1, s = window.setTimeout(() => this.dismiss(n), this.durationMs), c = () => window.clearTimeout(s), l = () => {
			a || o || (window.clearTimeout(s), s = window.setTimeout(() => this.dismiss(n), this.durationMs));
		};
		return n.addEventListener("mouseenter", () => {
			a = !0, c();
		}), n.addEventListener("mouseleave", () => {
			a = !1, l();
		}), n.addEventListener("focusin", () => {
			o = !0, c();
		}), n.addEventListener("focusout", (e) => {
			e.relatedTarget instanceof Node && n.contains(e.relatedTarget) || (o = !1, l());
		}), n;
	}
	dismiss(e) {
		if (!(!e.isConnected || e.classList.contains(OI))) {
			if (e.classList.add(OI), this.returnFocus(e), Ws() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => FI(e), j.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(OI));
		as(ns(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${jI}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${EI}`), n = t ?? document.createElement("div");
		return n.classList.add(EI), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function FI(e) {
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
		duration: j.fast,
		easing: j.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function II(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${AI} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var LI = class {
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
		!this.state.set(e, t, n, zI(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return ma(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Le), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, zI(r[0]?.component)) ? {
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
			(typeof n == "string" || Ri(n) ? this.addressResolver.isTranslatable(t.reference) : Li(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${Ie}${Xn(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of $n(e, t, () => RI(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Le))), r = e.closest(v);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Le)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			ja(e);
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
function RI(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(v) === e) return [n];
	return [e];
}
function zI(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(v) ?? null, r = e === null ? 0 : S(e), i = n.getAttribute(h);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: Or(e, Dr(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var BI = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of cs) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t.valueReaders), !0);
	}
	watch(e, t) {
		let n = x(e.componentId), r = VI(n, e.propertyId), i = this.watchers.get(r);
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
		let n = Fr(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.readBound(e.target);
		for (let e of r) {
			let t = this.propertyPatchEngine.recordValue(e, [], i);
			t !== null && this.notify(t);
		}
	}
	notify(e) {
		let t = VI(x(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function VI(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function HI(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : S(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var UI = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, WI(t));
	}
	apply(e) {
		let t = x(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), fr(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) GI(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) KI(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) qI(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) JI(n, t.key, t.newIndex);
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
function WI(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function GI(e, t) {
	typeof t.key == "string" && (KI(e, t.key), e.splice(YI(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function KI(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function qI(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		GI(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function JI(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(YI(n, e.length), 0, i);
}
function YI(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/items/pending-moves.ts
var XI = class {
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
}, ZI = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function QI(e, t, n, r) {
	return {
		action: fr(e.action),
		component: t,
		componentId: n,
		dynamicParameters: r,
		items: (e.items ?? []).map((e) => ({
			key: e.key ?? null,
			oldKey: e.oldKey ?? null,
			index: e.index ?? null,
			item: e.item
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
var $I = [], eL = class {
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
	held = new UI();
	moves = new XI({
		indexOf: (e, t) => this.indexOfRow(e, t),
		move: (e, t, n) => this.moveRow(e, t, n)
	});
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${g}]`)) {
			let e = Fr(n);
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
			return n === void 0 && (n = cL(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${g}]`)) {
			let t = Ir(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(t.componentId, n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (mr(t) !== "CollectionChange") continue;
			let e = t;
			if (fr(e.action) !== "Insert") continue;
			let r = x(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, sL(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of HI(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${g}]`)) {
			let t = Fr(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		KD(e, t, {
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
				let r = aL(n, t[e + 1]);
				if (r === null || this.namesSink(r)) {
					this.applyUpdate(n);
					continue;
				}
				e++, this.applyCollectionRefill(r);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Ue) === !0;
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
		this.moves.around(e, $I, () => this.refillHostRows(e, t));
	}
	refillHostRows(e, t) {
		if (mg(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = cL(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && Ts(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), oL(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
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
		switch (mr(e)) {
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
		let t = x(e.address?.component?.id), n = pr(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		} : i, r, e.value, !1);
	}
	applyValidationUpdate(e) {
		if (x(e.address?.component?.id) <= 0) {
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
		let t = x(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, QI(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (fr(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		let c = fr(e.action) === "Move" ? rL(e.moves ?? []) : $I;
		for (let n of o) a && this.held.isWaiting(n) || this.moves.around(n, c, () => this.applyCollectionChangeToHost(n, t, e));
	}
	applyCollectionChangeToHost(e, t, n) {
		if (mg(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (fr(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				tL(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				iL(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Cg(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	indexOfRow(e, t) {
		let n = mg(e) === "virtualized" ? this.virtualization.keysOf(e)?.indexOf(t) ?? -1 : _g(e, F(e)).findIndex((e) => e.getAttribute(h) === t);
		return n < 0 ? null : n + hg(e);
	}
	moveRow(e, t, n) {
		let r = Fr(e);
		if (r === null) return;
		let i = Math.max(0, n - hg(e));
		mg(e) === "virtualized" ? this.virtualization.move(e, t, i) : iL(e, [{
			key: t,
			newIndex: i
		}]), this.syncItemsHost(e, r), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (fr(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (fr(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${g}]`)) if (Fr(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = _g(e, F(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, yg(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return $j(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = F(e), a = _g(e, i), o = cL(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, yg(a, l, i.index ?? null)) : (Sg(a, c, l), c.replaceWith(l)));
		}
	}
};
function tL(e, t) {
	let n = F(e), r = _g(e, n), i = cL(e, n), a = nL(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? Do(a, o, n) : null;
		i.delete(t), bg(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function nL(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function rL(e) {
	return e.map((e) => e.key).filter((e) => typeof e == "string");
}
function iL(e, t) {
	let n = F(e), r = _g(e, n), i = cL(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		let a = xg(r, t, n.newIndex ?? null);
		e.insertBefore(t, a ?? r[r.length - 2]?.nextSibling ?? null);
	}
}
function aL(e, t) {
	if (t === void 0 || mr(e) !== "CollectionChange" || mr(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (fr(n.action) !== "Reset" || fr(r.action) !== "Insert") return null;
	let i = x(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== x(r.component?.id) || !Ts(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function oL(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? F(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function sL(e) {
	let t = S(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : S(n);
}
function cL(e, t = F(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(h);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function lL(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Li(n) || Ri(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: dL(t.severity)
	} : void 0;
}
function uL(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = C.resolve(Li(t) || Ri(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function dL(e) {
	let t = lr(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var fL = "ui-validation--warning", pL = "ui-validation--info", mL = "data-ui-validation-message", hL = "ui-validation-message--marker", gL = "top-end", _L = "--ui-validation-marker-host", vL = "ui-validation-mark", yL = "--ui-validation-presentation", bL = "--ui-validation-color", xL = "Validation", SL = `input:not([type='hidden']), textarea, select, .${Un}[role='combobox'], [role='spinbutton']`, CL = {
	Error: 0,
	Warning: 1,
	Info: 2
}, wL = {
	Error: qn,
	Warning: fL,
	Info: pL
}, TL = `.${qn}, .${fL}, .${pL}`, EL = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, DL = {
	Error: `${vL}--error`,
	Warning: `${vL}--warning`,
	Info: `${vL}--info`
}, OL = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, kL = class {
	options;
	root;
	failingRulesByElement = /* @__PURE__ */ new WeakMap();
	refusalByElement = /* @__PURE__ */ new WeakMap();
	boundMessageByElement = /* @__PURE__ */ new WeakMap();
	packageMarkByElement = /* @__PURE__ */ new WeakMap();
	touchedElements = /* @__PURE__ */ new WeakSet();
	markerMirrors = /* @__PURE__ */ new WeakMap();
	messageLines = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(TL)), M(this.root, TL, { childList: !0 }, (e) => this.applyRenderedMessages(e)), C.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(TL)), this.rewriteMessageLines();
		});
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			ML(t, AL(t) === "Error");
			let e = t.querySelector(`:scope > [${mL}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && NL(this.markerMirrors, t, e, {
				message: n,
				severity: AL(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === xL) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = x(e.reference.componentId), n = lL(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = x(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => cr(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = x(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = Li(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: dL(e.severity),
			content: e.content === !0
		}), this.touchedElements.add(a)) : this.refusalByElement.delete(a), this.applyCurrentState(t, a);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: OL[t]
		}), this.applyCurrentState(S(e), e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		jL(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${x(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(uL).join("\n"), !0);
	}
	rewriteMessageLines() {
		for (let e of this.messageLines.values()) this.writeLines(e);
	}
	resolveDisplay(e, t) {
		let n = [], r = this.refusalByElement.get(t), i = this.boundMessageByElement.get(t), a = this.packageMarkByElement.get(t);
		r !== void 0 && n.push(r), i !== void 0 && n.push(i), a !== void 0 && n.push(a);
		let o = this.failingRulesByElement.get(t);
		if (o !== void 0) for (let t of this.options.metadata.getValidationsForComponent(e)) o.has(t) && n.push({
			message: t.message,
			severity: dL(t.severity)
		});
		let s;
		for (let e of n) (s === void 0 || CL[e.severity] < CL[s.severity]) && (s = e);
		return s;
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => cr(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${gt}="${Yn(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => cr(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && dL(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) Ns(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function AL(e) {
	return e.classList.contains(fL) ? "Warning" : e.classList.contains(pL) ? "Info" : "Error";
}
function jL(e, t, n) {
	for (let e of Object.values(wL)) t.classList.toggle(e, n !== void 0 && wL[n.severity] === e);
	ML(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(bL) : r.style.setProperty(bL, `var(--ui-color-${EL[n.severity]})`);
	let i = t.querySelector(`[${mL}]`);
	i !== null && (n?.content === !0 ? (la(i, null), i.textContent = String(n.message ?? "")) : C.writeValue(i, null, n?.message ?? null), NL(e, r, i, n));
}
function ML(e, t) {
	for (let n of e.querySelectorAll(SL)) {
		let r = n.closest(Hn);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function NL(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(yL).trim() === "marker";
	if (n.classList.toggle(hL, a), r !== void 0 && a) {
		n.setAttribute(ke, n.textContent ?? ""), n.setAttribute(Ae, gL), t.setAttribute(je, ""), PL(e, t, r, n.textContent ?? "", i.getPropertyValue(_L).trim()), t.contains(document.activeElement) ? rS(n) : iS(n);
		return;
	}
	n.removeAttribute(ke), n.removeAttribute(Ae), t.removeAttribute(je), PL(e, t, void 0, "", ""), iS(n);
}
function PL(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : FL(t, i);
	if (n === void 0 || o === null) {
		a?.remove(), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${vL} ${DL[n.severity]}`, s.textContent = r, s.setAttribute(ke, r), s.setAttribute(Ae, gL), s.parentElement !== o && o.append(s), e.set(t, s), iS(s);
}
function FL(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var IL = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, LL = "tooltip-name";
function RL(e, t, n) {
	let r = By(e.getAttribute(ke));
	if (la(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var zL = /* @__PURE__ */ new WeakMap(), BL = /* @__PURE__ */ new Map([["iconClass", Wu]]), VL = /* @__PURE__ */ new WeakMap(), HL = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(ur(e), t);
	}
	apply(e) {
		let t = ur(e.operation.kind), n = this.handlers.get(t);
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
			let t = xa(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), la(e.target, null);
		}), this.register("Markup", (e) => {
			Hy(e.target, Sa(e.convertedValue) ? "" : xa(e.convertedValue)), la(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = YL(e.operation);
			if (la(e.target, t), Sa(e.value) || Sa(e.convertedValue)) {
				JL(e.target, t);
				return;
			}
			qL(e.target, t, xa(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = YL(e.operation);
			la(e.target, t), JL(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = YL(e.operation), n = !Sa(e.value) && UL(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (Sa(e.convertedValue) ? "" : xa(e.convertedValue));
			WL(e.target, KL(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !Sa(e.value) && UL(e.value, e.operation.condition ?? "None") ? xa(e.convertedValue).trim() : "";
			GL(e.target, KL(e), t, BL.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = YL(e.operation), n = !Sa(e.value) && UL(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? xa(e.convertedValue).trim() : "";
				GL(e.target, KL(e), t);
			}
		}), this.register("Style", (e) => {
			let t = YL(e.operation), n = e.target;
			if (Sa(e.value) || Sa(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = xa(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(LL, (e) => RL(e.resolved.component, e.target, YL(e.operation))), this.register(eP, (e) => rP(e.target, e.value)), this.register("Property", (e) => {
			let t = YL(e.operation), n = e.target, r = Sa(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function UL(e, t) {
	switch (dr(t)) {
		case "None": return !0;
		case "HasValue": return !Sa(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !Sa(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Gu(e).length > 0;
		default: return !Sa(e);
	}
}
function WL(e, t, n, r, i) {
	let a = VL.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), VL.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), qL(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && JL(e, n);
}
function GL(e, t, n, r) {
	let i = zL.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), zL.set(e, i));
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
function KL(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function qL(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function JL(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function YL(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var XL = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => kF.has(e.name),
			convert: (e) => kF.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = ZL(e.name), n = {
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
function ZL(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var QL = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = xr(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = xr(e.domEventName) || t;
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
		return this.definitions.get(xr(e));
	}
};
function $L(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function eR(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => $L(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => $L(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("enter"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var tR = class {
	converters = new XL();
	events = new QL();
	operations = new HL();
	valueReaders;
	collectionSinks = new ZI();
	rowDecorators = new IL();
	constructor(e, t, n, r) {
		eR(this.events), this.valueReaders = new wa(r);
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
}, nR = "Submenu", rR = "ui-menu__submenu", iR = "Select", aR = {
	kind: "menu",
	decorate: oR
};
function oR(e) {
	if (!sR(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, nR);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(bt, ""), cR(e.item, "Kind") === iR && e.row.setAttribute(xt, ""), cR(e.item, "Expanded") === !0 && e.row.setAttribute(St, "");
	let r = document.createElement("div");
	r.className = rR, r.appendChild(n), gj(r, e.key, e.item), e.row.appendChild(r);
}
function sR(e) {
	let t = cR(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function cR(e, t) {
	let n = Yh(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var lR = {
	kind: "grip",
	decorate: uR
};
function uR(e) {
	e.row.append(dR());
}
function dR() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), C.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function fR(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(mR(n));
	for (let t of e.querySelectorAll(`[${Ke}]`)) pR(t, Ge, r), pR(t, qe, i);
}
function pR(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function mR(e) {
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
var hR = 2;
function gR(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= hR && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function _R(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var vR = "ne.standard.ui.windowId", yR = [
	500,
	1e3,
	2e3
], bR = 3, xR = [
	["refusal", ({ root: e }) => JA(e)],
	["file input", ({ root: e, validation: t }) => new au({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n, dialogs: r }) => new lf({
		root: e,
		validation: t,
		propertyPatchEngine: n,
		dialogs: r
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new wf({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new Hf({ root: e })],
	["field box press", ({ root: e }) => new If({ root: e })],
	["image fallback", ({ root: e }) => new Yf({ root: e })],
	["radio group sync", ({ root: e }) => new ap({ root: e })],
	["select interaction", ({ root: e }) => new gm({ root: e })],
	["search input", ({ root: e }) => new Op({ root: e })],
	["debounced commit", ({ root: e }) => new km({ root: e })],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => Mm() ? void 0 : new Nm({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new YD({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Gm({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new DE({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new zv({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new fy({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new Ty({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new Sk({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new Uk({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new qb({ root: e })],
	["split button", ({ root: e }) => new Gw({ root: e })],
	["toggle button", ({ root: e }) => new Of({ root: e })],
	["button group", ({ root: e }) => new Zw({ root: e })],
	["menu", ({ root: e }) => new yC({ root: e })],
	["action bar", ({ root: e }) => new mS({ root: e })],
	["collapsible", ({ root: e }) => new QC({ root: e })],
	["menu group", ({ root: e }) => new iC({ root: e })],
	["menu search", ({ root: e }) => new jC({ root: e })],
	["side drawer", ({ root: e }) => new GC({ root: e })],
	["grid splitter", ({ root: e }) => new Aw({ root: e })],
	["accordion", ({ root: e }) => new tT({ root: e })],
	["tabs", ({ root: e }) => new ET({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new $O({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new FT({ root: e })],
	["breadcrumbs", ({ root: e }) => new JT({ root: e })],
	["scroll anchor", ({ root: e }) => new Qk({ root: e })],
	["surface press", ({ root: e }) => new oA({ root: e })],
	["text selection", ({ root: e }) => new fA({ root: e })],
	["scroll group", ({ root: e }) => new wA({ root: e })],
	["flyout interaction", ({ root: e }) => new yl({ root: e })],
	["text fold", ({ root: e }) => new pk({ root: e })],
	["tooltip", ({ root: e }) => Mx(e)]
], SR = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new tr(_M());
	hydration = xM();
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
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = ER(e.windowIdStorageKey ?? vR), this.dom = new Pr(this.root), C.load(this.root), C.setLanguage(document.documentElement.lang), e.strings !== void 0 && C.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : C.loadTableAsync(this.hydration.words.href)), this.extensions = new tR(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(aR), this.extensions.registerRowDecorator(lR);
		let t = new Er(this.dom, this.metadata), n = this.extensions.operations, r = new OM(), i = new LI(t, n, this.extensions, r);
		this.reactiveSources = new BI(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders
		}), this.dialogs = new MP({ root: this.root }), this.notifications = new PI({ root: this.root }), this.effects = new xP({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e)),
			navigate: (e) => this.leaveGuard.navigate(e)
		});
		let a = new Rs(this.metadata), o, u = new Os(a, i, new Ms(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(x(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new pM(this.dom), f = new fj(this.metadata, d, this.extensions, n, r);
		this.virtualization = new rM({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new eL(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), C.onChange(() => this.rewriteWords(i, f)), this.rewriteMoments = () => this.rewriteWords(i, f, !0), C.onMomentTick(this.rewriteMoments), new Sj({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new HN(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new TM(this.transport), C.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(er.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(er.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				hM(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && hM(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let p = new ZN(this.transport);
		o = new ps({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(er.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		}), this.leaveGuard = new HP({
			window,
			ask: async (e) => (await o?.whenSent(), (await this.transport.requestLeaveAsync(e)).command?.effects),
			apply: (e) => {
				this.effects.applyAll(e, this.dom), this.windows.reconsider();
			},
			confirm: (e, t) => LP(this.dialogs, t),
			pending: () => Dm() || p.isBusy,
			settle: async () => {
				Om(), await p.whenAnsweredAsync();
			}
		}), this.updateProcessor.addPageHandler((e) => this.leaveGuard.set(e.holdsUnsavedWork === !0)), this.effects.register(er.ConfirmLeave, (e) => {
			let t = e.effect.target;
			if (!Ou(t)) {
				s("confirm leave effect names no address of this site; nothing asked.", e.effect);
				return;
			}
			this.leaveGuard.confirm(t);
		});
		let ee = new kL({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			propertyPatchEngine: i,
			updateProcessor: this.updateProcessor,
			valueReaders: this.extensions.valueReaders
		});
		this.engineContext = {
			root: this.root,
			dom: this.dom,
			propertyPatchEngine: i,
			effects: this.effects,
			validation: ee,
			dialogs: this.dialogs
		};
		for (let [e, t] of xR) gR(e, t, this.engineContext);
		gR("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new Nh({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), gR("tree", ({ root: e, effects: t }) => new vO({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), gR("items reorder", ({ root: e }) => new Ng({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), gR("press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new zA({
			root: e,
			clicks: (e) => this.metadata.hasServerEventForComponent("click", S(e)) || u.hasEventForComponent("click", S(e))
		}) : void 0, this.engineContext), this.eventPipeline = new xs({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: this.dispatcher,
			afterEffects: () => this.windows.reconsider(),
			interactionEngine: u,
			eventCatalog: this.extensions.events,
			effects: this.effects,
			events: e.events,
			validationEngine: ee,
			valueBinding: o
		});
		for (let e of /* @__PURE__ */ new Set([...this.metadata.getEventNames(), ...a.getSourceEventNames()])) this.eventPipeline.addEvent(e);
		this.eventPipeline.addEvent(ZO.name, ZO.registration);
		let te = jg(this.updateProcessor.moves);
		this.eventPipeline.addEvent(te.name, te.registration), this.eventPipeline.addEvent(Vf.name, Vf.registration), this.tables = new yD({ root: this.root }), this.windows = new zj({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: C,
			observeComponents: M,
			observeSize: KE,
			store: new KS(),
			numbers: ph,
			temporal: vi,
			icons: { apply: Hu },
			badges: { writeCount: fI },
			urls: {
				isImageSource: ju,
				asBrowserReads: Au
			},
			values: {
				read: (e) => this.readPluginValue(e),
				hold: (e) => o?.hold(e),
				release: (e) => {
					o?.release(e) === !0 && i.restoreBoundValue(e, this.dom.resolveNearestComponent(e, () => !0)?.dynamicParameters ?? []);
				},
				write: (e, t) => i.writeBoundValue(e, t)
			},
			properties: { set: (e, t, n) => {
				let r = e.closest(v), a = r === null ? void 0 : this.metadata.getExposedProperty(S(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: nS,
			renames: { open: Vc },
			tables: this.tables,
			rows: dj(d, f, this.virtualization),
			uploads: Jl,
			selection: fo,
			popups: uj,
			roving: za,
			states: ba,
			validation: ee,
			wheel: md,
			names: Jn
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
		}), this.transport.onClosed((e) => this.loseConnection(e ?? /* @__PURE__ */ Error("the connection to the server closed.")));
	}
	gateInbound(e) {
		if (e === null) return;
		let t = e.then(() => void 0, () => void 0);
		this.inbound = t, t.then(() => {
			this.inbound === t && (this.inbound = null);
		});
	}
	readPluginValue(e) {
		let t = Da(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.read(t);
	}
	async switchLanguageAsync(e, t) {
		if (e === C.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		C.setRequested(e);
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
			if (n !== this.languageSwitches || i === C.language || !await C.switchToAsync(i, r)) return;
			C.notifyChanged();
		} finally {
			n === this.languageSwitches && C.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), C.language !== this.culturesLanguage && (this.culturesLanguage = C.language, pa(this.root, (e) => fR(e, C.number, C.temporal)));
		let i = n ? Vi : void 0;
		C.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(C.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		C.language.length > 0 && document.documentElement.lang !== C.language && (document.documentElement.lang = C.language), d(n ? "page's moments written again" : "page's words written again", r, { language: C.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		pa(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = x(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${m}="${Yn(n)}"]`)) Ar(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Ar(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e);
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: C.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: C.text("ui.connection.reload"),
				run: () => {
					this.leaveGuard.release(), window.location.reload();
				}
			}
		});
	}
	reloadForView(e) {
		if (jR() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), MR(e), this.leaveGuard.release(), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), iP(this.root), await TR();
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
		return ca(this.root) || bM(this.hydration) || this.metadata.getWords().some((e) => Vi(e.key)) || Vi(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) gR(_R(t), t, this.pluginContext);
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
		C.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		gR(_R(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !KN(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), qN(e))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= bR) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (NR(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, this.leaveGuard.set(!1), await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(KN(e) ? await qN(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = OR(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? kR(window.location.search) : e.parameters,
			timeZone: wM()
		};
		return await CM(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, yR, wR);
	}
};
async function CR(e = {}) {
	let t = performance.now(), n = new SR(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function wR(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function TR() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function ER(e) {
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
	let n = DR();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function DR() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function OR() {
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
function kR(e) {
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
var AR = "ne-standard-ui:reloaded-view";
function jR() {
	try {
		return sessionStorage.getItem(AR);
	} catch {
		return null;
	}
}
function MR(e) {
	try {
		sessionStorage.setItem(AR, e);
	} catch {}
}
function NR() {
	try {
		sessionStorage.removeItem(AR);
	} catch {}
}
re(), CR().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
