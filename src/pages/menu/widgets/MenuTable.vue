<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from "vuestic-ui";
import { PropType, computed, toRef, ref } from "vue";
import { Pagination, Sorting } from "../../../data/pages/users";
import { useVModel } from "@vueuse/core";
import { Menu } from "../type";
import { Icon } from "@iconify/vue";

const columns = defineVaDataTableColumns([
  { label: "No", key: "number", sortable: false },
  { label: "Name", key: "name", sortable: true },
  { label: "Parent Menu", key: "parent_id", sortable: false },
  { label: "URL", key: "url", sortable: true },
  { label: "Icon", key: "icon", sortable: false },
  { label: "Permission", key: "permission_name", sortable: false },
  { label: "Order", key: "order", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  menu: {
    type: Array as PropType<Menu[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting["sortBy"]>, required: true },
  sortingOrder: {
    type: String as PropType<Sorting["sortingOrder"]>,
    default: null,
  },
  canEdit: { type: Boolean, default: false },
  canDelete: { type: Boolean, default: false },
});

const emit = defineEmits<{
  (event: "edit-menu", menu: Menu): void;
  (event: "delete-menu", menu: Menu): void;
  (event: "update:sortBy", sortBy: Sorting["sortBy"]): void;
  (event: "update:sortingOrder", sortingOrder: Sorting["sortingOrder"]): void;
}>();

const menu = toRef(props, "menu");
const sortByVModel = useVModel(props, "sortBy", emit);
const sortingOrderVModel = useVModel(props, "sortingOrder", emit);

const totalPages = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.perPage)
);

const { confirm } = useModal();

const onDeleteMenu = async (menu: Menu) => {
  const agreed = await confirm({
    title: "Delete menu",
    message: `Are you sure you want to delete ${menu.name}?`,
    okText: "Delete",
    cancelText: "Cancel",
    size: "small",
    maxWidth: "380px",
  });

  if (agreed) {
    // Pastikan menu memiliki ID yang valid
    if (menu.id) {
      emit("delete-menu", menu);
    } else {
      console.error("Menu ID is invalid", menu);
    }
  }
};

// Flatten menu structure - tampilkan semua langsung dengan children
const flattenedMenus = computed(() => {
  const flattened: Array<
    Menu & { isChild?: boolean; parentName?: string; displayNumber?: number }
  > = [];
  let parentNumber = 0;

  props.menu.forEach((menu) => {
    parentNumber++;
    flattened.push({
      ...menu,
      isChild: false,
      displayNumber: parentNumber,
    });

    // Tampilkan semua children langsung tanpa nomor
    if (menu.children && menu.children.length > 0) {
      menu.children.forEach((child) => {
        flattened.push({
          ...child,
          isChild: true,
          parentName: menu.name,
          children: [],
          displayNumber: undefined, // Child tidak punya nomor
        });
      });
    }
  });

  return flattened;
});
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="flattenedMenus"
    :loading="$props.loading"
  >
    <template #cell(number)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.displayNumber || "" }}
      </div>
    </template>
    <template #cell(name)="{ rowData }">
      <div class="flex items-center gap-2 ellipsis">
        <!-- Arrow untuk child menu -->
        <span v-if="rowData.isChild" class="child-arrow text-secondary">↳</span>

        <!-- Menu icon untuk parent yang punya icon -->
        <!-- <Icon
          v-if="rowData.icon && !rowData.isChild"
          :icon="rowData.icon"
          :width="20"
          :height="20"
        /> -->

        <!-- Menu name -->
        <span>{{ rowData.name }}</span>
      </div>
    </template>

    <template #cell(parent_id)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        {{ rowData.parentName || "-" }}
      </div>
    </template>

    <template #cell(url)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.url }}
      </div>
    </template>

    <template #cell(icon)="{ rowData }">
      <div class="ellipsis max-w-[150px]">
        <Icon
          v-if="rowData.icon && !rowData.isChild"
          :icon="rowData.icon"
          :width="20"
          :height="20"
          class="mr-2"
        />
      </div>
    </template>

    <template #cell(permission_name)="{ rowData }">
      <div class="ellipsis max-w-[200px]">
        {{ rowData.permission_name || "-" }}
      </div>
    </template>

    <template #cell(order)="{ rowData }">
      <div class="text-center">
        {{ rowData.order }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          v-if="canEdit"
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit menu"
          @click="$emit('edit-menu', rowData as Menu)"
        />
        <VaButton
          v-if="canDelete"
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete menu"
          @click="onDeleteMenu(rowData as Menu)"
        />
      </div>
    </template>
  </VaDataTable>

  <div
    class="flex flex-col-reverse md:flex-row gap-2 justify-between items-center py-2"
  >
    <div>
      <b>{{ $props.pagination.total }} results.</b>
      Results per page
      <VaSelect
        v-model="$props.pagination.perPage"
        class="!w-20"
        :options="[10, 50, 100]"
      />
    </div>

    <div v-if="totalPages > 1" class="flex">
      <VaButton
        preset="secondary"
        icon="va-arrow-left"
        aria-label="Previous page"
        :disabled="$props.pagination.page === 1"
        @click="$props.pagination.page--"
      />
      <VaButton
        class="mr-2"
        preset="secondary"
        icon="va-arrow-right"
        aria-label="Next page"
        :disabled="$props.pagination.page === totalPages"
        @click="$props.pagination.page++"
      />
      <VaPagination
        v-model="$props.pagination.page"
        buttons-preset="secondary"
        :pages="totalPages"
        :visible-pages="5"
        :boundary-links="false"
        :direction-links="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.va-data-table {
  ::v-deep(.va-data-table__table-tr) {
    border-bottom: 1px solid var(--va-background-border);
  }
}

.child-arrow {
  font-size: 1rem;
  margin-left: 0.5rem;
}
</style>
