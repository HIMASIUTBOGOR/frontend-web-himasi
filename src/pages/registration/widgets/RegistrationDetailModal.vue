<script setup lang="ts">
import { PropType, computed } from "vue";
import { Registration } from "../type";

const props = defineProps({
  registration: {
    type: Object as PropType<Registration | null>,
    default: null,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", value: boolean): void;
  (event: "export-pdf", registration: Registration): void;
}>();

const showModal = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const onExportPdf = () => {
  if (props.registration) {
    emit("export-pdf", props.registration);
  }
};
</script>

<template>
  <VaModal
    v-model="showModal"
    size="medium"
    title="Registration Detail"
    hide-default-actions
  >
    <template v-if="registration">
      <div class="space-y-4">
        <!-- Personal Information -->
        <div class="detail-section">
          <h3 class="section-title">Personal Information</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Full Name</span>
              <span class="detail-value">{{ registration.fullname }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">NIM</span>
              <span class="detail-value">{{ registration.nim }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Semester</span>
              <span class="detail-value">{{ registration.semester }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">WhatsApp Number</span>
              <span class="detail-value">{{ registration.no_wa }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Department</span>
              <span class="detail-value">{{
                registration.department_name || "-"
              }}</span>
            </div>
          </div>
        </div>

        <!-- Reason -->
        <div class="detail-section" v-if="registration.reason">
          <h3 class="section-title">Reason for Joining</h3>
          <div class="detail-item">
            <p class="detail-value reason-text">{{ registration.reason }}</p>
          </div>
        </div>

        <!-- Metadata -->
        <div class="detail-section">
          <h3 class="section-title">Registration Info</h3>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Registration Date</span>
              <span class="detail-value">{{
                formatDate(registration.created_at)
              }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Last Updated</span>
              <span class="detail-value">{{
                formatDate(registration.updated_at)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <VaButton preset="secondary" @click="showModal = false">
          Close
        </VaButton>
        <VaButton icon="mso-download" @click="onExportPdf" v-if="registration">
          Export to PDF
        </VaButton>
      </div>
    </template>
  </VaModal>
</template>

<style scoped>
.space-y-4 > * + * {
  margin-top: 1.5rem;
}

.detail-section {
  padding: 1rem;
  background-color: var(--va-background-element);
  border-radius: 0.5rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: var(--va-primary);
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--va-text-secondary);
}

.detail-value {
  font-size: 1rem;
  color: var(--va-text-primary);
  word-wrap: break-word;
}

.reason-text {
  white-space: pre-wrap;
  line-height: 1.6;
}
</style>
