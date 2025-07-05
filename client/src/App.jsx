import { useState, useEffect } from "react";
import axios from "axios";
import data from "./sampleTexts.json";
import styled from 'styled-components';
import "./App.css";

function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [typingLevel, setTypingLevel] = useState("");
  const [textToType, setTextToType] = useState("");



  const getTypingLevel = (wpm) => {
    if (wpm < 20) return "Very slow (< 20WPM)";
    if (wpm < 40) return "Beginner (20–39 WPM)";
    if (wpm < 60) return "Average (40–59 WPM)";
    if (wpm < 80) return "Proficient (60–79 WPM)";
    if (wpm < 100) return "Fast (80–99 WPM)";
    return "Advanced (100+ WPM)";
  };

  const getRandomSample = () => {
    const randomIndex = Math.floor(Math.random() * data.sampleTexts.length);
    return data.sampleTexts[randomIndex];
  };

  // Start countdown when typing begins
  const handleTextChange = (e) => {
    const value = e.target.value;
    setText(value);

    if (!hasStarted && value.length > 0) {
      setHasStarted(true);
      setIsDisabled(true); // lock buttons
    }
  };


  // Countdown effect
  useEffect(() => {
    let countdown;
    if (hasStarted && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setIsDisabled(false); // unlock buttons
    }

    return () => clearInterval(countdown);
  }, [hasStarted, timer]);

  // random text effect

  useEffect(() => {
    setTextToType(getRandomSample());
  }, []);

  const analyzeText = async () => {
    try {
      const response = await axios.post("http://localhost:5000/analyze", {
        text: text,
      });
      setResult(response.data);
      const words = response.data.words;
      const elapsedSeconds = 60 - timer;
      const wpm = Math.round(words / (elapsedSeconds / 60));
      const level = getTypingLevel(wpm);
      setTypingLevel(`${level} — ${wpm} WPM`);
    } catch (error) {
      console.error("Error:", error);
    };
  }
  const clearText = () => {
    setText("");
    setResult(null);
    setTimer(60);
    setHasStarted(false);
    setIsDisabled(true);
    setTypingLevel("");
    setTextToType(getRandomSample())
  };

  return (
    <Container>
      <Title>Text Analyzer</Title>
      {textToType && (
        <SampleText>
          <strong>Type this:</strong><br />
          "{textToType}"
        </SampleText>
      )}

      <TextArea
        rows="6"
        value={text}
        onChange={handleTextChange}
        placeholder="Start typing..."
        disabled={timer === 0}
      />

      <Timer>
        {hasStarted ? `Time left: ${timer}s` : "Start typing to begin countdown"}
      </Timer>

      <ButtonGroup>
        <Button onClick={analyzeText} disabled={isDisabled}>
          Analyze
        </Button>
        <Button onClick={clearText} disabled={isDisabled}>
          Clear
        </Button>
      </ButtonGroup>

      {result && (
        <ResultBox>
          <p>Words: {result.words}</p>
          <p>Symbols: {result.symbols}</p>
          {typingLevel && <p><strong>Your typing level:</strong> {typingLevel}</p>}
        </ResultBox>
      )}
    </Container>
  );
};

export default App;

const Container = styled.div`
  max-width: 600px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  font-family: Arial, sans-serif;

  @media (max-width: 768px) {
    margin: 2rem 1rem;
    padding: 1rem;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 1.5rem;
  color:rgb(186, 127, 127)
`;

const SampleText = styled.div`
 margin-bottom: 1rem;
  padding: 1rem;
  border: 2px solid rgb(186, 127, 127);
  border-radius: 8px; 
  background-color: #f9f9f9;
  font-style: italic;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 95%;
  padding: 1rem;
  font-size: 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  resize: vertical;
  color: rgb(186, 127, 127);

  &:disabled {
    background-color: #f0f0f0;
    color: #666;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.5rem 1.25rem;
  font-size: 1rem;
  border: none;
  border-radius: 6px;
  background-color: #007bff;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }

  &:nth-child(2) {
    background-color: #6c757d;

    &:hover {
      background-color: #5a6268;
    }
  }

  &:disabled {
    background-color: #999;
    cursor: not-allowed;
  }
`;

const ResultBox = styled.div`
  margin-top: 2rem;
  text-align: center;
`;

const Timer = styled.div`
  margin-top: 1rem;
  text-align: center;
  font-weight: bold;
`;
