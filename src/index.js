const express = require('express');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

// route สำหรับการเรียกดูผู้ใช้ทั้งหมด
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// ดึงรายการสินค้าทั้งหมด
app.get('/products', async (req, res) => {
    const products = await prisma.product.findMany();
    res.json(products);
  });
  
  // ดึงข้อมูลสินค้าโดยใช้ ID
  app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id: parseInt(id) },
    });
    res.json(product);
  });
  
  // เพิ่มสินค้าใหม่
  app.post('/products', async (req, res) => {
    const { name, description, price, stockQuantity, imageUrl } = req.body;
    const newProduct = await prisma.product.create({
      data: { name, description, price, stockQuantity, imageUrl },
    });
    res.json(newProduct);
  });
  
  // อัปเดทข้อมูลสินค้า
  app.put('/products/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stockQuantity, imageUrl } = req.body;
    const updatedProduct = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { name, description, price, stockQuantity, imageUrl },
    });
    res.json(updatedProduct);
  });
  
  // ลบสินค้า
  app.delete('/products/:id', async (req, res) => {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Product deleted' });
  });
  
  // สร้างคำสั่งซื้อใหม่
  app.post('/orders', async (req, res) => {
    const { userId, products, shippingAddressId } = req.body;
  
    const totalAmount = products.reduce((total, product) => total + product.price * product.quantity, 0);
  
    try {
      const order = await prisma.order.create({
        data: {
          userId: userId,
          date: new Date(),
          totalAmount: totalAmount,
          shippingAddressId: shippingAddressId, // Use the existing ShippingAddress ID
          orderDetails: {
            create: products.map((product) => ({
              productId: product.productId,
              quantity: product.quantity,
              price: product.price,
            })),
          },
        },
      });
  
      res.json(order);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  
  // ดึงรายการคำสั่งซื้อทั้งหมด
  app.get('/orders', async (req, res) => {
    const orders = await prisma.order.findMany({
      include: {
        orderDetails: true,
      },
    });
    res.json(orders);
  });
  
  // ดึงข้อมูลคำสั่งซื้อโดยใช้ ID
  app.get('/orders/:id', async (req, res) => {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id: parseInt(id) },
      include: {
        orderDetails: true,
      },
    });
    res.json(order);
  });
  

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
