<template>
  <v-card>
    <v-toolbar dark>
      <v-list-tile-avatar>
        <img :src="profile.profile_image_url" :alt="profile.screen_name">
      </v-list-tile-avatar>
      <v-toolbar-title>{{profile.name}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        {{wordCount}} 
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-form ref="form" lazy-validation>
        <v-text-field label="What's Happening?" :value="message" @input="handleMessage" :counter="130" multi-line required></v-text-field>
        <v-btn @click="submit">submit</v-btn>
        <label class="white--text btn" data-ripple="true" style="position: relative;">
          <div class="btn__content">
            Upload
            <i aria-hidden="true" class="material-icons icon icon--right theme--dark">cloud_upload</i>
            <input type="file" v-on:change="selectImage" accept="image/jpg,image/jpeg,image/png" multiple style="display: none"/>
          </div>
        </label>    
      </v-form>
    </v-card-text>
    <v-container fluid grid-list-md dark v-show="images.length > 0">
      <v-layout row wrap>
        <v-flex v-for="(image, index) in images" v-bind:key="index">
          <v-card>
            <v-card-media :src="image" height="200px"></v-card-media>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn icon></v-btn>
              <v-btn icon></v-btn>
              <v-btn icon @click="handleRemoveImage(image)">
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
  import {mapMutations, mapGetters, mapState, mapActions} from 'vuex'
  export default {
    name: 'tweet-form',
    data() {
      return {
        valid: true,
        tweeting: false
      }
    },
    computed: {
      ...mapGetters({
        profile: 'getTwitterProfile',
        images: 'getImages',
        reply: 'getReply'
      }),
      ...mapState({
        message: state => state.tweet.message
      }),
      wordCount () {
        return 140 - this.message.length
      }
    },
    watch: {
      message () {
        let count = 140 - this.message.length
        if (count < 140 && count > 0) {
          this.valid = true
        } else {
          this.valid = false
        }
      },
      reply () {
        console.log('computed-reply', this.reply)
      }
    },
    methods: {
      ...mapActions({
        postMessage: 'postMessage'
      }),
      ...mapMutations({
        setMessage: 'TWEET_FORM_SET_MESSAGE',
        addImage: 'TWEET_FORM_ADD_IMAGE',
        removeImage: 'TWEET_FORM_REMOVE_IMAGE'
      }),
      handleMessage (val) {
        this.setMessage(val)
      },
      handleRemoveImage (image) {
        this.removeImage(image)
      },
      selectImage (e) {
        if (e.target.files.length > 0 && e.target.files.length < 5) {
          for (let i = 0; i < e.target.files.length; i++) {
            let file = e.target.files[i]
            let reader = new FileReader()
            reader.onload = (item) => {
              this.addImage(item.target.result)
            }
            reader.readAsDataURL(file)
          }
        }
      },
      clear () {},
      submit () {
        if (this.valid === true) {
          this.tweeting = true

          let options = {
            message: this.message,
            images: this.images
          }

          if (this.reply.id_str) {
            options.message = `@${this.reply.user.screen_name} ${this.message}`
            options.status_id = this.reply.id_str
          }

          this.postMessage(options).then(response => {
            this.tweeting = false
          }, error => {
            console.log('tweet-form', error)
          })
        }
      }
    }
  }
</script>
