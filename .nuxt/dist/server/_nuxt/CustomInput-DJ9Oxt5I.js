import { ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderComponent } from "vue/server-renderer";
import { Eye, EyeOff } from "lucide-vue-next";
const _sfc_main = {
  __name: "CustomInput",
  __ssrInlineRender: true,
  props: {
    modelValue: String,
    label: String,
    type: { type: String, default: "text" },
    placeholder: String,
    required: Boolean
  },
  emits: ["update:modelValue"],
  setup(__props) {
    const props = __props;
    const showPassword = ref(false);
    const actualType = computed(() => {
      if (props.type === "password") {
        return showPassword.value ? "text" : "password";
      }
      return props.type;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative group mb-5" }, _attrs))}>`);
      if (__props.label) {
        _push(`<label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative flex items-center">`);
      if (_ctx.$slots.icon) {
        _push(`<div class="absolute left-4 text-slate-400 group-focus-within:text-brand-600 transition-colors">`);
        ssrRenderSlot(_ctx.$slots, "icon", {}, null, _push, _parent);
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<input${ssrRenderAttr("type", actualType.value)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([[
        _ctx.$slots.icon ? "pl-12" : "pl-4",
        __props.type === "password" ? "pr-12" : "pr-4"
      ], "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600"])}">`);
      if (__props.type === "password") {
        _push(`<button type="button" class="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors">`);
        if (!showPassword.value) {
          _push(ssrRenderComponent(unref(Eye), { class: "w-5 h-5" }, null, _parent));
        } else {
          _push(ssrRenderComponent(unref(EyeOff), { class: "w-5 h-5" }, null, _parent));
        }
        _push(`</button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=CustomInput-DJ9Oxt5I.js.map
