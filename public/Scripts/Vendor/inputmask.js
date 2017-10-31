﻿!function (a, b) { "use strict"; var c; c = "object" == typeof exports && "undefined" != typeof module ? module.exports = b(require("angular"), require("moment")) : "function" == typeof define && define.amd ? define(["angular", "moment"], b) : b(a.angular, a.moment) } (this, function (a, b) { var c = a.module("datePicker", []); c.constant("datePickerConfig", { template: "templates/datepicker.html", view: "month", views: ["year", "month", "date", "hours", "minutes"], momentNames: { year: "year", month: "month", date: "day", hours: "hours", minutes: "minutes" }, viewConfig: { year: ["years", "isSameYear"], month: ["months", "isSameMonth"], hours: ["hours", "isSameHour"], minutes: ["minutes", "isSameMinutes"] }, step: 5 }), c.filter("mFormat", function () { return function (a, c, d) { return b.isMoment(a) ? d ? b.tz(a, d).format(c) : a.format(c) : b(a).format(c) } }), c.directive("datePicker", ["datePickerConfig", "datePickerUtils", function (c, d) { return { require: "?ngModel", template: '<div ng-include="template"></div>', scope: { model: "=datePicker", after: "=?", before: "=?" }, link: function (e, f, g, h) { function i() { e.views = c.views.concat(), e.view = g.view || c.view, e.views = e.views.slice(e.views.indexOf(g.maxView || "year"), e.views.indexOf(g.minView || "minutes") + 1), (1 === e.views.length || -1 === e.views.indexOf(e.view)) && (e.view = e.views[0]) } function j(a) { return d.getDate(e, g, a) } function k() { var a = e.view; d.setParams(t, E), e.model && !s && (e.date = u(e.model), s = !1); var b = e.date; switch (a) { case "year": e.years = d.getVisibleYears(b); break; case "month": e.months = d.getVisibleMonths(b); break; case "date": e.weekdays = e.weekdays || d.getDaysOfWeek(), e.weeks = d.getVisibleWeeks(b); break; case "hours": e.hours = d.getVisibleHours(b); break; case "minutes": e.minutes = d.getVisibleMinutes(b, w) } n() } function l() { return "date" !== e.view ? e.view : e.date ? e.date.month() : null } var m, n, o, p, q, r, s = !1, t = e.tz = g.timezone, u = d.createMoment, v = d.eventIsForPicker, w = parseInt(g.step || c.step, 10), x = !!g.partial, y = j("minDate"), z = j("maxDate"), A = f[0].id, B = e.now = u(), C = e.date = u(e.model || B), D = "true" === g.autoClose, E = g.firstDay && g.firstDay >= 0 && g.firstDay <= 6 ? parseInt(g.firstDay, 10) : b().weekday(0).day(); d.setParams(t, E), e.model || C.minute(Math.ceil(C.minute() / w) * w).second(0), e.template = g.template || c.template, e.watchDirectChanges = void 0 !== g.watchDirectChanges, e.callbackOnSetDate = g.dateChange ? d.findFunction(e, g.dateChange) : void 0, i(), e.setView = function (a) { -1 !== e.views.indexOf(a) && (e.view = a) }, e.selectDate = function (a) { if (g.disabled) return !1; if (o(e.date, a) && (a = e.date), a = p(a), !a) return !1; e.date = a; var b = e.views[e.views.indexOf(e.view) + 1]; (!b || x || e.model) && m(a), b ? e.setView(b) : D ? (f.addClass("hidden"), e.$emit("hidePicker")) : n() }, m = function (a) { a && (e.model = a, h && h.$setViewValue(a)), e.$emit("setDate", e.model, e.view), e.callbackOnSetDate && e.callbackOnSetDate(g.datePicker, e.date) }, e.$watch(l, k), e.watchDirectChanges && e.$watch("model", function () { s = !1, k() }), n = function () { var a, b, f = e.view, g = e.date, h = [], i = ""; if (d.setParams(t, E), "date" === f) { var j, k = e.weeks; for (a = 0; a < k.length; a++) for (j = k[a], h.push([]), b = 0; b < j.length; b++) i = "", d.isSameDay(g, j[b]) && (i += "active"), q(j[b], f) && (i += " now"), j[b].month() === g.month() && r(j[b]) || (i += " disabled"), h[a].push(i) } else { var l = c.viewConfig[f], m = e[l[0]], n = l[1]; for (a = 0; a < m.length; a++) i = "", d[n](g, m[a]) && (i += "active"), q(m[a], f) && (i += " now"), r(m[a]) || (i += " disabled"), h.push(i) } e.classes = h }, e.next = function (a) { var c = b(e.date); switch (a = a || 1, e.view) { case "year": case "month": c.year(c.year() + a); break; case "date": c.month(c.month() + a); break; case "hours": case "minutes": c.hours(c.hours() + a) } c = p(c), c && (e.date = c, m(c), s = !0, k()) }, r = function (a) { var b = !0; return y && y.isAfter(a) && (b = o(y, a)), z && z.isBefore(a) && (b &= o(z, a)), b }, o = function (a, b) { return a.isSame(b, c.momentNames[e.view]) ? !0 : !1 }, p = function (a) { return y && y.isAfter(a) ? y : z && z.isBefore(a) ? z : a }, q = function (a, b) { var c = !0; switch (b) { case "minutes": c &= ~ ~(B.minutes() / w) === ~ ~(a.minutes() / w); case "hours": c &= B.hours() === a.hours(); case "date": c &= B.date() === a.date(); case "month": c &= B.month() === a.month(); case "year": c &= B.year() === a.year() } return c }, e.prev = function (a) { return e.next(-a || -1) }, A && e.$on("pickerUpdate", function (b, c, d) { if (v(c, A)) { var e = !1, f = !1; a.isDefined(d.minDate) && (y = d.minDate ? d.minDate : !1, f = !0), a.isDefined(d.maxDate) && (z = d.maxDate ? d.maxDate : !1, f = !0), a.isDefined(d.minView) && (g.minView = d.minView, e = !0), a.isDefined(d.maxView) && (g.maxView = d.maxView, e = !0), g.view = d.view || g.view, e && i(), f && k() } }) } } } ]), a.module("datePicker").factory("datePickerUtils", function () { var c, d, e = function (a, d, e, f, g) { var h = Date.UTC(0 | a, 0 | d, 0 | e, 0 | f, 0 | g); return c ? b.tz(h, c) : b(h) }; return { getVisibleMinutes: function (a, b) { var c, d, f = a.year(), g = a.month(), h = a.date(), i = a.hours(), j = a.utcOffset() / 60, k = []; for (d = 0; 60 > d; d += b) c = e(f, g, h, i - j, d), k.push(c); return k }, getVisibleWeeks: function (a) { a = b(a); var c = a.year(), e = a.month(); a.date(1); var f = a.day(); a.date(d - (f + (d >= f ? 6 : -1))); for (var g = []; g.length < 6 && !(a.year() === c && a.month() > e); ) g.push(this.getDaysOfWeek(a)), a.add(7, "d"); return g }, getVisibleYears: function (a) { var c = b(a), d = c.year(); c.year(d - d % 10), d = c.year(); for (var f, g, h = c.utcOffset() / 60, i = [], j = 0; 12 > j; j++) f = e(d, 0, 1, 0 - h), g = f.utcOffset() / 60, g !== h && (f = e(d, 0, 1, 0 - g), h = g), i.push(f), d++; return i }, getDaysOfWeek: function (a) { a = a ? a : c ? b.tz(c).day(d) : b().day(d); for (var f, g, h = a.year(), i = a.month(), j = a.date(), k = [], l = a.utcOffset() / 60, m = 0; 7 > m; m++) f = e(h, i, j, 0 - l, 0, !1), g = f.utcOffset() / 60, g !== l && (f = e(h, i, j, 0 - g, 0, !1)), k.push(f), j++; return k }, getVisibleMonths: function (a) { for (var b, c, d = a.year(), f = a.utcOffset() / 60, g = [], h = 0; 12 > h; h++) b = e(d, h, 1, 0 - f, 0, !1), c = b.utcOffset() / 60, c !== f && (b = e(d, h, 1, 0 - c, 0, !1)), g.push(b); return g }, getVisibleHours: function (a) { var b, c, d, f = a.year(), g = a.month(), h = a.date(), i = [], j = a.utcOffset() / 60; for (b = 0; 24 > b; b++) c = e(f, g, h, b - j, 0, !1), d = c.utcOffset() / 60, d !== j && (c = e(f, g, h, b - d, 0, !1)), i.push(c); return i }, isAfter: function (a, b) { return a && a.unix() >= b.unix() }, isBefore: function (a, b) { return a.unix() <= b.unix() }, isSameYear: function (a, b) { return a && a.year() === b.year() }, isSameMonth: function (a, b) { return this.isSameYear(a, b) && a.month() === b.month() }, isSameDay: function (a, b) { return this.isSameMonth(a, b) && a.date() === b.date() }, isSameHour: function (a, b) { return this.isSameDay(a, b) && a.hours() === b.hours() }, isSameMinutes: function (a, b) { return this.isSameHour(a, b) && a.minutes() === b.minutes() }, setParams: function (a, b) { c = a, d = b }, scopeSearch: function (a, b, c) { var d, e, f = a, g = b.split("."), h = g.length; do { for (d = f = f.$parent, e = 0; h > e; e++) { d = d[g[e]] } if (d && c(d)) return d } while (f.$parent); return !1 }, findFunction: function (b, c) { return this.scopeSearch(b, c, function (b) { return a.isFunction(b) }) }, findParam: function (a, b) { return this.scopeSearch(a, b, function () { return !0 }) }, createMoment: function (a) { return c ? b.tz(a, c) : b.isMoment(a) ? b.unix(a.unix()) : b(a) }, getDate: function (a, b, c) { var d = !1; return b[c] && (d = this.createMoment(b[c]), d.isValid() || (d = this.findParam(a, b[c]), d && (d = this.createMoment(d)))), d }, eventIsForPicker: function (b, c) { return a.isArray(b) && b.indexOf(c) > -1 || b === c } } }); var c = a.module("datePicker"); c.directive("dateRange", ["$compile", "datePickerUtils", "dateTimeConfig", function (c, d, e) { function f(c, d, f, g, h) { return e.template(a.extend(c, { ngModel: f, minDate: g && b.isMoment(g) ? g.format() : !1, maxDate: h && b.isMoment(h) ? h.format() : !1 }), d) } function g() { return "picker" + Math.random().toString().substr(2) } return { scope: { start: "=", end: "=" }, link: function (b, e, h) { function i(a) { b.$broadcast("pickerUpdate", m[0], { maxDate: a }) } function j(a) { b.$broadcast("pickerUpdate", m[1], { minDate: a }) } var k = null, l = e[0].id, m = [g(), g()], n = d.createMoment, o = d.eventIsForPicker; b.dateChange = function (a, b) { k && k(a, b) }, l && b.$on("pickerUpdate", function (a, c, d) { o(c, l) && b.$broadcast("pickerUpdate", m, d) }), d.setParams(h.timezone), b.start = n(b.start), b.end = n(b.end), b.$watchGroup(["start", "end"], function (a) { j(a[0]), i(a[1]) }), a.isDefined(h.dateChange) && (k = d.findFunction(b, h.dateChange)), h.onSetDate = "dateChange"; var p = '<div><table class="date-range"><tr><td valign="top">' + f(h, m[0], "start", !1, b.end) + '</td><td valign="top">' + f(h, m[1], "end", b.start, !1) + "</td></tr></table></div>", q = c(p)(b); e.append(q) } } } ]); var d = "ng-pristine", e = "ng-dirty", c = a.module("datePicker"); c.constant("dateTimeConfig", { template: function (a, b) { return "<div " + (b ? 'id="' + b + '" ' : "") + 'date-picker="' + a.ngModel + '" ' + (a.view ? 'view="' + a.view + '" ' : "") + (a.maxView ? 'max-view="' + a.maxView + '" ' : "") + (a.maxDate ? 'max-date="' + a.maxDate + '" ' : "") + (a.autoClose ? 'auto-close="' + a.autoClose + '" ' : "") + (a.template ? 'template="' + a.template + '" ' : "") + (a.minView ? 'min-view="' + a.minView + '" ' : "") + (a.minDate ? 'min-date="' + a.minDate + '" ' : "") + (a.partial ? 'partial="' + a.partial + '" ' : "") + (a.step ? 'step="' + a.step + '" ' : "") + (a.onSetDate ? 'date-change="' + a.onSetDate + '" ' : "") + (a.ngModel ? 'ng-model="' + a.ngModel + '" ' : "") + (a.firstDay ? 'first-day="' + a.firstDay + '" ' : "") + (a.timezone ? 'timezone="' + a.timezone + '" ' : "") + 'class="date-picker-date-time"></div>' }, format: "YYYY-MM-DD HH:mm", views: ["date", "year", "month", "hours", "minutes"], autoClose: !1, position: "relative" }), c.directive("dateTimeAppend", function () { return { link: function (a, b) { b.bind("click", function () { b.find("input")[0].focus() }) } } }), c.directive("dateTime", ["$compile", "$document", "$filter", "dateTimeConfig", "$parse", "datePickerUtils", function (c, f, g, h, i, j) { var k = f.find("body"), l = g("mFormat"); return { require: "ngModel", scope: !0, link: function (f, g, m, n) { function o(a) { return l(a, x, L) } function p(a) { return a.length === x.length ? a : void 0 } function q(a) { H = a, m.minDate = a ? a.format() : a, I = b.isMoment(a) } function r(a) { J = a, m.maxDate = a ? a.format() : a, K = b.isMoment(a) } function s() { w = h.template(m) } function t(a) { a.stopPropagation(), n.$pristine && (n.$dirty = !0, n.$pristine = !1, g.removeClass(d).addClass(e), y && y.$setDirty(), n.$render()) } function u() { D && (D.remove(), D = null), G && (G.remove(), G = null) } function v() { if (!D) { if (D = c(w)(f), f.$digest(), O || (f.$on("setDate", function (a, b, c) { t(a), N && N(m.ngModel, b), C && z[z.length - 1] === c && u() }), f.$on("hidePicker", function () { g.triggerHandler("blur") }), f.$on("$destroy", u), O = !0), "absolute" === F) { var b = g[0].getBoundingClientRect(), d = b.height || g[0].offsetHeight; D.css({ top: b.top + d + "px", left: b.left + "px", display: "block", position: F }), k.append(D) } else G = a.element("<div date-picker-wrapper></div>"), g[0].parentElement.insertBefore(G[0], g[0]), G.append(D), D.css({ top: g[0].offsetHeight + "px", display: "block" }); D.bind("mousedown", function (a) { a.preventDefault() }) } } var w, x = m.format || h.format, y = g.inheritedData("$formController"), z = i(m.views)(f) || h.views.concat(), A = m.view || z[0], B = z.indexOf(A), C = m.autoClose ? i(m.autoClose)(f) : h.autoClose, D = null, E = g[0].id, F = m.position || h.position, G = null, H = null, I = null, J = null, K = null, L = m.timezone || !1, M = j.eventIsForPicker, N = null, O = !1; -1 === B && z.splice(B, 1), z.unshift(A), n.$formatters.push(o), n.$parsers.unshift(p), a.isDefined(m.minDate) && (q(j.findParam(f, m.minDate)), n.$validators.min = function (a) { return I ? b.isMoment(a) && (H.isSame(a) || H.isBefore(a)) : !0 }), a.isDefined(m.maxDate) && (r(j.findParam(f, m.maxDate)), n.$validators.max = function (a) { return K ? b.isMoment(a) && (J.isSame(a) || J.isAfter(a)) : !0 }), a.isDefined(m.dateChange) && (N = j.findFunction(f, m.dateChange)), E && f.$on("pickerUpdate", function (b, c, d) { if (M(c, E)) if (D); else { var e = !1; a.isDefined(d.minDate) && (q(d.minDate), e = !0), a.isDefined(d.maxDate) && (r(d.maxDate), e = !0), a.isDefined(d.minView) && (m.minView = d.minView), a.isDefined(d.maxView) && (m.maxView = d.maxView), m.view = d.view || m.view, e && n.$validate(), a.isDefined(d.format) && (x = m.format = d.format || h.format, n.$modelValue = -1), s() } }), g.bind("focus", v), g.bind("blur", u), s() } } } ]), a.module("datePicker").run(["$templateCache", function (a) { a.put("templates/datepicker.html", '<div ng-switch="view">\r\n  <div ng-switch-when="date">\r\n    <table>\r\n      <thead>\r\n      <tr>\r\n        <th ng-click="prev()">&lsaquo;</th>\r\n        <th colspan="5" class="switch" ng-click="setView(\'month\')" ng-bind="date|mFormat:\'YYYY MMMM\':tz"></th>\r\n        <th ng-click="next()">&rsaquo;</i></th>\r\n      </tr>\r\n      <tr>\r\n        <th ng-repeat="day in weekdays" style="overflow: hidden" ng-bind="day|mFormat:\'ddd\':tz"></th>\r\n      </tr>\r\n      </thead>\r\n      <tbody>\r\n      <tr ng-repeat="week in weeks" ng-init="$index2 = $index">\r\n        <td ng-repeat="day in week">\r\n          <span\r\n            ng-class="classes[$index2][$index]"\r\n            ng-click="selectDate(day)" ng-bind="day|mFormat:\'DD\':tz"></span>\r\n        </td>\r\n      </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div ng-switch-when="year">\r\n    <table>\r\n      <thead>\r\n      <tr>\r\n        <th ng-click="prev(10)">&lsaquo;</th>\r\n        <th colspan="5" class="switch"ng-bind="years[0].year()+\' - \'+years[years.length-1].year()"></th>\r\n        <th ng-click="next(10)">&rsaquo;</i></th>\r\n      </tr>\r\n      </thead>\r\n      <tbody>\r\n      <tr>\r\n        <td colspan="7">\r\n          <span ng-class="classes[$index]"\r\n                ng-repeat="year in years"\r\n                ng-click="selectDate(year)" ng-bind="year.year()"></span>\r\n        </td>\r\n      </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div ng-switch-when="month">\r\n    <table>\r\n      <thead>\r\n      <tr>\r\n        <th ng-click="prev()">&lsaquo;</th>\r\n        <th colspan="5" class="switch" ng-click="setView(\'year\')" ng-bind="date|mFormat:\'YYYY\':tz"></th>\r\n        <th ng-click="next()">&rsaquo;</i></th>\r\n      </tr>\r\n      </thead>\r\n      <tbody>\r\n      <tr>\r\n        <td colspan="7">\r\n          <span ng-repeat="month in months"\r\n                ng-class="classes[$index]"\r\n                ng-click="selectDate(month)"\r\n                ng-bind="month|mFormat:\'MMM\':tz"></span>\r\n        </td>\r\n      </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div ng-switch-when="hours">\r\n    <table>\r\n      <thead>\r\n      <tr>\r\n        <th ng-click="prev(24)">&lsaquo;</th>\r\n        <th colspan="5" class="switch" ng-click="setView(\'date\')" ng-bind="date|mFormat:\'DD MMMM YYYY\':tz"></th>\r\n        <th ng-click="next(24)">&rsaquo;</i></th>\r\n      </tr>\r\n      </thead>\r\n      <tbody>\r\n      <tr>\r\n        <td colspan="7">\r\n          <span ng-repeat="hour in hours"\r\n                ng-class="classes[$index]"\r\n                ng-click="selectDate(hour)" ng-bind="hour|mFormat:\'HH:mm\':tz"></span>\r\n        </td>\r\n      </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n  <div ng-switch-when="minutes">\r\n    <table>\r\n      <thead>\r\n      <tr>\r\n        <th ng-click="prev()">&lsaquo;</th>\r\n        <th colspan="5" class="switch" ng-click="setView(\'hours\')" ng-bind="date|mFormat:\'DD MMMM YYYY\':tz"></th>\r\n        <th ng-click="next()">&rsaquo;</i></th>\r\n      </tr>\r\n      </thead>\r\n      <tbody>\r\n      <tr>\r\n        <td colspan="7">\r\n          <span ng-repeat="minute in minutes"\r\n                ng-class="classes[$index]"\r\n                ng-click="selectDate(minute)"\r\n                ng-bind="minute|mFormat:\'HH:mm\':tz"></span>\r\n        </td>\r\n      </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n</div>') } ]) });