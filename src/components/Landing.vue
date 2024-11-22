<template>
<div id="grid">
  <EditDialog
    :title="this.editDialog.title"
    :description="this.editDialog.description"
    :priority="this.editDialog.priority"
    :deadline="this.editDialog.deadline"
    :visible="this.editDialog.visible"
    @close="this.editDialog.visible = false"
    @messagefromedit="messagefromedit"
    @edittaskfinished="editCallback"
  />
  <v-layout row wrap>
    <v-flex>
      <v-data-table
        id="taskTable"
        :headers="headers"
        :items="tasks"
        item-key="title"
      >
        <template #items="props">
          <tr
            :active="props.selected"
            @click="props.selected = !props.selected"
          >
            <td class="text-xs-center">
              {{ props.item.title }}
            </td>
            <td class="text-xs-center">
              {{ props.item.description }}
            </td>
            <td class="text-xs-center">
              {{
                new Date(props.item.deadline)
                  .toLocaleString("en-US")
                  .split(",")[0]
              }}
            </td>
            <td class="text-xs-center">
              {{ props.item.priority }}
            </td>
            <td class="text-xs-center">
            <v-checkbox
  v-model="props.item.iscomplete"
  @change="CompleteTask(props.item, $event)"
></v-checkbox>

            </td>
            <td class="text-xs-center">
              <v-btn
                v-model="props.item.iscomplete"
                color="primary"
                type="submit"
                v-show="props.item.iscomplete == 0"
                @click="editTask(props.item.title)"
              >
              <v-icon left>mdi-pencil</v-icon>
                Update
              </v-btn>
              <br />
              <v-btn
                color="error"
                type="submit"
                @click="deleteTask(props.item.title)"
              >
              <v-icon left>mdi-delete</v-icon>
                Delete
              </v-btn>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</div>
</template>

<script>
import EditDialog from "./Edit.vue";
import Toast from "./Toast.vue";

export default {
components: {
  EditDialog,
  Toast,
},
data() {
  return {
    modified: [],
    editDialog: {
      title: "",
      description: "",
      deadline: "",
      priority: "",
      visible: false,
    },
    headers: [
      { text: "Title", value: "title", sortable: false, align: "center" },
      {
        text: "Description",
        value: "description",
        sortable: false,
        align: "center",
      },
      {
        text: "Deadline",
        value: "deadline",
        sortable: false,
        align: "center",
      },
      {
        text: "Priority",
        value: "priority",
        sortable: false,
        align: "center",
      },
      {
        text: "Is Complete",
        value: "iscomplete",
        sortable: false,
        align: "left",
      },
      { text: "Actions", value: "actions", sortable: false, align: "center" },
    ],
    tasks: [],
  };
},
methods: {
  editCallback(title, description, deadline, priority) {},
  CompleteTask(item, value) {
    var index = this.tasks.indexOf(item);
    this.tasks[index].iscomplete = value;
    Object.assign(this.tasks[this.index], item);
  },
  refreshTasks() {
    if (localStorage.tasks != null) {
      return JSON.parse(localStorage.tasks);
    }

    return [];
  },
  editTask(title) {
    this.modified = [];
    this.editDialog.title = title;
    this.getTitleDetails(title);
    this.editDialog.visible = true;
  },
  close() {
    this.editDialog.dialog = false;
  },
  messagefromedit(dlgVisible) {
    this.editDialog.visible = dlgVisible;
    if (!dlgVisible) {
      this.isEditComplete = true;
    }
  },

  getTitleDetails(tt) {
    var tasks = [];
    if (localStorage.tasks !== undefined)
      tasks = JSON.parse(localStorage.tasks);

    var result = {};
    for (var i = 0; i < tasks.length; i++) {
      if (tasks[i].title === tt) {
        result = tasks[i];
        break;
      }
    }

    this.editDialog.title = result.title;
    this.editDialog.description = result.description;
    this.editDialog.deadline = result.deadline;
    this.editDialog.priority = result.priority;
  },
  deleteTask(title) {
    var tasks = [];
    if (localStorage.tasks !== undefined)
      tasks = JSON.parse(localStorage.tasks);

    var index = -1;
    for (index = 0; index < tasks.length; index++) {
      if (tasks[index].title === title) {
        break;
      }
    }

    if (index >= 0 && index < tasks.length) {
      tasks.splice(index, 1);
      localStorage.tasks = JSON.stringify(tasks);
      this.tasks = this.refreshTasks();
    }

    this.showToast("Task " + title + " deleted successfully");
  },
  created() {
    alert("created");
    console.log(this.$store.state.toasts);
  },
  showToast(msg) {
    const content = {
      component: Toast,
      props: {
        message: msg,
      },
      listeners: {
        click: () => {
          this.$toast.success(msg, { position: "top-left" });
        },
      },
    };
    this.$toast(content, { position: "bottom-right" });
  },
},
watch: {
  modified(newValue, oldValue) {
    if (newValue.len) return;

    const resultAdded = newValue.filter((val) => val === "added");
    const resultEdited = newValue.filter((val) => val === "modified");

    if (resultAdded.length > 0) this.showToast("Task added successfully");
    else if (resultEdited.length > 0)
      this.showToast("Task updated successfully");
    else return;

    this.tasks.map((task) => {
      task.state = "";
    });
    localStorage.tasks = JSON.stringify(this.tasks);
  },
},
mounted() {
  this.tasks = this.refreshTasks();

  this.modified = this.tasks.map((element) => element["state"]) || [];
},
};
</script>
