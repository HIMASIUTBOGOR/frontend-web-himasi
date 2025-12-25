<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useToast } from "vuestic-ui";
import { News } from "./type";
import { payloadNews } from "../../../interfaces/ICms";
import {
  createNews,
  updateNews,
  getNewsById,
} from "../../../services/cms/news.service";
import QuillEditor from "quill";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import { getEnumeration } from "../../../services/enumeration.service";

const router = useRouter();
const route = useRoute();
const { init: notify } = useToast();

const isEdit = ref(false);
const isLoading = ref(false);
const newsId = ref<string | null>(null);

// Fetch jabatan from API
const categoryOptions = ref<Array<{ id: string; value: string }>>([]);
const isLoadingCategory = ref(false);

const fetchCategory = async () => {
  try {
    isLoadingCategory.value = true;
    const response = await getEnumeration("category_news");
    console.log("Raw API response:", response);
    categoryOptions.value = response.enumeration.map((item: any) => ({
      id: item.id,
      value: item.value,
    }));
    console.log("categoryOptions after mapping:", categoryOptions.value);
    console.log("Total jabatan options:", categoryOptions.value.length);
  } catch (error) {
    console.error("Failed to fetch jabatan:", error);
    categoryOptions.value = [];
  } finally {
    isLoadingCategory.value = false;
  }
};

const form = ref({
  title: "",
  desc: "",
  category_id: "",
  photo: null as File | null,
  author: "",
  is_active: true,
  published_at: new Date().toISOString().split("T")[0],
});

const photoPreview = ref<string | null>(null);
const editorRef = ref<HTMLDivElement | null>(null);
let quill: QuillEditor | null = null;

onMounted(async () => {
  // Initialize Quill editor
  if (editorRef.value) {
    quill = new QuillEditor(editorRef.value, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ font: [] }],
          [{ size: ["small", false, "large", "huge"] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link", "image", "video"],
          ["clean"],
        ],
      },
      placeholder: "Enter news description...",
    });
  }

  // Check if this is an edit page (if news ID is in route params)
  const id = route.query.id as string;
  if (id) {
    isEdit.value = true;
    newsId.value = id;

    // Fetch news data
    try {
      isLoading.value = true;
      const response = await getNewsById(id);
      const news = response.data;

      form.value.title = news.title;
      form.value.author = news.author;
      form.value.is_active = news.is_active;
      form.value.category_id = news.category_id;
      form.value.published_at = news.published_at;

      // Set editor content
      if (quill && news.desc) {
        quill.root.innerHTML = news.desc;
      }

      // Set photo preview if exists
      if (news.photo) {
        photoPreview.value = news.photo;
      }
    } catch (error: any) {
      notify({
        message: error.message || "Failed to load news data",
        color: "danger",
      });
    } finally {
      isLoading.value = false;
    }
  }
});

const onPhotoChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files[0]) {
    const file = input.files[0];
    form.value.photo = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const saveNews = async () => {
  try {
    isLoading.value = true;

    // Get HTML content from Quill editor
    const htmlContent = quill ? quill.root.innerHTML : "";

    const newsData: payloadNews = {
      title: form.value.title,
      desc: htmlContent,
      photo: form.value.photo,
      author: form.value.author,
      is_active: form.value.is_active,
      category_id: form.value.category_id,
      published_at: form.value.published_at,
    };

    if (isEdit.value && newsId.value) {
      await updateNews(newsId.value, newsData);
      notify({
        message: "News updated successfully",
        color: "success",
      });
    } else {
      await createNews(newsData);
      notify({
        message: "News created successfully",
        color: "success",
      });
    }

    router.push({ name: "News" });
  } catch (error: any) {
    notify({
      message: error.message || "Failed to save news",
      color: "danger",
    });
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.push({ name: "News" });
};

// Load jabatan options on mount
onMounted(() => {
  console.log("=== Component Mounted ===");
  fetchCategory();
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-4">
      <h1 class="page-title">{{ isEdit ? "Edit News" : "Create News" }}</h1>
      <VaButton preset="secondary" @click="goBack">
        <VaIcon name="arrow_back" />
        Back
      </VaButton>
    </div>

    <VaCard>
      <VaCardContent>
        <form @submit.prevent="saveNews" class="space-y-4">
          <!-- Title Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Title</label>
            <VaInput
              v-model="form.title"
              placeholder="Enter news title"
              required
              class="w-full"
            />
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Category</label>

            <VaSelect
              v-model="form.category_id"
              placeholder="Select category"
              class="w-full"
              :options="categoryOptions"
              value-by="id"
              text-by="value"
              name="category_id"
              clearable
            />
          </div>

          <!-- Author Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Author</label>
            <VaInput
              v-model="form.author"
              placeholder="Enter author name"
              required
              class="w-full"
            />
          </div>

          <!-- Published Date Field -->
          <div>
            <label class="block text-sm font-medium mb-2">Published Date</label>
            <VaInput
              v-model="form.published_at"
              type="date"
              required
              class="w-full"
            />
          </div>

          <!-- Description Field with Quill Editor -->
          <div>
            <label class="block text-sm font-medium mb-2">Description</label>
            <div
              ref="editorRef"
              class="bg-white rounded-lg border border-gray-300"
            ></div>
          </div>

          <!-- Photo Upload -->
          <div>
            <label class="block text-sm font-medium mb-2">Photo</label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <input
                type="file"
                accept="image/*"
                @change="onPhotoChange"
                class="w-full"
              />
              <div v-if="photoPreview" class="mt-4">
                <img
                  :src="photoPreview"
                  alt="Preview"
                  class="max-h-48 object-cover rounded"
                />
              </div>
            </div>
          </div>

          <!-- Is Active Toggle -->
          <div>
            <label class="block text-sm font-medium mb-2">Active Status</label>
            <VaSwitch v-model="form.is_active" />
          </div>

          <!-- Form Actions -->
          <div class="flex gap-2 justify-end pt-4">
            <VaButton preset="secondary" @click="goBack" :disabled="isLoading">
              Cancel
            </VaButton>
            <VaButton
              type="submit"
              :loading="isLoading"
              :disabled="!form.title || !form.author"
            >
              {{ isEdit ? "Update" : "Create" }} News
            </VaButton>
          </div>
        </form>
      </VaCardContent>
    </VaCard>
  </div>
</template>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1rem;
}

:deep(.ql-container) {
  font-size: 1rem;
  min-height: 300px;
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
}

:deep(.ql-editor) {
  padding: 12px;
}

:deep(.ql-toolbar) {
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;
}
</style>
