<template>
  <section class="program" id="proker">
    <div class="container">
      <div class="section-header-center">
        <h2 class="section-title">
          Proker <span class="highlight-text">Departemen</span>
        </h2>
        <p class="section-desc">
          Program kerja unggulan dari setiap departemen HIMASI.
        </p>
      </div>

      <div class="program-filters">
        <button
          v-for="f in filters"
          :key="f.key"
          class="filter-btn"
          :class="{ active: selectedFilter === f.key }"
          @click="selectedFilter = f.key"
        >
          {{ f.label }}
        </button>
      </div>

      <div v-if="loading" class="text-center py-8">
        <p>Memuat data...</p>
      </div>

      <div
        v-else-if="currentProgram.items.length === 0"
        class="text-center py-8"
      >
        <p>Belum ada program kerja untuk departemen ini.</p>
      </div>

      <div v-else class="program-content">
        <div class="program-list">
          <div
            v-for="item in currentProgram.items"
            :key="item.id"
            class="program-item"
            :class="{ active: selectedItem === item.id }"
            @click="selectedItem = item.id"
          >
            {{ item.title }}
          </div>
        </div>

        <div class="program-visual">
          <img
            :src="currentVisual.img"
            :alt="currentVisual.alt"
            class="program-img"
          />
          <div class="program-label">{{ currentVisual.label }}</div>
        </div>

        <div class="program-details">
          <h3>{{ currentDetail.title }}</h3>
          <p>{{ currentDetail.desc }}</p>
          <a
            v-if="currentDetail.action_link"
            :href="currentDetail.action_link"
            target="_blank"
            class="details-link"
          >
            Ikuti Program <i class="fas fa-arrow-right"></i>
          </a>
          <a v-else href="#join" class="details-link">
            Ikuti Program <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { getContentProkers } from "../../../../services/content.service";

type Proker = {
  id: string;
  departemen_id: string;
  departemen: string;
  photo: string;
  title: string;
  desc: string;
  action_link: string | null;
  is_active: number;
};

type Department = {
  id: string;
  departemen: string;
  prokers: Proker[];
};

const departmentsData = ref<Department[]>([]);
const selectedFilter = ref<string>("all");
const selectedItem = ref<string>("");
const loading = ref(true);

const fetchProkers = async () => {
  loading.value = true;
  try {
    const response = await getContentProkers();
    departmentsData.value = response.data;
    // Set default selected item to first proker if available
    if (departmentsData.value.length > 0) {
      const firstDeptWithProkers = departmentsData.value.find(
        (dept) => dept.prokers.length > 0
      );
      if (firstDeptWithProkers && firstDeptWithProkers.prokers.length > 0) {
        selectedItem.value = firstDeptWithProkers.prokers[0].id;
      }
    }
  } catch (error) {
    console.error("Failed to fetch prokers:", error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchProkers();
});

const filters = computed(() => {
  const baseFilters = [{ key: "all", label: "Semua Departemen" }];
  const deptFilters = departmentsData.value.map((dept) => ({
    key: dept.id,
    label: dept.departemen,
  }));
  return [...baseFilters, ...deptFilters];
});

const currentProgram = computed(() => {
  if (selectedFilter.value === "all") {
    // Show all prokers from all departments
    const allProkers = departmentsData.value.flatMap((dept) => dept.prokers);
    return {
      label: "Semua Departemen",
      items: allProkers,
      departemen: "Semua Departemen",
    };
  } else {
    // Show prokers from selected department
    const dept = departmentsData.value.find(
      (d) => d.id === selectedFilter.value
    );
    return {
      label: dept?.departemen || "",
      items: dept?.prokers || [],
      departemen: dept?.departemen || "",
    };
  }
});

const currentVisual = computed(() => {
  const selectedProker = currentProgram.value.items.find(
    (item) => item.id === selectedItem.value
  );

  return {
    img: selectedProker?.photo || currentProgram.value.items[0]?.photo || "",
    alt:
      selectedProker?.departemen ||
      currentProgram.value.items[0]?.departemen ||
      currentProgram.value.departemen,
    label:
      selectedProker?.departemen ||
      currentProgram.value.items[0]?.departemen ||
      currentProgram.value.departemen,
  };
});

const currentDetail = computed(() => {
  const proker = currentProgram.value.items.find(
    (item) => item.id === selectedItem.value
  );

  return {
    title: proker?.title || "",
    desc: proker?.desc || "",
    action_link: proker?.action_link,
  };
});
</script>
