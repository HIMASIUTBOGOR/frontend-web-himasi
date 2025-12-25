<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import { useForm, VaInput } from "vuestic-ui";
import { Enumeration } from "../type";
import { validators } from "../../../../services/utils";

const props = defineProps({
  enumeration: {
    type: Object as PropType<Enumeration | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewEnumeration = {
  key: "",
  value: "",
};

const newEnumeration = ref({ ...defaultNewEnumeration });
const imagePreview = ref<string | null>(null);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newEnumeration.value).some((key) => {
    if (key === "photo") return false; // Skip image comparison
    return (
      newEnumeration.value[key as keyof typeof newEnumeration.value] !==
      (props.enumeration ?? defaultNewEnumeration)?.[
        key as keyof typeof defaultNewEnumeration
      ]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.enumeration],
  () => {
    if (!props.enumeration) {
      newEnumeration.value = { ...defaultNewEnumeration };
      imagePreview.value = null;
      return;
    }

    newEnumeration.value = {
      key: props.enumeration.key,
      value: props.enumeration.value,
    };
  },
  { immediate: true }
);

const form = useForm("add-activity-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newEnumeration.value);
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
        v-model="newEnumeration.key"
        label="Key"
        placeholder="Enter enumeration key"
        class="w-full"
        :rules="[validators.required]"
        name="key"
        :min-rows="3"
        :max-rows="6"
      />
      <VaInput
        v-model="newEnumeration.value"
        label="Value"
        placeholder="Enter enumeration value"
        class="w-full"
        :rules="[validators.required]"
        name="value"
        :min-rows="3"
        :max-rows="6"
      />
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
  </VaForm>
</template>
