<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2 id="dataScienceStackApp.area.home.createOrEditLabel" data-cy="AreaCreateUpdateHeading">Create or edit a Area</h2>
        <div>
          <div class="form-group" v-if="area.id">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="area.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="area-title">Title</label>
            <input
              type="text"
              class="form-control"
              name="title"
              id="area-title"
              data-cy="title"
              :class="{ valid: !$v.area.title.$invalid, invalid: $v.area.title.$invalid }"
              v-model="$v.area.title.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="area-description">Description</label>
            <input
              type="text"
              class="form-control"
              name="description"
              id="area-description"
              data-cy="description"
              :class="{ valid: !$v.area.description.$invalid, invalid: $v.area.description.$invalid }"
              v-model="$v.area.description.$model"
            />
          </div>
          <div class="form-group">
            <label for="area-task">Task</label>
            <select
              class="form-control"
              id="area-tasks"
              data-cy="task"
              multiple
              name="task"
              v-if="area.tasks !== undefined"
              v-model="area.tasks"
            >
              <option v-bind:value="getSelected(area.tasks, taskOption)" v-for="taskOption in tasks" :key="taskOption.id">
                {{ taskOption.title }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-control-label" for="area-scientist">Scientist</label>
            <select class="form-control" id="area-scientist" data-cy="scientist" name="scientist" v-model="area.scientist">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="area.scientist && scientistOption.id === area.scientist.id ? area.scientist : scientistOption"
                v-for="scientistOption in scientists"
                :key="scientistOption.id"
              >
                {{ scientistOption.id }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <button type="button" id="cancel-save" data-cy="entityCreateCancelButton" class="btn btn-secondary" v-on:click="previousState()">
            <font-awesome-icon icon="ban"></font-awesome-icon>&nbsp;<span>Cancel</span>
          </button>
          <button
            type="submit"
            id="save-entity"
            data-cy="entityCreateSaveButton"
            :disabled="$v.area.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./area-update.component.ts"></script>
