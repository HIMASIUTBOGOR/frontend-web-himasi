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

        <!-- Success Message -->
        <div v-if="successMessage" class="alert alert-success" role="alert">
          {{ successMessage }}
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>

        <form class="registration-form" @submit="handleSubmit">
          <div class="form-group">
            <label for="fullname">Nama Lengkap</label>
            <input
              type="text"
              id="fullname"
              class="form-control"
              placeholder="Masukkan nama lengkap"
              v-model="formData.fullname"
              required
            />
          </div>

          <div class="form-group">
            <label for="nim">NIM</label>
            <input
              type="text"
              id="nim"
              class="form-control"
              placeholder="Masukkan NIM"
              v-model="formData.nim"
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
            <select
              id="semester"
              class="form-control"
              v-model="formData.semester"
              required
            >
              <option value="" disabled>Pilih Semester</option>
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
              v-model="formData.whatsapp"
              required
            />
          </div>

          <div class="form-group">
            <label for="department">Departemen Pilihan</label>
            <select
              id="department"
              class="form-control"
              v-model="formData.department"
              :disabled="isLoadingDepartments"
              required
            >
              <option value="" disabled>
                {{
                  isLoadingDepartments
                    ? "Memuat departemen..."
                    : "Pilih Departemen"
                }}
              </option>
              <option
                v-for="dept in departments"
                :key="dept.id"
                :value="dept.id"
              >
                {{ dept.title }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="reason">Alasan Bergabung</label>
            <textarea
              id="reason"
              class="form-control"
              rows="4"
              placeholder="Jelaskan alasanmu bergabung dengan HIMASI..."
              v-model="formData.reason"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            class="btn btn-primary btn-block form-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? "Mengirim..." : "Kirim Pendaftaran" }}
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { createRegistration } from "../../../services/registration/registration.service";
import { getContentDepartments } from "../../../services/content.service";
import type { payloadRegistration } from "../../../interfaces/IRegistration";
import "../../../../template/himasi/css/style-pendaftaran.css";

interface Department {
  id: string;
  icon: string;
  title: string;
  desc: string;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

// Form state
const formData = ref({
  fullname: "",
  nim: "",
  semester: "",
  whatsapp: "",
  department: "",
  reason: "",
});

const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const departments = ref<Department[]>([]);
const isLoadingDepartments = ref(false);

// Load departments on component mount
onMounted(async () => {
  isLoadingDepartments.value = true;
  try {
    const response = await getContentDepartments();
    departments.value = response.data || [];
  } catch (error) {
    console.error("Failed to load departments:", error);
  } finally {
    isLoadingDepartments.value = false;
  }
});

// Handle form submission
const handleSubmit = async (e: Event) => {
  e.preventDefault();

  // Reset messages
  successMessage.value = "";
  errorMessage.value = "";

  // Validation
  if (
    !formData.value.fullname ||
    !formData.value.nim ||
    !formData.value.semester ||
    !formData.value.whatsapp ||
    !formData.value.department ||
    !formData.value.reason
  ) {
    errorMessage.value = "Semua field harus diisi";
    return;
  }

  isLoading.value = true;

  try {
    const payload: payloadRegistration = {
      fullname: formData.value.fullname,
      nim: formData.value.nim,
      semester: formData.value.semester,
      no_wa: formData.value.whatsapp,
      department_id: formData.value.department,
      reason: formData.value.reason,
    };

    await createRegistration(payload);

    successMessage.value = "Pendaftaran berhasil dikirim!";

    // Reset form
    formData.value = {
      fullname: "",
      nim: "",
      semester: "",
      whatsapp: "",
      department: "",
      reason: "",
    };
  } catch (error: any) {
    errorMessage.value =
      error.message || "Terjadi kesalahan saat mengirim pendaftaran";
  } finally {
    isLoading.value = false;
  }
};
</script>
