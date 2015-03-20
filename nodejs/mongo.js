
 var mongodb = require("mongodb") ;
 bson = require('bson');
   var server = new mongodb.Server("localhost",27017,{
       auto_reconnect : true
   }) ;
   var conn = new mongodb.Db("db",server,{
       safe : true
   }) ;
   conn.open(function(error,db){
       if(error) throw error ;
      db.collection("users",{
          safe : true
      },function(err,collection){
          if(err) throw err ;
          collection.find().toArray(function(e,docs){
              if(e) throw e ;
              console.log(docs) ;
          }) ;
      }) ;
 }) ;
 console.log(1)
