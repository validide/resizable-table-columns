// sources/ts/resizable-constants.ts
var e = {
	dataPropertyName: "validide_rtc_data_object",
	classes: {
		table: "rtc-table",
		wrapper: "rtc-wrapper",
		handleContainer: "rtc-handle-container",
		handle: "rtc-handle",
		tableResizing: "rtc-table-resizing",
		columnResizing: "rtc-column-resizing"
	},
	attributes: {
		dataResizable: "data-rtc-resizable",
		dataResizableTable: "data-rtc-resizable-table"
	},
	data: {
		resizable: "rtcResizable",
		resizableTable: "rtcResizableTable"
	},
	events: {
		pointerDown: ["pointerdown"],
		pointerMove: ["pointermove"],
		pointerUp: ["pointerup", "pointercancel"],
		windowResize: ["resize"],
		eventResizeStart: "eventResizeStart.rtc",
		eventResize: "eventResize.rtc",
		eventResizeStop: "eventResizeStop.rtc"
	}
}, t = class {
	column = 0;
	table = 0;
}, n = class {
	x = null;
	isDoubleClick = !1;
}, r = class {
	column;
	dragHandler;
	pointer = new n();
	originalWidths = new t();
	newWidths = new t();
	constructor(e, t) {
		this.column = e, this.dragHandler = t;
	}
}, i = {
	regexEscapeRegex: /[-[\]/{}()*+?.\\^$|]/g,
	kebabCaseRegex: /(-\w)/g,
	trueRegex: /^true$/i,
	falseRegex: /^false$/i,
	onlyWhiteSpace: /^\s$/,
	notEmptyOrWhiteSpace: /\S/,
	kebabCaseToCamelCase(e) {
		return e.replace(i.kebabCaseRegex, (e) => e.charAt(1).toUpperCase());
	},
	parseStringToType(e) {
		if (e.length === 0 || i.onlyWhiteSpace.test(e)) return e;
		if (i.trueRegex.test(e)) return !0;
		if (i.falseRegex.test(e)) return !1;
		if (i.notEmptyOrWhiteSpace.test(e)) {
			let t = +e;
			if (!Number.isNaN(t)) return t;
		}
		return e;
	}
}, a = { getDataAttributesValues(e) {
	if (!e) return null;
	let t = {};
	if (e.dataset) for (let [n, r] of Object.entries(e.dataset)) t[n] = i.parseStringToType(r ?? "");
	else for (let n of Array.from(e.attributes)) {
		if (!n.name.startsWith("data-")) continue;
		let e = i.kebabCaseToCamelCase(n.name.slice(5));
		t[e] = i.parseStringToType(n.value);
	}
	return t;
} }, o = class {
	resizeFromBody;
	minWidth;
	maxWidth;
	maxInitialWidthHint;
	doubleClickDelay;
	store;
	constructor(e = null, t = null) {
		this.resizeFromBody = !0, this.minWidth = 40, this.maxWidth = null, this.doubleClickDelay = 500, this.maxInitialWidthHint = null, this.store = null, this.overrideValues(e), this.overrideValuesFromElement(t);
	}
	overrideValues(e = null) {
		if (!e) return;
		let t = this;
		for (let [n, r] of Object.entries(e)) Object.hasOwn(this, n) && (t[n] = r);
	}
	overrideValuesFromElement(e = null) {
		e && this.overrideValues(a.getDataAttributesValues(e));
	}
}, s = (t) => t[e.dataPropertyName], c = (t, n) => {
	t[e.dataPropertyName] = n;
}, l = (e, t) => Array.from(e.children).filter((e) => e.nodeName === t), u = (t) => t.hasAttribute(e.attributes.dataResizable), d = class t {
	static instancesCount = 0;
	static windowResizeHandlerRef = null;
	table;
	options;
	id;
	wrapper;
	ownerDocument;
	tableHeaders;
	dragHandlesContainer;
	originalWidths;
	eventData;
	lastPointerDown;
	onPointerDownRef;
	onPointerMoveRef;
	onPointerUpRef;
	constructor(n, r = null) {
		if (typeof n != "object" || !n || Object.prototype.toString.call(n) !== "[object HTMLTableElement]") throw Error("Invalid argument: \"table\".\nResizableTableColumns requires that the table element is a not null HTMLTableElement object!");
		if (s(n) !== void 0) throw Error(`Existing "${e.dataPropertyName}" property.\nTable element already has a '${e.dataPropertyName}' attached object!`);
		this.id = t.getInstanceId(), this.table = n, this.options = new o(r, n), this.wrapper = null, this.ownerDocument = n.ownerDocument, this.tableHeaders = [], this.dragHandlesContainer = null, this.originalWidths = [], this.eventData = null, this.lastPointerDown = 0, this.init(), c(this.table, this);
	}
	init() {
		this.validateMarkup(), this.createHandlerReferences(), this.wrapTable(), this.assignTableHeaders(), this.storeOriginalWidths(), this.setHeaderWidths(), this.createDragHandles(), this.restoreColumnWidths(), this.checkTableWidth(), this.syncHandleWidths(), this.registerWindowResizeHandler();
	}
	dispose() {
		this.detachHandlers(), this.destroyDragHandles(), this.restoreOriginalWidths(), this.unwrapTable(), this.tableHeaders = [], this.originalWidths = [], this.eventData = null, this.onPointerDownRef = null, this.onPointerMoveRef = null, this.onPointerUpRef = null, c(this.table, void 0);
	}
	validateMarkup() {
		let e = l(this.table, "THEAD"), t = e.length, n = l(this.table, "TBODY").length, r = e[0];
		if (r === void 0 || t !== 1) throw Error(`Markup validation: thead count.\nResizableTableColumns requires that the table element has one(1) table head element. Current count: ${t}`);
		if (n !== 1) throw Error(`Markup validation: tbody count.\nResizableTableColumns requires that the table element has one(1) table body element. Current count: ${n}`);
		let i = l(r, "TR"), a = i.length, o = i[0];
		if (o === void 0) throw Error(`Markup validation: thead row count.\nResizableTableColumns requires that the table head element has at least one(1) table row element. Current count: ${a}`);
		let s = l(o, "TH").length, c = l(o, "TD").length;
		if (s < 1) throw Error(`Markup validation: thead first row cells count.\nResizableTableColumns requires that the table head's first row element has at least one(1) table header cell element. Current count: ${s}`);
		if (c !== 0) throw Error(`Markup validation: thead first row invalid.\nResizableTableColumns requires that the table head's first row element has no(0) table cell(TD) elements. Current count: ${c}`);
	}
	wrapTable() {
		this.wrapper || (this.wrapper = this.ownerDocument.createElement("div"), this.wrapper.classList.add(e.classes.wrapper), this.table.before(this.wrapper), this.wrapper.append(this.table), this.table.classList.add(e.classes.table));
	}
	unwrapTable() {
		this.table.classList.remove(e.classes.table), this.wrapper &&= (this.wrapper.replaceWith(this.table), null);
	}
	assignTableHeaders() {
		let e = l(this.table, "THEAD")[0];
		if (!e) return;
		let t = l(e, "TR")[0];
		t && this.tableHeaders.push(...l(t, "TH"));
	}
	storeOriginalWidths() {
		for (let e of this.tableHeaders) this.originalWidths.push({
			el: e,
			detail: e.style.width
		});
		this.originalWidths.push({
			el: this.table,
			detail: this.table.style.width
		});
	}
	restoreOriginalWidths() {
		for (let e of this.originalWidths) e.el.style.width = e.detail;
	}
	setHeaderWidths() {
		for (let e of this.tableHeaders) {
			let t = this.constrainWidth(e, e.offsetWidth);
			typeof this.options.maxInitialWidthHint == "number" && (t = Math.min(t, this.options.maxInitialWidthHint)), this.updateWidth(e, t, !0, !1);
		}
	}
	constrainWidth(e, t) {
		let n = t;
		return n = Math.max(n, this.options.minWidth || -Infinity), n = Math.min(n, this.options.maxWidth || Infinity), n;
	}
	createDragHandles() {
		if (this.dragHandlesContainer != null) throw Error("Drag handlers already created. Call <destroyDragHandles> if you wish to recreate them");
		let t = this.ownerDocument.createElement("div");
		this.dragHandlesContainer = t, this.wrapper?.insertBefore(t, this.table), t.classList.add(e.classes.handleContainer);
		for (let n of this.getResizableHeaders()) {
			let n = this.ownerDocument.createElement("div");
			n.classList.add(e.classes.handle), t.append(n);
		}
		for (let n of e.events.pointerDown) t.addEventListener(n, this.onPointerDownRef, !1);
	}
	destroyDragHandles() {
		let t = this.dragHandlesContainer;
		if (t !== null) {
			for (let n of e.events.pointerDown) t.removeEventListener(n, this.onPointerDownRef, !1);
			t.remove(), this.dragHandlesContainer = null;
		}
	}
	getDragHandlers() {
		return this.dragHandlesContainer == null ? [] : Array.from(this.dragHandlesContainer.querySelectorAll(`.${e.classes.handle}`)).filter((e) => e.nodeName === "DIV");
	}
	restoreColumnWidths() {
		if (!this.options.store) return;
		let e = t.generateTableId(this.table);
		if (e.length === 0) return;
		let n = this.options.store.get(e);
		if (n) {
			for (let e of this.getResizableHeaders()) {
				let r = n.columns[t.generateColumnId(e)];
				r !== void 0 && t.setWidth(e, r);
			}
			n.table !== void 0 && t.setWidth(this.table, n.table);
		}
	}
	checkTableWidth() {
		let e = this.wrapper.clientWidth, n = e - this.table.offsetWidth;
		if (n <= 0) return;
		let r = 0, i = this.tableHeaders.filter(u).map((e) => ({
			el: e,
			detail: e.offsetWidth
		})), a = i.reduce((e, t) => e + t.detail, 0), o = 0, s = null, c = i.shift();
		for (; c;) {
			o = n - r;
			let e = Math.floor(c.detail / a * n);
			e = Math.min(e, o);
			let t = this.updateWidth(c.el, c.detail + e, !1, !0);
			if (r += t - c.detail, s = {
				el: c.el,
				detail: t
			}, r >= n) break;
			c = i.shift();
		}
		if (o = n - r, o > 0) {
			let e = this.tableHeaders.at(-1), t = i[0] ?? s ?? (e ? {
				el: e,
				detail: e.offsetWidth
			} : null);
			t && this.updateWidth(t.el, t.detail + o, !0, !0);
		}
		t.setWidth(this.table, e);
	}
	syncHandleWidths() {
		let e = this.dragHandlesContainer, n = this.table.clientWidth;
		t.setWidth(e, n), e.style.minWidth = `${n}px`;
		let r = this.getResizableHeaders(), i = (this.options.resizeFromBody ? this.table : this.table.tHead).clientHeight, a = t.getOffset(e).left;
		this.getDragHandlers().forEach((e, n) => {
			let o = r[n];
			if (!o) return;
			let s = o.offsetWidth + t.getOffset(o).left - a;
			e.style.left = `${s}px`, e.style.height = `${i}px`;
		});
	}
	getResizableHeaders() {
		return this.tableHeaders.filter(u);
	}
	handlePointerDown(n) {
		this.handlePointerUp();
		let i = n ? n.target : null;
		if (i == null || i.nodeName !== "DIV" || !i.classList.contains(e.classes.handle) || typeof n.button == "number" && n.button !== 0) return;
		let a = i, o = this.getDragHandlers().indexOf(a), s = this.getResizableHeaders()[o];
		if (!s) return;
		let c = Date.now(), l = c - this.lastPointerDown < this.options.doubleClickDelay, u = s.offsetWidth, d = {
			column: u,
			table: this.table.offsetWidth
		}, f = new r(s, a);
		f.pointer = {
			x: t.getPointerX(n),
			isDoubleClick: l
		}, f.originalWidths = d, f.newWidths = d, this.detachHandlers(), this.attachHandlers();
		let p = n.pointerId;
		if (typeof p == "number" && typeof a.setPointerCapture == "function") try {
			a.setPointerCapture(p);
		} catch {}
		this.table.classList.add(e.classes.tableResizing), this.wrapper?.classList.add(e.classes.tableResizing), a.classList.add(e.classes.columnResizing), s.classList.add(e.classes.columnResizing), this.lastPointerDown = c, this.eventData = f, this.dispatchResizeEvent(e.events.eventResizeStart, s, u, this.table.clientWidth), n.preventDefault();
	}
	handlePointerMove(e) {
		if (!this.eventData || !e) return;
		let n = (t.getPointerX(e) || 0) - (this.eventData.pointer.x || 0);
		n !== 0 && this.applyColumnDelta(n);
	}
	handlePointerUp() {
		if (this.detachHandlers(), !this.eventData) return;
		this.eventData.pointer.isDoubleClick && this.handleDoubleClick(), this.table.classList.remove(e.classes.tableResizing), this.wrapper?.classList.remove(e.classes.tableResizing), this.eventData.dragHandler.classList.remove(e.classes.columnResizing), this.eventData.column.classList.remove(e.classes.columnResizing), this.checkTableWidth(), this.syncHandleWidths(), this.refreshWrapperStyle(), this.saveColumnWidths();
		let t = this.eventData.newWidths || this.eventData.originalWidths;
		this.dispatchResizeEvent(e.events.eventResizeStop, this.eventData.column, t.column, t.table), this.eventData = null;
	}
	handleDoubleClick() {
		if (!this.eventData?.column) return;
		let e = this.eventData.column, n = this.tableHeaders.indexOf(e), r = 0, i = [];
		this.tableHeaders.forEach((e, t) => {
			u(e) || i.push(t);
		});
		let a = this.ownerDocument.createElement("span");
		Object.assign(a.style, {
			position: "absolute",
			left: "-99999px",
			top: "-99999px",
			visibility: "hidden"
		}), this.ownerDocument.body.append(a);
		for (let e of Array.from(this.table.querySelectorAll("tr"))) {
			let o = Array.from(e.querySelectorAll("td, th")), s = 0;
			for (let [e, c] of o.entries()) {
				let o = Number.parseInt(c.getAttribute("colspan") ?? "1", 10), l = Number.isNaN(o) ? 1 : o;
				if (!i.includes(e) && l === 1 && s === n) {
					r = Math.max(r, t.getTextWidth(c, a));
					break;
				}
				s += l;
			}
		}
		a.remove();
		let o = r - e.offsetWidth;
		o !== 0 && (this.applyColumnDelta(o), this.checkTableWidth(), this.syncHandleWidths(), this.saveColumnWidths());
	}
	attachHandlers() {
		for (let t of e.events.pointerMove) this.ownerDocument.addEventListener(t, this.onPointerMoveRef, !1);
		for (let t of e.events.pointerUp) this.ownerDocument.addEventListener(t, this.onPointerUpRef, !1);
	}
	detachHandlers() {
		for (let t of e.events.pointerMove) this.ownerDocument.removeEventListener(t, this.onPointerMoveRef, !1);
		for (let t of e.events.pointerUp) this.ownerDocument.removeEventListener(t, this.onPointerUpRef, !1);
	}
	refreshWrapperStyle() {
		if (this.wrapper == null) return;
		let e = this.wrapper.style.overflowX;
		this.wrapper.style.overflowX = "hidden", this.wrapper.style.overflowX = e;
	}
	saveColumnWidths() {
		if (!this.options.store) return;
		let e = t.generateTableId(this.table);
		if (e.length === 0) return;
		let n = {
			table: this.table.offsetWidth,
			columns: {}
		};
		for (let e of this.getResizableHeaders()) n.columns[t.generateColumnId(e)] = e.offsetWidth;
		this.options.store.set(e, n);
	}
	createHandlerReferences() {
		this.onPointerDownRef ??= t.debounce((e) => this.handlePointerDown(e), 100, !0), this.onPointerMoveRef ??= t.debounce((e) => this.handlePointerMove(e), 5, !1), this.onPointerUpRef ??= t.debounce(() => this.handlePointerUp(), 100, !0);
	}
	registerWindowResizeHandler() {
		if (t.windowResizeHandlerRef) return;
		let n = this.ownerDocument.defaultView, r = t.debounce(t.onWindowResize, 50, !1);
		t.windowResizeHandlerRef = r;
		for (let t of e.events.windowResize) n?.addEventListener(t, r, !1);
	}
	handleWindowResize() {
		this.checkTableWidth(), this.syncHandleWidths(), this.saveColumnWidths();
	}
	updateWidth(e, n, r, i) {
		let a = e.offsetWidth, o = r ? n : this.constrainWidth(e, n);
		if (t.setWidth(e, o), !i) {
			let e = o - a;
			t.setWidth(this.table, this.table.offsetWidth + e);
		}
		return o;
	}
	applyColumnDelta(n) {
		let r = this.eventData;
		if (!r) return;
		let i = this.constrainWidth(r.column, r.originalWidths.column + n), a = r.originalWidths.table + (i - r.originalWidths.column);
		t.setWidth(this.table, a), t.setWidth(r.column, i), r.newWidths = {
			column: i,
			table: a
		}, this.dispatchResizeEvent(e.events.eventResize, r.column, i, a);
	}
	dispatchResizeEvent(e, t, n, r) {
		this.table.dispatchEvent(new CustomEvent(e, { detail: {
			column: t,
			columnWidth: n,
			table: this.table,
			tableWidth: r
		} }));
	}
	static onWindowResize(t) {
		let n = t ? t.target : null;
		if (n != null) for (let t of Array.from(n.document.querySelectorAll(`.${e.classes.table}`))) {
			let e = s(t);
			typeof e == "object" && e && e.handleWindowResize();
		}
	}
	static generateColumnId(t) {
		return (t.getAttribute(e.attributes.dataResizable) ?? "").trim().replaceAll(".", "_");
	}
	static generateTableId(t) {
		let n = (t.getAttribute(e.attributes.dataResizableTable) ?? "").trim().replaceAll(".", "_");
		return n.length ? `rtc/${n}` : n;
	}
	static setWidth(e, t) {
		let n = t > 0 ? t.toFixed(2) : "0";
		e.style.width = `${n}px`;
	}
	static getInstanceId() {
		return t.instancesCount++;
	}
	static debounce = (e, t, n) => {
		let r = null;
		return (i) => {
			let a = n && !r;
			r && clearTimeout(r), r = setTimeout(() => {
				r = null, n || e(i);
			}, t), a && e(i);
		};
	};
	static getPointerX(e) {
		if (e.type.startsWith("touch")) {
			let t = e, n = t.touches?.[0] ?? t.changedTouches?.[0];
			if (n) return n.pageX;
		}
		return e.pageX;
	}
	static getTextWidth(e, t) {
		if (!e || !t) return 0;
		let n = `${(e.textContent ?? "").trim().replace(/\s/g, "\xA0")} `, r = e.ownerDocument.defaultView?.getComputedStyle(e);
		if (r) for (let e of [
			"fontFamily",
			"fontSize",
			"fontWeight",
			"padding",
			"border",
			"boxSizing"
		]) t.style[e] = r[e];
		return t.textContent = n, t.offsetWidth;
	}
	static getOffset(e) {
		if (!e) return {
			top: 0,
			left: 0
		};
		let t = e.getBoundingClientRect(), n = e.ownerDocument.defaultView;
		return {
			top: t.top + (n?.scrollY ?? 0),
			left: t.left + (n?.scrollX ?? 0)
		};
	}
};
export { n as PointerData, e as ResizableConstants, r as ResizableEventData, o as ResizableOptions, d as ResizableTableColumns, i as Utilities, a as UtilitiesDOM, t as WidthsData };

//# sourceMappingURL=index.js.map