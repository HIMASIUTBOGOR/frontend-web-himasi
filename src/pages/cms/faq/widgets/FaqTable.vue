<script setup lang="ts">
import { defineVaDataTableColumns, useModal, VaBadge } from "vuestic-ui";
import { PropType, computed, toRef } from "vue";
import { useVModel } from "@vueuse/core";
import { Faq } from "../type";
import { Pagination, Sorting } from "../../../../data/pages/users";

const columns = defineVaDataTableColumns([
  { label: "No", key: "number", sortable: false },
  { label: "title", key: "title", sortable: true },
  { label: "desc", key: "desc", sortable: true },
  { label: " ", key: "actions", align: "right" },
]);

const props = defineProps({
  faq: {
    type: Array as PropType<Faq[]>,
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
  (event: "edit-faq", faq: Faq): void;
  (event: "delete-faq", faq: Faq): void;
  (event: "update:sortBy", sortBy: Sorting["sortBy"]): void;
  (event: "update:sortingOrder", sortingOrder: Sorting["sortingOrder"]): void;
}>();

const faq = toRef(props, "faq");
const sortByVModel = useVModel(props, "sortBy", emit);
const sortingOrderVModel = useVModel(props, "sortingOrder", emit);

const totalPages = computed(() =>
  Math.ceil(props.pagination.total / props.pagination.perPage)
);

const { confirm } = useModal();

const onDeleteFaq = async (faq: Faq) => {
  const agreed = await confirm({
    title: "Delete faq",
    message: `Are you sure you want to delete ${faq.title}?`,
    okText: "Delete",
    cancelText: "Cancel",
    size: "small",
    maxWidth: "380px",
  });

  if (agreed) {
    emit("delete-faq", faq as Faq);
  }
};
</script>

<template>
  <VaDataTable
    v-model:sort-by="sortByVModel"
    v-model:sorting-order="sortingOrderVModel"
    :columns="columns"
    :items="faq"
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

    <template #cell(actions)="{ rowData }">
      <div class="flex gap-2 justify-end">
        <VaButton
          v-if="canEdit"
          preset="primary"
          size="small"
          icon="mso-edit"
          aria-label="Edit faq"
          @click="$emit('edit-faq', rowData as Faq)"
        />
        <VaButton
          v-if="canDelete"
          preset="primary"
          size="small"
          icon="mso-delete"
          color="danger"
          aria-label="Delete faq"
          @click="onDeleteFaq(rowData as Faq)"
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
