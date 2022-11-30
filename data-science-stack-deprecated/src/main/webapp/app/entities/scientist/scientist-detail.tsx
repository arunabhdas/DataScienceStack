import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, UncontrolledTooltip, Row, Col } from 'reactstrap';
import { TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './scientist.reducer';

export const ScientistDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const scientistEntity = useAppSelector(state => state.scientist.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="scientistDetailsHeading">Scientist</h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">ID</span>
          </dt>
          <dd>{scientistEntity.id}</dd>
          <dt>
            <span id="firstName">First Name</span>
            <UncontrolledTooltip target="firstName">The firstname attribute.</UncontrolledTooltip>
          </dt>
          <dd>{scientistEntity.firstName}</dd>
          <dt>
            <span id="lastName">Last Name</span>
          </dt>
          <dd>{scientistEntity.lastName}</dd>
          <dt>
            <span id="email">Email</span>
          </dt>
          <dd>{scientistEntity.email}</dd>
          <dt>
            <span id="phoneNumber">Phone Number</span>
          </dt>
          <dd>{scientistEntity.phoneNumber}</dd>
          <dt>
            <span id="startDate">Start Date</span>
          </dt>
          <dd>
            {scientistEntity.startDate ? <TextFormat value={scientistEntity.startDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="salary">Salary</span>
          </dt>
          <dd>{scientistEntity.salary}</dd>
          <dt>
            <span id="percentage">Percentage</span>
          </dt>
          <dd>{scientistEntity.percentage}</dd>
          <dt>Department</dt>
          <dd>{scientistEntity.department ? scientistEntity.department.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/scientist" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" /> <span className="d-none d-md-inline">Back</span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/scientist/${scientistEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" /> <span className="d-none d-md-inline">Edit</span>
        </Button>
      </Col>
    </Row>
  );
};

export default ScientistDetail;
