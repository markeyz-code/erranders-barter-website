import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { ref, mergeProps, withCtx, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrIncludeBooleanAttr, ssrInterpolate } from "vue/server-renderer";
import { _ as _imports_0 } from "./logo-CMRV9L8T.js";
import { _ as _sfc_main$1 } from "./CustomInput-DJ9Oxt5I.js";
import { _ as _sfc_main$2 } from "./CustomFormSelect-2uUQWee9.js";
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
const _imports_1 = "" + __buildAssetsURL("campus.Ca9-QStI.jpg");
const _sfc_main = {
  __name: "signup",
  __ssrInlineRender: true,
  setup(__props) {
    useRouter();
    useAuth();
    const loading = ref(false);
    const error = ref("");
    const form = ref({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      whatsappNumber: "",
      university: "",
      hostel: "",
      level: ""
    });
    const levelOptions = [
      { value: "100L", label: "100 Level" },
      { value: "200L", label: "200 Level" },
      { value: "300L", label: "300 Level" },
      { value: "400L", label: "400 Level" },
      { value: "500L", label: "500 Level" },
      { value: "600L", label: "600 Level" },
      { value: "Postgraduate", label: "Postgrad" }
    ];
    const uniOptions = [
      { value: "UNILAG", label: "UNILAG" },
      { value: "CMUL", label: "CMUL" },
      { value: "LASU", label: "LASU" },
      { value: "YABATECH", label: "YABATECH" },
      { value: "UI", label: "UI" },
      { value: "OAU", label: "OAU" },
      { value: "Other", label: "Other" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex" }, _attrs))}><div class="w-full lg:w-1/2 flex justify-center p-8 lg:p-12 bg-white min-h-screen"><div class="w-full max-w-md py-8 my-auto">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "flex justify-center items-center gap-2 mb-8"
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
      _push(`<h1 class="text-4xl text-center font-black text-slate-900 mb-2">Create Account</h1><p class="text-slate-500 text-center font-medium mb-8">Join the Erranders network to start trading.</p><button class="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl hover:bg-slate-50 transition-colors mb-6 shadow-sm"><img src="https://www.google.com/favicon.ico" class="w-5 h-5"> Sign up with Google </button><div class="relative flex items-center justify-center mb-6"><div class="absolute inset-0 flex items-center"><div class="w-full border-t border-slate-100"></div></div><span class="relative bg-white px-4 text-xs font-black text-slate-300 uppercase tracking-widest">OR</span></div><form class="space-y-4">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: form.value.firstName,
        "onUpdate:modelValue": ($event) => form.value.firstName = $event,
        label: "First Name",
        placeholder: "John",
        required: true
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: form.value.lastName,
        "onUpdate:modelValue": ($event) => form.value.lastName = $event,
        label: "Last Name",
        placeholder: "Doe",
        required: true
      }, null, _parent));
      _push(`<div class="relative group mb-4"><label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">WhatsApp Number</label><input${ssrRenderAttr("value", form.value.whatsappNumber)} type="tel" placeholder="e.g. 08012345678" pattern="^0[789][01]\\d{8}$" title="Valid 11-digit Nigerian WhatsApp number starting with 0" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600"></div>`);
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: form.value.level,
        "onUpdate:modelValue": ($event) => form.value.level = $event,
        label: "Level",
        options: levelOptions,
        placeholder: "Select level..."
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$2, {
        modelValue: form.value.university,
        "onUpdate:modelValue": ($event) => form.value.university = $event,
        label: "University",
        options: uniOptions,
        placeholder: "Select university..."
      }, null, _parent));
      _push(`<div class="relative group mb-4"><label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">Hostel/Residence</label><input${ssrRenderAttr("value", form.value.hostel)} type="text" placeholder="e.g. Moremi Hall" required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600"></div>`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: form.value.email,
        "onUpdate:modelValue": ($event) => form.value.email = $event,
        label: "Email Address",
        type: "email",
        placeholder: "you@example.com",
        icon: "Mail",
        required: true
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: form.value.password,
        "onUpdate:modelValue": ($event) => form.value.password = $event,
        label: "Create Password",
        type: "password",
        placeholder: "••••••••",
        icon: "Lock",
        required: true
      }, null, _parent));
      _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value || !form.value.firstName || !form.value.lastName || !form.value.whatsappNumber || !form.value.level || !form.value.university || !form.value.hostel || !form.value.email || !form.value.password) ? " disabled" : ""} class="w-full bg-brand-600 text-white font-bold py-4 rounded-xl hover:bg-brand-700 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-brand-200">${ssrInterpolate(loading.value ? "Creating Account..." : "Create Account")}</button></form>`);
      if (error.value) {
        _push(`<p class="mt-4 text-red-500 font-bold text-sm text-center">${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<p class="text-center mt-8 text-slate-500 font-medium text-sm pb-8"> Already have an account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/login",
        class: "text-brand-600 font-bold hover:underline"
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
      _push(`</p></div></div><div class="hidden lg:block lg:w-1/2 relative bg-brand-900"><img${ssrRenderAttr("src", _imports_1)} class="absolute inset-0 w-full h-full object-cover opacity-80 mix-blend-overlay"><div class="absolute inset-0 bg-gradient-to-t from-brand-900/90 via-brand-900/30 to-transparent"></div><div class="absolute bottom-16 left-16 right-16"><h2 class="text-5xl font-black text-white mb-4 leading-tight">Join the<br>Movement.</h2><p class="text-lg text-brand-100 font-medium">Over 5,000 Nigerian students have successfully traded on our network.</p></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/signup.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=signup-mdUc51_r.js.map
