<script setup lang="ts">
import { PropType, computed, ref, watch, onMounted } from "vue";
import { useForm } from "vuestic-ui";
import { Proker } from "../type";
import { validators } from "../../../../services/utils";
import { getDepartemens } from "../../../../services/cms/departement.service";

const props = defineProps({
  proker: {
    type: Object as PropType<Proker | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewProker = {
  departemen_id: "",
  title: "",
  desc: "",
  photo: null as File | null,
  action_link: "",
  is_active: true,
};

const newProker = ref({ ...defaultNewProker });
const imagePreview = ref<string | null>(null);
const departments = ref<Array<{ id: string; title: string }>>([]);
const loadingDepartments = ref(false);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newProker.value).some((key) => {
    if (key === "photo") return false; // Skip image comparison
    return (
      newProker.value[key as keyof typeof newProker.value] !==
      (props.proker ?? defaultNewProker)?.[key as keyof typeof defaultNewProker]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

const fetchDepartments = async () => {
  loadingDepartments.value = true;
  try {
    const response = await getDepartemens({ limit: 100 });
    departments.value = response.departments.map((dept: any) => ({
      id: dept.id,
      title: dept.title,
    }));
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  } finally {
    loadingDepartments.value = false;
  }
};

onMounted(() => {
  fetchDepartments();
});

watch(
  [() => props.proker],
  () => {
    if (!props.proker) {
      newProker.value = { ...defaultNewProker };
      imagePreview.value = null;
      return;
    }

    newProker.value = {
      departemen_id: props.proker.departemen_id,
      title: props.proker.title,
      desc: props.proker.desc,
      photo: null, // Will be set by file input if changed
      action_link: props.proker.action_link || "",
      is_active: props.proker.is_active,
    };
    imagePreview.value = props.proker.photo || null;
  },
  { immediate: true }
);

const form = useForm("add-proker-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newProker.value);
  }
};

const onImageChange = (files: FileList | null) => {
  if (files && files.length > 0) {
    newProker.value.photo = files[0];
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
    ref="add-proker-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaSelect
        v-model="newProker.departemen_id"
        label="Departemen"
        placeholder="Pilih Departemen"
        class="w-full"
        :rules="[validators.required]"
        name="departemen_id"
        :options="departments"
        :loading="loadingDepartments"
        text-by="title"
        value-by="id"
      />

      <VaInput
        v-model="newProker.title"
        label="Title"
        placeholder="Enter proker title"
        class="w-full"
        :rules="[validators.required]"
        name="title"
      />

      <VaTextarea
        v-model="newProker.desc"
        label="Description"
        placeholder="Enter proker description"
        class="w-full"
        :rules="[validators.required]"
        name="desc"
        :min-rows="3"
        :max-rows="6"
      />

      <VaInput
        v-model="newProker.action_link"
        label="Action Links"
        placeholder="Enter action links (optional)"
        class="w-full"
        name="action_link"
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

      <VaSwitch v-model="newProker.is_active" label="Active" class="w-full" />

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
