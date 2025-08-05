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
            src='/images/addCategoryImage.png'
            alt='category'
            className='img-fluid'
          />
        </Row>

        <hr />
        <br />

        <Row md={12} className='box'>
          <h1>Shipping Options Checkbox</h1>
          <h4>
            <strong>
              <span style={{ color: 'red' }}>Check </span>
              Flat Rate
              <span style={{ color: 'blue' }}> Enter Shipping Charge</span>
            </strong>
          </h4>
          <img
            src='/images/shipping/FlatRate.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Flat-Rate Admin Shipping Actions in Orders</h1>
          <h4>
            Enter Shipping Details: Delivery Days, Carrier Name, Tracking Number
            Form
          </h4>
          <img
            src='/images/shipping/flat-rate.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Flat-Rate Admin Shipping Actions in Orders</h1>
          <h4>Example form filled out</h4>
          <img
            src='/images/shipping/flat-rateDetails.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h4>Completed Shipping Status</h4>
          <img
            src='/images/shipping/flat-rateShipped.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <hr />
        <br />

        <Row md={12} className='box'>
          <h1>Shipping Options Checkbox</h1>
          <h4>
            <strong>Invoiced Shipping Charge after order</strong>
            <span style={{ color: 'blue' }}>
              {' '}
              Sent from Orders Page Admin only
            </span>
          </h4>
          <img
            src='/images/shipping/Invoiced.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Admin Shipping Send Invoice $ dollar amount</h1>
          <img
            src='/images/shipping/invoicedOrder.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Admin added $ dollar amount</h1>
          <img
            src='/images/shippingPriceInvoiced.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Customer Gets email (ex: sandbox)</h1>
          <img
            src='/images/shipping/invoicedChargeEmail.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Customer Invoice Paid email (ex: sandbox)</h1>
          <img
            src='/images/shipping/invoicedChargePaid.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Admin Mark Invoice Paid</h1>
          <img
            src='/images/shipping/markInvoicePaid.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Admin enter Invoiced Shipping Details</h1>
          <img
            src='/images/shipping/invoicedShippingDetails.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Shipping Invoiced Details</h1>
          <img
            src='/images/shipping/invoicedDetails.png'
            alt='add images'
            className='img-fluid'
          />
        </Row>

        <hr />
        <br />

        <Row md={12} className='box'>
          <h1>Chairish Link in Footer</h1>
          <img
            src='/images/chairish/footerLink.png'
            alt='chairish'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Linda's Chairish page</h1>
          <img
            src='/images/chairish/chairish1.png'
            alt='git'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Select your product on Chairish</h1>
          <img
            src='/images/chairish/chairishProduct.png'
            alt='chairish product'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Copy the link</h1>
          <img
            src='/images/chairish/chairishLink.png'
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
            src='/images/chairish/pasteChairishLink.png'
            alt='link'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>View new Chairish product link</h1>
          <img
            src='/images/chairish/viewChairish.png'
            alt='chairish'
            className='img-fluid'
          />
        </Row>

        <Row md={12} className='box'>
          <h1>Click and opens in Chairish</h1>
          <img
            src='/images/chairish/chairishProduct.png'
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
