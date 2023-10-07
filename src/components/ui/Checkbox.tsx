type CheckboxProps = {
  id: string;
  name?: string;
  text: string;
};

const Checkbox = ({ id, name, text }: CheckboxProps) => (
  <label htmlFor={id} className="inline-flex items-center">
    <input
      id={id}
      type="checkbox"
      name={name ? name : id}
      className="accent-orange-500 rounded border-orange-300 text-orange-600 shadow-sm focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
    />
    <span className="ml-2 text-sm text-gray-600">{text}</span>
  </label>
);

export default Checkbox;
