import {
  AsyncTestCompleter,
  beforeEach,
  ddescribe,
  describe,
  el,
  expect,
  iit,
  inject,
  it,
  xit,
} from 'angular2/test_lib';

import {DOM} from 'angular2/src/dom/dom_adapter';
import {Type, isPresent, BaseException, assertionsEnabled, isJsObject} from 'angular2/src/facade/lang';
import {PromiseWrapper} from 'angular2/src/facade/async';

import {Injector} from 'angular2/di';
import {Lexer, Parser, dynamicChangeDetection,
  DynamicChangeDetection, Pipe, PipeRegistry} from 'angular2/change_detection';

import {Compiler, CompilerCache} from 'angular2/src/core/compiler/compiler';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {NativeShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {TemplateLoader} from 'angular2/src/core/compiler/template_loader';
import {MockTemplateResolver} from 'angular2/src/mock/template_resolver_mock';
import {BindingPropagationConfig} from 'angular2/src/core/compiler/binding_propagation_config';
import {ComponentUrlMapper} from 'angular2/src/core/compiler/component_url_mapper';
import {UrlResolver} from 'angular2/src/core/compiler/url_resolver';
import {StyleUrlResolver} from 'angular2/src/core/compiler/style_url_resolver';
import {CssProcessor} from 'angular2/src/core/compiler/css_processor';

import {Decorator, Component, Viewport} from 'angular2/src/core/annotations/annotations';
import {Template} from 'angular2/src/core/annotations/template';
import {Parent, Ancestor} from 'angular2/src/core/annotations/visibility';
import {EventEmitter} from 'angular2/src/core/annotations/di';

import {If} from 'angular2/src/directives/if';

import {ViewContainer} from 'angular2/src/core/compiler/view_container';

export function main() {
  describe('integration tests', function() {
    var compiler, tplResolver;

    function createCompiler(tplResolver, changedDetection) {
      var urlResolver = new UrlResolver();
      return new Compiler(changedDetection,
        new TemplateLoader(null, null),
        new DirectiveMetadataReader(),
        new Parser(new Lexer()),
        new CompilerCache(),
        new NativeShadowDomStrategy(new StyleUrlResolver(urlResolver)),
        tplResolver,
        new ComponentUrlMapper(),
        urlResolver,
        new CssProcessor(null)
      );
    }

    beforeEach( () => {
      tplResolver = new MockTemplateResolver();
      compiler = createCompiler(tplResolver, dynamicChangeDetection);
    });

    describe('react to record changes', function() {
      var view, ctx, cd;
      function createView(pv) {
        ctx = new MyComp();
        view = pv.instantiate(null, null);
        view.hydrate(new Injector([]), null, ctx);
        cd = view.changeDetector;
      }

      it('should consume text node changes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div>{{ctxProp}}</div>'}));
        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          ctx.ctxProp = 'Hello World!';

          cd.detectChanges();
          expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Hello World!');
          async.done();
        });
      }));

      it('should consume element binding changes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div [id]="ctxProp"></div>'}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();

          expect(view.nodes[0].id).toEqual('Hello World!');
          async.done();
        });
      }));

      it('should consume binding to aria-* attributes', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div [aria-label]="ctxProp"></div>'}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'Initial aria label';
          cd.detectChanges();
          expect(DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Initial aria label');

          ctx.ctxProp = 'Changed aria label';
          cd.detectChanges();
          expect(DOM.getAttribute(view.nodes[0], 'aria-label')).toEqual('Changed aria label');

          async.done();
        });
      }));

      it('should consume binding to property names where attr name and property name do not match', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div [tabindex]="ctxNumProp"></div>'}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          cd.detectChanges();
          expect(view.nodes[0].tabIndex).toEqual(0);

          ctx.ctxNumProp = 5;
          cd.detectChanges();
          expect(view.nodes[0].tabIndex).toEqual(5);

          async.done();
        });
      }));

      it('should consume binding to camel-cased properties using dash-cased syntax in templates', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<input [read-only]="ctxBoolProp">'}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          cd.detectChanges();
          expect(view.nodes[0].readOnly).toBeFalsy();

          ctx.ctxBoolProp = true;
          cd.detectChanges();
          expect(view.nodes[0].readOnly).toBeTruthy();

          async.done();
        });
      }));

      it('should consume binding to inner-html', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({inline: '<div inner-html="{{ctxProp}}"></div>'}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'Some <span>HTML</span>';
          cd.detectChanges();
          expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Some <span>HTML</span>');

          ctx.ctxProp = 'Some other <div>HTML</div>';
          cd.detectChanges();
          expect(DOM.getInnerHTML(view.nodes[0])).toEqual('Some other <div>HTML</div>');

          async.done();
        });
      }));

      it('should consume directive watch expression change.', inject([AsyncTestCompleter], (async) => {
        var tpl =
          '<div>' +
            '<div my-dir [elprop]="ctxProp"></div>' +
            '<div my-dir elprop="Hi there!"></div>' +
            '<div my-dir elprop="Hi {{\'there!\'}}"></div>' +
            '<div my-dir elprop="One more {{ctxProp}}"></div>' +
          '</div>'
        tplResolver.setTemplate(MyComp, new Template({inline: tpl, directives: [MyDir]}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();

          expect(view.elementInjectors[0].get(MyDir).dirProp).toEqual('Hello World!');
          expect(view.elementInjectors[1].get(MyDir).dirProp).toEqual('Hi there!');
          expect(view.elementInjectors[2].get(MyDir).dirProp).toEqual('Hi there!');
          expect(view.elementInjectors[3].get(MyDir).dirProp).toEqual('One more Hello World!');
          async.done();
        });
      }));

      it("should support pipes in bindings and bind config", inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp,
          new Template({
            inline: '<component-with-pipes #comp [prop]="ctxProp | double"></component-with-pipes>',
            directives: [ComponentWithPipes]
          }));


        var registry = new PipeRegistry({
          "double" : [new DoublePipeFactory()]
        });
        var changeDetection = new DynamicChangeDetection(registry);
        var compiler = createCompiler(tplResolver, changeDetection);
        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'a';
          cd.detectChanges();

          var comp = view.contextWithLocals.get("comp");

          // it is doubled twice: once in the binding, second time in the bind config
          expect(comp.prop).toEqual('aaaa');
          async.done();
        });
      }));

      it('should support nested components.', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<child-cmp></child-cmp>',
          directives: [ChildComp]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          cd.detectChanges();

          expect(view.nodes[0].shadowRoot.childNodes[0].nodeValue).toEqual('hello');
          async.done();
        });
      }));

      // GH issue 328 - https://github.com/angular/angular/issues/328
      it('should support different directive types on a single node', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp,
          new Template({
            inline: '<child-cmp my-dir [elprop]="ctxProp"></child-cmp>',
            directives: [MyDir, ChildComp]
          }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'Hello World!';
          cd.detectChanges();

          var elInj = view.elementInjectors[0];
          expect(elInj.get(MyDir).dirProp).toEqual('Hello World!');
          expect(elInj.get(ChildComp).dirProp).toEqual(null);

          async.done();
        });
      }));

      it('should support directives where a binding attribute is not given', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp,
          new Template({
            // No attribute "el-prop" specified.
            inline: '<p my-dir></p>',
            directives: [MyDir]
          }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          async.done();
        });
      }));

      it('should support directives where a selector matches property binding', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp,
          new Template({
            inline: '<p [id]="ctxProp"></p>',
            directives: [IdComponent]
          }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          ctx.ctxProp = 'some_id';
          cd.detectChanges();
          expect(view.nodes[0].id).toEqual('some_id');
          expect(DOM.getInnerHTML(view.nodes[0].shadowRoot.childNodes[0])).toEqual('Matched on id with some_id');

          ctx.ctxProp = 'other_id';
          cd.detectChanges();
          expect(view.nodes[0].id).toEqual('other_id');
          expect(DOM.getInnerHTML(view.nodes[0].shadowRoot.childNodes[0])).toEqual('Matched on id with other_id');

          async.done();
        });
      }));

      it('should support template directives via `<template>` elements.', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp,
          new Template({
            inline: '<div><template some-viewport var-greeting="some-tmpl"><copy-me>{{greeting}}</copy-me></template></div>',
            directives: [SomeViewport]
          }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          cd.detectChanges();

          var childNodesOfWrapper = view.nodes[0].childNodes;
          // 1 template + 2 copies.
          expect(childNodesOfWrapper.length).toBe(3);
          expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
          expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
          async.done();
        });
      }));

      it('should support template directives via `template` attribute.', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<div><copy-me template="some-viewport: var greeting=some-tmpl">{{greeting}}</copy-me></div>',
          directives: [SomeViewport]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          cd.detectChanges();

          var childNodesOfWrapper = view.nodes[0].childNodes;
          // 1 template + 2 copies.
          expect(childNodesOfWrapper.length).toBe(3);
          expect(childNodesOfWrapper[1].childNodes[0].nodeValue).toEqual('hello');
          expect(childNodesOfWrapper[2].childNodes[0].nodeValue).toEqual('again');
          async.done();
        });
      }));

      it('should assign the component instance to a var-', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<p><child-cmp var-alice></child-cmp></p>',
          directives: [ChildComp]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          expect(view.contextWithLocals).not.toBe(null);
          expect(view.contextWithLocals.get('alice')).toBeAnInstanceOf(ChildComp);

          async.done();
        })
      }));

      it('should assign two component instances each with a var-', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<p><child-cmp var-alice></child-cmp><child-cmp var-bob></p>',
          directives: [ChildComp]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          expect(view.contextWithLocals).not.toBe(null);
          expect(view.contextWithLocals.get('alice')).toBeAnInstanceOf(ChildComp);
          expect(view.contextWithLocals.get('bob')).toBeAnInstanceOf(ChildComp);
          expect(view.contextWithLocals.get('alice')).not.toBe(view.contextWithLocals.get('bob'));

          async.done();
        })
      }));

      it('should assign the component instance to a var- with shorthand syntax', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<child-cmp #alice></child-cmp>',
          directives: [ChildComp]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          expect(view.contextWithLocals).not.toBe(null);
          expect(view.contextWithLocals.get('alice')).toBeAnInstanceOf(ChildComp);

          async.done();
        })
      }));

      it('should assign the element instance to a user-defined variable', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp,
          new Template({inline: '<p><div var-alice><i>Hello</i></div></p>'}));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          expect(view.contextWithLocals).not.toBe(null);

          var value = view.contextWithLocals.get('alice');
          expect(value).not.toBe(null);
          expect(value.tagName.toLowerCase()).toEqual('div');

          async.done();
        })
      }));

      it('should provide binding configuration config to the component', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<push-cmp #cmp></push-cmp>',
          directives: [[[PushBasedComp]]]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          var cmp = view.contextWithLocals.get('cmp');

          cd.detectChanges();
          expect(cmp.numberOfChecks).toEqual(1);

          cd.detectChanges();
          expect(cmp.numberOfChecks).toEqual(1);

          cmp.propagate();

          cd.detectChanges();
          expect(cmp.numberOfChecks).toEqual(2);
          async.done();
        })
      }));

      it('should create a component that injects a @Parent', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<some-directive><cmp-with-parent #child></cmp-with-parent></some-directive>',
          directives: [SomeDirective, CompWithParent]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          var childComponent = view.contextWithLocals.get('child');
          expect(childComponent.myParent).toBeAnInstanceOf(SomeDirective);

          async.done();
        })
      }));

      it('should create a component that injects an @Ancestor', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: `
            <some-directive>
              <p>
                <cmp-with-ancestor #child></cmp-with-ancestor>
              </p>
            </some-directive>`,
          directives: [SomeDirective, CompWithAncestor]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          var childComponent = view.contextWithLocals.get('child');
          expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);

          async.done();
        })
      }));

      it('should create a component that injects an @Ancestor through viewport directive', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: `
            <some-directive>
              <p *if="true">
                <cmp-with-ancestor #child></cmp-with-ancestor>
              </p>
            </some-directive>`,
          directives: [SomeDirective, CompWithAncestor, If]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);
          cd.detectChanges();

          var subview = view.viewContainers[0].get(0);
          var childComponent = subview.contextWithLocals.get('child');
          expect(childComponent.myAncestor).toBeAnInstanceOf(SomeDirective);

          async.done();
        });
      }));

      it('should support events', inject([AsyncTestCompleter], (async) => {
        tplResolver.setTemplate(MyComp, new Template({
          inline: '<div emitter listener></div>',
          directives: [DecoratorEmitingEvent, DecoratorListeningEvent]
        }));

        compiler.compile(MyComp).then((pv) => {
          createView(pv);

          var injector = view.elementInjectors[0];

          var emitter = injector.get(DecoratorEmitingEvent);
          var listener = injector.get(DecoratorListeningEvent);

          expect(emitter.msg).toEqual('');
          expect(listener.msg).toEqual('');

          emitter.fireEvent('fired !');
          expect(emitter.msg).toEqual('fired !');
          expect(listener.msg).toEqual('fired !');

          async.done();
        });
      }));

    });

    if (assertionsEnabled()) {

      function expectCompileError(inlineTpl, errMessage, done) {
        tplResolver.setTemplate(MyComp, new Template({inline: inlineTpl}));
        PromiseWrapper.then(compiler.compile(MyComp),
          (value) => {
            throw new BaseException("Test failure: should not have come here as an exception was expected");
          },
          (err) => {
            expect(err.message).toEqual(errMessage);
            done();
          }
        );
      }

      it('should raise an error if no directive is registered for an unsupported DOM property', inject([AsyncTestCompleter], (async) => {
        expectCompileError(
          '<div [some-prop]="foo"></div>',
          'Missing directive to handle \'some-prop\' in MyComp: <div [some-prop]="foo">',
          () => async.done()
        );
      }));

      it('should raise an error if no directive is registered for a template with template bindings', inject([AsyncTestCompleter], (async) => {
        expectCompileError(
          '<div><div template="if: foo"></div></div>',
          'Missing directive to handle \'if\' in <div template="if: foo">',
          () => async.done()
        );
      }));

      it('should raise an error for missing template directive (1)', inject([AsyncTestCompleter], (async) => {
        expectCompileError(
          '<div><template foo></template></div>',
          'Missing directive to handle: <template foo>',
          () => async.done()
        );
      }));

      it('should raise an error for missing template directive (2)', inject([AsyncTestCompleter], (async) => {
        expectCompileError(
          '<div><template *if="condition"></template></div>',
          'Missing directive to handle: <template *if="condition">',
          () => async.done()
        );
      }));

      it('should raise an error for missing template directive (3)', inject([AsyncTestCompleter], (async) => {
        expectCompileError(
          '<div *if="condition"></div>',
          'Missing directive to handle \'if\' in MyComp: <div *if="condition">',
          () => async.done()
        );
      }));
    }
  });
}

