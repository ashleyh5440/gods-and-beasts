import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from './App.jsx'
import './index.css'

//pages
import Home from './pages/Home';
import Game from './pages/Game';
import Lore from './pages/Lore';
import CreateDeck from './pages/CreateDeck';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Options from './pages/Options';
import Scores from './pages/Scores';
import CardDeck from './components/CardDeck';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: '/game',
        element: <Game />,
      },
      {
        path: '/createdeck',
        element: <CreateDeck />,
      },
      {
        path: '/options',
        element: <Options />,
      },
      {
        path: '/scores',
        element: <Scores />,
      },
      {
        path: '/carddeck',
        element: <CardDeck />,
      },
      {
        path: '/lore',
        element: <Lore />,
      },
      {
        path:'/signup',
        element: <Signup />,
      },
      {
        path: '/login',
        element: <Login />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);