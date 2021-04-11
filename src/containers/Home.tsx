import React, { useState, useEffect } from "react";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";

import SearchForm from "../components/SearchForm";

import ListGroup from "react-bootstrap/ListGroup";


import "./Home.css";

interface Quote {
  policyName: string,
  breed: string,
  basePrice: number,
  finalPrice: number
}

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function onLoad() {
      try {
        const quotes = await loadNotes();
        setQuotes(quotes);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    
    }
    
    onLoad();
  }, []);
  
  function loadNotes() {
    return API.get("quotes", "/", {});
  }

  function renderQuotesList(quotes: Array<Quote>) {
    return (
        <>
          {quotes.map(({ policyName, breed, basePrice, finalPrice }) => (
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {breed}
              </span>
              <br />
              <span className="text-muted">
                  Base Price: {basePrice}
              </span>
              <br />
              <span className="text-muted">
                  Final Price: {finalPrice}
              </span>
            </ListGroup.Item>

          ))}
        </>
      );
  }


  function renderQuotes() {
    return (
      <div className="notes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Quotes</h2>
        <ListGroup>{renderQuotesList(quotes)}</ListGroup>
      </div>
    );
  }

  return (
    <div className="Home">
      <SearchForm  />
      {renderQuotes()}
    </div>
  );
}
