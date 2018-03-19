<template>
  <status-management></status-management>
</template>

<script>
  import StatusManagement from '@/components/views/status/StatusManagement'

  export default {
    name: 'status-page',
    components: { 
      'status-management': StatusManagement
    }
  }
</script>
