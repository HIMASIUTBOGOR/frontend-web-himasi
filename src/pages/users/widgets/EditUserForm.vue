<script setup lang="ts">
import { PropType, computed, ref, watch, onMounted } from "vue";
import { useForm } from "vuestic-ui";
import { User } from "../types";
import UserAvatar from "./UserAvatar.vue";
import { validators } from "../../../services/utils";
import { getEnumeration } from "../../../services/enumeration.service";
import { getRoles } from "../../../services/user.service";

const props = defineProps({
  user: {
    type: Object as PropType<User | null>,
    default: null,
  },
  saveButtonLabel: {
    type: String,
    default: "Save",
  },
});

const defaultNewUser = {
  name: "",
  nim: "",
  email: "",
  password: "",
  jabatan_id: "",
  role_id: "",
  avatar: "",
};

const newUser = ref({ ...defaultNewUser });
const avatarFile = ref<File>();
const avatarPreview = ref("");

// Watch jabatan_id changes
watch(
  () => newUser.value.jabatan_id,
  (newVal) => {
    console.log("jabatan_id changed to:", newVal);
    console.log("type of jabatan_id:", typeof newVal);
  }
);

const isFormHasUnsavedChanges = computed(() => {
  return Object.keys(newUser.value).some((key) => {
    if (key === "avatar") {
      return false;
    }
    return (
      newUser.value[key as keyof typeof newUser.value] !==
      (props.user ?? defaultNewUser)?.[key as keyof typeof defaultNewUser]
    );
  });
});

defineExpose({
  isFormHasUnsavedChanges,
});

watch(
  [() => props.user],
  () => {
    if (!props.user) {
      newUser.value = { ...defaultNewUser };
      avatarFile.value = undefined;
      avatarPreview.value = "";
      return;
    }

    newUser.value = {
      name: props.user.name || "",
      nim: props.user.nim || "",
      email: props.user.email || "",
      password: "",
      jabatan_id: props.user.jabatan_id || "",
      role_id: props.user.roles?.[0]?.id?.toString() || "",
      avatar: props.user.avatar || "",
    };
    avatarPreview.value = props.user.avatar || "";
  },
  { immediate: true }
);

const makeAvatarBlobUrl = (avatar: File) => {
  return URL.createObjectURL(avatar);
};

watch(avatarFile, (newAvatar) => {
  avatarPreview.value = newAvatar ? makeAvatarBlobUrl(newAvatar) : "";
});

// Watch jabatan_id changes for debugging
watch(
  () => newUser.value.jabatan_id,
  (newValue, oldValue) => {
    console.log("=== Jabatan ID Changed ===");
    console.log("Old value:", oldValue);
    console.log("New value:", newValue);
    console.log("Type of new value:", typeof newValue);
    const selectedJabatan = jabatanOptions.value.find((j) => j.id === newValue);
    console.log("Selected jabatan object:", selectedJabatan);
    console.log("All jabatan options:", jabatanOptions.value);
    console.log("========================");
  }
);

// Watch jabatan_id changes for debugging
watch(
  () => newUser.value.jabatan_id,
  (newValue, oldValue) => {
    console.log("=== Jabatan ID Changed ===");
    console.log("Old value:", oldValue);
    console.log("New value:", newValue);
    console.log("Type of new value:", typeof newValue);
    const selectedJabatan = jabatanOptions.value.find((j) => j.id === newValue);
    console.log("Selected jabatan object:", selectedJabatan);
    console.log("All jabatan options:", jabatanOptions.value);
    console.log("========================");
  }
);

// Watch jabatan_id changes
watch(
  () => newUser.value.jabatan_id,
  (newValue, oldValue) => {
    console.log("Jabatan ID changed!");
    console.log("Old value:", oldValue);
    console.log("New value:", newValue);
    console.log("Type of new value:", typeof newValue);
    const selectedJabatan = jabatanOptions.value.find((j) => j.id === newValue);
    console.log("Selected jabatan object:", selectedJabatan);
  }
);

const form = useForm("add-user-form");

const emit = defineEmits(["close", "save"]);

