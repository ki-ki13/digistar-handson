const http = require("http");

const database = [
  {
    name: "admin",
    email: "admin@gmail.com",
    password: "admin123",
    id: 1,
  },
];
let nextId = 2;

// Helper Func
const parseBody = (req) => {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (error) {
        reject(new Error("Invalid JSON"));
      }
    });
  });
};

const sendResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(data));
};

const authenticateAdmin = (credentials) => {
  const admin = database.find((user) => user.name === "admin");
  return admin && credentials.email === admin.email && credentials.password === admin.password;
};

const findUserById = (id) => database.findIndex((user) => user.id === id);

const filterSensitiveInfo = (user) => {
  const { password, ...filteredUser } = user;
  return filteredUser;
};


const addUser = async (req, res) => {
  try {
    const userData = await parseBody(req);
    const newUser = {
      ...userData,
      id: nextId++,
    };
    database.push(newUser);
    sendResponse(res, 201, filterSensitiveInfo(newUser));
  } catch (error) {
    sendResponse(res, 400, { error: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const { adminCredentials, userToEdit } = await parseBody(req);
    if (!authenticateAdmin(adminCredentials)) {
      return sendResponse(res, 403, { error: "Akses khusus admin." });
    }
    const userIndex = findUserById(userToEdit.id);
    if (userIndex === -1) {
      return sendResponse(res, 404, { error: "User tidak ditemukan" });
    }
    database[userIndex] = { ...database[userIndex], ...userToEdit };
    sendResponse(res, 200, filterSensitiveInfo(database[userIndex]));
  } catch (error) {
    sendResponse(res, 400, { error: error.message });
  }
};

const removeUser = async (req, res) => {
  try {
    const { adminCredentials, userId } = await parseBody(req);
    if (!authenticateAdmin(adminCredentials)) {
      return sendResponse(res, 403, { error: "Akses khusus admin." });
    }
    const userIndex = findUserById(userId);
    if (userIndex === -1) {
      return sendResponse(res, 404, { error: "User tidak ditemukan" });
    }
    const removedUser = database.splice(userIndex, 1)[0];
    sendResponse(res, 200, { message: "User berhasil dihapus", user: filterSensitiveInfo(removedUser) });
  } catch (error) {
    sendResponse(res, 400, { error: error.message });
  }
};

const getAllUsers = (req, res) => {
  const filteredUsers = database.map(filterSensitiveInfo);
  sendResponse(res, 200, filteredUsers);
};

const server = http.createServer((req, res) => {
  if (req.url === "/adduser" && req.method === "POST") {
    addUser(req, res);
  } else if (req.url === "/edituser" && req.method === "PUT") {
    editUser(req, res);
  } else if (req.url === "/removeuser" && req.method === "DELETE") {
    removeUser(req, res);
  } else if (req.url === "/getalluser" && req.method === "GET") {
    getAllUsers(req, res);
  } else {
    sendResponse(res, 404, { error: "Not Found" });
  }
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});