const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

async function createOrder(req, res) {
    try {
      const {
        shipment_range,
        pickup_loc,
        pickup_city,
        delivery_loc,
        delivery_city,
        width,
        height,
        weight,
        quantity,
        shipment_info,
        shipment_note,
        pickup_date,
        delivery_date
      } = req.body;
      console.log('Request Body:', req.body);
  
      const customer = req.user.userId; // Assuming you have the user ID from the auth middleware
  
      // بيانات الإحداثيات (الدار البيضاء إلى الرباط على سبيل المثال)
      const dataq = {
        origin: { lat: 33.5731, lng: -7.5898 }, // الدار البيضاء
        destination: { lat: 34.0209, lng: -6.8416 } // الرباط
      };
  
      const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${dataq.origin.lat},${dataq.origin.lng}&destinations=${dataq.destination.lat},${dataq.destination.lng}&key=${GOOGLE_API_KEY}`;
      const response = await axios.get(url);
      const data = response.data;
  
      if (
        data.rows &&
        data.rows.length > 0 &&
        data.rows[0].elements &&
        data.rows[0].elements.length > 0
      ) {
        const element = data.rows[0].elements[0];
  
        if (element.status === 'OK') {
          const distanceText = element.distance.text;
          const durationText = element.duration.text;
          const distanceKm = parseFloat(distanceText.split(' ')[0]);
          const distanceRounded = Math.round(distanceKm);
  
          const pricePerKm = 7;
          const PricePerKg = 2.5;
          const price = (pricePerKm * distanceRounded) + (PricePerKg * weight * quantity);
          console.log('Request Body:', req.body);
          const newOrder = await prisma.order.create({
            data: {
              customer: {  // هنا قم باستخدام الكائن Customer و ليس فقط ID
                connect: {  // لاستخدام الربط بين الجداول
                    id: req.user.userId // ID المستخدم
                }
              },
              shipment_range: "Intercity",
              pickup_loc: "Avenue Hassan II, Casablanca",
              delivery_loc: "Boulevard Mohammed V, Rabat",
              width: 1.2,
              height: 0.8,
              weight: 25.5,
              quantity: 10,
              shipment_info: "Electronics equipment - fragile",
              shipment_note: "Handle with care",
              price: 1260.5,
              pickup_date: new Date("2025-04-12T09:00:00.000Z"),
              delivery_date: new Date("2025-04-13T18:00:00.000Z"),
            },
            include: {
              truck: true,
              tracking: true,
              payment: true,
              customer: true,  // تضمين customer لتأكيد البيانات
            }
          });
          
  
          return res.status(201).json({
            message: 'Order created successfully',
            order: newOrder,
            distance: {
              text: distanceText,
              km: distanceKm,
              rounded: distanceRounded,
              duration: durationText
            },
            price: price
          });
        } else {
          return res.status(400).json({ error: 'No distance found' });
        }
      } else {
        return res.status(400).json({ error: 'Invalid response from Google API', details: data });
      }
  
    } catch (error) {
      console.error('Error in createOrder:', error); // Log the full error to debug
      if (error instanceof PrismaClientValidationError) {
        return res.status(400).json({
          message: 'Prisma Validation Error',
          details: error.message
        });
      } else {
        return res.status(500).json({ message: 'Internal Server Error', details: error.message });
      }
    }
  }
  

    module.exports = {
        createOrder
    };