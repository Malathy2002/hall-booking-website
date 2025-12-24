const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    eventType: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    eventDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    startTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: false
    },
    guestCount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    customerName: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    customerPhone: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    customerEmail: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    additionalCharges: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentMethod: {
      type: DataTypes.ENUM('online', 'cash', 'upi', 'card'),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.ENUM('pending', 'paid', 'refunded', 'failed'),
      defaultValue: 'pending'
    },
    bookingStatus: {
      type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
      defaultValue: 'pending'
    },
    transactionId: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancelledAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    hallId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'halls',
        key: 'id'
      }
    },
    ownerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    agentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'agents',
        key: 'id'
      }
    }
  }, {
    tableName: 'bookings',
    timestamps: true,
    indexes: [
      {
        name: 'idx_customer',
        fields: ['customerId']
      },
      {
        name: 'idx_hall',
        fields: ['hallId']
      },
      {
        name: 'idx_event_date',
        fields: ['eventDate']
      },
      {
        name: 'idx_status',
        fields: ['bookingStatus']
      }
    ]
  });

  return Booking;
};