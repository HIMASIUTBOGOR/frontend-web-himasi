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
          :key="q.id"
          class="faq-item"
          :class="{ active: q.open }"
        >
          <div class="faq-header" @click="toggleFaq(idx)">
            <h3>{{ q.title }}</h3>
            <span class="faq-icon"
              ><i :class="q.open ? 'fas fa-minus' : 'fas fa-plus'"></i
            ></span>
          </div>
          <div class="faq-body" :style="{ display: q.open ? 'block' : 'none' }">
            <p>{{ q.desc }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getContentFaq } from "../../../../services/content.service";

type FaqItem = { id: string; title: string; desc: string; open: boolean };
const faqs = ref<FaqItem[]>([]);

const fetchFaqs = async () => {
  try {
    const response = await getContentFaq();
    console.log(response);
    faqs.value = response.data.map((faq: any, index: number) => ({
      ...faq,
      open: index === 0,
    }));
  } catch (error) {
    console.error("Failed to fetch faqs:", error);
  }
};

onMounted(() => {
  fetchFaqs();
});

function toggleFaq(index: number) {
  faqs.value = faqs.value.map((item, i) => ({
    ...item,
    open: i === index ? !item.open : item.open,
  }));
}
</script>
