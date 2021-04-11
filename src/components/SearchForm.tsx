import React, { useState } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import SearchButton from "./SearchButton";
import { onError } from "../libs/errorLib";
import config from "../config";

export default function SearchForm() {
  const [policyId, setPolicyId] = useState(0);
  const [pet, setPet] = useState("");
  const [age, setAge] = useState(0);
  const [excess, setExcess] = useState(true);
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  /*function validateForm() {
    return email.length > 0 && password.length > 0;
  }*/

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    setIsLoading(true);

    try {
      await searchQuotes();
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  async function searchQuotes() {
    return API.post("quotes", "/", {
      body: {
        policyId,
        pet,
        age,
        excess,
        breeds
      }
    });
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="policyId">
          <Form.Label>Policy</Form.Label>
          <Form.Control
            autoFocus
            as="select"
            value={policyId}
            onChange={(e) => setPolicyId(parseInt(e.target.value))}
          >
          </Form.Control>
        </Form.Group>
       

        <SearchButton
          block
          size="lg"
          type="submit"
        >
          Get Prices
        </SearchButton>
      </Form>
    </div>
  );
}