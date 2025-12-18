<script setup lang="ts">
import FooterSection from "../pages/guest/welcome/sections/FooterSection.vue";
</script>

<template>
  <header class="header">
    <div class="container header-container">
      <a href="/">
        <img
          src="/images/logo-himasi.png"
          alt="Logo HIMASI UT Bogor"
          class="logo"
        />
      </a>

      <nav class="nav">
        <ul class="nav-list">
          <li><a href="#home" class="nav-link">Beranda</a></li>
          <li><a href="#about" class="nav-link">Tentang</a></li>
          <li>
            <a href="#departments" class="nav-link">Departemen</a>
          </li>
          <li><a href="/pengurus" class="nav-link">Pengurus</a></li>
          <li><a href="#proker" class="nav-link">Proker</a></li>
          <li><a href="#news" class="nav-link">Berita</a></li>
          <li><a href="#faq" class="nav-link">FAQ</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <a href="/pendaftaran" class="btn btn-primary">Gabung Sekarang</a>
        <button
          id="theme-toggle"
          class="btn-icon"
          aria-label="Toggle Dark Mode"
        >
          <i class="fas fa-moon"></i>
        </button>
        <button class="mobile-menu-btn" aria-label="Toggle Menu">
          <i class="fas fa-bars"></i>
        </button>
      </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu">
      <ul class="mobile-nav-list">
        <li><a href="#about">Tentang</a></li>
        <li><a href="#departments">Departemen</a></li>
        <li><a href="/pengurus">Pengurus</a></li>
        <li><a href="#benefits">Benefit</a></li>
        <li><a href="#proker">Proker</a></li>
        <li><a href="#news">Berita</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li>
          <a href="/pendaftaran" class="btn btn-primary mobile-btn"
            >Gabung Sekarang</a
          >
        </li>
      </ul>
    </div>
  </header>

  <main class="content">
    <router-view />
  </main>

  <FooterSection />
</template>
