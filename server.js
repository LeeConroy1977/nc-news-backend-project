const app = require("./app");

const PORT = process.env.PORT || 9091;

app.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`);
});
