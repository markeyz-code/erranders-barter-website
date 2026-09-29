<template>
  <div class="relative group mb-5">
    <label v-if="label" class="block text-xs font-black tracking-widest text-slate-400 uppercase mb-2 group-focus-within:text-brand-600 transition-colors">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <div v-if="$slots.icon" class="absolute left-4 text-slate-400 group-focus-within:text-brand-600 transition-colors">
        <slot name="icon"></slot>
      </div>
      <input 
        :type="type" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        class="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pr-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10"
        :class="[$slots.icon ? 'pl-12' : 'pl-4']"
      />
    </div>
  </div>
</template>
<script setup>
defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean
})
defineEmits(['update:modelValue'])
</script>