@Decorator({
  selector: '[my-dir]',
  bind: {'dirProp':'elprop'}
})
class MyDir {
  dirProp:string;
  constructor() {
    this.dirProp = '';
  }
}

@Component({selector: 'push-cmp'})
@Template({inline: '{{field}}'})
class PushBasedComp {
  numberOfChecks:number;
  bpc:BindingPropagationConfig;

  constructor(bpc:BindingPropagationConfig) {
    this.numberOfChecks = 0;
    this.bpc = bpc;
    bpc.shouldBePropagated();
  }

  get field(){
    this.numberOfChecks++;
    return "fixed";
  }

  propagate() {
    this.bpc.shouldBePropagatedFromRoot();
  }
}

@Component()
class MyComp {
  ctxProp:string;
  ctxNumProp;
  ctxBoolProp;
  constructor() {
    this.ctxProp = 'initial value';
    this.ctxNumProp = 0;
    this.ctxBoolProp = false;
  }
}


@Component({
  selector: 'component-with-pipes',
  bind: {
    "prop": "prop | double"
  }
})
@Template({
  inline: ''
})
class ComponentWithPipes {
  prop:string;
}

@Component({
  selector: 'child-cmp',
  services: [MyService]
})
@Template({
  directives: [MyDir],
  inline: '{{ctxProp}}'
})
class ChildComp {
  ctxProp:string;
  dirProp:string;
  constructor(service: MyService) {
    this.ctxProp = service.greeting;
    this.dirProp = null;
  }
}

