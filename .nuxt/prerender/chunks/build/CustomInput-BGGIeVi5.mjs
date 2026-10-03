import { mergeProps, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderSlot, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderClass } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';

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
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative group mb-5" }, _attrs))}>`);
      if (__props.label) {
        _push(`<label class="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2 group-focus-within:text-brand-600 transition-colors">${ssrInterpolate(__props.label)}</label>`);
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
      _push(`<input${ssrRenderAttr("type", __props.type)}${ssrRenderAttr("value", __props.modelValue)}${ssrRenderAttr("placeholder", __props.placeholder)}${ssrIncludeBooleanAttr(__props.required) ? " required" : ""} class="${ssrRenderClass([[_ctx.$slots.icon ? "pl-12" : "pl-4"], "w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"])}"></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomInput.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _ };
//# sourceMappingURL=CustomInput-BGGIeVi5.mjs.map
