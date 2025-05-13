import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Music, Trophy, Headphones, Check, X, SkipForward, Award } from "lucide-react"

export default function HowToPlayPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white w-full">
      <section className="w-full py-8 md:py-16 px-4 sm:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="mb-6">
            <Link 
              href="/"
              className="inline-flex items-center text-green-600 hover:text-green-700 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              <span>Ana Sayfaya Dön</span>
            </Link>
          </div>
          
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="space-y-3">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700">
                Oyun Kuralları
              </div>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                SpotiQuiz Nasıl Oynanır?
              </h1>
              <p className="text-base max-w-[900px] text-gray-500 md:text-xl/relaxed">
                Müzik bilgini test et, SpotiCoin kazan ve eğlenmeye başla!
              </p>
            </div>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="relative h-[300px] sm:h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/hero.jpg"
                alt="SpotiQuiz Oyun Ekranı"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-500/30 to-transparent"></div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Oyun Kuralları</h2>
              
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Headphones className="h-4 w-4 text-green-600" />
                  </div>
                  <p>Spotify hesabın ile giriş yap</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Music className="h-4 w-4 text-green-600" />
                  </div>
                  <p>Spotifty'dan seçilecek rastgele bir şarkıyı dinle</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <p>4 tahmin arasından seçimini yap</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Award className="h-4 w-4 text-green-600" />
                  </div>
                  <p>Doğru her soru için +10 SpotiCoin kazan</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Trophy className="h-4 w-4 text-green-600" />
                  </div>
                  <p>10 sorunun tamamını bilirsen ekstra +10 SpotiCoin</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <X className="h-4 w-4 text-green-600" />
                  </div>
                  <p>Her yanlış cevap için -5 SpotiCoin</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Music className="h-4 w-4 text-green-600" />
                  </div>
                  <p>Oyun toplam 10 turdan oluşur</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <SkipForward className="h-4 w-4 text-green-600" />
                  </div>
                  <p>Yarışmacı soruları "PAS" geçme hakkına sahiptir</p>
                </li>
                
                <li className="flex items-start">
                  <div className="rounded-full bg-green-100 p-1.5 mr-3 mt-0.5">
                    <Music className="h-4 w-4 text-green-600" />
                  </div>
                  <p>PAS geçilen sorular tüm soruların tamamlanmasının ardından yeniden yarışmacıya sorulur</p>
                </li>
              </ul>
              
              <div className="pt-4">
                <Link href="/">
                  <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white">
                    Şimdi Oynamaya Başla
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <section className="w-full py-8 md:py-16 bg-green-50 px-4 sm:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Puanlama Sistemi
            </h2>
            <p className="text-base max-w-[700px] text-gray-500">
              SpotiQuiz'de daha fazla puan kazanmak ve liderlik tablosunda yükselmek için stratejini belirle!
            </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="flex flex-col items-center p-6 shadow-sm border-green-200 h-full">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Doğru Cevaplar</h3>
              <p className="text-center text-gray-500">
                Her doğru cevap için <span className="font-medium text-green-600">+10 SpotiCoin</span> kazanırsın.
              </p>
            </Card>
            
            <Card className="flex flex-col items-center p-6 shadow-sm border-green-200 h-full">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <X className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Yanlış Cevaplar</h3>
              <p className="text-center text-gray-500">
                Her yanlış cevap için <span className="font-medium text-red-500">-5 SpotiCoin</span> kaybedersin.
              </p>
            </Card>
            
            <Card className="flex flex-col items-center p-6 shadow-sm border-green-200 h-full sm:col-span-2 lg:col-span-1">
              <div className="rounded-full bg-green-100 p-3 mb-4">
                <Trophy className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Bonus Puan</h3>
              <p className="text-center text-gray-500">
                Tüm 10 soruyu doğru cevaplarsan <span className="font-medium text-green-600">+10 bonus SpotiCoin</span> kazanırsın!
              </p>
            </Card>
          </div>
        </div>
      </section>
      
      <section className="w-full py-8 md:py-16 px-4 sm:px-6">
        <div className="container max-w-5xl mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
            <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">
              Sık Sorulan Sorular
            </h2>
          </div>
          
          <div className="space-y-6 max-w-3xl mx-auto">
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Spotify hesabım olmadan oynayabilir miyim?</h3>
              <p className="text-gray-500">
                Hayır, SpotiQuiz oynamak için bir Spotify hesabına ihtiyacın var. Eğer hesabın yoksa, Spotify'ın ücretsiz sürümüne kaydolarak SpotiQuiz'i oynamaya başlayabilirsin.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold">Kazandığım SpotiCoin'leri ne için kullanabilirim?</h3>
              <p className="text-gray-500">
                SpotiCoin'ler liderlik tablosunda ilerlemeni sağlar. Ayrıca gelecek güncellemelerle SpotiCoin'lerini farklı ödüller için kullanabileceksin.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-bold">"PAS" hakkımı nasıl kullanabilirim?</h3>
              <p className="text-gray-500">
                Herhangi bir soruyu yanıtlamakta zorlanıyorsan, "PAS" butonuna tıklayarak o soruyu atlayabilirsin. Pas geçtiğin sorular, diğer tüm sorular tamamlandıktan sonra tekrar karşına çıkacaktır.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Hemen Oynamaya Başla
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
