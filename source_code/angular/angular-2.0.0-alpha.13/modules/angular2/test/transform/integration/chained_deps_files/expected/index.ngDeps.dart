library web_foo;

import 'package:angular2/src/core/application.dart';
import 'package:angular2/src/reflection/reflection_capabilities.dart';
import 'bar.dart';
import 'a:web/bar.ngDeps.dart' as i0;

bool _visited = false;
void setupReflection(reflector) {
  if (_visited) return;
  _visited = true;
  i0.setupReflection(reflector);
}
