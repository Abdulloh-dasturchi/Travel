const express = require("express");
const { updateHotel, deleteHotel, getAllHotels, getHotelById, createHotel,addComments,deleteComment,getAllComments,getAllCommentsHotel } = require("../controllers/hotel.controller");
const upload = require("../utils/fileUpload");
const router = express.Router();
const { authenticate, adminAccess,  } = require("../middlewares/auth");

// Update hotel
router.put("/update", updateHotel);

// Delete hotel
router.delete("/delete/:id",deleteHotel);

// Get all hotels
router.get("/get/all", getAllHotels); 

// Get hotel by id
router.get("/get/one", getHotelById);

// Add hotel 
router.post("/add",upload.fields([ { name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 1 },{ name: 'image3', maxCount: 1 }, { name: 'image4', maxCount: 1 }]), createHotel);

// Add comments
router.post("/add/comments",authenticate,addComments); 

// Get comments
router.get("/get/comments",getAllComments);

// Get comments
router.get("/get/comments/hotel",getAllCommentsHotel);

// Delete comments
router.delete("/delete/comments",authenticate,deleteComment);
/**
 * @swagger
 * components:
 *   schemas:
 *     Hotel:
 *       type: object
 *       properties:
 *         nameUz:
 *           type: string
 *         nameRu:
 *           type: string
 *         nameEn:
 *           type: string
 *         locationUz:
 *           type: string
 *         locationRu:
 *           type: string
 *         locationEn:
 *           type: string
 *         descriptionUz:
 *           type: string
 *         descriptionRu:
 *           type: string
 *         descriptionEn:
 *           type: string
 *         statusUz:
 *           type: string
 *         statusRu:
 *           type: string
 *         statusEn:
 *           type: string
 *         rating:
 *           type: number
 *         price:
 *           type: number
 *         year:
 *           type: number
 *         country_id:
 *           type: string
 *         map:
 *           type: string
 *         from:
 *           type: string
 *           format: date
 *         to:
 *           type: string
 *           format: date
 *         image1:
 *           type: string
 *         image2:
 *           type: string
 *         image3:
 *           type: string
 *         image4:
 *           type: string
 *         day:
 *           type: integer
 * 
 *     Comment:
 *       type: object
 *       properties:
 *         comment:
 *           type: string
 *         rating:
 *           type: number
 *         user:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   - name: Hotels
 *     description: Operations related to hotels
 */

/**
 * @swagger
 * /api/v1/hotel/get/all:
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: A list of hotels
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Hotel'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/v1/hotel/create:
 *   post:
 *     summary: Create a new hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *       400:
 *         description: Missing required fields or invalid data
 */

/**
 * @swagger
 * /api/v1/hotel/get:
 *   post:
 *     summary: Get a single hotel by hotel_id
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hotel found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Hotel'
 *       404:
 *         description: Hotel not found
 */

/**
 * @swagger
 * /api/v1/hotel/update:
 *   put:
 *     summary: Update a hotel by hotel_id
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hotel'
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *       400:
 *         description: Missing required fields or invalid data
 *       404:
 *         description: Hotel not found
 */

/**
 * @swagger
 * /api/v1/hotel/delete:
 *   delete:
 *     summary: Delete hotel by ID
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 *       404:
 *         description: Hotel not found
 */

/**
 * @swagger
 * /api/v1/hotel/add/comments:
 *   post:
 *     summary: Add a comment to a hotel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid data or rating out of range
 *       404:
 *         description: Hotel or user not found
 */

/**
 * @swagger
 * /api/v1/hotel/get/comments:
 *   get:
 *     summary: Get all comments from all hotels
 *     tags: [Hotels]
 *     responses:
 *       200:
 *         description: A list of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/v1/hotel/get/comments/hotel:
 *   get:
 *     summary: Get all comments for a specific hotel
 *     tags: [Hotels]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: A list of comments for the hotel
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/v1/hotel/delete/comments:
 *   delete:
 *     summary: Delete a comment from a hotel
 *     tags: [Hotels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_id:
 *                 type: string
 *               comment_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment or hotel not found
 */


module.exports = router;
