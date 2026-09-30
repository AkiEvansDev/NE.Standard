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
var ce = "data-ui-id", le = "data-ui-context", ue = "data-ui-pc", m = "data-ui-key", de = "data-ui-unselectable", fe = "data-ui-undraggable", pe = "data-ui-unremovable", me = "data-ui-unrenamable", he = "data-ui-no-context-menu", ge = "data-ui-no-row-open", _e = "data-ui-no-row-drag", ve = "ui-row__grip", ye = "data-ui-row-drop", be = "data-ui-tabs-draggable", xe = "data-ui-tabs-menu", Se = "data-ui-context-menu", Ce = "data-ui-context-menu-use", we = "data-ui-row-focus", Te = "data-ui-tooltip", Ee = "data-ui-tooltip-placement", De = "data-ui-tooltip-mark", Oe = "data-ui-name", ke = "data-ui-bind-", Ae = "data-ui-into-", je = "data-ui-bind-value", Me = (e) => `data-ui-no-${e}`, Ne = "data-ui-event-boundary", Pe = "data-ui-image-caption", h = "data-ui-items-host", Fe = "data-ui-collection-sink", Ie = "data-ui-items-query", Le = "data-ui-number-culture", Re = "data-ui-page-culture", ze = "data-ui-temporal-culture", Be = "data-ui-empty-template", Ve = "data-ui-group-template", He = "data-ui-empty-placeholder", Ue = "data-ui-group-header", We = "data-ui-group", Ge = "data-ui-value-holder", Ke = "data-ui-value-kind", qe = "items-query", Je = "data-ui-host-mode", Ye = "data-ui-host-viewport", Xe = "data-ui-scroll-group", Ze = "data-ui-scroll-lines", Qe = "data-ui-source-line", $e = "data-ui-window-spacer", et = "data-ui-window-size", tt = "data-ui-window-offset", nt = "data-ui-window-total", rt = "data-ui-window-more-before", it = "data-ui-window-more-after", at = "data-ui-window-aggregates", ot = "data-ui-form-id", st = "data-ui-visibility", ct = "data-ui-collapsed", lt = "data-ui-menu-group", ut = "data-ui-menu-select", dt = "data-ui-menu-open", ft = "data-ui-menu-search", pt = "data-ui-menu-searching", mt = "data-ui-menu-unmatched", ht = "data-ui-drawer-toggle", gt = "data-ui-drawer-open", _t = "data-ui-region", vt = "data-ui-menu-item-kind", yt = "ui-menu-item", bt = "ui-menu-item--checked", xt = `[${vt}="header"], [${vt}="separator"]`, St = `[${lt}] > .${yt}`, Ct = `${St}, .${yt}[${vt}="check"]`, wt = "data-ui-collapse-toggle", Tt = "data-ui-folding", Et = "data-ui-column-limits", Dt = "data-ui-row-limits", Ot = "data-ui-splitter-step", kt = "data-ui-table-column", At = "data-ui-table-hide-below", jt = "data-ui-table-starts-hidden", Mt = "data-ui-table-hidden", Nt = "ui-table__row", Pt = "ui-table__scroll", Ft = "ui-table__header", It = "ui-table__resizer", Lt = "data-ui-table-last", Rt = "data-ui-table-reordering", zt = "data-ui-table-dragging", Bt = "data-ui-table-drop", Vt = "data-ui-table-scrolled", Ht = "data-ui-table-scrollbar", Ut = "data-ui-no-row-select", Wt = "data-ui-tree-parent", Gt = "data-ui-tree-children", Kt = "data-ui-tree-folder", qt = "data-ui-tree-expanded", Jt = "data-ui-tree-title", Yt = "data-ui-tree-loading", Xt = "data-ui-tree-drop-target", Zt = "data-ui-tree-boot", Qt = "data-ui-tree-draggable", $t = "data-ui-row-editing", en = "data-ui-image-source", tn = "data-ui-file-max-size", nn = "data-ui-file-pick", rn = "data-ui-theme", an = "data-ui-words", on = "data-ui-language-switcher", sn = "data-ui-language", cn = "data-ui-splitting", ln = "data-ui-pointer-focus", un = "data-ui-selection", dn = "data-ui-selected", fn = "data-ui-selected-key", pn = "data-ui-selected-keys", mn = "data-ui-bind-selected-key", hn = "data-ui-tabs-selected", gn = "data-ui-tab-order", _n = "data-ui-tab-caption", vn = "data-ui-tab-pinned", yn = [
	st,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], bn = "data-ui-submit-form-id", g = `[${ce}]`, xn = "data-ui-href", Sn = "ui-disabled", Cn = "ui-loading", wn = "ui-readonly", Tn = "ui-hidden", En = "ui-dialog__surface", Dn = "ui-flyout__content", On = "data-ui-focus-holder", kn = "[role='listbox'], [role='menu'], [role='dialog']", An = "ui-select__trigger", jn = `.${An}`, Mn = "ui-button", Nn = "ui-select", Pn = "ui-text-input", Fn = "ui-invalid", In = {
	componentId: ce,
	key: m,
	selected: dn,
	selectedKey: fn,
	selectedKeys: pn,
	unselectable: de,
	rowFocus: we,
	itemsHost: h,
	valueHolder: Ge,
	bindValue: je,
	noRowOpen: ge,
	noRowDrag: _e,
	eventBoundary: Ne,
	focusHolder: On,
	tooltip: Te,
	tooltipPlacement: Ee,
	contextMenu: Se,
	contextMenuUse: Ce,
	disabledClass: Sn,
	loadingClass: Cn,
	readOnlyClass: wn,
	hiddenClass: Tn,
	buttonClass: Mn,
	selectClass: Nn,
	textInputClass: Pn,
	invalidClass: Fn,
	sourceLine: Qe,
	popupSelector: kn,
	listTriggerSelector: jn,
	tableRowClass: Nt,
	tableScrollClass: Pt,
	tableHeaderClass: Ft,
	tableResizerClass: It,
	tableHidden: Mt,
	hostMode: Je,
	windowOffset: tt,
	windowTotal: nt,
	windowSize: et,
	windowMoreAfter: it,
	windowAggregates: at,
	itemsQuery: Ie,
	valueKind: Ke,
	itemsQueryKind: qe,
	menuItemClass: yt,
	menuItemKind: vt,
	menuItemCheckedClass: bt
};
function Ln(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Rn(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var zn = 0;
function Bn(e, t) {
	return e.id.length === 0 && (zn++, e.id = `${t}-${zn}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Vn(e, t, n) {
	let r = t.target;
	if (r === "root") return [e];
	if (r != null && r.trim().length > 0) {
		if (e.matches(r)) return [e];
		for (let t of e.querySelectorAll(r)) if (t.closest(g) === e) return [t];
		return [];
	}
	return n();
}
//#endregion
//#region src/metadata/metadata-index.ts
var Hn = {
	Navigate: "Navigate",
	Focus: "Focus",
	ScrollTo: "ScrollTo",
	Show: "Show",
	Hide: "Hide",
	Collapse: "Collapse",
	OpenDialog: "OpenDialog",
	CloseDialog: "CloseDialog",
	ShowNotification: "ShowNotification",
	DownloadFile: "DownloadFile",
	Scroll: "Scroll",
	SetTheme: "SetTheme",
	RenameTab: "RenameTab",
	RenameNode: "RenameNode",
	CopyToClipboard: "CopyToClipboard",
	DiscardForm: "DiscardForm",
	SetLanguage: "SetLanguage"
}, Un = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(v(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${v(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(v(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (v(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(ur(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(ur(e, lr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(dr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(y(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(y(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(fr(e, t))?.items ?? [];
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
		let t = v(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = v(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(ur(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(ur(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = y(e.eventName), n = v(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(dr(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = v(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = v(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = v(e.componentId);
		t > 0 && this.itemValuesByAddress.set(fr(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = v(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function _(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Wn(e) {
	return _(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Gn(e) {
	return e == null ? "OneWay" : _(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Kn(e) {
	return _(e, ["Property", "Event"]);
}
function qn(e) {
	return e == null ? "SetProperty" : _(e, ["SetProperty", "Effect"]);
}
function Jn(e) {
	return _(e, [
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
function Yn(e) {
	return _(e, ["Ascending", "Descending"]);
}
function Xn(e) {
	return _(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function Zn(e) {
	return _(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function Qn(e) {
	return typeof e == "string" ? e : _(e, [
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
function $n(e) {
	return _(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function er(e) {
	return _(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function v(e) {
	return e ?? 0;
}
function tr(e) {
	return typeof e == "string" ? e : "";
}
function nr(e) {
	return _(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function rr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function ir(e) {
	return _(e, ["Auto", "Smooth"]);
}
function ar(e) {
	return _(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function or(e) {
	return _(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function sr(e) {
	return _(e, ["Light", "Dark"]);
}
function cr(e) {
	return _(e, ["Horizontal", "Vertical"]);
}
function y(e) {
	return e?.trim().toLowerCase() ?? "";
}
function lr(e) {
	return e?.trim() ?? "";
}
function ur(e, t) {
	return `${e}:${lr(t)}`;
}
function dr(e, t) {
	return `${e}:${y(t)}`;
}
function fr(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var pr = class {
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
		return this.dom.findAllComponents(v(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = v(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = v(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${ke}${Rn(r.propertyName)}="${Ln(a)}"]` : null;
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
		let n = v(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return Vn(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Rn(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function mr(e) {
	return vr(e, ue);
}
function hr(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = yr(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function gr(e, t) {
	let n = mr(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = hr(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function _r(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = yr(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function vr(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function yr(e) {
	return e.getAttribute("data-ui-key") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function br(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var xr = class {
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
		let e = this.root.querySelectorAll(g), t = this.root.querySelector(`[${Ue}]`) !== null;
		for (let n of e) {
			let e = b(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && Tr(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Bn(e, t);
	}
	findComponentParts(e, t, n) {
		return br(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(wr(t)) ?? [];
		if (n.length > 0 && n.every((e) => gr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => gr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = mr(n);
			if (e === 0) continue;
			let r = hr(n, e);
			if (r.length !== e) continue;
			let i = wr(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(g);
			if (e === null || !Er(this.root, e)) return null;
			let r = b(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: hr(e, mr(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function b(e) {
	return vr(e, ce);
}
function Sr(e) {
	let t = e.closest(g), n = t === null ? 0 : b(t);
	return n > 0 ? n : null;
}
function Cr(e) {
	let t = e.closest(g), n = t === null ? 0 : b(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: hr(t, mr(t))
	};
}
function wr(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Tr(e) {
	return mr(e) === 0;
}
function Er(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Dr(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Or(n);
	switch (kr(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Ar(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Ar(r, i) ? "many" : "other";
		case "ru":
		case "uk": return jr(r, i);
		case "pl": return Mr(r, i);
		default: return "other";
	}
}
function Or(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function kr(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Ar(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function jr(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Mr(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Nr(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var Pr = {
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
function Fr(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return Pr;
	try {
		return {
			...Pr,
			...JSON.parse(t)
		};
	} catch {
		return Pr;
	}
}
var Ir = [
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
function Lr(e, t, n) {
	if (t == null || t.trim().length === 0) return `${x(e.getFullYear(), 4)}-${x(e.getMonth() + 1, 2)}-${x(e.getDate(), 2)} ${x(e.getHours(), 2)}:${x(e.getMinutes(), 2)}:${x(e.getSeconds(), 2)}`;
	let r = "", i = Rr(t);
	for (let a = 0; a < t.length;) {
		let o = zr(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += Br(o, e, n, i), a += o.length;
	}
	return r;
}
function Rr(e) {
	for (let t = 0; t < e.length;) {
		let n = zr(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function zr(e, t) {
	for (let n of Ir) if (e.startsWith(n, t)) return n;
	return null;
}
function Br(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return x(t.getFullYear(), 4);
		case "yy": return x(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return x(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return x(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return x(i, 2);
		case "H": return String(i);
		case "hh": return x(a, 2);
		case "h": return String(a);
		case "mm": return x(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return x(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function x(e, t) {
	return String(e).padStart(t, "0");
}
var Vr = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Hr(e) {
	let t = Vr.exec(e.trim());
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
function Ur(e) {
	return Wr(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Wr(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Gr = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Kr(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = zr(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += qr(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function qr(e, t) {
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
function Jr(e, t, n) {
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
		let a = zr(t, e);
		if (a === null) {
			if (!Yr(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!Xr(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? ri(i) : null;
}
function Yr(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function Xr(e, t, n, r) {
	switch (n) {
		case "yyyy": return Zr(t, "year", ei(e, t, 4, 4));
		case "yy": return Zr(t, "year", Qr(ei(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return Zr(t, "month", $r(ti(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return Zr(t, "month", ei(e, t, 1, 2));
		case "dddd":
		case "ddd": return ti(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return Zr(t, "day", ei(e, t, 1, 2));
		case "HH":
		case "H": return Zr(t, "hour", ei(e, t, 1, 2));
		case "hh":
		case "h": return Zr(t, "hour12", ei(e, t, 1, 2));
		case "mm":
		case "m": return Zr(t, "minute", ei(e, t, 1, 2));
		case "ss":
		case "s": return Zr(t, "second", ei(e, t, 1, 2));
		case "tt": return ni(e, t, r);
		default: return !1;
	}
}
function Zr(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function Qr(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function $r(e) {
	return e === null ? null : e + 1;
}
function ei(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function ti(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function ni(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function ri(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Wr(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var ii = {
	readCulture: Fr,
	format: Lr,
	parse: Hr,
	toDate: Ur
}, ai = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, oi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function si(e) {
	let t = e?.trim() ?? "";
	if (!oi.test(t)) return null;
	let n = Date.parse(ai.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function ci(e) {
	return e === "date" || e === "time" || e === "relative" ? e : "date-time";
}
var li = {
	...Pr,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function ui(e, t, n, r) {
	if (t === "relative") return vi(e - r, n.language);
	let i = n.temporal ?? li, a = t === "date" ? i.date : t === "time" ? i.shortTime : Nr(i, !1);
	return Lr(new Date(e), a, i);
}
var di = /* @__PURE__ */ new Map();
function fi(e) {
	let t = di.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(pi(e), { numeric: "auto" }), di.set(e, t)), t;
}
function pi(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var mi = 1e3, hi = 60 * mi, gi = 60 * hi, _i = 24 * gi;
function vi(e, t) {
	let n = fi(t), r = Math.abs(e);
	return r < 45 * mi ? n.format(0, "second") : r < 45 * hi ? n.format(Math.round(e / hi), "minute") : r < 22 * gi ? n.format(Math.round(e / gi), "hour") : r < 26 * _i ? n.format(Math.round(e / _i), "day") : r < 320 * _i ? n.format(Math.round(e / (30.4375 * _i)), "month") : n.format(Math.round(e / (365.25 * _i)), "year");
}
//#endregion
//#region src/runtime/words.ts
var yi = "count";
function bi(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function xi(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Si = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative"
]);
function Ci(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && si(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Si.has(t.format));
}
function wi(e) {
	if (typeof e != "object" || !e) return !1;
	if (Ci(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (wi(t)) return !0;
	return !1;
}
function Ti(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Ei(e, t, n) {
	return bi(e) ? ki(n, e.key, e.args) : xi(e) ? Di(n, e.text) : t && typeof e == "string" ? Di(n, e) : e;
}
function Di(e, t) {
	return t.trim().length === 0 || !Oi(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Oi(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function ki(e, t, n) {
	let r = n?.[yi];
	return Ai(typeof r == "number" ? e.lookup(`${t}.${Dr(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => xi(t) ? Di(e, t.text) : ki(e, t.key, t.args), e.writeMoment);
}
function Ai(e, t, n, r = Ti) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = ji(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += Ni(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function ji(e, t) {
	let n = t + 1;
	for (; n < e.length && Mi(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Mi(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function Ni(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : bi(e) ? t === void 0 ? Ai(e.key, e.args, void 0, n) : t(e) : xi(e) ? t === void 0 ? e.text : t(e) : Ci(e) ? n(si(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var Pi = 15e3, Fi = /* @__PURE__ */ new Set(), Ii = null;
function Li(e) {
	Fi.add(e), Ii === null && (Ii = setInterval(Ri, Pi));
}
function Ri() {
	for (let e of [...Fi]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Fi.delete(e);
	}
	Fi.size === 0 && Ii !== null && (clearInterval(Ii), Ii = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var zi = 256, Bi = 512, Vi = "script[type='application/json'][data-ui-strings]", Hi = "#text", Ui = `[${an}*='"moment"']`, Wi = class {
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
		let t = e.querySelector(Vi)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), ki(this, e, t);
	}
	translate(e, t) {
		return ki(this, e, t);
	}
	writeMoment = (e, t) => (t === "relative" && this.noteRelative(), ui(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Li(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return Ei(e, t, this);
	}
	resolveText(e) {
		return Ei(e, !0, this);
	}
	write(e, t, n, r) {
		Yi(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		Yi(e, t, Ei(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (bi(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = xi(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		Yi(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		qi(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		Xi(e, (e) => {
			for (let n of e.querySelectorAll(t ? Ui : `[${an}]`)) for (let [e, r] of Object.entries(Ji(n))) {
				if (t && !wi(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && Yi(n, e === Hi ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Ei(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Bi || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Oi(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += zi) try {
			let a = await e(t, n.slice(r, r + zi));
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
function Gi(e) {
	let t = !1;
	return Xi(e, (e) => {
		t ||= e.querySelector(Ui) !== null;
	}), t;
}
function Ki(e, t) {
	e.hasAttribute("data-ui-words") && qi(e, t, null);
}
function qi(e, t, n) {
	let r = Ji(e), i = t ?? Hi;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(an) : e.getAttribute("data-ui-words") !== a && e.setAttribute(an, a);
}
function Ji(e) {
	let t = e.getAttribute(an);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function Yi(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Xi(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) Xi(n.content, t);
}
var S = new Wi();
function Zi(e, t) {
	return S.resolve(e, typeof e == "string" && e.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var Qi = `.${Sn}, .${Cn}, [inert]`, $i = `:scope > [${ce}]:is(${Qi}), :scope > :not([${ce}]) > [${ce}]:is(${Qi})`;
function C(e) {
	return e.closest(Qi) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function w(e) {
	return e.matches(Qi) || e.querySelector($i) !== null;
}
function ea(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var ta = `[${ce}], .${wn}`;
function T(e) {
	return e.closest(ta)?.matches(`.${wn}`) === !0;
}
function na(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(Sn, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var ra = {
	isInert: C,
	isReadOnly: T,
	setDisabled: na
};
//#endregion
//#region src/extensions/value-readers.ts
function ia(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function aa(e) {
	return e == null;
}
var oa = "data-ui-trim-input", sa = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of fa) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Ke);
		if (t === null) return ca(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(oa) ? t.trim() : t;
	}
	readHeld(e) {
		let t = ua(e);
		return t === null ? null : this.read(t);
	}
};
function ca(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var la = "input, textarea, select";
function ua(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(la) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${la}`);
}
function da(e) {
	return e === null ? null : Number(e);
}
var fa = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(hn)
	},
	{
		kind: "tab-order",
		read: (e) => da(e.getAttribute(gn))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(_n)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(vn)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Jt)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(fn)
	},
	{
		kind: "selected-keys",
		read: (e) => pa(e, pn)
	},
	{
		kind: qe,
		read: (e) => pa(e, Ie)
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
function pa(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function ma(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var ha = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function ga(e) {
	return e instanceof HTMLInputElement && ha.has(e.type);
}
function _a(e) {
	return ga(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var va = "ui-draft-dropped";
function ya(e) {
	e.dispatchEvent(new Event(va, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function ba(e) {
	let t = wa(e.key), n = Ta(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(Ca);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function xa(e, t) {
	return wa(e) !== null || Ta(e, t) !== 0;
}
var Sa = {
	target: ba,
	applyTabIndex: E
};
function E(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function Ca(e) {
	return e.getClientRects().length > 0 && !C(e);
}
function wa(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function Ta(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/selected-key.ts
function Ea(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var Da = "data-ui-bind-selected-keys", Oa = ".ui-items-view, .ui-table, .ui-tree", ka = `.ui-items-view__item, .${Nt}, .ui-tree__row`, Aa = {
	shift: !1,
	ctrl: !1
}, ja = /* @__PURE__ */ new WeakMap();
function Ma(e, t) {
	t !== null && !ja.has(e) && Na(e, t);
}
function Na(e, t) {
	let n = O(t);
	n.length > 0 && ja.set(e, n);
}
function Pa(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Fa(e, t) {
	let n = Pa(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Ia(e) {
	return !e.hasAttribute(Ut);
}
function D(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${ce}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function La(e) {
	switch (e.getAttribute(un)) {
		case "one": {
			let t = e.getAttribute(fn);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Ga(Ka(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Ra(e, t) {
	let n = La(e), r = e.getAttribute(un), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(O(e));
		e.toggleAttribute(dn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function za(e) {
	return e.filter((e) => e.hasAttribute(dn));
}
function Ba(e, t, n, r) {
	let i = O(n);
	if (!Ua(n)) return !1;
	switch (e.getAttribute(un)) {
		case "one": return Ea(e, i, {
			attribute: fn,
			bindingAttribute: mn,
			apply: (e) => Ra(e, t)
		}), !0;
		case "many": return Va(e, t, n, i, r), !0;
		default: return !1;
	}
}
function Va(e, t, n, r, i) {
	let a = Ka(e);
	if (a === null) return;
	let o = Ga(a), s;
	if (i.shift) {
		let r = Wa(t, t.find((t) => O(t) === ja.get(e)) ?? n, n).map(O);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], ja.set(e, r)) : (s = [r], ja.set(e, r));
	Ha(e, t, s);
}
function Ha(e, t, n) {
	let r = Ka(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(pn, i), Ra(e, t), r.hasAttribute(Da) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ua(e) {
	return O(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !w(e);
}
function Wa(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => D(e) !== null && Ua(e));
}
function Ga(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Ka(e) {
	for (let t of e.querySelectorAll(`[${h}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function O(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var qa = {
	isSelected: (e) => e.hasAttribute(dn),
	toggle: Ja,
	setSelected: Ya,
	setSelectedKeys: Xa
};
function Ja(e) {
	let t = e.closest(Oa);
	t !== null && e instanceof HTMLElement && Ba(t, Za(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function Ya(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(O(e));
	Xa(e, r, n);
}
function Xa(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = Za(e), i = new Set(r.filter((e) => !Ua(e)).map(O)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...La(e)].filter((e) => !a.has(e));
	Ha(e, r, n ? [...o, ...a] : o);
}
function Za(e) {
	return [...e.querySelectorAll(ka)].filter((t) => t.closest(Oa) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function Qa(e) {
	let t = e.closest(Oa);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(ka);
	return n !== null && n.closest(".ui-items-view, .ui-table, .ui-tree") === t ? {
		root: t,
		row: n
	} : null;
}
function $a(e) {
	return e.filter((e) => D(e) !== null && !w(e));
}
function eo(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !w(e)) ?? $a(e)[0] ?? null;
}
function to(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(we);
	n.setAttribute(we, ""), e.setAttribute("aria-activedescendant", Bn(n, "ui-row")), (D(n) ?? n).scrollIntoView({ block: "nearest" });
}
function no(e, t, n, r) {
	if (!xa(e, r === "grid" ? "both" : r)) return null;
	let i = $a(t);
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return ro(i, n, e === "ArrowDown");
	let a = i.map((e) => D(e) ?? e), o = ba({
		key: e,
		items: a,
		current: n === null ? null : D(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function ro(e, t, n) {
	let r = t === null ? null : D(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = io(i), o = e.map((e) => ({
		row: e,
		rect: (D(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(io(t.rect) - a) < Math.abs(io(e.rect) - a) ? t : e).row;
}
function io(e) {
	return e.left + e.width / 2;
}
function ao(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function oo(e, t, n) {
	let r = n.hasAttribute(we), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = $a(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && to(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var so = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), co = /* @__PURE__ */ new Set([
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
]), lo = !1, uo = null, fo = /* @__PURE__ */ new Set();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => po(e.target), !0), window.addEventListener("keydown", (e) => mo(e), !0), window.addEventListener("focusin", (e) => ho(e.target), !0), window.addEventListener("focusout", (e) => yo(e.target, !1), !0));
function po(e) {
	lo = !0;
	let t = document.activeElement;
	uo = t, t instanceof Element && t !== document.body && e instanceof Node && t.contains(e) && yo(t, !go(t));
}
function mo(e) {
	if (!(e instanceof KeyboardEvent && co.has(e.key))) {
		lo = !1;
		for (let e of [...fo]) yo(e, !1);
	}
}
function ho(e) {
	lo && !go(e) && yo(e, !0);
}
function go(e) {
	return _a(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function _o() {
	return lo && uo instanceof HTMLElement && uo !== document.body ? uo : null;
}
function vo() {
	return lo;
}
function yo(e, t) {
	e instanceof Element && (t ? fo.add(e) : fo.delete(e), e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(ln, t));
}
function k(e) {
	e.focus({ preventScroll: !0 });
}
function bo(e) {
	yo(e, !0), e.focus({ preventScroll: !0 });
}
function xo(e) {
	for (let t of e.querySelectorAll(so)) if (ea(t)) return t;
	return null;
}
function So(e, t) {
	let n = [...e.querySelectorAll(so)].filter((e) => ea(e) || e === t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = Co(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !wo(n) && wo(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = Co(e);
		return t === null || r.get(t) === e;
	});
}
function Co(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function wo(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function To(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Eo(n, a) ? i : r && Eo(n, i) ? a : null;
}
function Eo(e, t) {
	return e === t || Co(e) !== null && Co(e) === Co(t);
}
var Do = `.${En}, .${Dn}, [${On}]`;
function Oo(e) {
	let t = Qa(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Do)) && n.hasAttribute("tabindex") && ea(n)) return n;
	return null;
}
function ko(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? xo(e);
	return r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), k(r ?? e), n;
}
function Ao(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? xo(e);
	return n !== null && jo(e, n), ko(e, n);
}
function jo(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Mo(e, t, n = !1) {
	if (lo) {
		E(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), k(e);
		return;
	}
	let r = t.filter(Ca), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (E(t, i), k(i));
}
function No(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Po(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${so}, [tabindex]`) && ea(e)) return e;
	return n === null ? null : Fo(n);
}
function Po(e, t) {
	for (let n = e.closest(g); n !== null; n = n.parentElement?.closest(g) ?? null) {
		let e = t.querySelectorAll(`[${ce}="${n.getAttribute(ce)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Fo(e) {
	for (let t = e.closest(g); t !== null; t = t.parentElement?.closest(g) ?? null) if (ea(t)) {
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
function Io(e, t) {
	e != null && t.contains(document.activeElement) && k(e);
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Lo = "data-ui-clear", Ro = ["change", "toggle"], zo = [
	...Ro,
	"expand",
	"collapse",
	"open",
	"close"
];
function Bo(e) {
	let t = Gn(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Vo(e) {
	return Gn(e) === "OnSubmit";
}
function Ho(e, t) {
	let n = e.getAttribute(je);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Vo(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Bo(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Vo(i.mode)
		};
	}
	return null;
}
var Uo = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of Ro) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(va, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Lo}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Ho(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Lo}]`);
		if (t === null) return;
		let n = t.closest(g), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || Wo(r) || (ma(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), _a(r) && document.activeElement !== r && k(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (T(e.target) || C(e.target))) return;
		let t = Ho(e.target, this.options.metadata);
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
			let r = Ho(n, this.options.metadata);
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
		if (i === void 0 || !Bo(i.mode) || Vo(i.mode)) return;
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
function Wo(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/command-turns.ts
var Go = class {
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
}, Ko = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = y(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = y(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(y(e));
	}
	markAttached(e) {
		let t = y(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, qo = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: v(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, Jo = {
	dispatched: !1,
	success: !1
}, Yo = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, Xo = class {
	options;
	root;
	registry;
	requestFactory = new qo();
	turns = new Go();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new Ko(e.eventCatalog), this.addEvent("click");
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
		if (r === null || Qo(t, r.element)) return;
		let i = t.target.closest(`[${Ne}]`);
		if (i !== null && i !== r.element && r.element.contains(i)) return;
		let a = {
			domEvent: t,
			metadata: this.options.metadata.getEvent(r.componentId, e),
			component: r.element,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters
		}, o = n.dynamicParameters === void 0 ? a : {
			...a,
			dynamicParameters: n.dynamicParameters(a) ?? a.dynamicParameters
		};
		try {
			let t = await this.runAsync(e, n, r.element, o);
			n.completed?.({
				...o,
				...t
			});
		} catch (e) {
			let t = e instanceof Yo, r = t ? e.reason : e;
			throw n.completed?.({
				...o,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && C(r.domEvent.target)) return Jo;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), Jo;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? $o(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), Jo;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return Jo;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new Yo(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !zo.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Me(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		Zo(e.preventDefault, t) && t.domEvent.preventDefault(), Zo(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function Zo(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function Qo(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function $o(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function es(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && ts(e, t) : ns(e, t);
}
function ts(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!es(e[n], t[n])) return !1;
	return !0;
}
function ns(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !es(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var rs = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	heard = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
		let i = r.root ?? document;
		for (let e of Ro) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = Ho(e.target, this.options.metadata), r;
		if (n === null) r = this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return;
		else r = this.index.getPropertyInteractions(v(n.binding.componentId), n.binding.propertyId);
		if (r.length === 0) return;
		let i = this.options.valueReaders.readBound(e.target), a = as(r[0].source, t.dynamicParameters);
		if (!(this.heard.has(a) && es(this.heard.get(a), i))) {
			this.heard.set(a, i);
			for (let e of r) this.applyInteraction(e, t.dynamicParameters, !0, i);
		}
	}
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: v(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(v(e.reference.componentId), e.reference.propertyId);
		t.length > 0 && this.heard.set(as(e.reference, e.dynamicParameters), e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (qn(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!os(i)) return;
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
			effect: is(r, t),
			dom: this.options.dom
		});
	}
};
function is(e, t) {
	if (t.length === 0) return e;
	let n = e.target;
	return n === void 0 || (n.dynamicParameters?.length ?? 0) > 0 ? e : {
		...e,
		target: {
			...n,
			dynamicParameters: t
		}
	};
}
function as(e, t) {
	return JSON.stringify([
		v(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function os(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var ss = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return cs(t, e.operator, e.value);
	}
};
function cs(e, t, n) {
	switch (Jn(t)) {
		case "Required": return e != null && e !== !1 && String(e).trim().length > 0;
		case "Equal": return String(e ?? "") === String(n ?? "");
		case "NotEqual": return String(e ?? "") !== String(n ?? "");
		case "Greater": return ls(e, n, (e) => e > 0);
		case "GreaterOrEqual": return ls(e, n, (e) => e >= 0);
		case "Less": return ls(e, n, (e) => e < 0);
		case "LessOrEqual": return ls(e, n, (e) => e <= 0);
		case "Like": return String(e ?? "").includes(String(n ?? ""));
		case "LikeIgnoreCase": return String(e ?? "").toLocaleLowerCase().includes(String(n ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(n) && n.some((t) => String(t ?? "") === String(e ?? ""));
		case "Regex": return us(e, n);
		default: return !1;
	}
}
function ls(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function us(e, t) {
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
var ds = "Value", fs = class {
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
		return this.eventNames.has(y(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) hs(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(y(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(gs(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(_s(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (ps(e)) {
			let t = v(e.sourceEvent?.componentId), n = y(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(gs(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(gs(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (ms(e)) {
			let t = v(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(_s(t, n));
				if (r === void 0 && (r = [], this.propertyInteractions.set(_s(t, n), r)), r.push(e), this.metadata.getPropertyDefinition(n)?.propertyName === ds) {
					let n = this.valueInteractions.get(t) ?? [];
					n.push(e), this.valueInteractions.set(t, n);
				}
			}
		}
	}
};
function ps(e) {
	return Kn(e.sourceKind) === "Event";
}
function ms(e) {
	return Kn(e.sourceKind) === "Property";
}
function hs(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function gs(e, t) {
	return `${e}:${y(t)}`;
}
function _s(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var vs = {
	fast: 120,
	normal: 200,
	ripple: 250,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)"
};
function ys() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function bs(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var xs = /* @__PURE__ */ new Set([
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
function Ss(e) {
	return xs.has(e);
}
var Cs = 4, ws = 12, Ts = /* @__PURE__ */ new Map(), Es = !1, Ds = null, Os = /* @__PURE__ */ new WeakMap(), ks = "data-ui-popup-stood-in";
function As(e, t) {
	t === null ? Os.delete(e) : Os.set(e, t);
}
var js = "--ui-popup-ground";
function Ms(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(js).trim() : "";
	n.length === 0 ? t.style.removeProperty(js) : t.style.setProperty(js, n);
}
function Ns(e, t, n) {
	Ts.set(t, {
		anchor: e,
		options: n
	}), zs(), Ds?.observe(t), Fs(t), Vs(e, t, n);
}
var Ps = "data-ui-popup-lifted";
function Fs(e) {
	if (e.hasAttribute(Ps)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	Is(e) && (e.setAttribute("popover", "manual"), e.setAttribute(Ps, ""), e.showPopover());
}
function Is(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function Ls(e) {
	e.hasAttribute(Ps) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Ts.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Ps));
	}, vs.fast));
}
function Rs(e) {
	e != null && (Ts.delete(e), Ds?.unobserve(e), Ls(e));
}
function zs() {
	Es || (Es = !0, document.addEventListener("scroll", Bs, !0), window.addEventListener("resize", Bs), Ds = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Ts.get(t.target);
			e !== void 0 && Vs(e.anchor, t.target, e.options);
		}
	}));
}
function Bs() {
	for (let [e, t] of Ts) {
		if (!e.isConnected) {
			Rs(e);
			continue;
		}
		Vs(t.anchor, e, t.options);
	}
}
function Vs(e, t, n) {
	if (!e.isConnected) return;
	let r = Hs(e), i = r !== e;
	t.hasAttribute(ks) !== i && t.toggleAttribute(ks, i), n.minAnchorWidth === !0 && (t.style.minWidth = `${r.getBoundingClientRect().width}px`);
	let a = r.getBoundingClientRect(), o = (r === e ? n.crossAnchor ?? r : r).getBoundingClientRect(), s = t.getBoundingClientRect(), c = Gs(a, s, n), l = $s(a, o, s, c, n.gap), u = ec(a, o, s, c, n.gap);
	n.arrow === !0 && (Ys(c) ? u = Us(u, o.left + o.width / 2, s.width) : l = Us(l, o.top + o.height / 2, s.height)), l = nc(l, s.height, window.innerHeight), u = nc(u, s.width, window.innerWidth), t.style.top = `${l}px`, t.style.left = `${u}px`, t.dataset.uiPlacement !== c && (t.dataset.uiPlacement = c), Ws(t, o, s, c, l, u);
}
function Hs(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(ks)) return e;
		let n = Os.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function Us(e, t, n) {
	let r = t - e;
	return r < ws ? e - (ws - r) : r > n - ws ? e + (r - (n - ws)) : e;
}
function Ws(e, t, n, r, i, a) {
	let o = Ys(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(ws, Math.min(s, c - ws))}px`);
}
function Gs(e, t, n) {
	let r = n.placement, i = Zs(r);
	if (Ks(e, t, r, n.gap)) return r;
	if (Ks(e, t, i, n.gap)) return i;
	for (let i of qs(r)) if (Ks(e, t, i, n.gap)) return i;
	return Xs(e, i) > Xs(e, r) ? i : r;
}
function Ks(e, t, n, r) {
	return Xs(e, n) >= Js(t, n) + r;
}
function qs(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function Js(e, t) {
	return Ys(t) ? e.height : e.width;
}
function Ys(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function Xs(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function Zs(e) {
	return e.startsWith("top") ? `bottom${Qs(e)}` : e.startsWith("bottom") ? `top${Qs(e)}` : e.startsWith("left") ? `right${Qs(e)}` : `left${Qs(e)}`;
}
function Qs(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function $s(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : tc(t.top, t.height, n.height, r);
}
function ec(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : tc(t.left, t.width, n.width, r);
}
function tc(e, t, n, r) {
	let i = Qs(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function nc(e, t, n) {
	return Math.max(Cs, Math.min(e, n - t - Cs));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var rc = 32;
function A(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = ic(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function ic(e, t, n) {
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
		if (r.size > rc) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function ac(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var oc = "data-ui-dialog";
function sc(e) {
	let t = e.querySelectorAll(`[${oc}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function cc(e) {
	let t = sc(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function lc(e) {
	let t = typeof document > "u" ? null : cc(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var uc = "data-ui-rename-field";
function dc(e) {
	return e instanceof Element && e.closest(`[${uc}]`) !== null;
}
function fc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(uc, ""), r.value = e.value, pc(r, n, t);
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
function pc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var mc = /* @__PURE__ */ new Set(), hc = /* @__PURE__ */ new Map(), gc = 0, _c = !1;
function vc() {
	_c || (_c = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || dc(e.target) || xc() && e.preventDefault();
	}, !0));
}
function yc() {
	for (let e of mc) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function bc(e) {
	for (let t of mc) t.hearRefusedClick(e);
}
function xc() {
	let e = [];
	for (let t of mc) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...hc.keys()]) t.has(e) || hc.delete(e);
	for (let { popup: t } of e) hc.has(t) || hc.set(t, ++gc);
	let n = Sc(e, (e) => hc.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function Sc(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Cc = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), mc.add(this), vc();
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
		return this.options.isBehind === void 0 ? lc(e) : this.options.isBehind(e);
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
function wc(e, t) {
	return e.isConnected && !C(e) && !(t && T(e));
}
var Tc = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Cc({
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
			isBehind: (e) => lc(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || vo() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : Ec(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, kc(t)) && !lc(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = Oo(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && wc(n.owner, this.closesWhenReadOnly) && !lc(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !wc(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), Ac(e), jc(e, !0), Pc(this), e.focus !== void 0 && e.focus !== !1 && ko(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && Ac(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Io(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), jc(r, !1), Rs(r.popup), this.entries.size === 0 && Fc(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (wc(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !Dc() && Oc(e);
		}
	}
};
function Ec(e) {
	return e instanceof Element && e.isConnected && ea(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function Dc() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && ea(e);
}
function Oc(e) {
	!e.hasAttribute("tabindex") && e.tabIndex < 0 && (e.tabIndex = -1), k(e);
}
function kc(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function Ac(e) {
	e.anchor !== void 0 && e.placement !== void 0 && Ns(e.anchor, e.popup, e.placement);
}
function jc(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var Mc = /* @__PURE__ */ new Set(), Nc = null;
function Pc(e) {
	Mc.add(e), Nc === null && typeof MutationObserver == "function" && (Nc = new MutationObserver(() => {
		for (let e of [...Mc]) e.closeStranded();
	}), Nc.observe(document, {
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
function Fc(e) {
	Mc.delete(e), !(Mc.size > 0 || Nc === null) && (Nc.disconnect(), Nc = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Ic = "ui-flyout", Lc = "ui-flyout--open", Rc = "ui-flyout__anchor", zc = "data-ui-flyout-no-backdrop-close", Bc = "data-ui-flyout-no-escape-close", Vc = 4, Hc = `${Ic}--`, Uc = "bottom-start", Wc = class {
	root;
	flyouts = new Tc({
		show: ({ owner: e }) => e.classList.add(Lc),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Bc : zc)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Ic}`)) this.place(e);
		A(this.root, `.${Ic}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Dn}`), n = e.querySelector(`:scope > .${Rc}`);
		if (t === null) return;
		let r = Gc(n, t);
		if (!e.classList.contains(Lc)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: qc(n) ?? e,
			placement: {
				placement: Jc(e),
				gap: Vc
			},
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(Lc) && (e.classList.remove(Lc), Kc(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rc}`)?.closest(`.${Ic}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(Lc), this.place(t), this.flyouts.isOpen(t) && Kc(t, !0);
		}
	}
};
function Gc(e, t) {
	if (e === null) return null;
	let n = e.querySelector(so) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Bn(t, "ui-flyout-content")), n;
}
function Kc(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function qc(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function Jc(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Hc)) continue;
		let e = t.slice(Hc.length);
		if (Ss(e)) return e;
	}
	return Uc;
}
//#endregion
//#region src/interactions/file-drop.ts
var Yc = 120, Xc = "refused", Zc = !1;
function Qc(e) {
	let t = {
		marked: /* @__PURE__ */ new Set(),
		leaving: 0
	};
	el();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => $c(e, t, n), !0);
	e.root.addEventListener("dragend", () => il(e, t.marked), !0), window.addEventListener("blur", () => il(e, t.marked));
}
function $c(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && il(e, r);
		return;
	}
	let { host: a } = i;
	if (i.refused === !0) {
		tl(n), n.type !== "dragleave" && il(e, r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || rl(e, r, a) : t.leaving = window.setTimeout(() => il(e, r), Yc);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = nl(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let t of r) t !== a && rl(e, r, t);
		r.add(a), a.setAttribute(e.draggingAttribute, t ? Xc : "");
		return;
	}
	il(e, r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => al(i.accept, e));
	o.length !== 0 && e.onFiles(a, i.multiple ? o : [o[0]]);
}
function el() {
	if (!Zc) {
		Zc = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && tl(e);
		});
	}
}
function tl(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function nl(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function rl(e, t, n) {
	t.delete(n), n.removeAttribute(e.draggingAttribute);
}
function il(e, t) {
	for (let n of t) rl(e, t, n);
}
function al(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var ol = "/_ne/files/upload";
function sl(e, t) {
	let n = Number(e.getAttribute(tn));
	if (!Number.isFinite(n) || n <= 0) return [...t];
	let r = [];
	for (let e of t) e.size <= n ? r.push(e) : s("a chosen file exceeds the input's size limit and was refused.", {
		name: e.name,
		size: e.size,
		limit: n
	});
	return r;
}
function cl(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", ol), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var ll = () => {}, ul = { uploadAsync: (e, t) => cl(e, t ?? ll) };
function dl(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/file-input-engine.ts
var fl = "ui-file-input", pl = "ui-file-input__row", ml = "ui-file-input__native", hl = "ui-file-input__field", gl = "ui-file-input__selection", _l = "data-ui-file-dragging", vl = class {
	root;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, S.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), Qc({
			root: this.root,
			draggingAttribute: _l,
			resolveTarget: (e) => {
				let t = e.closest(`.${pl}`)?.closest(`.${fl}`) ?? null, n = t?.querySelector(`.${ml}`) ?? null;
				return t === null || n === null ? null : {
					host: t,
					accept: n.getAttribute("accept") ?? "",
					multiple: n.multiple,
					refused: n.disabled || T(t) || C(t)
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
		let t = e.target.closest(`[${nn}], .${pl}`);
		if (t === null || C(t) || T(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${fl}`)?.querySelector(`.${ml}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ml)) return;
		let t = e.target.closest(`.${fl}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${hl}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = sl(e, t);
		if (r.length === 0) {
			this.show(n, () => S.text("ui.file.oversized"));
			return;
		}
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await cl(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => S.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, yl(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => S.text("ui.file.failed")), this.publishSelection(e, "");
		}
	}
	show(e, t) {
		typeof t == "string" ? this.shownWords.delete(e) : this.shownWords.set(e, t), e.value = typeof t == "string" ? t : t();
	}
	publishSelection(e, t) {
		dl(e.querySelector(`.${gl}`), t);
	}
};
function yl(e) {
	return e.length === 1 ? e[0].name : () => S.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/interactions/image-input-engine.ts
var bl = "ui-image-input", xl = "ui-image-input--multiple", Sl = "ui-image-input__surface", Cl = "ui-image-input__native", wl = "ui-image-input__picture", Tl = "ui-image-input__text", El = "ui-image-input__selection", Dl = "ui-image-input__selections", Ol = "ui-image-input__tiles", kl = "ui-image-input__tile", Al = "ui-image-input__remove", jl = "data-ui-image-preview", Ml = "data-ui-image-dragging", Nl = class {
	root;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${bl}`)), A(this.root, `.${bl}`, {
			childList: !0,
			attributeFilter: [
				en,
				Pe,
				pn
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(va, (e) => this.handleDraftDropped(e)), Qc({
			root: this.root,
			draggingAttribute: Ml,
			resolveTarget: (e) => {
				let t = e.closest(`.${Sl}`), n = t?.closest(`.${bl}`) ?? null;
				return t === null || n === null ? null : {
					host: n,
					accept: n.querySelector(`.${Cl}`)?.getAttribute("accept") ?? "",
					multiple: Pl(n),
					refused: T(n) || C(t)
				};
			},
			onFiles: (e, t) => void (Pl(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Pl(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${wl}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		r && e.dataset.previewFor === n || (this.dropPreview(e, r), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), r || Il(e, e.getAttribute("data-ui-image-caption") ?? zl(n)), Rl(e, n.length > 0));
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(pn);
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
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${nn}]`), n = t?.closest(`.${bl}`) ?? null;
		t === null || n === null || T(n) || C(t) || n.querySelector(`.${Cl}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Al}`), n = t?.closest(`.${bl}`) ?? null;
		if (t === null || n === null || T(n) || C(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Cl)) return;
		let t = e.target.closest(`.${bl}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Pl(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${bl}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), dl(t.querySelector(`.${El}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Sl}`), r = e.querySelector(`.${wl}`), i = e.querySelector(`.${El}`);
		if (n === null || r === null || sl(e, [t]).length === 0) return;
		this.dropPreview(e);
		let a = URL.createObjectURL(t);
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(jl, ""), r.setAttribute("src", a), Il(e, t.name), Rl(e, !0), n.classList.add(Cn);
		try {
			let n = await cl([t], () => void 0);
			this.previews.get(e) === a && dl(i, n.selectionId);
		} catch (t) {
			Ll(e), dl(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(Cn);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Ol}`), r = sl(e, t);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = Fl(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await cl([t], () => void 0);
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(Cn), this.publishShelf(e);
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
		let t = e.querySelector(`.${Dl}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(pn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(jl), t || Il(e, ""));
	}
};
function Pl(e) {
	return e.classList.contains(xl);
}
function Fl(e) {
	let t = document.createElement("span"), n = document.createElement("img"), r = document.createElement("button"), i = URL.createObjectURL(e);
	return t.className = `${kl} ${Cn}`, n.src = i, n.alt = e.name, r.type = "button", r.className = Al, S.write(r, "aria-label", "ui.image.remove"), t.append(n, r), {
		element: t,
		url: i,
		selectionId: null
	};
}
function Il(e, t) {
	let n = e.querySelector(`.${Tl}`);
	n !== null && (Ki(n, null), n.textContent !== t && (n.textContent = t));
}
function Ll(e) {
	let t = e.querySelector(`.${Tl}`);
	t !== null && S.write(t, null, "ui.file.failed");
}
function Rl(e, t) {
	let n = e.querySelector(`.${Sl}`);
	n !== null && S.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function zl(e) {
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
var Bl = "ui-key-value-action__row", Vl = "ui-key-value-action__value", Hl = "ui-key-value-action__value-input", Ul = "ui-key-value-action__edit-action", Wl = "ui-text__title", Gl = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${Bl}`)), A(this.root, `.${Bl}`, {
			childList: !0,
			attributeFilter: [$t]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${Hl} [${je}]`)) {
			if (_a(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		ya(e);
	}
	open(e) {
		let t = e.querySelector(`.${Hl} :is(input, textarea, select)`);
		if (t !== null) {
			if (_a(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${Vl} .${Wl}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), ga(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = ql(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(Ul)) return;
		let { cell: n, row: r } = t, i = e.target.closest(kn), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${Ul} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !C(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click()));
	}
};
function Kl(e) {
	return ql(e) !== null;
}
function ql(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Hl}, .${Ul}`), n = t?.closest(`.${Bl}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var Jl = `.ui-button[${Ke}="pressed"]`, Yl = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Jl);
		t === null || C(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Xl = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${An}, .ui-field-box`, Zl = `button, a, input, select, textarea, label, [contenteditable=''], [contenteditable='true'], ${Xl}, ${kn}, .${ve}`;
function Ql(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(Zl);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var $l = "button, a, input, select, textarea, label, [tabindex], [contenteditable]", eu = ":scope > input.ui-field, :scope > textarea.ui-field", tu = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(Xl);
		if (t === null || e.target !== t && e.target.closest($l) !== null) return;
		let n = t.querySelector(eu);
		if (!_a(n) || n.readOnly || C(n) || T(n)) return;
		e.preventDefault(), n.focus({ preventScroll: !0 });
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function j(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var nu = "data-ui-submit-on-enter", ru = 229, iu = class {
	root;
	committedValue = "";
	changes = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("focusin", (e) => {
			(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) && (this.committedValue = e.target.value);
		}), this.root.addEventListener("change", (e) => {
			this.changes++, e.target instanceof HTMLTextAreaElement && (this.committedValue = e.target.value);
		}, !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || au(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : ou(t, e) && (e.preventDefault(), this.commit(t), this.submitForm(t));
			return;
		}
		ga(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(ot);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${bn}="${CSS.escape(t)}"]`);
		n !== null && !C(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Oo(e);
		e.blur(), this.changes === t && this.commit(e), this.keepKeyboard(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	keepKeyboard(e, t) {
		let n = document.activeElement;
		if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
		let r = Qa(e);
		r?.root === t && r.row !== null && to(t, j(t, ka, Oa), r.row), k(t);
	}
};
function au(e) {
	return e.isComposing || e.keyCode === ru;
}
function ou(e, t) {
	return t.key === "Enter" && !t.shiftKey && !t.ctrlKey && !t.altKey && !t.metaKey && e.hasAttribute(nu) && !e.readOnly && !C(e);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var su = "data-ui-fallback-src", cu = `img[${su}]`, lu = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(cu)) (uu(e) || e.complete && e.naturalWidth === 0) && du(e);
		A(this.root, cu, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && uu(t) && du(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && du(t);
	}
};
function uu(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function du(e) {
	let t = e.getAttribute(su);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var fu = "data-ui-radio-value", pu = "ui-radio-group__input", mu = "ui-radio-group__dot", hu = "ui-radio-group", gu = "ui-radio-group__item", _u = "data-ui-radio-group-name", vu = "data-ui-radio-bind-value-id", yu = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${hu}`)]);
		for (let e of this.root.querySelectorAll(`.${hu}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${hu}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(bu));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [fu, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${hu}`)) {
			let n = e.getAttribute(_u);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(_u), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(_u, a);
			for (let e of j(r, `.${pu}`, `.${hu}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${hu}`)) n.has(e.getAttribute(_u) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(fu);
		for (let n of j(e, `.${pu}`, `.${hu}`)) {
			n.checked = n.value === t;
			let e = xu(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(gu) ? [e] : [...e.querySelectorAll(`.${gu}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${pu}`) !== null) return;
		let t = e.closest(`.${hu}`), n = t?.getAttribute(_u);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = pu, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(vu);
		a !== null && r.setAttribute(je, a);
		let o = document.createElement("span");
		o.className = mu, e.prepend(r, o), this.sync(t);
	}
};
function bu(e) {
	return e.classList.contains(hu) ? [e] : [...e.querySelectorAll(`.${hu}`)];
}
function xu(e) {
	let t = e.closest(`.${gu}`);
	return t !== null && w(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function Su(e) {
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
function Cu(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function wu(e, t) {
	return t !== null && e.length >= t;
}
function Tu(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : wu(e, n) ? null : [...e, t];
}
function Eu(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-terms.ts
var Du = /\p{M}/gu;
function Ou(e, t) {
	return ku(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function ku(e, t) {
	return Mu(e, ju(t));
}
function Au(e, t) {
	return t.every((t) => e.includes(t));
}
function ju(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Mu(e, t) {
	let n = e.normalize("NFD").replace(Du, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Nu = "data-ui-search-debounce", Pu = "data-ui-search-min-length", Fu = "data-ui-search-manual", Iu = "data-ui-search-answered", Lu = "ui-search__input", Ru = "ui-select__popup", zu = "ui-select__option", Bu = "ui-text__title", Vu = 300, Hu = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Lu) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		Uu(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Nu), i = r === null ? Vu : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : Vu));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Fu)) return;
		let t = e.getAttribute(Pu), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function Uu(e) {
	if (e.hasAttribute(Iu)) return;
	let t = e.closest(`.${Nn}`), n = t?.querySelector(`.${Ru}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Pu), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? Ou(e.value, e) : [], o = Gu(n, (e) => a.length === 0 || Au(ku(Wu(e), e), a));
	Yu(t, n, a.length > 0 && o === 0);
}
function Wu(e) {
	return e.querySelector(`.${Bu}`)?.textContent ?? e.textContent ?? "";
}
function Gu(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && Ku(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(zu)) continue;
		let e = t(a);
		Ku(a, e), r ||= e, e && i++;
	}
	return n !== null && Ku(n, r), i;
}
function Ku(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function qu(e) {
	let t = e.querySelector(`.${Ru}`);
	t !== null && Yu(e, t, Gu(t, (e) => e.style.display !== "none") === 0);
}
function Ju(e) {
	let t = e.querySelector(`.${Ru}`);
	t !== null && Gu(t, () => !0);
}
function Yu(e, t, n) {
	let r = t.querySelector(`:scope > [${He}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Be}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(He, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var Xu = "data-ui-select-value", Zu = "data-ui-select-placement", Qu = "ui-select--open", $u = "ui-select__trigger-content", ed = "data-ui-select-content", td = "ui-select__placeholder", nd = "ui-input__affix-icon--prefix", rd = "ui-select__popup", id = "ui-select__option", ad = "ui-select__value-input", od = "data-ui-select-clear", sd = "data-ui-select-trigger-mode", cd = "ui-search__input", ld = "ui-search-mode--replace", ud = "ui-text__title", dd = "data-ui-active", fd = "ui-multi-select", pd = "ui-multi-select__chips", md = "ui-multi-select__chip", hd = "ui-multi-select__chip-label", gd = "ui-multi-select__chip-remove", _d = "data-ui-select-chip", vd = "data-ui-select-max", yd = 4, bd = [
	Xu,
	pn,
	vd,
	"class",
	m
];
function xd(e) {
	return e === null || T(e) || C(e);
}
function Sd(e) {
	return e.classList.contains(fd);
}
function Cd(e) {
	return e.querySelector(`.${An}`)?.getAttribute(sd) === "input";
}
function wd(e) {
	return j(e, `.${rd} .${id}`, `.${Nn}`);
}
function Td(e) {
	return e === null ? null : e.querySelector(`.${ud}`)?.textContent ?? e.textContent;
}
function Ed(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(ce), t.removeAttribute(m), t.removeAttribute(ue), t.removeAttribute(le);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Dd = class {
	root;
	popups = new Tc({
		show: ({ owner: e }) => e.classList.add(Qu),
		hide: ({ owner: e }) => {
			e.classList.remove(Qu), this.markActive(e, null);
		}
	});
	syncedValues = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Nn}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Md(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: bd,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${od}], .${gd}`) !== null && e.preventDefault();
		}, !0);
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Sd(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(Xu);
		this.decorateOptions(e);
		let n = t === null ? null : wd(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = Td(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${cd}`);
		if (a !== null) {
			let n = document.activeElement === a;
			e.classList.contains(ld) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && Ju(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${td}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of wd(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${ad}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), qu(e);
	}
	syncMultiple(e) {
		let t = Su(e.getAttribute(pn)), n = new Set(t), r = wu(t, Cu(e.getAttribute(vd)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = wd(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		Ad(e, o.map((e) => ({
			key: e,
			label: kd(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${td}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${ad}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(pn, l), qu(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${An}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${$u}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(m);
		if (r !== null && i !== null && r.getAttribute(ed) === i) {
			r.removeAttribute(ed);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = $u;
			let e = n.querySelector(`:scope > .${nd}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		Ed(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of wd(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = w(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(cd)) return;
		let t = e.target.closest(`.${Nn}`);
		t !== null && t !== this.openSelect && this.toggle(t, !0);
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${id}`);
		t === null || n === null || n.hasAttribute(dd) || w(n) || C(n) || n.closest(".ui-select") !== t || (E(wd(t).filter((e) => !w(e)), n), Cd(t) || bo(n), this.markActive(t, n, !0));
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cd)) return;
		let t = e.target, n = t.closest(`.${Nn}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(ld)) return;
		let r = n.getAttribute(Xu);
		r !== null && (t.value = Td(wd(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${gd}`);
		if (t !== null) {
			let n = t.closest(`.${Nn}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), xd(n) || this.removeChosen(n, t.closest(`.${md}`)?.getAttribute(_d) ?? null));
			return;
		}
		let n = e.target.closest(`[${od}]`);
		if (n !== null) {
			let t = n.closest(`.${Nn}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), xd(t) || (this.clearValue(t), Od(t)));
			return;
		}
		let r = e.target.closest(`.${An}`);
		if (r !== null) {
			let t = r.closest(`.${Nn}`);
			if (xd(t) || r.getAttribute(sd) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${id}`);
		if (i === null) return;
		let a = i.closest(`.${Nn}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${id}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Nn}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Sd(t) || xd(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect !== t && this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${pd} > .${md}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(_d)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(cd) || !t.contains(e.target) ? null : wd(t).find((e) => e.hasAttribute(dd) && !w(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close(), t || (Ju(e), qu(e));
		let n = e.querySelector(`.${An}`), r = e.querySelector(`.${rd}`), i = e.getAttribute(Zu);
		if (n === null || r === null) return;
		n.setAttribute("aria-controls", Bn(r, "ui-select-popup"));
		let a = Cd(e) ? e.querySelector(`.${cd}`) ?? n : n;
		this.popups.open({
			owner: e,
			popup: r,
			anchor: n,
			placement: {
				placement: i !== null && Ss(i) ? i : "bottom-start",
				gap: yd,
				minAnchorWidth: !0
			},
			openers: [n],
			returnFocus: () => a
		}) && this.initializeFocus(e);
	}
	close() {
		this.popups.close();
	}
	initializeFocus(e) {
		let t = wd(e).filter((e) => !w(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true");
		if (n === void 0 && vo()) {
			E(t, null), this.markActive(e, null), Od(e);
			return;
		}
		let r = n ?? t[0];
		if (E(t, r), this.markActive(e, r, vo()), Cd(e)) {
			let t = e.querySelector(`.${cd}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		k(r);
	}
	moveFocus(e, t) {
		let n = wd(e).filter((e) => !w(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(dd)) ?? null, i = ba({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (E(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of wd(e)) r === t ? r.setAttribute(dd, "") : r.hasAttribute(dd) && r.removeAttribute(dd), yo(r, r === t && n);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || w(t) || xd(e)) return;
		if (Sd(e)) {
			let r = Tu(Su(e.getAttribute(pn)), n, Cu(e.getAttribute(vd)));
			this.markActive(e, t, vo()), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(Xu) === n) {
			this.close();
			return;
		}
		e.setAttribute(Xu, n), this.sync(e);
		let r = e.querySelector(`.${ad}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Eu(Su(e.getAttribute(pn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${md}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${An}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(pn) : e.setAttribute(pn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${ad}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Sd(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(Xu)) return;
		e.removeAttribute(Xu), this.sync(e);
		let t = e.querySelector(`.${ad}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Od(e) {
	let t = e.querySelector(Cd(e) ? `.${cd}` : `.${An}`);
	t !== null && !t.contains(document.activeElement) && k(t);
}
function kd(e, t) {
	let n = Td(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Ad(e, t) {
	let n = e.querySelector(`.${pd}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${md}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(_d) === t[n].key && e.querySelector(`.${hd}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => jd(e.key, e.label)));
	}
}
function jd(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = md, n.setAttribute(_d, e), r.className = hd, r.textContent = t, i.className = gd, i.type = "button", i.tabIndex = -1, S.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function Md(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Nn}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === Xu || e.attributeName === "data-ui-selected-keys" || e.attributeName === vd)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${rd}`)?.closest(`.${Nn}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Nd = "data-ui-input-debounce", Pd = `input[${Nd}], textarea[${Nd}]`;
function Fd(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Pd);
}
var Id = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!Fd(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Nd));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!Fd(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, Ld = "textarea.ui-text-area__field", Rd = "data-ui-text-area-grow";
function zd() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var Bd = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(Ld) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(Ld)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(br(e.components, Ld));
		}), A(this.root, Ld, {
			childList: !0,
			attributeFilter: [Rd]
		}, (e) => {
			this.fitAll(br(e, Ld));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(Rd)) {
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
}, Vd = "ui-slider__input", Hd = "ui-slider__value", Ud = "ui-slider__bubble", Wd = "ui-slider__track", Gd = "ui-slider__thumb-anchor", Kd = "ui-slider", qd = "ui-orientation--vertical", Jd = "--ui-slider-fraction", Yd = 6, Xd = "Value", Zd = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), Qd = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!Zd.has(e.propertyName)) return;
			let t = v(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${Vd}`);
				t !== null && (this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === Xd && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || $d(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Vd)) return;
		let t = e.target;
		if ($d(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	placeBubble(e) {
		let t = ef(e);
		t !== null && Ns(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: Yd
		});
	}
	releaseBubble(e) {
		Rs(ef(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${Wd}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${Hd}, .${Ud}`) ?? []) n.textContent = e.value;
		e.closest(`.${Wd}`)?.style.setProperty(Jd, String(tf(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function $d(e) {
	return T(e) || C(e);
}
function ef(e) {
	if (!(e instanceof Element) || !e.classList.contains(Vd)) return null;
	let t = e.closest(`.${Wd}`), n = t?.querySelector(`.${Ud}`) ?? null, r = t?.querySelector(`.${Gd}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${Kd}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(qd)
	};
}
function tf(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var nf = {
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
}, rf = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], af = [
	"$n",
	"n$",
	"$ n",
	"n $"
], of = [
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
], sf = [
	"n %",
	"n%",
	"%n",
	"% n"
], cf = [
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
], lf = /[1-9]/;
function uf(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return nf;
	try {
		return {
			...nf,
			...JSON.parse(t)
		};
	} catch {
		return nf;
	}
}
function df(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = pf(t);
	if (r === null) return mf(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = hf(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return ff(e, t) ? bf(rf[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = hf(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return ff(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = gf(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return ff(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = hf(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return bf(ff(e, t) ? of[n.currencyNegativePattern] ?? "-$n" : af[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = hf(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return bf(ff(e, t) ? cf[n.percentNegativePattern] ?? "-n %" : sf[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return mf(e, n);
	}
}
function ff(e, t) {
	return e < 0 && lf.test(t);
}
function pf(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function mf(e, t) {
	let { integer: n, fraction: r } = _f(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function hf(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = gf(e, t, n);
	return n === 0 ? yf(o, r, i) : `${yf(o, r, i)}${a}${s}`;
}
function gf(e, t, n) {
	let { integer: r, fraction: i } = _f(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? vf(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function _f(e, t) {
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
function vf(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function yf(e, t, n) {
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
function bf(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var xf = {
	readCulture: uf,
	format: df
}, Sf = /^-?(\d+(\.\d*)?|\.\d+)$/;
function Cf(e, t, n) {
	if (!Sf.test(e)) return e;
	let r = n.thousands ? t : kf(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return df(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return df(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function wf(e, t, n) {
	return Sf.test(e) ? (Of(n) ? Af(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function Tf(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Of(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!Sf.test(d)) return null;
	let f = a ? Af(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function Ef(e, t, n, r, i) {
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
function Df(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Of(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function kf(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function Af(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var jf = "ui-number-input", Mf = "ui-number-input__field", Nf = "data-ui-number-no-decimals", Pf = "data-ui-number-no-negative", Ff = "data-ui-number-no-thousands", If = "data-ui-number-trim-zeros", Lf = "data-ui-number-step", Rf = "data-ui-number-min", zf = "data-ui-number-max", Bf = "data-ui-number-step-direction", Vf = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Mf}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(br(e.components, `.${Mf}`));
		}), S.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${Mf}`)));
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
		let t = Hf(e);
		if (t !== null) return this.keptValue(t) ?? Uf(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = uf(e), r = e === document.activeElement ? wf(t, n, Wf(e)) : Cf(t, n, {
			format: Wf(e),
			thousands: !e.hasAttribute(Ff)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = Hf(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Nf), r = !t.hasAttribute(Pf), i = t.selectionStart ?? t.value.length, a = Ef(t.value, i, uf(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = Hf(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = Hf(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : Uf(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute(If) && !T(t) && !C(t)) {
			let e = this.values.get(t) ?? "", n = Df(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = Hf(e.target);
		if (t === null) return;
		let n = Uf(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = Hf(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = wf(t, uf(e), Wf(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + Bf + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Mf}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(Bf) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = Hf(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(Lf) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : Uf(e) ?? "0") || 0) + n * t, i = e.getAttribute(Rf), a = e.getAttribute(zf);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, Gf(r)), this.show(e);
	}
};
function Hf(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Mf) ? e : null;
}
function Uf(e) {
	return Tf(e.value, uf(e), Wf(e));
}
function Wf(e) {
	return e.closest(`.${jf}`)?.getAttribute("data-ui-number-format") ?? null;
}
function Gf(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var Kf = `:scope > [${He}], :scope > [${Ue}], :scope > [${$e}]`;
function M(e) {
	let t = new Set(e.querySelectorAll(Kf));
	return [...e.children].filter((e) => !t.has(e));
}
function qf(e) {
	return e === null ? [] : [e];
}
function Jf(e) {
	return e.querySelector(`:scope > [${He}]`);
}
function Yf(e, t, n, r, i) {
	i ??= M(e).some((e) => !e.classList.contains(Tn));
	let a = Jf(e);
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
	c.setAttribute(He, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var N = { ok: !1 };
function Xf(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Wn(e.kind) !== "Scope"), o = r, s = r, c = !0, l = 0, u = 0, d = !0;
	for (; u < i.length;) {
		let t = i[u];
		if (t === ".") {
			if (d) return N;
			d = !0, u++;
			continue;
		}
		if (t === "[") {
			if (u + 1 >= i.length || i[u + 1] !== "]" || l >= a.length) return N;
			let t = a[l];
			if (l++, Wn(t.kind) === "Dynamic") {
				let n = ep(e, t.componentId);
				if (!n.ok) return N;
				o = n.value, s = n.value, c = !0;
			} else {
				if (!c) return N;
				let e = op(o, t.value);
				if (!e.ok) return N;
				o = e.value;
			}
			u += 2, d = !1;
			continue;
		}
		let n = u;
		for (; u < i.length && i[u] !== "." && i[u] !== "[";) u++;
		if (u === n) return N;
		if (c) {
			let e = np(o, i.slice(n, u));
			e.ok ? o = e.value : c = !1;
		}
		d = !1;
	}
	return d || l !== a.length || !c ? N : {
		ok: !0,
		value: o,
		scope: s
	};
}
function Zf(e, t, n) {
	for (let r of t ?? []) {
		if (Wn(r.kind) !== "Dynamic") continue;
		let t = v(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function Qf(e) {
	let t = np(e, "IsContent");
	return t.ok && t.value === !0;
}
var $f = /* @__PURE__ */ new Set();
function ep(e, t) {
	let n = v(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return $f.has(n) || ($f.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), N;
}
function tp(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = np(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function np(e, t) {
	if (e == null) return N;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return N;
	let n = e, r = rp(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : N;
}
function rp(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = ip(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function ip(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function ap(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Wn(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Wn(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = v(e.componentId);
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
function op(e, t) {
	if (e == null || t == null) return N;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : N;
	if (typeof t != "string") return N;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (cp(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return N;
}
function sp(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (cp(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function cp(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function lp(e) {
	let t = e.closest(g)?.querySelector(":scope > [data-ui-items-query]")?.getAttribute("data-ui-items-query") ?? null;
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
function up(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = lp(e);
	if (a === void 0 && o === null) {
		for (let t of M(e)) t.classList.remove(Tn);
		return;
	}
	for (let n of M(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(Tn);
			continue;
		}
		n.classList.toggle(Tn, !dp(a, e, i, o));
	}
}
function dp(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => gp(e, t, n)) && (r?.filters ?? []).every((e) => cs(tp(t, e.itemProperty), e.operator, e.value));
}
function fp(e, t, n = null) {
	return (e?.filters ?? []).some((e) => _p(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function pp(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => _p(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function mp(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => hp(n.getItemValue(e), n.getItemValue(r), t));
}
function hp(e, t, n) {
	for (let r of n) {
		let n = vp(tp(e, r.itemProperty), tp(t, r.itemProperty));
		if (n !== 0) return Yn(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function gp(e, t, n) {
	if (!_p(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return cs(tp(t, e.itemProperty), e.operator, r);
}
function _p(e, t, n, r) {
	return e == null || cs(r.get(e, []), t, n);
}
function vp(e, t) {
	if (e === t) return 0;
	let n = bp(e), r = bp(t);
	if (n !== r) return n - r;
	if (n === yp.Nothing) return 0;
	if (n === yp.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var yp = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function bp(e) {
	return e == null ? yp.Nothing : typeof e == "number" ? Number.isNaN(e) ? yp.Nothing : yp.Number : typeof e == "string" && e.trim().length === 0 ? yp.Nothing : Number.isNaN(Number(e)) ? yp.Text : yp.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function xp(e) {
	switch (e.getAttribute(Je)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
//#endregion
//#region src/items/items-source-order.ts
var Sp = /* @__PURE__ */ new WeakMap();
function Cp(e, t) {
	let n = Sp.get(e), r = n === void 0 ? [...t] : wp(n, t);
	return Sp.set(e, r), r;
}
function wp(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function Tp(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Ep(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Dp(e, t, n) {
	return Ep(e, t), Tp(e, t, n);
}
function Op(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function kp(e) {
	Sp.delete(e);
}
//#endregion
//#region src/interactions/drag-marks.ts
function Ap(e, t, n, r, i, a = []) {
	jp(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function jp(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Mp = ".ui-items-view, .ui-table", Np = ".ui-items-view__item, .ui-table__row", Pp = "ui-row--dragging", Fp = "--ui-row-drop-offset", Ip = "move", Lp = {
	name: Ip,
	registration: { dynamicParameters: (e) => {
		let t = e.domEvent instanceof CustomEvent ? e.domEvent.detail?.index : void 0;
		return typeof t == "number" ? [...e.dynamicParameters, t] : null;
	} }
}, Rp = class {
	root;
	services;
	drag = null;
	lifted = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.services = e.services, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), this.root.addEventListener("pointerup", () => this.release(), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", () => this.endDrag(), !0);
	}
	handlePointerDown(e) {
		if (this.release(), !(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t === null ? null : D(t.row);
		if (t === null || n === null) return;
		let r = Bp(t.root, t.row);
		(r === null ? !Vp(e.target, t.row) : !r.contains(e.target)) || (r !== null && (to(t.root, qp(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 })), n.draggable || (n.draggable = !0, this.lifted = n));
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	movableRow(e) {
		let t = e.closest(ka), n = t?.parentElement ?? null, r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return t === null || n === null || r === null || !t.matches(Np) || !n.hasAttribute("data-ui-items-host") || !r.hasAttribute("data-ui-rows-draggable") || C(r) || t.hasAttribute("data-ui-undraggable") || w(t) || this.isSorted(r, n) ? null : {
			root: r,
			row: t
		};
	}
	isSorted(e, t) {
		let n = Sr(e);
		return this.services === void 0 || n === null ? !1 : pp(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, lp(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : D(t.row);
		t !== null && n !== null && r !== null && e.target === r && (this.drag = {
			root: t.root,
			host: n,
			row: t.row
		}, Ap(e, t.root, r, Pp, O(t.row)));
	}
	handleDragOver(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		let n = Up(t), r = qp(t.host), i = this.placeOf(t, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? Yp(t.root, null) : Yp(t.root, i, Gp(r, i, n));
	}
	placeOf(e, t, n, r, i) {
		if (t.closest("[data-ui-group-header]")?.parentElement === e.host) return null;
		let a = t.closest(ka);
		for (; a !== null && a.parentElement !== e.host;) a = a.parentElement?.closest(ka) ?? null;
		if (a ??= Kp(i, n), a === null) return null;
		let o = (D(a) ?? a).getBoundingClientRect();
		if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
			anchor: a,
			side: "after"
		};
		let s = i[i.indexOf(a) - 1];
		return s !== void 0 && Wp(s, a, r) ? {
			anchor: s,
			side: "after"
		} : {
			anchor: a,
			side: "before"
		};
	}
	indexOf(e, t, n) {
		if (Hp(t) !== Hp(e.row)) return null;
		let r = zp(this.orderOf(e.host), O(e.row), O(t), n);
		return r === null ? null : r + Jp(e.host);
	}
	orderOf(e) {
		switch (xp(e)) {
			case "virtualized": return [...this.services?.keysOf(e) ?? M(e).map(O)];
			case "windowed": return M(e).map(O);
			default: return Cp(e, M(e)).map(O);
		}
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && !(e.relatedTarget instanceof Node && t.host.contains(e.relatedTarget)) && Yp(t.root, null);
	}
	handleDrop(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		e.preventDefault();
		let n = this.placeOf(t, e.target, e, Up(t), qp(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && ao(t.row, Ip, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (jp(e.root, Pp), Yp(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = Qa(e.target);
		if (t === null || !t.root.matches(Mp) || t.row !== null && Ql(e.target, t.row) !== null) return;
		let n = Ka(t.root), r = n === null ? [] : qp(n), i = eo(r);
		if (n === null || i === null || this.movableRow(i) === null) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			root: t.root,
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && ao(i, Ip, { index: c });
	}
};
function zp(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = e.filter((e) => e !== t).indexOf(n);
	if (a < 0) return null;
	let o = r === "before" ? a : a + 1;
	return o === i ? null : o;
}
function Bp(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${ve}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function Vp(e, t) {
	return Ql(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function Hp(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function Up(e) {
	let t = e.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: t,
		rightToLeft: t && getComputedStyle(e.host).direction === "rtl"
	};
}
function Wp(e, t, n) {
	if (Hp(e) !== Hp(t)) return !1;
	if (!n.across) return !0;
	let r = (D(e) ?? e).getBoundingClientRect(), i = (D(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function Gp(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !Wp(t.anchor, r, n)) return -1;
	let i = (D(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (D(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function Kp(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (D(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function qp(e) {
	return M(e).filter((e) => e instanceof HTMLElement && e.matches(Np) && D(e) !== null);
}
function Jp(e) {
	let t = xp(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function Yp(e, t, n = 0) {
	let r = t === null ? null : D(t.anchor);
	for (let t of e.querySelectorAll(`[${ye}]`)) t !== r && (t.removeAttribute(ye), t.style.removeProperty(Fp));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ye, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Fp) !== i && r.style.setProperty(Fp, i);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var P = "ui-temporal-input", Xp = "ui-temporal-input__value-input", Zp = "ui-temporal-input__end-value-input", Qp = "data-ui-temporal-range", $p = "data-ui-temporal-end", em = "data-ui-temporal-mode", tm = "data-ui-temporal-format", nm = "data-ui-temporal-default-format", rm = "data-ui-temporal-min", im = "data-ui-temporal-max", am = "data-ui-temporal-step", om = "data-ui-temporal-step-unit", sm = "data-ui-temporal-page-culture", cm = "data-ui-temporal-months", lm = "data-ui-temporal-months-genitive", um = "data-ui-temporal-months-short", dm = "data-ui-temporal-daynames", fm = "data-ui-temporal-weekdays", pm = "data-ui-temporal-am", mm = "data-ui-temporal-pm", hm = /* @__PURE__ */ new Set([
	tm,
	nm,
	rm,
	im,
	cm,
	pm,
	mm
]), gm = 2e3;
function _m(e) {
	let t = e.getAttribute(em);
	return t === "time" || t === "date-time" ? t : "date";
}
function vm(e) {
	let t = e.getAttribute(tm);
	return t === null || t.trim().length === 0 ? e.getAttribute(nm) ?? "" : t;
}
function ym(e) {
	let t = e.getAttribute(om), n = Math.max(1, Math.trunc(Number(e.getAttribute(am))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function bm(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function xm(e) {
	return {
		monthNames: Sm(e, cm),
		monthGenitiveNames: Sm(e, lm),
		abbreviatedMonthNames: Sm(e, um),
		dayNames: Sm(e, dm),
		abbreviatedDayNames: Sm(e, fm),
		amDesignator: e.getAttribute(pm) ?? "AM",
		pmDesignator: e.getAttribute(mm) ?? "PM"
	};
}
function Sm(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Cm(e, t) {
	e.hasAttribute(sm) && (Dm(e, lm, t.monthGenitiveNames.join("|")), Dm(e, um, t.abbreviatedMonthNames.join("|")), Dm(e, dm, t.dayNames.join("|")), Dm(e, fm, t.abbreviatedDayNames.join("|")), Dm(e, cm, t.monthNames.join("|")), Dm(e, pm, t.amDesignator), Dm(e, mm, t.pmDesignator), Dm(e, nm, Em(_m(e), ym(e), t)));
}
function wm(e) {
	for (let t = 0; t < e.length;) {
		let n = zr(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Tm(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function Em(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Nr(n, r);
}
function Dm(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Om(e) {
	return e.hasAttribute(Qp);
}
function km(e) {
	return e !== null && e.hasAttribute($p);
}
function Am(e) {
	return F(e, !1);
}
function F(e, t) {
	let n = jm(e, t);
	return n === null ? null : Hm(n.value, _m(e));
}
function jm(e, t) {
	return e.querySelector(`.${t ? Zp : Xp}`);
}
function Mm(e, t) {
	return Hm(e.getAttribute(t) ?? "", _m(e));
}
function Nm(e, t, n) {
	let r = jm(e, n);
	if (r === null) return;
	let i = t === null ? "" : Um(t, _m(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Pm(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : Jr(n, vm(e), xm(e));
	return r === null ? n : Um(Ur(r), _m(e));
}
function Fm(e) {
	if (!Om(e)) return;
	let t = F(e, !1), n = F(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (Nm(e, n, !1), Nm(e, t, !0));
}
function Im(e) {
	T(e) || C(e) || (Lm(e, !1), Om(e) && Lm(e, !0));
}
function Lm(e, t) {
	let n = F(e, t);
	if (n === null) return;
	let r = zm(e, n);
	r.getTime() !== n.getTime() && Nm(e, r, t);
}
function Rm(e) {
	return Bm(e, zm(e, /* @__PURE__ */ new Date()));
}
function zm(e, t) {
	let n = Mm(e, rm), r = Mm(e, im);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function Bm(e, t) {
	let n = ym(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var Vm = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function Hm(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = Vm.exec(n);
		return e === null ? null : new Date(gm, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Hr(n);
	return r === null ? null : Ur(r);
}
function Um(e, t) {
	let n = `${Wm(e.getHours())}:${Wm(e.getMinutes())}:${Wm(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${Wm(e.getMonth() + 1)}-${Wm(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function Wm(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function Gm(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = Jm(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < Ym(e.start).getTime() ? {
		start: Jm(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: Jm(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function Km(e, t, n) {
	if (t === null || n === null) return !1;
	let r = Ym(e).getTime();
	return r > Ym(t).getTime() && r < Ym(n).getTime();
}
function qm(e, t, n) {
	return !n && Km(e, t.start, t.end);
}
function Jm(e, t) {
	return Wr(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Ym(e) {
	return Wr(e.getFullYear(), e.getMonth(), e.getDate());
}
var Xm = 100 / 3, Zm = 1, Qm = 2;
function $m(e, t = Xm) {
	let n = e.deltaMode === Zm ? Xm : e.deltaMode === Qm ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function eh(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var th = {
	notch: 100,
	pixels: $m
}, nh = "ui-temporal-input__field", rh = "ui-temporal-input__popup", ih = "ui-temporal-input--open", ah = "ui-temporal-input__day", oh = "ui-temporal-input__month", I = "ui-temporal-input__time-cell", sh = "ui-temporal-input__time-column", ch = 4, lh = 140, uh = "data-ui-temporal-toggle", dh = "data-ui-temporal-first-day", fh = "data-ui-temporal-nav", ph = "data-ui-temporal-day", mh = "data-ui-temporal-unit", hh = "data-ui-temporal-cell", gh = "data-ui-temporal-centred", _h = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new Tc({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(ih), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderPopup(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(ih);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyDisplay(this.root.querySelectorAll(`.${P}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = br(e.components, `.${P}`);
			this.applyDisplay(t), this.openPicker !== null && t.includes(this.openPicker) && this.renderPopup(this.openPicker);
		}), A(this.root, `.${P}`, { attributeFilter: [...hm] }, (e) => {
			for (let t of e) this.applyDisplay([t]), t === this.openPicker && this.renderPopup(t);
		}), A(this.root, `.${P}`, { childList: !0 }, (e) => this.applyDisplay(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), S.onChange(() => this.applyWords());
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(`.${P}`)], t = S.temporal;
		if (t !== null && S.language !== this.drawnLanguage) {
			this.drawnLanguage = S.language;
			for (let n of e) Cm(n, t);
		}
		this.applyDisplay(e), this.openPicker !== null && this.renderPopup(this.openPicker);
	}
	get openPicker() {
		return this.popups.current;
	}
	applyDisplay(e) {
		for (let t of e) {
			Im(t);
			let e = Kr(vm(t), Ih());
			for (let n of t.querySelectorAll(`.${nh}`)) {
				if (n.placeholder !== e && (n.placeholder = e), n === document.activeElement && this.written.has(n)) continue;
				this.written.add(n);
				let r = jm(t, km(n))?.value ?? "", i = Hm(r, _m(t));
				if (i !== null) {
					n.value = Lr(i, vm(t), xm(t));
					continue;
				}
				r.length === 0 && (n.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(nh)) return;
		let t = e.target.closest(`.${P}`), n = t === null ? null : jm(t, km(e.target));
		t !== null && n !== null && (km(e.target) && (this.getState(t).choosingEnd = !1), n.value = Pm(t, e.target.value), n.dispatchEvent(new Event("change", { bubbles: !0 })), Fm(t), this.applyDisplay([t]));
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(nh)) return;
		let t = e.target.closest(`.${P}`);
		t !== null && Om(t) && (this.getState(t).activeEnd = km(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.openPicker;
		if (t === null || !(e.target instanceof Element)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${ph}]`) : null;
		if (n !== null && !t.contains(n) || !Om(t)) return;
		let r = this.getState(t), i = n === null ? null : Hm(n.getAttribute(ph) ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Fh(t, r));
	}
	handlePointerMove(e) {
		let t = this.openPicker, n = e.target instanceof Element ? e.target.closest(`[${ph}], .${I}`) : null;
		t === null || n === null || !t.contains(n) || n === document.activeElement || n.matches(":disabled") || (n.classList.contains(I) ? Hh(n) : this.followPointer(t, n));
	}
	followPointer(e, t) {
		let n = e.querySelector(`.${rh}`), r = Hm(t.getAttribute(ph) ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, E([...n.querySelectorAll(`.${ah}`)], t), bo(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(nh)) return;
		let t = e.target.closest(`.${P}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${uh}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${P}`));
			return;
		}
		let n = e.target.closest(`.${rh}`)?.closest(`.${P}`);
		if (n == null) return;
		let r = e.target.closest(`[${fh}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute(fh) ?? "");
			return;
		}
		let i = e.target.closest(`[${ph}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute(ph) ?? "");
			return;
		}
		let a = e.target.closest(`[${hh}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${mh}]`)?.getAttribute(mh);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(hh)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (t.startsWith("month:")) {
			n.view = Wr(n.view.getFullYear(), Number(t.slice(6)), 1), n.pane = "days", this.renderPopup(e);
			return;
		}
		switch (t) {
			case "previous":
				n.view = eg(n.view, n.pane === "months" ? -12 : -1);
				break;
			case "next":
				n.view = eg(n.view, n.pane === "months" ? 12 : 1);
				break;
			case "pane":
				n.pane = n.pane === "days" ? "months" : "days";
				break;
			case "now":
				n.choosingEnd = !1, this.commit(e, Rm(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Om(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
		this.renderPopup(e);
	}
	chooseDay(e, t) {
		let n = Hm(t, "date");
		if (n === null) return;
		let r = this.getState(e);
		if (Om(e)) {
			this.choosePeriodDay(e, r, n);
			return;
		}
		let i = Am(e) ?? Rm(e), a = Wr(n.getFullYear(), n.getMonth(), n.getDate(), i.getHours(), i.getMinutes(), i.getSeconds());
		r.focusedDay = a, r.view = Zh(a), this.commit(e, a);
	}
	choosePeriodDay(e, t, n) {
		let r = Rm(e), i = Gm({
			start: F(e, !1),
			end: F(e, !0)
		}, t.activeEnd, zh(n, r));
		t.focusedDay = i.end ?? i.start, t.view = Zh(n), t.activeEnd = i.active, t.choosingEnd = !i.complete, t.hoverDay = null, Nm(e, i.end, !0), Nm(e, i.start, !1), this.applyDisplay([e]), this.renderPopup(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Om(e) && this.getState(e).activeEnd === "end", i = new Date(F(e, r) ?? Rm(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		Nm(e, t, n), Fm(e), this.applyDisplay([e]), e === this.openPicker && this.renderPopup(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(nh)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${P}`), km(e.target) ? "end" : "start");
			return;
		}
		if (this.openPicker === null) return;
		let t = this.openPicker;
		if (e.target instanceof HTMLElement && e.target.classList.contains(I)) {
			Uh(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(ah)) return;
		let n = Hm(e.target.getAttribute(ph) ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, Um(n, "date"));
			return;
		}
		let r = Xh(n, e.key, Yh(t));
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Zh(r), this.renderPopup(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${sh}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, lh)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${sh}`), n = t?.getAttribute(mh) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = eh(this.wheelTurns.get(n) ?? 0, $m(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${I}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${I}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${I}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(hh)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(gh));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(mh), i = kh(e);
		if (!(r === null || i === null || i.classList.contains(`${I}--selected`))) {
			if (i.matches(":disabled")) {
				Dh(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(hh)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${rh}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Om(e) ? t ?? (F(e, !1) === null ? "start" : F(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = F(e, r.activeEnd === "end") ?? Am(e);
		r.pane = "days", r.view = Zh(i ?? zm(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${uh}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: {
				placement: "bottom-end",
				gap: ch
			},
			openers: a === null ? [] : [a],
			returnFocus: () => Rh(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = {
			view: Zh(Am(e) ?? /* @__PURE__ */ new Date()),
			pane: "days",
			focusedDay: Am(e),
			activeEnd: "start",
			hoverDay: null,
			choosingEnd: !1
		}, this.states.set(e, t)), t;
	}
	renderPopup(e, t = !1) {
		let n = e.querySelector(`.${rh}`);
		if (n === null) return;
		let r = _m(e), i = this.getState(e), a = xm(e), o = Om(e), s = F(e, o && i.activeEnd === "end"), c = Ah(n), l = jh(n), u = n.contains(document.activeElement);
		n.replaceChildren(), o && n.append(Ph(i));
		let d = L("div", `${P}__panes`);
		d.append(vh(e, i, a, s)), r === "date-time" && d.append(xh(e, s)), n.append(d, Nh(r));
		let f = l === null ? null : n.querySelector(`[${fh}="${CSS.escape(l)}"]`);
		Vh(n, i, s, t || u && c === null && f === null), Fh(e, i), Eh(n), Dh(n), Mh(n, c), f !== null && k(f), this.popups.reposition(e);
	}
};
function vh(e, t, n, r) {
	let i = L("div", `${P}__calendar`), a = L("div", `${P}__calendar-header`);
	a.append(Bh("previous", "‹", S.text("ui.picker.previous")));
	let o = Bh("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	return o.classList.add(`${P}__calendar-label`), a.append(o), a.append(Bh("next", "›", S.text("ui.picker.next"))), i.append(a), i.append(t.pane === "days" ? yh(e, t, n, r) : bh(t, n)), i;
}
function yh(e, t, n, r) {
	let i = Yh(e), a = L("div", `${P}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = L("span", `${P}__weekday`);
		t.textContent = n.abbreviatedDayNames[(i + e) % 7], a.append(t);
	}
	let o = L("div", `${P}__days`), s = Ym(/* @__PURE__ */ new Date()), c = Om(e), l = c ? F(e, !1) : r, u = c ? F(e, !0) : null, d = Qh(t.view, i);
	for (let n = 0; n < 42; n++) {
		let r = $h(d, n), i = L("button", ah);
		i.type = "button", i.tabIndex = -1, i.textContent = String(r.getDate()), i.setAttribute(ph, Um(r, "date")), r.getMonth() !== t.view.getMonth() && i.classList.add(`${ah}--outside`), tg(r, s) && i.classList.add(`${ah}--today`), (l !== null && tg(r, l) || u !== null && tg(r, u)) && (i.classList.add(`${ah}--selected`), i.setAttribute("aria-selected", "true")), qm(r, {
			start: l,
			end: u
		}, t.choosingEnd) && i.classList.add(`${ah}--within`), qh(e, r) && (i.disabled = !0), o.append(i);
	}
	let f = L("div", `${P}__calendar-pane`);
	return f.append(a, o), f;
}
function bh(e, t) {
	let n = L("div", `${P}__months`);
	for (let r = 0; r < 12; r++) {
		let i = L("button", oh);
		i.type = "button", i.textContent = t.abbreviatedMonthNames[r], i.setAttribute(fh, `month:${r}`), r === e.view.getMonth() && i.classList.add(`${oh}--selected`), n.append(i);
	}
	return n;
}
function xh(e, t) {
	let n = ym(e), r = L("div", `${P}__time`), i = L("div", `${P}__time-columns`);
	for (let r of Sh(n)) i.append(Th(e, r, Ch(n, r), t));
	return r.append(i), r;
}
function Sh(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function Ch(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function wh(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function Th(e, t, n, r) {
	let i = L("div", sh);
	i.setAttribute(mh, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", S.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = wh(r, t), s = t === "hour" && wm(vm(e)), c = xm(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = L("button", I);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Tm(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(hh, String(u)), u === o && (n.classList.add(`${I}--selected`), n.setAttribute("aria-selected", "true")), Jh(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function Eh(e) {
	let t = e.querySelector(`.${P}__calendar`), n = e.querySelector(`.${P}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function Dh(e) {
	for (let t of e.querySelectorAll(`.${sh}`)) {
		let e = t.querySelector(`.${I}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, Oh(t, e), t.setAttribute(gh, String(t.scrollTop));
	}
}
function Oh(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function kh(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${I}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function Ah(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(I) ? null : t.closest(`.${sh}`)?.getAttribute(mh) ?? null;
}
function jh(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(fh) : null;
}
function Mh(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${sh}[${mh}="${t}"]`)?.querySelector(`.${I}--selected`) ?? null;
	n !== null && k(n);
}
function Nh(e) {
	let t = L("div", `${P}__popup-footer`);
	return t.append(Bh("now", S.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Bh("clear", S.text("ui.picker.clear"))), t.append(Bh("done", S.text("ui.picker.done"))), t;
}
function Ph(e) {
	let t = L("div", `${P}__period-caption`);
	return t.textContent = S.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Fh(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? F(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${ah}`)) {
		let e = Hm(t.getAttribute(ph) ?? "", "date");
		t.classList.toggle(`${ah}--preview`, e !== null && n !== null && r !== null && Km(e, n, $h(r, 1)));
	}
}
function Ih() {
	return {
		year: Lh("ui.picker.letter.year", Gr.year),
		month: Lh("ui.picker.letter.month", Gr.month),
		day: Lh("ui.picker.letter.day", Gr.day),
		hour: Lh("ui.picker.letter.hour", Gr.hour),
		minute: Lh("ui.picker.letter.minute", Gr.minute),
		second: Lh("ui.picker.letter.second", Gr.second)
	};
}
function Lh(e, t) {
	let n = S.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function Rh(e, t) {
	for (let n of e.querySelectorAll(`.${nh}`)) if (km(n) === t) return n;
	return e.querySelector(`.${nh}`);
}
function zh(e, t) {
	return Wr(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Bh(e, t, n) {
	let r = L("button", `${P}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(fh, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function L(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Vh(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${ah}`)];
	if (i.length === 0) return;
	let a = Um(Ym(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute(ph) === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (E(i, o), r && k(o));
}
function Hh(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(I) && bo(e);
}
function Uh(e) {
	let t = e.target, n = t.closest(`.${sh}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? Gh(n, e.key === "ArrowRight" ? 1 : -1) : Wh(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), Kh(r));
}
function Wh(e, t, n) {
	return ba({
		key: n,
		items: [...e.querySelectorAll(`.${I}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function Gh(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${sh}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${I}--selected`) ?? r.querySelector(`.${I}:not(:disabled)`);
}
function Kh(e) {
	let t = e.closest(`.${sh}`);
	t !== null && Oh(t, e);
}
function qh(e, t) {
	let n = Mm(e, rm), r = Mm(e, im);
	return n !== null && t.getTime() < Ym(n).getTime() || r !== null && t.getTime() > Ym(r).getTime();
}
function Jh(e, t, n, r) {
	let i = Mm(e, rm), a = Mm(e, im);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
function Yh(e) {
	let t = Number(e.getAttribute(dh));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Xh(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return $h(e, -1);
		case "ArrowRight": return $h(e, 1);
		case "ArrowUp": return $h(e, -7);
		case "ArrowDown": return $h(e, 7);
		case "PageUp": return eg(e, -1);
		case "PageDown": return eg(e, 1);
		case "Home": return $h(e, -r);
		case "End": return $h(e, 6 - r);
		default: return null;
	}
}
function Zh(e) {
	return Wr(e.getFullYear(), e.getMonth(), 1);
}
function Qh(e, t) {
	let n = Zh(e);
	return $h(n, -((n.getDay() - t + 7) % 7));
}
function $h(e, t) {
	return Wr(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function eg(e, t) {
	let n = Wr(e.getFullYear(), e.getMonth() + t, 1), r = Wr(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Wr(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function tg(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var ng = "[data-ui-theme-switcher]", rg = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(ng) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: Hn.SetTheme,
				mode: ig() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function ig() {
	let e = document.documentElement.getAttribute(rn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var ag = `[${on}]`, og = "ui-language-switcher__trigger", sg = "ui-language-switcher__label-text", cg = "ui-language-switcher__label-text--current", lg = "ui-language-switcher__label-text--page", ug = "ui-language-switcher__menu", dg = "ui-language-switcher__choice", fg = "ui-language-switcher--open", pg = 4, mg = "ui.language.switch", hg = class {
	options;
	root;
	menus = new Tc({
		show: ({ owner: e }) => e.classList.add(fg),
		hide: ({ owner: e }) => e.classList.remove(fg),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), S.onChange(() => this.showLanguage(S.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dg}`), n = e.target.closest(ag);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(sn));
			return;
		}
		let r = e.target.closest(`.${og}`);
		if (r === null || C(r)) return;
		e.preventDefault();
		let i = gg(n);
		if (i.length === 2) {
			let e = S.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(ag);
		if (t === null) return;
		let n = gg(t), r = e.target.closest(`.${og}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !xa(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = ba({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${dg}`);
		if (t === null || t === document.activeElement || C(t)) return;
		let n = t.closest(ag);
		n !== null && this.menus.isOpen(n) && bo(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${ug}`);
		if (r === null) return;
		let i = gg(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: pg
			},
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Mo(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: Hn.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(ag)) {
			let n = t.querySelector(`:scope > .${og}`);
			if (n === null) continue;
			for (let n of gg(t)) n.setAttribute("aria-checked", n.getAttribute("data-ui-language") === e ? "true" : "false");
			let r = e.toUpperCase();
			for (let t of n.querySelectorAll(`.${sg}`)) {
				let n = t.getAttribute(sn) === e;
				t.classList.toggle(cg, n), t.classList.contains(lg) && t.toggleAttribute("hidden", !n), n && (r = t.textContent ?? r);
			}
			S.write(n, "aria-label", mg, { language: r });
		}
	}
};
function gg(e) {
	return [...e.querySelectorAll(`:scope > .${ug} > .${dg}`)];
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var _g = "data-ui-context-menu-owner", vg = Se, yg = "ui-context-menu--open", bg = "ui-menu", xg = `.ui-menu-item:not(${xt})`, Sg = "ui-context-menu-opening", Cg = Ct, wg = class {
	root;
	closed = null;
	menus = new Tc({
		show: ({ popup: e }) => e.classList.add(yg),
		hide: ({ popup: e }, t) => {
			e.classList.remove(yg), this.closed = e, t === "outside" && Eg();
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e),
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), this.root.addEventListener("click", (e) => this.handleInside(e), !1);
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
		let n = t.closest(`[${he}]`), r = t.closest(`[${Ce}]`);
		for (let i = t.closest(`[${_g}]`); i !== null; i = i.parentElement?.closest(`[${_g}]`) ?? null) {
			if (n !== null && i.contains(n)) return;
			let a = r !== null && i.contains(r) ? r.getAttribute("data-ui-context-menu-use") ?? "" : "", o = [a.length > 0 ? Dg(i, a) : null, Dg(i, "")].filter((e) => e !== null);
			if (o.length === 0 || C(i)) continue;
			if (Og(i)) return;
			let s = o.find((e) => this.prepare(e, t));
			if (s !== void 0) {
				e.preventDefault(), this.open(i, s, e.clientX, e.clientY);
				return;
			}
		}
	}
	prepare(e, t) {
		let n = new CustomEvent(Sg, {
			bubbles: !0,
			cancelable: !0,
			detail: { target: t }
		});
		return e.dispatchEvent(n);
	}
	open(e, t, n, r) {
		this.menus.close(), this.closed !== null && (bs(this.closed), this.closed = null);
		let i = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? _o();
		if (!this.menus.open({
			owner: e,
			popup: t,
			returnFocus: () => (i === null ? null : No(i)) ?? No(e)
		})) return;
		let a = t.getBoundingClientRect();
		t.style.left = `${nc(n, a.width, window.innerWidth)}px`, t.style.top = `${nc(r, a.height, window.innerHeight)}px`, Tg(t);
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(Cg) !== null || this.menus.close();
	}
};
function Tg(e) {
	let t = e.querySelector(`.${bg}`);
	t !== null && Mo(e, j(t, xg, `.${bg}`));
}
function Eg() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${so}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function Dg(e, t) {
	for (let n of e.querySelectorAll(`[${vg}]`)) if ((n.getAttribute(vg) ?? "") === t && n.closest(`[${_g}]`) === e) return n;
	return null;
}
function Og(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${m}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function kg(e) {
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
		default: o = Fg(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function Ag(e, t, n = Mg()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var jg = null;
function Mg() {
	return jg === null && (jg = Ng()), jg;
}
function Ng() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function Pg(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function Fg(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : Ig[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : Ig[t] ?? null;
}
var Ig = {
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
}, Lg = "ui-menu", Rg = "ui-menu-item--selected", zg = "ui-context-menu", Bg = "ui-orientation--horizontal", Vg = "data-ui-menu-shortcut", Hg = "[role='menuitem'], [role='menuitemcheckbox']", Ug = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(Gg) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [Vg, mt]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Lg}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && E(t, t.find((e) => e.classList.contains(Rg) && Ca(e)) ?? t.find(Ca) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yt}`), n = t?.closest(`.${Lg}`) ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			Wg(e, t);
			return;
		}
		let r = this.ownItems(n), i = ba({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Bg) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), E(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(`.${Lg}`) ? t : t.querySelector(`.${Lg}`);
		if (n === null) return;
		let r = this.ownItems(n), i = ba({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(Bg) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), E(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yt}`), n = t?.closest(`.${Lg}`) ?? null;
		t !== null && n !== null && E(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${yt}`) : null;
		if (t === null || t === document.activeElement || !t.matches(Hg) || t.matches(xt) || !Ca(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(`.${Lg}`)?.contains(n) === !0) && bo(t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || Kg(e))) return;
		let t = cc(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !Ag(n.shortcut, e))) {
			if (!Ca(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${Vg}]`)) {
			if (e.closest(`.${zg}`) !== null) continue;
			let t = kg(e.getAttribute(Vg));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(Vg)
				});
				continue;
			}
			let n = Pg(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(Vg),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return j(e, `.${yt}:not(${xt})`, `.${Lg}`);
	}
};
function Wg(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(xt) || !Ca(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function Gg(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${Lg}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(Lg) || t.querySelector(`.${Lg}`) !== null)) return !0;
	return !1;
}
function Kg(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/state/client-store.ts
var qg = "ne.ui", Jg = "boot", Yg = /* @__PURE__ */ new Set(), Xg = class {
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
		let r = this.resolveKey(e, Jg);
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
		let n = e.getAttribute(Oe);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Yg.has(n) || (Yg.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${qg}:${n}:${t}`;
	}
}, Zg = "ui-menu", Qg = "ui-menu--nested", $g = "ui-menu-item--selected", e_ = "ui-menu__submenu", t_ = lt, n_ = dt, r_ = "data-ui-menu-flyout", i_ = "data-ui-menu-unfolded", a_ = ut, o_ = "menu-open-group", s_ = class {
	root;
	store = new Xg();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new Tc({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(n_, ""), t.setAttribute(r_, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(n_), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(r_);
			}, vs.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${Zg}`)), A(this.root, `.${Zg}`, {
			childList: !0,
			attributeFilter: [ct]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${t_}]`)) c_(e);
		A(this.root, `[${t_}]`, {
			childList: !0,
			attributeFilter: [n_]
		}, (e) => {
			for (let t of e) c_(t);
		});
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = u_(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), l_(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${t_}]`)) c_(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${$g}`), e);
		if (t !== null && !t.hasAttribute(a_)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Qg) ? null : this.store.read(e, o_), r = n === null ? null : this.findGroup(e, n);
		r !== null && this.openInline(r);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${yt}`), n = this.flyouts.current, r = n === null ? null : this.submenuOf(n);
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
		let a = i.closest(`.${Zg}`);
		a !== null && (u_(a) || i.hasAttribute(a_) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Qg);
		if (e.setAttribute(i_, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(n_);
			return;
		}
		if (t.hasAttribute(n_)) {
			t.removeAttribute(n_), n || this.store.write(e, o_, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, o_, t.getAttribute(m));
	}
	openInline(e) {
		e.setAttribute(n_, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${t_}][${n_}]`)) t.hasAttribute(a_) || t.removeAttribute(n_);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i || (l_(e), this.closeGroups(e), !this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: "right-start",
				gap: 4
			}
		}))) return;
		let a = r.querySelector(`:scope > .${Zg}`);
		a !== null && !vo() && Mo(a, j(a, `.${yt}:not(${xt})`, `.${Zg}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${t_}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(St) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${t_}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${e_}`);
	}
};
function c_(e) {
	let t = e.querySelector(`:scope > .${yt}`), n = e.closest(`.${Zg}`);
	t !== null && (t.setAttribute("aria-expanded", e.hasAttribute(n_) ? "true" : "false"), e.hasAttribute(a_) || n !== null && u_(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function l_(e) {
	for (let t of e.querySelectorAll(`[${r_}]`)) t.removeAttribute(r_);
}
function u_(e) {
	return e.hasAttribute(ct);
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var d_ = `.ui-menu[${ft}]`, f_ = ":scope > .ui-collapsible__bar", p_ = ":scope > .ui-menu__host", m_ = "ui-menu__item", h_ = `:scope > .${yt}`, g_ = ".ui-text__title", __ = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", v_ = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), A(t, d_, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ct]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = y_(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(p_);
		if (n === null) return;
		let r = Ou(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: b_(n)
		}), e.setAttribute(pt, ""), Yu(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of x_(e)) {
			let e = S_(a);
			if (e === "header") {
				n !== null && w_(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			w_(a, o), r ||= o, i ||= o;
		}
		return n !== null && w_(n, r), i;
	}
	match(e, t) {
		let n = Au(C_(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(__) : null;
		if (r === null) return n;
		if (n) return T_(r), e.removeAttribute(dt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(dt, i), i;
	}
	clear(e, t) {
		T_(t), e.removeAttribute(pt), x_(t).length > 0 && Yu(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(ct);
		for (let e of t.querySelectorAll(`[${lt}]:not([${ut}])`)) e.toggleAttribute(dt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...y_(e.target)?.querySelector(p_)?.querySelectorAll(`.ui-menu-item:not(${xt})`) ?? []].find(Ca);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function y_(e) {
	let t = e.closest(d_), n = t?.querySelector(f_) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function b_(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${lt}][${dt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function x_(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(m_));
}
function S_(e) {
	return e.querySelector(h_)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function C_(e) {
	return ku(e.querySelector(h_)?.querySelector(g_)?.textContent ?? "", e);
}
function w_(e, t) {
	e.toggleAttribute(mt, !t);
}
function T_(e) {
	for (let t of e.querySelectorAll(`[${mt}]`)) t.removeAttribute(mt);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var E_ = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], D_ = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function O_(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${D_[t]}px)`)) return t;
	return "base";
}
function k_(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function R(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function A_(e, t) {
	let n;
	for (let r of E_) {
		let i = R(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var j_ = "[data-ui-root]", M_ = "a[href]", N_ = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${D_.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ht}]`);
		if (t !== null) {
			let e = t.closest(j_), n = t.getAttribute(ht);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(M_)?.closest(`[${_t}]`), r = n?.parentElement ?? null;
		n != null && r?.getAttribute("data-ui-drawer-open") === n.getAttribute("data-ui-region") && this.close(r);
	}
	handleKeydown(e) {
		e instanceof KeyboardEvent && e.key === "Escape" && !e.defaultPrevented && this.closeAll();
	}
	toggle(e, t) {
		if (e.getAttribute("data-ui-drawer-open") === t) {
			this.close(e);
			return;
		}
		e.setAttribute(gt, t), this.markToggles(e);
		let n = P_(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, vo(), performance.now() + vs.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(On, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (ko(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${j_}[${gt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(gt);
		if (e.removeAttribute(gt), this.markToggles(e), t === null) return;
		let n = P_(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let n = e.querySelector(`[${ht}="${CSS.escape(t)}"]`);
			n !== null && k(n);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(gt);
		for (let n of e.querySelectorAll(`[${ht}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(ht) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(On), t && e.removeAttribute("tabindex"));
	}
};
function P_(e, t) {
	return e.querySelector(`:scope > [${_t}="${CSS.escape(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var F_ = "ui-collapsible", I_ = "ui-collapsible__content", L_ = "ui-collapsible__bar", R_ = "collapsed", z_ = class {
	root;
	store = new Xg();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${F_}`)), A(this.root, `.${F_}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, R_);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${wt}]`), n = t?.closest(`.${F_}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(ct), i = n.querySelector(`:scope > .${I_}`);
		this.cancelFold(n);
		let a = V_(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, R_, r ? "true" : "false", r ? { attributes: { [ct]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(ct, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${wt}], :scope > .${L_} > [${wt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || ys()) return;
		let i = U_(B_(e), n, V_(e, t), r);
		if (i === null) return;
		e.setAttribute(Tt, "");
		let a = {
			duration: vs.normal,
			easing: vs.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Tt));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Tt);
			for (let e of t) e.cancel();
		}
	}
};
function B_(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function V_(e, t) {
	let n = B_(e), r = H_(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function H_(e) {
	return e === "width" ? "height" : "width";
}
function U_(e, t, n, r) {
	let i = H_(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
//#region src/interactions/pointer-drag.ts
var W_ = class {
	options;
	drag = null;
	constructor(e) {
		this.options = e, e.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0), e.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), e.root.addEventListener("pointerup", (e) => this.handlePointerEnd(e), !0), e.root.addEventListener("pointercancel", (e) => this.handlePointerEnd(e), !0), window.addEventListener("keydown", (e) => this.handleKeyDown(e), !0);
	}
	get active() {
		return this.drag !== null;
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element) || this.drag !== null) return;
		let t = this.options.resolveHandle(e.target);
		if (t === null || C(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n !== null) {
			e.preventDefault();
			try {
				t.setPointerCapture(e.pointerId);
			} catch {}
			t.setAttribute(cn, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 }), this.drag = {
				handle: t,
				context: n,
				origin: this.options.coordinate === void 0 ? 0 : e[this.options.coordinate(n)],
				originPoint: {
					x: e.clientX,
					y: e.clientY
				},
				pointerId: e.pointerId
			};
		}
	}
	handlePointerMove(e) {
		if (!(e instanceof PointerEvent) || this.drag === null || e.pointerId !== this.drag.pointerId) return;
		let { context: t, origin: n } = this.drag, r = this.options.coordinate === void 0 ? 0 : e[this.options.coordinate(t)] - n;
		this.options.move(t, r, {
			x: e.clientX,
			y: e.clientY
		});
	}
	handlePointerEnd(e) {
		if (!(e instanceof PointerEvent) || this.drag === null || e.pointerId !== this.drag.pointerId) return;
		let { handle: t, context: n } = this.drag;
		this.drag = null, t.removeAttribute(cn), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(cn);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
//#endregion
//#region src/interactions/grid-tracks.ts
function G_(e) {
	let t = [];
	for (let n of J_(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = G_(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = K_(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function K_(e) {
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
	if (n !== null) return q_({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return q_(r[3] === "fr" ? {
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
function q_(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function J_(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function Y_(e, t = "auto") {
	return e.map((e) => X_(e, t)).join(" ");
}
function X_(e, t) {
	switch (e.kind) {
		case "px": return `${Z_(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Z_(e.min)}px`}, ${Z_(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Z_(e.max)}px)` : `minmax(${Z_(e.min)}px, auto)`;
	}
}
function Z_(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Q_(e) {
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
function $_(e, t) {
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
function ev(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = tv(r, e), o = tv(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function tv(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function nv(e, t, n, r) {
	let i = rv(e, t, n.before), a = rv(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = cv(n.before, e) + cv(n.after, e), r = i.total + a.total;
		iv(l, e, i, t * (i.total + c) / r), iv(l, e, a, t * (a.total - c) / r);
	} else u || av(l, i, i.total + c), d || av(l, a, a.total - c);
	return l;
}
function rv(e, t, n) {
	let r = sv(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function iv(e, t, n, r) {
	let i = cv(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function av(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...ov(e[i])
		};
	}
}
function ov(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function sv(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function cv(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function lv(e, t) {
	let n = sv(t.before, e), r = n + sv(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function uv(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function dv(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var fv = "ui-grid-splitter", pv = "ui-container", mv = "ui-orientation--vertical", hv = 16, gv = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: Et,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, _v = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: Dt,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, vv = class {
	root;
	store = new Xg();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new W_({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${fv}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${fv}`)), A(this.root, `.${fv}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = yv(t);
			e !== null && (this.restore(e, bv(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of E_) {
			let i = r[n], a = k_(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${fv}`);
		if (t === null || this.drag.active || C(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Tv(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${fv}`), n = t === null ? null : yv(t);
		if (t === null || n === null) return;
		let r = bv(t);
		for (let e of E_) n.style.removeProperty(k_(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = nv(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(k_(e.axis.split, e.tier), Y_(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of E_) {
			let a = k_(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = yv(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = bv(e), r = O_(), i = xv(t, n, r), a = i === null ? null : G_(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = $_(a, Q_(t.getAttribute(n.limits))), s = Sv(t, n), c = Cv(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = ev(c, wv(t, n).map((e) => Cv(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = yv(e);
		if (t === null) return;
		let n = bv(e), r = Cv(e, n), i = Sv(t, n), a = wv(t, n).map((e) => Cv(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : ev(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(lv(i, o))));
	}
};
function yv(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(pv) ? t : null;
}
function bv(e) {
	return e.classList.contains(mv) ? gv : _v;
}
function xv(e, t, n) {
	for (let r = E_.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(k_(t.split, E_[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function Sv(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Cv(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function wv(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(fv) && bv(r) === t && n.push(r);
	return n;
}
function Tv(e) {
	let t = Number(e.getAttribute(Ot));
	return Number.isFinite(t) && t > 0 ? t : hv;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Ev = "ui-split-button", Dv = "ui-split-button__main", Ov = "ui-split-button__toggle", kv = "ui-split-button__menu", Av = "ui-split-button--open", jv = "ui-menu", Mv = 4, Nv = class {
	root;
	menus = new Tc({
		show: ({ owner: e }) => e.classList.add(Av),
		hide: ({ owner: e }) => e.classList.remove(Av),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = Pv(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${Dv}`)?.closest(`.${Ev}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = Pv(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = Fv(t), r = e.target.closest(`.${yt}`);
		n === null || r === null || !n.contains(r) || r.matches(`${xt}, ${Ct}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = Fv(e), r = n?.querySelector(`.${jv}`) ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Mv
			},
			openers: Iv(e)
		}) && Mo(r, j(r, `.${yt}:not(${xt})`, `.${jv}`), t);
	}
};
function Pv(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${Ov}, .${Dv}`), n = t?.closest(`.${Ev}`) ?? null;
	return t === null || n === null || t.classList.contains(Dv) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function Fv(e) {
	return e.querySelector(`:scope > .${kv}`);
}
function Iv(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var Lv = "ui-button-group", Rv = "ui-button-group__item", zv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Lv}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), A(this.root, `.${Lv}`, {
			childList: !0,
			attributeFilter: [fn]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = Bv(i);
			i.toggleAttribute(dn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		E(n, r ?? n.find(Ca) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rv}`), n = t?.closest(`.${Lv}`) ?? null;
		if (t === null || n === null || t.closest(`.${Lv}`) !== n || C(n)) return;
		let r = Bv(t);
		r !== null && C(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Rv} > .${Mn}`), n = t?.closest(`.${Lv}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(Bv).filter((e) => e !== null), i = ba({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${Rv}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Ea(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: fn,
			bindingAttribute: mn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return j(e, `.${Rv}`, `.${Lv}`);
	}
};
function Bv(e) {
	return e.querySelector(`:scope > .${Mn}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var Vv = "ui-accordion", Hv = "details", Uv = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${Vv}`)), A(this.root, `.${Vv}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(Vv))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${Hv}`)];
	}
};
//#endregion
//#region src/interactions/element-visibility.ts
function Wv(e) {
	return getComputedStyle(e).display !== "none";
}
function Gv(e) {
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
				if (e.overflowX !== "visible" && Kv(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && Kv(n, a, a + t.clientHeight, !1), qv(n)) return !0;
			}
			r = e.position;
		}
	}
	return Kv(n, 0, window.innerWidth, !0), Kv(n, 0, window.innerHeight, !1), qv(n);
}
function Kv(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function qv(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/strip-overflow.ts
var Jv = "ui-tab-overflow", Yv = "ui-tab-overflow__menu", Xv = "ui-tab-overflow__menu--open", Zv = "ui-tab-overflow__entry", Qv = "ui-tab-overflow__entry--current", $v = class {
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
		this.options = e, this.list = new ny(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : ey({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return ty(e, this.options.hiddenClass, t);
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
function ey(e) {
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
function ty(e, t, n) {
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
var ny = class {
	menu;
	button = null;
	list = new Tc({
		show: ({ popup: e }) => e.classList.add(Xv),
		hide: ({ popup: e }) => {
			e.classList.remove(Xv), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = Yv, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(ry)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${Qv}`);
		r !== null && E(this.entries(), r), this.button = e, Ms(e, this.menu), this.list.open({
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
		}) ? r === null && Mo(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Zv}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || C(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = ba({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), E(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${Zv}`) : null;
		t === null || t === document.activeElement || C(t) || (E(this.entries(), t), bo(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${Zv}`));
	}
};
function ry(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${Zv} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(Qv, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(m, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Sn), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var iy = "ui-tabs", ay = "ui-tab-header", oy = "ui-tab-header--selected", sy = "ui-tab-header--overflowed", cy = "ui-tabs--overflowing", ly = "ui-tabs--no-overflow", uy = "ui-tabs__strip", dy = "data-ui-tab-key", fy = "data-ui-tab-page", py = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new $v({
			rootClass: iy,
			overflowingClass: cy,
			wraps: (e) => e.classList.contains(ly),
			hiddenClass: sy,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${iy}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), A(this.root, `.${iy}`, {
			childList: !0,
			attributeFilter: [hn, ...yn],
			relevant: (e) => !ac(e, `[${fy}]`, `.${iy}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(dy) ?? "") === t) ?? null;
		if (r !== null && !my(r)) {
			let t = n.find(my);
			if (t !== void 0) {
				this.select(e, t.getAttribute(dy) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(dy) ?? "") === t;
			e.classList.toggle(oy, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(my), i), E(n.filter((e) => !e.classList.contains(sy)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(fy) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${uy}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(dy) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(my).map((e) => {
				let n = e.getAttribute(dy) ?? "";
				return {
					key: n,
					title: e.textContent?.trim() ?? n,
					current: n === t,
					disabled: C(e)
				};
			});
		});
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jv}`), n = t?.closest(`.${iy}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${iy}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${ay}`);
		if (r === null || C(r)) return;
		let i = r.closest(`.${iy}`), a = r.getAttribute(dy);
		i !== null && a !== null && r.closest(`.${iy}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ay}`), n = t?.closest(`.${iy}`) ?? null;
		if (t === null || n === null) return;
		let r = ba({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(dy) ?? ""), r.focus());
	}
	select(e, t) {
		Ea(e, t, {
			attribute: hn,
			bindingAttribute: mn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return j(e, `.${ay}`, `.${iy}`);
	}
	ownPages(e) {
		return j(e, `[${fy}]`, `.${iy}`);
	}
};
function my(e) {
	return e.classList.contains(sy) || Wv(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var hy = "ui-command-bar", gy = "ui-command-bar__host", _y = "ui-command-bar__item", vy = "ui-command-bar__overflow", yy = "ui-command-bar--overflowing", by = "ui-command-bar__overflowed", xy = "ui-text__title", Sy = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new $v({
			rootClass: hy,
			overflowingClass: yy,
			wraps: (e) => !wy(e),
			hiddenClass: by,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${hy}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), A(this.root, `.${hy}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = Cy(e), n = e.querySelector(`:scope > .${vy}`);
		if (t === null || n === null) return;
		let r = Ty(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(yy) && Ey(r);
		for (let e of r) As(e, e.classList.contains(by) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vy}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(hy) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = Cy(e), n = t === null ? [] : Ty(t).filter((e) => e.classList.contains(_y) && e.classList.contains(by)).map((e) => e.querySelector(g) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: Dy(e),
			current: !1,
			disabled: C(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !C(n) && Oy(n).click();
	}
};
function Cy(e) {
	return e.querySelector(`:scope > .${gy}`);
}
function wy(e) {
	let t = Cy(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function Ty(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(_y) ? n.querySelector(g) : null;
		e !== null && Wv(e) && t.push(n);
	}
	return t;
}
function Ey(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(_y) ? t ||= !r.classList.contains(by) : t || r.classList.add(by);
	}
}
function Dy(e) {
	let t = Oy(e), n = t.querySelector(`.${xy}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function Oy(e) {
	return e.matches(so) ? e : e.querySelector(so) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var ky = "ui-breadcrumbs", Ay = "ui-breadcrumbs__item", jy = "ui-breadcrumb", My = "ui-breadcrumb--current", Ny = "ui-hidden", Py = "data-ui-step-collapsed", Fy = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), A(this.root, `.${ky}`, {
			childList: !0,
			attributeFilter: ["class", ...yn]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${ky}`)) this.apply(e);
	}
	apply(e) {
		let t = j(e, `.${Ay}`, `.${ky}`);
		for (let e of t) Iy(e);
		let n = t.filter((e) => !e.classList.contains(Ny)).map((e) => e.querySelector(`.${jy}`)).filter((e) => e !== null && !e.classList.contains(Ny)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle(My, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function Iy(e) {
	let t = e.querySelector(`:scope > .${jy}`), n = t === null ? "" : yn.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === yn[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(Py) : e.getAttribute(Py) !== n && e.setAttribute(Py, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function z(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function Ly(e) {
	return z(e).toString(16).padStart(2, "0").toUpperCase();
}
function Ry(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return zy(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function zy(e, t, n) {
	return .2126 * By(e) + .7152 * By(t) + .0722 * By(n);
}
function By(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var Vy = "ui-color-input", Hy = "ui-color-input--open", Uy = "ui-color-input__popup", Wy = "ui-color-input__text", Gy = "ui-color-input__row", Ky = "ui-color-input__swatch--button", qy = "ui-color-input__value-input", Jy = "ui-color-input__square-thumb", Yy = "ui-color-input__hue-thumb", Xy = "data-ui-color-toggle", Zy = "data-ui-color-tab", Qy = "data-ui-color-tab-selected", $y = "data-ui-color-pane", eb = "data-ui-color-pane-selected", tb = "data-ui-color-square", nb = "data-ui-color-hue", rb = "data-ui-color-hex", ib = "data-ui-color-channel", ab = "data-ui-color-factor", ob = "data-ui-color-opacity", sb = "data-ui-color-name", cb = "data-ui-color-name-selected", lb = "data-ui-color-format", ub = "data-ui-color-variant", db = "data-ui-color-no-picker", fb = "data-ui-color-no-palette", pb = 4, mb = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new Tc({
		show: ({ owner: e }) => e.classList.add(Hy),
		hide: ({ owner: e }) => e.classList.remove(Hy)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${Vy}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = v(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${Vy}`) ?? []);
		}), A(this.root, `.${Vy}`, {
			childList: !0,
			attributeFilter: [
				lb,
				ub,
				db,
				fb
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new W_({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${tb}], [${nb}]`),
			begin: (e, t) => {
				let n = e.closest(`.${Vy}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(tb) ? "square" : "hue"
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
		let t = yb(e), n = this.states.get(e), r = n?.paneChosen === !0 ? hb(e, n.pane) : gb(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? _b(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = Db(t);
			if (i === null) return n ?? _b(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && vb(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = Ab(a, o, s);
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
			...n ?? _b(r),
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
			let [e, a, o] = Ab(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), Cb(e, "--ui-color-input-color", t.held ? kb(n, r, i, t.opacity) : "transparent"), Cb(e, "--ui-color-input-solid", kb(n, r, i, 255)), Cb(e, "--ui-color-input-on-color", t.held ? Ry(n, r, i, t.opacity) : "inherit"), Sb(e, t.held ? xb(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${tb}]`), o = e.querySelector(`[${nb}]`), [s, c, l] = jb(t.hue, 1, 1);
		if (Cb(e, "--ui-color-input-hue", kb(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${Jy}`);
			e !== null && (Cb(e, "left", `${t.saturation * 100}%`), Cb(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${Yy}`);
			e !== null && Cb(e, "top", `${t.hue / 360 * 100}%`);
		}
		wb(e, `[${rb}]`, Ob(n, r, i)), wb(e, `[${ib}="r"]`, String(n)), wb(e, `[${ib}="g"]`, String(r)), wb(e, `[${ib}="b"]`, String(i)), Cb(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), Tb(e, `[${ob}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${sb}]`)) n.getAttribute(sb) === t.name ? n.setAttribute(cb, "") : n.removeAttribute(cb);
		let n = t.name === null ? null : e.querySelector(`[${sb}="${t.name}"]`), r = n === null ? null : Db(n.style.getPropertyValue("--ui-color-input-chip").trim());
		Cb(e, "--ui-color-input-base", r === null ? "transparent" : kb(r[0], r[1], r[2], 255)), Tb(e, `[${ab}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${$y}]`)) n.getAttribute($y) === t.pane ? n.setAttribute(eb, "") : n.removeAttribute(eb);
		for (let n of e.querySelectorAll(`[${Zy}]`)) n.getAttribute(Zy) === t.pane ? n.setAttribute(Qy, "") : n.removeAttribute(Qy);
	}
	resolveRgb(e, t) {
		if (t.name === null) return jb(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${sb}="${t.name}"]`), r = n === null ? null : Db(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? jb(t.hue, t.saturation, t.value) : Eb([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Xy}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${Vy}`));
			return;
		}
		let n = e.target.closest(`[${Zy}]`), r = e.target.closest(`.${Vy}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(Zy), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${sb}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(sb)
			}));
			return;
		}
		let a = r.querySelector(`.${Uy}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${Vy}`);
		if (t !== null) {
			if (e.target.hasAttribute(ab)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(ob) && this.commit(t, (t) => ({
				...t,
				opacity: z(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${Vy}`);
		if (n === null) return;
		if (t.hasAttribute(ab) || t.hasAttribute(ob)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(rb)) {
			let e = Db(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = Ab(e[0], e[1], e[2]);
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
		let r = t.getAttribute(ib);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = z(Number(t.value));
		let [l, u, d] = Ab(c.r, c.g, c.b);
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
			let e = Mb((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = Mb((t.x - a.left) / a.width), s = 1 - Mb((t.y - a.top) / a.height);
		this.commit(n, (e) => ({
			...e,
			saturation: o,
			value: s,
			name: null
		}), !1);
	}
	commit(e, t, n = !0) {
		let r = this.states.get(e);
		if (r === void 0 || T(e)) return;
		let i = {
			...t(r),
			held: !0
		};
		this.applyState(e, i);
		let a = e.querySelector(`.${qy}`);
		a !== null && (a.value = bb(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		T(e) || e.querySelector(`.${qy}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(db) && e.hasAttribute(fb)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${Uy}`), n = e.querySelector(`[${Xy}]`);
		if (t === null) return;
		let r = e.getAttribute(ub) === "swatch" ? e.querySelector(`.${Ky}`) : e.querySelector(`.${Gy}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: {
				placement: "bottom-end",
				gap: pb
			},
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${Qy}]`) ?? !0
		});
	}
};
function hb(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? db : fb))(t) ? t : t === "picker" ? "palette" : "picker";
}
function gb(e) {
	return hb(e, "picker");
}
function _b(e) {
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
function vb(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function yb(e) {
	return e.querySelector(`.${qy}`)?.value.trim() ?? "";
}
function bb(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = Ob(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${Ly(e.opacity)}`;
}
function xb(e, t, n, r, i) {
	if (e.getAttribute(lb) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = Ob(t, n, r);
	return i === 255 ? a : `${a}${Ly(i)}`;
}
function Sb(e, t) {
	for (let n of e.querySelectorAll(`.${Wy}`)) n.textContent !== t && (n.textContent = t);
}
function Cb(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function wb(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function Tb(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function Eb(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		z(e[0] * (1 - n)),
		z(e[1] * (1 - n)),
		z(e[2] * (1 - n))
	] : [
		z(e[0] + (255 - e[0]) * n),
		z(e[1] + (255 - e[1]) * n),
		z(e[2] + (255 - e[2]) * n)
	];
}
function Db(e) {
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
function Ob(e, t, n) {
	return `#${Ly(e)}${Ly(t)}${Ly(n)}`;
}
function kb(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function Ab(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function jb(e, t, n) {
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
		z((o + a) * 255),
		z((s + a) * 255),
		z((c + a) * 255)
	];
}
function Mb(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function Nb(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var B = "ui-table", Pb = "ui-table--reorderable", Fb = "ui-scroll-x--auto", Ib = "ui-scroll-x--always", Lb = `:scope > .${Pt}`, Rb = `.${It}`, zb = "ui-table__header-cell", Bb = `${zb}--pinned`, Vb = `${Lb} > .${Ft} > .${zb}`, Hb = `${Vb}--pinned`, Ub = "ui-table__host", Wb = `${Lb} > .${Ub}`, Gb = `.${B}, .${Nt}, [${kt}]`, Kb = "--ui-table-columns", qb = "--ui-table-sized-columns", Jb = "--ui-table-pin-", Yb = "--ui-table-order-", Xb = 64, Zb = "data-ui-table-cell-hidden", Qb = "data-ui-table-cell-last", $b = "columns", ex = "hidden", tx = "order", nx = "layout", rx = 32, ix = 16, ax = class {
	root;
	store = new Xg();
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
		if (this.root = e.root ?? document, this.drag = new W_({
			root: this.root,
			resolveHandle: (e) => e.closest(Rb),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new W_({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of E_) e !== "base" && matchMedia(`(min-width: ${D_[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${B}`)), A(this.root, `.${B}`, {
			childList: !0,
			relevant: cx
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), A(this.root, `.${B}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(B)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), A(this.root, `.${B}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: lx
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(Wb);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), Nb(t, () => this.pin(t));
			let e = t.querySelector(Wb);
			e !== null && (this.markScrollbar(t, e), Nb(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, $b), r = n === null ? null : G_(n);
		r !== null && r.length !== t.length ? (this.store.write(e, $b, null), this.store.writeBoot(e, nx, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, tx);
		if (i !== null && !dx(i, t)) {
			this.store.write(e, tx, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Ht, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${B}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = ux(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(Fb) || e.classList.contains(Ib);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(qb);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = dv(t, n);
				e.style.setProperty(qb, Y_(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${Yb}${t}`, String(r[t])) : e.style.removeProperty(`${Yb}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Mt) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Mt, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Lt) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Lt, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(Pb)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= Xb) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${kt}]`)) {
				let r = Number(t.getAttribute(kt));
				!(r >= Xb) || t.closest(`.${B}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(Zb, n.hidden.has(r)), t.toggleAttribute(Qb, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(Vb)) {
			let e = Number(n.getAttribute(kt)), r = n.getAttribute(At), i = n.classList.contains(Bb) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: hx(r) ? r : null,
				startsHidden: n.hasAttribute(jt),
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
		for (let e of t) (n[e.key] ?? mx(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, ex) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(Kb).trim(), n = t.length === 0 ? null : G_(t);
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
		n === null || i !== void 0 && n === mx(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, ex, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return ux(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(Hb).length;
		if (t < 2) return;
		let n = uv(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${Jb}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${B}`)?.toggleAttribute(Vt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(Lb), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return ox(e) ? n.slice(1) : n;
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
		let t = e.target.closest(Rb);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = ix;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${B}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(kt)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(Rb)?.closest(`.${B}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = nv(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(rx, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, sx(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, $b, t === null ? null : Y_(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(qb).trim(), n = e.getAttribute(Mt), r = {};
		t.length > 0 && (r[qb] = t);
		for (let t of e.style) t.startsWith(Yb) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, nx, null);
			return;
		}
		this.store.writeBoot(e, nx, {
			styles: r,
			attributes: {
				[Mt]: n,
				[Lt]: e.getAttribute(Lt)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${B}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = Q_(t.getAttribute(Et)), i = $_(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(kt)), u = this.hiddenOf(t, o), d = ux(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${zb}`), n = t?.closest(`.${B}`) ?? null;
		return t === null || n === null || !n.classList.contains(Pb) || e.closest(Rb) !== null || t.classList.contains(Bb) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${B}`), r = Number(e.getAttribute(kt));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Rt, ""), e.setAttribute(zt, ""), {
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
		for (let a of ux(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > fx(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), px(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Bt, "after") : a.cell.setAttribute(Bt, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(zt), t.table.removeAttribute(Rt), px(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = ux(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, tx, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function ox(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function sx(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function cx(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(Gb) || t.querySelector(Gb) !== null)) return !0;
	return !1;
}
function lx(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(Ub);
}
function ux(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function dx(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function fx(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function px(e) {
	for (let t of e.querySelectorAll(`[${Bt}]`)) t.removeAttribute(Bt);
}
function mx(e) {
	return e.startsHidden || e.hideBelow !== null && E_.indexOf(O_()) < E_.indexOf(e.hideBelow);
}
function hx(e) {
	return e !== null && E_.includes(e);
}
var gx = "bottom";
function _x(e, t, n) {
	let r = e.querySelector(`:scope > [${$e}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute($e, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function vx(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var yx = /* @__PURE__ */ new WeakMap();
function bx(e) {
	for (let t of e.querySelectorAll(`[${Ue}]`)) t.remove();
}
function xx(e, t, n, r, i, a) {
	let o = xp(e) === "windowed", s = M(e), c = o ? s : Cp(e, s), l = n.getGroupTemplate(t), u = !o && l !== void 0, d = u && c.some((e) => e.hasAttribute("data-ui-group")), f = o ? void 0 : i.getItemsFilterSortMetadata(t), p = o ? [] : pp(f, a, lp(e));
	if (u && !d && bx(e), c.length === 0) {
		yx.set(e, []);
		return;
	}
	if (o && !d && p.length === 0) return;
	let ee = Jf(e);
	if (!d) {
		vx(e, [...mp(c, p, r), ...qf(ee)]);
		return;
	}
	bx(e);
	let te = /* @__PURE__ */ new Map();
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "", n = te.get(t);
		n === void 0 ? te.set(t, [e]) : n.push(e);
	}
	let ne = (yx.get(e) ?? []).filter((e) => te.has(e));
	for (let e of c) {
		let t = e.getAttribute("data-ui-group") ?? "";
		ne.includes(t) || ne.push(t);
	}
	yx.set(e, ne);
	let re = [];
	for (let e of ne) {
		let t = te.get(e);
		if (t !== void 0 && t.length !== 0) {
			if (p.length > 0 && (t = mp(t, p, r)), e !== "" && t.some((e) => !e.classList.contains("ui-hidden"))) {
				let e = Sx(l, r, t[0]);
				e !== null && re.push(e);
			}
			re.push(...t);
		}
	}
	vx(e, [...re, ...qf(ee)]);
}
function Sx(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r === null ? null : (r.setAttribute(Ue, ""), r);
}
//#endregion
//#region src/items/items-host-sync.ts
var Cx = "ui-tree-rules", wx = "ui-tree";
function Tx(e, t, n) {
	if (e.parentElement?.classList.contains(wx) === !0) {
		e.dispatchEvent(new Event(Cx, { bubbles: !0 }));
		return;
	}
	switch (xp(e)) {
		case "windowed":
			Yf(e, t, n.templates, n.renderer);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			up(e, t, n.metadata, n.renderer, n.state), Yf(e, t, n.templates, n.renderer), xx(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var Ex = ".ui-items-view, .ui-table", Dx = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), Ox = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`:is(${Oa})[${un}]`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), A(this.root, Oa, {
			childList: !0,
			attributeFilter: [
				un,
				fn,
				pn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		Ra(e, this.ownItems(e));
	}
	handleClick(e) {
		let t = this.resolveRow(e, Oa);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (to(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			Na(n, r);
			return;
		}
		Ba(n, i, r, Pa(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(ka), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || C(r) ? null : Ql(e.target, n) === null && !w(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, Ex);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), ao(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = Qa(e.target);
		if (t === null || t.row !== null && Ql(e.target, t.row) !== null) return;
		let { root: n } = t;
		if (!n.matches(Ex) || C(n)) return;
		let r = kx(n);
		if (!Dx.has(e.key) && !xa(e.key, r === "grid" ? "both" : r)) return;
		let i = this.ownItems(n), a = eo(i), o = no(e.key, i, a, r);
		if (o !== null) {
			e.preventDefault(), to(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Ma(n, a), Ba(n, i, o, Fa(n, e)));
			return;
		}
		if (!(a === null || w(a))) {
			switch (e.key) {
				case " ":
					if (!Ba(n, i, a, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "Enter":
					Ia(n) && !za(i).includes(a) && Ba(n, i, a, Aa), ao(a, "open");
					break;
				case "Delete": {
					let e = Ax(i, a);
					if (e.length === 0) return;
					for (let t of e) ao(t, "remove");
					break;
				}
				default: return;
			}
			e.preventDefault();
		}
	}
	ownItems(e) {
		return j(e, ka, Oa);
	}
};
function kx(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function Ax(e, t) {
	let n = za(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !w(e));
}
//#endregion
//#region src/interactions/tree-drop.ts
function jx(e, t) {
	if (w(e)) return !1;
	let n = t?.getAttribute(Kt);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
//#endregion
//#region src/interactions/tree-engine.ts
var V = "ui-tree", Mx = "ui-tree__row", Nx = "ui-tree__row--folded", Px = "ui-tree__row--filtered", Fx = "fold-hidden", Ix = "fold-shown", Lx = "ui-tree__row--dragging", Rx = "ui-tree__loading", zx = "ui-tree__loading-ring", Bx = "ui-tree-node", Vx = "ui-tree-node__text", Hx = "ui-tree-node__toggle", Ux = "ui-tree-node__rename", Wx = ".ui-text__title", Gx = "data-ui-tree-drop", Kx = "--ui-tree-depth", qx = "expanded", Jx = 600, Yx = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), Xx = class {
	root;
	store = new Xg();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(Cx, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${V}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(v(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => O(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${V}`)), A(this.root, `.${V}`, {
			childList: !0,
			attributeFilter: [
				Wt,
				Gt,
				qt,
				Qt
			],
			relevant: $x
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(Qt), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = nS(e)?.getAttribute(Wt);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = O(e), r = nS(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Gt) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(Kx, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(Nx, !d), e.classList.toggle(Px, re), e.removeAttribute(Zt), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !w(e), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Yt), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Yt, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Yt), d && ne && !re), s.set(n, {
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
		return nS(e.row)?.hasAttribute(qt) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${Mx}[${m}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, Fx, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, Ix, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [Zt]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Sr(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = lp(t);
		if (r === void 0 && i === null) return null;
		let a = pp(r, this.rules.state, i), o = fp(r, this.rules.state, i);
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
		let r = this.rules.renderer, i = new Set(n.map(O)), a = /* @__PURE__ */ new Map();
		for (let e of n) {
			let t = nS(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => hp(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(O(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${Rx}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = O(o), c = i.getItemValue(o);
			if (c === void 0 || dp(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = nS(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(Rx) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? eS();
		o.style.setProperty(Kx, String(t)), o.classList.toggle(Nx, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${Hx}`) === null && (!r.hasAttribute("data-ui-unselectable") || Ql(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || Ql(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${Mx}`), n = t?.closest(`.${V}`) ?? null;
		return t === null || n === null || t.closest(`.${V}`) !== n || w(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = Qa(e.target);
		if (t === null || t.row !== null && Ql(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains(V) || C(n) || !Yx.has(e.key) && !xa(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = eo(r), a = no(e.key, r, i, "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, Fa(n, e));
			return;
		}
		if (!(i === null || w(i))) {
			switch (e.key) {
				case " ":
					if (!Ba(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, no("ArrowDown", r, i, "vertical"), Aa);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), Aa);
					break;
				case "Enter":
					Ia(n) && !za(r).includes(i) && Ba(n, r, i, Aa), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = Ax(r, i);
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
		let t = tS(e), n = t?.closest(`.${V}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (w(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? za(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !w(e) && e.getClientRects().length > 0) : [];
		Ap(e, n, t, Lx, O(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(Lx));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${V}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${Mx}`), a = i !== null && i.closest(`.${V}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (!jx(a, nS(a)) || n.some((t) => t === a || Qx(e, O(a), O(t)))) {
				this.markDrop(t, null), this.springOpen(t, null);
				return;
			}
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), Jx)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${V}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${V}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${Gx}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(Mx) ? O(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && Qx(a, O(e), O(t))));
		this.markDrop(t, null), this.springOpen(t, null), jp(t, Lx), r.classList.contains(Mx) && this.expand(t, r);
		for (let e of o) {
			let t = nS(e)?.querySelector(`.${Vx}`) ?? null;
			t !== null && (t.setAttribute(Xt, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = tS(e)?.closest(`.${V}`) ?? null;
		t !== null && (jp(t, Lx), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${Gx}]`)) n !== t && n.removeAttribute(Gx);
		t?.setAttribute(Gx, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(O(n), nS(n)?.getAttribute("data-ui-tree-parent") ?? "");
		return t;
	}
	toggle(e, t) {
		this.fold(e, t, t.getAttribute("aria-expanded") !== "true");
	}
	expand(e, t) {
		t.getAttribute("aria-expanded") === "false" && this.fold(e, t, !0);
	}
	fold(e, t, n) {
		let r = O(t);
		if (r.length === 0 || !t.hasAttribute("aria-expanded")) return;
		let i = this.foldOf(e);
		i[r] = n;
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(Nx)) : [];
		this.store.writeJson(e, qx, i), this.layout(e), Zx(a.filter((e) => !e.classList.contains(Nx)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, qx) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = eo(r);
		to(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Ma(e, i), Ba(e, r, t, n));
	}
	parentOf(e, t) {
		let n = nS(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => O(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${V}`), n = nS(e), r = n?.querySelector(Wx) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), fc({
			container: n,
			title: r,
			className: Ux,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Jt, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => t.focus({ preventScroll: !0 })
		}));
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	rowsOf(e) {
		let t = this.hostOf(e), n = [];
		if (t === null) return n;
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(Mx) && n.push(e);
		return n;
	}
};
function Zx(e) {
	if (!(e.length === 0 || ys())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: vs.fast,
		easing: vs.enter
	});
}
function Qx(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function $x(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(Mx) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains(V) === !0);
}
function eS() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = Rx, e.setAttribute("aria-hidden", "true"), t.className = zx, e.append(t, S.text("ui.tree.loading")), e;
}
function tS(e) {
	return e.target instanceof Element ? e.target.closest(`.${Mx}`) : null;
}
function nS(e) {
	return e.querySelector(`.${Bx}`);
}
var rS = "tabs:rename", iS = "tabs:pin", aS = "tabs:unpin", oS = "tabs:close", sS = "tabs:delete";
function cS(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function lS(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[rS, e.rename && t.renamable],
		[iS, e.pin && !t.pinned],
		[aS, e.pin && t.pinned],
		[oS, e.close && !e.delete && n],
		[sS, e.delete && n]
	]);
}
function uS(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function dS(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, fS(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function fS(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function pS(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var H = "ui-tabs-view", mS = "ui-tab-item", hS = "ui-tab-item__label", gS = "ui-tab-item__close", _S = "ui-tab-item__rename", vS = "ui-tab-item__caption", yS = "ui-tab-item__pin", bS = ".ui-text__title", xS = "ui-tab-item--dragging", SS = "ui-tab-item__caption--overflowed", CS = "ui-tabs-view--overflowing", wS = "ui-tabs-view--no-overflow", TS = "ui-tab-item__page", ES = "ui-tab-item--selected", DS = ".ui-menu-item", OS = "tab-menu-entry", kS = {
	name: OS,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, AS = "--ui-tabs-view-strip", jS = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new $v({
			rootClass: H,
			overflowingClass: CS,
			wraps: (e) => e.classList.contains(wS),
			hiddenClass: SS,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(v(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => US(e) === t.key))?.querySelector(`.${hS}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(Sg, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), A(this.root, `.${H}`, {
			childList: !0,
			attributeFilter: [
				hn,
				be,
				...yn
			],
			relevant: (e) => !ac(e, `.${TS}`, `.${H}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${H}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(Wv);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => US(e) === r)) {
			this.select(e, US(n[0]));
			return;
		}
		let i = e.hasAttribute(be), a = [], o = null, s = null;
		for (let e of t) {
			let t = US(e) === r;
			e.classList.toggle(ES, t);
			let c = e.querySelector(`.${vS}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${hS}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${TS}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${TS}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${hS}`);
			t === null || e.classList.contains(SS) || (c.push(t), e === o && (l = t));
		}
		E(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Wv(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(AS, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${h}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${Jv}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => US(e) === t)?.querySelector(`.${hS}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Wv).map((e) => ({
				key: US(e),
				title: e.querySelector(`.${hS}`)?.textContent?.trim() ?? US(e),
				current: US(e) === t,
				disabled: C(e.querySelector(`.${hS}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${mS}`);
		if (n === null || !n.classList.contains(H) || r === null || r.closest(`.${H}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = PS(n, r), a = IS(t), o = a.map((e) => {
			if (FS(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Wv(e) ? "shown" : "hidden";
		});
		if (uS(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: US(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${Se}="tab"]`), n = t?.parentElement ?? null, r = e.closest(DS);
		if (t === null || n === null || !n.classList.contains(H) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => US(e) === a.key);
		if (i.length === 0 || r.matches(`${St}, ${xt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(OS, {
			bubbles: !0,
			detail: { keys: [i, US(o)] }
		})), !0;
		if (PS(n, o).get(i) !== !0) return !0;
		switch (i) {
			case rS: {
				let e = o.querySelector(`.${hS}`);
				e !== null && this.startRename(e);
				break;
			}
			case iS:
			case aS:
				this.setPinned(n, o, i === iS);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${vS} > .${yS}`);
		t.toggleAttribute(vn, n), r !== null && (r.toggleAttribute(vn, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = pS(a.map(VS));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? LS(a[a.length - 1]).after(LS(t)) : LS(s).before(LS(t)), BS([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${Jv}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(H)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = RS(e.target), i = r?.closest(`.${H}`) ?? null;
		if (r === null || i === null || C(r)) return;
		let a = r.closest(`.${mS}`);
		a !== null && a.closest(`.${H}`) === i && (e.preventDefault(), this.select(i, US(a)), document.activeElement !== r && k(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${gS}`), r = n?.closest(`.${mS}`) ?? null, i = r?.closest(`.${H}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), NS(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = RS(e.target), n = t?.closest(`.${H}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(bS) ?? e, r = e.closest(`.${mS}`);
		t === null || r === null || LS(r).hasAttribute("data-ui-unrenamable") || fc({
			container: t,
			title: n,
			className: _S,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(_n, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => k(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${hS}`), n = t?.closest(`.${H}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${hS}`)).filter((e) => e !== null), i = ba({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${mS}`);
		a !== null && this.select(n, US(a)), i.focus();
	}
	handleDragStart(e) {
		let t = zS(e);
		if (t === null) return;
		if (LS(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		Ap(e, t.closest(`.${H}`) ?? t, t, xS, US(t));
		let n = LS(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vS}`)?.closest(`.${mS}`) ?? null, n = t?.closest(`.${H}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${xS}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${vS}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = LS(r), o = t.hasAttribute("data-ui-tab-pinned") ? MS(n, a) : null, s = o ?? LS(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${H}`);
		t !== null && t.querySelector(`.${xS}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = zS(e);
		if (t === null) return;
		t.classList.remove(xS);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(LS(t), n.next);
			return;
		}
		let r = LS(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${H}`);
		if (i === null) return;
		let a = this.ownItems(i);
		BS(a, a.indexOf(t));
	}
	select(e, t) {
		Ea(e, t, {
			attribute: hn,
			bindingAttribute: mn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return j(e, `.${mS}`, `.${H}`);
	}
};
function MS(e, t) {
	let n = null;
	for (let r of j(e, `.${mS}`, `.${H}`)) {
		let e = LS(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function NS(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !LS(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function PS(e, t) {
	return lS(cS(e.getAttribute(xe)), {
		pinned: t.hasAttribute(vn),
		renamable: !LS(t).hasAttribute(me),
		removable: e.hasAttribute("data-ui-tabs-removes") && NS(e, t)
	});
}
function FS(e) {
	let t = e.getAttribute(m);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function IS(e) {
	let t = e.querySelector(`[${h}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function LS(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function RS(e) {
	return e.closest(`.${gS}`) !== null || dc(e) ? null : e.closest(`.${vS}`)?.querySelector(`:scope > .${hS}`) ?? null;
}
function zS(e) {
	return e.target instanceof Element ? e.target.closest(`.${vS}`)?.closest(`.${mS}`) ?? null : null;
}
function BS(e, t) {
	for (let [n, r] of dS(e.map(VS), t)) e[n].setAttribute(gn, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function VS(e) {
	return {
		order: HS(e),
		pinned: e.hasAttribute(vn)
	};
}
function HS(e) {
	let t = e.getAttribute(gn);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function US(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var WS = "button.ui-text__fold-toggle", GS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(WS);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, KS = "ui-temporal-input__segments", qS = "ui-temporal-input__segment", JS = "ui-temporal-input__segment-literal", YS = "ui-temporal-input__segment--empty", XS = "data-ui-temporal-segment", ZS = "data-ui-temporal-step-direction", QS = "data-ui-temporal-segments-of", $S = "--", eC = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${P}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(br(e.components, `.${P}`));
		}), A(this.root, `.${P}`, { attributeFilter: [...hm] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) _m(t) === "time" && (Im(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${KS}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = vm(e), r = xm(e), i = F(e, km(t));
		t.getAttribute(QS) !== n && (t.replaceChildren(...tC(n).map((e) => rC(e))), t.setAttribute(QS, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(XS);
			if (t === null) {
				n.textContent = aC(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = oC(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(YS, i === null), n.tabIndex = 0, sC(n, t, i, T(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = lC(e.target);
		if (t === null) return;
		let n = t.closest(`.${P}`), r = t.getAttribute(XS), i = cC(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), dC(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), Nm(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = fC(e.key, xm(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = lC(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = lC(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = eh(this.wheelTurn, $m(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${P}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(XS), n < 0 ? 1 : -1, cC(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${ZS}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${ZS}]`);
		if (t === null) return;
		let n = t.closest(`.${P}`);
		if (n === null || T(n)) return;
		e.preventDefault();
		let r = uC(n) ?? n.querySelector(`.${qS}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(XS), t.getAttribute(ZS) === "up" ? 1 : -1, cC(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${qS}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${P}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = F(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = pC(t), o = bm(ym(e), a) * n, s = a === "hour" ? 24 : 60, c = ((mC(i, a) + o) % s + s) % s;
		this.write(e, hC(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? hC(t, "hour", gC(l, t.getHours() >= 12)) : hC(t, pC(n), l), i);
		}
		u && dC(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, hC(r, "hour", gC(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return F(e, t) ?? Rm(e);
	}
	write(e, t, n) {
		Nm(e, zm(e, t), n), Fm(e), this.applySegments(e);
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
function tC(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = zr(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(nC(r)), n += r.length;
	}
	return t;
}
function nC(e) {
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
function rC(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = JS, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = qS, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(XS, e.unit), t.dataset.width = String(e.width), iC(t, e.unit), t;
}
function iC(e, t) {
	if (t === "meridiem") {
		S.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = pC(t);
	S.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function aC(e, t, n, r) {
	return t && n !== null ? Lr(n, e, r) : e;
}
function oC(e, t, n, r) {
	if (n === null) return $S;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : mC(n, pC(e));
	return String(i).padStart(t, "0");
}
function sC(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : mC(n, pC(t))));
}
function cC(e) {
	return km(e.closest(`.${KS}`));
}
function lC(e) {
	let t = e instanceof Element ? e.closest(`.${qS}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${P}`);
	return n === null || T(n) ? null : t;
}
function uC(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${qS}`) : null;
}
function dC(e, t, n) {
	ba({
		key: n,
		items: [...e.querySelectorAll(`.${qS}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function fC(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function pC(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function mC(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function hC(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function gC(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var _C = "ui-timestamp", vC = "ui-timestamp__text", yC = "data-ui-timestamp-format", bC = "datetime", xC = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${_C}`), S.temporal === null), S.onTable(() => this.apply(this.root.querySelectorAll(`.${_C}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(br(e.components, `.${_C}`))), A(this.root, `.${_C}`, {
			childList: !0,
			attributeFilter: [bC],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${_C}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: S.temporal,
			language: S.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = ci(a.getAttribute(yC)), o = si(a.getAttribute(bC)), s = a.querySelector(`.${vC}`);
			if (s === null || t && e !== "relative") continue;
			let c = o === null ? "" : ui(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= e === "relative" && o !== null;
		}
		i && Li(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${_C}[${yC}="relative"]`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
}, SC = "data-ui-scroll-anchor", CC = "End", wC = 4, TC = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), A(this.root, `[${SC}="${CC}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [st]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !EC(t) || this.pinned.set(t, OC(t) && !DC(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${SC}="${CC}"]`));
	}
	followEach(e) {
		for (let t of e) if (this.pinned.get(t) !== !1) {
			if (DC(t)) {
				this.pinned.set(t, !1);
				continue;
			}
			this.pinned.set(t, !0), OC(t) || (t.scrollTop = t.scrollHeight);
		}
	}
};
function EC(e) {
	return e.getAttribute(SC) === CC;
}
function DC(e) {
	return e.getAttribute(it)?.toLowerCase() === "true";
}
function OC(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= wC;
}
//#endregion
//#region src/items/items-viewport.ts
function kC(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function AC(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${h}][${Ye}]`) : null;
}
function jC(e) {
	let t = kC(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - NC(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function MC(e, t) {
	let n = kC(e);
	n.scrollTop = n === e ? t : t + NC(e, n);
}
function NC(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function PC(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = IC(e, a, n), s = IC(e, a + 1, n);
	return LC(t, o.top, s.top, o.line, s.line);
}
function FC(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = IC(e, a, n), s = IC(e, a + 1, n);
	return LC(t, o.line, s.line, o.top, s.top);
}
function IC(e, t, n) {
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
function LC(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var RC = 250, zC = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Xe);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < RC && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Xe}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Xe}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = BC(e, "data-ui-scroll-viewport") ?? VC(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? UC(e) : null, a = i === null ? null : UC(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = FC(a, PC(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? HC(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function BC(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function VC(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : BC(e, h);
	return t === null ? null : kC(t);
}
function HC(e, t) {
	return t > 0 ? e / t : 0;
}
function UC(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${Ze}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${Qe}]`);
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
var WC = `.${Mn}, .ui-action, .${yt}`, GC = Ct, KC = "ui-pressing", qC = "--ui-press-x", JC = "--ui-press-y", YC = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(WC);
		if (t === null || C(t) || t.matches(GC) || ys()) return;
		let n = e.target.closest(kn);
		if (n !== null && n !== t && t.contains(n)) return;
		let r = t.getBoundingClientRect();
		t.style.setProperty(qC, `${e.clientX - r.left}px`), t.style.setProperty(JC, `${e.clientY - r.top}px`), t.classList.remove(KC), t.offsetWidth, t.classList.add(KC), window.setTimeout(() => t.classList.remove(KC), vs.ripple);
	}
}, XC = [
	"http",
	"https",
	"mailto",
	"tel"
];
function ZC(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || XC.includes(t.slice(0, n).toLowerCase());
}
function QC(e) {
	return ZC(e) ? String(e) : void 0;
}
var $C = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function ew(e) {
	let t = rw(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || $C.some((e) => n.startsWith(e));
}
function tw(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f]/.test(e) ? !1 : e === "/" || nw(e);
}
function nw(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function rw(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function iw(e) {
	return aw(e) !== null;
}
function aw(e) {
	let t = rw(e), n = t.toLowerCase();
	return nw(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function ow(e) {
	return aw(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/interactions/refusal-engine.ts
var sw = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), cw = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], lw = `.${Sn}, .${Cn}`, uw = RegExp(`(^|\\s)(${Sn}|${Cn})(\\s|$)`), dw = RegExp(`(^|\\s)${wn}(\\s|$)`), fw = "[type='range']", pw = /* @__PURE__ */ new WeakSet(), mw = /* @__PURE__ */ new WeakSet();
function hw(e = document) {
	let t = e === document ? window : e;
	for (let e of cw) t.addEventListener(e, Cw, !0);
	t.addEventListener("keydown", Tw, !0), t.addEventListener("change", Ew, !0), t.addEventListener("pointerdown", Dw, !0), t.addEventListener("mousedown", Dw, !0), bw(e.querySelectorAll(lw)), vw(e.querySelectorAll(`[${xn}]`)), _w(e.querySelectorAll(fw)), new MutationObserver((e) => {
		for (let t of e) gw(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", xn],
		attributeOldValue: !0
	});
}
function gw(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			yw(t, e.oldValue !== null);
			return;
		}
		let n = uw.test(e.oldValue ?? ""), r = t.matches(lw);
		n !== r && (xw(t, r), yw(t)), dw.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && _w(t.querySelectorAll(fw));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(lw) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && Sw(n), n.matches(lw) && xw(n, !0), bw(n.querySelectorAll(lw)), yw(n), vw(n.querySelectorAll(`[${xn}]`)), _w([n, ...n.querySelectorAll(fw)]));
}
function _w(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = T(t);
		e !== pw.has(t) && (e ? (pw.add(t), t.addEventListener("touchstart", Dw, { passive: !1 })) : (pw.delete(t), t.removeEventListener("touchstart", Dw)));
	}
}
function vw(e) {
	for (let t of e) yw(t);
}
function yw(e, t = !1) {
	let n = e.getAttribute(xn);
	n === null && !t || (e.matches(lw) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !ZC(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function bw(e) {
	for (let t of e) xw(t, !0);
}
function xw(e, t) {
	for (let n of e.children) t ? Sw(n) : mw.has(n) && (mw.delete(n), n.removeAttribute("inert"));
}
function Sw(e) {
	e.hasAttribute("inert") || (mw.add(e), e.setAttribute("inert", ""));
}
function Cw(e) {
	e.target instanceof Element && (C(e.target) ? (e.type === "click" && bc(e), Ow(e)) : e.type === "click" && ww(e.target) && e.preventDefault());
}
function ww(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && T(e);
}
function Tw(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && C(e.target)) {
			Ow(e);
			return;
		}
		!sw.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && T(e.target) && e.preventDefault();
	}
}
function Ew(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && T(e.target) && e.stopImmediatePropagation();
}
function Dw(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !T(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function Ow(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/rendering/icon-value.ts
var kw = "mask:", Aw = "ui-icon--image", jw = "ui-icon--mask";
function Mw(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(kw) && (n = !0, t = t.slice(5).trim());
	let r = aw(t);
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function Nw(e) {
	let t = Mw(e);
	return t === null ? "" : Pw(t.source);
}
function Pw(e) {
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
var Fw = "ui-icon", Iw = "data-ui-icon";
function Lw(e, t) {
	e.classList.add(Fw);
	for (let t of Array.from(e.classList)) zw(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url");
	let n = Bw(t);
	if (n.length === 0) {
		e.removeAttribute(Iw);
		return;
	}
	e.setAttribute(Iw, ""), e.classList.add(n);
	let r = Mw(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", Pw(r.source));
}
var Rw = "ui-icon-glyph--";
function zw(e) {
	return e === Aw || e === jw || e.startsWith(Rw);
}
function Bw(e) {
	let t = Mw(e);
	return t === null ? Vw(e) : t.tinted ? jw : Aw;
}
function Vw(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = Rw;
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
//#region src/rendering/inline-markup.ts
var Hw = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Uw = "\\", Ww = "`", Gw = "!", Kw = "{", qw = "}", Jw = "ui-text__fold", Yw = "ui-text__fold-toggle", Xw = "ui-text__fold-content", Zw = 8;
function Qw(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return lT(new vT(e), 0, e.length, Hw.None, null, t, n), uT(t, n, Hw.None, null), t;
}
function $w(e) {
	return Qw(e).map((e) => rT(e) ? `${e.fold} ${$w(e.text)}` : e.text).join("");
}
function eT(e, t, n = {}) {
	let r = Qw(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && tT(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(iT(r, n));
}
function tT(e) {
	return e.styles === Hw.None && e.url === null && !nT(e) && !rT(e);
}
function nT(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function rT(e) {
	return e.fold !== null && e.fold !== void 0;
}
function iT(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(aT(r, t));
	return n;
}
function aT(e, t) {
	if (nT(e)) return sT(e.icon);
	let n = rT(e) ? oT(e, t) : document.createTextNode(e.text);
	if ((e.styles & Hw.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & Hw.Strikethrough) !== 0 && (n = cT("s", n)), (e.styles & Hw.Underline) !== 0 && (n = cT("u", n)), (e.styles & Hw.Italic) !== 0 && (n = cT("em", n)), (e.styles & Hw.Bold) !== 0 && (n = cT("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", ew(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function oT(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${Jw} ${Jw}--static` : Jw, r.className = Yw, r.textContent = e.fold ?? "", i.className = Xw, i.append(iT(Qw(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Ne, ""), n.append(r, i), n);
}
function sT(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", Lw(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function cT(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function lT(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Uw && c + 1 < n && xT(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = dT(e, c, n);
		if (l !== null) {
			uT(a, o, r, i), fT(s, c + 1, l, o), uT(a, o, r | Hw.Code, i), c = l + 1;
			continue;
		}
		let u = hT(e, c, n);
		if (u !== null) {
			uT(a, o, r, i), lT(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), uT(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = pT(e, c, n);
		if (d !== null) {
			uT(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? gT(e, c, n) : null;
		if (f !== null) {
			uT(a, o, r, i), lT(e, f.labelStart, f.labelEnd, r, f.url, a, o), uT(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = _T(e, c, n);
		if (p !== null) {
			uT(a, o, r, i), a.push({
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
function uT(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function dT(e, t, n) {
	let r = e.text;
	if (r[t] !== Ww) return null;
	let i = t + 1;
	if (i >= n || ST(r[i])) return null;
	let a = e.findClosingMarker(i, n, Ww, 1);
	return a > i ? a : null;
}
function fT(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === Uw && i + 1 < n && xT(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function pT(e, t, n) {
	let r = e.text;
	if (r[t] !== Gw || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return mT(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function mT(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function hT(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = Hw.Bold, s = 2;
	else if (i === "*") o = Hw.Italic, s = 1;
	else if (i === "_" && a) o = Hw.Underline, s = 2;
	else if (i === "~" && a) o = Hw.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || ST(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function gT(e, t, n) {
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
function _T(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Kw || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Zw) return null;
	let c = { value: "" };
	return fT(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var vT = class {
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
		return this.closeBrackets ??= this.next("]", !0), yT(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), yT(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), yT(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return yT(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = bT(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !ST(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = ZC(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Uw && e[t - 1] === 0);
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
			if (this.text[r] === Kw) n.push(r);
			else if (this.text[r] === qw && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || ST(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function yT(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function bT(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function xT(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Kw || e === qw || e === Ww || e === Uw;
}
function ST(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var CT = "ui-tooltip", wT = "ui-tooltip", TT = "ui-tooltip--visible", ET = "[aria-haspopup][aria-expanded=\"true\"]", DT = "top", OT = 250, kT = 200, AT = 300, jT = 7, U = null, W = null, MT = null, NT = null, PT = null, FT = 0, IT = null, LT = 0, RT = 0, zT = !1;
function BT(e = document) {
	if (zT) return;
	zT = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", VT, !0), t.addEventListener("pointerout", WT, !0), t.addEventListener("focusin", GT, !0), t.addEventListener("focusout", KT, !0), t.addEventListener("keydown", qT, !0), t.addEventListener("scroll", UT, !0), t.addEventListener("pointerdown", JT, !0), t.addEventListener("click", YT, !0), window.addEventListener("blur", () => {
		NT = null, dE(!0);
	});
}
function VT(e) {
	if (HT(), XT(e.target)) {
		window.clearTimeout(LT);
		return;
	}
	let t = ZT(e.target);
	t !== null && t !== W && QT(t);
}
function HT() {
	W === null || W.isConnected || (NT = null, dE(!0));
}
function UT(e) {
	if (HT(), W === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(W) || Gv(W) && (NT = null, dE(!0));
}
function WT(e) {
	if (NT !== null || PT !== null) return;
	let t = e.relatedTarget, n = W ?? IT?.target ?? null;
	t instanceof Node && (n !== null && n.contains(t) || XT(t)) || (XT(e.target) || n !== null && e.target instanceof Node && n.contains(e.target)) && dE(!1);
}
function GT(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = ZT(e.target);
	t !== null && (NT = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, $T(t));
}
function KT(e) {
	ZT(e.target) === W && (NT = null, dE(!0));
}
function qT(e) {
	e.key === "Escape" && W !== null && (NT = null, dE(!0));
}
function JT(e) {
	if (XT(e.target)) return;
	let t = ZT(e.target);
	if (t !== null && t.hasAttribute("data-ui-tooltip-press")) {
		if (PT === t) {
			dE(!0);
			return;
		}
		NT = null, dE(!0), $T(t), PT = W;
		return;
	}
	NT === null && dE(!0);
}
function YT(e) {
	ZT(e.target)?.hasAttribute("data-ui-tooltip-press") === !0 && e.preventDefault();
}
function XT(e) {
	return U !== null && e instanceof Node && U.contains(e);
}
function ZT(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`[${Te}], [${De}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector(`[${Te}]`);
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function QT(e, t) {
	if (NT === null && PT === null) {
		if (window.clearTimeout(LT), IT !== null && IT.target === e) {
			IT.words = t;
			return;
		}
		if (window.clearTimeout(FT), IT = null, W !== null) {
			dE(!0), $T(e, t);
			return;
		}
		if (Date.now() - RT < AT) {
			$T(e, t);
			return;
		}
		IT = {
			target: e,
			words: t
		}, FT = window.setTimeout(() => {
			let e = IT;
			IT = null, e !== null && $T(e.target, e.words);
		}, OT);
	}
}
function $T(e, t) {
	let n = (t ?? e.getAttribute("data-ui-tooltip") ?? "").trim();
	if (n.length === 0 || !e.isConnected || eE(e) || Gv(e)) return;
	window.clearTimeout(FT), window.clearTimeout(LT), IT = null;
	let r = fE();
	eT(r, n, { staticFolds: !0 }), r.classList.add(TT), W = e, nE(tE(e)), r.setAttribute("data-ui-tooltip-text", $w(n)), Ms(e, r), Ns(e, r, {
		placement: uE(e),
		gap: jT,
		arrow: !0
	});
}
function eE(e) {
	return e.matches(ET) || e.querySelector(ET) !== null;
}
function tE(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function nE(e) {
	MT !== null && MT !== e && rE();
	let t = iE(e);
	t.includes(wT) || e.setAttribute("aria-describedby", [...t, wT].join(" ")), MT = e;
}
function rE() {
	if (MT === null) return;
	let e = iE(MT).filter((e) => e !== wT);
	e.length === 0 ? MT.removeAttribute("aria-describedby") : MT.setAttribute("aria-describedby", e.join(" ")), MT = null;
}
function iE(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function aE(e, t, n) {
	n?.delay === !0 && W !== e ? QT(e, t) : $T(e, t);
}
function oE() {
	dE(!0);
}
var sE = {
	show: aE,
	hide: oE
};
function cE(e) {
	NT = e, $T(e);
}
function lE(e) {
	if (W === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			NT = null, dE(!0);
			return;
		}
		$T(e);
	}
}
function uE(e) {
	let t = e.getAttribute(Ee);
	return t !== null && Ss(t) ? t : DT;
}
function dE(e) {
	window.clearTimeout(FT), window.clearTimeout(LT), IT = null;
	let t = () => {
		W !== null && (rE(), W = null, PT = null, U !== null && (U.classList.remove(TT), Rs(U)), RT = Date.now());
	};
	e ? t() : LT = window.setTimeout(t, kT);
}
function fE() {
	return U !== null && U.isConnected ? U : (U = document.createElement("div"), U.id = wT, U.className = CT, U.setAttribute("role", "tooltip"), U.setAttribute("aria-hidden", "true"), document.body.append(U), U);
}
//#endregion
//#region src/interactions/popup-service.ts
var pE = /* @__PURE__ */ new WeakMap(), mE = new Tc({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = pE.get(e);
		pE.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), hE = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => mE.popupOf(r) === t;
		return pE.set(t, n.onDismiss), mE.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (pE.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && mE.reposition(r);
			},
			close: () => {
				i() && mE.close(r);
			}
		};
	},
	focusReturn: (e) => No(e)
};
//#endregion
//#region src/items/item-rows.ts
function gE(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: tp,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => Qa(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var _E = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? bE(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), xE(l, n, t);
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
		let i = yE(r.item, t, n);
		i !== r.item && this.itemStackByRoot.set(e, {
			scopeComponentId: r.scopeComponentId,
			item: i
		});
	}
	renderFromTemplate(e, t, n = []) {
		let r = e.content.cloneNode(!0).firstElementChild;
		if (r === null) return s("template is empty.", { item: t }), null;
		let i = {
			scopeComponentId: b(r),
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
			vE(n, e) && this.applyBoundAttribute(i, String(v(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = v(t.bindingId);
			e.push([t, `[${ke}${Rn(n.propertyName)}="${Ln(r)}"]`]);
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
		let r = TE(t, n.templateKeyPropertyName);
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
		r !== void 0 && Zf(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : Xf(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item has no such property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = Zi(u, () => this.metadata.isTranslatable(a) && !Qf(l)), f = v(a.componentId), p = e.closest(`[${ce}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = Vn(p, t, () => [e])[0] ?? null;
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
function vE(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = v(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function yE(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? np(r, i.name) : op(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return sp(r, i.key, n), e;
	let a = r;
	return a[rp(a, i.name)] = n, e;
}
function bE(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function xE(e, t, n) {
	e.setAttribute(m, t), wE(e, n), CE(e, n);
}
var SE = [
	["CanSelect", de],
	["CanDrag", fe],
	["CanRemove", pe],
	["CanRename", me],
	["CanShowContextMenu", he]
];
function CE(e, t) {
	for (let [n, r] of SE) {
		let i = np(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function wE(e, t) {
	let n = np(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(We, n.value) : e.removeAttribute(We);
}
function TE(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = np(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var EE = "Group", DE = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = v(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), A(e.root, `[${Ke}="${qe}"]`, { attributeFilter: [Ie] }, (e) => {
			for (let t of e) {
				let e = Sr(t);
				e !== null && this.syncComponentHosts(e);
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
			for (let [t, n] of e) t.isConnected && Tx(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(v(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : ap(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${h}]`)) {
			if (xp(r) !== "virtualized") continue;
			let i = r.closest(g);
			i === null || !this.drawsPatchedComponent(i, v(e.reference.componentId), t) || !OE(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(b(i), t) && this.sync(r, b(i));
		}
	}
	drawsPatchedComponent(e, t, n) {
		let r = `${b(e)}:${n.scopeComponentId}:${t}`, i = this.drawnByHost.get(r);
		if (i !== void 0) return i;
		let a = !1;
		for (let r of e.querySelectorAll(":scope > template")) {
			let e = r.content.firstElementChild;
			if (e !== null && (a = n.scopeComponentId > 0 ? b(e) === n.scopeComponentId : b(e) === t || e.querySelector(`[data-ui-id="${t}"]`) !== null, a)) break;
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
		Tx(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${m}="${Ln(t)}"]`)].filter((t) => this.isItemRoot(t) && gr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${h}]`), i = r === null ? null : Sr(r);
		if (r !== null && i !== null && xp(r) === "virtualized") {
			let a = e.getAttribute(m);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = kE(EE, t);
		a && wE(e, this.options.renderer.getItemValue(e)), SE.some(([e]) => kE(e, t)) && CE(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && kE(EE, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => kE(e.itemProperty, t)) || n.sorts.some((e) => kE(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${h}]`)) {
			let n = Sr(t);
			n === e && this.sync(t, n);
		}
	}
};
function OE(e, t) {
	let n = hr(e, mr(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function kE(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var AE = 50, jE = 1, ME = .5, NE = 60, PE = class {
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
			if (this.layout(t), zE(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = HE(e, tt);
		if (t !== null && EC(e) && FE(e.getAttribute("data-ui-window-more-after"))) {
			MC(e, Math.max(0, this.windowBottom(e, t) - jC(e).height));
			return;
		}
		t !== null && t !== 0 && MC(e, FE(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = RE(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : LE(n[n.length - 1]).bottom - LE(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = HE(e, tt), n = RE(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = jC(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		xp(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${h}][${Je}="windowed"]`)];
	}
	handleScroll(e) {
		let t = AC(e.target);
		if (t === null || xp(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, NE));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && zE(e) > 0) return;
		let n = RE(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = HE(e, tt), i = FE(e.getAttribute(rt)), a = FE(e.getAttribute(it));
		if (r !== null) {
			let o = this.windowSize(e), s = jC(e), c = Math.max(1, Math.round(s.height * jE / t.itemSize), Math.floor(o * ME)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, BE(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, BE(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = jC(e), s = Math.max(1, o.height * jE), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, BE(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, BE(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = HE(e, nt);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Sr(e);
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
				dynamicParameters: VE(e),
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
		let t = this.getState(e), n = RE(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			_x(e, "top", 0), _x(e, gx, 0);
			return;
		}
		if (n.length > 0) {
			let e = LE(n[n.length - 1]).bottom - LE(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / IE(n))));
		}
		let r = HE(e, nt), i = HE(e, tt), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		_x(e, "top", a), _x(e, gx, o);
	}
	windowSize(e) {
		let t = HE(e, et);
		return t !== null && t > 0 ? t : AE;
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
function FE(e) {
	return e !== null && e.toLowerCase() === "true";
}
function IE(e) {
	let t = LE(e[0]).top, n = 1;
	for (; n < e.length && LE(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function LE(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function RE(e) {
	return [...e.children].filter((e) => e.hasAttribute(m));
}
function zE(e) {
	return RE(e).length;
}
function BE(e) {
	return e.getAttribute(m);
}
function VE(e) {
	let t = e.closest(g);
	return t === null ? [] : hr(t, mr(t));
}
function HE(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var UE = [
	ce,
	le,
	ue
];
function WE(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, GE(c, e.itemRole);
	let l = qE(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = KE(l, t, n, a);
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
		d.className = l.wrapperClassName, GE(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), xE(d, r, n), c.appendChild(d);
	}
	return xE(c, r, n), o.registerItemScope(c, l, n), c;
}
function GE(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function KE(e, t, n, r) {
	let i = TE(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function qE(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of UE) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), b(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function JE(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return YE(i.renderer.renderItem(e, t, n, r), a);
	let s = WE(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), YE(s, a);
}
function YE(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var XE = 6, ZE = 60, QE = class {
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
		let n = EC(e) && OC(e);
		this.project(e, t), this.layout(e, t), n && !OC(e) && (MC(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && es(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = M(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? oo(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = yE(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = lp(e), i = this.options.templates.getGroupTemplate(t.componentId), a = pp(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => dp(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => nD(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => hp(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = nD(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => hp(e.item, t.item, a))), e !== "" && l.push({
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
		let t = AC(e.target);
		if (t === null || xp(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, ZE));
	}
	layout(e, t) {
		let n = t.projected, r = iD(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (rD(e) && a > 0) {
			let r = jC(e), c = eD(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - XE), s = Math.min(a, s + XE);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(nD(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), tD(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (tD(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of M(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${Ue}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = aD(i, 0, o), p = aD(i, s, a);
		vx(e, [...l, ...qf(Jf(e))]), _x(e, "top", f > 0 ? f - r : 0), _x(e, gx, p > 0 ? p - r : 0), Yf(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return JE(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r === null ? null : (r.setAttribute(Ue, ""), r);
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(nD(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || ($E(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(nD(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Cr(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of M(e)) {
			let e = t.getAttribute(m);
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
function $E(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function eD(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (MC(e, i + s), i + s);
}
function tD(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = nD(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function nD(e) {
	let t = np(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function rD(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function iD(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function aD(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var oD = "data-ui-template", sD = "default", cD = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? sD, r = this.findTemplate(e, n);
		return r === void 0 ? n === sD ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${oD}]`);
		for (let e of r) if (e.getAttribute(oD) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= lD(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Be);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, Ve);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function lD(e) {
	let t = /* @__PURE__ */ new Set();
	return Xi(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(g)) {
			let n = b(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/metadata/metadata-reader.ts
var uD = "script[type='application/json'][data-ui-metadata]";
function dD(e = document) {
	let t = e.querySelector(uD);
	if (t === null) return fD();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return fD();
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
function fD() {
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
var pD = "script[type='application/json'][data-ui-hydration]";
function mD(e = document) {
	let t = e.querySelector(pD)?.textContent?.trim() ?? "";
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
var hD = "reconnecting";
async function gD(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), hD;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function _D(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var vD = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(yD(bD(e)));
	}
	async dispatchAsync(e) {
		let t = bD(e), n = yD(t);
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
function yD(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function bD(e) {
	return {
		eventId: v(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var xD = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && es(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = SD(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(CD([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(SD(e, t));
		let n = this.unplaced.get(CD(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = SD(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(CD([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = CD(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, CD(t.slice(0, e - 1)));
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
		return `${v(e.componentId)}:${e.propertyId}:${wD(t)}`;
	}
};
function SD(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function CD(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function wD(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var TD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, ED = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, DD = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, OD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, kD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, AD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, jD = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, MD = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, ND = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, PD = class {
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
var FD = class {
	constructor() {}
	log(e, t) {}
};
FD.instance = new FD();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var ID = "10.0.11", K = class {
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
function LD(e, t) {
	let n = "";
	return zD(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${RD(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function RD(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function zD(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function BD(e, t, n, r, i, a) {
	let o = {}, [s, c] = WD();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${LD(i, a.logMessageContent)}.`);
	let l = zD(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function VD(e) {
	return e === void 0 ? new UD(G.Information) : e === null ? FD.instance : e.log === void 0 ? new UD(e) : e;
}
var HD = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, UD = class {
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
function WD() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, GD(ID, KD(), JD(), qD())];
}
function GD(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function KD() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function qD() {
	if (q.isNode) return process.versions.node;
}
function JD() {
	return q.isNode ? "NodeJS" : "Browser";
}
function YD(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function XD() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var ZD = class extends PD {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(XD());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new DD();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new DD();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new ED();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, zD(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new TD(await QD(i, "text") || i.statusText, i.status);
		let a = await QD(i, e.responseType);
		return new ND(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function QD(e, t) {
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
var $D = class extends PD {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new DD()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (zD(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new DD());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new ND(r.status, r.statusText, r.response || r.responseText)) : n(new TD(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new TD(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new ED());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, eO = class extends PD {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new ZD(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new $D(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new DD()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, tO = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
tO.RecordSeparatorCode = 30, tO.RecordSeparator = String.fromCharCode(tO.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var nO = class {
	writeHandshakeRequest(e) {
		return tO.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (zD(e)) {
			let r = new Uint8Array(e), i = r.indexOf(tO.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(tO.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = tO.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var rO = class {
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
		return this.observers.push(e), new HD(this, e);
	}
}, iO = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			zD(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new aO(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, zD(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, aO = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, oO = 3e4, sO = 15e3, cO = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var lO = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? oO, this.keepAliveIntervalInMilliseconds = a ?? sO, this._statefulReconnectBufferSize = o ?? cO, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new nO(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new iO(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new DD("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new rO();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${YD(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${YD(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new DD("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${YD(t)}`);
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
}, uO = [
	0,
	2e3,
	1e4,
	3e4,
	null
], dO = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? uO : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, fO = class {};
fO.Authorization = "Authorization", fO.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var pO = class extends PD {
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
		e.headers ||= {}, this._accessToken ? e.headers[fO.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[fO.Authorization] && delete e.headers[fO.Authorization];
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
var mO = class {
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
}, hO = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new mO(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = WD(), i = {
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
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new TD(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${LD(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new TD(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof ED ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? BD(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = WD();
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
			i ? i instanceof TD && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, gO = class {
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
				let [r, i] = WD();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${LD(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? BD(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, _O = class {
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
				let t = {}, [r, i] = WD();
				t[r] = i, n && (t[fO.Authorization] = `Bearer ${n}`), o && (t[fO.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
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
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${LD(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${LD(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, vO = 100, yO = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = VD(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new pO(n.httpClient || new eO(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new DD(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new DD(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new xO(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new DD("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < vO);
				if (r === vO && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof hO && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = WD();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new jD("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof TD && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new jD(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new AD(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new DD(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new MD(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new _O(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new gO(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new hO(this._httpClient, this._logger, this._options);
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
		if (bO(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new OD(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new kD(`'${X[i]}' is disabled by the client.`, i);
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
function bO(e, t) {
	return !e || (t & e) !== 0;
}
var xO = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new SO(), this._transportResult = new SO(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new SO(), this._transportResult.promise;
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
			this._sendBufferedData = new SO();
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
}, SO = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, CO = "json", wO = class {
	constructor() {
		this.name = CO, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = FD.instance);
		let n = tO.parse(e), r = [];
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
		return tO.write(JSON.stringify(e));
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
}, TO = {
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
function EO(e) {
	let t = TO[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var DO = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), OO(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = EO(e);
			this.logger = new UD(t);
		} else this.logger = new UD(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new dO(e) : e : new dO(), this;
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
		let t = new yO(this.url, e);
		return lO.create(t, this.logger || FD.instance, this.protocol || new wO(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function OO(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var kO = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, AO = class {
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
}, jO = class {
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
}, MO = 500;
function NO(e) {
	let { changes: t, ...n } = e;
	return n;
}
function PO() {
	return {};
}
var FO = class {
	windowId;
	connection;
	started = !1;
	gate = new AO();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new jO(t), this.connection = new DO().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, NO));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, PO, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new kO(e) : e;
		}
	}
	whenAttached() {
		return this.gate.wait();
	}
	async setThemeAsync(e) {
		await this.invokeAsync("SetThemeAsync", [{ theme: e }]);
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, PO));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), MO);
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
}, IO = "/_ne/values", LO = 3e4;
function RO(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function zO(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function BO(e, t = LO) {
	if (e === void 0 || !zO(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${IO}/${encodeURIComponent(n)}`, {
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
async function VO(e) {
	let t = await fetch(IO, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(LO)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var HO = Promise.resolve(), UO = () => {}, WO = class {
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
		if (this.handed >= this.given) return HO;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = RO(e.value), r = n === null ? null : VO(n);
		return r?.catch(UO), new Promise((i, a) => {
			let o = GO(e), s = this.queue.findIndex((e) => e.field === o), c = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, KO(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof kO) {
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
		let t = this.transport.whenAttached().then(() => VO(e));
		return t.catch(UO), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function GO(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function KO(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/interactions/legacy-commands.ts
var qO = document;
function JO() {
	try {
		return qO.execCommand("copy");
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/navigation-url.ts
function YO(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = XO(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function XO(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, ZO(e));
	return t.toString();
}
function ZO(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function QO(e, t) {
	let n = $O([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return $O(r, t);
}
function $O(e, t) {
	let n = null;
	for (let r of e) if (ek(r, t)) {
		if (tk(r, t)) return r;
		n ??= r;
	}
	return n;
}
function ek(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n === "auto" || n === "scroll";
}
function tk(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var nk = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(rr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = rr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = YO(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!tw(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = sr(e.effect.mode), n = t === "Unknown" ? "auto" : t.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== n && document.documentElement.setAttribute(rn, n), this.reportTheme?.(n);
		}), this.register("Focus", (e) => {
			let t = ik(e);
			t !== null && ok(t);
		}), this.register("ScrollTo", (e) => {
			let t = ik(e);
			if (t === null) return;
			let n = e.effect, r = ir(n.behavior), i = ar(n.block);
			t.scrollIntoView({
				behavior: ak(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = ik(e);
			if (t === null) return;
			let n = e.effect, r = cr(n.axis) !== "Horizontal", i = QO(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = or(n.position), u;
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
			let d = ak(ir(n.behavior));
			i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			rk(ik(e), null);
		}), this.register("Hide", (e) => {
			rk(ik(e), "hidden");
		}), this.register("Collapse", (e) => {
			rk(ik(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = sk(e, this.valueReaders);
			t !== null && ck(t).catch((e) => s("copy to clipboard failed.", e));
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
			if (!ZC(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!bi(t.message) && !xi(t.message)) {
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
function rk(e, t) {
	if (e !== null) for (let n of yn) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function ik(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(v(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function ak(e) {
	return e === "Smooth" && !ys() ? "smooth" : "auto";
}
function ok(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(so))) {
		e.focus();
		return;
	}
	let t = xo(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function sk(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = ik(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : ua(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : ia(t.readHeld(r));
}
async function ck(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!lk(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function lk(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return JO();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var uk = "data-ui-dialog-close-backdrop", dk = "data-ui-dialog-close-escape", fk = "data-ui-dialog-backdrop", pk = class {
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
		let n = Ao(t.querySelector(".ui-dialog__surface") ?? t, xo(t));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Io(No(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${oc}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${fk}]`);
		if (n === null) return;
		let r = n.closest(`[${oc}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(uk)) return;
		let i = r.getAttribute(oc);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(dk) && !yc() && !dc(e.target) && !Kl(e.target)) {
				let n = t.getAttribute(oc);
				n !== null && (e.preventDefault(), this.closeFromViewer(n));
				return;
			}
			e.key === "Tab" && t.hasAttribute("data-ui-dialog-modal") && this.trapTab(t, e);
		}
	}
	closeFromViewer(e) {
		let t = this.find(e), n = t !== null && !t.hasAttribute("hidden");
		!this.close(e) || !n || t === null || t.querySelector(g)?.dispatchEvent(new Event("close", { bubbles: !0 }));
	}
	getTopmostOpen() {
		return sc(this.root);
	}
	trapTab(e, t) {
		let n = So(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = To(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, mk = /* @__PURE__ */ new Map([
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
]), hk = [
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
function gk(e) {
	return Q(e, hk);
}
var _k = [
	"small",
	"medium",
	"large"
], vk = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], yk = [
	"start",
	"center",
	"end",
	"justify"
], bk = ["nowrap", "wrap"], xk = /* @__PURE__ */ new Map([
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
]), Sk = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), Ck = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), wk = ["inline", "trailing"], Tk = [
	"filled",
	"outline",
	"underline",
	"ghost"
], Ek = [
	"small",
	"medium",
	"large"
], Dk = [
	"small",
	"medium",
	"large"
], Ok = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], kk = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], Ak = ["light", "dark"], jk = [
	"start",
	"center",
	"end",
	"stretch"
], Mk = ["clip", "visible"], Nk = [
	"visible",
	"hidden",
	"collapsed"
], Pk = [
	"background",
	"raised",
	"tinted"
], Fk = ["horizontal", "vertical"], Ik = [
	"none",
	"gap",
	"rule"
], Lk = [
	"none",
	"one",
	"many"
], Rk = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], zk = ["stack", "wrap"], Bk = ["end", "start"], Vk = [
	"disabled",
	"auto",
	"always"
], Hk = [
	"disabled",
	"proximity",
	"mandatory"
], Uk = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Wk = ["hex", "rgb"], Gk = ["field", "swatch"], Kk = [
	"fill",
	"contain",
	"cover",
	"none"
], qk = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Jk = ["linear", "circular"], Yk = ["keep", "replace"], Xk = [
	"none",
	"vertical",
	"horizontal",
	"both"
], Zk = [
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
], Qk = [
	"None",
	"Shade",
	"Tint"
], $k = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, hk)}`],
	["themeColorClass", (e) => wA(e)],
	["iconClass", (e) => Bw(e)],
	["iconUrlCss", (e) => Nw(e)],
	["safeUrl", (e) => QC(e)],
	["safeImageSource", (e) => ow(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : $w(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, _k)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, vk)}`],
	["textAppearanceClass", (e) => NA(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, yk)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, bk)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, wk)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, kk)}`],
	["badgeTextFit", (e) => TA(e)],
	["buttonClass", (e) => `ui-button--${Q(e, Ok)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, Pk)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, Fk)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, Ik)}`],
	["selectionModeAttribute", (e) => Q(e, Lk)],
	["selectionBackgroundCss", (e) => vA(hA(e, "background"))],
	["selectionForegroundCss", (e) => vA(hA(e, "foreground"))],
	["selectionMarkColorCss", (e) => vA(hA(e, "markColor"))],
	["selectionMarkCss", (e) => _A(hA(e, "mark"))],
	["selectionFontWeightCss", (e) => gA(hA(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, zk)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, Bk)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, Vk)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, Vk)}`],
	["hostViewport", (e) => sA(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, Hk)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, Tk)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, Dk)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, Ek)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, Ek)}`],
	["textInputTypeAttribute", (e) => Q(e, Uk)],
	["colorTextFormatAttribute", (e) => Q(e, Wk)],
	["colorInputVariantAttribute", (e) => Q(e, Gk)],
	["themeNameCss", (e) => Q(e, Ak)],
	["alignmentCss", (e) => Q(e, jk)],
	["alignmentStretchFallbackCss", (e) => Q(e, jk) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, Mk)],
	["layoutLengthCss", (e) => cA(e)],
	["thicknessCss", (e) => lA(e)],
	["borderNoneClass", (e) => uA(e)],
	["radiusCss", (e) => dA(e)],
	["gridUnitCss", (e) => fA(e)],
	["pixelsCss", (e) => UA(e)],
	["gridTemplateCss", (e) => pA(e)],
	["colorVariantCss", (e) => LA(e)],
	["themeColorCss", (e) => vA(e)],
	["themeInkCss", (e) => bA(e)],
	["themeOnColorCss", (e) => SA(e)],
	["themeColorInlineCss", (e) => yA(e) ? "" : vA(e)],
	["themeColorCanonical", (e) => FA(e)],
	["textAppearanceFontSizeCss", (e) => PA(e, "size")],
	["textAppearanceFontWeightCss", (e) => PA(e, "weight")],
	["textAppearanceLineHeightCss", (e) => PA(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => PA(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => cA(R(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => cA(R(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => cA(R(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => cA(R(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => cA(R(e, "xxl"))],
	["responsiveThicknessBaseCss", (e) => lA(R(e, "base"))],
	["responsiveThicknessSmCss", (e) => lA(R(e, "sm"))],
	["responsiveThicknessMdCss", (e) => lA(R(e, "md"))],
	["responsiveThicknessXlCss", (e) => lA(R(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => lA(R(e, "xxl"))],
	["responsivePixelsBaseCss", (e) => WA(R(e, "base"))],
	["responsivePixelsSmCss", (e) => WA(R(e, "sm"))],
	["responsivePixelsMdCss", (e) => WA(R(e, "md"))],
	["responsivePixelsXlCss", (e) => WA(R(e, "xl"))],
	["responsivePixelsXxlCss", (e) => WA(R(e, "xxl"))],
	["visibilityBaseAttribute", (e) => GA(e, "base")],
	["visibilitySmAttribute", (e) => GA(e, "sm")],
	["visibilityMdAttribute", (e) => GA(e, "md")],
	["visibilityXlAttribute", (e) => GA(e, "xl")],
	["visibilityXxlAttribute", (e) => GA(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, Kk)}`],
	["backgroundImageCss", (e) => nA(e)],
	["imageFitSizeCss", (e) => Q(e, qk)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, Jk)}`],
	["progressValueText", (e) => HA(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, Yk)}`],
	["textAreaResizeCss", (e) => Q(e, Xk)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, Zk)}`],
	["popupPlacementAttribute", (e) => Q(e, Zk)],
	["tabMenuEntriesAttribute", (e) => tA(e)]
]), eA = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function tA(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = eA.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function nA(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : Pw(t);
}
var rA = [
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
], iA = new Map(rA.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), aA = new Map(rA.map(([e, t]) => [e, t])), oA = /* @__PURE__ */ new Map([[Mk, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : oA.get(t)?.get(e)) ?? mk.get(e) ?? Rn(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function sA(e) {
	return e == null || Q(e, Vk) === "disabled" ? void 0 : "parent";
}
function cA(e) {
	if (e == null) return "";
	if (typeof e == "number") return UA(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? UA(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function lA(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function uA(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function dA(e) {
	if (e == null) return "";
	if (typeof e == "number") return UA(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? UA(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function fA(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return UA(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function pA(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return fA(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return fA(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${fA(e[0])})` : e.map((e) => fA(e)).join(" ");
}
function $(e, t, n) {
	return mA(R(e, t), n);
}
function mA(e, t) {
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
function hA(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function gA(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function _A(e) {
	if (e == null) return "";
	switch (Q(e, Rk)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function vA(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (IA(e)) return LA(e);
	let t = e, n = LA(t.light), r = LA(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = xk.get(Q(o, hk));
	return s ? `var(${s})` : "";
}
function yA(e) {
	if (typeof e != "object" || !e || IA(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function bA(e) {
	if (yA(e)) {
		let t = Sk.get(Q(e.style, hk));
		if (t !== void 0) return `var(${t})`;
	}
	return vA(e);
}
var xA = /* @__PURE__ */ new Set(["background", "surface"]);
function SA(e) {
	if (typeof e != "object" || !e) return "";
	if (IA(e)) return CA(e);
	let t = e, n = CA(t.light ?? t.dark), r = CA(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, hk);
	if (xA.has(i)) return "initial";
	let a = Ck.get(i);
	return a ? `var(${a})` : "";
}
function CA(e) {
	let t = RA(e);
	return t === void 0 ? "" : Ry(t[0], t[1], t[2], t[3]);
}
function wA(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, hk)}`;
}
function TA(e) {
	let t = kA(e == null ? "" : String(e).trim(), EA + 1);
	return t > 0 && t <= EA ? "compact" : "";
}
var EA = 2, DA = /[\u0300-\uFFFF]/, OA = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function kA(e, t) {
	if (!DA.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of OA.segment(e)) {
		if (n >= t) break;
		n += AA(r) ? 2 : 1;
	}
	return n;
}
function AA(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < jA.length; e += 2) if (t >= jA[e] && t <= jA[e + 1]) return !0;
	return !1;
}
var jA = [
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
function MA(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute("data-ui-badge-text", TA(n));
}
function NA(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, vk)}`;
}
function PA(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return UA(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : UA(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : UA(e);
		}
		default: return "";
	}
}
function FA(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = zA(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${Ly(r.rgb >> 16 & 255)}${Ly(r.rgb >> 8 & 255)}${Ly(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${Ly(e)}`;
	}
	let i = BA(r.name);
	return i === null ? "" : `${i}/${VA(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function IA(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function LA(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = RA(e);
	return t === void 0 ? "" : `#${Ly(t[0])}${Ly(t[1])}${Ly(t[2])}${Ly(t[3])}`;
}
function RA(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = BA(t.name), i = n ?? (r === null ? void 0 : iA.get(r));
	if (!i) return;
	let a = VA(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = z(c * (1 - o)), l = z(l * (1 - o)), u = z(u * (1 - o))) : a === "Tint" && (c = z(c + (255 - c) * o), l = z(l + (255 - l) * o), u = z(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function zA(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = hk[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function BA(e) {
	if (typeof e == "number") return aA.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function VA(e) {
	if (typeof e == "number") return Qk[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function HA(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function UA(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function WA(e) {
	return e == null ? "" : UA(e);
}
function GA(e, t) {
	let n = A_(e, t);
	if (n == null) return;
	let r = Q(n, Nk);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var KA = "ui-notification-host", qA = "ui-notification", JA = "ui-notification--leaving", YA = "ui-notification__message", XA = "ui-notification__action", ZA = "ui-notification__close", QA = 5e3, $A = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), ej = class {
	root;
	durationMs;
	host = null;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? QA, this.ensureHost();
	}
	show(e) {
		let t = gk(e.severity), n = document.createElement("div");
		n.className = $A.has(t) ? `${qA} ${qA}--${t}` : qA, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = YA, typeof e.message == "string" ? r.textContent = e.message : S.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		if (i.type = "button", i.className = ZA, i.setAttribute("aria-label", S.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(nj(e.action)), this.ensureHost().append(n), n.addEventListener("focusin", (e) => {
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
		if (!(!e.isConnected || e.classList.contains(JA))) {
			if (e.classList.add(JA), this.returnFocus(e), ys() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => tj(e), vs.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(JA));
		Io(No(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${ZA}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${KA}`), n = t ?? document.createElement("div");
		return n.classList.add(KA), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function tj(e) {
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
		duration: vs.fast,
		easing: vs.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function nj(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${XA} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var rj = class {
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
		!this.state.set(e, t, n, aj(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return Zi(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(je), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, aj(r[0]?.component)) ? {
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
			(typeof n == "string" ? this.addressResolver.isTranslatable(t.reference) : bi(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${Ae}${Rn(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of Vn(e, t, () => ij(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(je))), r = e.closest(g);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(je)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			ma(e);
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
function ij(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(g) === e) return [n];
	return [e];
}
function aj(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(g) ?? null, r = e === null ? 0 : b(e), i = n.getAttribute(m);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: hr(e, mr(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var oj = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of Ro) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t.valueReaders), !0);
	}
	watch(e, t) {
		let n = v(e.componentId), r = sj(n, e.propertyId), i = this.watchers.get(r);
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
		let n = Sr(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.readBound(e.target);
		for (let e of r) {
			let t = this.propertyPatchEngine.recordValue(e, [], i);
			t !== null && this.notify(t);
		}
	}
	notify(e) {
		let t = sj(v(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function sj(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function cj(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : b(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var lj = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, uj(t));
	}
	apply(e) {
		let t = v(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), er(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) dj(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) fj(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) pj(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) mj(n, t.key, t.newIndex);
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
function uj(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function dj(e, t) {
	typeof t.key == "string" && (fj(e, t.key), e.splice(hj(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function fj(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function pj(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		dj(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function mj(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(hj(n, e.length), 0, i);
}
function hj(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/updates/collection-sinks.ts
var gj = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function _j(e, t, n, r) {
	return {
		action: er(e.action),
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
var vj = class {
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
	held = new lj();
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${h}]`)) {
			let e = Sr(n);
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
			return n === void 0 && (n = Tj(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = Cr(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(t.componentId, n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (nr(t) !== "CollectionChange") continue;
			let e = t;
			if (er(e.action) !== "Insert") continue;
			let r = v(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, wj(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of cj(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${h}]`)) {
			let t = Sr(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		Tx(e, t, {
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
				let r = Sj(n, t[e + 1]);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Fe) === !0;
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
		if (xp(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = Tj(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && es(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), Cj(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (nr(e)) {
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
			default:
				s("server update is not supported by update processor yet.", e);
				return;
		}
	}
	applyValueUpdate(e) {
		let t = v(e.address?.component?.id), n = tr(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (v(e.address?.component?.id) <= 0) {
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
		let t = v(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, _j(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (er(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		for (let n of o) a && this.held.isWaiting(n) || this.applyCollectionChangeToHost(n, t, e);
	}
	applyCollectionChangeToHost(e, t, n) {
		if (xp(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (er(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				yj(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				xj(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), kp(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (er(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (er(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${h}]`)) if (Sr(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Cp(e, M(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, Tp(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return JE(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = M(e), a = Cp(e, i), o = Tj(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, Tp(a, l, i.index ?? null)) : (Op(a, c, l), c.replaceWith(l)));
		}
	}
};
function yj(e, t) {
	let n = M(e), r = Cp(e, n), i = Tj(e, n), a = bj(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? oo(a, o, n) : null;
		i.delete(t), Ep(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function bj(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function xj(e, t) {
	let n = M(e), r = Cp(e, n), i = Tj(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		e.insertBefore(t, Dp(r, t, n.newIndex ?? null));
	}
}
function Sj(e, t) {
	if (t === void 0 || nr(e) !== "CollectionChange" || nr(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (er(n.action) !== "Reset" || er(r.action) !== "Insert") return null;
	let i = v(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== v(r.component?.id) || !es(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function Cj(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? M(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function wj(e) {
	let t = b(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : b(n);
}
function Tj(e, t = M(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(m);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function Ej(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return bi(n) || xi(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: Oj(t.severity)
	} : void 0;
}
function Dj(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = S.resolve(bi(t) || xi(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function Oj(e) {
	let t = Zn(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var kj = "ui-validation--warning", Aj = "ui-validation--info", jj = "data-ui-validation-message", Mj = "ui-validation-message--marker", Nj = "top-end", Pj = "--ui-validation-marker-host", Fj = "ui-validation-mark", Ij = "--ui-validation-presentation", Lj = "--ui-validation-color", Rj = "Validation", zj = `input:not([type='hidden']), textarea, select, .${An}[role='combobox'], [role='spinbutton']`, Bj = {
	Error: 0,
	Warning: 1,
	Info: 2
}, Vj = {
	Error: Fn,
	Warning: kj,
	Info: Aj
}, Hj = `.${Fn}, .${kj}, .${Aj}`, Uj = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, Wj = {
	Error: `${Fj}--error`,
	Warning: `${Fj}--warning`,
	Info: `${Fj}--info`
}, Gj = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, Kj = class {
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
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(Hj)), A(this.root, Hj, { childList: !0 }, (e) => this.applyRenderedMessages(e)), S.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(Hj)), this.rewriteMessageLines();
		});
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			Yj(t, qj(t) === "Error");
			let e = t.querySelector(`:scope > [${jj}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && Xj(this.markerMirrors, t, e, {
				message: n,
				severity: qj(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === Rj) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = v(e.reference.componentId), n = Ej(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = v(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => Xn(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = v(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "";
		for (let i of this.options.dom.findAllComponents(t, n)) typeof r != "string" || r.length === 0 ? this.refusalByElement.delete(i) : (this.refusalByElement.set(i, {
			message: r,
			severity: Oj(e.severity),
			content: e.content === !0
		}), this.touchedElements.add(i)), this.applyCurrentState(t, i);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: Gj[t]
		}), this.applyCurrentState(b(e), e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		Jj(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${v(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(Dj).join("\n"), !0);
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
			severity: Oj(t.severity)
		});
		let s;
		for (let e of n) (s === void 0 || Bj[e.severity] < Bj[s.severity]) && (s = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => Xn(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${ot}="${Ln(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => Xn(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && Oj(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) cs(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function qj(e) {
	return e.classList.contains(kj) ? "Warning" : e.classList.contains(Aj) ? "Info" : "Error";
}
function Jj(e, t, n) {
	for (let e of Object.values(Vj)) t.classList.toggle(e, n !== void 0 && Vj[n.severity] === e);
	Yj(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(Lj) : r.style.setProperty(Lj, `var(--ui-color-${Uj[n.severity]})`);
	let i = t.querySelector(`[${jj}]`);
	i !== null && (n?.content === !0 ? (Ki(i, null), i.textContent = String(n.message ?? "")) : S.writeValue(i, null, n?.message ?? null), Xj(e, r, i, n));
}
function Yj(e, t) {
	for (let n of e.querySelectorAll(zj)) {
		let r = n.closest(kn);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function Xj(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(Ij).trim() === "marker";
	if (n.classList.toggle(Mj, a), r !== void 0 && a) {
		n.setAttribute(Te, n.textContent ?? ""), n.setAttribute(Ee, Nj), t.setAttribute(De, ""), Zj(e, t, r, n.textContent ?? "", i.getPropertyValue(Pj).trim()), t.contains(document.activeElement) ? cE(n) : lE(n);
		return;
	}
	n.removeAttribute(Te), n.removeAttribute(Ee), t.removeAttribute(De), Zj(e, t, void 0, "", ""), lE(n);
}
function Zj(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : Qj(t, i);
	if (n === void 0 || o === null) {
		a?.remove(), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${Fj} ${Wj[n.severity]}`, s.textContent = r, s.setAttribute(Te, r), s.setAttribute(Ee, Nj), s.parentElement !== o && o.append(s), e.set(t, s), lE(s);
}
function Qj(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var $j = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, eM = "tooltip-name";
function tM(e, t, n) {
	let r = $w(e.getAttribute(Te));
	if (Ki(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var nM = /* @__PURE__ */ new WeakMap(), rM = /* @__PURE__ */ new Map([["iconClass", zw]]), iM = /* @__PURE__ */ new WeakMap(), aM = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(Qn(e), t);
	}
	apply(e) {
		let t = Qn(e.operation.kind), n = this.handlers.get(t);
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
			let t = ia(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Ki(e.target, null);
		}), this.register("Markup", (e) => {
			eT(e.target, aa(e.convertedValue) ? "" : ia(e.convertedValue)), Ki(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = fM(e.operation);
			if (Ki(e.target, t), aa(e.value) || aa(e.convertedValue)) {
				dM(e.target, t);
				return;
			}
			uM(e.target, t, ia(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = fM(e.operation);
			Ki(e.target, t), dM(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = fM(e.operation), n = !aa(e.value) && oM(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (aa(e.convertedValue) ? "" : ia(e.convertedValue));
			sM(e.target, lM(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !aa(e.value) && oM(e.value, e.operation.condition ?? "None") ? ia(e.convertedValue).trim() : "";
			cM(e.target, lM(e), t, rM.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = fM(e.operation), n = !aa(e.value) && oM(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? ia(e.convertedValue).trim() : "";
				cM(e.target, lM(e), t);
			}
		}), this.register("Style", (e) => {
			let t = fM(e.operation), n = e.target;
			if (aa(e.value) || aa(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = ia(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(eM, (e) => tM(e.resolved.component, e.target, fM(e.operation))), this.register("Property", (e) => {
			let t = fM(e.operation), n = e.target, r = aa(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function oM(e, t) {
	switch ($n(t)) {
		case "None": return !0;
		case "HasValue": return !aa(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !aa(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Bw(e).length > 0;
		default: return !aa(e);
	}
}
function sM(e, t, n, r, i) {
	let a = iM.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), iM.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), uM(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && dM(e, n);
}
function cM(e, t, n, r) {
	let i = nM.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), nM.set(e, i));
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
function lM(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function uM(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function dM(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function fM(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var pM = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => $k.has(e.name),
			convert: (e) => $k.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = mM(e.name), n = {
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
function mM(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var hM = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = y(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = y(e.domEventName) || t;
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
		return this.definitions.get(y(e));
	}
};
function gM(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function _M(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => gM(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => gM(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var vM = class {
	converters = new pM();
	events = new hM();
	operations = new aM();
	valueReaders;
	collectionSinks = new gj();
	rowDecorators = new $j();
	constructor(e, t, n, r) {
		_M(this.events), this.valueReaders = new sa(r);
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
}, yM = "Submenu", bM = "ui-menu__submenu", xM = "Select", SM = {
	kind: "menu",
	decorate: CM
};
function CM(e) {
	if (!wM(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, yM);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(lt, ""), TM(e.item, "Kind") === xM && e.row.setAttribute(ut, ""), TM(e.item, "Expanded") === !0 && e.row.setAttribute(dt, "");
	let r = document.createElement("div");
	r.className = bM, r.appendChild(n), xE(r, e.key, e.item), e.row.appendChild(r);
}
function wM(e) {
	let t = TM(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function TM(e, t) {
	let n = np(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var EM = {
	kind: "grip",
	decorate: DM
};
function DM(e) {
	e.row.append(OM());
}
function OM() {
	let e = document.createElement("span");
	return e.className = ve, e.setAttribute("role", "button"), S.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function kM(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(jM(n));
	for (let t of e.querySelectorAll(`[${Re}]`)) AM(t, Le, r), AM(t, ze, i);
}
function AM(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function jM(e) {
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
var MM = 2;
function NM(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= MM && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function PM(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var FM = "ne.standard.ui.windowId", IM = [
	500,
	1e3,
	2e3
], LM = 3, RM = [
	["refusal", ({ root: e }) => hw(e)],
	["file input", ({ root: e }) => new vl({ root: e })],
	["image input", ({ root: e }) => new Nl({ root: e })],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new Gl({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new iu({ root: e })],
	["field box press", ({ root: e }) => new tu({ root: e })],
	["image fallback", ({ root: e }) => new lu({ root: e })],
	["radio group sync", ({ root: e }) => new yu({ root: e })],
	["select interaction", ({ root: e }) => new Dd({ root: e })],
	["search input", ({ root: e }) => new Hu({ root: e })],
	["debounced commit", ({ root: e }) => new Id({ root: e })],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => zd() ? void 0 : new Bd({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new Ox({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new Qd({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new mb({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new _h({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new rg({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new hg({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new eC({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new xC({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new wg({ root: e })],
	["split button", ({ root: e }) => new Nv({ root: e })],
	["toggle button", ({ root: e }) => new Yl({ root: e })],
	["button group", ({ root: e }) => new zv({ root: e })],
	["menu", ({ root: e }) => new Ug({ root: e })],
	["collapsible", ({ root: e }) => new z_({ root: e })],
	["menu group", ({ root: e }) => new s_({ root: e })],
	["menu search", ({ root: e }) => new v_({ root: e })],
	["side drawer", ({ root: e }) => new N_({ root: e })],
	["grid splitter", ({ root: e }) => new vv({ root: e })],
	["accordion", ({ root: e }) => new Uv({ root: e })],
	["tabs", ({ root: e }) => new py({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new jS({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new Sy({ root: e })],
	["breadcrumbs", ({ root: e }) => new Fy({ root: e })],
	["scroll anchor", ({ root: e }) => new TC({ root: e })],
	["scroll group", ({ root: e }) => new zC({ root: e })],
	["flyout interaction", ({ root: e }) => new Wc({ root: e })],
	["text fold", ({ root: e }) => new GS({ root: e })],
	["tooltip", ({ root: e }) => BT(e)],
	["press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new YC({ root: e }) : void 0]
], zM = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Un(dD());
	hydration = mD();
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
	reactiveSources;
	attachTask = null;
	reattachRequested = !1;
	connectionLost = !1;
	inbound = null;
	enginesAwaitingHydration = [];
	languageSwitches = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = UM(e.windowIdStorageKey ?? FM), this.dom = new xr(this.root), S.load(this.root), S.setLanguage(document.documentElement.lang), e.strings !== void 0 && S.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : S.loadTableAsync(this.hydration.words.href)), this.extensions = new vM(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(SM), this.extensions.registerRowDecorator(EM);
		let t = new pr(this.dom, this.metadata), n = this.extensions.operations, r = new xD(), i = new rj(t, n, this.extensions, r);
		this.reactiveSources = new oj(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders
		}), this.dialogs = new pk({ root: this.root }), this.notifications = new ej({ root: this.root }), this.effects = new nk({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new fs(this.metadata), o, u = new rs(a, i, new ss(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(v(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new cD(this.dom), f = new _E(this.metadata, d, this.extensions, n, r);
		this.virtualization = new QE({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new vj(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), S.onChange(() => this.rewriteWords(i, f)), this.rewriteMoments = () => this.rewriteWords(i, f, !0), S.onMomentTick(this.rewriteMoments), new DE({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new FO(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new vD(this.transport), S.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(Hn.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		});
		let p = new WO(this.transport);
		o = new Uo({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(Hn.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new Kj({
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
			effects: this.effects
		};
		for (let [e, t] of RM) NM(e, t, this.engineContext);
		NM("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new Vf({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), NM("tree", ({ root: e, effects: t }) => new Xx({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), NM("items reorder", ({ root: e }) => new Rp({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), this.eventPipeline = new Xo({
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
		this.eventPipeline.addEvent(kS.name, kS.registration), this.eventPipeline.addEvent(Lp.name, Lp.registration), this.tables = new ax({ root: this.root }), this.windows = new PE({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: S,
			observeComponents: A,
			observeSize: Nb,
			dialogs: this.dialogs,
			store: new Xg(),
			numbers: xf,
			temporal: ii,
			icons: { apply: Lw },
			badges: { writeCount: MA },
			urls: {
				isImageSource: iw,
				asBrowserReads: rw
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
				let r = e.closest(g), a = r === null ? void 0 : this.metadata.getExposedProperty(b(r), t);
				return r === null || a === void 0 ? (s("a package set a property its component's renderer did not expose.", { propertyName: t }), !1) : i.applyToComponent(r, a, n);
			} },
			windows: this.windows,
			tooltips: sE,
			renames: { open: fc },
			tables: this.tables,
			rows: gE(d, f, this.virtualization),
			uploads: ul,
			selection: qa,
			popups: hE,
			roving: Sa,
			states: ra,
			validation: ee,
			wheel: th,
			names: In
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
		let t = ua(e);
		return t === null ? null : this.numberInputs?.readValue(t) ?? this.extensions.valueReaders.read(t);
	}
	async switchLanguageAsync(e, t) {
		if (e === S.requestedLanguage) return;
		let n = ++this.languageSwitches, r = t, i = e;
		S.setRequested(e);
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
			if (n !== this.languageSwitches || i === S.language || !await S.switchToAsync(i, r)) return;
			S.notifyChanged();
		} finally {
			n === this.languageSwitches && S.setRequested(null);
		}
	}
	rewriteWords(e, t, n = !1) {
		let r = performance.now();
		this.dom.invalidate(), S.language !== this.culturesLanguage && (this.culturesLanguage = S.language, Xi(this.root, (e) => kM(e, S.number, S.temporal)));
		let i = n ? wi : void 0;
		S.rewriteMarks(this.root, n), this.rewriteStaticWords(e, i), e.rewriteWords(i), t.rewriteRowWords(this.root, i);
		let a = this.hydration?.title ?? null;
		if (a !== null && (i === void 0 || i(a))) {
			let e = String(S.resolve(a, !0));
			document.title !== e && (document.title = e);
		}
		S.language.length > 0 && document.documentElement.lang !== S.language && (document.documentElement.lang = S.language), d(n ? "page's moments written again" : "page's words written again", r, { language: S.language });
	}
	rewriteStaticWords(e, t) {
		let n = t === void 0 ? this.metadata.getWords() : this.metadata.getWords().filter((e) => t(e.key));
		if (n.length === 0) return;
		let r = [];
		Xi(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = v(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${ce}="${Ln(n)}"]`)) _r(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => _r(e, t));
	}
	loseConnection(e) {
		if (this.connectionLost) return;
		this.connectionLost = !0, c("the connection to the server is lost; the page offers a reload.", e);
		let t = Error("the connection to the server is lost; reload the page.", { cause: e });
		this.transport.close(t), this.dispatcher.release(t), this.notifications.show({
			message: S.text("ui.connection.lost"),
			severity: "danger",
			sticky: !0,
			action: {
				label: S.text("ui.connection.reload"),
				run: () => window.location.reload()
			}
		});
	}
	reloadForView(e) {
		if (JM() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), YM(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), await HM();
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
		return Gi(this.root) || wi(this.hydration?.title) || this.metadata.getWords().some((e) => wi(e.key)) || wi(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) NM(PM(t), t, this.pluginContext);
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
		S.register(e);
	}
	addEngine(e) {
		if (this.enginesAwaitingHydration !== null) {
			this.enginesAwaitingHydration.push(e);
			return;
		}
		NM(PM(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !zO(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), BO(e))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= LM) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (XM(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(zO(e) ? await BO(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = GM(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? KM(window.location.search) : e.parameters,
			timeZone: _D()
		};
		return await gD(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, IM, VM);
	}
};
async function BM(e = {}) {
	let t = performance.now(), n = new zM(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function VM(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function HM() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function UM(e) {
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
	let n = WM();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function WM() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function GM() {
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
function KM(e) {
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
var qM = "ne-standard-ui:reloaded-view";
function JM() {
	try {
		return sessionStorage.getItem(qM);
	} catch {
		return null;
	}
}
function YM(e) {
	try {
		sessionStorage.setItem(qM, e);
	} catch {}
}
function XM() {
	try {
		sessionStorage.removeItem(qM);
	} catch {}
}
re(), BM().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
