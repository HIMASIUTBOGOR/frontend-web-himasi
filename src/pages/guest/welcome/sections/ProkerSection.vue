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

      <div class="program-content">
        <div class="program-list">
          <div
            v-for="item in currentProgram.items"
            :key="item.target"
            class="program-item"
            :class="{ active: selectedItem === item.target }"
            @click="selectedItem = item.target"
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
          <a href="#join" class="details-link"
            >Ikuti Program <i class="fas fa-arrow-right"></i
          ></a>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";

type ProgramKey = "all" | "akademik" | "media" | "psdm" | "acara";
type ProgramItemKey = "proker1" | "proker2" | "proker3" | "proker4";

const filters = [
  { key: "all" as ProgramKey, label: "Semua Departemen" },
  { key: "akademik" as ProgramKey, label: "Akademik & Keilmuan" },
  { key: "media" as ProgramKey, label: "Media & Publikasi" },
  { key: "psdm" as ProgramKey, label: "PSDM" },
  { key: "acara" as ProgramKey, label: "Acara & Humas" },
];

const programs = {
  all: {
    label: "Semua Departemen",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Kegiatan HIMASI",
    items: [
      {
        target: "proker1" as ProgramItemKey,
        title: "Belajar Bersama (Study Club)",
      },
      { target: "proker2" as ProgramItemKey, title: "Webinar Teknologi" },
      { target: "proker3" as ProgramItemKey, title: "Latihan Kepemimpinan" },
      { target: "proker4" as ProgramItemKey, title: "HIMASI Cup" },
    ],
    details: {
      proker1: {
        title: "Belajar Bersama (Study Club)",
        desc: "Kegiatan rutin untuk membahas materi perkuliahan dan belajar teknologi baru bersama-sama. Dipandu oleh mentor dari mahasiswa senior atau alumni.",
      },
      proker2: {
        title: "Webinar Teknologi",
        desc: "Agenda berbagi wawasan teknologi terbaru bersama praktisi dan akademisi.",
      },
      proker3: {
        title: "Latihan Kepemimpinan",
        desc: "Pelatihan soft skill untuk membangun kemampuan leadership dan organisasi.",
      },
      proker4: {
        title: "HIMASI Cup",
        desc: "Kompetisi olahraga internal untuk meningkatkan kekompakan dan kesehatan.",
      },
    },
  },
  akademik: {
    label: "Akademik & Keilmuan",
    img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Akademik",
    items: [
      {
        target: "proker1" as ProgramItemKey,
        title: "Belajar Bersama (Study Club)",
      },
      { target: "proker2" as ProgramItemKey, title: "Webinar Teknologi" },
    ],
    details: {
      proker1: {
        title: "Belajar Bersama (Study Club)",
        desc: "Kegiatan rutin untuk membahas materi perkuliahan dan belajar teknologi baru bersama-sama. Dipandu oleh mentor dari mahasiswa senior atau alumni.",
      },
      proker2: {
        title: "Webinar Teknologi",
        desc: "Agenda berbagi wawasan teknologi terbaru bersama praktisi dan akademisi.",
      },
      proker3: { title: "", desc: "" },
      proker4: { title: "", desc: "" },
    },
  },
  media: {
    label: "Media & Publikasi",
    img: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Media & Publikasi",
    items: [
      { target: "proker2" as ProgramItemKey, title: "Webinar Teknologi" },
    ],
    details: {
      proker1: { title: "", desc: "" },
      proker2: {
        title: "Webinar Teknologi",
        desc: "Agenda berbagi wawasan teknologi terbaru bersama praktisi dan akademisi.",
      },
      proker3: { title: "", desc: "" },
      proker4: { title: "", desc: "" },
    },
  },
  psdm: {
    label: "PSDM",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "PSDM",
    items: [
      { target: "proker3" as ProgramItemKey, title: "Latihan Kepemimpinan" },
    ],
    details: {
      proker1: { title: "", desc: "" },
      proker2: { title: "", desc: "" },
      proker3: {
        title: "Latihan Kepemimpinan",
        desc: "Pelatihan soft skill untuk membangun kemampuan leadership dan organisasi.",
      },
      proker4: { title: "", desc: "" },
    },
  },
  acara: {
    label: "Acara & Humas",
    img: "https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    alt: "Acara & Humas",
    items: [{ target: "proker4" as ProgramItemKey, title: "HIMASI Cup" }],
    details: {
      proker1: { title: "", desc: "" },
      proker2: { title: "", desc: "" },
      proker3: { title: "", desc: "" },
      proker4: {
        title: "HIMASI Cup",
        desc: "Kompetisi olahraga internal untuk meningkatkan kekompakan dan kesehatan.",
      },
    },
  },
} as const;

const selectedFilter = ref<ProgramKey>("all");
const selectedItem = ref<ProgramItemKey>("proker1");

const currentProgram = computed(() => programs[selectedFilter.value]);
const currentVisual = computed(() => ({
  img: currentProgram.value.img,
  alt: currentProgram.value.alt,
  label: currentProgram.value.label,
}));
const currentDetail = computed(
  () => currentProgram.value.details[selectedItem.value],
);
</script>
