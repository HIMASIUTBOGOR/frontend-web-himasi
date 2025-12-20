<script setup lang="ts">
import { defineVaDataTableColumns, useModal, VaBadge } from "vuestic-ui";
import { PropType, computed, toRef } from "vue";
import { useVModel } from "@vueuse/core";
import { Departemen } from "../type";
import { Pagination, Sorting } from "../../../../data/pages/users";
import { Icon } from "@iconify/vue";

const columns = defineVaDataTableColumns([
  { label: "No", key: "number", sortable: false },
  { label: "Title", key: "title", sortable: true },
  { label: "Description", key: "desc", sortable: true },
  { label: "icon", key: "icon", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  departemen: {
    type: Array as PropType<Departemen[]>,
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
  (event: "edit-departemen", departemen: Departemen): void;
  (event: "delete-departemen", departemen: Departemen): void;
  (event: "update:sortBy", sortBy: Sorting["sortBy"]): void;
  (event: "update:sortingOrder", sortingOrder: Sorting["sortingOrder"]): void;
}>();

const departemen = toRef(props, "departemen");
const sortByVModel = useVModel(props, "sortBy", emit);
const sortingOrderVModel = useVModel(props, "sortingOrder", emit);

const totalPages = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.perPage)
);

const { confirm } = useModal();

const onDeleteDepartemen = async (departemen: Departemen) => {
  const agreed = await confirm({
    title: "Delete departemen",
    message: `Are you sure you want to delete ${departemen.desc}?`,
    okText: "Delete",
    cancelText: "Cancel",
    size: "small",
    maxWidth: "380px",
  });

  if (agreed) {
    emit("delete-departemen", departemen as Departemen);
  }
};
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="departemen"
    :loading="$props.loading"
  >
    <template #cell(number)="{ rowIndex }">
      <div class="flex items-center gap-2 max-w-[230px] ellipsis">
        {{ (pagination.page - 1) * pagination.perPage + rowIndex + 1 }}
      </div>
    </template>
    <template #cell(title)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.title }}
      </div>
    </template>

    <template #cell(desc)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        {{ rowData.desc }}
      </div>
    </template>

    <template #cell(icon)="{ rowData }">
      <div class="ellipsis max-w-[230px]">
        <Icon
          v-if="rowData.icon"
          :icon="rowData.icon"
          :width="20"
          :height="20"
          class="mr-2"
        />
      </div>
    </template>

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          v-if="canEdit"
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit departemen"
          @click="$emit('edit-departemen', rowData as Departemen)"
        />
        <VaButton
          v-if="canDelete"
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete departemen"
          @click="onDeleteDepartemen(rowData as Departemen)"
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
