<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import { useForm, VaInput } from "vuestic-ui";
import { Departemen } from "../type";
import { validators } from "../../../../services/utils";

const props = defineProps({
  departemen: {
    type: Object as PropType<Departemen | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewDepartemen = {
  desc: "",
  icon: "",
  title: "",
};

const newDepartemen = ref({ ...defaultNewDepartemen });

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newDepartemen.value).some((key) => {
    if (key === "icon") return false; // Skip image comparison
    return (
      newDepartemen.value[key as keyof typeof newDepartemen.value] !==
      (props.departemen ?? defaultNewDepartemen)?.[
        key as keyof typeof defaultNewDepartemen
      ]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.departemen],
  () => {
    if (!props.departemen) {
      newDepartemen.value = { ...defaultNewDepartemen };
      return;
    }

    newDepartemen.value = {
      desc: props.departemen.desc,
      title: props.departemen.title,
      icon: props.departemen.icon,
    };
  },
  { immediate: true }
);

const form = useForm("add-activity-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newDepartemen.value);
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
        v-model="newDepartemen.title"
        label="Title"
        placeholder="Enter Departemen title"
        class="w-full"
        :rules="[validators.required]"
        name="title"
        :min-rows="3"
        :max-rows="6"
      />
      <VaTextarea
        v-model="newDepartemen.desc"
        label="Description"
        placeholder="Enter Departemen description"
        class="w-full"
        :rules="[validators.required]"
        name="desc"
        :min-rows="3"
        :max-rows="6"
      />

      <VaInput
        v-model="newDepartemen.icon"
        label="icon"
        placeholder="Enter Departemen icon"
        class="w-full"
        :rules="[validators.required]"
        name="icon"
        :min-rows="3"
        :max-rows="6"
      >
        <template #messages>
          Icon dapat dilihat di
          <a
            href="https://icon-sets.iconify.design/"
            target="_blank"
            class="text-blue-500 hover:underline"
            >https://icon-sets.iconify.design/</a
          >
        </template>
      </VaInput>
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
