const express = require("express");
var cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
// middlewares
app.use(express.json({ extended: false }));

// route included
// app.use(require("./routes/payment"));
app.use(require("./routes/payment"));

app.listen(port, () => console.log(`server started on port ${port}`));