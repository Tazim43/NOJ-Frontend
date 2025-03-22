import Image from "next/image";

export default function AboutUs() {
  return (
    <div className=" text-white min-h-screen p-10">
      {/* Header */}
      <h1 className="text-4xl font-bold text-center text-teal-400">About Us</h1>
      <p className="text-gray-300 text-center mt-2 max-w-2xl mx-auto">
        Welcome to <span className=" font-bold">NaiveOJ</span>, a smart online
        platform for coding challenges and contests.
      </p>

      {/* Team Section */}
      <div className="mt-12 grid justify-center gap-8">
        <TeamMember
          name="Md. Tazim Uddin"
          role="Founder & Full-Stack Developer"
          image="/founder.jpg"
          icpcStatus="ICPC Asia West Finalist 2025"
        />
      </div>

      {/* Our Mission */}
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-semibold text-teal-400">Our Mission</h2>
        <p className="text-gray-400 max-w-3xl mx-auto mt-4">
          As the sole founder of <span className=" font-bold">NaiveOJ</span> ,
          my mission is to create a platform that helps programmers improve
          their problem-solving skills through high-quality problems, AI-driven
          interviews, and seamless contest hosting.
        </p>
      </div>

      {/* Why Choose Us */}
      <div className="mt-16">
        <h2 className="text-3xl font-semibold text-teal-400 text-center">
          Why Choose Us?
        </h2>
        <div className="mt-6 grid md:grid-cols-3 gap-8">
          <Feature
            title="Smart Online Judge"
            description="A powerful online judge that evaluates solutions efficiently."
          />
          <Feature
            title="AI Coding Interviewer"
            description="Practice mock interviews with AI and get instant feedback."
          />
          <Feature
            title="Premium Problems"
            description="Solve high-quality curated problems to improve your skills."
          />
        </div>
      </div>
    </div>
  );
}

// Team Member Component
function TeamMember({ name, role, image, icpcStatus, codeforcesRating }) {
  return (
    <div className="bg-gray-900 py-10 px-20 rounded-xl text-center shadow-lg w-full mx-auto">
      <Image
        src={image}
        alt={name}
        className="w-24 h-24 mx-auto rounded-full border-2 border-teal-400"
        width={96} // 24 * 4px (Tailwind's default spacing)
        height={96} // 24 * 4px
      />
      <h3 className="text-xl font-semibold mt-4">{name}</h3>
      <p className="text-gray-400">{role}</p>
      {/* Additional Information */}
      {icpcStatus && <p className="text-teal-300 mt-2">{icpcStatus}</p>}
      {codeforcesRating && (
        <p className="text-teal-300 mt-2">
          Codeforces Rating: {codeforcesRating}
        </p>
      )}
    </div>
  );
}

// Feature Component
function Feature({ title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg text-center shadow-lg">
      <h3 className="text-xl font-semibold text-teal-400">{title}</h3>
      <p className="text-gray-400 mt-2">{description}</p>
    </div>
  );
}
