<template>
  <div>
    <v-dialog v-model="dialog" max-width="500px"> 
      <v-card>
        <v-card-title> <span class="headline">{{ formTitle }}</span> </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field label="Title" v-model="editedItem.title"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field label="Keyword" v-model="editedItem.keyword"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="Start time" v-model="editedItem.start_time" disabled></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field label="End Time" v-model="editedItem.end_time" disabled></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-toolbar dark color="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Search Sessions</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn small @click.native="create" color="error" class="white--text">
        <v-icon left dark>list</v-icon>New Session
      </v-btn>
    </v-toolbar>
    <v-data-table :headers="headers" :items="items" hide-actions class="elevation-1">
      <template slot="items" slot-scope="props">
        <td class="text-xs-left">{{ props.item.title }}</td>
        <td class="text-xs-left">{{ props.item.keyword }}</td>
        <td class="text-xs-right">{{ props.item.tweet_count }}</td>
        <td class="text-xs-right">{{ props.item.start_time }}</td>
        <td class="text-xs-right">{{ props.item.end_time }}</td>
        <td class="text-xs-center">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <v-btn color="primary" @click="initialize">Reset</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'search-grid',
    data: () => ({
      dialog: false,
      headers: [
        { text: 'Session title', value: 'title', align: 'left' },
        { text: 'Keywords', value: 'keyword', align: 'left' },
        { text: 'Tweet count', value: 'tweet_count', align: 'right' },
        { text: 'Start time', value: 'start_time', align: 'right' },
        { text: 'End time', value: 'end_time', align: 'right' },
        { text: 'Actions', value: 'name', align: 'center', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        title: '',
        keyword: '',
        start_time: 0,
        end_time: 0
      },
      defaultItem: {
        title: '',
        keyword: '',
        start_time: 0,
        end_time: 0
      }
    }),
    computed: {
      ...mapGetters({
        items: 'getSearchSessions'
      }),
      formTitle () {
        return this.editedIndex === -1 ? 'New Session' : 'Edit Session'
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        this.$store.dispatch('loadSearchSessions')
      },
      editItem (item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        const id = item.id
        confirm('Are you sure you want to delete this session?') && this.$store.dispatch('deleteSearchSession', id)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 1e3 / 3)
      },
      save () {
        if (this.editedIndex > -1) {
          const data = this.editedItem
          this.$store.dispatch('updateSearchSession', data)
          //Object.assign(this.items[this.editedIndex], this.editedItem)
        }
        this.close()
      },
      create () {
        this.$router.push({ name: 'search-create' })
      }
    }
  }
</script>
