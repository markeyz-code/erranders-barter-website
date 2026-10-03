import { _ as __nuxt_component_0 } from "./nuxt-link-BQghGA6x.js";
import { mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent } from "vue/server-renderer";
import { _ as _export_sfc } from "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "vue-router";
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLink = __nuxt_component_0;
  _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">`);
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
  _push(`<h1 class="text-4xl font-extrabold text-slate-900 mb-4">Erranders Points</h1><p class="text-lg text-slate-600 mb-8 border-l-4 border-brand-600 pl-4">Earn points for every successful swap and trade.</p><div class="prose prose-slate max-w-none"><p>This is a placeholder page for <strong>Erranders Points</strong>. You can update this content later with the actual copy.</p><div class="h-64 bg-slate-50 border-2 border-slate-200 rounded-2xl mt-8 flex items-center justify-center"><span class="text-slate-400 font-bold">Content goes here</span></div></div></div></main>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/points.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const points = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);
export {
  points as default
};
//# sourceMappingURL=points-FrP0nkEI.js.map
