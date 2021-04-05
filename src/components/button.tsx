import { ComponentChildren, JSX } from 'preact';

type ButtonProps = {
  type: string;
  children: ComponentChildren;
  onClick: (e: MouseEvent) => void;
};

export default function Button({
  type = 'button',
  children,
  onClick = () => null,
}: ButtonProps): JSX.Element {
  return (
    <button type={type === 'submit' ? 'submit' : 'button'} onClick={onClick} className="button">
      {children}
    </button>
  );
}
