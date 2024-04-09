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
import LogIn from './pages/LogIn';
import SignUp from './pages/SignUp';
import Options from './pages/Options';

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
      // {
      //   path: '/store',
      //   element: <Store />,
      // },
      {
        path: '/lore',
        element: <Lore />,
      },
      {
        path:'/signup',
        element: <SignUp />,
      },
      {
        path: '/login',
        element: <LogIn />
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />
);
