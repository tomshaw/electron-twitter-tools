<template>
  <v-footer :fixed="fixed" height="auto" class="grey darken-3">
    <v-layout row wrap justify-center>
      <v-flex xs12 py-3 text-xs-center white--text>
        <v-btn color="white" flat v-for="link in links" :key="link">{{ link }}</v-btn>
        &copy;2018 — <strong>Vuetify</strong>
      </v-flex>
    </v-layout>
  </v-footer>
</template>

<script>
  export default {
    name: 'app-footer',
    props: ['fixed'],
    data: () => ({
      links: ['Home', 'About Us', 'Team', 'Services', 'Blog', 'Contact Us']
    })
  }
</script>
