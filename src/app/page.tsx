import Link from "next/link"
import Image from "next/image"
import { Play, Trophy, Users, Headphones, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white w-full">


      <section className="w-full py-8 md:py-16 lg:py-24 xl:py-32 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_500px]">
            <div className="flex flex-col justify-center items-center space-y-6">
              <div className="space-y-3">
                <h1 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-6xl/none text-center">
                  Spotify Şarkılarını Tahmin Et, <span className="text-green-600">Eğlenceyi Keşfet</span>
                </h1>
                <p className="text-center text-base max-w-[600px] text-gray-500 md:text-xl">
                  SpotiQuiz ile müzik bilgini test et. Şarkıları dinle, sanatçıları ve şarkı isimlerini tahmin et,
                  arkadaşlarınla yarış.
                </p>
              </div>
              <div className="flex flex-col gap-3 min-[400px]:flex-row">
                <Link
                  href="/game"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-green-600 px-6 sm:px-8 text-sm font-medium text-white shadow transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Hemen Oyna
                </Link>
                <Link
                  href="#how-to-play"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-white px-6 sm:px-8 text-sm font-medium text-green-600 shadow-sm transition-colors hover:bg-gray-100 hover:text-green-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-green-500"
                >
                  Nasıl Oynanır
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center mt-6 lg:mt-0">
              <div className="relative h-[280px] w-[250px] xs:h-[320px] xs:w-[280px] sm:h-[380px] sm:w-[330px] lg:h-[450px] lg:w-[400px] rounded-2xl overflow-hidden shadow-xl">
                <Image
                  src="/hero.jpg"
                  alt="SpotiQuiz App Screenshot"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="w-full py-8 md:py-16 lg:py-24 bg-green-50 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">Özellikler</div>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Neden SpotiQuiz?</h2>
              <p className="text-base max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Müzik bilgini test etmenin en eğlenceli yolu. Spotify kütüphanesindeki milyonlarca şarkıyla oyna.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center  shadow-none border-green-200  p-4  h-full">
              <div className="rounded-full bg-green-100 p-3">
                <Headphones className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Geniş Müzik Kütüphanesi</h3>
              <p className="text-center text-gray-500 text-sm sm:text-base">
                Spotify&apos;ın geniş müzik kütüphanesinden seçilen şarkılarla sınırsız eğlence.
              </p>
            </Card>
            <Card className="flex flex-col items-center shadow-none border-green-200  p-4  h-full">
              <div className="rounded-full bg-green-100 p-3">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Arkadaşlarınla Yarış</h3>
              <p className="text-center text-gray-500 text-sm sm:text-base">
                Çok oyunculu mod ile arkadaşlarınla yarış ve kim daha çok şarkı biliyor öğren.
              </p>
            </Card>
            <Card className="flex flex-col items-center shadow-none  border-green-200  p-4 h-full">
              <div className="rounded-full bg-green-100 p-3">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold">Liderlik Tablosu</h3>
              <p className="text-center text-gray-500 text-sm sm:text-base">
                Puan kazan, liderlik tablosunda yüksel ve müzik bilgini herkese göster.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section id="how-to-play" className="w-full py-8 md:py-16 lg:py-24 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
                Nasıl Oynanır
              </div>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Üç Basit Adımda Başla</h2>
              <p className="text-base max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SpotiQuiz oynamak çok kolay. Hemen başla ve müzik bilgini test et.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative flex flex-col items-center space-y-4 p-4 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">1</div>
              <h3 className="text-lg sm:text-xl font-bold">Giriş Yap</h3>
              <p className="text-center text-gray-500 text-sm sm:text-base">Spotify hesabınla giriş yap veya yeni bir hesap oluştur.</p>
              {/* Arrow for desktop */}
              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
                <ChevronRight className="h-8 w-8 text-green-300" />
              </div>
              {/* Arrow for mobile/tablet */}
              <div className="flex justify-center w-full lg:hidden mt-2">
                <ChevronRight className="h-8 w-8 text-green-300 transform rotate-90" />
              </div>
            </div>
            <div className="relative flex flex-col items-center space-y-4 p-4 sm:p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">2</div>
              <h3 className="text-lg sm:text-xl font-bold">Kategori Seç</h3>
              <p className="text-center text-gray-500 text-sm sm:text-base">Pop, Rock, Hip-Hop veya karışık kategorilerden birini seç.</p>
              {/* Arrow for desktop */}
              <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 lg:block">
                <ChevronRight className="h-8 w-8 text-green-300" />
              </div>
              {/* Arrow for mobile/tablet */}
              <div className="flex justify-center w-full lg:hidden mt-2">
                <ChevronRight className="h-8 w-8 text-green-300 transform rotate-90" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-4 p-4 sm:p-6 sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white">3</div>
              <h3 className="text-lg sm:text-xl font-bold">Tahmin Et ve Kazan</h3>
              <p className="text-center text-gray-500 text-sm sm:text-base">
                Şarkıları dinle, sanatçı ve şarkı adını tahmin et, puan kazan.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="testimonials" className="w-full py-8 md:py-16 lg:py-24 bg-green-50 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">Yorumlar</div>
              <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Kullanıcılarımız Ne Diyor?</h2>
              <p className="text-base max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                SpotiQuiz&apos;i deneyimleyen kullanıcılarımızın yorumları.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl gap-6 py-8 md:py-12 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col justify-between space-y-4 rounded-lg border border-green-200 bg-white p-4 sm:p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 fill-green-500 text-green-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-gray-500 text-sm sm:text-base">
                  &quot;Müzik bilgimi test etmenin en eğlenceli yolu! Arkadaşlarımla saatlerce oynuyoruz.&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-1">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                </div>
                <div>
                  <p className="text-sm font-medium">Ahmet Y.</p>
                  <p className="text-xs text-gray-500">İstanbul</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border border-green-200 bg-white p-4 sm:p-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 fill-green-500 text-green-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-gray-500 text-sm sm:text-base">
                  &quot;Spotify&apos;ı çok kullanıyorum ama bu oyun sayesinde yeni şarkılar keşfettim. Harika bir uygulama!&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-1">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                </div>
                <div>
                  <p className="text-sm font-medium">Zeynep K.</p>
                  <p className="text-xs text-gray-500">Ankara</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between space-y-4 rounded-lg border border-green-200 bg-white p-4 sm:p-6 shadow-sm sm:col-span-2 lg:col-span-1 sm:max-w-md sm:mx-auto lg:max-w-none">
              <div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4 fill-green-500 text-green-500"
                    >
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="mt-4 text-gray-500 text-sm sm:text-base">
                  &quot;Müzik bilgimi geliştirmek için mükemmel bir uygulama. Artık arkadaşlarım arasında müzik konusunda
                  en bilgili benim!&quot;
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-1">
                  <div className="h-8 w-8 rounded-full bg-gray-200" />
                </div>
                <div>
                  <p className="text-sm font-medium">Mehmet A.</p>
                  <p className="text-xs text-gray-500">İzmir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="play-now" className="w-full py-8 md:py-16 lg:py-24 bg-green-600 px-4 sm:px-6">
        <div className="container max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-6 text-center text-white">
            <div className="space-y-3">
              <h2 className="text-2xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Hemen Oynamaya Başla</h2>
              <p className="text-base max-w-[900px] text-green-50 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Müzik bilgini test etmek için SpotiQuiz&apos;e kaydol ve hemen oynamaya başla.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center">

                <Link href={"/game"}>
                  <div className="bg-white text-green-600 hover:bg-green-50 h-12 px-6 sm:px-8 font-medium w-full min-[400px]:w-auto flex items-center justify-center rounded-xl">

                    <Play className="mr-2 h-5 w-5" />
                    Hemen Oyna
                  </div></Link>
              </div>
            </div>
          </div>
        </div>
      </section>


    </div>
  )
}
