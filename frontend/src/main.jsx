// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// // import 'swiper/css'

// // //Bootstap css
// // import 'bootstrap/dist/css/bootstrap.min.css'
// // import 'bootstrap/dist/js/bootstrap.min.js'

// // // fonts and icons 
// // import '././assets/css/iconfont.css'
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App/>
//   },
// ]);

// createRoot(document.getElementById('root')).render(
//   <RouterProvider router={router} />
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
