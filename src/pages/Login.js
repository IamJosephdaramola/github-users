/** @format */

import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styled from 'styled-components';
import loginImg from '../images/login-img.svg';
const Login = () => {
	const { loginWithRedirect } = useAuth0();
	return (
		<Wrapper>
			<div className='container'>
				<img src={loginImg} alt='github user' />
				<h1>github user</h1>
				<button onClick={loginWithRedirect} className='btn'>
					Login / signup
				</button>
			</div>
		</Wrapper>
	);
};
const Wrapper = styled.section`
	min-height: 100vh;
	display: grid;
	place-items: center;
	.container {
		width: 90vw;
		max-width: 600px;
		text-align: center;
	}
	img {
		display: block;
		margin: 0 auto 2rem auto;
	}
	h1 {
		margin-bottom: 1.5rem;
	}
`;
export default Login;
