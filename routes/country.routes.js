const router = require("express").Router();
const { authenticate, adminAccess } = require("../middlewares/auth");
const upload = require("../utils/fileUpload");
const { getAllCountries,deleteCountry,postCountries,updateCountry } = require("../controllers/country.controller");
router.get("/get/all",  getAllCountries);
router.delete("/delete",  deleteCountry);
router.post("/add",  upload.single("flag"), postCountries);
router.post("/update",  upload.single("flag"), updateCountry);
/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: The countries managing API
 */

/**
 * @swagger
 * /api/v1/countries/get/all:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: List of all countries
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All countries found
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       nameUz:
 *                         type: string
 *                       nameRu:
 *                         type: string
 *                       nameEn:
 *                         type: string
 *                       flag:
 *                         type: string
 *                         example: http://localhost:4000/public/uploads/flag.jpg
 */

/**
 * @swagger
 * /api/v1/countries/add:
 *   post:
 *     summary: Add a new country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nameUz
 *               - nameRu
 *               - nameEn
 *             properties:
 *               nameUz:
 *                 type: string
 *               nameRu:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               flag:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Country created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Country created successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nameUz:
 *                       type: string
 *                     nameRu:
 *                       type: string
 *                     nameEn:
 *                       type: string
 *                     flag:
 *                       type: string
 *                       example: http://localhost:4000/public/uploads/flag.jpg
 */

/**
 * @swagger
 * /api/v1/countries/delete:
 *   delete:
 *     summary: Delete a country
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country_id
 *             properties:
 *               country_id:
 *                 type: string
 *                 example: 60b6fe83f1c7e44bc0e0b0a7
 *     responses:
 *       200:
 *         description: Country deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Country deleted successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 */

/**
 * @swagger
 * /api/v1/countries/update:
 *   put:
 *     summary: Update country details
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country_id
 *               - nameUz
 *               - nameRu
 *               - nameEn
 *             properties:
 *               country_id:
 *                 type: string
 *                 example: 60b6fe83f1c7e44bc0e0b0a7
 *               nameUz:
 *                 type: string
 *               nameRu:
 *                 type: string
 *               nameEn:
 *                 type: string
 *               flag:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Country updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Country updated successfully
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     nameUz:
 *                       type: string
 *                     nameRu:
 *                       type: string
 *                     nameEn:
 *                       type: string
 *                     flag:
 *                       type: string
 *                       example: http://localhost:4000/public/uploads/flag.jpg
 */


module.exports = router;
