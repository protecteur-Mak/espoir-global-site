import Link from "next/link"

export function CtaVideoSection() {
  return (
    <section
      className="py-8 md:py-12 lg:py-16"
      aria-labelledby="cta-video-heading"
    >
      <div className="container mx-auto px-4 max-w-screen-xl">
        <div className="text-center mb-6 md:mb-8">
          <h2
            id="cta-video-heading"
            className="text-xl md:text-2xl lg:text-3xl font-bold text-indigo-700 mb-3 md:mb-4"
          >
            Notre action en images
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Découvrez le visage concret de notre engagement auprès des orphelins
            et des veuves que nous accompagnons.
          </p>
        </div>

        <div className="max-w-4xl mx-auto rounded-xl md:rounded-2xl overflow-hidden shadow-xl border border-gray-200 bg-black">
          <video
            className="w-full aspect-video object-contain"
            src="/videos/cta-video.mp4"
            controls
            playsInline
            preload="metadata"
          >
            Votre navigateur ne prend pas en charge la lecture de vidéos.
          </video>
        </div>

        <div className="mt-6 md:mt-8 text-center">
          <Link
            href="/galerie"
            className="inline-flex items-center justify-center rounded-full bg-indigo-700 px-6 py-3 text-sm md:text-base font-semibold text-white shadow-md transition-colors hover:bg-indigo-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2"
          >
            Voir la galerie
          </Link>
        </div>
      </div>
    </section>
  )
}
