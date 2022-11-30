<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="area">
        <h2 class="jh-entity-heading" data-cy="areaDetailsHeading"><span>Area</span> {{ area.id }}</h2>
        <dl class="row jh-entity-details">
          <dt>
            <span>Title</span>
          </dt>
          <dd>
            <span>{{ area.title }}</span>
          </dd>
          <dt>
            <span>Description</span>
          </dt>
          <dd>
            <span>{{ area.description }}</span>
          </dd>
          <dt>
            <span>Task</span>
          </dt>
          <dd>
            <span v-for="(task, i) in area.tasks" :key="task.id"
              >{{ i > 0 ? ', ' : '' }}
              <router-link :to="{ name: 'TaskView', params: { taskId: task.id } }">{{ task.title }}</router-link>
            </span>
          </dd>
          <dt>
            <span>Scientist</span>
          </dt>
          <dd>
            <div v-if="area.scientist">
              <router-link :to="{ name: 'ScientistView', params: { scientistId: area.scientist.id } }">{{ area.scientist.id }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span> Back</span>
        </button>
        <router-link v-if="area.id" :to="{ name: 'AreaEdit', params: { areaId: area.id } }" custom v-slot="{ navigate }">
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./area-details.component.ts"></script>
