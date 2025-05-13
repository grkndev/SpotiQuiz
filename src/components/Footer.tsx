import { Music } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full border-t bg-white py-6 flex flex-col items-center justify-center">
            <div className="container flex flex-col items-center justify-center gap-4 px-4 md:px-6 md:flex-row md:justify-between">
                <div className="flex items-center gap-2">
                    <Music className="h-6 w-6 text-green-500" />
                    <span className="text-lg font-bold text-green-600">SpotiQuiz</span>
                </div>
                <span className="flex items-center gap-2">
                    Built with ❤️ by <Link href="https://github.com/grkndev" className="text-green-600 hover:text-green-700">
                        <img src={"https://www.grkn.dev/_next/image?url=%2Fassets%2Ftext%2Fgdev_text_dark.png&w=384&q=75"} width={75} /></Link>
                </span>
                <p className="text-center text-sm text-gray-500 md:text-left">
                    &copy; {new Date().getFullYear()} SpotiQuiz. Tüm hakları saklıdır.
                </p>

            </div>
        </footer>
    )
}
