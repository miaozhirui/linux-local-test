import {
  afterEach,
  AsyncTestCompleter,
  beforeEach,
  ddescribe,
  describe,
  dispatchEvent,
  el,
  expect,
  iit,
  inject,
  it,
  queryView,
  xit,
  IS_NODEJS
} from 'angular2/test_lib';

import {Lexer, Parser, ChangeDetector, dynamicChangeDetection} from 'angular2/change_detection';
import {Compiler, CompilerCache} from 'angular2/src/core/compiler/compiler';
import {DirectiveMetadataReader} from 'angular2/src/core/compiler/directive_metadata_reader';
import {NativeShadowDomStrategy} from 'angular2/src/core/compiler/shadow_dom_strategy';
import {TemplateLoader} from 'angular2/src/core/compiler/template_loader';
import {ComponentUrlMapper} from 'angular2/src/core/compiler/component_url_mapper';
import {UrlResolver} from 'angular2/src/core/compiler/url_resolver';
import {StyleUrlResolver} from 'angular2/src/core/compiler/style_url_resolver';
import {CssProcessor} from 'angular2/src/core/compiler/css_processor';

import {MockTemplateResolver} from 'angular2/src/mock/template_resolver_mock';

import {Injector} from 'angular2/di';

import {Component, Decorator, Template} from 'angular2/core';
import {ControlGroupDirective, ControlDirective, Control, ControlGroup, OptionalControl,
  ControlValueAccessor, RequiredValidatorDirective} from 'angular2/forms';

import * as validators from 'angular2/src/forms/validators';

