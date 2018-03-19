<template>
  <v-flex>
    <template v-if="text">
      <template v-for="(entity, i) in entities">
        {{ entity.text }}
        <a :key="i" v-if="entity.url" @click="open(entity.url)">{{ entity.url }}</a>
        <a :key="i" v-if="entity.hashtag" @click="open('https://twitter.com/hashtag/' + entity.hashtag)">#{{ entity.hashtag }}</a>
        <a :key="i" v-if="entity.listSlug" @click="open('https://twitter.com/$' + entity.screenName + entity.listSlug)">{{ entity.listSlug }}</a>
        <a :key="i" v-if="entity.screenName" @click="open('https://twitter.com/' + entity.screenName)">@{{ entity.screenName }}</a>
        <a :key="i" v-if="entity.cashtag" @click="open('https://twitter.com/#!/search?q=%24' + entity.cashtag)">${{ entity.cashtag }}</a>
      </template>
    </template>
    <template v-if="media">
      <div class="media">
        <a v-for="(entity, i) in entities.images" v-bind:key="i" @click="open(entity.url)"><img :src="entity.imgUrl" /></a>
        <a v-for="(entity, i) in entities.videos" v-bind:key="i" @click="open(entity.url)"><video :src="entity.imgUrl" type="video/mp4" source controls loop autoplay muted /></a>
      </div>
    </template>
  </v-flex>
</template>

<script>
export default {
  name: 'text-entities',
  props: {
    tweet: Object,
    media: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    entities() {

      const text = this.tweet.text
      const entities = this.tweet.extracted

      let data = []

      if (!entities.length) {
        data.push({
          text: text
        })
      } else {

        let i = 0
        entities.forEach((entity, index) => {

          if (this.tweet.in_reply_to_screen_name) {
            data.push({
              screenName: entity.screenName
            })
            data.push({
              text: text.substring(entity.indices[1])
            })
          } else {
            data.push({
              text: text.substring(i, entity.indices[0])
            })
          }

          if (entity.url) {
            data.push({
              url: entity.url
            })
          }

          if (entity.hashtag) {
            data.push({
              hashtag: entity.hashtag
            })
          }

          if (entity.listSlug) {
            data.push({
              listSlug: entity.listSlug
            })
          }

          if (!this.tweet.in_reply_to_screen_name) {
            if (entity.screenName) {
              data.push({
                screenName: entity.screenName
              })
            }
          }

          if (entity.cashtag) {
            data.push({
              cashtag: entity.cashtag
            })
          }

          i = entity.indices[1]
        })

      }

      data['images'] = []
      data['videos'] = []
      
      if (this.tweet.extended_entities && this.tweet.extended_entities.media) {
        let media = this.tweet.extended_entities.media
        media.forEach((item, index) => {
          if (item.type === 'photo') {
            data['images'].push({
              imgUrl: item.media_url_https,
              url: item.url
            })
          } else if (item.video_info) {
            data['videos'].push({
              imgUrl: item.video_info.variants[0].url,
              url: item.url
            })
          }
        })
      }

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
.media {
  width: 100%;
  overflow: hidden;
  display: flex;
  a {
    float: left;
    width: 100%;
    margin-top: 5px;
    img {
      width: 100%;
    }
  }
  video {
    width: 100%;
    max-width: 500px;
  }
}
</style>
