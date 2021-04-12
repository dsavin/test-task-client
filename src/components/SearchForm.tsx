import React, { useEffect, useState } from "react";
import { API } from "aws-amplify";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import SearchButton from "./SearchButton";
import { onError } from "../libs/errorLib";
import config from "../config";
import Policy from "../types/policies";
import Col from "react-bootstrap/esm/Col";
import { ListGroup, Row } from "react-bootstrap";
import Breed from "../types/breeds";
import Quote from "../types/quote";

export default function SearchForm() {
  const [policyId, setPolicyId] = useState(1);
  const [breedId, setBreedId] = useState(0);
  const [age, setAge] = useState(0);
  const [excess, setExcess] = useState(true);
  const [breeds, setBreeds] = useState<Breed[] | undefined> (undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [policies, setPolicies] = useState<Policy[] | undefined> (undefined)
  const [quotes, setQuotes] = useState([]);


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

  async function loadBreeds(pet: String) {
    const result = await API.get("quotes", "/breeds/" + pet, {});
    console.log(result?.Items)
    setBreeds(result?.Items)
    return result?.Items;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    setIsLoading(true);

    try {
      const quotes = await searchQuotes();
      console.log('quotes', quotes)
      setQuotes(quotes)
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }
  
  async function searchQuotes() {
    return API.post("quotes", "/", {
      body: {
        policyId,
        age,
        excess,
        breedId
      }
    });
  }

  function renderQuotesList(quotes: Array<Quote>) {
    return (
        <>
          {quotes.map(({ policyName, breed, basePrice, finalPrice, breedModifier, excessCorrection, petModifier, ageCorrection  }) => (
            <ListGroup.Item action>
              <span className="font-weight-bold">
                {policyName} insuranfe for {breed}, {age} months old
              </span>
              <br />
              <span className="text-muted">
                  Base Price: {basePrice}
              </span>
              <br />
              <br />
              <span className="text-muted">
                  Pet Modifier: {petModifier}
              </span>
              <br />
              <span className="text-muted">
                  Breed Modifier: {breedModifier}
              </span>
              <br />
              <span className="text-muted">
                  Age Correction: {ageCorrection}
              </span>
              <br />
              <span className="text-muted">
                Excess Correction: {excessCorrection}
              </span>
              <br />
              <br />
              <span className="font-weight-bold">
                  Final Price: {finalPrice}
              </span>
            </ListGroup.Item>

          ))}
        </>
      );
  }

  function renderQuotes() {
    return (
      <div className="quotes">
        <h2 className="pb-3 mt-4 mb-3 border-bottom">Quotes</h2>
        <ListGroup>{renderQuotesList(quotes)}</ListGroup>
      </div>
    );
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
              onChange={(e) => setPolicyId(parseInt(e.currentTarget.value))}>
                
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
                name="pet"
                onChange={(e) => loadBreeds(e.currentTarget.value.toString())}
                //checked={kindOfStand === "design"}
              />
              <Form.Check
                  value="cat"
                  type="radio"
                  aria-label="radio 2"
                  label="Cat"
                  name="pet"
                  onChange={(e) => loadBreeds(e.currentTarget.value.toString())}
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
                onChange={(e) => setAge(parseInt(e.currentTarget.value))}
              />
              
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                onChange={(e) => setExcess(e.currentTarget.checked)}
                label="Excess" />
            </Form.Group>
          </Col>
        </Form.Row>
        <Form.Label>Breeds</Form.Label>
          <Form.Control
            autoFocus
            onChange={(e) => setBreedId(parseInt(e.currentTarget.value))}
            as="select">
            
            {breeds?.map(({ breedId, name }) => (
              <option value={breedId}>{name}</option>
            ))}
          </Form.Control>
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
      {renderQuotes()}
    </div>

    
  );
}