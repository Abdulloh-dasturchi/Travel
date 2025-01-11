const { Router } = require("express");
const {
  register,
  login,
  profile,
  avatar,
  updateProfile,
  addFavourite,
  allFavourites,
  deleteFavourites,
  changePassword,
  sendOtp,
  userTravels,
  allUsers,
  oneUser,
} = require("../controllers/auth.controller");
const router = Router();
const upload = require("../utils/fileUpload");
const { authenticate, limitter, otp, adminAccess } = require("../middlewares/auth");
router.get("/oneUser/:id", authenticate,adminAccess,  oneUser);
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication and profile management
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               telNumber:
 *                 type: string
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post("/register", register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.post("/login", limitter, login);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get the profile of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/profile", authenticate, profile);

/**
 * @swagger
 * /api/v1/auth/avatar:
 *   put:
 *     summary: Update the user's avatar
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *       401:
 *         description: Unauthorized
 */
router.put("/avatar", upload.fields([{ name: "avatar", maxCount: 1 }]), authenticate, avatar);

/**
 * @swagger
 * /api/v1/auth/updateProfile:
 *   put:
 *     summary: Update user profile information
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               telNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Bad Request
 */
router.put("/updateProfile", authenticate, updateProfile);

/**
 * @swagger
 * /api/v1/auth/addFavourite:
 *   post:
 *     summary: Add a travel to the user's favourites
 *     tags: [Authentication]
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
 *     responses:
 *       200:
 *         description: Travel added to favourites
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.post("/addFavourite", authenticate, addFavourite);

/**
 * @swagger
 * /api/v1/auth/allFavourites:
 *   get:
 *     summary: Get all favourites of the authenticated user
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Favourites retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/allFavourites", authenticate, allFavourites);

/**
 * @swagger
 * /api/v1/auth/deleteFavourites:
 *   delete:
 *     summary: Remove a travel from the user's favourites
 *     tags: [Authentication]
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
 *     responses:
 *       200:
 *         description: Travel removed from favourites
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.delete("/deleteFavourites", authenticate, deleteFavourites);

/**
 * @swagger
 * /api/v1/auth/sendOtp:
 *   post:
 *     summary: Send OTP to the user's email
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Bad Request
 */
router.post("/sendOtp", otp, sendOtp); 

/**
 * @swagger
 * /api/v1/auth/changePassword:
 *   put:
 *     summary: Change the user's password
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized
 */
router.put("/changePassword", authenticate, changePassword);

/**
 * @swagger
 * /api/v1/auth/userTravels:
 *   get:
 *     summary: Get the user's travels
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User travels retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/userTravels", authenticate, userTravels);
router.get("/allUsers", authenticate,adminAccess, allUsers);
module.exports = router;