@Decorator({
  selector: 'some-directive'
})
class SomeDirective { }

@Component({
  selector: 'cmp-with-parent'
})
@Template({
  inline: '<p>Component with an injected parent</p>',
  directives: [SomeDirective]
})
class CompWithParent {
  myParent: SomeDirective;
  constructor(@Parent() someComp: SomeDirective) {
    this.myParent = someComp;
  }
}

@Component({
  selector: 'cmp-with-ancestor'
})
@Template({
  inline: '<p>Component with an injected ancestor</p>',
  directives: [SomeDirective]
})
class CompWithAncestor {
  myAncestor: SomeDirective;
  constructor(@Ancestor() someComp: SomeDirective) {
    this.myAncestor = someComp;
  }
}

@Component({
  selector: '[child-cmp2]',
  services: [MyService]
})
class ChildComp2 {
  ctxProp:string;
  dirProp:string;
  constructor(service: MyService) {
    this.ctxProp = service.greeting;
    this.dirProp = null;
  }
}

@Viewport({
  selector: '[some-viewport]'
})
class SomeViewport {
  constructor(container: ViewContainer) {
    container.create().setLocal('some-tmpl', 'hello');
    container.create().setLocal('some-tmpl', 'again');
  }
}

class MyService {
  greeting:string;
  constructor() {
    this.greeting = 'hello';
  }
}

class DoublePipe extends Pipe {
  supports(obj) {
    return true;
  }

  transform(value) {
    return `${value}${value}`;
  }
}

class DoublePipeFactory {
  supports(obj) {
    return true;
  }

  create() {
    return new DoublePipe();
  }
}

@Decorator({
  selector: '[emitter]',
  events: {'event': 'onEvent($event)'}
})
class DecoratorEmitingEvent {
  msg: string;
  emitter;

  constructor(@EventEmitter('event') emitter:Function) {
    this.msg = '';
    this.emitter = emitter;
  }

  fireEvent(msg: string) {
    this.emitter(msg);
  }

  onEvent(msg: string) {
    this.msg = msg;
  }
}

@Decorator({
  selector: '[listener]',
  events: {'event': 'onEvent($event)'}
})
class DecoratorListeningEvent {
  msg: string;

  constructor() {
    this.msg = '';
  }

  onEvent(msg: string) {
    this.msg = msg;
  }
}

@Component({
  selector: '[id]',
  bind: {'id': 'id'}
})
@Template({
  inline: '<div>Matched on id with {{id}}</div>'
})
class IdComponent {
  id: string;
}
