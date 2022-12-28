import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ISpotifyAccount } from '../spotify-account.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../spotify-account.test-samples';

import { SpotifyAccountService } from './spotify-account.service';

const requireRestSample: ISpotifyAccount = {
  ...sampleWithRequiredData,
};

describe('SpotifyAccount Service', () => {
  let service: SpotifyAccountService;
  let httpMock: HttpTestingController;
  let expectedResult: ISpotifyAccount | ISpotifyAccount[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(SpotifyAccountService);
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

    it('should create a SpotifyAccount', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const spotifyAccount = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(spotifyAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a SpotifyAccount', () => {
      const spotifyAccount = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(spotifyAccount).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a SpotifyAccount', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of SpotifyAccount', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a SpotifyAccount', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addSpotifyAccountToCollectionIfMissing', () => {
      it('should add a SpotifyAccount to an empty array', () => {
        const spotifyAccount: ISpotifyAccount = sampleWithRequiredData;
        expectedResult = service.addSpotifyAccountToCollectionIfMissing([], spotifyAccount);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(spotifyAccount);
      });

      it('should not add a SpotifyAccount to an array that contains it', () => {
        const spotifyAccount: ISpotifyAccount = sampleWithRequiredData;
        const spotifyAccountCollection: ISpotifyAccount[] = [
          {
            ...spotifyAccount,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addSpotifyAccountToCollectionIfMissing(spotifyAccountCollection, spotifyAccount);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a SpotifyAccount to an array that doesn't contain it", () => {
        const spotifyAccount: ISpotifyAccount = sampleWithRequiredData;
        const spotifyAccountCollection: ISpotifyAccount[] = [sampleWithPartialData];
        expectedResult = service.addSpotifyAccountToCollectionIfMissing(spotifyAccountCollection, spotifyAccount);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(spotifyAccount);
      });

      it('should add only unique SpotifyAccount to an array', () => {
        const spotifyAccountArray: ISpotifyAccount[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const spotifyAccountCollection: ISpotifyAccount[] = [sampleWithRequiredData];
        expectedResult = service.addSpotifyAccountToCollectionIfMissing(spotifyAccountCollection, ...spotifyAccountArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const spotifyAccount: ISpotifyAccount = sampleWithRequiredData;
        const spotifyAccount2: ISpotifyAccount = sampleWithPartialData;
        expectedResult = service.addSpotifyAccountToCollectionIfMissing([], spotifyAccount, spotifyAccount2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(spotifyAccount);
        expect(expectedResult).toContain(spotifyAccount2);
      });

      it('should accept null and undefined values', () => {
        const spotifyAccount: ISpotifyAccount = sampleWithRequiredData;
        expectedResult = service.addSpotifyAccountToCollectionIfMissing([], null, spotifyAccount, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(spotifyAccount);
      });

      it('should return initial array if no SpotifyAccount is added', () => {
        const spotifyAccountCollection: ISpotifyAccount[] = [sampleWithRequiredData];
        expectedResult = service.addSpotifyAccountToCollectionIfMissing(spotifyAccountCollection, undefined, null);
        expect(expectedResult).toEqual(spotifyAccountCollection);
      });
    });

    describe('compareSpotifyAccount', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareSpotifyAccount(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareSpotifyAccount(entity1, entity2);
        const compareResult2 = service.compareSpotifyAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareSpotifyAccount(entity1, entity2);
        const compareResult2 = service.compareSpotifyAccount(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareSpotifyAccount(entity1, entity2);
        const compareResult2 = service.compareSpotifyAccount(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
