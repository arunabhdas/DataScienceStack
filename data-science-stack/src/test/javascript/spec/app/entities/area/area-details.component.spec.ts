/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import AreaDetailComponent from '@/entities/area/area-details.vue';
import AreaClass from '@/entities/area/area-details.component';
import AreaService from '@/entities/area/area.service';
import router from '@/router';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Area Management Detail Component', () => {
    let wrapper: Wrapper<AreaClass>;
    let comp: AreaClass;
    let areaServiceStub: SinonStubbedInstance<AreaService>;

    beforeEach(() => {
      areaServiceStub = sinon.createStubInstance<AreaService>(AreaService);

      wrapper = shallowMount<AreaClass>(AreaDetailComponent, {
        store,
        localVue,
        router,
        provide: { areaService: () => areaServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundArea = { id: 123 };
        areaServiceStub.find.resolves(foundArea);

        // WHEN
        comp.retrieveArea(123);
        await comp.$nextTick();

        // THEN
        expect(comp.area).toBe(foundArea);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundArea = { id: 123 };
        areaServiceStub.find.resolves(foundArea);

        // WHEN
        comp.beforeRouteEnter({ params: { areaId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.area).toBe(foundArea);
      });
    });

    describe('Previous state', () => {
      it('Should go previous state', async () => {
        comp.previousState();
        await comp.$nextTick();

        expect(comp.$router.currentRoute.fullPath).toContain('/');
      });
    });
  });
});
