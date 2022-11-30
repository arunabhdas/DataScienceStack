<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <div v-if="scientist">
        <h2 class="jh-entity-heading" data-cy="scientistDetailsHeading"><span>Scientist</span> {{ scientist.id }}</h2>
        <dl class="row jh-entity-details">
          <dt>
            <span>First Name</span>
          </dt>
          <dd>
            <span>{{ scientist.firstName }}</span>
          </dd>
          <dt>
            <span>Last Name</span>
          </dt>
          <dd>
            <span>{{ scientist.lastName }}</span>
          </dd>
          <dt>
            <span>Email</span>
          </dt>
          <dd>
            <span>{{ scientist.email }}</span>
          </dd>
          <dt>
            <span>Phone Number</span>
          </dt>
          <dd>
            <span>{{ scientist.phoneNumber }}</span>
          </dd>
          <dt>
            <span>Start Date</span>
          </dt>
          <dd>
            <span>{{ scientist.startDate | formatDate }}</span>
          </dd>
          <dt>
            <span>Salary</span>
          </dt>
          <dd>
            <span>{{ scientist.salary }}</span>
          </dd>
          <dt>
            <span>Percentage</span>
          </dt>
          <dd>
            <span>{{ scientist.percentage }}</span>
          </dd>
          <dt>
            <span>Department</span>
          </dt>
          <dd>
            <div v-if="scientist.department">
              <router-link :to="{ name: 'DepartmentView', params: { departmentId: scientist.department.id } }">{{
                scientist.department.id
              }}</router-link>
            </div>
          </dd>
        </dl>
        <button type="submit" v-on:click.prevent="previousState()" class="btn btn-info" data-cy="entityDetailsBackButton">
          <font-awesome-icon icon="arrow-left"></font-awesome-icon>&nbsp;<span> Back</span>
        </button>
        <router-link
          v-if="scientist.id"
          :to="{ name: 'ScientistEdit', params: { scientistId: scientist.id } }"
          custom
          v-slot="{ navigate }"
        >
          <button @click="navigate" class="btn btn-primary">
            <font-awesome-icon icon="pencil-alt"></font-awesome-icon>&nbsp;<span> Edit</span>
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./scientist-details.component.ts"></script>
