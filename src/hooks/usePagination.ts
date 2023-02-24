import { useMemo } from 'react';
import { formatPageArray } from 'utilities';

const usePagination = (page: string, totalCount: number, pageGroupCount: number = 5) => {
  const pageGroups = useMemo(
    () => formatPageArray(totalCount, pageGroupCount),
    [totalCount, pageGroupCount]
  );

  const currentPageGroup = useMemo(
    () => pageGroups[pageGroups.findIndex((pageGroup) => pageGroup.includes(+page))],
    [pageGroups, page]
  );

  const prevPageGroup = useMemo(
    () => Math.floor((+page - 1) / pageGroupCount) * pageGroupCount,
    [page, pageGroupCount]
  );

  const nextPageGroup = useMemo(
    () => Math.ceil(+page / pageGroupCount) * pageGroupCount + 1,
    [page, pageGroupCount]
  );

  const isFirst = useMemo(() => currentPageGroup[0] === 1, [currentPageGroup]);

  const isLast = useMemo(
    () => currentPageGroup[0] === pageGroups[pageGroups.length - 1][0],
    [currentPageGroup, pageGroups]
  );

  return { currentPageGroup, prevPageGroup, nextPageGroup, isFirst, isLast };
};

export default usePagination;
