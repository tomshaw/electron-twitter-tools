<template>
  <search-management></search-management>
</template>

<script>
  import SearchManagement from '@/components/views/search/SearchManagement'
  export default {
    name: 'search-page',
    components: { 
      'search-management': SearchManagement
    }
  }
</script>
