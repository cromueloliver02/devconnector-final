import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const Alert = ({ alerts }) =>
	alerts !== null &&
	alerts.length > 0 &&
	alerts.map(alert => (
		<div key={alert.id} className={`alert alert-${alert.type}`}>
			<i className='fas fa-info-circle'></i> {alert.msg}
		</div>
	));

Alert.propTypes = {
	alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
	alerts: state.alerts
});

export default connect(mapStateToProps)(Alert);
