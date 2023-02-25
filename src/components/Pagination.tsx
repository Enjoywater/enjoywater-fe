import React from 'react';
import styled from 'styled-components';

import Link from 'next/link';

import usePagination from 'hooks/usePagination';

import { VscChevronLeft, VscChevronRight } from 'react-icons/vsc';

type PaginationProps = {
  page: string;
  totalCount: number;
};

const Pagination = ({ page, totalCount }: PaginationProps) => {
  const { currentPageGroup, prevPageGroup, nextPageGroup, isFirst, isLast } = usePagination(
    page,
    totalCount
  );

  return (
    <Container>
      <Link href={`/?page=${prevPageGroup}`}>
        <Button disabled={isFirst}>
          <VscChevronLeft />
        </Button>
      </Link>
      <PageWrapper>
        {currentPageGroup.map((pageNumber) => (
          <Link key={pageNumber} href={`/?page=${pageNumber}`}>
            <Page selected={pageNumber === +page} disabled={pageNumber === +page}>
              {pageNumber}
            </Page>
          </Link>
        ))}
      </PageWrapper>
      <Link href={`/?page=${nextPageGroup}`}>
        <Button disabled={isLast}>
          <VscChevronRight />
        </Button>
      </Link>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  width: 400px;
  margin-top: 40px;
  margin-left: -20px;

  button {
    cursor: pointer;
  }
`;

const Button = styled.button`
  &:disabled {
    color: #e2e2ea;
    cursor: default;
  }
`;

const PageWrapper = styled.div`
  display: flex;
  margin: 0 16px;
`;

const Page = styled.button<{ selected: boolean }>`
  padding: 4px 6px;
  background-color: ${({ selected }) => (selected ? '#000' : 'transparent')};
  color: ${({ selected }) => (selected ? '#fff' : '#000')};
  font-size: 20px;

  & + & {
    margin-left: 4px;
  }

  &:disabled {
    cursor: default;
  }
`;
