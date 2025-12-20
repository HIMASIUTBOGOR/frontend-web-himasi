<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import { useForm, VaInput } from "vuestic-ui";
import { Benefit } from "../type";
import { validators } from "../../../../services/utils";

const props = defineProps({
  benefit: {
    type: Object as PropType<Benefit | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewBenefit = {
  desc: "",
  photo: null as File | null,
  title: "",
};

const newBenefit = ref({ ...defaultNewBenefit });
const imagePreview = ref<string | null>(null);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newBenefit.value).some((key) => {
    if (key === "photo") return false; // Skip image comparison
    return (
      newBenefit.value[key as keyof typeof newBenefit.value] !==
      (props.benefit ?? defaultNewBenefit)?.[
        key as keyof typeof defaultNewBenefit
      ]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.benefit],
  () => {
    if (!props.benefit) {
      newBenefit.value = { ...defaultNewBenefit };
      imagePreview.value = null;
      return;
    }

    newBenefit.value = {
      desc: props.benefit.desc,
      title: props.benefit.title,
      photo: null, // Will be set by file input if changed
    };
    imagePreview.value = props.benefit.photo || null;
  },
  { immediate: true }
);

const form = useForm("add-activity-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newBenefit.value);
  }
};

const onImageChange = (files: FileList | null) => {
  if (files && files.length > 0) {
    newBenefit.value.photo = files[0];
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(files[0]);
  }
};
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-activity-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaInput
        v-model="newBenefit.title"
        label="Title"
        placeholder="Enter benefit title"
        class="w-full"
        :rules="[validators.required]"
        name="title"
        :min-rows="3"
        :max-rows="6"
      />
      <VaTextarea
        v-model="newBenefit.desc"
        label="Description"
        placeholder="Enter benefit description"
        class="w-full"
        :rules="[validators.required]"
        name="desc"
        :min-rows="3"
        :max-rows="6"
      />

      <div class="w-full">
        <label class="va-input-label">Photo</label>
        <input
          type="file"
          accept="image/*"
          class="w-full p-2 border rounded"
          @change="(e) => onImageChange((e.target as HTMLInputElement).files)"
        />

        <!-- Image Preview -->
        <div v-if="imagePreview" class="mt-2">
          <img :src="imagePreview" alt="Preview" class="max-h-48 rounded" />
        </div>
      </div>
      <div
        class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center"
      >
        <VaButton preset="secondary" color="secondary" @click="$emit('close')"
          >Cancel</VaButton
        >
        <VaButton :disabled="!isValid" @click="onSave">{{
          saveButtonLabel
        }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
