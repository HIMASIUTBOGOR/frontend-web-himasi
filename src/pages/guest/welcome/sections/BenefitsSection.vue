<template>
  <section class="benefits" id="benefits">
    <div class="container">
      <div class="section-header-center">
        <h2 class="section-title">
          Keuntungan <span class="highlight-text">Bergabung</span>
        </h2>
        <p class="section-desc">
          Bergabung dengan HIMASI memberikan berbagai manfaat untuk pengembangan
          diri Anda.
        </p>
      </div>

      <!-- <div class="benefits-grid">
        <div class="benefit-card">
          <div class="benefit-img benefit-blue">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
          </div>
          <div class="benefit-content">
            <h3>Networking Luas</h3>
            <p>
              Bangun relasi dengan sesama mahasiswa, alumni, dan praktisi di
              bidang teknologi informasi.
            </p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="benefit-img benefit-pink">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
          </div>
          <div class="benefit-content">
            <h3>Pengembangan Soft Skill</h3>
            <p>
              Latih kepemimpinan, manajemen waktu, dan teamwork melalui berbagai
              kepanitiaan.
            </p>
          </div>
        </div>
        <div class="benefit-card">
          <div class="benefit-img benefit-green">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
          </div>
          <div class="benefit-content">
            <h3>Peningkatan Kompetensi</h3>
            <p>
              Ikuti pelatihan dan workshop eksklusif untuk meningkatkan skill
              teknis dan non-teknis.
            </p>
          </div>
        </div>
      </div> -->

      <div class="benefits-grid">
        <div
          v-for="benefit in dataBenefits"
          :key="benefit.id"
          class="benefit-card"
        >
          <div class="benefit-img">
            <div class="circle c1"></div>
            <div class="circle c2"></div>
            <img :src="benefit.photo" :alt="benefit.title" />
          </div>
          <div class="benefit-content">
            <h3>{{ benefit.title }}</h3>
            <p>
              {{ benefit.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getContentBenefits } from "../../../../services/content.service";

const dataBenefits = ref([]);

const fetchBenefits = async () => {
  try {
    const response = await getContentBenefits();
    console.log(response);
    dataBenefits.value = response.data;
  } catch (error) {
    console.error("Failed to fetch benefits:", error);
  }
};

onMounted(() => {
  fetchBenefits();
});
</script>
