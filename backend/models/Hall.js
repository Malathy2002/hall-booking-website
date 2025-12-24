const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Hall = sequelize.define('Hall', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    state: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    pincode: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    location: {
      type: DataTypes.GEOMETRY('POINT'),
      allowNull: true
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minGuests: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    maxGuests: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    perHeadPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    eventTypes: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    amenities: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    rating: {
      type: DataTypes.DECIMAL(3, 2),
      defaultValue: 0
    },
    totalReviews: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'halls',
    timestamps: true,
    indexes: [
      {
        name: 'idx_city',
        fields: ['city']
      },
      {
        name: 'idx_price',
        fields: ['price']
      },
      {
        name: 'idx_capacity',
        fields: ['capacity']
      },
      {
        name: 'idx_location',
        fields: ['city', 'state']
      }
    ]
  });

  return Hall;
};