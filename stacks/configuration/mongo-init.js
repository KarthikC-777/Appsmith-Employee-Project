let error = false
print("**** Going to start Mongo seed ****")

var admin = db.getSiblingDB("admin")
admin.auth("appsmith", "58nlo3Z5sJwQP")

let res = [
    db.createUser(
        {
            user: "appsmith",
            pwd: "58nlo3Z5sJwQP",
            roles: [{
                role: "root",
                db: "admin"
            }, "readWrite"]
        }
    )
]

printjson(res)

if (error) {
  print('Error occurred while inserting the records')
}
