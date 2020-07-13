import React from 'react';
import { Route , BrowserRouter ,Switch} from 'react-router-dom';
import { ProtectedRoute } from './components/protectedroutes';
import './App.css';
import LoginSignup from './components/loginSignup';
import LoginStudent from "./components/login_student";
import LoginFaculty from "./components/login_faculty";
import SignupStudent from "./components/signup_student";
import SignupFaculty from "./components/signup_faculty";
import studentPanel from './components/studentPanel';
import facultyPanel from './components/facultyPanel';
import addProblem from './components/addProblem';
import JoiningRequest from './components/joiningRequest';
import ShowProblemStudent from './components/ShowProblemStudent';
import MySubmissionStudent from './components/mySubmissionStudent';
import ExpandQuestion from './components/expandQuestion';
import ShowProblemWithCode from "./components/showProblemWithCode";
import SubmissionReview from './components/submissionReview';
import ReviewQuestion from './components/reviewQuestion';
import Faculty_ShowAll from './components/faculty_showAll';
import Faculty_ExpandQuestion from './components/faculty_expandQuestion'
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Switch>
        <Route path="/" exact component = {LoginSignup} />
        <Route exact path="/students/studentLogin" component = {LoginStudent} />
        <Route exact path="/faculty/facultyLogin"  component = {LoginFaculty} />
        <Route exact path="/students/studentSignup"  component = {SignupStudent} />
        <Route exact path="/faculty/facultySignup"  component = {SignupFaculty} />
        <ProtectedRoute exact path="/students/:id"  component={studentPanel} />
        <ProtectedRoute exact path="/faculty/:id"  component={facultyPanel} />
        <ProtectedRoute exact path="/student/ShowProblemsStudent/:id" component = {ShowProblemStudent} />
        <ProtectedRoute exact path="/student/SubmittedStudent/:id" component = {MySubmissionStudent} />
	<ProtectedRoute path = "/student/SubmittedStudent/:id/:question_id" component = {ShowProblemWithCode} />        
	<ProtectedRoute path = "/addProblem/:id"  component = {addProblem} />
        <ProtectedRoute path = "/joiningrequest/:id"  component = {JoiningRequest}/>
	<ProtectedRoute path = "/submissionReview/:id" component = {SubmissionReview} />
        <ProtectedRoute path = "/student/ShowProblemStudent/:id/:question_id" component = {ExpandQuestion} />
	<ProtectedRoute path = "/faculty/ReviewQuestions/:id/:question_id/:student_id" component = {ReviewQuestion} />
	<ProtectedRoute path = "/faculty/:id/showAllProblem" component = {Faculty_ShowAll} />
	<ProtectedRoute path = "/faculty/expandedQuestion/:id/:question_id" component = {Faculty_ExpandQuestion} />	
        <ProtectedRoute path="*" component={ () => <h1>404 Page not found</h1>}/>
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
