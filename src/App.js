import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [topic, setTopic] = useState("Geography");
  const [question, setQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluation, setEvaluation] = useState("");

  const topics = [
    "General",
    "Geography",
    "Health",
    "Sports",
    "Technology",
    "Business",
    "Entertainment",
    "Science",
  ];
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  const generateQuestion = async (req, res) => {
    setQuestion("Loading. . .");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Generate a General Knowledge based multiple choice question on topic ${topic} without including any symbols like *,**,##. Also keep variety in way of asking the question. Avoid repeatation of question`,
                },
              ],
            },
          ],
        },
      });
      setQuestion(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.error("Error generating question:", error);
    }
  };

  const evaluateAnswer = async () => {
    setEvaluation("Evaluating . . .");
    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`,
        method: "post",
        data: {
          contents: [
            {
              parts: [
                {
                  text: `Question: ${question}\nAnswer: ${userAnswer}\nEvaluate this answer just as true or false remark without including any symbols like *,**,##..`,
                },
              ],
            },
          ],
        },
      });
      setEvaluation(
        response["data"]["candidates"][0]["content"]["parts"][0]["text"]
      );
    } catch (error) {
      console.error("Error evaluating answer:", error);
    }
  };

  return (
    <div className="container">
      <h1>Topic-Trek</h1>
      <label>
        Select A Topic:
        <select value={topic} onChange={(e) => setTopic(e.target.value)}>
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic}
            </option>
          ))}
        </select>
      </label>
      <button onClick={generateQuestion}>Generate Question</button>
      <h3>
        <i>Question :</i>
      </h3>
      <p>{question}</p>
      <label>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Your Answer"
        />
      </label>
      <button onClick={evaluateAnswer}>Submit Answer</button>
      <h3>
        <i>Evaluation :</i>
      </h3>
      <p className="evaluation">{evaluation}</p>
    </div>
  );
}

export default App;
