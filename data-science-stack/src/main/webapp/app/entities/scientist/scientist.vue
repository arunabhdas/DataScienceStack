<template>
  <div>
    <h2 id="page-heading" data-cy="ScientistHeading">
      <span id="scientist-heading">Scientists</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon> <span>Refresh List</span>
        </button>
        <router-link :to="{ name: 'ScientistCreate' }" custom v-slot="{ navigate }">
          <button
            @click="navigate"
            id="jh-create-entity"
            data-cy="entityCreateButton"
            class="btn btn-primary jh-create-entity create-scientist"
          >
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span> Create a new Scientist </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && scientists && scientists.length === 0">
      <span>No scientists found</span>
    </div>
    <div class="table-responsive" v-if="scientists && scientists.length > 0">
      <table class="table table-striped" aria-describedby="scientists">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span>ID</span> <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('firstName')">
              <span>First Name</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'firstName'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('lastName')">
              <span>Last Name</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'lastName'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('email')">
              <span>Email</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'email'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('phoneNumber')">
              <span>Phone Number</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'phoneNumber'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('startDate')">
              <span>Start Date</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'startDate'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('salary')">
              <span>Salary</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'salary'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('percentage')">
              <span>Percentage</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'percentage'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('department.id')">
              <span>Department</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'department.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="scientist in scientists" :key="scientist.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'ScientistView', params: { scientistId: scientist.id } }">{{ scientist.id }}</router-link>
            </td>
            <td>{{ scientist.firstName }}</td>
            <td>{{ scientist.lastName }}</td>
            <td>{{ scientist.email }}</td>
            <td>{{ scientist.phoneNumber }}</td>
            <td>{{ scientist.startDate | formatDate }}</td>
            <td>{{ scientist.salary }}</td>
            <td>{{ scientist.percentage }}</td>
            <td>
              <div v-if="scientist.department">
                <router-link :to="{ name: 'DepartmentView', params: { departmentId: scientist.department.id } }">{{
                  scientist.department.id
                }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'ScientistView', params: { scientistId: scientist.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'ScientistEdit', params: { scientistId: scientist.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(scientist)"
                  variant="danger"
                  class="btn btn-sm"
                  data-cy="entityDeleteButton"
                  v-b-modal.removeEntity
                >
                  <font-awesome-icon icon="times"></font-awesome-icon>
                  <span class="d-none d-md-inline">Delete</span>
                </b-button>
              </div>
            </td>
          </tr>
        </tbody>
        <infinite-loading
          ref="infiniteLoading"
          v-if="totalItems > itemsPerPage"
          :identifier="infiniteId"
          slot="append"
          @infinite="loadMore"
          force-use-infinite-wrapper=".el-table__body-wrapper"
          :distance="20"
        >
        </infinite-loading>
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span id="dataScienceStackApp.scientist.delete.question" data-cy="scientistDeleteDialogHeading"
          >Confirm delete operation</span
        ></span
      >
      <div class="modal-body">
        <p id="jhi-delete-scientist-heading">Are you sure you want to delete this Scientist?</p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-scientist"
          data-cy="entityConfirmDeleteButton"
          v-on:click="removeScientist()"
        >
          Delete
        </button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts" src="./scientist.component.ts"></script>
