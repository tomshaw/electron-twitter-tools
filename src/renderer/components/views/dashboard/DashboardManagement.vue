<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="Dashboard" sub-title="stats and more"></page-title>
        <breadcrumbs page="dashboard"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3 v-for="(item) in stats" :key="item.text">

        <div :class="item.style">
          <div class="stats-icon">
            <v-icon>{{item.icon}}</v-icon>
          </div>
          <div class="stats-info">
            <div class="stats-info-count">{{item.count}}</div>
            <div class="stats-info-title">{{item.title}}</div>
          </div>
          <a :class="item.more.style" :href="item.more.to">View more <v-icon>arrow_forward</v-icon></a>
        </div>

      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  export default {
    name: 'dashboard-management',
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs
    },
    data () {
      return {
        stats: [{
          title: 'Total Followers',
          icon: 'home',
          style: 'stats blue',
          count: 5424,
          more: {
            to: '#',
            style: 'more blue lighten-1'
          }
        }, {
          title: 'Total Friendships',
          icon: 'visibility',
          style: 'stats teal',
          count: 1743,
          more: {
            to: '#',
            style: 'more teal lighten-1'
          }
        }, {
          title: 'Total Friendships',
          icon: 'touch_app',
          style: 'stats green',
          count: 3943,
          more: {
            to: '#',
            style: 'more green lighten-1'
          }
        }, {
          title: 'Total Friendships',
          icon: 'store',
          style: 'stats deep-purple',
          count: 3456,
          more: {
            to: '#',
            style: 'more deep-purple lighten-1'
          }
        }]
      }
    }
  }
</script>

<style lang="scss" scoped>

.stats {
  position: relative;
  margin-bottom: 20px;
  text-align: left;
  .stats-icon {
    display: block;
    float: left;
    width: 80px;
    height: 80px;
    padding-top: 10px;
    padding-left: 15px;
    margin-bottom: 10px;
  }
  .stats-icon {
    font-size: 35px;
    line-height: 35px;
  }
  .stats-icon i {
    color: #fff;
    font-size: 70px;
    line-height: 70px;
  }
  .stats-info {
    position: absolute;
    right: 15px;
    padding-right: 10px;  
  }
  .stats-info .stats-info-count {
    color: #fff;    
    padding-top: 15px;
    margin-bottom: 5px;
    font-size: 34px;
    font-weight: 300;
    line-height: 34px;
    letter-spacing: -1px;
    text-align: right;
  }
  .stats-info .stats-info-title {
    color: #fff;  
    font-size: 16px;
    font-weight: 300;
    letter-spacing: 0px;
    text-align: right;
  }
  .more {
    color: #fff; 
    clear: both;
    display: block;  
    padding: 5px 10px 5px 10px;
    text-transform: uppercase;
    text-decoration: none;
    font-weight: 300;
    font-size: 11px; 
    opacity: 0.7;  
  }  
  .more:hover {
    text-decoration: none;
    opacity: 1;  
  }
  .more > i {
    font-size: 16px !important;
    float: right;
    margin-top: 1px;
  }
}

</style>
