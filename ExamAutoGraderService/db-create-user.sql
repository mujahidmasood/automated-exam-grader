

use exam-autograder-db
db.createUser( { user: "thesis_user",
                 pwd: "1234_user_thesis",
                 roles: [ { role: "clusterAdmin", db: "admin" },
                          { role: "readAnyDatabase", db: "admin" },
                          "readWrite"] },
               { w: "majority" , wtimeout: 5000 } );