"use client";

import { CardStack, CardStackItem } from "./card-stack";

const items: CardStackItem[] = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    description:
      "Return to Pandora with cutting-edge 3D laser projection and Dolby Atmos sound.",
    imageSrc:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1000&auto=format&fit=crop&q=80",
    href: "/movies/1",
    tag: "NOW SHOWING",
  },
  {
    id: 2,
    title: "Dune: Part Two",
    description:
      "Paul Atreides unites with Chani and the Fremen while seeking revenge.",
    imageSrc:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1000&auto=format&fit=crop&q=80",
    href: "/movies/2",
    tag: "IMAX 270°",
  },
  {
    id: 3,
    title: "Deadpool & Wolverine",
    description:
      "The ultimate superhero blockbuster with unmatched humor and action.",
    imageSrc:
      "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=1000&auto=format&fit=crop&q=80",
    href: "/movies/3",
    tag: "BLOCKBUSTER",
  },
  {
    id: 4,
    title: "Spider-Man: Beyond the Spider-Verse",
    description:
      "Miles Morales journeys through dimensions in stunning visual art.",
    imageSrc:
      "https://images.unsplash.com/photo-1574267432553-4b4628081c31?w=1000&auto=format&fit=crop&q=80",
    href: "/movies/4",
    tag: "FAN FAVORITE",
  },
  {
    id: 5,
    title: "Interstellar 10th Anniversary",
    description: "Mankind was born on Earth. It was never meant to die here.",
    imageSrc:
      "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=1000&auto=format&fit=crop&q=80",
    href: "/movies/5",
    tag: "SPECIAL SCREENING",
  },
];

export default function CardStackDemoPage() {
  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-5xl p-8">
        <CardStack
          items={items}
          initialIndex={0}
          autoAdvance
          intervalMs={2800}
          pauseOnHover
          showDots
        />
      </div>
    </div>
  );
}
