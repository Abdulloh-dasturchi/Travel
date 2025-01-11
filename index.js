// Importants
const express = require('express');
const cors = require('cors');
require('dotenv').config();
require("colors")
const path = require('path');
const app = express();
const connectDB = require("./config/db")
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./utils/SwaggerOption");

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

// Swagger interfeysini ulash
// Intagration mongoDB
connectDB()
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//Routes
app.use("/api/v1/auth", require("./routes/auth.routes"));
app.use("/api/v1/travel", require("./routes/travel.routes"));
app.use("/api/v1/hotel", require("./routes/hotel.routes"));
app.use("/api/v1/buy", require("./routes/buyTravel.routes"));
app.use("/api/v1/countries", require("./routes/country.routes"));
// Server running
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`.bgBlue);
});
