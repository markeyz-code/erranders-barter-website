import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { ref, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderSlot } from "vue/server-renderer";
import { _ as _imports_0 } from "./logo-CMRV9L8T.js";
import { LayoutDashboard, ArrowRightLeft, Wallet, Settings, LogOut, Menu, X, HeartCrack } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { u as useAuth } from "./useAuth-yB_E1W8S.js";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/klona/dist/index.mjs";
const _sfc_main = {
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    useRouter();
    useAuth();
    const mobileMenu = ref(false);
    const showLogoutModal = ref(false);
    const isActive = (path) => {
      if (path === "/dashboard") return route.path === "/dashboard";
      return route.path.startsWith(path);
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 flex flex-col md:flex-row" }, _attrs))}><aside class="w-full md:w-64 bg-white border-r border-slate-100 flex flex-col hidden md:flex sticky top-0 h-screen shrink-0"><div class="p-6 border-b border-slate-100 flex items-center justify-between">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Erranders Barter" class="h-10 w-auto"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Erranders Barter",
                class: "h-10 w-auto"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><nav class="p-4 flex-1 space-y-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: ["flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors", isActive("/dashboard") ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-50"],
        "exact-active-class": "bg-brand-50 text-brand-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(LayoutDashboard), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Overview `);
          } else {
            return [
              createVNode(unref(LayoutDashboard), { class: "w-5 h-5" }),
              createTextVNode(" Overview ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/trades",
        class: ["flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors", isActive("/dashboard/trades") ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-50"],
        "exact-active-class": "bg-brand-50 text-brand-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Active Trades `);
          } else {
            return [
              createVNode(unref(ArrowRightLeft), { class: "w-5 h-5" }),
              createTextVNode(" Active Trades ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/wallet",
        class: ["flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors", isActive("/dashboard/wallet") ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-50"],
        "exact-active-class": "bg-brand-50 text-brand-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Wallet), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Escrow Wallet `);
          } else {
            return [
              createVNode(unref(Wallet), { class: "w-5 h-5" }),
              createTextVNode(" Escrow Wallet ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/settings",
        class: ["flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-colors", isActive("/dashboard/settings") ? "bg-brand-50 text-brand-600" : "text-slate-500 hover:bg-slate-50"],
        "exact-active-class": "bg-brand-50 text-brand-600"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(Settings), { class: "w-5 h-5" }, null, _parent2, _scopeId));
            _push2(` Settings `);
          } else {
            return [
              createVNode(unref(Settings), { class: "w-5 h-5" }),
              createTextVNode(" Settings ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</nav><div class="p-4 border-t border-slate-100"><button class="flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold text-red-500 hover:bg-red-50 transition-colors">`);
      _push(ssrRenderComponent(unref(LogOut), { class: "w-5 h-5" }, null, _parent));
      _push(` Sign Out </button></div></aside><header class="md:hidden bg-white border-b border-slate-100 p-4 flex items-center justify-between sticky top-0 z-40">`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<img${ssrRenderAttr("src", _imports_0)} alt="Erranders Barter" class="h-8 w-auto"${_scopeId}>`);
          } else {
            return [
              createVNode("img", {
                src: _imports_0,
                alt: "Erranders Barter",
                class: "h-8 w-auto"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="p-2 text-slate-500">`);
      if (!mobileMenu.value) {
        _push(ssrRenderComponent(unref(Menu), { class: "w-6 h-6" }, null, _parent));
      } else {
        _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
      }
      _push(`</button></header>`);
      if (mobileMenu.value) {
        _push(`<div class="md:hidden fixed inset-0 bg-white z-[35] pt-20 px-4 flex flex-col"><nav class="flex-1 space-y-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          onClick: ($event) => mobileMenu.value = false,
          to: "/dashboard",
          class: "flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg transition-colors bg-brand-50 text-brand-600"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(LayoutDashboard), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(` Overview `);
            } else {
              return [
                createVNode(unref(LayoutDashboard), { class: "w-6 h-6" }),
                createTextVNode(" Overview ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          onClick: ($event) => mobileMenu.value = false,
          to: "/dashboard/trades",
          class: "flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(ArrowRightLeft), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(` Active Trades `);
            } else {
              return [
                createVNode(unref(ArrowRightLeft), { class: "w-6 h-6" }),
                createTextVNode(" Active Trades ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          onClick: ($event) => mobileMenu.value = false,
          to: "/dashboard/wallet",
          class: "flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Wallet), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(` Escrow Wallet `);
            } else {
              return [
                createVNode(unref(Wallet), { class: "w-6 h-6" }),
                createTextVNode(" Escrow Wallet ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, {
          onClick: ($event) => mobileMenu.value = false,
          to: "/dashboard/settings",
          class: "flex items-center gap-3 px-4 py-4 rounded-xl font-bold text-lg text-slate-500 hover:bg-slate-50 transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(unref(Settings), { class: "w-6 h-6" }, null, _parent2, _scopeId));
              _push2(` Settings `);
            } else {
              return [
                createVNode(unref(Settings), { class: "w-6 h-6" }),
                createTextVNode(" Settings ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</nav><div class="pb-8 pt-4"><button class="flex items-center gap-3 px-4 py-4 w-full rounded-xl font-bold text-lg text-red-500 hover:bg-red-50 transition-colors">`);
        _push(ssrRenderComponent(unref(LogOut), { class: "w-6 h-6" }, null, _parent));
        _push(` Sign Out </button></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<main class="flex-1 overflow-y-auto">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (showLogoutModal.value) {
        _push(`<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"><div class="bg-white max-w-sm w-full rounded-3xl p-8 text-center shadow-2xl relative"><div class="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">`);
        _push(ssrRenderComponent(unref(HeartCrack), { class: "w-8 h-8" }, null, _parent));
        _push(`</div><h3 class="text-2xl font-black text-slate-900 mb-2">Leaving so soon?</h3><p class="text-slate-500 font-medium mb-8">We&#39;ll keep your listings safe while you&#39;re away. Come back soon!</p><div class="flex gap-3"><button class="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">Cancel</button><button class="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-200">Sign Out</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=dashboard-BCUov5wl.js.map
