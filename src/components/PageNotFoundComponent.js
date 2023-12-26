// PageNotFoundComponent.jsx
import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';

const PageNotFoundComponent = () => {
  return (
    <Container className="mt-5">
      <Row>
        <Col md={6} className="mb-4">
          <Image
            src="https://sitechecker.pro/wp-content/uploads/2023/06/404-status-code.png"
            alt="404 Image"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default PageNotFoundComponent;

