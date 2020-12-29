<template>
<v-container>
  <v-row justify="center" align-content="center">
    <v-spacer></v-spacer>
    <v-btn class="ma-2" dark absolute right fab color="primary" @click.stop="openNewDialog()">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-row>
  <v-row justify="center" align-content="center">

    <v-col v-for="(studySpace) in studySpaces" v-bind:key=studySpace.name class="text-center" style="max-width: 800px">

      <v-card color="#FFF" min-width=600 min-height=120>
        <v-card-title primary-title class="justify-left">{{ studySpace.name }}</v-card-title>
        <v-card-subtitle class="text-left">{{ studySpace.description }}<br>{{ studySpace.dataSource }}</v-card-subtitle>
        <v-spacer></v-spacer>

        <v-card-actions align-end>
          <v-btn rounded color="primary" large dark @click.stop="selectedStudySpace(studySpace)">
            Edit
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn v-bind:href="'http://127.0.0.1:8181/?id=' + studySpace.id" rounded color="primary" large dark>
            Go Study
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>
        <span class="headline">Study Space Configuration</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <!-- Id -->
            <v-col cols="12">
              <v-text-field v-model="id" label="ID" disabled></v-text-field>
            </v-col>
            <!-- Name -->
            <v-col cols="12">
              <v-text-field v-model="name" :rules="nameRules" label="Name *" required></v-text-field>
            </v-col>
            <!-- Description -->
            <v-col cols="12">
              <v-text-field v-model="description" label="Description"></v-text-field>
            </v-col>
            <!-- Data Source -->
            <v-col cols="12">
              <v-text-field v-model="dataSource" :rules="dataSourceRules" label="Location *" required></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions>
        <v-btn color="error darken-1" text @click="deleteStudySpace()">
          Delete
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="dialog = false">
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="setStudySpace()">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
declare global {
  interface Window {
    native: any;
  }
}
const { ipcRenderer } = window.native


export default Vue.extend({
  name: 'StudySpaceList',

  data: () => ({
    studySpaces: [],
    dialog: false,
    id: '',
    name: '',
    nameRules: [v => !!v || 'Name is required'],
    description: '',
    dataSource: '',
    dataSourceRules: [v => !!v || 'Location is required'],
  }),

  methods: {
    getStudySpaces() {
          ipcRenderer.on('load-data-src-list', (event, arg) => {
            this.studySpaces = arg
          });
          console.log(this.studySpaces)
    },
    setStudySpace() {
      console.log(this.name)
      console.log( this.isStudyIdExist(this.id) )
      if ( this.isStudyIdExist(this.id) === true ){
          console.log( this.isStudyIdExist(this.id) )
          const index = this.studySpaces.findIndex((x) => x.id === this.id)
          this.studySpaces[index] = { id:this.id, name:this.name, description:this.description, dataSource:this.dataSource}
          ipcRenderer.send('alter-data-src-list', { id:this.id, name:this.name, description:this.description, dataSource:this.dataSource})
      } else if ( this.isStudyIdExist(this.id) === false ){
          this.studySpaces.push({ id:this.id, name:this.name, description:this.description, dataSource:this.dataSource})
          ipcRenderer.send('add-data-src-list', { id:this.id, name:this.name, description:this.description, dataSource:this.dataSource})
      }

      this.dialog = false
    },
    selectedStudySpace(studySpace) {
        console.log(studySpace)
        this.dialog = true
        this.id = studySpace["id"]
        this.name = studySpace["name"]
        this.description = studySpace["description"]
        this.dataSource = studySpace["dataSource"]
    },
    deleteStudySpace() {
        this.studySpaces = this.studySpaces.filter(s => s['id'] !== this.id )
        ipcRenderer.send( 'delete-data-src-list', this.id )
        this.dialog = false
        this.id = ''
        this.name = ''
        this.description = ''
        this.dataSource = ''

    },
    isStudyIdExist(id: string){
        const studySpaces_: string = this.studySpaces.filter(s => s['id'] === id )
        if (studySpaces_.length === 0){
          return false
        } else {
          return true
        }
    },
    makeid() {
        let text = ''
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

        for (let i = 0; i < 12; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    },
    openNewDialog() {
      this.id = this.makeid()
      this.name = ''
      this.description = ''
      this.dataSource = ''
      this.dialog = true
    },
  },

  mounted() {
    console.log( this.makeid() )
    this.getStudySpaces()
    //ipcRenderer.on('asynchronous-reply', (event, arg) => {
      // 受信時のコールバック関数
    //console.log(arg) // pong
    //});
    // 非同期メッセージの送信
    ipcRenderer.send('load-data-src-list', 'ping')
  }
})
</script>
