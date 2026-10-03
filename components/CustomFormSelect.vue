<template>
  <div class="relative group mb-5">
    <label v-if="label" class="block text-xs font-black text-slate-400 mb-2 group-focus-within:text-brand-600 transition-colors">
      {{ label }}
    </label>
    <div class="relative" ref="selectRef">
      <button
        type="button"
        @click="toggle"
        class="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 transition-all outline-none font-bold text-slate-900 focus:bg-white focus:border-brand-600 group-focus-within:bg-white group-focus-within:border-brand-600"
      >
        <span class="truncate" :class="modelValue ? 'text-slate-900' : 'text-slate-400'">
          {{ currentLabel }}
        </span>
        <ChevronDown
          class="w-5 h-5 flex-shrink-0 transition-transform duration-200"
          :class="isOpen ? 'rotate-180 text-brand-600' : 'text-slate-400'"
        />
      </button>

      <Transition
        enter-active-class="transition duration-150 ease-out"
        enter-from-class="opacity-0 translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-2"
      >
        <div
          v-if="isOpen"
          class="absolute z-50 top-full mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
        >
          <ul class="py-2 max-h-60 overflow-y-auto">
            <li
              v-for="option in options"
              :key="option.value"
              @click="selectOption(option)"
              class="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors text-sm font-semibold"
              :class="
                modelValue === option.value
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-slate-700 hover:bg-slate-50'
              "
            >
              <span class="truncate">{{ option.label }}</span>
              <Check v-if="modelValue === option.value" class="w-4 h-4 ml-auto text-brand-600" />
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: { type: [String, Number, null], default: '' },
  label: String,
  options: {
    type: Array,
    required: true,
  },
  placeholder: { type: String, default: 'Select...' }
})

const emit = defineEmits(['update:modelValue'])

const isOpen = ref(false)
const selectRef = ref(null)

const currentLabel = computed(() => {
  const found = props.options.find(o => o.value === props.modelValue)
  return found ? found.label : props.placeholder
})

const toggle = () => {
  isOpen.value = !isOpen.value
}

const selectOption = (option) => {
  emit('update:modelValue', option.value)
  isOpen.value = false
}

const handleClickOutside = (e) => {
  if (selectRef.value && !selectRef.value.contains(e.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
