const {Router}= require("express");
const router = Router();
const upload = require("../utils/fileUpload");
const {deleteTravel,getAllTravels,getTravel,postTravel,putTravel,addComments,getAllComments,getAllCommentsTravel,deleteComment} = require("../controllers/travel.controller");
const {authenticate, adminAccess} = require("../middlewares/auth");
router.post("/post",upload.single("image"),postTravel);
router.get("/get/all", getAllTravels);
router.get("/get/one",getTravel);
router.delete("/delete",deleteTravel);
router.put("/put",upload.single("image"),putTravel);
router.post("/add/comments",authenticate,addComments); 
router.get("/get/comments",getAllComments);
router.get("/get/comments/travel",getAllCommentsTravel);
router.delete("/delete/comments",deleteComment);

/**
 * @swagger
 * tags:
 *   - name: Travel
 *     description: API for managing travels and travel-related actions
 *   - name: Comments
 *     description: API for managing travel comments
 * 
 * components:
 *   requestBodies:
 *     TravelData:
 *       description: Data required for creating or updating a travel
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country_id:
 *                 type: string
 *               nameUz:
 *                 type: string
 *               nameRu:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               locationUz:
 *                 type: string
 *               locationRu:
 *                 type: string
 *               locationEn:
 *                 type: string
 *               day:
 *                 type: integer
 *               price:
 *                 type: number
 *               rating:
 *                 type: number
 *               year:
 *                 type: integer
 *               statusUz:
 *                 type: string
 *               statusRu:
 *                 type: string
 *               statusEn:
 *                 type: string
 *               map:
 *                 type: string
 *               descriptionUz:
 *                 type: string
 *               descriptionRu:
 *                 type: string
 *               descriptionEn:
 *                 type: string
 *               from:
 *                 type: string
 *                 format: date-time
 *               to:
 *                 type: string
 *                 format: date-time
 *     CommentData:
 *       description: Data required for adding a comment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               travel_id:
 *                 type: string
 * 
 */

/**
 * @swagger
 * /api/v1/travel/post:
 *   post:
 *     tags: [Travel]
 *     summary: Create a new travel
 *     description: Create a new travel entry in the system
 *     requestBody:
 *       $ref: '#/components/requestBodies/TravelData'
 *     responses:
 *       201:
 *         description: Travel created successfully
 *       400:
 *         description: Bad request (e.g., missing required fields)
 */

/**
 * @swagger
 * /api/v1/travel/get/all:
 *   get:
 *     tags: [Travel]
 *     summary: Get all travels
 *     description: Fetch all travel entries from the system
 *     responses:
 *       200:
 *         description: Successfully retrieved all travels
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Travel'
 * 
 */

/**
 * @swagger
 * /api/v1/travel/get/one:
 *   get:
 *     tags: [Travel]
 *     summary: Get a single travel
 *     description: Fetch a single travel entry using its ID
 *     parameters:
 *       - in: query
 *         name: travel_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Travel found
 *       404:
 *         description: Travel not found
 */

/**
 * @swagger
 * /api/v1/travel/delete:
 *   delete:
 *     tags: [Travel]
 *     summary: Delete a travel
 *     description: Delete a travel entry by its ID
 *     parameters:
 *       - in: query
 *         name: travel_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Travel deleted successfully
 *       404:
 *         description: Travel not found
 */

/**
 * @swagger
 * /api/v1/travel/put:
 *   put:
 *     tags: [Travel]
 *     summary: Update an existing travel
 *     description: Update a travel entry by its ID
 *     requestBody:
 *       $ref: '#/components/requestBodies/TravelData'
 *     responses:
 *       200:
 *         description: Travel updated successfully
 *       400:
 *         description: Bad request (e.g., invalid date)
 *       404:
 *         description: Travel not found
 */

/**
 * @swagger
 * /api/v1/travel/add/comments:
 *   post:
 *     tags: [Comments]
 *     summary: Add a comment to a travel
 *     description: Add a comment to a specific travel entry
 *     requestBody:
 *       $ref: '#/components/requestBodies/CommentData'
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       404:
 *         description: Travel or user not found
 *       400:
 *         description: Invalid rating
 */

/**
 * @swagger
 * /api/v1/travel/get/comments:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments
 *     description: Get all comments across all travels
 *     responses:
 *       200:
 *         description: Successfully retrieved all comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 */

/**
 * @swagger
 * /api/v1/travel/get/comments/travel:
 *   get:
 *     tags: [Comments]
 *     summary: Get all comments for a specific travel
 *     description: Get all comments for a specific travel entry using its ID
 *     parameters:
 *       - in: query
 *         name: travel_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 *       404:
 *         description: Travel not found
 */

/**
 * @swagger
 * /api/v1/travel/delete/comments:
 *   delete:
 *     tags: [Comments]
 *     summary: Delete a comment from a travel
 *     description: Delete a comment from a specific travel entry
 *     parameters:
 *       - in: query
 *         name: travel_id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: comment_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       404:
 *         description: Comment or travel not found
 */

module.exports = router;
