<script setup lang="ts">
import { PropType, computed, ref, watch, onMounted } from "vue";
import { useForm } from "vuestic-ui";
import { Menu } from "../type";
import { validators } from "../../../services/utils";
import { getMenu } from "../../../services/user.service";

const props = defineProps({
  menu: {
    type: Object as PropType<Menu | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewMenu = {
  name: "",
  url: "",
  icon: "",
  permission_name: null as string | null,
  parent_id: null as string | null,
  order: 1,
};

const newMenu = ref({ ...defaultNewMenu });
const parentMenus = ref<Menu[]>([]);
const loadingParents = ref(false);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newMenu.value).some((key) => {
    return (
      newMenu.value[key as keyof typeof newMenu.value] !==
      (props.menu ?? defaultNewMenu)?.[key as keyof typeof defaultNewMenu]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

const fetchParentMenus = async () => {
  try {
    loadingParents.value = true;
    const response = await getMenu({ limit: 1000, page: 1 });
    // Filter out current menu and only show parent menus (those without parent_id)
    parentMenus.value = response.menu.filter(
      (m: Menu) => (!props.menu || m.id !== props.menu.id) && !m.parent_id
    );
  } catch (error) {
    console.error("Failed to fetch parent menus:", error);
  } finally {
    loadingParents.value = false;
  }
};

onMounted(() => {
  fetchParentMenus();
});

watch(
  [() => props.menu],
  () => {
    if (!props.menu) {
      newMenu.value = { ...defaultNewMenu };
      return;
    }

    newMenu.value = {
      name: props.menu.name,
      url: props.menu.url,
      icon: props.menu.icon ?? "",
      permission_name: props.menu.permission_name,
      parent_id: props.menu.parent_id,
      order: props.menu.order,
    };
  },
  { immediate: true }
);

const form = useForm("add-menu-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    // Prepare data with proper types
    const menuData = {
      ...newMenu.value,
      parent_id: newMenu.value.parent_id || null,
      order: Number(newMenu.value.order),
    };
    emit("save", menuData);
  }
};

// Parent menu options for select
const parentMenuOptions = computed(() => {
  return [
    { text: "None (Root Menu)", value: null },
    ...parentMenus.value.map((menu) => ({
      text: menu.name,
      value: menu.id,
    })),
  ];
});
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-menu-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <VaInput
        v-model="newMenu.name"
        label="Menu Name"
        placeholder="e.g., CMS"
        class="w-full"
        :rules="[validators.required]"
        name="name"
      />

      <VaInput
        v-model="newMenu.url"
        label="URL"
        placeholder="e.g., /cms"
        class="w-full"
        :rules="[validators.required]"
        name="url"
      />
      <VaInput
        v-model="newMenu.icon"
        label="Icon (optional)"
        placeholder="e.g., material-symbols:dashboard"
        class="w-full"
        name="icon"
      />

      <VaInput
        :rules="[validators.required]"
        v-model="newMenu.permission_name"
        label="Permission Name"
        placeholder="e.g., menu.cms"
        class="w-full"
        name="permission_name"
      />

      <VaSelect
        v-model="newMenu.parent_id"
        label="Parent Menu"
        placeholder="Select parent menu"
        class="w-full"
        :options="parentMenuOptions"
        :loading="loadingParents"
        text-by="text"
        value-by="value"
        name="parent_id"
      />

      <VaInput
        v-model="newMenu.order"
        label="Order"
        placeholder="1"
        type="number"
        class="w-full"
        :rules="[validators.required]"
        name="order"
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
