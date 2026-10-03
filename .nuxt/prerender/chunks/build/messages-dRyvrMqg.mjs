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
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 flex flex-col" }, _attrs))}><div class="bg-white p-4 shadow-sm border-b border-slate-100 flex items-center gap-4 sticky top-0 z-10">`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "text-slate-500 font-bold"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`\u2190`);
      } else {
        return [
          createTextVNode("\u2190")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h1 class="text-xl font-black text-slate-900">Messages</h1></div><div class="flex-1 overflow-y-auto p-4 space-y-4"><div class="flex flex-col gap-4"><div class="bg-blue-600 text-white p-3 rounded-2xl rounded-tr-none self-end max-w-[80%] shadow-sm"> Is the fridge still available? </div><div class="bg-white border border-slate-100 text-slate-800 p-3 rounded-2xl rounded-tl-none self-start max-w-[80%] shadow-sm"> Yes it is! Are you on campus? </div></div></div><div class="bg-white p-4 border-t border-slate-100 sticky bottom-0"><div class="flex gap-2"><input type="text" class="flex-1 border border-slate-200 rounded-full px-4 py-2 focus:outline-none focus:border-blue-500" placeholder="Type a message..."><button class="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">\u2191</button></div></div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/messages.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const messages = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { messages as default };
//# sourceMappingURL=messages-dRyvrMqg.mjs.map
