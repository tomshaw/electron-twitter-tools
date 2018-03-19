<template>
  <lookup-management></lookup-management>
</template>

<script>
  import LookupManagement from '@/components/views/lookup/LookupManagement'
  export default {
    name: 'lookup-page',
    components: { 
      'lookup-management': LookupManagement
    }
  }
</script>
