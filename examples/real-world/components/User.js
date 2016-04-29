import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const User = (props) => {
  const { login, avatarUrl, name } = props.user;

  return (
    <div className="User">
      <Link to={`/${login}`}>
        <img src={avatarUrl} width="72" height="72" alt={name} />
        <h3>
          {login} {name && <span>({name})</span>}
        </h3>
      </Link>
    </div>
  );
};

User.propTypes = {
  user: PropTypes.shape({
    login: PropTypes.string.isRequired,
    avatarUrl: PropTypes.string.isRequired,
    name: PropTypes.string
  }).isRequired
};

export default User;
