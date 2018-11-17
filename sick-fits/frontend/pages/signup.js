import styled from 'styled-components';
import Signup from '../components/Signup';

const Column = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const SignupPage = () => {
  return (
    <Column>
      <Signup />
      <Signup />
      <Signup />
    </Column>
  );
};

export default SignupPage;
