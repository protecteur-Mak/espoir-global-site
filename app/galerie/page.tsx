import Link from "next/link"

const galleryVideos = [
  "1.mp4",
  "2.mp4",
  "3.mp4",
  "4.mp4",
  "5.mp4",
  "6.mp4",
  "7.mp4",
  "8.mp4",
  "9.mp4",
  "10.mp4",
  "cta-video.mp4",
]

export default function GaleriePage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 md:py-14">
      <div className="container mx-auto max-w-screen-xl px-4">
        <div className="mb-8 text-center md:mb-10">
          <h1 className="text-2xl font-bold text-indigo-700 md:text-3xl lg:text-4xl">
            Galerie
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-600 md:text-base">
            Explorez plus d&apos;images de nos actions sur le terrain a travers ces
            videos.
          </p>
          <Link
            href="/"
            className="mt-5 inline-flex items-center justify-center rounded-full border border-indigo-700 px-5 py-2 text-sm font-semibold text-indigo-700 transition-colors hover:bg-indigo-700 hover:text-white"
          >
            Retour a l&apos;accueil
          </Link>
        </div>

        <section
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          aria-label="Videos de la galerie"
        >
          {galleryVideos.map((videoName) => (
            <article
              key={videoName}
              className="overflow-hidden rounded-xl border border-gray-200 bg-black shadow-md"
            >
              <video
                className="aspect-video w-full object-cover"
                src={`/videos/${videoName}`}
                controls
                playsInline
                preload="metadata"
              >
                Votre navigateur ne prend pas en charge la lecture de videos.
              </video>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}
