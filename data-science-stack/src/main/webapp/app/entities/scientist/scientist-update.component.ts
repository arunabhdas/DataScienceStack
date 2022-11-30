import { Component, Vue, Inject } from 'vue-property-decorator';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import AlertService from '@/shared/alert/alert.service';

import AreaService from '@/entities/area/area.service';
import { IArea } from '@/shared/model/area.model';

import DepartmentService from '@/entities/department/department.service';
import { IDepartment } from '@/shared/model/department.model';

import { IScientist, Scientist } from '@/shared/model/scientist.model';
import ScientistService from './scientist.service';

const validations: any = {
  scientist: {
    firstName: {},
    lastName: {},
    email: {},
    phoneNumber: {},
    startDate: {},
    salary: {},
    percentage: {},
  },
};

@Component({
  validations,
})
export default class ScientistUpdate extends Vue {
  @Inject('scientistService') private scientistService: () => ScientistService;
  @Inject('alertService') private alertService: () => AlertService;

  public scientist: IScientist = new Scientist();

  @Inject('areaService') private areaService: () => AreaService;

  public areas: IArea[] = [];

  @Inject('departmentService') private departmentService: () => DepartmentService;

  public departments: IDepartment[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.scientistId) {
        vm.retrieveScientist(to.params.scientistId);
      }
      vm.initRelationships();
    });
  }

  created(): void {
    this.currentLanguage = this.$store.getters.currentLanguage;
    this.$store.watch(
      () => this.$store.getters.currentLanguage,
      () => {
        this.currentLanguage = this.$store.getters.currentLanguage;
      }
    );
  }

  public save(): void {
    this.isSaving = true;
    if (this.scientist.id) {
      this.scientistService()
        .update(this.scientist)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Scientist is updated with identifier ' + param.id;
          return (this.$root as any).$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Info',
            variant: 'info',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    } else {
      this.scientistService()
        .create(this.scientist)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Scientist is created with identifier ' + param.id;
          (this.$root as any).$bvToast.toast(message.toString(), {
            toaster: 'b-toaster-top-center',
            title: 'Success',
            variant: 'success',
            solid: true,
            autoHideDelay: 5000,
          });
        })
        .catch(error => {
          this.isSaving = false;
          this.alertService().showHttpError(this, error.response);
        });
    }
  }

  public convertDateTimeFromServer(date: Date): string {
    if (date && dayjs(date).isValid()) {
      return dayjs(date).format(DATE_TIME_LONG_FORMAT);
    }
    return null;
  }

  public updateInstantField(field, event) {
    if (event.target.value) {
      this.scientist[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.scientist[field] = null;
    }
  }

  public updateZonedDateTimeField(field, event) {
    if (event.target.value) {
      this.scientist[field] = dayjs(event.target.value, DATE_TIME_LONG_FORMAT);
    } else {
      this.scientist[field] = null;
    }
  }

  public retrieveScientist(scientistId): void {
    this.scientistService()
      .find(scientistId)
      .then(res => {
        res.startDate = new Date(res.startDate);
        this.scientist = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.areaService()
      .retrieve()
      .then(res => {
        this.areas = res.data;
      });
    this.departmentService()
      .retrieve()
      .then(res => {
        this.departments = res.data;
      });
  }
}
