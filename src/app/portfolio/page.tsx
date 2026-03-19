import { buildMetadata } from "@/lib/metadata";
import Portfolio from "@/views/Portfolio";

export const metadata = buildMetadata({
  title: "Portfolio & Case Studies",
  description: "Explore our portfolio of successful website development and digital marketing projects. See how we've helped businesses in Nairobi and across Kenya transform their digital presence.",
  url: "/portfolio",
});

export default function Page() {
  return <Portfolio />;
}
