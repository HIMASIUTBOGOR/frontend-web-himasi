<template>
  <section class="faq" id="faq">
    <div class="container">
      <div class="section-header-center">
        <h2 class="section-title">Frequently Asked Questions</h2>
        <p class="section-desc">
          Pertanyaan yang sering diajukan seputar HIMASI UT Bogor.
        </p>
      </div>

      <div class="faq-grid">
        <div
          v-for="(q, idx) in faqs"
          :key="idx"
          class="faq-item"
          :class="{ active: q.open }"
        >
          <div class="faq-header" @click="toggleFaq(idx)">
            <h3>{{ q.question }}</h3>
            <span class="faq-icon"
              ><i :class="q.open ? 'fas fa-minus' : 'fas fa-plus'"></i
            ></span>
          </div>
          <div class="faq-body" :style="{ display: q.open ? 'block' : 'none' }">
            <p>{{ q.answer }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from "vue";

type FaqItem = { question: string; answer: string; open: boolean };
const faqs = ref<FaqItem[]>([
  {
    question: "Bagaimana cara bergabung menjadi pengurus HIMASI?",
    answer:
      "Pendaftaran pengurus dibuka setiap awal periode kepengurusan (biasanya setahun sekali). Pantau terus media sosial kami untuk info open recruitment.",
    open: true,
  },
  {
    question: "Apa saja syarat menjadi anggota HIMASI?",
    answer:
      "Syarat utamanya adalah mahasiswa aktif Program Studi Sistem Informasi Universitas Terbuka Bogor.",
    open: false,
  },
  {
    question: "Apakah kegiatan HIMASI hanya untuk pengurus?",
    answer:
      "Tidak, sebagian besar kegiatan seperti webinar, workshop, dan seminar terbuka untuk umum dan seluruh mahasiswa UT Bogor.",
    open: false,
  },
  {
    question: "Dimana sekretariat HIMASI UT Bogor?",
    answer:
      "Sekretariat kami (jika ada fisik) atau basecamp online bisa dihubungi melalui contact person yang tersedia.",
    open: false,
  },
]);

function toggleFaq(index: number) {
  faqs.value = faqs.value.map((item, i) => ({
    ...item,
    open: i === index ? !item.open : item.open,
  }));
}
</script>
