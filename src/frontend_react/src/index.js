import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Login from './routes/Login'
import SignUp from './routes/SignUp'
import GameBoard from './routes/BattleField';
import Settings from './routes/Settings'
import ChangePassword from './routes/ChangePassword';
import Rating from './routes/Rating';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter } from 'react-router-dom'
import { RouterProvider } from 'react-router';

const router = createBrowserRouter([
  {path: '/', element: <App />},
  {path: '/settings', element: <Settings />},
  {path: '/login', element: <Login />},
  {path: '/signup', element: <SignUp />},
  {path: '/battlefield', element: <GameBoard />},
  {path: '/change_passwords', element: <ChangePassword />},
  {path: '/rating', element: <Rating />}
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <RouterProvider router={router} />
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
