const express = require('express');
const dotenv = require('dotenv');
const dbConnect = require("./config/dbConfig")

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const authRouter = require("./routes/authRoute");
const bodyParser = require('body-parser');
const { errorHandler, notFound } = require('./middlewares/errorHandler');
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoutes");
const productCategoryRouter = require("./routes/productCategoryRoutes");
const blogCategoryRouter = require("./routes/blogCategoryRoutes");
const brandRoute = require("./routes/brandRoute");
const colorRoute = require("./routes/colorRoute");
const enqRoute = require("./routes/enqRoute");
const couponRoute = require("./routes/couponRoutes");
const morgan = require("morgan")
dbConnect();


app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", productCategoryRouter);
app.use("/api/blogCategory", blogCategoryRouter);
app.use("/api/brand", brandRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/color", colorRoute);
app.use("/api/enquiry", enqRoute);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});
