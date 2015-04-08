<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <script type="text/javascript">
    var miao = {},event = {}
    miao.on = function(name, callback) {
        event[name] || (event[name]=[]);

        event[name].push(callback);
    }
    miao.off = function(name, callback) {
        if(!(name || callback)) {
            event = {}
        }

        var list = event[name];
        if(list){
            if(callback) {
                for(var i=0; i<list.length ; i++) {
                    if(list[i]==callback) {
                        list.splice(i,1);
                    }
                }
            } else {
                delete event[name];
            }
        }
    }
    miao.emit = function(name, data) {
        var list = event[name] ||[];

        list = list.slice();//copy list prevent modified
        if(list) {
            while((fn=list.shift())) {
               
                fn.apply(null,  [].slice.call(arguments,1))
            }
        } 

    }

    miao.on('add', function(data) {
        console.log(data)
    })
    miao.on('add', function(data) {
    console.log('add')
    })
    miao.on('delete', function() {
        console.log('delete')
    })
    miao.off('delete')
    miao.emit('add',{name: 'miaozhirui'})
    miao.emit('delete',{name: 'miaozhirui'})
    </script>
</head>
<body>
    
</body>
</html>