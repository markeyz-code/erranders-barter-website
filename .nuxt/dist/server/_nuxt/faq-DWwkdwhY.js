import { mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import { a as useSeoMeta } from "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
const _sfc_main = {
  __name: "faq",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "FAQ | Erranders Barter"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl font-black text-slate-900 mb-6">Frequently Asked Questions</h1><div class="space-y-6 mt-10"><div class="border-b border-slate-200 pb-6"><h3 class="text-xl font-bold text-slate-900 mb-2">How much does it cost to sell an item?</h3><p class="text-slate-600">Listing an item is completely free! We only take a small platform fee upon successful completion of a sale via Escrow.</p></div><div class="border-b border-slate-200 pb-6"><h3 class="text-xl font-bold text-slate-900 mb-2">How does swapping work?</h3><p class="text-slate-600">You can list an item for swap and specify what you want in return. If someone matches your preference, you can both initiate a swap trade securely.</p></div><div class="border-b border-slate-200 pb-6"><h3 class="text-xl font-bold text-slate-900 mb-2">What happens if I get scammed?</h3><p class="text-slate-600">Because of our Escrow system, it is mathematically impossible to get scammed if you follow the rules. Never pay outside the app.</p></div></div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/faq.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=faq-DWwkdwhY.js.map
