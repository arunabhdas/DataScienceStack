/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import VueRouter from 'vue-router';

import * as config from '@/shared/config/config';
import ScientistDetailComponent from '@/entities/scientist/scientist-details.vue';
import ScientistClass from '@/entities/scientist/scientist-details.component';
import ScientistService from '@/entities/scientist/scientist.service';
import router from '@/router';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();
localVue.use(VueRouter);

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
localVue.component('font-awesome-icon', {});
localVue.component('router-link', {});

describe('Component Tests', () => {
  describe('Scientist Management Detail Component', () => {
    let wrapper: Wrapper<ScientistClass>;
    let comp: ScientistClass;
    let scientistServiceStub: SinonStubbedInstance<ScientistService>;

    beforeEach(() => {
      scientistServiceStub = sinon.createStubInstance<ScientistService>(ScientistService);

      wrapper = shallowMount<ScientistClass>(ScientistDetailComponent, {
        store,
        localVue,
        router,
        provide: { scientistService: () => scientistServiceStub, alertService: () => new AlertService() },
      });
      comp = wrapper.vm;
    });

    describe('OnInit', () => {
      it('Should call load all on init', async () => {
        // GIVEN
        const foundScientist = { id: 123 };
        scientistServiceStub.find.resolves(foundScientist);

        // WHEN
        comp.retrieveScientist(123);
        await comp.$nextTick();

        // THEN
        expect(comp.scientist).toBe(foundScientist);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundScientist = { id: 123 };
        scientistServiceStub.find.resolves(foundScientist);

        // WHEN
        comp.beforeRouteEnter({ params: { scientistId: 123 } }, null, cb => cb(comp));
        await comp.$nextTick();

        // THEN
        expect(comp.scientist).toBe(foundScientist);
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
