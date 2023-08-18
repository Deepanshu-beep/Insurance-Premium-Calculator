import React, { useState } from "react";
import styled from "@emotion/styled";
import axios from 'axios';
import Modal from 'react-modal';

const Field = styled.div`
  display: flex;
  margin-bottom: 1rem;
  align-items: center;
`;

const Label = styled.label`
  flex: 0 0 100px;
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 1rem;
  border: 1px solid #e1e1e1;
  -webkit-appearance: none;
`;

const Button = styled.button`
  background-color: #00838f;
  font-size: 16px;
  width: 100%;
  padding: 1rem;
  color: #fff;
  text-transform: uppercase;
  font-weight: bold;
  border: none;
  transition: background-color 0.3s ease;
  margin-top: 1.2rem;

  &:hover {
    cursor: pointer;
    background-color: #26c6da;
  }
`;

const Form = ({}) => {
    const [adults, setAdults] = useState(1);
    const [adultAges, setAdultAges] = useState(Array(adults).fill(''));
    const [children, setChildren] = useState(0);
    const [childrenAges, setChildrenAges] = useState(Array(children).fill(''));
    const [insuranceCover, setInsuranceCover] = useState('');
    const [insuranceTenure, setInsuranceTenure] = useState('');
    const [modalIsOpen, setModalIsOpen] = useState(false);
  
    const handleAdultsChange = (event) => {
      const newNumber = parseInt(event.target.value);
      setAdults(newNumber);
      setAdultAges(Array(newNumber).fill(''));
    };
  
    const handleAdultAgesChange = (event, index) => {
      const newInputValues = [...adultAges];
      newInputValues[index] = event.target.value;
      setAdultAges(newInputValues);
    };
  
    const handleChildrenChange = (event) => {
      const newNumber = parseInt(event.target.value);
      setChildren(newNumber);
      setChildrenAges(Array(newNumber).fill(''));
    };
  
    const handleChildrenAgesChange = (event, index) => {
      const newInputValues = [...childrenAges];
      newInputValues[index] = event.target.value;
      setChildrenAges(newInputValues);
    };
    
    const handleInsuranceCoverChange = (event) => {
      setInsuranceCover(event.target.value);
    };
  
    const handleInsuranceTenureChange = (event) => {
      setInsuranceTenure(event.target.value);
    };

    const handleModalOpen = () => {
      setModalIsOpen(true);
    };
  
    const handleModalClose = () => {
      setModalIsOpen(false);
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      try{
        handleModalOpen();
        const response = await axios.post('http://127.0.0.1:5000/calculate', {adultAges, childrenAges, insuranceCover, insuranceTenure}, { responseType: 'blob' })
        const blob = new Blob([response.data], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Premium.csv');
        document.body.appendChild(link);
        link.click();

        link.parentNode.removeChild(link);
        handleModalClose();
      }
      catch(error)  {
        console.error('Error',error);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <Field>
        <Label>Adults</Label>
        <Select name="adult" value={adults} onChange={handleAdultsChange}>
          <option value="1">1</option>
          <option value="2">2</option>
        </Select>
      </Field>
        {adultAges.map((value, index) => (
            <div key={index}>
              <Label>Adult {index + 1} Age    </Label>
              <input
                type="text"
                value={value}
                onChange={(event) => handleAdultAgesChange(event, index)}
              />
            </div>
          ))}
      <Field>
        <Label>Children</Label>
        <Select name="children" value={children} onChange={handleChildrenChange}>
          <option value="0">0</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </Select>
      </Field>
        {childrenAges.map((value, index) => (
            <div key={index}>
              <Label>Child {index + 1} Age    </Label>
              <input
                type="text"
                value={value}
                onChange={(event) => handleChildrenAgesChange(event, index)}
              />
            </div>
          ))}
        <Field>
            <Label>Cover Amount</Label>
            <input
                type="text"
                value={insuranceCover}
                onChange={handleInsuranceCoverChange}
            />
        </Field>
        <Field>
            <Label>Tenure (in years)</Label>
            <input
                type="text"
                value={insuranceTenure}
                onChange={handleInsuranceTenureChange}
            />
        </Field>
        <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose} className="modal-content">
          <div>
            <p>Please Wait, while we generate your premium...</p>
          </div>
        </Modal>
      <Button type="submit">Purchase</Button>
    </form>
  );
};

export default Form;