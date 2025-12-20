<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import { useForm } from "vuestic-ui";
import { Activity } from "../type";
import { validators } from "../../../../services/utils";

const props = defineProps({
  activity: {
    type: Object as PropType<Activity | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewActivity = {
  desc: "",
  image: null as File | null,
  is_active: true,
  upload_at: new Date(),
};

const newActivity = ref({ ...defaultNewActivity });
const imagePreview = ref<string | null>(null);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newActivity.value).some((key) => {
    if (key === "image") return false; // Skip image comparison
    return (
      newActivity.value[key as keyof typeof newActivity.value] !==
      (props.activity ?? defaultNewActivity)?.[
        key as keyof typeof defaultNewActivity
      ]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.activity],
  () => {
    if (!props.activity) {
      newActivity.value = { ...defaultNewActivity };
      imagePreview.value = null;
      return;
    }

    newActivity.value = {
      desc: props.activity.desc,
      image: null, // Will be set by file input if changed
      is_active: props.activity.is_active,
      upload_at: props.activity.upload_at
        ? new Date(props.activity.upload_at)
        : new Date(),
    };
    imagePreview.value = props.activity.image || null;
  },
  { immediate: true }
);

const form = useForm("add-activity-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newActivity.value);
  }
};

const onImageChange = (files: FileList | null) => {
  if (files && files.length > 0) {
    newActivity.value.image = files[0];
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
      <VaTextarea
        v-model="newActivity.desc"
        label="Description"
        placeholder="Enter activity description"
        class="w-full"
        :rules="[validators.required]"
        name="desc"
        :min-rows="3"
        :max-rows="6"
      />

      <div class="w-full">
        <label class="va-input-label">Image</label>
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

      <VaDateInput
        v-model="newActivity.upload_at"
        label="Upload Date"
        class="w-full"
        :rules="[validators.required]"
        name="upload_at"
      />

      <VaSwitch v-model="newActivity.is_active" label="Active" class="w-full" />

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
