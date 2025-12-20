<template>
  <section class="services" id="departments">
    <div class="container">
      <div class="services-header">
        <h2 class="section-title">
          Departemen <span class="highlight-text">HIMASI</span>
        </h2>
        <p class="section-desc">
          HIMASI memiliki beberapa departemen yang fokus pada bidang tertentu.
        </p>
      </div>

      <div class="services-wrapper">
        <div
          v-for="department in dataDepartments"
          :key="department.id"
          class="service-card"
        >
          <div class="service-icon">
            <Icon
              v-if="department.icon"
              :icon="department.icon"
              :width="40"
              :height="40"
              class="mx-auto"
            />
          </div>
          <h3>{{ department.title }}</h3>
          <p>{{ department.desc }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getContentDepartments } from "../../../../services/content.service";
import { Icon } from "@iconify/vue";

const dataDepartments = ref([]);

const fetchDepartments = async () => {
  try {
    const response = await getContentDepartments();
    console.log(response);
    dataDepartments.value = response.data;
  } catch (error) {
    console.error("Failed to fetch departments:", error);
  }
};

onMounted(() => {
  fetchDepartments();
});
</script>
