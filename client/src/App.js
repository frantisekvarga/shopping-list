import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { I18nextProvider } from 'react-i18next'; // Import this
import i18n from './i18n';

import Home from './Home';
import Navbar from './components/Outlet/Navbar';
import Footer from './components/Outlet/Footer';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import TodoList from './pages/todolist/TodoList';
import TodoDetail from './pages/todolist/TodoDetail'; 
import AddTodoList from './pages/todolist/AddTodoList'; 
import FindToDo from './pages/todooptions/FindToDo';
import SuccessPage from './pages/successpage/SuccessPage';
import AddMembers from './pages/todolist/AddMembers';
import NotFound from './pages/NotFound';
import MyTodoLists from './pages/todolist/MyTodoLists';
import AvailableLists from './pages/todolist/AvaibleLists';
import { UserProvider } from './context/UserProvider';
import { TodoProvider } from './context/TodoProvider';
import { ThemeProvider } from './context/ThemeProvider'; 



function App() {

  return (
    <I18nextProvider i18n={i18n}>
    
      <UserProvider>
        <TodoProvider>
          <ThemeProvider> 
            <Router>
              <div className="app-container">
                <Navbar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/user-login" element={<Login />} />
                    <Route path="/user-register" element={<Register />} />
                    <Route path="/todo-list" element={<TodoList />} />
                    <Route path="/todo/:id/details" element={<TodoDetail />} /> 
                    <Route path="/add-todo" element={<AddTodoList />} /> 
                    <Route path="/my-lists" element={<MyTodoLists />} />
                    <Route path="/avaible-lists" element={<AvailableLists />} />
                    <Route path="/todolists" element={<FindToDo />} />
                    <Route path="/success-operation" element={<SuccessPage />} />
                    <Route path="/lists/:id/members" element={<AddMembers />} />
                    <Route path="*" element={<NotFound />} /> 
                  </Routes>
                </div>
                <Footer />
              </div>
            </Router>
          </ThemeProvider>
        </TodoProvider>
      </UserProvider>
    </I18nextProvider>
    
  );
}

export default App;
