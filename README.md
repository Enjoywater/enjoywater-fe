# FE-TEST

- 이흥수
- 22.02.23 ~ 02.25

<br />

## 🛠️ 기술 스택

- TypeScript
- Next.js
- Next-Auth
- Axios
- React-query
- Styled Components

<br />

## 📚 구현 과정

### 가정

- 로그인<br />

  - 로그인 여부를 확인한 후에 리다이렉트 시키는 코드는 상위 컴포넌트에 작성할 수 있습니다.

- 페이지별 랜더링 방법<br />

  - 상품목록, 상품상세 페이지 모두 SSR 방식으로 구현해야 합니다.

- usePagination<br />

  - 다른 프로젝트에서도 사용할 수 있습니다.<br />
  - 이중 배열로 모든 페이지를 그룹화해서 관리할 수 있습니다.

### 구현

**`로그인`**

> 로그인된 상태에서 로그인 화면에 진입하면 홈 화면으로 리다이렉트 됩니다.

<br />

- 초기 구현

  ```javascript
  /* Layout.tsx */

  const { data, status } = useSession();
  const { pathname, push } = useRouter();

  useEffect(() => {
    if (status === 'authenticated' && pathname === '/login') push('/');
  }, [status, pathname, push]);
  ```

  처음에는 `Layout 컴포넌트`에서 `session status`와 `pathname`을 확인하는 방법을 택했습니다.<br />
  하지만, 로그인 페이지가 잠시 보였다가 사라졌기 때문에 좋지 않은 방법이라 판단했습니다.

- 최종 구현

  ```javascript
  /* login.tsx */

  export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (session && session.user) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return {
      props: {},
    };
  };
  ```

  `Layout 컴포넌트`에서 확인하는 과정을 없애고, 로그인 페이지가 보이기 전에 로그인 여부를 확인하는 방법으로 최종 수정했습니다.<br />
  더 나은 사용자 경험과 더불어 `Next.js`를 효율적으로 활용하는 방법이라 생각합니다.

  <br />

**`페이지별 랜더링 방법`**

> 상품목록과 상세페이지의 `url`은 각각 `/?page={number}` 과 `/products/{id}` 입니다.

상품목록과 상세페이지 모두 `최신 데이터`로 유지해야 하고, 더 나은 `SEO`를 제공해야 합니다.<br />
때문에, `build`시에 정적으로 생성되는 `SSG`보다 `SSR`이 더 효율적입니다.<br />
`SSG`에서는 새 요청을 받을 때마다 페이지가 생성되지 않기 때문에 `/?page={number}`를 알 수 없습니다.

<br />

- 최종 구현

  ```javascript
  /* 상품목록 페이지 */

  export const getServerSideProps: GetServerSideProps = async (context) => {
    const { page } = context.query;
    const queryClient = new QueryClient();
    const pageValue = typeof page === 'string' ? page : '1';

    await queryClient.prefetchQuery(['productList', pageValue], () => fetchProductList(pageValue));

    return {
      props: {
        page: pageValue,
        dehydratedProps: dehydrate(queryClient),
      },
    };
  };

  /* 상품상세 페이지 */

  export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;
    const queryClient = new QueryClient();
    const idValue = typeof id === 'string' ? id : '0';

    await queryClient.prefetchQuery(['productDetail', idValue], () => fetchProductDetail(idValue));

    return {
      props: {
        id: idValue,
        dehydratedProps: dehydrate(queryClient),
      },
    };
  };
  ```

  <br />

**`usePagination hooks`**

> Pagination 컴포넌트와 usePagination 커스텀훅을 구현해야합니다.

<br />

- 최종구현

```javascript
/* 모든 페이지를 원하는 갯수로 그룹화하는 유틸함수 */

export const formatPageArray = (
  totalCount: number,
  pageGroupCount: number,
  productCount: number = 10
) => {
  const pageNumbers = [];
  const totalPage = Math.ceil(totalCount / productCount);

  for (let i = 1; i <= totalPage; i += pageGroupCount) {
    const pageGroup = [];

    for (let j = i; j < i + pageGroupCount && j <= totalPage; j++) {
      pageGroup.push(j);
    }

    pageNumbers.push(pageGroup);
  }

  return pageNumbers;
};
```

나열된 페이지 번호들을 잘라서 사용하는 과정을 초기에 그룹화하여 없앴습니다.<br />
해당 함수는 `[ [...], [...], [...], ...]` 형식으로 페이지를 반환합니다.

<br />
<br />

```javascript
/* usePagination.ts */

const usePagination = (page: string, totalCount: number, pageGroupCount: number = 5) => {
  // 이중배열로 구성된 전체 페이지 그룹을 반환합니다.
  const pageGroups = useMemo(
    () => formatPageArray(totalCount, pageGroupCount),
    [totalCount, pageGroupCount]
  );

  // 현재 페이지가 속한 그룹을 반환합니다.
  const currentPageGroup = useMemo(
    () => pageGroups[pageGroups.findIndex((pageGroup) => pageGroup.includes(+page))],
    [pageGroups, page]
  );

  // 이전 그룹의 마지막 페이지를 반환합니다.
  const prevPageGroup = useMemo(
    () => Math.floor((+page - 1) / pageGroupCount) * pageGroupCount,
    [page, pageGroupCount]
  );

  // 다음 그룹의 첫 페이지를 반환합니다.
  const nextPageGroup = useMemo(
    () => Math.ceil(+page / pageGroupCount) * pageGroupCount + 1,
    [page, pageGroupCount]
  );

  // 이전 그룹의 유무를 반환합니다.
  const isFirst = useMemo(() => currentPageGroup[0] === 1, [currentPageGroup]);

  // 다음 그룹의 유무를 반환합니다.
  const isLast = useMemo(
    () => currentPageGroup[0] === pageGroups[pageGroups.length - 1][0],
    [currentPageGroup, pageGroups]
  );

  return { currentPageGroup, prevPageGroup, nextPageGroup, isFirst, isLast };
};

export default usePagination;
```

범용성 있는 커스텀훅을 만들기 위해 필요한 `parameter`를 최소화했습니다.<br />
`현재 페이지`와 `전체 데이터 갯수`만 있으면 기능 구현에 필요한 모든 값을 생성합니다.