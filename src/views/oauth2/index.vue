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

          <el-button :loading="loading" type="info" style="width: 48%" @click="cancelConsent"
            >Cancel
          </el-button>
          <el-button
            :loading="loading"
            type="primary"
            style="width: 48%; float: right"
            @click="handleConsent"
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
<script setup lang="ts">
import { authorizeConsent, oauth2Authorize } from '@/api/user'
import { useRoute } from 'vue-router'

defineOptions({
  name: 'ConsentIndex',
})
const state = reactive({
  consentForm: {
    client_id: '',
    state: '',
  },
  checkScopes: [],
  principalName: '',
  redirectUri: '',
  scopes: [],
  loading: false,
})
const { consentForm, checkScopes, principalName, redirectUri, scopes, loading } = toRefs(state)

const cancelConsent = () => {
  checkScopes.value = []
  handleConsent()
}
const handleConsent = () => {
  loading.value = true
  authorizeConsent(Object.assign({}, consentForm.value, { scope: checkScopes.value }))
    .then((response) => {
      if (response.code === 302) {
        location.href = response.data
      }
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}
const route = useRoute()
const oauth2Authorize2 = () => {
  const requestParams = {
    response_type: route.query.response_type,
    client_id: route.query.client_id,
    scope: route.query.scope,
    state: route.query.state,
    redirect_uri: route.query.redirect_uri,
    nonce: route.query.nonce,
  }
  oauth2Authorize(requestParams)
    .then((response) => {
      if (response.code === 200) {
        state.principalName = response.data.principalName
        state.consentForm.client_id = response.data.clientId
        state.consentForm.state = response.data.state
        state.scopes = response.data.scopes
        state.checkScopes = response.data.scopes.map((data) => data.scope)
        state.redirectUri = response.data.redirectUri
      } else if (response.code === 302) {
        location.href = response.data
      }
    })
    .catch(() => {})
}
onMounted(() => {
  oauth2Authorize2()
})
</script>

<style lang="scss" scoped>
.consent-container {
  min-height: 100%;
  width: 100%;
  background-color: #f6f8fa;
  overflow: hidden;
}

.form-container {
  width: 100%;
  padding: 30px;
  border: #cccccc 1px solid;
  border-radius: 10px;
}
</style>
