import { createBrowserRouter } from "react-router";
import App from "../Pages/App.jsx";
import Home from "../Pages/Home.jsx";
import Layout from "../Layout.jsx";
import AboutUs from "../Pages/AboutUs.jsx";
import BookingForm from "../Pages/BookingForm.jsx";
import SignIn from "../Pages/SignIn.jsx"
import Departure from "../Pages/Departure.jsx"
import Return from "../Pages/Return.jsx"
import RoundTrip from "../Pages/RoundTrip.jsx"
import OneWay from "../Pages/OneWay.jsx"
import MultiCity from "../Pages/MultiCity.jsx"

const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/about",
        Component: AboutUs,
      },
      {
        path: "/departure",
        Component: Departure,
      },
      {
        path: "/round-trip",
        Component: RoundTrip,
      },
      {
        path: "/one-way",
        Component: OneWay,
      },
      {
        path: "/multi-city",
        Component: MultiCity ,
      },
      {
        path: "/return",
        Component: Return,
      },
      {
        path: "/booking",
        Component: BookingForm,
      },
      {
        path: "/sign-in",
        Component: SignIn,
      },
    ],
  },
]);

export default router;
