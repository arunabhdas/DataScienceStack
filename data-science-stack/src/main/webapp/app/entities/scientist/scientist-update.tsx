import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Row, Col, FormText, UncontrolledTooltip } from 'reactstrap';
import { isNumber, ValidatedField, ValidatedForm } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { IDepartment } from 'app/shared/model/department.model';
import { getEntities as getDepartments } from 'app/entities/department/department.reducer';
import { IScientist } from 'app/shared/model/scientist.model';
import { getEntity, updateEntity, createEntity, reset } from './scientist.reducer';

export const ScientistUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const departments = useAppSelector(state => state.department.entities);
  const scientistEntity = useAppSelector(state => state.scientist.entity);
  const loading = useAppSelector(state => state.scientist.loading);
  const updating = useAppSelector(state => state.scientist.updating);
  const updateSuccess = useAppSelector(state => state.scientist.updateSuccess);

  const handleClose = () => {
    navigate('/scientist');
  };

  useEffect(() => {
    if (!isNew) {
      dispatch(getEntity(id));
    }

    dispatch(getDepartments({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    values.startDate = convertDateTimeToServer(values.startDate);

    const entity = {
      ...scientistEntity,
      ...values,
      department: departments.find(it => it.id.toString() === values.department.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          startDate: displayDefaultDateTime(),
        }
      : {
          ...scientistEntity,
          startDate: convertDateTimeFromServer(scientistEntity.startDate),
          department: scientistEntity?.department?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="dataScienceStackApp.scientist.home.createOrEditLabel" data-cy="ScientistCreateUpdateHeading">
            Create or edit a Scientist
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? <ValidatedField name="id" required readOnly id="scientist-id" label="ID" validate={{ required: true }} /> : null}
              <ValidatedField label="First Name" id="scientist-firstName" name="firstName" data-cy="firstName" type="text" />
              <UncontrolledTooltip target="firstNameLabel">The firstname attribute.</UncontrolledTooltip>
              <ValidatedField label="Last Name" id="scientist-lastName" name="lastName" data-cy="lastName" type="text" />
              <ValidatedField label="Email" id="scientist-email" name="email" data-cy="email" type="text" />
              <ValidatedField label="Phone Number" id="scientist-phoneNumber" name="phoneNumber" data-cy="phoneNumber" type="text" />
              <ValidatedField
                label="Start Date"
                id="scientist-startDate"
                name="startDate"
                data-cy="startDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField label="Salary" id="scientist-salary" name="salary" data-cy="salary" type="text" />
              <ValidatedField label="Percentage" id="scientist-percentage" name="percentage" data-cy="percentage" type="text" />
              <ValidatedField id="scientist-department" name="department" data-cy="department" label="Department" type="select">
                <option value="" key="0" />
                {departments
                  ? departments.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/scientist" replace color="info">
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

export default ScientistUpdate;
