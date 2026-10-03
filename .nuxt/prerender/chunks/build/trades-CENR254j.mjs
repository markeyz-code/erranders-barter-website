import { ssrRenderAttrs } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/server-renderer/index.mjs';
import { useSSRContext } from 'file:///Users/marquis/erranders/barter/website/node_modules/vue/index.mjs';

const _sfc_main = {
  __name: "trades",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-black text-slate-900 mb-6">My Trades</h1><div class="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 font-medium"> No trades yet. Your trade history will appear here. </div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/trades.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=trades-CENR254j.mjs.map
