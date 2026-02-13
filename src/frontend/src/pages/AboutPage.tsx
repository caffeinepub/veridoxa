import Prose from '../components/content/Prose';

export default function AboutPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">About veridoxa</h1>
        </header>

        <Prose>
          <p>
            Welcome to veridoxa, a digital space dedicated to the exploration and sharing of ideas through
            research, storytelling, and poetry.
          </p>

          <h2>Our Mission</h2>
          <p>
            veridoxa serves as a platform for publishing thoughtful works across multiple disciplines. Whether
            through rigorous research, compelling narratives, or evocative verse, we aim to create a collection
            that inspires reflection and dialogue.
          </p>

          <h2>What You'll Find Here</h2>
          <p>
            Our content is organized into three main sections:
          </p>
          <ul>
            <li>
              <strong>Research:</strong> In-depth explorations of topics that matter, grounded in careful
              analysis and evidence.
            </li>
            <li>
              <strong>Storytelling:</strong> Narratives that capture the human experience in all its complexity
              and beauty.
            </li>
            <li>
              <strong>Poetry:</strong> Verse that distills emotion, observation, and insight into carefully
              crafted language.
            </li>
          </ul>

          <h2>Join the Journey</h2>
          <p>
            We invite you to explore our collection, engage with the ideas presented, and return often as we
            continue to add new works. Thank you for being part of the veridoxa community.
          </p>
        </Prose>
      </div>
    </div>
  );
}
