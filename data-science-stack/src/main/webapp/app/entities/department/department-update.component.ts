import { Component, Vue, Inject } from 'vue-property-decorator';

import { required } from 'vuelidate/lib/validators';

import AlertService from '@/shared/alert/alert.service';

import LocationService from '@/entities/location/location.service';
import { ILocation } from '@/shared/model/location.model';

import ScientistService from '@/entities/scientist/scientist.service';
import { IScientist } from '@/shared/model/scientist.model';

import { IDepartment, Department } from '@/shared/model/department.model';
import DepartmentService from './department.service';

const validations: any = {
  department: {
    departmentName: {
      required,
    },
  },
};

@Component({
  validations,
})
export default class DepartmentUpdate extends Vue {
  @Inject('departmentService') private departmentService: () => DepartmentService;
  @Inject('alertService') private alertService: () => AlertService;

  public department: IDepartment = new Department();

  @Inject('locationService') private locationService: () => LocationService;

  public locations: ILocation[] = [];

  @Inject('scientistService') private scientistService: () => ScientistService;

  public scientists: IScientist[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.departmentId) {
        vm.retrieveDepartment(to.params.departmentId);
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
    if (this.department.id) {
      this.departmentService()
        .update(this.department)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Department is updated with identifier ' + param.id;
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
      this.departmentService()
        .create(this.department)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Department is created with identifier ' + param.id;
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

  public retrieveDepartment(departmentId): void {
    this.departmentService()
      .find(departmentId)
      .then(res => {
        this.department = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.locationService()
      .retrieve()
      .then(res => {
        this.locations = res.data;
      });
    this.scientistService()
      .retrieve()
      .then(res => {
        this.scientists = res.data;
      });
  }
}
