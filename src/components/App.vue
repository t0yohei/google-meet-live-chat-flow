<template>
  <v-app>
    <v-content>
      <v-container fluid>
        <v-switch
          v-model="enabled"
          :label="i18n.enabled"
        />
        <v-subheader class="pl-0">{{ i18n.comment }}</v-subheader>
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">{{ i18n.color }}</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="color"
              placeholder="white"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">{{ i18n.textShadow }}</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="textShadow"
              placeholder="1px 1px 2px #333"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">{{ i18n.rows }}</v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="rows"
              placeholder="12"
            />
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs6>
            <v-subheader class="pl-0">{{ i18n.speed }}
              <small class="pl-1">({{ i18n.sec }})</small>
            </v-subheader>
          </v-flex>
          <v-flex xs6>
            <v-text-field
              v-model="speed"
              placeholder="5"
            />
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  computed: {
    enabled: {
      get () {
        return this.$store.state.enabled
      },
      set (value) {
        this.$store.dispatch('setEnabled', { enabled: value })
      }
    },
    i18n: {
      get () {
        return this.$store.state.i18n
      }
    },
    color: {
      get () {
        return this.$store.state.color
      },
      set (value) {
        this.$store.dispatch('setColor', { color: value })
      }
    },
    textShadow: {
      get () {
        return this.$store.state.textShadow
      },
      set (value) {
        this.$store.dispatch('setTextShadow', { textShadow: value })
      }
    },
    rows: {
      get () {
        return this.$store.state.rows
      },
      set (value) {
        this.$store.dispatch('setRows', { rows: value })
      }
    },
    speed: {
      get () {
        return this.$store.state.speed
      },
      set (value) {
        this.$store.dispatch('setSpeed', { speed: value })
      }
    }
  },
  async mounted () {
    await this.$store.dispatch('init')
  }
}
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>

<style scoped>
.application {
  min-width: 300px;
}
</style>
