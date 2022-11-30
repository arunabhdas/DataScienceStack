import { Component, Vue, Inject } from 'vue-property-decorator';

import AlertService from '@/shared/alert/alert.service';

import AreaService from '@/entities/area/area.service';
import { IArea } from '@/shared/model/area.model';

import { ITask, Task } from '@/shared/model/task.model';
import TaskService from './task.service';

const validations: any = {
  task: {
    title: {},
    description: {},
  },
};

@Component({
  validations,
})
export default class TaskUpdate extends Vue {
  @Inject('taskService') private taskService: () => TaskService;
  @Inject('alertService') private alertService: () => AlertService;

  public task: ITask = new Task();

  @Inject('areaService') private areaService: () => AreaService;

  public areas: IArea[] = [];
  public isSaving = false;
  public currentLanguage = '';

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.taskId) {
        vm.retrieveTask(to.params.taskId);
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
    if (this.task.id) {
      this.taskService()
        .update(this.task)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Task is updated with identifier ' + param.id;
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
      this.taskService()
        .create(this.task)
        .then(param => {
          this.isSaving = false;
          this.$router.go(-1);
          const message = 'A Task is created with identifier ' + param.id;
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

  public retrieveTask(taskId): void {
    this.taskService()
      .find(taskId)
      .then(res => {
        this.task = res;
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
  }
}
