import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Feather, FlaskConical } from 'lucide-react';

export default function HomePage() {
  const sections = [
    {
      title: 'Research',
      description: 'Explore in-depth research works and academic writings',
      icon: FlaskConical,
      path: '/research',
    },
    {
      title: 'Storytelling',
      description: 'Discover narratives and creative prose',
      icon: BookOpen,
      path: '/storytelling',
    },
    {
      title: 'Poetry',
      description: 'Experience verse and poetic expressions',
      icon: Feather,
      path: '/poetry',
    },
  ];

  return (
    <div className="relative">
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat opacity-10"
        style={{ backgroundImage: 'url(/assets/generated/veridoxa-hero-bg.dim_1920x1080.png)' }}
      />

      <section className="container py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-serif text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            veridoxa
          </h1>
          <p className="mt-6 text-xl text-muted-foreground">
            A collection of research, storytelling, and poetry
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.path} className="transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="font-serif text-2xl">{section.title}</CardTitle>
                  <CardDescription className="mt-2">{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <Link to={section.path}>Explore {section.title}</Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
