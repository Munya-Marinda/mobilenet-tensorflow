import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";

function App() {
  const [predictions, setPredictions] = useState([]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const image = document.createElement("img");
    const reader = new FileReader();

    reader.onload = async (e) => {
      image.src = e.target.result;
      await classifyImage(image);
    };

    reader.readAsDataURL(file);
  };

  const classifyImage = async (image) => {
    const model = await mobilenet.load();
    const predictions = await model.classify(image);

    setPredictions(predictions);
  };

  return (
    <Container>
      <Row
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col style={{ border: "1px solid gray", maxWidth: "500px" }}>
          <Form style={{ padding: "50px 20px" }}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Select an Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <Form.Text className="text-muted">
                Upload an image and click the button to classify.
              </Form.Text>
            </Form.Group>
            <Button variant="primary" type="button">
              Submit
            </Button>
          </Form>
          <div className="predictions">
            <h3>Predictions:</h3>
            {predictions.length > 0 ? (
              <ul>
                {predictions.map((prediction, index) => (
                  <li key={index}>{`${prediction.className} (${(
                    prediction.probability * 100
                  ).toFixed(2)}%)`}</li>
                ))}
              </ul>
            ) : (
              <p>No predictions yet.</p>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
