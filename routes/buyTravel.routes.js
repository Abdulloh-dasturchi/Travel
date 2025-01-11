const express = require("express");
const { buyTravel,buyHotel,getAllBuyedTravels,getAllBuyedHotels} = require("../controllers/buyTravels.controller");
const { authenticate, adminAccess } = require("../middlewares/auth");
const router = express.Router();

// @desc    Travel sotib olish
// @router  POST /api/v1/auth/travel/buy
// @access  Private (faqat autentifikatsiyalangan foydalanuvchilar uchun)
router.post("/travel", authenticate, buyTravel);
router.post("/hotel", authenticate, buyHotel);
router.get("/travels", authenticate,adminAccess, getAllBuyedTravels);
router.get("/hotels", authenticate,adminAccess, getAllBuyedHotels);
/**
 * @swagger
 * tags:
 *   name: Travels
 *   description: Travel va hotel sotib olish bilan bog'liq operatsiyalar
 */

/**
 * @swagger
 * /buy/travel:
 *   post:
 *     summary: Travel sotib olish
 *     description: Foydalanuvchi sayohatni sotib olish uchun bu endpointdan foydalanadi.
 *     tags: [Travels]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travel_id:
 *                 type: string
 *                 description: Sayohatning ID si
 *                 example: 607d1b2f8f1b2c001f8b4b47
 *               people:
 *                 type: array
 *                 description: Odamlar ro'yxati
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: Odamning ismi
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: Odamning familiyasi
 *                       example: Doe
 *                     gender:
 *                       type: string
 *                       description: Odamning jinsi
 *                       example: male
 *                     familyPosition:
 *                       type: string
 *                       description: Odamning oiladagi o'rni
 *                       example: son
 *                     nationality:
 *                       type: string
 *                       description: Odamning millati
 *                       example: Uzbek
 *                     birthDate:
 *                       type: string
 *                       format: date
 *                       description: Odamning tug'ilgan sanasi
 *                       example: 1990-01-01
 *                     passport:
 *                       type: string
 *                       description: Odamning passport raqami
 *                       example: AB1234567
 *                     phoneNumber:
 *                       type: string
 *                       description: Odamning telefon raqami
 *                       example: +998901234567
 *                     email:
 *                       type: string
 *                       description: Odamning email manzili
 *                       example: john.doe@example.com
 *                     birthCountry:
 *                       type: string
 *                       description: Odamning tug'ilgan mamlakati
 *                       example: Uzbekistan
 *     responses:
 *       201:
 *         description: Sayohat muvaffaqiyatli sotib olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Travel booked successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: Foydalanuvchi IDsi
 *                       example: 60d6b72f5e838d001fbb74a4
 *                     travelId:
 *                       type: string
 *                       description: Sayohat IDsi
 *                       example: 607d1b2f8f1b2c001f8b4b47
 *                     people:
 *                       type: array
 *                       description: Odamlar ro'yxati
 *                       items:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             description: Odamning ismi
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             description: Odamning familiyasi
 *                             example: Doe
 *       400:
 *         description: Xato so'rov. "People" arrayi noto'g'ri yoki bo'sh.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: People array is required
 *       404:
 *         description: Sayohat yoki foydalanuvchi topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Travel not found
 */

/**
 * @swagger
 * /buy/hotel:
 *   post:
 *     summary: Hotel sotib olish
 *     description: Foydalanuvchi hotelni sotib olish uchun bu endpointdan foydalanadi.
 *     tags: [Travels]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *                 description: Hotelning ID si
 *                 example: 607d1b2f8f1b2c001f8b4b47
 *               people:
 *                 type: array
 *                 description: Odamlar ro'yxati
 *                 items:
 *                   type: object
 *                   properties:
 *                     firstName:
 *                       type: string
 *                       description: Odamning ismi
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       description: Odamning familiyasi
 *                       example: Doe
 *                     gender:
 *                       type: string
 *                       description: Odamning jinsi
 *                       example: male
 *                     familyPosition:
 *                       type: string
 *                       description: Odamning oiladagi o'rni
 *                       example: son
 *                     nationality:
 *                       type: string
 *                       description: Odamning millati
 *                       example: Uzbek
 *                     birthDate:
 *                       type: string
 *                       format: date
 *                       description: Odamning tug'ilgan sanasi
 *                       example: 1990-01-01
 *                     passport:
 *                       type: string
 *                       description: Odamning passport raqami
 *                       example: AB1234567
 *                     phoneNumber:
 *                       type: string
 *                       description: Odamning telefon raqami
 *                       example: +998901234567
 *                     email:
 *                       type: string
 *                       description: Odamning email manzili
 *                       example: john.doe@example.com
 *                     birthCountry:
 *                       type: string
 *                       description: Odamning tug'ilgan mamlakati
 *                       example: Uzbekistan
 *     responses:
 *       201:
 *         description: Hotel muvaffaqiyatli sotib olindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotel booked successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       description: Foydalanuvchi IDsi
 *                       example: 60d6b72f5e838d001fbb74a4
 *                     hotelId:
 *                       type: string
 *                       description: Hotel IDsi
 *                       example: 607d1b2f8f1b2c001f8b4b47
 *                     people:
 *                       type: array
 *                       description: Odamlar ro'yxati
 *                       items:
 *                         type: object
 *                         properties:
 *                           firstName:
 *                             type: string
 *                             description: Odamning ismi
 *                             example: John
 *                           lastName:
 *                             type: string
 *                             description: Odamning familiyasi
 *                             example: Doe
 *       400:
 *         description: Xato so'rov. "People" arrayi noto'g'ri yoki bo'sh.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: People array is required
 *       404:
 *         description: Hotel yoki foydalanuvchi topilmadi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hotel not found
 */

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


module.exports = router;
