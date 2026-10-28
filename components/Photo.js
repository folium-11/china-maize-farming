import { photos } from "@/content/photos.js";

// A photograph with its caption and credit. Not counted in the word count, so no data-count.
export default function Photo({ id }) {
  const p = photos[id];
  const cls = ["photo", p.wide ? "photo-wide" : "", p.tall ? "photo-tall" : ""].filter(Boolean).join(" ");
  return (
    <figure className={cls}>
      <img src={p.src} alt={p.alt} width={p.width} height={p.height} loading={p.wide ? "eager" : "lazy"} decoding="async" />
      <figcaption>
        {p.caption}{" "}
        <span className="credit">
          Photo: {p.author},{" "}
          {p.licenceUrl ? <a href={p.licenceUrl} rel="license">{p.licence}</a> : p.licence}, via{" "}
          <a href={p.source}>Wikimedia Commons</a>.
        </span>
      </figcaption>
    </figure>
  );
}
