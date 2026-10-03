import { _ as __nuxt_component_0 } from "./nuxt-link-BGWY_qr-.js";
import { ref, mergeProps, withCtx, unref, createVNode, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr } from "vue/server-renderer";
import { useRouter } from "vue-router";
import { ArrowLeft, ShieldCheck, Truck, Repeat, Check, ChevronDown, MapPin, X, ImagePlus, Video, Loader2, SwitchCamera } from "lucide-vue-next";
import { G as GATEWAY_ENDPOINT } from "./axios.config-ClPwm9qs.js";
import { i as itemsApi } from "./items-6fAIzkhf.js";
import { u as useAuth } from "./useAuth-yB_E1W8S.js";
import { _ as _sfc_main$1 } from "./AuthModal-B-gjX5MQ.js";
import { a as useSeoMeta } from "../server.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/ufo/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/defu/dist/defu.mjs";
import "axios";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/klona/dist/index.mjs";
import "#internal/nuxt/paths";
import "./CustomFormSelect-2uUQWee9.js";
import "/Users/marquis/erranders/barter/website/node_modules/ofetch/dist/node.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/unctx/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/h3/dist/index.mjs";
import "/Users/marquis/erranders/barter/website/node_modules/@unhead/vue/dist/index.mjs";
const uploadApi = {
  image: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return GATEWAY_ENDPOINT.post("/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },
  video: (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return GATEWAY_ENDPOINT.post("/upload/video", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  }
};
const _sfc_main = {
  __name: "sell",
  __ssrInlineRender: true,
  setup(__props) {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const showAuthPrompt = ref(false);
    const showAuthModal = ref(false);
    const pendingAction = ref(null);
    const pendingEvent = ref(null);
    const checkAuth = (actionName, event = null) => {
      if (!isLoggedIn.value) {
        pendingAction.value = actionName;
        if (event) pendingEvent.value = event;
        showAuthPrompt.value = true;
        return false;
      }
      return true;
    };
    const handleAuthSuccess = () => {
      showAuthModal.value = false;
      if (pendingAction.value === "submit") submitListing();
      if (pendingAction.value === "upload") uploadMultiple(pendingEvent.value);
      if (pendingAction.value === "camera") openCamera();
      pendingAction.value = null;
      pendingEvent.value = null;
    };
    const categories = ref([]);
    const catOpen = ref(false);
    const condOpen = ref(false);
    const conditions = ["Brand New", "Like New", "Good", "Fair"];
    const form = ref({
      title: "",
      description: "",
      price: null,
      location: "",
      category: "",
      customCategory: "",
      condition: "Good",
      type: "sell",
      images: []
    });
    useSeoMeta({
      title: "List an Item | Erranders Barter",
      description: "Sell or swap your items securely on the Erranders Barter network.",
      ogTitle: "List an Item | Erranders Barter"
    });
    const loading = ref(false);
    const uploading = ref(false);
    const success = ref(false);
    const uploadMultiple = async (e) => {
      if (!checkAuth("upload", e)) return;
      const files = Array.from(e.target.files);
      if (!files.length) return;
      uploading.value = true;
      try {
        const promises = files.map((file) => uploadApi.image(file));
        const results = await Promise.all(promises);
        results.forEach((res, i) => {
          if (res.data?.url) {
            form.value.images.push({
              url: res.data.url,
              isVideo: files[i].type.startsWith("video/")
            });
          }
        });
      } catch (err) {
        alert("Failed to upload some files");
      } finally {
        uploading.value = false;
        e.target.value = "";
      }
    };
    const cameraOpen = ref(false);
    const isRecording = ref(false);
    const videoEl = ref(null);
    ref(null);
    ref([]);
    const currentFacingMode = ref("environment");
    let currentStream = null;
    const openCamera = async () => {
      if (!checkAuth("camera")) return;
      cameraOpen.value = true;
      await initCamera();
    };
    const initCamera = async () => {
      try {
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }
        currentStream = await (void 0).mediaDevices.getUserMedia({
          video: { facingMode: currentFacingMode.value },
          audio: true
        });
        if (videoEl.value) {
          videoEl.value.srcObject = currentStream;
        }
      } catch (err) {
        alert("Could not access camera/microphone. Please allow permissions.");
        cameraOpen.value = false;
      }
    };
    const submitListing = async () => {
      if (!checkAuth("submit")) return;
      loading.value = true;
      try {
        if (!form.value.price) {
          form.value.type = "swap";
        } else {
          form.value.type = "sell";
        }
        const finalCategory = form.value.category === "Other" ? form.value.customCategory : form.value.category;
        const { data, error } = await itemsApi.create({
          ...form.value,
          category: finalCategory,
          images: form.value.images.map((m) => m.url)
          // Just send urls to backend
        });
        if (error) {
          alert(error);
        } else {
          success.value = true;
          setTimeout(() => router.push("/explore"), 2e3);
        }
      } catch (err) {
        alert("Failed to list item. Please try again.");
      } finally {
        loading.value = false;
      }
    };
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 pt-16 pb-20" }, _attrs))}><div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"><div class="mb-8">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center text-sm font-bold text-slate-500 hover:text-brand-600 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(unref(ArrowLeft), { class: "w-4 h-4 mr-2" }, null, _parent2, _scopeId));
            _push2(` Back to Explore `);
          } else {
            return [
              createVNode(unref(ArrowLeft), { class: "w-4 h-4 mr-2" }),
              createTextVNode(" Back to Explore ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 lg:grid-cols-5 gap-12"><div class="lg:col-span-2 space-y-8"><div><h1 class="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-4"> List an Item </h1><p class="text-lg text-slate-600 font-medium leading-relaxed"> Join thousands of students trading safely on campus. Sell for cash or swap for something you need. </p></div><div class="space-y-6"><div class="flex gap-4 items-start"><div class="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center shrink-0">`);
      _push(ssrRenderComponent(unref(ShieldCheck), { class: "w-5 h-5 text-brand-600" }, null, _parent));
      _push(`</div><div><h3 class="font-bold text-slate-900 mb-1">Escrow Protected</h3><p class="text-sm text-slate-500 font-medium">Your funds are held securely until both parties are satisfied. No scams, no worries.</p></div></div><div class="flex gap-4 items-start"><div class="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">`);
      _push(ssrRenderComponent(unref(Truck), { class: "w-5 h-5 text-green-600" }, null, _parent));
      _push(`</div><div><h3 class="font-bold text-slate-900 mb-1">Optional Errander Delivery</h3><p class="text-sm text-slate-500 font-medium">Buyers can opt to use an Errander to pick up and deliver the item directly to their hostel.</p></div></div><div class="flex gap-4 items-start"><div class="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">`);
      _push(ssrRenderComponent(unref(Repeat), { class: "w-5 h-5 text-purple-600" }, null, _parent));
      _push(`</div><div><h3 class="font-bold text-slate-900 mb-1">Sell or Swap</h3><p class="text-sm text-slate-500 font-medium">Leave the price blank if you&#39;re open to swapping for something else of equal value.</p></div></div></div></div><div class="lg:col-span-3"><div class="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden relative"><div class="p-8 sm:p-10">`);
      if (success.value) {
        _push(`<div class="mb-8 bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl flex items-center gap-4"><div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">`);
        _push(ssrRenderComponent(unref(Check), { class: "w-6 h-6 text-green-600" }, null, _parent));
        _push(`</div><div><h3 class="font-bold text-lg mb-1">Item Listed Successfully!</h3><p class="text-sm font-medium">Taking you to the marketplace...</p></div></div>`);
      } else {
        _push(`<form class="space-y-6"><div><label class="block text-xs font-bold text-slate-700 mb-2">Item Title</label><input${ssrRenderAttr("value", form.value.title)} required type="text" placeholder="e.g. Mini Fridge, barely used" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900"></div><div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-20"><div class="relative"><label class="block text-xs font-bold text-slate-700 mb-2">Category</label><div class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center transition-colors hover:border-brand-500"><span class="font-medium text-slate-900">${ssrInterpolate(form.value.category || "Select Category...")}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 text-slate-400" }, null, _parent));
        _push(`</div>`);
        if (catOpen.value) {
          _push(`<div class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto z-30"><!--[-->`);
          ssrRenderList(categories.value, (c) => {
            _push(`<div class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium border-b last:border-b-0 border-slate-100 flex items-center gap-3"><span>${ssrInterpolate(c.name)}</span></div>`);
          });
          _push(`<!--]--><div class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium">Other</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="relative"><label class="block text-xs font-bold text-slate-700 mb-2">Condition</label><div class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center transition-colors hover:border-brand-500"><span class="font-medium text-slate-900">${ssrInterpolate(form.value.condition || "Select Condition...")}</span>`);
        _push(ssrRenderComponent(unref(ChevronDown), { class: "w-4 h-4 text-slate-400" }, null, _parent));
        _push(`</div>`);
        if (condOpen.value) {
          _push(`<div class="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-30"><!--[-->`);
          ssrRenderList(conditions, (c) => {
            _push(`<div class="px-4 py-3 hover:bg-slate-50 cursor-pointer text-slate-700 font-medium border-b last:border-b-0 border-slate-100">${ssrInterpolate(c)}</div>`);
          });
          _push(`<!--]--></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div></div>`);
        if (form.value.category === "Other") {
          _push(`<div class="mt-4"><label class="block text-xs font-bold text-slate-700 mb-2">Custom Category</label><input${ssrRenderAttr("value", form.value.customCategory)} required type="text" placeholder="e.g. Vintage Collectibles" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900"></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10"><div><label class="block text-xs font-bold text-slate-700 mb-2">Price (₦)</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">₦</span><input${ssrRenderAttr("value", form.value.price)} type="number" placeholder="Leave blank to swap" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900"></div></div><div><label class="block text-xs font-bold text-slate-700 mb-2">Location</label><div class="relative"><span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">`);
        _push(ssrRenderComponent(unref(MapPin), { class: "w-4 h-4" }, null, _parent));
        _push(`</span><input${ssrRenderAttr("value", form.value.location)} required type="text" placeholder="e.g. Mellanby Hall" class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900"></div></div></div><div><label class="block text-xs font-bold text-slate-700 mb-2">Description</label><textarea rows="4" placeholder="Describe the item, any flaws, why you&#39;re selling..." class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 outline-none focus:border-brand-500 transition-colors font-medium text-slate-900 resize-none">${ssrInterpolate(form.value.description)}</textarea></div><div><label class="block text-xs font-bold text-slate-700 mb-2 flex justify-between"><span>Media (Photos/Videos)</span></label><div class="flex gap-4 flex-wrap"><!--[-->`);
        ssrRenderList(form.value.images, (media, idx) => {
          _push(`<div class="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-slate-200 group bg-slate-900 flex items-center justify-center">`);
          if (!media.isVideo) {
            _push(`<img${ssrRenderAttr("src", media.url)} class="w-full h-full object-cover">`);
          } else {
            _push(`<video${ssrRenderAttr("src", media.url)} class="w-full h-full object-cover" autoplay loop muted playsinline></video>`);
          }
          _push(`<button type="button" class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">`);
          _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
          _push(`</button></div>`);
        });
        _push(`<!--]--><label class="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">`);
        _push(ssrRenderComponent(unref(ImagePlus), { class: "w-6 h-6 text-slate-400 mb-1" }, null, _parent));
        if (!uploading.value) {
          _push(`<span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Upload<br>Files</span>`);
        } else {
          _push(`<span class="text-[10px] font-bold text-brand-500 uppercase tracking-widest animate-pulse">Wait...</span>`);
        }
        _push(`<input type="file" accept="image/*,video/*" multiple class="hidden"${ssrIncludeBooleanAttr(uploading.value) ? " disabled" : ""}></label><button type="button" class="w-24 h-24 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors">`);
        _push(ssrRenderComponent(unref(Video), { class: "w-6 h-6 text-slate-400 mb-1" }, null, _parent));
        _push(`<span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center leading-tight">Record<br>Video</span></button></div></div><hr class="border-slate-100"><button type="submit"${ssrIncludeBooleanAttr(loading.value || uploading.value || !form.value.title || !form.value.location) ? " disabled" : ""} class="w-full py-4 rounded-xl text-white font-bold bg-brand-600 hover:bg-brand-700 disabled:opacity-50 disabled:bg-slate-400 transition-all shadow-lg shadow-brand-500/25 flex items-center justify-center text-lg">`);
        if (loading.value) {
          _push(ssrRenderComponent(unref(Loader2), { class: "w-6 h-6 animate-spin mr-2" }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        if (loading.value) {
          _push(`<span>Securing Listing...</span>`);
        } else {
          _push(`<span>Post Item Securely</span>`);
        }
        _push(`</button><p class="text-xs text-center text-slate-500 font-medium mt-4">By posting, you agree to our `);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/terms",
          class: "text-brand-600 hover:underline"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`Terms of Service`);
            } else {
              return [
                createTextVNode("Terms of Service")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</p></form>`);
      }
      _push(`</div>`);
      if (cameraOpen.value) {
        _push(`<div class="absolute inset-0 bg-black z-50 flex flex-col"><div class="p-4 flex justify-between items-center bg-black/50 absolute top-0 left-0 right-0 z-10"><button type="button" class="text-white p-2 rounded-full bg-black/50 hover:bg-black/80">`);
        _push(ssrRenderComponent(unref(X), { class: "w-6 h-6" }, null, _parent));
        _push(`</button><button type="button" class="text-white p-2 rounded-full bg-black/50 hover:bg-black/80 flex items-center gap-2 text-sm font-bold">`);
        _push(ssrRenderComponent(unref(SwitchCamera), { class: "w-5 h-5" }, null, _parent));
        _push(` Flip </button></div><video autoplay playsinline muted class="flex-1 object-cover w-full h-full"></video><div class="absolute bottom-0 left-0 right-0 p-8 flex justify-center items-center bg-gradient-to-t from-black/80 to-transparent">`);
        if (!isRecording.value) {
          _push(`<button type="button" class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-500/80 hover:bg-red-500 transition-colors"><div class="w-6 h-6 bg-white rounded-full"></div></button>`);
        } else {
          _push(`<button type="button" class="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-red-500 animate-pulse"><div class="w-6 h-6 bg-white rounded-md"></div></button>`);
        }
        _push(`</div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div></div>`);
      if (showAuthPrompt.value) {
        _push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm"><div class="bg-white w-full max-w-md rounded-3xl p-8 text-center shadow-2xl relative"><h3 class="text-2xl font-black text-slate-900 mb-4">Almost there!</h3><p class="text-slate-600 font-medium mb-8">Please, we know you want to list your item to get it sold, but to help you track and easily manage your items, you need to sign up or log in first.</p><div class="flex gap-4 justify-center"><button class="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors">Cancel</button><button class="px-6 py-3 bg-brand-600 text-white font-bold rounded-xl hover:bg-brand-700 shadow-lg transition-colors">Login / Sign up</button></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_sfc_main$1, {
        isOpen: showAuthModal.value,
        onClose: ($event) => showAuthModal.value = false,
        onSuccess: handleAuthSuccess
      }, null, _parent));
      _push(`</main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/sell.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=sell-Bn6Z6kKR.js.map
