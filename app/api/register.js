import bcrypt from "bcrypt";

//checking for sql db connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "016231332",
  database: "GeoDatabase",
  port: 3306,
});

console.log("Attempting to connect to the database...");

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to GeoGrade database!");
});

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      // <== if any aren't filled out, then return error but later we should make required entries
      return res.status(400).json({ message: "Not all fields filled! >:(" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);

      const sql =
        "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";

      db.query(sql, [username, email, hashedPassword], (err, result) => {
        if (err) {
          console.error("Error inserting user into database:", err);
          return res
            .status(500)
            .json({ message: "Error registering user when query" });
        }
        console.log("User registered:", result);
        res.status(200).json({ message: "User registered successfully" });
      });
    } catch (error) {
      console.error("Error hashing password:", error);
      res.status(500).json({ message: "Error registering user" });
    }
  }
}
