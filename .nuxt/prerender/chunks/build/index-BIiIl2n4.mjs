import { _ as __nuxt_component_0 } from './nuxt-link-BGWY_qr-.mjs';
import { ref, computed, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { MapPin, Package, CheckCircle2, Wallet, Star, Plus, ArrowDownToLine, Search } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { u as useAuth } from './useAuth-yB_E1W8S.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
import './server.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs';
import '../nitro/nitro.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/destr/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/node-mock-http/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unstorage/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unstorage/drivers/fs.mjs';
import 'node:crypto';
import 'node:fs/promises';
import 'node:path';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unstorage/drivers/fs-lite.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unstorage/drivers/lru-cache.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ohash/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/klona/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/scule/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/radix3/dist/index.mjs';
import 'node:fs';
import 'node:url';
import 'file:///Users/marquis/erranders/barter/website/node_modules/pathe/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/server.mjs';
import 'node:async_hooks';
import 'file:///Users/marquis/erranders/barter/website/node_modules/devalue/index.js';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/plugins.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/utils.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';

const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const stats = ref(null);
    const loading = ref(true);
    const initials = computed(() => {
      var _a, _b;
      if (!user.value) return "U";
      return `${((_a = user.value.firstName) == null ? void 0 : _a[0]) || ""}${((_b = user.value.lastName) == null ? void 0 : _b[0]) || ""}`.toUpperCase() || "U";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f, _g;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 md:p-8" }, _attrs))}><div class="max-w-5xl mx-auto"><div class="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-10"><div class="flex items-center gap-6"><div class="w-24 h-24 bg-brand-600 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-brand-200 shrink-0">${ssrInterpolate(initials.value)}</div><div><h1 class="text-3xl md:text-4xl font-black text-slate-900 mb-1">Welcome, ${ssrInterpolate(((_a = unref(user)) == null ? void 0 : _a.firstName) || "Trader")}!</h1><p class="text-slate-500 font-medium flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4" }, null, _parent));
      _push(` ${ssrInterpolate(((_b = unref(user)) == null ? void 0 : _b.university) || "University")} \u2022 ${ssrInterpolate(((_c = unref(user)) == null ? void 0 : _c.hostel) || "Hostel")}</p></div></div></div>`);
      if (loading.value) {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"><!--[-->`);
        ssrRenderList(4, (i) => {
          _push(`<div class="bg-slate-100 p-6 rounded-3xl animate-pulse h-36"></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"><div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div class="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(Package), { class: "w-6 h-6" }, null, _parent));
        _push(`</div><p class="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Active Listings</p><p class="text-3xl font-black text-slate-900">${ssrInterpolate(((_d = stats.value) == null ? void 0 : _d.activeListings) || 0)}</p></div><div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div class="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(CheckCircle2), { class: "w-6 h-6" }, null, _parent));
        _push(`</div><p class="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Completed Trades</p><p class="text-3xl font-black text-slate-900">${ssrInterpolate(((_e = stats.value) == null ? void 0 : _e.completedTrades) || 0)}</p></div><div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div class="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(Wallet), { class: "w-6 h-6" }, null, _parent));
        _push(`</div><p class="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Escrow Balance</p><p class="text-3xl font-black text-slate-900">\u20A6${ssrInterpolate((((_f = stats.value) == null ? void 0 : _f.escrowBalance) || 0).toLocaleString())}</p></div><div class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm"><div class="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">`);
        _push(ssrRenderComponent(unref(Star), { class: "w-6 h-6" }, null, _parent));
        _push(`</div><p class="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">Seller Rating</p><p class="text-3xl font-black text-slate-900">${ssrInterpolate(((_g = stats.value) == null ? void 0 : _g.sellerRating) || "0.0")}<span class="text-lg text-slate-400">/5</span></p></div></div>`);
      }
      _push(`<div class="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm"><h2 class="text-xl font-black text-slate-900 mb-6">Quick Actions</h2><div class="grid grid-cols-1 sm:grid-cols-3 gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/sell",
        class: "p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 hover:bg-white transition-all group flex flex-col items-center text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Plus), { class: "w-6 h-6 text-brand-600" }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="font-bold text-slate-900 mb-1"${_scopeId}>List New Item</h3><p class="text-xs text-slate-500 font-medium"${_scopeId}>Sell or swap something fast.</p>`);
          } else {
            return [
              createVNode("div", { class: "w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform" }, [
                createVNode(unref(Plus), { class: "w-6 h-6 text-brand-600" })
              ]),
              createVNode("h3", { class: "font-bold text-slate-900 mb-1" }, "List New Item"),
              createVNode("p", { class: "text-xs text-slate-500 font-medium" }, "Sell or swap something fast.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/wallet",
        class: "p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 hover:bg-white transition-all group flex flex-col items-center text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowDownToLine), { class: "w-6 h-6 text-emerald-600" }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="font-bold text-slate-900 mb-1"${_scopeId}>Withdraw Funds</h3><p class="text-xs text-slate-500 font-medium"${_scopeId}>Move escrow balance to bank.</p>`);
          } else {
            return [
              createVNode("div", { class: "w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform" }, [
                createVNode(unref(ArrowDownToLine), { class: "w-6 h-6 text-emerald-600" })
              ]),
              createVNode("h3", { class: "font-bold text-slate-900 mb-1" }, "Withdraw Funds"),
              createVNode("p", { class: "text-xs text-slate-500 font-medium" }, "Move escrow balance to bank.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/explore",
        class: "p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-brand-500 hover:bg-white transition-all group flex flex-col items-center text-center"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(Search), { class: "w-6 h-6 text-blue-600" }, null, _parent2, _scopeId));
            _push2(`</div><h3 class="font-bold text-slate-900 mb-1"${_scopeId}>Explore Deals</h3><p class="text-xs text-slate-500 font-medium"${_scopeId}>Find the best student trades.</p>`);
          } else {
            return [
              createVNode("div", { class: "w-14 h-14 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform" }, [
                createVNode(unref(Search), { class: "w-6 h-6 text-blue-600" })
              ]),
              createVNode("h3", { class: "font-bold text-slate-900 mb-1" }, "Explore Deals"),
              createVNode("p", { class: "text-xs text-slate-500 font-medium" }, "Find the best student trades.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BIiIl2n4.mjs.map
