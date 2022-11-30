import { Component, Vue, Inject } from 'vue-property-decorator';

import { IArea } from '@/shared/model/area.model';
import AreaService from './area.service';
import AlertService from '@/shared/alert/alert.service';

@Component
export default class AreaDetails extends Vue {
  @Inject('areaService') private areaService: () => AreaService;
  @Inject('alertService') private alertService: () => AlertService;

  public area: IArea = {};

  beforeRouteEnter(to, from, next) {
    next(vm => {
      if (to.params.areaId) {
        vm.retrieveArea(to.params.areaId);
      }
    });
  }

  public retrieveArea(areaId) {
    this.areaService()
      .find(areaId)
      .then(res => {
        this.area = res;
      })
      .catch(error => {
        this.alertService().showHttpError(this, error.response);
      });
  }

  public previousState() {
    this.$router.go(-1);
  }
}
