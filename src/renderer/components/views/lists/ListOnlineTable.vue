<template>
  <v-data-table v-bind:headers="headers" :items="lists" v-bind:pagination.sync="pagination" :rows-per-page-items="rowsPerPageItems" class="elevation-1">
    <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
    <template slot="items" slot-scope="props">
      <td class="text-xs-left">{{ props.item.name }}</td>
      <td class="text-xs-right">{{ props.item.mode }}</td>
      <td class="text-xs-right">{{ props.item.member_count }}</td>
      <td class="text-xs-right">{{ props.item.created_at | timeAgo }}</td>
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
                <v-text-field label="List Name" name="slug" prepend-icon="font_download" :value="props.item.name"></v-text-field>
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
  export default {
    name: 'list-online-table',
    props: ['lists'],
    data () {
      return {
        pagination: {
          sortBy: 'created_at',
          descending: true
        },
        rowsPerPageItems: [25, 50, 75, 100, { text: 'All', value: -1 }],
        headers: [
          { text: 'Name', align: 'left', value: 'name' },
          { text: 'Mode', align: 'right', value: 'mode' },
          { text: 'Members', align: 'right', value: 'member_count' },
          { text: 'Created', align: 'right', value: 'created_at' },
          { text: 'Actions', align: 'center', sortable: false, value: 'actions' }
        ]
      }
    },
    mounted() {
      this.db = new Database(this.$settings.get('storage.connection'))
      this.client = new Twitter(this.$settings.get('twitter.tokens'))
    },
    methods: {
      ...mapActions(['deleteListRemote', 'loadSavedLists', 'updateListRemote']),
      submit (item, event) {
        event.preventDefault()
        const slug = event.target.elements.slug.value
        if (slug) {
          this.updateListRemote({
            list_id: item.id_str,
            slug: item.slug,
            name: slug
          }).then((response) => {
            this.$toastr('success', 'List successfully updated.', 'Success')
          })
        }
      },
      deleteList: function (item, event) {
        if (event) event.preventDefault()
        let target = event.target

        if (target.innerHTML === 'delete') {
          target.innerHTML = 'delete_forever'
        } else {
          let options = {
            list_id: item.id_str,
            slug: item.slug
          }
          target.innerHTML = 'delete'
          this.deleteListRemote(options).then((response) => {
            this.$toastr('success', 'List successfully deleted.', 'Success')
          })
        }
      },
      selectList: function (item, event) {
        if (event) event.preventDefault()
        let target = event.target

        this.$store.commit('TASKS_SET_PROGRESS', {
          id: 'save',
          name: item.slug,
          total: item.member_count,
          done: 0
        })

        if (target.innerHTML === 'cloud_upload') {
          target.innerHTML = 'check_circle'
        } else {

          let params = {
            list_id: item.id_str,
            slug: item.slug,
            owner_id: this.$account.id, 
            owner_screen_name: this.$account.screen_name
          }

          this.db.api('lists').insert([{
            list_id: params.list_id,
            slug: params.slug,
            created_at: this.db.api.fn.now()
          }]).returning('id').then(response => {
            const lastInsertId = response[0]
            this.createBackup(lastInsertId, params.list_id, params.slug, params.owner_id, params.owner_screen_name)
          }).catch(error => {
            this.$toastr('error', error[0].message, 'Error Message')
          })
        }
      },
      createBackup(backupId, listId, slug, ownerId, ownerScreenName, counter = 0, cursor = -1) {

        let options = {
          list_id: listId,
          slug: slug,
          owner_id: ownerId,
          owner_screen_name: ownerScreenName,
          include_entities: false,
          skip_status: true,
          cursor: cursor
        }

        this.client.listMembers(options).then(response => {

          let nextCursor = response.next_cursor
          let nextCursorString = response.next_cursor_str
          let users = response.users
          let total = users.length
          let completed = 0

          if (total) {
            users.forEach((user, index) => {

              let insert = {}
              insert.list_id = backupId
              insert.user_id = user.id
              insert.name = user.name.replace(/[\u0800-\uFFFF]/g, '')
              insert.screen_name = user.screen_name.replace(/[\u0800-\uFFFF]/g, '')
              if (user.location) {
                insert.location = user.location.replace(/[\u0800-\uFFFF]/g, '')
              }
              if (user.url) {
                insert.url = user.url.replace(/[\u0800-\uFFFF]/g, '')
              }
              insert.followers = user.followers_count
              insert.friends = user.friends_count
              insert.time_zone = user.time_zone
              insert.verified = user.verified
              insert.statuses_count = user.statuses_count
              insert.lang = user.lang

              this.db.api('lists_store').insert([insert]).then(response => {
                this.$store.commit('TASKS_SET_PROGRESS', { id: 'save', done: counter })
                completed++
              }).then(() => {
                if (nextCursor === 0 && completed === total - 1) {
                  setTimeout(() => {
                    this.loadSavedLists()
                    this.$store.commit('TASKS_RESET_PROGRESS')
                    this.$toastr('success', `List ${options.slug} successfully saved.`, 'Success')
                  }, 2e3)
                }
              }).catch(err => {
                console.log(err)
              })

              counter++
            })

          }

          if (nextCursor > 0) {
            setTimeout(() => {
              this.createBackup(backupId, listId, slug, ownerId, ownerScreenName, counter, nextCursorString)
            }, 1e3 / 3)
          }

        })
      }
    }
  }
</script>

<style scoped>
i.material-icons {
  cursor: pointer;
}
</style>
