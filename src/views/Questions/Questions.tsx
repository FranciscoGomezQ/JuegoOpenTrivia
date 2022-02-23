import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Questions = () => {
  const { state } = useLocation();
  const [userData, setUserData] =
    useState<{ user: string; difficulty: string }>();
  const [questions, setQuestions] = useState<any[]>([]);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [answers, setAnswers] = useState<any[]>([]);
  const [question, setQuestion] = useState<string>("");
  const prizes = [10000, 9000, 8000, 7000, 6000, 5000, 4000, 3000, 2000, 1000];
  const [earnings, setEarnings] = useState(0);
  const [initialTime, setInitialTime] = useState(30);
  const [isCorrect, setIsCorrect] = useState(false);
  const options2 = { currency: "USD" };
  const numberFormat2 = new Intl.NumberFormat("en-US", options2);
  const navigator = useNavigate();

  useEffect(() => {
    const data: any = state;
    const answersArray: any[] = [];
    setUserData(data);

    axios
      .get(
        `https://opentdb.com/api.php?amount=10&category=${data.category}&difficulty=${data.difficulty}&type=multiple`
      )
      .then((res) => {
        setQuestions(res.data.results);
        res.data.results[0].incorrect_answers.forEach(
          (incorrectAnswer: string) => {
            answersArray.push({
              isCorrectAnswer: false,
              answer: incorrectAnswer,
            });
          }
        );
        const randomPosition = Math.floor(Math.random() * 4);
        answersArray.splice(randomPosition, 0, {
          isCorrectAnswer: true,
          answer: res.data.results[0].correct_answer,
        });
        setAnswers(answersArray);
        setQuestion(res.data.results[0].question.replace(/&quot;/g, '"'));
      });
  }, []);

  useEffect(() => {
    const answersArray: any[] = [];
    if (questions.length > 0 && questionNumber < questions.length) {
      questions[questionNumber].incorrect_answers.forEach(
        (incorrectAnswer: string) => {
          answersArray.push({
            isCorrectAnswer: false,
            answer: incorrectAnswer,
          });
        }
      );
      const randomPosition = Math.floor(Math.random() * 4);
      answersArray.splice(randomPosition, 0, {
        isCorrectAnswer: true,
        answer: questions[questionNumber].correct_answer,
      });
      setAnswers(answersArray);
      setQuestion(questions[questionNumber].question.replace(/&quot;/g, '"'));
    } else if (questionNumber === questions.length && question.length > 0) {
      setAnswers([]);
      setQuestion("You Win");
    }
  }, [questionNumber]);

  useEffect(() => {
    if (initialTime > 0) {
      const timer = setTimeout(() => {
        setInitialTime(initialTime - 1);
      }, 1000);
      if (isCorrect) {
        clearTimeout(timer);
      }
      return () => clearTimeout(timer);
    } else if (initialTime <= 0) {
      navigator("/");
    }
  }, [initialTime, isCorrect]);

  const questionChecker = (isCorrect: boolean, element: any) => {
    if (isCorrect) {
      element.classList.add("bg-success");
      setIsCorrect(true);
      setTimeout(() => {
        element.classList.remove("bg-success");
        setQuestionNumber(questionNumber + 1);
        setEarnings(earnings + 1000 * (questionNumber + 1));
        setInitialTime(30);
        setIsCorrect(false)
      }, 5000);
    } else {
      element.classList.add("bg-danger");
      setTimeout(() => navigator("/"), 2000);
    }
  };

  return (
    <div className="vh-100">
      <div
        className="d-flex justify-content-between border-bottom border-dark p-2"
        style={{ height: "8%" }}
      >
        <Typography variant="h5" component="div">
          Player Name: {userData?.user}
        </Typography>
        <Typography variant="h5" component="div">
          Difficulty: {userData?.difficulty}
        </Typography>
        <Typography variant="h5" component="div">
          Earnings: {earnings}$
        </Typography>
      </div>
      <div className="row m-0" style={{ height: "92%" }}>
        <div
          className="col-9 d-flex flex-column justify-content-center"
          style={{ position: "relative" }}
        >
          <IconButton
            aria-label="delete"
            style={{ width: "10%", position: "absolute", left: 0, top: 0 }}
            onClick={() => navigator("/")}
          >
            <LogoutIcon />
          </IconButton>
          {question !== "You Win" && questions.length > 0 ? (
            <Typography
              variant="h5"
              component="div"
              className="border border-dark"
              style={{ borderRadius: "50%", width: "4%", alignSelf: "center" }}
            >
              {initialTime}
            </Typography>
          ) : null}
          <Typography variant="h6" component="div">
            {questionNumber !== undefined &&
            questions.length > 0 &&
            questionNumber <= questions.length
              ? question
              : "This category does not have questions, please return to the previous screen and select another difficulty or category"}
          </Typography>
          <div className="row">
            {answers.map((answer, index) => (
              <div className="col-6 p-2" key={index}>
                <Button
                  variant="contained"
                  style={{ width: "100%" }}
                  onClick={(event) =>
                    questionChecker(answer.isCorrectAnswer, event.target)
                  }
                >
                  {answer.answer}
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="col-3 p-5 border-start border-dark">
          {prizes.map((prize, index, prizes) => (
            <Typography
              variant="h5"
              component="div"
              key={index}
              style={{ width: "100%" }}
              className={
                index === questions.length - questionNumber - 1
                  ? "border border-success"
                  : ""
              }
            >
              {`${prizes.length - index} $${numberFormat2.format(prize)}`}
            </Typography>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Questions;
