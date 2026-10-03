import { _ as __nuxt_component_0 } from './nuxt-link-BQghGA6x.mjs';
import { mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { ArrowRightLeft, ShoppingBag, ShieldCheck, LifeBuoy } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { _ as _export_sfc } from './server.mjs';
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
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/utils.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/unhead/dist/plugins.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';

const _sfc_main$2 = {
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-6 left-0 w-full z-50 px-4 pointer-events-none" }, _attrs))}><div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-16 flex items-center justify-between px-2 shadow-sm pointer-events-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 pl-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border border-slate-200"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-4 h-4 text-white" }, null, _parent2, _scopeId));
            _push2(`</div><span class="font-black text-xl tracking-tighter text-slate-900 hidden sm:block"${_scopeId}>Barter.</span>`);
          } else {
            return [
              createVNode("div", { class: "w-8 h-8 bg-brand-600 rounded-full flex items-center justify-center border border-slate-200" }, [
                createVNode(unref(ArrowRightLeft), { class: "w-4 h-4 text-white" })
              ]),
              createVNode("span", { class: "font-black text-xl tracking-tighter text-slate-900 hidden sm:block" }, "Barter.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-1 pr-1">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-brand-600 transition-colors rounded-full hover:bg-brand-50 hidden md:block"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Log In`);
          } else {
            return [
              createTextVNode("Log In")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/sell",
        class: "bg-slate-900 text-white font-black px-6 py-2.5 rounded-full hover:bg-brand-600 transition-colors text-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Start Trading`);
          } else {
            return [
              createTextVNode("Start Trading")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppNavbar.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = {
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-slate-900 text-slate-400 py-10 mt-20 border-t-[6px] border-brand-600 relative overflow-hidden" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"><div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8"><div class="flex-1 w-full lg:max-w-md">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-8 h-8 bg-brand-600 rounded flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-4 h-4 text-white" }, null, _parent2, _scopeId));
            _push2(`</div><span class="font-black text-2xl tracking-tighter text-white"${_scopeId}>Barter.</span>`);
          } else {
            return [
              createVNode("div", { class: "w-8 h-8 bg-brand-600 rounded flex items-center justify-center" }, [
                createVNode(unref(ArrowRightLeft), { class: "w-4 h-4 text-white" })
              ]),
              createVNode("span", { class: "font-black text-2xl tracking-tighter text-white" }, "Barter.")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-sm font-medium leading-relaxed mb-4"> The smartest way to trade, sell, and swap on campus. Backed by Erranders logistics. </p><div class="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700"><input type="email" placeholder="Enter email for updates..." class="bg-transparent border-none outline-none text-white text-sm px-4 py-2 w-full"><button class="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-md transition-colors"> Subscribe </button></div></div><div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8 lg:justify-end lg:gap-16"><div><h4 class="font-black text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(ShoppingBag), { class: "w-4 h-4 text-brand-500" }, null, _parent));
      _push(` Market </h4><ul class="space-y-2 text-sm font-medium"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category/electronics",
        class: "hover:text-brand-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Electronics`);
          } else {
            return [
              createTextVNode("Electronics")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category/textbooks",
        class: "hover:text-brand-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Textbooks`);
          } else {
            return [
              createTextVNode("Textbooks")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/category/furniture",
        class: "hover:text-brand-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Furniture`);
          } else {
            return [
              createTextVNode("Furniture")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h4 class="font-black text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-4 h-4 text-green-500" }, null, _parent));
      _push(` Trust </h4><ul class="space-y-2 text-sm font-medium"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/escrow",
        class: "hover:text-green-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`How Escrow Works`);
          } else {
            return [
              createTextVNode("How Escrow Works")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/trust",
        class: "hover:text-green-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Safety Guidelines`);
          } else {
            return [
              createTextVNode("Safety Guidelines")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/terms",
        class: "hover:text-green-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Terms of Service`);
          } else {
            return [
              createTextVNode("Terms of Service")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div><div><h4 class="font-black text-white mb-4 uppercase tracking-wider text-xs flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(LifeBuoy), { class: "w-4 h-4 text-blue-500" }, null, _parent));
      _push(` Help </h4><ul class="space-y-2 text-sm font-medium"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/faq",
        class: "hover:text-blue-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`FAQ`);
          } else {
            return [
              createTextVNode("FAQ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "hover:text-blue-400 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Contact Support`);
          } else {
            return [
              createTextVNode("Contact Support")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li></ul></div></div></div><div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-800 text-xs font-bold tracking-widest uppercase"><p>\xA9 2026 Erranders Inc.</p><div class="flex gap-4 mt-4 sm:mt-0"><a href="#" class="hover:text-white transition-colors">Twitter</a><a href="#" class="hover:text-white transition-colors">Instagram</a></div></div></div></footer>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_AppNavbar = _sfc_main$2;
  const _component_AppFooter = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex flex-col min-h-screen" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppNavbar, null, null, _parent));
  _push(`<main class="flex-grow pt-28">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-Baa5o0VY.mjs.map
