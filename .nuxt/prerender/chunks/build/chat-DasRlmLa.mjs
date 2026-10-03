import { ref, mergeProps, unref, useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrInterpolate, ssrRenderAttr } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { ArrowLeft, Reply, Play, X, Image, Paperclip, Send, Mic } from 'file:///Users/marquis/erranders/barter/website/node_modules/lucide-vue-next/dist/cjs/lucide-vue-next.js';
import { useRoute } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue-router/vue-router.node.mjs';
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

const _sfc_main = {
  __name: "chat",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const { user } = useAuth();
    ref(null);
    const messages = ref([]);
    const newMessage = ref("");
    const replyingTo = ref(null);
    const pendingAsset = ref(null);
    ref(null);
    const isRecording = ref(false);
    ref(route.query.chatId || "test-chat-123");
    const isMine = (msg) => {
      var _a, _b, _c;
      return ((_a = msg.sender) == null ? void 0 : _a._id) === ((_b = user.value) == null ? void 0 : _b._id) || msg.sender === ((_c = user.value) == null ? void 0 : _c._id);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-50 pt-24 pb-16" }, _attrs))}><div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"><div class="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[75vh]"><div class="p-4 border-b border-slate-100 flex items-center justify-between bg-white shadow-sm z-10 relative"><div class="flex items-center gap-3"><button class="p-2 hover:bg-slate-100 rounded-full transition-colors">`);
      _push(ssrRenderComponent(unref(ArrowLeft), { class: "w-5 h-5 text-slate-600" }, null, _parent));
      _push(`</button><div class="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold border border-brand-200"> S </div><div><h2 class="font-bold text-slate-900 leading-tight">Secure Chat</h2><p class="text-xs text-green-500 font-bold flex items-center gap-1"><span class="w-2 h-2 rounded-full bg-green-500 block animate-pulse"></span> Online </p></div></div></div><div class="flex-1 p-4 overflow-y-auto bg-slate-50 flex flex-col gap-4 relative"><!--[-->`);
      ssrRenderList(messages.value, (msg) => {
        _push(`<div class="${ssrRenderClass([isMine(msg) ? "self-end" : "self-start", "max-w-[80%] group"])}"><div class="${ssrRenderClass([isMine(msg) ? "flex-row-reverse" : "flex-row", "flex items-center gap-2 mb-1"])}"><button class="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-brand-600 transition-opacity">`);
        _push(ssrRenderComponent(unref(Reply), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
        if (msg.replyTo) {
          _push(`<div class="${ssrRenderClass([isMine(msg) ? "text-right" : "text-left", "mb-1 p-2 bg-black/5 border-l-4 border-brand-500 rounded text-xs text-slate-500 truncate"])}"> Reply to: &quot;${ssrInterpolate(msg.replyTo.content || "Attachment")}&quot; </div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="${ssrRenderClass([isMine(msg) ? "bg-brand-600 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm", "p-3 rounded-2xl shadow-sm text-sm break-words relative"])}">`);
        if (msg.type === "text") {
          _push(`<div>${ssrInterpolate(msg.content)}</div>`);
        } else if (msg.type === "image") {
          _push(`<div><img${ssrRenderAttr("src", msg.assetUrl)} class="w-full max-w-[200px] rounded-xl object-cover mb-1">`);
          if (msg.content) {
            _push(`<span>${ssrInterpolate(msg.content)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div>`);
        } else if (msg.type === "voice") {
          _push(`<div class="flex items-center gap-2"><button class="p-2 bg-black/10 rounded-full hover:bg-black/20 transition-colors">`);
          _push(ssrRenderComponent(unref(Play), { class: "w-4 h-4" }, null, _parent));
          _push(`</button><div class="w-24 h-1 bg-black/20 rounded-full overflow-hidden"><div class="w-0 h-full bg-black/40"></div></div><span class="text-xs font-bold">${ssrInterpolate(msg.content || "Voice Note")}</span></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><p class="${ssrRenderClass([isMine(msg) ? "text-right mr-1" : "ml-1", "text-[10px] text-slate-400 font-bold mt-1"])}">${ssrInterpolate(new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }))}</p></div>`);
      });
      _push(`<!--]--></div>`);
      if (replyingTo.value) {
        _push(`<div class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between"><div class="text-xs text-slate-600 truncate border-l-4 border-brand-500 pl-2"><span class="font-bold text-brand-600 block">Replying to</span> ${ssrInterpolate(replyingTo.value.content || "Attachment")}</div><button class="text-slate-400 hover:text-slate-600">`);
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      if (pendingAsset.value) {
        _push(`<div class="bg-slate-100 p-3 border-t border-slate-200 flex items-center justify-between"><div class="flex items-center gap-2"><div class="w-10 h-10 bg-slate-200 rounded flex items-center justify-center">`);
        _push(ssrRenderComponent(unref(Image), { class: "w-5 h-5 text-slate-500" }, null, _parent));
        _push(`</div><span class="text-xs font-bold text-slate-600">Image Attached</span></div><button class="text-slate-400 hover:text-slate-600">`);
        _push(ssrRenderComponent(unref(X), { class: "w-4 h-4" }, null, _parent));
        _push(`</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="p-3 bg-white border-t border-slate-100 relative"><form class="flex items-center gap-2"><button type="button" class="p-3 text-slate-400 hover:text-brand-600 bg-slate-50 hover:bg-brand-50 rounded-full transition-colors shrink-0">`);
      _push(ssrRenderComponent(unref(Paperclip), { class: "w-5 h-5" }, null, _parent));
      _push(`</button><input type="file" accept="image/*" class="hidden"><input${ssrRenderAttr("value", newMessage.value)} type="text" placeholder="Type a message..." class="flex-1 bg-slate-50 border border-slate-200 rounded-full py-3 px-5 text-sm outline-none focus:border-brand-500 transition-colors">`);
      if (newMessage.value.trim() || pendingAsset.value) {
        _push(`<button type="submit" class="w-12 h-12 bg-brand-600 hover:bg-brand-700 rounded-full flex items-center justify-center text-white transition-colors shrink-0 shadow-sm">`);
        _push(ssrRenderComponent(unref(Send), { class: "w-5 h-5 ml-1" }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<button type="button" class="${ssrRenderClass([isRecording.value ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-600", "w-12 h-12 rounded-full flex items-center justify-center transition-colors shrink-0 shadow-sm"])}">`);
        _push(ssrRenderComponent(unref(Mic), {
          class: ["w-5 h-5", isRecording.value ? "text-white" : ""]
        }, null, _parent));
        _push(`</button>`);
      }
      _push(`</form></div></div></div></main>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/chat.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=chat-DasRlmLa.mjs.map
