import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { ITask } from 'app/shared/model/task.model';
import { getEntities as getTasks } from 'app/entities/task/task.reducer';
import { IScientist } from 'app/shared/model/scientist.model';
import { getEntities as getScientists } from 'app/entities/scientist/scientist.reducer';
import { IArea } from 'app/shared/model/area.model';
import { getEntity, updateEntity, createEntity, reset } from './area.reducer';

export const AreaUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const tasks = useAppSelector(state => state.task.entities);
  const scientists = useAppSelector(state => state.scientist.entities);
  const areaEntity = useAppSelector(state => state.area.entity);
  const loading = useAppSelector(state => state.area.loading);
  const updating = useAppSelector(state => state.area.updating);
  const updateSuccess = useAppSelector(state => state.area.updateSuccess);

  const handleClose = () => {
    navigate('/area' + location.search);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getTasks({}));
    dispatch(getScientists({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    const entity = {
      ...areaEntity,
      ...values,
      tasks: mapIdList(values.tasks),
      scientist: scientists.find(it => it.id.toString() === values.scientist.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...areaEntity,
          tasks: areaEntity?.tasks?.map(e => e.id.toString()),
          scientist: areaEntity?.scientist?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="dataScienceStackApp.area.home.createOrEditLabel" data-cy="AreaCreateUpdateHeading">
            Create or edit a Area
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="area-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="Title" id="area-title" name="title" data-cy="title" type="text" />
              <ValidatedField label="Description" id="area-description" name="description" data-cy="description" type="text" />
              <ValidatedField label="Task" id="area-task" data-cy="task" type="select" multiple name="tasks">
                <option value="" key="0" />
                {tasks
                  ? tasks.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.title}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField id="area-scientist" name="scientist" data-cy="scientist" label="Scientist" type="select">
                <option value="" key="0" />
                {scientists
                  ? scientists.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/area" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">Back</span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp; Save
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default AreaUpdate;
