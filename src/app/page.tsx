import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-gray-100 text-center p-4">
      
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center flex-grow">
        {/* Illustration */}
        <div className="max-w-md mb-6">
          <Image 
            src="/illustrations/Construction crane-amico.svg" 
            alt="Under Construction" 
            width={400} 
            height={400} 
          />
        </div>

        {/* Under Construction Text */}
        <h1 className="text-3xl font-bold text-teal-700 mb-2">UNDER CONSTRUCTION</h1>
        <p className="text-gray-600 text-lg">Sustainable development in progress. Check back soon!</p>
      </div>

      {/* Footer Logos */}
      <div className="flex items-center justify-center gap-8 py-4">
        <Image 
          src="/logos/SME-Climate-Hub-logo-teal.svg" 
          alt="SME Climate Hub Logo" 
          width={120} 
          height={40} 
        />
        <Image 
          src="/logos/Equipoise_Logo+Vector.png" 
          alt="Equipoise Logo" 
          width={100} 
          height={40} 
        />
      </div>
    </div>
  );
}