export function main() {
  function detectChanges(view) {
    view.changeDetector.detectChanges();
  }

  function compile(componentType, template, context, callback) {
    var tplResolver = new MockTemplateResolver();
    var urlResolver = new UrlResolver();

    var compiler = new Compiler(dynamicChangeDetection,
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

    tplResolver.setTemplate(componentType, new Template({
      inline: template,
      directives: [ControlGroupDirective, ControlDirective, WrappedValue, RequiredValidatorDirective]
    }));

    compiler.compile(componentType).then((pv) => {
      var view = pv.instantiate(null, null);
      view.hydrate(new Injector([]), null, context);
      detectChanges(view);
      callback(view);
    });
  }

  describe("integration tests", () => {
    it("should initialize DOM elements with the given form object", inject([AsyncTestCompleter], (async) => {
      var ctx = new MyComp(new ControlGroup({
        "login": new Control("loginValue")
      }));

      var t = `<div [control-group]="form">
                <input type="text" control="login">
              </div>`;

      compile(MyComp, t, ctx, (view) => {
        var input = queryView(view, "input")
        expect(input.value).toEqual("loginValue");
        async.done();
      });
    }));

    if (!IS_NODEJS) {
      it("should update the control group values on DOM change", inject([AsyncTestCompleter], (async) => {
        var form = new ControlGroup({
          "login": new Control("oldValue")
        });
        var ctx = new MyComp(form);

        var t = `<div [control-group]="form">
                  <input type="text" control="login">
                </div>`;

        compile(MyComp, t, ctx, (view) => {
          var input = queryView(view, "input")

          input.value = "updatedValue";
          dispatchEvent(input, "change");

          expect(form.value).toEqual({"login": "updatedValue"});
          async.done();
        });
      }));
    }

    it("should update DOM elements when rebinding the control group", inject([AsyncTestCompleter], (async) => {
      var form = new ControlGroup({
        "login": new Control("oldValue")
      });
      var ctx = new MyComp(form);

      var t = `<div [control-group]="form">
                <input type="text" control="login">
              </div>`;

      compile(MyComp, t, ctx, (view) => {
        ctx.form = new ControlGroup({
          "login": new Control("newValue")
        });
        detectChanges(view);

        var input = queryView(view, "input")
        expect(input.value).toEqual("newValue");
        async.done();
      });
    }));

    it("should update DOM element when rebinding the control name", inject([AsyncTestCompleter], (async) => {
      var ctx = new MyComp(new ControlGroup({
        "one": new Control("one"),
        "two": new Control("two")
      }), "one");

      var t = `<div [control-group]="form">
                <input type="text" [control]="name">
              </div>`;

      compile(MyComp, t, ctx, (view) => {
        var input = queryView(view, "input")
        expect(input.value).toEqual("one");

        ctx.name = "two";
        detectChanges(view);

        expect(input.value).toEqual("two");
        async.done();
      });
    }));

    if (!IS_NODEJS) {
      describe("different control types", () => {
        it("should support type=checkbox", inject([AsyncTestCompleter], (async) => {
          var ctx = new MyComp(new ControlGroup({"checkbox": new Control(true)}));

          var t = `<div [control-group]="form">
                    <input type="checkbox" control="checkbox">
                  </div>`;

          compile(MyComp, t, ctx, (view) => {
            var input = queryView(view, "input")
            expect(input.checked).toBe(true);

            input.checked = false;
            dispatchEvent(input, "change");

            expect(ctx.form.value).toEqual({"checkbox" : false});
            async.done();
          });
        }));

        it("should support custom value accessors", inject([AsyncTestCompleter], (async) => {
          var ctx = new MyComp(new ControlGroup({"name": new Control("aa")}));

          var t = `<div [control-group]="form">
                    <input type="text" control="name" wrapped-value>
                  </div>`;

          compile(MyComp, t, ctx, (view) => {
            var input = queryView(view, "input")
            expect(input.value).toEqual("!aa!");

            input.value = "!bb!";
            dispatchEvent(input, "change");

            expect(ctx.form.value).toEqual({"name" : "bb"});
            async.done();
          });
        }));
      });

      describe("validations", () => {
        it("should use validators defined in html", inject([AsyncTestCompleter], (async) => {
          var form = new ControlGroup({"login": new Control("aa")});
          var ctx = new MyComp(form);

          var t = `<div [control-group]="form">
                    <input type="text" control="login" required>
                   </div>`;

          compile(MyComp, t, ctx, (view) => {
            expect(form.valid).toEqual(true);

            var input = queryView(view, "input");

            input.value = "";
            dispatchEvent(input, "change");

            expect(form.valid).toEqual(false);
            async.done();
          });
        }));

        it("should use validators defined in the model", inject([AsyncTestCompleter], (async) => {
          var form = new ControlGroup({"login": new Control("aa", validators.required)});
          var ctx = new MyComp(form);

          var t = `<div [control-group]="form">
                    <input type="text" control="login">
                   </div>`;

          compile(MyComp, t, ctx, (view) => {
            expect(form.valid).toEqual(true);

            var input = queryView(view, "input");

            input.value = "";
            dispatchEvent(input, "change");

            expect(form.valid).toEqual(false);
            async.done();
          });
        }));
      });
    }

    describe("nested forms", () => {
      it("should init DOM with the given form object",inject([AsyncTestCompleter], (async) => {
        var form = new ControlGroup({
          "nested": new ControlGroup({
            "login": new Control("value")
          })
        });
        var ctx = new MyComp(form);

        var t = `<div [control-group]="form">
                    <div control-group="nested">
                      <input type="text" control="login">
                    </div>
                </div>`;

        compile(MyComp, t, ctx, (view) => {
          var input = queryView(view, "input")
          expect(input.value).toEqual("value");
          async.done();
        });
      }));

      if (!IS_NODEJS) {
        it("should update the control group values on DOM change", inject([AsyncTestCompleter], (async) => {
          var form = new ControlGroup({
            "nested": new ControlGroup({
              "login": new Control("value")
            })
          });
          var ctx = new MyComp(form);

          var t = `<div [control-group]="form">
                      <div control-group="nested">
                        <input type="text" control="login">
                      </div>
                  </div>`;

          compile(MyComp, t, ctx, (view) => {
            var input = queryView(view, "input")

            input.value = "updatedValue";
            dispatchEvent(input, "change");

            expect(form.value).toEqual({"nested" : {"login" : "updatedValue"}});
            async.done();
          });
        }));
      }
    });
  });
}

@Component({
  selector: "my-comp"
})
class MyComp {
  form:ControlGroup;
  name:string;

  constructor(form = null, name = null) {
    this.form = form;
    this.name = name;
  }
}

class WrappedValueAccessor extends ControlValueAccessor {
  readValue(el){
    return el.value.substring(1, el.value.length - 1);
  }

  writeValue(el, value):void {
    el.value = `!${value}!`;
  }
}

@Decorator({
  selector:'[wrapped-value]'
})
class WrappedValue {
  constructor(cd:ControlDirective) {
    cd.valueAccessor = new WrappedValueAccessor();
  }
}
