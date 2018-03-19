<template>
  <v-content>
    <v-container fluid><!-- fill-height -->
      <!-- <v-alert type="success" :value="true" dismissible>This is a success alert.</v-alert> -->
      <v-slide-y-transition mode="out-in">
        <router-view></router-view>
      </v-slide-y-transition>
    </v-container>
    <trends-modal></trends-modal>
  </v-content>
</template>

<script>
  import TrendsModal from '@/components/shared/Blocks/TrendsModal'
  export default {
    name: 'app-content',
    components: {
      'trends-modal': TrendsModal
    }
  }
</script>
