import region from 'app/entities/region/region.reducer';
import country from 'app/entities/country/country.reducer';
import location from 'app/entities/location/location.reducer';
import department from 'app/entities/department/department.reducer';
import task from 'app/entities/task/task.reducer';
import scientist from 'app/entities/scientist/scientist.reducer';
import area from 'app/entities/area/area.reducer';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const entitiesReducers = {
  region,
  country,
  location,
  department,
  task,
  scientist,
  area,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
};

export default entitiesReducers;
