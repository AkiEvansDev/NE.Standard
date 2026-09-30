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
var m = "data-ui-id", ce = "data-ui-context", le = "data-ui-pc", h = "data-ui-key", ue = "data-ui-unselectable", de = "data-ui-undraggable", fe = "data-ui-unremovable", pe = "data-ui-unrenamable", me = "data-ui-no-context-menu", he = "data-ui-no-row-open", ge = "data-ui-no-row-drag", _e = "ui-row__grip", ve = "data-ui-row-drop", ye = "data-ui-tabs-draggable", be = "data-ui-tabs-menu", xe = "data-ui-context-menu", Se = "data-ui-context-menu-use", Ce = "data-ui-row-focus", we = "data-ui-tooltip", Te = "data-ui-tooltip-placement", Ee = "data-ui-tooltip-mark", De = "data-ui-badge-text", Oe = "data-ui-badge-set", ke = "data-ui-name", Ae = "data-ui-bind-", je = "data-ui-into-", Me = "data-ui-bind-value", Ne = (e) => `data-ui-no-${e}`, Pe = "data-ui-event-boundary", Fe = "data-ui-image-caption", g = "data-ui-items-host", Ie = "data-ui-collection-sink", Le = "data-ui-items-query", Re = "data-ui-number-culture", ze = "data-ui-page-culture", Be = "data-ui-temporal-culture", Ve = "data-ui-empty-template", He = "data-ui-group-template", Ue = "data-ui-empty-placeholder", We = "data-ui-group-header", Ge = "data-ui-group-anchor", Ke = "data-ui-group", qe = "data-ui-value-holder", Je = "data-ui-value-kind", Ye = "items-query", Xe = "data-ui-host-mode", Ze = "data-ui-host-viewport", Qe = "data-ui-scroll-group", $e = "data-ui-scroll-lines", et = "data-ui-source-line", tt = "data-ui-window-spacer", nt = "data-ui-window-size", rt = "data-ui-window-offset", it = "data-ui-window-total", at = "data-ui-window-more-before", ot = "data-ui-window-more-after", st = "data-ui-window-group-before", ct = "data-ui-window-aggregates", lt = "data-ui-form-id", ut = "data-ui-visibility", dt = "data-ui-collapsed", ft = "data-ui-menu-group", pt = "data-ui-menu-select", mt = "data-ui-menu-open", ht = "data-ui-menu-search", gt = "data-ui-menu-searching", _t = "data-ui-menu-unmatched", vt = "data-ui-drawer-toggle", yt = "data-ui-drawer-open", bt = "data-ui-region", xt = "data-ui-menu-item-kind", _ = "ui-menu-item", St = "ui-menu-item--checked", Ct = "ui-menu--rail", wt = `[${xt}="header"], [${xt}="separator"]`, Tt = `[${ft}] > .${_}`, Et = `${Tt}, .${_}[${xt}="check"]`, Dt = "data-ui-collapse-toggle", Ot = "data-ui-folding", kt = "data-ui-column-limits", At = "data-ui-row-limits", jt = "data-ui-splitter-step", Mt = "data-ui-table-column", Nt = "data-ui-table-hide-below", Pt = "data-ui-table-starts-hidden", Ft = "data-ui-table-hidden", It = "ui-table__row", Lt = "ui-table__scroll", Rt = "ui-table__header", zt = "ui-table__resizer", Bt = "data-ui-table-last", Vt = "data-ui-table-reordering", Ht = "data-ui-table-dragging", Ut = "data-ui-table-drop", Wt = "data-ui-table-scrolled", Gt = "data-ui-table-scrollbar", Kt = "data-ui-no-row-select", qt = "data-ui-tree-parent", Jt = "data-ui-tree-children", Yt = "data-ui-tree-folder", Xt = "data-ui-tree-expanded", Zt = "data-ui-tree-title", Qt = "data-ui-tree-loading", $t = "data-ui-tree-drop-target", en = "data-ui-tree-boot", tn = "data-ui-tree-draggable", nn = "data-ui-row-editing", rn = "data-ui-image-source", an = "data-ui-file-max-size", on = "data-ui-file-pick", sn = "data-ui-file-drop-target-id", cn = "data-ui-theme", ln = "data-ui-theme-colors", un = "data-ui-words", dn = "data-ui-language-switcher", fn = "data-ui-language", pn = "data-ui-splitting", mn = "data-ui-pointer-focus", hn = "data-ui-selection", gn = "data-ui-selected", _n = "data-ui-selected-key", vn = "data-ui-selected-keys", yn = "data-ui-bind-selected-key", bn = "data-ui-tabs-selected", xn = "data-ui-tab-order", Sn = "data-ui-tab-caption", Cn = "data-ui-tab-pinned", wn = [
	ut,
	"data-ui-visibility-sm",
	"data-ui-visibility-md",
	"data-ui-visibility-xl",
	"data-ui-visibility-xxl"
], Tn = "data-ui-submit-form-id", v = `[${m}]`, En = "data-ui-href", Dn = "ui-disabled", On = "ui-loading", kn = "ui-readonly", An = "ui-hidden", jn = "ui-dialog__surface", Mn = "ui-flyout__content", Nn = "data-ui-focus-holder", Pn = "[role='listbox'], [role='menu'], [role='dialog']", Fn = "ui-select__trigger", In = `.${Fn}`, Ln = "ui-button", Rn = "ui-select", zn = "ui-text-input", Bn = "ui-invalid", Vn = {
	componentId: m,
	key: h,
	selected: gn,
	selectedKey: _n,
	selectedKeys: vn,
	unselectable: ue,
	rowFocus: Ce,
	itemsHost: g,
	valueHolder: qe,
	bindValue: Me,
	noRowOpen: he,
	noRowDrag: ge,
	eventBoundary: Pe,
	focusHolder: Nn,
	tooltip: we,
	tooltipPlacement: Te,
	contextMenu: xe,
	contextMenuUse: Se,
	disabledClass: Dn,
	loadingClass: On,
	readOnlyClass: kn,
	hiddenClass: An,
	buttonClass: Ln,
	selectClass: Rn,
	textInputClass: zn,
	invalidClass: Bn,
	sourceLine: et,
	popupSelector: Pn,
	listTriggerSelector: In,
	tableRowClass: It,
	tableScrollClass: Lt,
	tableHeaderClass: Rt,
	tableResizerClass: zt,
	tableHidden: Ft,
	hostMode: Xe,
	windowOffset: rt,
	windowTotal: it,
	windowSize: nt,
	windowMoreAfter: ot,
	windowAggregates: ct,
	itemsQuery: Le,
	valueKind: Je,
	itemsQueryKind: Ye,
	menuItemClass: _,
	menuItemKind: xt,
	menuItemCheckedClass: St
};
function Hn(e) {
	return String(e).replace(/[\\"]/g, "\\$&").replace(/[\u0000-\u001f\u007f]/g, (e) => `\\${e.charCodeAt(0).toString(16)} `);
}
function Un(e) {
	return e.replace(/([a-z])([A-Z])/g, "$1-$2").replace(/([A-Z0-9])([A-Z][a-z])/g, "$1-$2").replace(/_/g, "-").toLowerCase();
}
var Wn = 0;
function Gn(e, t) {
	return e.id.length === 0 && (Wn++, e.id = `${t}-${Wn}`), e.id;
}
//#endregion
//#region src/addressing/operation-targets.ts
function Kn(e, t, n) {
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
var qn = {
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
	SetThemeColors: "SetThemeColors",
	RenameTab: "RenameTab",
	RenameNode: "RenameNode",
	CopyToClipboard: "CopyToClipboard",
	InsertText: "InsertText",
	DiscardForm: "DiscardForm",
	OpenPicker: "OpenPicker",
	SetLanguage: "SetLanguage"
}, Jn = class {
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
		for (let t of e.validationTargets ?? []) this.validationTargetsByComponentId.set(b(t.componentId), t);
		for (let t of e.exposedProperties ?? []) {
			let e = this.getPropertyDefinition(t.propertyId);
			e !== void 0 && this.exposedProperties.set(`${b(t.componentId)}:${e.propertyName}`, t);
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
		return this.propertyDefinitionsById.get(e.propertyId)?.translatable !== !0 || e.content === !0 ? !1 : ("bindingId" in e ? e : this.getBindingByComponentAndPropertyId(b(e.componentId), e.propertyId))?.content !== !0;
	}
	getWords() {
		return this.metadata.words ?? [];
	}
	hasComponentBindings(e) {
		for (let t of this.metadata.bindings) if (b(t.componentId) === e) return !0;
		return !1;
	}
	getBindingByComponentAndPropertyId(e, t) {
		return this.bindingsByComponentAndPropertyId.get(hr(e, t));
	}
	getBindingByComponentAndPropertyName(e, t) {
		return this.bindingsByComponentAndPropertyName.get(hr(e, mr(t)));
	}
	getEvent(e, t) {
		return this.eventsByComponentAndName.get(gr(e, t));
	}
	hasServerEvent(e) {
		return this.eventNames.has(x(e));
	}
	getEventNames() {
		return this.eventNames;
	}
	hasServerEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(x(e))?.has(t) === !0;
	}
	getItemsTemplateMetadata(e) {
		return this.itemsTemplatesByComponentId.get(e);
	}
	getItemsFilterSortMetadata(e) {
		return this.itemsFilterSortByComponentId.get(e);
	}
	getItemValues(e, t = []) {
		return this.itemValuesByAddress.get(_r(e, t))?.items ?? [];
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
		let t = b(e.componentId), n = this.getPropertyDefinition(e.propertyId);
		if (t <= 0 || n === void 0) return;
		let r = b(e.bindingId);
		r > 0 && this.bindingsById.set(r, e), this.bindingsByComponentAndPropertyId.set(hr(t, e.propertyId), e), this.bindingsByComponentAndPropertyName.set(hr(t, n.propertyName), e);
	}
	addEvent(e) {
		let t = x(e.eventName), n = b(e.componentId);
		if (t.length === 0 || n <= 0) return;
		this.eventsByComponentAndName.set(gr(n, t), e), this.eventNames.add(t);
		let r = this.eventComponentIdsByName.get(t);
		r === void 0 && (r = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(t, r)), r.add(n);
	}
	addItemsTemplate(e) {
		let t = b(e.componentId);
		t <= 0 || this.itemsTemplatesByComponentId.set(t, e);
	}
	addItemsFilterSort(e) {
		let t = b(e.componentId);
		t <= 0 || this.itemsFilterSortByComponentId.set(t, e);
	}
	addItemValues(e) {
		let t = b(e.componentId);
		t > 0 && this.itemValuesByAddress.set(_r(t, e.dynamicParameters ?? []), e);
	}
	addValidation(e) {
		let t = b(e.target?.componentId);
		if (t <= 0) return;
		let n = this.validationsByComponentId.get(t);
		n === void 0 && (n = [], this.validationsByComponentId.set(t, n)), n.push(e);
	}
};
function y(e, t) {
	return typeof e == "number" ? t[e] ?? "Unknown" : e != null && t.includes(e) ? e : "Unknown";
}
function Yn(e) {
	return y(e, [
		"Dynamic",
		"Fixed",
		"Scope"
	]);
}
function Xn(e) {
	return e == null ? "OneWay" : y(e, [
		"OneWay",
		"TwoWay",
		"OneWayToSource",
		"OnSubmit"
	]);
}
function Zn(e) {
	return y(e, ["Property", "Event"]);
}
function Qn(e) {
	return e == null ? "SetProperty" : y(e, ["SetProperty", "Effect"]);
}
function $n(e) {
	return y(e, [
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
function er(e) {
	return y(e, ["Ascending", "Descending"]);
}
function tr(e) {
	return y(e, [
		"Change",
		"Blur",
		"Submit"
	]);
}
function nr(e) {
	return y(e, [
		"Error",
		"Warning",
		"Info"
	]);
}
function rr(e) {
	return typeof e == "string" ? e : y(e, [
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
function ir(e) {
	return y(e, [
		"None",
		"HasValue",
		"HasText",
		"IsTrue",
		"IsFalse",
		"DrawsIcon"
	]);
}
function ar(e) {
	return y(e, [
		"Insert",
		"Remove",
		"Move",
		"Replace",
		"Reset"
	]);
}
function b(e) {
	return e ?? 0;
}
function or(e) {
	return typeof e == "string" ? e : "";
}
function sr(e) {
	return y(e.kind, [
		"Value",
		"CollectionChange",
		"FullResync",
		"Validation"
	]);
}
function cr(e) {
	return typeof e == "string" ? e.trim() : "";
}
function lr(e) {
	return y(e, ["Auto", "Smooth"]);
}
function ur(e) {
	return y(e, [
		"Start",
		"Center",
		"End",
		"Nearest"
	]);
}
function dr(e) {
	return y(e, [
		"Start",
		"End",
		"Offset",
		"PageBack",
		"PageForward"
	]);
}
function fr(e) {
	return y(e, ["Light", "Dark"]);
}
function pr(e) {
	return y(e, ["Horizontal", "Vertical"]);
}
function x(e) {
	return e?.trim().toLowerCase() ?? "";
}
function mr(e) {
	return e?.trim() ?? "";
}
function hr(e, t) {
	return `${e}:${mr(t)}`;
}
function gr(e, t) {
	return `${e}:${x(t)}`;
}
function _r(e, t) {
	return `${e}:${JSON.stringify(t.map((e) => String(e ?? "")))}`;
}
//#endregion
//#region src/addressing/address-resolver.ts
var vr = class {
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
		return this.dom.findAllComponents(b(e.componentId), []).length > 0;
	}
	resolveProperties(e, t) {
		let n = b(e.componentId), r = this.metadata.getPropertyDefinition(e.propertyId);
		if (n <= 0 || r === void 0) return [];
		let i = this.dom.findAllComponents(n, t);
		if (i.length === 0) return [];
		let a = b(this.metadata.getBindingByComponentAndPropertyId(n, e.propertyId)?.bindingId), o = a > 0 ? `[${Ae}${Un(r.propertyName)}="${Hn(a)}"]` : null;
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
		let n = b(t.componentId), r = this.metadata.getPropertyDefinition(t.propertyId);
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
		return Kn(e.component, t, () => {
			if (e.bindingSelector === null) return [e.component.querySelector(`[data-ui-into-${Un(e.propertyName)}]`) ?? e.component];
			let t = Array.from(e.component.querySelectorAll(e.bindingSelector));
			return e.component.matches(e.bindingSelector) && t.unshift(e.component), t;
		});
	}
};
//#endregion
//#region src/addressing/dynamic-parameters.ts
function yr(e) {
	return Cr(e, le);
}
function br(e, t) {
	if (t <= 0) return [];
	let n = [], r = e;
	for (; r !== null && n.length < t;) {
		let e = wr(r);
		e !== void 0 && n.push(e), r = r.parentElement;
	}
	return n.reverse(), n.length !== t && s("dynamic parameter count mismatch.", {
		expectedCount: t,
		actualCount: n.length,
		element: e
	}), n;
}
function xr(e, t) {
	let n = yr(e);
	if (n !== t.length) return !1;
	if (n === 0) return !0;
	let r = br(e, n);
	if (r.length !== t.length) return !1;
	for (let e = 0; e < t.length; e++) if (String(r[e] ?? "") !== String(t[e] ?? "")) return !1;
	return !0;
}
function Sr(e, t) {
	let n = t.length - 1, r = e;
	for (; r !== null && n >= 0;) {
		let e = wr(r);
		if (e !== void 0) {
			if (e !== String(t[n] ?? "")) return !1;
			n--;
		}
		r = r.parentElement;
	}
	return n < 0;
}
function Cr(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.trim().length === 0) return 0;
	let r = Number(n);
	return Number.isInteger(r) ? r : 0;
}
function wr(e) {
	return e.getAttribute("data-ui-key") ?? e.getAttribute("data-ui-group-anchor") ?? void 0;
}
//#endregion
//#region src/addressing/dom-registry.ts
function Tr(e, t) {
	let n = [];
	for (let r of e) r instanceof HTMLElement && r.matches(t) ? n.push(r) : n.push(...r.querySelectorAll(t));
	return n;
}
var Er = class {
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
		let e = this.root.querySelectorAll(v), t = this.root.querySelector(`[${We}]`) !== null;
		for (let n of e) {
			let e = S(n);
			if (e <= 0 || t && n.closest("[data-ui-group-header]") !== null) continue;
			let r = this.componentsById.get(e);
			r === void 0 && (r = [], this.componentsById.set(e, r)), r.push(n), !this.staticComponentsById.has(e) && Ar(n) && this.staticComponentsById.set(e, n);
		}
	}
	findComponent(e, t) {
		return this.findAllComponents(e, t)[0] ?? null;
	}
	ensureId(e, t) {
		return Gn(e, t);
	}
	findComponentParts(e, t, n) {
		return Tr(this.findAllComponents(e, t), n);
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
		let n = this.keyedComponents(e).get(kr(t)) ?? [];
		if (n.length > 0 && n.every((e) => xr(e, t))) return [...n];
		let r = (this.componentsById.get(e) ?? []).filter((e) => xr(e, t));
		return n.length > 0 && this.keyedComponentsById.delete(e), r;
	}
	keyedComponents(e) {
		let t = this.keyedComponentsById.get(e);
		if (t !== void 0) return t;
		t = /* @__PURE__ */ new Map();
		for (let n of this.componentsById.get(e) ?? []) {
			let e = yr(n);
			if (e === 0) continue;
			let r = br(n, e);
			if (r.length !== e) continue;
			let i = kr(r), a = t.get(i);
			a === void 0 ? t.set(i, [n]) : a.push(n);
		}
		return this.keyedComponentsById.set(e, t), t;
	}
	resolveNearestComponent(e, t) {
		this.stale && this.rebuild();
		let n = e;
		for (; n !== null;) {
			let e = n.closest(v);
			if (e === null || !jr(this.root, e)) return null;
			let r = S(e);
			if (r > 0 && t(r, e)) return {
				element: e,
				componentId: r,
				dynamicParameters: br(e, yr(e))
			};
			n = e.parentElement;
		}
		return null;
	}
};
function S(e) {
	return Cr(e, m);
}
function Dr(e) {
	let t = e.closest(v), n = t === null ? 0 : S(t);
	return n > 0 ? n : null;
}
function Or(e) {
	let t = e.closest(v), n = t === null ? 0 : S(t);
	return t === null || n <= 0 ? null : {
		componentId: n,
		dynamicParameters: br(t, yr(t))
	};
}
function kr(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function Ar(e) {
	return yr(e) === 0;
}
function jr(e, t) {
	return e === t || e instanceof Node && e.contains(t);
}
//#endregion
//#region src/runtime/plural-rules.ts
function Mr(e, t) {
	if (!Number.isFinite(t)) return "other";
	let n = Math.abs(t), r = Math.trunc(n), i = Nr(n);
	switch (Pr(e)) {
		case "en":
		case "de": return r === 1 && i === 0 ? "one" : "other";
		case "es": return n === 1 ? "one" : Fr(r, i) ? "many" : "other";
		case "fr": return r === 0 || r === 1 ? "one" : Fr(r, i) ? "many" : "other";
		case "ru":
		case "uk": return Ir(r, i);
		case "pl": return Lr(r, i);
		default: return "other";
	}
}
function Nr(e) {
	if (Number.isInteger(e)) return 0;
	let t = String(e), n = t.indexOf("e"), r = n < 0 ? t : t.slice(0, n), i = n < 0 ? 0 : Number(t.slice(n + 1)), a = r.indexOf("."), o = a < 0 ? 0 : r.length - a - 1;
	return Math.max(0, o - i);
}
function Pr(e) {
	return e == null || e.trim().length === 0 ? "" : e.split(/[-_]/, 1)[0].toLowerCase();
}
function Fr(e, t) {
	return t === 0 && e !== 0 && e % 1e6 == 0;
}
function Ir(e, t) {
	if (t !== 0) return "other";
	let n = e % 10, r = e % 100;
	return n === 1 && r !== 11 ? "one" : n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
function Lr(e, t) {
	if (t !== 0) return "other";
	if (e === 1) return "one";
	let n = e % 10, r = e % 100;
	return n >= 2 && n <= 4 && !(r >= 12 && r <= 14) ? "few" : "many";
}
//#endregion
//#region src/rendering/temporal-format.ts
function Rr(e, t) {
	return `${e.date} ${t ? e.longTime : e.shortTime}`;
}
var zr = {
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
function Br(e) {
	let t = e.closest("[data-ui-temporal-culture]")?.getAttribute("data-ui-temporal-culture") ?? null;
	if (t === null) return zr;
	try {
		return {
			...zr,
			...JSON.parse(t)
		};
	} catch {
		return zr;
	}
}
var Vr = [
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
function Hr(e, t, n) {
	if (t == null || t.trim().length === 0) return `${Kr(e.getFullYear(), 4)}-${Kr(e.getMonth() + 1, 2)}-${Kr(e.getDate(), 2)} ${Kr(e.getHours(), 2)}:${Kr(e.getMinutes(), 2)}:${Kr(e.getSeconds(), 2)}`;
	let r = "", i = Ur(t);
	for (let a = 0; a < t.length;) {
		let o = Wr(t, a);
		if (o === null) {
			r += t[a], a++;
			continue;
		}
		r += Gr(o, e, n, i), a += o.length;
	}
	return r;
}
function Ur(e) {
	for (let t = 0; t < e.length;) {
		let n = Wr(e, t);
		if (n === null) {
			t++;
			continue;
		}
		if (n === "d" || n === "dd") return !0;
		t += n.length;
	}
	return !1;
}
function Wr(e, t) {
	for (let n of Vr) if (e.startsWith(n, t)) return n;
	return null;
}
function Gr(e, t, n, r) {
	let i = t.getHours(), a = i % 12 == 0 ? 12 : i % 12;
	switch (e) {
		case "yyyy": return Kr(t.getFullYear(), 4);
		case "yy": return Kr(t.getFullYear() % 100, 2);
		case "MMMM": return r ? n.monthGenitiveNames[t.getMonth()] : n.monthNames[t.getMonth()];
		case "MMM": return n.abbreviatedMonthNames[t.getMonth()];
		case "MM": return Kr(t.getMonth() + 1, 2);
		case "M": return String(t.getMonth() + 1);
		case "dddd": return n.dayNames[t.getDay()];
		case "ddd": return n.abbreviatedDayNames[t.getDay()];
		case "dd": return Kr(t.getDate(), 2);
		case "d": return String(t.getDate());
		case "HH": return Kr(i, 2);
		case "H": return String(i);
		case "hh": return Kr(a, 2);
		case "h": return String(a);
		case "mm": return Kr(t.getMinutes(), 2);
		case "m": return String(t.getMinutes());
		case "ss": return Kr(t.getSeconds(), 2);
		case "s": return String(t.getSeconds());
		case "tt": return i < 12 ? n.amDesignator : n.pmDesignator;
		default: return e;
	}
}
function Kr(e, t) {
	return String(e).padStart(t, "0");
}
var qr = /^(\d{4})-(\d{1,2})-(\d{1,2})(?:[T ](\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function Jr(e) {
	let t = qr.exec(e.trim());
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
function Yr(e) {
	return Xr(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, e.millisecond);
}
function Xr(e, t, n, r = 0, i = 0, a = 0, o = 0) {
	let s = new Date(2e3, 0, 1, r, i, a, o);
	return s.setFullYear(e, t, n), s;
}
var Zr = {
	year: "y",
	month: "M",
	day: "d",
	hour: "H",
	minute: "m",
	second: "s"
};
function Qr(e, t) {
	let n = "";
	for (let r = 0; r < e.length;) {
		let i = Wr(e, r);
		if (i === null) {
			n += e[r], r++;
			continue;
		}
		n += $r(i, t).repeat(i.length), r += i.length;
	}
	return n;
}
function $r(e, t) {
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
function ei(e, t, n) {
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
		let a = Wr(t, e);
		if (a === null) {
			if (!ti(r, i, t[e])) return null;
			e++;
			continue;
		}
		if (!ni(r, i, a, n)) return null;
		e += a.length;
	}
	return r.length > 0 && i.position === r.length ? li(i) : null;
}
function ti(e, t, n) {
	if (/\s/.test(n)) {
		for (; t.position < e.length && /\s/.test(e[t.position]);) t.position++;
		return !0;
	}
	return t.position >= e.length || e[t.position].toLowerCase() !== n.toLowerCase() ? !1 : (t.position++, !0);
}
function ni(e, t, n, r) {
	switch (n) {
		case "yyyy": return ri(t, "year", oi(e, t, 4, 4));
		case "yy": return ri(t, "year", ii(oi(e, t, 2, 2)));
		case "MMMM":
		case "MMM": return ri(t, "month", ai(si(e, t, [
			r.monthNames,
			r.monthGenitiveNames,
			r.abbreviatedMonthNames
		])));
		case "MM":
		case "M": return ri(t, "month", oi(e, t, 1, 2));
		case "dddd":
		case "ddd": return si(e, t, [r.dayNames, r.abbreviatedDayNames]) !== null;
		case "dd":
		case "d": return ri(t, "day", oi(e, t, 1, 2));
		case "HH":
		case "H": return ri(t, "hour", oi(e, t, 1, 2));
		case "hh":
		case "h": return ri(t, "hour12", oi(e, t, 1, 2));
		case "mm":
		case "m": return ri(t, "minute", oi(e, t, 1, 2));
		case "ss":
		case "s": return ri(t, "second", oi(e, t, 1, 2));
		case "tt": return ci(e, t, r);
		default: return !1;
	}
}
function ri(e, t, n) {
	return n !== null && (e[t] = n, !0);
}
function ii(e) {
	return e === null ? null : e + (e < 50 ? 2e3 : 1900);
}
function ai(e) {
	return e === null ? null : e + 1;
}
function oi(e, t, n, r) {
	let i = t.position;
	for (; i < e.length && i - t.position < r && e[i] >= "0" && e[i] <= "9";) i++;
	if (i - t.position < n) return null;
	let a = Number(e.slice(t.position, i));
	return t.position = i, a;
}
function si(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = null, a = 0;
	for (let e of n) for (let t = 0; t < e.length; t++) {
		let n = e[t].toLowerCase();
		n.length > a && r.startsWith(n) && (i = t, a = n.length);
	}
	return t.position += a, i;
}
function ci(e, t, n) {
	let r = e.slice(t.position).toLowerCase(), i = n.amDesignator.toLowerCase(), a = n.pmDesignator.toLowerCase();
	for (let [e, n] of i.length >= a.length ? [[i, !1], [a, !0]] : [[a, !0], [i, !1]]) if (e.length > 0 && r.startsWith(e)) return t.position += e.length, t.afternoon = n, !0;
	return i.length === 0 && a.length === 0;
}
function li(e) {
	let t = e.hour ?? 0;
	if (e.hour12 !== null) {
		if (e.hour12 < 1 || e.hour12 > 12) return null;
		t = e.hour12 % 12 + (e.afternoon === !0 ? 12 : 0);
	}
	return e.year === null || e.month === null || e.day === null || e.year < 1 || e.month < 1 || e.month > 12 || e.day < 1 || e.day > Xr(e.year, e.month, 0).getDate() || t > 23 || e.minute > 59 || e.second > 59 ? null : {
		year: e.year,
		month: e.month,
		day: e.day,
		hour: t,
		minute: e.minute,
		second: e.second,
		millisecond: 0
	};
}
var ui = {
	readCulture: Br,
	format: Hr,
	parse: Jr,
	toDate: Yr
}, di = /(?:Z|[+-]\d{2}(?::?\d{2})?)$/i, fi = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}(?::?\d{2})?)?$/i;
function pi(e) {
	let t = e?.trim() ?? "";
	if (!fi.test(t)) return null;
	let n = Date.parse(di.test(t) ? t : `${t}Z`);
	return Number.isNaN(n) ? null : n;
}
function mi(e) {
	return e === "date" || e === "time" || e === "relative" ? e : "date-time";
}
var hi = {
	...zr,
	date: "yyyy-MM-dd",
	shortTime: "HH:mm",
	longTime: "HH:mm:ss"
};
function gi(e, t, n, r) {
	if (t === "relative") return wi(e - r, n.language);
	let i = n.temporal ?? hi, a = t === "date" ? i.date : t === "time" ? i.shortTime : Rr(i, !1);
	return Hr(new Date(e), a, i);
}
var _i = /* @__PURE__ */ new Map();
function vi(e) {
	let t = _i.get(e);
	return t === void 0 && (t = new Intl.RelativeTimeFormat(yi(e), { numeric: "auto" }), _i.set(e, t)), t;
}
function yi(e) {
	if (e.length !== 0) try {
		return Intl.DateTimeFormat.supportedLocalesOf(e).length > 0 ? e : void 0;
	} catch {
		return;
	}
}
var bi = 1e3, xi = 60 * bi, Si = 60 * xi, Ci = 24 * Si;
function wi(e, t) {
	let n = vi(t), r = Math.abs(e);
	return r < 45 * bi ? n.format(0, "second") : r < 45 * xi ? n.format(Math.round(e / xi), "minute") : r < 22 * Si ? n.format(Math.round(e / Si), "hour") : r < 26 * Ci ? n.format(Math.round(e / Ci), "day") : r < 320 * Ci ? n.format(Math.round(e / (30.4375 * Ci)), "month") : n.format(Math.round(e / (365.25 * Ci)), "year");
}
//#endregion
//#region src/runtime/words.ts
var Ti = "count";
function Ei(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	if (typeof t.key != "string" || t.key.trim().length === 0) return !1;
	for (let e of Object.keys(t)) if (e !== "key" && e !== "args") return !1;
	return t.args === void 0 || t.args === null || typeof t.args == "object" && !Array.isArray(t.args);
}
function Di(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	return typeof t.text == "string" && t.text.trim().length > 0 && Object.keys(t).length === 1;
}
var Oi = /* @__PURE__ */ new Set([
	"date-time",
	"date",
	"time",
	"relative"
]);
function ki(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return !1;
	let t = e;
	for (let e of Object.keys(t)) if (e !== "moment" && e !== "format") return !1;
	return typeof t.moment == "string" && pi(t.moment) !== null && (t.format === void 0 || typeof t.format == "string" && Oi.has(t.format));
}
function Ai(e) {
	if (typeof e != "object" || !e) return !1;
	if (ki(e)) return !0;
	for (let t of Array.isArray(e) ? e : Object.values(e)) if (Ai(t)) return !0;
	return !1;
}
function ji(e, t) {
	let n = new Date(e).toISOString(), r = n.slice(0, 10), i = n.slice(11, 16);
	return t === "date" ? r : t === "time" ? `${i} UTC` : `${r} ${i} UTC`;
}
function Mi(e, t, n) {
	return Ei(e) ? Fi(n, e.key, e.args) : Di(e) ? Ni(n, e.text) : t && typeof e == "string" ? Ni(n, e) : e;
}
function Ni(e, t) {
	return t.trim().length === 0 || !Pi(e.prefixes, t) ? t : e.lookup(t) ?? t;
}
function Pi(e, t) {
	if (e.length === 0) return !0;
	for (let n of e) if (t.startsWith(n)) return !0;
	return !1;
}
function Fi(e, t, n) {
	let r = n?.[Ti];
	return Ii(typeof r == "number" ? e.lookup(`${t}.${Mr(e.language, r)}`) ?? e.lookup(`${t}.other`) ?? e.lookup(t) ?? t : e.lookup(t) ?? t, n, (t) => Di(t) ? Ni(e, t.text) : Fi(e, t.key, t.args), e.writeMoment);
}
function Ii(e, t, n, r = ji) {
	if (t == null || !e.includes("{")) return e;
	let i = "", a = 0;
	for (; a < e.length;) {
		if (e[a] === "{") {
			let o = Li(e, a);
			if (o > 0) {
				let s = e.slice(a + 1, o);
				if (Object.hasOwn(t, s)) {
					i += zi(t[s], n, r), a = o + 1;
					continue;
				}
			}
		}
		i += e[a], a++;
	}
	return i;
}
function Li(e, t) {
	let n = t + 1;
	for (; n < e.length && Ri(e.charCodeAt(n));) n++;
	return n > t + 1 && n < e.length && e[n] === "}" ? n : -1;
}
function Ri(e) {
	return e >= 48 && e <= 57 || e >= 65 && e <= 90 || e >= 97 && e <= 122 || e === 95;
}
function zi(e, t, n) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "boolean" ? e ? "true" : "false" : Ei(e) ? t === void 0 ? Ii(e.key, e.args, void 0, n) : t(e) : Di(e) ? t === void 0 ? e.text : t(e) : ki(e) ? n(pi(e.moment) ?? 0, e.format ?? "date-time") : String(e);
}
//#endregion
//#region src/runtime/relative-clock.ts
var Bi = 15e3, Vi = /* @__PURE__ */ new Set(), Hi = null;
function Ui(e) {
	Vi.add(e), Hi === null && (Hi = setInterval(Wi, Bi));
}
function Wi() {
	for (let e of [...Vi]) {
		let t = !1;
		try {
			t = e();
		} catch (e) {
			s("a relative tick failed; it is ticked no more.", e);
		}
		t || Vi.delete(e);
	}
	Vi.size === 0 && Hi !== null && (clearInterval(Hi), Hi = null);
}
//#endregion
//#region src/runtime/client-strings.ts
var Gi = 256, Ki = 512, qi = "script[type='application/json'][data-ui-strings]", Ji = "#text", Yi = `[${un}*='"moment"']`, Xi = class {
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
		let t = e.querySelector(qi)?.textContent?.trim() ?? "";
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
		return this.lookup(e) === void 0 && this.text(e), Fi(this, e, t);
	}
	translate(e, t) {
		return Fi(this, e, t);
	}
	writeMoment = (e, t) => (t === "relative" && this.noteRelative(), gi(e, t, {
		temporal: this.currentTemporal,
		language: this.currentLanguage
	}, Date.now()));
	noteRelative() {
		this.relativeWritten = !0, this.momentHandlers.size > 0 && Ui(this.tickMoments);
	}
	tickMoments = () => this.relativeWritten ? (this.relativeWritten = !1, this.notify(this.momentHandlers, "a moment tick handler failed."), !0) : !1;
	resolve(e, t) {
		return Mi(e, t, this);
	}
	resolveText(e) {
		return Mi(e, !0, this);
	}
	write(e, t, n, r) {
		ta(e, t, this.translate(n, r)), this.mark(e, t, r == null || Object.keys(r).length === 0 ? [n] : [n, r]);
	}
	writeText(e, t, n) {
		ta(e, t, Mi(n, !0, this)), this.mark(e, t, n);
	}
	writeValue(e, t, n) {
		if (Ei(n)) {
			this.write(e, t, n.key, n.args);
			return;
		}
		let r = Di(n) ? n.text : typeof n == "string" ? n : "";
		if (r.trim().length > 0) {
			this.writeText(e, t, r);
			return;
		}
		ta(e, t, ""), this.mark(e, t, null);
	}
	mark(e, t, n) {
		$i(e, t, n);
	}
	rewriteMarks(e, t = !1) {
		na(e, (e) => {
			for (let n of e.querySelectorAll(t ? Yi : `[${un}]`)) for (let [e, r] of Object.entries(ea(n))) {
				if (t && !Ai(r)) continue;
				let i = this.wordsOfMark(r);
				i !== null && ta(n, e === Ji ? null : e, i);
			}
		});
	}
	wordsOfMark(e) {
		if (typeof e == "string") return Mi(e, !0, this);
		if (!Array.isArray(e)) return null;
		let [t, n] = e;
		return typeof t == "string" ? this.translate(t, typeof n == "object" && n ? n : null) : null;
	}
	askLater(e) {
		this.asker === null || !this.tableLoaded || e.length > Ki || e.trim().length === 0 || this.complete && !(this.report && this.currentPrefixes.length > 0 && Pi(this.currentPrefixes, e)) || this.askedIn(this.currentLanguage).has(e) || (this.pending.add(e), !this.flushQueued && (this.flushQueued = !0, setTimeout(() => void this.flushAsync(), 0)));
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
		for (let r = 0; r < n.length; r += Gi) try {
			let a = await e(t, n.slice(r, r + Gi));
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
function Zi(e) {
	let t = !1;
	return na(e, (e) => {
		t ||= e.querySelector(Yi) !== null;
	}), t;
}
function Qi(e, t) {
	e.hasAttribute("data-ui-words") && $i(e, t, null);
}
function $i(e, t, n) {
	let r = ea(e), i = t ?? Ji;
	if (n === null) {
		if (!(i in r)) return;
		delete r[i];
	} else r[i] = n;
	let a = JSON.stringify(r);
	Object.keys(r).length === 0 ? e.removeAttribute(un) : e.getAttribute("data-ui-words") !== a && e.setAttribute(un, a);
}
function ea(e) {
	let t = e.getAttribute(un);
	if (t === null || t.length === 0) return {};
	try {
		let e = JSON.parse(t);
		return typeof e == "object" && e && !Array.isArray(e) ? e : {};
	} catch {
		return {};
	}
}
function ta(e, t, n) {
	if (t === null) {
		e.textContent !== n && (e.textContent = n);
		return;
	}
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function na(e, t) {
	t(e);
	for (let n of e.querySelectorAll("template")) na(n.content, t);
}
var C = new Xi();
function ra(e, t) {
	let n = Di(e) ? e.text : e;
	return C.resolve(n, typeof n == "string" && n.length > 0 && t());
}
//#endregion
//#region src/interactions/interactive-state.ts
var ia = `.${Dn}, .${On}, [inert]`, aa = `:scope > [${m}]:is(${ia}), :scope > :not([${m}]) > [${m}]:is(${ia})`;
function w(e) {
	return e.closest(ia) !== null || e.matches(":disabled, [aria-disabled='true']");
}
function T(e) {
	return e.matches(ia) || e.querySelector(aa) !== null;
}
function oa(e) {
	return e.getClientRects().length > 0 && !e.matches(":disabled") && e.closest("[inert]") === null;
}
var sa = `[${m}], .${kn}`;
function E(e) {
	return e.closest(sa)?.matches(`.${kn}`) === !0;
}
function ca(e, t) {
	e.classList.contains("ui-disabled") !== t && e.classList.toggle(Dn, t), t ? e.setAttribute("aria-disabled", "true") : e.removeAttribute("aria-disabled");
}
var la = {
	isInert: w,
	isReadOnly: E,
	setDisabled: ca
};
//#endregion
//#region src/extensions/value-readers.ts
function ua(e) {
	return e == null ? "" : typeof e == "string" ? e : typeof e == "number" || typeof e == "boolean" || typeof e == "bigint" ? String(e) : JSON.stringify(e);
}
function da(e) {
	return e == null;
}
var fa = "data-ui-trim-input", pa = class {
	readers = /* @__PURE__ */ new Map();
	constructor(e) {
		for (let e of va) this.register(e);
		for (let t of e ?? []) this.register(t);
	}
	register(e) {
		this.readers.set(e.kind, e.read);
	}
	read(e) {
		let t = e.getAttribute(Je);
		if (t === null) return ma(e);
		let n = this.readers.get(t);
		return n === void 0 ? (s("value reader: no reader registered for this kind.", { kind: t }), null) : n(e);
	}
	readBound(e) {
		let t = this.read(e);
		return typeof t == "string" && e.hasAttribute(fa) ? t.trim() : t;
	}
	readHeld(e) {
		let t = ga(e);
		return t === null ? null : this.read(t);
	}
};
function ma(e) {
	if (e instanceof HTMLInputElement) switch (e.type) {
		case "checkbox": return e.checked;
		case "number":
		case "range": return e.value.trim().length === 0 ? null : Number(e.value);
		default: return e.value;
	}
	return e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement ? e.value : e instanceof HTMLDetailsElement ? e.open : null;
}
var ha = "input, textarea, select";
function ga(e) {
	return e.hasAttribute("data-ui-value-kind") || e.matches(ha) ? e : e.querySelector("[data-ui-value-holder]") ?? e.querySelector(`[data-ui-value-kind], ${ha}`);
}
function _a(e) {
	return e === null ? null : Number(e);
}
var va = [
	{
		kind: "flyout-open",
		read: (e) => e.classList.contains("ui-flyout--open")
	},
	{
		kind: "tabs-selected",
		read: (e) => e.getAttribute(bn)
	},
	{
		kind: "tab-order",
		read: (e) => _a(e.getAttribute(xn))
	},
	{
		kind: "tab-caption",
		read: (e) => e.getAttribute(Sn)
	},
	{
		kind: "tab-pinned",
		read: (e) => e.hasAttribute(Cn)
	},
	{
		kind: "tree-title",
		read: (e) => e.getAttribute(Zt)
	},
	{
		kind: "tree-drop-target",
		read: (e) => e.getAttribute("data-ui-tree-drop-target") ?? ""
	},
	{
		kind: "selected-key",
		read: (e) => e.getAttribute(_n)
	},
	{
		kind: "selected-keys",
		read: (e) => ya(e, vn)
	},
	{
		kind: Ye,
		read: (e) => ya(e, Le)
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
function ya(e, t) {
	let n = e.getAttribute(t);
	return n === null ? null : JSON.parse(n);
}
function ba(e) {
	if (e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio")) {
		e.checked = !1;
		return;
	}
	(e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement || e instanceof HTMLSelectElement) && (e.value = "");
}
//#endregion
//#region src/interactions/caret-fields.ts
var xa = /* @__PURE__ */ new Set([
	"text",
	"search",
	"number",
	"password",
	"email",
	"url",
	"tel"
]);
function Sa(e) {
	return e instanceof HTMLInputElement && xa.has(e.type);
}
function Ca(e) {
	return Sa(e) || e instanceof HTMLTextAreaElement;
}
//#endregion
//#region src/interactions/draft-events.ts
var wa = "ui-draft-dropped";
function Ta(e) {
	e.dispatchEvent(new Event(wa, { bubbles: !0 }));
}
//#endregion
//#region src/interactions/roving-focus.ts
function Ea(e) {
	let t = Aa(e.key), n = ja(e.key, e.axis);
	if (t === null && n === 0) return null;
	let r = e.items.filter(ka);
	if (r.length === 0) return null;
	if (t !== null) return t === "first" ? r[0] : r[r.length - 1];
	let i = e.current === null ? -1 : r.indexOf(e.current);
	if (i === -1) return n > 0 ? r[0] : r[r.length - 1];
	let a = i + n;
	return a >= 0 && a < r.length ? r[a] : e.loop ?? !0 ? r[(a + r.length) % r.length] : null;
}
function Da(e, t) {
	return Aa(e) !== null || ja(e, t) !== 0;
}
var Oa = {
	target: Ea,
	applyTabIndex: D
};
function D(e, t) {
	for (let n of e) n.tabIndex = n === t ? 0 : -1;
}
function ka(e) {
	return e.getClientRects().length > 0 && !w(e);
}
function Aa(e) {
	return e === "Home" ? "first" : e === "End" ? "last" : null;
}
function ja(e, t) {
	return t !== "horizontal" && (e === "ArrowDown" || e === "ArrowUp") ? e === "ArrowDown" ? 1 : -1 : t !== "vertical" && (e === "ArrowRight" || e === "ArrowLeft") ? e === "ArrowRight" ? 1 : -1 : 0;
}
//#endregion
//#region src/interactions/selected-key.ts
function Ma(e, t, n) {
	t.length !== 0 && e.getAttribute(n.attribute) !== t && (e.setAttribute(n.attribute, t), n.apply(e), e.hasAttribute(n.bindingAttribute) && e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/row-selection.ts
var Na = "data-ui-bind-selected-keys", Pa = ".ui-items-view, .ui-table, .ui-tree", Fa = `.ui-items-view__item, .${It}, .ui-tree__row`, Ia = {
	shift: !1,
	ctrl: !1
}, La = /* @__PURE__ */ new WeakMap();
function Ra(e, t) {
	t !== null && !La.has(e) && za(e, t);
}
function za(e, t) {
	let n = k(t);
	n.length > 0 && La.set(e, n);
}
function Ba(e) {
	return {
		shift: e.shiftKey,
		ctrl: e.ctrlKey || e.metaKey
	};
}
function Va(e, t) {
	let n = Ba(t);
	return n.shift && e.hasAttribute("data-ui-no-row-select") ? {
		shift: !0,
		ctrl: !0
	} : n;
}
function Ha(e) {
	return !e.hasAttribute(Kt);
}
function O(e) {
	if (e.getClientRects().length > 0) return e;
	let t = e.querySelector(`:scope > [${m}]`);
	return t !== null && t.getClientRects().length > 0 ? t : null;
}
function Ua(e) {
	switch (e.getAttribute(hn)) {
		case "one": {
			let t = e.getAttribute(_n);
			return new Set(t === null || t.length === 0 ? [] : [t]);
		}
		case "many": return new Set(Za(Qa(e)));
		default: return /* @__PURE__ */ new Set();
	}
}
function Wa(e, t) {
	let n = Ua(e), r = e.getAttribute(hn), i = r === "one" || r === "many";
	for (let e of t) {
		let t = n.has(k(e));
		e.toggleAttribute(gn, t), i ? e.setAttribute("aria-selected", t ? "true" : "false") : e.removeAttribute("aria-selected");
	}
}
function Ga(e) {
	return e.filter((e) => e.hasAttribute(gn));
}
function Ka(e, t, n, r) {
	let i = k(n);
	if (!Ya(n)) return !1;
	switch (e.getAttribute(hn)) {
		case "one": return Ma(e, i, {
			attribute: _n,
			bindingAttribute: yn,
			apply: (e) => Wa(e, t)
		}), !0;
		case "many": return qa(e, t, n, i, r), !0;
		default: return !1;
	}
}
function qa(e, t, n, r, i) {
	let a = Qa(e);
	if (a === null) return;
	let o = Za(a), s;
	if (i.shift) {
		let r = Xa(t, t.find((t) => k(t) === La.get(e)) ?? n, n).map(k);
		s = i.ctrl ? [...o.filter((e) => !r.includes(e)), ...r] : r;
	} else i.ctrl ? (s = o.includes(r) ? o.filter((e) => e !== r) : [...o, r], La.set(e, r)) : (s = [r], La.set(e, r));
	Ja(e, t, s);
}
function Ja(e, t, n) {
	let r = Qa(e);
	if (r === null) return;
	let i = JSON.stringify(n);
	r.getAttribute("data-ui-selected-keys") !== i && (r.setAttribute(vn, i), Wa(e, t), r.hasAttribute(Na) && r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function Ya(e) {
	return k(e).length > 0 && !e.hasAttribute("data-ui-unselectable") && !T(e);
}
function Xa(e, t, n) {
	let r = e.indexOf(t), i = e.indexOf(n);
	return r < 0 || i < 0 ? [n] : e.slice(Math.min(r, i), Math.max(r, i) + 1).filter((e) => O(e) !== null && Ya(e));
}
function Za(e) {
	let t = e?.getAttribute("data-ui-selected-keys") ?? null;
	if (t === null || t.length === 0) return [];
	try {
		let e = JSON.parse(t);
		return Array.isArray(e) ? e.filter((e) => typeof e == "string") : [];
	} catch {
		return [];
	}
}
function Qa(e) {
	for (let t of e.querySelectorAll(`[${g}]`)) if (t.closest(".ui-items-view, .ui-table, .ui-tree") === e) return t;
	return null;
}
function k(e) {
	return e.getAttribute("data-ui-key") ?? "";
}
var $a = {
	isSelected: (e) => e.hasAttribute(gn),
	toggle: eo,
	setSelected: to,
	setSelectedKeys: no
};
function eo(e) {
	let t = e.closest(Pa);
	t !== null && e instanceof HTMLElement && Ka(t, ro(t), e, {
		shift: !1,
		ctrl: !0
	});
}
function to(e, t, n) {
	let r = [];
	for (let e of t) e.classList.contains("ui-hidden") || r.push(k(e));
	no(e, r, n);
}
function no(e, t, n) {
	if (!(e instanceof HTMLElement)) return;
	let r = ro(e), i = new Set(r.filter((e) => !Ya(e)).map(k)), a = /* @__PURE__ */ new Set();
	for (let e of t) e.length > 0 && !i.has(e) && a.add(e);
	let o = [...Ua(e)].filter((e) => !a.has(e));
	Ja(e, r, n ? [...o, ...a] : o);
}
function ro(e) {
	return [...e.querySelectorAll(Fa)].filter((t) => t.closest(Pa) === e);
}
//#endregion
//#region src/interactions/row-cursor.ts
function io(e) {
	let t = e.closest(Pa);
	if (t === null) return null;
	if (e === t) return {
		root: t,
		row: null
	};
	let n = e.closest(Fa);
	return n !== null && n.closest(".ui-items-view, .ui-table, .ui-tree") === t ? {
		root: t,
		row: n
	} : null;
}
function ao(e) {
	return e.filter((e) => O(e) !== null && !T(e));
}
function oo(e) {
	return so(e) ?? ao(e)[0] ?? null;
}
function so(e) {
	return e.find((e) => e.hasAttribute("data-ui-row-focus")) ?? e.find((e) => e.hasAttribute("data-ui-selected") && !T(e)) ?? null;
}
function co(e, t, n) {
	for (let e of t) e !== n && e.removeAttribute(Ce);
	n.setAttribute(Ce, ""), e.setAttribute("aria-activedescendant", Gn(n, "ui-row")), (O(n) ?? n).scrollIntoView({ block: "nearest" });
}
function lo(e, t, n, r) {
	if (!Da(e, r === "grid" ? "both" : r)) return null;
	let i = ao(t);
	if (r === "grid" && (e === "ArrowUp" || e === "ArrowDown")) return uo(i, n, e === "ArrowDown");
	let a = i.map((e) => O(e) ?? e), o = Ea({
		key: e,
		items: a,
		current: n === null ? null : O(n),
		axis: r === "grid" ? "horizontal" : r,
		loop: !1
	});
	return o === null ? null : i[a.indexOf(o)] ?? null;
}
function uo(e, t, n) {
	let r = t === null ? null : O(t);
	if (r === null) return (n ? e[0] : e[e.length - 1]) ?? null;
	let i = r.getBoundingClientRect(), a = fo(i), o = e.map((e) => ({
		row: e,
		rect: (O(e) ?? e).getBoundingClientRect()
	})).filter(({ rect: e }) => n ? e.top >= i.bottom - .5 : e.bottom <= i.top + .5);
	if (o.length === 0) return null;
	let s = o.reduce((e, t) => (n ? t.rect.top < e.rect.top : t.rect.bottom > e.rect.bottom) ? t : e);
	return o.filter(({ rect: e }) => n ? e.top < s.rect.bottom - .5 : e.bottom > s.rect.top + .5).reduce((e, t) => Math.abs(fo(t.rect) - a) < Math.abs(fo(e.rect) - a) ? t : e).row;
}
function fo(e) {
	return e.left + e.width / 2;
}
function po(e, t, n) {
	(e.hasAttribute("data-ui-id") ? e : e.querySelector(":scope > [data-ui-id]") ?? e).dispatchEvent(n === void 0 ? new Event(t, { bubbles: !0 }) : new CustomEvent(t, {
		bubbles: !0,
		detail: n
	}));
}
function mo(e, t, n) {
	let r = n.hasAttribute(Ce), i = n.contains(document.activeElement);
	if (!r && !i) return null;
	let a = t.indexOf(n), o = t.filter((e) => e !== n);
	return () => {
		if (i && e.focus({ preventScroll: !0 }), !r) return;
		let n = ao(o), s = a < 0 || n.length === 0 ? null : n.find((e) => t.indexOf(e) > a) ?? n[n.length - 1];
		s !== null && co(e, o, s);
	};
}
//#endregion
//#region src/interactions/popup-focus.ts
var ho = [
	"a[href]",
	"button:not([disabled])",
	"input:not([disabled])",
	"select:not([disabled])",
	"textarea:not([disabled])",
	"[tabindex]:not([tabindex=\"-1\"])"
].join(","), go = /* @__PURE__ */ new Set([
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
]), _o = !1, vo = null, yo = /* @__PURE__ */ new Set(), bo = /* @__PURE__ */ new WeakSet();
typeof window < "u" && (window.addEventListener("pointerdown", (e) => xo(e.target), !0), window.addEventListener("keydown", (e) => So(e), !0), window.addEventListener("focusin", (e) => Co(e.target), !0), window.addEventListener("focusout", (e) => Do(e.target, !1), !0));
function xo(e) {
	_o = !0;
	let t = document.activeElement;
	vo = t, t instanceof Element && t !== document.body && e instanceof Node && t.contains(e) && Do(t, !wo(t));
}
function So(e) {
	if (!(e instanceof KeyboardEvent && go.has(e.key))) {
		_o = !1;
		for (let e of [...yo]) Do(e, !1);
	}
}
function Co(e) {
	_o && !wo(e) && Do(e, !0);
}
function wo(e) {
	return Ca(e) ? !e.readOnly && !e.disabled : e instanceof HTMLElement && (e.isContentEditable || e.getAttribute("role") === "spinbutton" && e.getAttribute("aria-readonly") !== "true");
}
function To() {
	return _o && vo instanceof HTMLElement && vo !== document.body ? vo : null;
}
function Eo() {
	return _o;
}
function Do(e, t) {
	e instanceof Element && (t ? yo.add(e) : yo.delete(e), e.hasAttribute("data-ui-pointer-focus") !== t && e.toggleAttribute(mn, t));
}
function A(e) {
	e.focus({ preventScroll: !0 });
}
function Oo(e) {
	Do(e, !0), e.focus({ preventScroll: !0 });
}
function ko(e) {
	for (let t of e.querySelectorAll(ho)) if (oa(t)) return t;
	return null;
}
function Ao(e, t) {
	let n = [...e.querySelectorAll(ho)].filter((e) => oa(e) || e === t), r = /* @__PURE__ */ new Map();
	for (let e of n) {
		let t = jo(e);
		if (t === null) continue;
		let n = r.get(t);
		(n === void 0 || !Mo(n) && Mo(e)) && r.set(t, e);
	}
	return n.filter((e) => {
		let t = jo(e);
		return t === null || r.get(t) === e;
	});
}
function jo(e) {
	return e instanceof HTMLInputElement && e.type === "radio" && e.name !== "" ? e.name : null;
}
function Mo(e) {
	return e instanceof HTMLInputElement && e.checked;
}
function No(e, t, n, r) {
	let i = t[0], a = t[t.length - 1];
	return n === null || !e.contains(n) ? r ? a : i : !r && Po(n, a) ? i : r && Po(n, i) ? a : null;
}
function Po(e, t) {
	return e === t || jo(e) !== null && jo(e) === jo(t);
}
var Fo = `.${jn}, .${Mn}, [${Nn}]`;
function Io(e) {
	let t = io(e)?.root ?? null;
	for (let n = e.parentElement; n !== null; n = n.parentElement) if ((n === t || n.matches(Fo)) && n.hasAttribute("tabindex") && oa(n)) return n;
	return null;
}
function Lo(e, t) {
	if (e.contains(document.activeElement)) return null;
	let n = document.activeElement instanceof HTMLElement ? document.activeElement : null, r = t ?? ko(e);
	return _o ? bo.add(e) : bo.delete(e), r === null && !e.hasAttribute("tabindex") && (e.tabIndex = -1), A(r ?? e), n;
}
function Ro(e, t) {
	e.scrollTop = 0, e.scrollLeft = 0;
	let n = t ?? ko(e);
	return n !== null && zo(e, n), Lo(e, n);
}
function zo(e, t) {
	let n = e.getBoundingClientRect().top + e.clientTop, r = n + e.clientHeight, i = t.getBoundingClientRect();
	i.bottom > r && (e.scrollTop += Math.min(i.bottom - r, i.top - n));
}
function Bo(e, t, n = !1) {
	if (_o) {
		D(t, null), e.hasAttribute("tabindex") || (e.tabIndex = -1), A(e);
		return;
	}
	let r = t.filter(ka), i = (n ? r[r.length - 1] : r[0]) ?? null;
	i !== null && (D(t, i), A(i));
}
function Vo(e, t = document) {
	let n = e == null ? null : e.isConnected ? e : Ho(e, t);
	for (let e = n; e !== null; e = e.parentElement) if (e.matches(`${ho}, [tabindex]`) && oa(e)) return e;
	return n === null ? null : Uo(n);
}
function Ho(e, t) {
	for (let n = e.closest(v); n !== null; n = n.parentElement?.closest(v) ?? null) {
		let e = t.querySelectorAll(`[${m}="${n.getAttribute(m)}"]`);
		if (e.length === 1) return e[0];
	}
	return null;
}
function Uo(e) {
	for (let t = e.closest(v); t !== null; t = t.parentElement?.closest(v) ?? null) if (oa(t)) {
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
function Wo(e, t) {
	let n = document.activeElement;
	e == null || !t.contains(n) || (Go(n, t) && Do(e, !wo(e)), A(e));
}
function Go(e, t) {
	for (let n = e; n !== null; n = n === t ? null : n.parentElement ?? null) if (bo.has(n)) return !0;
	return !1;
}
//#endregion
//#region src/updates/value-binding-engine.ts
var Ko = "data-ui-clear", qo = ["change", "toggle"], Jo = [
	...qo,
	"expand",
	"collapse",
	"open",
	"close"
];
function Yo(e) {
	let t = Xn(e);
	return t === "TwoWay" || t === "OneWayToSource" || t === "OnSubmit";
}
function Xo(e) {
	return Xn(e) === "OnSubmit";
}
function Zo(e, t) {
	let n = e.getAttribute(Me);
	if (n !== null) {
		let e = t.getBindingById(Number(n));
		return {
			bindingId: n,
			binding: e,
			buffered: e !== void 0 && Xo(e.mode)
		};
	}
	for (let n of e.getAttributeNames()) {
		if (!n.startsWith("data-ui-bind-")) continue;
		let r = e.getAttribute(n) ?? "", i = t.getBindingById(Number(r));
		if (i !== void 0 && Yo(i.mode)) return {
			bindingId: r,
			binding: i,
			buffered: Xo(i.mode)
		};
	}
	return null;
}
var Qo = class {
	options;
	root;
	pendingSyncByComponent = /* @__PURE__ */ new WeakMap();
	bufferedElements = /* @__PURE__ */ new Set();
	unanswered = /* @__PURE__ */ new Map();
	sends = 0;
	constructor(e) {
		this.options = e, this.root = e.root ?? document;
		for (let e of qo) this.root.addEventListener(e, (e) => {
			this.handleValueEventAsync(e).catch((e) => {
				c("value binding engine failed.", e);
			});
		}, !0);
		this.root.addEventListener("input", (e) => this.holdEdited(e), !0), this.root.addEventListener(wa, (e) => this.releaseDropped(e)), this.root.addEventListener("click", (e) => this.handleClear(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${Ko}]`) !== null && e.preventDefault();
		}, !0);
	}
	holdEdited(e) {
		!(e.target instanceof Element) || this.bufferedElements.has(e.target) || !e.target.hasAttribute("data-ui-form-id") || Zo(e.target, this.options.metadata)?.buffered === !0 && this.bufferValue(e.target);
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
		let t = e.target.closest(`[${Ko}]`);
		if (t === null) return;
		let n = t.closest(v), r = n?.querySelector("[data-ui-bind-value]") ?? n?.querySelector("input, textarea, select");
		r == null || $o(r) || (ba(r), r.dispatchEvent(new Event("change", { bubbles: !0 })), Ca(r) && document.activeElement !== r && A(r));
	}
	async handleValueEventAsync(e) {
		if (!(e.target instanceof Element) || e.type === "change" && (E(e.target) || w(e.target))) return;
		let t = Zo(e.target, this.options.metadata);
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
			let r = Zo(n, this.options.metadata);
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
		if (i === void 0 || !Yo(i.mode) || Xo(i.mode)) return;
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
function $o(e) {
	return e.matches(":disabled") || (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.readOnly;
}
//#endregion
//#region src/events/command-turns.ts
var es = class {
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
}, ts = class {
	catalog;
	registrations = /* @__PURE__ */ new Map();
	attachedEvents = /* @__PURE__ */ new Set();
	constructor(e) {
		this.catalog = e;
	}
	add(e, t = {}) {
		let n = x(e);
		if (n.length === 0) throw Error("Event name is required.");
		let r = x(t.domEventName) || this.catalog.get(n)?.domEventName || n, i = {
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
		return this.registrations.get(x(e));
	}
	markAttached(e) {
		let t = x(e);
		return !this.attachedEvents.has(t) && (this.attachedEvents.add(t), !0);
	}
}, ns = class {
	create(e, t) {
		return e.createRequest === void 0 ? t.metadata === void 0 ? null : {
			eventId: b(t.metadata.eventId),
			dynamicParameters: [...t.dynamicParameters]
		} : e.createRequest(t);
	}
}, rs = {
	dispatched: !1,
	success: !1
}, is = class extends Error {
	reason;
	constructor(e) {
		super(String(e)), this.reason = e;
	}
}, as = class {
	options;
	root;
	registry;
	requestFactory = new ns();
	turns = new es();
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.registry = new ts(e.eventCatalog), this.addEvent("click");
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
		if (r === null || ss(t, r.element)) return;
		let i = t.target.closest(`[${Pe}]`);
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
			let t = e instanceof is, r = t ? e.reason : e;
			throw n.completed?.({
				...o,
				dispatched: t,
				success: !1,
				error: String(r)
			}), r;
		}
	}
	async runAsync(e, t, n, r) {
		if (r.domEvent.target instanceof Element && w(r.domEvent.target)) return rs;
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
		if (this.options.dispatcher.isPending(i)) return r.domEvent.preventDefault(), rs;
		let a = this.turns.take();
		try {
			return await this.sendInTurnAsync(e, t, n, r, i, a);
		} finally {
			a.done();
		}
	}
	async sendInTurnAsync(e, t, n, r, i, a) {
		let o = n.getAttribute("data-ui-submit-form-id") ?? (t.submitsForm === !0 ? cs(r) : null);
		if (o !== null) {
			if (this.options.validationEngine?.runSubmitValidation(o) === !1) return r.domEvent.preventDefault(), rs;
			await this.options.valueBinding?.submitFormAsync(o);
		}
		if (await this.isRefusedValueEventAsync(t, n) || (await a.ahead, await this.options.valueBinding?.whenSent(), this.options.dispatcher.isPending(i))) return rs;
		this.options.interactionEngine.applyEvent({
			name: `before-${e}`,
			componentId: r.componentId,
			dynamicParameters: r.dynamicParameters,
			domEvent: r.domEvent
		});
		let s = this.options.dispatcher.dispatchAsync(i);
		a.done();
		let c = await s.catch((t) => {
			throw this.applyAfterEvent(e, r), new is(t);
		});
		return this.options.effects.applyAll(c.command?.effects, this.options.dom), this.options.afterEffects?.(), this.applyAfterEvent(e, r), {
			dispatched: !0,
			success: c.command?.success !== !1,
			error: c.command?.error ?? null
		};
	}
	async isRefusedValueEventAsync(e, t) {
		return !Jo.includes(e.name) && e.settlesValue !== !0 ? !1 : (await this.options.valueBinding?.whenSettled(t), this.options.validationEngine?.isRefused(t) === !0);
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
		return n.hasAttribute(Ne(e)) ? !1 : this.options.metadata.hasServerEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(e, t) || this.options.interactionEngine.hasEventForComponent(`before-${e}`, t) || this.options.interactionEngine.hasEventForComponent(`after-${e}`, t);
	}
	applyDomPolicy(e, t) {
		os(e.preventDefault, t) && t.domEvent.preventDefault(), os(e.stopPropagation, t) && t.domEvent.stopPropagation();
	}
};
function os(e, t) {
	return e === void 0 ? !1 : typeof e == "function" ? e(t) : e;
}
function ss(e, t) {
	if (e.type !== "mouseenter" && e.type !== "mouseleave") return !1;
	let n = e.relatedTarget;
	return n instanceof Node && t.contains(n);
}
function cs(e) {
	let t = e.domEvent.target;
	return ((t instanceof Element ? t.closest("[data-ui-form-id]") : null) ?? e.component.querySelector("[data-ui-form-id]"))?.getAttribute("data-ui-form-id") ?? null;
}
//#endregion
//#region src/state/value-equality.ts
function ls(e, t) {
	return Object.is(e, t) ? !0 : e === null || t === null || e === void 0 || t === void 0 ? !1 : e instanceof Date || t instanceof Date ? e instanceof Date && t instanceof Date && e.getTime() === t.getTime() : typeof e != "object" || typeof t != "object" ? !1 : Array.isArray(e) || Array.isArray(t) ? Array.isArray(e) && Array.isArray(t) && us(e, t) : ds(e, t);
}
function us(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0; n < e.length; n++) if (!ls(e[n], t[n])) return !1;
	return !0;
}
function ds(e, t) {
	let n = Object.keys(e);
	if (n.length !== Object.keys(t).length) return !1;
	for (let r of n) if (!Object.hasOwn(t, r) || !ls(e[r], t[r])) return !1;
	return !0;
}
//#endregion
//#region src/interactions/interaction-engine.ts
var fs = class {
	index;
	propertyPatchEngine;
	evaluator;
	options;
	applyDepth = 0;
	heard = /* @__PURE__ */ new Map();
	constructor(e, t, n, r) {
		this.index = e, this.propertyPatchEngine = t, this.evaluator = n, this.options = r, this.propertyPatchEngine.addValueChangeHandler((e) => this.applyPropertyInteractions(e));
		let i = r.root ?? document;
		for (let e of qo) i.addEventListener(e, (e) => this.applyEditedValue(e), !0);
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
		let n = Zo(e.target, this.options.metadata), r;
		if (n === null) r = this.index.getValueInteractions(t.componentId);
		else if (n.binding === void 0) return;
		else r = this.index.getPropertyInteractions(b(n.binding.componentId), n.binding.propertyId);
		if (r.length === 0) return;
		let i = this.options.valueReaders.readBound(e.target), a = ms(r[0].source, t.dynamicParameters);
		if (!(this.heard.has(a) && ls(this.heard.get(a), i))) {
			this.heard.set(a, i);
			for (let e of r) this.applyInteraction(e, t.dynamicParameters, !0, i);
		}
	}
	applyPropertyInteractions(e) {
		if (this.applyDepth > 8) {
			s("interaction chain depth limit exceeded.", {
				componentId: b(e.reference.componentId),
				propertyId: e.reference.propertyId
			});
			return;
		}
		let t = this.index.getPropertyInteractions(b(e.reference.componentId), e.reference.propertyId);
		t.length > 0 && this.heard.set(ms(e.reference, e.dynamicParameters), e.value);
		for (let n of t) this.applyInteraction(n, e.dynamicParameters, !1, e.value);
	}
	applyInteraction(e, t, n, r = !0) {
		if (Qn(e.actionKind) === "Effect") {
			this.applyEffectInteraction(e, t, r);
			return;
		}
		let i = e.target;
		if (!hs(i)) return;
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
			effect: ps(r, t, this.options.dom),
			dom: this.options.dom,
			row: t
		});
	}
};
function ps(e, t, n) {
	if (t.length === 0) return e;
	let r = e.target;
	if (r === void 0 || (r.dynamicParameters?.length ?? 0) > 0) return e;
	let i = b(r.id);
	for (let a = t.length; a >= 0; a--) {
		let o = t.slice(0, a), s = n.findComponent(i, o);
		if (s !== null && xr(s, o)) return a === 0 ? e : {
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
function ms(e, t) {
	return JSON.stringify([
		b(e?.componentId),
		e?.propertyId ?? "",
		...t.map((e) => String(e ?? ""))
	]);
}
function hs(e) {
	return e != null && e.propertyId.length > 0;
}
//#endregion
//#region src/interactions/interaction-evaluator.ts
var gs = class {
	evaluate(e, t) {
		return this.matches(e, t) ? e.trueValue : e.falseValue;
	}
	matches(e, t) {
		return _s(t, e.operator, e.value);
	}
};
function _s(e, t, n) {
	let r = vs(e), i = vs(n);
	switch ($n(t)) {
		case "Required": return r != null && r !== !1 && String(r).trim().length > 0;
		case "Equal": return String(r ?? "") === String(i ?? "");
		case "NotEqual": return String(r ?? "") !== String(i ?? "");
		case "Greater": return ys(r, i, (e) => e > 0);
		case "GreaterOrEqual": return ys(r, i, (e) => e >= 0);
		case "Less": return ys(r, i, (e) => e < 0);
		case "LessOrEqual": return ys(r, i, (e) => e <= 0);
		case "Like": return String(r ?? "").includes(String(i ?? ""));
		case "LikeIgnoreCase": return String(r ?? "").toLocaleLowerCase().includes(String(i ?? "").toLocaleLowerCase());
		case "In": return Array.isArray(i) && i.some((e) => String(e ?? "") === String(r ?? ""));
		case "Regex": return bs(r, i);
		default: return !1;
	}
}
function vs(e) {
	return Ei(e) ? e.key : Di(e) ? e.text : e;
}
function ys(e, t, n) {
	let r = Number(e), i = Number(t);
	return !Number.isNaN(r) && !Number.isNaN(i) ? n(r < i ? -1 : +(r > i)) : !Number.isNaN(r) || !Number.isNaN(i) || typeof e != "string" || typeof t != "string" ? !1 : n(e < t ? -1 : +(e > t));
}
function bs(e, t) {
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
var xs = "Value", Ss = class {
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
		return this.eventNames.has(x(e));
	}
	getSourceEventNames() {
		let e = /* @__PURE__ */ new Set();
		for (let t of this.eventNames) Ts(t) || e.add(t);
		return e;
	}
	hasEventForComponent(e, t) {
		return this.eventComponentIdsByName.get(x(e))?.has(t) === !0;
	}
	getEventInteractions(e, t) {
		return this.eventInteractions.get(Es(e, t)) ?? [];
	}
	getPropertyInteractions(e, t) {
		return this.propertyInteractions.get(Ds(e, t)) ?? [];
	}
	getValueInteractions(e) {
		return this.valueInteractions.get(e) ?? [];
	}
	addInteraction(e) {
		if (Cs(e)) {
			let t = b(e.sourceEvent?.componentId), n = x(e.sourceEvent?.eventName);
			if (t > 0 && n.length > 0) {
				let r = this.eventInteractions.get(Es(t, n));
				r === void 0 && (r = [], this.eventInteractions.set(Es(t, n), r)), r.push(e), this.eventNames.add(n);
				let i = this.eventComponentIdsByName.get(n);
				i === void 0 && (i = /* @__PURE__ */ new Set(), this.eventComponentIdsByName.set(n, i)), i.add(t);
			}
			return;
		}
		if (ws(e)) {
			let t = b(e.source?.componentId), n = e.source?.propertyId ?? "";
			if (t > 0 && n.length > 0) {
				let r = this.propertyInteractions.get(Ds(t, n));
				if (r === void 0 && (r = [], this.propertyInteractions.set(Ds(t, n), r)), r.push(e), this.metadata.getPropertyDefinition(n)?.propertyName === xs) {
					let n = this.valueInteractions.get(t) ?? [];
					n.push(e), this.valueInteractions.set(t, n);
				}
			}
		}
	}
};
function Cs(e) {
	return Zn(e.sourceKind) === "Event";
}
function ws(e) {
	return Zn(e.sourceKind) === "Property";
}
function Ts(e) {
	return e.startsWith("before-") || e.startsWith("after-");
}
function Es(e, t) {
	return `${e}:${x(t)}`;
}
function Ds(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/rendering/motion.ts
var Os = {
	fast: 120,
	normal: 200,
	ripple: 250,
	ease: "cubic-bezier(0.4, 0, 0.2, 1)",
	enter: "cubic-bezier(0, 0, 0.2, 1)",
	exit: "cubic-bezier(0.4, 0, 1, 1)"
};
function ks() {
	return typeof matchMedia == "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function As(e) {
	if (typeof e.getAnimations == "function") for (let t of e.getAnimations()) typeof CSSTransition == "function" && t instanceof CSSTransition && t.finish();
}
//#endregion
//#region src/interactions/anchored-popup.ts
var js = /* @__PURE__ */ new Set([
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
function Ms(e) {
	return js.has(e);
}
var Ns = 4, Ps = 12, Fs = /* @__PURE__ */ new Map(), Is = !1, Ls = null, Rs = /* @__PURE__ */ new WeakMap(), zs = "data-ui-popup-stood-in";
function Bs(e, t) {
	t === null ? Rs.delete(e) : Rs.set(e, t);
}
var Vs = "--ui-popup-ground";
function Hs(e, t) {
	let n = e.closest("[data-ui-theme]") === t.closest("[data-ui-theme]") ? getComputedStyle(e).getPropertyValue(Vs).trim() : "";
	n.length === 0 ? t.style.removeProperty(Vs) : t.style.setProperty(Vs, n);
}
function Us(e, t, n) {
	Fs.set(t, {
		anchor: e,
		options: n
	}), Ys(), Ls?.observe(t), Gs(t), Zs(e, t, n);
}
var Ws = "data-ui-popup-lifted";
function Gs(e) {
	if (e.hasAttribute(Ws)) {
		e.matches(":popover-open") || e.showPopover();
		return;
	}
	Ks(e) && (e.setAttribute("popover", "manual"), e.setAttribute(Ws, ""), e.showPopover());
}
function Ks(e) {
	for (let t = e.parentElement; t !== null; t = t.parentElement) {
		let e = getComputedStyle(t);
		if (e.transform !== "none" || e.filter !== "none" || e.perspective !== "none") return !0;
	}
	return !1;
}
function qs(e) {
	e.hasAttribute(Ws) && (e.matches(":popover-open") && e.hidePopover(), window.setTimeout(() => {
		e.matches(":popover-open") || Fs.has(e) || (e.removeAttribute("popover"), e.removeAttribute(Ws));
	}, Os.fast));
}
function Js(e) {
	e != null && (Fs.delete(e), Ls?.unobserve(e), qs(e));
}
function Ys() {
	Is || (Is = !0, document.addEventListener("scroll", Xs, !0), window.addEventListener("resize", Xs), Ls = new ResizeObserver((e) => {
		for (let t of e) {
			if (!(t.target instanceof HTMLElement)) continue;
			let e = Fs.get(t.target);
			e !== void 0 && Zs(e.anchor, t.target, e.options);
		}
	}));
}
function Xs() {
	for (let [e, t] of Fs) {
		if (!e.isConnected) {
			Js(e);
			continue;
		}
		Zs(t.anchor, e, t.options);
	}
}
function Zs(e, t, n) {
	if (!e.isConnected) return;
	let r = Qs(e), i = r !== e;
	t.hasAttribute(zs) !== i && t.toggleAttribute(zs, i), n.minAnchorWidth === !0 && (t.style.minWidth = `${r.getBoundingClientRect().width}px`);
	let a = r.getBoundingClientRect(), o = (r === e ? n.crossAnchor ?? r : r).getBoundingClientRect(), s = t.getBoundingClientRect(), c = tc(a, s, n), l = lc(a, o, s, c, n.gap), u = uc(a, o, s, c, n.gap);
	n.arrow === !0 && (ac(c) ? u = $s(u, o.left + o.width / 2, s.width) : l = $s(l, o.top + o.height / 2, s.height)), l = fc(l, s.height, window.innerHeight), u = fc(u, s.width, window.innerWidth), t.style.top = `${l}px`, t.style.left = `${u}px`, t.dataset.uiPlacement !== c && (t.dataset.uiPlacement = c), ec(t, o, s, c, l, u);
}
function Qs(e) {
	for (let t = e; t !== null; t = t.parentElement) {
		if (t.hasAttribute(zs)) return e;
		let n = Rs.get(t);
		if (n !== void 0) return n;
	}
	return e;
}
function $s(e, t, n) {
	let r = t - e;
	return r < Ps ? e - (Ps - r) : r > n - Ps ? e + (r - (n - Ps)) : e;
}
function ec(e, t, n, r, i, a) {
	let o = ac(r), s = o ? t.left + t.width / 2 - a : t.top + t.height / 2 - i, c = o ? n.width : n.height;
	e.style.setProperty("--ui-popup-arrow", `${Math.max(Ps, Math.min(s, c - Ps))}px`);
}
function tc(e, t, n) {
	let r = n.placement, i = sc(r);
	if (nc(e, t, r, n.gap)) return r;
	if (nc(e, t, i, n.gap)) return i;
	for (let i of rc(r)) if (nc(e, t, i, n.gap)) return i;
	return oc(e, i) > oc(e, r) ? i : r;
}
function nc(e, t, n, r) {
	return oc(e, n) >= ic(t, n) + r;
}
function rc(e) {
	return e.startsWith("bottom") ? ["right-start", "left-start"] : e.startsWith("top") ? ["right-end", "left-end"] : e.startsWith("right") ? ["bottom-start", "top-start"] : ["bottom-end", "top-end"];
}
function ic(e, t) {
	return ac(t) ? e.height : e.width;
}
function ac(e) {
	return e.startsWith("top") || e.startsWith("bottom");
}
function oc(e, t) {
	return t.startsWith("top") ? e.top : t.startsWith("bottom") ? window.innerHeight - e.bottom : t.startsWith("left") ? e.left : window.innerWidth - e.right;
}
function sc(e) {
	return e.startsWith("top") ? `bottom${cc(e)}` : e.startsWith("bottom") ? `top${cc(e)}` : e.startsWith("left") ? `right${cc(e)}` : `left${cc(e)}`;
}
function cc(e) {
	let t = e.indexOf("-");
	return t === -1 ? "" : e.slice(t);
}
function lc(e, t, n, r, i) {
	return r.startsWith("top") ? e.top - i - n.height : r.startsWith("bottom") ? e.bottom + i : dc(t.top, t.height, n.height, r);
}
function uc(e, t, n, r, i) {
	return r.startsWith("left") ? e.left - i - n.width : r.startsWith("right") ? e.right + i : dc(t.left, t.width, n.width, r);
}
function dc(e, t, n, r) {
	let i = cc(r);
	return i === "-start" ? e : i === "-end" ? e + t - n : e + (t - n) / 2;
}
function fc(e, t, n) {
	return Math.max(Ns, Math.min(e, n - t - Ns));
}
//#endregion
//#region src/interactions/dom-mutations.ts
var pc = 32;
function j(e, t, n, r) {
	if (!(e instanceof Node)) return null;
	let i = new MutationObserver((i) => {
		let a = mc(e, n.relevant === void 0 ? i : i.filter(n.relevant), t);
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
function mc(e, t, n) {
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
		if (r.size > pc) return new Set(e.querySelectorAll(n));
	}
	return r.size === 0 ? null : r;
}
function hc(e, t, n) {
	return (e.target instanceof Element ? e.target : e.target.parentElement)?.closest(`${t}, ${n}`)?.matches(t) === !0;
}
//#endregion
//#region src/interactions/open-dialogs.ts
var gc = "data-ui-dialog";
function _c(e) {
	let t = e.querySelectorAll(`[${gc}]:not([hidden])`);
	return t.length === 0 ? null : t[t.length - 1];
}
function vc(e) {
	let t = _c(e);
	return t !== null && t.hasAttribute("data-ui-dialog-modal") ? t : null;
}
function yc(e) {
	let t = typeof document > "u" ? null : vc(document);
	return t !== null && !t.contains(e);
}
//#endregion
//#region src/interactions/inline-rename.ts
var bc = "data-ui-rename-field";
function xc(e) {
	return e instanceof Element && e.closest(`[${bc}]`) !== null;
}
function Sc(e) {
	let { container: t, title: n } = e;
	if (t.querySelector(`.${e.className}`) !== null) return !1;
	let r = document.createElement("input");
	r.type = "text", r.className = e.className, r.setAttribute(bc, ""), r.value = e.value, Cc(r, n, t);
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
function Cc(e, t, n) {
	let r = t.getBoundingClientRect(), i = n.getBoundingClientRect(), a = getComputedStyle(t), o = n.offsetWidth > 0 && i.width > 0 ? i.width / n.offsetWidth : 1;
	e.style.left = `${(r.left - i.left) / o - n.clientLeft}px`, e.style.top = `${(r.top - i.top) / o - n.clientTop}px`, e.style.width = `${r.width / o}px`, e.style.height = `${r.height / o}px`, e.style.fontFamily = a.fontFamily, e.style.fontSize = a.fontSize, e.style.fontWeight = a.fontWeight, e.style.fontStyle = a.fontStyle, e.style.lineHeight = a.lineHeight, e.style.letterSpacing = a.letterSpacing;
}
//#endregion
//#region src/interactions/popup-dismissal.ts
var wc = /* @__PURE__ */ new Set(), Tc = /* @__PURE__ */ new Map(), Ec = 0, Dc = !1;
function Oc() {
	Dc || (Dc = !0, document.addEventListener("keydown", (e) => {
		!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || xc(e.target) || jc() && e.preventDefault();
	}, !0));
}
function kc() {
	for (let e of wc) for (let t of e.openPopups()) if (t.isConnected && !e.isBehind(t)) return !0;
	return !1;
}
function Ac(e) {
	for (let t of wc) t.hearRefusedClick(e);
}
function jc() {
	let e = [];
	for (let t of wc) for (let n of t.openPopups()) n.isConnected && e.push({
		instance: t,
		popup: n
	});
	let t = new Set(e.map((e) => e.popup));
	for (let e of [...Tc.keys()]) t.has(e) || Tc.delete(e);
	for (let { popup: t } of e) Tc.has(t) || Tc.set(t, ++Ec);
	let n = Mc(e, (e) => Tc.get(e.popup) ?? 0, (e, t) => e.popup.contains(t.popup));
	for (let { instance: e, popup: t } of n) if (e.dismiss(t, "escape")) return !0;
	return !1;
}
function Mc(e, t, n) {
	let r = [...e].sort((e, n) => t(n) - t(e)), i = [];
	for (; r.length > 0;) {
		let e = r.findIndex((e) => !r.some((t) => t !== e && n(e, t)));
		i.push(...r.splice(e, 1));
	}
	return i;
}
var Nc = class {
	options;
	pressedInside = /* @__PURE__ */ new Set();
	constructor(e) {
		this.options = e, document.addEventListener("pointerdown", (e) => this.handlePress(e), !0), document.addEventListener("contextmenu", (e) => this.handleContextMenu(e), !0), e.onPress !== !0 && document.addEventListener("click", (e) => this.handleClick(e), !0), e.onWindowBlur === !0 && window.addEventListener("blur", () => this.dismissAll("blur")), wc.add(this), Oc();
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
		return this.options.isBehind === void 0 ? yc(e) : this.options.isBehind(e);
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
function Pc(e, t) {
	return e.isConnected && !w(e) && !(t && E(e));
}
var Fc = class {
	options;
	entries = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, new Nc({
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
			isBehind: (e) => yc(this.entryOf(e)?.opening.owner ?? e),
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
		!(e.target instanceof Node) || Eo() || t instanceof Element && t.hasAttribute("data-ui-pointer-focus") || (t instanceof Element ? this.leaveFocus(e.target, t) : Ic(e.target) && this.letGo(e.target));
	}
	leaveFocus(e, t) {
		for (let { opening: n } of [...this.entries.values()]) (n.popup.contains(e) || n.owner.contains(e)) && !this.isInside(n, zc(t)) && !yc(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
	}
	letGo(e) {
		let t = Io(e);
		for (let { opening: n } of [...this.entries.values()]) {
			let r = n.popup.contains(e) || n.owner.contains(e), i = t !== null && n.popup.contains(t);
			r && !i && Pc(n.owner, this.closesWhenReadOnly) && !yc(n.owner) && this.options.canDismiss?.(n, "focus") !== !1 && this.close(n.owner, "focus");
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
		if (this.close(e.owner), !Pc(e.owner, this.closesWhenReadOnly)) return !1;
		(this.options.single ?? !0) && this.closeAll();
		let t = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		return this.entries.set(e.owner, {
			opening: e,
			returnFocus: t
		}), this.options.show(e), Bc(e), Vc(e, !0), Wc(this), e.focus !== void 0 && e.focus !== !1 && Lo(e.popup, e.focus === !0 ? null : e.focus), !0;
	}
	get closesWhenReadOnly() {
		return this.options.closesWhenReadOnly ?? !0;
	}
	closeAll() {
		for (let e of [...this.entries.keys()]) this.close(e);
	}
	reposition(e) {
		let t = this.entries.get(e);
		t !== void 0 && Bc(t.opening);
	}
	close(e = this.current, t) {
		let n = e === null ? void 0 : this.entries.get(e);
		if (e === null || n === void 0) return;
		let { opening: r } = n;
		this.entries.delete(e), r.popup.contains(document.activeElement) && Wo(r.returnFocus === void 0 ? n.returnFocus : r.returnFocus(), r.popup), this.options.hide(r, t), Vc(r, !1), Js(r.popup), this.entries.size === 0 && Gc(this);
	}
	closeStranded() {
		for (let [e, { opening: t }] of [...this.entries]) {
			if (Pc(e, this.closesWhenReadOnly)) continue;
			let n = document.activeElement, r = n === null || n === document.body || t.popup.contains(n) || e.contains(n);
			this.close(e, "owner"), r && e.isConnected && !Lc() && Rc(e);
		}
	}
};
function Ic(e) {
	return e instanceof Element && e.isConnected && oa(e) && typeof document.hasFocus == "function" && document.hasFocus();
}
function Lc() {
	let e = document.activeElement;
	return e instanceof Element && e !== document.body && oa(e);
}
function Rc(e) {
	!e.hasAttribute("tabindex") && e.tabIndex < 0 && (e.tabIndex = -1), A(e);
}
function zc(e) {
	let t = [];
	for (let n = e; n !== null; n = n.parentNode) t.push(n);
	return t;
}
function Bc(e) {
	e.anchor !== void 0 && e.placement !== void 0 && Us(e.anchor, e.popup, e.placement);
}
function Vc(e, t) {
	for (let n of e.openers ?? []) n.setAttribute("aria-expanded", t ? "true" : "false");
}
var Hc = /* @__PURE__ */ new Set(), Uc = null;
function Wc(e) {
	Hc.add(e), Uc === null && typeof MutationObserver == "function" && (Uc = new MutationObserver(() => {
		for (let e of [...Hc]) e.closeStranded();
	}), Uc.observe(document, {
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
function Gc(e) {
	Hc.delete(e), !(Hc.size > 0 || Uc === null) && (Uc.disconnect(), Uc = null);
}
//#endregion
//#region src/interactions/flyout-interaction-engine.ts
var Kc = "ui-flyout", qc = "ui-flyout--open", Jc = "ui-flyout__anchor", Yc = "data-ui-flyout-no-backdrop-close", Xc = "data-ui-flyout-no-escape-close", Zc = 4, Qc = `${Kc}--`, $c = "bottom-start", el = class {
	root;
	flyouts = new Fc({
		show: ({ owner: e }) => e.classList.add(qc),
		hide: ({ owner: e }, t) => this.markClosed(e, t !== "owner"),
		single: !1,
		closesWhenReadOnly: !1,
		canDismiss: ({ owner: e }, t) => !e.hasAttribute(t === "escape" ? Xc : Yc)
	});
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Kc}`)) this.place(e);
		j(this.root, `.${Kc}`, { attributeFilter: ["class"] }, (e) => {
			for (let t of e) this.place(t);
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	place(e) {
		let t = e.querySelector(`:scope > .${Mn}`), n = e.querySelector(`:scope > .${Jc}`);
		if (t === null) return;
		let r = tl(n, t);
		if (!e.classList.contains(qc)) {
			this.flyouts.close(e), r?.setAttribute("aria-expanded", "false");
			return;
		}
		this.flyouts.open({
			owner: e,
			popup: t,
			anchor: rl(n) ?? e,
			placement: {
				placement: il(e),
				gap: Zc
			},
			openers: r === null ? [] : [r],
			focus: !0
		}) || this.markClosed(e);
	}
	markClosed(e, t = !0) {
		e.classList.contains(qc) && (e.classList.remove(qc), nl(e, !1, t));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Jc}`)?.closest(`.${Kc}`) ?? null;
		if (t !== null) {
			if (this.flyouts.isOpen(t)) {
				this.flyouts.close(t);
				return;
			}
			t.classList.add(qc), this.place(t), this.flyouts.isOpen(t) && nl(t, !0);
		}
	}
};
function tl(e, t) {
	if (e === null) return null;
	let n = e.querySelector(ho) ?? e;
	return n.setAttribute("aria-haspopup", "dialog"), n.setAttribute("aria-controls", Gn(t, "ui-flyout-content")), n;
}
function nl(e, t, n = !0) {
	e.dispatchEvent(new Event("toggle", { bubbles: !0 })), n && e.dispatchEvent(new Event(t ? "open" : "close", { bubbles: !0 }));
}
function rl(e) {
	if (e === null) return null;
	let t = e.firstElementChild;
	return t instanceof HTMLElement ? t : e;
}
function il(e) {
	for (let t of e.classList) {
		if (!t.startsWith(Qc)) continue;
		let e = t.slice(Qc.length);
		if (Ms(e)) return e;
	}
	return $c;
}
//#endregion
//#region src/interactions/file-drop.ts
var al = "data-ui-file-drop-over", ol = 120, sl = "refused", cl = !1;
function ll(e) {
	let t = {
		marked: /* @__PURE__ */ new Map(),
		leaving: 0
	};
	pl();
	for (let n of [
		"dragenter",
		"dragover",
		"dragleave",
		"drop"
	]) e.root.addEventListener(n, (n) => ul(e, t, n), !0);
	e.root.addEventListener("dragend", () => _l(t.marked), !0), window.addEventListener("blur", () => _l(t.marked)), e.root.addEventListener("paste", (t) => dl(e, t), !0);
}
function ul(e, t, n) {
	if (!(n instanceof DragEvent) || !(n.target instanceof Element)) return;
	let r = t.marked;
	n.type !== "dragleave" && t.leaving !== 0 && (window.clearTimeout(t.leaving), t.leaving = 0);
	let i = e.resolveTarget(n.target);
	if (i === null || !(n.dataTransfer?.types.includes("Files") ?? !1)) {
		i === null && n.type === "dragover" && _l(r);
		return;
	}
	let a = i.mark ?? i.host;
	if (i.refused === !0) {
		ml(n), n.type !== "dragleave" && _l(r);
		return;
	}
	if (n.type === "dragleave") {
		n.relatedTarget instanceof Node ? a.contains(n.relatedTarget) || gl(r, a) : t.leaving = window.setTimeout(() => _l(r), ol);
		return;
	}
	if (n.preventDefault(), n.type !== "drop") {
		let t = hl(i.accept, n.dataTransfer);
		n.dataTransfer !== null && (n.dataTransfer.dropEffect = t ? "none" : "copy");
		for (let e of r.keys()) e !== a && gl(r, e);
		let o = i.mark === void 0 ? e.draggingAttribute : al;
		r.set(a, o), a.setAttribute(o, t ? sl : "");
		return;
	}
	_l(r);
	let o = [...n.dataTransfer?.files ?? []].filter((e) => vl(i.accept, e));
	o.length !== 0 && e.onFiles(i.host, i.multiple ? o : [o[0]]);
}
function dl(e, t) {
	if (!(t instanceof ClipboardEvent) || !(t.target instanceof Element)) return;
	let n = t.clipboardData;
	if (n === null || n.files.length === 0 || n.getData("text/plain").trim().length > 0) return;
	let r = e.resolveTarget(t.target);
	if (r === null || r.refused === !0) return;
	let i = [...n.files].filter((e) => vl(r.accept, e));
	i.length !== 0 && (t.preventDefault(), e.onFiles(r.host, r.multiple ? i : [i[0]]));
}
function fl(e, t, n) {
	for (let r = t.closest(`[${m}]`); r !== null; r = r.parentElement?.closest("[data-ui-id]") ?? null) {
		let t = r.getAttribute("data-ui-id") ?? "", i = [...e.querySelectorAll(`${n}[${sn}="${Hn(t)}"]`)];
		if (i.length > 0) return {
			field: i.find((e) => r.contains(e)) ?? i[0],
			component: r
		};
	}
	return null;
}
function pl() {
	if (!cl) {
		cl = !0;
		for (let e of ["dragover", "drop"]) window.addEventListener(e, (e) => {
			e instanceof DragEvent && !e.defaultPrevented && (e.dataTransfer?.types.includes("Files") ?? !1) && ml(e);
		});
	}
}
function ml(e) {
	e.type !== "dragleave" && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "none"));
}
function hl(e, t) {
	let n = e.split(",").map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0);
	if (t === null || n.length === 0 || n.some((e) => e.startsWith("."))) return !1;
	let r = [...t.items].filter((e) => e.kind === "file").map((e) => e.type.toLowerCase());
	return r.length !== 0 && !r.some((e) => n.some((t) => t.endsWith("/*") ? e.startsWith(t.slice(0, -1)) : e === t));
}
function gl(e, t) {
	let n = e.get(t);
	e.delete(t), n !== void 0 && t.removeAttribute(n);
}
function _l(e) {
	for (let t of [...e.keys()]) gl(e, t);
}
function vl(e, t) {
	if (e.trim().length === 0) return !0;
	let n = t.name.toLowerCase(), r = t.type.toLowerCase();
	return e.split(",").some((e) => {
		let t = e.trim().toLowerCase();
		return t.length === 0 ? !1 : t.startsWith(".") ? n.endsWith(t) : t.endsWith("/*") ? r.startsWith(t.slice(0, -1)) : r === t;
	});
}
//#endregion
//#region src/interactions/file-upload.ts
var yl = "/_ne/files/upload", bl = [
	"kilobyte",
	"megabyte",
	"gigabyte"
], xl = /* @__PURE__ */ new Map(), Sl = !1;
function Cl(e, t, n, r) {
	let i = Number(e.getAttribute(an)), a = [], o = [];
	for (let e of t) !Number.isFinite(i) || i <= 0 || e.size <= i ? a.push(e) : o.push(e);
	if (o.length === 0) return xl.delete(e) && r?.mark(e, null), a;
	if (r === void 0) return s("a chosen file exceeds the input's size limit and was refused.", {
		names: o.map((e) => e.name),
		limit: i
	}), a;
	let c = {
		validation: r,
		limit: i,
		names: n ? o.map((e) => e.name) : null
	};
	return xl.set(e, c), wl(e, c), El(), a;
}
function wl(e, t) {
	let n = Tl(t.limit, C.language);
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
function Tl(e, t) {
	let n = e, r = "byte";
	for (let e of bl) {
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
function El() {
	Sl || (Sl = !0, C.onChange(() => {
		for (let [e, t] of xl) e.isConnected ? wl(e, t) : xl.delete(e);
	}));
}
function Dl(e, t) {
	return new Promise((n, r) => {
		let i = new FormData(), a = performance.now(), o = 0, s = 0;
		for (let t of e) i.append("files", t, t.name), o += t.size, s++;
		let c = new XMLHttpRequest();
		c.open("POST", yl), c.responseType = "json", c.withCredentials = !0, c.upload.addEventListener("progress", (e) => {
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
var Ol = () => {}, kl = { uploadAsync: (e, t) => Dl(e, t ?? Ol) };
function Al(e, t) {
	e !== null && e.value !== t && (e.value = t, e.dispatchEvent(new Event("change", { bubbles: !0 })));
}
//#endregion
//#region src/interactions/picker-events.ts
var jl = "ui-open-picker";
function Ml(e) {
	return !e.dispatchEvent(new Event(jl, {
		bubbles: !0,
		cancelable: !0
	}));
}
function Nl(e, t) {
	if (!(e.target instanceof Element)) return;
	let n = e.target.closest(t.rootSelector);
	if (n === null) return;
	e.preventDefault();
	let r = n.querySelector(t.nativeSelector), i = t.pressed(n);
	r === null || r.disabled || i === null || E(n) || w(i) || r.click();
}
//#endregion
//#region src/interactions/file-input-engine.ts
var Pl = "ui-file-input", Fl = "ui-file-input__row", Il = "ui-file-input__native", Ll = "ui-file-input__field", Rl = "ui-file-input__selection", zl = "data-ui-file-dragging", Bl = class {
	root;
	validation;
	picks = /* @__PURE__ */ new WeakMap();
	shownWords = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, C.onChange(() => this.rewriteShownWords()), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener(jl, (e) => Nl(e, {
			rootSelector: `.${Pl}`,
			nativeSelector: `.${Il}`,
			pressed: (e) => e
		})), this.root.addEventListener("change", (e) => void this.handleSelectionAsync(e), !0), ll({
			root: this.root,
			draggingAttribute: zl,
			resolveTarget: (e) => {
				let t = e.closest(`.${Fl}`)?.closest(`.${Pl}`) ?? null, n = t === null ? fl(this.root, e, `.${Pl}`) : null, r = t ?? n?.field ?? null, i = r?.querySelector(`.${Il}`) ?? null;
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
		let t = e.target.closest(`[${on}], .${Fl}`);
		if (t === null || w(t) || E(t) || !t.hasAttribute("data-ui-file-pick") && e.target.closest("button, a") !== null) return;
		let n = t.closest(`.${Pl}`)?.querySelector(`.${Il}`);
		n == null || n.disabled || n.click();
	}
	async handleSelectionAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Il)) return;
		let t = e.target.closest(`.${Pl}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && await this.takeFilesAsync(t, n);
	}
	async takeFilesAsync(e, t) {
		let n = e.querySelector(`.${Ll}`);
		if (n === null) return;
		if (t.length === 0) {
			this.show(n, ""), this.publishSelection(e, "");
			return;
		}
		let r = Cl(e, t, e.querySelector(`.${Il}`)?.multiple === !0, this.validation);
		if (r.length === 0) return;
		let i = (this.picks.get(e) ?? 0) + 1;
		this.picks.set(e, i);
		try {
			let t = await Dl(r, (t) => {
				this.picks.get(e) === i && this.show(n, () => C.format("ui.file.uploading", { percent: t }));
			});
			if (this.picks.get(e) !== i) return;
			this.show(n, Vl(r)), this.publishSelection(e, t.selectionId);
		} catch (t) {
			if (s("file upload failed.", t), this.picks.get(e) !== i) return;
			this.show(n, () => C.text("ui.file.failed")), this.publishSelection(e, "");
		}
	}
	show(e, t) {
		typeof t == "string" ? this.shownWords.delete(e) : this.shownWords.set(e, t), e.value = typeof t == "string" ? t : t();
	}
	publishSelection(e, t) {
		Al(e.querySelector(`.${Rl}`), t);
	}
};
function Vl(e) {
	return e.length === 1 ? e[0].name : () => C.format("ui.file.count", { count: e.length });
}
//#endregion
//#region src/rendering/file-glyphs.ts
var Hl = "ne-picture-as-pdf", Ul = "ne-text-snippet", Wl = "ne-description", Gl = "ne-table-chart", Kl = "ne-slideshow", ql = "ne-folder-zip", Jl = "ne-audio-file", Yl = "ne-video-file", Xl = "ne-image", Zl = "ne-code", Ql = "ne-draft", $l = new Map([
	...ru(Hl, "pdf"),
	...ru(Ul, "txt", "md", "log"),
	...ru(Wl, "doc", "docx", "odt", "rtf"),
	...ru(Gl, "xls", "xlsx", "ods", "csv", "tsv"),
	...ru(Kl, "ppt", "pptx", "odp", "key"),
	...ru(ql, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
	...ru(Jl, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
	...ru(Yl, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
	...ru(Xl, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
	...ru(Zl, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj", "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]), eu = /* @__PURE__ */ new Map([
	["application/pdf", Hl],
	["text/csv", Gl],
	["application/msword", Wl],
	["application/rtf", Wl],
	["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Wl],
	["application/vnd.oasis.opendocument.text", Wl],
	["application/vnd.ms-excel", Gl],
	["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Gl],
	["application/vnd.oasis.opendocument.spreadsheet", Gl],
	["application/vnd.ms-powerpoint", Kl],
	["application/vnd.openxmlformats-officedocument.presentationml.presentation", Kl],
	["application/vnd.oasis.opendocument.presentation", Kl],
	["application/zip", ql],
	["application/x-zip-compressed", ql],
	["application/x-7z-compressed", ql],
	["application/vnd.rar", ql],
	["application/x-rar-compressed", ql],
	["application/x-tar", ql],
	["application/gzip", ql],
	["application/json", Zl],
	["application/xml", Zl],
	["text/xml", Zl],
	["text/html", Zl]
]), tu = /* @__PURE__ */ new Map([
	["image", Xl],
	["audio", Jl],
	["video", Yl],
	["text", Ul]
]);
function nu(e, t) {
	let n = e.lastIndexOf("."), r = n < 0 ? void 0 : $l.get(e.slice(n + 1).toLowerCase());
	if (r !== void 0) return r;
	let i = t.split(";", 1)[0].trim().toLowerCase(), a = i.indexOf("/");
	return eu.get(i) ?? (a < 0 ? void 0 : tu.get(i.slice(0, a))) ?? Ql;
}
function ru(e, ...t) {
	return t.map((t) => [t, e]);
}
//#endregion
//#region src/rendering/url-safety.ts
var iu = [
	"http",
	"https",
	"mailto",
	"tel"
];
function au(e) {
	let t = String(e ?? "");
	if (t.trim().length === 0) return !1;
	for (let e of t) {
		let t = e.codePointAt(0) ?? 0;
		if (t <= 32 || t >= 127 && t <= 159) return !1;
	}
	if ("/#?.".includes(t[0])) return !0;
	let n = t.indexOf(":");
	return n < 0 || iu.includes(t.slice(0, n).toLowerCase());
}
function ou(e) {
	return au(e) ? String(e) : void 0;
}
var su = [
	"http:",
	"https:",
	"mailto:",
	"tel:"
];
function cu(e) {
	let t = du(e), n = t.toLowerCase();
	return /^[\\/]{2}/.test(t) || su.some((e) => n.startsWith(e));
}
function lu(e) {
	return typeof e != "string" || /[\x00-\x1f\x7f]/.test(e) ? !1 : e === "/" || uu(e);
}
function uu(e) {
	return e.length > 1 && e[0] === "/" && e[1] !== "/" && e[1] !== "\\";
}
function du(e) {
	let t = 0, n = e.length;
	for (; t < n && e.charCodeAt(t) <= 32;) t++;
	for (; n > t && e.charCodeAt(n - 1) <= 32;) n--;
	return e.slice(t, n).replace(/[\t\n\r]/g, "");
}
function fu(e) {
	return pu(e) !== null;
}
function pu(e) {
	let t = du(e), n = t.toLowerCase();
	return uu(t) || n.startsWith("https://") || n.startsWith("http://") || n.startsWith("data:image/") ? t : null;
}
function mu(e) {
	return pu(String(e ?? "").trim()) ?? void 0;
}
//#endregion
//#region src/rendering/icon-value.ts
var hu = "mask:", gu = "ui-icon--image", _u = "ui-icon--mask";
function vu(e) {
	let t = String(e ?? "").trim(), n = !1;
	t.startsWith(hu) && (n = !0, t = t.slice(5).trim());
	let r = pu(t);
	return r === null ? null : {
		source: r,
		tinted: n
	};
}
function yu(e) {
	let t = vu(e);
	return t === null ? "" : bu(t.source);
}
function bu(e) {
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
var xu = "ui-icon", Su = "data-ui-icon";
function Cu(e, t) {
	e.classList.add(xu);
	for (let t of Array.from(e.classList)) Tu(t) && e.classList.remove(t);
	(e instanceof HTMLElement || e instanceof SVGElement) && e.style.removeProperty("--ui-icon-url");
	let n = Eu(t);
	if (n.length === 0) {
		e.removeAttribute(Su);
		return;
	}
	e.setAttribute(Su, ""), e.classList.add(n);
	let r = vu(t);
	r !== null && (e instanceof HTMLElement || e instanceof SVGElement) && e.style.setProperty("--ui-icon-url", bu(r.source));
}
var wu = "ui-icon-glyph--";
function Tu(e) {
	return e === gu || e === _u || e.startsWith(wu);
}
function Eu(e) {
	let t = vu(e);
	return t === null ? Du(e) : t.tinted ? _u : gu;
}
function Du(e) {
	let t = String(e ?? "").trim();
	if (t.length === 0) return "";
	let n = wu;
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
//#region src/interactions/image-input-engine.ts
var Ou = "ui-image-input", ku = "ui-image-input--multiple", Au = "ui-image-input__surface", ju = "ui-image-input__native", Mu = "ui-image-input__picture", Nu = "ui-image-input__text", Pu = "ui-image-input__selection", Fu = "ui-image-input__selections", Iu = "ui-image-input__tiles", Lu = "ui-image-input__tile", Ru = "ui-image-input__remove", zu = "ui-image-input__progress", Bu = "ui-image-input__tile--file", Vu = "ui-image-input__file-glyph", Hu = "ui-image-input__file-name", Uu = "SelectionId", Wu = "--ui-image-progress", Gu = "data-ui-image-preview", Ku = "data-ui-image-dragging", qu = class {
	root;
	validation;
	previews = /* @__PURE__ */ new WeakMap();
	shelves = /* @__PURE__ */ new WeakMap();
	published = /* @__PURE__ */ new WeakMap();
	seenKeys = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.validation = e.validation, this.applyAll(this.root.querySelectorAll(`.${Ou}`)), j(this.root, `.${Ou}`, {
			childList: !0,
			attributeFilter: [
				rn,
				Fe,
				vn
			]
		}, (e) => this.applyAll(e)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			e.propertyName === Uu && (e.value === null || e.value === void 0 || e.value === "") && this.clearAll(Tr(e.components, `.${Ou}`));
		}), this.root.addEventListener("click", (e) => this.handlePickClick(e), !0), this.root.addEventListener("click", (e) => this.handleRemoveClick(e), !0), this.root.addEventListener("change", (e) => void this.handleNativeChangeAsync(e), !0), this.root.addEventListener(jl, (e) => Nl(e, {
			rootSelector: `.${Ou}`,
			nativeSelector: `.${ju}`,
			pressed: (e) => e.querySelector(`.${Au}`)
		})), this.root.addEventListener(wa, (e) => this.handleDraftDropped(e)), ll({
			root: this.root,
			draggingAttribute: Ku,
			resolveTarget: (e) => {
				let t = e.closest(`.${Au}`), n = t?.closest(`.${Ou}`) ?? null, r = n === null ? fl(this.root, e, `.${Ou}`) : null, i = n ?? r?.field ?? null, a = t ?? i?.querySelector(`.${Au}`) ?? null;
				return i === null || a === null ? null : {
					host: i,
					mark: r?.component,
					accept: i.querySelector(`.${ju}`)?.getAttribute("accept") ?? "",
					multiple: Ju(i),
					refused: E(i) || w(a)
				};
			},
			onFiles: (e, t) => void (Ju(e) ? this.takeManyAsync(e, t) : this.takeFileAsync(e, t[0]))
		});
	}
	applyAll(e) {
		for (let t of e) Ju(t) ? this.reconcileShelf(t) : this.apply(t);
	}
	apply(e) {
		let t = e.querySelector(`.${Mu}`);
		if (t === null) return;
		let n = e.getAttribute("data-ui-image-source") ?? "", r = this.previews.has(e);
		if (r && e.dataset.previewFor === n) return;
		let i = r && n.length > 0;
		this.dropPreview(e, i), n.length === 0 ? t.removeAttribute("src") : t.getAttribute("src") !== n && t.setAttribute("src", n), i || Zu(e, e.getAttribute("data-ui-image-caption") ?? ed(n)), $u(e, n.length > 0);
	}
	reconcileShelf(e) {
		let t = this.shelves.get(e), n = e.getAttribute(vn);
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
		for (let t of e) Ju(t) || this.previews.get(t)?.landed !== !0 || (t.dataset.previewFor === (t.getAttribute("data-ui-image-source") ?? "") && this.dropPreview(t), this.apply(t));
	}
	handlePickClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${on}]`), n = t?.closest(`.${Ou}`) ?? null;
		t === null || n === null || E(n) || w(t) || n.querySelector(`.${ju}`)?.click();
	}
	handleRemoveClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Ru}`), n = t?.closest(`.${Ou}`) ?? null;
		if (t === null || n === null || E(n) || w(n)) return;
		e.preventDefault(), e.stopPropagation();
		let r = this.shelves.get(n)?.find((e) => e.element === t.parentElement);
		r !== void 0 && (this.dropTile(n, r), this.publishShelf(n));
	}
	async handleNativeChangeAsync(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ju)) return;
		let t = e.target.closest(`.${Ou}`), n = [...e.target.files ?? []];
		e.target.value = "", t !== null && n.length !== 0 && (Ju(t) ? await this.takeManyAsync(t, n) : await this.takeFileAsync(t, n[0]));
	}
	handleDraftDropped(e) {
		if (e.target instanceof Element) for (let t of e.target.querySelectorAll(`.${Ou}`)) this.previews.has(t) && (this.dropPreview(t), this.apply(t), Al(t.querySelector(`.${Pu}`), ""));
	}
	async takeFileAsync(e, t) {
		let n = e.querySelector(`.${Au}`), r = e.querySelector(`.${Mu}`), i = e.querySelector(`.${Pu}`);
		if (n === null || r === null || Cl(e, [t], !1, this.validation).length === 0) return;
		this.dropPreview(e);
		let a = {
			url: URL.createObjectURL(t),
			landed: !1
		};
		this.previews.set(e, a), e.dataset.previewFor = e.getAttribute("data-ui-image-source") ?? "", e.setAttribute(Gu, ""), r.setAttribute("src", a.url), Zu(e, t.name), $u(e, !0), n.classList.add(On);
		try {
			let n = await Dl([t], () => void 0);
			this.previews.get(e) === a && (a.landed = !0, Al(i, n.selectionId));
		} catch (t) {
			Qu(e), Al(i, ""), s("picture upload failed.", t);
		} finally {
			n.classList.remove(On);
		}
	}
	async takeManyAsync(e, t) {
		let n = e.querySelector(`.${Iu}`), r = Cl(e, t, !0, this.validation);
		if (n === null || r.length === 0) return;
		let i = this.shelves.get(e) ?? [];
		this.shelves.set(e, i);
		let a = r.map(async (t) => {
			let r = Yu(t);
			i.push(r), n.appendChild(r.element);
			try {
				let n = await Dl([t], (e) => r.element.style.setProperty(Wu, `${e}%`));
				if (!i.includes(r)) return;
				r.selectionId = n.selectionId, r.element.classList.remove(On), this.publishShelf(e);
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
		let t = e.querySelector(`.${Fu}`), n = (this.shelves.get(e) ?? []).map((e) => e.selectionId).filter((e) => e !== null), r = JSON.stringify(n);
		if (t === null || t.getAttribute("data-ui-selected-keys") === r) return;
		let i = this.published.get(e) ?? [];
		i.push(r), this.published.set(e, i), t.setAttribute(vn, r), t.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	dropPreview(e, t = !1) {
		let n = this.previews.get(e);
		n !== void 0 && (URL.revokeObjectURL(n.url), this.previews.delete(e), delete e.dataset.previewFor, e.removeAttribute(Gu), t || Zu(e, ""));
	}
};
function Ju(e) {
	return e.classList.contains(ku);
}
function Yu(e) {
	let t = document.createElement("span"), n = document.createElement("button"), r = document.createElement("span"), i = URL.createObjectURL(e);
	if (t.className = `${Lu} ${On}`, n.type = "button", n.className = Ru, r.className = zu, e.type.startsWith("image/")) {
		let a = document.createElement("img");
		a.src = i, a.alt = e.name, C.write(n, "aria-label", "ui.image.remove"), a.addEventListener("error", () => t.replaceChildren(...Xu(t, n, e), n, r), { once: !0 }), t.append(a, n, r);
	} else t.append(...Xu(t, n, e), n, r);
	return {
		element: t,
		url: i,
		selectionId: null
	};
}
function Xu(e, t, n) {
	let r = document.createElement("span"), i = document.createElement("span");
	return e.classList.add(Bu), e.setAttribute("title", n.name), r.className = Vu, r.setAttribute("aria-hidden", "true"), Cu(r, nu(n.name, n.type)), i.className = Hu, i.textContent = n.name, C.write(t, "aria-label", "ui.file.remove"), [r, i];
}
function Zu(e, t) {
	let n = e.querySelector(`.${Nu}`);
	n !== null && (Qi(n, null), n.textContent !== t && (n.textContent = t));
}
function Qu(e) {
	let t = e.querySelector(`.${Nu}`);
	t !== null && C.write(t, null, "ui.file.failed");
}
function $u(e, t) {
	let n = e.querySelector(`.${Au}`);
	n !== null && C.write(n, "aria-label", t ? "ui.image.change" : "ui.image.choose");
}
function ed(e) {
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
var td = "ui-key-value-action__row", nd = "ui-key-value-action__value", rd = "ui-key-value-action__value-input", id = "ui-key-value-action__edit-action", ad = "ui-text__title", od = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.handleRows(this.root.querySelectorAll(`.${td}`)), j(this.root, `.${td}`, {
			childList: !0,
			attributeFilter: [nn]
		}, (e) => this.handleRows(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0);
	}
	handleRows(e) {
		for (let t of e) t.hasAttribute("data-ui-row-editing") ? this.open(t) : this.close(t);
	}
	close(e) {
		for (let t of e.querySelectorAll(`.${rd} [${Me}]`)) {
			if (Ca(t)) {
				t.value = "";
				continue;
			}
			let e = this.options.dom.resolveNearestComponent(t, () => !0);
			this.options.propertyPatchEngine.restoreBoundValue(t, e?.dynamicParameters ?? []);
		}
		Ta(e);
	}
	open(e) {
		let t = e.querySelector(`.${rd} :is(input, textarea, select)`);
		if (t !== null) {
			if (Ca(t) && t.value.length === 0 && t.hasAttribute("data-ui-bind-value")) {
				let n = e.querySelector(`.${nd} .${ad}`)?.textContent?.trim() ?? "";
				n.length > 0 && (t.value = n, t.dispatchEvent(new Event("change", { bubbles: !0 })));
			}
			t.focus({ preventScroll: !0 }), Sa(t) && t.select();
		}
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing || !(e.target instanceof Element) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = cd(e.target);
		if (t === null || e.key === "Enter" && t.cell.classList.contains(id)) return;
		let { cell: n, row: r } = t, i = e.target.closest(Pn), a = n.querySelector("[role='listbox']");
		if (i !== null && n.contains(i) || a !== null && a.getClientRects().length > 0 || e.key === "Enter" && e.target instanceof HTMLTextAreaElement) return;
		let o = r.querySelectorAll(`.${id} button`), s = e.key === "Enter" ? o[0] : o[o.length - 1];
		s !== void 0 && (e.preventDefault(), !w(s) && (e.key === "Enter" && e.target instanceof HTMLInputElement && e.target.dispatchEvent(new Event("change", { bubbles: !0 })), s.click()));
	}
};
function sd(e) {
	return cd(e) !== null;
}
function cd(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${rd}, .${id}`), n = t?.closest(`.${td}`) ?? null;
	return t === null || n === null || !n.hasAttribute("data-ui-row-editing") ? null : {
		cell: t,
		row: n
	};
}
//#endregion
//#region src/interactions/toggle-button-engine.ts
var ld = `.ui-button[${Je}="pressed"]`, ud = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(ld);
		t === null || w(t) || (t.setAttribute("aria-pressed", t.getAttribute("aria-pressed") === "true" ? "false" : "true"), t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, dd = `.ui-text-input__row, .ui-number-input__row, .ui-temporal-input__row, .ui-file-input__row, .ui-color-input__row, .${Fn}, .ui-field-box`, fd = `button, a, input, select, textarea, label, summary, [role='button'], [contenteditable=''], [contenteditable='true'], ${dd}, ${Pn}, .${_e}`, pd = "button, a, summary, [role='button']";
function md(e) {
	let t = [];
	for (let n of e.querySelectorAll(fd)) {
		let r = n.closest(Pn);
		if (!(n.classList.contains("ui-row__grip") || r !== null && e.contains(r) || t.some((e) => e.contains(n))) && (t.push(n), t.length > 1)) return null;
	}
	let n = t[0];
	return n instanceof HTMLElement && n.matches(pd) ? n : null;
}
function hd(e, t) {
	if (!(e instanceof Element)) return null;
	let n = e.closest(fd);
	return n !== null && n !== t && t.contains(n) ? n : null;
}
//#endregion
//#region src/interactions/field-box-press-engine.ts
var gd = `button, a, input, select, textarea, label, [tabindex], [contenteditable], ${Pn}, [${Pe}]`, _d = ":scope > input.ui-field, :scope > textarea.ui-field", vd = class {
	constructor(e = {}) {
		(e.root ?? document).addEventListener("pointerdown", (e) => this.handlePointerDown(e));
	}
	handlePointerDown(e) {
		if (e.defaultPrevented || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(dd);
		if (t === null || e.target !== t && e.target.closest(gd) !== null) return;
		let n = t.querySelector(_d);
		if (!Ca(n) || n.readOnly || w(n) || E(n)) return;
		e.preventDefault(), n.focus({ preventScroll: !0 });
		let r = n.value.length;
		n.setSelectionRange(r, r);
	}
};
//#endregion
//#region src/interactions/own-descendants.ts
function M(e, t, n) {
	let r = [];
	for (let i of e.querySelectorAll(t)) i.closest(n) === e && r.push(i);
	return r;
}
//#endregion
//#region src/interactions/field-keys-engine.ts
var yd = "data-ui-submit-on-enter", bd = 229, xd = class {
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
		if (e.defaultPrevented || Sd(e) || e.key !== "Enter" && e.key !== "Escape") return;
		let t = e.target;
		if (t instanceof HTMLTextAreaElement) {
			e.key === "Escape" ? (e.preventDefault(), this.leave(t)) : Cd(t, e) && (e.preventDefault(), this.commit(t), this.submitForm(t));
			return;
		}
		Sa(t) && (e.preventDefault(), this.leave(t), e.key === "Enter" && this.submitForm(t));
	}
	submitForm(e) {
		let t = e.getAttribute(lt);
		if (t === null || t.length === 0) return;
		let n = this.root.querySelector(`[${Tn}="${CSS.escape(t)}"]`);
		n !== null && !w(n) && n.click();
	}
	leave(e) {
		let t = this.changes, n = Io(e);
		e.blur(), this.changes === t && this.commit(e), this.keepKeyboard(e, n);
	}
	commit(e) {
		e.value !== this.committedValue && e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	keepKeyboard(e, t) {
		let n = document.activeElement;
		if (t?.isConnected !== !0 || n !== null && n !== document.body) return;
		let r = io(e);
		r?.root === t && r.row !== null && co(t, M(t, Fa, Pa), r.row), A(t);
	}
};
function Sd(e) {
	return e.isComposing || e.keyCode === bd;
}
function Cd(e, t) {
	return t.key === "Enter" && !t.shiftKey && !t.ctrlKey && !t.altKey && !t.metaKey && e.hasAttribute(yd) && !e.readOnly && !w(e);
}
//#endregion
//#region src/interactions/image-fallback-engine.ts
var wd = "data-ui-fallback-src", Td = `img[${wd}]`, Ed = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("error", (e) => this.handleError(e), !0);
		for (let e of this.root.querySelectorAll(Td)) (Dd(e) || e.complete && e.naturalWidth === 0) && Od(e);
		j(this.root, Td, {
			childList: !0,
			attributeFilter: ["src"]
		}, (e) => {
			for (let t of e) t instanceof HTMLImageElement && Dd(t) && Od(t);
		});
	}
	handleError(e) {
		let t = e.target;
		t instanceof HTMLImageElement && Od(t);
	}
};
function Dd(e) {
	let t = e.getAttribute("src");
	return t === null || t.trim().length === 0;
}
function Od(e) {
	let t = e.getAttribute(wd);
	t !== null && e.getAttribute("src") !== t && e.setAttribute("src", t);
}
//#endregion
//#region src/interactions/radio-group-sync-engine.ts
var kd = "data-ui-radio-value", Ad = "ui-radio-group__input", jd = "ui-radio-group__dot", Md = "ui-radio-group", Nd = "ui-radio-group__item", Pd = "data-ui-radio-group-name", Fd = "data-ui-radio-bind-value-id", Id = class {
	root;
	renamed = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.claimGroupNames([...this.root.querySelectorAll(`.${Md}`)]);
		for (let e of this.root.querySelectorAll(`.${Md}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = [];
			for (let n of e) {
				if (n.type === "attributes" && n.target instanceof HTMLElement) {
					this.sync(n.target.closest(`.${Md}`));
					continue;
				}
				for (let e of n.addedNodes) e instanceof HTMLElement && t.push(e);
			}
			this.claimGroupNames(t.flatMap(Ld));
			for (let e of t) this.decorateAddedItems(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: [kd, "class"],
			childList: !0,
			subtree: !0
		});
	}
	claimGroupNames(e) {
		if (e.length === 0) return;
		let t = /* @__PURE__ */ new Map();
		for (let e of this.root.querySelectorAll(`.${Md}`)) {
			let n = e.getAttribute(Pd);
			n !== null && t.set(n, (t.get(n) ?? 0) + 1);
		}
		let n = /* @__PURE__ */ new Set();
		for (let r of e) {
			let e = r.getAttribute(Pd), i = e === null ? 0 : t.get(e) ?? 0;
			if (e === null || i < 2) continue;
			t.set(e, i - 1), n.add(e);
			let a = `${e}-${++this.renamed}`;
			r.setAttribute(Pd, a);
			for (let e of M(r, `.${Ad}`, `.${Md}`)) e.name = a;
			this.sync(r);
		}
		if (n.size !== 0) for (let e of this.root.querySelectorAll(`.${Md}`)) n.has(e.getAttribute(Pd) ?? "") && this.sync(e);
	}
	sync(e) {
		if (e === null) return;
		let t = e.getAttribute(kd);
		for (let n of M(e, `.${Ad}`, `.${Md}`)) {
			n.checked = n.value === t;
			let e = Rd(n);
			n.disabled !== e && (n.disabled = e);
		}
	}
	decorateAddedItems(e) {
		let t = e.classList.contains(Nd) ? [e] : [...e.querySelectorAll(`.${Nd}`)];
		for (let e of t) this.decorateItem(e);
	}
	decorateItem(e) {
		if (e.querySelector(`.${Ad}`) !== null) return;
		let t = e.closest(`.${Md}`), n = t?.getAttribute(Pd);
		if (t == null || n == null) return;
		let r = document.createElement("input");
		r.className = Ad, r.type = "radio", r.name = n;
		let i = e.dataset.uiKey;
		i !== void 0 && (r.value = i);
		let a = t.getAttribute(Fd);
		a !== null && r.setAttribute(Me, a);
		let o = document.createElement("span");
		o.className = jd, e.prepend(r, o), this.sync(t);
	}
};
function Ld(e) {
	return e.classList.contains(Md) ? [e] : [...e.querySelectorAll(`.${Md}`)];
}
function Rd(e) {
	let t = e.closest(`.${Nd}`);
	return t !== null && T(t);
}
//#endregion
//#region src/interactions/multi-select-keys.ts
function zd(e) {
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
function Bd(e) {
	if (e === null) return null;
	let t = Number(e);
	return Number.isInteger(t) && t > 0 ? t : null;
}
function Vd(e, t) {
	return t !== null && e.length >= t;
}
function Hd(e, t, n) {
	return e.includes(t) ? e.filter((e) => e !== t) : Vd(e, n) ? null : [...e, t];
}
function Ud(e, t) {
	return e.includes(t) ? e.filter((e) => e !== t) : null;
}
//#endregion
//#region src/interactions/search-terms.ts
var Wd = /\p{M}/gu;
function Gd(e, t) {
	return Kd(e, t).split(/\s+/).filter((e) => e.length !== 0);
}
function Kd(e, t) {
	return Yd(e, Jd(t));
}
function qd(e, t) {
	return t.every((t) => e.includes(t));
}
function Jd(e) {
	return e.closest("[lang]")?.getAttribute("lang") || void 0;
}
function Yd(e, t) {
	let n = e.normalize("NFD").replace(Wd, "");
	try {
		return n.toLocaleLowerCase(t);
	} catch {
		return n.toLowerCase();
	}
}
//#endregion
//#region src/interactions/search-input-engine.ts
var Xd = "data-ui-search-debounce", Zd = "data-ui-search-min-length", Qd = "data-ui-search-manual", $d = "data-ui-search-answered", ef = "ui-search__input", tf = "ui-select__popup", nf = "ui-select__option", rf = "ui-text__title", af = 300, of = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("compositionend", (e) => this.handleInput(e), !0);
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ef) || e instanceof InputEvent && e.isComposing) return;
		let t = e.target;
		sf(t);
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = t.getAttribute(Xd), i = r === null ? af : Number(r);
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(i) && i >= 0 ? i : af));
	}
	commit(e) {
		if (e.dispatchEvent(new Event("change", { bubbles: !0 })), e.hasAttribute(Qd)) return;
		let t = e.getAttribute(Zd), n = t === null ? 0 : Number(t);
		e.value.length < n || e.dispatchEvent(new Event("search", { bubbles: !0 }));
	}
};
function sf(e) {
	if (e.hasAttribute($d)) return;
	let t = e.closest(`.${Rn}`), n = t?.querySelector(`.${tf}`);
	if (t == null || n == null) return;
	let r = e.getAttribute(Zd), i = r === null ? 0 : Number(r), a = e.value.trim().length >= i ? Gd(e.value, e) : [], o = lf(n, (e) => a.length === 0 || qd(Kd(cf(e), e), a));
	pf(t, n, a.length > 0 && o === 0);
}
function cf(e) {
	return e.querySelector(`.${rf}`)?.textContent ?? e.textContent ?? "";
}
function lf(e, t) {
	let n = null, r = !1, i = 0;
	for (let a of e.children) {
		if (!(a instanceof HTMLElement)) continue;
		if (a.hasAttribute("data-ui-group-header")) {
			n !== null && uf(n, r), n = a, r = !1;
			continue;
		}
		if (!a.classList.contains(nf)) continue;
		let e = t(a);
		uf(a, e), r ||= e, e && i++;
	}
	return n !== null && uf(n, r), i;
}
function uf(e, t) {
	let n = t ? "" : "none";
	e.style.display !== n && (e.style.display = n);
}
function df(e) {
	let t = e.querySelector(`.${tf}`);
	t !== null && pf(e, t, lf(t, (e) => e.style.display !== "none") === 0);
}
function ff(e) {
	let t = e.querySelector(`.${tf}`);
	t !== null && lf(t, () => !0);
}
function pf(e, t, n) {
	let r = t.querySelector(`:scope > [${Ue}]`);
	if (!n) {
		r?.remove();
		return;
	}
	if (r !== null) return;
	let i = e.querySelector(`:scope > template[${Ve}]`);
	if (i === null) return;
	let a = i.content.cloneNode(!0).firstElementChild;
	a !== null && (a.setAttribute(Ue, ""), t.appendChild(a));
}
//#endregion
//#region src/interactions/select-interaction-engine.ts
var mf = "data-ui-select-value", hf = "data-ui-select-placement", gf = "ui-select--open", _f = "ui-select__trigger-content", vf = "data-ui-select-content", yf = "ui-select__placeholder", bf = "ui-input__affix-icon--prefix", xf = "ui-select__popup", Sf = "ui-select__option", Cf = "ui-select__value-input", wf = "data-ui-select-clear", Tf = "data-ui-select-trigger-mode", Ef = "ui-search__input", Df = "ui-search-mode--replace", Of = "ui-text__title", kf = "data-ui-active", Af = "ui-multi-select", jf = "ui-multi-select__chips", Mf = "ui-multi-select__chip", Nf = "ui-multi-select__chip-label", Pf = "ui-multi-select__chip-remove", Ff = "data-ui-select-chip", If = "data-ui-select-max", Lf = 4, Rf = [
	mf,
	vn,
	If,
	"class",
	h
];
function zf(e) {
	return e === null || E(e) || w(e);
}
function Bf(e) {
	return e.classList.contains(Af);
}
function Vf(e) {
	return e.querySelector(`.${Fn}`)?.getAttribute(Tf) === "input";
}
function Hf(e) {
	return M(e, `.${xf} .${Sf}`, `.${Rn}`);
}
function Uf(e) {
	return e === null ? null : e.querySelector(`.${Of}`)?.textContent ?? e.textContent;
}
function Wf(e) {
	for (let t of [e, ...e.querySelectorAll("*")]) {
		t.removeAttribute(m), t.removeAttribute(h), t.removeAttribute(le), t.removeAttribute(ce);
		for (let e of [...t.attributes]) e.name.startsWith("data-ui-bind-") && t.removeAttribute(e.name);
	}
}
var Gf = class {
	root;
	popups = new Fc({
		show: ({ owner: e }) => e.classList.add(gf),
		hide: ({ owner: e }) => {
			e.classList.remove(gf), this.markActive(e, null);
		}
	});
	syncedValues = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document;
		for (let e of this.root.querySelectorAll(`.${Rn}`)) this.sync(e);
		this.root instanceof Node && new MutationObserver((e) => {
			let t = /* @__PURE__ */ new Set();
			for (let n of e) Xf(n, t);
			for (let e of t) this.sync(e);
		}).observe(this.root, {
			attributes: !0,
			attributeFilter: Rf,
			childList: !0,
			characterData: !0,
			subtree: !0
		}), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("input", (e) => this.handleSearchInput(e), !0), this.root.addEventListener("focusin", (e) => this.handleSearchFocus(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("mousedown", (e) => {
			e.target instanceof Element && e.target.closest(`[${wf}], .${Pf}`) !== null && e.preventDefault();
		}, !0);
	}
	get openSelect() {
		return this.popups.current;
	}
	sync(e) {
		if (Bf(e)) {
			this.syncMultiple(e);
			return;
		}
		let t = e.getAttribute(mf);
		this.decorateOptions(e);
		let n = t === null ? null : Hf(e).find((e) => e.getAttribute("data-ui-key") === t) ?? null, r = n !== null, i = Uf(n);
		this.renderTriggerContent(e, n);
		let a = e.querySelector(`.${Ef}`);
		if (a !== null) {
			let n = document.activeElement === a;
			e.classList.contains(Df) && (!n || a.value.length === 0) && (a.value = i ?? "", n && a.select()), this.syncedValues.has(e) && this.syncedValues.get(e) !== t && ff(e);
		}
		this.syncedValues.set(e, t);
		let o = e.querySelector(`.${yf}`);
		o !== null && (o.style.display = r ? "none" : "");
		for (let n of Hf(e)) n.setAttribute("aria-selected", t !== null && n.dataset.uiKey === t ? "true" : "false");
		let s = e.querySelector(`.${Cf}`);
		s !== null && s.value !== (t ?? "") && (s.value = t ?? ""), df(e);
	}
	syncMultiple(e) {
		let t = zd(e.getAttribute(vn)), n = new Set(t), r = Vd(t, Bd(e.getAttribute(If)));
		this.decorateOptions(e, (e) => r && !n.has(e.dataset.uiKey ?? ""));
		let i = Hf(e), a = new Map(i.map((e) => [e.dataset.uiKey ?? "", e])), o = t.filter((e) => a.has(e));
		Jf(e, o.map((e) => ({
			key: e,
			label: qf(a.get(e) ?? null, e)
		})));
		let s = e.querySelector(`.${yf}`);
		s !== null && (s.style.display = o.length > 0 ? "none" : "");
		for (let e of i) e.setAttribute("aria-selected", n.has(e.dataset.uiKey ?? "") ? "true" : "false");
		let c = e.querySelector(`.${Cf}`), l = JSON.stringify(t);
		c !== null && c.getAttribute("data-ui-selected-keys") !== l && c.setAttribute(vn, l), df(e);
	}
	renderTriggerContent(e, t) {
		let n = e.querySelector(`.${Fn}`);
		if (n === null) return;
		let r = n.querySelector(`:scope > .${_f}`);
		if (t === null) {
			r?.remove();
			return;
		}
		let i = t.getAttribute(h);
		if (r !== null && i !== null && r.getAttribute(vf) === i) {
			r.removeAttribute(vf);
			return;
		}
		if (r === null) {
			r = document.createElement("span"), r.className = _f;
			let e = n.querySelector(`:scope > .${bf}`);
			e === null ? n.prepend(r) : e.after(r);
		}
		r.style.display = "inline-flex";
		let a = t.cloneNode(!0);
		Wf(a), r.replaceChildren(...a.childNodes);
	}
	decorateOptions(e, t = () => !1) {
		for (let n of Hf(e)) {
			n.hasAttribute("role") || n.setAttribute("role", "option");
			let e = T(n), r = e || t(n) ? "true" : "false";
			n.getAttribute("aria-disabled") !== r && n.setAttribute("aria-disabled", r), (e ? n.tabIndex !== -1 : !n.hasAttribute("tabindex")) && (n.tabIndex = -1);
		}
	}
	handleSearchInput(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(Ef)) return;
		let t = e.target.closest(`.${Rn}`);
		t !== null && t !== this.openSelect && this.toggle(t, !0);
	}
	handlePointerMove(e) {
		let t = this.openSelect, n = t === null || !(e.target instanceof Element) ? null : e.target.closest(`.${Sf}`);
		t === null || n === null || n.hasAttribute(kf) || T(n) || w(n) || n.closest(".ui-select") !== t || (D(Hf(t).filter((e) => !T(e)), n), Vf(t) || Oo(n), this.markActive(t, n, !0));
	}
	handleSearchFocus(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ef)) return;
		let t = e.target, n = t.closest(`.${Rn}`);
		if (n === null || n === this.openSelect || t.readOnly || !n.classList.contains(Df)) return;
		let r = n.getAttribute(mf);
		r !== null && (t.value = Uf(Hf(n).find((e) => e.getAttribute("data-ui-key") === r) ?? null) ?? t.value, t.select());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Pf}`);
		if (t !== null) {
			let n = t.closest(`.${Rn}`);
			n !== null && (e.preventDefault(), e.stopPropagation(), zf(n) || this.removeChosen(n, t.closest(`.${Mf}`)?.getAttribute(Ff) ?? null));
			return;
		}
		let n = e.target.closest(`[${wf}]`);
		if (n !== null) {
			let t = n.closest(`.${Rn}`);
			t !== null && (e.preventDefault(), e.stopPropagation(), zf(t) || (this.clearValue(t), Kf(t)));
			return;
		}
		let r = e.target.closest(`.${Fn}`);
		if (r !== null) {
			let t = r.closest(`.${Rn}`);
			if (zf(t) || r.getAttribute(Tf) === "input" && e.target instanceof HTMLInputElement && t === this.openSelect) return;
			e.preventDefault(), this.toggle(t);
			return;
		}
		let i = e.target.closest(`.${Sf}`);
		if (i === null) return;
		let a = i.closest(`.${Rn}`);
		a !== null && this.choose(a, i);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if ((e.key === "ArrowDown" || e.key === "ArrowUp") && this.openSelect !== null && e.target instanceof Node && this.openSelect.contains(e.target)) {
			e.preventDefault(), this.moveFocus(this.openSelect, e.key === "ArrowDown" ? 1 : -1);
			return;
		}
		if (e.isComposing || this.handleMultipleTriggerKey(e) || e.key !== "Enter" && e.key !== " " || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Sf}`) ?? this.markedOption(e);
		if (t === null) return;
		let n = t.closest(`.${Rn}`);
		n !== null && (e.preventDefault(), this.choose(n, t));
	}
	handleMultipleTriggerKey(e) {
		let t = (e.target instanceof HTMLElement && e.target.classList.contains("ui-select__trigger") ? e.target : null)?.closest(".ui-select") ?? null;
		if (t === null || !Bf(t) || zf(t)) return !1;
		switch (e.key) {
			case "Enter":
			case " ": return e.preventDefault(), this.toggle(t), !0;
			case "ArrowDown":
			case "ArrowUp": return e.preventDefault(), this.openSelect !== t && this.toggle(t), !0;
			case "Backspace": {
				let n = t.querySelectorAll(`.${jf} > .${Mf}`);
				return n.length !== 0 && (e.preventDefault(), this.removeChosen(t, n[n.length - 1].getAttribute(Ff)), !0);
			}
			default: return !1;
		}
	}
	markedOption(e) {
		let t = this.openSelect;
		return e.key !== "Enter" || t === null || !(e.target instanceof HTMLInputElement) || !e.target.classList.contains(Ef) || !t.contains(e.target) ? null : Hf(t).find((e) => e.hasAttribute(kf) && !T(e) && e.style.display !== "none") ?? null;
	}
	toggle(e, t = !1) {
		if (e === null) return;
		if (this.openSelect === e) {
			this.close();
			return;
		}
		this.close(), t || (ff(e), df(e));
		let n = e.querySelector(`.${Fn}`), r = e.querySelector(`.${xf}`), i = e.getAttribute(hf);
		if (n === null || r === null) return;
		n.setAttribute("aria-controls", Gn(r, "ui-select-popup"));
		let a = Vf(e) ? e.querySelector(`.${Ef}`) ?? n : n;
		this.popups.open({
			owner: e,
			popup: r,
			anchor: n,
			placement: {
				placement: i !== null && Ms(i) ? i : "bottom-start",
				gap: Lf,
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
		let t = Hf(e).filter((e) => !T(e));
		if (t.length === 0) return;
		let n = t.find((e) => e.getAttribute("aria-selected") === "true");
		if (n === void 0 && Eo()) {
			D(t, null), this.markActive(e, null), Kf(e);
			return;
		}
		let r = n ?? t[0];
		if (D(t, r), this.markActive(e, r, Eo()), Vf(e)) {
			let t = e.querySelector(`.${Ef}`);
			t !== null && document.activeElement !== t && t.focus();
			return;
		}
		A(r);
	}
	moveFocus(e, t) {
		let n = Hf(e).filter((e) => !T(e)), r = n.find((e) => e === document.activeElement) ?? n.find((e) => e.hasAttribute(kf)) ?? null, i = Ea({
			key: t === 1 ? "ArrowDown" : "ArrowUp",
			items: n,
			current: r,
			axis: "vertical",
			loop: !1
		});
		i !== null && (D(n, i), i.focus(), this.markActive(e, i));
	}
	markActive(e, t, n = !1) {
		for (let r of Hf(e)) r === t ? r.setAttribute(kf, "") : r.hasAttribute(kf) && r.removeAttribute(kf), Do(r, r === t && n);
	}
	choose(e, t) {
		let n = t.dataset.uiKey;
		if (n === void 0 || T(t) || zf(e)) return;
		if (Bf(e)) {
			let r = Hd(zd(e.getAttribute(vn)), n, Bd(e.getAttribute(If)));
			this.markActive(e, t, Eo()), r !== null && this.writeChosen(e, r);
			return;
		}
		if (e.getAttribute(mf) === n) {
			this.close();
			return;
		}
		e.setAttribute(mf, n), this.sync(e);
		let r = e.querySelector(`.${Cf}`);
		r !== null && (r.value = n, r.dispatchEvent(new Event("change", { bubbles: !0 }))), this.close();
	}
	removeChosen(e, t) {
		let n = t === null ? null : Ud(zd(e.getAttribute(vn)), t);
		if (n === null) return;
		let r = document.activeElement instanceof HTMLElement && document.activeElement.closest(`.${Mf}`) !== null;
		this.writeChosen(e, n), (r || document.activeElement === document.body) && e.querySelector(`.${Fn}`)?.focus();
	}
	writeChosen(e, t) {
		t.length === 0 ? e.removeAttribute(vn) : e.setAttribute(vn, JSON.stringify(t)), this.sync(e), this.popups.reposition(e), e.querySelector(`.${Cf}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	clearValue(e) {
		if (Bf(e)) {
			e.hasAttribute("data-ui-selected-keys") && this.writeChosen(e, []);
			return;
		}
		if (!e.hasAttribute(mf)) return;
		e.removeAttribute(mf), this.sync(e);
		let t = e.querySelector(`.${Cf}`);
		t !== null && (t.value = "", t.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
};
function Kf(e) {
	let t = e.querySelector(Vf(e) ? `.${Ef}` : `.${Fn}`);
	t !== null && !t.contains(document.activeElement) && A(t);
}
function qf(e, t) {
	let n = Uf(e)?.trim() ?? "";
	return n.length > 0 ? n : t;
}
function Jf(e, t) {
	let n = e.querySelector(`.${jf}`);
	if (n === null) return;
	let r = [...n.querySelectorAll(`:scope > .${Mf}`)];
	if (!(r.length === t.length && r.every((e, n) => e.getAttribute(Ff) === t[n].key && e.querySelector(`.${Nf}`)?.textContent === t[n].label))) {
		for (let e of r) e.remove();
		n.prepend(...t.map((e) => Yf(e.key, e.label)));
	}
}
function Yf(e, t) {
	let n = document.createElement("span"), r = document.createElement("span"), i = document.createElement("button");
	return n.className = Mf, n.setAttribute(Ff, e), r.className = Nf, r.textContent = t, i.className = Pf, i.type = "button", i.tabIndex = -1, C.write(i, "aria-label", "ui.select.remove", { label: t }), n.append(r, i), n;
}
function Xf(e, t) {
	if (e.type === "childList") {
		for (let n of e.addedNodes) if (n instanceof HTMLElement) {
			n.classList.contains("ui-select") && t.add(n);
			for (let e of n.querySelectorAll(`.${Rn}`)) t.add(e);
		}
	}
	if (e.type === "attributes" && (e.attributeName === mf || e.attributeName === "data-ui-selected-keys" || e.attributeName === If)) {
		e.target instanceof HTMLElement && e.target.classList.contains("ui-select") && t.add(e.target);
		return;
	}
	let n = (e.target instanceof HTMLElement ? e.target : e.target.parentElement)?.closest(`.${xf}`)?.closest(`.${Rn}`);
	n != null && t.add(n);
}
//#endregion
//#region src/interactions/debounced-commit-engine.ts
var Zf = "data-ui-input-debounce", Qf = `input[${Zf}], textarea[${Zf}]`;
function $f(e) {
	return (e instanceof HTMLInputElement || e instanceof HTMLTextAreaElement) && e.matches(Qf);
}
var ep = class {
	root;
	timers = /* @__PURE__ */ new WeakMap();
	committed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleChange(e), !0);
	}
	handleInput(e) {
		let t = e.target;
		if (!$f(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && window.clearTimeout(n);
		let r = Number(t.getAttribute(Zf));
		this.timers.set(t, window.setTimeout(() => this.commit(t), Number.isFinite(r) && r >= 0 ? r : 0));
	}
	handleChange(e) {
		let t = e.target;
		if (!$f(t)) return;
		let n = this.timers.get(t);
		n !== void 0 && (window.clearTimeout(n), this.timers.delete(t)), this.committed.set(t, t.value);
	}
	commit(e) {
		this.timers.delete(e), this.committed.get(e) !== e.value && (this.committed.set(e, e.value), e.dispatchEvent(new Event("change", { bubbles: !0 })));
	}
}, tp = "textarea.ui-text-area__field", np = "data-ui-text-area-grow";
function rp() {
	return typeof CSS < "u" && CSS.supports("field-sizing", "content");
}
var ip = class {
	root;
	widths = /* @__PURE__ */ new WeakMap();
	observer;
	constructor(e = {}) {
		this.root = e.root ?? document, this.observer = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null, this.root.addEventListener("input", (e) => {
			e.target instanceof HTMLTextAreaElement && e.target.matches(tp) && this.fit(e.target);
		}, !0), this.fitAll(this.root.querySelectorAll(tp)), e.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.fitAll(Tr(e.components, tp));
		}), j(this.root, tp, {
			childList: !0,
			attributeFilter: [np]
		}, (e) => {
			this.fitAll(Tr(e, tp));
		});
	}
	fitAll(e) {
		for (let t of e) this.fit(t);
	}
	fit(e) {
		if (!e.hasAttribute(np)) {
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
}, ap = "ui-slider__input", op = "ui-slider__value", sp = "ui-slider__bubble", cp = "ui-slider__track", lp = "ui-slider__thumb-anchor", up = "ui-slider", dp = "ui-orientation--vertical", fp = "--ui-slider-fraction", pp = 6, mp = "Value", hp = /* @__PURE__ */ new Set([
	"Value",
	"Min",
	"Max"
]), gp = class {
	options;
	root;
	settled = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("pointerdown", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusin", (e) => this.placeBubble(e.target), !0), this.root.addEventListener("focusout", (e) => this.releaseBubble(e.target), !0), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			if (!hp.has(e.propertyName)) return;
			let t = b(e.reference.componentId);
			for (let n of this.options.dom?.findAllComponents(t, e.dynamicParameters) ?? []) {
				let t = n.querySelector(`.${ap}`);
				t !== null && (this.settled.set(t, t.value), this.writeReadings(t), e.propertyName === mp && this.reportClamped(t, e.value));
			}
		});
	}
	reportClamped(e, t) {
		t == null || e.value === String(t) || _p(e) || e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(ap)) return;
		let t = e.target;
		if (_p(t)) {
			t.value = this.settled.get(t) ?? t.defaultValue;
			return;
		}
		this.settled.set(t, t.value), this.writeReadings(t);
	}
	placeBubble(e) {
		let t = vp(e);
		t !== null && Us(t.anchor, t.bubble, {
			placement: t.vertical ? "left" : "top",
			gap: pp
		});
	}
	releaseBubble(e) {
		Js(vp(e)?.bubble);
	}
	writeReadings(e) {
		let t = e.closest(`.${cp}`)?.parentElement ?? e.parentElement;
		for (let n of t?.querySelectorAll(`.${op}, .${sp}`) ?? []) n.textContent = e.value;
		e.closest(`.${cp}`)?.style.setProperty(fp, String(yp(e))), e.matches(":active, :focus-visible") ? this.placeBubble(e) : this.releaseBubble(e);
	}
};
function _p(e) {
	return E(e) || w(e);
}
function vp(e) {
	if (!(e instanceof Element) || !e.classList.contains(ap)) return null;
	let t = e.closest(`.${cp}`), n = t?.querySelector(`.${sp}`) ?? null, r = t?.querySelector(`.${lp}`) ?? null;
	if (n === null || r === null) return null;
	let i = e.closest(`.${up}`);
	return {
		bubble: n,
		anchor: r,
		vertical: i !== null && i.classList.contains(dp)
	};
}
function yp(e) {
	let t = Number(e.min === "" ? 0 : e.min), n = Number(e.max === "" ? 100 : e.max), r = Number(e.value);
	return !Number.isFinite(t) || !Number.isFinite(n) || !Number.isFinite(r) || n <= t ? 0 : Math.min(1, Math.max(0, (r - t) / (n - t)));
}
//#endregion
//#region src/rendering/number-format.ts
var bp = {
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
}, xp = [
	"(n)",
	"-n",
	"- n",
	"n-",
	"n -"
], Sp = [
	"$n",
	"n$",
	"$ n",
	"n $"
], Cp = [
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
], wp = [
	"n %",
	"n%",
	"%n",
	"% n"
], Tp = [
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
], Ep = /[1-9]/;
function Dp(e) {
	let t = e.closest("[data-ui-number-culture]")?.getAttribute("data-ui-number-culture") ?? null;
	if (t === null) return bp;
	try {
		return {
			...bp,
			...JSON.parse(t)
		};
	} catch {
		return bp;
	}
}
function Op(e, t, n) {
	if (!Number.isFinite(e)) return String(e);
	let r = Ap(t);
	if (r === null) return jp(e, n);
	let i = Math.abs(e);
	switch (r.kind) {
		case "N": {
			let t = Mp(i, 0, r.precision ?? n.decimalDigits, n.groupSizes, n.groupSeparator, n.decimalSeparator);
			return kp(e, t) ? Lp(xp[n.negativePattern] ?? "-n", t, "", n.negativeSign) : t;
		}
		case "F": {
			let t = Mp(i, 0, r.precision ?? n.decimalDigits, [], "", n.decimalSeparator);
			return kp(e, t) ? n.negativeSign + t : t;
		}
		case "D": {
			let t = Np(i, 0, 0).integer.padStart(r.precision ?? 1, "0");
			return kp(e, t) ? n.negativeSign + t : t;
		}
		case "C": {
			let t = Mp(i, 0, r.precision ?? n.currencyDecimalDigits, n.currencyGroupSizes, n.currencyGroupSeparator, n.currencyDecimalSeparator);
			return Lp(kp(e, t) ? Cp[n.currencyNegativePattern] ?? "-$n" : Sp[n.currencyPositivePattern] ?? "$n", t, n.currencySymbol, n.negativeSign);
		}
		case "P": {
			let t = Mp(i, 2, r.precision ?? n.percentDecimalDigits, n.percentGroupSizes, n.percentGroupSeparator, n.percentDecimalSeparator);
			return Lp(kp(e, t) ? Tp[n.percentNegativePattern] ?? "-n %" : wp[n.percentPositivePattern] ?? "n %", t, n.percentSymbol, n.negativeSign);
		}
		default: return jp(e, n);
	}
}
function kp(e, t) {
	return e < 0 && Ep.test(t);
}
function Ap(e) {
	if (e == null || e.trim().length === 0) return null;
	let t = /^([NFCPDnfcpd])(\d{0,2})$/.exec(e.trim());
	if (t === null) throw Error(`Number format '${e}' is outside the shared subset (N, F, C, P, D, with an optional precision).`);
	return {
		kind: t[1].toUpperCase(),
		precision: t[2].length === 0 ? null : Number(t[2])
	};
}
function jp(e, t) {
	let { integer: n, fraction: r } = Pp(Math.abs(e), 0), i = r.length === 0 ? n : `${n}${t.decimalSeparator}${r}`;
	return e < 0 ? t.negativeSign + i : i;
}
function Mp(e, t, n, r, i, a) {
	let { integer: o, fraction: s } = Np(e, t, n);
	return n === 0 ? Ip(o, r, i) : `${Ip(o, r, i)}${a}${s}`;
}
function Np(e, t, n) {
	let { integer: r, fraction: i } = Pp(e, t), a = r + i.slice(0, n).padEnd(n, "0"), o = i.length > n && i[n] >= "5" ? Fp(a) : a, s = o.length - n;
	return {
		integer: o.slice(0, s),
		fraction: o.slice(s)
	};
}
function Pp(e, t) {
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
function Fp(e) {
	let t = e.length - 1;
	for (; t >= 0 && e[t] === "9";) t--;
	let n = "0".repeat(e.length - 1 - t);
	return t < 0 ? `1${n}` : `${e.slice(0, t)}${String(Number(e[t]) + 1)}${n}`;
}
function Ip(e, t, n) {
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
function Lp(e, t, n, r) {
	let i = "";
	for (let a of e) i += a === "n" ? t : a === "$" || a === "%" ? n : a === "-" ? r : a;
	return i;
}
var Rp = {
	readCulture: Dp,
	format: Op
}, zp = /^-?(\d+(\.\d*)?|\.\d+)$/;
function Bp(e, t, n) {
	if (!zp.test(e)) return e;
	let r = n.thousands ? t : Kp(t), i = Number(e);
	if (n.format !== null && n.format.trim().length > 0) try {
		return Op(i, n.format, r);
	} catch {}
	let a = e.includes(".") ? e.length - e.indexOf(".") - 1 : 0;
	return Op(i, `${n.thousands ? "N" : "F"}${Math.min(a, 99)}`, r);
}
function Vp(e, t, n) {
	return zp.test(e) ? (Gp(n) ? qp(e, 2) : e).replace(".", t.decimalSeparator) : e;
}
function Hp(e, t, n) {
	let r = e.trim();
	if (r.length === 0) return "";
	let i = !1;
	r.startsWith("(") && r.endsWith(")") && (i = !0, r = r.slice(1, -1));
	let a = Gp(n) || t.percentSymbol.length > 0 && r.includes(t.percentSymbol);
	for (let e of [t.currencySymbol, t.percentSymbol]) r = e.length === 0 ? r : r.split(e).join("");
	for (let e of /* @__PURE__ */ new Set([
		t.negativeSign,
		"-",
		"−"
	])) e.length > 0 && r.includes(e) && (i = !0, r = r.split(e).join(""));
	let o = t.decimalSeparator, [s, ...c] = o.length === 0 ? [r] : r.split(o);
	if (c.length > 1) return null;
	let l = s.replace(/[\s  ]/g, "").split(t.groupSeparator).join("").split(t.currencyGroupSeparator).join(""), u = c.length === 0 ? null : c[0].replace(/[\s  ]/g, ""), d = u === null ? l : `${l}.${u}`;
	if (!zp.test(d)) return null;
	let f = a ? qp(d, -2) : d;
	return i && Number(f) !== 0 ? `-${f}` : f;
}
function Up(e, t, n, r, i) {
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
function Wp(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function Gp(e) {
	return /^\s*[pP]\d{0,2}\s*$/.test(e ?? "");
}
function Kp(e) {
	return {
		...e,
		groupSeparator: "",
		currencyGroupSeparator: "",
		percentGroupSeparator: ""
	};
}
function qp(e, t) {
	let n = e.startsWith("-"), r = n ? e.slice(1) : e, i = r.indexOf("."), a = r.replace(".", ""), o = (i < 0 ? r.length : i) + t, s = a;
	o <= 0 && (s = "0".repeat(1 - o) + s, o = 1), o > s.length && (s += "0".repeat(o - s.length));
	let c = s.slice(0, o).replace(/^0+(?=\d)/, ""), l = s.slice(o).replace(/0+$/, ""), u = l.length === 0 ? c : `${c}.${l}`;
	return n ? `-${u}` : u;
}
//#endregion
//#region src/interactions/number-input-engine.ts
var Jp = "ui-number-input", Yp = "ui-number-input__field", Xp = "data-ui-number-no-decimals", Zp = "data-ui-number-no-negative", Qp = "data-ui-number-no-thousands", $p = "data-ui-number-trim-zeros", em = "data-ui-number-step", tm = "data-ui-number-min", nm = "data-ui-number-max", rm = "data-ui-number-step-direction", im = class {
	options;
	root;
	values = /* @__PURE__ */ new WeakMap();
	shown = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("focus", (e) => this.handleFocus(e), !0), this.root.addEventListener("blur", (e) => this.handleBlur(e), !0), this.root.addEventListener("click", (e) => this.handleStepClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleStepKey(e), !0), window.addEventListener("change", (e) => this.handleChangeCapture(e), !0), window.addEventListener("change", (e) => this.handleChangeDone(e)), this.showAtRest(this.root.querySelectorAll(`.${Yp}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.showAtRest(Tr(e.components, `.${Yp}`));
		}), C.onChange(() => this.showAtRest(this.root.querySelectorAll(`.${Yp}`)));
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
		let t = am(e);
		if (t !== null) return this.keptValue(t) ?? om(t) ?? t.value.trim();
	}
	show(e) {
		let t = this.values.get(e) ?? e.value, n = Dp(e), r = e === document.activeElement ? Vp(t, n, sm(e)) : Bp(t, n, {
			format: sm(e),
			thousands: !e.hasAttribute(Qp)
		});
		e.value = r, this.shown.set(e, r);
	}
	handleInput(e) {
		let t = am(e.target);
		if (t === null) return;
		let n = !t.hasAttribute(Xp), r = !t.hasAttribute(Zp), i = t.selectionStart ?? t.value.length, a = Up(t.value, i, Dp(t), n, r);
		a.value !== t.value && (t.value = a.value, t.setSelectionRange(a.cursor, a.cursor));
	}
	handleFocus(e) {
		let t = am(e.target);
		t !== null && (this.values.set(t, this.valueOf(t)), this.show(t));
	}
	handleBlur(e) {
		let t = am(e.target);
		if (t === null) return;
		let n = this.showsOwnText(t) ? null : om(t);
		if (n !== null && this.values.set(t, n), t.hasAttribute($p) && !E(t) && !w(t)) {
			let e = this.values.get(t) ?? "", n = Wp(e);
			n !== e && this.commit(t, n);
		}
		this.show(t);
	}
	handleChangeCapture(e) {
		let t = am(e.target);
		if (t === null) return;
		let n = om(t);
		n !== null && (this.values.set(t, n), t.value = n, this.shown.set(t, n));
	}
	handleChangeDone(e) {
		let t = am(e.target);
		t !== null && t === document.activeElement && this.show(t);
	}
	commit(e, t) {
		this.values.set(e, t), e.value = Vp(t, Dp(e), sm(e)), e.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	handleStepClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest("[" + rm + "]");
		if (t === null) return;
		let n = t.closest(".ui-number-input__row")?.querySelector(`.${Yp}`) ?? null;
		n === null || n.readOnly || n.disabled || (e.preventDefault(), this.step(n, t.getAttribute(rm) === "down" ? -1 : 1));
	}
	handleStepKey(e) {
		if (e.key !== "ArrowUp" && e.key !== "ArrowDown" || e.altKey || e.ctrlKey || e.metaKey || e.defaultPrevented) return;
		let t = am(e.target);
		t === null || t.readOnly || t.disabled || (e.preventDefault(), this.step(t, e.key === "ArrowDown" ? -1 : 1));
	}
	step(e, t) {
		let n = Number(e.getAttribute(em) ?? "1"), r = (Number(this.showsOwnText(e) ? this.valueOf(e) : om(e) ?? "0") || 0) + n * t, i = e.getAttribute(tm), a = e.getAttribute(nm);
		i !== null && (r = Math.max(r, Number(i))), a !== null && (r = Math.min(r, Number(a))), this.commit(e, cm(r)), this.show(e);
	}
};
function am(e) {
	return e instanceof HTMLInputElement && e.classList.contains(Yp) ? e : null;
}
function om(e) {
	return Hp(e.value, Dp(e), sm(e));
}
function sm(e) {
	return e.closest(`.${Jp}`)?.getAttribute("data-ui-number-format") ?? null;
}
function cm(e) {
	return Number(e.toFixed(10)).toString();
}
//#endregion
//#region src/items/items-empty-renderer.ts
var lm = `:scope > [${Ue}], :scope > [${We}], :scope > [${tt}]`;
function N(e) {
	let t = new Set(e.querySelectorAll(lm));
	return [...e.children].filter((e) => !t.has(e));
}
function um(e) {
	return e === null ? [] : [e];
}
function dm(e) {
	return e.querySelector(`:scope > [${Ue}]`);
}
function fm(e, t, n, r, i) {
	i ??= N(e).some((e) => !e.classList.contains(An));
	let a = dm(e);
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
	c.setAttribute(Ue, ""), c.appendChild(s), e.appendChild(c);
}
//#endregion
//#region src/items/binding-template-evaluator.ts
var P = { ok: !1 };
function pm(e, t, n) {
	let r = e.length === 0 ? void 0 : e[e.length - 1].item, i = t ?? "";
	if (i.length === 0 || i === ".") return {
		ok: !0,
		value: r,
		scope: r
	};
	let a = (n ?? []).filter((e) => Yn(e.kind) !== "Scope"), o = r, s = r, c = !0, l = 0, u = 0, d = !0;
	for (; u < i.length;) {
		let t = i[u];
		if (t === ".") {
			if (d) return P;
			d = !0, u++;
			continue;
		}
		if (t === "[") {
			if (u + 1 >= i.length || i[u + 1] !== "]" || l >= a.length) return P;
			let t = a[l];
			if (l++, Yn(t.kind) === "Dynamic") {
				let n = _m(e, t.componentId);
				if (!n.ok) return P;
				o = n.value, s = n.value, c = !0;
			} else {
				if (!c) return P;
				let e = Cm(o, t.value);
				if (!e.ok) return P;
				o = e.value;
			}
			u += 2, d = !1;
			continue;
		}
		let n = u;
		for (; u < i.length && i[u] !== "." && i[u] !== "[";) u++;
		if (u === n) return P;
		if (c) {
			let e = ym(o, i.slice(n, u));
			e.ok ? o = e.value : c = !1;
		}
		d = !1;
	}
	return d || l !== a.length || !c ? P : {
		ok: !0,
		value: o,
		scope: s
	};
}
function mm(e, t, n) {
	for (let r of t ?? []) {
		if (Yn(r.kind) !== "Dynamic") continue;
		let t = b(r.componentId);
		if (t > 0 && !n.some((e) => e.scopeComponentId === t) && e.closest(`[data-ui-id="${t}"][data-ui-key]`) !== null) return !0;
	}
	return !1;
}
function hm(e) {
	let t = ym(e, "IsContent");
	return t.ok && t.value === !0;
}
var gm = /* @__PURE__ */ new Set();
function _m(e, t) {
	let n = b(t);
	if (n > 0) {
		for (let t = e.length - 1; t >= 0; t--) if (e[t].scopeComponentId === n) return {
			ok: !0,
			value: e[t].item
		};
	}
	return gm.has(n) || (gm.add(n), s("an item scope a binding parameter names is not on the stack; the binding resolves to nothing.", {
		targetId: n,
		stack: e
	})), P;
}
function vm(e, t) {
	let n = e;
	for (let e of t.split(".")) {
		let t = ym(n, e);
		if (!t.ok) return;
		n = t.value;
	}
	return n;
}
function ym(e, t) {
	if (e == null) return P;
	if (t === ".") return {
		ok: !0,
		value: e
	};
	if (typeof e != "object") return P;
	let n = e, r = bm(n, t);
	return Object.hasOwn(n, r) ? {
		ok: !0,
		value: n[r]
	} : P;
}
function bm(e, t) {
	if (Object.hasOwn(e, t)) return t;
	let n = xm(t);
	if (Object.hasOwn(e, n)) return n;
	let r = t.toLowerCase();
	for (let t of Object.keys(e)) if (t.toLowerCase() === r) return t;
	return n;
}
function xm(e) {
	let t = e.charAt(0);
	return t === t.toLowerCase() ? e : t.toLowerCase() + e.slice(1);
}
function Sm(e) {
	let t = e.itemTemplate;
	if (t == null) return null;
	let n = (e.itemTemplateParameters ?? []).filter((e) => Yn(e.kind) !== "Scope"), r = [], i = [], a = !1, o = 0, s = 0, c = 0;
	for (; c < t.length;) {
		let e = t[c];
		if (e === ".") {
			c++;
			continue;
		}
		if (e === "[") {
			if (c + 1 >= t.length || t[c + 1] !== "]" || s >= n.length) return null;
			let e = n[s];
			if (s++, c += 2, Yn(e.kind) !== "Dynamic") {
				r.push({
					kind: "element",
					key: e.value
				}), a = !0;
				continue;
			}
			r = [], i = [], a = !1, o = b(e.componentId);
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
function Cm(e, t) {
	if (e == null || t == null) return P;
	if (typeof t == "number") return Array.isArray(e) && t >= 0 && t < e.length ? {
		ok: !0,
		value: e[t]
	} : P;
	if (typeof t != "string") return P;
	if (!Array.isArray(e) && typeof e == "object") {
		let n = e;
		if (Object.hasOwn(n, t)) return {
			ok: !0,
			value: n[t]
		};
	}
	if (Array.isArray(e)) {
		for (let n of e) if (Tm(n, t)) return {
			ok: !0,
			value: n
		};
	}
	return P;
}
function wm(e, t, n) {
	if (e == null || t == null) return !1;
	if (Array.isArray(e)) {
		if (typeof t == "number") return t < 0 || t >= e.length ? !1 : (e[t] = n, !0);
		if (typeof t != "string") return !1;
		for (let r = 0; r < e.length; r++) if (Tm(e[r], t)) return e[r] = n, !0;
		return !1;
	}
	if (typeof t != "string" || typeof e != "object") return !1;
	let r = e;
	return Object.hasOwn(r, t) ? (r[t] = n, !0) : !1;
}
function Tm(e, t) {
	return typeof e == "object" && !!e && e.id === t;
}
//#endregion
//#region src/items/items-filter-sort.ts
function Em(e) {
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
function Dm(e, t, n, r, i) {
	let a = n.getItemsFilterSortMetadata(t), o = Em(e);
	if (a === void 0 && o === null) {
		for (let t of N(e)) t.classList.remove(An);
		return;
	}
	for (let n of N(e)) {
		let e = r.getItemValue(n);
		if (e === void 0) {
			s("item value is unknown, leaving the item visible.", {
				componentId: t,
				item: n
			}), n.classList.remove(An);
			continue;
		}
		n.classList.toggle(An, !Om(a, e, i, o));
	}
}
function Om(e, t, n, r = null) {
	return (e?.filters ?? []).every((e) => Nm(e, t, n)) && (r?.filters ?? []).every((e) => _s(vm(t, e.itemProperty), e.operator, e.value));
}
function km(e, t, n = null) {
	return (e?.filters ?? []).some((e) => Pm(e.source, e.activeOperator, e.activeValue, t)) || (n?.filters?.length ?? 0) > 0;
}
function Am(e, t, n = null) {
	let r = (e?.sorts ?? []).filter((e) => Pm(e.source, e.activeOperator, e.activeValue, t)).sort((e, t) => e.priority - t.priority);
	return [...n?.sorts ?? [], ...r];
}
function jm(e, t, n) {
	return t.length === 0 ? [...e] : [...e].sort((e, r) => Mm(n.getItemValue(e), n.getItemValue(r), t));
}
function Mm(e, t, n) {
	for (let r of n) {
		let n = Fm(vs(vm(e, r.itemProperty)), vs(vm(t, r.itemProperty)));
		if (n !== 0) return er(r.direction) === "Descending" ? -n : n;
	}
	return 0;
}
function Nm(e, t, n) {
	if (!Pm(e.source, e.activeOperator, e.activeValue, n)) return !0;
	let r = e.source !== null && e.source !== void 0 ? n.get(e.source, []) : e.value;
	return _s(vm(t, e.itemProperty), e.operator, r);
}
function Pm(e, t, n, r) {
	return e == null || _s(r.get(e, []), t, n);
}
function Fm(e, t) {
	if (e === t) return 0;
	let n = Lm(e), r = Lm(t);
	if (n !== r) return n - r;
	if (n === Im.Nothing) return 0;
	if (n === Im.Number) {
		let n = Number(e) - Number(t);
		return Number.isNaN(n) ? 0 : Math.sign(n);
	}
	return String(e).localeCompare(String(t));
}
var Im = {
	Nothing: 0,
	Number: 1,
	Text: 2
};
function Lm(e) {
	return e == null ? Im.Nothing : typeof e == "number" ? Number.isNaN(e) ? Im.Nothing : Im.Number : typeof e == "string" && e.trim().length === 0 ? Im.Nothing : Number.isNaN(Number(e)) ? Im.Text : Im.Number;
}
//#endregion
//#region src/items/items-host-mode.ts
function Rm(e) {
	switch (e.getAttribute(Xe)) {
		case "windowed": return "windowed";
		case "virtualized": return "virtualized";
		default: return "plain";
	}
}
//#endregion
//#region src/items/items-source-order.ts
var zm = /* @__PURE__ */ new WeakMap();
function Bm(e, t) {
	let n = zm.get(e), r = n === void 0 ? [...t] : Vm(n, t);
	return zm.set(e, r), r;
}
function Vm(e, t) {
	let n = new Set(t), r = e.filter((e) => n.has(e));
	return r.length === t.length ? r : [...t];
}
function Hm(e, t, n) {
	let r = n === null || n > e.length ? e.length : n;
	return e.splice(r, 0, t), e[r + 1] ?? null;
}
function Um(e, t) {
	let n = e.indexOf(t);
	n >= 0 && e.splice(n, 1);
}
function Wm(e, t, n) {
	return Um(e, t), Hm(e, t, n);
}
function Gm(e, t, n) {
	let r = e.indexOf(t);
	r >= 0 && (e[r] = n);
}
function Km(e) {
	zm.delete(e);
}
//#endregion
//#region src/interactions/drag-marks.ts
function qm(e, t, n, r, i, a = []) {
	Jm(t, r), n.classList.add(r);
	for (let e of a) e.classList.add(r);
	e instanceof DragEvent && e.dataTransfer !== null && (e.dataTransfer.effectAllowed = "move", e.dataTransfer.setData("text/plain", i));
}
function Jm(e, t) {
	for (let n of e.querySelectorAll(`.${t}`)) n.classList.remove(t);
}
//#endregion
//#region src/interactions/items-reorder-engine.ts
var Ym = ".ui-items-view, .ui-table", Xm = ".ui-items-view__item, .ui-table__row", Zm = "ui-row--dragging", Qm = "--ui-row-drop-offset", $m = "move", eh = {
	name: $m,
	registration: { dynamicParameters: (e) => {
		let t = e.domEvent instanceof CustomEvent ? e.domEvent.detail?.index : void 0;
		return typeof t == "number" ? [...e.dynamicParameters, t] : null;
	} }
}, th = class {
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
		let r = rh(t.root, t.row);
		(r === null ? !ih(e.target, t.row) : !r.contains(e.target)) || (r !== null && (co(t.root, uh(t.row.parentElement ?? t.root), t.row), t.root.focus({ preventScroll: !0 })), n.draggable || (n.draggable = !0, this.lifted = n));
	}
	release() {
		this.lifted !== null && this.drag === null && (this.lifted.draggable = !1, this.lifted = null);
	}
	movableRow(e) {
		let t = e.closest(Fa), n = t?.parentElement ?? null, r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return t === null || n === null || r === null || !t.matches(Xm) || !n.hasAttribute("data-ui-items-host") || !r.hasAttribute("data-ui-rows-draggable") || w(r) || t.hasAttribute("data-ui-undraggable") || T(t) || this.isSorted(r, n) ? null : {
			root: r,
			row: t
		};
	}
	isSorted(e, t) {
		let n = Dr(e);
		return this.services === void 0 || n === null ? !1 : Am(this.services.metadata.getItemsFilterSortMetadata(n), this.services.state, Em(t)).length > 0;
	}
	handleDragStart(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.movableRow(e.target), n = t?.row.parentElement ?? null, r = t === null ? null : O(t.row);
		t !== null && n !== null && r !== null && e.target === r && (this.drag = {
			root: t.root,
			host: n,
			row: t.row
		}, qm(e, t.root, r, Zm, k(t.row)));
	}
	handleDragOver(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		let n = oh(t), r = uh(t.host), i = this.placeOf(t, e.target, e, n, r);
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), i === null || this.indexOf(t, i.anchor, i.side) === null ? fh(t.root, null) : fh(t.root, i, ch(r, i, n));
	}
	placeOf(e, t, n, r, i) {
		if (t.closest("[data-ui-group-header]")?.parentElement === e.host) return null;
		let a = t.closest(Fa);
		for (; a !== null && a.parentElement !== e.host;) a = a.parentElement?.closest(Fa) ?? null;
		if (a ??= lh(i, n), a === null) return null;
		let o = (O(a) ?? a).getBoundingClientRect();
		if ((r.across ? n.clientX < o.left + o.width / 2 : n.clientY < o.top + o.height / 2) === r.rightToLeft) return {
			anchor: a,
			side: "after"
		};
		let s = i[i.indexOf(a) - 1];
		return s !== void 0 && sh(s, a, r) ? {
			anchor: s,
			side: "after"
		} : {
			anchor: a,
			side: "before"
		};
	}
	indexOf(e, t, n) {
		if (ah(t) !== ah(e.row)) return null;
		let r = nh(this.orderOf(e.host), k(e.row), k(t), n);
		return r === null ? null : r + dh(e.host);
	}
	orderOf(e) {
		switch (Rm(e)) {
			case "virtualized": return [...this.services?.keysOf(e) ?? N(e).map(k)];
			case "windowed": return N(e).map(k);
			default: return Bm(e, N(e)).map(k);
		}
	}
	handleDragLeave(e) {
		let t = this.drag;
		t !== null && e instanceof DragEvent && !(e.relatedTarget instanceof Node && t.host.contains(e.relatedTarget)) && fh(t.root, null);
	}
	handleDrop(e) {
		let t = this.drag;
		if (t === null || !(e instanceof DragEvent) || !(e.target instanceof Element) || !t.host.contains(e.target)) return;
		e.preventDefault();
		let n = this.placeOf(t, e.target, e, oh(t), uh(t.host)), r = n === null ? null : this.indexOf(t, n.anchor, n.side);
		this.endDrag(), r !== null && po(t.row, $m, { index: r });
	}
	endDrag() {
		let e = this.drag;
		this.drag = null, this.release(), e !== null && (Jm(e.root, Zm), fh(e.root, null));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.key !== "ArrowUp" && e.key !== "ArrowDown" || !(e.target instanceof Element)) return;
		let t = io(e.target);
		if (t === null || !t.root.matches(Ym) || t.row !== null && hd(e.target, t.row) !== null) return;
		let n = Qa(t.root), r = n === null ? [] : uh(n), i = oo(r);
		if (n === null || i === null || this.movableRow(i) === null) return;
		e.preventDefault();
		let a = r.indexOf(i), o = e.key === "ArrowUp", s = r[o ? a - 1 : a + 1], c = s === void 0 ? null : this.indexOf({
			root: t.root,
			host: n,
			row: i
		}, s, o ? "before" : "after");
		c !== null && po(i, $m, { index: c });
	}
};
function nh(e, t, n, r) {
	let i = e.indexOf(t);
	if (i < 0 || t === n) return null;
	let a = e.filter((e) => e !== t).indexOf(n);
	if (a < 0) return null;
	let o = r === "before" ? a : a + 1;
	return o === i ? null : o;
}
function rh(e, t) {
	let n = e.hasAttribute("data-ui-rows-drag-handle") ? t.querySelector(`:scope > .${_e}`) : null;
	return n !== null && n.getClientRects().length > 0 ? n : null;
}
function ih(e, t) {
	return hd(e, t) === null && e.closest("[data-ui-no-row-drag]") === null;
}
function ah(e) {
	return e.getAttribute("data-ui-group") ?? "";
}
function oh(e) {
	let t = e.root.matches(".ui-orientation--horizontal, .ui-items-view--wrap");
	return {
		across: t,
		rightToLeft: t && getComputedStyle(e.host).direction === "rtl"
	};
}
function sh(e, t, n) {
	if (ah(e) !== ah(t)) return !1;
	if (!n.across) return !0;
	let r = (O(e) ?? e).getBoundingClientRect(), i = (O(t) ?? t).getBoundingClientRect();
	return r.top < i.bottom && i.top < r.bottom;
}
function ch(e, t, n) {
	let r = t.side === "after" ? e[e.indexOf(t.anchor) + 1] : void 0;
	if (r === void 0 || !sh(t.anchor, r, n)) return -1;
	let i = (O(t.anchor) ?? t.anchor).getBoundingClientRect(), a = (O(r) ?? r).getBoundingClientRect(), o = n.across ? n.rightToLeft ? i.left - a.right : a.left - i.right : a.top - i.bottom;
	return Math.max(o, 0) / 2;
}
function lh(e, t) {
	let n = null, r = Infinity;
	for (let i of e) {
		let e = (O(i) ?? i).getBoundingClientRect(), a = Math.max(e.left - t.clientX, 0, t.clientX - e.right), o = Math.max(e.top - t.clientY, 0, t.clientY - e.bottom), s = a * a + o * o;
		s < r && (n = i, r = s);
	}
	return n;
}
function uh(e) {
	return N(e).filter((e) => e instanceof HTMLElement && e.matches(Xm) && O(e) !== null);
}
function dh(e) {
	let t = Rm(e) === "windowed" ? Number(e.getAttribute("data-ui-window-offset") ?? "0") : 0;
	return Number.isInteger(t) && t > 0 ? t : 0;
}
function fh(e, t, n = 0) {
	let r = t === null ? null : O(t.anchor);
	for (let t of e.querySelectorAll(`[${ve}]`)) t !== r && (t.removeAttribute(ve), t.style.removeProperty(Qm));
	if (r === null || t === null) return;
	r.getAttribute("data-ui-row-drop") !== t.side && r.setAttribute(ve, t.side);
	let i = `${n}px`;
	r.style.getPropertyValue(Qm) !== i && r.style.setProperty(Qm, i);
}
//#endregion
//#region src/interactions/temporal-dom.ts
var F = "ui-temporal-input", ph = "ui-calendar", mh = `.${F}, .${ph}`, hh = "ui-temporal-input__value-input", gh = "ui-temporal-input__end-value-input", _h = "data-ui-temporal-range", vh = "data-ui-temporal-end", yh = "data-ui-temporal-mode", bh = "data-ui-temporal-format", xh = "data-ui-temporal-default-format", Sh = "data-ui-temporal-min", Ch = "data-ui-temporal-max", wh = "data-ui-temporal-step", Th = "data-ui-temporal-step-unit", Eh = "data-ui-temporal-marked-days", Dh = "data-ui-temporal-marked-only", Oh = "data-ui-temporal-page-culture", kh = "data-ui-temporal-months", Ah = "data-ui-temporal-months-genitive", jh = "data-ui-temporal-months-short", Mh = "data-ui-temporal-daynames", Nh = "data-ui-temporal-weekdays", Ph = "data-ui-temporal-am", Fh = "data-ui-temporal-pm", Ih = /* @__PURE__ */ new Set([
	bh,
	xh,
	Sh,
	Ch,
	kh,
	Ph,
	Fh,
	Eh,
	Dh
]), Lh = 2e3;
function Rh(e) {
	let t = e.getAttribute(yh);
	return t === "time" || t === "date-time" ? t : "date";
}
function zh(e) {
	let t = e.getAttribute(bh);
	return t === null || t.trim().length === 0 ? e.getAttribute(xh) ?? "" : t;
}
function Bh(e) {
	let t = e.getAttribute(Th), n = Math.max(1, Math.trunc(Number(e.getAttribute(wh))) || 1);
	return {
		unit: t === "hour" || t === "minute" || t === "second" ? t : "day",
		hour: t === "hour" ? n : 1,
		minute: t === "minute" ? n : 1,
		second: t === "second" ? n : 1
	};
}
function Vh(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function Hh(e) {
	return {
		monthNames: Uh(e, kh),
		monthGenitiveNames: Uh(e, Ah),
		abbreviatedMonthNames: Uh(e, jh),
		dayNames: Uh(e, Mh),
		abbreviatedDayNames: Uh(e, Nh),
		amDesignator: e.getAttribute(Ph) ?? "AM",
		pmDesignator: e.getAttribute(Fh) ?? "PM"
	};
}
function Uh(e, t) {
	return (e.getAttribute(t) ?? "").split("|");
}
function Wh(e, t) {
	e.hasAttribute(Oh) && (Jh(e, Ah, t.monthGenitiveNames.join("|")), Jh(e, jh, t.abbreviatedMonthNames.join("|")), Jh(e, Mh, t.dayNames.join("|")), Jh(e, Nh, t.abbreviatedDayNames.join("|")), Jh(e, kh, t.monthNames.join("|")), Jh(e, Ph, t.amDesignator), Jh(e, Fh, t.pmDesignator), Jh(e, xh, qh(Rh(e), Bh(e), t)));
}
function Gh(e) {
	for (let t = 0; t < e.length;) {
		let n = Wr(e, t);
		if (n === "h" || n === "hh") return !0;
		t += n?.length ?? 1;
	}
	return !1;
}
function Kh(e, t, n) {
	if (!t) return String(e).padStart(2, "0");
	let r = e < 12 ? n.amDesignator : n.pmDesignator, i = String(e % 12 == 0 ? 12 : e % 12);
	return r.length === 0 ? i : `${i} ${r}`;
}
function qh(e, t, n) {
	let r = t.unit === "second";
	return e === "date" ? n.date : e === "time" ? r ? n.longTime : n.shortTime : Rr(n, r);
}
function Jh(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function Yh(e) {
	return e.hasAttribute(_h);
}
function Xh(e) {
	return e !== null && e.hasAttribute(vh);
}
function Zh(e) {
	return I(e, !1);
}
function I(e, t) {
	let n = Qh(e, t);
	return n === null ? null : dg(n.value, Rh(e));
}
function Qh(e, t) {
	return e.querySelector(`.${t ? gh : hh}`);
}
function $h(e, t) {
	return dg(e.getAttribute(t) ?? "", Rh(e));
}
function eg(e) {
	let t = $h(e, Sh), n = $h(e, Ch), r = (e.getAttribute(Eh) ?? "").split(" ").filter((e) => e.length > 0);
	return {
		min: t === null ? null : fg(t, "date"),
		max: n === null ? null : fg(n, "date"),
		marked: new Set(r),
		markedOnly: e.hasAttribute(Dh)
	};
}
function tg(e, t) {
	return (e.min === null || t >= e.min) && (e.max === null || t <= e.max) && (!e.markedOnly || e.marked.has(t));
}
function ng(e, t, n) {
	let r = Qh(e, n);
	if (r === null) return;
	let i = t === null ? "" : fg(t, Rh(e));
	r.value !== i && (r.value = i, r.dispatchEvent(new Event("change", { bubbles: !0 })));
}
function rg(e, t) {
	let n = t.trim(), r = n.length === 0 ? null : ei(n, zh(e), Hh(e));
	return r === null ? n : fg(Yr(r), Rh(e));
}
function ig(e) {
	if (!Yh(e)) return;
	let t = I(e, !1), n = I(e, !0);
	t === null || n === null || n.getTime() >= t.getTime() || (ng(e, n, !1), ng(e, t, !0));
}
function ag(e) {
	E(e) || w(e) || (og(e, !1), Yh(e) && og(e, !0));
}
function og(e, t) {
	let n = I(e, t);
	if (n === null) return;
	let r = cg(e, n);
	r.getTime() !== n.getTime() && ng(e, r, t);
}
function sg(e) {
	return lg(e, cg(e, /* @__PURE__ */ new Date()));
}
function cg(e, t) {
	let n = $h(e, Sh), r = $h(e, Ch);
	return n !== null && t.getTime() < n.getTime() ? n : r !== null && t.getTime() > r.getTime() ? r : t;
}
function lg(e, t) {
	let n = Bh(e), r = new Date(t);
	return r.setMilliseconds(0), r.setSeconds(n.unit === "second" ? Math.floor(r.getSeconds() / n.second) * n.second : 0), n.unit === "hour" ? r.setMinutes(0) : r.setMinutes(Math.floor(r.getMinutes() / n.minute) * n.minute), r.setHours(Math.floor(r.getHours() / n.hour) * n.hour), r;
}
var ug = /^(\d{1,2}):(\d{2})(?::(\d{2}))?/;
function dg(e, t) {
	let n = e.trim();
	if (n.length === 0) return null;
	if (t === "time") {
		let e = ug.exec(n);
		return e === null ? null : new Date(Lh, 0, 1, Number(e[1]), Number(e[2]), Number(e[3] ?? "0"));
	}
	let r = Jr(n);
	return r === null ? null : Yr(r);
}
function fg(e, t) {
	let n = `${pg(e.getHours())}:${pg(e.getMinutes())}:${pg(e.getSeconds())}`;
	if (t === "time") return n;
	let r = `${String(e.getFullYear()).padStart(4, "0")}-${pg(e.getMonth() + 1)}-${pg(e.getDate())}`;
	return t === "date" ? r : `${r}T${n}`;
}
function pg(e) {
	return String(e).padStart(2, "0");
}
//#endregion
//#region src/interactions/temporal-range.ts
function mg(e, t, n) {
	if (t === "start" || e.start === null) {
		let t = _g(n, e.start ?? n);
		return {
			start: t,
			end: e.end !== null && e.end.getTime() < t.getTime() ? null : e.end,
			active: "end",
			complete: !1
		};
	}
	return n.getTime() < vg(e.start).getTime() ? {
		start: _g(n, e.start),
		end: null,
		active: "end",
		complete: !1
	} : {
		start: e.start,
		end: _g(n, e.end ?? e.start),
		active: "end",
		complete: !0
	};
}
function hg(e, t, n) {
	if (t === null || n === null) return !1;
	let r = vg(e).getTime();
	return r > vg(t).getTime() && r < vg(n).getTime();
}
function gg(e, t, n) {
	return !n && hg(e, t.start, t.end);
}
function _g(e, t) {
	return Xr(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function vg(e) {
	return Xr(e.getFullYear(), e.getMonth(), e.getDate());
}
//#endregion
//#region src/interactions/temporal-calendar.ts
var yg = "ui-temporal-input__day", bg = "ui-temporal-input__month", xg = "data-ui-temporal-first-day", Sg = "data-ui-temporal-nav", Cg = "data-ui-temporal-day", wg = 366;
function Tg(e) {
	let t = Zh(e);
	return {
		view: Kg(t ?? cg(e, /* @__PURE__ */ new Date())),
		pane: "days",
		focusedDay: t,
		activeEnd: "start",
		hoverDay: null,
		choosingEnd: !1
	};
}
function Eg(e, t, n, r) {
	let i = L("div", `${F}__calendar`), a = L("div", `${F}__calendar-header`), o = eg(e), s = Gg("previous", "‹", C.text("ui.picker.previous"));
	s.disabled = Dg(o, t, -1) === null, a.append(s);
	let c = Gg("pane", t.pane === "days" ? `${n.monthNames[t.view.getMonth()]} ${t.view.getFullYear()}` : String(t.view.getFullYear()));
	c.classList.add(`${F}__calendar-label`), a.append(c);
	let l = Gg("next", "›", C.text("ui.picker.next"));
	return l.disabled = Dg(o, t, 1) === null, a.append(l), i.append(a), i.append(t.pane === "days" ? jg(e, t, n, r, o) : Mg(t, n, o)), i;
}
function Dg(e, t, n) {
	let r = t.pane === "months", i = Yg(t.view, n * (r ? 12 : 1));
	return kg(e, Og(i, r ? 4 : 7)) ? Ag(e, i) : null;
}
function Og(e, t) {
	return fg(e, "date").slice(0, t);
}
function kg(e, t) {
	return (e.min === null || t >= e.min.slice(0, t.length)) && (e.max === null || t <= e.max.slice(0, t.length));
}
function Ag(e, t) {
	let n = Og(t, 7), r = e.min !== null && n < e.min.slice(0, 7) ? e.min : e.max !== null && n > e.max.slice(0, 7) ? e.max : null, i = r === null ? null : dg(r, "date");
	return i === null ? t : Kg(i);
}
function jg(e, t, n, r, i) {
	let a = Hg(e), o = L("div", `${F}__weekdays`);
	for (let e = 0; e < 7; e++) {
		let t = L("span", `${F}__weekday`);
		t.textContent = n.abbreviatedDayNames[(a + e) % 7], o.append(t);
	}
	let s = L("div", `${F}__days`), c = vg(/* @__PURE__ */ new Date()), l = Yh(e), u = l ? I(e, !1) : r, d = l ? I(e, !0) : null, f = qg(t.view, a);
	for (let e = 0; e < 42; e++) {
		let n = Jg(f, e), r = fg(n, "date"), a = L("button", yg);
		a.type = "button", a.tabIndex = -1, a.textContent = String(n.getDate()), a.setAttribute(Cg, r), n.getMonth() !== t.view.getMonth() && a.classList.add(`${yg}--outside`), Xg(n, c) && (a.classList.add(`${yg}--today`), a.setAttribute("aria-current", "date")), i.marked.has(r) && a.classList.add(`${yg}--marked`);
		let o = u !== null && Xg(n, u), p = d !== null && Xg(n, d);
		a.setAttribute("aria-pressed", o || p ? "true" : "false"), (o || p) && a.classList.add(`${yg}--selected`), l && (o || p) && a.setAttribute("aria-description", C.text(o ? "ui.picker.start" : "ui.picker.end")), gg(n, {
			start: u,
			end: d
		}, t.choosingEnd) && a.classList.add(`${yg}--within`), tg(i, r) || (a.disabled = !0), s.append(a);
	}
	let p = L("div", `${F}__calendar-pane`);
	return p.append(o, s), p;
}
function Mg(e, t, n) {
	let r = L("div", `${F}__months`);
	for (let i = 0; i < 12; i++) {
		let a = L("button", bg);
		a.type = "button", a.textContent = t.abbreviatedMonthNames[i], a.setAttribute(Sg, `month:${i}`), i === e.view.getMonth() && (a.classList.add(`${bg}--selected`), a.setAttribute("aria-current", "true")), kg(n, Og(Xr(e.view.getFullYear(), i, 1), 7)) || (a.disabled = !0), r.append(a);
	}
	return r;
}
function Ng(e) {
	let t = L("div", `${F}__period-caption`);
	return t.textContent = C.text(e.activeEnd === "end" ? "ui.picker.end" : "ui.picker.start"), t;
}
function Pg(e, t, n) {
	let r = eg(e);
	if (n.startsWith("month:")) {
		let e = Xr(t.view.getFullYear(), Number(n.slice(6)), 1);
		return kg(r, Og(e, 7)) && (t.view = e, t.pane = "days"), !0;
	}
	switch (n) {
		case "previous": return t.view = Dg(r, t, -1) ?? t.view, !0;
		case "next": return t.view = Dg(r, t, 1) ?? t.view, !0;
		case "pane": return t.pane = t.pane === "days" ? "months" : "days", !0;
		default: return !1;
	}
}
function Fg(e, t, n) {
	if (Yh(e)) {
		Ig(e, t, n);
		return;
	}
	let r = Lg(n, Zh(e) ?? sg(e));
	t.focusedDay = r, t.view = Kg(r), ng(e, r, !1);
}
function Ig(e, t, n) {
	let r = mg({
		start: I(e, !1),
		end: I(e, !0)
	}, t.activeEnd, Lg(n, sg(e)));
	t.focusedDay = r.end ?? r.start, t.view = Kg(n), t.activeEnd = r.active, t.choosingEnd = !r.complete, t.hoverDay = null, ng(e, r.end, !0), ng(e, r.start, !1);
}
function Lg(e, t) {
	return Xr(e.getFullYear(), e.getMonth(), e.getDate(), t.getHours(), t.getMinutes(), t.getSeconds());
}
function Rg(e, t, n) {
	let r = Bg(n), i = Vg(t, n, Hg(e));
	if (i === null) return null;
	let a = eg(e);
	if (r === 0) return zg(a, i);
	let o = i;
	for (let e = 0; e < wg; e++) {
		if (tg(a, fg(o, "date"))) return o;
		o = Jg(o, r);
	}
	return t;
}
function zg(e, t) {
	let n = fg(t, "date"), r = e.min !== null && n < e.min ? e.min : e.max !== null && n > e.max ? e.max : null, i = r === null ? null : dg(r, "date");
	return i === null ? t : Lg(i, t);
}
function Bg(e) {
	switch (e) {
		case "ArrowLeft": return -1;
		case "ArrowRight": return 1;
		case "ArrowUp": return -7;
		case "ArrowDown": return 7;
		default: return 0;
	}
}
function Vg(e, t, n) {
	let r = (e.getDay() - n + 7) % 7;
	switch (t) {
		case "ArrowLeft": return Jg(e, -1);
		case "ArrowRight": return Jg(e, 1);
		case "ArrowUp": return Jg(e, -7);
		case "ArrowDown": return Jg(e, 7);
		case "PageUp": return Yg(e, -1);
		case "PageDown": return Yg(e, 1);
		case "Home": return Jg(e, -r);
		case "End": return Jg(e, 6 - r);
		default: return null;
	}
}
function Hg(e) {
	let t = Number(e.getAttribute(xg));
	return Number.isInteger(t) && t >= 0 && t <= 6 ? t : 1;
}
function Ug(e, t, n, r) {
	let i = [...e.querySelectorAll(`.${yg}`)];
	if (i.length === 0) return;
	let a = fg(vg(t.focusedDay ?? n ?? /* @__PURE__ */ new Date()), "date"), o = i.find((e) => e.getAttribute("data-ui-temporal-day") === a && !e.disabled) ?? i.find((e) => !e.disabled);
	o !== void 0 && (D(i, o), r && A(o));
}
function Wg(e, t) {
	let n = t.activeEnd === "end" && t.hoverDay !== null ? I(e, !1) : null, r = t.hoverDay;
	for (let t of e.querySelectorAll(`.${yg}`)) {
		let e = dg(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		t.classList.toggle(`${yg}--preview`, e !== null && n !== null && r !== null && hg(e, n, Jg(r, 1)));
	}
}
function Gg(e, t, n) {
	let r = L("button", `${F}__nav`);
	return r.type = "button", r.textContent = t, r.setAttribute(Sg, e), n !== void 0 && r.setAttribute("aria-label", n), r;
}
function L(e, t) {
	let n = document.createElement(e);
	return n.className = t, n;
}
function Kg(e) {
	return Xr(e.getFullYear(), e.getMonth(), 1);
}
function qg(e, t) {
	let n = Kg(e);
	return Jg(n, -((n.getDay() - t + 7) % 7));
}
function Jg(e, t) {
	return Xr(e.getFullYear(), e.getMonth(), e.getDate() + t, e.getHours(), e.getMinutes(), e.getSeconds());
}
function Yg(e, t) {
	let n = Xr(e.getFullYear(), e.getMonth() + t, 1), r = Xr(n.getFullYear(), n.getMonth() + 1, 0).getDate();
	return Xr(n.getFullYear(), n.getMonth(), Math.min(e.getDate(), r), e.getHours(), e.getMinutes(), e.getSeconds());
}
function Xg(e, t) {
	return e.getFullYear() === t.getFullYear() && e.getMonth() === t.getMonth() && e.getDate() === t.getDate();
}
var Zg = 100 / 3, Qg = 1, $g = 2;
function e_(e, t = Zg) {
	let n = e.deltaMode === Qg ? Zg : e.deltaMode === $g ? t : 1;
	return {
		x: e.deltaX * n,
		y: e.deltaY * n
	};
}
function t_(e, t) {
	let n = (Math.sign(e) === Math.sign(t) ? e : 0) + t, r = Math.trunc(n / 100) || 0;
	return {
		steps: r,
		carried: n - r * 100
	};
}
var n_ = {
	notch: 100,
	pixels: e_
}, r_ = "ui-temporal-input__field", i_ = "ui-temporal-input__popup", a_ = "ui-temporal-input--open", o_ = "ui-calendar__body", R = "ui-temporal-input__time-cell", s_ = "ui-temporal-input__time-column", c_ = 4, l_ = 140, u_ = "data-ui-temporal-toggle", d_ = "data-ui-temporal-unit", f_ = "data-ui-temporal-cell", p_ = "data-ui-temporal-centred", m_ = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	written = /* @__PURE__ */ new WeakSet();
	drawnLanguage = document.documentElement.lang;
	popups = new Fc({
		show: ({ owner: e, popup: t }) => {
			e.classList.add(a_), t.addEventListener("wheel", this.onColumnWheel, { passive: !1 }), this.renderSurface(e, !0);
		},
		hide: ({ owner: e, popup: t }) => {
			for (let e of this.columnSettles.values()) window.clearTimeout(e);
			this.columnSettles.clear(), this.wheelTurns.clear(), t.removeEventListener("wheel", this.onColumnWheel), e.classList.remove(a_);
		}
	});
	columnSettles = /* @__PURE__ */ new Map();
	wheelTurns = /* @__PURE__ */ new Map();
	onColumnWheel = (e) => this.handleColumnWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.arrive(this.root.querySelectorAll(mh)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = Tr(e.components, mh), n = e.propertyName === "Value" || e.propertyName === "EndValue";
			this.applyDisplay(t);
			for (let e of t) n && h_(e) && this.states.set(e, Tg(e)), this.isShowing(e) && this.renderSurface(e);
		}), j(this.root, mh, { attributeFilter: [...Ih] }, (e) => {
			for (let t of e) this.applyDisplay([t]), this.isShowing(t) && this.renderSurface(t);
		}), j(this.root, mh, { childList: !0 }, (e) => this.arrive(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), this.root.addEventListener("focusin", (e) => this.handleFieldFocus(e), !0), this.root.addEventListener("mouseover", (e) => this.handleDayHover(e), !0), this.root.addEventListener("mouseout", (e) => this.handleDayHover(e), !0), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), this.root.addEventListener("scroll", (e) => this.handleColumnScroll(e), !0), this.root.addEventListener("blur", (e) => this.handleFieldBlur(e), !0), C.onChange(() => this.applyWords());
	}
	arrive(e) {
		let t = [...e];
		this.applyDisplay(t);
		for (let e of t) h_(e) && g_(e)?.firstElementChild === null && this.renderSurface(e);
	}
	applyWords() {
		let e = [...this.root.querySelectorAll(mh)], t = C.temporal;
		if (t !== null && C.language !== this.drawnLanguage) {
			this.drawnLanguage = C.language;
			for (let n of e) Wh(n, t);
		}
		this.applyDisplay(e);
		for (let t of e) this.isShowing(t) && this.renderSurface(t);
	}
	get openPicker() {
		return this.popups.current;
	}
	isShowing(e) {
		return e === this.openPicker || h_(e);
	}
	calendarFor(e) {
		if (!(e instanceof Element)) return null;
		let t = e.closest(`.${o_}`)?.closest(".ui-calendar") ?? null;
		if (t !== null) return t;
		let n = this.openPicker;
		return n !== null && g_(n)?.contains(e) === !0 ? n : null;
	}
	applyDisplay(e) {
		for (let t of e) {
			ag(t);
			let e = Qr(zh(t), j_());
			for (let n of t.querySelectorAll(`.${r_}`)) {
				if (n.placeholder !== e && (n.placeholder = e), n === document.activeElement && this.written.has(n)) continue;
				this.written.add(n);
				let r = Qh(t, Xh(n))?.value ?? "", i = dg(r, Rh(t));
				if (i !== null) {
					n.value = Hr(i, zh(t), Hh(t));
					continue;
				}
				r.length === 0 && (n.value = "");
			}
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement) || !e.target.classList.contains(r_)) return;
		let t = e.target.closest(`.${F}`), n = t === null ? null : Qh(t, Xh(e.target));
		if (t === null || n === null) return;
		let r = rg(t, e.target.value), i = dg(r, Rh(t)), a = i === null ? r : fg(cg(t, i), Rh(t));
		if (__(t, a)) {
			let n = I(t, Xh(e.target));
			e.target.value = n === null ? "" : Hr(n, zh(t), Hh(t));
			return;
		}
		Xh(e.target) && (this.getState(t).choosingEnd = !1), n.value = a, n.dispatchEvent(new Event("change", { bubbles: !0 })), ig(t), this.applyDisplay([t]);
	}
	handleFieldFocus(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(r_)) return;
		let t = e.target.closest(`.${F}`);
		t !== null && Yh(t) && (this.getState(t).activeEnd = Xh(e.target) ? "end" : "start");
	}
	handleDayHover(e) {
		let t = this.calendarFor(e.target);
		if (t === null || !(e.target instanceof Element) || !Yh(t)) return;
		let n = e.type === "mouseover" ? e.target.closest(`[${Cg}]`) : null, r = this.getState(t), i = n === null ? null : dg(n.getAttribute("data-ui-temporal-day") ?? "", "date");
		(r.hoverDay?.getTime() ?? null) !== (i?.getTime() ?? null) && (r.hoverDay = i, Wg(t, r));
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`[${Cg}], .${R}`) : null, n = this.calendarFor(t);
		n === null || t === null || t === document.activeElement || t.matches(":disabled") || (t.classList.contains(R) ? P_(t) : this.followPointer(n, t));
	}
	followPointer(e, t) {
		let n = g_(e), r = dg(t.getAttribute("data-ui-temporal-day") ?? "", "date");
		n === null || r === null || !n.contains(document.activeElement) || (this.getState(e).focusedDay = r, D([...n.querySelectorAll(`.${yg}`)], t), Oo(t));
	}
	handleFieldBlur(e) {
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains(r_)) return;
		let t = e.target.closest(`.${F}`);
		t !== null && this.applyDisplay([t]);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${u_}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${F}`));
			return;
		}
		let n = this.calendarFor(e.target);
		if (n === null) return;
		let r = e.target.closest(`[${Sg}]`);
		if (r !== null) {
			e.preventDefault(), this.applyNavigation(n, r.getAttribute("data-ui-temporal-nav") ?? "");
			return;
		}
		let i = e.target.closest(`[${Cg}]`);
		if (i !== null) {
			e.preventDefault(), this.chooseDay(n, i.getAttribute("data-ui-temporal-day") ?? "");
			return;
		}
		let a = e.target.closest(`[${f_}]`);
		if (a !== null) {
			e.preventDefault();
			let t = a.closest(`[${d_}]`)?.getAttribute(d_);
			t != null && this.chooseTime(n, t, Number(a.getAttribute(f_)));
		}
	}
	applyNavigation(e, t) {
		let n = this.getState(e);
		if (Pg(e, n, t)) {
			this.renderSurface(e);
			return;
		}
		switch (t) {
			case "now":
				n.choosingEnd = !1, this.commit(e, sg(e), n.activeEnd === "end");
				return;
			case "clear":
				this.commit(e, null), Yh(e) && this.commit(e, null, !0), n.activeEnd = "start", n.choosingEnd = !1, this.close();
				return;
			case "done":
				this.close();
				return;
			default: return;
		}
	}
	chooseDay(e, t) {
		let n = dg(t, "date");
		if (n === null || E(e) || w(e) || !tg(eg(e), t)) return;
		let r = this.getState(e);
		h_(e) && Yh(e) && !r.choosingEnd && I(e, !1) !== null && I(e, !0) !== null && (r.activeEnd = "start");
		let i = Qh(e, !1), a = `${i?.value ?? ""}|${Qh(e, !0)?.value ?? ""}`;
		Fg(e, r, n), h_(e) && `${i?.value ?? ""}|${Qh(e, !0)?.value ?? ""}` === a && i?.dispatchEvent(new Event("change", { bubbles: !0 })), this.applyDisplay([e]), this.renderSurface(e);
	}
	chooseTime(e, t, n) {
		if (!Number.isFinite(n)) return;
		let r = Yh(e) && this.getState(e).activeEnd === "end", i = new Date(I(e, r) ?? sg(e));
		t === "hour" ? i.setHours(n) : t === "minute" ? i.setMinutes(n) : i.setSeconds(n), this.commit(e, i, r);
	}
	commit(e, t, n = !1) {
		ng(e, t, n), ig(e), this.applyDisplay([e]), this.isShowing(e) && this.renderSurface(e);
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		if (e.key === "ArrowDown" && e.target instanceof HTMLElement && e.target.classList.contains(r_)) {
			e.preventDefault(), this.toggle(e.target.closest(`.${F}`), Xh(e.target) ? "end" : "start");
			return;
		}
		let t = this.calendarFor(e.target);
		if (t === null) return;
		if (e.target instanceof HTMLElement && e.target.classList.contains(R)) {
			F_(e);
			return;
		}
		if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("ui-temporal-input__day")) return;
		let n = dg(e.target.getAttribute("data-ui-temporal-day") ?? "", "date");
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault(), this.chooseDay(t, fg(n, "date"));
			return;
		}
		let r = Rg(t, n, e.key);
		if (r === null) return;
		e.preventDefault();
		let i = this.getState(t);
		i.focusedDay = r, i.view = Kg(r), this.renderSurface(t, !0);
	}
	handleColumnScroll(e) {
		if (this.openPicker === null || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${s_}`);
		t === null || !this.openPicker.contains(t) || (window.clearTimeout(this.columnSettles.get(t)), this.columnSettles.set(t, window.setTimeout(() => {
			this.columnSettles.delete(t), this.chooseCentredTime(t);
		}, l_)));
	}
	handleColumnWheel(e) {
		if (this.openPicker === null || e.deltaY === 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${s_}`), n = t?.getAttribute(d_) ?? null;
		if (t === null || n === null || !this.openPicker.contains(t)) return;
		e.preventDefault();
		let { steps: r, carried: i } = t_(this.wheelTurns.get(n) ?? 0, e_(e).y);
		if (this.wheelTurns.set(n, i), r === 0) return;
		let a = [...t.querySelectorAll(`.${R}`)].filter((e) => !e.disabled), o = a.findIndex((e) => e.classList.contains(`${R}--selected`)), s = a[Math.min(a.length - 1, Math.max(0, Math.max(0, o) + r))];
		s !== void 0 && !s.classList.contains(`${R}--selected`) && this.chooseTime(this.openPicker, n, Number(s.getAttribute(f_)));
	}
	chooseCentredTime(e) {
		let t = this.openPicker;
		if (t === null || !t.contains(e)) return;
		let n = Number(e.getAttribute(p_));
		if (Number.isFinite(n) && Math.abs(e.scrollTop - n) <= 1) return;
		let r = e.getAttribute(d_), i = E_(e);
		if (!(r === null || i === null || i.classList.contains(`${R}--selected`))) {
			if (i.matches(":disabled")) {
				w_(t);
				return;
			}
			this.chooseTime(t, r, Number(i.getAttribute(f_)));
		}
	}
	toggle(e, t) {
		let n = e?.querySelector(`.${i_}`) ?? null;
		if (e === null || n === null) return;
		if (this.openPicker === e) {
			this.close();
			return;
		}
		this.close();
		let r = this.getState(e);
		r.activeEnd = Yh(e) ? t ?? (I(e, !1) === null ? "start" : I(e, !0) === null ? "end" : r.activeEnd) : "start", r.hoverDay = null, r.choosingEnd = !1;
		let i = I(e, r.activeEnd === "end") ?? Zh(e);
		r.pane = "days", r.view = Kg(i ?? cg(e, /* @__PURE__ */ new Date())), r.focusedDay = i;
		let a = e.querySelector(`[${u_}]`);
		this.popups.open({
			owner: e,
			popup: n,
			anchor: e.querySelector(".ui-temporal-input__row") ?? e,
			placement: {
				placement: "bottom-end",
				gap: c_
			},
			openers: a === null ? [] : [a],
			returnFocus: () => N_(e, this.getState(e).activeEnd === "end")
		});
	}
	close() {
		this.popups.close();
	}
	getState(e) {
		let t = this.states.get(e);
		return t === void 0 && (t = Tg(e), this.states.set(e, t)), t;
	}
	renderSurface(e, t = !1) {
		let n = g_(e);
		if (n === null) return;
		let r = h_(e), i = Rh(e), a = this.getState(e), o = Hh(e), s = Yh(e), c = I(e, s && a.activeEnd === "end"), l = D_(n), u = O_(n), d = n.contains(document.activeElement);
		if (n.replaceChildren(), s && n.append(Ng(a)), r) n.append(Eg(e, a, o, c));
		else {
			let t = L("div", `${F}__panes`);
			t.append(Eg(e, a, o, c)), i === "date-time" && t.append(v_(e, c)), n.append(t, A_(i));
		}
		let f = u === null ? null : n.querySelector(`[${Sg}="${CSS.escape(u)}"]:not(:disabled)`);
		Ug(n, a, c, t || d && l === null && f === null), Wg(e, a), r || (C_(n), w_(n), k_(n, l)), f !== null && A(f), r || this.popups.reposition(e);
	}
};
function h_(e) {
	return e.classList.contains(ph);
}
function g_(e) {
	return e.querySelector(`.${h_(e) ? o_ : i_}`);
}
function __(e, t) {
	let n = eg(e), r = n.markedOnly ? dg(t, Rh(e)) : null;
	return r !== null && !n.marked.has(fg(r, "date"));
}
function v_(e, t) {
	let n = Bh(e), r = L("div", `${F}__time`), i = L("div", `${F}__time-columns`);
	for (let r of y_(n)) i.append(S_(e, r, b_(n, r), t));
	return r.append(i), r;
}
function y_(e) {
	return e.unit === "second" ? [
		"hour",
		"minute",
		"second"
	] : e.unit === "hour" ? ["hour"] : ["hour", "minute"];
}
function b_(e, t) {
	return t === "hour" ? e.hour : t === "minute" ? e.minute : e.second;
}
function x_(e, t) {
	return e === null ? null : t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function S_(e, t, n, r) {
	let i = L("div", s_);
	i.setAttribute(d_, t), i.setAttribute("role", "listbox"), i.setAttribute("aria-label", C.text(t === "hour" ? "ui.picker.hours" : t === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"));
	let a = t === "hour" ? 24 : 60, o = x_(r, t), s = t === "hour" && Gh(zh(e)), c = Hh(e), l = null;
	for (let u = 0; u < a; u += n) {
		let n = L("button", R);
		n.type = "button", n.tabIndex = -1, n.textContent = t === "hour" ? Kh(u, s, c) : String(u).padStart(2, "0"), n.setAttribute(f_, String(u)), n.setAttribute("role", "option"), n.setAttribute("aria-selected", u === o ? "true" : "false"), u === o && n.classList.add(`${R}--selected`), z_(e, t, u, r) ? n.disabled = !0 : (l === null || u === o) && (l = n), i.append(n);
	}
	return l !== null && (l.tabIndex = 0), i;
}
function C_(e) {
	let t = e.querySelector(`.${F}__calendar`), n = e.querySelector(`.${F}__time-columns`);
	t !== null && n !== null && (n.style.maxHeight = `${t.clientHeight}px`);
}
function w_(e) {
	for (let t of e.querySelectorAll(`.${s_}`)) {
		let e = t.querySelector(`.${R}--selected`) ?? t.firstElementChild;
		if (!(e instanceof HTMLElement)) continue;
		let n = Math.max(0, (t.clientHeight - e.getBoundingClientRect().height) / 2);
		t.style.paddingTop = `${n}px`, t.style.paddingBottom = `${n}px`, T_(t, e), t.setAttribute(p_, String(t.scrollTop));
	}
}
function T_(e, t) {
	let n = t.getBoundingClientRect();
	e.scrollTop += n.top - e.getBoundingClientRect().top - (e.clientHeight - n.height) / 2;
}
function E_(e) {
	let t = e.getBoundingClientRect().top + e.clientHeight / 2, n = null, r = Infinity;
	for (let i of e.querySelectorAll(`.${R}`)) {
		let e = i.getBoundingClientRect(), a = Math.abs(e.top + e.height / 2 - t);
		a < r && (r = a, n = i);
	}
	return n;
}
function D_(e) {
	let t = document.activeElement;
	return !(t instanceof HTMLElement) || !e.contains(t) || !t.classList.contains(R) ? null : t.closest(`.${s_}`)?.getAttribute(d_) ?? null;
}
function O_(e) {
	let t = document.activeElement;
	return t instanceof HTMLElement && e.contains(t) ? t.getAttribute(Sg) : null;
}
function k_(e, t) {
	if (t === null) return;
	let n = e.querySelector(`.${s_}[${d_}="${t}"]`)?.querySelector(`.${R}--selected`) ?? null;
	n !== null && A(n);
}
function A_(e) {
	let t = L("div", `${F}__popup-footer`);
	return t.append(Gg("now", C.text(e === "date" ? "ui.picker.today" : "ui.picker.now"))), t.append(Gg("clear", C.text("ui.picker.clear"))), t.append(Gg("done", C.text("ui.picker.done"))), t;
}
function j_() {
	return {
		year: M_("ui.picker.letter.year", Zr.year),
		month: M_("ui.picker.letter.month", Zr.month),
		day: M_("ui.picker.letter.day", Zr.day),
		hour: M_("ui.picker.letter.hour", Zr.hour),
		minute: M_("ui.picker.letter.minute", Zr.minute),
		second: M_("ui.picker.letter.second", Zr.second)
	};
}
function M_(e, t) {
	let n = C.lookup(e);
	return n === void 0 || n.trim().length === 0 ? t : n;
}
function N_(e, t) {
	for (let n of e.querySelectorAll(`.${r_}`)) if (Xh(n) === t) return n;
	return e.querySelector(`.${r_}`);
}
function P_(e) {
	let t = document.activeElement;
	t instanceof HTMLElement && t.classList.contains(R) && Oo(e);
}
function F_(e) {
	let t = e.target, n = t.closest(`.${s_}`);
	if (n === null) return;
	let r = e.key === "ArrowLeft" || e.key === "ArrowRight" ? L_(n, e.key === "ArrowRight" ? 1 : -1) : I_(n, t, e.key);
	r !== null && (e.preventDefault(), r.focus({ preventScroll: !0 }), R_(r));
}
function I_(e, t, n) {
	return Ea({
		key: n,
		items: [...e.querySelectorAll(`.${R}`)],
		current: t,
		axis: "vertical",
		loop: !1
	});
}
function L_(e, t) {
	let n = [...e.parentElement?.querySelectorAll(`.${s_}`) ?? []], r = n[n.indexOf(e) + t];
	return r === void 0 ? null : r.querySelector(`.${R}--selected`) ?? r.querySelector(`.${R}:not(:disabled)`);
}
function R_(e) {
	let t = e.closest(`.${s_}`);
	t !== null && T_(t, e);
}
function z_(e, t, n, r) {
	let i = $h(e, Sh), a = $h(e, Ch);
	if (i === null && a === null) return !1;
	let o = new Date(r ?? /* @__PURE__ */ new Date());
	t === "hour" ? o.setHours(n) : t === "minute" ? o.setMinutes(n) : o.setSeconds(n);
	let s = new Date(o), c = new Date(o);
	return t === "hour" ? (s.setMinutes(0, 0, 0), c.setMinutes(59, 59, 999)) : t === "minute" && (s.setSeconds(0, 0), c.setSeconds(59, 999)), i !== null && c.getTime() < i.getTime() || a !== null && s.getTime() > a.getTime();
}
//#endregion
//#region src/interactions/theme-switcher-engine.ts
var B_ = "[data-ui-theme-switcher]", V_ = class {
	options;
	root;
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e));
	}
	handleClick(e) {
		let t = e.target instanceof Element ? e.target.closest(B_) : null;
		t === null || t.hasAttribute("disabled") || (e.preventDefault(), this.options.effects.apply({
			effect: {
				kind: qn.SetTheme,
				mode: H_() === "dark" ? "Light" : "Dark"
			},
			dom: this.options.dom
		}));
	}
};
function H_() {
	let e = document.documentElement.getAttribute(cn);
	return e === "light" || e === "dark" ? e : window.matchMedia?.("(prefers-color-scheme: dark)").matches === !0 ? "dark" : "light";
}
//#endregion
//#region src/interactions/language-switcher-engine.ts
var U_ = `[${dn}]`, W_ = "ui-language-switcher__trigger", G_ = "ui-language-switcher__label-text", K_ = "ui-language-switcher__label-text--current", q_ = "ui-language-switcher__label-text--page", J_ = "ui-language-switcher__menu", Y_ = "ui-language-switcher__choice", X_ = "ui-language-switcher--open", Z_ = 4, Q_ = "ui.language.switch", $_ = class {
	options;
	root;
	menus = new Fc({
		show: ({ owner: e }) => e.classList.add(X_),
		hide: ({ owner: e }) => e.classList.remove(X_),
		closesWhenReadOnly: !1
	});
	constructor(e) {
		this.options = e, this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e)), C.onChange(() => this.showLanguage(C.language));
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Y_}`), n = e.target.closest(U_);
		if (n === null) return;
		if (t !== null) {
			e.preventDefault(), this.choose(n, t.getAttribute(fn));
			return;
		}
		let r = e.target.closest(`.${W_}`);
		if (r === null || w(r)) return;
		e.preventDefault();
		let i = ev(n);
		if (i.length === 2) {
			let e = C.requestedLanguage;
			this.choose(n, i.map((e) => e.getAttribute("data-ui-language")).find((t) => t !== e) ?? null);
			return;
		}
		this.menus.isOpen(n) ? this.menus.close(n) : i.length > 2 && this.openMenu(n, r);
	}
	handleKeyDown(e) {
		if (e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(U_);
		if (t === null) return;
		let n = ev(t), r = e.target.closest(`.${W_}`);
		if (r !== null && n.length > 2 && !this.menus.isOpen(t) && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
			e.preventDefault(), this.openMenu(t, r, e.key === "ArrowUp");
			return;
		}
		if (!this.menus.isOpen(t) || !Da(e.key, "vertical")) return;
		let i = e.target instanceof HTMLElement && n.includes(e.target) ? e.target : null, a = Ea({
			key: e.key,
			items: n,
			current: i,
			axis: "vertical"
		});
		a !== null && (e.preventDefault(), a.focus());
	}
	handlePointerMove(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Y_}`);
		if (t === null || t === document.activeElement || w(t)) return;
		let n = t.closest(U_);
		n !== null && this.menus.isOpen(n) && Oo(t);
	}
	openMenu(e, t, n = !1) {
		let r = e.querySelector(`:scope > .${J_}`);
		if (r === null) return;
		let i = ev(e), a = i.find((e) => e.getAttribute("aria-checked") === "true");
		this.menus.open({
			owner: e,
			popup: r,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: Z_
			},
			openers: [t],
			focus: a ?? !1
		}) && a === void 0 && Bo(r, i, n);
	}
	choose(e, t) {
		this.menus.close(e), t !== null && t.length !== 0 && this.options.effects.apply({
			effect: {
				kind: qn.SetLanguage,
				language: t
			},
			dom: this.options.dom
		});
	}
	showLanguage(e) {
		for (let t of this.root.querySelectorAll(U_)) {
			let n = t.querySelector(`:scope > .${W_}`);
			if (n === null) continue;
			for (let n of ev(t)) n.setAttribute("aria-checked", n.getAttribute("data-ui-language") === e ? "true" : "false");
			let r = e.toUpperCase();
			for (let t of n.querySelectorAll(`.${G_}`)) {
				let n = t.getAttribute(fn) === e;
				t.classList.toggle(K_, n), t.classList.contains(q_) && t.toggleAttribute("hidden", !n), n && (r = t.textContent ?? r);
			}
			C.write(n, "aria-label", Q_, { language: r });
		}
	}
};
function ev(e) {
	return [...e.querySelectorAll(`:scope > .${J_} > .${Y_}`)];
}
//#endregion
//#region src/interactions/context-menu-engine.ts
var tv = "data-ui-context-menu-owner", nv = xe, rv = "ui-context-menu--open", iv = "ui-menu", av = `.ui-menu-item:not(${wt})`, ov = "ui-context-menu-opening", sv = Et, cv = class {
	root;
	closed = null;
	menus = new Fc({
		show: ({ popup: e }) => e.classList.add(rv),
		hide: ({ popup: e }, t) => {
			e.classList.remove(rv), this.closed = e, t === "outside" && uv();
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
		let n = t.closest(`[${me}]`), r = t.closest(`[${Se}]`);
		for (let i = t.closest(`[${tv}]`); i !== null; i = i.parentElement?.closest(`[${tv}]`) ?? null) {
			if (n !== null && i.contains(n)) return;
			let a = r !== null && i.contains(r) ? r.getAttribute("data-ui-context-menu-use") ?? "" : "", o = [a.length > 0 ? dv(i, a) : null, dv(i, "")].filter((e) => e !== null);
			if (o.length === 0 || w(i)) continue;
			if (fv(i)) return;
			let s = o.find((e) => this.prepare(e, t));
			if (s !== void 0) {
				e.preventDefault(), this.open(i, s, e.clientX, e.clientY);
				return;
			}
		}
	}
	prepare(e, t) {
		let n = new CustomEvent(ov, {
			bubbles: !0,
			cancelable: !0,
			detail: { target: t }
		});
		return e.dispatchEvent(n);
	}
	open(e, t, n, r) {
		this.menus.close(), this.closed !== null && (As(this.closed), this.closed = null);
		let i = (document.activeElement instanceof HTMLElement && document.activeElement !== document.body ? document.activeElement : null) ?? To();
		if (!this.menus.open({
			owner: e,
			popup: t,
			returnFocus: () => (i === null ? null : Vo(i)) ?? Vo(e)
		})) return;
		let a = t.getBoundingClientRect();
		t.style.left = `${fc(n, a.width, window.innerWidth)}px`, t.style.top = `${fc(r, a.height, window.innerHeight)}px`, lv(t);
	}
	handleInside(e) {
		this.openMenu === null || !e.composedPath().includes(this.openMenu) || e.target instanceof Element && e.target.closest(sv) !== null || this.menus.close();
	}
};
function lv(e) {
	let t = e.querySelector(`.${iv}`);
	t !== null && Bo(e, M(t, av, `.${iv}`));
}
function uv() {
	let e = (e) => {
		e.target instanceof Element && e.target.closest(`${ho}, [contenteditable='true']`) === null && e.preventDefault();
	};
	document.addEventListener("mousedown", e, {
		capture: !0,
		once: !0
	}), setTimeout(() => document.removeEventListener("mousedown", e, !0));
}
function dv(e, t) {
	for (let n of e.querySelectorAll(`[${nv}]`)) if ((n.getAttribute(nv) ?? "") === t && n.closest(`[${tv}]`) === e) return n;
	return null;
}
function fv(e) {
	if (e.hasAttribute("data-ui-no-context-menu")) return !0;
	let t = e.closest(`[${h}]`), n = t?.parentElement?.hasAttribute("data-ui-items-host") === !0 ? t.parentElement : null;
	return t !== null && (t.hasAttribute("data-ui-no-context-menu") || n?.parentElement?.hasAttribute("data-ui-no-context-menu") === !0);
}
//#endregion
//#region src/interactions/keyboard-shortcut.ts
function pv(e) {
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
		default: o = yv(e);
	}
	return o === null ? null : {
		code: o,
		ctrl: n,
		shift: r,
		alt: i,
		meta: a
	};
}
function mv(e, t, n = gv()) {
	return t.code !== e.code || t.shiftKey !== e.shift || t.altKey !== e.alt ? !1 : e.ctrl && !e.meta && n ? t.ctrlKey !== t.metaKey : t.ctrlKey === e.ctrl && t.metaKey === e.meta;
}
var hv = null;
function gv() {
	return hv === null && (hv = _v()), hv;
}
function _v() {
	if (typeof navigator > "u") return !1;
	let e = navigator.userAgentData?.platform;
	return /mac/i.test(e ?? navigator.platform ?? "");
}
function vv(e) {
	return [
		e.ctrl ? "ctrl" : "",
		e.shift ? "shift" : "",
		e.alt ? "alt" : "",
		e.meta ? "meta" : "",
		e.code
	].filter((e) => e.length > 0).join("+");
}
function yv(e) {
	if (e.length === 1) {
		let t = e.toUpperCase();
		return t >= "A" && t <= "Z" ? `Key${t}` : t >= "0" && t <= "9" ? `Digit${t}` : bv[t] ?? null;
	}
	let t = e.length === 0 ? "" : e[0].toUpperCase() + e.slice(1).toLowerCase();
	return /^F([1-9]|1[0-9]|2[0-4])$/.test(t.toUpperCase()) ? t.toUpperCase() : bv[t] ?? null;
}
var bv = {
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
}, xv = "ne.ui", Sv = "boot", Cv = /* @__PURE__ */ new Set(), wv = class {
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
		let r = this.resolveKey(e, Sv);
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
		let n = e.getAttribute(ke);
		if (n === null || n.length === 0) {
			let n = `${e.tagName}:${t}`;
			return Cv.has(n) || (Cv.add(n), l("client state is not kept for a component with no authored id.", {
				slot: t,
				component: e
			})), null;
		}
		return `${xv}:${n}:${t}`;
	}
}, Tv = "ui-menu", Ev = "ui-menu--nested", Dv = "ui-menu-item--selected", Ov = "ui-menu__submenu", kv = ft, Av = mt, jv = "data-ui-menu-flyout", Mv = "data-ui-menu-unfolded", Nv = pt, Pv = "menu-open-group", Fv = Ne("click"), Iv = class {
	root;
	store = new wv();
	seenCollapsed = /* @__PURE__ */ new WeakMap();
	flyouts = new Fc({
		show: ({ owner: e, popup: t }) => {
			e.setAttribute(Av, ""), t.setAttribute(jv, "");
		},
		hide: ({ owner: e, popup: t }) => {
			e.removeAttribute(Av), window.setTimeout(() => {
				this.flyouts.isOpen(e) || t.removeAttribute(jv);
			}, Os.fast);
		},
		closesWhenReadOnly: !1,
		onPress: !0,
		onWindowBlur: !0
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.reconcileEach(this.root.querySelectorAll(`.${Tv}`)), j(this.root, `.${Tv}`, {
			childList: !0,
			attributeFilter: [dt]
		}, (e) => this.reconcileEach(e));
		for (let e of this.root.querySelectorAll(`[${kv}]`)) Lv(e);
		j(this.root, `[${kv}]`, {
			childList: !0,
			attributeFilter: [Av]
		}, (e) => {
			for (let t of e) Lv(t);
		});
	}
	reconcileEach(e) {
		for (let t of e) {
			let e = Bv(t), n = this.seenCollapsed.get(t);
			n !== e && (this.seenCollapsed.set(t, e), n === void 0 ? this.restore(t, e) : this.handleCollapsedChange(t, e));
		}
	}
	restore(e, t) {
		t ? this.closeGroups(e) : this.openResolvedGroup(e);
	}
	handleCollapsedChange(e, t) {
		this.flyouts.close(), Rv(e), this.closeGroups(e), t || this.openResolvedGroup(e);
		for (let t of e.querySelectorAll(`[${kv}]`)) Lv(t);
	}
	openResolvedGroup(e) {
		let t = this.groupOf(e.querySelector(`.${Dv}`), e);
		if (t !== null && !t.hasAttribute(Nv)) {
			this.openInline(t);
			return;
		}
		let n = e.classList.contains(Ev) ? null : this.store.read(e, Pv), r = n === null ? null : this.findGroup(e, n);
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
		let a = i.closest(`.${Tv}`);
		a !== null && (Bv(a) || i.hasAttribute(Nv) ? this.toggleFlyout(a, i, t) : this.toggleInline(a, i));
	}
	toggleInline(e, t) {
		let n = e.classList.contains(Ev);
		if (e.setAttribute(Mv, ""), t.closest("[data-ui-menu-searching]") !== null) {
			t.toggleAttribute(Av);
			return;
		}
		if (t.hasAttribute(Av)) {
			t.removeAttribute(Av), n || this.store.write(e, Pv, null);
			return;
		}
		this.closeGroups(e), this.openInline(t), n || this.store.write(e, Pv, t.getAttribute(h));
	}
	openInline(e) {
		e.setAttribute(Av, "");
	}
	closeGroups(e) {
		for (let t of e.querySelectorAll(`[${kv}][${Av}]`)) t.hasAttribute(Nv) || t.removeAttribute(Av);
	}
	toggleFlyout(e, t, n) {
		let r = this.submenuOf(t);
		if (r === null) return;
		let i = this.flyouts.isOpen(t);
		if (this.flyouts.close(), i || (Rv(e), this.closeGroups(e), !this.flyouts.open({
			owner: t,
			popup: r,
			anchor: n,
			placement: {
				placement: `${zv(e)}-start`,
				gap: 4
			}
		}))) return;
		let a = r.querySelector(`:scope > .${Tv}`);
		a !== null && !Eo() && Bo(a, M(a, `.${_}:not(${wt})`, `.${Tv}`));
	}
	findGroup(e, t) {
		for (let n of e.querySelectorAll(`[${kv}]`)) if (n.getAttribute("data-ui-key") === t) return n;
		return null;
	}
	ownGroupOf(e) {
		return e.matches(Tt) ? e.parentElement : null;
	}
	groupOf(e, t) {
		let n = e?.closest(`[${kv}]`) ?? null;
		return n !== null && t.contains(n) ? n : null;
	}
	submenuOf(e) {
		return e.querySelector(`:scope > .${Ov}`);
	}
};
function Lv(e) {
	let t = e.querySelector(`:scope > .${_}`), n = e.closest(`.${Tv}`);
	t !== null && (t.setAttribute(Fv, ""), t.setAttribute(Pe, ""), t.setAttribute("aria-expanded", e.hasAttribute(Av) ? "true" : "false"), e.hasAttribute(Nv) || n !== null && Bv(n) ? t.setAttribute("aria-haspopup", "menu") : t.removeAttribute("aria-haspopup"));
}
function Rv(e) {
	for (let t of e.querySelectorAll(`[${jv}]`)) t.removeAttribute(jv);
}
function zv(e) {
	return e.classList.contains("ui-side--right") ? "left" : e.classList.contains("ui-side--top") ? "bottom" : e.classList.contains("ui-side--bottom") ? "top" : "right";
}
function Bv(e) {
	return e.hasAttribute("data-ui-collapsed") || e.classList.contains("ui-menu--rail");
}
//#endregion
//#region src/rendering/inline-markup.ts
var Vv = {
	None: 0,
	Bold: 1,
	Italic: 2,
	Underline: 4,
	Strikethrough: 8,
	Code: 16
}, Hv = "\\", Uv = "`", Wv = "!", Gv = "{", Kv = "}", qv = "ui-text__fold", Jv = "ui-text__fold-toggle", Yv = "ui-text__fold-content", Xv = 8;
function Zv(e) {
	if (e == null || e.length === 0) return [];
	let t = [], n = { value: "" };
	return ly(new vy(e), 0, e.length, Vv.None, null, t, n), uy(t, n, Vv.None, null), t;
}
function Qv(e) {
	return Zv(e).map((e) => ry(e) ? `${e.fold} ${Qv(e.text)}` : e.text).join("");
}
function $v(e) {
	let t = "";
	for (let n of e) t += xy(n) ? Hv + n : n;
	return t;
}
function ey(e, t, n = {}) {
	let r = Zv(t);
	if (r.length === 0) {
		e.textContent = "";
		return;
	}
	if (r.length === 1 && ty(r[0])) {
		e.textContent = r[0].text;
		return;
	}
	e.replaceChildren(iy(r, n));
}
function ty(e) {
	return e.styles === Vv.None && e.url === null && !ny(e) && !ry(e);
}
function ny(e) {
	return e.icon !== null && e.icon !== void 0 && e.icon.length > 0;
}
function ry(e) {
	return e.fold !== null && e.fold !== void 0;
}
function iy(e, t) {
	let n = document.createDocumentFragment();
	for (let r of e) n.append(ay(r, t));
	return n;
}
function ay(e, t) {
	if (ny(e)) return sy(e.icon);
	let n = ry(e) ? oy(e, t) : document.createTextNode(e.text);
	if ((e.styles & Vv.Code) !== 0) {
		let e = document.createElement("code");
		e.className = "ui-text__code", e.append(n), n = e;
	}
	if ((e.styles & Vv.Strikethrough) !== 0 && (n = cy("s", n)), (e.styles & Vv.Underline) !== 0 && (n = cy("u", n)), (e.styles & Vv.Italic) !== 0 && (n = cy("em", n)), (e.styles & Vv.Bold) !== 0 && (n = cy("strong", n)), e.url !== null) {
		let t = document.createElement("a");
		t.setAttribute("href", e.url), t.className = "ui-text__link", cu(e.url) && (t.setAttribute("target", "_blank"), t.setAttribute("rel", "noopener noreferrer")), t.append(n), n = t;
	}
	return n;
}
function oy(e, t) {
	let n = document.createElement("span"), r = document.createElement(t.staticFolds === !0 ? "span" : "button"), i = document.createElement("span");
	return n.className = t.staticFolds === !0 ? `${qv} ${qv}--static` : qv, r.className = Jv, r.textContent = e.fold ?? "", i.className = Yv, i.append(iy(Zv(e.text), t)), t.staticFolds === !0 ? (n.append(r, " ", i), n) : (r.setAttribute("type", "button"), r.setAttribute("aria-expanded", "false"), r.setAttribute(Pe, ""), n.append(r, i), n);
}
function sy(e) {
	let t = document.createElement("i");
	return t.className = "ui-text__icon-inline", Cu(t, e), t.setAttribute("aria-hidden", "true"), t;
}
function cy(e, t) {
	let n = document.createElement(e);
	return n.append(t), n;
}
function ly(e, t, n, r, i, a, o) {
	let s = e.text, c = t;
	for (; c < n;) {
		let t = s[c];
		if (t === Hv && c + 1 < n && xy(s[c + 1])) {
			o.value += s[c + 1], c += 2;
			continue;
		}
		let l = dy(e, c, n);
		if (l !== null) {
			uy(a, o, r, i), fy(s, c + 1, l, o), uy(a, o, r | Vv.Code, i), c = l + 1;
			continue;
		}
		let u = hy(e, c, n);
		if (u !== null) {
			uy(a, o, r, i), ly(e, c + u.markerLength, u.contentEnd, r | u.style, i, a, o), uy(a, o, r | u.style, i), c = u.contentEnd + u.markerLength;
			continue;
		}
		let d = py(e, c, n);
		if (d !== null) {
			uy(a, o, r, i), a.push({
				text: "",
				styles: r,
				url: i,
				icon: d.name
			}), c = d.iconEnd;
			continue;
		}
		let f = i === null ? gy(e, c, n) : null;
		if (f !== null) {
			uy(a, o, r, i), ly(e, f.labelStart, f.labelEnd, r, f.url, a, o), uy(a, o, r, f.url), c = f.linkEnd;
			continue;
		}
		let p = _y(e, c, n);
		if (p !== null) {
			uy(a, o, r, i), a.push({
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
function uy(e, t, n, r) {
	t.value.length !== 0 && (e.push({
		text: t.value,
		styles: n,
		url: r
	}), t.value = "");
}
function dy(e, t, n) {
	let r = e.text;
	if (r[t] !== Uv) return null;
	let i = t + 1;
	if (i >= n || Sy(r[i])) return null;
	let a = e.findClosingMarker(i, n, Uv, 1);
	return a > i ? a : null;
}
function fy(e, t, n, r) {
	for (let i = t; i < n; i++) {
		if (e[i] === Hv && i + 1 < n && xy(e[i + 1])) {
			r.value += e[i + 1], i++;
			continue;
		}
		r.value += e[i];
	}
}
function py(e, t, n) {
	let r = e.text;
	if (r[t] !== Wv || t + 1 >= n || r[t + 1] !== "[") return null;
	let i = t + 2, a = e.findClosingBracket(i, n);
	if (a <= i) return null;
	let o = r.slice(i, a);
	return my(o) ? {
		name: o,
		iconEnd: a + 1
	} : null;
}
function my(e) {
	return e.length > 0 && /^[A-Za-z0-9._-]+$/.test(e);
}
function hy(e, t, n) {
	let r = e.text, i = r[t];
	if (i !== "*" && i !== "_" && i !== "~") return null;
	let a = t + 1 < n && r[t + 1] === i, o, s;
	if (i === "*" && a) o = Vv.Bold, s = 2;
	else if (i === "*") o = Vv.Italic, s = 1;
	else if (i === "_" && a) o = Vv.Underline, s = 2;
	else if (i === "~" && a) o = Vv.Strikethrough, s = 2;
	else return null;
	let c = t + s;
	if (c >= n || Sy(r[c])) return null;
	let l = e.findClosingMarker(c, n, i, s);
	return l > c ? {
		style: o,
		markerLength: s,
		contentEnd: l
	} : null;
}
function gy(e, t, n) {
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
function _y(e, t, n) {
	let r = e.text;
	if (r[t] !== "[") return null;
	let i = e.findClosingBracket(t + 1, n);
	if (i <= t + 1 || i + 1 >= n || r[i + 1] !== Gv || e.hasOpeningBracket(t + 1, i)) return null;
	let a = i + 1, o = a + 1, s = e.findMatchingBrace(a, n);
	if (s <= o || e.braceDepth(a) > Xv) return null;
	let c = { value: "" };
	return fy(r, t + 1, i, c), {
		caption: c.value,
		contentStart: o,
		contentEnd: s
	};
}
var vy = class {
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
		return this.closeBrackets ??= this.next("]", !0), yy(this.closeBrackets[e], t);
	}
	hasOpeningBracket(e, t) {
		return this.openBrackets ??= this.next("[", !0), yy(this.openBrackets[e], t) >= 0;
	}
	findClosingParen(e, t) {
		return this.closeParens ??= this.next(")", !1), yy(this.closeParens[e], t);
	}
	findMatchingBrace(e, t) {
		return yy(this.braces()[e], t);
	}
	braceDepth(e) {
		return this.braces(), this.braceDepths[e];
	}
	findClosingMarker(e, t, n, r) {
		let i = by(n, r), a = this.closers[i] ?? this.buildClosers(n, r);
		this.closers[i] = a;
		let o = a[e + 1];
		if (r === 2) return o >= 0 && o + 1 < t ? o : -1;
		if (o >= 0 && o < t - 1) return o;
		let s = t - 1;
		return s > e && this.text[s] === n && !this.isEscaped(s) && !Sy(this.text[s - 1]) ? s : -1;
	}
	readLinkUrl(e, t) {
		if (this.linkLabel !== e) {
			let n = this.text.slice(e + 2, t).trim();
			this.linkLabel = e, this.linkUrl = au(n) ? n : null;
		}
		return this.linkUrl;
	}
	isEscaped(e) {
		if (this.escaped === null) {
			let e = new Uint8Array(this.text.length);
			for (let t = 1; t < this.text.length; t++) e[t] = +(this.text[t - 1] === Hv && e[t - 1] === 0);
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
			if (this.text[r] === Gv) n.push(r);
			else if (this.text[r] === Kv && n.length > 0) {
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
		if (e === 0 || this.text[e] !== t || this.isEscaped(e) || Sy(this.text[e - 1])) return !1;
		let r = e + 1 < this.text.length && this.text[e + 1] === t;
		return n === 2 ? r : !r;
	}
};
function yy(e, t) {
	return e >= 0 && e < t ? e : -1;
}
function by(e, t) {
	switch (e) {
		case "*": return t === 2 ? 0 : 1;
		case "_": return 2;
		case "~": return 3;
		default: return 4;
	}
}
function xy(e) {
	return e === "*" || e === "_" || e === "~" || e === "[" || e === "]" || e === "(" || e === ")" || e === Gv || e === Kv || e === Uv || e === Hv;
}
function Sy(e) {
	return e === " " || e === "	" || e === "\r" || e === "\n";
}
//#endregion
//#region src/interactions/element-visibility.ts
function Cy(e) {
	return getComputedStyle(e).display !== "none";
}
function wy(e) {
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
				if (e.overflowX !== "visible" && Ty(n, i, i + t.clientWidth, !0), e.overflowY !== "visible" && Ty(n, a, a + t.clientHeight, !1), Ey(n)) return !0;
			}
			r = e.position;
		}
	}
	return Ty(n, 0, window.innerWidth, !0), Ty(n, 0, window.innerHeight, !1), Ey(n);
}
function Ty(e, t, n, r) {
	r ? (e.left = Math.max(e.left, t), e.right = Math.min(e.right, n)) : (e.top = Math.max(e.top, t), e.bottom = Math.min(e.bottom, n));
}
function Ey(e) {
	return e.left > e.right || e.top > e.bottom;
}
//#endregion
//#region src/interactions/tooltip-engine.ts
var Dy = "ui-tooltip", Oy = "ui-tooltip", ky = "ui-tooltip--visible", Ay = "[aria-haspopup][aria-expanded=\"true\"]", jy = "top", My = 250, Ny = 200, Py = 300, Fy = 7, z = null, B = null, Iy = null, Ly = null, Ry = null, zy = 0, By = null, Vy = 0, Hy = 0, Uy = !1, Wy = /* @__PURE__ */ new Set();
function Gy(e) {
	Wy.add(e);
}
function Ky(e = document) {
	if (Uy) return;
	Uy = !0;
	let t = e instanceof Document ? e : document;
	t.addEventListener("pointerover", qy, !0), t.addEventListener("pointerout", Xy, !0), t.addEventListener("focusin", Zy, !0), t.addEventListener("focusout", Qy, !0), t.addEventListener("keydown", $y, !0), t.addEventListener("scroll", Yy, !0), t.addEventListener("pointerdown", eb, !0), t.addEventListener("click", tb, !0), window.addEventListener("blur", () => {
		Ly = null, bb(!0);
	});
}
function qy(e) {
	if (Jy(), nb(e.target)) {
		window.clearTimeout(Vy);
		return;
	}
	let t = rb(e.target);
	t !== null && t !== B && sb(t);
}
function Jy() {
	B === null || B.isConnected || (Ly = null, bb(!0));
}
function Yy(e) {
	if (Jy(), B === null) return;
	let t = e.target;
	t instanceof Node && !(t instanceof Document) && !t.contains(B) || wy(B) && (Ly = null, bb(!0));
}
function Xy(e) {
	if (Ly !== null || Ry !== null) return;
	let t = e.relatedTarget, n = B ?? By?.target ?? null;
	t instanceof Node && (n !== null && n.contains(t) || nb(t)) || (nb(e.target) || n !== null && e.target instanceof Node && n.contains(e.target)) && bb(!1);
}
function Zy(e) {
	if (e.target instanceof Element && e.target.hasAttribute("data-ui-pointer-focus")) return;
	let t = rb(e.target);
	t !== null && (Ly = e.target instanceof Element && e.target.closest("[data-ui-tooltip-mark]") !== null ? t : null, cb(t));
}
function Qy(e) {
	rb(e.target) === B && (Ly = null, bb(!0));
}
function $y(e) {
	e.key === "Escape" && B !== null && (Ly = null, bb(!0));
}
function eb(e) {
	if (nb(e.target)) return;
	let t = rb(e.target);
	if (t !== null && t.hasAttribute("data-ui-tooltip-press")) {
		if (Ry === t) {
			bb(!0);
			return;
		}
		Ly = null, bb(!0), cb(t), Ry = B;
		return;
	}
	Ly === null && bb(!0);
}
function tb(e) {
	rb(e.target)?.hasAttribute("data-ui-tooltip-press") === !0 && e.preventDefault();
}
function nb(e) {
	return z !== null && e instanceof Node && z.contains(e);
}
function rb(e) {
	if (!(e instanceof Element)) return null;
	let t = ib(e);
	for (let n of Wy) {
		let r = n.anchor(e);
		if (r !== null && (t === null || t !== r && t.contains(r)) && ob(r).length > 0) return r;
	}
	return t;
}
function ib(e) {
	let t = e.closest(`[${we}], [${Ee}]`);
	if (t === null) return null;
	let n = t.hasAttribute("data-ui-tooltip") ? t : t.querySelector(`[${we}]`);
	return n === null ? null : (n.getAttribute("data-ui-tooltip") ?? "").trim().length > 0 ? n : null;
}
function ab(e) {
	let t = (e.getAttribute("data-ui-tooltip") ?? "").trim();
	return t.length > 0 ? t : ob(e);
}
function ob(e) {
	for (let t of Wy) {
		if (t.anchor(e) !== e) continue;
		let n = t.words(e)?.trim() ?? "";
		if (n.length > 0) return n;
	}
	return "";
}
function sb(e, t) {
	if (Ly === null && Ry === null) {
		if (window.clearTimeout(Vy), By !== null && By.target === e) {
			By.words = t;
			return;
		}
		if (window.clearTimeout(zy), By = null, B !== null) {
			bb(!0), cb(e, t);
			return;
		}
		if (Date.now() - Hy < Py) {
			cb(e, t);
			return;
		}
		By = {
			target: e,
			words: t
		}, zy = window.setTimeout(() => {
			let e = By;
			By = null, e !== null && cb(e.target, e.words);
		}, My);
	}
}
function cb(e, t) {
	let n = (t ?? ab(e)).trim();
	if (n.length === 0 || !e.isConnected || lb(e) || wy(e)) return;
	window.clearTimeout(zy), window.clearTimeout(Vy), By = null;
	let r = xb();
	ey(r, n, { staticFolds: !0 }), r.classList.add(ky), B = e, db(ub(e)), r.setAttribute("data-ui-tooltip-text", Qv(n)), Hs(e, r), Us(e, r, {
		placement: yb(e),
		gap: Fy,
		arrow: !0
	});
}
function lb(e) {
	return e.matches(Ay) || e.querySelector(Ay) !== null;
}
function ub(e) {
	let t = document.activeElement;
	return t !== null && e.contains(t) ? t : e;
}
function db(e) {
	Iy !== null && Iy !== e && fb();
	let t = pb(e);
	t.includes(Oy) || e.setAttribute("aria-describedby", [...t, Oy].join(" ")), Iy = e;
}
function fb() {
	if (Iy === null) return;
	let e = pb(Iy).filter((e) => e !== Oy);
	e.length === 0 ? Iy.removeAttribute("aria-describedby") : Iy.setAttribute("aria-describedby", e.join(" ")), Iy = null;
}
function pb(e) {
	return (e.getAttribute("aria-describedby") ?? "").split(" ").filter((e) => e.length > 0);
}
function mb(e, t, n) {
	n?.delay === !0 && B !== e ? sb(e, t) : cb(e, t);
}
function hb() {
	bb(!0);
}
var gb = {
	show: mb,
	hide: hb
};
function _b(e) {
	Ly = e, cb(e);
}
function vb(e) {
	if (B === e) {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) {
			Ly = null, bb(!0);
			return;
		}
		cb(e);
	}
}
function yb(e) {
	if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length === 0) for (let t of Wy) {
		let n = t.anchor(e) === e ? t.placement?.(e) ?? null : null;
		if (n !== null) return n;
	}
	let t = e.getAttribute(Te);
	return t !== null && Ms(t) ? t : jy;
}
function bb(e) {
	window.clearTimeout(zy), window.clearTimeout(Vy), By = null;
	let t = () => {
		B !== null && (fb(), B = null, Ry = null, z !== null && (z.classList.remove(ky), Js(z)), Hy = Date.now());
	};
	e ? t() : Vy = window.setTimeout(t, Ny);
}
function xb() {
	return z !== null && z.isConnected ? z : (z = document.createElement("div"), z.id = Oy, z.className = Dy, z.setAttribute("role", "tooltip"), z.setAttribute("aria-hidden", "true"), document.body.append(z), z);
}
//#endregion
//#region src/interactions/menu-engine.ts
var Sb = "ui-menu", Cb = "ui-menu-item--selected", wb = "ui-context-menu", Tb = "ui-orientation--horizontal", Eb = `.${Ct} > .ui-menu__host > .ui-menu__item > .${_}`, Db = `${Eb}, ${`.ui-menu[${dt}] > .ui-menu__host > .ui-menu__item > .${_}`}`, Ob = ":scope > .ui-button__content > .ui-text__body > .ui-text__header > .ui-text__title", kb = "data-ui-menu-shortcut", Ab = "[role='menuitem'], [role='menuitemcheckbox']", jb = class {
	root;
	shortcuts = /* @__PURE__ */ new Map();
	shortcutsStale = !0;
	tabStopsScheduled = !1;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("keydown", (e) => this.handleEntryKeydown(e), !0), this.root.addEventListener("keydown", (e) => this.handleShortcutKeydown(e)), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e)), this.root.addEventListener("pointermove", (e) => this.handlePointerMove(e), !0), Gy(Mb), this.applyTabStops(), this.root instanceof Node && new MutationObserver((e) => {
			this.shortcutsStale = !0, e.some(Pb) && this.scheduleTabStops();
		}).observe(this.root, {
			childList: !0,
			subtree: !0,
			attributeFilter: [kb, _t]
		});
	}
	scheduleTabStops() {
		this.tabStopsScheduled || (this.tabStopsScheduled = !0, setTimeout(() => {
			this.tabStopsScheduled = !1, this.applyTabStops();
		}, 0));
	}
	applyTabStops() {
		for (let e of this.root.querySelectorAll(`.${Sb}`)) {
			let t = this.ownItems(e);
			t.length !== 0 && D(t, t.find((e) => e.classList.contains(Cb) && ka(e)) ?? t.find(ka) ?? t[0]);
		}
	}
	handleEntryKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_}`), n = t?.closest(`.${Sb}`) ?? null;
		if (t === null) {
			this.enterFromContainer(e);
			return;
		}
		if (n === null) return;
		if (e.key === "Enter" || e.key === " ") {
			Nb(e, t);
			return;
		}
		let r = this.ownItems(n), i = Ea({
			key: e.key,
			items: r,
			current: t,
			axis: n.classList.contains(Tb) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	enterFromContainer(e) {
		let t = e.target instanceof HTMLElement && e.target.getAttribute("role") === "menu" ? e.target : null, n = t === null ? null : t.matches(`.${Sb}`) ? t : t.querySelector(`.${Sb}`);
		if (n === null) return;
		let r = this.ownItems(n), i = Ea({
			key: e.key,
			items: r,
			current: null,
			axis: n.classList.contains(Tb) ? "horizontal" : "vertical"
		});
		i !== null && (e.preventDefault(), D(r, i), i.focus());
	}
	handleFocusIn(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${_}`), n = t?.closest(`.${Sb}`) ?? null;
		t !== null && n !== null && D(this.ownItems(n), t);
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${_}`) : null;
		if (t === null || t === document.activeElement || !t.matches(Ab) || t.matches(wt) || !ka(t)) return;
		let n = document.activeElement;
		(n instanceof HTMLElement && n.getAttribute("role") === "menu" && n.contains(t) || t.closest(`.${Sb}`)?.contains(n) === !0) && Oo(t);
	}
	handleShortcutKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || (this.shortcutsStale && this.rebuildShortcuts(), this.shortcuts.size === 0 || Fb(e))) return;
		let t = vc(this.root);
		for (let n of this.shortcuts.values()) if (!(n === null || !mv(n.shortcut, e))) {
			if (!ka(n.element) || t !== null && !t.contains(n.element)) return;
			e.preventDefault(), n.element.click();
			return;
		}
	}
	rebuildShortcuts() {
		this.shortcuts.clear(), this.shortcutsStale = !1;
		for (let e of this.root.querySelectorAll(`[${kb}]`)) {
			if (e.closest(`.${wb}`) !== null) continue;
			let t = pv(e.getAttribute(kb));
			if (t === null) {
				s("menu shortcut could not be parsed.", {
					element: e,
					value: e.getAttribute(kb)
				});
				continue;
			}
			let n = vv(t);
			if (!this.shortcuts.has(n)) {
				this.shortcuts.set(n, {
					shortcut: t,
					element: e
				});
				continue;
			}
			let r = this.shortcuts.get(n);
			r !== null && s("menu shortcut is claimed twice and will fire nothing.", {
				shortcut: e.getAttribute(kb),
				elements: [r?.element, e]
			}), this.shortcuts.set(n, null);
		}
	}
	ownItems(e) {
		return M(e, `.${_}:not(${wt})`, `.${Sb}`);
	}
}, Mb = {
	anchor: (e) => e.closest(Db),
	words: (e) => {
		if ((e.getAttribute("data-ui-tooltip") ?? "").trim().length > 0) return null;
		let t = e.querySelector(Ob), n = t?.textContent?.trim() ?? "";
		return t === null || n.length === 0 || e.matches(Eb) && t.scrollWidth <= t.clientWidth ? null : $v(n);
	},
	placement: (e) => {
		let t = e.closest(`.${Sb}`);
		return t === null ? null : zv(t);
	}
};
function Nb(e, t) {
	e.target !== t || e.ctrlKey || e.metaKey || e.altKey || t.matches(wt) || !ka(t) || t.hasAttribute("href") && e.key === "Enter" || (e.preventDefault(), e.repeat || t.click());
}
function Pb(e) {
	let t = e.target instanceof Element ? e.target : e.target.parentElement;
	if (t !== null && t.closest(`.${Sb}`) !== null) return !0;
	for (let t of e.addedNodes) if (t instanceof Element && (t.classList.contains(Sb) || t.querySelector(`.${Sb}`) !== null)) return !0;
	return !1;
}
function Fb(e) {
	if (e.ctrlKey || e.metaKey || e.altKey) return !1;
	let t = e.target;
	return t instanceof HTMLElement ? t.isContentEditable || t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement : !1;
}
//#endregion
//#region src/interactions/menu-search-engine.ts
var Ib = `.ui-menu[${ht}]`, Lb = ":scope > .ui-collapsible__bar", Rb = ":scope > .ui-menu__host", zb = "ui-menu__item", Bb = `:scope > .${_}`, Vb = ".ui-text__title", Hb = ":scope > .ui-menu__submenu > .ui-menu > .ui-menu__host", Ub = class {
	active = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("input", (e) => this.handle(e), !0), t.addEventListener("change", (e) => this.handle(e), !0), t.addEventListener("keydown", (e) => this.handleKeydown(e)), j(t, Ib, {
			childList: !0,
			characterData: !0,
			attributeFilter: [dt]
		}, (e) => this.reconcile(e));
	}
	handle(e) {
		let t = e.target;
		if (!(t instanceof HTMLInputElement)) return;
		let n = Wb(t);
		n !== null && this.search(n, t);
	}
	search(e, t) {
		let n = e.querySelector(Rb);
		if (n === null) return;
		let r = Gd(t.value, e);
		if (r.length === 0) {
			this.clear(e, n);
			return;
		}
		this.active.has(e) || this.active.set(e, {
			field: t,
			openBefore: Gb(n)
		}), e.setAttribute(gt, ""), pf(e, n, !this.filter(n, r));
	}
	filter(e, t) {
		let n = null, r = !1, i = !1;
		for (let a of Kb(e)) {
			let e = qb(a);
			if (e === "header") {
				n !== null && Yb(n, r), n = a, r = !1;
				continue;
			}
			let o = e !== "separator" && this.match(a, t);
			Yb(a, o), r ||= o, i ||= o;
		}
		return n !== null && Yb(n, r), i;
	}
	match(e, t) {
		let n = qd(Jb(e), t), r = e.hasAttribute("data-ui-menu-group") ? e.querySelector(Hb) : null;
		if (r === null) return n;
		if (n) return Xb(r), e.removeAttribute(mt), !0;
		let i = this.filter(r, t);
		return e.toggleAttribute(mt, i), i;
	}
	clear(e, t) {
		Xb(t), e.removeAttribute(gt), Kb(t).length > 0 && pf(e, t, !1);
		let n = this.active.get(e);
		if (n === void 0) return;
		this.active.delete(e);
		let r = e.hasAttribute(dt);
		for (let e of t.querySelectorAll(`[${ft}]:not([${pt}])`)) e.toggleAttribute(mt, !r && n.openBefore.has(e.getAttribute("data-ui-key") ?? e));
	}
	reconcile(e) {
		for (let t of e) {
			let e = this.active.get(t);
			e !== void 0 && (t.hasAttribute("data-ui-collapsed") && (e.field.value = "", e.field.blur()), this.search(t, e.field));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "ArrowDown" || e.defaultPrevented || !(e.target instanceof HTMLInputElement)) return;
		let t = [...Wb(e.target)?.querySelector(Rb)?.querySelectorAll(`.ui-menu-item:not(${wt})`) ?? []].find(ka);
		t !== void 0 && (e.preventDefault(), t.focus());
	}
};
function Wb(e) {
	let t = e.closest(Ib), n = t?.querySelector(Lb) ?? null;
	return t !== null && n !== null && n.contains(e) ? t : null;
}
function Gb(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e.querySelectorAll(`[${ft}][${mt}]`)) t.add(n.getAttribute("data-ui-key") ?? n);
	return t;
}
function Kb(e) {
	return [...e.children].filter((e) => e instanceof HTMLElement && e.classList.contains(zb));
}
function qb(e) {
	return e.querySelector(Bb)?.getAttribute("data-ui-menu-item-kind") ?? "item";
}
function Jb(e) {
	return Kd(e.querySelector(Bb)?.querySelector(Vb)?.textContent ?? "", e);
}
function Yb(e, t) {
	e.toggleAttribute(_t, !t);
}
function Xb(e) {
	for (let t of e.querySelectorAll(`[${_t}]`)) t.removeAttribute(_t);
}
//#endregion
//#region src/rendering/responsive-tier.ts
var Zb = [
	"base",
	"sm",
	"md",
	"xl",
	"xxl"
], Qb = {
	sm: 640,
	md: 768,
	xl: 1280,
	xxl: 1536
};
function $b(e = (e) => matchMedia(e).matches) {
	for (let t of [
		"xxl",
		"xl",
		"md",
		"sm"
	]) if (e(`(min-width: ${Qb[t]}px)`)) return t;
	return "base";
}
function ex(e, t) {
	return t === "base" ? e : `${e}-${t}`;
}
function V(e, t) {
	if (e == null) return;
	let n = typeof e == "object" ? e : void 0;
	return n === void 0 || !("base" in n) ? t === "base" ? e : void 0 : n[t];
}
function tx(e, t) {
	let n;
	for (let r of Zb) {
		let i = V(e, r);
		if (i != null && (n = i), r === t) break;
	}
	return n;
}
//#endregion
//#region src/interactions/side-drawer-engine.ts
var nx = "[data-ui-root]", rx = "a[href]", ix = class {
	root;
	holders = /* @__PURE__ */ new Map();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e)), typeof matchMedia == "function" && matchMedia(`(min-width: ${Qb.md}px)`).addEventListener("change", () => this.closeAll());
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${vt}]`);
		if (t !== null) {
			let e = t.closest(nx), n = t.getAttribute(vt);
			e !== null && n !== null && this.toggle(e, n);
			return;
		}
		if (e.target.closest("[data-ui-drawer-backdrop]") !== null) {
			this.closeAll();
			return;
		}
		let n = e.target.closest(rx)?.closest(`[${bt}]`), r = n?.parentElement ?? null;
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
		e.setAttribute(yt, t), this.markToggles(e);
		let n = ax(e, t);
		n !== null && (this.hold(n), this.focusInto(e, t, n, document.activeElement, Eo(), performance.now() + Os.normal));
	}
	hold(e) {
		if (this.holders.has(e) || e.hasAttribute("data-ui-focus-holder")) return;
		let t = !e.hasAttribute("tabindex");
		e.setAttribute(Nn, ""), t && (e.tabIndex = -1), this.holders.set(e, t);
	}
	focusInto(e, t, n, r, i, a) {
		e.getAttribute("data-ui-drawer-open") !== t || document.activeElement !== r || n.contains(r) || (Lo(n, i ? n : null), performance.now() < a && document.activeElement === r && requestAnimationFrame(() => this.focusInto(e, t, n, r, i, a)));
	}
	closeAll() {
		for (let e of document.querySelectorAll(`${nx}[${yt}]`)) this.close(e);
	}
	close(e) {
		let t = e.getAttribute(yt);
		if (e.removeAttribute(yt), this.markToggles(e), t === null) return;
		let n = ax(e, t), r = document.activeElement;
		if (r === null || r === document.body || n?.contains(r) === !0) {
			let n = e.querySelector(`[${vt}="${CSS.escape(t)}"]`);
			n !== null && A(n);
		}
		this.release(n);
	}
	markToggles(e) {
		let t = e.getAttribute(yt);
		for (let n of e.querySelectorAll(`[${vt}]`)) n.setAttribute("aria-expanded", String(n.getAttribute(vt) === t));
	}
	release(e) {
		let t = e === null ? void 0 : this.holders.get(e);
		e !== null && t !== void 0 && (this.holders.delete(e), e.removeAttribute(Nn), t && e.removeAttribute("tabindex"));
	}
};
function ax(e, t) {
	return e.querySelector(`:scope > [${bt}="${CSS.escape(t)}"]`);
}
//#endregion
//#region src/interactions/collapsible-engine.ts
var ox = "ui-collapsible", sx = "ui-collapsible__content", cx = "ui-collapsible__bar", lx = "collapsed", ux = class {
	root;
	store = new wv();
	restored = /* @__PURE__ */ new WeakSet();
	folds = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.restoreEach(this.root.querySelectorAll(`.${ox}`)), j(this.root, `.${ox}`, { childList: !0 }, (e) => this.restoreEach(e));
	}
	restoreEach(e) {
		for (let t of e) this.restored.has(t) || (this.restored.add(t), this.restore(t));
	}
	restore(e) {
		if (this.toggleOf(e) === null) return;
		let t = this.store.read(e, lx);
		t !== null && this.apply(e, t === "true");
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${Dt}]`), n = t?.closest(`.${ox}`) ?? null;
		if (t === null || n === null) return;
		e.preventDefault();
		let r = !n.hasAttribute(dt), i = n.querySelector(`:scope > .${sx}`);
		this.cancelFold(n);
		let a = fx(n, i);
		this.apply(n, r), this.playFold(n, i, a, r), this.store.write(n, lx, r ? "true" : "false", r ? { attributes: { [dt]: "" } } : null);
	}
	apply(e, t) {
		e.toggleAttribute(dt, t), this.toggleOf(e)?.setAttribute("aria-expanded", t ? "false" : "true");
	}
	toggleOf(e) {
		return e.querySelector(`:scope > [${Dt}], :scope > .${cx} > [${Dt}]`);
	}
	playFold(e, t, n, r) {
		if (typeof e.animate != "function" || ks()) return;
		let i = mx(dx(e), n, fx(e, t), r);
		if (i === null) return;
		e.setAttribute(Ot, "");
		let a = {
			duration: Os.normal,
			easing: Os.ease
		}, o = [e.animate(i.component, a)];
		t !== null && o.push(t.animate(i.content, a)), this.folds.set(e, o), Promise.allSettled(o.map((e) => e.finished)).then(() => {
			this.folds.get(e) === o && (this.folds.delete(e), e.removeAttribute(Ot));
		});
	}
	cancelFold(e) {
		let t = this.folds.get(e);
		if (t !== void 0) {
			this.folds.delete(e), e.removeAttribute(Ot);
			for (let e of t) e.cancel();
		}
	}
};
function dx(e) {
	return e.classList.contains("ui-side--top") || e.classList.contains("ui-side--bottom") ? "height" : "width";
}
function fx(e, t) {
	let n = dx(e), r = px(n), i = e.getBoundingClientRect(), a = t?.getBoundingClientRect();
	return {
		component: i[n],
		componentAcross: i[r],
		content: a?.[n] ?? 0,
		contentAcross: a?.[r] ?? 0
	};
}
function px(e) {
	return e === "width" ? "height" : "width";
}
function mx(e, t, n, r) {
	let i = px(e), a = t.component !== n.component, o = Math.abs(t.componentAcross - n.componentAcross) >= .5;
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
var hx = class {
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
		if (t === null || w(t)) return;
		let n = this.options.begin(t, {
			x: e.clientX,
			y: e.clientY
		});
		if (n !== null) {
			e.preventDefault();
			try {
				t.setPointerCapture(e.pointerId);
			} catch {}
			t.setAttribute(pn, ""), t.tabIndex >= 0 && t.focus({ preventScroll: !0 }), this.drag = {
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
		this.drag = null, t.removeAttribute(pn), this.options.end(t, n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.key !== "Escape" || e.defaultPrevented || this.drag === null) return;
		e.preventDefault();
		let { handle: t, context: n, pointerId: r, originPoint: i } = this.drag;
		this.drag = null, this.options.move(n, 0, i), t.removeAttribute(pn);
		try {
			t.releasePointerCapture(r);
		} catch {}
		this.options.end(t, n);
	}
};
//#endregion
//#region src/interactions/grid-tracks.ts
function gx(e) {
	let t = [];
	for (let n of yx(e.trim())) {
		let e = /^repeat\(\s*(\d+)\s*,(.+)\)$/s.exec(n);
		if (e !== null) {
			let n = gx(e[2]);
			if (n === null) return null;
			for (let r = Number(e[1]); r > 0; r--) t.push(...n);
			continue;
		}
		let r = _x(n);
		if (r === null) return null;
		t.push(r);
	}
	return t.length === 0 ? null : t;
}
function _x(e) {
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
	if (n !== null) return vx({
		kind: "auto",
		value: 0
	}, Number(n[1]));
	let r = /^minmax\(\s*([\d.]+)(?:px)?\s*,\s*([\d.]+)(fr|px)\s*\)$/.exec(e);
	if (r !== null) return vx(r[3] === "fr" ? {
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
function vx(e, t) {
	return t > 0 ? {
		...e,
		min: t
	} : e;
}
function yx(e) {
	let t = [], n = 0, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i];
		a === "(" ? n++ : a === ")" ? n-- : a === " " && n === 0 && (i > r && t.push(e.slice(r, i)), r = i + 1);
	}
	return r < e.length && t.push(e.slice(r)), t;
}
function bx(e, t = "auto") {
	return e.map((e) => xx(e, t)).join(" ");
}
function xx(e, t) {
	switch (e.kind) {
		case "px": return `${Sx(e.value)}px`;
		case "star": return `minmax(${e.min === void 0 ? "0" : `${Sx(e.min)}px`}, ${Sx(e.value)}fr)`;
		case "auto": return e.min === void 0 ? e.max === void 0 ? t : `fit-content(${Sx(e.max)}px)` : `minmax(${Sx(e.min)}px, auto)`;
	}
}
function Sx(e) {
	return String(Math.round(e * 1e3) / 1e3);
}
function Cx(e) {
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
function wx(e, t) {
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
function Tx(e, t, n) {
	let r = 0, i = n;
	for (let n of t) n < e && n + 1 > r ? r = n + 1 : n > e && n < i && (i = n);
	let a = Ex(r, e), o = Ex(e + 1, i);
	return a.length === 0 || o.length === 0 ? null : {
		before: a,
		after: o
	};
}
function Ex(e, t) {
	let n = [];
	for (let r = e; r < t; r++) n.push(r);
	return n;
}
function Dx(e, t, n, r) {
	let i = Ox(e, t, n.before), a = Ox(e, t, n.after);
	if (i.total + a.total <= 0) return null;
	let o = Math.max(i.min - i.total, a.total - a.max), s = Math.min(i.max - i.total, a.total - a.min);
	if (o > s) return null;
	let c = Math.min(Math.max(r, o), s);
	if (c === 0) return null;
	let l = [...e], u = n.before.every((t) => e[t].kind === "star"), d = n.after.every((t) => e[t].kind === "star");
	if (u && d) {
		let t = Nx(n.before, e) + Nx(n.after, e), r = i.total + a.total;
		kx(l, e, i, t * (i.total + c) / r), kx(l, e, a, t * (a.total - c) / r);
	} else u || Ax(l, i, i.total + c), d || Ax(l, a, a.total - c);
	return l;
}
function Ox(e, t, n) {
	let r = Mx(n, t), i = n.map((e) => r > 0 ? t[e] / r : 1 / n.length), a = 0, o = Infinity;
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
function kx(e, t, n, r) {
	let i = Nx(n.indices, t);
	for (let a = 0; a < n.indices.length; a++) {
		let o = n.indices[a], s = i > 0 && n.total > 0 ? n.shares[a] : 1 / n.indices.length;
		e[o] = {
			...t[o],
			value: r * s
		};
	}
}
function Ax(e, t, n) {
	for (let r = 0; r < t.indices.length; r++) {
		let i = t.indices[r];
		e[i] = {
			kind: "px",
			value: n * t.shares[r],
			...jx(e[i])
		};
	}
}
function jx(e) {
	return {
		...e.min === void 0 ? {} : { min: e.min },
		...e.max === void 0 ? {} : { max: e.max }
	};
}
function Mx(e, t) {
	let n = 0;
	for (let r of e) n += t[r];
	return n;
}
function Nx(e, t) {
	let n = 0;
	for (let r of e) n += t[r].value;
	return n;
}
function Px(e, t) {
	let n = Mx(t.before, e), r = n + Mx(t.after, e);
	return r <= 0 ? 0 : Math.round(n / r * 100);
}
function Fx(e, t) {
	let n = [];
	for (let r = 0, i = 0; r < t; r++) n.push(i), i += Number.isFinite(e[r]) ? e[r] : 0;
	return n;
}
function Ix(e, t) {
	return e.map((e, n) => t.has(n) ? {
		kind: "px",
		value: 0
	} : e);
}
//#endregion
//#region src/interactions/grid-splitter-engine.ts
var Lx = "ui-grid-splitter", Rx = "ui-container", zx = "ui-orientation--vertical", Bx = 16, Vx = {
	slot: "columns",
	authored: "--ui-columns",
	split: "--ui-split-columns",
	limits: kt,
	computed: "gridTemplateColumns",
	lineStart: "gridColumnStart",
	coordinate: "clientX",
	decrease: "ArrowLeft",
	increase: "ArrowRight"
}, Hx = {
	slot: "rows",
	authored: "--ui-rows",
	split: "--ui-split-rows",
	limits: At,
	computed: "gridTemplateRows",
	lineStart: "gridRowStart",
	coordinate: "clientY",
	decrease: "ArrowUp",
	increase: "ArrowDown"
}, Ux = class {
	root;
	store = new wv();
	restored = /* @__PURE__ */ new WeakMap();
	warner = new p();
	drag;
	constructor(e = {}) {
		this.root = e.root ?? document, this.drag = new hx({
			root: this.root,
			resolveHandle: (e) => e.closest(`.${Lx}`),
			begin: (e) => this.resolveContext(e),
			coordinate: (e) => e.axis.coordinate,
			move: (e, t) => {
				this.apply(e, t);
			},
			end: (e, t) => {
				this.remember(t), this.reportPosition(e);
			}
		}), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.prepareEach(this.root.querySelectorAll(`.${Lx}`)), j(this.root, `.${Lx}`, { childList: !0 }, (e) => this.prepareEach(e));
	}
	prepareEach(e) {
		for (let t of e) {
			let e = Wx(t);
			e !== null && (this.restore(e, Gx(t)), this.reportPosition(t));
		}
	}
	restore(e, t) {
		let n = this.restored.get(e);
		if (n === void 0 && (n = /* @__PURE__ */ new Set(), this.restored.set(e, n)), n.has(t.slot)) return;
		n.add(t.slot);
		let r = this.store.readJson(e, t.slot);
		if (r !== null) for (let n of Zb) {
			let i = r[n], a = ex(t.split, n);
			i !== void 0 && e.style.getPropertyValue(a).length === 0 && e.style.setProperty(a, i);
		}
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${Lx}`);
		if (t === null || this.drag.active || w(t)) return;
		let n = this.resolveContext(t);
		if (n === null) return;
		let r = Xx(t), i = n.sizes.reduce((e, t) => e + t, 0), a;
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
		let t = e.target.closest(`.${Lx}`), n = t === null ? null : Wx(t);
		if (t === null || n === null) return;
		let r = Gx(t);
		for (let e of Zb) n.style.removeProperty(ex(r.split, e));
		this.store.write(n, r.slot, null), this.reportPosition(t);
	}
	apply(e, t) {
		let n = Dx(e.tracks, e.sizes, e.runs, t);
		return n !== null && (e.container.style.setProperty(ex(e.axis.split, e.tier), bx(n)), !0);
	}
	remember(e) {
		let { container: t, axis: n } = e, r = {}, i = {};
		for (let e of Zb) {
			let a = ex(n.split, e), o = t.style.getPropertyValue(a).trim();
			o.length > 0 && (r[e] = o, i[a] = o);
		}
		let a = { styles: i };
		this.store.write(t, n.slot, Object.keys(r).length === 0 ? null : JSON.stringify(r), a);
	}
	resolveContext(e) {
		let t = Wx(e);
		if (t === null) return this.warner.warn(e, "a grid splitter must be a direct child of a container."), null;
		let n = Gx(e), r = $b(), i = Kx(t, n, r), a = i === null ? null : gx(i);
		if (a === null) return this.warner.warn(e, "the container's track list could not be read.", { template: i }), null;
		let o = wx(a, Cx(t.getAttribute(n.limits))), s = qx(t, n), c = Jx(e, n);
		if (c === null || c >= o.length || s.length < o.length) return this.warner.warn(e, "the splitter's track could not be found in its container.", {
			index: c,
			tracks: o.length,
			sizes: s.length
		}), null;
		o[c].kind === "star" && this.warner.warn(e, "a grid splitter sits in a star track and shares the room it divides; give it an Auto or Absolute track.");
		let l = Tx(c, Yx(t, n).map((e) => Jx(e, n)).filter((e) => e !== null && e !== c), o.length);
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
		let t = Wx(e);
		if (t === null) return;
		let n = Gx(e), r = Jx(e, n), i = qx(t, n), a = Yx(t, n).map((e) => Jx(e, n)).filter((e) => e !== null && e !== r), o = r === null ? null : Tx(r, a, i.length);
		o !== null && (e.setAttribute("aria-valuemin", "0"), e.setAttribute("aria-valuemax", "100"), e.setAttribute("aria-valuenow", String(Px(i, o))));
	}
};
function Wx(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains(Rx) ? t : null;
}
function Gx(e) {
	return e.classList.contains(zx) ? Vx : Hx;
}
function Kx(e, t, n) {
	for (let r = Zb.indexOf(n); r >= 0; r--) {
		let n = e.style.getPropertyValue(ex(t.split, Zb[r])).trim();
		if (n.length > 0) return n;
	}
	let r = e.style.getPropertyValue(t.authored).trim();
	return r.length > 0 ? r : null;
}
function qx(e, t) {
	return getComputedStyle(e)[t.computed].split(" ").map(parseFloat).filter((e) => Number.isFinite(e));
}
function Jx(e, t) {
	let n = Number(getComputedStyle(e)[t.lineStart]);
	return Number.isInteger(n) && n >= 1 ? n - 1 : null;
}
function Yx(e, t) {
	let n = [];
	for (let r of e.children) r instanceof HTMLElement && r.classList.contains(Lx) && Gx(r) === t && n.push(r);
	return n;
}
function Xx(e) {
	let t = Number(e.getAttribute(jt));
	return Number.isFinite(t) && t > 0 ? t : Bx;
}
//#endregion
//#region src/interactions/split-button-engine.ts
var Zx = "ui-split-button", Qx = "ui-split-button__main", $x = "ui-split-button__toggle", eS = "ui-split-button__menu", tS = "ui-split-button--open", nS = "ui-menu", rS = 4, iS = class {
	root;
	menus = new Fc({
		show: ({ owner: e }) => e.classList.add(tS),
		hide: ({ owner: e }) => e.classList.remove(tS),
		closesWhenReadOnly: !1
	});
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), document.addEventListener("click", (e) => this.handleChoice(e), !1);
	}
	handleClick(e) {
		let t = aS(e.target);
		if (t !== null) {
			e.preventDefault(), this.menus.isOpen(t) ? this.menus.close(t) : this.openMenu(t);
			return;
		}
		let n = this.menus.current;
		n !== null && e.target instanceof Element && e.target.closest(`.${Qx}`)?.closest(`.${Zx}`) === n && this.menus.close(n);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
		let t = aS(e.target);
		t === null || this.menus.isOpen(t) || (e.preventDefault(), this.openMenu(t, e.key === "ArrowUp"));
	}
	handleChoice(e) {
		let t = this.menus.current;
		if (t === null || !(e.target instanceof Element)) return;
		let n = oS(t), r = e.target.closest(`.${_}`);
		n === null || r === null || !n.contains(r) || r.matches(`${wt}, ${Et}`) || this.menus.close(t);
	}
	openMenu(e, t = !1) {
		let n = oS(e), r = n?.querySelector(`.${nS}`) ?? null;
		n !== null && r !== null && this.menus.open({
			owner: e,
			popup: n,
			anchor: e,
			placement: {
				placement: "bottom-end",
				gap: rS
			},
			openers: sS(e)
		}) && Bo(r, M(r, `.${_}:not(${wt})`, `.${nS}`), t);
	}
};
function aS(e) {
	if (!(e instanceof Element)) return null;
	let t = e.closest(`.${$x}, .${Qx}`), n = t?.closest(`.${Zx}`) ?? null;
	return t === null || n === null || t.classList.contains(Qx) && n.getAttribute("data-ui-split-mode") !== "menu" ? null : n;
}
function oS(e) {
	return e.querySelector(`:scope > .${eS}`);
}
function sS(e) {
	return [...e.querySelectorAll(":scope > [aria-haspopup]")];
}
//#endregion
//#region src/interactions/button-group-engine.ts
var cS = "ui-button-group", lS = "ui-button-group__item", uS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${cS}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), j(this.root, `.${cS}`, {
			childList: !0,
			attributeFilter: [_n]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-selected-key") ?? "", n = [], r = null;
		for (let i of this.ownItems(e)) {
			let e = t.length > 0 && i.getAttribute("data-ui-key") === t, a = dS(i);
			i.toggleAttribute(gn, e), a !== null && (a.setAttribute("aria-pressed", e ? "true" : "false"), n.push(a), e && (r = a));
		}
		D(n, r ?? n.find(ka) ?? null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lS}`), n = t?.closest(`.${cS}`) ?? null;
		if (t === null || n === null || t.closest(`.${cS}`) !== n || w(n)) return;
		let r = dS(t);
		r !== null && w(r) || this.choose(n, t);
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${lS} > .${Ln}`), n = t?.closest(`.${cS}`) ?? null;
		if (t === null || n === null) return;
		let r = this.ownItems(n).map(dS).filter((e) => e !== null), i = Ea({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault(), i.focus({ preventScroll: !0 });
		let a = i.closest(`.${lS}`);
		a !== null && this.choose(n, a);
	}
	choose(e, t) {
		Ma(e, t.getAttribute("data-ui-key") ?? "", {
			attribute: _n,
			bindingAttribute: yn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return M(e, `.${lS}`, `.${cS}`);
	}
};
function dS(e) {
	return e.querySelector(`:scope > .${Ln}`);
}
//#endregion
//#region src/interactions/accordion-engine.ts
var fS = "ui-accordion", pS = "details", mS = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleSummaryClick(e), !0), this.root.addEventListener("toggle", (e) => this.handleToggle(e), !0), this.normalizeAll(this.root.querySelectorAll(`.${fS}`)), j(this.root, `.${fS}`, { childList: !0 }, (e) => this.normalizeAll(e));
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
		if (!(t === null || !t.classList.contains(fS))) for (let n of this.sectionsOf(t)) n !== e && n.open && (n.open = !1);
	}
	sectionsOf(e) {
		return [...e.querySelectorAll(`:scope > ${pS}`)];
	}
}, hS = "ui-tab-overflow", gS = "ui-tab-overflow__menu", _S = "ui-tab-overflow__menu--open", vS = "ui-tab-overflow__entry", yS = "ui-tab-overflow__entry--current", bS = class {
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
		this.options = e, this.list = new CS(e.pick);
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
		let r = () => e.classList.add(this.options.overflowingClass), i = this.options.trailing === !0 ? this.fitTrailing(t, r) : xS({
			...t,
			hiddenClass: this.options.hiddenClass,
			showButton: r
		});
		e.classList.toggle(this.options.overflowingClass, i), i || this.closeListOf(e);
	}
	fitTrailing(e, t) {
		for (let t of e.captions) this.resizes?.observe(t);
		return SS(e, this.options.hiddenClass, t);
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
function xS(e) {
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
function SS(e, t, n) {
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
var CS = class {
	menu;
	button = null;
	list = new Fc({
		show: ({ popup: e }) => e.classList.add(_S),
		hide: ({ popup: e }) => {
			e.classList.remove(_S), this.button = null;
		},
		closesWhenReadOnly: !1,
		isInside: ({ popup: e }, t) => t.includes(e) || this.button !== null && t.includes(this.button),
		onWindowBlur: !0
	});
	pick;
	constructor(e) {
		this.pick = e, this.menu = document.createElement("div"), this.menu.className = gS, this.menu.setAttribute("role", "menu"), this.menu.addEventListener("click", (e) => this.handleClick(e)), this.menu.addEventListener("keydown", (e) => this.handleKeydown(e)), this.menu.addEventListener("pointermove", (e) => this.handlePointerMove(e));
	}
	isOpenFor(e) {
		return this.list.isOpen(e);
	}
	open(e, t, n) {
		this.close(), this.menu.replaceChildren(...n.map(wS)), this.menu.parentElement === null && document.body.appendChild(this.menu);
		let r = this.menu.querySelector(`.${yS}`);
		r !== null && D(this.entries(), r), this.button = e, Hs(e, this.menu), this.list.open({
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
		}) ? r === null && Bo(this.menu, this.entries()) : this.button = null;
	}
	close() {
		this.list.close();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${vS}`), n = t?.getAttribute("data-ui-key") ?? null, r = this.list.current;
		t === null || n === null || r === null || w(t) || (this.close(), this.pick(r, n));
	}
	handleKeydown(e) {
		if (e.defaultPrevented || !(e.target instanceof HTMLElement)) return;
		if (e.key === "Tab") {
			this.close();
			return;
		}
		let t = this.entries(), n = Ea({
			key: e.key,
			items: t,
			current: e.target,
			axis: "vertical"
		});
		n !== null && (e.preventDefault(), D(t, n), n.focus());
	}
	handlePointerMove(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${vS}`) : null;
		t === null || t === document.activeElement || w(t) || (D(this.entries(), t), Oo(t));
	}
	entries() {
		return Array.from(this.menu.querySelectorAll(`.${vS}`));
	}
};
function wS(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${vS} ui-button ui-button--ghost ui-button--small`, t.classList.toggle(yS, e.current), t.setAttribute("role", "menuitem"), t.setAttribute(h, e.key), t.textContent = e.title, e.current && t.setAttribute("aria-current", "true"), e.disabled && (t.classList.add(Dn), t.setAttribute("aria-disabled", "true")), t;
}
//#endregion
//#region src/interactions/tabs-engine.ts
var TS = "ui-tabs", ES = "ui-tab-header", DS = "ui-tab-header--selected", OS = "ui-tab-header--overflowed", kS = "ui-tabs--overflowing", AS = "ui-tabs--no-overflow", jS = "ui-tabs__strip", MS = "data-ui-tab-key", NS = "data-ui-tab-page", PS = class {
	root;
	fitter;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new bS({
			rootClass: TS,
			overflowingClass: kS,
			wraps: (e) => e.classList.contains(AS),
			hiddenClass: OS,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${TS}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), j(this.root, `.${TS}`, {
			childList: !0,
			attributeFilter: [bn, ...wn],
			relevant: (e) => !hc(e, `[${NS}]`, `.${TS}`)
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = e.getAttribute("data-ui-tabs-selected") ?? "", n = this.ownHeaders(e), r = n.find((e) => (e.getAttribute(MS) ?? "") === t) ?? null;
		if (r !== null && !FS(r)) {
			let t = n.find(FS);
			if (t !== void 0) {
				this.select(e, t.getAttribute(MS) ?? "");
				return;
			}
		}
		let i = null;
		for (let e of n) {
			let n = (e.getAttribute(MS) ?? "") === t;
			e.classList.toggle(DS, n), e.setAttribute("aria-selected", n ? "true" : "false"), n && (i = e);
		}
		this.fitHeaders(e, n.filter(FS), i), D(n.filter((e) => !e.classList.contains(OS)), i);
		for (let n of this.ownPages(e)) n.hidden = (n.getAttribute(NS) ?? "") !== t;
	}
	fitHeaders(e, t, n) {
		let r = e.querySelector(`:scope > .${jS}`), i = r?.querySelector(":scope > .ui-tab-overflow") ?? null;
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownHeaders(e).find((e) => (e.getAttribute(MS) ?? "") === t)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownHeaders(e).filter(FS).map((e) => {
				let n = e.getAttribute(MS) ?? "";
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
		let t = e.target.closest(`.${hS}`), n = t?.closest(`.${TS}`) ?? null;
		if (t !== null && n !== null && t.closest(`.${TS}`) === n) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = e.target.closest(`.${ES}`);
		if (r === null || w(r)) return;
		let i = r.closest(`.${TS}`), a = r.getAttribute(MS);
		i !== null && a !== null && r.closest(`.${TS}`) === i && (e.preventDefault(), this.select(i, a));
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${ES}`), n = t?.closest(`.${TS}`) ?? null;
		if (t === null || n === null) return;
		let r = Ea({
			key: e.key,
			items: this.ownHeaders(n),
			current: t,
			axis: "horizontal"
		});
		r !== null && (e.preventDefault(), this.select(n, r.getAttribute(MS) ?? ""), r.focus());
	}
	select(e, t) {
		Ma(e, t, {
			attribute: bn,
			bindingAttribute: yn,
			apply: (e) => this.apply(e)
		});
	}
	ownHeaders(e) {
		return M(e, `.${ES}`, `.${TS}`);
	}
	ownPages(e) {
		return M(e, `[${NS}]`, `.${TS}`);
	}
};
function FS(e) {
	return e.classList.contains(OS) || Cy(e);
}
//#endregion
//#region src/interactions/command-bar-engine.ts
var IS = "ui-command-bar", LS = "ui-command-bar__host", RS = "ui-command-bar__item", zS = "ui-command-bar__overflow", BS = "ui-command-bar--overflowing", VS = "ui-command-bar__overflowed", HS = "ui-text__title", US = class {
	root;
	fitter;
	listed = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new bS({
			rootClass: IS,
			overflowingClass: BS,
			wraps: (e) => !GS(e),
			hiddenClass: VS,
			trailing: !0,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pick(e, t)
		}), this.applyAll(this.root.querySelectorAll(`.${IS}`)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), j(this.root, `.${IS}`, { childList: !0 }, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = WS(e), n = e.querySelector(`:scope > .${zS}`);
		if (t === null || n === null) return;
		let r = KS(t);
		this.fitter.fit(e, {
			room: e,
			button: n,
			captions: r,
			selected: null
		}), e.classList.contains(BS) && qS(r);
		for (let e of r) Bs(e, e.classList.contains(VS) ? n : null);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`.${zS}`), n = t?.parentElement ?? null;
		t === null || n === null || !n.classList.contains(IS) || (e.preventDefault(), this.fitter.toggleList(n, t, () => this.entriesOf(n)));
	}
	entriesOf(e) {
		let t = WS(e), n = t === null ? [] : KS(t).filter((e) => e.classList.contains(RS) && e.classList.contains(VS)).map((e) => e.querySelector(v) ?? e);
		return this.listed.set(e, n), n.map((e, t) => ({
			key: String(t),
			title: JS(e),
			current: !1,
			disabled: w(e)
		}));
	}
	pick(e, t) {
		let n = this.listed.get(e)?.[Number(t)];
		n?.isConnected === !0 && !w(n) && YS(n).click();
	}
};
function WS(e) {
	return e.querySelector(`:scope > .${LS}`);
}
function GS(e) {
	let t = WS(e);
	if (t === null) return !1;
	let n = getComputedStyle(t);
	return n.flexDirection.startsWith("row") && n.flexWrap === "nowrap";
}
function KS(e) {
	let t = [];
	for (let n of Array.from(e.children)) {
		if (n.classList.contains("ui-hidden")) continue;
		if (n.hasAttribute("data-ui-group-header")) {
			t.push(n);
			continue;
		}
		let e = n.classList.contains(RS) ? n.querySelector(v) : null;
		e !== null && Cy(e) && t.push(n);
	}
	return t;
}
function qS(e) {
	let t = !1;
	for (let n = e.length - 1; n >= 0; n--) {
		let r = e[n];
		r.classList.contains(RS) ? t ||= !r.classList.contains(VS) : t || r.classList.add(VS);
	}
}
function JS(e) {
	let t = YS(e), n = t.querySelector(`.${HS}`)?.textContent?.trim() ?? "";
	return n.length > 0 ? n : e.getAttribute("aria-label")?.trim() || t.getAttribute("aria-label")?.trim() || t.textContent?.trim() || "";
}
function YS(e) {
	return e.matches(ho) ? e : e.querySelector(ho) ?? e;
}
//#endregion
//#region src/interactions/breadcrumbs-engine.ts
var XS = "ui-breadcrumbs", ZS = "ui-breadcrumbs__item", QS = "ui-breadcrumb", $S = "ui-breadcrumb--current", eC = "ui-hidden", tC = "data-ui-step-collapsed", nC = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(), j(this.root, `.${XS}`, {
			childList: !0,
			attributeFilter: ["class", ...wn]
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${XS}`)) this.apply(e);
	}
	apply(e) {
		let t = M(e, `.${ZS}`, `.${XS}`);
		for (let e of t) rC(e);
		let n = t.filter((e) => !e.classList.contains(eC)).map((e) => e.querySelector(`.${QS}`)).filter((e) => e !== null && !e.classList.contains(eC)), r = n.length === 0 ? null : n[n.length - 1];
		for (let e of n) {
			let t = e === r;
			e.classList.toggle($S, t), t ? (e.setAttribute("aria-current", "page"), e.setAttribute("tabindex", "-1")) : (e.removeAttribute("aria-current"), e.removeAttribute("tabindex"));
		}
	}
};
function rC(e) {
	let t = e.querySelector(`:scope > .${QS}`), n = t === null ? "" : wn.filter((e) => t.getAttribute(e) === "collapsed").map((e) => e === wn[0] ? "base" : e.slice(e.lastIndexOf("-") + 1)).join(" ");
	n.length === 0 ? e.removeAttribute(tC) : e.getAttribute(tC) !== n && e.setAttribute(tC, n);
}
//#endregion
//#region src/rendering/color-bytes.ts
function H(e) {
	return Number.isFinite(e) ? Math.min(255, Math.max(0, Math.round(e))) : 0;
}
function iC(e) {
	return H(e).toString(16).padStart(2, "0").toUpperCase();
}
function aC(e, t, n, r) {
	let i = r / 255, a = (e) => e * i + 255 * (1 - i);
	return oC(a(e), a(t), a(n)) > .1791 ? "var(--ui-color-on-light)" : "var(--ui-color-on-dark)";
}
function oC(e, t, n) {
	return .2126 * sC(e) + .7152 * sC(t) + .0722 * sC(n);
}
function sC(e) {
	let t = e / 255;
	return t <= .03928 ? t / 12.92 : ((t + .055) / 1.055) ** 2.4;
}
//#endregion
//#region src/interactions/color-input-engine.ts
var cC = "ui-color-input", lC = "ui-color-input--open", uC = "ui-color-input__popup", dC = "ui-color-input__text", fC = "ui-color-input__row", pC = "ui-color-input__swatch--button", mC = "ui-color-input__value-input", hC = "ui-color-input__square-thumb", gC = "ui-color-input__hue-thumb", _C = "data-ui-color-toggle", vC = "data-ui-color-tab", yC = "data-ui-color-tab-selected", bC = "data-ui-color-pane", xC = "data-ui-color-pane-selected", SC = "data-ui-color-square", CC = "data-ui-color-hue", wC = "data-ui-color-hex", TC = "data-ui-color-channel", EC = "data-ui-color-factor", DC = "data-ui-color-opacity", OC = "data-ui-color-name", kC = "data-ui-color-name-selected", AC = "data-ui-color-format", jC = "data-ui-color-variant", MC = "data-ui-color-no-picker", NC = "data-ui-color-no-palette", PC = 4, FC = class {
	options;
	root;
	states = /* @__PURE__ */ new WeakMap();
	popups = new Fc({
		show: ({ owner: e }) => e.classList.add(lC),
		hide: ({ owner: e }) => e.classList.remove(lC)
	});
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${cC}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			let t = b(e.reference.componentId);
			this.applyAll(this.options.dom?.findComponentParts(t, e.dynamicParameters, `.${cC}`) ?? []);
		}), j(this.root, `.${cC}`, {
			childList: !0,
			attributeFilter: [
				AC,
				jC,
				MC,
				NC
			]
		}, (e) => this.applyAll(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("input", (e) => this.handleInput(e), !0), this.root.addEventListener("change", (e) => this.handleFieldChange(e), !0), new hx({
			root: this.root,
			resolveHandle: (e) => e.closest(`[${SC}], [${CC}]`),
			begin: (e, t) => {
				let n = e.closest(`.${cC}`);
				if (n === null) return null;
				let r = {
					input: n,
					element: e,
					surface: e.hasAttribute(SC) ? "square" : "hue"
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
		let t = BC(e), n = this.states.get(e), r = n?.paneChosen === !0 ? IC(e, n.pane) : LC(e);
		if (t.length === 0 || t.startsWith("@")) return {
			...n ?? RC(r),
			pane: r,
			held: !1
		};
		if (t.startsWith("#")) {
			let i = JC(t);
			if (i === null) return n ?? RC(r);
			let [a, o, s, c] = i;
			if (n !== void 0 && n.name === null && zC(this.resolveRgb(e, n), [
				a,
				o,
				s
			])) return {
				...n,
				pane: r,
				opacity: c,
				held: !0
			};
			let [l, u, d] = ZC(a, o, s);
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
			...n ?? RC(r),
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
			let [e, a, o] = ZC(n, r, i);
			t = {
				...t,
				hue: e,
				saturation: a,
				value: o
			};
		}
		let a = this.states.get(e);
		this.states.set(e, t), WC(e, "--ui-color-input-color", t.held ? XC(n, r, i, t.opacity) : "transparent"), WC(e, "--ui-color-input-solid", XC(n, r, i, 255)), WC(e, "--ui-color-input-on-color", t.held ? aC(n, r, i, t.opacity) : "inherit"), UC(e, t.held ? HC(e, n, r, i, t.opacity) : ""), this.applyPicker(e, t, n, r, i), (a === void 0 || a.name !== t.name || a.pane !== t.pane || a.held !== t.held) && (this.applyPalette(e, t), this.applyPanes(e, t));
	}
	applyPicker(e, t, n, r, i) {
		let a = e.querySelector(`[${SC}]`), o = e.querySelector(`[${CC}]`), [s, c, l] = QC(t.hue, 1, 1);
		if (WC(e, "--ui-color-input-hue", XC(s, c, l, 255)), a !== null) {
			let e = a.querySelector(`.${hC}`);
			e !== null && (WC(e, "left", `${t.saturation * 100}%`), WC(e, "top", `${(1 - t.value) * 100}%`));
		}
		if (o !== null) {
			let e = o.querySelector(`.${gC}`);
			e !== null && WC(e, "top", `${t.hue / 360 * 100}%`);
		}
		GC(e, `[${wC}]`, YC(n, r, i)), GC(e, `[${TC}="r"]`, String(n)), GC(e, `[${TC}="g"]`, String(r)), GC(e, `[${TC}="b"]`, String(i)), WC(e, "--ui-color-input-opacity-fill", `${t.opacity / 255 * 100}%`), KC(e, `[${DC}]`, t.opacity);
	}
	applyPalette(e, t) {
		for (let n of e.querySelectorAll(`[${OC}]`)) n.getAttribute(OC) === t.name ? n.setAttribute(kC, "") : n.removeAttribute(kC);
		let n = t.name === null ? null : e.querySelector(`[${OC}="${t.name}"]`), r = n === null ? null : JC(n.style.getPropertyValue("--ui-color-input-chip").trim());
		WC(e, "--ui-color-input-base", r === null ? "transparent" : XC(r[0], r[1], r[2], 255)), KC(e, `[${EC}]`, t.factor);
	}
	applyPanes(e, t) {
		for (let n of e.querySelectorAll(`[${bC}]`)) n.getAttribute(bC) === t.pane ? n.setAttribute(xC, "") : n.removeAttribute(xC);
		for (let n of e.querySelectorAll(`[${vC}]`)) n.getAttribute(vC) === t.pane ? n.setAttribute(yC, "") : n.removeAttribute(yC);
	}
	resolveRgb(e, t) {
		if (t.name === null) return QC(t.hue, t.saturation, t.value);
		let n = e.querySelector(`[${OC}="${t.name}"]`), r = n === null ? null : JC(n.style.getPropertyValue("--ui-color-input-chip").trim());
		return r === null ? QC(t.hue, t.saturation, t.value) : qC([
			r[0],
			r[1],
			r[2]
		], t.factor);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${_C}]`);
		if (t !== null) {
			e.preventDefault(), this.toggle(t.closest(`.${cC}`));
			return;
		}
		let n = e.target.closest(`[${vC}]`), r = e.target.closest(`.${cC}`);
		if (r === null) return;
		if (n !== null) {
			e.preventDefault();
			let t = n.getAttribute(vC), i = this.states.get(r);
			i !== void 0 && (t === "picker" || t === "palette") && this.applyState(r, {
				...i,
				pane: t,
				paneChosen: !0
			});
			return;
		}
		let i = e.target.closest(`[${OC}]`);
		if (i !== null) {
			e.preventDefault(), this.commit(r, (e) => ({
				...e,
				name: i.getAttribute(OC)
			}));
			return;
		}
		let a = r.querySelector(`.${uC}`);
		(a === null || !e.composedPath().includes(a)) && (e.preventDefault(), this.toggle(r));
	}
	handleInput(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target.closest(`.${cC}`);
		if (t !== null) {
			if (e.target.hasAttribute(EC)) {
				this.commit(t, (t) => ({
					...t,
					factor: Number(e.target instanceof HTMLInputElement ? e.target.value : 0)
				}), !1);
				return;
			}
			e.target.hasAttribute(DC) && this.commit(t, (t) => ({
				...t,
				opacity: H(Number(e.target instanceof HTMLInputElement ? e.target.value : 255))
			}), !1);
		}
	}
	handleFieldChange(e) {
		if (!(e.target instanceof HTMLInputElement)) return;
		let t = e.target, n = t.closest(`.${cC}`);
		if (n === null) return;
		if (t.hasAttribute(EC) || t.hasAttribute(DC)) {
			this.send(n);
			return;
		}
		if (t.hasAttribute(wC)) {
			let e = JC(t.value);
			if (e === null) {
				this.applyAll([n]);
				return;
			}
			let [r, i, a] = ZC(e[0], e[1], e[2]);
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
		let r = t.getAttribute(TC);
		if (r === null) return;
		let i = this.states.get(n);
		if (i === void 0) return;
		let [a, o, s] = this.resolveRgb(n, i), c = {
			r: a,
			g: o,
			b: s
		};
		c[r] = H(Number(t.value));
		let [l, u, d] = ZC(c.r, c.g, c.b);
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
			let e = $C((t.y - a.top) / a.height);
			this.commit(n, (t) => ({
				...t,
				hue: e * 360,
				name: null
			}), !1);
			return;
		}
		let o = $C((t.x - a.left) / a.width), s = 1 - $C((t.y - a.top) / a.height);
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
		let a = e.querySelector(`.${mC}`);
		a !== null && (a.value = VC(i, this.resolveRgb(e, i)), n && this.send(e));
	}
	send(e) {
		E(e) || e.querySelector(`.${mC}`)?.dispatchEvent(new Event("change", { bubbles: !0 }));
	}
	toggle(e) {
		if (e === null || e.hasAttribute(MC) && e.hasAttribute(NC)) return;
		if (this.popups.isOpen(e)) {
			this.popups.close(e);
			return;
		}
		let t = e.querySelector(`.${uC}`), n = e.querySelector(`[${_C}]`);
		if (t === null) return;
		let r = e.getAttribute(jC) === "swatch" ? e.querySelector(`.${pC}`) : e.querySelector(`.${fC}`);
		this.popups.open({
			owner: e,
			popup: t,
			anchor: r ?? e,
			placement: {
				placement: "bottom-end",
				gap: PC
			},
			openers: n === null ? [] : [n],
			focus: t.querySelector(`[${yC}]`) ?? !0
		});
	}
};
function IC(e, t) {
	return ((t) => !e.hasAttribute(t === "picker" ? MC : NC))(t) ? t : t === "picker" ? "palette" : "picker";
}
function LC(e) {
	return IC(e, "picker");
}
function RC(e) {
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
function zC(e, t) {
	return e[0] === t[0] && e[1] === t[1] && e[2] === t[2];
}
function BC(e) {
	return e.querySelector(`.${mC}`)?.value.trim() ?? "";
}
function VC(e, t) {
	if (e.name !== null) {
		let t = e.factor === 0 ? "None" : e.factor < 0 ? "Shade" : "Tint";
		return `${e.name}/${t}/${Math.abs(e.factor)}/${e.opacity}`;
	}
	let n = YC(t[0], t[1], t[2]);
	return e.opacity === 255 ? n : `${n}${iC(e.opacity)}`;
}
function HC(e, t, n, r, i) {
	if (e.getAttribute(AC) === "rgb") return i === 255 ? `rgb(${t}, ${n}, ${r})` : `rgba(${t}, ${n}, ${r}, ${(i / 255).toFixed(3).replace(/0+$/, "").replace(/\.$/, "")})`;
	let a = YC(t, n, r);
	return i === 255 ? a : `${a}${iC(i)}`;
}
function UC(e, t) {
	for (let n of e.querySelectorAll(`.${dC}`)) n.textContent !== t && (n.textContent = t);
}
function WC(e, t, n) {
	e !== null && e.style.getPropertyValue(t) !== n && e.style.setProperty(t, n);
}
function GC(e, t, n) {
	let r = e.querySelector(t);
	r !== null && r !== document.activeElement && r.value !== n && (r.value = n);
}
function KC(e, t, n) {
	for (let r of e.querySelectorAll(t)) r !== document.activeElement && r.value !== String(n) && (r.value = String(n));
}
function qC(e, t) {
	if (t === 0) return e;
	let n = Math.abs(t) / 10;
	return t < 0 ? [
		H(e[0] * (1 - n)),
		H(e[1] * (1 - n)),
		H(e[2] * (1 - n))
	] : [
		H(e[0] + (255 - e[0]) * n),
		H(e[1] + (255 - e[1]) * n),
		H(e[2] + (255 - e[2]) * n)
	];
}
function JC(e) {
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
function YC(e, t, n) {
	return `#${iC(e)}${iC(t)}${iC(n)}`;
}
function XC(e, t, n, r) {
	return `rgba(${e}, ${t}, ${n}, ${(r / 255).toFixed(3)})`;
}
function ZC(e, t, n) {
	let r = e / 255, i = t / 255, a = n / 255, o = Math.max(r, i, a), s = o - Math.min(r, i, a), c = 0;
	return s !== 0 && (c = o === r ? (i - a) / s % 6 : o === i ? (a - r) / s + 2 : (r - i) / s + 4, c *= 60, c < 0 && (c += 360)), [
		c,
		o === 0 ? 0 : s / o,
		o
	];
}
function QC(e, t, n) {
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
		H((o + a) * 255),
		H((s + a) * 255),
		H((c + a) * 255)
	];
}
function $C(e) {
	return Math.min(1, Math.max(0, e));
}
//#endregion
//#region src/interactions/element-size.ts
function ew(e, t) {
	if (typeof ResizeObserver == "function") {
		let n = new ResizeObserver(() => t(e));
		return n.observe(e), () => n.disconnect();
	}
	let n = () => t(e);
	return window.addEventListener("resize", n), () => window.removeEventListener("resize", n);
}
//#endregion
//#region src/interactions/table-columns-engine.ts
var U = "ui-table", tw = "ui-table--reorderable", nw = "ui-scroll-x--auto", rw = "ui-scroll-x--always", iw = `:scope > .${Lt}`, aw = `.${zt}`, ow = "ui-table__header-cell", sw = `${ow}--pinned`, cw = `${iw} > .${Rt} > .${ow}`, lw = `${cw}--pinned`, uw = "ui-table__host", dw = `${iw} > .${uw}`, fw = `.${U}, .${It}, [${Mt}]`, pw = "--ui-table-columns", mw = "--ui-table-sized-columns", hw = "--ui-table-pin-", gw = "--ui-table-order-", _w = 64, vw = "data-ui-table-cell-hidden", yw = "data-ui-table-cell-last", bw = "columns", xw = "hidden", Sw = "order", Cw = "layout", ww = 32, Tw = 16, Ew = class {
	root;
	store = new wv();
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
		if (this.root = e.root ?? document, this.drag = new hx({
			root: this.root,
			resolveHandle: (e) => e.closest(aw),
			begin: (e) => this.resolveContext(e),
			coordinate: () => "clientX",
			move: (e, t) => this.apply(e, t),
			end: (e, t) => this.remember(t.table)
		}), this.reorder = new hx({
			root: this.root,
			resolveHandle: (e) => this.resolveCaption(e),
			begin: (e, t) => this.beginReorder(e, t.x),
			coordinate: () => "clientX",
			move: (e, t) => this.aimDrop(e, t),
			end: (e, t) => this.endReorder(e, t)
		}), this.root.addEventListener("pointerdown", () => {
			this.moved = !1;
		}, !0), window.addEventListener("click", (e) => this.swallowClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0), typeof matchMedia == "function") for (let e of Zb) e !== "base" && matchMedia(`(min-width: ${Qb[e]}px)`).addEventListener("change", () => this.layoutAll());
		this.restoreEach(this.root.querySelectorAll(`.${U}`)), j(this.root, `.${U}`, {
			childList: !0,
			relevant: kw
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.stampUnstyledColumns(t, !0);
			this.restoreEach(e);
		}), j(this.root, `.${U}`, {
			attributeFilter: ["class"],
			relevant: (e) => e.target instanceof Element && e.target.classList.contains(U)
		}, (e) => {
			for (let t of e) this.restored.has(t) && this.layout(t);
		}), j(this.root, `.${U}`, {
			childList: !0,
			attributeFilter: ["class", "hidden"],
			relevant: Aw
		}, (e) => {
			for (let t of e) {
				let e = t.querySelector(dw);
				e !== null && t.hasAttribute("data-ui-table-scrollbar") && this.markScrollbar(t, e);
			}
		});
	}
	restoreEach(e) {
		for (let t of e) {
			if (this.restored.has(t)) continue;
			this.restored.add(t), this.restore(t), this.layout(t), ew(t, () => this.pin(t));
			let e = t.querySelector(dw);
			e !== null && (this.markScrollbar(t, e), ew(e, () => this.markScrollbar(t, e)));
		}
	}
	restore(e) {
		let t = this.columnsOf(e), n = this.store.read(e, bw), r = n === null ? null : gx(n);
		r !== null && r.length !== t.length ? (this.store.write(e, bw, null), this.store.writeBoot(e, Cw, null), this.widths.set(e, null)) : this.widths.set(e, r);
		let i = this.store.readJson(e, Sw);
		if (i !== null && !Mw(i, t)) {
			this.store.write(e, Sw, null), this.orders.set(e, null);
			return;
		}
		this.orders.set(e, i);
	}
	markScrollbar(e, t) {
		let n = getComputedStyle(t).overflowY;
		e.toggleAttribute(Gt, n === "scroll" || n === "auto" && t.scrollHeight > t.clientHeight);
	}
	layoutAll() {
		for (let e of this.root.querySelectorAll(`.${U}`)) this.layout(e);
	}
	layout(e) {
		let t = this.columnsOf(e), n = this.hiddenOf(e, t), r = this.placesOf(e, t), i = jw(r), a = this.widths.get(e) ?? null, o = r.some((e, t) => e !== t), s = e.classList.contains(nw) || e.classList.contains(rw);
		if (a === null && n.size === 0 && !o && !s) e.style.removeProperty(mw);
		else {
			let t = a ?? this.authoredTracks(e);
			if (t !== null) {
				let r = Ix(t, n);
				e.style.setProperty(mw, bx(i.map((e) => r[e]), s ? "max-content" : "auto"));
			}
		}
		for (let t = 0; t < r.length; t++) o ? e.style.setProperty(`${gw}${t}`, String(r[t])) : e.style.removeProperty(`${gw}${t}`);
		let c = [...n].sort((e, t) => e - t).join(" ");
		c.length === 0 ? e.removeAttribute(Ft) : e.getAttribute("data-ui-table-hidden") !== c && e.setAttribute(Ft, c);
		let l = [...i].reverse().find((e) => !n.has(e));
		if (l === void 0 ? e.removeAttribute(Bt) : e.getAttribute("data-ui-table-last") !== String(l) && e.setAttribute(Bt, String(l)), this.columnStates.set(e, {
			places: r,
			hidden: n,
			last: l ?? -1
		}), this.stampUnstyledColumns(e, !1), e.classList.contains(tw)) for (let e of t) !e.anchored && !e.cell.hasAttribute("tabindex") && e.cell.setAttribute("tabindex", "0");
		this.pin(e);
	}
	stampUnstyledColumns(e, t) {
		let n = this.columnStates.get(e);
		if (n === void 0 || n.places.length <= _w) return;
		let r = `${n.places.join(",")}|${[...n.hidden].join(",")}|${n.last}`;
		if (!(!t && this.stampedStates.get(e) === r)) {
			this.stampedStates.set(e, r);
			for (let t of e.querySelectorAll(`[${Mt}]`)) {
				let r = Number(t.getAttribute(Mt));
				!(r >= _w) || t.closest(`.${U}`) !== e || (t.style.order = String(n.places[r] ?? r), t.toggleAttribute(vw, n.hidden.has(r)), t.toggleAttribute(yw, r === n.last));
			}
		}
	}
	columnsOf(e) {
		let t = [];
		for (let n of e.querySelectorAll(cw)) {
			let e = Number(n.getAttribute(Mt)), r = n.getAttribute(Nt), i = n.classList.contains(sw) || n.hasAttribute("data-ui-table-fixed");
			Number.isInteger(e) && t.push({
				index: e,
				key: n.getAttribute("data-ui-table-column-key") ?? String(e),
				hideBelow: Iw(r) ? r : null,
				startsHidden: n.hasAttribute(Pt),
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
		for (let e of t) (n[e.key] ?? Fw(e)) && r.add(e.index);
		return r;
	}
	choicesOf(e) {
		let t = this.hiddenChoices.get(e);
		return t === void 0 && (t = this.store.readJson(e, xw) ?? {}, this.hiddenChoices.set(e, t)), t;
	}
	authoredTracks(e) {
		let t = e.style.getPropertyValue(pw).trim(), n = t.length === 0 ? null : gx(t);
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
		n === null || i !== void 0 && n === Fw(i) ? delete r[t] : r[t] = n, this.hiddenChoices.set(e, r), this.store.writeJson(e, xw, Object.keys(r).length === 0 ? null : r), this.layout(e), this.rememberBoot(e);
	}
	columnOrder(e) {
		if (!(e instanceof HTMLElement)) return [];
		let t = this.columnsOf(e), n = new Map(t.map((e) => [e.index, e]));
		return jw(this.placesOf(e, t)).map((e) => n.get(e)?.key ?? "").filter((e) => e.length > 0);
	}
	pin(e) {
		let t = e.querySelectorAll(lw).length;
		if (t < 2) return;
		let n = Fx(this.trackSizes(e), t);
		for (let t = 1; t < n.length; t++) e.style.setProperty(`${hw}${t}`, `${n[t]}px`);
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof HTMLElement) || !t.classList.contains("ui-table__scroll") || t.closest(`.${U}`)?.toggleAttribute(Wt, t.scrollLeft > 0);
	}
	trackSizes(e) {
		let t = e.querySelector(iw), n = t === null ? [] : getComputedStyle(t).gridTemplateColumns.split(" ").map(parseFloat);
		return Dw(e) ? n.slice(1) : n;
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
		let t = e.target.closest(aw);
		if (t === null || this.drag.active) return;
		let n;
		switch (e.key) {
			case "ArrowLeft":
				n = -16;
				break;
			case "ArrowRight":
				n = Tw;
				break;
			default: return;
		}
		let r = this.resolveContext(t);
		r !== null && (e.preventDefault(), this.apply(r, n) && this.remember(r.table));
	}
	stepColumn(e, t) {
		let n = e.target instanceof Element ? this.resolveCaption(e.target) : null, r = n?.closest(`.${U}`) ?? null;
		if (n === null || r === null || this.reorder.active) return;
		let i = this.movableColumns(r), a = Number(n.getAttribute(Mt)), o = i.findIndex((e) => e.index === a), s = o + t;
		o < 0 || s < 0 || s >= i.length || (e.preventDefault(), this.moveColumn(r, a, t < 0 ? i[s].index : i[s + 1]?.index ?? null), n.focus({ preventScroll: !0 }));
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(aw)?.closest(`.${U}`) ?? null;
		t !== null && (this.widths.set(t, null), this.layout(t), this.remember(t));
	}
	apply(e, t) {
		let n = Dx(e.tracks.map((t, n) => n === e.index || n === e.after ? {
			...t,
			min: Math.max(ww, e.floors.get(n) ?? 0)
		} : t), e.sizes, {
			before: [e.index],
			after: [e.after]
		}, t);
		return n !== null && (this.widths.set(e.table, Ow(e.tracks, n, [e.index, e.after])), this.layout(e.table), !0);
	}
	remember(e) {
		let t = this.widths.get(e) ?? null;
		this.store.write(e, bw, t === null ? null : bx(t), null), this.rememberBoot(e);
	}
	rememberBoot(e) {
		let t = e.style.getPropertyValue(mw).trim(), n = e.getAttribute(Ft), r = {};
		t.length > 0 && (r[mw] = t);
		for (let t of e.style) t.startsWith(gw) && (r[t] = e.style.getPropertyValue(t));
		if (Object.keys(r).length === 0 && n === null) {
			this.store.writeBoot(e, Cw, null);
			return;
		}
		this.store.writeBoot(e, Cw, {
			styles: r,
			attributes: {
				[Ft]: n,
				[Bt]: e.getAttribute(Bt)
			}
		});
	}
	resolveContext(e) {
		let t = e.closest(`.${U}`);
		if (t === null) return null;
		let n = this.widths.get(t) ?? this.authoredTracks(t);
		if (n === null) return null;
		let r = Cx(t.getAttribute(kt)), i = wx(n, r), a = /* @__PURE__ */ new Map(), o = this.columnsOf(t), s = this.placesOf(t, o), c = this.columnSizes(t, s).filter((e) => Number.isFinite(e));
		for (let e of r) e.min !== void 0 && a.set(e.index, e.min);
		let l = Number(e.getAttribute(Mt)), u = this.hiddenOf(t, o), d = jw(s), f = (s[l] ?? -1) + 1;
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
		let t = e.closest(`.${ow}`), n = t?.closest(`.${U}`) ?? null;
		return t === null || n === null || !n.classList.contains(tw) || e.closest(aw) !== null || t.classList.contains(sw) || t.hasAttribute("data-ui-table-fixed") ? null : t;
	}
	beginReorder(e, t) {
		let n = e.closest(`.${U}`), r = Number(e.getAttribute(Mt));
		if (n === null || !Number.isInteger(r)) return null;
		let i = this.movableColumns(n), a = i.findIndex((e) => e.index === r);
		return a < 0 || i.length < 2 ? null : (n.setAttribute(Vt, ""), e.setAttribute(Ht, ""), {
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
		for (let a of jw(this.placesOf(e, t))) {
			let e = r.get(a);
			e !== void 0 && !e.anchored && !n.has(a) && i.push(e);
		}
		return i;
	}
	aimDrop(e, t) {
		let n = e.origin + t, r = 0;
		for (; r < e.places.length && n > Nw(e.places[r]);) r++;
		if (e.target = Math.min(Math.max(r > e.from ? r - 1 : r, 0), e.places.length - 1), Pw(e.table), e.target === e.from) return;
		let i = e.places.filter((t, n) => n !== e.from), a = i[e.target];
		a === void 0 ? i[i.length - 1].cell.setAttribute(Ut, "after") : a.cell.setAttribute(Ut, "before");
	}
	endReorder(e, t) {
		if (e.removeAttribute(Ht), t.table.removeAttribute(Vt), Pw(t.table), t.target === t.from) return;
		let n = t.places.filter((e, n) => n !== t.from);
		this.moved = !0, this.moveColumn(t.table, t.index, n[t.target]?.index ?? null);
	}
	moveColumn(e, t, n) {
		let r = this.columnsOf(e), i = new Map(r.map((e) => [e.index, e])), a = jw(this.placesOf(e, r)).filter((e) => i.get(e)?.anchored === !1), o = a.indexOf(t);
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
		this.orders.set(e, u ? null : c), this.store.write(e, Sw, u ? null : JSON.stringify(c)), this.layout(e), this.rememberBoot(e);
	}
	swallowClick(e) {
		this.moved && (this.moved = !1, e.preventDefault(), e.stopPropagation());
	}
};
function Dw(e) {
	return e.hasAttribute("data-ui-rows-draggable") && e.hasAttribute("data-ui-rows-drag-handle") && e.classList.contains("ui-drag-handle--start");
}
function Ow(e, t, n) {
	for (let r of n) e[r].kind === "star" && e[r].min === e[r].value && t[r].kind === "star" && (t[r] = {
		...t[r],
		min: t[r].value
	});
	return t;
}
function kw(e) {
	for (let t of e.addedNodes) if (t instanceof Element && (t.matches(fw) || t.querySelector(fw) !== null)) return !0;
	return !1;
}
function Aw(e) {
	let t = e.type === "childList" ? e.target : e.target.parentElement;
	return t instanceof Element && t.classList.contains(uw);
}
function jw(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t[e[n]] = n;
	return t;
}
function Mw(e, t) {
	if (e.length !== t.length) return !1;
	let n = new Set(t.map((e) => e.key));
	return e.every((e) => n.delete(e)) && n.size === 0;
}
function Nw(e) {
	let t = e.cell.getBoundingClientRect();
	return t.left + t.width / 2;
}
function Pw(e) {
	for (let t of e.querySelectorAll(`[${Ut}]`)) t.removeAttribute(Ut);
}
function Fw(e) {
	return e.startsHidden || e.hideBelow !== null && Zb.indexOf($b()) < Zb.indexOf(e.hideBelow);
}
function Iw(e) {
	return e !== null && Zb.includes(e);
}
//#endregion
//#region src/items/items-group-runs.ts
var Lw = /* @__PURE__ */ new WeakMap();
function Rw(e, t) {
	let n = /* @__PURE__ */ new Set(), r = e.getAttribute(st);
	for (let i of N(e)) {
		let a = i.getAttribute("data-ui-group") ?? "";
		if (a !== "" && a !== r) {
			let r = zw(i, a) ?? Bw(e, i, a, t);
			r !== null && n.add(r);
		}
		r = a;
	}
	for (let t of e.querySelectorAll(`:scope > [${We}]`)) n.has(t) || t.remove();
}
function zw(e, t) {
	let n = e.previousElementSibling, r = n === null ? void 0 : Lw.get(n);
	return r !== void 0 && r.row === e && r.group === t ? n : null;
}
function Bw(e, t, n, r) {
	let i = r(t);
	return i === null ? null : (Hw(i, t.getAttribute(h)), Lw.set(i, {
		row: t,
		group: n
	}), e.insertBefore(i, t), i);
}
function Vw(e) {
	return e.find((e) => !e.classList.contains(An));
}
function Hw(e, t) {
	e.setAttribute(We, ""), t === null ? e.removeAttribute(Ge) : e.setAttribute(Ge, t);
}
var Uw = "bottom";
function Ww(e, t, n) {
	let r = e.querySelector(`:scope > [${tt}="${t}"]`);
	if (n <= 0) {
		r?.remove();
		return;
	}
	r === null && (r = document.createElement("div"), r.setAttribute(tt, t), r.style.flexShrink = "0"), t === "top" ? e.firstElementChild !== r && e.insertBefore(r, e.firstElementChild) : e.lastElementChild !== r && e.appendChild(r), r.style.height = `${n}px`;
}
//#endregion
//#region src/items/items-dom-order.ts
function Gw(e, t) {
	let n = e.firstElementChild;
	n !== null && n.getAttribute("data-ui-window-spacer") === "top" && (n = n.nextElementSibling);
	for (let r of t) r !== n && e.insertBefore(r, n), n = r.nextElementSibling;
}
//#endregion
//#region src/items/items-group-renderer.ts
var Kw = /* @__PURE__ */ new WeakMap();
function qw(e) {
	for (let t of e.querySelectorAll(`[${We}]`)) t.remove();
}
function Jw(e, t, n, r, i, a) {
	let o = Bm(e, N(e)), s = n.getGroupTemplate(t), c = s !== void 0, l = c && o.some((e) => e.hasAttribute("data-ui-group")), u = Am(i.getItemsFilterSortMetadata(t), a, Em(e));
	if (c && !l && qw(e), o.length === 0) {
		Kw.set(e, []);
		return;
	}
	let d = dm(e);
	if (!l) {
		Gw(e, [...jm(o, u, r), ...um(d)]);
		return;
	}
	qw(e);
	let f = /* @__PURE__ */ new Map();
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "", n = f.get(t);
		n === void 0 ? f.set(t, [e]) : n.push(e);
	}
	let p = (Kw.get(e) ?? []).filter((e) => f.has(e));
	for (let e of o) {
		let t = e.getAttribute("data-ui-group") ?? "";
		p.includes(t) || p.push(t);
	}
	Kw.set(e, p);
	let ee = [];
	for (let e of p) {
		let t = f.get(e);
		if (t === void 0 || t.length === 0) continue;
		u.length > 0 && (t = jm(t, u, r));
		let n = e === "" ? void 0 : Vw(t);
		if (n !== void 0) {
			let e = Yw(s, r, n);
			e !== null && ee.push(e);
		}
		ee.push(...t);
	}
	Gw(e, [...ee, ...um(d)]);
}
function Yw(e, t, n) {
	let r = t.renderFromTemplate(e, t.getItemValue(n));
	return r !== null && Hw(r, n.getAttribute(h)), r;
}
//#endregion
//#region src/items/items-host-sync.ts
var Xw = "ui-tree-rules", Zw = "ui-tree";
function Qw(e, t, n) {
	if (e.parentElement?.classList.contains(Zw) === !0) {
		e.dispatchEvent(new Event(Xw, { bubbles: !0 }));
		return;
	}
	switch (Rm(e)) {
		case "windowed":
			fm(e, t, n.templates, n.renderer), $w(e, t, n);
			return;
		case "virtualized":
			n.virtualization.sync(e);
			return;
		default:
			Dm(e, t, n.metadata, n.renderer, n.state), fm(e, t, n.templates, n.renderer), Jw(e, t, n.templates, n.renderer, n.metadata, n.state);
			return;
	}
}
function $w(e, t, n) {
	let r = n.templates.getGroupTemplate(t);
	r !== void 0 && Rw(e, (e) => Yw(r, n.renderer, e));
}
//#endregion
//#region src/interactions/items-selection-engine.ts
var eT = ".ui-items-view, .ui-table", tT = /* @__PURE__ */ new Set([
	" ",
	"Enter",
	"Delete"
]), nT = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(Pa)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), j(this.root, Pa, {
			childList: !0,
			attributeFilter: [
				hn,
				_n,
				vn
			]
		}, (e) => this.applyAll(e));
	}
	applyAll(e) {
		for (let t of e) this.apply(t);
	}
	apply(e) {
		let t = this.ownItems(e);
		if (Wa(e, t), e.matches(eT)) for (let e of t) {
			let t = md(e);
			t !== null && t.getAttribute("tabindex") !== "-1" && t.setAttribute("tabindex", "-1");
		}
	}
	handleClick(e) {
		let t = this.resolveRow(e, Pa);
		if (t === null || !(e instanceof MouseEvent)) return;
		let { root: n, item: r } = t, i = this.ownItems(n);
		if (co(n, i, r), n.focus({ preventScroll: !0 }), n.hasAttribute("data-ui-no-row-select")) {
			za(n, r);
			return;
		}
		Ka(n, i, r, Ba(e)) && e.preventDefault();
	}
	resolveRow(e, t) {
		if (!(e.target instanceof Element)) return null;
		let n = e.target.closest(Fa), r = n?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
		return n === null || r === null || n.closest(".ui-items-view, .ui-table, .ui-tree") !== r || !r.matches(t) || w(r) ? null : hd(e.target, n) === null && !T(n) ? {
			root: r,
			item: n
		} : null;
	}
	handleDoubleClick(e) {
		let t = this.resolveRow(e, eT);
		t === null || e.target instanceof Element && t.item.contains(e.target.closest("[data-ui-no-row-open]")) || (e.preventDefault(), po(t.item, "open"));
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.altKey || !(e.target instanceof Element)) return;
		let t = io(e.target);
		if (t === null || t.row !== null && hd(e.target, t.row) !== null) return;
		let { root: n } = t;
		if (!n.matches(eT) || w(n)) return;
		let r = rT(n);
		if (!tT.has(e.key) && !Da(e.key, r === "grid" ? "both" : r)) return;
		let i = this.ownItems(n), a = oo(i), o = lo(e.key, i, so(i), r);
		if (o !== null) {
			e.preventDefault(), co(n, i, o), (n.getAttribute("data-ui-selection") === "one" || e.shiftKey) && (e.shiftKey && Ra(n, a), Ka(n, i, o, Va(n, e)));
			return;
		}
		if (a === null || T(a)) return;
		let s = md(a);
		switch (e.key) {
			case " ":
				if (!Ka(n, i, a, {
					shift: !1,
					ctrl: !0
				})) {
					if (s === null) return;
					s.click();
				}
				break;
			case "Enter":
				Ha(n) && !Ga(i).includes(a) && Ka(n, i, a, Ia), s === null ? po(a, "open") : s.click();
				break;
			case "Delete": {
				let e = iT(i, a);
				if (e.length === 0) return;
				for (let t of e) po(t, "remove");
				break;
			}
			default: return;
		}
		e.preventDefault();
	}
	ownItems(e) {
		return M(e, Fa, Pa);
	}
};
function rT(e) {
	return e.matches(".ui-items-view--wrap") ? "grid" : e.matches(".ui-orientation--horizontal") ? "both" : "vertical";
}
function iT(e, t) {
	let n = Ga(e);
	return (n.includes(t) ? n : [t]).filter((e) => !e.hasAttribute("data-ui-unremovable") && !T(e));
}
//#endregion
//#region src/interactions/tree-drop.ts
function aT(e, t) {
	if (T(e)) return !1;
	let n = t?.getAttribute(Yt);
	return n === "true" || n !== "false" && e.hasAttribute("aria-expanded");
}
//#endregion
//#region src/interactions/tree-engine.ts
var oT = "ui-tree", sT = "ui-tree__row", cT = "ui-tree__row--folded", lT = "ui-tree__row--filtered", uT = "fold-hidden", dT = "fold-shown", fT = "ui-tree__row--dragging", pT = "ui-tree__loading", mT = "ui-tree__loading-ring", hT = "ui-tree-node", gT = "ui-tree-node__text", _T = "ui-tree-node__toggle", vT = "ui-tree-node__rename", yT = ".ui-text__title", bT = "data-ui-tree-drop", xT = "--ui-tree-depth", ST = "expanded", CT = 600, wT = /* @__PURE__ */ new Set([
	" ",
	"ArrowRight",
	"ArrowLeft",
	"Enter",
	"F2",
	"Delete"
]), TT = class {
	root;
	store = new wv();
	rules;
	folds = /* @__PURE__ */ new WeakMap();
	requested = /* @__PURE__ */ new WeakSet();
	writtenBoot = /* @__PURE__ */ new WeakMap();
	springTarget = null;
	springTimer = 0;
	constructor(e = {}) {
		this.root = e.root ?? document, this.rules = e.rules, this.root.addEventListener(Xw, (e) => {
			let t = e.target instanceof Element ? e.target.closest(`.${oT}`) : null;
			t !== null && this.layout(t);
		}, !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeyDown(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("dragleave", (e) => this.handleDragLeave(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), e.effects?.register("RenameNode", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename node effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(b(n.id), n.dynamicParameters ?? []), i = r === null ? null : this.rowsOf(r).find((e) => k(e) === t.key) ?? null;
			if (i === null) {
				s("rename node effect names no node on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.layoutAll(this.root.querySelectorAll(`.${oT}`)), j(this.root, `.${oT}`, {
			childList: !0,
			attributeFilter: [
				qt,
				Jt,
				Xt,
				tn
			],
			relevant: OT
		}, (e) => this.layoutAll(e));
	}
	layoutAll(e) {
		for (let t of e) this.layout(t);
	}
	layout(e) {
		let t = this.foldOf(e), n = this.resolveRules(e), r = n === null ? this.rowsOf(e) : this.orderRows(e, n), i = e.hasAttribute(tn), a = /* @__PURE__ */ new Set();
		for (let e of r) {
			let t = jT(e)?.getAttribute(qt);
			t != null && t.length > 0 && a.add(t);
		}
		let o = n?.filtering === !0 ? this.matchingRows(r, n) : null, s = /* @__PURE__ */ new Map();
		for (let e of r) {
			let n = k(e), r = jT(e), c = r?.getAttribute("data-ui-tree-parent") ?? "", l = c.length > 0 ? s.get(c) : void 0, u = l === void 0 ? 0 : l.depth + 1, d = l === void 0 || l.shown && l.expanded, f = r?.hasAttribute(Jt) === !0, p = f || a.has(n), ee = p && r?.hasAttribute("data-ui-tree-expanded") === !0, te = l === void 0 || l.authoredShown && this.authoredExpandedOf(l), ne = p && (o === null ? t[n] ?? ee : o.has(n)), re = o !== null && !o.has(n);
			e.style.setProperty(xT, String(u)), e.setAttribute("aria-level", String(u + 1)), e.classList.toggle(cT, !d), e.classList.toggle(lT, re), e.removeAttribute(en), e.draggable = i && !e.hasAttribute("data-ui-undraggable") && !T(e), p ? e.setAttribute("aria-expanded", ne ? "true" : "false") : e.removeAttribute("aria-expanded"), (a.has(n) || !f) && e.removeAttribute(Qt), ne && d && f && !a.has(n) && !this.requested.has(e) && (this.requested.add(e), e.setAttribute(Qt, ""), e.dispatchEvent(new Event("unfold", { bubbles: !0 }))), ne || this.requested.delete(e), this.placeLoadingRow(e, u + 1, e.hasAttribute(Qt), d && ne && !re), s.set(n, {
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
		return jT(e.row)?.hasAttribute(Xt) === !0;
	}
	writeBootFold(e, t, n) {
		if (Object.keys(t).length === 0) return;
		let r = [], i = [];
		for (let [e, t] of n) t.shown !== t.authoredShown && (t.shown ? i : r).push(`.${sT}[${h}="${CSS.escape(e)}"]`);
		let a = `${r.join(",")}|${i.join(",")}`;
		this.writtenBoot.get(e) !== a && (this.writtenBoot.set(e, a), this.store.writeBoot(e, uT, r.length === 0 ? null : this.bootPatch(r, "hidden")), this.store.writeBoot(e, dT, i.length === 0 ? null : this.bootPatch(i, "shown")));
	}
	bootPatch(e, t) {
		return {
			selector: e.join(","),
			attributes: { [en]: t }
		};
	}
	resolveRules(e) {
		let t = this.hostOf(e), n = Dr(e);
		if (this.rules === void 0 || t === null || n === null) return null;
		let r = this.rules.metadata.getItemsFilterSortMetadata(n), i = Em(t);
		if (r === void 0 && i === null) return null;
		let a = Am(r, this.rules.state, i), o = km(r, this.rules.state, i);
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
			let t = jT(e)?.getAttribute("data-ui-tree-parent") ?? "", n = i.has(t) ? t : "", r = a.get(n);
			r === void 0 ? a.set(n, [e]) : r.push(e);
		}
		let o = [], s = (e) => {
			let n = a.get(e);
			if (n !== void 0) {
				n.sort((e, n) => Mm(r.getItemValue(e), r.getItemValue(n), t.sorts));
				for (let e of n) o.push(e), s(k(e));
			}
		};
		if (s(""), o.length !== n.length || o.every((e, t) => e === n[t])) return o.length === n.length ? o : n;
		let c = this.hostOf(e);
		if (c === null) return n;
		for (let e of c.querySelectorAll(`:scope > .${pT}`)) e.remove();
		for (let e of o) c.appendChild(e);
		return o;
	}
	matchingRows(e, t) {
		let n = /* @__PURE__ */ new Set();
		if (this.rules === void 0) return n;
		let r = this.rules.state, i = this.rules.renderer;
		for (let a = e.length - 1; a >= 0; a--) {
			let o = e[a], s = k(o), c = i.getItemValue(o);
			if (c === void 0 || Om(t.config, c, r, t.query) || n.has(s)) {
				n.add(s);
				let e = jT(o)?.getAttribute("data-ui-tree-parent") ?? "";
				e.length > 0 && n.add(e);
			}
		}
		return n;
	}
	placeLoadingRow(e, t, n, r) {
		let i = e.nextElementSibling, a = i instanceof HTMLElement && i.classList.contains(pT) ? i : null;
		if (!n) {
			a?.remove();
			return;
		}
		let o = a ?? kT();
		o.style.setProperty(xT, String(t)), o.classList.toggle(cT, !r), a === null && e.after(o);
	}
	handleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null) return;
		let { tree: n, row: r, target: i } = t;
		i.closest(`.${_T}`) === null && (!r.hasAttribute("data-ui-unselectable") || hd(i, r) !== null) || (e.preventDefault(), this.setFocus(n, r, null), this.toggle(n, r));
	}
	handleDoubleClick(e) {
		let t = this.rowOfEvent(e);
		if (t === null || hd(t.target, t.row) !== null) return;
		let { tree: n, row: r } = t;
		e.preventDefault(), n.hasAttribute("data-ui-tree-rename-dblclick") && this.canRename(n, r) ? this.startRename(r) : r.dispatchEvent(new Event("open", { bubbles: !0 }));
	}
	rowOfEvent(e) {
		if (!(e.target instanceof Element)) return null;
		let t = e.target.closest(`.${sT}`), n = t?.closest(`.${oT}`) ?? null;
		return t === null || n === null || t.closest(`.${oT}`) !== n || T(t) ? null : {
			tree: n,
			row: t,
			target: e.target
		};
	}
	handleKeyDown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.isComposing || !(e.target instanceof Element)) return;
		let t = io(e.target);
		if (t === null || t.row !== null && hd(e.target, t.row) !== null) return;
		let n = t.root;
		if (!n.classList.contains(oT) || w(n) || !wT.has(e.key) && !Da(e.key, "vertical")) return;
		let r = this.rowsOf(n), i = oo(r), a = lo(e.key, r, so(r), "vertical");
		if (a !== null) {
			e.preventDefault(), this.setFocus(n, a, Va(n, e));
			return;
		}
		if (!(i === null || T(i))) {
			switch (e.key) {
				case " ":
					if (!Ka(n, r, i, {
						shift: !1,
						ctrl: !0
					})) return;
					break;
				case "ArrowRight":
					i.getAttribute("aria-expanded") === "false" ? this.toggle(n, i) : i.getAttribute("aria-expanded") === "true" && this.setFocus(n, lo("ArrowDown", r, i, "vertical"), Ia);
					break;
				case "ArrowLeft":
					i.getAttribute("aria-expanded") === "true" ? this.toggle(n, i) : this.setFocus(n, this.parentOf(n, i), Ia);
					break;
				case "Enter":
					Ha(n) && !Ga(r).includes(i) && Ka(n, r, i, Ia), i.dispatchEvent(new Event("open", { bubbles: !0 }));
					break;
				case "F2":
					if (!this.canRename(n, i)) return;
					this.startRename(i);
					break;
				case "Delete": {
					if (n.hasAttribute("data-ui-tree-unremovable")) return;
					let e = iT(r, i);
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
		let t = AT(e), n = t?.closest(`.${oT}`) ?? null;
		if (t === null || n === null || !n.hasAttribute("data-ui-tree-draggable")) return;
		if (T(t)) {
			e.preventDefault();
			return;
		}
		let r = t.hasAttribute("data-ui-selected") ? Ga(this.rowsOf(n)).filter((e) => e !== t && e.draggable && !T(e) && e.getClientRects().length > 0) : [];
		qm(e, n, t, fT, k(t), r);
	}
	draggingRows(e) {
		return this.rowsOf(e).filter((e) => e.classList.contains(fT));
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oT}`), n = t === null ? [] : this.draggingRows(t), r = t === null ? null : this.hostOf(t);
		if (t === null || n.length === 0 || r === null) return;
		let i = e.target.closest(`.${sT}`), a = i !== null && i.closest(`.${oT}`) === t ? i : r;
		if (a !== r) {
			let e = this.parentKeysOf(t);
			if (!aT(a, jT(a)) || n.some((t) => t === a || DT(e, k(a), k(t)))) {
				this.markDrop(t, null), this.springOpen(t, null);
				return;
			}
		}
		e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), this.markDrop(t, a), this.springOpen(t, a === r ? null : a);
	}
	springOpen(e, t) {
		let n = t !== null && t.getAttribute("aria-expanded") === "false" ? t : null;
		n !== this.springTarget && (window.clearTimeout(this.springTimer), this.springTarget = n, n !== null && (this.springTimer = window.setTimeout(() => this.expand(e, n), CT)));
	}
	handleDragLeave(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oT}`);
		t !== null && !(e.relatedTarget instanceof Node && t.contains(e.relatedTarget)) && (this.markDrop(t, null), this.springOpen(t, null));
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${oT}`), n = t === null ? [] : this.draggingRows(t), r = t?.querySelector(`[${bT}]`) ?? null;
		if (t === null || n.length === 0 || r === null) return;
		e.preventDefault();
		let i = r.classList.contains(sT) ? k(r) : "", a = this.parentKeysOf(t), o = n.filter((e) => !n.some((t) => t !== e && DT(a, k(e), k(t))));
		this.markDrop(t, null), this.springOpen(t, null), Jm(t, fT), r.classList.contains(sT) && this.expand(t, r);
		for (let e of o) {
			let t = jT(e)?.querySelector(`.${gT}`) ?? null;
			t !== null && (t.setAttribute($t, i), t.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("move", { bubbles: !0 })));
		}
	}
	handleDragEnd(e) {
		let t = AT(e)?.closest(`.${oT}`) ?? null;
		t !== null && (Jm(t, fT), this.markDrop(t, null), this.springOpen(t, null));
	}
	markDrop(e, t) {
		for (let n of e.querySelectorAll(`[${bT}]`)) n !== t && n.removeAttribute(bT);
		t?.setAttribute(bT, "");
	}
	parentKeysOf(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of this.rowsOf(e)) t.set(k(n), jT(n)?.getAttribute("data-ui-tree-parent") ?? "");
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
		let a = n ? this.rowsOf(e).filter((e) => e.classList.contains(cT)) : [];
		this.store.writeJson(e, ST, i), this.layout(e), ET(a.filter((e) => !e.classList.contains(cT)));
	}
	foldOf(e) {
		let t = this.folds.get(e);
		return t === void 0 && (t = this.store.readJson(e, ST) ?? {}, this.folds.set(e, t)), t;
	}
	setFocus(e, t, n) {
		if (t === null) return;
		let r = this.rowsOf(e), i = oo(r);
		co(e, r, t), !(n === null || !(e.getAttribute("data-ui-selection") === "one" || n.shift)) && (n.shift && Ra(e, i), Ka(e, r, t, n));
	}
	parentOf(e, t) {
		let n = jT(t)?.getAttribute("data-ui-tree-parent") ?? "";
		return n.length === 0 ? null : this.rowsOf(e).find((e) => k(e) === n) ?? null;
	}
	startRename(e) {
		let t = e.closest(`.${oT}`), n = jT(e), r = n?.querySelector(yT) ?? null;
		t === null || n === null || r === null || e.hasAttribute("data-ui-unrenamable") || (this.setFocus(t, e, null), Sc({
			container: n,
			title: r,
			className: vT,
			value: n.getAttribute("data-ui-tree-title") ?? r.textContent?.trim() ?? "",
			commit: (t) => {
				n.setAttribute(Zt, t), n.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
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
		for (let e of t.children) e instanceof HTMLElement && e.classList.contains(sT) && n.push(e);
		return n;
	}
};
function ET(e) {
	if (!(e.length === 0 || ks())) for (let t of e) t.animate([{
		opacity: 0,
		offset: 0
	}], {
		duration: Os.fast,
		easing: Os.enter
	});
}
function DT(e, t, n) {
	let r = /* @__PURE__ */ new Set();
	for (let i = e.get(t) ?? ""; i.length > 0 && !r.has(i); i = e.get(i) ?? "") {
		if (i === n) return !0;
		r.add(i);
	}
	return !1;
}
function OT(e) {
	if (e.type !== "childList") return !0;
	let t = e.target;
	return t instanceof HTMLElement && (t.classList.contains(sT) || t.hasAttribute("data-ui-items-host") && t.parentElement?.classList.contains(oT) === !0);
}
function kT() {
	let e = document.createElement("div"), t = document.createElement("span");
	return e.className = pT, e.setAttribute("aria-hidden", "true"), t.className = mT, e.append(t, C.text("ui.tree.loading")), e;
}
function AT(e) {
	return e.target instanceof Element ? e.target.closest(`.${sT}`) : null;
}
function jT(e) {
	return e.querySelector(`.${hT}`);
}
var MT = "tabs:rename", NT = "tabs:pin", PT = "tabs:unpin", FT = "tabs:close", IT = "tabs:delete";
function LT(e) {
	let t = (e ?? "").split(/\s+/);
	return {
		rename: t.includes("rename"),
		pin: t.includes("pin"),
		close: t.includes("close"),
		delete: t.includes("delete")
	};
}
function RT(e, t) {
	let n = !t.pinned && t.removable;
	return /* @__PURE__ */ new Map([
		[MT, e.rename && t.renamable],
		[NT, e.pin && !t.pinned],
		[PT, e.pin && t.pinned],
		[FT, e.close && !e.delete && n],
		[IT, e.delete && n]
	]);
}
function zT(e) {
	let t = e.map(() => !1), n = !1, r = -1;
	for (let i = 0; i < e.length; i++) e[i] === "rule" ? n && r === -1 && (r = i) : e[i] === "shown" && (r !== -1 && (t[r] = !0), r = -1, n = !0);
	return t;
}
//#endregion
//#region src/interactions/tab-order.ts
function BT(e, t) {
	let n = e[t + 1];
	if (n === void 0 || n.order !== null) return /* @__PURE__ */ new Map([[t, VT(e[t - 1]?.order ?? null, n?.order ?? null)]]);
	let r = /* @__PURE__ */ new Map();
	return e.forEach((e, t) => {
		e.order !== t && r.set(t, t);
	}), r;
}
function VT(e, t) {
	return e === null && t === null ? 0 : e === null ? t - 1 : t === null ? e + 1 : (e + t) / 2;
}
function HT(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) e[n].pinned && (t = n + 1);
	return t;
}
//#endregion
//#region src/interactions/tabs-view-engine.ts
var W = "ui-tabs-view", UT = "ui-tab-item", WT = "ui-tab-item__label", GT = "ui-tab-item__close", KT = "ui-tab-item__rename", qT = "ui-tab-item__caption", JT = "ui-tab-item__pin", YT = ".ui-text__title", XT = "ui-tab-item--dragging", ZT = "ui-tab-item__caption--overflowed", QT = "ui-tabs-view--overflowing", $T = "ui-tabs-view--no-overflow", eE = "ui-tab-item__page", tE = "ui-tab-item--selected", nE = ".ui-menu-item", rE = "tab-menu-entry", iE = {
	name: rE,
	registration: { dynamicParameters: (e) => e.domEvent.detail?.keys ?? null }
}, aE = "--ui-tabs-view-strip", oE = class {
	root;
	fitter;
	dragStart = null;
	menuTab = null;
	constructor(e = {}) {
		this.root = e.root ?? document, this.fitter = new bS({
			rootClass: W,
			overflowingClass: QT,
			wraps: (e) => e.classList.contains($T),
			hiddenClass: ZT,
			refit: (e) => this.apply(e),
			pick: (e, t) => this.pickFromOverflow(e, t)
		}), this.applyAll(), e.effects?.register("RenameTab", (e) => {
			let t = e.effect, n = t.target;
			if (n === void 0 || n.id === void 0 || typeof t.key != "string") {
				s("rename tab effect carries no target or key.", t);
				return;
			}
			let r = e.dom.findComponent(b(n.id), n.dynamicParameters ?? []), i = (r === null ? void 0 : this.ownItems(r).find((e) => vE(e) === t.key))?.querySelector(`.${WT}`) ?? null;
			if (i === null) {
				s("rename tab effect names no tab on the page.", t);
				return;
			}
			this.startRename(i);
		}), this.root.addEventListener(ov, (e) => this.prepareMenu(e)), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("dblclick", (e) => this.handleDoubleClick(e), !0), this.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), this.root.addEventListener("dragover", (e) => this.handleDragOver(e), !0), this.root.addEventListener("drop", (e) => this.handleDrop(e), !0), this.root.addEventListener("dragend", (e) => this.handleDragEnd(e), !0), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), j(this.root, `.${W}`, {
			childList: !0,
			attributeFilter: [
				bn,
				ye,
				...wn
			],
			relevant: (e) => !hc(e, `.${eE}`, `.${W}`)
		}, (e) => {
			for (let t of e) this.apply(t);
		});
	}
	applyAll() {
		for (let e of this.root.querySelectorAll(`.${W}`)) this.apply(e);
	}
	apply(e) {
		let t = this.ownItems(e), n = t.filter(Cy);
		if (n.length === 0) return;
		let r = e.getAttribute("data-ui-tabs-selected") ?? "";
		if (!n.some((e) => vE(e) === r)) {
			this.select(e, vE(n[0]));
			return;
		}
		let i = e.hasAttribute(ye), a = [], o = null, s = null;
		for (let e of t) {
			let t = vE(e) === r;
			e.classList.toggle(tE, t);
			let c = e.querySelector(`.${qT}`);
			c !== null && (c.draggable = i, n.includes(e) && (a.push(c), t && (o = c))), e.querySelector(`.${WT}`)?.setAttribute("aria-selected", t ? "true" : "false");
			for (let n of e.querySelectorAll(`.${eE}`)) n.hidden = !t;
			t && (s = e.querySelector(`.${eE}`));
		}
		this.fitCaptions(e, a, o), this.writeStripHeight(e, s);
		let c = [], l = null;
		for (let e of a) {
			let t = e.querySelector(`.${WT}`);
			t === null || e.classList.contains(ZT) || (c.push(t), e === o && (l = t));
		}
		D(c, l);
	}
	writeStripHeight(e, t) {
		let n = this.hostOf(e);
		if (n === null || t === null || !Cy(t)) return;
		let r = Math.max(0, Math.round(t.getBoundingClientRect().top - n.getBoundingClientRect().top));
		n.style.setProperty(aE, `${r}px`);
	}
	hostOf(e) {
		return e.querySelector(`:scope > [${g}]`);
	}
	fitCaptions(e, t, n) {
		let r = this.hostOf(e), i = e.querySelector(`:scope > .${hS}`);
		r !== null && i !== null && this.fitter.fit(e, {
			room: r,
			button: i,
			captions: t,
			selected: n
		});
	}
	pickFromOverflow(e, t) {
		this.select(e, t), this.ownItems(e).find((e) => vE(e) === t)?.querySelector(`.${WT}`)?.focus({ preventScroll: !0 });
	}
	toggleOverflow(e, t) {
		this.fitter.toggleList(e, t, () => {
			let t = e.getAttribute("data-ui-tabs-selected") ?? "";
			return this.ownItems(e).filter(Cy).map((e) => ({
				key: vE(e),
				title: e.querySelector(`.${WT}`)?.textContent?.trim() ?? vE(e),
				current: vE(e) === t,
				disabled: w(e.querySelector(`.${WT}`) ?? e)
			}));
		});
	}
	prepareMenu(e) {
		let t = e.target;
		if (!(e instanceof CustomEvent) || !(t instanceof HTMLElement) || t.getAttribute("data-ui-context-menu") !== "tab") return;
		let n = t.parentElement, r = e.detail.target.closest(`.${UT}`);
		if (n === null || !n.classList.contains(W) || r === null || r.closest(`.${W}`) !== n) {
			e.preventDefault();
			return;
		}
		let i = lE(n, r), a = dE(t), o = a.map((e) => {
			if (uE(e)) return "rule";
			let t = i.get(e.getAttribute("data-ui-key") ?? "");
			return t !== void 0 && (e.style.display = t ? "" : "none"), t ?? Cy(e) ? "shown" : "hidden";
		});
		if (zT(o).forEach((e, t) => {
			o[t] === "rule" && (a[t].style.display = e ? "" : "none");
		}), !o.includes("shown")) {
			e.preventDefault();
			return;
		}
		this.menuTab = {
			root: n,
			key: vE(r)
		};
	}
	handleMenuEntry(e) {
		let t = e.closest(`[${xe}="tab"]`), n = t?.parentElement ?? null, r = e.closest(nE);
		if (t === null || n === null || !n.classList.contains(W) || r === null || !t.contains(r)) return !1;
		let i = r.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "", a = this.menuTab, o = a === null || a.root !== n ? void 0 : this.ownItems(n).find((e) => vE(e) === a.key);
		if (i.length === 0 || r.matches(`${Tt}, ${wt}`) || o === void 0) return !0;
		if (!i.startsWith("tabs:")) return n.dispatchEvent(new CustomEvent(rE, {
			bubbles: !0,
			detail: { keys: [i, vE(o)] }
		})), !0;
		if (lE(n, o).get(i) !== !0) return !0;
		switch (i) {
			case MT: {
				let e = o.querySelector(`.${WT}`);
				e !== null && this.startRename(e);
				break;
			}
			case NT:
			case PT:
				this.setPinned(n, o, i === NT);
				break;
			default: o.dispatchEvent(new Event("remove", { bubbles: !0 }));
		}
		return !0;
	}
	setPinned(e, t, n) {
		if (t.hasAttribute("data-ui-tab-pinned") === n) return;
		let r = t.querySelector(`:scope > .${qT} > .${JT}`);
		t.toggleAttribute(Cn, n), r !== null && (r.toggleAttribute(Cn, n), r.dispatchEvent(new Event("change", { bubbles: !0 })));
		let i = this.ownItems(e), a = i.filter((e) => e !== t), o = HT(a.map(gE));
		if (i.indexOf(t) === o) return;
		let s = a[o];
		s === void 0 ? fE(a[a.length - 1]).after(fE(t)) : fE(s).before(fE(t)), hE([
			...a.slice(0, o),
			t,
			...a.slice(o)
		], o);
	}
	handleClick(e) {
		if (!(e.target instanceof Element) || this.handleMenuEntry(e.target) || this.handleClose(e, e.target)) return;
		let t = e.target.closest(`.${hS}`), n = t?.parentElement ?? null;
		if (t !== null && n !== null && n.classList.contains(W)) {
			e.preventDefault(), this.toggleOverflow(n, t);
			return;
		}
		let r = pE(e.target), i = r?.closest(`.${W}`) ?? null;
		if (r === null || i === null || w(r)) return;
		let a = r.closest(`.${UT}`);
		a !== null && a.closest(`.${W}`) === i && (e.preventDefault(), this.select(i, vE(a)), document.activeElement !== r && A(r));
	}
	handleClose(e, t) {
		let n = t.closest(`.${GT}`), r = n?.closest(`.${UT}`) ?? null, i = r?.closest(`.${W}`) ?? null;
		return n === null || r === null || i === null ? !1 : (e.preventDefault(), e.stopPropagation(), cE(i, r) && r.dispatchEvent(new Event("remove", { bubbles: !0 })), !0);
	}
	handleDoubleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = pE(e.target), n = t?.closest(`.${W}`) ?? null;
		t === null || n === null || !n.hasAttribute("data-ui-tabs-renamable") || (e.preventDefault(), this.startRename(t));
	}
	startRename(e) {
		let t = e.parentElement, n = e.querySelector(YT) ?? e, r = e.closest(`.${UT}`);
		t === null || r === null || fE(r).hasAttribute("data-ui-unrenamable") || Sc({
			container: t,
			title: n,
			className: KT,
			value: e.getAttribute("data-ui-tab-caption") ?? n.textContent?.trim() ?? "",
			commit: (t) => {
				e.setAttribute(Sn, t), e.dispatchEvent(new Event("change", { bubbles: !0 })), e.dispatchEvent(new Event("rename", { bubbles: !0 }));
			},
			refocus: () => A(e)
		});
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${WT}`), n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		if (e.key === "F2") {
			if (!n.hasAttribute("data-ui-tabs-renamable")) return;
			e.preventDefault(), this.startRename(t);
			return;
		}
		let r = this.ownItems(n).map((e) => e.querySelector(`.${WT}`)).filter((e) => e !== null), i = Ea({
			key: e.key,
			items: r,
			current: t,
			axis: "horizontal"
		});
		if (i === null) return;
		e.preventDefault();
		let a = i.closest(`.${UT}`);
		a !== null && this.select(n, vE(a)), i.focus();
	}
	handleDragStart(e) {
		let t = mE(e);
		if (t === null) return;
		if (fE(t).hasAttribute("data-ui-undraggable") || t.hasAttribute("data-ui-tab-pinned")) {
			e.preventDefault();
			return;
		}
		qm(e, t.closest(`.${W}`) ?? t, t, XT, vE(t));
		let n = fE(t);
		this.dragStart = n.parentNode === null ? null : {
			parent: n.parentNode,
			next: n.nextSibling
		};
	}
	handleDragOver(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${qT}`)?.closest(`.${UT}`) ?? null, n = t?.closest(`.${W}`) ?? null;
		if (t === null || n === null) return;
		let r = n.querySelector(`.${XT}`);
		if (r === null || (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"), r === t)) return;
		let i = t.querySelector(`.${qT}`)?.getBoundingClientRect();
		if (i === void 0) return;
		let a = fE(r), o = t.hasAttribute("data-ui-tab-pinned") ? sE(n, a) : null, s = o ?? fE(t), c = o === null && e.clientX < i.left + i.width / 2 ? s : s.nextElementSibling;
		c !== a && s.parentElement?.insertBefore(a, c);
	}
	handleDrop(e) {
		if (!(e instanceof DragEvent) || !(e.target instanceof Element)) return;
		let t = e.target.closest(`.${W}`);
		t !== null && t.querySelector(`.${XT}`) !== null && (e.preventDefault(), e.dataTransfer !== null && (e.dataTransfer.dropEffect = "move"));
	}
	handleDragEnd(e) {
		let t = mE(e);
		if (t === null) return;
		t.classList.remove(XT);
		let n = this.dragStart;
		if (this.dragStart = null, e instanceof DragEvent && e.dataTransfer?.dropEffect === "none" && n !== null) {
			n.parent.insertBefore(fE(t), n.next);
			return;
		}
		let r = fE(t);
		if (n !== null && r.parentNode === n.parent && r.nextSibling === n.next) return;
		let i = t.closest(`.${W}`);
		if (i === null) return;
		let a = this.ownItems(i);
		hE(a, a.indexOf(t));
	}
	select(e, t) {
		Ma(e, t, {
			attribute: bn,
			bindingAttribute: yn,
			apply: (e) => this.apply(e)
		});
	}
	ownItems(e) {
		return M(e, `.${UT}`, `.${W}`);
	}
};
function sE(e, t) {
	let n = null;
	for (let r of M(e, `.${UT}`, `.${W}`)) {
		let e = fE(r);
		e !== t && r.hasAttribute("data-ui-tab-pinned") && (n = e);
	}
	return n;
}
function cE(e, t) {
	return !e.hasAttribute("data-ui-tabs-unremovable") && !fE(t).hasAttribute("data-ui-unremovable") && !t.hasAttribute("data-ui-unremovable");
}
function lE(e, t) {
	return RT(LT(e.getAttribute(be)), {
		pinned: t.hasAttribute(Cn),
		renamable: !fE(t).hasAttribute(pe),
		removable: e.hasAttribute("data-ui-tabs-removes") && cE(e, t)
	});
}
function uE(e) {
	let t = e.getAttribute(h);
	return t === "tabs:separator" || t === "tabs:separator-remove" || e.querySelector(":scope > [data-ui-menu-item-kind=\"separator\"]") !== null;
}
function dE(e) {
	let t = e.querySelector(`[${g}]`);
	return t === null ? [] : Array.from(t.children).filter((e) => e instanceof HTMLElement && e.hasAttribute("data-ui-key"));
}
function fE(e) {
	let t = e.parentElement;
	return t !== null && !t.hasAttribute("data-ui-items-host") && t.closest("[data-ui-items-host]") === t.parentElement ? t : e;
}
function pE(e) {
	return e.closest(`.${GT}`) !== null || xc(e) ? null : e.closest(`.${qT}`)?.querySelector(`:scope > .${WT}`) ?? null;
}
function mE(e) {
	return e.target instanceof Element ? e.target.closest(`.${qT}`)?.closest(`.${UT}`) ?? null : null;
}
function hE(e, t) {
	for (let [n, r] of BT(e.map(gE), t)) e[n].setAttribute(xn, String(r)), e[n].dispatchEvent(new Event("change", { bubbles: !0 }));
}
function gE(e) {
	return {
		order: _E(e),
		pinned: e.hasAttribute(Cn)
	};
}
function _E(e) {
	let t = e.getAttribute(xn);
	if (t === null) return null;
	let n = Number(t);
	return Number.isFinite(n) ? n : null;
}
function vE(e) {
	return e.closest("[data-ui-key]")?.getAttribute("data-ui-key") ?? "";
}
//#endregion
//#region src/interactions/text-fold-engine.ts
var yE = "button.ui-text__fold-toggle", bE = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("click", (e) => this.handleClick(e), !0);
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(yE);
		t !== null && (e.preventDefault(), t.setAttribute("aria-expanded", t.getAttribute("aria-expanded") === "true" ? "false" : "true"));
	}
}, xE = "ui-temporal-input__segments", SE = "ui-temporal-input__segment", CE = "ui-temporal-input__segment-literal", wE = "ui-temporal-input__segment--empty", TE = "data-ui-temporal-segment", EE = "data-ui-temporal-step-direction", DE = "data-ui-temporal-segments-of", OE = "--", kE = class {
	options;
	root;
	edits = /* @__PURE__ */ new WeakMap();
	wheelTurn = 0;
	onWheel = (e) => this.handleWheel(e);
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.applyAll(this.root.querySelectorAll(`.${F}`)), this.options.propertyPatchEngine?.addValueChangeHandler((e) => {
			this.applyAll(Tr(e.components, `.${F}`));
		}), j(this.root, `.${F}`, { attributeFilter: [...Ih] }, (e) => this.applyAll(e)), this.root.addEventListener("keydown", (e) => this.handleKeydown(e), !0), this.root.addEventListener("click", (e) => this.handleClick(e), !0), this.root.addEventListener("focusin", (e) => this.handleFocusIn(e), !0), this.root.addEventListener("focusout", (e) => this.handleFocusOut(e), !0), this.root.addEventListener("mousedown", (e) => this.handleStepperPress(e), !0);
	}
	applyAll(e) {
		for (let t of e) Rh(t) === "time" && (ag(t), this.applySegments(t));
	}
	applySegments(e) {
		for (let t of e.querySelectorAll(`.${xE}`)) this.applyContainer(e, t);
	}
	applyContainer(e, t) {
		let n = zh(e), r = Hh(e), i = I(e, Xh(t));
		t.getAttribute(DE) !== n && (t.replaceChildren(...AE(n).map((e) => ME(e))), t.setAttribute(DE, n));
		for (let n of t.children) {
			if (!(n instanceof HTMLElement)) continue;
			let t = n.getAttribute(TE);
			if (t === null) {
				n.textContent = PE(n.dataset.token ?? "", n.dataset.formatted !== void 0, i, r);
				continue;
			}
			n.textContent = FE(t, Number(n.dataset.width ?? "2"), i, r), n.classList.toggle(wE, i === null), n.tabIndex = 0, IE(n, t, i, E(e));
		}
	}
	handleKeydown(e) {
		if (!(e instanceof KeyboardEvent) || e.defaultPrevented) return;
		let t = RE(e.target);
		if (t === null) return;
		let n = t.closest(`.${F}`), r = t.getAttribute(TE), i = LE(t);
		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault(), this.resetBuffer(n), this.applyStep(n, r, e.key === "ArrowUp" ? 1 : -1, i);
			return;
		}
		if (e.key === "ArrowLeft" || e.key === "ArrowRight" || e.key === "Home" || e.key === "End") {
			e.preventDefault(), this.resetBuffer(n), BE(n, t, e.key);
			return;
		}
		if (e.key === "Backspace" || e.key === "Delete") {
			e.preventDefault(), this.resetBuffer(n), ng(n, null, i), this.applySegments(n);
			return;
		}
		if (r === "meridiem") {
			let t = VE(e.key, Hh(n));
			t !== null && (e.preventDefault(), this.applyMeridiem(n, t, i));
			return;
		}
		e.key.length === 1 && e.key >= "0" && e.key <= "9" && (e.preventDefault(), this.applyDigit(n, t, r, e.key, i));
	}
	handleFocusIn(e) {
		let t = RE(e.target);
		t !== null && (this.wheelTurn = 0, t.addEventListener("wheel", this.onWheel, { passive: !1 }));
	}
	handleWheel(e) {
		let t = RE(e.currentTarget);
		if (t === null || t !== document.activeElement || e.deltaY === 0) return;
		e.preventDefault();
		let { steps: n, carried: r } = t_(this.wheelTurn, e_(e).y);
		if (this.wheelTurn = r, n === 0) return;
		let i = t.closest(`.${F}`);
		this.resetBuffer(i);
		for (let e = 0; e < Math.abs(n); e++) this.applyStep(i, t.getAttribute(TE), n < 0 ? 1 : -1, LE(t));
	}
	handleStepperPress(e) {
		e.target instanceof Element && e.target.closest(`[${EE}]`) !== null && e.preventDefault();
	}
	handleClick(e) {
		if (!(e.target instanceof Element)) return;
		let t = e.target.closest(`[${EE}]`);
		if (t === null) return;
		let n = t.closest(`.${F}`);
		if (n === null || E(n)) return;
		e.preventDefault();
		let r = zE(n) ?? n.querySelector(`.${SE}`);
		r !== null && (r.focus(), this.resetBuffer(n), this.applyStep(n, r.getAttribute(TE), t.getAttribute(EE) === "up" ? 1 : -1, LE(r)));
	}
	handleFocusOut(e) {
		let t = e.target instanceof Element ? e.target.closest(`.${SE}`) : null;
		if (t === null) return;
		t.removeEventListener("wheel", this.onWheel);
		let n = t.closest(`.${F}`);
		n !== null && this.resetBuffer(n);
	}
	applyStep(e, t, n, r) {
		if (t === "meridiem") {
			let t = I(e, r);
			this.applyMeridiem(e, t !== null && t.getHours() >= 12 ? "am" : "pm", r);
			return;
		}
		let i = this.baseValue(e, r), a = HE(t), o = Vh(Bh(e), a) * n, s = a === "hour" ? 24 : 60, c = ((UE(i, a) + o) % s + s) % s;
		this.write(e, WE(i, a, c), r);
	}
	applyDigit(e, t, n, r, i) {
		let a = this.editState(e), o = n === "hour" ? 23 : n === "hour12" ? 12 : 59, s = +(n === "hour12"), c = (a.unit === n ? a.buffer : "") + r;
		Number(c) > o && (c = r);
		let l = Number(c), u = c.length >= 2 || l * 10 > o;
		if (a.unit = n, a.buffer = u ? "" : c, l >= s) {
			let t = this.baseValue(e, i);
			this.write(e, n === "hour12" ? WE(t, "hour", GE(l, t.getHours() >= 12)) : WE(t, HE(n), l), i);
		}
		u && BE(e, t, "ArrowRight");
	}
	applyMeridiem(e, t, n) {
		let r = this.baseValue(e, n);
		this.write(e, WE(r, "hour", GE(r.getHours() % 12 == 0 ? 12 : r.getHours() % 12, t === "pm")), n);
	}
	baseValue(e, t) {
		return I(e, t) ?? sg(e);
	}
	write(e, t, n) {
		ng(e, cg(e, t), n), ig(e), this.applySegments(e);
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
function AE(e) {
	let t = [];
	for (let n = 0; n < e.length;) {
		let r = Wr(e, n);
		if (r === null) {
			t.push({
				kind: "literal",
				token: e[n],
				formatted: !1
			}), n++;
			continue;
		}
		t.push(jE(r)), n += r.length;
	}
	return t;
}
function jE(e) {
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
function ME(e) {
	if (e.kind === "literal") {
		let t = document.createElement("span");
		return t.className = CE, t.dataset.token = e.token, e.formatted && (t.dataset.formatted = ""), t;
	}
	let t = document.createElement("span");
	return t.className = SE, t.tabIndex = 0, t.setAttribute("role", "spinbutton"), t.setAttribute(TE, e.unit), t.dataset.width = String(e.width), NE(t, e.unit), t;
}
function NE(e, t) {
	if (t === "meridiem") {
		C.write(e, "aria-label", "ui.picker.meridiem");
		return;
	}
	let n = HE(t);
	C.write(e, "aria-label", n === "hour" ? "ui.picker.hours" : n === "minute" ? "ui.picker.minutes" : "ui.picker.seconds"), e.setAttribute("aria-valuemin", t === "hour12" ? "1" : "0"), e.setAttribute("aria-valuemax", t === "hour12" ? "12" : t === "hour" ? "23" : "59");
}
function PE(e, t, n, r) {
	return t && n !== null ? Hr(n, e, r) : e;
}
function FE(e, t, n, r) {
	if (n === null) return OE;
	if (e === "meridiem") return n.getHours() < 12 ? r.amDesignator : r.pmDesignator;
	let i = e === "hour12" ? n.getHours() % 12 == 0 ? 12 : n.getHours() % 12 : UE(n, HE(e));
	return String(i).padStart(t, "0");
}
function IE(e, t, n, r) {
	if (r !== e.hasAttribute("aria-readonly") && (r ? e.setAttribute("aria-readonly", "true") : e.removeAttribute("aria-readonly")), t === "meridiem" || n === null) {
		e.removeAttribute("aria-valuenow");
		return;
	}
	let i = n.getHours();
	e.setAttribute("aria-valuenow", String(t === "hour12" ? i % 12 == 0 ? 12 : i % 12 : UE(n, HE(t))));
}
function LE(e) {
	return Xh(e.closest(`.${xE}`));
}
function RE(e) {
	let t = e instanceof Element ? e.closest(`.${SE}`) : null;
	if (t === null) return null;
	let n = t.closest(`.${F}`);
	return n === null || E(n) ? null : t;
}
function zE(e) {
	return document.activeElement instanceof HTMLElement && document.activeElement.closest(".ui-temporal-input") === e ? document.activeElement.closest(`.${SE}`) : null;
}
function BE(e, t, n) {
	Ea({
		key: n,
		items: [...e.querySelectorAll(`.${SE}`)],
		current: t,
		axis: "horizontal",
		loop: !1
	})?.focus();
}
function VE(e, t) {
	let n = e.toLowerCase();
	return n.length === 1 ? n === "a" || n === t.amDesignator.charAt(0).toLowerCase() ? "am" : n === "p" || n === t.pmDesignator.charAt(0).toLowerCase() ? "pm" : null : null;
}
function HE(e) {
	return e === "hour12" || e === "meridiem" ? "hour" : e;
}
function UE(e, t) {
	return t === "hour" ? e.getHours() : t === "minute" ? e.getMinutes() : e.getSeconds();
}
function WE(e, t, n) {
	let r = new Date(e);
	return t === "hour" ? r.setHours(n) : t === "minute" ? r.setMinutes(n) : r.setSeconds(n), r;
}
function GE(e, t) {
	let n = e % 12;
	return t ? n + 12 : n;
}
//#endregion
//#region src/interactions/timestamp-engine.ts
var KE = "ui-timestamp", qE = "ui-timestamp__text", JE = "data-ui-timestamp-format", YE = "datetime", XE = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.apply(this.root.querySelectorAll(`.${KE}`), C.temporal === null), C.onTable(() => this.apply(this.root.querySelectorAll(`.${KE}`))), e.propertyPatchEngine?.addValueChangeHandler((e) => this.apply(Tr(e.components, `.${KE}`))), j(this.root, `.${KE}`, {
			childList: !0,
			attributeFilter: [YE],
			relevant: (e) => e.type === "attributes" || !(e.target instanceof Element && e.target.closest(`.${KE}`) !== null)
		}, (e) => this.apply(e));
	}
	apply(e, t = !1) {
		let n = {
			temporal: C.temporal,
			language: C.language || document.documentElement.lang
		}, r = Date.now(), i = !1;
		for (let a of e) {
			let e = mi(a.getAttribute(JE)), o = pi(a.getAttribute(YE)), s = a.querySelector(`.${qE}`);
			if (s === null || t && e !== "relative") continue;
			let c = o === null ? "" : gi(o, e, n, r);
			s.textContent !== c && (s.textContent = c), i ||= e === "relative" && o !== null;
		}
		i && Ui(this.refreshRelative);
	}
	refreshRelative = () => {
		let e = [...this.root.querySelectorAll(`.${KE}[${JE}="relative"]`)];
		return e.length !== 0 && (this.apply(e), !0);
	};
}, ZE = "data-ui-scroll-anchor", QE = "End", $E = 4, eD = [
	"wheel",
	"touchstart",
	"pointerdown",
	"keydown"
], tD = /* @__PURE__ */ new WeakSet();
function nD(e) {
	tD.add(e);
}
var rD = class {
	root;
	pinned = /* @__PURE__ */ new WeakMap();
	resizes = typeof ResizeObserver == "function" ? new ResizeObserver((e) => this.handleResize(e)) : null;
	watched = /* @__PURE__ */ new WeakMap();
	heights = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("scroll", (e) => this.handleScroll(e), !0);
		for (let e of eD) this.root.addEventListener(e, (e) => iD(e), {
			capture: !0,
			passive: !0
		});
		j(this.root, `[${ZE}="${QE}"]`, {
			childList: !0,
			characterData: !0,
			attributeFilter: [ut]
		}, (e) => this.followEach(e)), this.followContent();
	}
	handleScroll(e) {
		let t = e.target;
		!(t instanceof Element) || !oD(t) || this.pinned.set(t, tD.has(t) || cD(t) && !sD(t));
	}
	followContent() {
		this.followEach(this.root.querySelectorAll(`[${ZE}="${QE}"]`));
	}
	followEach(e) {
		for (let t of e) {
			if (this.watchRows(t), tD.has(t)) {
				this.pinned.set(t, !0), aD(t);
				continue;
			}
			if (this.pinned.get(t) !== !1) {
				if (sD(t)) {
					this.pinned.set(t, !1);
					continue;
				}
				this.pinned.set(t, !0), aD(t);
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
			if (!e.isConnected || r === null || !oD(r)) {
				this.forget(e);
				continue;
			}
			let i = e.getBoundingClientRect(), a = this.heights.get(e);
			if (this.heights.set(e, i.height), a === void 0 || a === i.height) continue;
			let o = i.top + a <= r.getBoundingClientRect().top ? i.height - a : 0;
			t.set(r, (t.get(r) ?? 0) + o);
		}
		for (let [e, n] of t) tD.has(e) || this.pinned.get(e) !== !1 && !sD(e) ? aD(e) : n !== 0 && e.getAttribute("data-ui-host-mode") !== "virtualized" && getComputedStyle(e).overflowAnchor === "none" && (e.scrollTop += n);
	}
	forget(e) {
		this.resizes?.unobserve(e), this.heights.delete(e);
	}
};
function iD(e) {
	let t = e.target instanceof Element ? e.target.closest(`[${ZE}="${QE}"]`) : null;
	t !== null && tD.delete(t);
}
function aD(e) {
	cD(e) || (e.scrollTop = e.scrollHeight);
}
function oD(e) {
	return e.getAttribute(ZE) === QE;
}
function sD(e) {
	return e.getAttribute(ot)?.toLowerCase() === "true";
}
function cD(e) {
	return e.scrollHeight - e.scrollTop - e.clientHeight <= $E;
}
//#endregion
//#region src/interactions/surface-press-engine.ts
var lD = `:is(.ui-surface, .ui-card)[${m}]`, uD = "ui-surface--clickable", dD = class {
	pressable = /* @__PURE__ */ new WeakSet();
	spaceOn = null;
	constructor(e = {}) {
		let t = e.root ?? document;
		t.addEventListener("keydown", (e) => this.handleKeyDown(e)), t.addEventListener("keyup", (e) => this.handleKeyUp(e)), j(t, lD, {
			childList: !0,
			attributeFilter: ["class"]
		}, (e) => this.syncEach(e)), this.syncEach(t.querySelectorAll(lD));
	}
	syncEach(e) {
		for (let t of e) {
			this.sync(t);
			let e = t.parentElement?.closest(lD) ?? null;
			e !== null && this.sync(e);
		}
	}
	sync(e) {
		if (!e.classList.contains(uD)) {
			this.pressable.delete(e) && (e.removeAttribute("tabindex"), e.removeAttribute("role"));
			return;
		}
		this.pressable.add(e), mD(e, "tabindex", e.matches(".ui-disabled, .ui-loading") ? null : "0"), mD(e, "role", pD(e) ? "group" : "button");
	}
	handleKeyDown(e) {
		let t = fD(e);
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
function fD(e) {
	if (!(e instanceof KeyboardEvent) || e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey) return null;
	let t = e.target;
	return t instanceof HTMLElement && t.classList.contains(uD) && t.getAttribute("tabindex") === "0" ? t : null;
}
function pD(e) {
	for (let t of e.querySelectorAll(fd)) {
		let n = t.closest(Pn);
		if (n === null || !e.contains(n)) return !0;
	}
	return !1;
}
function mD(e, t, n) {
	n === null ? e.removeAttribute(t) : e.getAttribute(t) !== n && e.setAttribute(t, n);
}
//#endregion
//#region src/items/items-viewport.ts
function hD(e) {
	return e.hasAttribute("data-ui-host-viewport") ? e.parentElement ?? e : e;
}
function gD(e) {
	return e instanceof Element ? e.hasAttribute("data-ui-items-host") ? e : e.querySelector(`:scope > [${g}][${Ze}]`) : null;
}
function _D(e) {
	let t = hD(e);
	return t === e ? {
		top: e.scrollTop,
		height: e.clientHeight,
		contentHeight: e.scrollHeight
	} : {
		top: t.scrollTop - yD(e, t),
		height: t.clientHeight,
		contentHeight: e.scrollHeight
	};
}
function vD(e, t) {
	let n = hD(e);
	n.scrollTop = n === e ? t : t + yD(e, n);
}
function yD(e, t) {
	return e.getBoundingClientRect().top - t.getBoundingClientRect().top - t.clientTop + t.scrollTop;
}
//#endregion
//#region src/interactions/scroll-group-mapping.ts
function bD(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.top(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = SD(e, a, n), s = SD(e, a + 1, n);
	return CD(t, o.top, s.top, o.line, s.line);
}
function xD(e, t, n) {
	let r = 0, i = e.count - 1, a = -1;
	for (; r <= i;) {
		let n = r + i >> 1;
		e.line(n) <= t ? (a = n, r = n + 1) : i = n - 1;
	}
	let o = SD(e, a, n), s = SD(e, a + 1, n);
	return CD(t, o.line, s.line, o.top, s.top);
}
function SD(e, t, n) {
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
function CD(e, t, n, r, i) {
	return n <= t ? r : r + Math.min(1, Math.max(0, (e - t) / (n - t))) * (i - r);
}
//#endregion
//#region src/interactions/scroll-group-engine.ts
var wD = 250, TD = class {
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
		let r = this.memberScrolledBy(t), i = r?.getAttribute(Qe);
		if (r != null && i != null && i.length !== 0) for (let e of this.membersOf(i)) e !== r && e.isConnected && this.follow(t, this.viewportOf(e));
	}
	membersOf(e) {
		let t = performance.now(), n = this.members.get(e);
		if (n !== void 0 && t - n.at < wD && n.found.every((e) => e.isConnected)) return n.found;
		let r = [...this.root.querySelectorAll(`[${Qe}="${CSS.escape(e)}"]`)];
		return this.members.set(e, {
			found: r,
			at: t
		}), r;
	}
	memberScrolledBy(e) {
		for (let t = e.closest(`[${Qe}]`); t !== null; t = t.parentElement?.closest("[data-ui-scroll-group]") ?? null) if (this.viewportOf(t) === e) return t;
		return null;
	}
	viewportOf(e) {
		let t = this.viewports.get(e);
		if (t !== void 0 && t.isConnected && e.contains(t)) return t;
		let n = ED(e, "data-ui-scroll-viewport") ?? DD(e) ?? e;
		return this.viewports.set(e, n), n;
	}
	follow(e, t) {
		let n = e.scrollHeight - e.clientHeight, r = t.scrollHeight - t.clientHeight;
		if (r <= 0 && t.scrollWidth <= t.clientWidth) return;
		let i = n > 0 ? kD(e) : null, a = i === null ? null : kD(t), o;
		if (n <= 0 || e.scrollTop <= 0) o = 0;
		else if (e.scrollTop >= n - 1) o = r;
		else if (i !== null && a !== null) {
			let t = Math.max(i.endLine, a.endLine);
			o = xD(a, bD(i, e.scrollTop, t), t);
		} else o = e.scrollTop / n * r;
		let s = i === null && a === null ? OD(e.scrollLeft, e.scrollWidth - e.clientWidth) * Math.max(0, t.scrollWidth - t.clientWidth) : t.scrollLeft;
		o = Math.round(Math.min(Math.max(0, o), Math.max(0, r))), !(Math.abs(t.scrollTop - o) < 1 && Math.abs(t.scrollLeft - s) < 1) && (t.scrollTo({
			top: o,
			left: s,
			behavior: "instant"
		}), this.driven.set(t, t.scrollTop));
	}
};
function ED(e, t) {
	for (let n of e.querySelectorAll(`[${t}]`)) if (n.closest("[data-ui-id]") === e) return n;
	return null;
}
function DD(e) {
	let t = e.hasAttribute("data-ui-items-host") ? e : ED(e, g);
	return t === null ? null : hD(t);
}
function OD(e, t) {
	return t > 0 ? e / t : 0;
}
function kD(e) {
	let t = e.getBoundingClientRect().top + e.clientTop - e.scrollTop, n = (e) => e.getBoundingClientRect().top - t, r = e.querySelector(`[${$e}]`);
	if (r !== null && r.children.length > 0) return {
		count: r.children.length,
		line: (e) => e + 1,
		top: (e) => n(r.children[e]),
		endLine: r.children.length + 1,
		scrollHeight: e.scrollHeight
	};
	let i = e.querySelectorAll(`[${et}]`);
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
var AD = `.${Ln}, .ui-action, .${_}`, jD = Et, MD = "ui-pressing", ND = "--ui-press-x", PD = "--ui-press-y", FD = class {
	root;
	constructor(e = {}) {
		this.root = e.root ?? document, this.root.addEventListener("pointerdown", (e) => this.handlePointerDown(e), !0);
	}
	handlePointerDown(e) {
		if (!(e instanceof PointerEvent) || e.button !== 0 || !(e.target instanceof Element)) return;
		let t = e.target.closest(AD);
		if (t === null || w(t) || t.matches(jD) || ks()) return;
		let n = e.target.closest(Pn);
		if (n !== null && n !== t && t.contains(n)) return;
		let r = t.getBoundingClientRect();
		t.style.setProperty(ND, `${e.clientX - r.left}px`), t.style.setProperty(PD, `${e.clientY - r.top}px`), t.classList.remove(MD), t.offsetWidth, t.classList.add(MD), window.setTimeout(() => t.classList.remove(MD), Os.ripple);
	}
}, ID = /* @__PURE__ */ new Set([
	"ArrowUp",
	"ArrowDown",
	"ArrowLeft",
	"ArrowRight",
	"Home",
	"End",
	"PageUp",
	"PageDown"
]), LD = [
	"click",
	"dblclick",
	"auxclick",
	"dragstart"
], RD = `.${Dn}, .${On}`, zD = RegExp(`(^|\\s)(${Dn}|${On})(\\s|$)`), BD = RegExp(`(^|\\s)${kn}(\\s|$)`), VD = "[type='range']", HD = /* @__PURE__ */ new WeakSet(), UD = /* @__PURE__ */ new WeakSet();
function WD(e = document) {
	let t = e === document ? window : e;
	for (let e of LD) t.addEventListener(e, QD, !0);
	t.addEventListener("keydown", eO, !0), t.addEventListener("change", tO, !0), t.addEventListener("pointerdown", nO, !0), t.addEventListener("mousedown", nO, !0), YD(e.querySelectorAll(RD)), qD(e.querySelectorAll(`[${En}]`)), KD(e.querySelectorAll(VD)), new MutationObserver((e) => {
		for (let t of e) GD(t);
	}).observe(e, {
		subtree: !0,
		childList: !0,
		attributes: !0,
		attributeFilter: ["class", En],
		attributeOldValue: !0
	});
}
function GD(e) {
	if (e.type === "attributes") {
		let t = e.target;
		if (e.attributeName === "data-ui-href") {
			JD(t, e.oldValue !== null);
			return;
		}
		let n = zD.test(e.oldValue ?? ""), r = t.matches(RD);
		n !== r && (XD(t, r), JD(t)), BD.test(e.oldValue ?? "") !== t.matches(".ui-readonly") && KD(t.querySelectorAll(VD));
		return;
	}
	let t = (e.target instanceof Element ? e.target : null)?.matches(RD) === !0;
	for (let n of e.addedNodes) n instanceof Element && (t && ZD(n), n.matches(RD) && XD(n, !0), YD(n.querySelectorAll(RD)), JD(n), qD(n.querySelectorAll(`[${En}]`)), KD([n, ...n.querySelectorAll(VD)]));
}
function KD(e) {
	for (let t of e) {
		if (!(t instanceof HTMLInputElement) || t.type !== "range") continue;
		let e = E(t);
		e !== HD.has(t) && (e ? (HD.add(t), t.addEventListener("touchstart", nO, { passive: !1 })) : (HD.delete(t), t.removeEventListener("touchstart", nO)));
	}
}
function qD(e) {
	for (let t of e) JD(t);
}
function JD(e, t = !1) {
	let n = e.getAttribute(En);
	n === null && !t || (e.matches(RD) ? (e.removeAttribute("href"), e.hasAttribute("tabindex") || e.setAttribute("tabindex", "0")) : n === null || !au(n) ? e.removeAttribute("href") : e.getAttribute("href") !== n && (e.setAttribute("href", n), e.getAttribute("tabindex") === "0" && e.removeAttribute("tabindex")));
}
function YD(e) {
	for (let t of e) XD(t, !0);
}
function XD(e, t) {
	for (let n of e.children) t ? ZD(n) : UD.has(n) && (UD.delete(n), n.removeAttribute("inert"));
}
function ZD(e) {
	e.hasAttribute("inert") || (UD.add(e), e.setAttribute("inert", ""));
}
function QD(e) {
	e.target instanceof Element && (w(e.target) ? (e.type === "click" && Ac(e), rO(e)) : e.type === "click" && $D(e.target) && e.preventDefault());
}
function $D(e) {
	return e instanceof HTMLInputElement && (e.type === "checkbox" || e.type === "radio") && E(e);
}
function eO(e) {
	if (!(!(e instanceof KeyboardEvent) || !(e.target instanceof Element))) {
		if ((e.key === "Enter" || e.key === " ") && w(e.target)) {
			rO(e);
			return;
		}
		!ID.has(e.key) || !(e.target instanceof HTMLInputElement) || (e.target.type === "range" || e.target.type === "radio") && E(e.target) && e.preventDefault();
	}
}
function tO(e) {
	e.target instanceof HTMLInputElement && e.target.type === "range" && E(e.target) && e.stopImmediatePropagation();
}
function nO(e) {
	!(e.target instanceof HTMLInputElement) || e.target.type !== "range" || !E(e.target) || (e.preventDefault(), e.target.focus({ preventScroll: !0 }));
}
function rO(e) {
	e.preventDefault(), e.stopImmediatePropagation();
}
//#endregion
//#region src/interactions/popup-service.ts
var iO = /* @__PURE__ */ new WeakMap(), aO = new Fc({
	show: () => void 0,
	hide: ({ popup: e }, t) => {
		let n = iO.get(e);
		iO.delete(e), t !== void 0 && n?.(t);
	},
	single: !1,
	isInside: ({ popup: e, anchor: t }, n) => n.includes(e) || t !== void 0 && n.includes(t),
	onPress: !0
}), oO = {
	open(e, t, n) {
		let r = n.owner ?? (e instanceof HTMLElement ? e : t), i = () => aO.popupOf(r) === t;
		return iO.set(t, n.onDismiss), aO.open({
			owner: r,
			popup: t,
			anchor: e,
			placement: n
		}) || (iO.delete(t), queueMicrotask(() => n.onDismiss("owner"))), {
			reposition: () => {
				i() && aO.reposition(r);
			},
			close: () => {
				i() && aO.close(r);
			}
		};
	},
	focusReturn: (e) => Vo(e)
};
//#endregion
//#region src/items/item-rows.ts
function sO(e, t, n) {
	return {
		itemOf: (e) => t.getItemValue(e),
		itemsOf: (e) => n.itemsOf(e),
		readPath: vm,
		renderVariant: (n, r, i) => {
			let a = e.getVariantTemplate(r, i), o = t.getItemScope(n);
			return a === void 0 || o === void 0 ? null : t.renderFromTemplate(a, o.item, t.getAncestorStack(n));
		},
		isKeyTarget: (e) => io(e) !== null
	};
}
//#endregion
//#region src/items/items-template-renderer.ts
var cO = class {
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
		let c = this.metadata.getItemsTemplateMetadata(e), l = c?.itemWrapperElementName ? dO(o, c.itemWrapperElementName, c.itemWrapperClassName ?? null, c.itemWrapperRole ?? null) : o;
		l !== o && this.moveItemScope(o, l), fO(l, n, t);
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
		let i = uO(r.item, t, n);
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
			lO(n, e) && this.applyBoundAttribute(i, String(b(n.bindingId)), e, t);
		}
	}
	findTranslatableRowBindings() {
		let e = [];
		for (let t of this.metadata.metadata.bindings) {
			let n = this.metadata.getPropertyDefinition(t.propertyId);
			if (n === void 0 || typeof t.itemTemplate != "string" || !this.metadata.isTranslatable(t)) continue;
			let r = b(t.bindingId);
			e.push([t, `[${Ae}${Un(n.propertyName)}="${Hn(r)}"]`]);
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
		let r = gO(t, n.templateKeyPropertyName);
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
		r !== void 0 && mm(e, r.itemTemplateParameters, n) || this.applyBoundAttribute(e, t, n);
	}
	applyBoundAttribute(e, t, n, r) {
		let i = Number(t);
		if (!Number.isInteger(i) || i <= 0) return;
		let a = this.metadata.getBindingById(i), o = a === void 0 ? void 0 : this.metadata.getPropertyDefinition(a.propertyId);
		if (a === void 0 || o === void 0) return;
		let c = a.itemTemplate === null || a.itemTemplate === void 0 ? this.state.has(a, []) ? {
			ok: !0,
			value: this.state.get(a, [])
		} : { ok: !1 } : pm(n, a.itemTemplate, a.itemTemplateParameters);
		if (!c.ok) {
			a.optional !== !0 && !this.unresolved.has(i) && (this.unresolved.add(i), s("item binding value could not be resolved; the item has no such property.", {
				binding: a,
				stack: n
			}));
			return;
		}
		let l = "scope" in c ? c.scope : void 0, u = c.value ?? a.fallbackValue;
		if (r !== void 0 && !r(u)) return;
		let d = ra(u, () => this.metadata.isTranslatable(a) && !hm(l)), f = b(a.componentId), p = e.closest(`[${m}="${f}"]`);
		if (p === null) {
			s("item binding component root was not found in the cloned template.", { binding: a });
			return;
		}
		for (let t of o.operations) {
			let n = Kn(p, t, () => [e])[0] ?? null;
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
function lO(e, t) {
	for (let n of e.itemTemplateParameters ?? []) {
		let e = b(n.componentId);
		if (e > 0 && !t.some((t) => t.scopeComponentId === e)) return !1;
	}
	return !0;
}
function uO(e, t, n) {
	if (t.length === 0) return n;
	let r = e;
	for (let n = 0; n < t.length - 1; n++) {
		let i = t[n], a = i.kind === "property" ? ym(r, i.name) : Cm(r, i.key);
		if (!a.ok) return e;
		r = a.value;
	}
	if (typeof r != "object" || !r) return e;
	let i = t[t.length - 1];
	if (i.kind === "element") return wm(r, i.key, n), e;
	let a = r;
	return a[bm(a, i.name)] = n, e;
}
function dO(e, t, n, r) {
	let i = document.createElement(t);
	return n !== null && (i.className = n), r !== null && r.length > 0 && i.setAttribute("role", r), i.appendChild(e), i;
}
function fO(e, t, n) {
	e.setAttribute(h, t), hO(e, n), mO(e, n);
}
var pO = [
	["CanSelect", ue],
	["CanDrag", de],
	["CanRemove", fe],
	["CanRename", pe],
	["CanShowContextMenu", me]
];
function mO(e, t) {
	for (let [n, r] of pO) {
		let i = ym(t, n);
		e.toggleAttribute(r, i.ok && i.value === !1);
	}
}
function hO(e, t) {
	let n = ym(t, "Group");
	n.ok && typeof n.value == "string" ? e.setAttribute(Ke, n.value) : e.removeAttribute(Ke);
}
function gO(e, t) {
	if (t == null || t.trim().length === 0) return null;
	let n = ym(e, t);
	return !n.ok || n.value === null || n.value === void 0 ? null : typeof n.value == "string" ? n.value : String(n.value);
}
//#endregion
//#region src/items/items-rule-watcher.ts
var _O = "Group", vO = class {
	options;
	dragged = null;
	deferred = /* @__PURE__ */ new Map();
	drawnByHost = /* @__PURE__ */ new Map();
	constructor(e) {
		this.options = e, e.propertyPatchEngine.addValueChangeHandler((e) => this.handleItemValueChange(e));
		for (let t of e.metadata.metadata.itemsFilterSort) {
			let n = b(t.componentId), r = [...t.filters, ...t.sorts], i = () => this.syncComponentHosts(n);
			for (let t of r) t.source !== null && t.source !== void 0 && e.reactiveSources.watch(t.source, i);
		}
		e.root.addEventListener("dragstart", (e) => this.handleDragStart(e), !0), e.root.addEventListener("dragend", () => this.land(), !0), j(e.root, `[${Je}="${Ye}"]`, { attributeFilter: [Le] }, (e) => {
			for (let t of e) {
				let e = Dr(t);
				e !== null && this.syncComponentHosts(e);
			}
		}), j(e.root, `[${Xe}="windowed"]`, { attributeFilter: [st] }, (e) => {
			for (let t of e) {
				let e = Dr(t);
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
			for (let [t, n] of e) t.isConnected && Qw(t, n, this.options);
		});
	}
	handleItemValueChange(e) {
		if (e.dynamicParameters.length === 0) return;
		let t = this.options.metadata.getBindingByComponentAndPropertyId(b(e.reference.componentId), e.reference.propertyId), n = t === void 0 ? null : Sm(t);
		if (n === null) return;
		let r = this.resolveItemRoots(e, n);
		for (let t of r) this.applyItemValue(t, n, e.value);
		r.length === 0 && this.applyVirtualizedItemValue(e, n);
	}
	applyVirtualizedItemValue(e, t) {
		let n = e.dynamicParameters[e.dynamicParameters.length - 1];
		if (typeof n == "string") for (let r of this.options.root.querySelectorAll(`[${g}]`)) {
			if (Rm(r) !== "virtualized") continue;
			let i = r.closest(v);
			i === null || !this.drawsPatchedComponent(i, b(e.reference.componentId), t) || !yO(i, e.dynamicParameters) || this.options.virtualization.updateValue(r, n, t.steps, e.value) && this.redrawsVirtualized(S(i), t) && this.sync(r, S(i));
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
		Qw(e, t, this.options);
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
		return typeof t == "string" ? [...this.options.root.querySelectorAll(`[${h}="${Hn(t)}"]`)].filter((t) => this.isItemRoot(t) && xr(t, e)) : [];
	}
	applyItemValue(e, t, n) {
		let r = e.closest(`[${g}]`), i = r === null ? null : Dr(r);
		if (r !== null && i !== null && Rm(r) === "virtualized") {
			let a = e.getAttribute(h);
			a !== null && this.options.virtualization.updateValue(r, a, t.steps, n) && this.redrawsVirtualized(i, t) && this.sync(r, i);
			return;
		}
		this.options.renderer.updateItemValue(e, t.steps, n);
		let a = bO(_O, t);
		a && hO(e, this.options.renderer.getItemValue(e)), pO.some(([e]) => bO(e, t)) && mO(e, this.options.renderer.getItemValue(e)), r !== null && i !== null && (!a && !this.feedsRule(i, t) || this.sync(r, i));
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
		if (this.options.templates.getGroupTemplate(e) !== void 0 && bO(_O, t)) return !0;
		let n = this.options.metadata.getItemsFilterSortMetadata(e);
		return n === void 0 ? !1 : n.filters.some((e) => bO(e.itemProperty, t)) || n.sorts.some((e) => bO(e.itemProperty, t));
	}
	syncComponentHosts(e) {
		for (let t of this.options.root.querySelectorAll(`[${g}]`)) {
			let n = Dr(t);
			n === e && this.sync(t, n);
		}
	}
};
function yO(e, t) {
	let n = br(e, yr(e));
	return t.length === n.length + 1 && n.every((e, n) => String(e ?? "") === String(t[n] ?? ""));
}
function bO(e, t) {
	let n = t.ruleSegments.join(".");
	return n.length === 0 || e === n || e.startsWith(`${n}.`);
}
//#endregion
//#region src/items/items-window-engine.ts
var xO = 50, SO = 1, CO = .5, wO = 60, TO = class {
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
			if (this.layout(t), AO(t) === 0) {
				this.requestAsync(t, "Start", 0, null, !1);
				continue;
			}
			e ? this.revealWindow(t) : this.realign(t);
		}
	}
	revealWindow(e) {
		let t = NO(e, rt);
		if (t !== null && oD(e) && EO(e.getAttribute("data-ui-window-more-after"))) {
			vD(e, Math.max(0, this.windowBottom(e, t) - _D(e).height));
			return;
		}
		t !== null && t !== 0 && vD(e, EO(e.getAttribute("data-ui-window-more-after")) ? t * this.getState(e).itemSize : e.scrollHeight);
	}
	windowBottom(e, t) {
		let n = kO(e), r = this.getState(e).itemSize, i = n.length === 0 ? 0 : OO(n[n.length - 1]).bottom - OO(n[0]).top;
		return t * r + (i > 0 ? i : n.length * r);
	}
	sync() {
		for (let e of this.hosts()) this.layout(e), this.getState(e).pending || this.realign(e);
	}
	realign(e) {
		let t = NO(e, rt), n = kO(e);
		if (t === null || n.length === 0 || e.hasAttribute("data-ui-window-paged")) return;
		let r = this.getState(e), i = _D(e), a = Math.floor(i.top / r.itemSize);
		Math.ceil((i.top + i.height) / r.itemSize) >= t && a <= t + n.length || this.revealWindow(e);
	}
	reconsider() {
		for (let e of this.hosts()) this.considerRequest(e);
	}
	async requestOffsetAsync(e, t) {
		Rm(e) === "windowed" && await this.requestAsync(e, "Offset", Math.max(0, Math.floor(t)), null, !1);
	}
	hosts() {
		return [...this.root.querySelectorAll(`[${g}][${Xe}="windowed"]`)];
	}
	handleScroll(e) {
		let t = gD(e.target);
		if (t === null || Rm(t) !== "windowed" || t.hasAttribute("data-ui-window-paged")) return;
		let n = this.getState(t);
		n.scheduled === 0 && (this.considerRequest(t), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.considerRequest(t);
		}, wO));
	}
	considerRequest(e) {
		let t = this.getState(e);
		if (t.pending) {
			t.restless = !0;
			return;
		}
		if (e.hasAttribute("data-ui-window-paged") && AO(e) > 0) return;
		let n = kO(e);
		if (n.length === 0) {
			this.requestAsync(e, "Start", 0, null, !1);
			return;
		}
		let r = NO(e, rt), i = EO(e.getAttribute(at)), a = EO(e.getAttribute(ot));
		if (r !== null) {
			let o = this.windowSize(e), s = _D(e), c = Math.max(1, Math.round(s.height * SO / t.itemSize), Math.floor(o * CO)), l = Math.floor(s.top / t.itemSize), u = Math.ceil((s.top + s.height) / t.itemSize);
			if (u < r || l > r + n.length) {
				this.requestAsync(e, "Offset", this.landingOffset(e, l, o), null, !1);
				return;
			}
			if (l - c <= r && i) {
				this.requestAsync(e, "Before", 0, jO(n[0]), !0);
				return;
			}
			if (u + c >= r + n.length && a) {
				this.requestAsync(e, "After", 0, jO(n[n.length - 1]), !0);
				return;
			}
			return;
		}
		let o = _D(e), s = Math.max(1, o.height * SO), c = o.contentHeight - o.top - o.height;
		if (o.top <= s && i) {
			this.requestAsync(e, "Before", 0, jO(n[0]), !0);
			return;
		}
		c <= s && a && this.requestAsync(e, "After", 0, jO(n[n.length - 1]), !0);
	}
	landingOffset(e, t, n) {
		let r = Math.max(0, t - Math.floor(n / 4)), i = NO(e, it);
		return i === null ? r : Math.min(r, Math.max(0, i - n));
	}
	async requestAsync(e, t, n, r, i) {
		let a = Dr(e);
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
				dynamicParameters: MO(e),
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
		let t = this.getState(e), n = kO(e);
		if (e.hasAttribute("data-ui-window-paged")) {
			Ww(e, "top", 0), Ww(e, Uw, 0);
			return;
		}
		if (n.length > 0) {
			let e = OO(n[n.length - 1]).bottom - OO(n[0]).top;
			e > 0 && (t.itemSize = Math.max(1, Math.round(e / DO(n))));
		}
		let r = NO(e, it), i = NO(e, rt), a = r === null || i === null ? 0 : i * t.itemSize, o = r === null || i === null ? 0 : Math.max(0, r - i - n.length) * t.itemSize;
		Ww(e, "top", a), Ww(e, Uw, o);
	}
	windowSize(e) {
		let t = NO(e, nt);
		return t !== null && t > 0 ? t : xO;
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
function EO(e) {
	return e !== null && e.toLowerCase() === "true";
}
function DO(e) {
	let t = OO(e[0]).top, n = 1;
	for (; n < e.length && OO(e[n]).top === t;) n++;
	return Math.ceil(e.length / n) * n;
}
function OO(e) {
	let t = e.getBoundingClientRect();
	return t.height > 0 || e.firstElementChild === null ? t : e.firstElementChild.getBoundingClientRect();
}
function kO(e) {
	return [...e.children].filter((e) => e.hasAttribute(h));
}
function AO(e) {
	return kO(e).length;
}
function jO(e) {
	return e.getAttribute(h);
}
function MO(e) {
	let t = e.closest(v);
	return t === null ? [] : br(t, yr(t));
}
function NO(e, t) {
	let n = e.getAttribute(t);
	if (n === null || n.length === 0) return null;
	let r = Number(n);
	return Number.isFinite(r) ? r : null;
}
//#endregion
//#region src/items/items-composite-renderer.ts
var PO = [
	m,
	ce,
	le
];
function FO(e, t, n, r, i, a, o) {
	let c = document.createElement(e.itemElementName);
	c.className = e.itemClassName, IO(c, e.itemRole);
	let l = RO(c, e, t, a);
	l !== 0 && o.populateElement(c, n, l, i);
	for (let l of e.slots) {
		let e = LO(l, t, n, a);
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
		d.className = l.wrapperClassName, IO(d, l.wrapperRole);
		for (let [e, t] of Object.entries(l.wrapperAttributes ?? {})) d.setAttribute(e, t);
		d.appendChild(u), fO(d, r, n), c.appendChild(d);
	}
	return fO(c, r, n), o.registerItemScope(c, l, n), c;
}
function IO(e, t) {
	t != null && t.length > 0 && e.setAttribute("role", t);
}
function LO(e, t, n, r) {
	let i = gO(n, e.variantKeyPropertyName);
	if (i !== null && i.length > 0) {
		let n = r.getVariantTemplate(t, `${e.variantKey}:${i}`);
		if (n !== void 0) return n;
	}
	return r.getVariantTemplate(t, e.variantKey);
}
function RO(e, t, n, r) {
	let i = t.hostSlotVariantKey;
	if (i == null || i.length === 0) return 0;
	let a = r.getVariantTemplate(n, i)?.content.firstElementChild ?? null;
	if (a === null) return s("composite item host slot template was not found.", {
		componentId: n,
		hostSlotVariantKey: i
	}), 0;
	for (let t of PO) {
		let n = a.getAttribute(t);
		n !== null && e.setAttribute(t, n);
	}
	for (let t of Array.from(a.attributes)) t.name.startsWith("data-ui-bind-") && e.setAttribute(t.name, t.value);
	return e instanceof HTMLElement && (e.style.alignSelf = "stretch", e.style.justifySelf = "stretch"), S(a);
}
//#endregion
//#region src/items/items-row-renderer.ts
function zO(e, t, n, r, i) {
	let a = i.metadata.getItemsTemplateMetadata(e), o = a?.composite;
	if (o == null) return BO(i.renderer.renderItem(e, t, n, r), a);
	let s = FO(o, e, t, n, r, i.templates, i.renderer);
	return s !== null && a?.rowDecorator && i.renderer.decorateRow(a.rowDecorator, s, t, n, e, r), BO(s, a);
}
function BO(e, t) {
	return e !== null && t?.announcesSelection === !0 && !e.hasAttribute("aria-selected") && e.setAttribute("aria-selected", "false"), e;
}
//#endregion
//#region src/items/items-virtualization-engine.ts
var VO = 6, HO = 60, UO = class {
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
		let n = oD(e) && cD(e);
		this.project(e, t), this.layout(e, t), n && !cD(e) && (vD(e, e.scrollHeight), this.layout(e, t));
	}
	refill(e, t) {
		let n = this.getState(e);
		if (n === null) return [];
		let r = new Map(n.entries.map((e) => [e.key, e])), i = [], a = [];
		for (let { key: e, item: n } of t) {
			let t = r.get(e);
			if (r.delete(e), t !== void 0 && ls(t.item, n)) {
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
		let i = n.entries[r].element, a = e.parentElement, o = N(e).filter((e) => e instanceof HTMLElement), s = a !== null && i instanceof HTMLElement ? mo(a, o, i) : null;
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
		return i === null || a === void 0 ? !1 : (a.item = uO(a.item, n, r), n.length === 0 && a.element !== null && (a.element.remove(), a.element = null), !0);
	}
	project(e, t) {
		let n = this.options.metadata.getItemsFilterSortMetadata(t.componentId), r = Em(e), i = this.options.templates.getGroupTemplate(t.componentId), a = Am(n, this.options.state, r), o = t.entries;
		if ((n !== void 0 && n.filters.length > 0 || (r?.filters ?? []).length > 0) && (o = o.filter((e) => Om(n, e.item, this.options.state, r))), !(i !== void 0 && o.some((e) => qO(e) !== ""))) {
			a.length > 0 && (o = [...o].sort((e, t) => Mm(e.item, t.item, a))), t.projected = o.map((e) => ({
				entry: e,
				header: !1
			}));
			return;
		}
		let s = /* @__PURE__ */ new Map();
		for (let e of o) {
			let t = qO(e), n = s.get(t);
			n === void 0 ? s.set(t, [e]) : n.push(e);
		}
		let c = t.groupOrder.filter((e) => s.has(e));
		for (let e of s.keys()) c.includes(e) || c.push(e);
		t.groupOrder = c;
		let l = [];
		for (let e of c) {
			let t = s.get(e);
			a.length > 0 && (t = [...t].sort((e, t) => Mm(e.item, t.item, a))), e !== "" && l.push({
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
		let t = gD(e.target);
		if (t === null || Rm(t) !== "virtualized") return;
		let n = this.getState(t);
		n !== null && n.scheduled === 0 && (this.layout(t, n), n.scheduled = window.setTimeout(() => {
			n.scheduled = 0, this.layout(t, n);
		}, HO));
	}
	layout(e, t) {
		let n = t.projected, r = YO(e), i = n.map((e) => this.pitchOf(t, e) + r), a = n.length, o = 0, s = a;
		if (JO(e) && a > 0) {
			let r = _D(e), c = GO(e, t, n, i, r.top), l = c + r.height, u = 0;
			o = a;
			for (let e = 0; e < a; e++) {
				let t = u + i[e];
				if (o === a && t > c && (o = e), u >= l) {
					s = e;
					break;
				}
				u = t;
			}
			o === a && (o = Math.max(0, a - 1)), o = Math.max(0, o - VO), s = Math.min(a, s + VO);
		}
		let c = this.options.renderer.getAncestorStack(e), l = [], u = !1;
		for (let e = 0; e < a; e++) {
			let r = n[e], i = e >= o && e < s, a = (r.header ? t.headers.get(qO(r.entry)) ?? null : r.entry)?.element ?? null;
			if (!i) {
				a !== null && (a.remove(), KO(t, r, null), u = !0);
				continue;
			}
			if (a !== null) {
				r.header && Hw(a, r.entry.key), l.push(a);
				continue;
			}
			let d = r.header ? this.renderHeader(t, r.entry) : this.renderRow(t, r.entry, c);
			d !== null && (KO(t, r, d), l.push(d), u = !0);
		}
		let d = new Set(l);
		for (let e of t.entries) e.element !== null && !d.has(e.element) && (e.element.remove(), e.element = null, u = !0);
		for (let t of N(e)) d.has(t) || (t.remove(), u = !0);
		for (let t of e.querySelectorAll(`:scope > [${We}]`)) d.has(t) || (t.remove(), u = !0);
		for (let e of t.headers.values()) e.element !== null && !d.has(e.element) && (e.element = null);
		let f = XO(i, 0, o), p = XO(i, s, a);
		Gw(e, [...l, ...um(dm(e))]), Ww(e, "top", f > 0 ? f - r : 0), Ww(e, Uw, p > 0 ? p - r : 0), fm(e, t.componentId, this.options.templates, this.options.renderer, a > 0), (u || t.first !== o || t.last !== s) && (t.first = o, t.last = s, this.options.dom.invalidate()), t.laidOut = n, t.pitches = i, this.measure(t, n, o, s);
	}
	renderRow(e, t, n) {
		return zO(e.componentId, t.item, t.key, n, this.options);
	}
	renderHeader(e, t) {
		let n = this.options.templates.getGroupTemplate(e.componentId);
		if (n === void 0) return null;
		let r = this.options.renderer.renderFromTemplate(n, t.item);
		return r !== null && Hw(r, t.key), r;
	}
	measure(e, t, n, r) {
		for (let i = n; i < r && i < t.length; i++) {
			let n = t[i], r = n.header ? e.headers.get(qO(n.entry)) : n.entry, a = r?.element;
			if (r == null || a == null) continue;
			let o = a.getBoundingClientRect().height;
			o <= 0 || (WO(n.header ? e.headerHeights : e.itemHeights, r.height, o), r.height = o);
		}
		e.itemHeights.count > 0 && (e.itemEstimate = e.itemHeights.sum / e.itemHeights.count), e.headerHeights.count > 0 && (e.headerEstimate = e.headerHeights.sum / e.headerHeights.count);
	}
	pitchOf(e, t) {
		return t.header ? e.headers.get(qO(t.entry))?.height ?? e.headerEstimate : t.entry.height ?? e.itemEstimate;
	}
	getState(e) {
		let t = this.states.get(e);
		if (t !== void 0) return t;
		let n = Or(e);
		if (n === null) return s("a virtualized items host is not inside an addressable component.", e), null;
		let r = n.componentId, i = [], a = /* @__PURE__ */ new Map();
		for (let t of N(e)) {
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
function WO(e, t, n) {
	t === null ? (e.sum += n, e.count++) : e.sum += n - t;
}
function GO(e, t, n, r, i) {
	if (t.laidOut !== n || t.pitches.length !== r.length || i <= 0) return i;
	let a = 0, o = 0;
	for (let e = 0; e < r.length; e++) {
		let n = e >= t.first && e < t.last ? r[e] : t.pitches[e];
		if (a + n > i) break;
		a += n, o += r[e];
	}
	let s = o - a;
	return Math.abs(s) < .5 ? i : (vD(e, i + s), i + s);
}
function KO(e, t, n) {
	if (!t.header) {
		t.entry.element = n;
		return;
	}
	let r = qO(t.entry), i = e.headers.get(r);
	i === void 0 ? e.headers.set(r, {
		element: n,
		height: null
	}) : i.element = n;
}
function qO(e) {
	let t = ym(e.item, "Group");
	return t.ok && typeof t.value == "string" ? t.value : "";
}
function JO(e) {
	let t = e.parentElement;
	return t !== null && t.classList.contains("ui-items-view--stack") && t.classList.contains("ui-orientation--vertical");
}
function YO(e) {
	let t = Number.parseFloat(getComputedStyle(e).rowGap);
	return Number.isFinite(t) ? t : 0;
}
function XO(e, t, n) {
	let r = 0;
	for (let i = t; i < n; i++) r += e[i];
	return r;
}
//#endregion
//#region src/items/items-template-registry.ts
var ZO = "data-ui-template", QO = "default", $O = class {
	dom;
	templateComponentIds = null;
	constructor(e) {
		this.dom = e;
	}
	getTemplate(e, t) {
		let n = t ?? QO, r = this.findTemplate(e, n);
		return r === void 0 ? n === QO ? void 0 : this.getTemplate(e, null) : r;
	}
	getVariantTemplate(e, t) {
		return this.findTemplate(e, t);
	}
	findTemplate(e, t) {
		let n = this.dom.findComponent(e, []);
		if (n === null) return;
		let r = n.querySelectorAll(`:scope > template[${ZO}]`);
		for (let e of r) if (e.getAttribute(ZO) === t) return e;
	}
	isTemplateComponent(e) {
		return this.templateComponentIds ??= ek(this.dom.root), this.templateComponentIds.has(e);
	}
	getEmptyTemplate(e) {
		return this.getMarkedTemplate(e, Ve);
	}
	getGroupTemplate(e) {
		return this.getMarkedTemplate(e, He);
	}
	getMarkedTemplate(e, t) {
		return this.dom.findComponent(e, [])?.querySelector(`:scope > template[${t}]`) ?? void 0;
	}
};
function ek(e) {
	let t = /* @__PURE__ */ new Set();
	return na(e, (n) => {
		if (n !== e) for (let e of n.querySelectorAll(v)) {
			let n = S(e);
			n > 0 && t.add(n);
		}
	}), t;
}
//#endregion
//#region src/rendering/theme-colors.ts
function tk(e, t) {
	let n = e.querySelector(`style[${ln}]`);
	if (t.length === 0) {
		n?.remove();
		return;
	}
	if (n !== null) {
		n.textContent !== t && (n.textContent = t);
		return;
	}
	let r = document.createElement("style");
	r.setAttribute(ln, ""), r.textContent = t, e.insertBefore(r, e.querySelector("style")?.nextElementSibling ?? null);
}
//#endregion
//#region src/metadata/metadata-reader.ts
var nk = "script[type='application/json'][data-ui-metadata]";
function rk(e = document) {
	let t = e.querySelector(nk);
	if (t === null) return ik();
	let n = t.textContent?.trim() ?? "";
	if (n.length === 0) return ik();
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
function ik() {
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
var ak = "script[type='application/json'][data-ui-hydration]";
function ok(e) {
	return e !== null && (Ai(e.title) || Ai(e.changes));
}
function sk(e = document) {
	let t = e.querySelector(ak)?.textContent?.trim() ?? "";
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
var ck = "reconnecting";
async function lk(e, t, n, r) {
	for (let i = 0;; i++) try {
		return await e();
	} catch (e) {
		if (t()) return s("attaching the runtime failed as the connection dropped again; the reconnect attaches.", e), ck;
		if (i >= n.length) return c("attaching the runtime failed after retrying; giving up.", e), null;
		s("attaching the runtime failed; retrying.", {
			attempt: i + 1,
			error: e
		}), await r(n[i]);
	}
}
//#endregion
//#region src/transport/reader-time-zone.ts
function uk(e = () => Intl.DateTimeFormat().resolvedOptions().timeZone) {
	try {
		let t = e();
		return typeof t == "string" && t.length > 0 ? t : null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/transport/command-dispatcher.ts
var dk = class {
	transport;
	pendingKeys = /* @__PURE__ */ new Set();
	nextRequestId = 1;
	awaited = /* @__PURE__ */ new Map();
	constructor(e) {
		this.transport = e;
	}
	isPending(e) {
		return this.pendingKeys.has(fk(pk(e)));
	}
	async dispatchAsync(e) {
		let t = pk(e), n = fk(t);
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
function fk(e) {
	return `${JSON.stringify(e.eventId)}:${JSON.stringify(e.dynamicParameters ?? [])}`;
}
function pk(e) {
	return {
		eventId: b(e.eventId),
		dynamicParameters: e.dynamicParameters ?? []
	};
}
//#endregion
//#region src/state/property-state-store.ts
var mk = class {
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
		return r.length > 0 ? (this.recordRows(i, r), this.removeUnplaced(i)) : t.length > 0 && !this.unplacedPathByEntry.has(i) && this.recordUnplaced(i, t), a !== void 0 && ls(a.value, n) ? !1 : (this.values.set(i, {
			reference: e,
			dynamicParameters: t,
			value: n
		}), !0);
	}
	entries() {
		return this.values.values();
	}
	forgetRows(e, t, n) {
		let r = hk(e, t);
		for (let e of n) this.forgetRow(r, e), this.forgetUnplaced(gk([...t, e]));
	}
	forgetHost(e, t) {
		this.forgetScope(hk(e, t));
		let n = this.unplaced.get(gk(t));
		for (let e of [...n?.children ?? []]) this.forgetUnplaced(e);
	}
	clear() {
		this.values.clear(), this.scopes.clear(), this.unplaced.clear(), this.unplacedPathByEntry.clear();
	}
	recordRows(e, t) {
		let n = null;
		for (let [r, i] of t.entries()) {
			let t = hk(i.host, i.hostParameters), a = this.rowState(t, i.key);
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
		let n = this.unplacedNode(gk([]), null), r = "";
		for (let e = 1; e <= t.length; e++) r = gk(t.slice(0, e)), n.children.add(r), n = this.unplacedNode(r, gk(t.slice(0, e - 1)));
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
		return `${b(e.componentId)}:${e.propertyId}:${_k(t)}`;
	}
};
function hk(e, t) {
	return JSON.stringify([e, ...t.map((e) => String(e ?? ""))]);
}
function gk(e) {
	return JSON.stringify(e.map((e) => String(e ?? "")));
}
function _k(e) {
	if (e.length === 0) return "";
	try {
		return JSON.stringify(e);
	} catch {
		return String(e);
	}
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Errors.js
var vk = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(`${e}: Status code '${t}'`), this.statusCode = t, this.__proto__ = n;
	}
}, yk = class extends Error {
	constructor(e = "A timeout occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, bk = class extends Error {
	constructor(e = "An abort occurred.") {
		let t = new.target.prototype;
		super(e), this.__proto__ = t;
	}
}, xk = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "UnsupportedTransportError", this.__proto__ = n;
	}
}, Sk = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "DisabledTransportError", this.__proto__ = n;
	}
}, Ck = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.transport = t, this.errorType = "FailedToStartTransportError", this.__proto__ = n;
	}
}, wk = class extends Error {
	constructor(e) {
		let t = new.target.prototype;
		super(e), this.errorType = "FailedToNegotiateWithServerError", this.__proto__ = t;
	}
}, Tk = class extends Error {
	constructor(e, t) {
		let n = new.target.prototype;
		super(e), this.innerErrors = t, this.__proto__ = n;
	}
}, Ek = class {
	constructor(e, t, n) {
		this.statusCode = e, this.statusText = t, this.content = n;
	}
}, Dk = class {
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
var Ok = class {
	constructor() {}
	log(e, t) {}
};
Ok.instance = new Ok();
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/pkg-version.js
var kk = "10.0.11", K = class {
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
function Ak(e, t) {
	let n = "";
	return Mk(e) ? (n = `Binary data of length ${e.byteLength}`, t && (n += `. Content: '${jk(e)}'`)) : typeof e == "string" && (n = `String data of length ${e.length}`, t && (n += `. Content: '${e}'`)), n;
}
function jk(e) {
	let t = new Uint8Array(e), n = "";
	return t.forEach((e) => {
		n += `0x${e < 16 ? "0" : ""}${e.toString(16)} `;
	}), n.substring(0, n.length - 1);
}
function Mk(e) {
	return e && typeof ArrayBuffer < "u" && (e instanceof ArrayBuffer || e.constructor && e.constructor.name === "ArrayBuffer");
}
async function Nk(e, t, n, r, i, a) {
	let o = {}, [s, c] = Lk();
	o[s] = c, e.log(G.Trace, `(${t} transport) sending data. ${Ak(i, a.logMessageContent)}.`);
	let l = Mk(i) ? "arraybuffer" : "text", u = await n.post(r, {
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
function Pk(e) {
	return e === void 0 ? new Ik(G.Information) : e === null ? Ok.instance : e.log === void 0 ? new Ik(e) : e;
}
var Fk = class {
	constructor(e, t) {
		this._subject = e, this._observer = t;
	}
	dispose() {
		let e = this._subject.observers.indexOf(this._observer);
		e > -1 && this._subject.observers.splice(e, 1), this._subject.observers.length === 0 && this._subject.cancelCallback && this._subject.cancelCallback().catch((e) => {});
	}
}, Ik = class {
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
function Lk() {
	let e = "X-SignalR-User-Agent";
	return q.isNode && (e = "User-Agent"), [e, Rk(kk, zk(), Vk(), Bk())];
}
function Rk(e, t, n, r) {
	let i = "Microsoft SignalR/", a = e.split(".");
	return i += `${a[0]}.${a[1]}`, i += ` (${e}; `, i += t && t !== "" ? `${t}; ` : "Unknown OS; ", i += `${n}`, i += r ? `; ${r}` : "; Unknown Runtime Version", i += ")", i;
}
/*#__PURE__*/ function zk() {
	if (q.isNode) switch (process.platform) {
		case "win32": return "Windows NT";
		case "darwin": return "macOS";
		case "linux": return "Linux";
		default: return process.platform;
	}
	else return "";
}
/*#__PURE__*/ function Bk() {
	if (q.isNode) return process.versions.node;
}
function Vk() {
	return q.isNode ? "NodeJS" : "Browser";
}
function Hk(e) {
	return e.stack ? e.stack : e.message ? e.message : `${e}`;
}
function Uk() {
	if (typeof globalThis < "u") return globalThis;
	if (typeof self < "u") return self;
	if (typeof window < "u") return window;
	if (typeof global < "u") return global;
	throw Error("could not find global");
}
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/FetchHttpClient.js
var Wk = class extends Dk {
	constructor(t) {
		if (super(), this._logger = t, typeof fetch > "u" || q.isNode) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._jar = new (t("tough-cookie")).CookieJar(), this._fetchType = typeof fetch > "u" ? t("node-fetch") : fetch, this._fetchType = t("fetch-cookie")(this._fetchType, this._jar);
		} else this._fetchType = fetch.bind(Uk());
		if (typeof AbortController > "u") {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			this._abortControllerType = t("abort-controller");
		} else this._abortControllerType = AbortController;
	}
	async send(e) {
		if (e.abortSignal && e.abortSignal.aborted) throw new bk();
		if (!e.method) throw Error("No method defined.");
		if (!e.url) throw Error("No url defined.");
		let t = new this._abortControllerType(), n;
		e.abortSignal && (e.abortSignal.onabort = () => {
			t.abort(), n = new bk();
		});
		let r = null;
		if (e.timeout) {
			let i = e.timeout;
			r = setTimeout(() => {
				t.abort(), this._logger.log(G.Warning, "Timeout from HTTP request."), n = new yk();
			}, i);
		}
		e.content === "" && (e.content = void 0), e.content && (e.headers = e.headers || {}, Mk(e.content) ? e.headers["Content-Type"] = "application/octet-stream" : e.headers["Content-Type"] = "text/plain;charset=UTF-8");
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
		if (!i.ok) throw new vk(await Gk(i, "text") || i.statusText, i.status);
		let a = await Gk(i, e.responseType);
		return new Ek(i.status, i.statusText, a);
	}
	getCookieString(e) {
		let t = "";
		return q.isNode && this._jar && this._jar.getCookies(e, (e, n) => t = n.join("; ")), t;
	}
};
function Gk(e, t) {
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
var Kk = class extends Dk {
	constructor(e) {
		super(), this._logger = e;
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new bk()) : e.method ? e.url ? new Promise((t, n) => {
			let r = new XMLHttpRequest();
			r.open(e.method, e.url, !0), r.withCredentials = e.withCredentials === void 0 || e.withCredentials, r.setRequestHeader("X-Requested-With", "XMLHttpRequest"), e.content === "" && (e.content = void 0), e.content && (Mk(e.content) ? r.setRequestHeader("Content-Type", "application/octet-stream") : r.setRequestHeader("Content-Type", "text/plain;charset=UTF-8"));
			let i = e.headers;
			i && Object.keys(i).forEach((e) => {
				r.setRequestHeader(e, i[e]);
			}), e.responseType && (r.responseType = e.responseType), e.abortSignal && (e.abortSignal.onabort = () => {
				r.abort(), n(new bk());
			}), e.timeout && (r.timeout = e.timeout), r.onload = () => {
				e.abortSignal && (e.abortSignal.onabort = null), r.status >= 200 && r.status < 300 ? t(new Ek(r.status, r.statusText, r.response || r.responseText)) : n(new vk(r.response || r.responseText || r.statusText, r.status));
			}, r.onerror = () => {
				this._logger.log(G.Warning, `Error from HTTP request. ${r.status}: ${r.statusText}.`), n(new vk(r.statusText, r.status));
			}, r.ontimeout = () => {
				this._logger.log(G.Warning, "Timeout from HTTP request."), n(new yk());
			}, r.send(e.content);
		}) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
}, qk = class extends Dk {
	constructor(e) {
		if (super(), typeof fetch < "u" || q.isNode) this._httpClient = new Wk(e);
		else if (typeof XMLHttpRequest < "u") this._httpClient = new Kk(e);
		else throw Error("No usable HttpClient found.");
	}
	send(e) {
		return e.abortSignal && e.abortSignal.aborted ? Promise.reject(new bk()) : e.method ? e.url ? this._httpClient.send(e) : Promise.reject(/* @__PURE__ */ Error("No url defined.")) : Promise.reject(/* @__PURE__ */ Error("No method defined."));
	}
	getCookieString(e) {
		return this._httpClient.getCookieString(e);
	}
}, Jk = class e {
	static write(t) {
		return `${t}${e.RecordSeparator}`;
	}
	static parse(t) {
		if (t[t.length - 1] !== e.RecordSeparator) throw Error("Message is incomplete.");
		let n = t.split(e.RecordSeparator);
		return n.pop(), n;
	}
};
Jk.RecordSeparatorCode = 30, Jk.RecordSeparator = String.fromCharCode(Jk.RecordSeparatorCode);
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/HandshakeProtocol.js
var Yk = class {
	writeHandshakeRequest(e) {
		return Jk.write(JSON.stringify(e));
	}
	parseHandshakeResponse(e) {
		let t, n;
		if (Mk(e)) {
			let r = new Uint8Array(e), i = r.indexOf(Jk.RecordSeparatorCode);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = String.fromCharCode.apply(null, Array.prototype.slice.call(r.slice(0, a))), n = r.byteLength > a ? r.slice(a).buffer : null;
		} else {
			let r = e, i = r.indexOf(Jk.RecordSeparator);
			if (i === -1) throw Error("Message is incomplete.");
			let a = i + 1;
			t = r.substring(0, a), n = r.length > a ? r.substring(a) : null;
		}
		let r = Jk.parse(t), i = JSON.parse(r[0]);
		if (i.type) throw Error("Expected a handshake response from the server.");
		return [n, i];
	}
}, J;
(function(e) {
	e[e.Invocation = 1] = "Invocation", e[e.StreamItem = 2] = "StreamItem", e[e.Completion = 3] = "Completion", e[e.StreamInvocation = 4] = "StreamInvocation", e[e.CancelInvocation = 5] = "CancelInvocation", e[e.Ping = 6] = "Ping", e[e.Close = 7] = "Close", e[e.Ack = 8] = "Ack", e[e.Sequence = 9] = "Sequence";
})(J ||= {});
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/Subject.js
var Xk = class {
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
		return this.observers.push(e), new Fk(this, e);
	}
}, Zk = class {
	constructor(e, t, n) {
		this._bufferSize = 1e5, this._messages = [], this._totalMessageCount = 0, this._waitForSequenceMessage = !1, this._nextReceivingSequenceId = 1, this._latestReceivedSequenceId = 0, this._bufferedByteCount = 0, this._reconnectInProgress = !1, this._protocol = e, this._connection = t, this._bufferSize = n;
	}
	async _send(e) {
		let t = this._protocol.writeMessage(e), n = Promise.resolve();
		if (this._isInvocationMessage(e)) {
			this._totalMessageCount++;
			let e = () => {}, r = () => {};
			Mk(t) ? this._bufferedByteCount += t.byteLength : this._bufferedByteCount += t.length, this._bufferedByteCount >= this._bufferSize && (n = new Promise((t, n) => {
				e = t, r = n;
			})), this._messages.push(new Qk(t, this._totalMessageCount, e, r));
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
			if (r._id <= e.sequenceId) t = n, Mk(r._message) ? this._bufferedByteCount -= r._message.byteLength : this._bufferedByteCount -= r._message.length, r._resolver();
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
}, Qk = class {
	constructor(e, t, n, r) {
		this._message = e, this._id = t, this._resolver = n, this._rejector = r;
	}
}, $k = 3e4, eA = 15e3, tA = 1e5, Y;
(function(e) {
	e.Disconnected = "Disconnected", e.Connecting = "Connecting", e.Connected = "Connected", e.Disconnecting = "Disconnecting", e.Reconnecting = "Reconnecting";
})(Y ||= {});
var nA = class e {
	static create(t, n, r, i, a, o, s) {
		return new e(t, n, r, i, a, o, s);
	}
	constructor(e, t, n, r, i, a, o) {
		this._nextKeepAlive = 0, this._freezeEventListener = () => {
			this._logger.log(G.Warning, "The page is being frozen, this will likely lead to the connection being closed and messages being lost. For more information see the docs at https://learn.microsoft.com/aspnet/core/signalr/javascript-client#bsleep");
		}, K.isRequired(e, "connection"), K.isRequired(t, "logger"), K.isRequired(n, "protocol"), this.serverTimeoutInMilliseconds = i ?? $k, this.keepAliveIntervalInMilliseconds = a ?? eA, this._statefulReconnectBufferSize = o ?? tA, this._logger = t, this._protocol = n, this.connection = e, this._reconnectPolicy = r, this._handshakeProtocol = new Yk(), this.connection.onreceive = (e) => this._processIncomingData(e), this.connection.onclose = (e) => this._connectionClosed(e), this._callbacks = {}, this._methods = {}, this._closedCallbacks = [], this._reconnectingCallbacks = [], this._reconnectedCallbacks = [], this._invocationId = 0, this._receivedHandshakeResponse = !1, this._connectionState = Y.Disconnected, this._connectionStarted = !1, this._cachedPingMessage = this._protocol.writeMessage({ type: J.Ping });
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
			this.connection.features.reconnect && (this._messageBuffer = new Zk(this._protocol, this.connection, this._statefulReconnectBufferSize), this.connection.features.disconnected = this._messageBuffer._disconnected.bind(this._messageBuffer), this.connection.features.resend = () => {
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
		return this._connectionState = Y.Disconnecting, this._logger.log(G.Debug, "Stopping HubConnection."), this._reconnectDelayHandle ? (this._logger.log(G.Debug, "Connection stopped during reconnect delay. Done reconnecting."), clearTimeout(this._reconnectDelayHandle), this._reconnectDelayHandle = void 0, this._completeClose(), Promise.resolve()) : (t === Y.Connected && this._sendCloseMessage(), this._cleanupTimeout(), this._cleanupPingTimer(), this._stopDuringStartError = e || new bk("The connection was stopped before the hub handshake could complete."), this.connection.stop(e));
	}
	async _sendCloseMessage() {
		try {
			await this._sendWithProtocol(this._createCloseMessage());
		} catch {}
	}
	stream(e, ...t) {
		let [n, r] = this._replaceStreamingParams(t), i = this._createStreamInvocation(e, t, r), a, o = new Xk();
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
						this._logger.log(G.Error, `Invoke client method threw error: ${Hk(e)}`);
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
							this._logger.log(G.Error, `Stream callback threw error: ${Hk(e)}`);
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
		this._logger.log(G.Debug, `HubConnection.connectionClosed(${e}) called while in state ${this._connectionState}.`), this._stopDuringStartError = this._stopDuringStartError || e || new bk("The underlying connection was closed before the hub handshake could complete."), this._handshakeResolver && this._handshakeResolver(), this._cancelCallbacksWithError(e || /* @__PURE__ */ Error("Invocation canceled due to the underlying connection being closed.")), this._cleanupTimeout(), this._cleanupPingTimer(), this._connectionState === Y.Disconnecting ? this._completeClose(e) : this._connectionState === Y.Connected && this._reconnectPolicy ? this._reconnect(e) : this._connectionState === Y.Connected && this._completeClose(e);
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
				this._logger.log(G.Error, `Stream 'error' callback called with '${e}' threw error: ${Hk(t)}`);
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
}, rA = [
	0,
	2e3,
	1e4,
	3e4,
	null
], iA = class {
	constructor(e) {
		this._retryDelays = e === void 0 ? rA : [...e, null];
	}
	nextRetryDelayInMilliseconds(e) {
		return this._retryDelays[e.previousRetryCount];
	}
}, aA = class {};
aA.Authorization = "Authorization", aA.Cookie = "Cookie";
//#endregion
//#region node_modules/@microsoft/signalr/dist/esm/AccessTokenHttpClient.js
var oA = class extends Dk {
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
		e.headers ||= {}, this._accessToken ? e.headers[aA.Authorization] = `Bearer ${this._accessToken}` : this._accessTokenFactory && e.headers[aA.Authorization] && delete e.headers[aA.Authorization];
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
var sA = class {
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
}, cA = class {
	get pollAborted() {
		return this._pollAbort.aborted;
	}
	constructor(e, t, n) {
		this._httpClient = e, this._logger = t, this._pollAbort = new sA(), this._options = n, this._running = !1, this.onreceive = null, this.onclose = null;
	}
	async connect(e, t) {
		if (K.isRequired(e, "url"), K.isRequired(t, "transferFormat"), K.isIn(t, Z, "transferFormat"), this._url = e, this._logger.log(G.Trace, "(LongPolling transport) Connecting."), t === Z.Binary && typeof XMLHttpRequest < "u" && typeof new XMLHttpRequest().responseType != "string") throw Error("Binary protocols over XmlHttpRequest not implementing advanced features are not supported.");
		let [n, r] = Lk(), i = {
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
		s.statusCode === 200 ? this._running = !0 : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${s.statusCode}.`), this._closeError = new vk(s.statusText || "", s.statusCode), this._running = !1), this._receiving = this._poll(this._url, a);
	}
	async _poll(e, t) {
		try {
			for (; this._running;) try {
				let n = `${e}&_=${Date.now()}`;
				this._logger.log(G.Trace, `(LongPolling transport) polling: ${n}.`);
				let r = await this._httpClient.get(n, t);
				r.statusCode === 204 ? (this._logger.log(G.Information, "(LongPolling transport) Poll terminated by server."), this._running = !1) : r.statusCode === 200 ? r.content ? (this._logger.log(G.Trace, `(LongPolling transport) data received. ${Ak(r.content, this._options.logMessageContent)}.`), this.onreceive && this.onreceive(r.content)) : this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._logger.log(G.Error, `(LongPolling transport) Unexpected response code: ${r.statusCode}.`), this._closeError = new vk(r.statusText || "", r.statusCode), this._running = !1);
			} catch (e) {
				this._running ? e instanceof yk ? this._logger.log(G.Trace, "(LongPolling transport) Poll timed out, reissuing.") : (this._closeError = e, this._running = !1) : this._logger.log(G.Trace, `(LongPolling transport) Poll errored after shutdown: ${e.message}`);
			}
		} finally {
			this._logger.log(G.Trace, "(LongPolling transport) Polling complete."), this.pollAborted || this._raiseOnClose();
		}
	}
	async send(e) {
		return this._running ? Nk(this._logger, "LongPolling", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	async stop() {
		this._logger.log(G.Trace, "(LongPolling transport) Stopping polling."), this._running = !1, this._pollAbort.abort();
		try {
			await this._receiving, this._logger.log(G.Trace, `(LongPolling transport) sending DELETE request to ${this._url}.`);
			let e = {}, [t, n] = Lk();
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
			i ? i instanceof vk && (i.statusCode === 404 ? this._logger.log(G.Trace, "(LongPolling transport) A 404 response was returned from sending a DELETE request.") : this._logger.log(G.Trace, `(LongPolling transport) Error sending a DELETE request: ${i}`)) : this._logger.log(G.Trace, "(LongPolling transport) DELETE request accepted.");
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
}, lA = class {
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
				let [r, i] = Lk();
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
						this._logger.log(G.Trace, `(SSE transport) data received. ${Ak(e.data, this._options.logMessageContent)}.`), this.onreceive(e.data);
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
		return this._eventSource ? Nk(this._logger, "SSE", this._httpClient, this._url, e, this._options) : Promise.reject(/* @__PURE__ */ Error("Cannot send until the transport is connected"));
	}
	stop() {
		return this._close(), Promise.resolve();
	}
	_close(e) {
		this._eventSource && (this._eventSource.close(), this._eventSource = void 0, this.onclose && this.onclose(e));
	}
}, uA = class {
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
				let t = {}, [r, i] = Lk();
				t[r] = i, n && (t[aA.Authorization] = `Bearer ${n}`), o && (t[aA.Cookie] = o), a = new this._webSocketConstructor(e, void 0, { headers: {
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
				if (this._logger.log(G.Trace, `(WebSockets transport) data received. ${Ak(e.data, this._logMessageContent)}.`), this.onreceive) try {
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
		return this._webSocket && this._webSocket.readyState === this._webSocketConstructor.OPEN ? (this._logger.log(G.Trace, `(WebSockets transport) sending data. ${Ak(e, this._logMessageContent)}.`), this._webSocket.send(e), Promise.resolve()) : Promise.reject("WebSocket is not in the OPEN state");
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
}, dA = 100, fA = class {
	constructor(t, n = {}) {
		if (this._stopPromiseResolver = () => {}, this.features = {}, this._negotiateVersion = 1, K.isRequired(t, "url"), this._logger = Pk(n.logger), this.baseUrl = this._resolveUrl(t), n ||= {}, n.logMessageContent = n.logMessageContent !== void 0 && n.logMessageContent, typeof n.withCredentials == "boolean" || n.withCredentials === void 0) n.withCredentials = n.withCredentials === void 0 || n.withCredentials;
		else throw Error("withCredentials option was not a 'boolean' or 'undefined' value");
		n.timeout = n.timeout === void 0 ? 1e5 : n.timeout;
		let r = null, i = null;
		if (q.isNode && e !== void 0) {
			let t = typeof __webpack_require__ == "function" ? __non_webpack_require__ : e;
			r = t("ws"), i = t("eventsource");
		}
		!q.isNode && typeof WebSocket < "u" && !n.WebSocket ? n.WebSocket = WebSocket : q.isNode && !n.WebSocket && r && (n.WebSocket = r), !q.isNode && typeof EventSource < "u" && !n.EventSource ? n.EventSource = EventSource : q.isNode && !n.EventSource && i !== void 0 && (n.EventSource = i), this._httpClient = new oA(n.httpClient || new qk(this._logger), n.accessTokenFactory), this._connectionState = "Disconnected", this._connectionStarted = !1, this._options = n, this.onreceive = null, this.onclose = null;
	}
	async start(e) {
		if (e ||= Z.Binary, K.isIn(e, Z, "transferFormat"), this._logger.log(G.Debug, `Starting connection with transfer format '${Z[e]}'.`), this._connectionState !== "Disconnected") return Promise.reject(/* @__PURE__ */ Error("Cannot start an HttpConnection that is not in the 'Disconnected' state."));
		if (this._connectionState = "Connecting", this._startInternalPromise = this._startInternal(e), await this._startInternalPromise, this._connectionState === "Disconnecting") {
			let e = "Failed to start the HttpConnection before stop() was called.";
			return this._logger.log(G.Error, e), await this._stopPromise, Promise.reject(new bk(e));
		}
		if (this._connectionState !== "Connected") {
			let e = "HttpConnection.startInternal completed gracefully but didn't enter the connection into the connected state!";
			return this._logger.log(G.Error, e), Promise.reject(new bk(e));
		}
		this._connectionStarted = !0;
	}
	send(e) {
		return this._connectionState === "Connected" ? (this._sendQueue ||= new mA(this.transport), this._sendQueue.send(e)) : Promise.reject(/* @__PURE__ */ Error("Cannot send data if the connection is not in the 'Connected' State."));
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
					if (n = await this._getNegotiationResponse(t), this._connectionState === "Disconnecting" || this._connectionState === "Disconnected") throw new bk("The connection was stopped during negotiation.");
					if (n.error) throw Error(n.error);
					if (n.ProtocolVersion) throw Error("Detected a connection attempt to an ASP.NET SignalR Server. This client only supports connecting to an ASP.NET Core SignalR Server. See https://aka.ms/signalr-core-differences for details.");
					if (n.url && (t = n.url), n.accessToken) {
						let e = n.accessToken;
						this._accessTokenFactory = () => e, this._httpClient._accessToken = e, this._httpClient._accessTokenFactory = void 0;
					}
					r++;
				} while (n.url && r < dA);
				if (r === dA && n.url) throw Error("Negotiate redirection limit exceeded.");
				await this._createTransport(t, this._options.transport, n, e);
			}
			this.transport instanceof cA && (this.features.inherentKeepAlive = !0), this._connectionState === "Connecting" && (this._logger.log(G.Debug, "The HttpConnection connected successfully."), this._connectionState = "Connected");
		} catch (e) {
			return this._logger.log(G.Error, "Failed to start the connection: " + e), this._connectionState = "Disconnected", this.transport = void 0, this._stopPromiseResolver(), Promise.reject(e);
		}
	}
	async _getNegotiationResponse(e) {
		let t = {}, [n, r] = Lk();
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
			return (!n.negotiateVersion || n.negotiateVersion < 1) && (n.connectionToken = n.connectionId), n.useStatefulReconnect && this._options._useStatefulReconnect !== !0 ? Promise.reject(new wk("Client didn't negotiate Stateful Reconnect but the server did.")) : n;
		} catch (e) {
			let t = "Failed to complete negotiation with the server: " + e;
			return e instanceof vk && e.statusCode === 404 && (t += " Either this is not a SignalR endpoint or there is a proxy blocking the connection."), this._logger.log(G.Error, t), Promise.reject(new wk(t));
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
					if (this._logger.log(G.Error, `Failed to start the transport '${n.transport}': ${e}`), s = void 0, a.push(new Ck(`${n.transport} failed: ${e}`, X[n.transport])), this._connectionState !== "Connecting") {
						let e = "Failed to select transport before stop() was called.";
						return this._logger.log(G.Debug, e), Promise.reject(new bk(e));
					}
				}
			}
		}
		return a.length > 0 ? Promise.reject(new Tk(`Unable to connect to the server with any of the available transports. ${a.join(" ")}`, a)) : Promise.reject(/* @__PURE__ */ Error("None of the transports supported by the client are supported by the server."));
	}
	_constructTransport(e) {
		switch (e) {
			case X.WebSockets:
				if (!this._options.WebSocket) throw Error("'WebSocket' is not supported in your environment.");
				return new uA(this._httpClient, this._accessTokenFactory, this._logger, this._options.logMessageContent, this._options.WebSocket, this._options.headers || {});
			case X.ServerSentEvents:
				if (!this._options.EventSource) throw Error("'EventSource' is not supported in your environment.");
				return new lA(this._httpClient, this._httpClient._accessToken, this._logger, this._options);
			case X.LongPolling: return new cA(this._httpClient, this._logger, this._options);
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
		if (pA(t, i)) {
			if (e.transferFormats.map((e) => Z[e]).indexOf(n) >= 0) {
				if (i === X.WebSockets && !this._options.WebSocket || i === X.ServerSentEvents && !this._options.EventSource) return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it is not supported in your environment.'`), new xk(`'${X[i]}' is not supported in your environment.`, i);
				this._logger.log(G.Debug, `Selecting transport '${X[i]}'.`);
				try {
					return this.features.reconnect = i === X.WebSockets ? r : void 0, this._constructTransport(i);
				} catch (e) {
					return e;
				}
			}
			return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it does not support the requested transfer format '${Z[n]}'.`), /* @__PURE__ */ Error(`'${X[i]}' does not support ${Z[n]}.`);
		}
		return this._logger.log(G.Debug, `Skipping transport '${X[i]}' because it was disabled by the client.`), new Sk(`'${X[i]}' is disabled by the client.`, i);
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
function pA(e, t) {
	return !e || (t & e) !== 0;
}
var mA = class e {
	constructor(e) {
		this._transport = e, this._buffer = [], this._executing = !0, this._sendBufferedData = new hA(), this._transportResult = new hA(), this._sendLoopPromise = this._sendLoop();
	}
	send(e) {
		return this._bufferData(e), this._transportResult ||= new hA(), this._transportResult.promise;
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
			this._sendBufferedData = new hA();
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
}, hA = class {
	constructor() {
		this.promise = new Promise((e, t) => [this._resolver, this._rejecter] = [e, t]);
	}
	resolve() {
		this._resolver();
	}
	reject(e) {
		this._rejecter(e);
	}
}, gA = "json", _A = class {
	constructor() {
		this.name = gA, this.version = 2, this.transferFormat = Z.Text;
	}
	parseMessages(e, t) {
		if (typeof e != "string") throw Error("Invalid input for JSON hub protocol. Expected a string.");
		if (!e) return [];
		t === null && (t = Ok.instance);
		let n = Jk.parse(e), r = [];
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
		return Jk.write(JSON.stringify(e));
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
}, vA = {
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
function yA(e) {
	let t = vA[e.toLowerCase()];
	if (t !== void 0) return t;
	throw Error(`Unknown log level: ${e}`);
}
var bA = class {
	configureLogging(e) {
		if (K.isRequired(e, "logging"), xA(e)) this.logger = e;
		else if (typeof e == "string") {
			let t = yA(e);
			this.logger = new Ik(t);
		} else this.logger = new Ik(e);
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
		return this.reconnectPolicy = e ? Array.isArray(e) ? new iA(e) : e : new iA(), this;
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
		let t = new fA(this.url, e);
		return nA.create(t, this.logger || Ok.instance, this.protocol || new _A(), this.reconnectPolicy, this._serverTimeoutInMilliseconds, this._keepAliveIntervalInMilliseconds, this._statefulReconnectBufferSize);
	}
};
function xA(e) {
	return e.log !== void 0;
}
//#endregion
//#region src/transport/attach-gate.ts
var SA = class extends Error {
	constructor(e) {
		super("the connection to the server dropped under the call; it is reconnecting.", { cause: e }), this.name = "ConnectionDropped";
	}
}, CA = class {
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
}, wA = class {
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
}, TA = 500;
function EA(e) {
	let { changes: t, ...n } = e;
	return n;
}
function DA() {
	return {};
}
var OA = class {
	windowId;
	connection;
	started = !1;
	gate = new CA();
	inbound;
	constructor(e, t, n = {}) {
		this.windowId = e, this.inbound = new wA(t), this.connection = new bA().withUrl(n.hubUrl ?? "/_ne/hub").withAutomaticReconnect([...n.reconnectDelays ?? [
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
		return await this.invokeAsync("ProcessEventAsync", [e], (e) => this.inbound.answered(e, (e) => e.changes, EA));
	}
	async processChangeSetAsync(e, t) {
		try {
			await this.invokeAsync("ProcessChangeSetAsync", [e], (e) => this.inbound.answered(e, (e) => e, DA, t));
		} catch (e) {
			throw this.isReconnecting && this.gate.failure === null ? new SA(e) : e;
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
		await this.invokeAsync("RequestItemWindowAsync", [e], (e) => this.inbound.answered(e, (e) => e, DA));
	}
	async invokeAsync(e, t, n) {
		let r = window.setTimeout(() => s("call waiting behind the attach.", { methodName: e }), TA);
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
}, kA = "/_ne/values", AA = 3e4;
function jA(e) {
	let t = JSON.stringify(e);
	if (t === void 0 || t.length * 3 <= 8192) return null;
	let n = new TextEncoder().encode(t);
	return n.byteLength > 8192 ? n : null;
}
function MA(e) {
	return e?.updates?.some((e) => typeof e.valueToken == "string") === !0;
}
async function NA(e, t = AA) {
	if (e === void 0 || !MA(e)) return e;
	let n = await Promise.all((e.updates ?? []).map(async (e) => {
		let n = e.valueToken;
		if (typeof n != "string") return e;
		let r = await fetch(`${kA}/${encodeURIComponent(n)}`, {
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
async function PA(e) {
	let t = await fetch(kA, {
		method: "POST",
		body: e,
		headers: { "Content-Type": "application/json" },
		credentials: "same-origin",
		signal: AbortSignal.timeout(AA)
	});
	if (!t.ok) throw Error(`Staging a large value failed with status ${t.status}.`);
	let n = (await t.json())?.token;
	if (n === void 0 || n.length === 0) throw Error("Staging a large value answered with no token.");
	return n;
}
//#endregion
//#region src/transport/value-change-dispatcher.ts
var FA = Promise.resolve(), IA = () => {}, LA = class {
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
		if (this.handed >= this.given) return FA;
		let e = this.given;
		return new Promise((t) => this.sentWaiters.push({
			through: e,
			resolve: t
		}));
	}
	dispatchAsync(e, t) {
		this.given++;
		let n = jA(e.value), r = n === null ? null : PA(n);
		return r?.catch(IA), new Promise((i, a) => {
			let o = RA(e), s = this.queue.findIndex((e) => e.field === o), c = [{
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
		let i = n.length === 0 ? null : this.transport.processChangeSetAsync({ updates: n }, zA(r));
		if (this.markHanded(t), i !== null) try {
			await i;
			for (let e of r) for (let t of e.settles) t.resolve();
		} catch (e) {
			if (e instanceof SA) {
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
		let t = this.transport.whenAttached().then(() => PA(e));
		return t.catch(IA), t;
	}
	markHanded(e) {
		this.handed = Math.max(this.handed, e);
		for (let e = this.sentWaiters.length - 1; e >= 0; e--) {
			let t = this.sentWaiters[e];
			t.through <= this.handed && (this.sentWaiters.splice(e, 1), t.resolve());
		}
	}
};
function RA(e) {
	return `${e.componentId}:${e.propertyName}:${JSON.stringify(e.dynamicParameters)}`;
}
function zA(e) {
	let t = e.map((e) => e.before).filter((e) => e !== void 0);
	if (t.length !== 0) return () => {
		for (let e of t) e();
	};
}
//#endregion
//#region src/interactions/legacy-commands.ts
var BA = document;
function VA() {
	try {
		return BA.execCommand("copy");
	} catch {
		return !1;
	}
}
function HA(e) {
	try {
		return typeof BA.execCommand == "function" && BA.execCommand("insertText", !1, e);
	} catch {
		return !1;
	}
}
//#endregion
//#region src/effects/insert-text.ts
function UA(e, t, n) {
	let r = e.itemKey === !0 ? WA(n) : e.text;
	if (typeof r != "string") {
		s(e.itemKey === !0 ? "insert text effect reads the row's key but ran for no row." : "insert text effect carries no text.", e);
		return;
	}
	let i = GA(t);
	if (i === null) {
		s("insert text effect target holds no text field.", e);
		return;
	}
	KA(i, r);
}
function WA(e) {
	let t = e.length === 0 ? null : e[e.length - 1];
	return t == null ? null : String(t);
}
function GA(e) {
	if (Ca(e)) return e;
	for (let t of e.querySelectorAll("input, textarea")) if (Ca(t)) return t;
	return null;
}
function KA(e, t) {
	if (t.length === 0 || e.readOnly || e.disabled || w(e) || E(e)) return !1;
	let n = e.value, r = e.selectionStart !== null, i = e.selectionStart ?? n.length, a = e.selectionEnd ?? i;
	return e.maxLength >= 0 && n.length - (a - i) + t.length > e.maxLength ? !1 : (document.activeElement !== e && e.focus({ preventScroll: !0 }), r && e.setSelectionRange(i, a), document.activeElement === e && HA(t) && e.value !== n ? !0 : (r ? e.setRangeText(t, i, a, "end") : e.value = n + t, e.dispatchEvent(new Event("input", { bubbles: !0 })), !0));
}
//#endregion
//#region src/effects/navigation-url.ts
function qA(e) {
	let t = e.request?.route;
	if (t == null || t.length === 0) return null;
	let n = JA(e.request?.parameters ?? null);
	if (n.length === 0) return t;
	let r = t.indexOf("#"), i = r < 0 ? t : t.slice(0, r), a = r < 0 ? "" : t.slice(r);
	return `${i}${i.includes("?") ? i.endsWith("?") || i.endsWith("&") ? "" : "&" : "?"}${n}${a}`;
}
function JA(e) {
	if (e === null) return "";
	let t = new URLSearchParams();
	for (let [n, r] of Object.entries(e)) if (r != null) for (let e of Array.isArray(r) ? r : [r]) e != null && t.append(n, YA(e));
	return t.toString();
}
function YA(e) {
	return typeof e == "object" ? JSON.stringify(e) : String(e);
}
//#endregion
//#region src/effects/scroller.ts
function XA(e, t) {
	let n = ZA([e, ...e.querySelectorAll("*")], t);
	if (n !== null) return n;
	let r = [];
	for (let t = e.parentElement; t !== null; t = t.parentElement) r.push(t);
	return ZA(r, t);
}
function ZA(e, t) {
	let n = null;
	for (let r of e) if (QA(r, t)) {
		if ($A(r, t)) return r;
		n ??= r;
	}
	return n;
}
function QA(e, t) {
	let n = t ? getComputedStyle(e).overflowY : getComputedStyle(e).overflowX;
	return n === "auto" || n === "scroll";
}
function $A(e, t) {
	return t ? e.scrollHeight > e.clientHeight : e.scrollWidth > e.clientWidth;
}
//#endregion
//#region src/effects/effect-registry.ts
var ej = class {
	handlers = /* @__PURE__ */ new Map();
	dialogs;
	notifications;
	valueReaders;
	reportTheme;
	constructor(e = {}) {
		this.dialogs = e.dialogs, this.notifications = e.notifications, this.valueReaders = e.valueReaders, this.reportTheme = e.reportTheme, this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(cr(e), t);
	}
	applyAll(e, t) {
		if (e != null) for (let n of e) this.apply({
			effect: n,
			dom: t
		});
	}
	apply(e) {
		let t = cr(e.effect?.kind), n = t.length === 0 ? void 0 : this.handlers.get(t);
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
			let t = qA(e.effect);
			if (t === null) {
				s("navigate effect carries no route.", e.effect);
				return;
			}
			if (!lu(t)) {
				s("navigate effect names no route of this site; not followed.", e.effect);
				return;
			}
			window.location.assign(t);
		}), this.register("SetTheme", (e) => {
			let t = e.effect, n = fr(t.mode), r = n === "Unknown" ? "auto" : n.toLowerCase();
			document.documentElement.getAttribute("data-ui-theme") !== r && document.documentElement.setAttribute(cn, r), t.stored !== !0 && this.reportTheme?.(r);
		}), this.register("Focus", (e) => {
			let t = nj(e);
			t !== null && ij(t);
		}), this.register("ScrollTo", (e) => {
			let t = nj(e);
			if (t === null) return;
			let n = e.effect, r = lr(n.behavior), i = ur(n.block);
			t.scrollIntoView({
				behavior: rj(r),
				block: i === "Unknown" ? "nearest" : i.toLowerCase()
			});
		}), this.register("Scroll", (e) => {
			let t = nj(e);
			if (t === null) return;
			let n = e.effect, r = pr(n.axis) !== "Horizontal", i = XA(t, r);
			if (i === null) {
				s("scroll effect target has no scrollable element.", e.effect);
				return;
			}
			let a = r ? i.clientHeight : i.clientWidth, o = (r ? i.scrollHeight : i.scrollWidth) - a, c = r ? i.scrollTop : i.scrollLeft, l = dr(n.position), u;
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
			let d = rj(lr(n.behavior));
			r && l === "End" && oD(i) && nD(i), i.scrollTo(r ? {
				top: u,
				behavior: d
			} : {
				left: u,
				behavior: d
			});
		}), this.register("Show", (e) => {
			tj(nj(e), null);
		}), this.register("Hide", (e) => {
			tj(nj(e), "hidden");
		}), this.register("Collapse", (e) => {
			tj(nj(e), "collapsed");
		}), this.register("CopyToClipboard", (e) => {
			let t = aj(e, this.valueReaders);
			t !== null && oj(t).catch((e) => s("copy to clipboard failed.", e));
		}), this.register("InsertText", (e) => {
			let t = nj(e);
			t !== null && UA(e.effect, t, e.row ?? []);
		}), this.register("OpenPicker", (e) => {
			let t = nj(e);
			t !== null && !Ml(t) && s("open picker effect names no file or image input.", e.effect);
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
			if (!au(t.requestPath)) {
				s("download effect refused: the path's scheme is not one a link may carry.", e.effect);
				return;
			}
			let n = document.createElement("a");
			n.href = t.requestPath, n.download = t.fileName ?? "", n.style.display = "none", document.body.appendChild(n), n.click(), n.remove();
		}), this.register("ShowNotification", (e) => {
			let t = e.effect;
			if (!Ei(t.message) && !Di(t.message)) {
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
function tj(e, t) {
	if (e !== null) for (let n of wn) t === null ? e.removeAttribute(n) : e.setAttribute(n, t);
}
function nj(e) {
	let t = e.effect.target;
	if (t === void 0 || t.id === void 0) return s("targeted client effect carries no resolved component address.", e.effect), null;
	let n = e.dom.findComponent(b(t.id), t.dynamicParameters ?? []);
	return n === null && s("client effect target was not found in the DOM.", e.effect), n;
}
function rj(e) {
	return e === "Smooth" && !ks() ? "smooth" : "auto";
}
function ij(e) {
	if (e instanceof HTMLElement && (e.tabIndex >= 0 || e.matches(ho))) {
		e.focus();
		return;
	}
	let t = ko(e);
	if (t !== null) {
		t.focus();
		return;
	}
	s("focus effect target has nothing focusable.", e);
}
function aj(e, t) {
	let n = e.effect;
	if (typeof n.text == "string") return n.text;
	let r = nj(e);
	return r === null ? null : t === void 0 ? (s("copy to clipboard effect names a component but no value reader is wired up.", e.effect), null) : ga(r) === null ? (s("copy to clipboard effect target holds no value.", e.effect), null) : ua(t.readHeld(r));
}
async function oj(e) {
	if (navigator.clipboard !== void 0) try {
		await navigator.clipboard.writeText(e);
		return;
	} catch {}
	if (!sj(e)) throw Error("neither the clipboard API nor the selection command took the text.");
}
function sj(e) {
	let t = document.createElement("textarea");
	t.value = e, t.setAttribute("readonly", ""), t.style.position = "fixed", t.style.opacity = "0", document.body.appendChild(t), t.select();
	try {
		return VA();
	} finally {
		t.remove();
	}
}
//#endregion
//#region src/interactions/dialog-engine.ts
var cj = "data-ui-dialog-close-backdrop", lj = "data-ui-dialog-close-escape", uj = "data-ui-dialog-backdrop", dj = class {
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
		let n = Ro(t.querySelector(".ui-dialog__surface") ?? t, ko(t));
		return n !== null && this.returnFocusByKey.set(e, n), !0;
	}
	close(e) {
		let t = this.find(e);
		if (t === null) return s("dialog was not found in the DOM.", e), !1;
		if (t.hasAttribute("hidden")) return !0;
		let n = this.returnFocusByKey.get(e);
		return this.returnFocusByKey.delete(e), t.contains(document.activeElement) && Wo(Vo(n, this.root), t), t.setAttribute("hidden", ""), !0;
	}
	find(e) {
		let t = typeof CSS < "u" && typeof CSS.escape == "function" ? CSS.escape(e) : e;
		return this.root.querySelector(`[${gc}="${t}"]`);
	}
	handleClick(e) {
		let t = e.target;
		if (!(t instanceof Element)) return;
		let n = t.closest(`[${uj}]`);
		if (n === null) return;
		let r = n.closest(`[${gc}]`);
		if (!(r instanceof HTMLElement) || r.hasAttribute("hidden") || !r.hasAttribute(cj)) return;
		let i = r.getAttribute(gc);
		i !== null && this.closeFromViewer(i);
	}
	handleKeydown(e) {
		if (e.defaultPrevented || e.isComposing) return;
		let t = this.getTopmostOpen();
		if (t !== null) {
			if (e.key === "Escape" && t.hasAttribute(lj) && !kc() && !xc(e.target) && !sd(e.target)) {
				let n = t.getAttribute(gc);
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
		return _c(this.root);
	}
	trapTab(e, t) {
		let n = Ao(e, document.activeElement);
		if (n.length === 0) {
			t.preventDefault();
			return;
		}
		let r = No(e, n, document.activeElement, t.shiftKey);
		r !== null && (t.preventDefault(), r.focus());
	}
}, fj = /* @__PURE__ */ new Map([
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
]), pj = [
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
function mj(e) {
	return Q(e, pj);
}
var hj = [
	"small",
	"medium",
	"large"
], gj = [
	"display",
	"title",
	"subtitle",
	"body",
	"caption",
	"overline"
], _j = [
	"start",
	"center",
	"end",
	"justify"
], vj = ["nowrap", "wrap"], yj = /* @__PURE__ */ new Map([
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
]), bj = /* @__PURE__ */ new Map([
	["primary", "--ui-color-primary-ink"],
	["accent", "--ui-color-accent-ink"],
	["info", "--ui-color-info-ink"],
	["warning", "--ui-color-warning-ink"],
	["success", "--ui-color-success-ink"],
	["danger", "--ui-color-danger-ink"]
]), xj = /* @__PURE__ */ new Map([
	["primary", "--ui-color-on-primary"],
	["accent", "--ui-color-on-accent"],
	["info", "--ui-color-on-info"],
	["warning", "--ui-color-on-warning"],
	["success", "--ui-color-on-success"],
	["danger", "--ui-color-on-danger"]
]), Sj = ["inline", "trailing"], Cj = [
	"filled",
	"outline",
	"underline",
	"ghost"
], wj = [
	"small",
	"medium",
	"large"
], Tj = [
	"small",
	"medium",
	"large"
], Ej = [
	"primary",
	"accent",
	"danger",
	"outline",
	"ghost",
	"link",
	"surface"
], Dj = [
	"primary",
	"accent",
	"info",
	"warning",
	"success",
	"danger",
	"surface",
	"plain"
], Oj = ["light", "dark"], kj = [
	"start",
	"center",
	"end",
	"stretch"
], Aj = ["clip", "visible"], jj = [
	"visible",
	"hidden",
	"collapsed"
], Mj = [
	"background",
	"raised",
	"tinted"
], Nj = ["horizontal", "vertical"], Pj = [
	"none",
	"gap",
	"rule"
], Fj = [
	"none",
	"one",
	"many"
], Ij = [
	"none",
	"left",
	"right",
	"top",
	"bottom"
], Lj = ["stack", "wrap"], Rj = ["end", "start"], zj = [
	"disabled",
	"auto",
	"always"
], Bj = [
	"disabled",
	"proximity",
	"mandatory"
], Vj = [
	"text",
	"email",
	"password",
	"search",
	"tel",
	"url"
], Hj = ["hex", "rgb"], Uj = ["field", "swatch"], Wj = [
	"fill",
	"contain",
	"cover",
	"none"
], Gj = [
	"100% 100%",
	"contain",
	"cover",
	"auto"
], Kj = ["linear", "circular"], qj = ["keep", "replace"], Jj = [
	"none",
	"vertical",
	"horizontal",
	"both"
], Yj = [
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
], Xj = [
	"None",
	"Shade",
	"Tint"
], Zj = /* @__PURE__ */ new Map([
	["colorClass", (e) => `ui-color--${Q(e, pj)}`],
	["themeColorClass", (e) => EM(e)],
	["iconClass", (e) => Eu(e)],
	["iconUrlCss", (e) => yu(e)],
	["safeUrl", (e) => ou(e)],
	["safeImageSource", (e) => mu(e)],
	["inlineMarkupPlainText", (e) => e == null ? void 0 : Qv(String(e))],
	["iconSizeClass", (e) => `ui-icon-size--${Q(e, hj)}`],
	["textTypeClass", (e) => `ui-text-type--${Q(e, gj)}`],
	["textAppearanceClass", (e) => FM(e)],
	["textAlignmentClass", (e) => `ui-text--align-${Q(e, _j)}`],
	["textWrapClass", (e) => `ui-text--${Q(e, vj)}`],
	["textBadgePlacementClass", (e) => `ui-text__badge--${Q(e, Sj)}`],
	["badgeStyleClass", (e) => `ui-badge-style--${Q(e, Dj)}`],
	["badgeTextFit", (e) => DM(e)],
	["buttonClass", (e) => `ui-button--${Q(e, Ej)}`],
	["surfaceStyleClass", (e) => `ui-surface--${Q(e, Mj)}`],
	["orientationClass", (e) => `ui-orientation--${Q(e, Nj)}`],
	["groupSeparatorClass", (e) => `ui-command-bar--separator-${Q(e, Pj)}`],
	["selectionModeAttribute", (e) => Q(e, Fj)],
	["selectionBackgroundCss", (e) => yM(gM(e, "background"))],
	["selectionForegroundCss", (e) => yM(gM(e, "foreground"))],
	["selectionMarkColorCss", (e) => yM(gM(e, "markColor"))],
	["selectionMarkCss", (e) => vM(gM(e, "mark"))],
	["selectionFontWeightCss", (e) => _M(gM(e, "bold"))],
	["itemsViewLayoutClass", (e) => `ui-items-view--${Q(e, Lj)}`],
	["dragHandlePlacementClass", (e) => `ui-drag-handle--${Q(e, Rj)}`],
	["scrollXClass", (e) => `ui-scroll-x--${Q(e, zj)}`],
	["scrollYClass", (e) => `ui-scroll-y--${Q(e, zj)}`],
	["hostViewport", (e) => oM(e)],
	["scrollSnapClass", (e) => `ui-scroll-snap--${Q(e, Bj)}`],
	["inputAppearanceClass", (e) => `ui-input--${Q(e, Cj)}`],
	["inputSizeClass", (e) => `ui-input--${Q(e, Tj)}`],
	["buttonSizeClass", (e) => `ui-button--${Q(e, wj)}`],
	["buttonGroupSizeClass", (e) => `ui-button-group--${Q(e, wj)}`],
	["textInputTypeAttribute", (e) => Q(e, Vj)],
	["colorTextFormatAttribute", (e) => Q(e, Hj)],
	["colorInputVariantAttribute", (e) => Q(e, Uj)],
	["themeNameCss", (e) => Q(e, Oj)],
	["alignmentCss", (e) => Q(e, kj)],
	["alignmentStretchFallbackCss", (e) => Q(e, kj) === "stretch" ? "start" : ""],
	["overflowCss", (e) => Q(e, Aj)],
	["layoutLengthCss", (e) => sM(e)],
	["thicknessCss", (e) => lM(e)],
	["borderNoneClass", (e) => dM(e)],
	["radiusCss", (e) => fM(e)],
	["gridUnitCss", (e) => pM(e)],
	["pixelsCss", (e) => GM(e)],
	["gridTemplateCss", (e) => mM(e)],
	["colorVariantCss", (e) => zM(e)],
	["themeColorCss", (e) => yM(e)],
	["themeInkCss", (e) => xM(e)],
	["themeOnColorCss", (e) => CM(e)],
	["themeColorInlineCss", (e) => bM(e) ? "" : yM(e)],
	["themeColorCanonical", (e) => LM(e)],
	["textAppearanceFontSizeCss", (e) => IM(e, "size")],
	["textAppearanceFontWeightCss", (e) => IM(e, "weight")],
	["textAppearanceLineHeightCss", (e) => IM(e, "lineHeight")],
	["textAppearanceLetterSpacingCss", (e) => IM(e, "letterSpacing")],
	["responsiveLayoutLengthBaseCss", (e) => sM(V(e, "base"))],
	["responsiveLayoutLengthSmCss", (e) => sM(V(e, "sm"))],
	["responsiveLayoutLengthMdCss", (e) => sM(V(e, "md"))],
	["responsiveLayoutLengthXlCss", (e) => sM(V(e, "xl"))],
	["responsiveLayoutLengthXxlCss", (e) => sM(V(e, "xxl"))],
	["responsiveWidthBaseCss", (e) => cM(V(e, "base"), "horizontal")],
	["responsiveWidthSmCss", (e) => cM(V(e, "sm"), "horizontal")],
	["responsiveWidthMdCss", (e) => cM(V(e, "md"), "horizontal")],
	["responsiveWidthXlCss", (e) => cM(V(e, "xl"), "horizontal")],
	["responsiveWidthXxlCss", (e) => cM(V(e, "xxl"), "horizontal")],
	["responsiveHeightBaseCss", (e) => cM(V(e, "base"), "vertical")],
	["responsiveHeightSmCss", (e) => cM(V(e, "sm"), "vertical")],
	["responsiveHeightMdCss", (e) => cM(V(e, "md"), "vertical")],
	["responsiveHeightXlCss", (e) => cM(V(e, "xl"), "vertical")],
	["responsiveHeightXxlCss", (e) => cM(V(e, "xxl"), "vertical")],
	["responsiveThicknessBaseCss", (e) => lM(V(e, "base"))],
	["responsiveThicknessSmCss", (e) => lM(V(e, "sm"))],
	["responsiveThicknessMdCss", (e) => lM(V(e, "md"))],
	["responsiveThicknessXlCss", (e) => lM(V(e, "xl"))],
	["responsiveThicknessXxlCss", (e) => lM(V(e, "xxl"))],
	["responsiveThicknessHorizontalBaseCss", (e) => uM(V(e, "base"), "horizontal")],
	["responsiveThicknessHorizontalSmCss", (e) => uM(V(e, "sm"), "horizontal")],
	["responsiveThicknessHorizontalMdCss", (e) => uM(V(e, "md"), "horizontal")],
	["responsiveThicknessHorizontalXlCss", (e) => uM(V(e, "xl"), "horizontal")],
	["responsiveThicknessHorizontalXxlCss", (e) => uM(V(e, "xxl"), "horizontal")],
	["responsiveThicknessVerticalBaseCss", (e) => uM(V(e, "base"), "vertical")],
	["responsiveThicknessVerticalSmCss", (e) => uM(V(e, "sm"), "vertical")],
	["responsiveThicknessVerticalMdCss", (e) => uM(V(e, "md"), "vertical")],
	["responsiveThicknessVerticalXlCss", (e) => uM(V(e, "xl"), "vertical")],
	["responsiveThicknessVerticalXxlCss", (e) => uM(V(e, "xxl"), "vertical")],
	["responsivePixelsBaseCss", (e) => KM(V(e, "base"))],
	["responsivePixelsSmCss", (e) => KM(V(e, "sm"))],
	["responsivePixelsMdCss", (e) => KM(V(e, "md"))],
	["responsivePixelsXlCss", (e) => KM(V(e, "xl"))],
	["responsivePixelsXxlCss", (e) => KM(V(e, "xxl"))],
	["visibilityBaseAttribute", (e) => qM(e, "base")],
	["visibilitySmAttribute", (e) => qM(e, "sm")],
	["visibilityMdAttribute", (e) => qM(e, "md")],
	["visibilityXlAttribute", (e) => qM(e, "xl")],
	["visibilityXxlAttribute", (e) => qM(e, "xxl")],
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
	["imageFitClass", (e) => `ui-image-fit--${Q(e, Wj)}`],
	["backgroundImageCss", (e) => tM(e)],
	["imageFitSizeCss", (e) => Q(e, Gj)],
	["progressVariantClass", (e) => `ui-progress--${Q(e, Kj)}`],
	["progressValueText", (e) => WM(e)],
	["searchSelectionModeClass", (e) => `ui-search-mode--${Q(e, qj)}`],
	["textAreaResizeCss", (e) => Q(e, Jj)],
	["flyoutPlacementClass", (e) => `ui-flyout--${Q(e, Yj)}`],
	["popupPlacementAttribute", (e) => Q(e, Yj)],
	["tabMenuEntriesAttribute", (e) => $j(e)],
	["markedDaysAttribute", (e) => eM(e)]
]), Qj = [
	["rename", 1],
	["pin", 2],
	["close", 4],
	["delete", 8]
];
function $j(e) {
	let t = typeof e == "string" ? e.split(",").map((e) => e.trim().toLowerCase()) : null, n = typeof e == "number" ? e : 0, r = Qj.filter(([e, r]) => t === null ? (n & r) !== 0 : t.includes(e)).map(([e]) => e);
	return r.length === 0 ? void 0 : r.join(" ");
}
function eM(e) {
	let t = Array.isArray(e) ? e.filter((e) => typeof e == "string" && e.length > 0).map((e) => e.slice(0, 10)) : [];
	return t.length === 0 ? void 0 : [...new Set(t)].sort().join(" ");
}
function tM(e) {
	let t = String(e ?? "").trim();
	return t.length === 0 ? "" : bu(t);
}
var nM = [
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
], rM = new Map(nM.map(([, e, t, n, r]) => [e, [
	t,
	n,
	r
]])), iM = new Map(nM.map(([e, t]) => [e, t])), aM = /* @__PURE__ */ new Map([[Aj, /* @__PURE__ */ new Map([["Hidden", "clip"]])]]);
function Q(e, t) {
	return typeof e == "string" ? (t === void 0 ? void 0 : aM.get(t)?.get(e)) ?? fj.get(e) ?? Un(e) : typeof e == "number" && t !== void 0 ? t[e] ?? String(e) : String(e ?? "");
}
function oM(e) {
	return e == null || Q(e, zj) === "disabled" ? void 0 : "parent";
}
function sM(e) {
	if (e == null) return "";
	if (typeof e == "number") return GM(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.kind, r = t.value ?? 0;
	return n === "Auto" || n === 0 ? "" : n === "Absolute" || n === 1 ? GM(r) : n === "Fill" || n === 2 ? "100%" : "";
}
function cM(e, t) {
	if (typeof e != "object" || !e) return sM(e);
	let n = e.kind;
	return n !== "Fill" && n !== 2 ? sM(e) : t === "horizontal" ? "var(--ui-fill-width, 100%)" : "var(--ui-fill-height, 100%)";
}
function lM(e) {
	if (e == null) return "";
	if (typeof e == "number") return `${e}px ${e}px ${e}px ${e}px`;
	if (typeof e != "object") return String(e);
	let t = e;
	return `${t.top ?? 0}px ${t.right ?? 0}px ${t.bottom ?? 0}px ${t.left ?? 0}px`;
}
function uM(e, t) {
	if (e == null) return "";
	if (typeof e == "number") return GM(e * 2);
	if (typeof e != "object") return "";
	let n = e;
	return GM(t === "horizontal" ? (n.left ?? 0) + (n.right ?? 0) : (n.top ?? 0) + (n.bottom ?? 0));
}
function dM(e) {
	if (e == null) return "";
	if (typeof e == "number") return e === 0 ? "ui-border--none" : "";
	if (typeof e != "object") return "";
	let t = e;
	return (t.top ?? 0) === 0 && (t.right ?? 0) === 0 && (t.bottom ?? 0) === 0 && (t.left ?? 0) === 0 ? "ui-border--none" : "";
}
function fM(e) {
	if (e == null) return "";
	if (typeof e == "number") return GM(e);
	if (typeof e != "object") return String(e);
	let t = e, n = t.topLeft ?? 0, r = t.topRight ?? 0, i = t.bottomRight ?? 0, a = t.bottomLeft ?? 0;
	return n === r && n === i && n === a ? GM(n) : `${n}px ${r}px ${i}px ${a}px`;
}
function pM(e) {
	if (e == null) return "";
	if (typeof e == "number") return e <= 0 ? "minmax(0, 1fr)" : `minmax(0, ${e}fr)`;
	if (typeof e != "object") return String(e);
	let t = e, n = t.unit, r = t.value ?? 1, i = t.minValue, a = t.maxValue;
	if (n === "Absolute" || n === 1) return GM(r);
	if (n === "Star" || n === 0) {
		let e = i != null && i > 0 ? `${i}px` : "0";
		return r <= 0 ? `minmax(${e}, 1fr)` : `minmax(${e}, ${r}fr)`;
	}
	return n === "Auto" || n === 2 ? i == null ? a == null ? "auto" : `fit-content(${a}px)` : `minmax(${i}px, auto)` : "";
}
function mM(e) {
	if (e == null) return "";
	if (!Array.isArray(e)) return pM(e);
	if (e.length === 0) return "none";
	if (e.length === 1) return pM(e[0]);
	let t = JSON.stringify(e[0]);
	return e.every((e) => JSON.stringify(e) === t) ? `repeat(${e.length}, ${pM(e[0])})` : e.map((e) => pM(e)).join(" ");
}
function $(e, t, n) {
	return hM(V(e, t), n);
}
function hM(e, t) {
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
function gM(e, t) {
	return typeof e != "object" || !e ? null : e[t] ?? null;
}
function _M(e) {
	return e == null ? "" : e === !0 ? "600" : "400";
}
function vM(e) {
	if (e == null) return "";
	switch (Q(e, Ij)) {
		case "left": return "inset 2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "right": return "inset -2px 0 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "top": return "inset 0 2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		case "bottom": return "inset 0 -2px 0 0 var(--ui-selected-mark-color, var(--ui-color-primary))";
		default: return "none";
	}
}
function yM(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	if (RM(e)) return zM(e);
	let t = e, n = zM(t.light), r = zM(t.dark), i = n.length > 0 ? n : r, a = r.length > 0 ? r : n;
	if (i.length > 0 && a.length > 0) return i === a ? i : `light-dark(${i}, ${a})`;
	let o = t.style;
	if (o == null) return "";
	let s = yj.get(Q(o, pj));
	return s ? `var(${s})` : "";
}
function bM(e) {
	if (typeof e != "object" || !e || RM(e)) return !1;
	let t = e;
	return t.light == null && t.dark == null && t.style != null;
}
function xM(e) {
	if (bM(e)) {
		let t = bj.get(Q(e.style, pj));
		if (t !== void 0) return `var(${t})`;
	}
	return yM(e);
}
var SM = /* @__PURE__ */ new Set(["background", "surface"]);
function CM(e) {
	if (typeof e != "object" || !e) return "";
	if (RM(e)) return wM(e) ? "initial" : TM(e);
	let t = e, n = TM(t.light ?? t.dark), r = TM(t.dark ?? t.light);
	if (n.length > 0 && r.length > 0 && wM(t.light ?? t.dark) && wM(t.dark ?? t.light)) return "initial";
	if (n.length > 0 && r.length > 0) return n === r ? n : `light-dark(${n}, ${r})`;
	if (t.style === null || t.style === void 0) return "";
	let i = Q(t.style, pj);
	if (SM.has(i)) return "initial";
	let a = xj.get(i);
	return a ? `var(${a})` : "";
}
function wM(e) {
	return BM(e)?.[3] === 0;
}
function TM(e) {
	let t = BM(e);
	return t === void 0 ? "" : aC(t[0], t[1], t[2], t[3]);
}
function EM(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.light != null || t.dark != null) return "";
	let n = t.style;
	return n == null ? "" : `ui-color--${Q(n, pj)}`;
}
function DM(e) {
	let t = jM(e == null ? "" : String(e).trim(), OM + 1);
	return t > 0 && t <= OM ? "compact" : "";
}
var OM = 2, kM = /[\u0300-\uFFFF]/, AM = new Intl.Segmenter(void 0, { granularity: "grapheme" });
function jM(e, t) {
	if (!kM.test(e)) return e.length;
	let n = 0;
	for (let { segment: r } of AM.segment(e)) {
		if (n >= t) break;
		n += MM(r) ? 2 : 1;
	}
	return n;
}
function MM(e) {
	if (e.includes("️")) return !0;
	let t = e.codePointAt(0) ?? 0;
	for (let e = 0; e < NM.length; e += 2) if (t >= NM[e] && t <= NM[e + 1]) return !0;
	return !1;
}
var NM = [
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
function PM(e, t) {
	let n = String(t), r = e.querySelector(".ui-badge__text");
	r !== null && (r.textContent = n), e.setAttribute(De, DM(n)), e.setAttribute(Oe, "");
}
function FM(e) {
	if (typeof e != "object" || !e) return "";
	let t = e;
	if (t.size != null) return "";
	let n = t.role;
	return n == null ? "" : `ui-text-type--${Q(n, gj)}`;
}
function IM(e, t) {
	if (typeof e != "object" || !e) return "";
	let n = e;
	if (n.size == null) return "";
	switch (t) {
		case "size": return GM(n.size);
		case "weight": {
			let e = n.weight;
			return e == null ? "" : String(e);
		}
		case "lineHeight": {
			let e = n.lineHeight;
			return e == null ? "" : GM(e);
		}
		case "letterSpacing": {
			let e = n.letterSpacing;
			return e == null ? "" : GM(e);
		}
		default: return "";
	}
}
function LM(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return "";
	let t = e, n = VM(t.style);
	if (n !== null) return `@${n}`;
	let r = t.light ?? t.dark;
	if (r == null) return "";
	if (typeof r.rgb == "number") {
		let e = r.opacity ?? 255, t = `#${iC(r.rgb >> 16 & 255)}${iC(r.rgb >> 8 & 255)}${iC(r.rgb & 255)}`;
		return e === 255 ? t : `${t}${iC(e)}`;
	}
	let i = HM(r.name);
	return i === null ? "" : `${i}/${UM(r.adjustment) ?? "None"}/${r.factor ?? 0}/${r.opacity ?? 255}`;
}
function RM(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return t.name !== void 0 || t.rgb !== void 0;
}
function zM(e) {
	if (e == null) return "";
	if (typeof e == "string") return e.trim();
	if (typeof e != "object") return String(e);
	let t = BM(e);
	return t === void 0 ? "" : `#${iC(t[0])}${iC(t[1])}${iC(t[2])}${iC(t[3])}`;
}
function BM(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = typeof t.rgb == "number" ? [
		t.rgb >> 16 & 255,
		t.rgb >> 8 & 255,
		t.rgb & 255
	] : void 0, r = HM(t.name), i = n ?? (r === null ? void 0 : rM.get(r));
	if (!i) return;
	let a = UM(t.adjustment), o = (t.factor ?? 0) / 10, s = t.opacity ?? 255, [c, l, u] = i;
	return a === "Shade" ? (c = H(c * (1 - o)), l = H(l * (1 - o)), u = H(u * (1 - o))) : a === "Tint" && (c = H(c + (255 - c) * o), l = H(l + (255 - l) * o), u = H(u + (255 - u) * o)), [
		c,
		l,
		u,
		s
	];
}
function VM(e) {
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	if (typeof e != "number") return null;
	let t = pj[e];
	return t === void 0 ? null : t.split("-").map((e) => e.charAt(0).toUpperCase() + e.slice(1)).join("");
}
function HM(e) {
	if (typeof e == "number") return iM.get(e) ?? null;
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? null : t;
	}
	return null;
}
function UM(e) {
	if (typeof e == "number") return Xj[e] ?? "None";
	if (typeof e == "string") {
		let t = e.trim();
		return t.length === 0 ? "None" : t;
	}
	return "None";
}
function WM(e) {
	if (e == null || e === "") return "";
	let t = typeof e == "number" ? e : Number(e);
	return Number.isFinite(t) ? String(t) : "";
}
function GM(e) {
	return `${typeof e == "number" ? e : Number(e ?? 0)}px`;
}
function KM(e) {
	return e == null ? "" : GM(e);
}
function qM(e, t) {
	let n = tx(e, t);
	if (n == null) return;
	let r = Q(n, jj);
	return r === "visible" ? void 0 : r;
}
//#endregion
//#region src/interactions/notification-engine.ts
var JM = "ui-notification-host", YM = "ui-notification", XM = "ui-notification--leaving", ZM = "ui-notification__message", QM = "ui-notification__action", $M = "ui-notification__close", eN = 5e3, tN = /* @__PURE__ */ new Set([
	"info",
	"success",
	"warning",
	"danger",
	"primary",
	"accent"
]), nN = class {
	root;
	durationMs;
	host = null;
	focusOrigins = /* @__PURE__ */ new WeakMap();
	constructor(e = {}) {
		this.root = e.root ?? document, this.durationMs = e.durationMs ?? eN, this.ensureHost();
	}
	show(e) {
		let t = mj(e.severity), n = document.createElement("div");
		n.className = tN.has(t) ? `${YM} ${YM}--${t}` : YM, t === "danger" && n.setAttribute("role", "alert");
		let r = document.createElement("span");
		r.className = ZM, typeof e.message == "string" ? r.textContent = e.message : C.writeValue(r, null, e.message), n.append(r);
		let i = document.createElement("button");
		if (i.type = "button", i.className = $M, i.setAttribute("aria-label", C.text("ui.notification.close")), i.addEventListener("click", () => this.dismiss(n)), n.append(i), e.action !== void 0 && n.append(iN(e.action)), this.ensureHost().append(n), n.addEventListener("focusin", (e) => {
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
		if (!(!e.isConnected || e.classList.contains(XM))) {
			if (e.classList.add(XM), this.returnFocus(e), ks() || typeof e.animate != "function") {
				e.remove();
				return;
			}
			window.setTimeout(() => rN(e), Os.fast);
		}
	}
	returnFocus(e) {
		if (!e.contains(document.activeElement)) return;
		let t = [...e.parentElement?.children ?? []].find((t) => t !== e && !t.classList.contains(XM));
		Wo(Vo(this.focusOrigins.get(e), this.root) ?? t?.querySelector(`.${$M}`) ?? null, e);
	}
	ensureHost() {
		if (this.host !== null && this.host.isConnected) return this.host;
		let e = this.root instanceof Document ? this.root.body : this.root, t = e.querySelector(`.${JM}`), n = t ?? document.createElement("div");
		return n.classList.add(JM), n.setAttribute("role", "status"), n.setAttribute("aria-live", "polite"), t === null && e.append(n), this.host = n, n;
	}
};
function rN(e) {
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
		duration: Os.fast,
		easing: Os.exit,
		fill: "forwards"
	}), i = () => e.remove();
	r.finished.then(i, i);
}
function iN(e) {
	let t = document.createElement("button");
	return t.type = "button", t.className = `${QM} ui-button ui-button--primary ui-button--small`, t.textContent = e.label, t.addEventListener("click", () => e.run()), t;
}
//#endregion
//#region src/updates/property-patch-engine.ts
var aN = class {
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
		!this.state.set(e, t, n, sN(i[0]?.component)) && !this.restoring || o || this.notifyValueChanged({
			reference: e,
			propertyName: i[0]?.propertyName ?? this.addressResolver.getPropertyName(e.propertyId) ?? "",
			dynamicParameters: t,
			value: a,
			local: r,
			components: i.map((e) => e.component)
		});
	}
	shownValue(e, t) {
		return ra(t, () => this.addressResolver.isTranslatable(e));
	}
	holdsProperty(e, t) {
		if (!this.isHeld(e)) return !1;
		let n = e.getAttribute(Me), r = n === null ? void 0 : this.addressResolver.getBindingById(Number(n));
		return r === void 0 || r.propertyId === t;
	}
	recordValue(e, t, n) {
		let r = this.addressResolver.resolveProperties(e, t);
		return this.state.set(e, t, n, sN(r[0]?.component)) ? {
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
			(typeof n == "string" || Di(n) ? this.addressResolver.isTranslatable(t.reference) : Ei(n)) && (e === void 0 || e(n)) && this.applyPropertyValue(t.reference, t.dynamicParameters, n, !1);
		}
	}
	rewriteStatic(e, t, n) {
		let r = this.addressResolver.resolvePropertyOn(e, t);
		if (r === null) return;
		let i = this.shownValue(t, n), a = `[${je}${Un(r.propertyName)}]`;
		for (let t of r.definition.operations) {
			let n = this.extensions.converters.convert(t.converter, i);
			for (let o of Kn(e, t, () => oN(e, a))) this.operations.apply({
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
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Me))), r = e.closest(v);
		return n === void 0 || r === null ? !1 : this.applyToComponent(r, {
			componentId: n.componentId,
			propertyId: n.propertyId
		}, t);
	}
	restoreBoundValue(e, t) {
		let n = this.addressResolver.getBindingById(Number(e.getAttribute(Me)));
		if (n === void 0) return;
		let r = {
			componentId: n.componentId,
			propertyId: n.propertyId
		};
		if (!this.state.has(r, t)) {
			ba(e);
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
function oN(e, t) {
	if (e.matches(t)) return [e];
	for (let n of e.querySelectorAll(t)) if (n.closest(v) === e) return [n];
	return [e];
}
function sN(e) {
	let t = [], n = e?.closest("[data-ui-key]") ?? null;
	for (; n !== null;) {
		let e = n.parentElement?.closest(v) ?? null, r = e === null ? 0 : S(e), i = n.getAttribute(h);
		e !== null && r > 0 && i !== null && t.push({
			host: r,
			hostParameters: br(e, yr(e)),
			key: i
		}), n = n.parentElement?.closest("[data-ui-key]") ?? null;
	}
	return t;
}
//#endregion
//#region src/updates/reactive-source-registry.ts
var cN = class {
	watchers = /* @__PURE__ */ new Map();
	sourcesByComponent = /* @__PURE__ */ new Map();
	propertyPatchEngine;
	constructor(e, t) {
		if (this.propertyPatchEngine = e, e.addValueChangeHandler((e) => this.notify(e)), t !== void 0) for (let e of qo) t.root.addEventListener(e, (e) => this.applyEditedValue(e, t.valueReaders), !0);
	}
	watch(e, t) {
		let n = b(e.componentId), r = lN(n, e.propertyId), i = this.watchers.get(r);
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
		let n = Dr(e.target), r = n === null ? void 0 : this.sourcesByComponent.get(n);
		if (r === void 0) return;
		let i = t.readBound(e.target);
		for (let e of r) {
			let t = this.propertyPatchEngine.recordValue(e, [], i);
			t !== null && this.notify(t);
		}
	}
	notify(e) {
		let t = lN(b(e.reference.componentId), e.reference.propertyId), n = this.watchers.get(t);
		if (n !== void 0) for (let t of n) t(e);
	}
};
function lN(e, t) {
	return `${e}:${t}`;
}
//#endregion
//#region src/items/composite-slots.ts
function uN(e) {
	let t = [];
	for (let n of e.children) {
		let e = n.hasAttribute("data-ui-key") ? n.firstElementChild : null, r = e === null ? 0 : S(e);
		e !== null && r > 0 && t.push([e, r]);
	}
	return t;
}
//#endregion
//#region src/items/held-collections.ts
var dN = class {
	collections = /* @__PURE__ */ new Map();
	waiting = /* @__PURE__ */ new WeakMap();
	hold(e, t) {
		this.collections.set(e, fN(t));
	}
	apply(e) {
		let t = b(e.component?.id), n = this.collections.get(t);
		switch (n === void 0 && (n = [], this.collections.set(t, n)), ar(e.action)) {
			case "Insert":
				for (let t of e.items ?? []) pN(n, t);
				break;
			case "Remove":
				for (let t of e.items ?? []) mN(n, t.key);
				break;
			case "Replace":
				for (let t of e.items ?? []) hN(n, t);
				break;
			case "Move":
				for (let t of e.moves ?? []) gN(n, t.key, t.newIndex);
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
function fN(e) {
	let t = [];
	for (let n of e) typeof n.key == "string" && t.push({
		key: n.key,
		item: n.item
	});
	return t;
}
function pN(e, t) {
	typeof t.key == "string" && (mN(e, t.key), e.splice(_N(t.index, e.length), 0, {
		key: t.key,
		item: t.item
	}));
}
function mN(e, t) {
	let n = e.findIndex((e) => e.key === t);
	n >= 0 && e.splice(n, 1);
}
function hN(e, t) {
	if (typeof t.key != "string") return;
	let n = e.findIndex((e) => e.key === (t.oldKey ?? t.key));
	if (n < 0) {
		pN(e, t);
		return;
	}
	e[n] = {
		key: t.key,
		item: t.item
	};
}
function gN(e, t, n) {
	let r = e.findIndex((e) => e.key === t);
	if (r < 0) return;
	let [i] = e.splice(r, 1);
	e.splice(_N(n, e.length), 0, i);
}
function _N(e, t) {
	return typeof e == "number" && e >= 0 && e < t ? e : t;
}
//#endregion
//#region src/updates/collection-sinks.ts
var vN = class {
	handlers = /* @__PURE__ */ new Map();
	register(e) {
		this.handlers.set(e.kind, e.handler);
	}
	dispatch(e, t) {
		let n = this.handlers.get(e);
		return n !== void 0 && (n(t), !0);
	}
};
function yN(e, t, n, r) {
	return {
		action: ar(e.action),
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
var bN = class {
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
	held = new dN();
	constructor(e, t, n, r, i, a, o, s) {
		this.metadata = e, this.propertyPatchEngine = t, this.state = n, this.itemsRenderer = r, this.itemsTemplates = i, this.dom = a, this.virtualization = o, this.sinks = s, r.setRowFiller((e) => this.fillHeldCollections(e));
	}
	fillHeldCollections(e) {
		let t = [];
		for (let n of e.querySelectorAll(`[${g}]`)) {
			let e = Dr(n);
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
			return n === void 0 && (n = DN(e), t.set(e, n)), n;
		};
		for (let e of this.dom.root.querySelectorAll(`[${g}]`)) {
			let t = Or(e);
			if (t !== null) for (let r of this.metadata.getItemValues(t.componentId, t.dynamicParameters)) this.registerItemValue(t.componentId, n(e), r.key, r.item);
		}
		for (let t of e?.updates ?? []) {
			if (sr(t) !== "CollectionChange") continue;
			let e = t;
			if (ar(e.action) !== "Insert") continue;
			let r = b(e.component?.id);
			for (let t of this.findItemsHosts(r, e.component?.dynamicParameters ?? [])) {
				let i = n(t);
				for (let t of e.items ?? []) this.registerItemValue(r, i, t.key, t.item);
			}
		}
	}
	registerItemValue(e, t, n, r) {
		if (n == null) return;
		let i = t.get(n) ?? null;
		if (i !== null && this.readItemScope(i) === void 0 && (this.itemsRenderer.registerItemScope(i, EN(i), r), this.metadata.getItemsTemplateMetadata(e)?.composite != null)) for (let [e, t] of uN(i)) this.itemsRenderer.registerItemScope(e, t, r);
	}
	readItemScope(e) {
		let t = this.itemsRenderer.getItemScope(e);
		if (t !== void 0) return t;
		let n = e.firstElementChild;
		return n === null ? void 0 : this.itemsRenderer.getItemScope(n);
	}
	initializeItemsHosts() {
		for (let e of this.dom.root.querySelectorAll(`[${g}]`)) {
			let t = Dr(e);
			t !== null && this.syncItemsHost(e, t);
		}
	}
	syncItemsHost(e, t) {
		Qw(e, t, {
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
				let r = wN(n, t[e + 1]);
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
		return this.dom.findComponent(e.componentId, e.dynamicParameters)?.hasAttribute(Ie) === !0;
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
		if (Rm(e) === "virtualized") {
			let n = this.virtualization.refill(e, t.items.filter((e) => e.key !== null && e.key !== void 0).map((e) => ({
				key: e.key,
				item: e.item
			})));
			this.state.forgetRows(t.componentId, t.dynamicParameters, n), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
			return;
		}
		let n = this.itemsRenderer.getAncestorStack(e), r = DN(e), i = [], a = [];
		for (let e of t.items) {
			let o = e.key ?? null;
			if (o === null) {
				s("collection insert carried no item key.", e);
				continue;
			}
			let c = r.get(o) ?? null;
			if (r.delete(o), c !== null && ls(this.readItemValue(c), e.item)) {
				i.push(c);
				continue;
			}
			let l = this.renderItemElement(t.componentId, e.item, o, n);
			c !== null && (c.remove(), a.push(o)), l !== null && i.push(l);
		}
		for (let [e, t] of r) t.remove(), a.push(e);
		this.state.forgetRows(t.componentId, t.dynamicParameters, a), TN(e, i), this.syncItemsHost(e, t.componentId), this.dom.invalidate();
	}
	addValidationHandler(e) {
		this.validationHandlers.push(e);
	}
	addFullResyncHandler(e) {
		this.fullResyncHandlers.push(e);
	}
	applyUpdate(e) {
		switch (sr(e)) {
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
		let t = b(e.address?.component?.id), n = or(e.address?.property), r = e.address?.component?.dynamicParameters ?? [];
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
		if (b(e.address?.component?.id) <= 0) {
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
		let t = b(e.component?.id);
		if (t <= 0) {
			s("collection change update has an invalid component address.", e);
			return;
		}
		let n = e.component?.dynamicParameters ?? [], r = this.dom.findComponent(t, n), i = r?.getAttribute("data-ui-collection-sink") ?? null;
		if (r !== null && i !== null) {
			this.sinks.dispatch(i, yN(e, r, t, n)) || s("no collection sink is registered for the kind the component names.", {
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
			a ? l("a collection change for a host inside an item template is held until a row draws it.", { componentId: t }) : (ar(e.action) !== "Reset" || (e.items ?? []).length > 0) && s("items host was not found for a collection change update.", e);
			return;
		}
		for (let n of o) a && this.held.isWaiting(n) || this.applyCollectionChangeToHost(n, t, e);
	}
	applyCollectionChangeToHost(e, t, n) {
		if (Rm(e) === "virtualized") {
			this.applyVirtualizedCollectionChange(e, n), this.syncItemsHost(e, t), this.dom.invalidate();
			return;
		}
		switch (ar(n.action)) {
			case "Insert":
				this.applyCollectionInsert(e, t, n.items ?? []);
				break;
			case "Remove":
				xN(e, n.items ?? []);
				break;
			case "Replace":
				this.applyCollectionReplace(e, t, n.items ?? []);
				break;
			case "Move":
				CN(e, n.moves ?? []);
				break;
			case "Reset":
				e.replaceChildren(), Km(e);
				break;
			default:
				s("collection update action is not supported.", n);
				return;
		}
		this.syncItemsHost(e, t), this.dom.invalidate();
	}
	forgetRowState(e, t, n) {
		switch (ar(n.action)) {
			case "Remove":
			case "Replace":
				this.state.forgetRows(e, t, (n.items ?? []).map((e) => e.oldKey ?? e.key).filter((e) => typeof e == "string"));
				break;
			case "Reset": this.state.forgetHost(e, t);
		}
	}
	applyVirtualizedCollectionChange(e, t) {
		switch (ar(t.action)) {
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
		for (let r of this.dom.findAllComponents(e, t)) for (let t of r.querySelectorAll(`[${g}]`)) if (Dr(t) === e) {
			n.push(t);
			break;
		}
		return n;
	}
	applyCollectionInsert(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = Bm(e, N(e));
		for (let a of n) {
			let n = a.key ?? null;
			if (n === null) {
				s("collection insert carried no item key.", a);
				continue;
			}
			let o = this.renderItemElement(t, a.item, n, r);
			o !== null && e.insertBefore(o, Hm(i, o, a.index ?? null));
		}
	}
	renderItemElement(e, t, n, r) {
		return zO(e, t, n, r, {
			metadata: this.metadata,
			templates: this.itemsTemplates,
			renderer: this.itemsRenderer
		});
	}
	applyCollectionReplace(e, t, n) {
		let r = this.itemsRenderer.getAncestorStack(e), i = N(e), a = Bm(e, i), o = DN(e, i);
		for (let i of n) {
			let n = i.key ?? null;
			if (n === null) {
				s("collection replace carried no item key.", i);
				continue;
			}
			let c = o.get(i.oldKey ?? n) ?? null, l = this.renderItemElement(t, i.item, n, r);
			l !== null && (o.delete(i.oldKey ?? n), o.set(n, l), c === null ? e.insertBefore(l, Hm(a, l, i.index ?? null)) : (Gm(a, c, l), c.replaceWith(l)));
		}
	}
};
function xN(e, t) {
	let n = N(e), r = Bm(e, n), i = DN(e, n), a = SN(e), o = a === null ? [] : n.filter((e) => e instanceof HTMLElement);
	for (let e of t) {
		let t = e.key ?? null, n = t === null ? null : i.get(t) ?? null;
		if (t === null || n === null) {
			s("collection remove did not resolve an item.", e);
			continue;
		}
		let c = a !== null && n instanceof HTMLElement ? mo(a, o, n) : null;
		i.delete(t), Um(r, n), n.remove();
		let l = o.indexOf(n);
		l >= 0 && o.splice(l, 1), c?.();
	}
}
function SN(e) {
	let t = e.parentElement, n = t?.closest(".ui-items-view, .ui-table, .ui-tree") ?? null;
	return n !== null && (n === t || n === t?.parentElement) ? n : t;
}
function CN(e, t) {
	let n = N(e), r = Bm(e, n), i = DN(e, n);
	for (let n of t) {
		let t = n.key === null || n.key === void 0 ? null : i.get(n.key) ?? null;
		if (t === null) {
			s("collection move did not resolve an item.", n);
			continue;
		}
		e.insertBefore(t, Wm(r, t, n.newIndex ?? null));
	}
}
function wN(e, t) {
	if (t === void 0 || sr(e) !== "CollectionChange" || sr(t) !== "CollectionChange") return null;
	let n = e, r = t;
	if (ar(n.action) !== "Reset" || ar(r.action) !== "Insert") return null;
	let i = b(n.component?.id), a = n.component?.dynamicParameters ?? [];
	return i <= 0 || i !== b(r.component?.id) || !ls(a, r.component?.dynamicParameters ?? []) ? null : {
		componentId: i,
		dynamicParameters: a,
		items: r.items ?? []
	};
}
function TN(e, t) {
	let n = null;
	for (let r of t) {
		let t = n === null ? N(e)[0] ?? null : n.nextElementSibling;
		r !== t && e.insertBefore(r, t), n = r;
	}
}
function EN(e) {
	let t = S(e);
	if (t > 0) return t;
	let n = e.firstElementChild;
	return n === null ? 0 : S(n);
}
function DN(e, t = N(e)) {
	let n = /* @__PURE__ */ new Map();
	for (let e of t) {
		let t = e.getAttribute(h);
		t !== null && !n.has(t) && n.set(t, e);
	}
	return n;
}
//#endregion
//#region src/interactions/validation-words.ts
function ON(e) {
	if (typeof e != "object" || !e) return;
	let t = e, n = t.message;
	return Ei(n) || Di(n) || typeof n == "string" && n.length > 0 ? {
		message: n,
		severity: AN(t.severity)
	} : void 0;
}
function kN(e) {
	let t = e.message;
	if (e.content === !0) return String(t ?? "");
	let n = C.resolve(Ei(t) || Di(t) ? t : String(t ?? ""), !0);
	return typeof n == "string" ? n : "";
}
function AN(e) {
	let t = nr(e);
	return t === "Unknown" ? "Error" : t;
}
//#endregion
//#region src/interactions/validation-engine.ts
var jN = "ui-validation--warning", MN = "ui-validation--info", NN = "data-ui-validation-message", PN = "ui-validation-message--marker", FN = "top-end", IN = "--ui-validation-marker-host", LN = "ui-validation-mark", RN = "--ui-validation-presentation", zN = "--ui-validation-color", BN = "Validation", VN = `input:not([type='hidden']), textarea, select, .${Fn}[role='combobox'], [role='spinbutton']`, HN = {
	Error: 0,
	Warning: 1,
	Info: 2
}, UN = {
	Error: Bn,
	Warning: jN,
	Info: MN
}, WN = `.${Bn}, .${jN}, .${MN}`, GN = {
	Error: "danger",
	Warning: "warning",
	Info: "info"
}, KN = {
	Error: `${LN}--error`,
	Warning: `${LN}--warning`,
	Info: `${LN}--info`
}, qN = {
	error: "Error",
	warning: "Warning",
	info: "Info"
}, JN = class {
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
		this.options = e, this.root = e.root ?? document, this.options.propertyPatchEngine.addValueChangeHandler((e) => this.applyValueChange(e)), this.options.updateProcessor?.addValidationHandler((e) => this.applyServerRefusal(e)), this.root.addEventListener("focus", (e) => this.markTouched(e), !0), this.root.addEventListener("blur", (e) => this.applyBlurTrigger(e), !0), this.root.addEventListener("input", (e) => this.applyInputTrigger(e), !0), this.applyRenderedMessages(this.root.querySelectorAll(WN)), j(this.root, WN, { childList: !0 }, (e) => this.applyRenderedMessages(e)), C.onChange(() => {
			this.applyRenderedMessages(this.root.querySelectorAll(WN)), this.rewriteMessageLines();
		});
	}
	applyRenderedMessages(e) {
		for (let t of e) {
			ZN(t, YN(t) === "Error");
			let e = t.querySelector(`:scope > [${NN}]`), n = e?.textContent ?? "";
			e !== null && n.length !== 0 && QN(this.markerMirrors, t, e, {
				message: n,
				severity: YN(t)
			});
		}
	}
	markTouched(e) {
		if (!(e.target instanceof Element)) return;
		let t = this.options.dom.resolveNearestComponent(e.target, () => !0);
		t !== null && this.touchedElements.add(t.element);
	}
	applyValueChange(e) {
		if (e.propertyName === BN) {
			this.applyBoundMessage(e);
			return;
		}
		this.applyChangeTrigger(e);
	}
	applyBoundMessage(e) {
		let t = b(e.reference.componentId), n = ON(e.value);
		for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) n === void 0 ? this.boundMessageByElement.delete(r) : this.boundMessageByElement.set(r, n), this.touchedElements.add(r), this.applyCurrentState(t, r);
	}
	applyChangeTrigger(e) {
		let t = b(e.reference.componentId), n = this.options.metadata.getValidationsForComponent(t).filter((t) => tr(t.trigger) === "Change" && t.target.propertyId === e.reference.propertyId);
		if (n.length !== 0) for (let r of this.options.dom.findAllComponents(t, e.dynamicParameters)) this.evaluateAndApply(t, r, n, e.value);
	}
	applyServerRefusal(e) {
		let t = b(e.address?.component?.id), n = e.address?.component?.dynamicParameters ?? [], r = e.message ?? "", i = Ei(r) || typeof r == "string" && r.length > 0;
		for (let a of this.options.dom.findAllComponents(t, n)) i ? (this.refusalByElement.set(a, {
			message: r,
			severity: AN(e.severity),
			content: e.content === !0
		}), this.touchedElements.add(a)) : this.refusalByElement.delete(a), this.applyCurrentState(t, a);
	}
	isRefused(e) {
		return this.refusalByElement.has(e);
	}
	mark(e, t, n) {
		t === null ? this.packageMarkByElement.delete(e) : this.packageMarkByElement.set(e, {
			message: n ?? null,
			severity: qN[t]
		}), this.applyCurrentState(S(e), e);
	}
	applyCurrentState(e, t) {
		let n = this.resolveDisplay(e, t);
		XN(this.markerMirrors, t, n), this.writeMessageElsewhere(e, t, n);
	}
	writeMessageElsewhere(e, t, n) {
		let r = this.options.metadata.getValidationTarget(e);
		if (r === void 0) return;
		let i = `${b(r.message.componentId)}:${r.message.propertyId}`, a = this.messageLines.get(i);
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
		}, [], [...e.lines.values()].map(kN).join("\n"), !0);
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
			severity: AN(t.severity)
		});
		let s;
		for (let e of n) (s === void 0 || HN[e.severity] < HN[s.severity]) && (s = e);
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
		let r = this.options.metadata.getValidationsForComponent(n.componentId).filter((e) => tr(e.trigger) === t);
		r.length !== 0 && this.evaluateAndApply(n.componentId, n.element, r, this.options.valueReaders.readBound(e.target));
	}
	runSubmitValidation(e) {
		let t = this.root.querySelectorAll(`[${lt}="${Hn(e)}"]`), n = !0;
		for (let e of t) {
			let t = this.options.dom.resolveNearestComponent(e, () => !0);
			if (t === null) continue;
			let r = this.options.metadata.getValidationsForComponent(t.componentId).filter((e) => tr(e.trigger) === "Submit");
			r.length > 0 && (this.touchedElements.add(t.element), this.evaluateAndApply(t.componentId, t.element, r, this.options.valueReaders.readBound(e))), this.hasError(t.componentId, t.element) && (n = !1);
		}
		return n;
	}
	hasError(e, t) {
		if (this.refusalByElement.get(t)?.severity === "Error") return !0;
		let n = this.failingRulesByElement.get(t);
		if (n === void 0) return !1;
		for (let t of this.options.metadata.getValidationsForComponent(e)) if (n.has(t) && AN(t.severity) === "Error") return !0;
		return !1;
	}
	evaluateAndApply(e, t, n, r) {
		let i = this.failingRulesByElement.get(t);
		i === void 0 && (i = /* @__PURE__ */ new Set(), this.failingRulesByElement.set(t, i));
		for (let e of n) _s(r, e.operator, e.value) ? i.delete(e) : i.add(e);
		this.touchedElements.has(t) && this.applyCurrentState(e, t);
	}
};
function YN(e) {
	return e.classList.contains(jN) ? "Warning" : e.classList.contains(MN) ? "Info" : "Error";
}
function XN(e, t, n) {
	for (let e of Object.values(UN)) t.classList.toggle(e, n !== void 0 && UN[n.severity] === e);
	ZN(t, n?.severity === "Error");
	let r = t;
	n === void 0 ? r.style.removeProperty(zN) : r.style.setProperty(zN, `var(--ui-color-${GN[n.severity]})`);
	let i = t.querySelector(`[${NN}]`);
	i !== null && (n?.content === !0 ? (Qi(i, null), i.textContent = String(n.message ?? "")) : C.writeValue(i, null, n?.message ?? null), QN(e, r, i, n));
}
function ZN(e, t) {
	for (let n of e.querySelectorAll(VN)) {
		let r = n.closest(Pn);
		r !== null && e.contains(r) || (t ? n.setAttribute("aria-invalid", "true") : n.removeAttribute("aria-invalid"));
	}
}
function QN(e, t, n, r) {
	let i = getComputedStyle(n), a = r !== void 0 && i.getPropertyValue(RN).trim() === "marker";
	if (n.classList.toggle(PN, a), r !== void 0 && a) {
		n.setAttribute(we, n.textContent ?? ""), n.setAttribute(Te, FN), t.setAttribute(Ee, ""), $N(e, t, r, n.textContent ?? "", i.getPropertyValue(IN).trim()), t.contains(document.activeElement) ? _b(n) : vb(n);
		return;
	}
	n.removeAttribute(we), n.removeAttribute(Te), t.removeAttribute(Ee), $N(e, t, void 0, "", ""), vb(n);
}
function $N(e, t, n, r, i) {
	let a = e.get(t), o = n === void 0 || i.length === 0 ? null : eP(t, i);
	if (n === void 0 || o === null) {
		a?.remove(), e.delete(t);
		return;
	}
	let s = a ?? document.createElement("span");
	s.className = `${LN} ${KN[n.severity]}`, s.textContent = r, s.setAttribute(we, r), s.setAttribute(Te, FN), s.parentElement !== o && o.append(s), e.set(t, s), vb(s);
}
function eP(e, t) {
	for (let n = e.parentElement; n !== null; n = n.parentElement) {
		let e = n.querySelector(`:scope > .${t}`);
		if (e !== null) return e;
	}
	return null;
}
//#endregion
//#region src/items/row-decorators.ts
var tP = class {
	decorators = /* @__PURE__ */ new Map();
	register(e) {
		this.decorators.set(e.kind, e.decorate);
	}
	get(e) {
		return this.decorators.get(e);
	}
}, nP = "tooltip-name";
function rP(e, t, n) {
	let r = Qv(e.getAttribute(we));
	if (Qi(t, n), r.trim().length === 0) {
		t.hasAttribute(n) && t.removeAttribute(n);
		return;
	}
	t.getAttribute(n) !== r && t.setAttribute(n, r);
}
//#endregion
//#region src/updates/dom-operation-registry.ts
var iP = /* @__PURE__ */ new WeakMap(), aP = /* @__PURE__ */ new Map([["iconClass", Tu]]), oP = /* @__PURE__ */ new WeakMap(), sP = class {
	handlers = /* @__PURE__ */ new Map();
	constructor() {
		this.registerDefaults();
	}
	register(e, t) {
		this.handlers.set(rr(e), t);
	}
	apply(e) {
		let t = rr(e.operation.kind), n = this.handlers.get(t);
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
			let t = ua(e.convertedValue);
			e.target.textContent !== t && (e.target.textContent = t), Qi(e.target, null);
		}), this.register("Markup", (e) => {
			ey(e.target, da(e.convertedValue) ? "" : ua(e.convertedValue)), Qi(e.target, null);
		}), this.register("Attribute", (e) => {
			let t = mP(e.operation);
			if (Qi(e.target, t), da(e.value) || da(e.convertedValue)) {
				pP(e.target, t);
				return;
			}
			fP(e.target, t, ua(e.convertedValue));
		}), this.register("RemoveAttribute", (e) => {
			let t = mP(e.operation);
			Qi(e.target, t), pP(e.target, t);
		}), this.register("ToggleAttribute", (e) => {
			let t = mP(e.operation), n = !da(e.value) && cP(e.value, e.operation.condition ?? "HasValue"), r = e.operation.value ?? (da(e.convertedValue) ? "" : ua(e.convertedValue));
			lP(e.target, dP(e), t, n, r);
		}), this.register("Class", (e) => {
			let t = !da(e.value) && cP(e.value, e.operation.condition ?? "None") ? ua(e.convertedValue).trim() : "";
			uP(e.target, dP(e), t, aP.get(e.operation.converter ?? ""));
		}), this.register("ToggleClass", (e) => {
			let t = mP(e.operation), n = !da(e.value) && cP(e.value, e.operation.condition ?? "IsTrue");
			if (e.target.classList.toggle(t, n), e.operation.converter !== null && e.operation.converter !== void 0 && e.operation.converter.trim().length > 0) {
				let t = n ? ua(e.convertedValue).trim() : "";
				uP(e.target, dP(e), t);
			}
		}), this.register("Style", (e) => {
			let t = mP(e.operation), n = e.target;
			if (da(e.value) || da(e.convertedValue) || e.convertedValue === "") {
				n.style.getPropertyValue(t).length > 0 && n.style.removeProperty(t);
				return;
			}
			let r = ua(e.convertedValue);
			n.style.getPropertyValue(t) !== r && n.style.setProperty(t, r);
		}), this.register("Data", () => {}), this.register(nP, (e) => rP(e.resolved.component, e.target, mP(e.operation))), this.register("Property", (e) => {
			let t = mP(e.operation), n = e.target, r = da(e.convertedValue) ? "" : e.convertedValue;
			n[t] !== r && (n[t] = r);
		});
	}
};
function cP(e, t) {
	switch (ir(t)) {
		case "None": return !0;
		case "HasValue": return !da(e);
		case "HasText": return typeof e == "string" ? e.trim().length > 0 : !da(e) && String(e).trim().length > 0;
		case "IsTrue": return e === !0;
		case "IsFalse": return e === !1;
		case "DrawsIcon": return Eu(e).length > 0;
		default: return !da(e);
	}
}
function lP(e, t, n, r, i) {
	let a = oP.get(e);
	a === void 0 && (a = /* @__PURE__ */ new Map(), oP.set(e, a));
	let o = a.get(n);
	if (o === void 0 && (o = /* @__PURE__ */ new Set(), a.set(n, o)), r) {
		o.add(t), fP(e, n, i);
		return;
	}
	o.delete(t), o.size === 0 && pP(e, n);
}
function uP(e, t, n, r) {
	let i = iP.get(e);
	i === void 0 && (i = /* @__PURE__ */ new Map(), iP.set(e, i));
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
function dP(e) {
	return `${e.resolved.componentId}:${e.resolved.propertyId}:${e.operation.kind}:${e.operation.name ?? ""}:${e.operation.converter ?? ""}`;
}
function fP(e, t, n) {
	e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function pP(e, t) {
	e.hasAttribute(t) && e.removeAttribute(t);
}
function mP(e) {
	let t = e.name;
	if (t == null || t.trim().length === 0) throw Error(`Operation '${e.kind}' requires a name.`);
	return t;
}
//#endregion
//#region src/extensions/converters.ts
var hP = class {
	converters = /* @__PURE__ */ new Map();
	constructor() {
		this.register({
			name: "*",
			canConvert: (e) => Zj.has(e.name),
			convert: (e) => Zj.get(e.name)(e.value)
		});
	}
	register(e) {
		let t = gP(e.name), n = {
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
function gP(e) {
	let t = e.trim();
	if (t.length === 0) throw Error("Converter name is required.");
	return t;
}
//#endregion
//#region src/extensions/events.ts
var _P = class {
	definitions = /* @__PURE__ */ new Map();
	register(e) {
		let t = x(e.name);
		if (t.length === 0) throw Error("Event name is required.");
		let n = x(e.domEventName) || t;
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
		return this.definitions.get(x(e));
	}
};
function vP(e, t) {
	e.root.addEventListener("toggle", (n) => {
		n.target instanceof HTMLDetailsElement && n.target.open === t && e.dispatch(n);
	}, !0);
}
function yP(e) {
	e.registerNative("click"), e.registerNative("change"), e.registerNative("focus"), e.registerNative("blur"), e.registerNative("mouse-enter", "mouseenter"), e.registerNative("mouse-leave", "mouseleave"), e.registerNative("toggle"), e.register({
		name: "expand",
		domEventName: "toggle",
		attach: (e) => vP(e, !0)
	}), e.register({
		name: "collapse",
		domEventName: "toggle",
		attach: (e) => vP(e, !1)
	}), e.registerNative("open"), e.registerNative("close"), e.registerNative("search"), e.registerNative("rename"), e.registerNative("unfold"), e.registerNative("move"), e.registerNative("remove");
}
//#endregion
//#region src/extensions/extension-registry.ts
var bP = class {
	converters = new hP();
	events = new _P();
	operations = new sP();
	valueReaders;
	collectionSinks = new vN();
	rowDecorators = new tP();
	constructor(e, t, n, r) {
		yP(this.events), this.valueReaders = new pa(r);
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
}, xP = "Submenu", SP = "ui-menu__submenu", CP = "Select", wP = {
	kind: "menu",
	decorate: TP
};
function TP(e) {
	if (!EP(e.item)) return;
	let t = e.templates.getVariantTemplate(e.componentId, xP);
	if (t === void 0) {
		s("menu submenu template was not found.", { componentId: e.componentId });
		return;
	}
	let n = e.renderer.renderFromTemplate(t, e.item, e.ancestors);
	if (n === null) return;
	e.row.setAttribute(ft, ""), DP(e.item, "Kind") === CP && e.row.setAttribute(pt, ""), DP(e.item, "Expanded") === !0 && e.row.setAttribute(mt, "");
	let r = document.createElement("div");
	r.className = SP, r.appendChild(n), fO(r, e.key, e.item), e.row.appendChild(r);
}
function EP(e) {
	let t = DP(e, "Items");
	return Array.isArray(t) && t.length > 0;
}
function DP(e, t) {
	let n = ym(e, t);
	return n.ok ? n.value : void 0;
}
//#endregion
//#region src/items/row-grip.ts
var OP = {
	kind: "grip",
	decorate: kP
};
function kP(e) {
	e.row.append(AP());
}
function AP() {
	let e = document.createElement("span");
	return e.className = _e, e.setAttribute("role", "button"), C.write(e, "aria-label", "ui.row.drag"), e;
}
//#endregion
//#region src/rendering/page-culture.ts
function jP(e, t, n) {
	let r = t === null ? null : JSON.stringify(t), i = n === null ? null : JSON.stringify(NP(n));
	for (let t of e.querySelectorAll(`[${ze}]`)) MP(t, Re, r), MP(t, Be, i);
}
function MP(e, t, n) {
	n !== null && e.hasAttribute(t) && e.getAttribute(t) !== n && e.setAttribute(t, n);
}
function NP(e) {
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
var PP = 2;
function FP(e, t, n) {
	let r = u() ? performance.now() : -1;
	try {
		t(n);
	} catch (t) {
		c(`the ${e} engine failed to start; the page goes on without it.`, t);
	}
	if (r >= 0) {
		let t = performance.now() - r;
		t >= PP && l(`the ${e} engine took ${f(t)} to start.`);
	}
}
function IP(e) {
	return e.name.length > 0 ? `"${e.name}" package` : "package";
}
//#endregion
//#region src/runtime/web-ui-runtime.ts
var LP = "ne.standard.ui.windowId", RP = [
	500,
	1e3,
	2e3
], zP = 3, BP = [
	["refusal", ({ root: e }) => WD(e)],
	["file input", ({ root: e, validation: t }) => new Bl({
		root: e,
		validation: t
	})],
	["image input", ({ root: e, validation: t, propertyPatchEngine: n }) => new qu({
		root: e,
		validation: t,
		propertyPatchEngine: n
	})],
	["key value action", ({ root: e, dom: t, propertyPatchEngine: n }) => new od({
		root: e,
		dom: t,
		propertyPatchEngine: n
	})],
	["field keys", ({ root: e }) => new xd({ root: e })],
	["field box press", ({ root: e }) => new vd({ root: e })],
	["image fallback", ({ root: e }) => new Ed({ root: e })],
	["radio group sync", ({ root: e }) => new Id({ root: e })],
	["select interaction", ({ root: e }) => new Gf({ root: e })],
	["search input", ({ root: e }) => new of({ root: e })],
	["debounced commit", ({ root: e }) => new ep({ root: e })],
	["text area grow", ({ root: e, propertyPatchEngine: t }) => rp() ? void 0 : new ip({
		root: e,
		propertyPatchEngine: t
	})],
	["items selection", ({ root: e }) => new nT({ root: e })],
	["range value", ({ root: e, propertyPatchEngine: t, dom: n }) => new gp({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["color input", ({ root: e, propertyPatchEngine: t, dom: n }) => new FC({
		root: e,
		propertyPatchEngine: t,
		dom: n
	})],
	["temporal picker", ({ root: e, propertyPatchEngine: t }) => new m_({
		root: e,
		propertyPatchEngine: t
	})],
	["theme switcher", ({ root: e, effects: t, dom: n }) => new V_({
		root: e,
		effects: t,
		dom: n
	})],
	["language switcher", ({ root: e, effects: t, dom: n }) => new $_({
		root: e,
		effects: t,
		dom: n
	})],
	["time segment", ({ root: e, propertyPatchEngine: t }) => new kE({
		root: e,
		propertyPatchEngine: t
	})],
	["timestamp", ({ root: e, propertyPatchEngine: t }) => new XE({
		root: e,
		propertyPatchEngine: t
	})],
	["context menu", ({ root: e }) => new cv({ root: e })],
	["split button", ({ root: e }) => new iS({ root: e })],
	["toggle button", ({ root: e }) => new ud({ root: e })],
	["button group", ({ root: e }) => new uS({ root: e })],
	["menu", ({ root: e }) => new jb({ root: e })],
	["collapsible", ({ root: e }) => new ux({ root: e })],
	["menu group", ({ root: e }) => new Iv({ root: e })],
	["menu search", ({ root: e }) => new Ub({ root: e })],
	["side drawer", ({ root: e }) => new ix({ root: e })],
	["grid splitter", ({ root: e }) => new Ux({ root: e })],
	["accordion", ({ root: e }) => new mS({ root: e })],
	["tabs", ({ root: e }) => new PS({ root: e })],
	["tabs view", ({ root: e, effects: t }) => new oE({
		root: e,
		effects: t
	})],
	["command bar", ({ root: e }) => new US({ root: e })],
	["breadcrumbs", ({ root: e }) => new nC({ root: e })],
	["scroll anchor", ({ root: e }) => new rD({ root: e })],
	["surface press", ({ root: e }) => new dD({ root: e })],
	["scroll group", ({ root: e }) => new TD({ root: e })],
	["flyout interaction", ({ root: e }) => new el({ root: e })],
	["text fold", ({ root: e }) => new bE({ root: e })],
	["tooltip", ({ root: e }) => Ky(e)],
	["press ripple", ({ root: e }) => document.documentElement.hasAttribute("data-ui-press-ripple") ? new FD({ root: e }) : void 0]
], VP = class {
	windowId;
	options;
	root;
	culturesLanguage = document.documentElement.lang;
	metadata = new Jn(rk());
	hydration = sk();
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
	themeColorChanges = 0;
	numberInputs = null;
	constructor(e = {}) {
		this.options = e, this.root = e.root ?? document, this.windowId = GP(e.windowIdStorageKey ?? LP), this.dom = new Er(this.root), C.load(this.root), C.setLanguage(document.documentElement.lang), e.strings !== void 0 && C.register(e.strings), this.gateInbound(this.hydration?.words === null || this.hydration?.words === void 0 ? null : C.loadTableAsync(this.hydration.words.href)), this.extensions = new bP(e.converters, e.eventDefinitions, e.domOperations, e.valueReaders), this.extensions.registerRowDecorator(wP), this.extensions.registerRowDecorator(OP);
		let t = new vr(this.dom, this.metadata), n = this.extensions.operations, r = new mk(), i = new aN(t, n, this.extensions, r);
		this.reactiveSources = new cN(i, {
			root: this.root,
			valueReaders: this.extensions.valueReaders
		}), this.dialogs = new dj({ root: this.root }), this.notifications = new nN({ root: this.root }), this.effects = new ej({
			dialogs: this.dialogs,
			notifications: this.notifications,
			valueReaders: this.extensions.valueReaders,
			reportTheme: (e) => void this.transport.setThemeAsync(e).catch((e) => s("reporting the theme to the session failed.", e))
		});
		let a = new Ss(this.metadata), o, u = new fs(a, i, new gs(), {
			root: this.root,
			effects: this.effects,
			dom: this.dom,
			metadata: this.metadata,
			valueReaders: this.extensions.valueReaders,
			writeBack: (e, t, n) => {
				o?.syncPropertyAsync(b(e.componentId), e.propertyId, t, n).catch((e) => s("writing an interaction's value back failed.", e));
			}
		}), d = new $O(this.dom), f = new cO(this.metadata, d, this.extensions, n, r);
		this.virtualization = new UO({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			dom: this.dom
		}), this.updateProcessor = new bN(this.metadata, i, r, f, d, this.dom, this.virtualization, this.extensions.collectionSinks), C.onChange(() => this.rewriteWords(i, f)), this.rewriteMoments = () => this.rewriteWords(i, f, !0), C.onMomentTick(this.rewriteMoments), new vO({
			root: this.root,
			metadata: this.metadata,
			templates: d,
			renderer: f,
			state: r,
			propertyPatchEngine: i,
			reactiveSources: this.reactiveSources,
			virtualization: this.virtualization
		}), this.transport = new OA(this.windowId, (e, t) => this.applyChanges(e, t), e.signalR), this.dispatcher = new dk(this.transport), C.setAsker((e, t) => this.transport.translateAsync(e, t)), this.effects.register(qn.SetLanguage, (e) => {
			let t = e.effect, n = t.language;
			if (typeof n != "string" || n.trim().length === 0) {
				s("set language effect carries no language.", e.effect);
				return;
			}
			let r = typeof t.href == "string" && t.href.length > 0 ? t.href : null;
			this.switchLanguageAsync(n, r).catch((e) => s("switching the page's language failed.", e));
		}), this.effects.register(qn.SetThemeColors, (e) => {
			let t = e.effect, n = ++this.themeColorChanges;
			if (typeof t.css == "string") {
				tk(document.head, t.css);
				return;
			}
			this.transport.setThemeColorsAsync(t.colors ?? null).then((e) => {
				n === this.themeColorChanges && tk(document.head, e);
			}).catch((e) => s("applying the reader's colours failed.", e));
		});
		let p = new LA(this.transport);
		o = new Qo({
			root: this.root,
			metadata: this.metadata,
			dom: this.dom,
			dispatcher: p,
			valueReaders: this.extensions.valueReaders,
			recordSent: (e, t, n) => i.recordValue(e, t, n)
		}), i.setHeldTargets((e) => o?.isHeld(e) === !0), this.effects.register(qn.DiscardForm, (e) => {
			let t = e.effect.formId;
			if (typeof t == "string" && t.length !== 0) for (let n of o?.releaseForm(t) ?? []) i.restoreBoundValue(n, e.dom.resolveNearestComponent(n, () => !0)?.dynamicParameters ?? []);
		});
		let ee = new JN({
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
			validation: ee
		};
		for (let [e, t] of BP) FP(e, t, this.engineContext);
		FP("number input", ({ root: e, propertyPatchEngine: t }) => {
			this.numberInputs = new im({
				root: e,
				propertyPatchEngine: t
			});
		}, this.engineContext), FP("tree", ({ root: e, effects: t }) => new TT({
			root: e,
			effects: t,
			rules: {
				metadata: this.metadata,
				state: r,
				renderer: f
			}
		}), this.engineContext), FP("items reorder", ({ root: e }) => new th({
			root: e,
			services: {
				metadata: this.metadata,
				state: r,
				keysOf: (e) => this.virtualization.keysOf(e)
			}
		}), this.engineContext), this.eventPipeline = new as({
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
		this.eventPipeline.addEvent(iE.name, iE.registration), this.eventPipeline.addEvent(eh.name, eh.registration), this.tables = new Ew({ root: this.root }), this.windows = new TO({
			root: this.root,
			requestWindow: (e) => this.transport.requestItemWindowAsync(e)
		}), this.pluginContext = {
			...this.engineContext,
			strings: C,
			observeComponents: j,
			observeSize: ew,
			dialogs: this.dialogs,
			store: new wv(),
			numbers: Rp,
			temporal: ui,
			icons: { apply: Cu },
			badges: { writeCount: PM },
			urls: {
				isImageSource: fu,
				asBrowserReads: du
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
			tooltips: gb,
			renames: { open: Sc },
			tables: this.tables,
			rows: sO(d, f, this.virtualization),
			uploads: kl,
			selection: $a,
			popups: oO,
			roving: Oa,
			states: la,
			validation: ee,
			wheel: n_,
			names: Vn
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
		let t = ga(e);
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
		this.dom.invalidate(), C.language !== this.culturesLanguage && (this.culturesLanguage = C.language, na(this.root, (e) => jP(e, C.number, C.temporal)));
		let i = n ? Ai : void 0;
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
		na(this.root, (e) => {
			e !== this.root && r.push(e);
		});
		for (let t of n) {
			let n = b(t.componentId), i = {
				componentId: n,
				propertyId: t.propertyId
			}, a = t.dynamicParameters ?? [];
			for (let r of this.findWordInstances(n, a)) e.rewriteStatic(r, i, t.key);
			for (let o of r) for (let r of o.querySelectorAll(`[${m}="${Hn(n)}"]`)) Sr(r, a) && e.rewriteStatic(r, i, t.key);
		}
	}
	findWordInstances(e, t) {
		if (t.length === 0) return this.dom.findEveryComponent(e);
		let n = this.dom.findAllComponents(e, t);
		return n.length > 0 ? n : this.dom.findAllComponents(e, []).filter((e) => Sr(e, t));
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
				run: () => window.location.reload()
			}
		});
	}
	reloadForView(e) {
		if (XP() === e) {
			c("the page was rendered from another compile of its view, and a reload did not change that; giving up.", { view: e });
			return;
		}
		s("the page was rendered from another compile of its view; reloading.", { view: e }), ZP(e), window.location.reload();
	}
	get instanceId() {
		return this.transport.instanceId;
	}
	async startAsync() {
		ie(this, this.options.handlerGlobalKey), await WP();
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
		return Zi(this.root) || ok(this.hydration) || this.metadata.getWords().some((e) => Ai(e.key)) || Ai(this.metadata.metadata.itemValues);
	}
	startEnginesAwaitingHydration() {
		let e = this.enginesAwaitingHydration ?? [];
		this.enginesAwaitingHydration = null;
		for (let t of e) FP(IP(t), t, this.pluginContext);
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
		FP(IP(e), e, this.pluginContext);
	}
	applyChanges(e, t) {
		if (this.inbound === null && !MA(e)) {
			t?.(), this.applyNow(e);
			return;
		}
		let n = (this.inbound ?? Promise.resolve()).then(() => (t?.(), NA(e))).then((e) => this.applyNow(e)).catch((e) => {
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
			if (e >= zP) {
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
			return n === null ? (this.loseConnection(/* @__PURE__ */ Error("attaching the runtime failed after retrying.")), !1) : n === "reconnecting" ? !1 : n.reload === !0 ? (this.reloadForView(this.hydration?.view ?? ""), !1) : (QP(), this.dom.rebuild(), this.updateProcessor.registerServerRenderedItems(n.initialChanges), await e.previous, await this.applyAttachChangesAsync(n.initialChanges), this.updateProcessor.initializeItemsHosts(), this.windows.start(), d("runtime attached", t, {
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
			this.applyNow(MA(e) ? await NA(e) : e);
		} catch (e) {
			c("a staged value of the attach could not be fetched; the page attaches again.", e), this.reattachRequested = !0;
		}
	}
	async attachWithRetryAsync() {
		let e = qP(), t = {
			clientWindowId: this.windowId,
			route: e?.route ?? window.location.pathname,
			pageId: this.hydration?.pageId ?? null,
			view: this.hydration?.view ?? null,
			parameters: e === null ? JP(window.location.search) : e.parameters,
			timeZone: uk()
		};
		return await lk(() => this.transport.attachAsync(t), () => this.transport.isReconnecting, RP, UP);
	}
};
async function HP(e = {}) {
	let t = performance.now(), n = new VP(e);
	return d("runtime built", t), await n.startAsync(), n;
}
function UP(e) {
	return new Promise((t) => window.setTimeout(t, e));
}
function WP() {
	let e = performance.getEntriesByType("navigation")[0];
	return document.readyState === "complete" || e !== void 0 && e.domContentLoadedEventStart > 0 ? Promise.resolve() : new Promise((e) => document.addEventListener("DOMContentLoaded", () => e(), { once: !0 }));
}
function GP(e) {
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
	let n = KP();
	try {
		t?.setItem(e, n);
	} catch (e) {
		s("storing the tab id failed.", e);
	}
	return n;
}
function KP() {
	return typeof crypto < "u" && typeof crypto.randomUUID == "function" ? crypto.randomUUID() : `tab-${typeof crypto < "u" && typeof crypto.getRandomValues == "function" ? [...crypto.getRandomValues(/* @__PURE__ */ new Uint8Array(16))].map((e) => e.toString(16).padStart(2, "0")).join("") : Math.random().toString(16).slice(2).padEnd(16, "0")}-${performance.now().toString(36).replace(".", "")}`;
}
function qP() {
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
function JP(e) {
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
var YP = "ne-standard-ui:reloaded-view";
function XP() {
	try {
		return sessionStorage.getItem(YP);
	} catch {
		return null;
	}
}
function ZP(e) {
	try {
		sessionStorage.setItem(YP, e);
	} catch {}
}
function QP() {
	try {
		sessionStorage.removeItem(YP);
	} catch {}
}
re(), HP().catch((e) => {
	c("Web client failed to start.", e);
});
//#endregion
