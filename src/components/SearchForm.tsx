import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import SearchButton from "./SearchButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import Policy from "../types/policies";
import Col from "react-bootstrap/esm/Col";
import { Row } from "react-bootstrap";

export default function SearchForm() {
  const [policyId, setPolicyId] = useState(0);
  const [pet, setPet] = useState("");
  const [age, setAge] = useState(0);
  const [excess, setExcess] = useState(true);
  const [breeds, setBreeds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[] | undefined> (undefined)

  /*function validateForm() {
    return email.length > 0 && password.length > 0;
  }*/
  useEffect(() => {
    async function onLoad() {
      try {
        const policies: Policy[] = await loadPolicies();
        setPolicies(policies);
      } catch (e) {
        onError(e);
      }
  
      setIsLoading(false);
    
    }
    
    onLoad();
  }, []);

  async function loadPolicies() {
    const result = await API.get("quotes", "/policies", {});
    console.log(result?.Items)
    return result?.Items;
  }

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
          
        <Form.Row>
          <Col className="mr-4">
            <Form.Label>Policy</Form.Label>
            <Form.Control
              autoFocus
              as="select"
              value={policyId}
              onChange={(e) => setPolicyId(parseInt(e.target.value))}>
                
              {policies?.map(({ policyId, name }) => (
                <option value={policyId}>{name}</option>
              ))}
            </Form.Control>
          </Col>
          <Col>
            <Form.Group controlId="kindOfStand">
              <Form.Label>Pet</Form.Label>
              <Form.Check
                value="dog"
                type="radio"
                aria-label="radio 1"
                label="Dog"
                //onChange={handleChange}
                //checked={kindOfStand === "design"}
              />
              <Form.Check
                  value="cat"
                  type="radio"
                  aria-label="radio 2"
                  label="Cat"
                  //onChange={(e) => setPet(e.target.)}>
                  // checked={kindOfStand === "food"}
                />
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col className="mr-4">
            <Form.Group controlId="formBasicRange">
              <Form.Label>Pet Age(months)</Form.Label>
              <Form.Control
                onChange={(e) => setAge(parseInt(e.target.value))}
              />
              
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" label="Excess" />
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>

            <SearchButton
              block
              type="submit"
            >
              Get Prices
            </SearchButton>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}