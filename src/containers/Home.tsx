import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";

import SearchForm from "../components/SearchForm";

import ListGroup from "react-bootstrap/ListGroup";


import "./Home.css";



export default function Home() {

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    /*async function onLoad() {
      try {
        const quotes = await loadQuotes();
        setQuotes(quotes);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    
    }
    
    onLoad();*/
  }, []);
  
  async function loadQuotes() {
    return API.post("quotes", "/", {});
  }






  return (
    <div className="Home">
      <SearchForm  />

    </div>
  );
}
