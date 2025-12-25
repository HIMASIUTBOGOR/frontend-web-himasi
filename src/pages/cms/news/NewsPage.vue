<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { usePermissions } from "../../../composables/usePermissions";
import NewsTable from "./widgets/NewsTable.vue";
import { useToast } from "vuestic-ui";
import { News } from "./type";
import { deleteNews, getNews } from "../../../services/cms/news.service";

const router = useRouter();
const { init: notify } = useToast();

// State
const allNews = ref<News[]>([]);
const isLoading = ref(false);
const filters = ref({ isActive: true, search: "" });
const sorting = ref<{ sortBy: any; sortingOrder: any }>({
  sortBy: undefined,
  sortingOrder: null,
});
const pagination = ref({ page: 1, perPage: 10, total: 0 });

// Fetch news from API
const fetchNews = async () => {
  try {
    isLoading.value = true;
    const response = await getNews({
      limit: pagination.value.perPage,
      page: pagination.value.page,
      search: filters.value.search,
    });
    allNews.value = response.news;
    pagination.value.total = response.meta.total;
  } catch (error: any) {
    notify({
      message: error.message || "Failed to fetch news",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const news = computed(() => {
  return allNews.value;
});

onMounted(() => {
  fetchNews();
});

watch(
  () => filters.value.search,
  () => {
    pagination.value.page = 1;
    fetchNews();
  }
);

watch(
  () => [pagination.value.page, pagination.value.perPage],
  () => {
    fetchNews();
  }
);

const showEditNewsModal = (newsItem: News) => {
  router.push({
    name: "NewsForm",
    query: { id: newsItem.id },
  });
};

const showAddNewsModal = () => {
  router.push({ name: "NewsForm" });
};

const onNewsDelete = async (newsItem: News) => {
  try {
    await deleteNews(newsItem.id);
    notify({
      message: `${newsItem.title} has been deleted`,
      color: "success",
    });
    await fetchNews();
  } catch (error: any) {
    notify({
      message: error.message || "Failed to delete news",
      color: "danger",
    });
  }
};

const {
  canCreate: canCreateNews,
  canEdit: canEditNews,
  canDelete: canDeleteNews,
  canView: canViewNews,
} = usePermissions("cms.news");
</script>

<template>
  <h1 class="page-title">News Page</h1>
  <VaCard>
    <VaCardContent>
      <div v-if="!canViewNews" class="flex items-center justify-center py-8">
        <VaAlert color="warning" border="top">
          You don't have permission to view this page.
        </VaAlert>
      </div>

      <template v-else>
        <div class="flex flex-col md:flex-row gap-2 mb-2 justify-between">
          <div class="flex flex-col md:flex-row gap-2 justify-start">
            <VaInput
              v-model="filters.search"
              placeholder="Search news..."
              class="w-full md:w-64"
            >
              <template #prependInner>
                <VaIcon name="search" color="secondary" size="small" />
              </template>
            </VaInput>
          </div>
          <VaButton v-if="canCreateNews" @click="showAddNewsModal">
            Add News
          </VaButton>
        </div>

        <NewsTable
          :news="news"
          :loading="isLoading"
          :pagination="pagination"
          :can-edit="canEditNews"
          :can-delete="canDeleteNews"
          v-model:sortBy="sorting.sortBy"
          v-model:sortingOrder="sorting.sortingOrder"
          @edit-news="showEditNewsModal"
          @delete-news="onNewsDelete"
        />
      </template>
    </VaCardContent>
  </VaCard>
</template>
