<template>
  <div>
    <HeroSection />
    <AboutSection />
    <VisionSection />
    <DepartmentsSection />
    <BenefitsSection />
    <ProkerSection />
    <NewsSection />
    <FaqSection />
  </div>
</template>

<script setup lang="ts">
import HeroSection from "./sections/HeroSection.vue";
import AboutSection from "./sections/AboutSection.vue";
import VisionSection from "./sections/VisionSection.vue";
import DepartmentsSection from "./sections/DepartmentsSection.vue";
import BenefitsSection from "./sections/BenefitsSection.vue";
import NewsSection from "./sections/NewsSection.vue";
import FaqSection from "./sections/FaqSection.vue";
import ProkerSection from "./sections/ProkerSection.vue";
</script>

<!-- Styles are provided via global import of template style.css in main.ts -->
