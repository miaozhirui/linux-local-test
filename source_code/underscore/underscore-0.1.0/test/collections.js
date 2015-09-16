$(document).ready(function() {
  
  module("Collection functions (each, any, select, and so on...)");
    
  test("collections: each", function() {
    _.each([1, 2, 3], function(num, i) {
      equals(num, i + 1, 'each iterators provide value and iteration count');
    });
    
    var answer = null;
    _.each([1, 2, 3], function(num){ if ((answer = num) == 2) throw '__break__'; });
    equals(answer, 2, 'the loop broke in the middle');
    
    var answers = [];
    _.each([1, 2, 3], function(num) { answers.push(num * this.multiplier);}, {multiplier : 5});
    equals(answers.join(', '), '5, 10, 15', 'context object property accessed');
  });
  
  test('collections: map', function() {
    var doubled = _.map([1, 2, 3], function(num){ return num * 2; });
    equals(doubled.join(', '), '2, 4, 6', 'doubled numbers');
    
    var tripled = _.map([1, 2, 3], function(num){ return num * this.multiplier; }, {multiplier : 3});
    equals(tripled.join(', '), '3, 6, 9', 'tripled numbers with context');
  });
  
  test('collections: inject', function() {
    var sum = _.inject([1,2,3], 0, function(sum, num){ return sum + num; });
    equals(sum, 6, 'can sum up an array');
  });
  
  test('collections: detect', function() {
    var result = _.detect([1, 2, 3], function(num){ return num * 2 == 4; });
    equals(result, 2, 'found the first "2" and broke the loop');
  });
  
  test('collections: select', function() {
    var evens = _.select([1,2,3,4,5,6], function(num){ return num % 2 == 0; });
    equals(evens.join(', '), '2, 4, 6', 'selected each even number');
  });
  
  test('collections: reject', function() {
    var odds = _.reject([1,2,3,4,5,6], function(num){ return num % 2 == 0; });
    equals(odds.join(', '), '1, 3, 5', 'rejected each even number');
  });
  
  test('collections: all', function() {
    ok(_.all([]), 'the empty set');
    ok(_.all([true, true, true]), 'all true values');
    ok(!_.all([true, false, true]), 'one false value');
    ok(_.all([0, 10, 28], function(num){ return num % 2 == 0; }), 'even numbers');
    ok(!_.all([0, 11, 28], function(num){ return num % 2 == 0; }), 'an odd number');
  });
  
  test('collections: any', function() {
    ok(!_.any([]), 'the empty set');
    ok(!_.any([false, false, false]), 'all false values');
    ok(_.any([false, false, true]), 'one true value');
    ok(!_.any([1, 11, 29], function(num){ return num % 2 == 0; }), 'all odd numbers');
    ok(_.any([1, 10, 29], function(num){ return num % 2 == 0; }), 'an even number');
  });
  
  test('collections: include', function() {
    ok(_.include([1,2,3], 2), 'two is in the array');
    ok(!_.include([1,3,9], 2), 'two is not in the array');
    ok(_.include({moe:1, larry:3, curly:9}, 3), '_.include on objects checks their values');
  });
  
  test('collections: invoke', function() {
    var list = [[5, 1, 7], [3, 2, 1]];
    var result = _.invoke(list, 'sort');
    equals(result[0].join(', '), '1, 5, 7', 'first array sorted');
    equals(result[1].join(', '), '1, 2, 3', 'second array sorted');
  });
  
  test('collections: pluck', function() {
    var people = [{name : 'moe', age : 30}, {name : 'curly', age : 50}];
    equals(_.pluck(people, 'name').join(', '), 'moe, curly', 'pulls names out of objects');
  });
  
  test('collections: max', function() {
    equals(3, _.max([1, 2, 3]), 'can perform a regular Math.max');
    
    var neg = _.max([1, 2, 3], function(num){ return -num; });
    equals(neg, 1, 'can perform a computation-based max');
  });
  
  test('collections: min', function() {
    equals(1, _.min([1, 2, 3]), 'can perform a regular Math.min');
    
    var neg = _.min([1, 2, 3], function(num){ return -num; });
    equals(neg, 3, 'can perform a computation-based min');
  });
  
  test('collections: sortBy', function() {
    var people = [{name : 'curly', age : 50}, {name : 'moe', age : 30}];
    people = _.sortBy(people, function(person){ return person.age; });
    equals(_.pluck(people, 'name').join(', '), 'moe, curly', 'stooges sorted by age');
  });
  
  test('collections: sortedIndex', function() {
    var numbers = [10, 20, 30, 40, 50], num = 35;
    var index = _.sortedIndex(numbers, num);
    equals(index, 3, '35 should be inserted at index 3');
  });
  
  test('collections: toArray', function() {
    ok(!_.isArray(arguments), 'arguments object is not an array');
    ok(_.isArray(_.toArray(arguments)), 'arguments object converted into array');
    
    var numbers = _.toArray({one : 1, two : 2, three : 3});
    equals(_.pluck(numbers, '0').join(', '), 'one, two, three', 'object flattened into array');
  });
  
  test('collections: size', function() {
    equals(_.size({one : 1, two : 2, three : 3}), 3, 'can compute the size of an object');
  });
  
});
