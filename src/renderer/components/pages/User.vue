<template>
  <user-management></user-management>
</template>

<script>
  import UserManagement from '@/components/views/user/UserManagement'
  export default {
    name: 'user-page',
    components: { 
      'user-management': UserManagement
    }
  }
</script>
