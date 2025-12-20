<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useForm } from "vuestic-ui";
import { Role } from "../type";
import { getPermission, getMenu } from "../../../services/user.service";

const props = defineProps<{
  role?: Role | null;
  saveButtonLabel?: string;
}>();

const emit = defineEmits<{
  (
    event: "save",
    data: { name: string; guard_name: string; permissions: string[] }
  ): void;
  (event: "close"): void;
}>();

const defaultNewRole = {
  name: "",
  guard_name: "api",
  permissions: [] as string[],
};

// Form state
const formData = ref({ ...defaultNewRole });
const { isValid } = useForm("add-role-form");

// Permissions and menus from API
const allPermissions = ref<any[]>([]);
const allMenus = ref<any[]>([]);
const isLoadingPermissions = ref(false);
const isLoadingMenus = ref(false);

// Selected permission names (not IDs)
const selectedPermissions = ref<Set<string>>(new Set());

// Grouped permissions by module (e.g., "user", "role", etc.)
interface GroupedPermission {
  module: string;
  items: Array<{ name: string; label: string }>;
}

const groupedPermissions = computed<GroupedPermission[]>(() => {
  const groups: Record<string, Array<{ name: string; label: string }>> = {};

  allPermissions.value.forEach((perm) => {
    const parts = perm.name.split(".");
    const module = parts.length > 1 ? parts[0] : "other";
    const action = parts.length > 1 ? parts.slice(1).join(".") : perm.name;

    if (!groups[module]) {
      groups[module] = [];
    }
    groups[module].push({
      name: perm.name,
      label: action,
    });
  });

  return Object.entries(groups)
    .map(([module, items]) => ({
      module,
      items: items.sort((a, b) => a.label.localeCompare(b.label)),
    }))
    .sort((a, b) => a.module.localeCompare(b.module));
});

// Menu structure with hierarchy
interface MenuItem {
  id: string;
  name: string;
  slug: string;
  permission_name: string;
  parent_id: string | null;
  order: number;
  children?: MenuItem[];
}

const menuTree = computed<MenuItem[]>(() => {
  return allMenus.value
    .filter((menu: any) => !menu.parent_id) // Only root level
    .sort((a: any, b: any) => a.order - b.order);
});

// Check if all permissions in a module are selected
const isModuleSelected = (moduleItems: Array<{ name: string }>) => {
  return moduleItems.every((item) => selectedPermissions.value.has(item.name));
};

// Check if some (but not all) permissions in a module are selected
const isModuleIndeterminate = (moduleItems: Array<{ name: string }>) => {
  const selectedCount = moduleItems.filter((item) =>
    selectedPermissions.value.has(item.name)
  ).length;
  return selectedCount > 0 && selectedCount < moduleItems.length;
};

// Toggle all permissions in a module
const toggleModule = (moduleItems: Array<{ name: string }>) => {
  const allSelected = isModuleSelected(moduleItems);
  moduleItems.forEach((item) => {
    if (allSelected) {
      selectedPermissions.value.delete(item.name);
    } else {
      selectedPermissions.value.add(item.name);
    }
  });
};

// Toggle individual permission
const togglePermission = (permissionName: string) => {
  if (selectedPermissions.value.has(permissionName)) {
    selectedPermissions.value.delete(permissionName);
  } else {
    selectedPermissions.value.add(permissionName);
  }
};

// Check if menu permission is selected
const isMenuSelected = (menu: MenuItem): boolean => {
  return selectedPermissions.value.has(menu.permission_name);
};

// Toggle menu permission
const toggleMenu = (menu: MenuItem) => {
  togglePermission(menu.permission_name);

  // Also toggle children
  if (menu.children && menu.children.length > 0) {
    menu.children.forEach((child) => toggleMenu(child));
  }
};

// Check if menu has some children selected
const isMenuIndeterminate = (menu: MenuItem): boolean => {
  if (!menu.children || menu.children.length === 0) return false;

  const childrenStatus = menu.children.map((child) => isMenuSelected(child));
  const selectedCount = childrenStatus.filter(Boolean).length;

  return selectedCount > 0 && selectedCount < menu.children.length;
};

// Fetch permissions and menus
const fetchPermissions = async () => {
  try {
    isLoadingPermissions.value = true;
    const response = await getPermission({ limit: 1000, type: "no-menu" }); // Get all
    allPermissions.value = response.permissions;
  } catch (error) {
    console.error("Failed to fetch permissions:", error);
  } finally {
    isLoadingPermissions.value = false;
  }
};

const fetchMenus = async () => {
  try {
    isLoadingMenus.value = true;
    const response = await getMenu({ limit: 1000 }); // Get all
    allMenus.value = response.menu;
  } catch (error) {
    console.error("Failed to fetch menus:", error);
  } finally {
    isLoadingMenus.value = false;
  }
};