const onSave = () => {
  if (form.validate()) {
    console.log("newUser data:", newUser.value);
    console.log("jabatan_id value:", newUser.value.jabatan_id);

    // Create FormData for file upload
    const formData = new FormData();
    formData.append("name", newUser.value.name);
    formData.append("nim", newUser.value.nim);
    formData.append("email", newUser.value.email);
    if (newUser.value.password) {
      formData.append("password", newUser.value.password);
    }
    if (newUser.value.jabatan_id) {
      formData.append("jabatan_id", newUser.value.jabatan_id);
    }
    formData.append("role_id", newUser.value.role_id);
    if (avatarFile.value) {
      formData.append("avatar", avatarFile.value);
    }

    console.log("FormData entries:");
    for (let pair of formData.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    emit("save", { formData, isEdit: !!props.user });
  }
};

// Fetch jabatan from API
const jabatanOptions = ref<Array<{ id: string; value: string }>>([]);
const roleOptions = ref<Array<{ id: string; name: string }>>([]);
const isLoadingJabatan = ref(false);
const isLoadingRole = ref(false);

const fetchJabatan = async () => {
  try {
    isLoadingJabatan.value = true;
    const response = await getEnumeration("jabatan");
    console.log("Raw API response:", response);
    jabatanOptions.value = response.enumeration.map((item: any) => ({
      id: item.id,
      value: item.value,
    }));
    console.log("jabatanOptions after mapping:", jabatanOptions.value);
    console.log("Total jabatan options:", jabatanOptions.value.length);
  } catch (error) {
    console.error("Failed to fetch jabatan:", error);
    jabatanOptions.value = [];
  } finally {
    isLoadingJabatan.value = false;
  }
};

const fetchRole = async () => {
  try {
    isLoadingRole.value = true;
    const response = await getRoles();
    roleOptions.value = response.roles.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  } catch (error) {
    console.error("Failed to fetch role:", error);
    roleOptions.value = [];
  } finally {
  }
};

// Load jabatan options on mount
onMounted(() => {
  console.log("=== Component Mounted ===");
  fetchRole();
  fetchJabatan();
});
</script>

<template>
  <VaForm
    v-slot="{ isValid }"
    ref="add-user-form"
    class="flex-col justify-start items-start gap-4 inline-flex w-full"
  >
    <VaFileUpload
      v-model="avatarFile"
      type="single"
      hide-file-list
      class="self-stretch justify-start items-center gap-4 inline-flex"
    >
      <UserAvatar
        :user="{ avatar: avatarPreview, name: newUser.name }"
        size="large"
      />
      <VaButton preset="primary" size="small">Add image</VaButton>
      <VaButton
        v-if="avatarFile"
        preset="primary"
        color="danger"
        size="small"
        icon="delete"
        class="z-10"
        @click.stop="
          avatarFile = undefined;
          avatarPreview = '';
        "
      />
    </VaFileUpload>
    <div class="self-stretch flex-col justify-start items-start gap-4 flex">
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.name"
          label="Name"
          placeholder="Enter full name"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="name"
        />
        <VaInput
          v-model="newUser.nim"
          label="NIM"
          placeholder="Enter NIM"
          class="w-full sm:w-1/2"
          :rules="[validators.required]"
          name="nim"
        />
      </div>
      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaInput
          v-model="newUser.email"
          label="Email"
          placeholder="Enter email"
          class="w-full sm:w-1/2"
          :rules="[validators.required, validators.email]"
          name="email"
        />
        <VaInput
          v-model="newUser.password"
          label="Password"
          type="password"
          placeholder="Enter password"
          class="w-full sm:w-1/2"
          :rules="props.user ? [] : [validators.required]"
          name="password"
        />
      </div>

      <div class="flex gap-4 flex-col sm:flex-row w-full">
        <VaSelect
          v-model="newUser.jabatan_id"
          label="Jabatan (Optional)"
          placeholder="Select jabatan"
          class="w-full sm:w-1/2"
          :options="jabatanOptions"
          value-by="id"
          text-by="value"
          name="jabatan_id"
          clearable
        />
        <VaSelect
          v-model="newUser.role_id"
          label="Role"
          placeholder="Select role"
          class="w-full sm:w-1/2"
          :options="roleOptions"
          value-by="id"
          text-by="name"
          :rules="[validators.required]"
          name="role"
        />
      </div>

      <div
        class="flex gap-2 flex-col-reverse items-stretch justify-end w-full sm:flex-row sm:items-center"
      >
        <VaButton preset="secondary" color="secondary" @click="$emit('close')"
          >Cancel</VaButton
        >
        <VaButton :disabled="!isValid" @click="onSave">{{
          saveButtonLabel
        }}</VaButton>
      </div>
    </div>
  </VaForm>
</template>
