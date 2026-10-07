<template>
  <div class="relative group mb-5">
    <label v-if="label" class="block text-sm font-black text-slate-900 mb-2 group-focus-within:text-brand-600 transition-colors">
      {{ label }}
    </label>
    <div class="relative flex items-center">
      <div v-if="$slots.icon" class="absolute left-4 text-slate-400 group-focus-within:text-brand-600 transition-colors">
        <slot name="icon"></slot>
      </div>
      <input 
        :type="actualType" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :required="required"
        class="w-full bg-gray-25 border border-slate-200 rounded-xl py-3 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600"
        :class="[
          $slots.icon ? 'pl-12' : 'pl-4',
          type === 'password' ? 'pr-12' : 'pr-4'
        ]"
      />
      <button 
        v-if="type === 'password'" 
        type="button" 
        @click="showPassword = !showPassword" 
        class="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
      >
        <Eye v-if="!showPassword" class="w-5 h-5" />
        <EyeOff v-else class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed } from 'vue'
import { Eye, EyeOff } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean
})
defineEmits(['update:modelValue'])

const showPassword = ref(false)
const actualType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})
</script>