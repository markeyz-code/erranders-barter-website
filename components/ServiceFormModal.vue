<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[115] flex items-center justify-center sm:p-4 bg-slate-900/50 sm:backdrop-blur-sm"
    @click.self="$emit('close')"
  >
    <div class="bg-white absolute inset-0 sm:relative sm:inset-auto w-full sm:max-w-2xl sm:max-h-[92vh] sm:rounded-2xl border border-slate-200 flex flex-col overflow-hidden">
      <div class="px-4 sm:px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
        <div>
          <h3 class="text-lg font-black text-slate-900">
            {{ isEditing ? 'Edit service' : 'New service' }}
          </h3>
          <p class="text-xs font-semibold text-slate-500 mt-0.5">
            {{ isEditing ? 'Changes apply to future bookings only.' : 'Students book this from the services marketplace.' }}
          </p>
        </div>
        <button
          type="button"
          class="p-2 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
          @click="$emit('close')"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <div class="px-4 sm:px-5 py-5 overflow-y-auto flex-1 space-y-4">
        <!-- Title -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Service title</label>
          <input
            v-model="form.title"
            type="text"
            maxlength="120"
            placeholder="e.g. Mobile fade & beard trim"
            class="w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors"
            :class="errors.title ? 'border-red-300' : 'border-slate-200'"
          />
          <p v-if="errors.title" class="text-[11px] font-bold text-red-600 mt-1">{{ errors.title }}</p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Description</label>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="4000"
            placeholder="What is included, where you work, what the student should prepare…"
            class="w-full bg-slate-50 border rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors resize-none"
            :class="errors.description ? 'border-red-300' : 'border-slate-200'"
          ></textarea>
          <p v-if="errors.description" class="text-[11px] font-bold text-red-600 mt-1">{{ errors.description }}</p>
        </div>

        <!-- Category + pricing model -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-sm font-bold text-slate-700">Category</label>
              <button
                type="button"
                @click="showInlineCategoryInput = !showInlineCategoryInput"
                class="text-xs font-bold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 transition-colors"
              >
                <Plus class="w-3.5 h-3.5" />
                <span>{{ showInlineCategoryInput ? 'Select from list' : '+ New category' }}</span>
              </button>
            </div>

            <!-- Inline category create input -->
            <div v-if="showInlineCategoryInput" class="flex items-center gap-2">
              <input
                v-model="newCategoryInput"
                type="text"
                placeholder="e.g. Barbering, Nail Tech, Tutor..."
                class="w-full bg-slate-50 border rounded-xl px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-900 outline-none focus:border-brand-500 border-slate-200"
                @keydown.enter.prevent="handleCategoryCreate(newCategoryInput)"
              />
              <button
                type="button"
                :disabled="!newCategoryInput.trim() || creatingCategory"
                @click="handleCategoryCreate(newCategoryInput)"
                class="px-3.5 py-2 bg-brand-600 text-white font-bold text-xs rounded-xl hover:bg-brand-700 transition-colors shrink-0 disabled:opacity-40 flex items-center gap-1"
              >
                <Loader2 v-if="creatingCategory" class="w-3.5 h-3.5 animate-spin" />
                <span>{{ creatingCategory ? 'Adding...' : 'Add' }}</span>
              </button>
            </div>

            <!-- CustomSelect with allow-create -->
            <CustomSelect
              v-else
              v-model="form.category"
              :options="categoryOptions"
              placeholder="Select category"
              :allow-create="true"
              @create="handleCategoryCreate"
              class="w-full"
            />
            <p v-if="errors.category" class="text-[11px] font-bold text-red-600 mt-1">{{ errors.category }}</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Pricing</label>
            <CustomSelect
              v-model="form.priceType"
              :options="priceTypeOptions"
              placeholder="Pricing model"
              class="w-full"
              align="right"
            />
          </div>
        </div>

        <!-- Price + duration + buffer -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">
              {{ form.priceType === 'hourly' ? 'Rate per hour (₦)' : form.priceType === 'per_minute' ? 'Rate per minute (₦)' : 'Price (₦)' }}
            </label>
            <div class="relative">
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400">₦</span>
              <input
                v-model="form.price"
                type="number"
                min="0"
                inputmode="decimal"
                :disabled="form.priceType === 'negotiable'"
                :placeholder="form.priceType === 'negotiable' ? 'No price' : form.priceType === 'per_minute' ? 'e.g. 50' : 'e.g. 2500'"
                class="w-full bg-slate-50 border rounded-xl pl-8 pr-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors disabled:opacity-50"
                :class="errors.price ? 'border-red-300' : 'border-slate-200'"
              />
            </div>
            <p v-if="errors.price" class="text-[11px] font-bold text-red-600 mt-1">{{ errors.price }}</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Duration (min)</label>
            <input
              v-model="form.durationMinutes"
              type="number"
              min="1"
              step="5"
              placeholder="e.g. 45"
              class="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors"
              :class="errors.durationMinutes ? 'border-red-300' : 'border-slate-200'"
            />
            <p v-if="errors.durationMinutes" class="text-[11px] font-bold text-red-600 mt-1">
              {{ errors.durationMinutes }}
            </p>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Buffer (min)</label>
            <input
              v-model="form.bufferMinutes"
              type="number"
              min="0"
              step="5"
              placeholder="Cleanup gap"
              class="w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors"
              :class="errors.bufferMinutes ? 'border-red-300' : 'border-slate-200'"
            />
            <p v-if="errors.bufferMinutes" class="text-[11px] font-bold text-red-600 mt-1">
              {{ errors.bufferMinutes }}
            </p>
          </div>
        </div>

        <!-- Location + remote -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Where you deliver it</label>
            <div class="relative">
              <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                v-model="form.location"
                type="text"
                maxlength="200"
                placeholder="e.g. All UNILAG halls"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-bold text-slate-700 mb-1.5">Delivery</label>
            <button
              type="button"
              class="w-full flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-left"
              @click="form.isRemote = !form.isRemote"
            >
              <span class="text-sm font-semibold text-slate-700">
                {{ form.isRemote ? 'Remote — video call' : 'In person' }}
              </span>
              <span
                class="relative w-9 h-5 rounded-full transition-colors shrink-0"
                :class="form.isRemote ? 'bg-brand-600' : 'bg-slate-300'"
              >
                <span
                  class="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform"
                  :class="form.isRemote ? 'translate-x-4' : 'translate-x-0'"
                ></span>
              </span>
            </button>
          </div>
        </div>

        <!-- Tags -->
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-1.5">Tags</label>
          <input
            v-model="form.tagsText"
            type="text"
            placeholder="fades, beard trims, line-ups (comma separated)"
            class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-brand-500 transition-colors"
          />
        </div>

        <!-- Images -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-sm font-bold text-slate-700">Photos</label>
            <span class="text-[11px] font-semibold text-slate-400">{{ form.images.length }}/6</span>
          </div>

          <div class="flex gap-3 flex-wrap">
            <div
              v-for="(image, index) in form.images"
              :key="image"
              class="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group bg-slate-100"
            >
              <img :src="image" alt="Service photo" class="w-full h-full object-cover" />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                @click="form.images.splice(index, 1)"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <label
              v-if="form.images.length < 6"
              class="w-20 h-20 rounded-xl border border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-brand-50 transition-colors"
            >
              <Loader2 v-if="uploading" class="w-5 h-5 text-brand-500 animate-spin" />
              <ImagePlus v-else class="w-5 h-5 text-slate-400" />
              <span class="text-[10px] font-bold text-slate-500 uppercase mt-1">
                {{ uploading ? 'Uploading' : 'Add photo' }}
              </span>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                multiple
                class="hidden"
                :disabled="uploading"
                @change="handleFiles"
              />
            </label>
          </div>
          <p v-if="uploadError" class="text-[11px] font-bold text-red-600 mt-1">{{ uploadError }}</p>
        </div>

        <div v-if="submitError" class="rounded-xl border border-red-200 bg-red-50 p-3">
          <p class="text-sm font-bold text-red-700">{{ submitError }}</p>
        </div>
      </div>

      <div class="px-4 sm:px-5 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 shrink-0">
        <button
          type="button"
          class="px-4 py-2.5 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors"
          :disabled="submitting"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          type="button"
          class="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-black text-sm hover:bg-brand-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="submitting || uploading"
          @click="submit"
        >
          <Loader2 v-if="submitting" class="w-4 h-4 animate-spin" />
          {{ submitting ? 'Saving…' : isEditing ? 'Save changes' : 'Create service' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, Loader2, MapPin, ImagePlus, Plus } from 'lucide-vue-next';
import type { PriceType, Service } from '@/api_factory/modules/services';
import { servicesApi } from '@/api_factory/modules/services';
import type { CreateServicePayload } from '@/api_factory/modules/services';
import { upload_api } from '@/api_factory/modules/upload';
import { categoriesApi } from '@/api_factory/modules/categories';
import CustomSelect from '~/components/CustomSelect.vue';
import {
  getApiError,
  type CategoryOption,
} from '@/composables/modules/services/useServiceFormatting';

interface ServiceFormState {
  title: string;
  description: string;
  category: string;
  priceType: PriceType;
  price: string;
  durationMinutes: string;
  bufferMinutes: string;
  location: string;
  isRemote: boolean;
  tagsText: string;
  images: string[];
}

const props = defineProps<{
  isOpen: boolean;
  service: Service | null;
  categories: CategoryOption[];
}>();

const emit = defineEmits<{
  (event: 'close'): void;
  (event: 'saved', service: Service): void;
}>();

const blankForm = (): ServiceFormState => ({
  title: '',
  description: '',
  category: '',
  priceType: 'fixed',
  price: '',
  durationMinutes: '60',
  bufferMinutes: '0',
  location: '',
  isRemote: false,
  tagsText: '',
  images: [],
});

const form = ref<ServiceFormState>(blankForm());
const errors = ref<Record<string, string>>({});
const submitError = ref('');
const submitting = ref(false);
const uploading = ref(false);
const uploadError = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

const isEditing = computed(() => Boolean(props.service?._id));

const localCategories = ref<CategoryOption[]>([]);
const creatingCategory = ref(false);
const showInlineCategoryInput = ref(false);
const newCategoryInput = ref('');

watch(
  () => props.categories,
  (cats) => {
    if (Array.isArray(cats)) {
      localCategories.value = [...cats];
    }
  },
  { immediate: true },
);

const handleCategoryCreate = async (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return;
  creatingCategory.value = true;
  try {
    const res = await categoriesApi.create({ name: trimmed });
    const catData = res.data?.data || res.data;
    if (catData && (catData._id || catData.id)) {
      const catId = catData._id || catData.id;
      const catName = catData.name || trimmed;
      if (!localCategories.value.some((c) => c._id === catId)) {
        localCategories.value.push({ _id: catId, name: catName });
      }
      form.value.category = catId;
      errors.value.category = '';
      showInlineCategoryInput.value = false;
      newCategoryInput.value = '';
    }
  } catch (err) {
    console.error('Failed to create category', err);
  } finally {
    creatingCategory.value = false;
  }
};

const priceTypeOptions = [
  { value: 'fixed', label: 'Fixed price' },
  { value: 'hourly', label: 'Hourly rate' },
  { value: 'per_minute', label: 'Per minute rate' },
  { value: 'negotiable', label: 'Negotiable' },
];

const categoryOptions = computed(() => {
  const options = localCategories.value.map((category) => ({
    value: category._id,
    label: category.name,
  }));
  const current = props.service?.category;
  const currentId = current && typeof current === 'object' ? current._id : current;
  if (currentId && !options.some((option) => option.value === currentId)) {
    options.unshift({
      value: currentId,
      label: typeof current === 'object' ? current.name : 'Current category',
    });
  }
  return options;
});

const hydrate = () => {
  errors.value = {};
  submitError.value = '';
  uploadError.value = '';
  const service = props.service;

  if (!service) {
    form.value = blankForm();
    return;
  }

  form.value = {
    title: service.title || '',
    description: service.description || '',
    category: typeof service.category === 'object' ? service.category?._id || '' : service.category || '',
    priceType: service.priceType || 'fixed',
    price: service.priceType === 'negotiable' ? '' : String(service.price ?? ''),
    durationMinutes: String(service.durationMinutes ?? 60),
    bufferMinutes: String(service.bufferMinutes ?? 0),
    location: service.location || '',
    isRemote: Boolean(service.isRemote),
    tagsText: (service.tags || []).join(', '),
    images: [...(service.images || [])],
  };
};

watch(() => props.isOpen, (open) => { if (open) hydrate(); }, { immediate: true });
watch(() => props.service, () => { if (props.isOpen) hydrate(); });

const parseTags = (text: string): string[] => {
  const seen = new Set<string>();
  for (const entry of text.split(',')) {
    const clean = entry.trim();
    if (clean) seen.add(clean);
  }
  return [...seen].slice(0, 30);
};

const validate = (): boolean => {
  const next: Record<string, string> = {};
  const title = form.value.title.trim();
  const description = form.value.description.trim();
  const duration = Number(form.value.durationMinutes);
  const buffer = Number(form.value.bufferMinutes || 0);

  if (!title) next.title = 'A title is required.';
  else if (title.length > 120) next.title = 'Keep the title under 120 characters.';

  if (!description) next.description = 'Describe what the student is booking.';

  if (!form.value.category) next.category = 'Pick a category.';

  if (form.value.priceType !== 'negotiable') {
    if (form.value.price === '' || form.value.price === null) {
      next.price = 'A price is required for fixed and hourly services.';
    } else if (!Number.isFinite(Number(form.value.price)) || Number(form.value.price) < 0) {
      next.price = 'Price must be zero or more.';
    }
  }

  if (!Number.isInteger(duration) || duration < 1) {
    next.durationMinutes = 'Use a whole number of at least 1.';
  }

  if (!Number.isInteger(buffer) || buffer < 0) {
    next.bufferMinutes = 'Use a whole number of at least 0.';
  }

  errors.value = next;
  return Object.keys(next).length === 0;
};

const handleFiles = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files ? Array.from(input.files) : [];
  if (!files.length) return;

  uploading.value = true;
  uploadError.value = '';
  try {
    for (const file of files) {
      if (form.value.images.length >= 6) break;
      if (!file.type.startsWith('image/')) continue;
      const response = await upload_api.uploadFile(file, 'image');
      const url = (response.data as { url?: string } | undefined)?.url;
      if (url) form.value.images.push(url);
    }
  } catch (err) {
    uploadError.value = getApiError(err).message;
  } finally {
    uploading.value = false;
    input.value = '';
  }
};

const submit = async () => {
  if (submitting.value) return;
  if (!validate()) return;

  submitting.value = true;
  submitError.value = '';

  const payload: CreateServicePayload = {
    title: form.value.title.trim(),
    description: form.value.description.trim(),
    category: form.value.category,
    priceType: form.value.priceType,
    durationMinutes: Number(form.value.durationMinutes),
    bufferMinutes: Number(form.value.bufferMinutes || 0),
    images: [...form.value.images],
    location: form.value.location.trim(),
    isRemote: form.value.isRemote,
    tags: parseTags(form.value.tagsText),
  };

  if (form.value.priceType !== 'negotiable') {
    payload.price = Number(form.value.price);
  }

  try {
    const response = props.service?._id
      ? await servicesApi.update(props.service._id, payload)
      : await servicesApi.create(payload);
    emit('saved', response.data);
    emit('close');
  } catch (err) {
    submitError.value = getApiError(err).message;
  } finally {
    submitting.value = false;
  }
};
</script>
