/** @format */

import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
	const [githubUser, setGithubUser] = useState(mockUser);
	const [repos, setRepos] = useState(mockRepos);
	const [followers, setFollowers] = useState(mockFollowers);
	// request loading
	const [request, setRequests] = useState(0);
	const [loading, setLoading] = useState(false);
	// error
	const [error, setError] = useState({ show: false, msg: '' });

	const searchGithubUser = async (user) => {
		toggleError();
		setLoading(true);
		const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
			console.log(err)
		);
		if (response) {
			setGithubUser(response.data);
			const { followers_url, repos_url } = response.data;

			await Promise.allSettled([
				axios(`${repos_url}?per_page=100`),
				axios(`${followers_url}?per_page=100`),
			])
				.then((results) => {
					const [repos, followers] = results;
					const status = 'fulfilled';
					if (repos.status === status) {
						setRepos(repos.value.data);
					}
					if (followers.status === status) {
						setFollowers(repos.value.data);
					}
				})
				.catch((err) => console.log(err));
		} else {
			toggleError(true, 'No user with that username');
		}
		checkRequests();
		setLoading(false);
	};

	// check rate
	const checkRequests = () => {
		axios(`${rootUrl}/rate_limit`)
			.then(({ data }) => {
				let {
					rate: { remaining },
				} = data;
				setRequests(remaining);
				if (remaining === 0) {
					toggleError(true, "Sorry, you've exceeded your hourly rate limit");
				}
			})
			.catch((err) => console.log(err));
	};

	const toggleError = (show = false, msg = '') => {
		setError({ show, msg });
	};

	useEffect(checkRequests, []);

	// get initial user
	useEffect(() => {
		setGithubUser('iamjosephdaramola');
	}, []);

	return (
		<GithubContext.Provider
			value={{
				githubUser,
				repos,
				followers,
				request,
				error,
				loading,
				searchGithubUser,
			}}
		>
			{children}
		</GithubContext.Provider>
	);
};

export { GithubProvider, GithubContext };
