import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      data: {
        title: $title
        description: $description
        image: $image
        largeImage: $largeImage
        price: $price
      }
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: '',
    description: '',
    image: '',
    largeImage: '',
    file: {},
    price: 0,
    imageUploading: false
  };

  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
    this.setState({ [name]: val });
  };

  handlePreviewImage = e => {
    this.setState({ imageUploading: true });
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => {
        this.setState({ image: reader.result, file, imageUploading: false });
      },
      false
    );
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  uploadFile = () =>
    new Promise(async (resolve, reject) => {
      this.setState({ imageUploading: true });
      const data = new FormData();
      data.append('file', this.state.file);
      data.append('upload_preset', 'sickfits');
      try {
        const res = await fetch(
          'https://api.cloudinary.com/v1_1/dazafk4g5/image/upload',
          {
            method: 'POST',
            body: data
          }
        );
        const file = await res.json();
        this.setState({
          image: file.secure_url,
          largeImage: file.eager[0].secure_url,
          imageUploading: false
        });
      } catch (err) {
        reject(err);
      }
      resolve();
    });

  createItem = async (e, createItemMutation) => {
    e.preventDefault();
    if (this.state.image) {
      await this.uploadFile();
    }
    const res = await createItemMutation();
    Router.push({
      pathname: '/item',
      query: { id: res.data.createItem.id }
    });
  };

  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form onSubmit={e => this.createItem(e, createItem)}>
            <Error error={error} />
            <fieldset
              disabled={loading || this.state.imageUploading}
              aria-busy={loading || this.state.imageUploading}
            >
              <label htmlFor="file">
                Image
                <input
                  type="file"
                  id="file"
                  name="file"
                  placeholder="Upload an image"
                  required
                  onChange={this.handlePreviewImage}
                />
              </label>
              {this.state.image && (
                <img width="200" src={this.state.image} alt="Upload Preview" />
              )}
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  required
                  onChange={this.handleChange}
                  value={this.state.title}
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  required
                  onChange={this.handleChange}
                  value={this.state.price}
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  id="description"
                  name="description"
                  placeholder="Description"
                  required
                  onChange={this.handleChange}
                  value={this.state.description}
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
