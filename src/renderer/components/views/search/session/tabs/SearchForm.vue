<template>
  <v-card flat>
    <v-card-text>
      <v-container grid-list-md text-xs-center>
        <v-form v-model="valid" ref="form" lazy-validation>
          <v-layout row wrap>
            <v-flex xs12 sm6>
              <v-text-field label="Title" prepend-icon="card_travel" v-model="options.title" :counter="30" :rules="titleRules" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field label="Keywords" prepend-icon="sort_by_alpha" v-model="options.keyword" :counter="30" :rules="keywordRules" required></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select label="Include Retweets" prepend-icon="repeat" v-model="options.include_retweets" :items="retweets"></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select label="Include Quotes" prepend-icon="speaker_notes" v-model="options.include_quotes" :items="quotes"></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select label="Include Language" multiple single-line item-text="name" item-value="code" prepend-icon="g_translate" v-model="options.include_language" :items="langs"></v-select>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select label="Verified Accounts" prepend-icon="verified_user" v-model="options.verified_accounts" :items="verified"></v-select>
            </v-flex>
            <v-flex xs12 text-xs-left>
              <v-btn color="success" v-if="!active" @click.native="handleSubmitButton()"><v-icon left dark>create</v-icon> Start Session</v-btn>
              <v-btn v-if="!active" @click.native="handleResetButton()">Reset</v-btn>
              <v-btn color="error" v-if="active" @click.native="handleStopButton()"><v-icon left dark>save</v-icon> Finish Session</v-btn>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card-text>
  </v-card>
</template>

<script>
  import { mapActions, mapMutations } from 'vuex'
  import InitialState from './InitialState'
  export default {
    name: 'search-form',
    props: ['active'],
    data: () => {
      return InitialState()
    },
    created() {
      // console.log('this.data', this.$data)
    },
    destroyed() {
      if (this.active) {
        this.handleStopButton()
      }
    },
    methods: {
      ...mapMutations({
        searchActive: 'SEARCH_SESSION_ACTIVE'
      }),
      ...mapActions(['searchSave', 'searchOptions', 'streamStart', 'streamEnd']),
      handleResetButton() {
        Object.assign(this.$data, InitialState())
        this.$refs.form.reset()
      },
      handleStopButton() {
        this.streamEnd()
        Object.assign(this.$data, InitialState())
        this.$refs.form.reset()
      },
      handleSubmitButton() {
        if (this.$refs.form.validate()) {
          const options = this.options
          options.type = 'user'
          this.searchActive(true)
          this.searchSave(options).then((response) => {
            this.streamStart(response)
          })
        }
      }
    }
  }
</script>
