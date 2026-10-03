import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { ref, mergeProps, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _sfc_main$1 } from "./CustomInput-DJ9Oxt5I.js";
import { useRoute } from "vue-router";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
import "lucide-vue-next";
const _sfc_main = {
  __name: "reset-password",
  __ssrInlineRender: true,
  setup(__props) {
    useRoute();
    const password = ref("");
    const loading = ref(false);
    const error = ref("");
    const success = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex" }, _attrs))}><div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white"><div class="w-full max-w-md"><h1 class="text-4xl font-black text-slate-900 mb-2">Reset Password</h1><p class="text-slate-500 font-medium mb-8">Enter your new secure password.</p><form class="space-y-5">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: password.value,
        "onUpdate:modelValue": ($event) => password.value = $event,
        label: "New Password",
        type: "password",
        placeholder: "••••••••",
        icon: "Lock"
      }, null, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-4 disabled:opacity-50">${ssrInterpolate(loading.value ? "Resetting..." : "Reset Password")}</button></form>`);
      if (success.value) {
        _push(`<p class="mt-4 text-green-600 font-bold text-sm text-center">Password reset successfully! `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/login",
          class: "underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Log in`);
            } else {
              return [
                createTextVNode("Log in")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p>`);
      } else {
        _push(`<!---->`);
      }
      if (error.value) {
        _push(`<p class="mt-4 text-red-500 font-bold text-sm text-center">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/reset-password.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=reset-password-MEK9UYoM.js.map
