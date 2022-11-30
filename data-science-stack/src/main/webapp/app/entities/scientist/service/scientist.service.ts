import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IScientist, NewScientist } from '../scientist.model';

export type PartialUpdateScientist = Partial<IScientist> & Pick<IScientist, 'id'>;

type RestOf<T extends IScientist | NewScientist> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestScientist = RestOf<IScientist>;

export type NewRestScientist = RestOf<NewScientist>;

export type PartialUpdateRestScientist = RestOf<PartialUpdateScientist>;

export type EntityResponseType = HttpResponse<IScientist>;
export type EntityArrayResponseType = HttpResponse<IScientist[]>;

@Injectable({ providedIn: 'root' })
export class ScientistService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/scientists');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(scientist: NewScientist): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scientist);
    return this.http
      .post<RestScientist>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(scientist: IScientist): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scientist);
    return this.http
      .put<RestScientist>(`${this.resourceUrl}/${this.getScientistIdentifier(scientist)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(scientist: PartialUpdateScientist): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(scientist);
    return this.http
      .patch<RestScientist>(`${this.resourceUrl}/${this.getScientistIdentifier(scientist)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestScientist>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestScientist[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getScientistIdentifier(scientist: Pick<IScientist, 'id'>): number {
    return scientist.id;
  }

  compareScientist(o1: Pick<IScientist, 'id'> | null, o2: Pick<IScientist, 'id'> | null): boolean {
    return o1 && o2 ? this.getScientistIdentifier(o1) === this.getScientistIdentifier(o2) : o1 === o2;
  }

  addScientistToCollectionIfMissing<Type extends Pick<IScientist, 'id'>>(
    scientistCollection: Type[],
    ...scientistsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const scientists: Type[] = scientistsToCheck.filter(isPresent);
    if (scientists.length > 0) {
      const scientistCollectionIdentifiers = scientistCollection.map(scientistItem => this.getScientistIdentifier(scientistItem)!);
      const scientistsToAdd = scientists.filter(scientistItem => {
        const scientistIdentifier = this.getScientistIdentifier(scientistItem);
        if (scientistCollectionIdentifiers.includes(scientistIdentifier)) {
          return false;
        }
        scientistCollectionIdentifiers.push(scientistIdentifier);
        return true;
      });
      return [...scientistsToAdd, ...scientistCollection];
    }
    return scientistCollection;
  }

  protected convertDateFromClient<T extends IScientist | NewScientist | PartialUpdateScientist>(scientist: T): RestOf<T> {
    return {
      ...scientist,
      startDate: scientist.startDate?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restScientist: RestScientist): IScientist {
    return {
      ...restScientist,
      startDate: restScientist.startDate ? dayjs(restScientist.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestScientist>): HttpResponse<IScientist> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestScientist[]>): HttpResponse<IScientist[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
