<template>
  <div class="consent-container">
    <div style="width: 45%; height: 50%; margin: 100px auto">
      <h3 style="text-align: center">
        <b>{{ principalName }}</b> wants the following permission
      </h3>
      <div class="form-container">
        <el-form
          ref="consentForm"
          :model="consentForm"
          class="consent-form"
          auto-complete="on"
          label-position="left"
        >
          <el-input
            ref="client_id"
            v-model="consentForm.client_id"
            name="client_id"
            type="hidden"
          />
          <el-input ref="state" v-model="consentForm.state" name="state" type="hidden" />
          <el-form-item>
            <el-checkbox-group v-model="checkScopes">
              <el-checkbox
                v-for="scope in scopes"
                :key="scope"
                :disabled="scope.disabled"
                :label="scope.scope"
                >{{ scope.description }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <hr />

          <el-button
            :loading="loading"
            type="info"
            style="width: 48%"
            @click.native.prevent="cancelConsent"
            >Cancel
          </el-button>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 48%; float: right"
            @click.native.prevent="handleConsent"
          >
            Authorize thepracticaldev
          </el-button>

          <div style="margin-top: 5px; width: 100%; height: 50px">
            <p style="text-align: center; font-size: 14px">Authorization will redirect to</p>
            <p style="text-align: center; font-size: 14px">
              <b>{{ redirectUri }}</b>
            </p>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
defineOptions({
  name: 'c',
})
</script>
