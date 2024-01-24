// Use admin then create user root
var adminDB = db.getSiblingDB('admin');
adminDB.createUser({
  user: 'superuser',
  pwd: 'superuser',
  roles: [{ role: 'root', db: 'admin' }],
});

// Authenticate as the root user
adminDB.auth('superuser', 'superuser');

// Initialize the replica set
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'localhost:27017' }],
});
