import { _ as __nuxt_component_0 } from './nuxt-link-BQghGA6x.mjs';
import { ref, mergeProps, unref, withCtx, createVNode, createTextVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderStyle, ssrInterpolate, ssrRenderList, ssrRenderClass } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { X, ArrowLeft, Maximize, PlayCircle, MapPin, ShieldCheck, MessageCircle, ShoppingCart, Lock } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { useRoute } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
import './server.mjs';
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
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/utils.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/plugins.mjs';

const _sfc_main = {
  __name: "[id]",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const item = ref(null);
    const loading = ref(true);
    const mediaGallery = ref([]);
    const activeMedia = ref(null);
    const isZoomOpen = ref(false);
    const zoomLevel = ref(1);
    const zoomOriginX = ref(50);
    const zoomOriginY = ref(50);
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e, _f;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-20 relative" }, _attrs))}>`);
      if (isZoomOpen.value && activeMedia.value.type === "image") {
        _push(`<div class="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center cursor-crosshair"><button class="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors z-[101]">`);
        _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
        _push(`</button><div class="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold tracking-widest uppercase pointer-events-none"> Move mouse to inspect details </div><div class="relative w-full h-full overflow-hidden flex items-center justify-center"><img${ssrRenderAttr("src", activeMedia.value.src)} class="max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ease-out" style="${ssrRenderStyle({
          transform: `scale(${zoomLevel.value})`,
          transformOrigin: `${zoomOriginX.value}% ${zoomOriginY.value}%`
        })}"></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/explore",
        class: "inline-flex items-center gap-2 text-slate-500 hover:text-brand-600 font-bold mb-6 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4" }, null, _parent2, _scopeId));
            _push2(` Back to Explore `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-4 h-4" }),
              createTextVNode(" Back to Explore ")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (loading.value) {
        _push(`<div class="text-center py-20 text-slate-500 font-bold">Loading item...</div>`);
      } else if (!item.value) {
        _push(`<div class="text-center py-20 text-red-500 font-bold">Item not found.</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12"><div class="w-full flex flex-col gap-4"><div class="aspect-square bg-slate-100 rounded-[2rem] overflow-hidden border border-slate-200 relative group cursor-pointer">`);
        if (((_a = activeMedia.value) == null ? void 0 : _a.type) === "image") {
          _push(`<img${ssrRenderAttr("src", activeMedia.value.src)} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">`);
        } else {
          _push(`<!---->`);
        }
        if (((_b = activeMedia.value) == null ? void 0 : _b.type) === "video") {
          _push(`<video${ssrRenderAttr("src", activeMedia.value.src)} controls autoplay muted loop class="w-full h-full object-cover"></video>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs uppercase tracking-widest font-black border border-slate-200 shadow-sm z-10">${ssrInterpolate(item.value.type === "sell" ? "For Sale" : item.value.type === "swap" ? "For Swap" : "Service")}</div>`);
        if (((_c = activeMedia.value) == null ? void 0 : _c.type) === "image") {
          _push(`<div class="absolute bottom-4 right-4 bg-black/50 backdrop-blur px-3 py-1.5 rounded-full text-white text-xs font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">`);
          _push(ssrRenderComponent(unref(Maximize), { class: "w-4 h-4" }, null, _parent));
          _push(` Click for 4D Zoom </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"><!--[-->`);
        ssrRenderList(mediaGallery.value, (media, idx) => {
          var _a2;
          _push(`<button class="${ssrRenderClass([((_a2 = activeMedia.value) == null ? void 0 : _a2.src) === media.src ? "border-brand-600 shadow-md" : "border-transparent opacity-60 hover:opacity-100", "relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all"])}">`);
          if (media.type === "image") {
            _push(`<img${ssrRenderAttr("src", media.src)} class="w-full h-full object-cover">`);
          } else {
            _push(`<!---->`);
          }
          if (media.type === "video") {
            _push(`<div class="w-full h-full bg-slate-800 relative"><img${ssrRenderAttr("src", media.thumb || media.src)} class="w-full h-full object-cover opacity-50">`);
            _push(ssrRenderComponent(unref(PlayCircle), { class: "absolute inset-0 m-auto w-6 h-6 text-white" }, null, _parent));
            _push(`</div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</button>`);
        });
        _push(`<!--]--></div></div><div class="flex flex-col justify-center"><div class="mb-8"><h1 class="text-3xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">${ssrInterpolate(item.value.title)}</h1><div class="flex items-center gap-4"><span class="text-3xl md:text-4xl font-black text-brand-600">\u20A6${ssrInterpolate(item.value.price)}</span>`);
        if (item.value.swapPreference) {
          _push(`<span class="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">Swap: ${ssrInterpolate(item.value.swapPreference)}</span>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div><div class="space-y-6 mb-8"><div class="flex items-center gap-3 text-slate-600 font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-5 h-5 text-brand-500 flex-shrink-0" }, null, _parent));
        _push(`<span>Location: <strong>${ssrInterpolate(item.value.location)}</strong></span></div><div><h3 class="font-bold text-slate-900 mb-2">Description</h3><p class="text-slate-600 leading-relaxed whitespace-pre-line">${ssrInterpolate(item.value.description)}</p></div></div>`);
        if (item.value.sellerId) {
          _push(`<div class="flex items-center justify-between mb-8 pb-8 border-b border-slate-200"><div class="flex items-center gap-4">`);
          if (item.value.sellerId.avatar) {
            _push(`<div class="w-14 h-14 bg-brand-100 rounded-full overflow-hidden border border-brand-200"><img${ssrRenderAttr("src", item.value.sellerId.avatar)} class="w-full h-full object-cover"></div>`);
          } else {
            _push(`<div class="w-14 h-14 bg-brand-100 rounded-full flex items-center justify-center font-black text-brand-700 text-xl border border-brand-200">${ssrInterpolate((_d = item.value.sellerId.firstName) == null ? void 0 : _d[0])}${ssrInterpolate((_e = item.value.sellerId.lastName) == null ? void 0 : _e[0])}</div>`);
          }
          _push(`<div><p class="font-black text-slate-900 text-lg">${ssrInterpolate(item.value.sellerId.firstName)} ${ssrInterpolate((_f = item.value.sellerId.lastName) == null ? void 0 : _f[0])}.</p><p class="text-sm text-slate-500 font-medium flex items-center gap-1">`);
          if (item.value.sellerId.isVerified) {
            _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-4 h-4 text-green-500" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(` ${ssrInterpolate(item.value.sellerId.isVerified ? "Verified Student" : "Student")}</p></div></div><div class="text-right"><p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Hostel</p><p class="font-bold text-slate-900">${ssrInterpolate(item.value.sellerId.hostel || "N/A")}</p></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex flex-col sm:flex-row gap-4 mt-auto"><button class="flex-1 bg-white border border-slate-200 text-slate-700 font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors">`);
        _push(ssrRenderComponent(unref(MessageCircle), { class: "w-5 h-5" }, null, _parent));
        _push(` Chat Seller </button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/checkout?itemId=" + item.value._id,
          class: "flex-1 bg-brand-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-sm hover:bg-brand-700 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ShoppingCart), { class: "w-5 h-5" }, null, _parent2, _scopeId));
              _push2(` Buy via Escrow `);
            } else {
              return [
                createVNode(unref(ShoppingCart), { class: "w-5 h-5" }),
                createTextVNode(" Buy via Escrow ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><p class="text-center mt-4 text-xs font-bold text-slate-400 flex items-center justify-center gap-1">`);
        _push(ssrRenderComponent(unref(Lock), { class: "w-3 h-3" }, null, _parent));
        _push(` Payments secured by Erranders Escrow </p></div></div>`);
      }
      _push(`</div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/item/[id].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_id_-DS21EsEo.mjs.map
