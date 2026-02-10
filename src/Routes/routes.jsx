import { createBrowserRouter } from "react-router";
import Home from "../Pages/Home.jsx";
import Layout from "../Layout.jsx";
import BookingForm from "../Pages/BookingForm.jsx";
import SignIn from "../Pages/SignIn.jsx"
import Departure from "../Pages/Departure.jsx"
import Return from "../Pages/Return.jsx"
import RoundTrip from "../Pages/RoundTrip.jsx"
import OneWay from "../Pages/OneWay.jsx"
import Profile from "../Pages/Profile.jsx"
import EditInfo from "../components/EditInfo.jsx"

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
      {
        path: "/profile",
        Component: Profile,
      },
      {
        path: "/edit-info",
        Component: EditInfo,
      },
    ],
  },
]);

export default router;
