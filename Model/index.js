const dbConfig = require("../Config/dbConfig");
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  operatorsAliases: false,
  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle,
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log("CONNECTED!!");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./userModel.js")(sequelize, DataTypes);
db.blog = require("./blogModel.js")(sequelize, DataTypes);
db.comment = require("./commentModel.js" )(sequelize, DataTypes);

//relation between tables users and blogs
db.user.hasMany(db.blog, { onDelete: 'CASCADE' });
db.blog.belongsTo(db.user);

//relation between tables users and comment
db.user.hasMany(db.comment, { onDelete: 'CASCADE' });
db.comment.belongsTo(db.user);

//relation between tables comment and blogs
db.blog.hasMany(db.comment, { onDelete: 'CASCADE' }) ;
db.comment.belongsTo(db.blog);

module.exports = db;