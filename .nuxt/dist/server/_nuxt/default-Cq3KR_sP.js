import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { _ as _imports_0 } from "./logo-CMRV9L8T.js";
import { User, ShoppingBag, ShieldCheck, LifeBuoy } from "lucide-vue-next";
import { u as useAuth } from "./useAuth-yB_E1W8S.js";
import { _ as _export_sfc } from "./_plugin-vue_export-helper-1tPrXgE0.js";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/klona/dist/index.mjs";
const _sfc_main$2 = {
  __name: "AppNavbar",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed top-6 left-0 w-full z-[100] px-4 pointer-events-none" }, _attrs))}><div class="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl border border-slate-200 rounded-full h-16 flex items-center justify-between px-2 shadow-sm pointer-events-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 pl-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Erranders Barter" class="h-14 w-auto"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Erranders Barter",
                class: "h-14 w-auto"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="flex items-center gap-1 pr-1">`);
      if (!unref(user)) {
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
      } else {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/dashboard",
          class: "flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 hover:bg-brand-100 text-slate-700 hover:text-brand-600 transition-colors mr-2"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(User), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(unref(User), { class: "w-5 h-5" })
              ];
            }
          }),
          _: 1
        }, _parent));
      }
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
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "bg-white text-slate-500 py-10 mt-20 border-t-[6px] border-brand-600 relative overflow-hidden shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"><div class="flex flex-col lg:flex-row items-center justify-between gap-8 mb-8"><div class="flex-1 w-full lg:max-w-md">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2 mb-4"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Erranders Barter" class="h-14 w-auto"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Erranders Barter",
                class: "h-14 w-auto"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="text-sm font-medium leading-relaxed mb-4"> The smartest way to trade, sell, and swap on campus. Backed by Erranders logistics. </p><div class="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200"><input type="email" placeholder="Enter email for updates..." class="bg-transparent border-none outline-none text-slate-900 text-sm px-4 py-2 w-full"><button class="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs px-4 py-2 rounded-md transition-colors"> Subscribe </button></div></div><div class="flex-1 w-full grid grid-cols-1 sm:grid-cols-3 gap-8 lg:justify-end lg:gap-16"><div><h4 class="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">`);
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
      _push(`</li></ul></div><div><h4 class="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-4 h-4 text-green-500" }, null, _parent));
      _push(` Trust </h4><ul class="space-y-2 text-sm font-medium"><li>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/about-escrow",
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
      _push(`</li></ul></div><div><h4 class="font-black text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2">`);
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
      _push(`</li></ul></div></div></div><div class="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-200 text-xs font-bold tracking-widest uppercase text-slate-500"><p>© 2026 Erranders Inc.</p><div class="flex gap-4 mt-4 sm:mt-0"><a href="#" class="hover:text-brand-600 transition-colors">Twitter</a><a href="#" class="hover:text-brand-600 transition-colors">Instagram</a></div></div></div></footer>`);
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
export {
  _default as default
};
//# sourceMappingURL=default-Cq3KR_sP.js.map
