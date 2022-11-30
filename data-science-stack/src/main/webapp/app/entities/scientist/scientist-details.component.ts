import { Component, Vue, Inject } from 'vue-property-decorator';

import { IScientist } from '@/shared/model/scientist.model';
import ScientistService from './scientist.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class ScientistDetails extends Vue {
  @Inject('scientistService') private scientistService: () => ScientistService;
  @Inject('alertService') private alertService: () => AlertService;

  public scientist: IScientist = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.scientistId) {
        vm.retrieveScientist(to.params.scientistId);
      }
    });
  }

  public retrieveScientist(scientistId) {
    this.scientistService()
      .find(scientistId)
      .then(res => {
        this.scientist = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
