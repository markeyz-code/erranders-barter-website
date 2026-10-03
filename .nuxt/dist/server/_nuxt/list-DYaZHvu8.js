import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
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
        _push2(`← Back`);
      } else {
        return [
          createTextVNode("← Back")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`<h1 class="text-2xl font-black">Listings</h1></div><div class="text-center py-10"><h2 class="font-bold text-slate-800 mb-2">Category Listings</h2><p class="text-sm text-slate-500 mb-6">Browse all available items in this category.</p>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/explore",
    class: "inline-block bg-brand-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-brand-700 transition-colors shadow-lg"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Browse All Items `);
      } else {
        return [
          createTextVNode(" Browse All Items ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</div></div></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/list.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const list = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  list as default
};
//# sourceMappingURL=list-DYaZHvu8.js.map
