import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _imports_0 } from "./logo-CMRV9L8T.js";
import { _ as _sfc_main$1 } from "./CustomInput-DJ9Oxt5I.js";
import { useRouter } from "vue-router";
import { u as useAuth } from "./useAuth-yB_E1W8S.js";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
import "lucide-vue-next";
import "/Users/marquis/erranders/barter/website/node_modules/klona/dist/index.mjs";
const _imports_1 = "" + __buildAssetsURL("exchange.DxniCAyG.jpg");
const _sfc_main = {
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuth();
    const loading = ref(false);
    const error = ref("");
    const form = ref({ email: "", password: "" });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex" }, _attrs))}><div class="w-full lg:w-1/2 flex justify-center p-8 lg:p-12 bg-white min-h-screen"><div class="w-full max-w-md py-8 my-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex justify-center items-center gap-2"
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
      _push(`<h1 class="text-4xl text-center font-black text-slate-900 mb-2">Welcome Back</h1><p class="text-slate-500 text-center font-medium mb-8">Log in to your Erranders account to continue.</p><button class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors mb-6"><img src="https://www.google.com/favicon.ico" class="w-5 h-5"> Continue with Google </button><div class="relative flex items-center justify-center mb-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div><span class="relative bg-white px-4 text-xs font-black text-slate-300 uppercase tracking-widest">OR</span></div><form class="space-y-5">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: form.value.email,
        "onUpdate:modelValue": ($event) => form.value.email = $event,
        label: "Email Address",
        type: "email",
        placeholder: "you@example.com",
        icon: "Mail"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: form.value.password,
        "onUpdate:modelValue": ($event) => form.value.password = $event,
        label: "Secure Password",
        type: "password",
        placeholder: "••••••••",
        icon: "Lock"
      }, null, _parent));
      _push(`<div class="flex justify-end">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/forgot-password",
        class: "text-sm font-bold text-brand-600 hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Forgot Password?`);
          } else {
            return [
              createTextVNode("Forgot Password?")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><button type="submit"${ssrIncludeBooleanAttr(loading.value || !form.value.email || !form.value.password) ? " disabled" : ""} class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed">${ssrInterpolate(loading.value ? "Logging in..." : "Log In")}</button></form>`);
      if (error.value) {
        _push(`<p class="mt-4 text-red-500 font-bold text-sm text-center">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="text-center mt-8 text-slate-500 font-medium text-sm"> Don&#39;t have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/signup",
        class: "text-brand-600 font-bold hover:underline"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Sign up`);
          } else {
            return [
              createTextVNode("Sign up")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div></div><div class="hidden lg:block lg:w-1/2 relative bg-slate-900"><img${ssrRenderAttr("src", _imports_1)} class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"><div class="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent"></div><div class="absolute bottom-16 left-16 right-16"><h2 class="text-5xl font-black text-white mb-4 leading-tight">Trade smart.<br>Move fast.</h2><p class="text-lg text-slate-300 font-medium">The Erranders Barter network connects thousands of Nigerian students daily.</p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-6dBk-B5Y.js.map
