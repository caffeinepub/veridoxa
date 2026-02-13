import Prose from '../components/content/Prose';

export default function IntroductionPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <header className="mb-12">
          <h1 className="font-serif text-4xl font-bold tracking-tight sm:text-5xl">Introduction</h1>
        </header>

        <Prose>
          <p>
            My name is Arya Singh, and I am an author deeply rooted in the rich tapestry of Indian mythology and history. 
            My works explore the timeless narratives that have shaped our cultural consciousness, bringing ancient wisdom 
            and epic tales to contemporary readers.
          </p>

          <h2>My Published Works</h2>
          <p>
            I am the author of <strong>Waves of Kashi</strong> and <strong>Ashwathama's Last Vow</strong>, two novels 
            that delve into the profound depths of Indian mythology. Through these stories, I seek to illuminate the 
            eternal truths embedded in our ancient texts while making them accessible and relevant to modern audiences.
          </p>

          <h2>My Approach</h2>
          <p>
            My writing bridges the gap between the mythological past and the present, exploring themes of duty, honor, 
            redemption, and the human condition through the lens of India's greatest epics. I believe that these ancient 
            stories hold profound wisdom that continues to resonate across generations.
          </p>

          <h2>Connect With My Work</h2>
          <p>
            Through this platform, I share my research, storytelling, and poetry—each piece a reflection of my ongoing 
            journey through the landscapes of Indian mythology and literature. I invite you to explore these works and 
            join me in discovering the timeless wisdom of our cultural heritage.
          </p>
        </Prose>
      </div>
    </div>
  );
}
