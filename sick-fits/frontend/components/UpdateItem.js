import React, { Component } from 'react';
import { Mutation, Query } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import formatMoney from '../lib/formatMoney';
import Error from './ErrorMessage';
import { ALL_ITEMS_QUERY } from './Items';

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      image
      largeImage
    }
  }
`;

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
    $image: String
    $largeImage: String
  ) {
    updateItem(
      data: {
        title: $title
        description: $description
        image: $image
        largeImage: $largeImage
        price: $price
      }
      where: { id: $id }
    ) {
      id
    }
  }
`;

class UpdateItem extends Component {
  state = {
    file: {},
    image: '',
    largeImage: '',
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

  handleUpdateItem = async (e, updateItemMutation) => {
    e.preventDefault();
    if (this.state.image) {
      await this.uploadFile();
    }
    const updates = Object.keys(this.state).reduce((data, key) => {
      const state = { ...this.state };
      if (!state[key] || key === 'file') return data;
      return {
        ...data,
        [key]: this.state[key]
      };
    }, {});
    const res = await updateItemMutation({
      variables: {
        id: this.props.id,
        ...updates
      }
    });
  };

  render() {
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error: {error.message}</p>;
          return (
            <Mutation
              mutation={UPDATE_ITEM_MUTATION}
              refetchQueries={[{ query: ALL_ITEMS_QUERY }]}
            >
              {(updateItem, { loading, error }) => (
                <Form onSubmit={e => this.handleUpdateItem(e, updateItem)}>
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
                        onChange={this.handlePreviewImage}
                      />
                    </label>
                    {data.item.image && (
                      <img
                        width="200"
                        src={this.state.image || data.item.image}
                        alt="Upload Preview"
                      />
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
                        defaultValue={data.item.title}
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
                        defaultValue={data.item.price}
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
                        defaultValue={data.item.description}
                      />
                    </label>
                    <button type="submit">
                      Sav
                      {loading ? 'ing' : 'e'} Changes
                    </button>
                  </fieldset>
                </Form>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default UpdateItem;
export { UPDATE_ITEM_MUTATION };
