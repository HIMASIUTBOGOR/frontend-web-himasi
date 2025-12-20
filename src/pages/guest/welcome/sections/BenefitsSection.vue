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
