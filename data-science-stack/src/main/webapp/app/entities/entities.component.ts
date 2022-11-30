import { Component, Provide, Vue } from 'vue-property-decorator';

import UserService from '@/entities/user/user.service';
import RegionService from './region/region.service';
import CountryService from './country/country.service';
import LocationService from './location/location.service';
import DepartmentService from './department/department.service';
import TaskService from './task/task.service';
import ScientistService from './scientist/scientist.service';
import AreaService from './area/area.service';
// jhipster-needle-add-entity-service-to-entities-component-import - JHipster will import entities services here

@Component
export default class Entities extends Vue {
  @Provide('userService') private userService = () => new UserService();
  @Provide('regionService') private regionService = () => new RegionService();
  @Provide('countryService') private countryService = () => new CountryService();
  @Provide('locationService') private locationService = () => new LocationService();
  @Provide('departmentService') private departmentService = () => new DepartmentService();
  @Provide('taskService') private taskService = () => new TaskService();
  @Provide('scientistService') private scientistService = () => new ScientistService();
  @Provide('areaService') private areaService = () => new AreaService();
  // jhipster-needle-add-entity-service-to-entities-component - JHipster will import entities services here
}
