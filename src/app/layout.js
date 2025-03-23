"use client";

import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Provider } from "react-redux";
import store from "@/store/store";
import { metadata } from "./metadata";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Provider store={store}>
          <div className=" max-w-11/12 m-auto">
            <Navbar />

            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
