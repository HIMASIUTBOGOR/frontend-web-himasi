<template>
  <VaForm ref="form" @submit.prevent="submit">
    <div class="flex justify-center items-center">
      <img src="/images/logo-single.png" alt="logo himasi" width="40%" />
    </div>
    <h1 class="font-semibold text-4xl mb-4">Log in</h1>
    <p class="text-base mb-4 leading-5">Log in to your account</p>

    <VaInput
      v-model="formData.nim"
      :rules="[validators.required]"
      class="mb-4"
      label="nim"
      type="text"
    />
    <VaValue v-slot="isPasswordVisible" :default-value="false">
      <VaInput
        v-model="formData.password"
        :rules="[validators.required]"
        :type="isPasswordVisible.value ? 'text' : 'password'"
        class="mb-4"
        label="Password"
        @clickAppendInner.stop="
          isPasswordVisible.value = !isPasswordVisible.value
        "
      >
        <template #appendInner>
          <VaIcon
            :name="
              isPasswordVisible.value ? 'mso-visibility_off' : 'mso-visibility'
            "
            class="cursor-pointer"
            color="secondary"
          />
        </template>
      </VaInput>
    </VaValue>

    <div class="flex justify-center mt-4">
      <VaButton class="w-full" @click="submit"> Login</VaButton>
    </div>
  </VaForm>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useForm, useToast } from "vuestic-ui";
import { validators } from "../../services/utils";

const { validate } = useForm("form");
const { push } = useRouter();
const { init } = useToast();

const formData = reactive({
  nim: "",
  password: "",
  keepLoggedIn: false,
});

const submit = () => {
  if (validate()) {
    init({ message: "You've successfully logged in", color: "success" });
    push({ name: "dashboard" });
  }
};
</script>
