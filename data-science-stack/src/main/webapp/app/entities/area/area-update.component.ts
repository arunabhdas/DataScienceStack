import { Component, Vue, Inject } from 'vue-property-decorator';

import AlertService from '@/shared/alert/alert.service';

import TaskService from '@/entities/task/task.service';
import { ITask } from '@/shared/model/task.model';

import ScientistService from '@/entities/scientist/scientist.service';
import { IScientist } from '@/shared/model/scientist.model';

import { IArea, Area } from '@/shared/model/area.model';
import AreaService from './area.service';

const validations: any = {
  area: {
    title: {},
    description: {},
  },
};

@Component({
  validations,
})
export default class AreaUpdate extends Vue {
  @Inject('areaService') private areaService: () => AreaService;
  @Inject('alertService') private alertService: () => AlertService;

  public area: IArea = new Area();

  @Inject('taskService') private taskService: () => TaskService;

  public tasks: ITask[] = [];

  @Inject('scientistService') private scientistService: () => ScientistService;

  public scientists: IScientist[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.areaId) {
        vm.retrieveArea(to.params.areaId);
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
    this.area.tasks = [];
  }

  public save(): void {
    this.isSaving = true;
    if (this.area.id) {
      this.areaService()
        .update(this.area)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Area is updated with identifier ' + param.id;
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
      this.areaService()
        .create(this.area)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Area is created with identifier ' + param.id;
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

  public retrieveArea(areaId): void {
    this.areaService()
      .find(areaId)
      .then(res => {
        this.area = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState(): void {
    this.$router.go(-1);
  }

  public initRelationships(): void {
    this.taskService()
      .retrieve()
      .then(res => {
        this.tasks = res.data;
      });
    this.scientistService()
      .retrieve()
      .then(res => {
        this.scientists = res.data;
      });
  }

  public getSelected(selectedVals, option): any {
    if (selectedVals) {
      return selectedVals.find(value => option.id === value.id) ?? option;
    }
    return option;
  }
}
