import { _ as __nuxt_component_0 } from "./nuxt-link-BQghGA6x.js";
import { mergeProps, withCtx, createTextVNode, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from "vue/server-renderer";
import { useRoute } from "vue-router";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const categoryId = route.params.id;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "text-brand-600 font-bold mb-4 inline-block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`← Back Home`);
          } else {
            return [
              createTextVNode("← Back Home")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-4xl font-extrabold text-slate-900 capitalize">${ssrInterpolate(unref(categoryId))} Category</h1><p class="text-slate-500 font-medium mt-2">Browse all available items in ${ssrInterpolate(unref(categoryId))}.</p></div><div class="p-12 border-2 border-slate-200 border-dashed rounded-3xl text-center"><h2 class="text-2xl font-bold text-slate-400 mb-2">No items found</h2><p class="text-slate-500">Be the first to list an item in this category!</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/list",
        class: "inline-block mt-4 bg-brand-600 text-white font-bold px-6 py-3 rounded-lg"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`List an Item`);
          } else {
            return [
              createTextVNode("List an Item")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/category/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=_id_-C6aJnaGj.js.map
