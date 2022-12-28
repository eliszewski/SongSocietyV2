import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IReply } from '../reply.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../reply.test-samples';

import { ReplyService } from './reply.service';

const requireRestSample: IReply = {
  ...sampleWithRequiredData,
};

describe('Reply Service', () => {
  let service: ReplyService;
  let httpMock: HttpTestingController;
  let expectedResult: IReply | IReply[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ReplyService);
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

    it('should create a Reply', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const reply = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(reply).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Reply', () => {
      const reply = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(reply).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Reply', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Reply', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Reply', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addReplyToCollectionIfMissing', () => {
      it('should add a Reply to an empty array', () => {
        const reply: IReply = sampleWithRequiredData;
        expectedResult = service.addReplyToCollectionIfMissing([], reply);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reply);
      });

      it('should not add a Reply to an array that contains it', () => {
        const reply: IReply = sampleWithRequiredData;
        const replyCollection: IReply[] = [
          {
            ...reply,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addReplyToCollectionIfMissing(replyCollection, reply);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Reply to an array that doesn't contain it", () => {
        const reply: IReply = sampleWithRequiredData;
        const replyCollection: IReply[] = [sampleWithPartialData];
        expectedResult = service.addReplyToCollectionIfMissing(replyCollection, reply);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reply);
      });

      it('should add only unique Reply to an array', () => {
        const replyArray: IReply[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const replyCollection: IReply[] = [sampleWithRequiredData];
        expectedResult = service.addReplyToCollectionIfMissing(replyCollection, ...replyArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const reply: IReply = sampleWithRequiredData;
        const reply2: IReply = sampleWithPartialData;
        expectedResult = service.addReplyToCollectionIfMissing([], reply, reply2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(reply);
        expect(expectedResult).toContain(reply2);
      });

      it('should accept null and undefined values', () => {
        const reply: IReply = sampleWithRequiredData;
        expectedResult = service.addReplyToCollectionIfMissing([], null, reply, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(reply);
      });

      it('should return initial array if no Reply is added', () => {
        const replyCollection: IReply[] = [sampleWithRequiredData];
        expectedResult = service.addReplyToCollectionIfMissing(replyCollection, undefined, null);
        expect(expectedResult).toEqual(replyCollection);
      });
    });

    describe('compareReply', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareReply(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareReply(entity1, entity2);
        const compareResult2 = service.compareReply(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareReply(entity1, entity2);
        const compareResult2 = service.compareReply(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareReply(entity1, entity2);
        const compareResult2 = service.compareReply(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
