<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>bindingHandlers</title>
    <script type="text/javascript" src="../knockout-3.0.0.js"></script>
    <script type="text/javascript" src="../../jquery-1.8.3.js"></script>
</head>
<body>
    <div class="test1" data-bind="miao:name, param:{show:true, name:'miaozhirui'}"></div>
    <script type="text/javascript">
    var test1 = document.querySelector('.test1');
    ko.bindingHandlers.miao = {
        init: function(element, valueAccessor, allBingingsAccessor, viewModel) {
            console.log($(element))
            console.log(ko.utils.unwrapObservable(valueAccessor()));
            console.log(allBingingsAccessor());
            console.log(viewModel)
        }
    }

    var viewModel = {
        name: ko.observable('miaozhirui'),
        age: 21
    }
    ko.applyBindings(viewModel);
    </script>
</body>
</html>