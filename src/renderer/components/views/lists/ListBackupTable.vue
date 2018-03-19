<template>
  <v-data-table v-bind:headers="headers" :items="lists" v-bind:pagination.sync="pagination" :rows-per-page-items="rowsPerPageItems" class="elevation-1">
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.slug }}</td>
      <td class="text-xs-left">{{ props.item.member_count }}</td>
      <td class="text-xs-left">{{ props.item.created_at }}</td>
      <td class="text-xs-center">
        <v-icon @click="props.expanded = !props.expanded">create</v-icon>
        <v-icon @click="selectList(props.item, $event)">cloud_upload</v-icon>
        <v-icon @click="deleteList(props.item, $event)">delete</v-icon>
      </td>
    </template>
    <template slot="expand" slot-scope="props">
      <v-card flat>
        <v-card-text>
          <v-form ref="form" v-on:submit="submit(props.item, $event)">
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field label="List Name" name="slug" prepend-icon="font_download" :value="props.item.slug"></v-text-field>
              </v-flex>
              <v-spacer></v-spacer>
              <v-flex xs5> 
                <v-btn small type="submit">submit</v-btn>
                <v-btn small @click="props.expanded = !props.expanded">cancel</v-btn>
              </v-flex>
            </v-layout>
          </v-form>
        </v-card-text>
      </v-card>
    </template>
  </v-data-table>
</template>

<script>
  import { mapActions } from 'vuex'
  import Database from '@/library/storage'
  import Twitter from '@/library/twitter'
  import {chunks, randomString} from '@/config/helpers'
  export default {
    name: 'list-backup-table',
    props: ['lists'],
    data () {
      return {
        slug: [],
        pagination: {
          sortBy: 'created_at',
          descending: true,
          rowsPerPage: '-1'
        },
        rowsPerPageItems: [25, 50, 75, 100, { text: 'All', value: -1 }],
        headers: [
          { text: 'Name', align: 'left', value: 'slug' },
          { text: 'Members', align: 'left', value: 'member_count' },
          { text: 'Created', align: 'left', value: 'created_at' },
          { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
        ]
      }
    },
    mounted() {
      this.db = new Database(this.$settings.get('storage.connection'))
      this.client = new Twitter(this.$settings.get('twitter.tokens'))
      this.account = this.$settings.get('twitter.profile')
    },
    methods: {
      ...mapActions(['deleteListLocal', 'loadActiveLists', 'updateListLocal']),
      submit (item, event) {
        event.preventDefault()
        const slug = event.target.elements.slug.value
        if (slug) {
          this.updateListLocal({
            id: item.id,
            slug: slug
          })
        }
      },
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.lists.slice()
      },
      changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      },
      deleteList: function (item, event) {
        if (event) event.preventDefault()
        let target = event.target
        if (target.innerHTML === 'delete') {
          target.innerHTML = 'delete_forever'
        } else {
          target.innerHTML = 'delete'
          this.deleteListLocal(item.id)
        }
      },
      updateList: function (item, event) {
        if (event) event.preventDefault()
        // let target = event.target
        console.log('item', item)
      },
      selectList: function (item, event) {
        if (event) event.preventDefault()
        let target = event.target

        this.$store.commit('TASKS_SET_PROGRESS', {
          id: 'restore',
          name: item.slug,
          total: item.member_count,
          done: 0
        })

        if (target.innerHTML === 'cloud_upload') {
          target.innerHTML = 'check_circle'
        } else {

          const id = item.id
          const name = item.slug
          const mode = 'private'

          this.fetchListMembers(id, (members) => {
            this.postListCreate(name, mode, members)
          })
        }
      },
      postListCreate(name, mode, members) {
        this.client.postList({
          name: name + randomString(5),
          mode: mode
        }, (response) => {
          if (!response.hasOwnProperty('errors')) { 
            this.postListCreateAll({
              slug: response.slug,
              list_id: response.id_str,
              members: members
            })
          }
        })
      },
      postListCreateAll(options) {
        const size = 90

        let members = options.members
        let parts = chunks(members, size)
        let partsLength = parts.length

        const processChunks = (counter, increment = 0) => {

          let total = parts[counter].length

          for (let i = increment; i <= total; i++) {
            this.$store.commit('TASKS_SET_PROGRESS', { id: 'restore', done: i })
          }

          let opts = {
            slug: options.slug,
            list_id: options.list_id,
            user_id: parts[counter].join(', ')
          }

          this.client.postListCreateAll(opts, response => {
            if (counter < partsLength - 1) {
              processChunks(counter + 1, increment + total)
            } else {
              this.$store.commit('TASKS_RESET_PROGRESS')
              this.loadActiveLists()
            }
          })
        }

        processChunks(0, 0)
      },
      fetchListMembers(id, next) {

        let select = this.db.api.select('user_id')
          .from('lists_store')
          .where('list_id', id)

        let ids = []
        select.then(rows => {
          if (rows.length) {
            rows.forEach((row, index) => {
              ids.push(row.user_id)
            })
            next(ids)
          }
        })

      }
    }
  }
</script>

<style scoped>
i.material-icons {
  cursor: pointer
}
</style>
