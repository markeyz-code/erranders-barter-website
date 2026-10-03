import { ref, mergeProps, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { useRoute, useRouter } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
import { u as useAuth } from './useAuth-z0vkCnTc.mjs';

const _sfc_main = {
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    useRouter();
    useAuth();
    const item = ref(null);
    const loading = ref(true);
    const initiating = ref(false);
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 py-20 px-4" }, _attrs))}><div class="bg-white p-6 rounded-3xl shadow-xl max-w-md mx-auto"><h2 class="text-2xl font-black text-slate-900 mb-6">Secure Checkout</h2>`);
      if (loading.value) {
        _push(`<div class="text-center py-10 text-slate-500 font-bold">Loading item...</div>`);
      } else if (!item.value) {
        _push(`<div class="text-center py-10 text-red-500 font-bold">Item not found.</div>`);
      } else {
        _push(`<div><div class="flex justify-between items-center bg-slate-50 p-4 rounded-xl mb-4 border border-slate-100"><div><h3 class="font-bold text-slate-800">${ssrInterpolate(item.value.title)}</h3><p class="text-sm text-slate-500">Seller: ${ssrInterpolate(((_a = item.value.sellerId) == null ? void 0 : _a.firstName) || "Unknown")}</p></div><span class="font-black text-blue-600 text-lg">\u20A6${ssrInterpolate(item.value.price)}</span></div><div class="space-y-3 mb-6"><label class="font-bold text-slate-700 text-sm block">How are you getting this?</label><div class="flex items-center gap-3 p-3 border-2 border-blue-600 rounded-xl bg-blue-50 cursor-pointer"><div class="flex-1"><h4 class="font-bold text-slate-900 text-sm">Self Pickup</h4><p class="text-xs text-slate-500">Meet with the seller</p></div><span class="font-bold text-sm">Free</span></div></div><div class="bg-green-50 border border-green-100 p-3 rounded-xl flex gap-3 items-start mb-6"><p class="text-xs text-green-800 font-medium">Your payment is held securely in Barter Escrow. The seller does not get paid until you confirm delivery.</p></div><button${ssrIncludeBooleanAttr(initiating.value) ? " disabled" : ""} class="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200 disabled:opacity-50">${ssrInterpolate(initiating.value ? "Processing..." : "Pay \u20A6" + item.value.price + " Securely")}</button>`);
        if (error.value) {
          _push(`<p class="mt-4 text-red-500 font-bold text-sm text-center">${ssrInterpolate(error.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/checkout.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=checkout-DI8KI1cz.mjs.map
