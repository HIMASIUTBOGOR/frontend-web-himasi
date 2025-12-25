<script setup lang="ts">
import { defineVaDataTableColumns, useModal, VaBadge } from "vuestic-ui";
import { PropType, computed, toRef } from "vue";
import { useVModel } from "@vueuse/core";
import { Enumeration } from "../type";
import { Pagination, Sorting } from "../../../../data/pages/users";

const columns = defineVaDataTableColumns([
  { label: "No", key: "number", sortable: false },
  { label: "Key", key: "key", sortable: true },
  { label: "Value", key: "value", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  enumeration: {
    type: Array as PropType<Enumeration[]>,
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
  (event: "edit-enumeration", enumeration: Enumeration): void;
  (event: "delete-enumeration", enumeration: Enumeration): void;
  (event: "update:sortBy", sortBy: Sorting["sortBy"]): void;
  (event: "update:sortingOrder", sortingOrder: Sorting["sortingOrder"]): void;
}>();

const enumeration = toRef(props, "enumeration");
const sortByVModel = useVModel(props, "sortBy", emit);
const sortingOrderVModel = useVModel(props, "sortingOrder", emit);

const totalPages = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.perPage)
);

const { confirm } = useModal();

const onDeleteEnumeration = async (enumeration: Enumeration) => {
  const agreed = await confirm({
    title: "Delete enumeration",
    message: `Are you sure you want to delete ${enumeration.value}?`,
    okText: "Delete",
    cancelText: "Cancel",
    size: "small",
    maxWidth: "380px",
  });

  if (agreed) {
    emit("delete-enumeration", enumeration as Enumeration);
  }
};
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="enumeration"
    :loading="$props.loading"
  >
    <template #cell(number)="{ rowIndex }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ (pagination.page - 1) * pagination.perPage + rowIndex + 1 }}
      </div>
    </template>

    <template #cell(key)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.key }}
      </div>
    </template>

    <template #cell(value)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.value }}
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          v-if="canEdit"
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit enumeration"
          @click="$emit('edit-enumeration', rowData as Enumeration)"
        />
        <VaButton
          v-if="canDelete"
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete enumeration"
          @click="onDeleteEnumeration(rowData as Enumeration)"
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
