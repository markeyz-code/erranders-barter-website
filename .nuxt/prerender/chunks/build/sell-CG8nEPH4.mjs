import { _ as __nuxt_component_0 } from './nuxt-link-BQghGA6x.mjs';
import { ref, mergeProps, withCtx, createTextVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { useRouter } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
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
  __name: "sell",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    const form = ref({ title: "", description: "", price: null, location: "", type: "sell", images: [] });
    const loading = ref(false);
    const uploading = ref(false);
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pb-10" }, _attrs))}><div class="p-4 flex items-center gap-3 border-b border-gray-100">`);
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
      _push(`<h1 class="text-xl font-black">List an Item</h1></div>`);
      if (success.value) {
        _push(`<div class="m-4 bg-green-50 text-green-700 p-4 rounded-xl font-bold border border-green-200"> Item listed successfully! Redirecting... </div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="p-4 space-y-4 max-w-md mx-auto"><div><label class="block text-sm font-bold text-slate-700 mb-1">Title</label><input${ssrRenderAttr("value", form.value.title)} required type="text" placeholder="e.g. Mini Fridge" class="w-full border rounded-xl p-3 bg-slate-50"></div><div><label class="block text-sm font-bold text-slate-700 mb-1">Description</label><textarea rows="3" class="w-full border rounded-xl p-3 bg-slate-50">${ssrInterpolate(form.value.description)}</textarea></div><div><label class="block text-sm font-bold text-slate-700 mb-1">Price (\u20A6)</label><input${ssrRenderAttr("value", form.value.price)} type="number" placeholder="Leave blank if Swap" class="w-full border rounded-xl p-3 bg-slate-50"></div><div><label class="block text-sm font-bold text-slate-700 mb-1">Location</label><input${ssrRenderAttr("value", form.value.location)} required type="text" placeholder="e.g. Mellanby Hall" class="w-full border rounded-xl p-3 bg-slate-50"></div><div><label class="block text-sm font-bold text-slate-700 mb-1">Images</label><input type="file" accept="image/*" class="w-full border rounded-xl p-3 bg-slate-50">`);
      if (uploading.value) {
        _push(`<div class="text-sm text-blue-500 font-bold mt-1">Uploading...</div>`);
      } else {
        _push(`<!---->`);
      }
      if (form.value.images.length) {
        _push(`<div class="flex gap-2 mt-2"><!--[-->`);
        ssrRenderList(form.value.images, (img) => {
          _push(`<img${ssrRenderAttr("src", img)} class="w-16 h-16 object-cover rounded-xl border">`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(loading.value || uploading.value) ? " disabled" : ""} class="w-full py-4 rounded-xl text-white font-bold bg-slate-900 hover:bg-slate-800 disabled:opacity-50 transition-colors mt-6">${ssrInterpolate(loading.value ? "Posting..." : "Post Item Securely")}</button></form></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sell.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=sell-CG8nEPH4.mjs.map
