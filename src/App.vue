<template>
<v-app>
  <AddDialog
    :visible="this.addDialog.visible"
    @close="this.addDialog.visible = false"
    @messagefromadd="messagefromadd"
  />
  <v-toolbar app color="primary" dense dark>
    <v-spacer></v-spacer>
    <v-toolbar-title>
    <router-link to="/" tag="span" style="cursor: pointer">
    <v-icon left>mdi-menu</v-icon> 
      FRAMEWORKS
    </router-link>
  </v-toolbar-title>
  
  
    <v-spacer></v-spacer>
    <v-btn color="blue accent-2" type="submit" tonal @click="add()">
    <v-icon left>mdi-plus</v-icon>
      Add
    </v-btn>
  </v-toolbar>

  <v-content>
    <div id="landing">
      <Landing />
    </div>
  </v-content>
</v-app>
</template>

<script>
import AddDialog from "./components/Add.vue";
import Toast from "./components/Toast.vue";
import Landing from "./components/Landing.vue";

export default {
components: {
  AddDialog,
  Landing,
  Toast,
},
name: "App",
data() {
  return {
    addDialog: {
      visible: false,
    },
    counter: 0,
    appTitle: "FRAMEWORKS",
  };
},
methods: {
  messagefromadd(dlgVisible) {
    this.addDialog.visible = dlgVisible;
    this.refreshTasks();
  },
  refreshTasks() {
    if (localStorage.tasks != null) {
      return JSON.parse(localStorage.tasks);
    }
    return [];
  },
  add() {
    this.addDialog.visible = true;
  },
  showToast() {
    const content = {
      component: Toast,
      props: {
        counter: this.counter,
      },
      listeners: {
        click: () => {
          this.counter++;
          this.$toast.success(`Toast with counter ${this.counter}`, {
            position: "top-left",
          });
        },
      },
    };
    this.$toast(content, { position: "bottom-right" });
  },
},
};
</script>

