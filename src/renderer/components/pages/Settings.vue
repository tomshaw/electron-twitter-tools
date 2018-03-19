<template>
  <system-settings></system-settings>
</template>

<script>
  import SystemSettings from '@/components/views/settings/SystemSettings'

  export default {
    name: 'settings-page',
    components: { 
      'system-settings': SystemSettings
    }
  }
</script>
