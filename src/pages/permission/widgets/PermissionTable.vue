<script setup lang="ts">
import { defineVaDataTableColumns, useModal } from "vuestic-ui";
import { PropType, computed, toRef } from "vue";
import { Pagination, Sorting } from "../../../data/pages/users";
import { useVModel } from "@vueuse/core";
import { Permission } from "../../users/types";

const columns = defineVaDataTableColumns([
  { label: "No", key: "number", sortable: false },
  { label: "name", key: "name", sortable: true },
  { label: "guard_name", key: "guard_name", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  permission: {
    type: Array as PropType<Permission[]>,
    required: true,
  },
  loading: { type: Boolean, default: false },
  pagination: { type: Object as PropType<Pagination>, required: true },
  sortBy: { type: String as PropType<Sorting["sortBy"]>, required: true },
  sortingOrder: {
    type: String as PropType<Sorting["sortingOrder"]>,
    default: null,
  },
});

const emit = defineEmits<{
  (event: "edit-permission", permission: Permission): void;
  (event: "delete-permission", permission: Permission): void;
  (event: "update:sortBy", sortBy: Sorting["sortBy"]): void;
  (event: "update:sortingOrder", sortingOrder: Sorting["sortingOrder"]): void;
}>();

const permission = toRef(props, "permission");
const sortByVModel = useVModel(props, "sortBy", emit);
const sortingOrderVModel = useVModel(props, "sortingOrder", emit);

const totalPages = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.perPage)
);

const { confirm } = useModal();

const onDeletePermission = async (permission: Permission) => {
  const agreed = await confirm({
    title: "Delete permission",
    message: `Are you sure you want to delete ${permission.name}?`,
    okText: "Delete",
    cancelText: "Cancel",
    size: "small",
    maxWidth: "380px",
  });

  if (agreed) {
    emit("delete-permission", permission as Permission);
  }
};
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="permission"
    :loading="$props.loading"
  >
    <template #cell(avatar)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        <UserAvatar :user="rowData as Permission" size="small" />
      </div>
    </template>
    <template #cell(number)="{ rowIndex }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ (pagination.page - 1) * pagination.perPage + rowIndex + 1 }}
      </div>
    </template>
    <template #cell(name)="{ rowData }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ rowData.name }}
      </div>
    </template>

    <template #cell(guard_name)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.guard_name }}
      </div>
    </template>

    <template #cell(projects)="{ rowData }">
      <div class="ellipsis max-w-[300px] lg:max-w-[450px]"></div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit permission"
          @click="$emit('edit-permission', rowData as Permission)"
        />
        <VaButton
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete permission"
          @click="onDeletePermission(rowData as Permission)"
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
</style>
