<template>
  <section class="infopedia" id="news">
    <div class="container">
      <div class="infopedia-header">
        <h2 class="section-title">
          HIMASI <span class="highlight-text">Infopedia</span>
        </h2>
        <div class="infopedia-sub">
          <p class="section-desc">
            Pusat informasi terkini, berisikan info akademik, kegiatan, dan
            inovasi seputar Sistem Informasi.
          </p>
          <div class="blog-nav">
            <button class="nav-btn prev" aria-label="Berita sebelumnya">
              <i class="fas fa-arrow-left"></i>
            </button>
            <button class="nav-btn next" aria-label="Berita selanjutnya">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="infopedia-grid">
        <div v-if="isLoading" class="info-card">
          <div class="info-content">
            <p>Sedang memuat berita...</p>
          </div>
        </div>

        <div v-else-if="errorMessage" class="info-card">
          <div class="info-content">
            <h3>Gagal memuat berita</h3>
            <p>{{ errorMessage }}</p>
          </div>
        </div>

        <div v-else-if="!newsItems.length" class="info-card">
          <div class="info-content">
            <h3>Belum ada berita</h3>
            <p>Kembali lagi nanti untuk update terbaru.</p>
            <RouterLink :to="newsPageLink" class="info-link">
              Lihat halaman berita <i class="fas fa-long-arrow-alt-right"></i>
            </RouterLink>
          </div>
        </div>

        <div v-else v-for="item in newsItems" :key="item.id" class="info-card">
          <div class="info-img">
            <span class="category-badge" :class="badgeClass(item.category)">
              {{ item.category || "Berita" }}
            </span>
            <img :src="item.photo || defaultImage" :alt="item.title" />
          </div>
          <div class="info-content">
            <div class="info-meta">
              <span>
                <i class="far fa-calendar"></i>
                {{ formatDate(item.published_at) }}
              </span>
              <span>
                <i class="far fa-user"></i>
                {{ item.author || "Admin" }}
              </span>
            </div>
            <h3>{{ item.title }}</h3>
            <p>{{ stripHtml(item.desc) }}</p>
            <RouterLink :to="newsPageLink" class="info-link">
              Baca artikel
              <i class="fas fa-long-arrow-alt-right"></i>
            </RouterLink>
          </div>
        </div>
      </div>

      <div class="infopedia-footer" v-if="newsItems.length">
        <RouterLink :to="newsPageLink" class="info-link see-all">
          Lihat semua berita
          <i class="fas fa-long-arrow-alt-right"></i>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getNews } from "../../../../services/cms/news.service";
import type { News } from "../../../cms/news/type";

const newsItems = ref<News[]>([]);
const isLoading = ref(false);
const errorMessage = ref("");
const defaultImage =
  "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
const newsPageLink = { name: "News" };

const formatDate = (value: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const badgeClass = (category?: string) => {
  const key = (category || "").toLowerCase();
  if (key.includes("event")) return "badge-orange";
  if (key.includes("inovasi") || key.includes("innovation"))
    return "badge-green";
  return "badge-blue";
};

const stripHtml = (value?: string) => {
  if (!value) return "";
  const div = document.createElement("div");
  div.innerHTML = value;
  return div.textContent || div.innerText || "";
};

const fetchNews = async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";
    const response = await getNews({ limit: 3 });
    newsItems.value = response.news || [];
  } catch (error: any) {
    errorMessage.value =
      error?.message || "Terjadi kesalahan saat memuat berita.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchNews();
});
</script>
