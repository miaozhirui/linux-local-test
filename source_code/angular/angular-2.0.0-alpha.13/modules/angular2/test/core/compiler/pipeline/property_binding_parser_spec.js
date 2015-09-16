import {describe, beforeEach, it, expect, iit, ddescribe, el} from 'angular2/test_lib';
import {PropertyBindingParser} from 'angular2/src/core/compiler/pipeline/property_binding_parser';
import {CompilePipeline} from 'angular2/src/core/compiler/pipeline/compile_pipeline';
import {MapWrapper} from 'angular2/src/facade/collection';
import {CompileElement} from 'angular2/src/core/compiler/pipeline/compile_element';
import {CompileStep} from 'angular2/src/core/compiler/pipeline/compile_step'
import {CompileControl} from 'angular2/src/core/compiler/pipeline/compile_control';
import {Lexer, Parser} from 'angular2/change_detection';

export function main() {
  describe('PropertyBindingParser', () => {
    function createPipeline(ignoreBindings = false) {
      return new CompilePipeline([
        new MockStep((parent, current, control) => { current.ignoreBindings = ignoreBindings; }),
        new PropertyBindingParser(new Parser(new Lexer()))]);
    }

    it('should not parse bindings when ignoreBindings is true', () => {
      var results = createPipeline(true).process(el('<div [a]="b"></div>'));
      expect(results[0].propertyBindings).toBe(null);
    });

    it('should detect [] syntax', () => {
      var results = createPipeline().process(el('<div [a]="b"></div>'));
      expect(MapWrapper.get(results[0].propertyBindings, 'a').source).toEqual('b');
    });

    it('should detect bind- syntax', () => {
      var results = createPipeline().process(el('<div bind-a="b"></div>'));
      expect(MapWrapper.get(results[0].propertyBindings, 'a').source).toEqual('b');
    });

    it('should detect interpolation syntax', () => {
      // Note: we don't test all corner cases of interpolation as we assume shared functionality between text interpolation
      // and attribute interpolation.
      var results = createPipeline().process(el('<div a="{{b}}"></div>'));
      expect(MapWrapper.get(results[0].propertyBindings, 'a').source).toEqual('{{b}}');
    });

    it('should detect var- syntax', () => {
      var results = createPipeline().process(el('<template var-a="b"></template>'));
      expect(MapWrapper.get(results[0].variableBindings, 'b')).toEqual('a');
    });

    it('should store variable binding for a non-template element', () => {
      var results = createPipeline().process(el('<p var-george="washington"></p>'));
      expect(MapWrapper.get(results[0].variableBindings, 'washington')).toEqual('george');
    });

    it('should store variable binding for a non-template element using shorthand syntax', () => {
      var results = createPipeline().process(el('<p #george="washington"></p>'));
      expect(MapWrapper.get(results[0].variableBindings, 'washington')).toEqual('george');
    });

    it('should store a variable binding with an implicit value', () => {
      var results = createPipeline().process(el('<p var-george></p>'));
      expect(MapWrapper.get(results[0].variableBindings, '\$implicit')).toEqual('george');
    });

    it('should store a variable binding with an implicit value using shorthand syntax', () => {
      var results = createPipeline().process(el('<p #george></p>'));
      expect(MapWrapper.get(results[0].variableBindings, '\$implicit')).toEqual('george');
    });

    it('should detect () syntax', () => {
      var results = createPipeline().process(el('<div (click)="b()"></div>'));
      expect(MapWrapper.get(results[0].eventBindings, 'click').source).toEqual('b()');
      // "(click[])" is not an expected syntax and is only used to validate the regexp
      results = createPipeline().process(el('<div (click[])="b()"></div>'));
      expect(MapWrapper.get(results[0].eventBindings, 'click[]').source).toEqual('b()');

    });

    it('should detect on- syntax', () => {
      var results = createPipeline().process(el('<div on-click="b()"></div>'));
      expect(MapWrapper.get(results[0].eventBindings, 'click').source).toEqual('b()');
    });
  });
}

class MockStep extends CompileStep {
  processClosure:Function;
  constructor(process) {
    super();
    this.processClosure = process;
  }
  process(parent:CompileElement, current:CompileElement, control:CompileControl) {
    this.processClosure(parent, current, control);
  }
}
