import Backbone from "backbone";
import _ from "underscore";
import chai from "chai";
import spies from "chai-spies";
import Lazify from "../src/backbone.lazify";

chai.use(spies);

const expect = chai.expect;

_.extend(Backbone.Model.prototype, Backbone.Lazify);

const TestModel = Backbone.Model.extend({

  lazify: {
    slowMethod: 1000
  },

  slowMethod(next) {
    next(new Date().getTime());
  },

  testMethod(message, next) {
    if (next && _.isFunction(next)) {
      next(new Date().getTime());
    }
  }
});

let subject;

describe("Backbone.Lazify", () => {
  beforeEach(() => {
    subject = new TestModel();
  });
  describe("#lazy", () => {
    describe("when no function name is provided ", () => {
      it("should throw an exception", () => {
        expect(() => {
          subject.lazy();
        }).to.throw();
      });
    });
    describe("when a function name is provided", () => {
      describe("when the model has no function matching that name", () => {
        it("should throw an exception", () => {
          expect(() => {
            subject.lazy('boom');
          }).to.throw();
        });
      });
      describe("when the model has a function matching that name", () => {
        it("should be invoked with arguments", (done) => {
          let spy = chai.spy(subject.testMethod);
          subject.testMethod = spy;
          subject.lazy('testMethod', 'testArg', () => {
            expect(spy).to.have.been.called();
            expect(spy).to.have.been.called.with('testArg');
            done();
          });
        });
        it("should be memoised for reuse", (done) => {
          subject.lazy('testMethod', 'foo', () => {
            done();
          });
          expect(subject._lazified.testMethod).to.be.a('function');
        });
        it("should use the default debounce", (done) => {
          let start = new Date().getTime();
          subject.lazy('testMethod', 'foo', end => {
            const time = end - start;
            expect(time).to.be.closeTo(Backbone.Lazify.DEFAULT_DEBOUNCE, 10);
            done();
          });
        });
      });
      describe("when the model has a debounce time set", () => {
        it("should use that time", (done) => {
          let start = new Date().getTime();
          subject.lazy('slowMethod', end => {
            const time = end - start;
            expect(time).to.be.closeTo(subject.lazify.slowMethod, 10);
            done();
          });
        });
      });
    });
  });

  describe("#lazified", function() {
    describe("when there is no lazified function", function() {
      it("should create one", function() {
        subject.lazified("testMethod");
        expect(subject._lazified["testMethod"]).to.be.a("function");
      });
    });
    describe("when there is a lazified function", function() {
      it("should return it", function() {
        subject.lazy("testMethod");
        let lazified = subject.lazified("testMethod");
        expect(lazified).to.equal(subject._lazified["testMethod"]);
      });
    });
  });
});
