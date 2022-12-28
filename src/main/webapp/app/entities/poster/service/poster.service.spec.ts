import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPoster } from '../poster.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../poster.test-samples';

import { PosterService } from './poster.service';

const requireRestSample: IPoster = {
  ...sampleWithRequiredData,
};

describe('Poster Service', () => {
  let service: PosterService;
  let httpMock: HttpTestingController;
  let expectedResult: IPoster | IPoster[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PosterService);
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

    it('should create a Poster', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const poster = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(poster).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Poster', () => {
      const poster = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(poster).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Poster', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Poster', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Poster', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPosterToCollectionIfMissing', () => {
      it('should add a Poster to an empty array', () => {
        const poster: IPoster = sampleWithRequiredData;
        expectedResult = service.addPosterToCollectionIfMissing([], poster);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(poster);
      });

      it('should not add a Poster to an array that contains it', () => {
        const poster: IPoster = sampleWithRequiredData;
        const posterCollection: IPoster[] = [
          {
            ...poster,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPosterToCollectionIfMissing(posterCollection, poster);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Poster to an array that doesn't contain it", () => {
        const poster: IPoster = sampleWithRequiredData;
        const posterCollection: IPoster[] = [sampleWithPartialData];
        expectedResult = service.addPosterToCollectionIfMissing(posterCollection, poster);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(poster);
      });

      it('should add only unique Poster to an array', () => {
        const posterArray: IPoster[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const posterCollection: IPoster[] = [sampleWithRequiredData];
        expectedResult = service.addPosterToCollectionIfMissing(posterCollection, ...posterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const poster: IPoster = sampleWithRequiredData;
        const poster2: IPoster = sampleWithPartialData;
        expectedResult = service.addPosterToCollectionIfMissing([], poster, poster2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(poster);
        expect(expectedResult).toContain(poster2);
      });

      it('should accept null and undefined values', () => {
        const poster: IPoster = sampleWithRequiredData;
        expectedResult = service.addPosterToCollectionIfMissing([], null, poster, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(poster);
      });

      it('should return initial array if no Poster is added', () => {
        const posterCollection: IPoster[] = [sampleWithRequiredData];
        expectedResult = service.addPosterToCollectionIfMissing(posterCollection, undefined, null);
        expect(expectedResult).toEqual(posterCollection);
      });
    });

    describe('comparePoster', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePoster(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePoster(entity1, entity2);
        const compareResult2 = service.comparePoster(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePoster(entity1, entity2);
        const compareResult2 = service.comparePoster(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePoster(entity1, entity2);
        const compareResult2 = service.comparePoster(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
