"use client";

import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import store from "@/store/store";
import { metadata } from "./metadata";
import UserLoader from "@/components/UserLoader";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Provider store={store}>
          <UserLoader />
          <Navbar />
          <div className=" max-w-11/12 m-auto ">
            <div className="min-h-screen">{children}</div>
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
