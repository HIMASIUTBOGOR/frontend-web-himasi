<template>
  <section class="hero" id="home">
    <div class="container hero-container-centered">
      <div class="hero-content-centered">
        <h1>
          Mewujudkan Generasi
          <span class="highlight-text">Sistem Informasi</span> yang Unggul &
          Berkarakter
        </h1>
        <p>
          Himpunan Mahasiswa Sistem Informasi Universitas Terbuka Bogor. Wadah
          inspirasi, kolaborasi, dan prestasi mahasiswa.
        </p>
        <div class="hero-buttons">
          <a href="#proker" class="btn btn-primary">Lihat Program Kerja</a>
          <a href="/aspirasi" class="btn btn-secondary">Wadah Aspirasi</a>
        </div>
        
      </div>

      <div class="hero-gallery-wrapper">
        <div class="hero-gallery-track">
          <!-- First set of images -->
          <div
            v-for="activity in dataActivity"
            :key="'first-' + activity.id"
            class="gallery-item"
          >
            <img :src="activity.image" :alt="activity.desc" />
          </div>

          <!-- Duplicate for infinite scroll effect -->
          <div
            v-for="activity in dataActivity"
            :key="'second-' + activity.id"
            class="gallery-item"
          >
            <img :src="activity.image" :alt="activity.desc" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getContentActivities } from "../../../../services/content.service";

const dataActivity = ref([]);

const fetchActivities = async () => {
  try {
    const response = await getContentActivities();
    console.log(response);
    dataActivity.value = response.data;
  } catch (error) {
    console.error("Failed to fetch activities:", error);
  }
};

onMounted(() => {
  fetchActivities();
});
</script>
