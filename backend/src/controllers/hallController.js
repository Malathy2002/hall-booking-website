const { Hall, Booking, User, Review } = require('../models');
const { Op } = require('sequelize');

/**
 * 🔍 Search Halls
 */
exports.searchHalls = async (req, res) => {
  try {
    const {
      location,
      guests,
      minPrice,
      maxPrice,
      eventType,
      date,
      page = 1,
      limit = 10
    } = req.query;

    const whereClause = {
      is_active: true,
      is_approved: true
    };

    /* 📍 Location filter */
    if (location) {
      whereClause[Op.or] = [
        { city: { [Op.like]: `%${location}%` } },
        { address: { [Op.like]: `%${location}%` } },
        { hall_name: { [Op.like]: `%${location}%` } }
      ];
    }

    /* 👥 Guest capacity */
    if (guests) {
      whereClause.capacity = { [Op.gte]: parseInt(guests) };
    }

    /* 💰 Price range */
    if (minPrice || maxPrice) {
      whereClause.price_per_day = {};
      if (minPrice) whereClause.price_per_day[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price_per_day[Op.lte] = parseFloat(maxPrice);
    }

    /* 🎉 Event type */
    if (eventType) {
      whereClause.event_types = {
        [Op.like]: `%${eventType}%`
      };
    }

    /* 📅 Date availability */
    if (date) {
      const bookedHalls = await Booking.findAll({
        where: {
          event_date: date,
          booking_status: { [Op.in]: ['confirmed', 'pending'] }
        },
        attributes: ['hall_id']
      });

      const bookedHallIds = bookedHalls.map(b => b.hall_id);
      if (bookedHallIds.length > 0) {
        whereClause.hall_id = { [Op.notIn]: bookedHallIds };
      }
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows } = await Hall.findAndCountAll({
      where: whereClause,
      limit: parseInt(limit),
      offset,
      order: [['rating', 'DESC'], ['created_at', 'DESC']]
    });

    res.json({
      success: true,
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows
    });

  } catch (error) {
    console.error('Search halls error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search halls'
    });
  }
};

/**
 * 🏛️ Get Single Hall Details
 */
exports.getHall = async (req, res) => {
  try {
    const { id } = req.params;

    const hall = await Hall.findByPk(id, {
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['user_id', 'name', 'phone', 'email']
        },
        {
          model: Review,
          as: 'reviews',
          attributes: ['rating', 'comment', 'created_at']
        }
      ]
    });

    if (!hall) {
      return res.status(404).json({
        success: false,
        message: 'Hall not found'
      });
    }

    res.json({
      success: true,
      data: hall
    });

  } catch (error) {
    console.error('Get hall error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hall'
    });
  }
};

/**
 * 🏗️ Create Hall (Agent only)
 */
exports.createHall = async (req, res) => {
  try {
    const agentId = req.user.id;

    const hall = await Hall.create({
      agent_id: agentId,
      hall_name: req.body.hall_name,
      location: req.body.location,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      capacity: req.body.capacity,
      price_per_day: req.body.price_per_day,
      description: req.body.description,
      facilities: req.body.facilities,
      is_active: true,
      is_approved: false
    });

    res.status(201).json({
      success: true,
      message: 'Hall created successfully',
      data: hall
    });

  } catch (error) {
    console.error('Create hall error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create hall'
    });
  }
};

/**
 * 📅 Check Hall Availability
 */
exports.checkAvailability = async (req, res) => {
  try {
    const { hall_id } = req.params;
    const { start_date, end_date } = req.query;

    const bookings = await Booking.findAll({
      where: {
        hall_id,
        event_date: {
          [Op.between]: [start_date, end_date]
        },
        booking_status: { [Op.in]: ['confirmed', 'pending'] }
      },
      attributes: ['event_date']
    });

    res.json({
      success: true,
      booked_dates: bookings.map(b => b.event_date),
      available: bookings.length === 0
    });

  } catch (error) {
    console.error('Availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check availability'
    });
  }
};
