import React, { useState, useEffect } from "react";
import "../styles/QuizApp.css"; // Import the CSS file


const QuizApp = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [progress, setProgress] = useState(0);
    const [score, setScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const userName = localStorage.getItem("username") || "Guest";
    const avatar = localStorage.getItem("avatar") || "https://api.dicebear.com/7.x/avataaars/svg?seed=Guest";

    // Function to shuffle an array
    const shuffleArray = (array) => {
        let shuffledArray = [...array];
        for (let i = shuffledArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
        }
        return shuffledArray;
    };

    // Fetch questions from API and shuffle them
    useEffect(() => {
        fetch("http://localhost:5000/api/questions")
            .then(response => response.json())
            .then(data => {
                if (!data || !data.questions) {
                    console.error("Invalid API response structure:", data);
                    return;
                }

                const shuffledQuestions = shuffleArray(data.questions.map(q => ({
                    question: q.description || "No question text available",
                    options: shuffleArray(q.options?.map(option => ({
                        text: option.description,
                        isCorrect: option.is_correct
                    })) || []),
                })));

                setQuestions(shuffledQuestions);
            })
            .catch(error => console.error("Error fetching quiz data:", error));
    }, []);

    // Handle option selection
    const handleOptionClick = (option) => {
        setSelectedOption(option);
    };

    // Handle moving to next question
    const handleNext = () => {
        if (selectedOption) {
            // Update answers array
            const newAnswers = [...answers, {
                question: questions[currentQuestionIndex].question,
                selectedAnswer: selectedOption.text,
                correctAnswer: questions[currentQuestionIndex].options.find(opt => opt.isCorrect).text,
                isCorrect: selectedOption.isCorrect
            }];

            setAnswers(newAnswers);

            // Increase score if correct
            if (selectedOption.isCorrect) {
                setScore(prevScore => prevScore + 1);
            }

            // Move to next question or finish quiz
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setProgress(((currentQuestionIndex + 1) / questions.length) * 100);
            } else {
                handleFinishQuiz();
            }
        }
    };

    useEffect(() => {
        const storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
        setLeaderboard(storedLeaderboard);
    }, []);

    const handleFinishQuiz = () => {
        setQuizCompleted(true);
    };

    // Update leaderboard **only after quiz is completed**
    useEffect(() => {
        if (quizCompleted) {
            let storedLeaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

            // Check if the user already exists
            const existingUser = storedLeaderboard.find(entry => entry.name === userName);
            if (existingUser) {
                existingUser.score = Math.max(existingUser.score, score); // Keep the highest score
            } else {
                storedLeaderboard.push({ name: userName, score });
            }

            // Sort leaderboard in descending order
            storedLeaderboard.sort((a, b) => b.score - a.score);

            // Store updated leaderboard in localStorage
            localStorage.setItem("leaderboard", JSON.stringify(storedLeaderboard));
            setLeaderboard(storedLeaderboard);
        }
    }, [quizCompleted, score]);

    // Restart the quiz
    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setSelectedOption(null);
        setProgress(0);
        setScore(0);
        setQuizCompleted(false);
        setAnswers([]);
    };

    return (
        <div className="quiz-app">
            {/* Quiz Questions */}
            {!quizCompleted ? (
                questions.length > 0 ? (
                    <div className="quiz-container">
                        <div className="top-part">
                            <div className="user-info">
                                <img src={avatar} alt="Avatar" className="user-avatar" />
                                <h3>{userName}</h3>
                            </div>
                            <h3 className="app-name">QUIZZY</h3>
                            <h4 className="question-no">{currentQuestionIndex+1}</h4>
                        </div>
                        <div className="card">
                            {/* Progress Bar */}
                            <div className="progress-bar">
                                <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                            </div>
                            <h3 className="question-text">{questions[currentQuestionIndex].question}</h3>
                        
                            <div className="options-container">
                                {questions[currentQuestionIndex].options.map((option, index) => (
                                <button 
                                    key={index} 
                                    className={`option-button ${selectedOption === option ? "selected" : ""}`}
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.text}
                                </button>
                                ))}
                            </div>

                            <button onClick={handleNext} className="next-button" disabled={!selectedOption}>
                                {currentQuestionIndex < questions.length - 1 ? "Next" : "Finish"}
                            </button>
                        </div>
                    </div>
                ) : (
                    <h1>Loading questions...</h1>
                )
            ) : (
                // Show Results at the End
                <div className="results-container">
                    <div className="complete">
                    <h2>Quiz Completed!🎉</h2>
                    <h3>Your Score: <strong>{score} / {questions.length}</strong></h3>
                    <h2>SUMMARY</h2>
                    <div className="summary">
                    
                    <ul className="summary-list">
                        {answers.map((answer, index) => (
                            <li key={index} className={`summary-item ${answer.isCorrect ? "correct" : "incorrect"}`}>
                                <p><strong>Q{index + 1}: {answer.question}</strong></p>
                                <p><span className="selected">Your Answer: {answer.selectedAnswer}</span></p>
                                <p><span className="correct">Correct Answer: {answer.correctAnswer}</span></p>
                            </li>
                        ))}
                    </ul>
                    </div>
                    <button onClick={restartQuiz} className="restart-button">Restart Quiz</button>
                    </div>
                    <div className="leaders">    
                    <h2>LEADERBOARD🏆</h2>
                    <table className="leaderboard">
                        <thead>
                            <tr>
                                <th>RANK</th>
                                <th>USERNAME</th>
                                <th>SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.map((entry, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{entry.name}</td>
                                    <td>{entry.score} pts</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    </div>
                    
                </div>
            )}
        </div>
    );
};

export default QuizApp;