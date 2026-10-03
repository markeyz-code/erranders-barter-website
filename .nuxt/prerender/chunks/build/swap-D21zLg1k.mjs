import { _ as __nuxt_component_0 } from './nuxt-link-BGWY_qr-.mjs';
import { ref, mergeProps, withCtx, unref, createVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { ArrowLeft, Check, X, Upload, Loader2, ArrowRightLeft, Sparkles, ShieldCheck } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { useRouter } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
import { u as useAuth } from './useAuth-yB_E1W8S.mjs';
import { a as useSeoMeta } from './server.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
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

const _sfc_main = {
  __name: "swap",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuth();
    const form = ref({ title: "", description: "", swapPreference: "", price: 0, location: "", type: "swap", images: [] });
    useSeoMeta({
      title: "Swap an Item | Erranders Barter",
      description: "List your items to swap securely on the Erranders Barter network.",
      ogTitle: "Swap an Item | Erranders Barter"
    });
    const loading = ref(false);
    const uploading = ref(false);
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 pt-28 pb-20" }, _attrs))}><div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex items-center gap-4 mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-200 transition-all shadow-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5" }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-5 h-5" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div><h1 class="text-3xl font-black text-slate-900 tracking-tight">List Item for Swap</h1><p class="text-slate-500 font-medium">Trade what you have for what you need. No cash required.</p></div></div><div class="flex flex-col lg:flex-row gap-8"><div class="flex-1 bg-white rounded-[2rem] border border-slate-200 shadow-sm p-6 sm:p-8">`);
      if (success.value) {
        _push(`<div class="mb-8 bg-green-50 text-green-700 p-6 rounded-2xl font-bold border border-green-200 flex items-center gap-4"><div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">`);
        _push(ssrRenderComponent(unref(Check), { class: "w-6 h-6 text-green-600" }, null, _parent));
        _push(`</div><div><p class="text-lg">Item listed successfully!</p><p class="text-sm font-medium opacity-80">Taking you to the explore page to find matches...</p></div></div>`);
      } else {
        _push(`<form class="space-y-6"><div class="space-y-4"><div class="relative group"><label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">What do you have?</label><input${ssrRenderAttr("value", form.value.title)} required type="text" placeholder="e.g. MacBook Air M1, 256GB" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 focus:"></div><div class="relative group"><label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">What do you want in return?</label><input${ssrRenderAttr("value", form.value.swapPreference)} required type="text" placeholder="e.g. Gaming PC, iPhone 13, or equivalent value" class="w-full bg-orange-50 border border-orange-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-orange-900 focus:bg-white focus:border-orange-500 focus:placeholder:text-orange-300"><p class="text-xs font-medium text-slate-500 mt-2 ml-1">Be specific! The better you describe what you want, the faster you&#39;ll match.</p></div></div><div class="relative group"><label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">Item Condition &amp; Details</label><textarea rows="4" placeholder="Describe any scratches, how long you&#39;ve used it, and why you&#39;re swapping..." class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-medium text-slate-700 focus:bg-white focus:border-brand-600 focus:resize-none">${ssrInterpolate(form.value.description)}</textarea></div><div class="relative group"><label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">Your Location</label><input${ssrRenderAttr("value", form.value.location)} required type="text" placeholder="e.g. Moremi Hall, Room 102" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 focus:"></div><div><label class="block text-xs font-black text-slate-400 mb-2">Upload Clear Photos</label><div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4"><!--[-->`);
        ssrRenderList(form.value.images, (img, idx) => {
          _push(`<div class="aspect-square rounded-2xl border-2 border-slate-200 overflow-hidden relative group"><img${ssrRenderAttr("src", img)} class="w-full h-full object-cover"><div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><button class="w-8 h-8 bg-white/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white backdrop-blur transition-colors">`);
          _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
          _push(`</button></div></div>`);
        });
        _push(`<!--]-->`);
        if (form.value.images.length < 4) {
          _push(`<label class="aspect-square rounded-2xl border-2 border-dashed border-slate-300 hover:border-brand-500 bg-slate-50 hover:bg-brand-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"><div class="w-10 h-10 rounded-full bg-slate-200 group-hover:bg-brand-100 flex items-center justify-center text-slate-500 group-hover:text-brand-600 transition-colors">`);
          if (!uploading.value) {
            _push(ssrRenderComponent(unref(Upload), { class: "w-5 h-5" }, null, _parent));
          } else {
            _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent));
          }
          _push(`</div><span class="text-xs font-bold text-slate-500 group-hover:text-brand-600">${ssrInterpolate(uploading.value ? "Uploading..." : "Add Photos")}</span><input type="file" accept="image/*" multiple class="hidden"${ssrIncludeBooleanAttr(uploading.value) ? " disabled" : ""}></label>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><button type="submit"${ssrIncludeBooleanAttr(loading.value || uploading.value || !form.value.title || !form.value.swapPreference) ? " disabled" : ""} class="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-brand-600 transition-colors shadow-lg shadow-brand-200/50 disabled:opacity-50 flex justify-center items-center gap-2">`);
        if (loading.value) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-5 h-5 animate-spin" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-5 h-5" }, null, _parent));
        }
        _push(` ${ssrInterpolate(loading.value ? "Listing Item..." : "List Item for Swap")}</button></form>`);
      }
      _push(`</div><div class="w-full lg:w-1/3"><div class="bg-brand-50 rounded-[2rem] p-8 text-slate-900 sticky top-28 border border-brand-100"><h3 class="text-xl font-black mb-2 flex items-center gap-2 text-brand-900">`);
      _push(ssrRenderComponent(unref(Sparkles), { class: "w-5 h-5 text-brand-600" }, null, _parent));
      _push(` Swap Flow Explained </h3><p class="text-slate-600 font-medium mb-8 text-sm leading-relaxed"> Don&#39;t have cash? No problem. Barter lets you trade what you don&#39;t need for what you want. </p><div class="space-y-6"><div class="flex gap-4"><div class="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 flex-shrink-0 shadow-sm">1</div><div><h4 class="font-bold text-slate-900 mb-1">List Your Item</h4><p class="text-sm text-slate-600 font-medium">Upload photos of what you have and explicitly state what you want in exchange.</p></div></div><div class="flex gap-4"><div class="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 flex-shrink-0 shadow-sm">2</div><div><h4 class="font-bold text-slate-900 mb-1">Get Matched</h4><p class="text-sm text-slate-600 font-medium">Other users will see your listing. If they have what you want, they&#39;ll initiate a chat.</p></div></div><div class="flex gap-4"><div class="w-10 h-10 rounded-full bg-white border border-brand-200 flex items-center justify-center font-black text-brand-600 flex-shrink-0 shadow-sm">3</div><div><h4 class="font-bold text-slate-900 mb-1">Chat &amp; Trade</h4><p class="text-sm text-slate-600 font-medium">Discuss the condition of both items securely in-app and agree on a meeting point on campus to swap!</p></div></div></div><div class="mt-8 p-4 bg-white rounded-2xl border border-brand-100 shadow-sm"><div class="flex items-start gap-3">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" }, null, _parent));
      _push(`<p class="text-xs font-medium text-slate-600">Always meet in open, public places on campus (like faculty hubs or halls) when exchanging physical items.</p></div></div></div></div></div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/swap.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=swap-D21zLg1k.mjs.map
