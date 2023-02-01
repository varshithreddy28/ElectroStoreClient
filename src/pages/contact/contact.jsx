import React, { useState } from "react";
import {
  Container,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import emailjs from "emailjs-com";

import "./contact.css";

function Contact() {
  const [name, setName] = useState(null);
  const [message, setMessage] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [email, setEmail] = useState(null);
  const [company, setCompany] = useState(null);

  const [AlertMessage, setAlertMessage] = useState("");
  const [DangerMessage, setDangerMessage] = useState("");

  const handleEmail = (e) => {
    e.preventDefault();
    console.log(e.target, ".//./..././././.");
    const contactDetails = { name, phoneNumber, email, message, company };
    console.log(contactDetails, process.env);
    emailjs
      .sendForm(
        process.env.REACT_APP_SERVICE,
        process.env.REACT_APP_TEMPLATE_ID,
        e.target,
        process.env.REACT_APP_USER_ID
      )
      .then((res) => {
        console.log(res.status, "Is response....................");
        if (res.status == 200) {
          setAlertMessage(
            "Thank's for contacting us will get back to you soon!"
          );
          setName("");
          setCompany("");
          setEmail("");
          setMessage("");
          setPhoneNumber("");
        }
      })
      .catch((err) => {
        console.log(err);
        setDangerMessage(err);
      });
  };

  return (
    <Container>
      {AlertMessage ? (
        <Alert
          color="success"
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          {AlertMessage}
        </Alert>
      ) : (
        ""
      )}
      {DangerMessage ? (
        <Alert
          color="danger"
          style={{ marginTop: "10px", textAlign: "center" }}
        >
          {DangerMessage}
        </Alert>
      ) : (
        ""
      )}

      <div className="contact">
        <div className="contact_form">
          <h4 id="contact_us">Contact Us: </h4>
          <form onSubmit={handleEmail}>
            <div className="row1_contact row" form>
              <div className="col-md-5 offset-md-1">
                <Label for="exampleEmail">Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="exampleEmail"
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className=" col-md-5">
                <Label for="companyContact">Company</Label>
                <Input
                  type="text"
                  name="company"
                  id="companyContact"
                  placeholder="Company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>
            <div className="row1_contact row " form>
              <div className="col-md-5 offset-md-1">
                <Label for="email">Email</Label>
                <Input
                  type="text"
                  name="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className=" col-md-5">
                <Label for="phoneNumber">Phone Number</Label>
                <Input
                  type="number"
                  name="phonenumber"
                  id="phoneNumber"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>
            <Row form className="col-md-10 offset-md-1 message_contact">
              <FormGroup>
                <Label for="message">Message</Label>
                <Input
                  type="textarea"
                  name="message"
                  id="message"
                  placeholder="Message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </FormGroup>
            </Row>
            <div className="send_message">
              <button type="submit" id="submit_contact">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </Container>
  );
}

export default Contact;
