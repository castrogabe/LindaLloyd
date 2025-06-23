import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { Helmet } from 'react-helmet-async';

const MernRender = () => {
  return (
    <>
      <Helmet>
        <title>Admin Instructions</title>
      </Helmet>
      <Container className='content'>
        <br />
        <div className='box'>
          <h1>Admin Instructions</h1>
        </div>

        <Row md={12} className='box'>
          <h1>Create Product</h1>
          <h4>
            Admin dropdown {'>'} Products {'>'}
            <strong>
              <span style={{ color: 'blue' }}>
                {' '}
                + Create New Product Button
              </span>
            </strong>
          </h4>
          <img
            src='/images/newProduct.png'
            alt='products'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Click OK Alert</h1>

          <img src='/images/OK.png' alt='Click OK' className='img-fluid' />
        </Row>

        <Row md={12} className='box'>
          <h1>Edit name and id number with product Name {'>'} fill out form</h1>

          <img src='/images/editName.png' alt='' className='img-fluid' />
        </Row>

        <Row md={12} className='box'>
          <h1>Add Images from where you have them stored {'>'} open or add</h1>
          <img
            src='/images/openScreenshotsProduct.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>
            Select Category image or update (this will update all the categories
            images for the same category)
          </h1>
          <h4>
            <strong>
              <span style={{ color: 'red' }}>X </span>
              to replace or
              <span style={{ color: 'blue' }}> Update Button</span>
            </strong>
          </h4>
          <img
            src='/images/category images.png'
            alt='category'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Chairish Link in Footer</h1>
          <img
            src='/images/footerLink.png'
            alt='chairish'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Linda's Chairish page</h1>
          <img src='/images/chairish.png' alt='git' className='img-fluid' />
        </Row>

        <Row md={12} className='box'>
          <h1>Select your product on Chairish</h1>
          <img
            src='/images/chairishProduct.png'
            alt='chairish product'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Copy the link</h1>
          <img
            src='/images/chairishLink.png'
            alt='chairish link'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>
            Click
            <strong>
              <span style={{ color: 'blue' }}> Sold on Chairish</span> {'>'}{' '}
              paste link {'>'} click{' '}
              <span style={{ color: 'blue' }}> Update</span>
            </strong>
          </h1>

          <img
            src='/images/pasteChairishLink.png'
            alt='link'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>View new Chairish product link</h1>
          <img
            src='/images/viewChairish.png'
            alt='chairish'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Click and opens in Chairish</h1>
          <img
            src='/images/linkChairish.png'
            alt='chairish'
            className='img-fluid'
          />
        </Row>
        <div className='box'>
          <h1>New Product, follow same steps without clicking on Chairish</h1>
          <img src='/images/productEdit.png' alt='env' className='img-fluid' />
        </div>

        <br />
      </Container>
    </>
  );
};

export default MernRender;
