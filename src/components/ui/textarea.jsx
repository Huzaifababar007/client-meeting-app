// src/components/ui/Textarea.jsx
export const Textarea = ({ name, value, onChange, placeholder }) => {
  return (
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={4}
      className="w-full p-3 rounded-xl bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
    />
  );
};
