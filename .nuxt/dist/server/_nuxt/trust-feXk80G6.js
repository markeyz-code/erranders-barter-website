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
  __name: "trust",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Trust & Safety | Erranders Barter",
      description: "Safety guidelines for buying, selling, and swapping on the Erranders network."
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl font-black text-slate-900 mb-6">Trust &amp; Safety Guidelines</h1><div class="prose prose-lg text-slate-600"><p>Your safety is our top priority. We&#39;ve built Erranders Barter to be the safest place to trade on campus.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Always Use Escrow</h3><p>Never pay directly into a seller&#39;s personal bank account. Always use the built-in Escrow system to protect your money.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Meet in Public Spaces</h3><p>If you are not using Erranders Logistics, ensure you meet the other party in a well-lit, public location on campus during daylight hours.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">Inspect Items Thoroughly</h3><p>Take your time to check the item before confirming delivery on the app. Once delivery is confirmed, funds are released and sales are final.</p></div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/trust.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=trust-feXk80G6.js.map
