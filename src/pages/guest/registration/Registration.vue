<template>
  <!-- Form Section -->
  <section class="registration-section">
    <div class="container">
      <div class="registration-wrapper">
        <div class="section-header-center">
          <h1 class="section-title">
            Formulir <span class="highlight-text">Pendaftaran</span>
          </h1>
          <p class="section-desc">
            Bergabunglah dengan HIMASI UT Bogor dan kembangkan potensimu bersama
            kami.
          </p>
        </div>

        <form class="registration-form" action="#" method="POST">
          <div class="form-group">
            <label for="fullname">Nama Lengkap</label>
            <input
              type="text"
              id="fullname"
              class="form-control"
              placeholder="Masukkan nama lengkap"
              required
            />
          </div>

          <div class="form-group">
            <label for="nim">NIM</label>
            <input
              type="number"
              id="nim"
              class="form-control"
              placeholder="Masukkan NIM"
              required
            />
          </div>

          <div class="form-group">
            <label for="prodi">Program Studi</label>
            <input
              type="text"
              id="prodi"
              class="form-control"
              value="Sistem Informasi"
              readonly
            />
          </div>

          <div class="form-group">
            <label for="semester">Semester</label>
            <select id="semester" class="form-control" required>
              <option value="" disabled selected>Pilih Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
              <option value="3">Semester 3</option>
              <option value="4">Semester 4</option>
              <option value="5">Semester 5</option>
              <option value="6">Semester 6</option>
              <option value="7">Semester 7</option>
              <option value="8">Semester 8</option>
            </select>
          </div>

          <div class="form-group">
            <label for="whatsapp">No. WhatsApp</label>
            <input
              type="tel"
              id="whatsapp"
              class="form-control"
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>

          <div class="form-group">
            <label for="department">Departemen Pilihan</label>
            <select id="department" class="form-control" required>
              <option value="" disabled selected>Pilih Departemen</option>
              <option value="Akademik & Keilmuan">Akademik & Keilmuan</option>
              <option value="Media & Publikasi">Media & Publikasi</option>
              <option value="Acara & Humas">Acara & Humas</option>
              <option value="PSDM">PSDM</option>
              <option value="Olahraga">Olahraga</option>
            </select>
          </div>

          <div class="form-group">
            <label for="reason">Alasan Bergabung</label>
            <textarea
              id="reason"
              class="form-control"
              rows="4"
              placeholder="Jelaskan alasanmu bergabung dengan HIMASI..."
              required
            ></textarea>
          </div>

          <button type="submit" class="btn btn-primary btn-block form-btn">
            Kirim Pendaftaran
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import "../../../../template/himasi/css/style-pendaftaran.css";
</script>
