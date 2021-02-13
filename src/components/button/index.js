import PropTypes from 'prop-types';

export default function Button({ type = 'button', children, onClick = () => null }) {
  return (
    <button type={type === 'submit' ? 'submit' : 'button'} onClick={onClick} className="button">
      {children}
    </button>
  );
}

Button.propTypes = {
  type: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  onClick: PropTypes.func,
};
