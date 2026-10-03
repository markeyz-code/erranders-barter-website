import { ref, computed, mergeProps, unref, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderClass, ssrRenderComponent, ssrRenderList } from "vue/server-renderer";
import { ChevronDown, Check } from "lucide-vue-next";
const _sfc_main = {
  __name: "CustomFormSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: [String, Number, null], default: "" },
    label: String,
    options: {
      type: Array,
      required: true
    },
    placeholder: { type: String, default: "Select..." }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = ref(false);
    ref(null);
    const currentLabel = computed(() => {
      const found = props.options.find((o) => o.value === props.modelValue);
      return found ? found.label : props.placeholder;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative group mb-5" }, _attrs))}>`);
      if (__props.label) {
        _push(`<label class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">${ssrInterpolate(__props.label)}</label>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative"><button type="button" class="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 group-focus-within:bg-white group-focus-within:border-brand-600"><span class="${ssrRenderClass([__props.modelValue ? "text-slate-900" : "text-slate-400", "truncate"])}">${ssrInterpolate(currentLabel.value)}</span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["w-5 h-5 flex-shrink-0 transition-transform duration-200", isOpen.value ? "rotate-180 text-brand-600" : "text-slate-400"]
      }, null, _parent));
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<div class="absolute z-50 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"><ul class="py-2 max-h-60 overflow-y-auto"><!--[-->`);
        ssrRenderList(__props.options, (option) => {
          _push(`<li class="${ssrRenderClass([
            __props.modelValue === option.value ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50",
            "flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm font-semibold"
          ])}"><span class="truncate">${ssrInterpolate(option.label)}</span>`);
          if (__props.modelValue === option.value) {
            _push(ssrRenderComponent(unref(Check), { class: "w-4 h-4 ml-auto text-brand-600" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</li>`);
        });
        _push(`<!--]--></ul></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomFormSelect.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as _
};
//# sourceMappingURL=CustomFormSelect-2uUQWee9.js.map
