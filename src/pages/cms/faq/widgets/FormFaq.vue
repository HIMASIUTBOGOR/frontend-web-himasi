<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import { useForm } from "vuestic-ui";
import { Faq } from "../type";
import { validators } from "../../../../services/utils";

const props = defineProps({
  faq: {
    type: Object as PropType<Faq | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewFaq = {
  title: "",
  desc: "",
};

const newFaq = ref({ ...defaultNewFaq });
const imagePreview = ref<string | null>(null);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newFaq.value).some((key) => {
    return (
      newFaq.value[key as keyof typeof newFaq.value] !==
      (props.faq ?? defaultNewFaq)?.[key as keyof typeof defaultNewFaq]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.faq],
  () => {
    if (!props.faq) {
      newFaq.value = { ...defaultNewFaq };
      imagePreview.value = null;
      return;
    }

    newFaq.value = {
      title: props.faq.title,
      desc: props.faq.desc,
    };
  },
  { immediate: true }
);

const form = useForm("add-activity-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newFaq.value);
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
        v-model="newFaq.title"
        label="Title"
        placeholder="Enter activity title"
        class="w-full"
        :rules="[validators.required]"
        name="title"
      />
      <VaTextarea
        v-model="newFaq.desc"
        label="Description"
        placeholder="Enter activity description"
        class="w-full"
        :rules="[validators.required]"
        name="desc"
        :min-rows="3"
        :max-rows="6"
      />

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
