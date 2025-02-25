import React, { useEffect, useRef, useState } from "react";
import socket from "../utils/socket";

const VoiceChat = () => {
  const [votes, setVotes] = useState({ yes: 0, no: 0 });
  const audioRef = useRef(null);
  const localStream = useRef(null);

  useEffect(() => {
    socket.on("voteUpdate", (data) => {
      console.log("Received vote update:", data);
      setVotes(data);
    });

    return () => {
      socket.off("voteUpdate");
    };
  }, []);

  const startVoiceChat = async () => {
    try {
      localStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current.srcObject = localStream.current;
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const castVote = (option) => {
    console.log("Sending vote:", option);
    socket.emit("vote", option);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Real-Time Voice Chat & Voting</h2>
      
      <button style={styles.button} onClick={startVoiceChat}>Start Voice Chat</button>
      
      <audio ref={audioRef} autoPlay controls style={styles.audio} />

      <h3 style={styles.voteTitle}>Vote</h3>
      <div style={styles.buttonGroup}>
        <button style={styles.voteButton} onClick={() => castVote("yes")}>
          Yes ({votes.yes})
        </button>
        <button style={styles.voteButton} onClick={() => castVote("no")}>
          No ({votes.no})
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f5f5f5",
    padding: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginBottom: "15px",
  },
  audio: {
    marginBottom: "20px",
  },
  voteTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  buttonGroup: {
    display: "flex",
    gap: "10px",
  },
  voteButton: {
    padding: "10px 20px",
    fontSize: "16px",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default VoiceChat;
