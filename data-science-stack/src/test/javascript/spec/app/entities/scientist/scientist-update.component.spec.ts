/* tslint:disable max-line-length */
import { shallowMount, createLocalVue, Wrapper } from '@vue/test-utils';
import sinon, { SinonStubbedInstance } from 'sinon';
import Router from 'vue-router';
import { ToastPlugin } from 'bootstrap-vue';

import dayjs from 'dayjs';
import { DATE_TIME_LONG_FORMAT } from '@/shared/date/filters';

import * as config from '@/shared/config/config';
import ScientistUpdateComponent from '@/entities/scientist/scientist-update.vue';
import ScientistClass from '@/entities/scientist/scientist-update.component';
import ScientistService from '@/entities/scientist/scientist.service';

import AreaService from '@/entities/area/area.service';

import DepartmentService from '@/entities/department/department.service';
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
  describe('Scientist Management Update Component', () => {
    let wrapper: Wrapper<ScientistClass>;
    let comp: ScientistClass;
    let scientistServiceStub: SinonStubbedInstance<ScientistService>;

    beforeEach(() => {
      scientistServiceStub = sinon.createStubInstance<ScientistService>(ScientistService);

      wrapper = shallowMount<ScientistClass>(ScientistUpdateComponent, {
        store,
        localVue,
        router,
        provide: {
          scientistService: () => scientistServiceStub,
          alertService: () => new AlertService(),

          areaService: () =>
            sinon.createStubInstance<AreaService>(AreaService, {
              retrieve: sinon.stub().resolves({}),
            } as any),

          departmentService: () =>
            sinon.createStubInstance<DepartmentService>(DepartmentService, {
              retrieve: sinon.stub().resolves({}),
            } as any),
        },
      });
      comp = wrapper.vm;
    });

    describe('load', () => {
      it('Should convert date from string', () => {
        // GIVEN
        const date = new Date('2019-10-15T11:42:02Z');

        // WHEN
        const convertedDate = comp.convertDateTimeFromServer(date);

        // THEN
        expect(convertedDate).toEqual(dayjs(date).format(DATE_TIME_LONG_FORMAT));
      });

      it('Should not convert date if date is not present', () => {
        expect(comp.convertDateTimeFromServer(null)).toBeNull();
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', async () => {
        // GIVEN
        const entity = { id: 123 };
        comp.scientist = entity;
        scientistServiceStub.update.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(scientistServiceStub.update.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', async () => {
        // GIVEN
        const entity = {};
        comp.scientist = entity;
        scientistServiceStub.create.resolves(entity);

        // WHEN
        comp.save();
        await comp.$nextTick();

        // THEN
        expect(scientistServiceStub.create.calledWith(entity)).toBeTruthy();
        expect(comp.isSaving).toEqual(false);
      });
    });

    describe('Before route enter', () => {
      it('Should retrieve data', async () => {
        // GIVEN
        const foundScientist = { id: 123 };
        scientistServiceStub.find.resolves(foundScientist);
        scientistServiceStub.retrieve.resolves([foundScientist]);

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
