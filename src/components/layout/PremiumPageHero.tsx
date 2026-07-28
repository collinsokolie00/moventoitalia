type PremiumPageHeroProps = {
  eyebrow: string;
  title: string;
  description: string;
  image?: {
    url: string;
    alt: string;
    position: string;
  };
  compact?: boolean;
};

export default function PremiumPageHero({
  eyebrow,
  title,
  description,
  image,
  compact = false,
}: PremiumPageHeroProps) {
  return (
    <section
      className="relative overflow-hidden border-b border-blue-800 bg-linear-to-br from-blue-950 via-blue-900 to-blue-700 text-white"
      style={image?.url ? {
        backgroundImage: `url(${JSON.stringify(image.url)})`,
        backgroundPosition: image.position,
        backgroundSize: "cover",
      } : undefined}
    >
      {image?.url && (
        <>
          <div className="absolute inset-0 bg-blue-950/76" />
          <span className="sr-only">{image.alt}</span>
        </>
      )}
      <div className={`relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 ${compact ? "py-12 sm:py-16 lg:py-20" : "py-16 sm:py-20 lg:py-28"}`}>
        <div className="max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-blue-200 sm:text-sm sm:tracking-[0.3em]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-blue-100 sm:mt-6 sm:text-lg sm:leading-8">
            {description}
          </p>
        </div>
      </div>
    </section>
  );
}
