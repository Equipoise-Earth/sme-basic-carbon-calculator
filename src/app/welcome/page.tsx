import Link from "next/link";
import Image from "next/image";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      {/* Step Indicator */}
      <div className="w-full max-w-4xl text-center text-gray-500 text-sm mt-4">
        Step 1/6
      </div>

      {/* Content Section */}
      <div className="bg-white rounded-lg shadow-md p-10 mt-4 w-full max-w-4xl text-center">
        {/* Title */}
        <h1 className="text-3xl font-bold">
          Welcome to the{" "}
          <span className="text-teal-600">Business Carbon Calculator</span>
        </h1>

        {/* Image */}
        <div className="flex justify-center my-6">
          <Image
            src="/illustrations/Analytics-amico.svg"
            alt="Carbon Calculator Illustration"
            width={500}
            height={300}
          />
        </div>

        {/* Description */}
        <p className="text-gray-600">
          We are delighted to partner with you on measuring your company’s CO₂
          emissions. The more you put into the Business Carbon Calculator, the
          more you get out. To provide you with the most comprehensive insights
          and benchmarks, we need to get to know you first.
        </p>

        {/* Start Button */}
        <Link href="/survey/introduction/1">
          <button className="mt-6 px-6 py-3 bg-primary text-white rounded-lg text-lg hover:bg-secondary">
            Get started →
          </button>
        </Link>
      </div>
    </div>
  );
}
