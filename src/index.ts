import express from "express";
import justifyRouter from "./routes/justify";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Server is working!");
});
app.use("/api/justify", justifyRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));