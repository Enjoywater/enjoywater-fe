import React from 'react';
import styled from 'styled-components';

function Custom404() {
  return (
    <Container>
      <p>존재하지 않는 페이지입니다.</p>
    </Container>
  );
}

export default Custom404;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 240px;

  p {
    font-size: 16px;
  }
`;
