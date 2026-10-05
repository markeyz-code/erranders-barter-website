import { _ as __nuxt_component_0 } from './nuxt-link-BGWY_qr-.mjs';
import { ref, computed, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderClass, ssrIncludeBooleanAttr } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { useRoute, useRouter } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
import { G as GATEWAY_ENDPOINT } from './axios.config-ClPwm9qs.mjs';
import { u as useAuth } from './useAuth-yB_E1W8S.mjs';
import { _ as _sfc_main$1 } from './AuthModal-B-gjX5MQ.mjs';
import { ArrowLeft, ShoppingBag, User, ShieldCheck, MapPin, Loader2, Lock } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { a as useSeoMeta } from './server.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/axios/index.js';
import './CustomFormSelect-2uUQWee9.mjs';
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
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/plugins.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/utils.mjs';

const escrowApi = {
  initiate: (data) => GATEWAY_ENDPOINT.post("/escrow/initiate", data),
  release: (txId) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/release`),
  dispute: (txId) => GATEWAY_ENDPOINT.patch(`/escrow/${txId}/dispute`),
  myTransactions: () => GATEWAY_ENDPOINT.get("/escrow/my-transactions")
};
const _sfc_main = {
  __name: "checkout",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const item = ref(null);
    useSeoMeta({
      title: computed(() => item.value ? `Checkout: ${item.value.title} | Erranders` : "Checkout | Erranders"),
      description: "Secure checkout via Erranders Escrow."
    });
    const loading = ref(true);
    const initiating = ref(false);
    const error = ref("");
    const isAuthModalOpen = ref(false);
    const deliveryMethod = ref("pickup");
    const deliveryAddress = ref("");
    const baseErranderFee = ref(500);
    const customErranderFee = ref(500);
    const totalAmount = computed(() => {
      if (!item.value) return 0;
      const deliveryFee = deliveryMethod.value === "errander" ? customErranderFee.value : 0;
      return item.value.price + deliveryFee;
    });
    const handleAuthSuccess = () => {
      isAuthModalOpen.value = false;
      initiateEscrow();
    };
    const initiateEscrow = async () => {
      if (deliveryMethod.value === "errander" && !deliveryAddress.value) {
        error.value = "Please provide a delivery address for the Errander.";
        return;
      }
      initiating.value = true;
      error.value = "";
      try {
        const payload = {
          sellerId: item.value.sellerId._id || item.value.sellerId,
          itemId: item.value._id,
          amount: totalAmount.value,
          deliveryMethod: deliveryMethod.value,
          deliveryAddress: deliveryAddress.value
        };
        const { data, error: apiError } = await escrowApi.initiate(payload);
        if (apiError) {
          error.value = apiError;
        } else {
          router.push("/escrow");
        }
      } catch (err) {
        error.value = "Failed to initiate checkout.";
        console.error(err);
      } finally {
        initiating.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 py-16 px-4 sm:px-6 lg:px-8" }, _attrs))}><div class="max-w-5xl mx-auto"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/explore",
        class: "inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Explore `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-4 h-4 mr-2" }),
              createTextVNode(" Back to Explore ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
      if (loading.value) {
        _push(`<div class="text-center py-20 text-slate-500 font-bold">Loading secure checkout...</div>`);
      } else if (!item.value) {
        _push(`<div class="text-center py-20 text-red-500 font-bold">Item not found.</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"><div class="lg:col-span-5 flex flex-col gap-6"><h2 class="text-3xl font-black text-slate-900 tracking-tight">Order Summary</h2><div class="bg-white p-6 rounded-3xl shadow-sm border border-slate-200"><div class="flex gap-4 items-start mb-6 pb-6 border-b border-slate-100"><div class="w-24 h-24 bg-slate-100 rounded-2xl overflow-hidden shrink-0 border border-slate-200">`);
        if (item.value.images && item.value.images.length > 0) {
          _push(`<img${ssrRenderAttr("src", item.value.images[0])} class="w-full h-full object-cover">`);
        } else {
          _push(`<div class="w-full h-full flex items-center justify-center text-slate-400">`);
          _push(ssrRenderComponent(unref(ShoppingBag), { class: "w-8 h-8" }, null, _parent));
          _push(`</div>`);
        }
        _push(`</div><div><h3 class="font-bold text-slate-900 text-lg leading-tight mb-1">${ssrInterpolate(item.value.title)}</h3><p class="text-sm font-medium text-brand-600 mb-2">\u20A6${ssrInterpolate(item.value.price.toLocaleString())}</p><div class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 rounded-md text-xs font-bold text-slate-600">`);
        _push(ssrRenderComponent(unref(User), { class: "w-3.5 h-3.5" }, null, _parent));
        _push(` Seller: ${ssrInterpolate(((_a = item.value.sellerId) == null ? void 0 : _a.firstName) || "Student")}</div></div></div><div class="space-y-3 text-sm font-medium text-slate-600"><div class="flex justify-between"><span>Item Price</span><span class="text-slate-900 font-bold">\u20A6${ssrInterpolate(item.value.price.toLocaleString())}</span></div><div class="flex justify-between"><span>Delivery Fee (${ssrInterpolate(deliveryMethod.value === "errander" ? "Errander" : "Pickup")})</span><span class="text-slate-900 font-bold">${ssrInterpolate(deliveryMethod.value === "errander" ? `\u20A6${customErranderFee.value.toLocaleString()}` : "Free")}</span></div><div class="flex justify-between"><span>Escrow Fee</span><span class="text-slate-900 font-bold">Free</span></div></div><div class="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center"><span class="font-bold text-slate-900 text-lg">Total</span><span class="font-black text-3xl text-brand-600">\u20A6${ssrInterpolate(totalAmount.value.toLocaleString())}</span></div></div><div class="bg-green-50 border border-green-200 p-5 rounded-2xl flex gap-4 items-start"><div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center shrink-0">`);
        _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-5 h-5 text-green-600" }, null, _parent));
        _push(`</div><div><h4 class="font-bold text-green-900 mb-1">Secure Escrow Payment</h4><p class="text-xs text-green-800 font-medium leading-relaxed"> Your money is held securely in Barter Escrow. The seller does not get paid until you receive the item and confirm you are satisfied. </p></div></div></div><div class="lg:col-span-7"><div class="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"><h2 class="text-2xl font-black text-slate-900 mb-6">Delivery Details</h2><div class="space-y-4 mb-8"><label class="block text-xs font-bold text-slate-700">How do you want this?</label><div class="grid grid-cols-1 sm:grid-cols-2 gap-4"><div class="${ssrRenderClass([deliveryMethod.value === "pickup" ? "border-brand-600 bg-brand-50" : "border-slate-100 hover:border-brand-300", "flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-colors"])}"><div class="${ssrRenderClass([deliveryMethod.value === "pickup" ? "border-brand-600" : "border-slate-300", "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"])}">`);
        if (deliveryMethod.value === "pickup") {
          _push(`<div class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><h4 class="font-bold text-slate-900">Self Pickup</h4><p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Meet with the seller on campus to inspect and collect.</p><span class="inline-block mt-3 px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded uppercase tracking-widest">Free</span></div></div><div class="${ssrRenderClass([deliveryMethod.value === "errander" ? "border-brand-600 bg-brand-50" : "border-slate-100 hover:border-brand-300", "flex items-start gap-3 p-4 border rounded-2xl cursor-pointer transition-colors"])}"><div class="${ssrRenderClass([deliveryMethod.value === "errander" ? "border-brand-600" : "border-slate-300", "w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5"])}">`);
        if (deliveryMethod.value === "errander") {
          _push(`<div class="w-2.5 h-2.5 bg-brand-600 rounded-full"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div><h4 class="font-bold text-slate-900">Errander Delivery</h4><p class="text-xs text-slate-500 mt-1 font-medium leading-relaxed">Get it delivered directly to your hostel by an Errander.</p><span class="inline-block mt-3 px-2 py-1 bg-brand-100 text-brand-700 text-[10px] font-bold rounded uppercase tracking-widest">Negotiable</span></div></div></div></div>`);
        if (deliveryMethod.value === "errander") {
          _push(`<div class="mb-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl space-y-6 animate-in fade-in slide-in-from-top-4 duration-300"><div><label class="block text-xs font-bold text-slate-700 mb-2">Delivery Address (Hostel/Room)</label><div class="relative">`);
          _push(ssrRenderComponent(unref(MapPin), { class: "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" }, null, _parent));
          _push(`<input${ssrRenderAttr("value", deliveryAddress.value)} type="text" placeholder="e.g. Zik Hall, Room C34" class="w-full bg-white border border-slate-200 rounded-xl pl-11 pr-4 py-3.5 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900"></div></div><div><label class="block text-xs font-bold text-slate-700 mb-1 flex justify-between"><span>Your Errander Fee Offer</span><span class="text-brand-600 font-black">Base: \u20A6${ssrInterpolate(baseErranderFee.value.toLocaleString())}</span></label><p class="text-xs text-slate-500 mb-3 font-medium">Offer a fair amount to get a faster response from erranders.</p><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-lg">\u20A6</span><input${ssrRenderAttr("value", customErranderFee.value)} type="number"${ssrRenderAttr("min", baseErranderFee.value)} class="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-3.5 outline-none focus:border-brand-500 transition-colors font-black text-slate-900 text-lg"></div></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<hr class="border-slate-100 mb-8"><button${ssrIncludeBooleanAttr(initiating.value || deliveryMethod.value === "errander" && !deliveryAddress.value) ? " disabled" : ""} class="w-full bg-brand-600 text-white font-black py-4 rounded-xl flex justify-center items-center gap-2 hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/25 disabled:opacity-50 disabled:bg-slate-400 text-lg">`);
        if (initiating.value) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(Lock), { class: "w-5 h-5" }, null, _parent));
        }
        _push(` ${ssrInterpolate(initiating.value ? "Processing..." : unref(isLoggedIn) ? `Pay \u20A6${totalAmount.value.toLocaleString()} Securely` : "Log in to Checkout")}</button>`);
        if (error.value) {
          _push(`<p class="mt-4 text-red-500 font-bold text-sm text-center bg-red-50 p-3 rounded-lg">${ssrInterpolate(error.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div></div>`);
      }
      _push(`</div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        isOpen: isAuthModalOpen.value,
        onClose: ($event) => isAuthModalOpen.value = false,
        onSuccess: handleAuthSuccess
      }, null, _parent));
      _push(`</div>`);
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
//# sourceMappingURL=checkout-BMr6PE0_.mjs.map
