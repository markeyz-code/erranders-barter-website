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
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    useSeoMeta({
      title: "Contact Support | Erranders Barter"
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-xl mx-auto px-4 sm:px-6 lg:px-8"><h1 class="text-4xl font-black text-slate-900 mb-2">Contact Support</h1><p class="text-slate-500 mb-8">We usually respond within 24 hours.</p><form class="space-y-4"><div><label class="block text-sm font-bold text-slate-700 mb-1">Your Name</label><input required type="text" class="w-full border rounded-xl p-3 bg-slate-50"></div><div><label class="block text-sm font-bold text-slate-700 mb-1">Email Address</label><input required type="email" class="w-full border rounded-xl p-3 bg-slate-50"></div><div><label class="block text-sm font-bold text-slate-700 mb-1">Message</label><textarea required rows="5" class="w-full border rounded-xl p-3 bg-slate-50"></textarea></div><button type="submit" class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors"> Send Message </button></form></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=contact-DgJsj6Qt.js.map
