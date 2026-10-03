import { ssrRenderAttrs } from "vue/server-renderer";
import { useSSRContext } from "vue";
import "/Users/marquis/erranders/barter/website/node_modules/hookable/dist/index.mjs";
const _sfc_main = {
  __name: "wallet",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)}><h1 class="text-2xl font-black text-slate-900 mb-6">Wallet &amp; Escrow</h1><div class="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500 font-medium"> Your wallet balance is ₦0.00. Fund your wallet or complete a trade to see your balance. </div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/wallet.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=wallet-BQKhN5P7.js.map
