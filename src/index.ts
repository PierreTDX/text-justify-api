import express from "express";
import justifyRouter from "./routes/justify";
import tokenRouter from "./routes/token"; // <- le router correct

const app = express();
app.use(express.json());

// Test de base
app.get("/", (req, res) => {
    res.send("Server is working!");
});

// Routes
app.use("/api/justify", justifyRouter);
app.use("/api/token", tokenRouter); // <- ici on met le router

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));