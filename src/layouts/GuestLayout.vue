<style>
/* ================= HEADER SECTION ================= */
.header {
  height: var(--header-height);
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: var(--white);
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.logo {
  height: 50px;
  /* Adjust based on header height 80px */
  width: auto;
  object-fit: contain;
  /* font-size: 1.5rem; */
  /* Keep for fallback or text logo if needed, but image overrides */
  /* font-weight: 700; */
  /* color: var(--primary-color); */
}

.logo-highlight {
  color: var(--accent-color);
}

.nav-list {
  display: flex;
  gap: 30px;
}

.nav-link {
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--text-dark);
  transition: var(--transition);
}

.nav-link:hover {
  color: var(--primary-color);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.mobile-menu-btn {
  display: none;
  font-size: 1.5rem;
  color: var(--text-dark);
  background: none;
  border: none;
  cursor: pointer;
}

/* ================= MOBILE MENU ================= */
.mobile-menu {
  position: fixed;
  top: var(--header-height);
  left: 0;
  width: 100%;
  background-color: var(--white);
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  transform: translateY(-150%);
  transition: var(--transition);
  z-index: 999;
  text-align: center;
}

.mobile-menu.active {
  transform: translateY(0);
}

.mobile-nav-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.mobile-btn {
  margin-top: 10px;
  width: 100%;
}

.content {
  margin-top: var(--header-height);
}
</style>

<template>
  <header class="header">
    <div class="container header-container">
      <a href="index.html">
        <img
          src="/images/logo-himasi.png"
          alt="Logo HIMASI UT Bogor"
          class="logo"
        />
      </a>

      <nav class="nav">
        <ul class="nav-list">
          <li><a href="index.html#home" class="nav-link">Beranda</a></li>
          <li><a href="index.html#about" class="nav-link">Tentang</a></li>
          <li>
            <a href="index.html#departments" class="nav-link">Departemen</a>
          </li>
          <li><a href="pengurus.html" class="nav-link">Pengurus</a></li>
          <li><a href="index.html#proker" class="nav-link">Proker</a></li>
          <li><a href="index.html#news" class="nav-link">Berita</a></li>
          <li><a href="index.html#faq" class="nav-link">FAQ</a></li>
        </ul>
      </nav>

      <div class="header-actions">
        <a href="pendaftaran.html" class="btn btn-primary">Gabung Sekarang</a>
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
        <li><a href="pengurus.html">Pengurus</a></li>
        <li><a href="#benefits">Benefit</a></li>
        <li><a href="#proker">Proker</a></li>
        <li><a href="#news">Berita</a></li>
        <li><a href="#faq">FAQ</a></li>
        <li>
          <a href="pendaftaran.html" class="btn btn-primary mobile-btn"
            >Gabung Sekarang</a
          >
        </li>
      </ul>
    </div>
  </header>

  <main class="content">
    <router-view />
  </main>
</template>
