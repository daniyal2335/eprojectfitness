// src/components/ProfileImage.jsx
export default function ProfileImage({ base64, alt, className }) {
  if (!base64) {
    return (
      <img
        src="/default-avatar.png"
        alt={alt || "Avatar"}
        className={className}
      />
    );
  }

  return (
    <img
      src={`data:image/jpeg;base64,${base64}`}
      alt={alt || "Avatar"}
      className={className}
    />
  );
}
