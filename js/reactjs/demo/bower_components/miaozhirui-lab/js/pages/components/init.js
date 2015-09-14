define(function(require){
    require('ko');


    ko.components.register('my-component', {
        viewModel: function(params) {
            function View(item) {
                this.name = ko.observable(item.name);
                this.age = ko.observable(item.age);
                this.hight = ko.observable(item.hight);
            }

            this.data = _.map(params, function(item) {
                return new View(item);
            })
        },
        template: '<div data-bind="foreach: data">\
                            <div>\
                            <span data-bind="text: name"></span>\
                            <span data-bind="style: {color: age() > 20 ? &quot;red &quot;: &quot blue &quot }">111</span>\
                            <span data-bind="text: hight"></span>\
                            </div>\
                         </div>'
    });

    $.ajax('/js/ajax/components.json', {
        dateType: 'json',
        success: function(data) {
            var string = JSON.stringify({component: data})
            
            $('#component').attr("data-bind", string);
            ko.applyBindings()
        },
        error: function(XML){
            console.log(XML)
        }
    })
    // ko.applyBindings()
})