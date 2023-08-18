import Form from './form';
import Header from './header';
import './App.css';
import styled from "@emotion/styled";

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const FormContainer = styled.div`
  background-color: #ffffff;
  padding: 3rem;
`;

function App() {
  return (
    <div className='App'>
      <Container>
        <Header title="Insurance Calculator" />
        <FormContainer>
          <Form />
        </FormContainer>
      </Container>
    </div>
  );
}

export default App;
