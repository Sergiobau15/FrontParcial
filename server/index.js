const express = require("express");
const app = express();
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const saleRoutes=require('./routes/saleRoutes');
const cors = require("cors");

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

app.use('/users', userRoutes);
app.use('/products', productRoutes);
app.use('/orders', orderRoutes);
app.use('/sale', saleRoutes);

app.listen(3002,()=>{
    console.log("Corriendo en el puerto 3002");
    
})