import { ref, mergeProps, unref, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderDynamicModel } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { X, Eye, EyeOff, Chrome } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { _ as _sfc_main$1 } from './CustomFormSelect-2uUQWee9.mjs';
import { u as useAuth } from './useAuth-yB_E1W8S.mjs';

const _sfc_main = {
  __name: "AuthModal",
  __ssrInlineRender: true,
  props: {
    isOpen: Boolean
  },
  emits: ["close", "success"],
  setup(__props, { emit: __emit }) {
    useAuth();
    const isLogin = ref(true);
    const loading = ref(false);
    const error = ref("");
    const showPassword = ref(false);
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
      if (__props.isOpen) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" }, _attrs))}><div class="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative"><button class="absolute top-4 right-4 text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors z-10">`);
        _push(ssrRenderComponent(unref(X), { class: "w-5 h-5" }, null, _parent));
        _push(`</button><div class="p-8"><h2 class="text-3xl font-black text-slate-900 mb-2">${ssrInterpolate(isLogin.value ? "Welcome Back" : "Create Account")}</h2><p class="text-slate-500 font-medium mb-8">${ssrInterpolate(isLogin.value ? "Log in to securely checkout via Escrow." : "Join Barter to buy, sell and swap securely.")}</p><form class="space-y-4">`);
        if (!isLogin.value) {
          _push(`<div class="space-y-4"><div><label class="block text-xs font-bold text-slate-700 mb-1">First Name</label><input${ssrRenderAttr("value", form.value.firstName)} type="text"${ssrIncludeBooleanAttr(!isLogin.value) ? " required" : ""} class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors"></div><div><label class="block text-xs font-bold text-slate-700 mb-1">Last Name</label><input${ssrRenderAttr("value", form.value.lastName)} type="text"${ssrIncludeBooleanAttr(!isLogin.value) ? " required" : ""} class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors"></div><div><label class="block text-xs font-bold text-slate-700 mb-1">WhatsApp Number</label><input${ssrRenderAttr("value", form.value.whatsappNumber)} type="tel"${ssrIncludeBooleanAttr(!isLogin.value) ? " required" : ""} placeholder="e.g. 08012345678" pattern="^0[789][01]\\d{8}$" title="Please enter a valid 11-digit Nigerian WhatsApp number starting with 0" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors"></div><div>`);
          _push(ssrRenderComponent(_sfc_main$1, {
            modelValue: form.value.level,
            "onUpdate:modelValue": ($event) => form.value.level = $event,
            label: "Level",
            options: levelOptions,
            placeholder: "Select level..."
          }, null, _parent));
          _push(`</div><div>`);
          _push(ssrRenderComponent(_sfc_main$1, {
            modelValue: form.value.university,
            "onUpdate:modelValue": ($event) => form.value.university = $event,
            label: "University",
            options: uniOptions,
            placeholder: "Select university..."
          }, null, _parent));
          _push(`</div><div><label class="block text-xs font-bold text-slate-700 mb-1">Hostel/Residence</label><input${ssrRenderAttr("value", form.value.hostel)} type="text"${ssrIncludeBooleanAttr(!isLogin.value) ? " required" : ""} placeholder="e.g. Moremi Hall" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors"></div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div><label class="block text-xs font-bold text-slate-700 mb-1">Email</label><input${ssrRenderAttr("value", form.value.email)} type="email" required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors"></div><div><label class="block text-xs font-bold text-slate-700 mb-1">Password</label><div class="relative"><input${ssrRenderDynamicModel(showPassword.value ? "text" : "password", form.value.password, null)}${ssrRenderAttr("type", showPassword.value ? "text" : "password")} required class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 font-medium transition-colors pr-12"><button type="button" class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none">`);
        if (!showPassword.value) {
          _push(ssrRenderComponent(unref(Eye), { class: "w-5 h-5" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(EyeOff), { class: "w-5 h-5" }, null, _parent));
        }
        _push(`</button></div></div>`);
        if (error.value) {
          _push(`<p class="text-red-500 text-sm font-bold text-center mt-2">${ssrInterpolate(error.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="w-full bg-brand-600 hover:bg-brand-700 text-white font-black py-4 rounded-xl mt-6 transition-colors shadow-lg shadow-brand-200 disabled:opacity-50">${ssrInterpolate(loading.value ? "Processing..." : isLogin.value ? "Log In" : "Sign Up")}</button></form><div class="mt-8"><div class="relative flex items-center justify-center"><div class="border-t border-slate-200 w-full absolute"></div><span class="bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest relative z-10">Or continue with</span></div><div class="flex gap-4 mt-6"><button class="w-full border border-slate-200 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 font-bold text-slate-700 transition-colors">`);
        _push(ssrRenderComponent(unref(Chrome), { class: "w-5 h-5 text-red-500" }, null, _parent));
        _push(` Google </button></div></div><p class="text-center mt-8 text-sm font-medium text-slate-600">${ssrInterpolate(isLogin.value ? "Don't have an account?" : "Already have an account?")} <button class="text-brand-600 font-bold hover:underline">${ssrInterpolate(isLogin.value ? "Sign up" : "Log in")}</button></p></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AuthModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=AuthModal-B-gjX5MQ.mjs.map
