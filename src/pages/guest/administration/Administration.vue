<template>
  <!-- Pengurus Hero -->
  <section class="page-hero">
    <div class="container text-center">
      <h1 class="page-title">
        Struktur <span class="highlight-text">Pengurus</span>
      </h1>
      <p class="page-subtitle">
        Kenali wajah-wajah di balik layar HIMASI UT Bogor Periode 2024/2025
      </p>
    </div>
  </section>

  <!-- Team Structure -->
  <section class="team-section">
    <div class="container">
      <!-- BPH (Badan Pengurus Harian) -->
      <div class="team-group">
        <h2 class="team-group-title">Badan Pengurus Harian</h2>
        <!-- BPH usually doesn't need a slider if few members, but for consistency let's grid or slider? 
                         User asked for "next dan previous nya di pojok kanan kiri card nya". 
                         Let's apply slider wrapper to all groups for consistency. -->
        <div class="team-slider-wrapper">
          <button class="slider-btn prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="team-slider">
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Ketua"
                />
              </div>
              <div class="team-info">
                <h3>Aditya Pratama</h3>
                <span class="team-role">Ketua Umum</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Wakil"
                />
              </div>
              <div class="team-info">
                <h3>Siti Aminah</h3>
                <span class="team-role">Wakil Ketua</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Sekretaris"
                />
              </div>
              <div class="team-info">
                <h3>Rina Wati</h3>
                <span class="team-role">Sekretaris Umum</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Bendahara"
                />
              </div>
              <div class="team-info">
                <h3>Budi Santoso</h3>
                <span class="team-role">Bendahara Umum</span>
              </div>
            </div>
          </div>
          <button class="slider-btn next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Department 1: Akademik & Keilmuan -->
      <div class="team-group">
        <h2 class="team-group-title">Akademik & Keilmuan</h2>
        <div class="team-slider-wrapper">
          <button class="slider-btn prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="team-slider">
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Fajar Nugraha</h3>
                <span class="team-role">Kepala Departemen</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Citra Lestari</h3>
                <span class="team-role">Staff Ahli</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Dimas Anggara</h3>
                <span class="team-role">Staff Muda</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Putri Ayu</h3>
                <span class="team-role">Staff Muda</span>
              </div>
            </div>
          </div>
          <button class="slider-btn next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Department 2: Media & Publikasi -->
      <div class="team-group">
        <h2 class="team-group-title">Media & Publikasi</h2>
        <div class="team-slider-wrapper">
          <button class="slider-btn prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="team-slider">
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1615109398623-88346a601842?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Eko Prasetyo</h3>
                <span class="team-role">Kepala Departemen</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Gita Gutawa</h3>
                <span class="team-role">Creative Design</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Rizky Ramadhan</h3>
                <span class="team-role">Video Editor</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Maya Indah</h3>
                <span class="team-role">Social Media</span>
              </div>
            </div>
          </div>
          <button class="slider-btn next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Department 3: Acara & Humas -->
      <div class="team-group">
        <h2 class="team-group-title">Acara & Humas</h2>
        <div class="team-slider-wrapper">
          <button class="slider-btn prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="team-slider">
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Dewi Sartika</h3>
                <span class="team-role">Kepala Departemen</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Hendra Wijaya</h3>
                <span class="team-role">Event Specialist</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1517365830460-955ce3ccd263?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Sari puspa</h3>
                <span class="team-role">Public Relation</span>
              </div>
            </div>
          </div>
          <button class="slider-btn next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Department 4: PSDM -->
      <div class="team-group">
        <h2 class="team-group-title">PSDM</h2>
        <div class="team-slider-wrapper">
          <button class="slider-btn prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="team-slider">
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Ahmad Dahlan</h3>
                <span class="team-role">Kepala Departemen</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Linda Permata</h3>
                <span class="team-role">Talent Management</span>
              </div>
            </div>
          </div>
          <button class="slider-btn next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <!-- Department 5: Olahraga -->
      <div class="team-group">
        <h2 class="team-group-title">Olahraga</h2>
        <div class="team-slider-wrapper">
          <button class="slider-btn prev">
            <i class="fas fa-chevron-left"></i>
          </button>
          <div class="team-slider">
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Roni Setiawan</h3>
                <span class="team-role">Kepala Departemen</span>
              </div>
            </div>
            <div class="team-card">
              <div class="team-img">
                <img
                  src="https://images.unsplash.com/photo-1542596594-649edbc13630?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
                  alt="Member"
                />
              </div>
              <div class="team-info">
                <h3>Bayu Pamungkas</h3>
                <span class="team-role">Staff Olahraga</span>
              </div>
            </div>
          </div>
          <button class="slider-btn next">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import "../../../../template/himasi/css/style-pengurus.css";
</script>
