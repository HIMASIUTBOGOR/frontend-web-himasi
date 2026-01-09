<template>
    <section class="page-header-simple" style="background: transparent; padding-top: 120px; padding-bottom: 40px;">
            <div class="container">
                <div class="header-content" style="text-align: center;">
                    <h1>Latihan <span class="highlight-text">Soal UAS</span></h1>
                    <p
                        style="color: var(--text-light); margin-top: 10px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        Pilih mata kuliah di bawah ini untuk memulai latihan soal mandiri.
                    </p>
                </div>
            </div>
        </section>

        <!-- Search & Grid Section -->
        <section class="subject-section" style="padding-bottom: 100px;">
            <div class="container">
                <!-- Search Bar -->
                <div class="search-wrapper" style="margin-bottom: 50px; text-align: center;">
                    <div style="position: relative; max-width: 500px; margin: 0 auto;">
                        <input type="text" id="subjectSearch" placeholder="Cari mata kuliah...">
                        <i class="fas fa-search"
                            style="position: absolute; right: 20px; top: 50%; transform: translateY(-50%); color: #9ca3af;"></i>
                    </div>
                </div>

                <!-- Grid -->
                <div class="subject-grid" id="subjectGrid">

                    <!-- Card 1: Algo (Active) -->
                    <a href="detail-soal.html" class="subject-card" data-name="Algoritma & Pemrograman">
                        <div class="card-content">
                            <div class="card-icon">
                                <i class="fas fa-code"></i>
                            </div>
                            <h3 class="card-title">Algoritma & Pemrograman</h3>
                            <div class="card-meta">
                                <i class="far fa-file-alt"></i>
                                <span>30 Soal • Modul UT</span>
                            </div>
                        </div>
                    </a>

                    <!-- Card 2: Basis Data -->
                    <a href="#" class="subject-card" data-name="Basis Data">
                        <div class="card-content">
                            <div class="card-icon" style="background: #FFFbea; color: #F59E0B;">
                                <i class="fas fa-database"></i>
                            </div>
                            <h3 class="card-title">Basis Data</h3>
                            <div class="card-meta">
                                <i class="far fa-file-alt"></i>
                                <span>25 Soal • Modul UT</span>
                            </div>
                        </div>
                    </a>

                    <!-- Card 3: Struktur Data -->
                    <a href="#" class="subject-card" data-name="Struktur Data">
                        <div class="card-content">
                            <div class="card-icon" style="background: #F3E8FF; color: #9333EA;">
                                <i class="fas fa-layer-group"></i>
                            </div>
                            <h3 class="card-title">Struktur Data</h3>
                            <div class="card-meta">
                                <i class="far fa-file-alt"></i>
                                <span>20 Soal • Modul UT</span>
                            </div>
                        </div>
                    </a>

                    <!-- Card 4: Matematika Diskrit -->
                    <a href="#" class="subject-card" data-name="Matematika Diskrit">
                        <div class="card-content">
                            <div class="card-icon" style="background: #FFE4E6; color: #F43F5E;">
                                <i class="fas fa-calculator"></i>
                            </div>
                            <h3 class="card-title">Matematika Diskrit</h3>
                            <div class="card-meta">
                                <i class="far fa-file-alt"></i>
                                <span>15 Soal • Modul UT</span>
                            </div>
                        </div>
                    </a>

                    <!-- Card 5: Jaringan Komputer -->
                    <a href="#" class="subject-card" data-name="Jaringan Komputer">
                        <div class="card-content">
                            <div class="card-icon" style="background: #E0F2FE; color: #0284C7;">
                                <i class="fas fa-network-wired"></i>
                            </div>
                            <h3 class="card-title">Jaringan Komputer</h3>
                            <div class="card-meta">
                                <i class="far fa-file-alt"></i>
                                <span>40 Soal • Modul UT</span>
                            </div>
                        </div>
                    </a>

                    <!-- Card 6: Sistem Operasi -->
                    <a href="#" class="subject-card" data-name="Sistem Operasi">
                        <div class="card-content">
                            <div class="card-icon" style="background: #F1F5F9; color: #475569;">
                                <i class="fas fa-desktop"></i>
                            </div>
                            <h3 class="card-title">Sistem Operasi</h3>
                            <div class="card-meta">
                                <i class="far fa-file-alt"></i>
                                <span>35 Soal • Modul UT</span>
                            </div>
                        </div>
                    </a>

                </div>

                <!-- Empty State (Hidden by default) -->
                <div id="noResults" style="display: none; text-align: center; padding: 40px; color: var(--text-light);">
                    <i class="far fa-frown" style="font-size: 3rem; margin-bottom: 20px; color: #cbD5e1;"></i>
                    <p>Mata kuliah tidak ditemukan.</p>
                </div>

            </div>
        </section>
</template>

<script setup lang="ts">
import "../../../../template/himasi/css/style-practice.css";
</script>