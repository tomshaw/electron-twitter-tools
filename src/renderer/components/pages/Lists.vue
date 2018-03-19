<template>
  <list-management></list-management>
</template>

<script>
  import ListManagement from '@/components/views/lists/ListManagement'
  export default {
    name: 'lists-page',
    components: { 
      'list-management': ListManagement
    }
  }
</script>
