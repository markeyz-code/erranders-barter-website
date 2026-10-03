import { _ as __nuxt_component_0 } from './nuxt-link-BQghGA6x.mjs';
import { mergeProps, withCtx, createTextVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { _ as _export_sfc } from './server.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
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
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 py-20 px-4" }, _attrs))}><div class="max-w-md mx-auto bg-white p-6 rounded-3xl shadow-xl"><div class="flex items-center gap-3 border-b border-gray-100 pb-4 mb-4">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "text-gray-600 font-bold"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u2190 Back`);
      } else {
        return [
          createTextVNode("\u2190 Back")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h1 class="text-2xl font-black">Swap Items</h1></div><p class="text-slate-500 font-medium mb-6">Select an item you want to swap and an item you want in return.</p><div class="bg-yellow-50 text-yellow-800 p-4 rounded-xl font-bold border border-yellow-200 mb-6 text-sm"> Swap requests are currently being processed manually. Please check back later for automated swapping. </div>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/explore",
    class: "block text-center w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-colors shadow-lg"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Go to Explore `);
      } else {
        return [
          createTextVNode(" Go to Explore ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/swap.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const swap = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { swap as default };
//# sourceMappingURL=swap-3_Cd6VZD.mjs.map
