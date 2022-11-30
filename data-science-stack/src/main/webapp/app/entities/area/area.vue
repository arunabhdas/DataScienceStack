<template>
  <div>
    <h2 id="page-heading" data-cy="AreaHeading">
      <span id="area-heading">Areas</span>
      <div class="d-flex justify-content-end">
        <button class="btn btn-info mr-2" v-on:click="handleSyncList" :disabled="isFetching">
          <font-awesome-icon icon="sync" :spin="isFetching"></font-awesome-icon> <span>Refresh List</span>
        </button>
        <router-link :to="{ name: 'AreaCreate' }" custom v-slot="{ navigate }">
          <button @click="navigate" id="jh-create-entity" data-cy="entityCreateButton" class="btn btn-primary jh-create-entity create-area">
            <font-awesome-icon icon="plus"></font-awesome-icon>
            <span> Create a new Area </span>
          </button>
        </router-link>
      </div>
    </h2>
    <br />
    <div class="alert alert-warning" v-if="!isFetching && areas && areas.length === 0">
      <span>No areas found</span>
    </div>
    <div class="table-responsive" v-if="areas && areas.length > 0">
      <table class="table table-striped" aria-describedby="areas">
        <thead>
          <tr>
            <th scope="row" v-on:click="changeOrder('id')">
              <span>ID</span> <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'id'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('title')">
              <span>Title</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'title'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('description')">
              <span>Description</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'description'"></jhi-sort-indicator>
            </th>
            <th scope="row" v-on:click="changeOrder('scientist.id')">
              <span>Scientist</span>
              <jhi-sort-indicator :current-order="propOrder" :reverse="reverse" :field-name="'scientist.id'"></jhi-sort-indicator>
            </th>
            <th scope="row"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="area in areas" :key="area.id" data-cy="entityTable">
            <td>
              <router-link :to="{ name: 'AreaView', params: { areaId: area.id } }">{{ area.id }}</router-link>
            </td>
            <td>{{ area.title }}</td>
            <td>{{ area.description }}</td>
            <td>
              <div v-if="area.scientist">
                <router-link :to="{ name: 'ScientistView', params: { scientistId: area.scientist.id } }">{{
                  area.scientist.id
                }}</router-link>
              </div>
            </td>
            <td class="text-right">
              <div class="btn-group">
                <router-link :to="{ name: 'AreaView', params: { areaId: area.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-info btn-sm details" data-cy="entityDetailsButton">
                    <font-awesome-icon icon="eye"></font-awesome-icon>
                    <span class="d-none d-md-inline">View</span>
                  </button>
                </router-link>
                <router-link :to="{ name: 'AreaEdit', params: { areaId: area.id } }" custom v-slot="{ navigate }">
                  <button @click="navigate" class="btn btn-primary btn-sm edit" data-cy="entityEditButton">
                    <font-awesome-icon icon="pencil-alt"></font-awesome-icon>
                    <span class="d-none d-md-inline">Edit</span>
                  </button>
                </router-link>
                <b-button
                  v-on:click="prepareRemove(area)"
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
      </table>
    </div>
    <b-modal ref="removeEntity" id="removeEntity">
      <span slot="modal-title"
        ><span id="dataScienceStackApp.area.delete.question" data-cy="areaDeleteDialogHeading">Confirm delete operation</span></span
      >
      <div class="modal-body">
        <p id="jhi-delete-area-heading">Are you sure you want to delete this Area?</p>
      </div>
      <div slot="modal-footer">
        <button type="button" class="btn btn-secondary" v-on:click="closeDialog()">Cancel</button>
        <button
          type="button"
          class="btn btn-primary"
          id="jhi-confirm-delete-area"
          data-cy="entityConfirmDeleteButton"
          v-on:click="removeArea()"
        >
          Delete
        </button>
      </div>
    </b-modal>
    <div v-show="areas && areas.length > 0">
      <div class="row justify-content-center">
        <jhi-item-count :page="page" :total="queryCount" :itemsPerPage="itemsPerPage"></jhi-item-count>
      </div>
      <div class="row justify-content-center">
        <b-pagination size="md" :total-rows="totalItems" v-model="page" :per-page="itemsPerPage" :change="loadPage(page)"></b-pagination>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./area.component.ts"></script>
