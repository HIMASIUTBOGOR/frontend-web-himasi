<script setup lang="ts">
import { PropType, computed, ref, watch } from "vue";
import { useForm } from "vuestic-ui";
import { Permission } from "../type";
import { validators } from "../../../services/utils";

const props = defineProps({
  permission: {
    type: Object as PropType<Permission | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewPermission = {
  name: "",
  guard_name: "api",
};

const newPermission = ref({ ...defaultNewPermission });

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newPermission.value).some((key) => {
    return (
      newPermission.value[key as keyof typeof newPermission.value] !==
      (props.permission ?? defaultNewPermission)?.[
        key as keyof typeof defaultNewPermission
      ]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.permission],
  () => {
    if (!props.permission) {
      newPermission.value = { ...defaultNewPermission };
      return;
    }

    newPermission.value = {
      name: props.permission.name,
      guard_name: props.permission.guard_name,
    };
  },
  { immediate: true }
);

const form = useForm("add-permission-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    emit("save", newPermission.value);
  }
};
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-permission-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaInput
        v-model="newPermission.name"
        label="Permission Name"
        placeholder="e.g., menu.cms.activities"
        class="w-full"
        :rules="[validators.required]"
        name="name"
      />

      <VaInput
        v-model="newPermission.guard_name"
        label="Guard Name"
        placeholder="e.g., api"
        class="w-full"
        :rules="[validators.required]"
        name="guard_name"
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
