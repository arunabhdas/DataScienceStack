/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import * as config from '@/shared/config/config';
import AreaUpdateComponent from '@/entities/area/area-update.vue';
import AreaClass from '@/entities/area/area-update.component';
import AreaService from '@/entities/area/area.service';

import TaskService from '@/entities/task/task.service';

import ScientistService from '@/entities/scientist/scientist.service';
import AlertService from '@/shared/alert/alert.service';

const localVue = createLocalVue();

config.initVueApp(localVue);
const store = config.initVueXStore(localVue);
const router = new Router();
localVue.use(Router);
localVue.use(ToastPlugin);
localVue.component('font-awesome-icon', {});
localVue.component('b-input-group', {});
localVue.component('b-input-group-prepend', {});
localVue.component('b-form-datepicker', {});
localVue.component('b-form-input', {});

describe('Component Tests', () => {
  describe('Area Management Update Component', () => {
    let wrapper: Wrapper<AreaClass>;
    let comp: AreaClass;
    let areaServiceStub: SinonStubbedInstance<AreaService>;

    beforeEach(() => {
      areaServiceStub = sinon.createStubInstance<AreaService>(AreaService);

      wrapper = shallowMount<AreaClass>(AreaUpdateComponent, {
        store,
        localVue,
        router,
        provide: {
          areaService: () => areaServiceStub,
          alertService: () => new AlertService(),

          taskService: () =>
            sinon.createStubInstance<TaskService>(TaskService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          scientistService: () =>
            sinon.createStubInstance<ScientistService>(ScientistService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      });
      comp = wrapper.vm;
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.area = entity;
        areaServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(areaServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.area = entity;
        areaServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(areaServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundArea = { id: 123 };
        areaServiceStub.find.resolves(foundArea);
        areaServiceStub.retrieve.resolves([foundArea]);

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
