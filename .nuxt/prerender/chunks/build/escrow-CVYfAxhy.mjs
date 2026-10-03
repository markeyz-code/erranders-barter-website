import { _ as __nuxt_component_0 } from './nuxt-link-BQghGA6x.mjs';
import { ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrIncludeBooleanAttr } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { useRouter } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
import { u as useAuth } from './useAuth-z0vkCnTc.mjs';
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
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/utils.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/plugins.mjs';

const _sfc_main = {
  __name: "escrow",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuth();
    const transactions = ref([]);
    const loading = ref(true);
    const actionLoading = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-brand-600 font-bold mb-4 inline-block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`\u2190 Back Home`);
          } else {
            return [
              createTextVNode("\u2190 Back Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-4xl font-extrabold text-slate-900 mb-4">My Escrow Transactions</h1><p class="text-lg text-slate-600 mb-8 border-l-4 border-brand-600 pl-4">Manage your ongoing trades and payments.</p>`);
      if (loading.value) {
        _push(`<div class="text-center py-20 text-slate-500 font-bold">Loading transactions...</div>`);
      } else if (transactions.value.length === 0) {
        _push(`<div class="text-center py-20 border-2 border-dashed border-slate-200 rounded-3xl"><h2 class="text-2xl font-bold text-slate-400 mb-2">No active transactions</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/explore",
          class: "text-brand-600 font-bold hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Start Trading`);
            } else {
              return [
                createTextVNode("Start Trading")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-4"><!--[-->`);
        ssrRenderList(transactions.value, (tx) => {
          _push(`<div class="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"><div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"><div><p class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction ID: ${ssrInterpolate(tx._id)}</p><h3 class="font-bold text-slate-900 text-lg">Item ID: ${ssrInterpolate(tx.itemId)}</h3></div><div class="text-right"><span class="font-black text-xl text-brand-600">\u20A6${ssrInterpolate(tx.amount)}</span><div class="mt-1">`);
          if (tx.status === "held_in_escrow") {
            _push(`<span class="px-3 py-1 bg-yellow-100 text-yellow-700 font-bold rounded-full text-xs">Awaiting Delivery</span>`);
          } else if (tx.status === "released") {
            _push(`<span class="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-xs">Completed</span>`);
          } else if (tx.status === "disputed") {
            _push(`<span class="px-3 py-1 bg-red-100 text-red-700 font-bold rounded-full text-xs">Disputed</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div></div>`);
          if (tx.status === "held_in_escrow") {
            _push(`<div class="flex gap-3 mt-6 pt-6 border-t border-slate-100"><button${ssrIncludeBooleanAttr(actionLoading.value === tx._id) ? " disabled" : ""} class="flex-1 bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors disabled:opacity-50">${ssrInterpolate(actionLoading.value === tx._id ? "Processing..." : "Confirm Delivery & Release Funds")}</button><button${ssrIncludeBooleanAttr(actionLoading.value === tx._id) ? " disabled" : ""} class="flex-1 bg-white border border-red-200 text-red-600 font-bold py-3 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"> Report Issue </button></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/escrow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=escrow-CVYfAxhy.mjs.map
