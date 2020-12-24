import React, { useEffect } from 'react';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getGithubRepos } from '../../_actions/profile';
import PropTypes from 'prop-types';

const ProfileGithub = ({ username, repos, getGithubRepos }) => {
	useEffect(() => {
		getGithubRepos(username);
		// eslint-disable-next-line
	}, [getGithubRepos]);

	if (repos.length === 0) {
		return <Spinner />;
	}

	return (
		<div class='profile-github'>
			<h2 class='text-primary my-1'>
				<i class='fab fa-github'></i> Github Repos
			</h2>
			{repos.length > 0 &&
				repos.map(repo => (
					<div key={repo.id} class='repo bg-white p-1 my-1'>
						<div>
							<h4>
								<a
									href={repo.html_url}
									target='_blank'
									rel='noopener noreferrer'
								>
									{repo.name}
								</a>
							</h4>
							<p>{repo.description}</p>
						</div>
						<div>
							<ul>
								<li class='badge badge-primary'>
									Stars: {repo.stargazers_count}
								</li>
								<li class='badge badge-dark'>
									Watchers: {repo.forks_count}
								</li>
								<li class='badge badge-light'>
									Forks: {repo.watchers_count}
								</li>
							</ul>
						</div>
					</div>
				))}
		</div>
	);
};

ProfileGithub.propTypes = {
	username: PropTypes.string.isRequired,
	repos: PropTypes.array.isRequired,
	getGithubRepos: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	repos: state.profile.repos
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithub);