// Initialize form when role prop changes
watch(
  () => props.role,
  () => {
    if (props.role) {
      formData.value = {
        name: props.role.name,
        guard_name: props.role.guard_name,
        permissions: [],
      };
      // Set selected permissions from role
      if (props.role.permissions) {
        selectedPermissions.value = new Set(
          props.role.permissions.map((p: any) =>
            typeof p === "object" ? p.name : p
          )
        );
      }
    } else {
      formData.value = { ...defaultNewRole };
      selectedPermissions.value = new Set();
    }
  },
  { immediate: true }
);

// Load data on mount
onMounted(() => {
  fetchPermissions();
  fetchMenus();
});

// Handle form submit
const onSave = () => {
  if (!isValid.value) return;

  emit("save", {
    name: formData.value.name,
    guard_name: formData.value.guard_name,
    permissions: Array.from(selectedPermissions.value),
  });
};

const isFormHasUnsavedChanges = computed(() => {
  return formData.value.name !== "" || selectedPermissions.value.size > 0;
});

defineExpose({
  isFormHasUnsavedChanges,
});
</script>

<template>
  <VaForm ref="add-role-form" @submit.prevent="onSave">
    <div class="flex flex-col gap-4">
      <!-- Basic Info -->
      <VaInput
        v-model="formData.name"
        label="Role Name"
        placeholder="Enter role name (e.g., Admin CMS)"
        :rules="[(v: string) => !!v || 'Role name is required']"
        required
      />

      <VaInput
        v-model="formData.guard_name"
        label="Guard Name"
        placeholder="api"
        :rules="[(v: string) => !!v || 'Guard name is required']"
        required
      />

      <VaDivider />

      <!-- Permissions Section -->
      <div v-if="isLoadingPermissions" class="flex justify-center py-4">
        <VaProgressCircle indeterminate />
      </div>

      <div v-else class="space-y-4">
        <h3 class="va-h6 mb-2">Permissions</h3>
        <div
          v-for="group in groupedPermissions"
          :key="group.module"
          class="border rounded-lg p-4"
        >
          <!-- Module Header with Select All -->
          <div class="flex items-center gap-2 mb-3 pb-2 border-b">
            <VaCheckbox
              :model-value="isModuleSelected(group.items)"
              :indeterminate="isModuleIndeterminate(group.items)"
              @update:model-value="toggleModule(group.items)"
            />
            <span class="font-semibold text-lg capitalize">{{
              group.module
            }}</span>
            <VaBadge :text="`${group.items.length}`" color="info" />
          </div>

          <!-- Permission Items -->
          <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 ml-6"
          >
            <VaCheckbox
              v-for="item in group.items"
              :key="item.name"
              :model-value="selectedPermissions.has(item.name)"
              :label="item.label"
              @update:model-value="togglePermission(item.name)"
            />
          </div>
        </div>
      </div>

      <VaDivider />

      <!-- Menus Section -->
      <div v-if="isLoadingMenus" class="flex justify-center py-4">
        <VaProgressCircle indeterminate />
      </div>

      <div v-else class="space-y-4">
        <h3 class="va-h6 mb-2">Menu Access (Sidebar)</h3>
        <div class="border rounded-lg p-4">
          <div class="space-y-3">
            <!-- Parent Menu -->
            <div
              v-for="menu in menuTree"
              :key="menu.id"
              class="border-l-2 pl-4"
              :class="
                isMenuSelected(menu) ? 'border-primary' : 'border-gray-300'
              "
            >
              <!-- Parent Checkbox -->
              <div class="flex items-center gap-2 mb-2">
                <VaCheckbox
                  :model-value="isMenuSelected(menu)"
                  :indeterminate="isMenuIndeterminate(menu)"
                  @update:model-value="toggleMenu(menu)"
                />
                <span class="font-semibold">{{ menu.name }}</span>
                <VaBadge
                  v-if="menu.children && menu.children.length > 0"
                  :text="`${menu.children.length}`"
                  color="success"
                  size="small"
                />
              </div>

              <!-- Children Menus -->
              <div
                v-if="menu.children && menu.children.length > 0"
                class="ml-8 space-y-2 mt-2"
              >
                <div
                  v-for="child in menu.children"
                  :key="child.id"
                  class="flex items-center gap-2"
                >
                  <VaCheckbox
                    :model-value="isMenuSelected(child)"
                    @update:model-value="toggleMenu(child)"
                  />
                  <span class="text-sm">{{ child.name }}</span>
                  <VaBadge
                    :text="child.slug"
                    color="info"
                    size="small"
                    class="text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Selected Count -->
      <VaAlert color="info" border="left">
        <template #title>
          Total Selected: {{ selectedPermissions.size }}
        </template>
        {{ selectedPermissions.size }} permissions and menus selected for this
        role
      </VaAlert>

      <!-- Action Buttons -->
      <div class="flex gap-2 justify-end">
        <VaButton preset="secondary" color="secondary" @click="emit('close')">
          Cancel
        </VaButton>
        <VaButton type="submit" :disabled="!isValid">
          {{ saveButtonLabel || "Save" }}
        </VaButton>
      </div>
    </div>
  </VaForm>
</template>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}
</style>
