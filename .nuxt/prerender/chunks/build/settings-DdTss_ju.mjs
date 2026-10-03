import { ref, mergeProps, unref, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderAttr, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrInterpolate } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { u as useAuth } from './useAuth-yB_E1W8S.mjs';
import './server.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
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
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';

const _sfc_main = {
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuth();
    const loading = ref(false);
    const successMsg = ref("");
    const errorMsg = ref("");
    const form = ref({
      firstName: "",
      lastName: "",
      whatsappNumber: "",
      university: "",
      hostel: ""
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 md:p-8" }, _attrs))}><div class="max-w-3xl mx-auto"><div class="mb-10"><h1 class="text-3xl font-black text-slate-900 mb-2">Account Settings</h1><p class="text-slate-500 font-medium">Manage your profile details and preferences.</p></div><div class="bg-white rounded-3xl border border-slate-100 shadow-sm p-8"><form class="space-y-6"><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-xs font-black text-slate-400 mb-2">First Name</label><input${ssrRenderAttr("value", form.value.firstName)} required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors"></div><div><label class="block text-xs font-black text-slate-400 mb-2">Last Name</label><input${ssrRenderAttr("value", form.value.lastName)} required class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors"></div></div><div><label class="block text-xs font-black text-slate-400 mb-2">Email Address</label><input${ssrRenderAttr("value", (_a = unref(user)) == null ? void 0 : _a.email)} disabled class="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-500 cursor-not-allowed"><p class="text-xs text-slate-400 mt-2 font-medium">Email address cannot be changed.</p></div><div><label class="block text-xs font-black text-slate-400 mb-2">WhatsApp Number</label><input${ssrRenderAttr("value", form.value.whatsappNumber)} type="tel" pattern="^0[789][01]\\d{8}$" title="Valid 11-digit Nigerian WhatsApp number" class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors"></div><div class="grid grid-cols-1 md:grid-cols-2 gap-6"><div><label class="block text-xs font-black text-slate-400 mb-2">University</label><select class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors appearance-none"><option value="UNILAG"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "UNILAG") : ssrLooseEqual(form.value.university, "UNILAG")) ? " selected" : ""}>UNILAG</option><option value="CMUL"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "CMUL") : ssrLooseEqual(form.value.university, "CMUL")) ? " selected" : ""}>CMUL</option><option value="LASU"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "LASU") : ssrLooseEqual(form.value.university, "LASU")) ? " selected" : ""}>LASU</option><option value="YABATECH"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "YABATECH") : ssrLooseEqual(form.value.university, "YABATECH")) ? " selected" : ""}>YABATECH</option><option value="UI"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "UI") : ssrLooseEqual(form.value.university, "UI")) ? " selected" : ""}>UI</option><option value="OAU"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "OAU") : ssrLooseEqual(form.value.university, "OAU")) ? " selected" : ""}>OAU</option><option value="Other"${ssrIncludeBooleanAttr(Array.isArray(form.value.university) ? ssrLooseContain(form.value.university, "Other") : ssrLooseEqual(form.value.university, "Other")) ? " selected" : ""}>Other</option></select></div><div><label class="block text-xs font-black text-slate-400 mb-2">Hostel / Residence</label><input${ssrRenderAttr("value", form.value.hostel)} class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 font-bold text-slate-900 focus:bg-white focus:border-brand-600 outline-none transition-colors"></div></div>`);
      if (successMsg.value) {
        _push(`<div class="p-4 bg-green-50 text-green-600 rounded-xl font-bold text-sm">${ssrInterpolate(successMsg.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (errorMsg.value) {
        _push(`<div class="p-4 bg-red-50 text-red-600 rounded-xl font-bold text-sm">${ssrInterpolate(errorMsg.value)}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="pt-6 mt-6 border-t border-slate-100 flex justify-end"><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-brand-600 transition-colors shadow-lg disabled:opacity-50">${ssrInterpolate(loading.value ? "Saving..." : "Save Changes")}</button></div></form></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-DdTss_ju.mjs.map
