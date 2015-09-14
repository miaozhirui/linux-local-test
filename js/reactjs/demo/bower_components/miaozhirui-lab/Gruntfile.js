// 'use strict';

module.exports = function(grunt){//grunt的基本框架
require('time-grunt')(grunt);//记录每个任务执行的时间

require('load-grunt-tasks')(grunt);//将package.json里面的文件依赖的模块全部加载进来

var config = {
   app: '',
   dist: 'release/'
}

grunt.initConfig({
    config: config,
    watch: {
        scripts: {
            files: {
                src: ['<%= config.src%>js/**/*','<%= config.src%>css/**/*']            
            },
            tasks:['cssmin']
        }
    },
    // 方式1：这种方式太麻烦，可以采用第二种的方式
    // copy: {
    //     dist_css: {
    //         src: '<%= config.app %>css/index.css',//源文件
    //         dest: '<%= config.dist %>css/index.css'//目标文件
    //     },
    //     dist_js: {
    //         src: '<%= config.app %>js/boot.js',
    //         dest: '<%= config.dist %>js/boot.js'
    //     }
    // },
    //
     
    //方式2:(这种方式也比较烦,可以用第三种)
    // copy: {
    //     dist_css: {
    //         files: [
    //             {
    //                 expand: true,//如果为真的话，会把源文件的路径也加上
    //                 // cwd:'<%= config%>'//文件所放的默认的位置
    //                  src: '<%= config.app %>css/*.css',
    //                  dest: '<%= config.dist %>',
    //                  ext: '.min.css',//是否修改目标文件的后缀名(如上默认的就是css)
    //                  // extDot: 'first' //从哪个地方开始修改我们的目标文件,                         first规定文件名的第一个点后面都作为后缀,last规定文件名的最后一个点后面作为后缀
    //                  // flatten: true,//为true的时候，会将中间各层目录全部都去掉,
    //                  // rename: function(dest, src) {//
    //                  //    return dest + 'js/' + src;
    //                  // }//这个函数后在ext和flatten调用之后执行
    //             },
    //             {
    //                 expand: true,
    //                 src: '<%= config.app%>css/link.json',
    //                 dest: '<%= config.dist%>'
    //             },
    //             {
    //                 expand: true,
    //                 src: '<%= config.app %>js/**/*.js',
    //                 dest: '<%= config.dist %>',
    //                 ext: '.min.js',
    //                 extDot: 'last'
    //                 // flatten: true,
    //             }
    //         ]
    //     }
    // },
    copy: {
        copy_files: {
            files: [
                {
                    expand: true,
                    src: '<%= config.app %>css/**/*.json',
                    dest: '<%= config.dist %>'
                },
                {
                    expand: true,
                    src: '<%= config.app %>img/**/*',
                    dest: '<%= config.dist %>'
                }
            ]
        }
    },

    //方式3(这种方式是不支持额外参数的)
    // copy: {
    //     dist_html: {
    //         files: {//建值对的形式key是目标文件,value是源文件
    //             '<%= config.dist %>css/index.css': '<%= config.app %>css/index.css',
    //             '<%= config.dist %>js/boot.js': ['<%= config.app %>js/boot.js']
    //         }
    //     }
    // },

    clean: {
        target: {
            //**表示所有的文件和目录; 表示所有的文件*
            //{a,b}.js表示a.js或b.js; !a.js表示取反的意思
            src: ['<%= config.dist %>'],//支持数组的格式
            // filter: 'isFile'//过滤条件,表示删除的都是文件
            //以下都是可选参数
            // filter: function(filepath) {
            //     return !grunt.file.isDir(filepath)
            // },
            // dot: true, //也会选中以点为开头的文件
        }
    },

    uglify: {
        my_target: {
            files: [
                {
                    expand: true,
                    src: '<%= config.app %>js/**/*.js',
                    dest: '<%= config.dist%>',
                    // ext: '.min.js',
                    // extDot: 'last',
                }
            ]
        }
    },

    watch: {
        scripts:{
            files: ['js/**/*.js', 'css/**/*.css'],
            tasks: ['default'],
            // options: {
            //     reload: true
            //    }
        }
    },

    cssmin: {
        my_target: {
            files: [
                {
                    expand: true,
                    src: '<%= config.app %>css/*.css',
                    dest: '<%= config.dist %>'
                }
            ]
        }
    }
})


grunt.registerTask('default', ['copy', 'uglify', 'cssmin']);

}
