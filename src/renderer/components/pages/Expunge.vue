<template>
  <expunge-management></expunge-management>
</template>

<script>
  import ExpungeManagement from '@/components/views/expunge/ExpungeManagement'
  export default {
    name: 'expunge-page',
    components: { 
      'expunge-management': ExpungeManagement
    }
  }
</script>
