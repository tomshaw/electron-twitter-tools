<template>
  <v-container grid-list-md>
    <v-layout row wrap>
      <v-flex xs12>
        <page-title main-title="System Settings" sub-title="configuration information"></page-title>
        <breadcrumbs page="settings"></breadcrumbs>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs3>
        <system-info></system-info>
      </v-flex>
      <v-flex xs9>
        <v-tabs v-model="active" dark slider-color="yellow" :scrollable="false">
          
          <v-tab key="tab1">Database Credentials</v-tab>
          <v-tab key="tab2">Twitter Authentication</v-tab>
          <v-tab key="tab3">Google Maps</v-tab>

          <v-tabs-items v-model="model">
            <v-tab-item key="tab1">
              <v-card flat>
                <v-expansion-panel focusable>
                  <v-expansion-panel-content value="0">
                    <div slot="header">MySQL</div>
                    <v-card>
                      <v-card-text class="grey">
                        <v-form>
                          <v-text-field label="Hostname" v-model="adapters.mysql.host" required></v-text-field>
                          <v-text-field label="Username" v-model="adapters.mysql.user" required></v-text-field>
                          <v-text-field label="Password" v-model="adapters.mysql.password" required></v-text-field>
                          <v-text-field label="Database" v-model="adapters.mysql.database" required></v-text-field>
                          <v-btn @click="handleAdapterSubmit('mysql')">submit</v-btn>
                          <v-btn>clear</v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <div slot="header">Postgres</div>
                    <v-card>
                      <v-card-text class="grey">
                        <v-form>
                          <v-text-field label="Hostname" v-model="adapters.postgres.host" required></v-text-field>
                          <v-text-field label="Username" v-model="adapters.postgres.user" required></v-text-field>
                          <v-text-field label="Password" v-model="adapters.postgres.password" required></v-text-field>
                          <v-text-field label="Database" v-model="adapters.postgres.database" required></v-text-field>
                          <v-btn @click="handleAdapterSubmit('postgres')">submit</v-btn>
                          <v-btn>clear</v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <div slot="header">MariaDB</div>
                    <v-card>
                      <v-card-text class="grey">
                        <v-form>
                          <v-text-field label="Hostname" v-model="adapters.mariadb.host" required></v-text-field>
                          <v-text-field label="Username" v-model="adapters.mariadb.user" required></v-text-field>
                          <v-text-field label="Password" v-model="adapters.mariadb.password" required></v-text-field>
                          <v-text-field label="Database" v-model="adapters.mariadb.database" required></v-text-field>
                          <v-btn @click="handleAdapterSubmit('mariadb')">submit</v-btn>
                          <v-btn>clear</v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                  <v-expansion-panel-content>
                    <div slot="header">MSSQL</div>
                    <v-card>
                      <v-card-text class="grey">
                        <v-form>
                          <v-text-field label="Hostname" v-model="adapters.mssql.host" required></v-text-field>
                          <v-text-field label="Username" v-model="adapters.mssql.user" required></v-text-field>
                          <v-text-field label="Password" v-model="adapters.mssql.password" required></v-text-field>
                          <v-text-field label="Database" v-model="adapters.mssql.database" required></v-text-field>
                          <v-btn @click="handleAdapterSubmit('mssql')">submit</v-btn>
                          <v-btn>clear</v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
            </v-tab-item>
            <v-tab-item key="tab2">
              <v-card flat>
                <v-expansion-panel focusable>
                  <v-expansion-panel-content value="0">
                    <v-card>
                      <v-card-text class="grey">
                        <v-form>
                          <v-text-field label="Consumer Key" v-model="tokens.consumer_key" required></v-text-field>
                          <v-text-field label="Consumer Secret" v-model="tokens.consumer_secret" required></v-text-field>
                          <v-text-field label="Access Token Key" v-model="tokens.access_token_key" required></v-text-field>
                          <v-text-field label="Access Token Secret" v-model="tokens.access_token_secret" required></v-text-field>
                          <v-btn @click="handleTwitterSubmit">submit</v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
            </v-tab-item>
            <v-tab-item key="tab3">
              <v-card flat>
                <v-expansion-panel focusable>
                  <v-expansion-panel-content value="0">
                    <v-card>
                      <v-card-text class="grey">
                        <v-form>
                          <v-text-field label="Google Maps Api Key" v-model="google.maps.key" required></v-text-field>
                          <v-btn @click="handleGoogleSubmit()">submit</v-btn>
                        </v-form>
                      </v-card-text>
                    </v-card>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-card>
            </v-tab-item>
          </v-tabs-items>
        </v-tabs>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import {mapActions, mapGetters} from 'vuex'
  import {adapters, tokens} from '@/config/settings'
  import {
    IPC_REQUEST_TWITTER_CREDENTIALS
  } from '@/config/constants'
  import PageTitle from '@/components/shared/PageTitle'
  import Breadcrumbs from '@/components/shared/Breadcrumbs'
  import SystemInfo from '@/components/shared/blocks/SystemInfo'
  export default {
    name: 'system-settings',
    components: {
      'page-title': PageTitle,
      'breadcrumbs': Breadcrumbs,
      'system-info': SystemInfo
    },
    computed: {
      ...mapGetters({
        connection: 'getConnection',
        connections: 'getConnections'
      })
    },
    data() {
      return {
        active: null,
        model: 'tab1',
        setup: {
          electron: process.versions['atom-shell'],
          name: this.$route.name,
          node: process.versions.node,
          path: this.$route.path,
          platform: require('os').platform(),
          vue: require('vue/package.json').version
        },
        adapters,
        tokens,
        google: {
          maps: {
            key: ''
          }
        }
      }
    },
    created() { // reactive data

      if (this.$settings.has('adapters.mysql')) {
        this.adapters.mysql = this.$settings.get('adapters.mysql')
      }

      if (this.$settings.has('adapters.postgres')) {
        this.adapters.postgres = this.$settings.get('adapters.postgres')
      }

      if (this.$settings.has('adapters.mariadb')) {
        this.adapters.mariadb = this.$settings.get('adapters.mariadb')
      }

      if (this.$settings.has('adapters.mssql')) {
        this.adapters.mssql = this.$settings.get('adapters.mssql')
      }

      if (this.$settings.has('twitter.tokens')) {
        this.tokens = this.$settings.get('twitter.tokens')
      }

      if (this.$settings.has('google.maps.key')) {
        this.google.maps.key = this.$settings.get('google.maps.key')
      }
    },
    methods: {
      ...mapActions(['setValidated', 'addConnection']),
      handleAdapterSubmit(type) {
        const adapter = type;
        this.addConnection(this.adapters[adapter])
        this.$settings.set(`adapters.${adapter}`, this.adapters[adapter])
        this.$settings.set('storage.connections', this.connections)
      },
      handleTwitterSubmit() {
        this.setValidated(false)
        this.$electron.ipcRenderer.send(IPC_REQUEST_TWITTER_CREDENTIALS, this.tokens)
        this.$settings.set('twitter.tokens', this.tokens)
      },
      handleGoogleSubmit() {
        this.$settings.set('google.maps.key', this.google.maps.key)
      }
    }
  }
</script>
