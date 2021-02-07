export default function Button({ type = 'button', children }) {
  return <button type={type}>{children}</button>
}