import { _ as __nuxt_component_0 } from './nuxt-link-BGWY_qr-.mjs';
import { computed, ref, watch, mergeProps, withCtx, createTextVNode, unref, createVNode, toDisplayString, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrRenderClass } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { MapPin, ChevronDown, Check } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { useRoute } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
import { i as itemsApi } from './items-6fAIzkhf.mjs';
import { a as useSeoMeta } from './server.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs';
import './axios.config-ClPwm9qs.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/axios/index.js';
import 'file:///Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs';
import '../_/renderer.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import 'file:///Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs';
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

const _sfc_main$1 = {
  __name: "CustomSelect",
  __ssrInlineRender: true,
  props: {
    modelValue: { type: [String, Number, null], default: "" },
    options: {
      type: Array,
      required: true
      // Each option: { value: string, label: string }
    },
    placeholder: { type: String, default: "Select..." }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const isOpen = ref(false);
    const selectRef = ref(null);
    const currentLabel = computed(() => {
      const found = props.options.find((o) => o.value === props.modelValue);
      return found ? found.label : props.placeholder;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        class: "relative",
        ref_key: "selectRef",
        ref: selectRef
      }, _attrs))}><button type="button" class="${ssrRenderClass([isOpen.value ? "border-brand-600 shadow-lg shadow-brand-600/10 ring-2 ring-brand-600/10" : "border-slate-200 hover:border-slate-300", "flex items-center justify-between gap-2 border rounded-full px-5 py-2.5 bg-white font-bold text-sm outline-none transition-all min-w-[160px]"])}"><span class="${ssrRenderClass([__props.modelValue ? "text-slate-900" : "text-slate-400", "truncate"])}">${ssrInterpolate(currentLabel.value)}</span>`);
      _push(ssrRenderComponent(unref(ChevronDown), {
        class: ["w-4 h-4 flex-shrink-0 transition-transform duration-200", isOpen.value ? "rotate-180 text-brand-600" : "text-slate-400"]
      }, null, _parent));
      _push(`</button>`);
      if (isOpen.value) {
        _push(`<div class="absolute z-50 top-full right-0 mt-2 w-full min-w-[200px] bg-white border border-slate-200 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] overflow-hidden"><ul class="py-2 max-h-60 overflow-y-auto"><!--[-->`);
        ssrRenderList(__props.options, (option) => {
          _push(`<li class="${ssrRenderClass([
            __props.modelValue === option.value ? "bg-brand-50 text-brand-700" : "text-slate-700 hover:bg-slate-50",
            "flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors text-sm font-semibold"
          ])}"><span class="${ssrRenderClass([
            __props.modelValue === option.value ? "border-brand-600 bg-brand-600" : "border-slate-300",
            "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors"
          ])}">`);
          if (__props.modelValue === option.value) {
            _push(ssrRenderComponent(unref(Check), { class: "w-2.5 h-2.5 text-white" }, null, _parent));
          } else {
            _push(`<!---->`);
          }
          _push(`</span><span class="truncate">${ssrInterpolate(option.label)}</span></li>`);
        });
        _push(`<!--]--></ul></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CustomSelect.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "explore",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const searchQuery = computed(() => route.query.q || "");
    useSeoMeta({
      title: computed(() => searchQuery.value ? `Search Results for "${searchQuery.value}" | Erranders Barter` : "Explore Items | Erranders Barter"),
      description: "Discover everything available on the Erranders network. Buy, sell, and swap electronics, textbooks, and more.",
      ogTitle: "Explore Erranders Barter",
      ogDescription: "Discover amazing deals from students around you on the Erranders network."
    });
    const selectedCategory = ref("");
    const selectedSort = ref("newest");
    const categoryOptions = [
      { value: "", label: "All Categories" },
      { value: "electronics", label: "Electronics" },
      { value: "books", label: "Books" },
      { value: "appliances", label: "Appliances" },
      { value: "fashion", label: "Fashion" },
      { value: "services", label: "Services" }
    ];
    const sortOptions = [
      { value: "newest", label: "Newest First" },
      { value: "price_asc", label: "Price: Low to High" },
      { value: "price_desc", label: "Price: High to Low" }
    ];
    const items = ref([]);
    const loading = ref(true);
    const error = ref("");
    const fetchItems = async () => {
      loading.value = true;
      try {
        const params = {};
        if (searchQuery.value) params.q = searchQuery.value;
        if (selectedCategory.value) params.category = selectedCategory.value;
        if (selectedSort.value && selectedSort.value !== "newest") params.sort = selectedSort.value;
        const { data, error: apiError } = await itemsApi.list(params);
        if (apiError) {
          error.value = apiError;
        } else {
          items.value = data;
        }
      } catch (err) {
        error.value = "Failed to load items.";
      } finally {
        loading.value = false;
      }
    };
    watch([searchQuery, selectedCategory, selectedSort], () => {
      fetchItems();
    });
    const filteredItems = computed(() => {
      return items.value;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-white pt-24 pb-16" }, _attrs))}><div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8"><div><h1 class="text-4xl font-black text-slate-900 mb-2">${ssrInterpolate(searchQuery.value ? "Search Results" : "Explore")}</h1><p class="text-slate-500 font-medium">${ssrInterpolate(searchQuery.value ? 'Found items matching "' + searchQuery.value + '"' : "Discover everything available on the Erranders network.")}</p></div><div class="flex gap-3">`);
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: selectedCategory.value,
        "onUpdate:modelValue": ($event) => selectedCategory.value = $event,
        options: categoryOptions,
        placeholder: "All Categories"
      }, null, _parent));
      _push(ssrRenderComponent(_sfc_main$1, {
        modelValue: selectedSort.value,
        "onUpdate:modelValue": ($event) => selectedSort.value = $event,
        options: sortOptions,
        placeholder: "Sort By"
      }, null, _parent));
      _push(`</div></div>`);
      if (loading.value) {
        _push(`<div class="py-20 flex flex-col items-center justify-center"><div class="w-12 h-12 border-4 border-slate-200 border-t-brand-600 rounded-full animate-spin mb-4"></div><p class="text-slate-500 font-bold">Loading items...</p></div>`);
      } else if (filteredItems.value.length === 0) {
        _push(`<div class="py-20 text-center border border-slate-200 border-dashed rounded-3xl"><h2 class="text-2xl font-bold text-slate-400 mb-2">No items found for &quot;${ssrInterpolate(searchQuery.value)}&quot;</h2>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/explore",
          class: "text-brand-600 font-bold hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Clear Search`);
            } else {
              return [
                createTextVNode("Clear Search")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"><!--[-->`);
        ssrRenderList(filteredItems.value, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item._id,
            to: "/item/" + item._id,
            class: "group block bg-white border border-slate-200 rounded-[2rem] p-4 hover:border-brand-600 transition-colors"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              var _a, _b;
              if (_push2) {
                _push2(`<div class="aspect-square bg-slate-100 rounded-3xl mb-4 overflow-hidden relative"${_scopeId}><img${ssrRenderAttr("src", ((_a = item.images) == null ? void 0 : _a[0]) || "https://via.placeholder.com/600")} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"${_scopeId}><div class="absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border border-slate-200"${_scopeId}>${ssrInterpolate(item.type)}</div></div><div class="px-2 pb-2"${_scopeId}><div class="flex justify-between items-start mb-1 gap-2"${_scopeId}><h3 class="font-bold text-lg truncate text-slate-900"${_scopeId}>${ssrInterpolate(item.title)}</h3><span class="font-black text-brand-600 text-lg flex-shrink-0"${_scopeId}>\u20A6${ssrInterpolate(item.price)}</span></div><p class="text-sm text-slate-500 flex items-center gap-1"${_scopeId}>`);
                _push2(ssrRenderComponent(unref(MapPin), { class: "w-3.5 h-3.5" }, null, _parent2, _scopeId));
                _push2(` ${ssrInterpolate(item.location)}</p></div>`);
              } else {
                return [
                  createVNode("div", { class: "aspect-square bg-slate-100 rounded-3xl mb-4 overflow-hidden relative" }, [
                    createVNode("img", {
                      src: ((_b = item.images) == null ? void 0 : _b[0]) || "https://via.placeholder.com/600",
                      class: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    }, null, 8, ["src"]),
                    createVNode("div", { class: "absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black border border-slate-200" }, toDisplayString(item.type), 1)
                  ]),
                  createVNode("div", { class: "px-2 pb-2" }, [
                    createVNode("div", { class: "flex justify-between items-start mb-1 gap-2" }, [
                      createVNode("h3", { class: "font-bold text-lg truncate text-slate-900" }, toDisplayString(item.title), 1),
                      createVNode("span", { class: "font-black text-brand-600 text-lg flex-shrink-0" }, "\u20A6" + toDisplayString(item.price), 1)
                    ]),
                    createVNode("p", { class: "text-sm text-slate-500 flex items-center gap-1" }, [
                      createVNode(unref(MapPin), { class: "w-3.5 h-3.5" }),
                      createTextVNode(" " + toDisplayString(item.location), 1)
                    ])
                  ])
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/explore.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=explore-5Xh39WBE.mjs.map
