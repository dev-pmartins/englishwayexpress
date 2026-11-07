import imagePlaceholder from "../../../image_placeholder.png";

export default function PostCover({ src, alt = "", className = "" }) {
  return (
    <div className={`post-cover ${src ? "" : "post-cover--empty"} ${className}`.trim()}>
      {src ? (
        <img src={src} alt={alt} className="post-cover-img" loading="lazy" />
      ) : (
        <div className="post-cover-placeholder" aria-hidden="true">
          <img src={imagePlaceholder} alt="" className="post-cover-img" />
        </div>
      )}
    </div>
  );
}
