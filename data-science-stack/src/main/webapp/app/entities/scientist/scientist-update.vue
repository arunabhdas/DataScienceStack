<template>
  <div class="row justify-content-center">
    <div class="col-8">
      <form name="editForm" role="form" novalidate v-on:submit.prevent="save()">
        <h2 id="dataScienceStackApp.scientist.home.createOrEditLabel" data-cy="ScientistCreateUpdateHeading">Create or edit a Scientist</h2>
        <div>
          <div class="form-group" v-if="scientist.id">
            <label for="id">ID</label>
            <input type="text" class="form-control" id="id" name="id" v-model="scientist.id" readonly />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-firstName">First Name</label>
            <input
              type="text"
              class="form-control"
              name="firstName"
              id="scientist-firstName"
              data-cy="firstName"
              :class="{ valid: !$v.scientist.firstName.$invalid, invalid: $v.scientist.firstName.$invalid }"
              v-model="$v.scientist.firstName.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-lastName">Last Name</label>
            <input
              type="text"
              class="form-control"
              name="lastName"
              id="scientist-lastName"
              data-cy="lastName"
              :class="{ valid: !$v.scientist.lastName.$invalid, invalid: $v.scientist.lastName.$invalid }"
              v-model="$v.scientist.lastName.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-email">Email</label>
            <input
              type="text"
              class="form-control"
              name="email"
              id="scientist-email"
              data-cy="email"
              :class="{ valid: !$v.scientist.email.$invalid, invalid: $v.scientist.email.$invalid }"
              v-model="$v.scientist.email.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-phoneNumber">Phone Number</label>
            <input
              type="text"
              class="form-control"
              name="phoneNumber"
              id="scientist-phoneNumber"
              data-cy="phoneNumber"
              :class="{ valid: !$v.scientist.phoneNumber.$invalid, invalid: $v.scientist.phoneNumber.$invalid }"
              v-model="$v.scientist.phoneNumber.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-startDate">Start Date</label>
            <div class="d-flex">
              <input
                id="scientist-startDate"
                data-cy="startDate"
                type="datetime-local"
                class="form-control"
                name="startDate"
                :class="{ valid: !$v.scientist.startDate.$invalid, invalid: $v.scientist.startDate.$invalid }"
                :value="convertDateTimeFromServer($v.scientist.startDate.$model)"
                @change="updateInstantField('startDate', $event)"
              />
            </div>
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-salary">Salary</label>
            <input
              type="number"
              class="form-control"
              name="salary"
              id="scientist-salary"
              data-cy="salary"
              :class="{ valid: !$v.scientist.salary.$invalid, invalid: $v.scientist.salary.$invalid }"
              v-model.number="$v.scientist.salary.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-percentage">Percentage</label>
            <input
              type="number"
              class="form-control"
              name="percentage"
              id="scientist-percentage"
              data-cy="percentage"
              :class="{ valid: !$v.scientist.percentage.$invalid, invalid: $v.scientist.percentage.$invalid }"
              v-model.number="$v.scientist.percentage.$model"
            />
          </div>
          <div class="form-group">
            <label class="form-control-label" for="scientist-department">Department</label>
            <select class="form-control" id="scientist-department" data-cy="department" name="department" v-model="scientist.department">
              <option v-bind:value="null"></option>
              <option
                v-bind:value="
                  scientist.department && departmentOption.id === scientist.department.id ? scientist.department : departmentOption
                "
                v-for="departmentOption in departments"
                :key="departmentOption.id"
              >
                {{ departmentOption.id }}
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
            :disabled="$v.scientist.$invalid || isSaving"
            class="btn btn-primary"
          >
            <font-awesome-icon icon="save"></font-awesome-icon>&nbsp;<span>Save</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
<script lang="ts" src="./scientist-update.component.ts"></script>
