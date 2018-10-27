import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';

const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION(
    $email: String!
    $name: String!
    $password: String!
  ) {
    signup(email: $email, name: $name, password: $password) {
      id
      email
      name
    }
  }
`;

class Signup extends Component {
  state = {
    email: '',
    password: '',
    name: ''
  };

  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  render() {
    return (
      <Mutation mutation={SIGNUP_MUTATION} variables={this.state}>
        {(singup, { error, loading }) => {
          return (
            <Form
              method="post"
              onSubmit={async e => {
                e.preventDefault();
                await singup();
                this.setState({ name: '', email: '', password: '' });
              }}
            >
              <fieldset disabled={loading} aria-busy={loading}>
                <h2>Sign up for account</h2>
                <Error error={error} />
                <label htmlFor="email">
                  Email
                  <input
                    type="email"
                    name="email"
                    value={this.state.email}
                    placeholder="email"
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="name">
                  Name
                  <input
                    type="text"
                    name="name"
                    value={this.state.name}
                    placeholder="name"
                    onChange={this.saveToState}
                  />
                </label>
                <label htmlFor="password">
                  Password
                  <input
                    type="password"
                    name="password"
                    value={this.state.password}
                    placeholder="password"
                    onChange={this.saveToState}
                  />
                </label>
                <button type="submit">Sign Up</button>
              </fieldset>
            </Form>
          );
        }}
      </Mutation>
    );
  }
}

export default Signup;
