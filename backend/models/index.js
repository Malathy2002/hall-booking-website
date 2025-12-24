const { sequelize } = require('../config/db');
const User = require('./User')(sequelize);
const Hall = require('./Hall')(sequelize);
const Booking = require('./Booking')(sequelize);
const Agent = require('./Agent')(sequelize);

// Define associations
User.hasMany(Hall, { foreignKey: 'ownerId', as: 'halls' });
Hall.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

User.hasMany(Booking, { foreignKey: 'customerId', as: 'customerBookings' });
User.hasMany(Booking, { foreignKey: 'ownerId', as: 'ownerBookings' });

Booking.belongsTo(User, { foreignKey: 'customerId', as: 'customer' });
Booking.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });
Booking.belongsTo(Hall, { foreignKey: 'hallId', as: 'hall' });

Agent.hasMany(Booking, { foreignKey: 'agentId', as: 'bookings' });
Booking.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });

module.exports = {
  sequelize,
  User,
  Hall,
  Booking,
  Agent
};