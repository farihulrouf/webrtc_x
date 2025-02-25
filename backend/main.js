const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Konfigurasi CORS untuk menerima request dari semua origin
app.use(cors({ origin: "*" })); 

const io = new Server(server, {
    cors: {
        origin: "*", // Mengizinkan semua origin
        methods: ["GET", "POST"]
    }
});

app.use(express.static(__dirname)); // Menyajikan file statis

// Simpan hasil voting di backend
let votes = { yes: 0, no: 0 };

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Kirim hasil vote terbaru saat user baru bergabung
    socket.emit("voteUpdate", votes);

    // Terima vote dari user
    socket.on("vote", (vote) => {
        if (vote === "yes") {
            votes.yes++;
        } else if (vote === "no") {
            votes.no++;
        }

        console.log(`Vote received: ${vote} | Yes: ${votes.yes}, No: ${votes.no}`);

        // Kirim hasil vote ke semua user
        io.emit("voteUpdate", votes);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
