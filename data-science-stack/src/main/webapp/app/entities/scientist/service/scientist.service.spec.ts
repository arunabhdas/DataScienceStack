import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IScientist } from '../scientist.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../scientist.test-samples';

import { ScientistService, RestScientist } from './scientist.service';

const requireRestSample: RestScientist = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.toJSON(),
};

describe('Scientist Service', () => {
  let service: ScientistService;
  let httpMock: HttpTestingController;
  let expectedResult: IScientist | IScientist[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ScientistService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Scientist', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const scientist = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(scientist).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Scientist', () => {
      const scientist = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(scientist).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Scientist', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Scientist', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Scientist', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addScientistToCollectionIfMissing', () => {
      it('should add a Scientist to an empty array', () => {
        const scientist: IScientist = sampleWithRequiredData;
        expectedResult = service.addScientistToCollectionIfMissing([], scientist);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scientist);
      });

      it('should not add a Scientist to an array that contains it', () => {
        const scientist: IScientist = sampleWithRequiredData;
        const scientistCollection: IScientist[] = [
          {
            ...scientist,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addScientistToCollectionIfMissing(scientistCollection, scientist);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Scientist to an array that doesn't contain it", () => {
        const scientist: IScientist = sampleWithRequiredData;
        const scientistCollection: IScientist[] = [sampleWithPartialData];
        expectedResult = service.addScientistToCollectionIfMissing(scientistCollection, scientist);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scientist);
      });

      it('should add only unique Scientist to an array', () => {
        const scientistArray: IScientist[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const scientistCollection: IScientist[] = [sampleWithRequiredData];
        expectedResult = service.addScientistToCollectionIfMissing(scientistCollection, ...scientistArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const scientist: IScientist = sampleWithRequiredData;
        const scientist2: IScientist = sampleWithPartialData;
        expectedResult = service.addScientistToCollectionIfMissing([], scientist, scientist2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(scientist);
        expect(expectedResult).toContain(scientist2);
      });

      it('should accept null and undefined values', () => {
        const scientist: IScientist = sampleWithRequiredData;
        expectedResult = service.addScientistToCollectionIfMissing([], null, scientist, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(scientist);
      });

      it('should return initial array if no Scientist is added', () => {
        const scientistCollection: IScientist[] = [sampleWithRequiredData];
        expectedResult = service.addScientistToCollectionIfMissing(scientistCollection, undefined, null);
        expect(expectedResult).toEqual(scientistCollection);
      });
    });

    describe('compareScientist', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareScientist(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareScientist(entity1, entity2);
        const compareResult2 = service.compareScientist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareScientist(entity1, entity2);
        const compareResult2 = service.compareScientist(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareScientist(entity1, entity2);
        const compareResult2 = service.compareScientist(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
