import React, { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useRouter } from 'next/router';

import { getSession, signIn } from 'next-auth/react';
import { checkUserId, checkPassword } from 'utilities';
import type { GetServerSideProps, NextPage } from 'next';

const LoginPage: NextPage = () => {
  const router = useRouter();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState({
    idError: false,
    passwordError: false,
  });

  const { idError, passwordError } = loginError;

  const buttonStatus = useMemo(
    () => !(userId.length && password.length && !idError && !passwordError),
    [userId, password, idError, passwordError]
  );

  const handleIdInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setUserId(value);
  };

  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleFocusOut = (type: string) => {
    if (type === 'userId')
      return setLoginError((prev) => ({ ...prev, idError: !checkUserId(userId) }));

    return setLoginError((prev) => ({ ...prev, passwordError: !checkPassword(password) }));
  };

  const handleSubmit = async () => {
    try {
      await signIn('credentials', {
        username: userId,
        password,
        redirect: false,
      });

      router.push('/');
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (checkUserId(userId)) setLoginError((prev) => ({ ...prev, idError: false }));
  }, [userId]);

  useEffect(() => {
    if (checkPassword(password)) setLoginError((prev) => ({ ...prev, passwordError: false }));
  }, [password]);

  return (
    <Form>
      <InputTitle>아이디</InputTitle>
      <TextInput isError={idError}>
        <input
          maxLength={30}
          type='text'
          onBlur={() => handleFocusOut('userId')}
          onChange={(e) => handleIdInput(e)}
        />
      </TextInput>
      {idError && (
        <ErrorMsg>
          <p>올바른 아이디 형식으로 입력해주세요.</p>
        </ErrorMsg>
      )}
      <InputTitle>비밀번호</InputTitle>
      <TextInput isError={passwordError}>
        <input
          maxLength={30}
          type='password'
          onBlur={() => handleFocusOut('password')}
          onChange={(e) => handlePasswordInput(e)}
        />
      </TextInput>
      {passwordError && (
        <ErrorMsg isPassword>
          <p>올바른 비밀번호 형식으로 입력해주세요.</p>
        </ErrorMsg>
      )}
      <LoginButton disabled={buttonStatus} onClick={handleSubmit}>
        로그인
      </LoginButton>
    </Form>
  );
};

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

export default LoginPage;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 40px;
  padding: 0 20px 40px;
`;

const InputTitle = styled.p`
  font-size: 13px;
  font-weight: 700;
  color: #6c6c7d;
`;

const TextInput = styled.div<{ isError: boolean }>`
  margin-top: 8px;
  margin-bottom: 16px;
  padding: 16px;
  background-color: #f7f7fa;
  border-radius: 12px;

  input {
    width: 100%;
    height: 100%;
    background-color: transparent;
  }

  ${({ isError }) =>
    isError &&
    css`
      margin-bottom: 0;
      background-color: #feedee;
    `}
`;

const ErrorMsg = styled.div<{ isPassword?: boolean }>`
  margin-top: 8px;
  margin-bottom: 16px;

  p {
    font-size: 13px;
    font-weight: 400;
    color: #ed4e5c;
  }

  ${({ isPassword }) =>
    isPassword &&
    css`
      margin-bottom: 0;
    `}
`;

const LoginButton = styled.button`
  margin-top: 40px;
  padding: 20px;
  border-radius: 12px;
  background-color: #222;
  color: #fff;

  &:disabled {
    background-color: #e2e2ea;
  }
`;
