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
  __name: "terms",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Terms of Service | Erranders Barter"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl font-black text-slate-900 mb-6">Terms of Service</h1><div class="prose prose-lg text-slate-600"><p>Welcome to Erranders Barter. By using our platform, you agree to these terms.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">1. Acceptance of Terms</h3><p>By creating an account, you agree to be bound by these Terms of Service and all applicable laws.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">2. Prohibited Items</h3><p>You may not list illegal, dangerous, or restricted items on the platform. Accounts found violating this will be permanently banned.</p><h3 class="text-2xl font-bold text-slate-800 mt-8 mb-4">3. Dispute Resolution</h3><p>In the event of a dispute, our support team will mediate based on evidence provided by both parties. The decision of the mediation team is final.</p></div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/terms.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=terms-CGXRnZ7I.js.map
