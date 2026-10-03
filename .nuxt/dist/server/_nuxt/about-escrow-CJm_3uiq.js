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
  __name: "about-escrow",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "How Escrow Works | Erranders Barter",
      description: "Learn how our secure Escrow system protects you while buying, selling, and swapping items on campus."
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl font-black text-slate-900 mb-6">How Escrow Works</h1><div class="prose prose-lg text-slate-600"><p>At Erranders Barter, we prioritize your safety above all else. Our Escrow system ensures that buyers get their items and sellers get paid without any risk of scams.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Agreement &amp; Payment</h3><p>When a buyer wants an item, they pay the agreed amount into the secure Erranders Escrow account. The seller is instantly notified that funds are secured.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Delivery</h3><p>The seller hands over the item to the buyer directly or through Erranders Logistics. Since the money is held in Escrow, both parties are confident in proceeding.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Verification &amp; Payout</h3><p>The buyer inspects the item. Once they approve it on the platform, the funds are instantly released to the seller&#39;s wallet. If there&#39;s an issue, a dispute can be raised.</p></div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about-escrow.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=about-escrow-CJm_3uiq.js.map
