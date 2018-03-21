<template>
  <dashboard-management></dashboard-management>
</template>

<script>
  import DashboardManagement from '@/components/views/dashboard/DashboardManagement'
  export default {
    name: 'dashboard-page',
    components: { 
      'dashboard-management': DashboardManagement
    }
  }
</script>