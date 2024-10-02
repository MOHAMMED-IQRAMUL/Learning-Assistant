"use client";

import { useRef, useState } from "react";

export default function Dashboard() {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", content: "Hello There, How Can I Help You" },
    { role: "user", content: "Hello, There is no textBox" },
    { role: "bot", content: "No Worries, Speak To Send Message" },
  ]);
  const [transcript, setTranscript] = useState("");

  const mediaRecorderRef = useRef(null);
  const socketRef = useRef(null);

  const sendMessage = async () => {
    console.log("Message: Sending");

    setMessages((prev) => [
      ...prev,
      { role: "user", content: transcript },
    ]);

    try {
      const response = await fetch("/api/assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify([...messages, { role: "user", content: transcript }]),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      setMessages((prev) => [...prev, { role: "bot", content: "" }]);

      let accumulatedContent = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulatedContent += decoder.decode(value, { stream: true });
        console.log(accumulatedContent);
        setMessages((prev) => {
          const updatedMessages = [...prev];
          const lastMessage = updatedMessages[updatedMessages.length - 1];
          if (lastMessage.role === "bot") {
            return [
              ...updatedMessages.slice(0, -1),
              { ...lastMessage, content: accumulatedContent },
            ];
          }
          console.log("Message: Received");
          return [...updatedMessages, { role: "bot", content: accumulatedContent }];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, there was an error. Please try again." },
      ]);
    }
  };

  const startRecording = async () => {
    console.log("Open: Audio");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const tokenResponse = await fetch("/api/websocket");
      const { token } = await tokenResponse.json();
      const socket = new WebSocket(
        `wss://api.deepgram.com/v1/listen?model=nova-2-conversationalai&smart_format=true&no_delay=true&interim_results=true&endpointing=250`,
        ["token", token]
      );

      socket.onopen = () => {
        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        });
        mediaRecorder.start(250);
      };

      socket.onmessage = (event) => {
        let received;

        try {
          received = JSON.parse(event.data);
        } catch (error) {
          console.error("Error parsing message data:", error);
          return;
        }

        if (received.type === 'Metadata') {
          console.log("Received metadata:", received);
          return;
        }

        if (!received.channel || !received.channel.alternatives || !received.channel.alternatives.length) {
          console.error("Received message with no alternatives:", received);
          return;
        }

        const newTranscript = received.channel.alternatives[0].transcript.trim();
        console.log("New transcript:", newTranscript);

        if (newTranscript) {
          setTranscript((prev) => `${prev} ${newTranscript}`);
        }
      };

      socket.onclose = () => console.log("WebSocket connection closed");
      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        socket.send(JSON.stringify({ type: "CloseStream" }));
      };

      mediaRecorderRef.current = mediaRecorder;
      socketRef.current = socket;
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (socketRef.current) {
      socketRef.current.send(JSON.stringify({ type: "Finalize" }));
    }
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      mediaRecorderRef.current = null;
    }
    setIsRecording(false);
    console.log("Closed: Audio");
    sendMessage();
  };

  const handleMicClick = async () => {
    if (isRecording) {
      stopRecording();
    } else {
      await startRecording();
    }
  };

  return (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <div className="w-[60%] h-[700px] mx-auto rounded-lg shadow-lg border-2 border-grey">
        <div className="chats mt-5 ml-5 mr-5 h-[500px] flex flex-col gap-2 overflow-scroll">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat border max-w-fit px-4 py-2 rounded-md bg-white ${
                message.role === "bot" ? "self-start" : "self-end"
              }`}
            >
              <p>{message.content}</p>
            </div>
          ))}
        </div>
        <div className="low m-5 h-[150px] border flex justify-center items-center">
          <button
            className="border-2 border-blue-800 px-4 py-2 rounded-full"
            onClick={handleMicClick}
          >
            {isRecording ? "STOP" : "RECORD"}
            <span className="sr-only">{isRecording ? "Recording" : "Use Microphone"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
